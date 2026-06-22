import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repository/user.repository';
import { UserRepositoryI } from 'src/interfaces/repository/user.repository.interface';
import { sendEmailsWith } from 'src/common/mail/util';
import {
  startEvaluationPeriodTemplate,
  startEvaluationPeriodTemplate1,
  startEvaluationPeriodTemplate2,
  startGoalSettingPeriodTemplate,
  startGoalSettingPeriodTemplate1,
  startGoalSettingPeriodTemplate2,
  updateEvaluationTimeTemplate,
  updateEvaluationTimeTemplate1,
  updateEvaluationTimeTemplate2,
  updateGoalSettingTimeTemplate,
  updateGoalSettingTimeTemplate1,
  updateGoalSettingTimeTemplate2,
  publicBasicSkillTemplate,
  publicBehaviorTemplate,
} from 'src/common/mail/mailTemplates';
import { EvaluationPeriodRepository } from 'src/repository/evaluationPeriod.repository';
import { EvaluationRepository } from 'src/repository/evaluation.repository';
import { EvaluationRepositoryI } from 'src/interfaces/repository/evaluation.repository.interface';
import { ProSkillSettingRepository } from 'src/repository/proSkillSetting.repository';
import { ProSkillRepository } from 'src/repository/proSkill.repository';
import { checkDupliateMail, encrypt, isFormatDate } from 'src/common/util';
import { config } from 'dotenv';
import { resolve } from 'path';
import { MailSettingRepository } from 'src/repository/mailSetting.repository';
import { HistoryCronJobRepository } from 'src/repository/historyCronjob.repository';
import { MailSettingRepositoryI } from 'src/interfaces/repository/mailSetting.repository.interface';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import {
  SendMailBody,
  SendMailNowBody,
  SendMailRemindBody,
} from 'src/interfaces/service/mailSetting.service.interface';
import { EditMailTemplateObj } from 'src/model/request/MailManagementDto';
import { TemplateMailId, day } from 'src/enum/TemplateMailId';
import { EvaluationPeriod } from 'src/entity/EvaluationPeriod';
import { Evaluator } from 'src/entity/Evaluator';
import { EvaluatorInfo } from 'src/interfaces/service/evaluation.service.interface';
import { Op, Transaction } from 'sequelize';
import { Request } from 'express';
import { statusFeedback, typeFeedback } from 'src/common/ReplaceKeyword';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const moment = require('moment');
// moment.tz.setDefault('Asia/Tokyo');
import * as moment from 'moment';
config({ path: resolve(__dirname, '../../.env') });
@Injectable()
export class MailService {
  @Inject(UserRepository)
  private userRepo: UserRepositoryI;
  @Inject(EvaluationPeriodRepository)
  private evaluationPeriodRepo: EvaluationPeriodRepository;
  @Inject(EvaluationRepository)
  private evaluationRepo: EvaluationRepositoryI;
  @Inject(ProSkillSettingRepository)
  private proSkillSettingRepo: ProSkillSettingRepository;
  @Inject(ProSkillRepository)
  private proSkillRepo: ProSkillRepository;
  @Inject(MailSettingRepository)
  private mailSettingRepo: MailSettingRepositoryI;

  @Inject(HistoryCronJobRepository)
  private historyCronJobRepository: HistoryCronJobRepository;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  DATE_FORMAT = 'YYYY/M/DD';

