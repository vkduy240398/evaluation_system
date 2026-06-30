/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Inject,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { MailSettingRepository } from 'src/repository/mailSetting.repository';
import { HistoryCronJobRepository } from 'src/repository/historyCronjob.repository';
import { EvaluationPeriodRepository } from 'src/repository/evaluationPeriod.repository';
import { UserRepository } from 'src/repository/user.repository';
import { MailService } from './mail.service';
import { CustomLogger } from './logger.service';
import { CompanyGroupService } from './companyGroup.service';
import { isFormatDate } from 'src/common/util';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const createSubscriber = require('pg-listen');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const momentTz = require('moment-timezone');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Pool } = require('pg');

/** Mail types handled by this service (scheduled via send_time_setting) */
export const PG_LISTENER_MAIL_TYPES = [7, 8, 25, 26, 27, 28] as const;
export type PgListenerMailType = (typeof PG_LISTENER_MAIL_TYPES)[number];

export interface HistoryMailNotifyPayload {
  id: number;
  type: PgListenerMailType;
  send_time_setting: string;
  company_group_code: string;
  cronjob_id: number | null;
  status: number;
}

export interface ExecuteMailPayload {
  id: number;
  type: PgListenerMailType;
  company_group_code: string;
  timezone: string;
}

@Injectable()
export class PgListenerService implements OnModuleInit, OnModuleDestroy {
  private subscriber: any;
  /** pg.Pool for running cron.schedule / cron.unschedule — auto-reconnects */
  pgClient: any;

  constructor(
    private readonly logger: CustomLogger,
    @Inject(MailSettingRepository)
    private readonly mailSettingRepository: MailSettingRepository,
    @Inject(HistoryCronJobRepository)
    private readonly historyCronJobRepository: HistoryCronJobRepository,
    @Inject(EvaluationPeriodRepository)
    private readonly evaluationPeriodRepo: EvaluationPeriodRepository,
    @Inject(UserRepository) private readonly userRepo: UserRepository,
    @Inject(MailService) private readonly mailService: MailService,
    @Inject(CompanyGroupService)
    private readonly companyGroupService: CompanyGroupService,
  ) {}

  // ─────────────────────────────────────────────────────────────────────────────
  // Lifecycle
  // ─────────────────────────────────────────────────────────────────────────────

  async onModuleInit() {
    try {
      await this.connectAndListen();
      await this.rescheduleExistingPendingMails();
    } catch (error) {
      this.logger.error(null, `[PgListenerService] init error: ${error}`);
    }
  }

