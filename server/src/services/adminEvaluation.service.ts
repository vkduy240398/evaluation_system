/* eslint-disable no-self-assign */
import { Inject, Injectable } from '@nestjs/common';
import { AdminEvaluationRepositoryI } from 'src/interfaces/repository/adminEvaluation.repository';
import { UserRepositoryI } from 'src/interfaces/repository/user.repository.interface';
import { AdminEvaluationRepository } from 'src/repository/adminEvaluation.repository';
import { UserRepository } from 'src/repository/user.repository';
import { MailService } from './mail.service';
import { Op } from 'sequelize';
import { Workbook } from 'exceljs';
import { AdminEvaluationServiceI } from 'src/interfaces/service/adminEvaluation.service.interface';
import { statusEvaluation } from 'src/constant/statusEvaluation';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { AddProSkillDto } from 'src/model/request/F6/AddProSkillDto';
import { EditProskillDto } from 'src/model/request/F6/EditProskillDto';
import { HistoryFixEvaluation } from '../entity/HistoryFixEvaluation';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const moment = require('moment');
import * as moment from 'moment';

@Injectable()
export class AdminEvaluationService implements AdminEvaluationServiceI {
  @Inject(UserRepository)
  private userRepo: UserRepositoryI;

  @Inject(AdminEvaluationRepository)
  private adminEvaluationRepo: AdminEvaluationRepositoryI;
  @Inject(MailService)
  private mailService: MailService;

  async goalConfirm(body: any, companyGroupCode: string) {
    const { periodId, checkFixed } = body;
    const listEvaluations =
      await this.adminEvaluationRepo.getListEvaluationConfirm(
        body,
        companyGroupCode,
      );
    if (listEvaluations && listEvaluations.length > 0) {
      let string = ``;
      for await (const e of listEvaluations) {
        string += `${e.id}:${e.status} `;
      }

      await this.adminEvaluationRepo.goalConfirm(periodId, companyGroupCode);
      // sau khi update status = 50 thì thực thi trigger set_evaluation_department_id

      const jsonStr =
        '{"' +
        string
          .substring(0, string.length - 1)
          .replace(/ /g, '", "')
          .replace(/:/g, '": "') +
        '"}';
      await this.adminEvaluationRepo.addHistoryFixEvaluation(
        periodId,
        jsonStr,
        1,
        checkFixed,
      );
    }
    return 1;
  }
  async listUserEvaluation(
    params: any,
    companyGroupCode: string,
    timeZone: string,
  ) {
    
    return await this.adminEvaluationRepo.listUserEvaluation(
      params,
      companyGroupCode,
      timeZone,
    );
  }

  async listUserEvaluationPeriod(params: any, companyGroupCode: string) {
    // const periodId = await this.findEvaluatonPeriodId(params.type);
    const data = await this.adminEvaluationRepo.listUserEvaluationPeriod(
      params,
      companyGroupCode,
    );

    const period = await this.adminEvaluationRepo.checkDatePeriod(
      params.periodId,
    );

    return { data: data, period: period };
  }

  async exportCSV(params: any, companyGroupCode: string) {
    const datas = await this.adminEvaluationRepo.exportCSV(
      params,
      companyGroupCode,
    );
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet();
    worksheet.columns = [
      { header: '社員番号', key: '社員番号' },
      { header: '氏名', key: '氏名' },
      { header: '部署名', key: '部署名' },
      { header: '課名', key: '課名' },
      { header: '等級', key: '等級' },
      { header: '評価期間', key: '評価期間' },
      { header: '状態', key: '状態' },
      { header: '一次評価', key: '一次評価' },
      { header: '二次評価', key: '二次評価' },
      { header: '評価結果', key: '評価結果' },
      { header: '個人評価', key: '評価結果' },
      { header: '【公開】\n一次評価者コメント', key: '一次評価者コメント' },
      { header: '【非公開】\n一次評価者コメント', key: '一次評価者コメント' },
      { header: '【公開】\n二次評価者コメント', key: '二次評価者コメント' },
      { header: '【非公開】\n二次評価者コメント', key: '二次評価者コメント' },
      { header: '備考', key: '備考' },
    ];
    for (let i = 1; i <= worksheet.columnCount; i++) {
      worksheet.getCell(1, i).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ff91d2ff' },
      };
    }

    worksheet.getRow(1).font = {
      bold: true,
    };
    worksheet.getCell('A1').border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    worksheet.columns[0].width = 10;
    worksheet.columns[1].width = 20;
    worksheet.columns[2].width = 30;
    worksheet.columns[3].width = 30;
    worksheet.columns[4].width = 5;
    worksheet.columns[5].width = 20;
    worksheet.columns[6].width = 18;
    worksheet.columns[7].width = 20;
    worksheet.columns[8].width = 20;
    worksheet.columns[9].width = 5;
    worksheet.columns[10].width = 5;
    worksheet.columns[11].width = 30;
    worksheet.columns[12].width = 30;
    worksheet.columns[13].width = 30;
    worksheet.columns[14].width = 30;
    worksheet.columns[15].width = 50;

