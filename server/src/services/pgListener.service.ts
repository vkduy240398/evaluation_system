/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
/**
 * ============================================================
 * PgListenerService — Giải thích tổng quan flow
 * ============================================================
 *
 * Service này có nhiệm vụ GỬI MAIL ĐÚNG GIỜ dựa trên cấu hình
 * `dateSendMailEvaluationGoal` (history_cron_job_tbl) / `sendTimeSetting`
 * (history_mail_tbl) trong DB.
 *
 * Trước đây service dùng pg-listen (LISTEN/NOTIFY) + pg_cron để tạo
 * job one-shot cho từng mail — cách này phụ thuộc vào extension pg_cron
 * trên Postgres và một kết nối persistent riêng (pg-listen), khá phức
 * tạp và khó debug khi mất kết nối.
 *
 * Cách làm MỚI: dùng 1 cron job nội bộ (NestJS @Cron) chạy MỖI PHÚT:
 *
 *   [checkAndSendScheduledMails() — chạy mỗi phút]
 *       └─ Với mỗi company group (mỗi company có timezone riêng):
 *           1. Query history_cron_job_tbl lấy các cronjob có
 *              dateSendMailEvaluationGoal (dạng "YYYY/MM/DD HH:mm")
 *              đã đến hoặc quá giờ gửi (so theo timezone company đó)
 *              → lấy ra danh sách id.
 *           2. Query history_mail_tbl WHERE cronjob_id IN (ids)
 *              AND status = 0 (chưa gửi) AND type thuộc
 *              PG_LISTENER_MAIL_TYPES.
 *           3. Gửi mail theo type (executeSendMail()):
 *               - type 7,25  → sendGoalCreationMail()  — mail thông báo tạo mục tiêu
 *               - type 8,26  → sendEvaluationMail()    — mail thông báo đánh giá
 *               - type 27,28 → sendExceptionMail()     — mail ngoại lệ (có TO và CC)
 *       └─ Sau khi xử lý xong toàn bộ company: log báo cáo kết quả
 *          (số cronjob đến hạn / số mail tìm thấy / gửi thành công / lỗi).
 *
 * Cronjob dạng "chỉ có ngày" (vd: "2026/7/1", không có giờ) KHÔNG được
 * xử lý ở đây — dạng này do legacy cron (CronJobServices) đảm nhiệm.
 * ============================================================
 */