  async onModuleDestroy() {
    if (this.subscriber) {
      await this.subscriber.close().catch(() => {});
    }
    if (this.pgClient) {
      await this.pgClient.end().catch(() => {});
    }
    this.logger.log(null, `[PgListenerService] connections closed`);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Connect pg-listen + pg client
  // ─────────────────────────────────────────────────────────────────────────────

  private async connectAndListen() {
    const connectionString =
      process.env.DB_URI ||
      `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

    // ── pg-listen: nhận NOTIFY từ trigger và từ pg_cron ─────────────────────
    this.subscriber = createSubscriber(
      {
        connectionString,
        ssl: { rejectUnauthorized: false },
      },
      { retryInterval: 5000, retryLimit: Infinity },
    );

    // Channel 1: trigger gửi khi INSERT/UPDATE history_mail_tbl
    this.subscriber.notifications.on(
      'history_mail_changes',
      (payload: HistoryMailNotifyPayload) => {
        this.logger.log(
          null,
          `[PgListenerService] NOTIFY history_mail_changes: ${JSON.stringify(payload)}`,
        );
        this.handleHistoryMailNotification(payload).catch((err) =>
          this.logger.error(
            null,
            `[PgListenerService] handleHistoryMailNotification error: ${err}`,
          ),
        );
      },
    );

    // Channel 2: pg_cron gửi khi đến đúng giờ scheduled
    this.subscriber.notifications.on(
      'execute_mail_now',
      (payload: ExecuteMailPayload) => {
        this.logger.log(
          null,
          `[PgListenerService] NOTIFY execute_mail_now: ${JSON.stringify(payload)}`,
        );
        this.handleExecuteMailNow(payload).catch((err) =>
          this.logger.error(
            null,
            `[PgListenerService] handleExecuteMailNow error: ${err}`,
          ),
        );
      },
    );

    this.subscriber.events.on('error', (error: Error) => {
      this.logger.error(
        null,
        `[PgListenerService] pg-listen error: ${error.message}`,
      );
    });

    this.subscriber.events.on('reconnect', (attempt: number) => {
      this.logger.log(
        null,
        `[PgListenerService] pg-listen reconnecting, attempt ${attempt}`,
      );
    });

    await this.subscriber.connect();
    await this.subscriber.listenTo('history_mail_changes');
    await this.subscriber.listenTo('execute_mail_now');
    this.logger.log(
      null,
      `[PgListenerService] Listening on: history_mail_changes, execute_mail_now`,
    );

    // ── pg Pool: dùng để chạy cron.schedule / cron.unschedule ───────────────
    // Pool tự động reconnect khi mất kết nối, an toàn hơn Client đơn
    this.pgClient = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 2,
    });
    this.logger.log(null, `[PgListenerService] pg Pool initialized`);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Khởi động: tạo lại pg_cron jobs cho các mail chưa được gửi
  // ─────────────────────────────────────────────────────────────────────────────

  private async rescheduleExistingPendingMails() {
    const pendingMails =
      await this.mailSettingRepository.findPendingMailsByTypes([
        ...PG_LISTENER_MAIL_TYPES,
      ]);

    let count = 0;

    for (const mail of pendingMails) {
      if (!mail.sendTimeSetting || !mail.sendTimeSetting.includes(' ')) {
        continue;
      }

      // Luôn gọi scheduleMail — không check pgCronJobExists vì:
      // Nếu server down khi pg_cron fire: job vẫn còn trong cron.job nhưng
      // mail chưa được gửi → phải reschedule. scheduleMail sẽ tự:
      //   - Nếu giờ đã qua  → gửi ngay lập tức
      //   - Nếu giờ chưa đến → pgCronUnschedule job cũ + tạo job mới
      await this.scheduleMail(
        mail.id,
        mail.type as PgListenerMailType,
        mail.sendTimeSetting,
        mail.companyGroupCode,
      );
      count++;
    }

    this.logger.log(
      null,
      `[PgListenerService] startup: processed ${count} pending mail(s)`,
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Handler: nhận NOTIFY từ trigger (INSERT/UPDATE history_mail_tbl)
  // ─────────────────────────────────────────────────────────────────────────────

  private async handleHistoryMailNotification(
    payload: HistoryMailNotifyPayload,
  ) {
    const { id, type, send_time_setting, company_group_code, status } = payload;

    if (status !== 0) return;
    if (!(PG_LISTENER_MAIL_TYPES as readonly number[]).includes(type)) return;

    await this.scheduleMail(id, type, send_time_setting, company_group_code);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Tạo pg_cron job cho đúng ngày/giờ của send_time_setting
  // ─────────────────────────────────────────────────────────────────────────────

  async scheduleMail(
    mailId: number,
    type: PgListenerMailType,
    sendTimeStr: string,
    companyGroupCode: string,
  ) {
    if (!sendTimeStr) {
      this.logger.log(
        null,
        `[PgListenerService] mail ${mailId}: no send_time_setting, skipping`,
      );
      return;
    }

    // Bỏ qua dạng chỉ có ngày (vd: "2026/7/1") — do legacy cron xử lý
    if (!sendTimeStr.includes(' ')) {
      this.logger.log(
        null,
        `[PgListenerService] mail ${mailId}: date-only "${sendTimeStr}", skipping (legacy cron)`,
      );
      return;
    }

    const companyGroup =
      await this.companyGroupService.getCompanyByCode(companyGroupCode);
    // COALESCE: tương tự SQL COALESCE(timezone, 'Asia/Tokyo')
    const timezone = companyGroup?.timezone || 'Asia/Tokyo';

    // Parse send_time_setting theo timezone của company
    // send_time_setting được lưu từ browser (giờ địa phương của user)
    const sendMoment = momentTz.tz(
      sendTimeStr,
      ['YYYY/MM/DD HH:mm', 'YYYY/M/D HH:mm'],
      timezone,
    );

    if (!sendMoment.isValid()) {
      this.logger.error(
        null,
        `[PgListenerService] mail ${mailId}: invalid sendTimeSetting "${sendTimeStr}"`,
      );
      return;
    }

    const delayMs = sendMoment.valueOf() - Date.now();

    this.logger.log(
      null,
      `[PgListenerService] mail ${mailId} scheduleMail: sendTimeStr="${sendTimeStr}" timezone="${timezone}" → UTC=${sendMoment.utc().toISOString()} delayMs=${delayMs}`,
    );

    // Nếu thời gian đã qua → gửi ngay
    if (delayMs <= 0) {
      this.logger.log(
        null,
        `[PgListenerService] mail ${mailId} type=${type}: time already passed (${sendTimeStr} ${timezone} = ${sendMoment.utc().toISOString()} UTC), sending immediately`,
      );
      await this.executeSendMail(mailId, type, companyGroupCode, timezone);
      return;
    }

    // Chuyển sang UTC để tạo cron expression
    // Cron expression: "phút giờ ngày tháng *" theo UTC
    const utcMoment = sendMoment.utc();
    const cronExpr = `${utcMoment.minutes()} ${utcMoment.hours()} ${utcMoment.date()} ${utcMoment.month() + 1} *`;
    const jobName = `mail_${mailId}`;

    // Payload gửi qua pg_notify khi pg_cron fires
    const execPayload: ExecuteMailPayload = {
      id: mailId,
      type,
      company_group_code: companyGroupCode,
      timezone,
    };
    // Dùng $msg$...$msg$ dollar-quoting để tránh vấn đề escape
    const notifySQL = `SELECT pg_notify('execute_mail_now', $msg$${JSON.stringify(execPayload)}$msg$)`;

    try {
      // Hủy job cũ nếu đã tồn tại (idempotent)
      await this.pgCronUnschedule(jobName);

      // Tạo pg_cron job cho đúng ngày/giờ
      await this.pgClient.query(`SELECT cron.schedule($1, $2, $3)`, [
        jobName,
        cronExpr,
        notifySQL,
      ]);

      this.logger.log(
        null,
        `[PgListenerService] mail ${mailId} type=${type}: pg_cron "${jobName}" → "${cronExpr}" UTC (= ${sendTimeStr} ${timezone}, UTC: ${utcMoment.toISOString()})`,
      );
    } catch (error) {
      this.logger.error(
        null,
        `[PgListenerService] Failed to create pg_cron for mail ${mailId}: ${error.message}`,
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Handler: pg_cron fires → gửi mail và hủy job
  // ─────────────────────────────────────────────────────────────────────────────

  private async handleExecuteMailNow(payload: ExecuteMailPayload) {
    const { id, type, company_group_code, timezone } = payload;

    if (!id || !type) {
      this.logger.error(
        null,
        `[PgListenerService] execute_mail_now: invalid payload ${JSON.stringify(payload)}`,
      );
      return;
    }

    const jobName = `mail_${id}`;

    // Hủy pg_cron job ngay lập tức (job là one-shot, tránh fire lại năm sau)
    await this.pgCronUnschedule(jobName);

    await this.executeSendMail(
      id,
      type,
      company_group_code,
      timezone || 'Asia/Tokyo',
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Execute gửi mail theo type
  // ─────────────────────────────────────────────────────────────────────────────

  async executeSendMail(
    mailId: number,
    type: PgListenerMailType,
    companyGroupCode: string,
    timezone: string,
  ) {
    // Re-check status để tránh gửi trùng
    const historyMail = await this.mailSettingRepository.findOne({
      id: mailId,
      status: 0,
    });
    if (!historyMail) {
      this.logger.log(
        null,
        `[PgListenerService] mail ${mailId}: already processed or not found`,
      );
      return;
    }

    try {
      if ([7, 25].includes(type)) {
        await this.sendGoalCreationMail(historyMail, companyGroupCode);
      } else if ([8, 26].includes(type)) {
        await this.sendEvaluationMail(historyMail, companyGroupCode);
      } else if ([27, 28].includes(type)) {
        await this.sendExceptionMail(historyMail, companyGroupCode);
      }
    } catch (error) {
      this.logger.error(
        null,
        `[PgListenerService] error sending mail id=${mailId} type=${type}: ${error}`,
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Handler: Type 7 & 25 — Goal Creation Mail
  // ─────────────────────────────────────────────────────────────────────────────

  async sendGoalCreationMail(historyMail: any, companyGroupCode: string) {
    const { id, evaluationPeriodId, cronjobId, mailTo, title, contentMail } =
      historyMail;

    const periods =
      await this.evaluationPeriodRepo.getPeriodListSendMailDepartment({
        id: evaluationPeriodId,
      });

    if (!periods) {
      this.logger.log(
        null,
        `[PgListenerService] mail ${id}: evaluationPeriod not found (id=${evaluationPeriodId})`,
      );
      return;
    }

    for (const rawEmail of mailTo.split(',')) {
      const email = rawEmail.trim();
      if (!email) continue;

      let toUserText = '';
      const username = await this.userRepo.getUserNameFromEmail(
        email,
        companyGroupCode,
      );
      if (username) {
        const firstName = username.fullName.split(' ')[0];
        const suffix = username.fullName.split(' ').length > 1 ? 'さん' : '';
        toUserText = `${firstName}${suffix}<br><br>`;
      }

      await this.mailService.sendMailCustoms(
        [email],
        [],
        title,
        `${toUserText}${contentMail}`,
      );
    }

    if (cronjobId) {
      await this.historyCronJobRepository.deleteHistory(
        { id: cronjobId },
        null,
      );
    }

    await this.mailSettingRepository.updateMailHistory(
      { status: 1, sendTimeActual: isFormatDate(new Date(), 'YYYY/M/D H:mm') },
      id,
    );

    this.logger.log(
      null,
      `[PgListenerService] Goal creation mail sent: id=${id} to="${mailTo}"`,
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Handler: Type 8 & 26 — Evaluation Mail
  // ─────────────────────────────────────────────────────────────────────────────

  async sendEvaluationMail(historyMail: any, companyGroupCode: string) {
    const { id, evaluationPeriodId, cronjobId, mailTo, title, contentMail } =
      historyMail;

    const periods =
      await this.evaluationPeriodRepo.getPeriodListSendMailDepartment({
        id: evaluationPeriodId,
      });

    if (!periods) {
      this.logger.log(
        null,
        `[PgListenerService] mail ${id}: evaluationPeriod not found (id=${evaluationPeriodId})`,
      );
      return;
    }

    for (const rawEmail of mailTo.split(',')) {
      const email = rawEmail.trim();
      if (!email) continue;

      let toUserText = '';
      const username = await this.userRepo.getUserNameFromEmail(
        email,
        companyGroupCode,
      );

      if (username) {
        const firstName = username.fullName.split(' ')[0];
        const suffix = username.fullName.split(' ').length > 1 ? 'さん' : '';
        toUserText = `${firstName}${suffix}<br><br>`;

        const conditionCountException = {
          userId: username.id,
          evaluationPeriodId,
          creationUser: { [Op.ne]: null },
          dateEvaluationStart: { [Op.ne]: null },
          dateEvaluationEnd: { [Op.ne]: null },
        };
        const countException = await this.userRepo.countEvaluationException(
          conditionCountException,
        );

        if (countException > 0) {
          const condition17 = {
            userId: username.id,
            evaluationPeriodId,
            creationUser: { [Op.ne]: null },
            dateEvaluationStart: periods.dateEvaluationStart,
            dateEvaluationEnd: periods.dateEvaluationEnd,
            level: { [Op.lte]: 7 },
          };
          const exception17 = await this.userRepo.countEvaluationException(
            condition17,
          );

          const condition810 = {
            userId: username.id,
            evaluationPeriodId,
            creationUser: { [Op.ne]: null },
            dateEvaluationStart: periods.dateEvaluationDepartmentStart,
            dateEvaluationEnd: periods.dateEvaluationDepartmentEnd,
            level: { [Op.gte]: 8 },
          };
          const exception810 = await this.userRepo.countEvaluationException(
            condition810,
          );

          if (!exception17 && !exception810) continue;
        }
      }

      await this.mailService.sendMailCustoms(
        [email],
        [],
        title,
        `${toUserText}${contentMail}`,
      );
    }

    if (cronjobId) {
      await this.historyCronJobRepository.deleteHistory(
        { id: cronjobId },
        null,
      );
    }

    await this.mailSettingRepository.updateMailHistory(
      { status: 1, sendTimeActual: isFormatDate(new Date(), 'YYYY/M/D H:mm') },
      id,
    );

    this.logger.log(
      null,
      `[PgListenerService] Evaluation mail sent: id=${id} to="${mailTo}"`,
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Handler: Type 27 & 28 — Exception Mail
  // ─────────────────────────────────────────────────────────────────────────────

  async sendExceptionMail(historyMail: any, companyGroupCode: string) {
    const { id, mailTo, mailCC, title, contentMail } = historyMail;

    let infoEmail = contentMail;

    const toUser = await this.userRepo.getUserNameFromEmail(
      mailTo?.trim(),
      companyGroupCode,
    );
    const toUserName = toUser
      ? `${toUser.fullName.split(' ')[0]}${
          toUser.fullName.split(' ').length > 1 ? 'さん' : ''
        }`
      : '';
    infoEmail = infoEmail.replace(/{{toUser}}/gi, toUserName);

    const ccEmails: string[] = [];
    if (mailCC) {
      const listNameCCs: string[] = [];

      for (const rawEmail of mailCC.split(',')) {
        const email = rawEmail.trim();
        if (!email) continue;

        ccEmails.push(email);
        const nameCC = await this.userRepo.getUserByEmail(
          email,
          companyGroupCode,
        );
        if (nameCC) {
          listNameCCs.push(nameCC.fullName);
        }
      }

      const ccText = listNameCCs
        .map(
          (name) =>
            `${name.split(' ')[0]}${name.split(' ').length > 1 ? 'さん' : ''}`,
        )
        .join('、');
      infoEmail = infoEmail.replace(/{{ccEvaluator}}/gi, ccText);
    } else {
      infoEmail = infoEmail.replace(/{{ccEvaluator}}/gi, '');
    }

    await this.mailService.sendMailCustoms(
      [mailTo?.trim()],
      ccEmails,
      title,
      infoEmail,
    );

    await this.mailSettingRepository.updateMailHistory(
      {
        status: 1,
        sendTimeActual: isFormatDate(new Date(), 'YYYY/M/D H:mm'),
        contentMail: infoEmail,
      },
      id,
    );

    this.logger.log(
      null,
      `[PgListenerService] Exception mail type=${historyMail.type} sent: id=${id} to="${mailTo}"`,
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // pg_cron helpers
  // ─────────────────────────────────────────────────────────────────────────────

  /** Kiểm tra pg_cron job có đang tồn tại không */
  async pgCronJobExists(jobName: string): Promise<boolean> {
    try {
      const result = await this.pgClient.query(
        `SELECT jobid FROM cron.job WHERE jobname = $1`,
        [jobName],
      );
      return result.rows.length > 0;
    } catch {
      // pg_cron extension chưa được cài → không thể check
      return false;
    }
  }

  /** Hủy pg_cron job theo tên (an toàn nếu không tồn tại) */
  async pgCronUnschedule(jobName: string): Promise<void> {
    try {
      await this.pgClient.query(
        `SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname = $1`,
        [jobName],
      );
    } catch {
      // Bỏ qua nếu job không tồn tại hoặc pg_cron chưa cài
    }
  }

  /** Lấy danh sách mail IDs đang có pg_cron job scheduled */
  async getScheduledJobIds(): Promise<number[]> {
    try {
      const result = await this.pgClient.query(
        `SELECT jobname FROM cron.job WHERE jobname LIKE 'mail_%'`,
      );
      return result.rows
        .map((row: any) => parseInt(row.jobname.replace('mail_', ''), 10))
        .filter((id: number) => !isNaN(id));
    } catch {
      return [];
    }
  }
}
