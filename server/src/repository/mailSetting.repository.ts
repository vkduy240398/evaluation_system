/* eslint-disable complexity */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { Inject, Injectable } from '@nestjs/common';
import { Op, literal } from 'sequelize';
import EntityConstant from 'src/constant/EntityConstant';
import { EvaluationPeriod } from 'src/entity/EvaluationPeriod';
import { HistoryMail } from 'src/entity/HistoryMail';
import { MailTemplate } from 'src/entity/MailTemplate';
import { MailSettingRepositoryI } from 'src/interfaces/repository/mailSetting.repository.interface';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { EditMailTemplateObj } from 'src/model/request/MailManagementDto';
import { Request } from 'express';

@Injectable()
export class MailSettingRepository implements MailSettingRepositoryI {
  @Inject(EntityConstant.HISTORY_MAIL)
  private historyMailEnity: typeof HistoryMail;

  @Inject(EntityConstant.MAIL_TEMPLATE)
  private mailTemplateEntity: typeof MailTemplate;

  async saveMailTemplate(body: any): Promise<any> {
    const results = await this.historyMailEnity.create(body);
    if (!results) {
      throw new RuntimeException(
        `Unable to create history with data ${body}`,
        500,
      );
    }
    return results;
  }
  async getMailHistoryList(query: any, req: Request): Promise<any> {
    // const type = query.listMailType == 1 ? [7, 8] : [1, 2, 3, 4, 5, 6];
    const conditionYear = {
      year: {
        [Op.between]: [query.yearStart, query.yearEnd],
      },
    };
    const results = await this.historyMailEnity.findAndCountAll({
      where:
        query.status != -1
          ? {
              status: query.status,
              companyGroupCode: req?.user?.companyGroupCode,
            }
          : { companyGroupCode: req?.user?.companyGroupCode },
      include: [
        {
          model: EvaluationPeriod,
          as: 'evaluationPeriod',
          where:
            query.yearStart === '' && query.yearEnd === '' ? {} : conditionYear,
          attributes: ['id', 'year', 'periodIndex'],
        },
      ],
      // order: [['sendTimeActual', 'DESC']],
      order: [
        [
          literal("TO_TIMESTAMP(send_time_actual, 'YYYY/MM/DD HH24:MI')"),
          'DESC',
        ],
        [literal("TO_TIMESTAMP(send_time_setting, 'YYYY/MM/DD')"), 'DESC'],
        [literal('id'), 'DESC'],
      ],
      offset: query.offset,
      limit: query.limit,
      distinct: true,
    });
    const convertType = {
      1: '目標_実施期間変更なし_被評価者と評価者',
      2: '目標_実施期間変更',
      3: '評価_実施期間変更なし_被評価者と評価者',
      4: '評価_実施期間変更',
      5: '例外設定_目標設定',
      6: '例外設定_評価',
      7: '共通実施期間_目標設定',
      8: '共通実施期間_評価',
      9: '目標_実施期間変更なし_評価者',
      10: '評価_実施期間変更なし_評価者',
      25: '目標設定_部署別期間設定がある',
      26: '評価_部署別期間設定がある',
      27: '目標設定_個人別期間設定がある',
      28: '評価_個人別期間設定がある',
    } as any;
    const tempList: any[] = [];
    results?.rows.forEach((item: HistoryMail) => {
      tempList.push({
        contentMail: item.contentMail,
        createdTime: item.createdTime,
        cronjobId: item.cronjobId,
        evaluationId: item.evaluationId,
        evaluationPeriodId: item.evaluationPeriodId,
        evaluationTime: item.evaluationTime,
        id: item.id,
        mailTo: item.mailTo,
        sendTimeActual: item.sendTimeActual,
        sendTimeSetting: item.sendTimeSetting,
        status: item.status,
        title: item.title,
        type: convertType[item.type],
        typeNumber: item.type,
        updatedTime: item.updatedTime,
        evaluationDepartmentTime: item.evaluationDepartmentTime,
        mailCC: item.mailCC,
      });
    });

    if (!results) {
      throw new RuntimeException(`error`, 500);
    }
    return { results: tempList, counts: results?.count };
  }
  async updateMailHistory(body: any, id: number): Promise<any> {
    return await this.historyMailEnity.update(body, { where: { id: id } });
  }

  async findOne(query: { [x: string]: any }): Promise<HistoryMail> {
    return await this.historyMailEnity.findOne({
      where: query,
    });
  }
  async deleteMail(id: number, transaction: any): Promise<any> {
    return await this.historyMailEnity.destroy({
      where: { id: id },
      transaction: transaction,
    });
  }
  async transaction(): Promise<any> {
    return await this.historyMailEnity.sequelize.transaction();
  }