    const createOuterBorder = (
      worksheet: any,
      start = { row: 1, col: 1 },
      end = { row: 1, col: 1 },
      borderWidth = 'thin',
    ) => {
      const borderStyle = {
        style: borderWidth,
      };
      for (let i = start.row; i <= end.row; i++) {
        for (let j = start.col; j <= end.col; j++) {
          const leftBorderCell = worksheet.getCell(i, j);
          leftBorderCell.border = {
            ...leftBorderCell.border,
            left: borderStyle,
            right: borderStyle,
            top: borderStyle,
            bottom: borderStyle,
          };
        }
      }
    };

    datas.data.forEach((item: any, _index: any) => {
      // worksheet.getRow(index).height = 28;
      worksheet.addRow([
        item.employee_number,
        item.full_name,
        item.division,
        item.department,
        item.level,
        item.period,
        item.status,
        item.evaluator_1,
        item.evaluator_2,
        item.statusno > 61 ? item.point : '',
        item.summary_char_point_evaluator_2,
        item.comment_public_evaluator_1,
        item.comment_private_evaluator_1,
        item.comment_public_evaluator_2,
        item.comment_private_evaluator_2,
        item.note,
      ]);

      let rowIndex = 1;
      for (rowIndex; rowIndex <= worksheet.rowCount; rowIndex++) {
        worksheet.getRow(rowIndex).alignment = {
          wrapText: true,
          vertical: 'middle',
        };
      }
      worksheet.getRow(1).alignment = {
        wrapText: true,
        horizontal: 'center',
        vertical: 'middle',
      };
      worksheet.getColumn(5).alignment = {
        wrapText: true,
        horizontal: 'center',
        vertical: 'middle',
      };
      worksheet.getColumn(10).alignment = {
        wrapText: true,
        horizontal: 'center',
        vertical: 'middle',
      };
      worksheet.getColumn(11).alignment = {
        wrapText: true,
        horizontal: 'center',
        vertical: 'middle',
      };
    });
    createOuterBorder(
      worksheet,
      { row: 1, col: 1 },
      { row: worksheet.rowCount, col: worksheet.columnCount },
    );
    // Tạo file Excel
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  async evaluationConfirm(body: any, companyGroupCode: string): Promise<any> {
    const listEvaluation = await this.adminEvaluationRepo.evaluationConfirm(
      body,
      companyGroupCode,
    );
    let string = ``;

    for await (const e of listEvaluation) {
      string += `${e.id}:${e.status} `;
    }
    const jsonStr =
      '{"' +
      string
        .substring(0, string.length - 1)
        .replace(/ /g, '", "')
        .replace(/:/g, '": "') +
      '"}';
    await this.adminEvaluationRepo.addHistoryFixEvaluation(
      body.periodId,
      jsonStr,
      2,
      body.checkFixed,
    );
    return 1;
  }

  async publicEvaluation(
    body: any,
    host: string,
    companyGroupCode: string,
  ): Promise<any> {
    const listUser = await this.adminEvaluationRepo.getListUser(
      body.periodId,
      companyGroupCode,
    );
    const condition = {
      [Op.and]: [
        { status: { [Op.lt]: 100 } },
        { status: { [Op.gte]: 50 } },
        { evaluationPeriodId: body.periodId },
        { userId: { [Op.in]: listUser.map((e: any) => e.userId) } },
        { companyGroupCode: companyGroupCode },
      ],
    };
    const sendMailList = await this.adminEvaluationRepo.getAllEvaluation(
      condition,
    );
    const result = await this.adminEvaluationRepo.publicEvaluation(
      body,
      companyGroupCode,
    );
    // send mail
    if (sendMailList) {
      this.mailService.sendMailPublicAllEvaluationForUser(
        sendMailList,
        host,
        companyGroupCode,
      );
      this.mailService.sendMailPublicAllEvaluationForEvaluator(
        sendMailList,
        host,
        companyGroupCode,
      );
    }
    return result;
  }

