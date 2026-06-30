/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
/**
 * ============================================================
 * PgListenerService — Giải thích tổng quan flow
 * ============================================================
 *
 * Service này có nhiệm vụ GỬI MAIL ĐÚNG GIỜ dựa trên cấu hình
 * `send_time_setting` trong DB. Flow chính gồm 2 luồng:
 *
 * LUỒNG A — Khi có bản ghi mail MỚI hoặc CẬP NHẬT trong DB:
 *   [Postgres trigger]
 *       └─► NOTIFY 'history_mail_changes' (channel 1)
 *               └─► handleHistoryMailNotification()
 *                       └─► scheduleMail()
 *                               ├─ Nếu giờ đã qua  → executeSendMail() ngay
 *                               └─ Nếu giờ chưa đến → tạo pg_cron job (one-shot)
 *
 * LUỒNG B — Khi đến đúng giờ đã schedule:
 *   [pg_cron fires]
 *       └─► NOTIFY 'execute_mail_now' (channel 2)
 *               └─► handleExecuteMailNow()
 *                       ├─ Hủy pg_cron job (tránh fire lại)
 *                       └─► executeSendMail()
 *                               ├─ type 7,25  → sendGoalCreationMail()
 *                               ├─ type 8,26  → sendEvaluationMail()
 *                               └─ type 27,28 → sendExceptionMail()
 *
 * KHỞI ĐỘNG (onModuleInit):
 *   1. Kết nối pg-listen + pg Pool
 *   2. Đăng ký lắng nghe 2 channel trên
 *   3. rescheduleExistingPendingMails() — phục hồi các mail chưa gửi
 *      khi server restart
 * ============================================================
 */
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

/**
 * Danh sách type mail được xử lý bởi PgListenerService.
 * Các type này đều có trường send_time_setting (ngày giờ cụ thể).
 *
 *  7  — Goal Creation (gửi ngay theo schedule)
 *  8  — Evaluation Mail (gửi ngay theo schedule)
 * 25  — Goal Creation (dạng department)
 * 26  — Evaluation Mail (dạng department)
 * 27  — Exception Mail (người đánh giá ngoại lệ)
 * 28  — Exception Mail (biến thể)
 */
export const PG_LISTENER_MAIL_TYPES = [7, 8, 25, 26, 27, 28] as const;
export type PgListenerMailType = (typeof PG_LISTENER_MAIL_TYPES)[number];

/**
 * Payload nhận được từ Postgres NOTIFY channel 'history_mail_changes'.
 * Được gửi bởi trigger trên bảng history_mail_tbl khi INSERT hoặc UPDATE.
 */
export interface HistoryMailNotifyPayload {
  id: number;                        // ID bản ghi trong history_mail_tbl
  type: PgListenerMailType;          // Loại mail (7,8,25,26,27,28)
  send_time_setting: string;         // Ngày giờ gửi mail (vd: "2026/7/1 09:00")
  company_group_code: string;        // Mã công ty
  cronjob_id: number | null;         // ID cronjob liên kết (nếu có)
  status: number;                    // 0 = chưa gửi, 1 = đã gửi
}

/**
 * Payload gửi vào channel 'execute_mail_now' khi pg_cron fires.
 * Được tạo bởi scheduleMail() và pg_cron gọi pg_notify với payload này.
 */
export interface ExecuteMailPayload {
  id: number;                        // ID bản ghi mail cần gửi
  type: PgListenerMailType;          // Loại mail
  company_group_code: string;        // Mã công ty
  timezone: string;                  // Timezone của company (vd: "Asia/Tokyo")
}

@Injectable()
export class PgListenerService implements OnModuleInit, OnModuleDestroy {
  /** pg-listen subscriber — duy trì kết nối persistent để nhận NOTIFY từ Postgres */
  private subscriber: any;
  /** pg.Pool — dùng để chạy các lệnh cron.schedule / cron.unschedule, tự reconnect */
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
  // LIFECYCLE — NestJS gọi tự động khi module khởi động / tắt
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Được NestJS gọi TỰ ĐỘNG khi module khởi động.
   *
   * Bước 1: connectAndListen()
   *   - Tạo kết nối pg-listen để nhận NOTIFY từ Postgres
   *   - Đăng ký lắng nghe 2 channel: 'history_mail_changes' và 'execute_mail_now'
   *   - Tạo pg Pool để thực thi lệnh pg_cron
   *
   * Bước 2: rescheduleExistingPendingMails()
   *   - Tìm tất cả mail có status=0 (chưa gửi) trong DB
   *   - Tạo lại pg_cron jobs cho các mail này (phòng trường hợp server bị restart)
   */
  async onModuleInit() {
    try {
      await this.connectAndListen();
      await this.rescheduleExistingPendingMails();
    } catch (error) {
      this.logger.error(null, `[PgListenerService] init error: ${error}`);
    }
  }