import { Injectable, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
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
const momentTz = require('moment-timezone');

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

/** Format ngày giờ dùng trong dateSendMailEvaluationGoal / sendTimeSetting */
const SEND_TIME_FORMATS = ['YYYY/MM/DD HH:mm', 'YYYY/M/D HH:mm'];

@Injectable()
export class PgListenerService {
  /** Cờ chống chạy chồng lấn: nếu lượt cron trước chưa xử lý xong thì bỏ qua tick hiện tại */
  private isProcessingScheduledMails = false;

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
  // CRON CHÍNH — chạy mỗi phút, thay thế hoàn toàn pg-listen/pg_cron
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Chạy mỗi phút (giây thứ 0). Với mỗi company group:
   *
   *  1. Lấy toàn bộ cronjob (history_cron_job_tbl) của company đó có
   *     dateSendMailEvaluationGoal khác null.
   *  2. Bỏ qua cronjob dạng "chỉ có ngày" (không có khoảng trắng — không
   *     có giờ cụ thể), dạng này do legacy cron xử lý riêng.
   *  3. Parse dateSendMailEvaluationGoal theo timezone của company, so
   *     sánh với giờ hiện tại: nếu <= giờ hiện tại thì cronjob đã "đến hạn".
   *     Dùng <= (thay vì ==) để không bỏ sót mail nếu tick cron trước đó
   *     bị trễ/lỗi đúng lúc đến giờ gửi.
   *  4. Với các cronjob đến hạn, tìm toàn bộ history_mail_tbl có
   *     cronjob_id tương ứng, status = 0 (chưa gửi) và type thuộc
   *     PG_LISTENER_MAIL_TYPES.
   *  5. Gửi mail theo type qua executeSendMail().
   *
   * Sau khi xử lý xong toàn bộ company, log báo cáo kết quả thực hiện.
   */
  @Cron('0 * * * * *', {
    name: 'checkAndSendScheduledMails',
    disabled: false,
  })
  async checkAndSendScheduledMails() {
    if (this.isProcessingScheduledMails) {
      this.logger.warn(
        null,
        `[PgListenerService] previous tick is still running, skip this tick`,
      );
      return;
    }
    this.isProcessingScheduledMails = true;

    // Số liệu dùng để báo cáo kết quả thực hiện sau khi chạy xong
    let dueCronjobCount = 0;
    let mailFoundCount = 0;
    let mailSuccessCount = 0;
    let mailSkippedCount = 0;
    let mailFailedCount = 0;

    try {
      const companyGroups = await this.companyGroupService.getAllCompanyGroup();
      for (const group of companyGroups) {
        const companyGroupCode = group.code;
        const timezone = group.timezone || 'Asia/Tokyo';
        const now = momentTz().tz(timezone);

        // Bước 1: lấy toàn bộ cronjob còn "giờ gửi" của company này
        const cronJobs = await this.historyCronJobRepository.getAllByCondition({
          companyGroupCode,
          dateSendMailEvaluationGoal: { [Op.ne]: null },
        });

        // Bước 2 + 3: lọc ra cronjob dạng có giờ cụ thể và đã đến/quá hạn
        const dueCronJobIds: number[] = [];
        for (const job of cronJobs) {
          const raw = job.dateSendMailEvaluationGoal;
          // Dạng chỉ có ngày (không có khoảng trắng) → legacy cron xử lý riêng
          if (!raw || !raw.includes(' ')) continue;

          const dueMoment = momentTz.tz(raw, SEND_TIME_FORMATS, timezone);
          if (!dueMoment.isValid()) continue;

          if (dueMoment.valueOf() <= now.valueOf()) {
            dueCronJobIds.push(job.id);
          }
        }

        if (!dueCronJobIds.length) continue;
        dueCronjobCount += dueCronJobIds.length;

        // Bước 4: tìm mail chưa gửi (status=0) gắn với các cronjob đến hạn
        const pendingMails =
          await this.mailSettingRepository.findPendingMailsByCronjobIds(
            dueCronJobIds,
            [...PG_LISTENER_MAIL_TYPES],
          );
        mailFoundCount += pendingMails.length;

        // Bước 5: gửi mail theo type, đếm kết quả để báo cáo
        for (const mail of pendingMails) {
          try {
            const sent = await this.executeSendMail(
              mail.id,
              mail.type as PgListenerMailType,
              companyGroupCode,
            );
            if (sent) {
              mailSuccessCount++;
            } else {
              mailSkippedCount++;
            }
          } catch (error) {
            mailFailedCount++;
            this.logger.error(
              null,
              `[PgListenerService] failed to send mail id=${mail.id} type=${mail.type}: ${error}`,
            );
          }
        }
      }
    } catch (error) {
      this.logger.error(
        null,
        `[PgListenerService] checkAndSendScheduledMails error: ${error}`,
      );
    } finally {
      this.isProcessingScheduledMails = false;
    }

    // ── Báo cáo kết quả thực hiện ────────────────────────────────────────
    if (mailFoundCount > 0) {
      this.logger.log(
        null,
        `[PgListenerService] Report: ${dueCronjobCount} cronjob(s) due, ` +
          `${mailFoundCount} mail(s) found → success=${mailSuccessCount}, ` +
          `skipped=${mailSkippedCount}, failed=${mailFailedCount}`,
      );
    } else {
      this.logger.debug(
        null,
        `[PgListenerService] Report: no mail due at this tick`,
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Điều phối gửi mail theo type
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Đọc dữ liệu mail (chỉ lấy nếu status=0) để biết cần gửi loại nào, rồi
   * điều phối cho hàm gửi tương ứng.
   *
   * Lưu ý: bước SELECT này CHỈ để đọc dữ liệu (mailTo/title/contentMail...),
   * KHÔNG phải là điểm chống gửi trùng — vì đọc xong tới lúc gửi thật vẫn có
   * khoảng hở (nhiều bước async ở giữa: lookup tên, query period...). Điểm
   * chống gửi trùng THẬT SỰ nằm ở claimMailForSending() được gọi bên trong
   * từng hàm sendGoalCreationMail()/sendEvaluationMail()/sendExceptionMail()
   * — đó là 1 UPDATE có điều kiện `WHERE status = 0`, atomic ở tầng DB nên
   * vẫn đúng dù có nhiều tick/process cùng gọi song song.
   *
   * Lỗi phát sinh khi gửi KHÔNG được bắt ở đây — để throw ra ngoài cho
   * checkAndSendScheduledMails() đếm số mail lỗi phục vụ báo cáo.
   *
   * Phân loại theo type và gọi handler tương ứng:
   *  - type 7,25  → sendGoalCreationMail()  — mail thông báo tạo mục tiêu
   *  - type 8,26  → sendEvaluationMail()    — mail thông báo đánh giá
   *  - type 27,28 → sendExceptionMail()     — mail ngoại lệ (có TO và CC)
   */
  async executeSendMail(
    mailId: number,
    type: PgListenerMailType,
    companyGroupCode: string,
  ): Promise<boolean> {
    const historyMail = await this.mailSettingRepository.findOne({
      id: mailId,
      status: 0, // chỉ lấy mail chưa gửi
    });

    if (!historyMail) {
      // Mail đã được gửi bởi lượt chạy khác hoặc không tồn tại → bỏ qua
      this.logger.log(
        null,
        `[PgListenerService] mail ${mailId}: already processed or not found`,
      );
      return false;
    }

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

    return true;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Type 7 & 25 — Goal Creation Mail: thông báo bắt đầu chu kỳ tạo mục tiêu
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Gửi mail thông báo chu kỳ tạo mục tiêu cho từng người nhận trong mailTo.
   *
   * Các bước:
   *  1. Lấy thông tin evaluation period để xác nhận kỳ đánh giá còn tồn tại
   *  2. Giành quyền gửi bằng claimMailForSending() (UPDATE status 0→1 có điều
   *     kiện, atomic ở tầng DB) — NGAY TRƯỚC khi gửi thật. Nếu thua (mail đã
   *     được 1 lượt cron/process khác giành gửi trước) → dừng lại, không gửi
   *     trùng. Đây là bước chống race-condition khi nhiều mail đến hạn cùng
   *     lúc khiến 2 lượt tick/process cùng nhặt phải 1 mail.
   *  3. Với mỗi email trong danh sách mailTo (phân cách bởi dấu phẩy):
   *     a. Tìm tên đầy đủ của người nhận trong DB
   *     b. Tạo dòng chào "Tên さん" bằng tiếng Nhật
   *     c. Gửi mail với nội dung cá nhân hóa
   *  4. Xóa history cronjob liên kết (nếu có)
   *
   * Lưu ý: status=1 và sendTimeActual đã được ghi nhận ngay tại bước claim
   * (bước 2) — không cập nhật lại ở cuối hàm nữa để tránh làm mất tác dụng
   * chống trùng (nếu chỉ set status sau khi gửi xong thì trong lúc đang gửi,
   * record vẫn hiện status=0 và có thể bị 1 lượt khác gửi trùng).
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

    // Bước 2: giành quyền gửi (atomic) — xem giải thích ở docblock phía trên
    const claimed = await this.mailSettingRepository.claimMailForSending(
      id,
      isFormatDate(new Date(), 'YYYY/M/D H:mm'),
    );
    if (!claimed) {
      this.logger.log(
        null,
        `[PgListenerService] mail ${id}: already claimed by another run, skip to avoid duplicate send`,
      );
      return;
    }

    // Bước 3: gửi mail cho từng người nhận (mailTo có thể là nhiều email)
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
        [], // không có CC
        title,
        `${toUserText}${contentMail}`,
      );
    }

    // Bước 4: xóa history cronjob liên kết (dọn dẹp record cũ)
    if (cronjobId) {
      await this.historyCronJobRepository.deleteHistory(
        { id: cronjobId },
        null,
      );
    }

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
   *
   * Cũng giành quyền gửi bằng claimMailForSending() (atomic, UPDATE status
   * 0→1 có điều kiện) NGAY TRƯỚC khi gửi thật, để chống race-condition khi
   * nhiều mail đến hạn cùng lúc — xem giải thích chi tiết ở sendGoalCreationMail().
   * status=1/sendTimeActual được ghi nhận tại bước claim, không set lại ở cuối hàm.
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

    // Giành quyền gửi (atomic) — nếu thua thì 1 lượt khác đã gửi mail này rồi
    const claimed = await this.mailSettingRepository.claimMailForSending(
      id,
      isFormatDate(new Date(), 'YYYY/M/D H:mm'),
    );
    if (!claimed) {
      this.logger.log(
        null,
        `[PgListenerService] mail ${id}: already claimed by another run, skip to avoid duplicate send`,
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
          creationUser: { [Op.ne]: null }, // phải có người tạo exception
          dateEvaluationStart: { [Op.ne]: null }, // phải có ngày bắt đầu
          dateEvaluationEnd: { [Op.ne]: null }, // phải có ngày kết thúc
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
            level: { [Op.lte]: 7 }, // level 1 đến 7
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
            level: { [Op.gte]: 8 }, // level 8 đến 10
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

    // Dọn dẹp history cronjob liên kết
    if (cronjobId) {
      await this.historyCronJobRepository.deleteHistory(
        { id: cronjobId },
        null,
      );
    }

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
   *  1. Giành quyền gửi bằng claimMailForSending() (atomic, UPDATE status 0→1
   *     có điều kiện) — hàm này không có bước kiểm tra period nào trước khi
   *     gửi nên phải claim ngay từ đầu để chống race-condition khi nhiều mail
   *     đến hạn cùng lúc (xem giải thích chi tiết ở sendGoalCreationMail()).
   *  2. Lookup tên người nhận TO → replace {{toUser}} trong contentMail
   *  3. Xây dựng danh sách email CC, lookup tên từng người → replace {{ccEvaluator}}
   *  4. Gửi mail với TO và CC
   *  5. Xóa history cronjob liên kết (nếu có)
   *  6. Lưu lại contentMail đã được replace (để audit) — status=1/sendTimeActual
   *     đã được ghi nhận tại bước claim (bước 1) nên chỉ cần update contentMail
   */
  async sendExceptionMail(historyMail: any, companyGroupCode: string) {
    const { id, cronjobId, mailTo, mailCC, title, contentMail } = historyMail;

    // Bước 1: giành quyền gửi (atomic) — nếu thua thì 1 lượt khác đã gửi rồi
    const claimed = await this.mailSettingRepository.claimMailForSending(
      id,
      isFormatDate(new Date(), 'YYYY/M/D H:mm'),
    );
    if (!claimed) {
      this.logger.log(
        null,
        `[PgListenerService] mail ${id}: already claimed by another run, skip to avoid duplicate send`,
      );
      return;
    }

    let infoEmail = contentMail;

    // Bước 2: lookup tên người nhận TO và replace {{toUser}}
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

    // Bước 3: xây dựng danh sách CC và replace {{ccEvaluator}}
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

    // Bước 4: gửi mail với đầy đủ TO và CC
    await this.mailService.sendMailCustoms(
      [mailTo?.trim()],
      ccEmails,
      title,
      infoEmail,
    );

    // Bước 5: xóa history cronjob liên kết (nếu có) — trước đây hàm này thiếu
    // bước dọn dẹp này nên cronjob của type 27/28 bị "rác" lại vĩnh viễn dù
    // mail đã gửi xong
    if (cronjobId) {
      await this.historyCronJobRepository.deleteHistory(
        { id: cronjobId },
        null,
      );
    }

    // Bước 6: lưu lại contentMail đã replace (để xem lại lịch sử) — status=1
    // và sendTimeActual đã được ghi nhận ở bước claim (bước 1), không set lại
    await this.mailSettingRepository.updateMailHistory(
      { contentMail: infoEmail }, // lưu nội dung đã được thay thế placeholder
      id,
    );

    this.logger.log(
      null,
      `[PgListenerService] Exception mail type=${historyMail.type} sent: id=${id} to="${mailTo}"`,
    );
  }
}