  async sendMailStartGoalSetting(
    period: any,
    type: number,
    listToMail: string[],
    ccEmail: string[],
  ) {
    const toEmails: string[] = [];
    let titleEmail = ``;
    let infoEmail = ``;
    if (listToMail) {
      if (type === 2) {
        titleEmail = period.checkNew
          ? startGoalSettingPeriodTemplate2().title
          : updateGoalSettingTimeTemplate2().title;
        infoEmail = period.checkNew
          ? startGoalSettingPeriodTemplate2().body
          : updateGoalSettingTimeTemplate2().body;
      }
      if (type === 1) {
        titleEmail = period.checkNew
          ? startGoalSettingPeriodTemplate1().title
          : updateGoalSettingTimeTemplate1().title;
        infoEmail = period.checkNew
          ? startGoalSettingPeriodTemplate1().body
          : updateGoalSettingTimeTemplate1().body;
      }
      if (type === 3) {
        titleEmail = period.checkNew
          ? startGoalSettingPeriodTemplate().title
          : updateGoalSettingTimeTemplate().title;
        infoEmail = period.checkNew
          ? startGoalSettingPeriodTemplate().body
          : updateGoalSettingTimeTemplate().body;
      }
      let periodString = '';
      if (period.periodIndex === 1) periodString = '上期';
      if (period.periodIndex === 2) periodString = '下期';

      const dateCreationGoalEndMonth = period.dateCreationGoalEnd
        ? moment(period.dateCreationGoalEnd).month() + 1
        : '';
      const dateCreationGoalEndDay = period.dateCreationGoalEnd
        ? moment(period.dateCreationGoalEnd).date()
        : '';
      const dateCreationGoalEndDOW =
        Object.values(day)[
          period.dateCreationGoalEnd
            ? moment(period.dateCreationGoalEnd).day()
            : 0
        ];
      const dayCreationGoalEnd = `${dateCreationGoalEndMonth}月${dateCreationGoalEndDay}日 (${dateCreationGoalEndDOW})`;

      toEmails.push(...listToMail);

      //title
      titleEmail = titleEmail.replace(/{{evaluationYear}}/gi, period.year);
      titleEmail = titleEmail.replace(/{{evaluationPeriod}}/gi, periodString);
      titleEmail = titleEmail.replace(
        /{{periodStartMonth}}/gi,
        period.periodStart,
      );
      titleEmail = titleEmail.replace(/{{periodEndMonth}}/gi, period.periodEnd);
      titleEmail = titleEmail.replace(
        /{{goalCreateStartDate}}/gi,
        period.dateCreationGoalStart,
      );
      titleEmail = titleEmail.replace(
        /{{dayCreationGoalEnd}}/gi,
        dayCreationGoalEnd,
      );
      titleEmail = titleEmail.replace(
        /{{goalCreateEndDate}}/gi,
        period.dateCreationGoalEnd,
      );
      titleEmail = titleEmail.replace(
        /{{dateCreationGoalDepartmentStart}}/gi,
        period.dateCreationGoalDepartmentStart,
      );
      titleEmail = titleEmail.replace(
        /{{dateCreationGoalDepartmentEnd}}/gi,
        period.dateCreationGoalDepartmentEnd,
      );
      titleEmail = titleEmail.replace(
        /{{detailUrl}}/gi,
        `${process.env.HOSTNAME_}/user/list-evaluation`,
      );

      //content
      infoEmail = infoEmail.replace(/{{evaluationYear}}/gi, period.year);
      infoEmail = infoEmail.replace(/{{evaluationPeriod}}/gi, periodString);
      infoEmail = infoEmail.replace(
        /{{periodStartMonth}}/gi,
        period.periodStart,
      );
      infoEmail = infoEmail.replace(/{{periodEndMonth}}/gi, period.periodEnd);
      infoEmail = infoEmail.replace(
        /{{dayCreationGoalEnd}}/gi,
        dayCreationGoalEnd,
      );
      infoEmail = infoEmail.replace(
        /{{goalCreateStartDate}}/gi,
        period.dateCreationGoalStart,
      );
      infoEmail = infoEmail.replace(
        /{{goalCreateEndDate}}/gi,
        period.dateCreationGoalEnd,
      );
      infoEmail = infoEmail.replace(
        /{{dateCreationGoalDepartmentStart}}/gi,
        period.dateCreationGoalDepartmentStart,
      );
      infoEmail = infoEmail.replace(
        /{{dateCreationGoalDepartmentEnd}}/gi,
        period.dateCreationGoalDepartmentEnd,
      );
      infoEmail = infoEmail.replace(
        /{{detailUrl}}/gi,
        `${process.env.HOSTNAME_}/user/list-evaluation`,
      );
    }

    return await sendEmailsWith(toEmails, ccEmail, titleEmail, infoEmail);
  }
  async sendMailStartEvaluation(
    period: any,
    type: number,
    listToMail: string[],
    ccEmail: string[],
  ) {
    let titleEmail = ``;
    let infoEmail = ``;

    if (type === 2) {
      titleEmail = period.checkNew
        ? startEvaluationPeriodTemplate2().title
        : updateEvaluationTimeTemplate2().title;
      infoEmail = period.checkNew
        ? startEvaluationPeriodTemplate2().body
        : updateEvaluationTimeTemplate2().body;
    }
    if (type === 1) {
      titleEmail = period.checkNew
        ? startEvaluationPeriodTemplate1().title
        : updateEvaluationTimeTemplate1().title;
      infoEmail = period.checkNew
        ? startEvaluationPeriodTemplate1().body
        : updateEvaluationTimeTemplate1().body;
    }
    if (type === 3) {
      titleEmail = period.checkNew
        ? startEvaluationPeriodTemplate().title
        : updateEvaluationTimeTemplate().title;
      infoEmail = period.checkNew
        ? startEvaluationPeriodTemplate().body
        : updateEvaluationTimeTemplate().body;
    }
    let periodString = '';
    if (period.periodIndex === 1) periodString = '上期';
    if (period.periodIndex === 2) periodString = '下期';

    //title
    titleEmail = titleEmail.replace(/{{evaluationYear}}/gi, period.year);
    titleEmail = titleEmail.replace(/{{evaluationPeriod}}/gi, periodString);
    titleEmail = titleEmail.replace(
      /{{periodStartMonth}}/gi,
      period.periodStart,
    );
    titleEmail = titleEmail.replace(/{{periodEndMonth}}/gi, period.periodEnd);
    titleEmail = titleEmail.replace(
      /{{evaluationStartDate}}/gi,
      period.dateEvaluationStart,
    );
    titleEmail = titleEmail.replace(
      /{{evaluationEndDate}}/gi,
      period.dateEvaluationEnd,
    );
    titleEmail = titleEmail.replace(
      /{{dateEvaluationDepartmentStart}}/gi,
      period.dateEvaluationDepartmentStart,
    );
    titleEmail = titleEmail.replace(
      /{{dateEvaluationDepartmentEnd}}/gi,
      period.dateEvaluationDepartmentEnd,
    );
    titleEmail = titleEmail.replace(
      /{{detailUrl}}/gi,
      `${process.env.HOSTNAME_}/user/list-evaluation`,
    );

    //content
    infoEmail = infoEmail.replace(/{{evaluationYear}}/gi, period.year);
    infoEmail = infoEmail.replace(/{{evaluationPeriod}}/gi, periodString);
    infoEmail = infoEmail.replace(/{{periodStartMonth}}/gi, period.periodStart);
    infoEmail = infoEmail.replace(/{{periodEndMonth}}/gi, period.periodEnd);
    infoEmail = infoEmail.replace(
      /{{evaluationStartDate}}/gi,
      period.dateEvaluationStart,
    );
    infoEmail = infoEmail.replace(
      /{{evaluationEndDate}}/gi,
      period.dateEvaluationEnd,
    );
    infoEmail = infoEmail.replace(
      /{{dateEvaluationDepartmentStart}}/gi,
      period.dateEvaluationDepartmentStart,
    );
    infoEmail = infoEmail.replace(
      /{{dateEvaluationDepartmentEnd}}/gi,
      period.dateEvaluationDepartmentEnd,
    );
    infoEmail = infoEmail.replace(
      /{{detailUrl}}/gi,
      `${process.env.HOSTNAME_}/user/list-evaluation`,
    );
    return await sendEmailsWith(listToMail, ccEmail, titleEmail, infoEmail);
  }
  async sendMailRejectGoalSetting(
    evaluatorId: number,
    rejecteeId: number,
    ownerId: number,
    evaluationId: number,
    status: number,
    rejectCcList: any,
    hostName: string,
    type: string,
    companyGroupCode: string,
  ) {
    // console.log({ rejectCcList });

    const userInfo = await this.userRepo.getUserDetailById(ownerId);
    const evaluatorInfo = await this.userRepo.getUserDetailById(evaluatorId);
    const rejecteeInfo = await this.userRepo.getUserDetailById(rejecteeId);
    const evaluationInfo = await this.evaluationRepo.getUpdateTime(
      evaluationId,
    );
    const toEmails: string[] = [];
    // const ccEmails: string[] = rejectCcList;
    const ccEmails: string[] = [];
    let titleEmail = ``;
    let infoEmail = ``;
    let { title, content } = await this.getTitleContentFromTemplateMailId(
      TemplateMailId.EVALUATOR_REJECTING,
      companyGroupCode,
    );
    titleEmail = title;
    infoEmail = content;
    if (userInfo && evaluatorInfo) {
      const encryptedId = encrypt(evaluationId.toString());
      let url = ``;
      if (![2, 52].includes(status)) {
        url = `${hostName}/evaluator/${type}/${encryptedId}`;
      } else {
        url = `${hostName}/user/${type}/${encryptedId}`;
      }
      toEmails.push(rejecteeInfo.email);
      let periodString = '';
      if (evaluationInfo.evaluationPeriod.periodIndex === 1)
        periodString = '上期';
      if (evaluationInfo.evaluationPeriod.periodIndex === 2)
        periodString = '下期';
      const period = status < 50 ? '目標' : '評価';
      let departmentName = ``;
      if ([1, 2, 3, 4, 5, 6, 7].includes(evaluatorInfo.level))
        departmentName = evaluatorInfo?.department.name;
      if ([8, 9, 10].includes(evaluatorInfo.level))
        departmentName = evaluatorInfo?.division.name;

      //title
      titleEmail = titleEmail.replace(
        /{{departmentName}}/gi,
        departmentName ?? '',
      );
      titleEmail = titleEmail.replace(
        /{{evaluateeName}}/gi,
        userInfo.fullName ?? '',
      );
      titleEmail = titleEmail.replace(/{{rejecter}}/gi, evaluatorInfo.fullName);
      titleEmail = titleEmail.replace(/{{rejectee}}/gi, rejecteeInfo.fullName);
      titleEmail = titleEmail.replace(
        /{{evaluationYear}}/gi,
        evaluationInfo.evaluationPeriod.year,
      );
      titleEmail = titleEmail.replace(/{{evaluationPeriod}}/gi, periodString);
      titleEmail = titleEmail.replace(
        /{{periodStartMonth}}/gi,
        evaluationInfo.evaluationPeriod.periodStart,
      );
      titleEmail = titleEmail.replace(
        /{{periodEndMonth}}/gi,
        evaluationInfo.evaluationPeriod.periodEnd,
      );
      titleEmail = titleEmail.replace(/{{evaluationType}}/gi, period);
      titleEmail = titleEmail.replace(/{{detailUrl}}/gi, url);

      //content
      infoEmail = infoEmail.replace(
        /{{departmentName}}/gi,
        departmentName ?? '',
      );
      infoEmail = infoEmail.replace(
        /{{evaluateeName}}/gi,
        userInfo.fullName ?? '',
      );
      infoEmail = infoEmail.replace(/{{rejecter}}/gi, evaluatorInfo.fullName);
      infoEmail = infoEmail.replace(/{{rejectee}}/gi, rejecteeInfo.fullName);
      infoEmail = infoEmail.replace(
        /{{evaluationYear}}/gi,
        evaluationInfo.evaluationPeriod.year,
      );
      infoEmail = infoEmail.replace(/{{evaluationPeriod}}/gi, periodString);
      infoEmail = infoEmail.replace(
        /{{periodStartMonth}}/gi,
        evaluationInfo.evaluationPeriod.periodStart,
      );
      infoEmail = infoEmail.replace(
        /{{periodEndMonth}}/gi,
        evaluationInfo.evaluationPeriod.periodEnd,
      );
      infoEmail = infoEmail.replace(/{{evaluationType}}/gi, period);
      infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);

      return await sendEmailsWith(toEmails, ccEmails, titleEmail, infoEmail);
    }
  }
  async sendMailApproveGoalSetting(
    approverId: number,
    ownerId: number,
    evaluationId: number,
    host: string,
    companyGroupCode: string,
  ) {
    const userInfo = await this.userRepo.getUserDetailById(ownerId); // lay theo hien tai
    const approverInfo = await this.userRepo.getUserDetailById(approverId);
    const evaluationInfo = await this.evaluationRepo.getUpdateTime(
      evaluationId,
    );
    const toEmails: string[] = [];
    const ccEmails: string[] = [];
    let titleEmail = ``;
    let infoEmail = ``;

    const { title, content } = await this.getTitleContentFromTemplateMailId(
      TemplateMailId.EVAL_APPROVE_GOAL_SETTING,
      companyGroupCode,
    );
    titleEmail = title;
    infoEmail = content;
    if (userInfo) {
      const encryptedId = encrypt(evaluationId.toString());
      const url = `${host}/${encryptedId}`;
      toEmails.push(approverInfo.email);
      let departmentName = ``;
      if ([1, 2, 3, 4, 5, 6, 7].includes(userInfo.level))
        departmentName = userInfo?.department.name;
      if ([8, 9, 10].includes(userInfo.level))
        departmentName = userInfo?.division.name;

      let periodString = '';
      if (evaluationInfo.evaluationPeriod.periodIndex === 1)
        periodString = '上期';
      if (evaluationInfo.evaluationPeriod.periodIndex === 2)
        periodString = '下期';

      //title
      titleEmail = titleEmail.replace(
        /{{evaluatorName}}/gi,
        approverInfo.fullName,
      );
      titleEmail = titleEmail.replace(
        /{{departmentName}}/gi,
        departmentName ?? '',
      );
      titleEmail = titleEmail.replace(/{{evaluateeName}}/gi, userInfo.fullName);
      titleEmail = titleEmail.replace(
        /{{evaluationYear}}/gi,
        evaluationInfo.evaluationPeriod.year,
      );
      titleEmail = titleEmail.replace(/{{evaluationPeriod}}/gi, periodString);
      titleEmail = titleEmail.replace(
        /{{periodStartMonth}}/gi,
        evaluationInfo.evaluationPeriod.periodStart,
      );
      titleEmail = titleEmail.replace(
        /{{periodEndMonth}}/gi,
        evaluationInfo.evaluationPeriod.periodEnd,
      );
      titleEmail = titleEmail.replace(/{{detailUrl}}/gi, url);

      //content
      infoEmail = infoEmail.replace(
        /{{evaluatorName}}/gi,
        approverInfo.fullName,
      );
      infoEmail = infoEmail.replace(
        /{{departmentName}}/gi,
        departmentName ?? '',
      );
      infoEmail = infoEmail.replace(/{{evaluateeName}}/gi, userInfo.fullName);
      infoEmail = infoEmail.replace(
        /{{evaluationYear}}/gi,
        evaluationInfo.evaluationPeriod.year,
      );
      infoEmail = infoEmail.replace(/{{evaluationPeriod}}/gi, periodString);
      infoEmail = infoEmail.replace(
        /{{periodStartMonth}}/gi,
        evaluationInfo.evaluationPeriod.periodStart,
      );
      infoEmail = infoEmail.replace(
        /{{periodEndMonth}}/gi,
        evaluationInfo.evaluationPeriod.periodEnd,
      );
      infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);

      return await sendEmailsWith(toEmails, ccEmails, titleEmail, infoEmail);
    }
  }

  //Gửi mail khi người đánh giá 2 approve
  async sendMailEvaluatorApproved(
    evaluators: Evaluator[] | EvaluatorInfo[],
    ownerId: number,
    evaluationId: number,
    host: string,
    companyGroupCode: string,
  ) {
    const userInfo = await this.userRepo.getUserDetailById(ownerId); // lay theo hien tai
    const evaluationInfo = await this.evaluationRepo.getUpdateTime(
      evaluationId,
    );
    const toEmails: string[] = [];
    const ccEmails: string[] = [];
    let titleEmail = ``;
    let infoEmail = ``;

    for (const evaluator of evaluators) {
      const infoEvaluator = await this.userRepo.getUserDetailById(
        evaluator.evaluatorId,
      );
      ccEmails.push(infoEvaluator.email);
    }

    const { title, content } = await this.getTitleContentFromTemplateMailId(
      19,
      companyGroupCode,
      //TemplateMailId.EVALUATOR_2_APPROVED_EVALUATION,
    );
    titleEmail = title;
    infoEmail = content;
    if (userInfo) {
      const encryptedId = encrypt(evaluationId.toString());
      const url = `${host}/${encryptedId}`;
      toEmails.push(userInfo.email);
      let departmentName = ``;
      if ([1, 2, 3, 4, 5, 6, 7].includes(userInfo.level))
        departmentName = userInfo?.department.name;
      if ([8, 9, 10].includes(userInfo.level))
        departmentName = userInfo?.division.name;

      let periodString = '';
      if (evaluationInfo.evaluationPeriod.periodIndex === 1)
        periodString = '上期';
      if (evaluationInfo.evaluationPeriod.periodIndex === 2)
        periodString = '下期';

      //title
      titleEmail = titleEmail.replace(
        /{{departmentName}}/gi,
        departmentName ?? '',
      );
      titleEmail = titleEmail.replace(/{{evaluateeName}}/gi, userInfo.fullName);
      titleEmail = titleEmail.replace(
        /{{evaluationYear}}/gi,
        evaluationInfo.evaluationPeriod.year,
      );
      titleEmail = titleEmail.replace(/{{evaluationPeriod}}/gi, periodString);
      titleEmail = titleEmail.replace(
        /{{periodStartMonth}}/gi,
        evaluationInfo.evaluationPeriod.periodStart,
      );
      titleEmail = titleEmail.replace(
        /{{periodEndMonth}}/gi,
        evaluationInfo.evaluationPeriod.periodEnd,
      );
      titleEmail = titleEmail.replace(/{{detailUrl}}/gi, url);

      //content
      infoEmail = infoEmail.replace(
        /{{departmentName}}/gi,
        departmentName ?? '',
      );
      infoEmail = infoEmail.replace(/{{evaluateeName}}/gi, userInfo.fullName);
      infoEmail = infoEmail.replace(
        /{{evaluationYear}}/gi,
        evaluationInfo.evaluationPeriod.year,
      );
      infoEmail = infoEmail.replace(/{{evaluationPeriod}}/gi, periodString);
      infoEmail = infoEmail.replace(
        /{{periodStartMonth}}/gi,
        evaluationInfo.evaluationPeriod.periodStart,
      );
      infoEmail = infoEmail.replace(
        /{{periodEndMonth}}/gi,
        evaluationInfo.evaluationPeriod.periodEnd,
      );
      infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);

      return await sendEmailsWith(toEmails, ccEmails, titleEmail, infoEmail);
    }
  }

  async submitGoalAndEvaluation(
    submitTo: number,
    ownerId: number,
    evaluationInfo: any,
    host: string,
  ) {
    const userInfo = await this.userRepo.getUserDetailById(ownerId); // lay theo hien tai
    const submitToInfo = await this.userRepo.getUserDetailById(submitTo);
    // const evaluationInfo = await this.evaluationRepo.getUpdateTime(
    //   evaluationId,
    // );
    const toEmails: string[] = [];
    const ccEmails: string[] = [];
    let titleEmail = ``;
    let infoEmail = ``;
    if (evaluationInfo.status < 50) {
      // titleEmail = evaluatorApproveGoalSettingTemplate().title;
      // infoEmail = evaluatorApproveGoalSettingTemplate().body;
      const { title, content } = await this.getTitleContentFromTemplateMailId(
        TemplateMailId.EVAL_APPROVE_GOAL_SETTING,
        evaluationInfo.evaluationPeriod.companyGroupCode,
      );
      titleEmail = title;
      infoEmail = content;
    } else {
      const { title, content } = await this.getTitleContentFromTemplateMailId(
        TemplateMailId.SUBMIT_GOAL_AND_EVALUATION,
        evaluationInfo.evaluationPeriod.companyGroupCode,
      );
      titleEmail = title;
      infoEmail = content;
    }

    if (userInfo) {
      const encryptedId = encrypt(evaluationInfo.id.toString());
      const url = `${host}/${encryptedId}`;
      toEmails.push(submitToInfo.email);
      let departmentName = ``;
      if ([1, 2, 3, 4, 5, 6, 7].includes(userInfo.level))
        departmentName = userInfo?.department.name;
      if ([8, 9, 10].includes(userInfo.level))
        departmentName = userInfo?.division.name;

      let periodString = '';
      if (evaluationInfo.evaluationPeriod.periodIndex === 1)
        periodString = '上期';
      if (evaluationInfo.evaluationPeriod.periodIndex === 2)
        periodString = '下期';

      //title
      titleEmail = titleEmail.replace(
        /{{evaluatorName}}/gi,
        submitToInfo.fullName,
      );
      titleEmail = titleEmail.replace(
        /{{departmentName}}/gi,
        departmentName ?? '',
      );
      titleEmail = titleEmail.replace(/{{evaluateeName}}/gi, userInfo.fullName);
      titleEmail = titleEmail.replace(
        /{{evaluationYear}}/gi,
        evaluationInfo.evaluationPeriod.year,
      );
      titleEmail = titleEmail.replace(/{{evaluationPeriod}}/gi, periodString);
      titleEmail = titleEmail.replace(
        /{{periodStartMonth}}/gi,
        evaluationInfo.evaluationPeriod.periodStart,
      );
      titleEmail = titleEmail.replace(
        /{{periodEndMonth}}/gi,
        evaluationInfo.evaluationPeriod.periodEnd,
      );
      titleEmail = titleEmail.replace(/{{detailUrl}}/gi, url);

      //content
      infoEmail = infoEmail.replace(
        /{{evaluatorName}}/gi,
        submitToInfo.fullName,
      );
      infoEmail = infoEmail.replace(
        /{{departmentName}}/gi,
        departmentName ?? '',
      );
      infoEmail = infoEmail.replace(/{{evaluateeName}}/gi, userInfo.fullName);
      infoEmail = infoEmail.replace(
        /{{evaluationYear}}/gi,
        evaluationInfo.evaluationPeriod.year,
      );
      infoEmail = infoEmail.replace(/{{evaluationPeriod}}/gi, periodString);
      infoEmail = infoEmail.replace(
        /{{periodStartMonth}}/gi,
        evaluationInfo.evaluationPeriod.periodStart,
      );
      infoEmail = infoEmail.replace(
        /{{periodEndMonth}}/gi,
        evaluationInfo.evaluationPeriod.periodEnd,
      );
      infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);
      return await sendEmailsWith(toEmails, ccEmails, titleEmail, infoEmail);
    }
  }
  async sendMailPublicAllEvaluationForUser(
    list: any,
    host: string,
    companyGroupCode: string,
  ) {
    const condition = { active: 1, companyGroupCode: companyGroupCode };
    const evaluationPeriodList = await this.userRepo.getUserListForMail(
      condition,
      [1],
    );
    let toEmails: string[] = [];
    const ccEmails: string[] = [];
    let titleEmail = ``;
    let infoEmail = ``;
    const tempIdList = [];
    evaluationPeriodList.map((user: any) => {
      tempIdList.push(user.id);
    });
    if (evaluationPeriodList) {
      for (const evaluationInfo of list) {
        toEmails = [];
        let url = ``;
        titleEmail = ``;
        infoEmail = ``;
        if (tempIdList.includes(evaluationInfo.userId)) {
          evaluationPeriodList.map((user: any) => {
            if (user.id === evaluationInfo.userId) toEmails.push(user.email);
          });
          // get url
          // if an user is also an evaluator => send 1 mail to this user with 2 urls
          const encryptedId = encrypt(evaluationInfo.id.toString());

          if (checkDupliateMail(list, evaluationInfo.userId)) {
            if (evaluationInfo.level < 8) {
              url = `${host}/user/evaluation/${encryptedId} <br>
              ${host}/evaluator/list-user-evaluation`;
            } else {
              url = `${host}/user/evaluation-8-10/${encryptedId} <br>
              ${host}/evaluator/list-user-evaluation`;
            }
          } else {
            if (evaluationInfo.level < 8) {
              url = `${host}/user/evaluation/${encryptedId}`;
            } else {
              url = `${host}/user/evaluation-8-10/${encryptedId}`;
            }
          }
        }

        const { title, content } = await this.getTitleContentFromTemplateMailId(
          TemplateMailId.ADMIN_PUBLIC_EVALUATION,
          companyGroupCode,
        );
        titleEmail = title;
        infoEmail = content;
        let periodString = '';
        if (evaluationInfo.evaluationPeriod.periodIndex === 1)
          periodString = '上期';
        if (evaluationInfo.evaluationPeriod.periodIndex === 2)
          periodString = '下期';

        //title
        titleEmail = titleEmail.replace(
          /{{evaluationYear}}/gi,
          evaluationInfo.evaluationPeriod.year,
        );
        titleEmail = titleEmail.replace(/{{evaluationPeriod}}/gi, periodString);
        titleEmail = titleEmail.replace(/{{detailUrl}}/gi, url);

        //content
        infoEmail = infoEmail.replace(
          /{{evaluationYear}}/gi,
          evaluationInfo.evaluationPeriod.year,
        );
        infoEmail = infoEmail.replace(/{{evaluationPeriod}}/gi, periodString);
        infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);
        // eslint-disable-next-line no-await-in-loop
        await sendEmailsWith(toEmails, ccEmails, titleEmail, infoEmail);
      }
    }
    return;
  }

  async sendMailPublicAllEvaluationForEvaluator(
    list: any,
    host: string,
    companyGroupCode: string,
  ) {
    const evaluatorMailList: string[] = [];
    const tempList = list.map((evaluation: any) => evaluation.userId);
    list.map((user: any) => {
      // if an user is also an evaluator => send 1 mail to this user with 2 urls
      if (user.evaluator) {
        user.evaluator.map((evaluator: any) => {
          if (!tempList.includes(evaluator.evaluatorId)) {
            evaluatorMailList.push(evaluator.user.email);
          }
        });
      }
    });
    let toEmails: string[] = [];
    const ccEmails: string[] = [];
    let titleEmail = ``;
    let infoEmail = ``;

    toEmails = evaluatorMailList.filter((item, pos) => {
      return evaluatorMailList.indexOf(item) == pos;
    });

    if (evaluatorMailList) {
      const url = `${host}/evaluator/list-user-evaluation`;

      const { title, content } = await this.getTitleContentFromTemplateMailId(
        TemplateMailId.ADMIN_PUBLIC_EVALUATION,
        companyGroupCode,
      );
      titleEmail = title;
      infoEmail = content;
      let periodString = '';
      if (list[0].evaluationPeriod.periodIndex === 1) periodString = '上期';
      if (list[0].evaluationPeriod.periodIndex === 2) periodString = '下期';

      //title
      titleEmail = titleEmail.replace(
        /{{evaluationYear}}/gi,
        list[0].evaluationPeriod.year,
      );
      titleEmail = titleEmail.replace(/{{evaluationPeriod}}/gi, periodString);
      titleEmail = titleEmail.replace(/{{detailUrl}}/gi, url);

      //content
      infoEmail = infoEmail.replace(
        /{{evaluationYear}}/gi,
        list[0].evaluationPeriod.year,
      );
      infoEmail = infoEmail.replace(/{{evaluationPeriod}}/gi, periodString);
      infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);
      // eslint-disable-next-line no-await-in-loop
      await sendEmailsWith(toEmails, ccEmails, titleEmail, infoEmail);
    }
    return;
  }
  async submitProSkill(data: any, host: string, companyGroupCode: string) {
    const userList =
      await this.proSkillSettingRepo.findDepartmentRoleByDepartmentId(
        data.skillId,
        2,
      );

    const toEmails: string[] = [];
    const ccEmails: string[] = [];
    let titleEmail = ``;
    let infoEmail = ``;
    for (const skill of userList) {
      toEmails.push(skill.user.email);
    }

    const { title, content } = await this.getTitleContentFromTemplateMailId(
      TemplateMailId.REQUEST_PRO_SKILL_APPROVE,
      companyGroupCode,
    );
    titleEmail = title;
    infoEmail = content;

    if (data) {
      const encryptedId = encrypt(data.versionId.toString());
      const encryptedSkillId = encrypt(data.skillId.toString());
      const url = `${host}/company/${companyGroupCode}/pro-skill-approval/detail-pro-skill-approve/${encryptedSkillId}/${encryptedId}`;
      const version = data.versionMain + '.' + data.versionSub;

      //title
      titleEmail = titleEmail.replace(
        /{{proskillCreatorName}}/gi,
        data.createdUser.fullName,
      );
      titleEmail = titleEmail.replace(
        /{{proskillName}}/gi,
        data.skillName ?? '',
      );
      titleEmail = titleEmail.replace(/{{versionProskill}}/gi, version);
      titleEmail = titleEmail.replace(/{{detailUrl}}/gi, url);

      //content
      infoEmail = infoEmail.replace(
        /{{proskillCreatorName}}/gi,
        data.createdUser.fullName,
      );
      infoEmail = infoEmail.replace(/{{proskillName}}/gi, data.skillName ?? '');
      infoEmail = infoEmail.replace(/{{versionProskill}}/gi, version);
      infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);
      return await sendEmailsWith(toEmails, ccEmails, titleEmail, infoEmail);
    }
  }
  async sendMailApproveProSkillToAdmin(
    data: any,
    hostName: string,
    companyGroupCode: string,
  ) {
    const condition = { active: 1, companyGroupCode: companyGroupCode };
    const userList = await this.userRepo.getUserListForMail(condition, [6]);
    const toEmails: string[] = [];
    const ccEmails: string[] = [];
    let titleEmail = ``;
    let infoEmail = ``;
    for (const user of userList) {
      toEmails.push(user.email);
    }

    const { title, content } = await this.getTitleContentFromTemplateMailId(
      TemplateMailId.APPROVE_PRO_SKILL_VERSION_TO_ADMIN,
      companyGroupCode,
    );
    titleEmail = title;
    infoEmail = content;
    if (data) {
      const encryptedId = encrypt(data.id.toString());
      const url = `${hostName}/company/${companyGroupCode}/admin-evaluation/detail-pro-skill/${encryptedId}`;
      const version = data.version + '.' + data.subVersion;

      //title
      titleEmail = titleEmail.replace(
        /{{proskillName}}/gi,
        data.skill.name ?? '',
      );
      titleEmail = titleEmail.replace(/{{versionProskill}}/gi, version);
      titleEmail = titleEmail.replace(/{{detailUrl}}/gi, url);

      //content
      infoEmail = infoEmail.replace(
        /{{proskillName}}/gi,
        data.skill.name ?? '',
      );
      infoEmail = infoEmail.replace(/{{versionProskill}}/gi, version);
      infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);
      return await sendEmailsWith(toEmails, ccEmails, titleEmail, infoEmail);
    }
  }
  async sendMailApproveProSkillToOther(
    data: any,
    approverId: number,
    hostName: string,
    companyGroupCode: string,
  ) {
    const userList = await this.proSkillSettingRepo.findSkillRoleBySkillId(
      data.skillId,
      2,
    );
    const toEmails: string[] = [];
    const ccEmails: string[] = [];
    let titleEmail = ``;
    let infoEmail = ``;
    for (const user of userList) {
      if (user.user.id !== approverId) toEmails.push(user.user.email);
    }

    const { title, content } = await this.getTitleContentFromTemplateMailId(
      TemplateMailId.APPROVE_PRO_SKILL_VERSION_TO_OTHER,
      companyGroupCode,
    );
    titleEmail = title;
    infoEmail = content;
    if (data) {
      const encryptedId = encrypt(data.id.toString());
      const encryptedDepartmentId = encrypt(data.skillId.toString());
      const url = `${hostName}/company/${companyGroupCode}/pro-skill-approval/detail-pro-skill-approve/${encryptedDepartmentId}/${encryptedId}`;
      const version = data.version + '.' + data.subVersion;

      //title
      titleEmail = titleEmail.replace(
        /{{proskillName}}/gi,
        data.skill.name ?? '',
      );
      titleEmail = titleEmail.replace(/{{versionProskill}}/gi, version);
      titleEmail = titleEmail.replace(/{{detailUrl}}/gi, url);

      //content
      infoEmail = infoEmail.replace(
        /{{proskillName}}/gi,
        data.skill.name ?? '',
      );
      infoEmail = infoEmail.replace(/{{versionProskill}}/gi, version);
      infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);
      return await sendEmailsWith(toEmails, ccEmails, titleEmail, infoEmail);
    }
  }
  async sendMailRejectProSkill(
    data: any,
    approverId: number,
    hostName: string,
    companyGroupCode: string,
  ) {
    const proskillSetterList =
      await this.proSkillSettingRepo.findSkillRoleBySkillId(data.skillId, 1);
    const proskillApproverList =
      await this.proSkillSettingRepo.findSkillRoleBySkillId(data.skillId, 2);

    const toEmails: string[] = [];
    const ccEmails: string[] = [];
    let titleEmail = ``;
    let infoEmail = ``;
    for (const user of proskillSetterList) {
      if (user.user.id !== approverId) toEmails.push(user.user.email);
    }
    for (const user of proskillApproverList) {
      if (user.user.id !== approverId) ccEmails.push(user.user.email);
    }

    const { title, content } = await this.getTitleContentFromTemplateMailId(
      TemplateMailId.REJECT_PRO_SKILL_VERSION,
      companyGroupCode,
    );
    titleEmail = title;
    infoEmail = content;
    if (data) {
      const encryptedId = encrypt(data.id.toString());
      const url = `${hostName}/company/${companyGroupCode}/pro-setting/detail-pro-skill/${encryptedId}`;
      const version = data.version + '.' + data.subVersion;

      //title
      titleEmail = titleEmail.replace(
        /{{proskillName}}/gi,
        data.skill.name ?? '',
      );
      titleEmail = titleEmail.replace(/{{versionProskill}}/gi, version);
      titleEmail = titleEmail.replace(/{{detailUrl}}/gi, url);

      //content
      infoEmail = infoEmail.replace(
        /{{proskillName}}/gi,
        data.skill.name ?? '',
      );
      infoEmail = infoEmail.replace(/{{versionProskill}}/gi, version);
      infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);
      return await sendEmailsWith(toEmails, ccEmails, titleEmail, infoEmail);
    }
  }
  async sendMailPublicBasicAndBehavior(
    version: string,
    subVersion: string,
    hostName: string,
    type: number,
    level: number,
  ) {
    let condition = {};
    if (type === 2) {
      condition = {
        active: 1,
        level: level,
        flagSkill: 1,
      };
    } else if (type === 3) {
      condition = {
        active: 1,
        level: level,
        flagSkill: 0,
      };
    } else {
      condition = { active: 1, level: [1, 2, 3, 4, 5, 6, 7] };
    }

    const userList = await this.userRepo.getUserListForMail(condition, [1]);
    const toEmails: string[] = [];
    const ccEmails: string[] = [];
    let titleEmail = ``;
    let infoEmail = ``;
    for (const user of userList) {
      toEmails.push(user.email);
    }
    if (type === 1) {
      titleEmail = publicBasicSkillTemplate().title;
      infoEmail = publicBasicSkillTemplate().body;
    } else {
      titleEmail = publicBehaviorTemplate().title;
      infoEmail = publicBehaviorTemplate().body;
    }
    if (version && subVersion !== undefined) {
      let url = ``;
      if (type === 1) url = `${hostName}/user/evaluation-reference-basic`;
      if (type === 2 || type === 3)
        url = `${hostName}/user/evaluation-reference-behavior`;
      titleEmail = titleEmail.replace(
        /{{versionProskill}}/gi,
        version + '.' + subVersion,
      );

      infoEmail = infoEmail.replace(
        /{{versionProskill}}/gi,
        version + '.' + subVersion,
      );
      if (type === 2 || type === 3) {
        infoEmail = infoEmail.replace(/{{level}}/gi, level.toString());
        titleEmail = titleEmail.replace(/{{level}}/gi, level.toString());
      }

      infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);
      return await sendEmailsWith(toEmails, ccEmails, titleEmail, infoEmail);
    }
  }

  async sendMailRejectProSkillFromAdmin(
    versionId: any,
    rejecterId: number,
    hostName: string,
    companyGroupCode: string,
  ) {
    const data = await this.proSkillRepo.getProSkillById(versionId);
    const proskillSetterList =
      await this.proSkillSettingRepo.findDepartmentRoleByDepartmentId(
        data.skillId,
        1,
      );
    const proskillApproverList =
      await this.proSkillSettingRepo.findDepartmentRoleByDepartmentId(
        data.skillId,
        2,
      );
    const toEmails: string[] = [];
    const ccEmails: string[] = [];
    let titleEmail = ``;
    let infoEmail = ``;
    for (const user of proskillSetterList) {
      if (user.user.id !== rejecterId) toEmails.push(user.user.email);
    }
    for (const user of proskillApproverList) {
      if (user.user.id !== rejecterId) ccEmails.push(user.user.email);
    }

    const { title, content } = await this.getTitleContentFromTemplateMailId(
      TemplateMailId.REJECT_PRO_SKILL_VERSION,
      companyGroupCode,
    );
    titleEmail = title;
    infoEmail = content;
    if (data) {
      const encryptedId = encrypt(data.id.toString());
      const url = `${hostName}/company/${companyGroupCode}/pro-setting/detail-pro-skill/${encryptedId}`;
      const version = data.version + '.' + data.subVersion;

      //title
      titleEmail = titleEmail.replace(
        /{{proskillName}}/gi,
        data.skill.name ?? '',
      );
      titleEmail = titleEmail.replace(/{{versionProskill}}/gi, version);
      titleEmail = titleEmail.replace(/{{detailUrl}}/gi, url);

      //content
      infoEmail = infoEmail.replace(
        /{{proskillName}}/gi,
        data.skill.name ?? '',
      );
      infoEmail = infoEmail.replace(/{{versionProskill}}/gi, version);
      infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);
      return await sendEmailsWith(toEmails, ccEmails, titleEmail, infoEmail);
    }
  }
  async sendMailFixedGoal(
    data: SendMailNowBody,
    mailList: string[],
    companyGroupCode: string,
    evaluationPeriodId?: number,
    type?: number,
  ) {
    // const toEmails: string[] = data.toEmails;
    const mailToObjList: string[] = mailList;
    const ccEmails: string[] = [];
    const titleMail = data.mailContent.subject;
    const infoMail = data.mailContent.editor;

    let periods = undefined;

    if (type === 8) {
      periods = await this.evaluationPeriodRepo.getPeriodListSendMailDepartment(
        {
          id: evaluationPeriodId,
          companyGroupCode: companyGroupCode,
        },
      );
    }

    for (const email of mailToObjList) {
      let toUserText = ``;
      // eslint-disable-next-line no-await-in-loop
      const username = await this.userRepo.getUserNameFromEmail(
        email,
        companyGroupCode,
      );

      if (type === 8 && periods && username) {
        const conditionCountException = {
          userId: username.id,
          evaluationPeriodId: evaluationPeriodId,
          creationUser: { [Op.ne]: null },
          dateEvaluationStart: { [Op.ne]: null },
          dateEvaluationEnd: { [Op.ne]: null },
          companyGroupCode: companyGroupCode,
        };

        const countException = await this.userRepo.countEvaluationException(
          conditionCountException,
        );

        if (countException > 0) {
          const condition17 = {
            userId: username.id,
            evaluationPeriodId: evaluationPeriodId,
            creationUser: { [Op.ne]: null },
            dateEvaluationStart: periods.dateEvaluationStart,
            dateEvaluationEnd: periods.dateEvaluationEnd,
            level: { [Op.lte]: 7 },
            companyGroupCode: companyGroupCode,
          };
          const exception17 = await this.userRepo.countEvaluationException(
            condition17,
          );

          const condition810 = {
            userId: username.id,
            evaluationPeriodId: evaluationPeriodId,
            creationUser: { [Op.ne]: null },
            dateEvaluationStart: periods.dateEvaluationDepartmentStart,
            dateEvaluationEnd: periods.dateEvaluationDepartmentEnd,
            level: { [Op.gte]: 8 },
            companyGroupCode: companyGroupCode,
          };
          const exception810 = await this.userRepo.countEvaluationException(
            condition810,
          );
          if (!exception17 && !exception810) {
            continue;
          }
        }
      }

      if (username) {
        toUserText += `${username?.fullName?.split(' ')[0]}${
          username?.fullName?.split(' ')?.length > 1 ? 'さん' : ''
        }<br><br>`;
      }

      // eslint-disable-next-line no-await-in-loop
      await sendEmailsWith(email, ccEmails, titleMail, toUserText + infoMail);
    }

    return { message: 'success' };
  }

  // Gửi mail To cho User và CC cho người đánh giá
  async sendMailFixedUserEvaluator(
    data: any,
    object: any,
    companyGroupCode: string,
    transaction?: Transaction,
    isTestSend: boolean = false,
  ) {
    const titleMail = data.mailContent.subject;

    for (const emailInfo of data.dataMailCCs) {
      const toUser = await this.userRepo.getUserByEmail(
        emailInfo?.user,
        companyGroupCode,
      );

      let infoEmail = data.mailContent.editor;
      infoEmail = infoEmail.replace(
        /{{toUser}}/gi,
        toUser?.fullName?.toString()?.split(' ')[0] +
          `${
            toUser?.fullName?.toString()?.split(' ')?.length > 1 ? 'さん' : ''
          }`,
      );

      // TO user (for test send, redirect to testEmail)
      const toEmails = [isTestSend ? data.testEmail : emailInfo.user];

      // CC evaluator — always look up names for {{ccEvaluator}} replacement,
      // but only add to ccEmails when not a test send
      const ccEmails: string[] = [];
      if (emailInfo.evaluators?.length > 0) {
        const listNameCCs = [];
        for (const evaluator of emailInfo.evaluators) {
          if (!isTestSend) {
            ccEmails.push(evaluator);
          }
          const nameCC = await this.userRepo.getUserByEmail(
            evaluator,
            companyGroupCode,
          );

          if (nameCC) {
            listNameCCs.push(nameCC.fullName);
          }
        }

        infoEmail = infoEmail.replace(
          /{{ccEvaluator}}/gi,
          listNameCCs
            .map(
              (e) =>
                `${e?.toString()?.split(' ')[0]}${
                  e?.toString()?.split(' ')?.length > 1 ? 'さん' : ''
                }`,
            )
            .join('、'),
        );
      } else {
        infoEmail = infoEmail.replace(/{{ccEvaluator}}/gi, '');
      }

      // eslint-disable-next-line no-await-in-loop
      await sendEmailsWith(toEmails, ccEmails, titleMail, infoEmail);

      if (!isTestSend) {
        const dtUpdate = {
          toEmails: toEmails.join(','),
          mailContent: {
            subject: titleMail,
            editor: infoEmail,
          },
          emailType: object.emailType,
          status: object.status,
          evaluationPeriodId: object.evaluationPeriodId,
          evaluationTime: object.evaluationTime,
          evaluationDepartmentTime: object.evaluationDepartmentTime,
          sendTimeActual: object.sendTimeActual,
          ccMails: ccEmails?.join(','),
        };

        await this.evaluationRepo.updateHistoryMail(
          dtUpdate,
          companyGroupCode,
          transaction,
        );
      }
    }

    return { message: 'success' };
  }

  // Gửi mail To cho evaluator
  async sendMailFixedEvaluator(
    data: any,
    object: any,
    companyGroupCode: string,
    transaction: Transaction,
    emailHR: string,
  ) {
    const isFilterStatus = data.isFilterStatus;

    const statusList =
      data.type === 'fixedGoal'
        ? [3, 4, 5, 6, 7, 8]
        : [53, 54, 55, 56, 57, 58, 59, 60, 61];

    const listEvaluations: any =
      await this.evaluationRepo.getInfoEvaluationMail(data.id, statusList);

    const evaluatorConfigs = [
      { key: '05', status: [3, 4, 53, 54, 55] },
      { key: '1', status: [5, 6, 56, 57, 58] },
      { key: '2', status: [7, 8, 59, 60, 61] },
    ];

    if (listEvaluations?.[0]?.length > 0) {
      for (const evaluation of listEvaluations[0]) {
        let titleMail = data.mailContent.subject;

        const toEmails = [];
        const encryptedId = encrypt(evaluation.id.toString());
        const typeDetail =
          evaluation.level > 7 ? 'evaluation-8-10' : 'evaluation';
        const url = `${process.env.HOSTNAME_}/company/${companyGroupCode}/evaluator/${typeDetail}/${encryptedId}`;

        // Tạo nội dung chính thay thế {{toUser}}
        const userName = evaluation.user_full_name?.split(' ')[0] ?? '';
        const userSuffix =
          evaluation.user_full_name?.split(' ').length > 1 ? 'さん' : '';
        let infoEmail = data.mailContent.editor.replace(
          /{{toUser}}/gi,
          `${userName}${userSuffix}`,
        );
        infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);
        infoEmail = infoEmail.replace(
          /{{userName}}/gi,
          evaluation.user_full_name,
        );
        infoEmail = infoEmail.replace(
          /{{divisionName}}/gi,
          evaluation.division_name,
        );
        infoEmail = infoEmail.replace(/{{level}}/gi, evaluation.level);

        titleMail = titleMail.replace(
          /{{toUser}}/gi,
          `${userName}${userSuffix}`,
        );
        titleMail = titleMail.replace(/{{detailUrl}}/gi, url);
        titleMail = titleMail.replace(
          /{{userName}}/gi,
          evaluation.user_full_name,
        );
        titleMail = titleMail.replace(
          /{{divisionName}}/gi,
          evaluation.division_name,
        );
        titleMail = titleMail.replace(/{{level}}/gi, evaluation.level);

        const emailHRIncluded =
          emailHR &&
          Array.isArray(data.toEmails) &&
          data.toEmails.includes(emailHR);
        if (emailHRIncluded) {
          toEmails.push(emailHR);
          await sendEmailsWith(toEmails, [], titleMail, infoEmail);
        }

        for (const config of evaluatorConfigs) {
          const emailKey =
            `evaluator_email_${config.key}` as keyof typeof evaluation;
          const nameKey =
            `evaluator_full_name_${config.key}` as keyof typeof evaluation;

          const emails = evaluation[emailKey];
          const names = evaluation[nameKey];

          const shouldSend = isFilterStatus
            ? config.status.includes(evaluation.status)
            : !!emails;

          if (emails && shouldSend) {
            let toUserText = '';
            if (names?.[0]) {
              const nameParts = names[0].split(' ');
              toUserText = `${nameParts[0]}${
                nameParts.length > 1 ? 'さん' : ''
              }<br><br>`;
            }

            toEmails.push(emails[0]);
            await sendEmailsWith(emails, [], titleMail, toUserText + infoEmail);
          }
        }

        // Lưu lịch sử gửi mail
        const dtUpdate = {
          toEmails: toEmails.join(','),
          mailContent: { subject: titleMail, editor: infoEmail },
          emailType: object.emailType,
          status: object.status,
          evaluationPeriodId: object.evaluationPeriodId,
          evaluationTime: object.evaluationTime,
          evaluationDepartmentTime: object.evaluationDepartmentTime,
          sendTimeActual: object.sendTimeActual,
        };

        await this.evaluationRepo.updateHistoryMail(
          dtUpdate,
          companyGroupCode,
          transaction,
        );
      }
    }

    return { message: 'success' };
  }

  getFullNameEmailByStatus(evaluation: {
    status: number;
    user_full_name: string;
    evaluator_05_full_name: string;
    evaluator_1_full_name: string;
    evaluator_2_full_name: string;
    user_email: string;
    evaluator_05_email: string;
    evaluator_1_email: string;
    evaluator_2_email: string;
  }): { email: string; fullName: string; isSendEvaluator: boolean } {
    const status = evaluation.status;
    let email = '';
    let fullName = '';
    let isSendEvaluator = false;
    if ([0, 1, 50, 51, 52].includes(status)) {
      email = evaluation.user_email;
      fullName = evaluation.user_full_name;
    } else if ([3, 4, 53, 54, 55].includes(status)) {
      email = evaluation.evaluator_05_email;
      fullName = evaluation.evaluator_05_full_name;
      isSendEvaluator = true;
    } else if ([5, 6, 56, 57, 58].includes(status)) {
      email = evaluation.evaluator_1_email;
      fullName = evaluation.evaluator_1_full_name;
      isSendEvaluator = true;
    } else if ([7, 8, 59, 60, 61].includes(status)) {
      email = evaluation.evaluator_2_email;
      fullName = evaluation.evaluator_2_full_name;
      isSendEvaluator = true;
    }

    return { email, fullName, isSendEvaluator };
  }

  async sendMailNotFixed(
    data: SendMailRemindBody,
    transaction: any,
    emailHR: string,
  ) {
    for (const evaluation of data.listEvaluation) {
      let content = data.content;
      let titleMail = data.title;
      const { fullName, email, isSendEvaluator } =
        this.getFullNameEmailByStatus(evaluation);
      const encryptedId = encrypt(evaluation.id.toString());
      const typeDetail =
        evaluation.level > 7 ? 'evaluation-8-10' : 'evaluation';

      content = content.replace(
        /{{toUser}}/,
        fullName?.toString()?.split(' ')[0] +
          `${fullName?.toString()?.split(' ')?.length > 1 ? 'さん' : ''}`,
      );
      content = content.replace(/{{userName}}/gi, evaluation.user_full_name);
      content = content.replace(/{{divisionName}}/gi, evaluation.division_name);
      content = content.replace(/{{level}}/gi, evaluation.level?.toString());

      titleMail = titleMail.replace(
        /{{toUser}}/,
        fullName?.toString()?.split(' ')[0] +
          `${fullName?.toString()?.split(' ')?.length > 1 ? 'さん' : ''}`,
      );
      titleMail = titleMail.replace(
        /{{userName}}/gi,
        evaluation.user_full_name,
      );
      titleMail = titleMail.replace(
        /{{divisionName}}/gi,
        evaluation.division_name,
      );
      titleMail = titleMail.replace(
        /{{level}}/gi,
        evaluation.level?.toString(),
      );

      let url = '';
      if (!isSendEvaluator) {
        url = `${process.env.HOSTNAME_}/company/${data.companyGroupCode}/user/${typeDetail}/${encryptedId}`;
      } else {
        url = `${process.env.HOSTNAME_}/company/${data.companyGroupCode}/evaluator/${typeDetail}/${encryptedId}`;
      }

      titleMail = titleMail.replace(/{{detailUrl}}/gi, url);
      content = content.replace(/{{detailUrl}}/gi, url);

      const toEmails: string[] = [emailHR, email];

      if (toEmails && toEmails.length > 0) {
        await sendEmailsWith(toEmails, '', titleMail, content);

        // save to history mail
        const object = {
          ...data,
          toEmails: toEmails.toString(),
          content: content,
          title: titleMail,
          status: 1,
          sendTimeActual: isFormatDate(new Date(), 'YYYY/M/D H:mm'),
        };
        await this.evaluationRepo.updateHistoryMailNotFixed(
          object,
          transaction,
        );
      }
    }

    return { message: 'success' };
  }

  // async sendMailFeedback(data: any, transaction: any) {
  //   const titleMail = data.title;

  //   for (const evaluation of data.listEvaluation) {
  //     let content = data.content;
  //     const { fullName, email } = this.getFullNameEmailByStatus(evaluation);

  //     content = content.replace(
  //       /{{toUser}}/,
  //       fullName?.toString()?.split(' ')[0] +
  //         `${fullName?.toString()?.split(' ')?.length > 1 ? 'さん' : ''}`,
  //     );
  //     const toEmails: string[] = ['gnw-legal@geonet.co.jp', email];

  //     await sendEmailsWith(toEmails, '', titleMail, content);

  //     // save to history mail
  //     const object = {
  //       ...data,
  //       toEmails: toEmails.toString(),
  //       content: content,
  //       title: titleMail,
  //       status: 1,
  //       sendTimeActual: isFormatDate(new Date(), 'YYYY/M/D H:mm'),
  //     };
  //     await this.evaluationRepo.updateHistoryMailNotFixed(object, transaction);
  //   }

  //   return { message: 'success' };
  // }

  async saveMailTemplate(
    body: SendMailBody,
    companyGroupCode: string,
    isCreateHistoryCronjob: boolean,
  ) {
    if (isCreateHistoryCronjob) {
      const nameCronJobs = [
        '',
        '',
        '',
        '',
        '',
        'sendMailExceptionCreationGoals_',
        'sendMailExceptionEvaluationGoals_',
        'sendMailCreationGoals_',
        'sendMailEvaluationGoals_',
      ];

      const period = await this.evaluationPeriodRepo.findOnePeriod({
        id: body.evaluationPeriodId,
        companyGroupCode: companyGroupCode,
      });
      const cronbJobId = await this.historyCronJobRepository.addNews({
        type: body.type,
        name: `${Math.random().toString(36).slice(2)}${
          nameCronJobs[body.type]
        }${
          period.periodIndex === 1
            ? period.year + '年上期'
            : period.year + '年下期'
        }`,
        periodIndex: period.periodIndex,
        year: period.year,
        dateSendMailEvaluationGoal: body.sendTimeSetting,
        evaluationPeriodId: body.evaluationPeriodId,
        companyGroupCode: companyGroupCode,
      });
      body.cronjobId = cronbJobId.id;
    }
    body.companyGroupCode = companyGroupCode;

    if ([5, 6].includes(body.type)) {
      body.mailTo = body.dataMailCCs[0].user;
      body.mailCC = body.dataMailCCs[0].evaluators?.join(',');
    }

    return await this.mailSettingRepo.saveMailTemplate(body);
  }
  async getMailHistoryList(query: any, req: Request) {
    return await this.mailSettingRepo.getMailHistoryList(query, req);
  }
  async updateMailHistory(body: any, id: number, req: Request) {
    const getHistoryCron = await this.mailSettingRepo.findOne({
      id: id,
      companyGroupCode: req?.user?.companyGroupCode,
    });
    if (body.sendTimeSetting) {
      await this.historyCronJobRepository.updateHistory(
        {
          dateSendMailCreationGoalDepartment: body.sendTimeSetting,
          dateSendMailCreationGoal: body.sendTimeSetting,
          dateSendMailEvaluationGoalDepartment: body.sendTimeSetting,
          dateSendMailEvaluationGoal: body.sendTimeSetting,
        },
        {
          id: getHistoryCron.cronjobId,
          companyGroupCode: req?.user?.companyGroupCode,
        },
      );
    }
    return await this.mailSettingRepo.updateMailHistory(body, id);
  }
  async deleteMail(id: number) {
    const transaction = await this.mailSettingRepo.transaction();
    const cronId = await this.mailSettingRepo.findOne({ id: id });
    try {
      const results = await this.mailSettingRepo.deleteMail(id, transaction);
      await this.historyCronJobRepository.deleteHistory(
        {
          id: cronId.cronjobId,
        },
        transaction,
      );

      await transaction.commit();
      return results;
    } catch (error) {
      transaction.rollback();
      throw new RuntimeException(error, 500);
    }
  }

  async getTitleContentFromTemplateMailId(
    idTemplateMail: TemplateMailId,
    companyGroupCode: string,
  ): Promise<{ title: string; content: string }> {
    try {
      const dataMail = await this.mailSettingRepo.getMailTemplateById({
        id: idTemplateMail,
        companyGroupCode: companyGroupCode,
      });
      const title = dataMail.get('subject') || '';
      const content = dataMail.get('content') || '';

      return { title, content };
    } catch (error: any) {
      throw new RuntimeException(
        error?.message.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRawMailTemplate(
    idTemplateMail: TemplateMailId,
    companyGroupCode: string,
  ) {
    try {
      const dataMail = await this.mailSettingRepo.getMailTemplateById({
        id: idTemplateMail,
        companyGroupCode,
      });
      if (!dataMail) return null;
      return {
        id: dataMail.get('id'),
        name: dataMail.get('name'),
        subject: dataMail.get('subject'),
        content: dataMail.get('content'),
        note: dataMail.get('note'),
      };
    } catch {
      return null;
    }
  }

  async getSettingSendMailRemindGoalUserPeriod(
    companyGroupCode: string,
  ): Promise<
    {
      goalActive: number;
      goalDays: number[];
      companyGroupCode: string;
    }[]
  > {
    const result = [];
    try {
      const dataMails = await this.mailSettingRepo.getListMailTemplateById({
        id: TemplateMailId.SEND_MAIL_REMIND_AUTO_GOAL,
        companyGroupCode: companyGroupCode,
      });

      for (const dataMail of dataMails) {
        const setting = dataMail.get('setting') || '';
        let active = 0;
        let days = [];

        if (setting !== '') {
          const objectSetting: {
            active: number;
            days: number[];
          } = JSON.parse(setting);

          active = objectSetting.active;
          days = objectSetting.days;
        }

        result.push({
          goalActive: active,
          goalDays: days,
          companyGroupCode: dataMail.get('companyGroupCode'),
        });
      }

      return result;
    } catch (error: any) {
      throw new RuntimeException(
        error?.message.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSettingSendMailRemindEvalPeriod(companyGroupCode: string): Promise<
    {
      evalActive: number;
      evalDays: number[];
      companyGroupCode: string;
    }[]
  > {
    try {
      const result = [];
      const dataMails = await this.mailSettingRepo.getListMailTemplateById({
        id: TemplateMailId.SEND_MAIL_REMIND_AUTO_EVAL,
        companyGroupCode: companyGroupCode,
      });

      for (const dataMail of dataMails) {
        const setting = dataMail.get('setting') || '';
        let active = 0;
        let days = [];

        if (setting !== '') {
          const objectSetting: {
            active: number;
            days: number[];
          } = JSON.parse(setting);

          active = objectSetting.active;
          days = objectSetting.days;
        }

        result.push({
          evalActive: active,
          evalDays: days,
          companyGroupCode: dataMail.get('companyGroupCode'),
        });
      }

      return result;
    } catch (error: any) {
      throw new RuntimeException(
        error?.message.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendMailCustoms(
    toEmails: any[],
    ccEmail: string[],
    titleEmail: string,
    infoEmail: string,
  ) {
    return await sendEmailsWith(toEmails, ccEmail, titleEmail, infoEmail);
  }
  async getMailNotificateEvaluation(
    year: string,
    periodIndex: string,
    companyGroupCode: string,
  ) {
    // let title = ``;
    // let content = ``;
    // title = mailNotificateEvaluation().title;
    // content = mailNotificateEvaluation().body;

    let { title, content } = await this.getTitleContentFromTemplateMailId(
      TemplateMailId.COMMON_EVALUATION_SETTING,
      companyGroupCode,
    );
    // console.log('Mail thông báo ngày đặt đánh giá: ', dataMail);
    // console.log('subject: ', dataMail?.subject);
    // console.log('content: ', dataMail?.content);

    // console.log(year, periodIndex);

    const periodText = periodIndex === '1' ? '上期' : '下期';
    const periodDate =
      periodIndex === '1' ? `${year}年4月1日` : `${year}年10月1日`;
    const periodMonth =
      periodIndex === '1' ? `${year}年9月` : `${Number(year) + 1}年3月`;
    const loginURL = `${process.env.HOSTNAME_}/login`;

    //title
    title = title.replace(/{{evaluationYear}}/gi, year);
    title = title.replace(/{{evaluationPeriod}}/gi, periodText);
    title = title.replace(/{{periodFirstDate}}/gi, periodDate);
    title = title.replace(/{{periodMonth}}/gi, periodMonth);
    title = title.replace(/{{loginUrl}}/gi, loginURL);

    //content
    content = content.replace(/{{evaluationYear}}/gi, year);
    content = content.replace(/{{evaluationPeriod}}/gi, periodText);
    content = content.replace(/{{periodFirstDate}}/gi, periodDate);
    content = content.replace(/{{periodMonth}}/gi, periodMonth);
    content = content.replace(/{{loginUrl}}/gi, loginURL);
    return { title, content };
  }
  async getMailNotificateGoalSetting(
    year: string,
    periodIndex: string,
    companyGroupCode: string,
  ) {
    // let title = ``;
    // let content = ``;
    // title = mailNotificateGoalSetting().title;
    // content = mailNotificateGoalSetting().body;

    // const dataMail = await this.mailSettingRepo.getMailTemplateById({
    //   id: TemplateMailId.COMMON_GOAL_SETTING,
    // });
    // console.log('Mail thông báo ngày đặt mục tiêu: ', dataMail);
    // console.log('subject: ', dataMail?.subject);
    // console.log('content: ', dataMail?.content);

    let { title, content } = await this.getTitleContentFromTemplateMailId(
      TemplateMailId.COMMON_GOAL_SETTING,
      companyGroupCode,
    );

    const periodText = periodIndex === '1' ? '上期' : '下期';
    const firstPeriodDate =
      periodIndex === '1' ? `${year}年4月1日` : `${year}年10月1日`;
    const secondPeriodDate =
      periodIndex === '1' ? `${year}年10月2日` : `${year}年4月2日`;
    const periodMonth = periodIndex === '1' ? `${year}年3月` : `${year}年9月`;
    const loginURL = `${process.env.HOSTNAME_}/login`;

    //title
    title = title.replace(/{{evaluationYear}}/gi, year);
    title = title.replace(/{{evaluationPeriod}}/gi, periodText);
    title = title.replace(/{{periodFirstDate}}/gi, firstPeriodDate);
    title = title.replace(/{{periodSecondDate}}/gi, secondPeriodDate);
    title = title.replace(/{{secondPeriodMonth}}/gi, periodMonth);
    title = title.replace(/{{loginUrl}}/gi, loginURL);

    //content
    content = content.replace(/{{evaluationYear}}/gi, year);
    content = content.replace(/{{evaluationPeriod}}/gi, periodText);
    content = content.replace(/{{periodFirstDate}}/gi, firstPeriodDate);
    content = content.replace(/{{periodSecondDate}}/gi, secondPeriodDate);
    content = content.replace(/{{secondPeriodMonth}}/gi, periodMonth);
    content = content.replace(/{{loginUrl}}/gi, loginURL);
    return { title, content };
  }

  async getMailNotificateEvaluationException(
    year: string,
    periodIndex: string,
    companyGroupCode: string,
  ) {
    // let title = ``;
    // let content = ``;

    // title = mailNotificateEvaluation().title;
    // content = mailNotificateEvaluation().body;
    // const dataMail = await this.mailSettingRepo.getMailTemplateById({
    //   id: 4,
    // });
    // console.log('Mail thông báo ngày đặt đánh giá ngoại lệ: ', dataMail);
    // console.log('subject: ', dataMail?.subject);
    // console.log('content: ', dataMail?.content);

    let { title, content } = await this.getTitleContentFromTemplateMailId(
      TemplateMailId.EXCEPTION_EVALUATION_SETTING,
      companyGroupCode,
    );

    // console.log(year, periodIndex);

    const periodText = periodIndex === '1' ? '上期' : '下期';
    const periodDate =
      periodIndex === '1' ? `${year}年4月1日` : `${year}年10月1日`;
    const periodMonth =
      periodIndex === '1' ? `${year}年9月` : `${Number(year) + 1}年3月`;
    const loginURL = `${process.env.HOSTNAME_}/login`;

    //title
    title = title.replace(/{{evaluationYear}}/gi, year);
    title = title.replace(/{{evaluationPeriod}}/gi, periodText);
    title = title.replace(/{{periodFirstDate}}/gi, periodDate);
    title = title.replace(/{{periodMonth}}/gi, periodMonth);
    title = title.replace(/{{loginUrl}}/gi, loginURL);

    //content
    content = content.replace(/{{evaluationYear}}/gi, year);
    content = content.replace(/{{evaluationPeriod}}/gi, periodText);
    content = content.replace(/{{periodFirstDate}}/gi, periodDate);
    content = content.replace(/{{periodMonth}}/gi, periodMonth);
    content = content.replace(/{{loginUrl}}/gi, loginURL);
    return { title, content };
  }

  async getMailNotificateGoalSettingException(
    year: string,
    periodIndex: string,
    companyGroupCode: string,
  ) {
    // let title = ``;
    // let content = ``;

    // title = mailNotificateGoalSetting().title;
    // content = mailNotificateGoalSetting().body;
    // const dataMail = await this.mailSettingRepo.getMailTemplateById({
    //   id: 3,
    // });
    // console.log('Mail thông báo ngày đặt mục tiêu ngoại lệ: ', dataMail);
    // console.log('subject: ', dataMail?.subject);
    // console.log('content: ', dataMail?.content);

    let { title, content } = await this.getTitleContentFromTemplateMailId(
      TemplateMailId.EXCEPTION_GOAL_SETTING,
      companyGroupCode,
    );

    const periodText = periodIndex === '1' ? '上期' : '下期';
    const firstPeriodDate =
      periodIndex === '1' ? `${year}年4月1日` : `${year}年10月1日`;
    const secondPeriodDate =
      periodIndex === '1' ? `${year}年10月2日` : `${year}年4月2日`;
    const periodMonth = periodIndex === '1' ? `${year}年3月` : `${year}年9月`;
    const loginURL = `${process.env.HOSTNAME_}/login`;

    //title
    title = title.replace(/{{evaluationYear}}/gi, year);
    title = title.replace(/{{evaluationPeriod}}/gi, periodText);
    title = title.replace(/{{periodFirstDate}}/gi, firstPeriodDate);
    title = title.replace(/{{periodSecondDate}}/gi, secondPeriodDate);
    title = title.replace(/{{secondPeriodMonth}}/gi, periodMonth);
    title = title.replace(/{{loginUrl}}/gi, loginURL);

    //content
    content = content.replace(/{{evaluationYear}}/gi, year);
    content = content.replace(/{{evaluationPeriod}}/gi, periodText);
    content = content.replace(/{{periodFirstDate}}/gi, firstPeriodDate);
    content = content.replace(/{{periodSecondDate}}/gi, secondPeriodDate);
    content = content.replace(/{{secondPeriodMonth}}/gi, periodMonth);
    content = content.replace(/{{loginUrl}}/gi, loginURL);

    return { title, content };
  }

  async getMailNotiGoalFixedUserAndEvaluatorWOTime(
    period: EvaluationPeriod,
    companyGroupCode: string,
  ) {
    const { periodIndex, year, dateCreationGoalEnd } = period;
    let { title, content } = await this.getTitleContentFromTemplateMailId(
      TemplateMailId.GOAL_USER_AND_EVALUATOR_WITHOUT_TIME,
      companyGroupCode,
    );

    const periodText = periodIndex == 1 ? '上期' : '下期';
    const loginURL = `${process.env.HOSTNAME_}/login`;
    const dateCreationGoalEndMonth = dateCreationGoalEnd
      ? moment(dateCreationGoalEnd, this.DATE_FORMAT).month() + 1
      : '';
    const dateCreationGoalEndDay = dateCreationGoalEnd
      ? moment(dateCreationGoalEnd, this.DATE_FORMAT).date()
      : '';
    const dateCreationGoalEndDOW =
      Object.values(day)[
        dateCreationGoalEnd
          ? moment(dateCreationGoalEnd, this.DATE_FORMAT).day()
          : 0
      ];
    const dayCreationGoalEnd = `${dateCreationGoalEndMonth}月${dateCreationGoalEndDay}日 (${dateCreationGoalEndDOW})`;

    //title
    title = title.replace(/{{evaluationYear}}/gi, year);
    title = title.replace(/{{evaluationPeriod}}/gi, periodText);

    title = title.replace(/{{loginUrl}}/gi, loginURL);
    title = title.replace(/{{dayCreationGoalEnd}}/gi, dayCreationGoalEnd);
    title = title.replace(/{{goalCreateEndDate}}/gi, dateCreationGoalEnd);

    //content
    content = content.replace(/{{evaluationYear}}/gi, year);
    content = content.replace(/{{evaluationPeriod}}/gi, periodText);
    content = content.replace(/{{loginUrl}}/gi, loginURL);
    content = content.replace(/{{dayCreationGoalEnd}}/gi, dayCreationGoalEnd);
    content = content.replace(/{{goalCreateEndDate}}/gi, dateCreationGoalEnd);

    return { title, content };
  }

  async getMailNotiGoalFixedEvaluatorWOTime(
    period: EvaluationPeriod,
    companyGroupCode: string,
    evaluationId?: number,
  ) {
    const { periodIndex, year, dateCreationGoalEnd } = period;
    let { title, content } = await this.getTitleContentFromTemplateMailId(
      TemplateMailId.GOAL_EVALUATOR_WITHOUT_TIME,
      companyGroupCode,
    );

    const periodText = periodIndex == 1 ? '上期' : '下期';
    const loginURL = `${process.env.HOSTNAME_}/login`;
    const dateCreationGoalEndMonth = dateCreationGoalEnd
      ? moment(dateCreationGoalEnd, this.DATE_FORMAT).month() + 1
      : '';
    const dateCreationGoalEndDay = dateCreationGoalEnd
      ? moment(dateCreationGoalEnd, this.DATE_FORMAT).date()
      : '';
    const dateCreationGoalEndDOW =
      Object.values(day)[
        dateCreationGoalEnd
          ? moment(dateCreationGoalEnd, this.DATE_FORMAT).day()
          : 0
      ];
    const dayCreationGoalEnd = `${dateCreationGoalEndMonth}月${dateCreationGoalEndDay}日 (${dateCreationGoalEndDOW})`;
    let infoUserEvaluation = undefined;
    let url = ``;
    if (evaluationId > 0) {
      infoUserEvaluation = await this.evaluationRepo.getEvaluationUserById(
        evaluationId,
      );
      const encryptedId = encrypt(evaluationId.toString());
      const typeDetail =
        infoUserEvaluation?.level > 7 ? 'evaluation-8-10' : 'evaluation';
      url = `${process.env.HOSTNAME_}/company/${companyGroupCode}/evaluator/${typeDetail}/${encryptedId}`;
    }

    //title
    title = title.replace(/{{evaluationYear}}/gi, year);
    title = title.replace(/{{evaluationPeriod}}/gi, periodText);
    title = title.replace(/{{loginUrl}}/gi, loginURL);
    title = title.replace(/{{dayCreationGoalEnd}}/gi, dayCreationGoalEnd);
    title = title.replace(/{{goalCreateEndDate}}/gi, dateCreationGoalEnd);

    //content
    content = content.replace(/{{evaluationYear}}/gi, year);
    content = content.replace(/{{evaluationPeriod}}/gi, periodText);
    content = content.replace(/{{loginUrl}}/gi, loginURL);
    content = content.replace(/{{dayCreationGoalEnd}}/gi, dayCreationGoalEnd);
    content = content.replace(/{{goalCreateEndDate}}/gi, dateCreationGoalEnd);

    if (evaluationId > 0) {
      title = title.replace(/{{detailUrl}}/gi, url);
      content = content.replace(/{{detailUrl}}/gi, url);

      if (infoUserEvaluation) {
        title = title.replace(
          /{{userName}}/gi,
          infoUserEvaluation.user?.fullName,
        );
        content = content.replace(
          /{{userName}}/gi,
          infoUserEvaluation.user?.fullName,
        );

        title = title.replace(
          /{{divisionName}}/gi,
          infoUserEvaluation.divisionName,
        );
        content = content.replace(
          /{{divisionName}}/gi,
          infoUserEvaluation.divisionName,
        );

        title = title.replace(/{{level}}/gi, infoUserEvaluation.level);
        content = content.replace(/{{level}}/gi, infoUserEvaluation.level);
      }
    }

    return { title, content };
  }

  async getMailNotiGoalFixedUserAndEvaluator(
    period: EvaluationPeriod,
    companyGroupCode: string,
  ) {
    const { periodIndex, year, dateCreationGoalStart, dateCreationGoalEnd } =
      period;
    let { title, content } = await this.getTitleContentFromTemplateMailId(
      TemplateMailId.GOAL_USER_AND_EVALUATOR,
      companyGroupCode,
    );

    const periodText = periodIndex == 1 ? '上期' : '下期';
    const loginURL = `${process.env.HOSTNAME_}/login`;
    const dateCreationGoalStartMonth = dateCreationGoalStart
      ? moment(dateCreationGoalStart, this.DATE_FORMAT).month() + 1
      : '';
    const dateCreationGoalStartDay = dateCreationGoalStart
      ? moment(dateCreationGoalStart, this.DATE_FORMAT).date()
      : '';
    const dateCreationGoalStartDOW =
      Object.values(day)[
        dateCreationGoalStart
          ? moment(dateCreationGoalStart, this.DATE_FORMAT).day()
          : 0
      ];
    const dayCreationGoalStart = `${dateCreationGoalStartMonth}月${dateCreationGoalStartDay}日 (${dateCreationGoalStartDOW})`;

    const dateCreationGoalEndMonth = dateCreationGoalEnd
      ? moment(dateCreationGoalEnd, this.DATE_FORMAT).month() + 1
      : '';
    const dateCreationGoalEndDay = dateCreationGoalEnd
      ? moment(dateCreationGoalEnd, this.DATE_FORMAT).date()
      : '';
    const dateCreationGoalEndDOW =
      Object.values(day)[
        dateCreationGoalEnd
          ? moment(dateCreationGoalEnd, this.DATE_FORMAT).day()
          : 0
      ];
    const dayCreationGoalEnd = `${dateCreationGoalEndMonth}月${dateCreationGoalEndDay}日 (${dateCreationGoalEndDOW})`;

    //title
    title = title.replace(/{{evaluationYear}}/gi, year);
    title = title.replace(/{{evaluationPeriod}}/gi, periodText);
    title = title.replace(/{{loginUrl}}/gi, loginURL);
    title = title.replace(/{{dayCreationGoalStart}}/gi, dayCreationGoalStart);
    title = title.replace(/{{goalCreateStartDate}}/gi, dateCreationGoalStart);
    title = title.replace(/{{dayCreationGoalEnd}}/gi, dayCreationGoalEnd);
    title = title.replace(/{{goalCreateEndDate}}/gi, dateCreationGoalEnd);

    //content
    content = content.replace(/{{evaluationYear}}/gi, year);
    content = content.replace(/{{evaluationPeriod}}/gi, periodText);
    content = content.replace(/{{loginUrl}}/gi, loginURL);
    content = content.replace(
      /{{dayCreationGoalStart}}/gi,
      dayCreationGoalStart,
    );
    content = content.replace(
      /{{goalCreateStartDate}}/gi,
      dateCreationGoalStart,
    );
    content = content.replace(/{{dayCreationGoalEnd}}/gi, dayCreationGoalEnd);
    content = content.replace(/{{goalCreateEndDate}}/gi, dateCreationGoalEnd);

    return { title, content };
  }

  async getMailNotiEvalFixedUserAndEvaluatorWOTime(
    period: EvaluationPeriod,
    companyGroupCode: string,
  ) {
    const { periodIndex, year, dateEvaluationEnd } = period;
    let { title, content } = await this.getTitleContentFromTemplateMailId(
      TemplateMailId.EVAL_USER_AND_EVALUATOR_WITHOUT_TIME,
      companyGroupCode,
    );

    const periodText = periodIndex == 1 ? '上期' : '下期';
    const loginURL = `${process.env.HOSTNAME_}/login`;
    const dateEvaluationEndMonth = dateEvaluationEnd
      ? moment(dateEvaluationEnd, this.DATE_FORMAT).month() + 1
      : '';
    const dateEvaluationEndDay = dateEvaluationEnd
      ? moment(dateEvaluationEnd, this.DATE_FORMAT).date()
      : '';
    const dateEvaluationEndDOW =
      Object.values(day)[
        dateEvaluationEnd
          ? moment(dateEvaluationEnd, this.DATE_FORMAT).day()
          : 0
      ];
    const dayEvaluationEnd = `${dateEvaluationEndMonth}月${dateEvaluationEndDay}日 (${dateEvaluationEndDOW})`;

    //title
    title = title.replace(/{{evaluationYear}}/gi, year);
    title = title.replace(/{{evaluationPeriod}}/gi, periodText);
    title = title.replace(/{{dayEvaluationEnd}}/gi, dayEvaluationEnd);
    title = title.replace(/{{evaluationEndDate}}/gi, dateEvaluationEnd);
    title = title.replace(/{{loginUrl}}/gi, loginURL);

    //content
    content = content.replace(/{{evaluationYear}}/gi, year);
    content = content.replace(/{{evaluationPeriod}}/gi, periodText);
    content = content.replace(/{{loginUrl}}/gi, loginURL);
    content = content.replace(/{{dayEvaluationEnd}}/gi, dayEvaluationEnd);
    content = content.replace(/{{evaluationEndDate}}/gi, dateEvaluationEnd);

    return { title, content };
  }

  async getMailNotiEvalFixedEvaluatorWOTime(
    period: EvaluationPeriod,
    companyGroupCode: string,
    evaluationId?: number,
  ) {
    const { periodIndex, year, dateEvaluationEnd } = period;
    let { title, content } = await this.getTitleContentFromTemplateMailId(
      TemplateMailId.EVAL_EVALUATOR_WITHOUT_TIME,
      companyGroupCode,
    );

    const periodText = periodIndex == 1 ? '上期' : '下期';
    const loginURL = `${process.env.HOSTNAME_}/login`;
    const dateEvaluationEndMonth = dateEvaluationEnd
      ? moment(dateEvaluationEnd, this.DATE_FORMAT).month() + 1
      : '';
    const dateEvaluationEndDay = dateEvaluationEnd
      ? moment(dateEvaluationEnd, this.DATE_FORMAT).date()
      : '';
    const dateEvaluationEndDOW =
      Object.values(day)[
        dateEvaluationEnd
          ? moment(dateEvaluationEnd, this.DATE_FORMAT).day()
          : 0
      ];
    const dayEvaluationEnd = `${dateEvaluationEndMonth}月${dateEvaluationEndDay}日 (${dateEvaluationEndDOW})`;

    let infoUserEvaluation = undefined;
    let url = ``;
    if (evaluationId > 0) {
      infoUserEvaluation = await this.evaluationRepo.getEvaluationUserById(
        evaluationId,
      );
      const encryptedId = encrypt(evaluationId.toString());
      const typeDetail =
        infoUserEvaluation?.level > 7 ? 'evaluation-8-10' : 'evaluation';
      url = `${process.env.HOSTNAME_}/company/${companyGroupCode}/evaluator/${typeDetail}/${encryptedId}`;
    }

    //title
    title = title.replace(/{{evaluationYear}}/gi, year);
    title = title.replace(/{{evaluationPeriod}}/gi, periodText);
    title = title.replace(/{{dayEvaluationEnd}}/gi, dayEvaluationEnd);
    title = title.replace(/{{evaluationEndDate}}/gi, dateEvaluationEnd);
    title = title.replace(/{{loginUrl}}/gi, loginURL);

    //content
    content = content.replace(/{{evaluationYear}}/gi, year);
    content = content.replace(/{{evaluationPeriod}}/gi, periodText);
    content = content.replace(/{{loginUrl}}/gi, loginURL);
    content = content.replace(/{{dayEvaluationEnd}}/gi, dayEvaluationEnd);
    content = content.replace(/{{evaluationEndDate}}/gi, dateEvaluationEnd);

    if (evaluationId > 0) {
      title = title.replace(/{{detailUrl}}/gi, url);
      content = content.replace(/{{detailUrl}}/gi, url);

      if (infoUserEvaluation) {
        title = title.replace(
          /{{userName}}/gi,
          infoUserEvaluation.user?.fullName,
        );
        content = content.replace(
          /{{userName}}/gi,
          infoUserEvaluation.user?.fullName,
        );

        title = title.replace(
          /{{divisionName}}/gi,
          infoUserEvaluation.divisionName,
        );
        content = content.replace(
          /{{divisionName}}/gi,
          infoUserEvaluation.divisionName,
        );

        title = title.replace(/{{level}}/gi, infoUserEvaluation.level);
        content = content.replace(/{{level}}/gi, infoUserEvaluation.level);
      }
    }

    return { title, content };
  }

  async getMailNotiEvalFixedUserAndEvaluator(
    period: EvaluationPeriod,
    companyGroupCode: string,
  ) {
    const { periodIndex, year, dateEvaluationStart, dateEvaluationEnd } =
      period;
    let { title, content } = await this.getTitleContentFromTemplateMailId(
      TemplateMailId.EVAL_USER_AND_EVALUATOR,
      companyGroupCode,
    );

    const periodText = periodIndex == 1 ? '上期' : '下期';
    const loginURL = `${process.env.HOSTNAME_}/login`;
    const dateEvaluationStartMonth = dateEvaluationStart
      ? moment(dateEvaluationStart, this.DATE_FORMAT).month() + 1
      : '';
    const dateEvaluationStartDay = dateEvaluationStart
      ? moment(dateEvaluationStart, this.DATE_FORMAT).date()
      : '';
    const dateEvaluationStartDOW =
      Object.values(day)[
        dateEvaluationStart
          ? moment(dateEvaluationStart, this.DATE_FORMAT).day()
          : 0
      ];
    const dayEvaluationStart = `${dateEvaluationStartMonth}月${dateEvaluationStartDay}日 (${dateEvaluationStartDOW})`;

    const dateEvaluationEndMonth = dateEvaluationEnd
      ? moment(dateEvaluationEnd, this.DATE_FORMAT).month() + 1
      : '';
    const dateEvaluationEndDay = dateEvaluationEnd
      ? moment(dateEvaluationEnd, this.DATE_FORMAT).date()
      : '';
    const dateEvaluationEndDOW =
      Object.values(day)[
        dateEvaluationEnd
          ? moment(dateEvaluationEnd, this.DATE_FORMAT).day()
          : 0
      ];
    const dayEvaluationEnd = `${dateEvaluationEndMonth}月${dateEvaluationEndDay}日 (${dateEvaluationEndDOW})`;

    //title
    title = title.replace(/{{evaluationYear}}/gi, year);
    title = title.replace(/{{evaluationPeriod}}/gi, periodText);
    title = title.replace(/{{loginUrl}}/gi, loginURL);
    title = title.replace(/{{dayEvaluationStart}}/gi, dayEvaluationStart);
    title = title.replace(/{{dayEvaluationEnd}}/gi, dayEvaluationEnd);
    title = title.replace(/{{evaluationStartDate}}/gi, dateEvaluationStart);
    title = title.replace(/{{evaluationEndDate}}/gi, dateEvaluationEnd);

    //content
    content = content.replace(/{{evaluationYear}}/gi, year);
    content = content.replace(/{{evaluationPeriod}}/gi, periodText);
    content = content.replace(/{{loginUrl}}/gi, loginURL);
    content = content.replace(/{{dayEvaluationStart}}/gi, dayEvaluationStart);
    content = content.replace(/{{dayEvaluationEnd}}/gi, dayEvaluationEnd);
    content = content.replace(/{{evaluationStartDate}}/gi, dateEvaluationStart);
    content = content.replace(/{{evaluationEndDate}}/gi, dateEvaluationEnd);

    return { title, content };
  }

  async getMailNotiGoalNotFixed(
    year: string,
    period_index: number,
    date_end: string,
    listEmailGoal: string[],
    companyGroupCode: string,
  ) {
    let { title, content } = await this.getTitleContentFromTemplateMailId(
      // TemplateMailId.GOAL_USER_AND_EVALUATOR_WITHOUT_TIME,
      TemplateMailId.SEND_MAIL_REMIND_AUTO_GOAL,
      companyGroupCode,
    );

    const periodText = period_index == 1 ? '上期' : '下期';
    const loginURL = `${process.env.HOSTNAME_}/login`;
    // const toUser = await this.userRepo.getUserByEmail(listEmailGoal[0], companyGroupCode);
    const dateCreationGoalEndMonth = date_end
      ? moment(date_end, this.DATE_FORMAT).month() + 1
      : '';
    const dateCreationGoalEndDay = date_end
      ? moment(date_end, this.DATE_FORMAT).date()
      : '';
    const dateCreationGoalEndDOW =
      Object.values(day)[
        date_end ? moment(date_end, this.DATE_FORMAT).day() : 0
      ];
    const dayCreationGoalEnd = `${dateCreationGoalEndMonth}月${dateCreationGoalEndDay}日 (${dateCreationGoalEndDOW})`;

    //title
    title = title.replace(/{{evaluationYear}}/gi, year);
    title = title.replace(/{{evaluationPeriod}}/gi, periodText);
    title = title.replace(/{{loginUrl}}/gi, loginURL);
    title = title.replace(/{{dayCreationGoalEnd}}/gi, dayCreationGoalEnd);
    title = title.replace(/{{goalCreateEndDate}}/gi, date_end);
    // title = title.replace(
    //   /{{toUser}}/gi,
    //   toUser?.fullName?.toString().split(' ')[0] + 'さん',
    // );

    //content
    content = content.replace(/{{evaluationYear}}/gi, year);
    content = content.replace(/{{evaluationPeriod}}/gi, periodText);
    content = content.replace(/{{loginUrl}}/gi, loginURL);
    content = content.replace(/{{dayCreationGoalEnd}}/gi, dayCreationGoalEnd);
    content = content.replace(/{{goalCreateEndDate}}/gi, date_end);
    // content = content.replace(
    //   /{{toUser}}/gi,
    //   toUser?.fullName?.toString().split(' ')[0] + 'さん',
    // );

    return { title, content };
  }

  async getMailNotiEvalNotFixed(
    year: string,
    period_index: number,
    date_end: string,
    listEmailEval: string[],
    companyGroupCode: string,
  ) {
    let { title, content } = await this.getTitleContentFromTemplateMailId(
      TemplateMailId.SEND_MAIL_REMIND_AUTO_EVAL,
      companyGroupCode,
    );

    const periodText = period_index == 1 ? '上期' : '下期';
    const loginURL = `${process.env.HOSTNAME_}/login`;
    // const toUser = await this.userRepo.getUserByEmail(listEmailEval[0]);
    const dateEvaluationEndMonth = date_end
      ? moment(date_end, this.DATE_FORMAT).month() + 1
      : '';
    const dateEvaluationEndDay = date_end
      ? moment(date_end, this.DATE_FORMAT).date()
      : '';
    const dateEvaluationEndDOW =
      Object.values(day)[
        date_end ? moment(date_end, this.DATE_FORMAT).day() : 0
      ];
    const dayEvaluationEnd = `${dateEvaluationEndMonth}月${dateEvaluationEndDay}日 (${dateEvaluationEndDOW})`;

    //title
    title = title.replace(/{{evaluationYear}}/gi, year);
    title = title.replace(/{{evaluationPeriod}}/gi, periodText);
    title = title.replace(/{{dayEvaluationEnd}}/gi, dayEvaluationEnd);
    title = title.replace(/{{evaluationEndDate}}/gi, dayEvaluationEnd);
    title = title.replace(/{{loginUrl}}/gi, loginURL);
    // title = title.replace(
    //   /{{toUser}}/gi,
    //   toUser?.fullName?.toString().split(' ')[0] + 'さん',
    // );

    //content
    content = content.replace(/{{evaluationYear}}/gi, year);
    content = content.replace(/{{evaluationPeriod}}/gi, periodText);
    content = content.replace(/{{loginUrl}}/gi, loginURL);
    content = content.replace(/{{dayEvaluationEnd}}/gi, dayEvaluationEnd);
    content = content.replace(/{{evaluationEndDate}}/gi, dayEvaluationEnd);
    // content = content.replace(
    //   /{{toUser}}/gi,
    //   toUser?.fullName?.toString().split(' ')[0] + 'さん',
    // );

    return { title, content };
  }

  async getSendMailCreateFeedback(
    data: {
      userName: string;
      departmentName: string;
      companyName: string;
      feedbackId: number;
      overview: string;
      typeFeedback: number;
    },
    companyGroupCode: string,
  ) {
    let { title, content } = await this.getTitleContentFromTemplateMailId(
      TemplateMailId.FEEDBACK_CREATE,
      companyGroupCode,
    );

    const encryptedId = encrypt(data.feedbackId.toString());

    const companyCode = process.env.COMPANY_SYSTEM_ADMIN || companyGroupCode;

    const url = `${process.env.HOSTNAME_SYSTEM_ADMIN}/company/${companyCode}/system-admin/list-feedback/detail/${encryptedId}`;

    //title
    title = title.replace(
      /{{toUser}}/gi,
      data.userName.toString()?.split(' ')[0] +
        `${data.userName.toString()?.split(' ')?.length > 1 ? 'さん' : ''}`,
    );
    title = title.replace(/{{departmentName}}/gi, data.departmentName);
    title = title.replace(/{{companyName}}/gi, data.companyName);
    title = title.replace(/{{detailURL}}/gi, url);
    title = title.replace(
      /{{typeFeedback}}/gi,
      typeFeedback[data.typeFeedback],
    );
    title = title.replace(/{{overview}}/gi, data.overview);
    title = title.replace(/{{NO.}}/gi, data.feedbackId.toString());

    //content
    content = content.replace(
      /{{toUser}}/gi,
      data.userName.toString()?.split(' ')[0] +
        `${data.userName.toString()?.split(' ')?.length > 1 ? 'さん' : ''}`,
    );
    content = content.replace(/{{departmentName}}/gi, data.departmentName);
    content = content.replace(/{{companyName}}/gi, data.companyName);
    content = content.replace(/{{detailURL}}/gi, url);
    content = content.replace(
      /{{typeFeedback}}/gi,
      typeFeedback[data.typeFeedback],
    );
    content = content.replace(/{{overview}}/gi, data.overview);
    content = content.replace(/{{NO.}}/gi, data.feedbackId.toString());

    return { title, content };
  }

  async getSendMailUpdateFeedback(
    data: {
      userName: string;
      feedbackId: number;
      status: string;
    },
    companyGroupCode: string,
  ) {
    let { title, content } = await this.getTitleContentFromTemplateMailId(
      TemplateMailId.FEEDBACK_UPDATE_STATUS,
      companyGroupCode,
    );

    const encryptedId = encrypt(data.feedbackId.toString());

    const url = `${process.env.HOSTNAME_}/company/${companyGroupCode}/feedback/detail/${encryptedId}`;

    //title
    title = title.replace(
      /{{toUser}}/gi,
      data.userName.toString()?.split(' ')[0] +
        `${data.userName.toString()?.split(' ')?.length > 1 ? 'さん' : ''}`,
    );
    title = title.replace(/{{detailURL}}/gi, url);
    title = title.replace(/{{status}}/gi, statusFeedback[data.status]);
    title = title.replace(/{{NO.}}/gi, data.feedbackId.toString());

    //content
    content = content.replace(
      /{{toUser}}/gi,
      data.userName.toString()?.split(' ')[0] +
        `${data.userName.toString()?.split(' ')?.length > 1 ? 'さん' : ''}`,
    );
    content = content.replace(/{{detailURL}}/gi, url);
    content = content.replace(/{{status}}/gi, statusFeedback[data.status]);
    content = content.replace(/{{NO.}}/gi, data.feedbackId.toString());

    return { title, content };
  }

  async getSendMailCommentFeedback(
    data: {
      feedbackId: number;
      listFullName: string[];
      typeFeedback: number;
    },
    companyGroupCode: string,
    typeAddComment: number,
  ) {
    let { title, content } = await this.getTitleContentFromTemplateMailId(
      TemplateMailId.FEEDBACK_ADD_COMMENT,
      companyGroupCode,
    );

    const encryptedId = encrypt(data.feedbackId.toString());
    let url = '';
    if (typeAddComment === 2) {
      url = `${process.env.HOSTNAME_}/company/${companyGroupCode}/feedback/detail/${encryptedId}`;
    } else {
      const companyCode = process.env.COMPANY_SYSTEM_ADMIN || companyGroupCode;
      url = `${process.env.HOSTNAME_SYSTEM_ADMIN}/company/${companyCode}/system-admin/list-feedback/detail/${encryptedId}`;
    }

    const uniqueFullNames = [
      ...new Set(data.listFullName.map((e) => e?.toString())),
    ];

    const formattedNames = uniqueFullNames
      .map((fullName) => {
        const parts = fullName.split(' ');
        const firstName = parts[0];
        return `${firstName}${parts.length > 1 ? 'さん' : ''}`;
      })
      .join('、');

    // title
    title = title.replace(/{{detailURL}}/gi, url);
    title = title.replace(/{{toUser}}/gi, formattedNames);
    title = title.replace(
      /{{typeFeedback}}/gi,
      typeFeedback[data.typeFeedback],
    );
    title = title.replace(/{{NO.}}/gi, data.feedbackId.toString());

    // content
    content = content.replace(/{{detailURL}}/gi, url);
    content = content.replace(/{{toUser}}/gi, formattedNames);
    content = content.replace(
      /{{typeFeedback}}/gi,
      typeFeedback[data.typeFeedback],
    );
    content = content.replace(/{{NO.}}/gi, data.feedbackId.toString());

    return { title, content };
  }

  // async getSendMailAdminWhenUserDeleted(
  //   data: {
  //     userName: string;
  //     typeFeedback: number;
  //     overview: string;
  //     companyName: string;
  //   },
  //   companyGroupCode: string,
  // ) {
  //   let { title, content } = await this.getTitleContentFromTemplateMailId(
  //     TemplateMailId.FEEDBACK_UPDATE_USER_UNAVAILABLE,
  //     companyGroupCode,
  //   );

  //   //title
  //   title = title.replace(
  //     /{{toUser}}/gi,
  //     data.userName.toString()?.split(' ')[0] +
  //       `${data.userName.toString()?.split(' ')?.length > 1 ? 'さん' : ''}`,
  //   );
  //   title = title.replace(
  //     /{{typeFeedback}}/gi,
  //     typeFeedback[data.typeFeedback],
  //   );
  //   title = title.replace(/{{overview}}/gi, data.overview);
  //   title = title.replace(/{{companyName}}/gi, data.companyName);

  //   //content
  //   content = content.replace(
  //     /{{toUser}}/gi,
  //     data.userName.toString()?.split(' ')[0] +
  //       `${data.userName.toString()?.split(' ')?.length > 1 ? 'さん' : ''}`,
  //   );
  //   content = content.replace(
  //     /{{typeFeedback}}/gi,
  //     typeFeedback[data.typeFeedback],
  //   );
  //   content = content.replace(/{{overview}}/gi, data.overview);
  //   content = content.replace(/{{companyName}}/gi, data.companyName);

  //   return { title, content };
  // }

  async getSendMailDeleteComment(
    data: {
      feedbackId: number;
      listFullName: string[];
      typeFeedback: number;
    },
    companyGroupCode: string,
    typeAddComment: number,
  ) {
    let { title, content } = await this.getTitleContentFromTemplateMailId(
      TemplateMailId.FEEDBACK_DELETE_COMMENT,
      companyGroupCode,
    );

    const encryptedId = encrypt(data.feedbackId.toString());
    let url = '';
    if (typeAddComment === 2) {
      url = `${process.env.HOSTNAME_}/company/${companyGroupCode}/feedback/detail/${encryptedId}`;
    } else {
      const companyCode = process.env.COMPANY_SYSTEM_ADMIN || companyGroupCode;
      url = `${process.env.HOSTNAME_SYSTEM_ADMIN}/company/${companyCode}/system-admin/list-feedback/detail/${encryptedId}`;
    }

    const uniqueFullNames = [
      ...new Set(data.listFullName.map((e) => e?.toString())),
    ];

    const formattedNames = uniqueFullNames
      .map((fullName) => {
        const parts = fullName.split(' ');
        const firstName = parts[0];
        return `${firstName}${parts.length > 1 ? 'さん' : ''}`;
      })
      .join('、');

    //title
    title = title.replace(/{{detailURL}}/gi, url);
    title = title.replace(/{{toUser}}/gi, formattedNames);
    title = title.replace(
      /{{typeFeedback}}/gi,
      typeFeedback[data.typeFeedback],
    );
    title = title.replace(/{{NO.}}/gi, data.feedbackId.toString());

    //content
    content = content.replace(/{{detailURL}}/gi, url);
    content = content.replace(/{{toUser}}/gi, formattedNames);
    content = content.replace(
      /{{typeFeedback}}/gi,
      typeFeedback[data.typeFeedback],
    );
    content = content.replace(/{{NO.}}/gi, data.feedbackId.toString());

    return { title, content };
  }

  async getMailTemplateList(query: { name: string }, req: Request) {
    return await this.mailSettingRepo.getMailTemplateList(query, req);
  }
  async getMailTemplateListById(query: { id: number }, req: Request) {
    return await this.mailSettingRepo.getMailTemplateListById(query, req);
  }
  async editMailTemplate(body: EditMailTemplateObj, req: Request) {
    return await this.mailSettingRepo.editMailTemplate(body, req);
  }

  async getMailTemplateById(id: number) {
    return await this.mailSettingRepo.getMailTemplateById({
      id: id,
    });
  }
}