  /**
   * Được NestJS gọi TỰ ĐỘNG khi module bị tắt (graceful shutdown).
   * Đóng cả 2 kết nối để tránh leak connection.
   */
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
  // BƯỚC 1: Kết nối Postgres và đăng ký lắng nghe các channel NOTIFY
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Thiết lập 2 kết nối tới Postgres:
   *
   * [Kết nối 1] pg-listen (subscriber)
   *   - Duy trì kết nối persistent, nhận NOTIFY theo thời gian thực
   *   - Tự động reconnect mỗi 5 giây nếu mất kết nối (retryLimit: Infinity)
   *   - Lắng nghe 2 channel:
   *       • 'history_mail_changes' — trigger gửi khi có bản ghi mail mới/cập nhật
   *       • 'execute_mail_now'     — pg_cron gửi khi đến giờ gửi mail
   *
   * [Kết nối 2] pg Pool (pgClient)
   *   - Dùng để gọi cron.schedule() và cron.unschedule() trên extension pg_cron
   *   - Pool có max=2 connection, tự quản lý việc reconnect
   */
  private async connectAndListen() {
    // Ưu tiên biến môi trường DB_URI, fallback sang ghép từ các biến riêng lẻ
    const connectionString =
      process.env.DB_URI ||
      `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

    // ── [Kết nối 1] pg-listen: nhận NOTIFY từ trigger và từ pg_cron ──────────
    this.subscriber = createSubscriber(
      {
        connectionString,
        ssl: { rejectUnauthorized: false },
      },
      { retryInterval: 5000, retryLimit: Infinity }, // tự động reconnect mãi mãi
    );

    // ── Đăng ký handler cho channel 'history_mail_changes' ───────────────────
    // Trigger trên bảng history_mail_tbl sẽ gửi NOTIFY vào channel này
    // khi có bản ghi mail mới (INSERT) hoặc thay đổi send_time_setting (UPDATE)
    this.subscriber.notifications.on(
      'history_mail_changes',
      (payload: HistoryMailNotifyPayload) => {
        this.logger.log(
          null,
          `[PgListenerService] NOTIFY history_mail_changes: ${JSON.stringify(payload)}`,
        );
        // Xử lý bất đồng bộ, không block event loop
        this.handleHistoryMailNotification(payload).catch((err) =>
          this.logger.error(
            null,
            `[PgListenerService] handleHistoryMailNotification error: ${err}`,
          ),
        );
      },
    );

    // ── Đăng ký handler cho channel 'execute_mail_now' ───────────────────────
    // pg_cron sẽ chạy SELECT pg_notify('execute_mail_now', ...) đúng vào giờ đã đặt
    // → NestJS nhận và gọi handleExecuteMailNow() để thực hiện gửi mail
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

    // ── Log khi có lỗi hoặc reconnect ────────────────────────────────────────
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

    // ── Thực sự kết nối và bắt đầu lắng nghe 2 channel ──────────────────────
    await this.subscriber.connect();
    await this.subscriber.listenTo('history_mail_changes');
    await this.subscriber.listenTo('execute_mail_now');
    this.logger.log(
      null,
      `[PgListenerService] Listening on: history_mail_changes, execute_mail_now`,
    );

    // ── [Kết nối 2] pg Pool: dùng để chạy cron.schedule / cron.unschedule ────
    // Dùng Pool thay vì Client đơn lẻ vì Pool tự động xử lý reconnect
    this.pgClient = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 2, // tối đa 2 connection trong pool, đủ dùng cho các lệnh pg_cron
    });
    this.logger.log(null, `[PgListenerService] pg Pool initialized`);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // BƯỚC 2 (Khởi động): Phục hồi pg_cron jobs cho mail chưa gửi khi server restart
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Khi server restart, tất cả pg_cron jobs có thể vẫn còn trong DB,
   * nhưng NestJS không biết mail nào đã được schedule hay chưa.
   *
   * Hàm này:
   *  1. Query tất cả mail có status=0 (chưa gửi) và type thuộc PG_LISTENER_MAIL_TYPES
   *  2. Với mỗi mail, gọi scheduleMail() — hàm này sẽ tự xử lý:
   *     - Nếu giờ đã qua → gửi mail ngay
   *     - Nếu giờ chưa đến → hủy job cũ (nếu có) và tạo job mới
   *
   * Lý do KHÔNG check pgCronJobExists trước:
   *   Nếu server down đúng lúc pg_cron vừa fire (giờ đã qua nhưng mail chưa gửi),
   *   job vẫn còn trong cron.job nhưng mail chưa được xử lý.
   *   scheduleMail() sẽ detect delayMs <= 0 và gửi ngay lập tức.
   */
  private async rescheduleExistingPendingMails() {
    // Lấy tất cả mail chưa gửi của các type do service này quản lý
    const pendingMails =
      await this.mailSettingRepository.findPendingMailsByTypes([
        ...PG_LISTENER_MAIL_TYPES,
      ]);

    let count = 0;

    for (const mail of pendingMails) {
      // Bỏ qua mail không có send_time_setting hoặc chỉ có ngày (không có giờ)
      // Dạng chỉ có ngày (vd: "2026/7/1") được xử lý bởi legacy cron riêng
      if (!mail.sendTimeSetting || !mail.sendTimeSetting.includes(' ')) {
        continue;
      }

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
  // LUỒNG A — Handler nhận NOTIFY từ trigger 'history_mail_changes'
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Được gọi khi Postgres trigger phát hiện có bản ghi mail mới/cập nhật.
   *
   * Điều kiện để tiếp tục xử lý:
   *  - status === 0 (chưa gửi) — tránh schedule lại mail đã gửi rồi
   *  - type phải nằm trong PG_LISTENER_MAIL_TYPES — chỉ xử lý đúng loại
   *
   * Nếu hợp lệ → gọi scheduleMail() để đặt lịch gửi
   */
  private async handleHistoryMailNotification(
    payload: HistoryMailNotifyPayload,
  ) {
    const { id, type, send_time_setting, company_group_code, status } = payload;

    // Bỏ qua nếu mail đã được gửi (status != 0)
    if (status !== 0) return;

    // Bỏ qua nếu type không thuộc danh sách service này quản lý
    if (!(PG_LISTENER_MAIL_TYPES as readonly number[]).includes(type)) return;

    await this.scheduleMail(id, type, send_time_setting, company_group_code);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Lõi lập lịch: tạo pg_cron job hoặc gửi ngay nếu giờ đã qua
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Nhận thông tin mail và quyết định:
   *   A) Gửi ngay nếu send_time_setting đã qua
   *   B) Tạo pg_cron job one-shot để gửi đúng giờ
   *
   * Các bước xử lý:
   *  1. Validate send_time_setting (phải có cả ngày và giờ)
   *  2. Lấy timezone của company (fallback: Asia/Tokyo)
   *  3. Parse send_time_setting theo timezone đó
   *  4. Tính delayMs = thời gian còn lại cho đến giờ gửi
   *  5a. delayMs <= 0 → gọi executeSendMail() ngay lập tức
   *  5b. delayMs > 0  → tạo pg_cron job với cron expression theo UTC
   *
   * Cron expression được tạo theo UTC vì pg_cron chạy trên server Postgres,
   * không biết về timezone của ứng dụng.
   * Ví dụ: "2026/7/1 09:00" theo Asia/Tokyo → "0 0 1 7 *" theo UTC
   */
  async scheduleMail(
    mailId: number,
    type: PgListenerMailType,
    sendTimeStr: string,
    companyGroupCode: string,
  ) {
    // Bước 1: validate — bỏ qua nếu không có send_time_setting
    if (!sendTimeStr) {
      this.logger.log(
        null,
        `[PgListenerService] mail ${mailId}: no send_time_setting, skipping`,
      );
      return;
    }

    // Bỏ qua dạng chỉ có ngày (vd: "2026/7/1") — legacy cron xử lý riêng
    if (!sendTimeStr.includes(' ')) {
      this.logger.log(
        null,
        `[PgListenerService] mail ${mailId}: date-only "${sendTimeStr}", skipping (legacy cron)`,
      );
      return;
    }

    // Bước 2: lấy timezone của company để parse đúng giờ địa phương
    // Nếu company không có timezone → dùng Asia/Tokyo làm mặc định
    const companyGroup =
      await this.companyGroupService.getCompanyByCode(companyGroupCode);
    const timezone = companyGroup?.timezone || 'Asia/Tokyo';

    // Bước 3: parse send_time_setting theo timezone của company
    // send_time_setting được nhập từ browser của user (giờ địa phương)
    // nên phải parse theo đúng timezone đó
    const sendMoment = momentTz.tz(
      sendTimeStr,
      ['YYYY/MM/DD HH:mm', 'YYYY/M/D HH:mm'], // hỗ trợ 2 format ngày
      timezone,
    );

    if (!sendMoment.isValid()) {
      this.logger.error(
        null,
        `[PgListenerService] mail ${mailId}: invalid sendTimeSetting "${sendTimeStr}"`,
      );
      return;
    }

    // Bước 4: tính thời gian còn lại (ms) so với thời điểm hiện tại
    const delayMs = sendMoment.valueOf() - Date.now();

    this.logger.log(
      null,
      `[PgListenerService] mail ${mailId} scheduleMail: sendTimeStr="${sendTimeStr}" timezone="${timezone}" → UTC=${sendMoment.utc().toISOString()} delayMs=${delayMs}`,
    );
    console.log( `[PgListenerService] mail ${mailId} scheduleMail: sendTimeStr="${sendTimeStr}" timezone="${timezone}" → UTC=${sendMoment.utc().toISOString()} delayMs=${delayMs}`,);

    // Bước 5a: nếu giờ gửi đã qua → gửi ngay không cần chờ
    // Trường hợp này xảy ra khi: server vừa restart và mail đã đến giờ rồi
    if (delayMs <= 0) {
      this.logger.log(
        null,
        `[PgListenerService] mail ${mailId} type=${type}: time already passed (${sendTimeStr} ${timezone} = ${sendMoment.utc().toISOString()} UTC), sending immediately`,
      );
      await this.executeSendMail(mailId, type, companyGroupCode, timezone);
      return;
    }

    // Bước 5b: giờ chưa đến → tạo pg_cron job one-shot
    // Chuyển sang UTC để tạo cron expression (pg_cron chạy theo UTC)
    // Format: "phút giờ ngày tháng *" (không lặp hàng năm nên để *)
    const utcMoment = sendMoment.utc();
    const cronExpr = `${utcMoment.minutes()} ${utcMoment.hours()} ${utcMoment.date()} ${utcMoment.month() + 1} *`;

    // Tên job theo convention "mail_{id}" — duy nhất cho mỗi bản ghi mail
    const jobName = `mail_${mailId}`;

    // Payload sẽ được gửi qua pg_notify khi pg_cron fires đúng giờ
    const execPayload: ExecuteMailPayload = {
      id: mailId,
      type,
      company_group_code: companyGroupCode,
      timezone,
    };

    // Dùng dollar-quoting $msg$...$msg$ để tránh lỗi escape ký tự đặc biệt trong JSON
    const notifySQL = `SELECT pg_notify('execute_mail_now', $msg$${JSON.stringify(execPayload)}$msg$)`;

    try {
      // Hủy job cũ nếu đã tồn tại (idempotent — an toàn khi gọi nhiều lần)
      // Cần thiết khi reschedule: xóa job cũ trước khi tạo job mới với cùng tên
      await this.pgCronUnschedule(jobName);

      // Tạo pg_cron job one-shot: chạy đúng 1 lần vào ngày/giờ UTC đã tính
      // Khi pg_cron fire → chạy notifySQL → gửi NOTIFY 'execute_mail_now' vào channel
      // → NestJS nhận và gọi handleExecuteMailNow()
      await this.pgClient.query(`SELECT cron.schedule($1, $2, $3)`, [
        jobName,    // tên job trong pg_cron
        cronExpr,   // lịch chạy dạng cron (theo UTC)
        notifySQL,  // SQL sẽ được chạy khi đến giờ
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
  // LUỒNG B — Handler nhận NOTIFY từ pg_cron 'execute_mail_now'
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Được gọi khi pg_cron fire đúng giờ đã schedule.
   *
   * Các bước:
   *  1. Validate payload (phải có id và type hợp lệ)
   *  2. Hủy pg_cron job ngay lập tức
   *     → Quan trọng! Cron expression dạng "phút giờ ngày tháng *" sẽ lặp lại
   *       vào năm sau nếu không hủy. Đây là job one-shot nên phải tự cleanup.
   *  3. Gọi executeSendMail() để thực sự gửi mail
   */
  private async handleExecuteMailNow(payload: ExecuteMailPayload) {
    const { id, type, company_group_code, timezone } = payload;

    // Validate payload tối thiểu
    if (!id || !type) {
      this.logger.error(
        null,
        `[PgListenerService] execute_mail_now: invalid payload ${JSON.stringify(payload)}`,
      );
      return;
    }

    const jobName = `mail_${id}`;

    // Hủy pg_cron job ngay sau khi nhận được NOTIFY
    // Lý do: pg_cron với cron expression "phút giờ ngày tháng *" sẽ fire lại vào
    // cùng thời điểm năm sau nếu không unschedule → gửi mail trùng
    await this.pgCronUnschedule(jobName);

    await this.executeSendMail(
      id,
      type,
      company_group_code,
      timezone || 'Asia/Tokyo', // fallback timezone nếu payload thiếu
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Điều phối gửi mail theo type
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Bước cuối cùng trước khi gửi mail: re-check status trong DB.
   *
   * Lý do cần re-check:
   *  - Tránh race condition: nếu 2 event cùng trigger executeSendMail() cho 1 mail
   *    (vd: reschedule + execute_mail_now cùng lúc), chỉ có 1 lần gửi thành công.
   *  - Nếu status != 0 (đã gửi hoặc bị cancel), bỏ qua.
   *
   * Sau khi xác nhận status=0, phân loại theo type và gọi handler tương ứng:
   *  - type 7,25  → sendGoalCreationMail()  — mail thông báo tạo mục tiêu
   *  - type 8,26  → sendEvaluationMail()    — mail thông báo đánh giá
   *  - type 27,28 → sendExceptionMail()     — mail ngoại lệ (có TO và CC)
   */
  async executeSendMail(
    mailId: number,
    type: PgListenerMailType,
    companyGroupCode: string,
    timezone: string,
  ) {
    // Re-check status để tránh gửi trùng khi có race condition
    const historyMail = await this.mailSettingRepository.findOne({
      id: mailId,
      status: 0,  // chỉ lấy mail chưa gửi
    });

    if (!historyMail) {
      // Mail đã được gửi bởi luồng khác hoặc không tồn tại → bỏ qua
      this.logger.log(
        null,
        `[PgListenerService] mail ${mailId}: already processed or not found`,
      );
      return;
    }

    try {
      if ([7, 25].includes(type)) {
        // Type 7,25: mail thông báo bắt đầu chu kỳ tạo mục tiêu
        await this.sendGoalCreationMail(historyMail, companyGroupCode);
      } else if ([8, 26].includes(type)) {
        // Type 8,26: mail thông báo bắt đầu chu kỳ đánh giá
        await this.sendEvaluationMail(historyMail, companyGroupCode);
      } else if ([27, 28].includes(type)) {
        // Type 27,28: mail ngoại lệ (người đánh giá được chỉ định riêng)
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
  // Type 7 & 25 — Goal Creation Mail: thông báo bắt đầu chu kỳ tạo mục tiêu
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Gửi mail thông báo chu kỳ tạo mục tiêu cho từng người nhận trong mailTo.
   *
   * Các bước:
   *  1. Lấy thông tin evaluation period để xác nhận kỳ đánh giá còn tồn tại
   *  2. Với mỗi email trong danh sách mailTo (phân cách bởi dấu phẩy):
   *     a. Tìm tên đầy đủ của người nhận trong DB
   *     b. Tạo dòng chào "Tên さん" bằng tiếng Nhật
   *     c. Gửi mail với nội dung cá nhân hóa
   *  3. Xóa history cronjob liên kết (nếu có)
   *  4. Cập nhật status=1 và sendTimeActual trong DB
   */
  async sendGoalCreationMail(historyMail: any, companyGroupCode: string) {
    const { id, evaluationPeriodId, cronjobId, mailTo, title, contentMail } =
      historyMail;

    // Bước 1: lấy thông tin kỳ đánh giá — cần để xác nhận kỳ còn hợp lệ
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

    // Bước 2: gửi mail cho từng người nhận (mailTo có thể là nhiều email)
    for (const rawEmail of mailTo.split(',')) {
      const email = rawEmail.trim();
      if (!email) continue;

      // Tạo dòng chào tiếng Nhật: "Tên さん" nếu có họ và tên
      // Nếu fullName chỉ có 1 từ (không có họ) → không thêm "さん"
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

      // Ghép dòng chào vào đầu nội dung mail rồi gửi
      await this.mailService.sendMailCustoms(
        [email],
        [],           // không có CC
        title,
        `${toUserText}${contentMail}`,
      );
    }

    // Bước 3: xóa history cronjob liên kết (dọn dẹp record cũ)
    if (cronjobId) {
      await this.historyCronJobRepository.deleteHistory(
        { id: cronjobId },
        null,
      );
    }

    // Bước 4: đánh dấu mail đã gửi thành công trong DB
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
  // Type 8 & 26 — Evaluation Mail: thông báo bắt đầu chu kỳ đánh giá
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Gửi mail thông báo đánh giá, có thêm logic lọc ngoại lệ.
   *
   * Khác với sendGoalCreationMail, hàm này kiểm tra thêm:
   * - Nếu user có exception records (đánh giá ngoại lệ) trong kỳ này,
   *   kiểm tra xem có exception phù hợp với khoảng ngày cụ thể không.
   *   Nếu KHÔNG có exception nào phù hợp → BỎ QUA, không gửi mail cho user đó.
   *
   * Logic exception:
   *  - condition17:  exception ở level 1-7, trong khoảng dateEvaluationStart/End
   *  - condition810: exception ở level 8-10, trong khoảng dateEvaluationDepartmentStart/End
   *  - Nếu cả 2 đều = 0 → user không có exception phù hợp → skip gửi mail
   */
  async sendEvaluationMail(historyMail: any, companyGroupCode: string) {
    const { id, evaluationPeriodId, cronjobId, mailTo, title, contentMail } =
      historyMail;

    // Lấy thông tin kỳ đánh giá (cần dateEvaluationStart/End và dateEvaluationDepartmentStart/End)
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

        // Đếm tổng số exception records của user trong kỳ này
        const conditionCountException = {
          userId: username.id,
          evaluationPeriodId,
          creationUser: { [Op.ne]: null },          // phải có người tạo exception
          dateEvaluationStart: { [Op.ne]: null },    // phải có ngày bắt đầu
          dateEvaluationEnd: { [Op.ne]: null },      // phải có ngày kết thúc
        };
        const countException = await this.userRepo.countEvaluationException(
          conditionCountException,
        );

        if (countException > 0) {
          // User có exception → kiểm tra thêm xem exception có phù hợp với
          // khoảng ngày cụ thể của kỳ đánh giá này không

          // Exception level 1-7: trong khoảng đánh giá thông thường
          const condition17 = {
            userId: username.id,
            evaluationPeriodId,
            creationUser: { [Op.ne]: null },
            dateEvaluationStart: periods.dateEvaluationStart,
            dateEvaluationEnd: periods.dateEvaluationEnd,
            level: { [Op.lte]: 7 },   // level 1 đến 7
          };
          const exception17 = await this.userRepo.countEvaluationException(
            condition17,
          );

          // Exception level 8-10: trong khoảng đánh giá cấp department
          const condition810 = {
            userId: username.id,
            evaluationPeriodId,
            creationUser: { [Op.ne]: null },
            dateEvaluationStart: periods.dateEvaluationDepartmentStart,
            dateEvaluationEnd: periods.dateEvaluationDepartmentEnd,
            level: { [Op.gte]: 8 },   // level 8 đến 10
          };
          const exception810 = await this.userRepo.countEvaluationException(
            condition810,
          );

          // Nếu cả 2 khoảng đều không có exception phù hợp → skip user này
          if (!exception17 && !exception810) continue;
        }
      }

      // Gửi mail (user không có exception, hoặc có exception phù hợp)
      await this.mailService.sendMailCustoms(
        [email],
        [],
        title,
        `${toUserText}${contentMail}`,
      );
    }

    // Dọn dẹp history cronjob và cập nhật status=1
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
  // Type 27 & 28 — Exception Mail: mail ngoại lệ có TO và CC
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Gửi mail ngoại lệ — khác với Goal/Evaluation mail ở chỗ:
   *  - mailTo chỉ có 1 người nhận duy nhất (không phải danh sách)
   *  - mailCC có danh sách người nhận CC
   *  - contentMail chứa placeholder {{toUser}} và {{ccEvaluator}} cần replace
   *
   * Các bước:
   *  1. Lookup tên người nhận TO → replace {{toUser}} trong contentMail
   *  2. Xây dựng danh sách email CC, lookup tên từng người → replace {{ccEvaluator}}
   *  3. Gửi mail với TO và CC
   *  4. Cập nhật status=1 và lưu lại contentMail đã được replace (để audit)
   */
  async sendExceptionMail(historyMail: any, companyGroupCode: string) {
    const { id, mailTo, mailCC, title, contentMail } = historyMail;

    let infoEmail = contentMail;

    // Bước 1: lookup tên người nhận TO và replace {{toUser}}
    // Format tên Nhật: "Tên さん" nếu có họ và tên
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

    // Bước 2: xây dựng danh sách CC và replace {{ccEvaluator}}
    const ccEmails: string[] = [];
    if (mailCC) {
      const listNameCCs: string[] = [];

      for (const rawEmail of mailCC.split(',')) {
        const email = rawEmail.trim();
        if (!email) continue;

        ccEmails.push(email);

        // Lookup tên đầy đủ để ghép vào danh sách tên CC
        const nameCC = await this.userRepo.getUserByEmail(
          email,
          companyGroupCode,
        );
        if (nameCC) {
          listNameCCs.push(nameCC.fullName);
        }
      }

      // Ghép tên CC thành chuỗi "Tên1さん、Tên2さん" (phân cách bằng dấu 、tiếng Nhật)
      const ccText = listNameCCs
        .map(
          (name) =>
            `${name.split(' ')[0]}${name.split(' ').length > 1 ? 'さん' : ''}`,
        )
        .join('、');
      infoEmail = infoEmail.replace(/{{ccEvaluator}}/gi, ccText);
    } else {
      // Không có CC → xóa placeholder khỏi nội dung
      infoEmail = infoEmail.replace(/{{ccEvaluator}}/gi, '');
    }

    // Bước 3: gửi mail với đầy đủ TO và CC
    await this.mailService.sendMailCustoms(
      [mailTo?.trim()],
      ccEmails,
      title,
      infoEmail,
    );

    // Bước 4: cập nhật status=1 và lưu contentMail đã replace (để xem lại lịch sử)
    await this.mailSettingRepository.updateMailHistory(
      {
        status: 1,
        sendTimeActual: isFormatDate(new Date(), 'YYYY/M/D H:mm'),
        contentMail: infoEmail, // lưu nội dung đã được thay thế placeholder
      },
      id,
    );

    this.logger.log(
      null,
      `[PgListenerService] Exception mail type=${historyMail.type} sent: id=${id} to="${mailTo}"`,
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Utility: thao tác với pg_cron
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Kiểm tra xem pg_cron job có đang tồn tại không.
   * Trả về false nếu pg_cron extension chưa được cài.
   */
  async pgCronJobExists(jobName: string): Promise<boolean> {
    try {
      const result = await this.pgClient.query(
        `SELECT jobid FROM cron.job WHERE jobname = $1`,
        [jobName],
      );
      return result.rows.length > 0;
    } catch {
      // pg_cron extension chưa được cài hoặc không có quyền truy cập
      return false;
    }
  }

  /**
   * Hủy pg_cron job theo tên — an toàn nếu job không tồn tại.
   * Dùng WHERE jobname thay vì tên trực tiếp để tránh lỗi khi job không có.
   */
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

  /**
   * Lấy danh sách mail IDs đang có pg_cron job scheduled.
   * Dùng để debug / kiểm tra trạng thái hiện tại của scheduler.
   */
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