  async evaluationFixed(query: any, companyGroupCode: string): Promise<any> {
    const { yearStart, yearEnd } = query;
    const data = await this.adminEvaluationRepo.evaluationFixed(
      yearStart,
      yearEnd,
    );
    for (let i = 0; i < data.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const goalRecord = await this.adminEvaluationRepo.countEvaluationFixed(
        'goal',
        data[i].id,
        companyGroupCode,
      );
      const evaluationRecord =
        // eslint-disable-next-line no-await-in-loop
        await this.adminEvaluationRepo.countEvaluationFixed(
          'evaluation',
          data[i].id,
          companyGroupCode,
        );
      const evaluationConfirmRecord =
        // eslint-disable-next-line no-await-in-loop
        await this.adminEvaluationRepo.countEvaluationFixed(
          'evaluationConfirm',
          data[i].id,
          companyGroupCode,
        );

      // eslint-disable-next-line no-await-in-loop
      const totalRecord = await this.adminEvaluationRepo.totalEvaluation(
        data[i].id,
        '',
        companyGroupCode,
      );

      // eslint-disable-next-line no-await-in-loop
      const goalFixedRecord = await this.adminEvaluationRepo.totalEvaluation(
        data[i].id,
        'goal',
        companyGroupCode,
      );

      const evaluationFixedRecord =
        // eslint-disable-next-line no-await-in-loop
        await this.adminEvaluationRepo.totalEvaluation(
          data[i].id,
          'evaluation',
          companyGroupCode,
        );
      const evaluationConfirmFixedRecord =
        // eslint-disable-next-line no-await-in-loop
        await this.adminEvaluationRepo.totalEvaluation(
          data[i].id,
          'evaluationConfirm',
          companyGroupCode,
        );
      data[i] = {
        id: data[i].id,
        year: data[i].year,
        periodIndex: data[i].periodIndex,
        goalRecord: goalRecord,
        evaluationRecord: evaluationRecord,
        evaluationConfirmRecord: evaluationConfirmRecord,
        checkFixed: data[i].checkFixed,
        totalRecord: totalRecord,
        goalFixedRecord: goalFixedRecord,
        evaluationFixedRecord: evaluationFixedRecord,
        evaluationConfirmFixedRecord: evaluationConfirmFixedRecord,
        goals: `${data[i].dateCreationGoalStart} ~ ${data[i].dateCreationGoalEnd}`,
        departmentGoals: `${data[i].dateCreationGoalDepartmentStart} ~ ${data[i].dateCreationGoalDepartmentEnd}`,
      };
    }

    return data;
  }

  async undoFixEvaluation(body: any) {
    const { periodId, type } = body;
    const data: HistoryFixEvaluation =
      await this.adminEvaluationRepo.findHistoryFixEvaluation(periodId, type);
    if (!data) throw new RuntimeException('No data undo', 200);
    const note: { [key: string]: string } =
      data.note === '{""}' ? {} : JSON.parse(data.note);
    const t = await this.adminEvaluationRepo.transactionUndo();

    try {
      await this.adminEvaluationRepo.updateEvaluationPeriod(
        data.checkFixed,
        periodId,
        t,
      );
      if (type === 1) {
        await this.adminEvaluationRepo.undoGoal(note, t);
      }
      if (type === 2) {
        await this.adminEvaluationRepo.undoEvaluation(note, t);
      }
      await this.adminEvaluationRepo.deleteHistoryEvaluationFixed(periodId, t);
      await t.commit();
    } catch (error) {
      await t.rollback();
      throw new RuntimeException('faild', 500);
    }

    return 1;
  }

  async getAllDepartmentsWithSubClass(companyGroupCode: string) {
    return await this.adminEvaluationRepo.getAllDepartmentsWithSubClass(
      companyGroupCode,
    );
  }

  async addProSkill(payload: AddProSkillDto, companyGroupCode: string) {
    return await this.adminEvaluationRepo.addProSkill(
      payload,
      companyGroupCode,
    );
  }

  async editProSkill(
    skillId: number,
    payload: EditProskillDto,
    companyGroupCode: string,
  ) {
    return await this.adminEvaluationRepo.editProSkill(
      skillId,
      payload,
      companyGroupCode,
    );
  }

  async exportHistoryEvaluation(params: any, companyGroupCode?: string) {
    const {
      division = null,
      department = null,
      userInfo = null,
      status = null,
      yearStart,
      yearEnd,
    } = params;

    return await this.adminEvaluationRepo.exportHistoryEvaluation(
      division,
      department,
      userInfo,
      status,
      yearStart,
      yearEnd,
      companyGroupCode,
    );
  }

  // funcition
  findStringStatus = (dataList: any): string => {
    let stringStatus: string;
    if (dataList.status !== 50) {
      stringStatus = statusEvaluation[dataList.status];
    } else {
      const today = moment().format('YYYY/MM/DD');

      if (dataList.evaluationPeriod) {
        if (dataList.level < 8) {
          if (
            today >=
              moment(dataList.evaluationPeriod.dateEvaluationStart).format(
                'YYYY/MM/DD',
              ) &&
            today <=
              moment(dataList.evaluationPeriod.dateEvaluationEnd).format(
                'YYYY/MM/DD',
              )
          ) {
            stringStatus = statusEvaluation[dataList.status].split('/')[1];
          } else stringStatus = statusEvaluation[dataList.status].split('/')[0];
        } else {
          if (
            today >=
              moment(
                dataList.evaluationPeriod.dateEvaluationDepartmentStart,
              ).format('YYYY/MM/DD') &&
            today <=
              moment(
                dataList.evaluationPeriod.dateEvaluationDepartmentEnd,
              ).format('YYYY/MM/DD')
          ) {
            stringStatus = statusEvaluation[dataList.status].split('/')[1];
          } else stringStatus = statusEvaluation[dataList.status].split('/')[0];
        }
      } else stringStatus = statusEvaluation[dataList.status].split('/')[0];
    }
    return stringStatus;
  };

  async getDataExcel(params: any, companyGroupCode: string, timeZone: string) {
    return await this.adminEvaluationRepo.getDataExcel(
      params,
      companyGroupCode,
      timeZone,
    );
  }
}