  async transactionMailTemplate(): Promise<any> {
    return await this.mailTemplateEntity.sequelize.transaction();
  }

  async getMailTemplateList(query: any, req: Request): Promise<any> {
    // if (query.name !== '') {
    return await this.mailTemplateEntity.findAll({
      where:
        query.name !== ''
          ? {
              name: { [Op.like]: `%${query.name}%` },
              companyGroupCode: req?.user?.companyGroupCode,
            }
          : { companyGroupCode: req?.user?.companyGroupCode },
      order: [['sort', 'ASC']],
    });
    // } else {
    //   return await this.mailTemplateEntity.findAll({
    //     order: [['id', 'ASC']],
    //   });
    // }
  }

  async getMailTemplateListById(query: any, req: Request): Promise<any> {
    return await this.mailTemplateEntity.findOne({
      where: {
        id: query.id,
        companyGroupCode: req?.user?.companyGroupCode,
      },
    });
  }

  async editMailTemplate(
    body: EditMailTemplateObj,
    req: Request,
  ): Promise<any> {
    const { id, name, subject, note, content, setting } = body;
    return await this.mailTemplateEntity.update(
      {
        name: name,
        subject: subject,
        note: note,
        content: content,
        setting: JSON.stringify(setting),
      },
      {
        where: { id: id, companyGroupCode: req?.user?.companyGroupCode },
      },
    );
  }

  async getMailTemplateById(object: { [x: string]: any }) {
    const data = await this.mailTemplateEntity.findOne({
      attributes: [
        'id',
        'type',
        'name',
        'subject',
        'content',
        'note',
        'setting',
        'companyGroupCode',
      ],
      where: object,
    });
    return data;
  }

  async findPendingMailsByCronjobIds(
    cronjobIds: number[],
    types: number[],
  ): Promise<HistoryMail[]> {
    return await this.historyMailEnity.findAll({
      where: {
        cronjobId: cronjobIds,
        status: 0,
        type: types,
      },
    });
  }

  /**
   * Giành quyền gửi 1 mail bằng UPDATE có điều kiện `status = 0` — atomic ở
   * tầng DB (Postgres khoá row trong lúc UPDATE đang chạy).
   *
   * Dùng để chống gửi trùng khi 2 lượt cron/2 process cùng nhặt phải 1 mail
   * đến hạn cùng lúc: cả 2 cùng chạy UPDATE này, nhưng chỉ 1 lệnh thấy điều
   * kiện `status = 0` còn đúng tại thời điểm nó thực thi (affectedCount = 1),
   * lệnh còn lại thực thi sau sẽ thấy status đã đổi thành 1 (affectedCount = 0).
   *
   * Trả về true nếu lệnh này thắng (được phép gửi), false nếu mail đã được
   * một lượt khác giành quyền gửi trước đó.
   */
  async claimMailForSending(
    id: number,
    sendTimeActual: string,
  ): Promise<boolean> {
    const [affectedCount] = await this.historyMailEnity.update(
      { status: 1, sendTimeActual },
      { where: { id, status: 0 } },
    );
    return affectedCount > 0;
  }

  /**
   * Kiểm tra xem có request tạo mail nào giống hệt (cùng kỳ đánh giá, type,
   * người nhận, giờ gửi, company) vừa được tạo trong `withinSeconds` giây
   * gần đây hay không.
   *
   * Dùng để chống double-submit: khi người dùng bấm gửi 2 lần liên tiếp
   * (double-click) hoặc request bị gọi lặp, request thứ 2 sẽ bị nhận diện
   * là trùng và bị chặn trước khi tạo thêm record/gửi thêm mail.
   */
  async hasRecentDuplicateMail(
    condition: {
      evaluationPeriodId: number;
      type: number;
      mailTo: string;
      sendTimeSetting: string | null;
      companyGroupCode: string;
    },
    withinSeconds: number,
  ): Promise<boolean> {
    const since = new Date(Date.now() - withinSeconds * 1000);
    const existing = await this.historyMailEnity.findOne({
      where: {
        evaluationPeriodId: condition.evaluationPeriodId,
        type: condition.type,
        mailTo: condition.mailTo,
        sendTimeSetting: condition.sendTimeSetting,
        companyGroupCode: condition.companyGroupCode,
        createdTime: { [Op.gte]: since },
      },
    });
    return !!existing;
  }

  async getListMailTemplateById(object: { [x: string]: any }) {
    const data = await this.mailTemplateEntity.findAll({
      attributes: [
        'id',
        'type',
        'name',
        'subject',
        'content',
        'note',
        'setting',
        'companyGroupCode',
      ],
      where: object,
    });
    return data;
  }
}
