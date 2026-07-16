/* eslint-disable complexity */
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Evaluation } from 'src/entity/Evaluation';
import { EvaluationRepositoryI } from 'src/interfaces/repository/evaluation.repository.interface';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { EvaluationRepository } from 'src/repository/evaluation.repository';
import { ProSkillRepository } from 'src/repository/proSkill.repository';
import { MailService } from './mail.service';
import { ProSkillSettingRepository } from 'src/repository/proSkillSetting.repository';
import {
  compareDatePeriod,
  encrypt,
  isFormatDate,
  isNotNumber,
} from 'src/common/util';
import { EvaluationPeriodRepository } from 'src/repository/evaluationPeriod.repository';
import { DivisionSubClassRepository } from 'src/repository/divisionSubClass.repository';
import {
  AdditionData,
  CommentContent,
  EvaluatorInfo,
  RequestDataSave,
  Total,
} from 'src/interfaces/service/evaluation.service.interface';
import { Evaluator } from 'src/entity/Evaluator';
import { ApprovalRepository } from 'src/repository/approval.repository';
import { Op } from 'sequelize';
import { CustomLogger } from './logger.service';
import {
  EvaluationAdditionalAchievementNew,
  EvaluationPersonalAchievementNew,
  UserEvaluationBasicBehaviorType,
  UserEvaluationToProSkillType,
} from 'src/interfaces/user.interfaces';
import { EvaluationBasicBehavior } from 'src/entity/EvaluationBasicBehavior';
import { SummaryDepartmentRepository } from 'src/repository/summaryDepartment.repository';
import { UserRepository } from 'src/repository/user.repository';
import { UserRepositoryI } from 'src/interfaces/repository/user.repository.interface';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const moment = require('moment');
// moment.tz.setDefault('Asia/Tokyo');
import * as moment from 'moment';
import { EvaluatorRepository } from 'src/repository/evaluator.repository';
@Injectable()
export class EvaluationService {
  @Inject(EvaluationRepository)
  private evaluationRepo: EvaluationRepositoryI;

  @Inject(ProSkillRepository)
  private proSkillRepository: ProSkillRepository;

  @Inject(MailService)
  private mailService: MailService;

  @Inject(ProSkillSettingRepository)
  private proSkillSettingRepository: ProSkillSettingRepository;

  @Inject(EvaluationPeriodRepository)
  private evaluationPeriodRepo: EvaluationPeriodRepository;

  @Inject(DivisionSubClassRepository)
  private divisionSubClassRepository: DivisionSubClassRepository;

  @Inject(ApprovalRepository)
  private evaluationApprovalHistory: ApprovalRepository;

  @Inject(SummaryDepartmentRepository)
  private summaryDepartmentRepository: SummaryDepartmentRepository;

  @Inject(UserRepository)
  private userRepo: UserRepositoryI;

  @Inject(EvaluatorRepository)
  private evaluatorRepository: EvaluatorRepository;

  constructor(private logger: CustomLogger) {}

  async findOne(
    id: number,
    userId: number,
    role: string,
    companyGroupCode: string,
  ) {
    let isDisable = false;
    let hasEvaluator2 = true;
    let hasMode1 = false;
    let hasMode2 = false;
    let hasMode3 = false;
    let allowSeeList = [];
    let maxOrder = '';
    const findRejectCondition = {
      evaluationId: id,
      type: 0,
      receiverOrder: '',
      status: '',
    };

    const userInfo = {
      id: undefined,
      department: undefined,
      division: undefined,
      evaluationLevel: undefined,
      evaluators: [],
      fiscalYear: undefined,
      periodStart: undefined,
      periodEnd: undefined,
      fullName: '',
      employeeNumber: '',
      status: 0,
      evaluationId: undefined,
      active: 1,
      rejectComment: '',
    };
    const flagSkill = (await this.userRepo.evaluationSkillCheck(id)).flagSkill;
    const results = await this.evaluationRepo.getEvaluationById(
      id,
      flagSkill,
      companyGroupCode,
    );

    // if (results[1] && results[0]) {
    const evaluation = results.evaluationList;
    const evaluatorList = evaluation.evaluator || ([] as Evaluator[]);
    const evaluatorOrderList: number[] = [];
    let isEvaluatorException = false;
    if (role !== 'user') {
      const evaluators = evaluation.evaluator;
      const findEvaluator = evaluators.find((f) => f.evaluatorId === userId);
      if (!findEvaluator) isEvaluatorException = true;
    }
    evaluatorList.map((e) => {
      evaluatorOrderList.push(Number(e.evaluationOrder));
    });
    const evaluationStatus = evaluation.status;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const listSumaryPercent = {
      achievementPercent: evaluation.achievementPercent,
      skillPercent: evaluation.skillPercent,
      behaviorPercent: evaluation.behaviorPercent,
      percentPoint: evaluation.percentPoint,
    };
    let evaluationBasicBehaviorList;
    if (evaluation.status < 1) {
      evaluationBasicBehaviorList = [
        ...(evaluation.listBasic || []),
        ...(evaluation.listBehaviorHaveSkill || []),
        ...(evaluation.listBehaviorNoSkill || []),
      ];
    } else {
      evaluationBasicBehaviorList = [
        ...(evaluation.evaluationBasicBehavior || []),
      ];
    }
    // check evaluator for F2

    // if (evaluatorList && evaluatorList?.length) {
    let customEvalutorOrderList = [];
    customEvalutorOrderList = evaluatorList.filter((item: any) => {
      return item.evaluatorId === userId;
    });
    if (customEvalutorOrderList && customEvalutorOrderList.length) {
      customEvalutorOrderList = customEvalutorOrderList.map(
        (item: EvaluatorInfo) => item.evaluationOrder,
      );
      maxOrder = customEvalutorOrderList[0];
      // ko co TH trung ng danh gia
      // for (let i = 0; i < customEvalutorOrderList.length; i++) {
      //   if (maxOrder < customEvalutorOrderList[i])
      //     maxOrder = customEvalutorOrderList[i];
      // }
      allowSeeList = evaluatorList.filter((item: any) => {
        return item.evaluationOrder <= maxOrder;
      });

      if (
        (evaluationStatus === 3 || evaluationStatus === 4) &&
        maxOrder.includes('0.5')
      ) {
        hasMode1 = true;
      } else if (
        (evaluationStatus === 5 || evaluationStatus === 6) &&
        maxOrder.includes('1.0')
      ) {
        hasMode1 = true;
      } else if (
        (evaluationStatus === 7 || evaluationStatus === 8) &&
        maxOrder.includes('2.0')
      ) {
        hasMode1 = true;
      }
      if (evaluationStatus === 53 && customEvalutorOrderList.includes('0.5')) {
        hasMode2 = true;
      } else if (
        evaluationStatus === 56 &&
        customEvalutorOrderList.includes('1.0')
      ) {
        hasMode2 = true;
      } else if (
        evaluationStatus === 59 &&
        customEvalutorOrderList.includes('2.0')
      ) {
        hasMode2 = true;
      }
      if (
        customEvalutorOrderList.includes('0.5') &&
        [54, 55].includes(evaluationStatus)
      )
        hasMode3 = true;
      else if (
        customEvalutorOrderList.includes('1.0') &&
        [57, 58].includes(evaluationStatus)
      )
        hasMode3 = true;
      else if (
        customEvalutorOrderList.includes('2.0') &&
        [60, 61].includes(evaluationStatus)
      )
        hasMode3 = true;
    }
    // }
    // get data for user info component
    // let name = '';
    // userInfo.evaluationId = id;

    // const userDepartment = await this.evaluationRepo.getDepartmentName(
    //   evaluation.user?.divisionId,
    // );
    // if (userDepartment) {
    //   if (evaluationStatus <= 49) {
    //     name = userDepartment.code + ': ' + userDepartment.name;
    //   } else {
    //     name = evaluation?.divisionName;
    //   }
    // }
    userInfo.department = evaluation.divisionName;
    userInfo.division = evaluation.divisionName;
    userInfo.evaluationLevel = evaluation?.level;
    userInfo.status = evaluation.status;
    userInfo.fiscalYear = evaluation?.title;
    userInfo.periodStart = evaluation?.periodStart;
    userInfo.periodEnd = evaluation?.periodEnd;
    userInfo.fullName = evaluation.user.fullName;
    userInfo.employeeNumber = evaluation.user.employeeNumber;
    userInfo.id = evaluation.user.id;
    userInfo.active = evaluation.user.active;
    let evaluator05Name = '仮評価: {evaluator05}';
    let evaluator1Name = '一次評価: {evaluator1}';
    let evaluator2Name = '二次評価: {evaluator2}';
    evaluatorList.map((item: any) => {
      if (item.evaluationOrder === '0.5')
        evaluator05Name = evaluator05Name.replace(
          '{evaluator05}',
          item.user.fullName,
        );
      if (item.evaluationOrder === '1.0')
        evaluator1Name = evaluator1Name.replace(
          '{evaluator1}',
          item.user.fullName,
        );
      if (item.evaluationOrder === '2.0')
        evaluator2Name = evaluator2Name.replace(
          '{evaluator2}',
          item.user.fullName,
        );
    });
    if (!evaluator05Name.includes('{'))
      userInfo.evaluators.push(evaluator05Name);
    if (!evaluator1Name.includes('{')) userInfo.evaluators.push(evaluator1Name);
    if (!evaluator2Name.includes('{')) userInfo.evaluators.push(evaluator2Name);
    //
    if ([1, 2, 3, 4, 5, 6, 7].includes(evaluation.level))
      throw new RuntimeException('level is changed', 204);
    const checkHasEvaluator2s = evaluatorList.filter((item: any) => {
      return item.evaluationOrder === '2.0';
    });

    hasEvaluator2 = checkHasEvaluator2s?.length !== 0;
    // check whether user is active in selected period
    const isActiveByPeriod = await this.evaluationRepo.checkUserActiveBYPeriod(
      results.evaluationList.evaluationPeriod.id,
      results.evaluationList.userId,
    );
    isDisable =
      checkHasEvaluator2s?.length === 0 ||
      isActiveByPeriod == null ||
      userInfo.active === 0;
    // Get reject comment for corresponding evaluator
    switch (evaluationStatus) {
      case 2: {
        findRejectCondition.type = 0;
        findRejectCondition.receiverOrder = '0.0';
        findRejectCondition.status = '被評価者へ差戻';
        break;
      }
      case 4: {
        findRejectCondition.type = 0;
        findRejectCondition.receiverOrder = '0.5';
        findRejectCondition.status = '仮評価者へ差戻';
        break;
      }
      case 6: {
        findRejectCondition.type = 0;
        findRejectCondition.receiverOrder = '1.0';
        findRejectCondition.status = '一次評価者へ差戻';
        break;
      }
      case 52: {
        findRejectCondition.type = 1;
        findRejectCondition.receiverOrder = '0.0';
        findRejectCondition.status = '被評価者へ差戻';
        break;
      }
      case 55: {
        findRejectCondition.type = 1;
        findRejectCondition.receiverOrder = '0.5';
        findRejectCondition.status = '仮評価者へ差戻';
        break;
      }
      case 58: {
        findRejectCondition.type = 1;
        findRejectCondition.receiverOrder = '1.0';
        findRejectCondition.status = '一次評価者へ差戻';
        break;
      }
      default:
        findRejectCondition.receiverOrder = '3.0';
    }
    if (findRejectCondition.receiverOrder !== '3.0') {
      const approvalList =
        await this.evaluationApprovalHistory.getApprovalHistory(
          findRejectCondition,
        );
      const rejectComment = approvalList[0]?.comment ?? '';
      if (role !== 'admin') {
        if (maxOrder) {
          if (findRejectCondition.receiverOrder <= maxOrder)
            userInfo.rejectComment = rejectComment;
        } else {
          if (findRejectCondition.receiverOrder == '0.0' && role === 'user') {
            userInfo.rejectComment = rejectComment;
          }
        }
      }
      if (role === 'admin') {
        userInfo.rejectComment = rejectComment;
      }
    }
    const finalData = {
      results,
      evaluationBasicBehavior: evaluationBasicBehaviorList?.sort((a, b) => {
        return a.itemNo - b.itemNo;
      }),
      hasMode1, // check display approve/reject on target period
      hasMode2, // check display approve/reject on evaluation period
      allowSeeList,
      maxOrder,
      userInfo,
      isDisable, // disable all buttons
      hasMode3, // check display button save draft/ submit on F2
      hasEvaluator2,
      listSumaryPercent: listSumaryPercent,
      evaluatorOrderList: evaluatorOrderList,
      isEvaluatorException: isEvaluatorException,
      flagSkill,
    };
    const stringData = JSON.stringify(finalData);
    const encode = encrypt(stringData, true);
    return encode;
    // }
    // return [];
  }
  async createOrUpdateEvaluation(
    dataSource: RequestDataSave[],
    additionData: AdditionData[],
    commentData: CommentContent,
    evaluationId: number,
    status: number,
    isDraft: boolean,
    listEvalutor: EvaluatorInfo[],
    total: Total,
    updatedTime: string,
    checkList: EvaluatorInfo[],
    host: string,
    listBehaviors: UserEvaluationBasicBehaviorType[],
    listPersonalGoals: EvaluationPersonalAchievementNew[],
    achievementPersonals: EvaluationAdditionalAchievementNew[],
    listProSkills?: UserEvaluationToProSkillType[],
    timeZone?: string,
    userId?: string,
  ) {
    let saveStatus = status;
    // let minOrder = listEvalutor[0].evaluationOrder;
    let selectedOrder = '';
    const currentEvaluation = await this.evaluationRepo.getUpdateTime(
      evaluationId,
    );
    //
    if (currentEvaluation.level < 8) {
      throw new RuntimeException('level is changed', 204);
    }
    if (updatedTime !== currentEvaluation.updatedTime.toISOString())
      throw new RuntimeException('Evaluation is duplicate', 409);

    // const customEvalutorOrderList = listEvalutor.map(
    //   (item: EvaluatorInfo) => item.evaluationOrder,
    // );
    const customEvalutorOrderList = await this.evaluationRepo.listEvaluator(
      evaluationId,
    );
    let minOrder = customEvalutorOrderList[0];
    for (let i = 0; i < customEvalutorOrderList?.length; i++) {
      if (minOrder > customEvalutorOrderList[i])
        minOrder = customEvalutorOrderList[i];
    }
    if (!isDraft && listEvalutor?.length && [0, 1, 2].includes(status)) {
      if (minOrder === '1.0') {
        saveStatus = 5;
        selectedOrder = '1.0';
      }
      if (minOrder === '2.0') {
        saveStatus = 7;
        selectedOrder = '2.0';
      }
      if (minOrder === '0.5') {
        saveStatus = 3;
        selectedOrder = '0.5';
      }
    }

    // F2
    if (!isDraft && listEvalutor.length && status > 49) {
      if (
        [50, 51, 52].includes(status) &&
        customEvalutorOrderList.includes('0.5')
      ) {
        saveStatus = 53;
        selectedOrder = '0.5';
      }
      if (
        [50, 51, 52].includes(status) &&
        customEvalutorOrderList.includes('1.0') &&
        !customEvalutorOrderList.includes('0.5')
      ) {
        saveStatus = 56;
        selectedOrder = '1.0';
      }
      if (
        [50, 51, 52].includes(status) &&
        customEvalutorOrderList.includes('2.0') &&
        !customEvalutorOrderList.includes('1.0') &&
        !customEvalutorOrderList.includes('0.5')
      ) {
        saveStatus = 59;
        selectedOrder = '2.0';
      }
      if (
        [54, 55].includes(status) &&
        customEvalutorOrderList.includes('1.0')
      ) {
        saveStatus = 56;
        selectedOrder = '1.0';
      }
      if (
        [54, 55].includes(status) &&
        !customEvalutorOrderList.includes('1.0') &&
        customEvalutorOrderList.includes('2.0')
      ) {
        saveStatus = 59;
        selectedOrder = '2.0';
      }
      if (
        [57, 58].includes(status) &&
        customEvalutorOrderList.includes('2.0')
      ) {
        saveStatus = 59;
        selectedOrder = '2.0';
      }
      if ([60, 61].includes(status) && customEvalutorOrderList.includes('2.0'))
        saveStatus = 98;
    }
    // prepare char_point

    // let summaryCharPointUser = currentEvaluation.summaryCharPointUser;
    let summaryCharPointEvaluator05 =
      currentEvaluation.summaryCharPointEvaluator05;
    let summaryCharPointEvaluator1 =
      currentEvaluation.summaryCharPointEvaluator1;
    let summaryCharPointEvaluator2 =
      currentEvaluation.summaryCharPointEvaluator2;
    checkList.map((item: any) => {
      // if (item?.charPoint && item.evaluator === '本人') {
      //   summaryCharPointUser = item.charPoint;
      // }

      if (item?.evaluator === '仮評価') {
        summaryCharPointEvaluator05 = item.charPoint;
      }
      if (item?.evaluator === '一次') {
        summaryCharPointEvaluator1 = item.charPoint;
      }
      if (item?.evaluator === '二次') {
        summaryCharPointEvaluator2 = item.charPoint;
      }
    });
    const evaluationChange = {
      status: isDraft
        ? status === 0
          ? 1
          : status === 50
          ? 51
          : saveStatus
        : saveStatus,
      commentUser: commentData?.commentUser,

      achievementAdditionalTotalPointUser:
        total.summaryAchievementAdditionalTotalPointUser,
      achievementAdditionalTotalPointEvaluator05:
        total.summaryAchievementAdditionalTotalPointEvaluator05,
      achievementAdditionalTotalPointEvaluator1:
        total.summaryAchievementAdditionalTotalPointEvaluator1,
      achievementAdditionalTotalPointEvaluator2:
        total.summaryAchievementAdditionalTotalPointEvaluator2,

      summaryCharPointUser: total.summaryCharPointUser,
      summaryCharPointEvaluator05: summaryCharPointEvaluator05,
      summaryCharPointEvaluator1: summaryCharPointEvaluator1,
      summaryCharPointEvaluator2: summaryCharPointEvaluator2,

      summaryPointUser: total.summaryPointUsers,
      summaryPointEvaluator05: total.summaryPointEvaluator05s,
      summaryPointEvaluator1: total.summaryPointEvaluator1s,
      summaryPointEvaluator2: total.summaryPointEvaluator2s,

      behaviorTotalPointUser: total.behaviorTotalPointUser,
      behaviorTotalPointEvaluator05: total.behaviorTotalPointEvaluator05,
      behaviorTotalPointEvaluator1: total.behaviorTotalPointEvaluator1,
      behaviorTotalPointEvaluator2: total.behaviorTotalPointEvaluator2,

      achievementPersonalTotalPointUser:
        total.summaryAchievementPersonalTotalPointUser,
      achievementPersonalTotalPointEvaluator05:
        total.summaryAchievementPersonalTotalPointEvaluator05,
      achievementPersonalTotalPointEvaluator1:
        total.summaryAchievementPersonalTotalPointEvaluator1,
      achievementPersonalTotalPointEvaluator2:
        total.summaryAchievementPersonalTotalPointEvaluator2,
      basicProTotalPointUser: total.basicProTotalPointUser,
      basicProTotalPointEvaluator05: total.basicProTotalPointEvaluator05,
      basicProTotalPointEvaluator1: total.basicProTotalPointEvaluator1,
      basicProTotalPointEvaluator2: total.basicProTotalPointEvaluator2,
      basicTotalPointUser: total.basicTotalPointUser,
      basicTotalPointEvaluator05: total.basicTotalPointEvaluator05,
      basicTotalPointEvaluator1: total.basicTotalPointEvaluator1,
      basicTotalPointEvaluator2: total.basicTotalPointEvaluator2,
      proTotalPointUser: total.proTotalPointUser,
      proTotalPointEvaluator05: total.proTotalPointEvaluator05,
      proTotalPointEvaluator1: total.proTotalPointEvaluator1,
      proTotalPointEvaluator2: total.proTotalPointEvaluator2,
    };
    // Mục tiêu cá nhân + mục tiêu thêm
    const summaryEvaluation = {
      summaryPointEvaluator1: total.summaryPointEvaluator1,
      summaryPointEvaluator2: total.summaryPointEvaluator2,
      summaryPointEvaluator05: total.summaryPointEvaluator05,
      summaryPointUser: total.summaryPointUser,

      achievementAdditionalTotalPointEvaluator1:
        total.achievementAdditionalTotalPointEvaluator1,
      achievementAdditionalTotalPointEvaluator2:
        total.achievementAdditionalTotalPointEvaluator2,
      achievementAdditionalTotalPointEvaluator05:
        total.achievementAdditionalTotalPointEvaluator05,
      achievementAdditionalTotalPointUser:
        total.achievementAdditionalTotalPointUser,

      achievementPersonalTotalPointEvaluator1:
        total.achievementPersonalTotalPointEvaluator1,
      achievementPersonalTotalPointEvaluator2:
        total.achievementPersonalTotalPointEvaluator2,
      achievementPersonalTotalPointEvaluator05:
        total.achievementPersonalTotalPointEvaluator05,
      achievementPersonalTotalPointUser:
        total.achievementPersonalTotalPointUser,

      summaryCharPointUser: total.summaryCharPointUser,
      summaryCharPointEvaluator05: summaryCharPointEvaluator05,
      summaryCharPointEvaluator1: summaryCharPointEvaluator1,
      summaryCharPointEvaluator2: summaryCharPointEvaluator2,
    };

    const transaction = await this.evaluationRepo.getNewTransaction();

    try {
      // Update table summary department
      await this.summaryDepartmentRepository.createOrUpdate({
        evaluationId,
        ...summaryEvaluation,
      });

      await this.evaluationRepo.updateEvaluation(
        evaluationChange,
        evaluationId,
        transaction,
      );
      await this.evaluationRepo.deleteEvaluationAchievementPersonal(
        evaluationId,
        transaction,
      );
      await this.evaluationRepo.deleteAdditionAchievement(
        evaluationId,
        transaction,
      );
      await this.evaluationRepo.deleteEvaluationPro(evaluationId, transaction);
      dataSource.map((res: RequestDataSave) => {
        res.evaluationId = evaluationId;
        res.weight = isNotNumber(res.weight) ? null : res.weight;
        res.pointUser = isNotNumber(res.pointUser) ? null : res.pointUser;
        res.pointEvaluator05 = isNotNumber(res.pointEvaluator05)
          ? null
          : res.pointEvaluator05;
        res.pointEvaluator1 = isNotNumber(res.pointEvaluator1)
          ? null
          : res.pointEvaluator1;
        res.pointEvaluator2 = isNotNumber(res.pointEvaluator2)
          ? null
          : res.pointEvaluator2;
      });
      additionData.map((res: AdditionData) => {
        res.evaluationId = evaluationId;
      });
      await this.evaluationRepo.updateEvaluationAchievementPersonal(
        dataSource,
        transaction,
      );
      await this.evaluationRepo.updateEvaluationAdditionAchievement(
        additionData,
        transaction,
      );

      //ProSkill
      const compareProSkills = listProSkills
        ? listProSkills.filter((v) => v.isDisable === true)
        : [];
      if (listProSkills) {
        listProSkills.map((e) => (e.evaluationId = evaluationId));
        await this.evaluationRepo.updateEvaluationPro(
          listProSkills,
          transaction,
        );
      }

      // Mục tiêu cá nhân thêm
      achievementPersonals.map((v, index) => {
        delete v.key;
        v.evaluationId = evaluationId;
        v.itemNo = index;
        v.type = 2;
        return v;
      });

      await this.evaluationRepo.updateEvaluationAdditionAchievement(
        achievementPersonals,
        transaction,
      );
      //basic and behavior
      await this.evaluationRepo.updateEvaluationBasicBehaviorSkill(
        evaluationId,
        transaction,
        listBehaviors,
      );
      // if (listBasics)
      //   await this.evaluationRepo.updateEvaluationBasicBehaviorSkill(
      //     evaluationId,
      //     transaction,
      //     listBasics,
      //   );
      // Thêm mục tiêu cá nhân => Type = 2
      const arrayPersonalGoals = listPersonalGoals
        .map((v, index) => {
          v.evaluationId = evaluationId;
          v.itemNo = index;
          v.type = 2;
          const num = Number(v.weight);
          if (isNaN(num) || v.weight === '') v.weight = null;
          const pointUser = Number(v.pointUser);
          if (isNaN(pointUser) || v.pointUser === '') v.pointUser = null;
          const pointEvaluator05 = Number(v.pointEvaluator05);
          if (isNaN(pointEvaluator05) || v.pointEvaluator05 === '')
            v.pointEvaluator05 = null;
          const pointEvaluator1 = Number(v.pointEvaluator1);
          if (isNaN(pointEvaluator1) || v.pointEvaluator1 === '')
            v.pointEvaluator1 = null;
          const pointEvaluator2 = Number(v.pointEvaluator2);
          if (isNaN(pointEvaluator2) || v.pointEvaluator2 === '')
            v.pointEvaluator2 = null;
          return v;
        })
        .sort((a, b) => {
          return a.itemNo - b.itemNo;
        });

      await this.evaluationRepo.updateEvaluationAchievementPersonal(
        arrayPersonalGoals,
        transaction,
      );

      // update evaluator comment (public + private)
      if (
        commentData.publicCommentAdmin2 ||
        commentData.privateCommentAdmin2 !== undefined
      ) {
        const updateValues = {
          commentPublic: commentData.publicCommentAdmin2,
          commentPrivate: commentData.privateCommentAdmin2,
        };
        await this.evaluationRepo.updateEvaluatorComment(
          updateValues,
          evaluationId,
          '2.0',
          transaction,
        );
      }
      if (
        commentData.publicCommentAdmin1 ||
        commentData.privateCommentAdmin1 !== undefined
      ) {
        const updateValues = {
          commentPublic: commentData.publicCommentAdmin1,
          commentPrivate: commentData.privateCommentAdmin1,
        };
        await this.evaluationRepo.updateEvaluatorComment(
          updateValues,
          evaluationId,
          '1.0',
          transaction,
        );
      }
      if (
        commentData.publicCommentAdmin05 ||
        commentData.privateCommentAdmin05 !== undefined
      ) {
        const updateValues = {
          commentPublic: commentData.publicCommentAdmin05,
          commentPrivate: commentData.privateCommentAdmin05,
        };
        await this.evaluationRepo.updateEvaluatorComment(
          updateValues,
          evaluationId,
          '0.5',
          transaction,
        );
      }
      const tempApprovers = listEvalutor.filter((item: EvaluatorInfo) => {
        if (item.evaluationOrder === selectedOrder) return item;
      });

      // 1. [User] Nếu trong thời gian thực hiện đặt mục tiêu. Khi submit sẽ lưu type: 0, comment: null
      // 2. [User] Nếu trong thời gian thực hiện đánh giá: Khi submit sẽ lưu type: 1,
      // 2.1 comment: Nếu có PRO SKILL chọn không tính điểm [disable] sẽ lưu  compareProSkills dưới dạng json
      // 2.2 comment: Nếu không có PRO SKILL nào [disable] sẽ lưu text: 専門的なスキルはすべて評価されます。
      // 3. [Evaluator] Submit trong thời gian đánh giá sẽ lưu lại lịch sử submit
      const dates = new Date(
        isFormatDate(new Date(), 'YYYY/M/D H:m', timeZone),
      );

      const updateValue = {
        evaluationId: evaluationId,
        comment: null,
        approverId: Number(userId),
        receiverId: null,
        receiverOrder: 0,
        type: 1,
        status: '提出',
        // createdTime: dates,
      };

      if (currentEvaluation.status < 50) {
        updateValue.type = 0;
      }

      if ([50, 51, 52].includes(currentEvaluation.status)) {
        // Nếu user thực hiện submit
        updateValue.type = 1;
        updateValue.comment = `${
          currentEvaluation.flagSkill === 1
            ? compareProSkills.length > 0
              ? JSON.stringify(compareProSkills)
              : 'MESSAGE.COMMON.IDS_PRO_SKILL_ALL_EVALUATE'
            : ''
        }`;
      }

      if (status > 52) {
        updateValue.type = 1;
        updateValue.comment = '';
        updateValue.status = 'IDS_EVALUATOR_EVALUATE';
      }
      if (!isDraft) {
        await this.evaluationRepo.createHistoryApproveReject(
          updateValue,
          transaction,
        );
      }
      if (!isDraft && selectedOrder) {
        await this.mailService.submitGoalAndEvaluation(
          tempApprovers[0].evaluatorId,
          currentEvaluation.userId,
          currentEvaluation,
          host,
        );
      }

      await transaction.commit();
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      throw new RuntimeException(
        error,
        error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return currentEvaluation;
  }

  async getGuideEvaluationByEvaluationId(id: number) {
    return await this.evaluationRepo.getGuideEvaluationByEvaluationId(id);
  }
  async approveEvaluation(
    evaluationId: number,
    status: number,
    listEvalutor: EvaluatorInfo[],
    maxOrder: string,
    content: string,
    approverId: number,
    updatedTime: string,
    host: string,
    companyGroupCode: string,
    timeZone: string,
  ) {
    let saveStatus = status;
    const currentEvaluation = await this.evaluationRepo.getUpdateTime(
      evaluationId,
    );
    if (currentEvaluation.level < 8) {
      throw new RuntimeException('level is changed', 204);
    }
    if (updatedTime !== currentEvaluation.updatedTime.toISOString())
      throw new RuntimeException('Evaluation is duplicate', 409);
    const dates = new Date(isFormatDate(new Date(), 'YYYY/M/D H:m', timeZone));
    const updateValue = {
      evaluationId: evaluationId,
      comment: content,
      approverId: approverId,
      receiverId: null, // ko quan trong
      receiverOrder: null, // ko quan trong
      type: null,
      status: 'IDS_APPROVE',
      // createdTime: dates,
    };
    const temps = listEvalutor.filter((item: EvaluatorInfo) => {
      return item.evaluationOrder > maxOrder;
    });
    let minOrder = temps[0]?.evaluationOrder;
    if (minOrder) {
      const customEvalutorOrderList = temps.map(
        (item: EvaluatorInfo) => item.evaluationOrder,
      );
      for (let i = 0; i < customEvalutorOrderList?.length; i++) {
        if (minOrder > customEvalutorOrderList[i])
          minOrder = customEvalutorOrderList[i];
      }
    }
    let selectedOrder = ``;
    if (status < 50) {
      updateValue.type = 0;
      if (status === 49) {
        saveStatus = 50;
      } else {
        if (maxOrder === '2.0') {
          saveStatus = 49;
        } else {
          if (minOrder === '1.0') {
            saveStatus = 5;
            selectedOrder = '1.0';
          }
          if (minOrder === '2.0') {
            saveStatus = 7;
            selectedOrder = '2.0';
          }
        }
      }
    } else {
      updateValue.type = 1;
      if (status === 98) {
        saveStatus = 99;
      } else {
        if (status === 53) {
          saveStatus = 54;
        }
        if (status === 56) {
          saveStatus = 57;
        }
        if (status === 59) {
          saveStatus = 60;
        }
      }
    }
    const evaluationChange = {
      status: saveStatus,
    };

    const transaction = await this.evaluationRepo.getNewTransaction();

    try {
      await this.evaluationRepo.updateEvaluation(
        evaluationChange,
        evaluationId,
        transaction,
      );
      await this.evaluationRepo.createHistoryApproveReject(
        updateValue,
        transaction,
      );

      if (status < 50 && selectedOrder) {
        const tempApprovers = listEvalutor.filter((item: EvaluatorInfo) => {
          if (item.evaluationOrder === selectedOrder) return item;
        });

        await this.mailService.sendMailApproveGoalSetting(
          tempApprovers[0].evaluatorId,
          currentEvaluation.userId,
          evaluationId,
          host,
          companyGroupCode,
        );
      } else if ([7, 59].includes(saveStatus)) {
        // 7: '【目標】二次評価者確認中',
        // 59: '【評価】二次評価者確認中',
        // Gửi mail cho user và cc evaluator 0.5/1 khi evaluator 2 approve
        // const tempApprovers = listEvalutor.filter((item: any) => {
        //   if (['0.5', '1.0'].includes(item.evaluationOrder)) return item;
        // });
        // await this.mailService.sendMailEvaluatorApproved(
        //   tempApprovers,
        //   currentEvaluation.userId,
        //   evaluationId,
        //   host,
        // );
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new RuntimeException(
        error,
        error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return saveStatus;
  }
  async rejectEvaluation(
    evaluationId: number,
    status: number,
    selectedOrder: string,
    content: string,
    approverId: number,
    ownerId: number,
    listEvalutor: EvaluatorInfo[],
    updatedTime: string,
    maxOrder: string,
    host: string,
    companyGroupCode: string,
    timeZone: string,
  ) {
    let saveStatus = status;
    const currentEvaluation = await this.evaluationRepo.getUpdateTime(
      evaluationId,
    );
    //
    if (currentEvaluation.level < 8) {
      throw new RuntimeException('level is changed', 204);
    }
    if (updatedTime !== currentEvaluation.updatedTime.toISOString())
      throw new RuntimeException('Evaluation is duplicate', 409);
    const dates = new Date(isFormatDate(new Date(), 'YYYY/M/D H:m', timeZone));
    const updateValue = {
      evaluationId: evaluationId,
      comment: content,
      approverId: approverId,
      receiverId: null,
      receiverOrder: null,
      type: null,
      status: '',
      // createdTime: dates,
    };
    const selectEvaluators = listEvalutor.filter((item: EvaluatorInfo) => {
      return item.evaluationOrder === selectedOrder;
    });
    if (status < 50) {
      updateValue.type = 0;
      if (selectedOrder === 'user') {
        saveStatus = 2;
        updateValue.receiverOrder = '0.0';
        updateValue.receiverId = ownerId;
        updateValue.status = '被評価者へ差戻';
      }
      if (selectedOrder === '0.5') {
        saveStatus = 4;
        updateValue.receiverOrder = '0.5';
        updateValue.receiverId = selectEvaluators[0].evaluatorId;
        updateValue.status = '仮評価者へ差戻';
      }
      if (selectedOrder === '1.0') {
        saveStatus = 6;
        updateValue.receiverOrder = '1.0';
        updateValue.receiverId = selectEvaluators[0].evaluatorId;
        updateValue.status = '一次評価者へ差戻';
      }
      if (selectedOrder === '2.0') {
        saveStatus = 8;
        updateValue.receiverOrder = '2.0';
        updateValue.receiverId = selectEvaluators[0].evaluatorId;
        updateValue.status = '二次評価者へ差戻';
      }
    } else {
      updateValue.type = 1;
      if (selectedOrder === 'user') {
        saveStatus = 52;
        updateValue.receiverOrder = '0.0';
        updateValue.receiverId = ownerId;
        updateValue.status = '被評価者へ差戻';
      }
      if (selectedOrder === '0.5') {
        saveStatus = 55;
        updateValue.receiverOrder = '0.5';
        updateValue.receiverId = selectEvaluators[0].evaluatorId;
        updateValue.status = '仮評価者へ差戻';
      }
      if (selectedOrder === '1.0') {
        saveStatus = 58;
        updateValue.receiverOrder = '1.0';
        updateValue.receiverId = selectEvaluators[0].evaluatorId;
        updateValue.status = '一次評価者へ差戻';
      }
      if (selectedOrder === '2.0') {
        saveStatus = 61;
        updateValue.receiverOrder = '2.0';
        updateValue.receiverId = selectEvaluators[0].evaluatorId;
        updateValue.status = '二次評価者へ差戻';
      }
    }

    const evaluationChange = {
      status: saveStatus,
    };
    // get cc reject list

    const tempOrder = [49, 98].includes(status) || !maxOrder ? '3.0' : maxOrder;
    const selectedOrderUser = selectedOrder === 'user' ? 0 : selectedOrder;
    const tempList = listEvalutor.filter((item: EvaluatorInfo) => {
      if (
        item.evaluationOrder > selectedOrderUser &&
        item.evaluationOrder < tempOrder
      )
        return item;
    });
    let rejectCcList: string[] = [];
    if (tempList) {
      rejectCcList = tempList.map((item: EvaluatorInfo) => {
        return item.user.email;
      });
    }

    const transaction = await this.evaluationRepo.getNewTransaction();
    try {
      await this.evaluationRepo.updateEvaluation(
        evaluationChange,
        evaluationId,
        transaction,
      );
      await this.evaluationRepo.createHistoryApproveReject(
        updateValue,
        transaction,
      );

      await this.mailService.sendMailRejectGoalSetting(
        approverId,
        selectEvaluators[0]?.evaluatorId ?? ownerId,
        ownerId,
        evaluationId,
        saveStatus,
        rejectCcList,
        host,
        'evaluation-8-10',
        companyGroupCode,
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new RuntimeException(
        error,
        error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return saveStatus;
  }

  async findListEvaluationItemHistory(query: any) {
    const versionProSkill =
      await this.proSkillRepository.findEvaluationItemsProSkill(query);
    return versionProSkill;
  }

  async detailProSkillById(id: number) {
    const childrens = await this.proSkillRepository.detailProSkill(id);
    if (childrens.length > 0) {
      const rejectComment =
        await this.proSkillSettingRepository.getRejectComment(id);

      const arrays = childrens.reduce((acc: any, current) => {
        const parents = acc.find(
          (v) => v.versionId === current.versionProSkill.id,
        );

        const childs = {
          itemId: current.itemId,
          versionId: current.versionId,
          jobType: current.jobType,
          mediumClass: current.mediumClass,
          smallClass: current.smallClass,
          content: current.content,
          difficulty: current.difficulty,
          note: current.note,
          id: current.id,
        };

        // Add setters and approvers
        const settersAndApprovers =
          childrens[0].versionProSkill.skill.skillRoles.reduce(
            (acc: { setters: string[]; approvers: string[] }, skillRole) => {
              if (skillRole.role == 1) {
                acc['setters'].push(skillRole.user.fullName);
              } else if (skillRole.role == 2) {
                acc['approvers'].push(skillRole.user.fullName);
              }

              return acc;
            },
            { setters: [], approvers: [] },
          );

        if (!parents) {
          acc.push({
            skill: `${current.versionProSkill.skill.name}`,
            version: `${current.versionProSkill.version}.${current.versionProSkill.subVersion}`,
            versionMain: current.versionProSkill.version,
            subVersion: current.versionProSkill.subVersion,
            status: current.versionProSkill.status,
            publicStatus: current.versionProSkill.publicStatus,
            creationUser: current.versionProSkill.user.fullName,
            updatedTime: current.versionProSkill.updatedTime,
            publicDate: current.versionProSkill.publicDate,
            reason: current.versionProSkill.reason,
            lastUpdatedTime: current.versionProSkill.lastUpdatedTime,
            childrens: [childs],
            versionId: current.versionId,
            settersAndApprovers: settersAndApprovers,
            rejectComment: rejectComment?.comment || '',
            dataChildrenFilter: [childs],
            skillActive: current.versionProSkill.skill.active,
            // listDepartment: departmentNames || '',
          });
        } else {
          parents.childrens.push(childs);
          parents.dataChildrenFilter.push(childs); // dùng dể search trên column header
        }

        return acc;
      }, []);
      return arrays[0];
    } else {
      const datas = await this.proSkillRepository.getProSkillById(id);
      const rejectComment =
        await this.proSkillSettingRepository.getRejectComment(id);

      // Add setters and approvers
      const settersAndApprovers = datas.skill.skillRoles.reduce(
        (acc: { setters: string[]; approvers: string[] }, skillRole) => {
          if (skillRole.role == 1) {
            acc['setters'].push(skillRole.user.fullName);
          } else if (skillRole.role == 2) {
            acc['approvers'].push(skillRole.user.fullName);
          }

          return acc;
        },
        { setters: [], approvers: [] },
      );
      return {
        ...datas.dataValues,
        skill: `${datas.dataValues.skill.name}`,
        version: `${datas.version}.${datas.subVersion}`,
        versionMain: datas.version,
        subVersion: datas.subVersion,
        versionId: datas.dataValues.id,
        lastUpdatedTime: datas.dataValues.lastUpdatedTime,
        childrens: [],
        settersAndApprovers: settersAndApprovers,
        rejectComment: rejectComment?.comment || '',
        skillActive: datas.skill.active,
        // listDepartment: departmentNames || '',
      };
    }
  }

  async publicVersionService(
    id: number,
    body: any,
    userId: number,
    _hostname: string,
    _fullName: string,
    companyGroupCode: string,
    timeZone: string,
  ) {
    const findById = await this.proSkillRepository.getProSkillById(id);

    // Tìm max version với phòng ban này
    // check sub version # 0
    // + Khác 0 sẽ cập nhật lại là 0
    // + version max của phòng ban + 1
    // status = 4
    // public status = 1
    // creation_user = user thực hiện chức năng
    // Cập nhật lại tất cả version đang được public về 0 thuộc phòng ban này
    const years = moment().tz(timeZone);
    const periods = await this.evaluationPeriodRepo.getAll({
      [Op.and]: [
        {
          [Op.or]: [
            { year: years.tz(timeZone).format('YYYY') },
            { year: years.add(-1, 'y').format('YYYY') },
          ],
        },
        {
          companyGroupCode: companyGroupCode,
        },
        {
          checkFixed: { [Op.ne]: 2 },
        },
      ],
    });

    for (let index = 0; index < periods.length; index++) {
      const isDuringGoalSetting = compareDatePeriod(
        periods[index].dateCreationGoalStart,
        periods[index].dateCreationGoalEnd,
        timeZone,
      );
      // const isDuringEvaluation = compareDatePeriod(
      //   periods[index].dateEvaluationStart,
      //   periods[index].dateEvaluationEnd,
      // );

      if (isDuringGoalSetting) {
        return {
          code: 403,
          isDuringGoalSetting,
          // isDuringEvaluation,
          goalSettingStart: periods[index].dateCreationGoalStart,
          goalSettingEnd: periods[index].dateCreationGoalEnd,
          evaluationStart: periods[index].dateEvaluationStart,
          evaluationEnd: periods[index].dateEvaluationEnd,
        };
      }
    }

    if (
      new Date(findById.updatedTime).getTime() ===
      new Date(body.updatedTime).getTime()
    ) {
      const versionMax = await this.proSkillRepository.versionMax('version', {
        skillId: findById.skillId,
        companyGroupCode: companyGroupCode,
      });
      const transactionVersionProSkill =
        await this.proSkillSettingRepository.getTransactionVersionProSkill();
      if (findById.subVersion !== 0) {
        try {
          this.proSkillRepository.updateVersion(
            {
              publicStatus: 0,
              publicDate: null,
            },
            {
              skillId: findById.skillId,
              publicStatus: 1,
              companyGroupCode: companyGroupCode,
            },
            transactionVersionProSkill,
          );
          const dataUpdated = {
            version: Math.floor(versionMax + 1),
            subVersion: 0,
            status: 4,
            publicStatus: 1,
            publicDate: isFormatDate(new Date(), 'YYYY/M/D H:mm', timeZone),
            lastUpdatedTime: isFormatDate(
              new Date(),
              'YYYY/M/D H:mm',
              timeZone,
            ),
          };

          const results = await this.proSkillRepository.updateVersion(
            dataUpdated,
            {
              id: findById.id,
            },
            transactionVersionProSkill,
          );
          // ======= Tạo 1 record trong bảng history_approve_pro_skill_tbl
          // Object: versionId , comment , status: Nếu public sẽ để là 公開, creation_user: user thực hiện chức năng
          const objectHistory = {
            versionId: findById.id,
            comment: body.reason,
            creationUser: userId,
            status: '公開',
            createdTime: new Date(
              isFormatDate(new Date(), 'YYYY-M-D HH:mm:ss', timeZone),
            ),
          };
          await this.proSkillRepository.createHistory(
            objectHistory,
            transactionVersionProSkill,
          );
          // this.mailService.sendMailPublicProSkill(results[0].id, hostname);
          await transactionVersionProSkill.commit();
          return {
            updatedTime: results[0].updatedTime,
            version: `${results[0].version}.${results[0].subVersion}`,
            publicDate: results[0].publicDate,
            publicStatus: results[0].publicStatus,
            versionMain: results[0].version,
            subVersion: results[0].subVersion,
            status: results[0].status,
            id: results[0].id,
          };
        } catch (error) {
          await transactionVersionProSkill.rollback();
          throw new RuntimeException(error, 500);
        }
      } else {
        try {
          await this.proSkillRepository.updateVersion(
            {
              publicStatus: 0,
              publicDate: null,
            },
            {
              skillId: findById.skillId,
              publicStatus: 1,
              companyGroupCode: companyGroupCode,
            },
            transactionVersionProSkill,
          );
          const dataUpdated = {
            status: 4,
            publicStatus: 1,
            publicDate: isFormatDate(new Date(), 'YYYY/M/D H:mm', timeZone),
            lastUpdatedTime: isFormatDate(
              new Date(),
              'YYYY/M/D H:mm',
              timeZone,
            ),
          };
          const results = await this.proSkillRepository.updateVersion(
            dataUpdated,
            {
              id: findById.id,
            },
            transactionVersionProSkill,
          );
          // ======= Tạo 1 record trong bảng history_approve_pro_skill_tbl
          // Object: versionId , comment , status: Nếu public sẽ để là 公開, creation_user: user thực hiện chức năng
          const objectHistory = {
            versionId: findById.id,
            comment: body.reason,
            creationUser: userId,
            status: '公開',
            createdTime: new Date(
              isFormatDate(new Date(), 'YYYY-M-D HH:mm:ss', timeZone),
            ),
          };
          await this.proSkillRepository.createHistory(
            objectHistory,
            transactionVersionProSkill,
          );
          // this.mailService.sendMailPublicProSkill(results[0].id, hostname);
          await transactionVersionProSkill.commit();
          return {
            updatedTime: results[0].updatedTime,
            version: `${results[0].version}.${results[0].subVersion}`,
            publicDate: results[0].publicDate,
            publicStatus: results[0].publicStatus,
            versionMain: results[0].version,
            subVersion: results[0].subVersion,
            status: results[0].status,
            id: results[0].id,
          };
        } catch (error) {
          await transactionVersionProSkill.rollback();
          throw new RuntimeException(error, 500);
        }
      }
    } else {
      throw new RuntimeException('Date invalid', 409);
    }
  }

  async rejectVersionService(
    id: number,
    body: any,
    userId: number,
    hostname: string,
    companyGroupCode: string,
    timeZone: string,
  ) {
    const findById = await this.proSkillRepository.getProSkillById(id);
    // Tìm max version với phòng ban này
    // check sub version # 0
    // + Khác 0 sẽ cập nhật lại là 0
    // + version max của phòng ban + 1
    // status = 4
    // public status = 1
    // creation_user = user thực hiện chức năng
    // Cập nhật lại tất cả version đang được public về 0 thuộc phòng ban này

    if (
      new Date(findById.updatedTime).getTime() ===
      new Date(body.updatedTime).getTime()
    ) {
      const transactionVersionProSkill =
        await this.proSkillSettingRepository.getTransactionVersionProSkill();
      if (findById.subVersion !== 0) {
        try {
          const dataUpdated = {
            status: 5,
            publicStatus: 0,
            lastUpdatedTime: isFormatDate(
              new Date(),
              'YYYY/M/D H:mm',
              timeZone,
            ),
          };

          const results = await this.proSkillRepository.updateVersion(
            dataUpdated,
            {
              id: findById.id,
            },
            transactionVersionProSkill,
          );
          // ======= Tạo 1 record trong bảng history_approve_pro_skill_tbl
          // Object: versionId , comment , status: Nếu public sẽ để là 公開, creation_user: user thực hiện chức năng

          const objectHistory = {
            versionId: findById.id,
            comment: body.reason,
            creationUser: userId,
            status: '差戻',
            createdTime: new Date(
              isFormatDate(new Date(), 'YYYY-M-D HH:mm:ss', timeZone),
            ),
          };
          await this.proSkillRepository.createHistory(
            objectHistory,
            transactionVersionProSkill,
          );
          this.mailService.sendMailRejectProSkillFromAdmin(
            results[0].id,
            userId,
            hostname,
            companyGroupCode,
          );
          await transactionVersionProSkill.commit();
          return results[0];
        } catch (error) {
          await transactionVersionProSkill.rollback();
          throw new RuntimeException(error, 500);
        }
      } else {
        try {
          const dataUpdated = {
            status: 5,
            publicStatus: 0,
            lastUpdatedTime: isFormatDate(
              new Date(),
              'YYYY/M/D H:mm',
              timeZone,
            ),
          };
          const results = await this.proSkillRepository.updateVersion(
            dataUpdated,
            {
              id: findById.id,
            },
            transactionVersionProSkill,
          );
          // ======= Tạo 1 record trong bảng history_approve_pro_skill_tbl
          // Object: versionId , comment , status: Nếu public sẽ để là 公開, creation_user: user thực hiện chức năng
          const objectHistory = {
            versionId: findById.id,
            comment: body.reason,
            creationUser: userId,
            status: '差戻',
            createdTime: new Date(
              isFormatDate(new Date(), 'YYYY-M-D HH:mm:ss', timeZone),
            ),
          };
          await this.proSkillRepository.createHistory(
            objectHistory,
            transactionVersionProSkill,
          );
          this.mailService.sendMailRejectProSkillFromAdmin(
            results[0].id,
            userId,
            hostname,
            companyGroupCode,
          );
          await transactionVersionProSkill.commit();
          return results[0];
        } catch (error) {
          await transactionVersionProSkill.commit();
          throw new RuntimeException(error, 500);
        }
      }
    } else {
      throw new RuntimeException('Date invalid', 409);
    }
  }
  async checkPermission(evaluationId: number, userId: number) {
    const currentEvaluation = await this.evaluationRepo.getUpdateTime(
      evaluationId,
    );
    return currentEvaluation.userId == userId;
  }
  async checkEvaluatorPermission(evaluationId: number, userId: number) {
    const currentEvaluation = await this.evaluationRepo.getUpdateTime(
      evaluationId,
    );
    const tempList = [];
    if (currentEvaluation && currentEvaluation.evaluator) {
      currentEvaluation.evaluator.map((item: Evaluator) => {
        if (item.evaluatorId == userId) tempList.push(item.evaluatorId);
      });
    }

    return tempList;
  }

  async sendMailFixedGoal(
    data: any,
    companyGroupCode: string,
    //    {
    //   toEmails: string[];
    //   mailContent: {
    //     subject: string;
    //     editor: string;
    //   };
    //   emailType: number;
    //   status: number;
    //   evaluationPeriodId: number;
    //   goalEvaluation: string[];
    //   goaldepartmentEvaluation: string[];

    //   sendTimeActual: Date;
    //   id: number[];
    //   type: string;
    // }
    timeZone: string,
    emailHR: string,
  ) {
    const transaction =
      await this.evaluationRepo.updateHistoryMailTransaction();
    // console.log(data.goalEvaluation.join(' ~ '));
    const object = {
      ...data,
      toEmails: data.toEmails.toString(),
      sendTimeActual: isFormatDate(new Date(), 'YYYY/M/D H:mm', timeZone),
      evaluationTime: data.goalEvaluation.join(' ~ '),
      evaluationDepartmentTime: data.goaldepartmentEvaluation.join(' ~ '),
    };

    try {
      let result;
      if (
        (data.type === 'fixedGoal' && data.emailType === 1) || //fixedGoal và 被評価者と評価者へ
        (data.type === 'fixedEvaluation' && data.emailType === 3) //fixedEvaluation và 被評価者と評価者へ
      ) {
        result = await this.mailService.sendMailFixedUserEvaluator(
          data,
          object,
          companyGroupCode,
          transaction,
        );
      } else if (
        (data.type === 'fixedGoal' && data.emailType === 9) ||
        (data.type === 'fixedEvaluation' && data.emailType === 10)
      ) {
        result = await this.mailService.sendMailFixedEvaluator(
          data,
          object,
          companyGroupCode,
          transaction,
          emailHR,
        );
      } else {
        result = await this.mailService.sendMailFixedGoal(
          data,
          data.toEmails,
          companyGroupCode,
        );
        await this.evaluationRepo.updateHistoryMail(
          object,
          companyGroupCode,
          transaction,
        );
      }

      await this.evaluationRepo.updateGoalCreationTime(
        data.evaluationPeriodId,
        data.emailType,
        data.type,
        data.goalEvaluation,
        data.goaldepartmentEvaluation,
        transaction,
        timeZone,
      );
      await transaction.commit();
      return result;
    } catch (error) {
      console.log(error);

      await transaction.rollback();
      throw new RuntimeException(error.message.toString(), 500);
    }
  }

  async sendMaiNotFixed(
    data: {
      listEvaluation: {
        id: number;
        status: number;
        level: number;
        division_name: string;
        creation_user: number;
        user_email: string;
        user_full_name: string;
        year: string;
        period_index: number;
        evaluator_05_email: string;
        evaluator_05_full_name: string;
        evaluator_1_email: string;
        evaluator_1_full_name: string;
        evaluator_2_email: string;
        evaluator_2_full_name: string;
      }[];
      toEmails: string[];
      title: string;
      content: string;
      evaluationPeriodId: number;
      emailType: number;
      type: string;
      companyGroupCode: string;
    },
    emailHR: string,
  ) {
    const transaction =
      await this.evaluationRepo.updateHistoryMailTransaction();

    try {
      const result = await this.mailService.sendMailNotFixed(
        data,
        transaction,
        emailHR,
      );

      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      this.logger.log(
        null,
        `Send mail remind evaluation failed * ${data.evaluationPeriodId}  * ${
          data.toEmails
        }  - ${new Date()} - ${error}`,
      );
      throw new RuntimeException(error, 500);
    }
  }

  async getRejectComment(versionId: number) {
    return await this.proSkillSettingRepository.getRejectComment(versionId);
  }

  async getEvalNotFixedGoalPeriod(
    year: string,
    period_index: number,
    day: number,
    companyGroupCode: string,
  ) {
    return await this.evaluationRepo.getAllEvalNotFixedGoalPeriodByPeriod(
      year,
      period_index,
      day,
      companyGroupCode,
    );
  }

  async getEvalNotFixedEvalPeriod(
    year: string,
    period_index: number,
    day: number,
    companyGroupCode: string,
  ) {
    return await this.evaluationRepo.getAllEvalNotFixedEvalPeriodByPeriod(
      year,
      period_index,
      day,
      companyGroupCode,
    );
  }

  async getAllDepartmentEvaluation(
    query: {
      year: number;
      periodIndex: number;
    },
    companyGroupCode: string,
  ) {
    return await this.evaluationRepo.getAllDepartmentEvaluation(
      query,
      companyGroupCode,
    );
  }
  async getAllDepartmentEvaluationDefault(
    query: {
      year: number;
      periodIndex: number;
    },
    companyGroupCode: string,
  ) {
    return await this.evaluationRepo.getAllDepartmentEvaluationDefault(
      query,
      companyGroupCode,
    );
  }
  async getDetailProfessionalExpertise(
    userId: number,
    yearStart: string,
    yearEnd: string,
    companyGroupCode: string,
    evaluatorId: number,
  ) {
    // Tìm kỳ đánh giá cuối cùng => tìm period id
    // Chỉ xem được những evaluation trong quá khứ
    // kỳ tương lai không là người đánh giá thì không xem được. Ex: 2025 1 là người giá , nhưng kì 2 2025 đã public nhưng không phải là người đánh giá sẽ không xem được kỳ này.
    // evaluator_tbl => evaluation => order by period_id DESC LIMIT 1.
    // where id của period_tbl <= id tìm được.
    const evaluationPeriod = (
      await this.evaluatorRepository.getLastestPeriodIdByEvaluator(
        evaluatorId,
        companyGroupCode,
      )
    ).map((item: any) => {
      return {
        evaluationPeriodId: item.evaluationPeriodId,
      };
    }) as { evaluationPeriodId: number }[];

    const datas: {
      companyGroupCode: string;
      id: number;
      periodStart: string;
      periodEnd: string;
      periodIndex: number;
      year: string;
      evaluations: {
        id: number;
        userId: number;
        status: number;
        evaluationPro: {
          evaluationId: number;
          difficulty: number;
          itemId: string;
          itemTitle: string;
          jobType: string;
          pointEvaluator2: number;
        }[];
      }[];
    }[] = await this.evaluationRepo.getProfessionalExpertiseDetail(
      userId,
      yearStart,
      yearEnd,
      companyGroupCode,
      evaluationPeriod[0].evaluationPeriodId,
    );

    const resultsEvaluationProList = [];
    for (let index = 0; index < datas.length; index++) {
      for (let i = 0; i < datas[index].evaluations.length; i++) {
        for (
          let j = 0;
          j < datas[index].evaluations[i].evaluationPro.length;
          j++
        ) {
          const itemTitle =
            datas[index].evaluations[i].evaluationPro[j].itemTitle.split('_');
          itemTitle.pop();
          resultsEvaluationProList.push({
            year: datas[index].year,
            periodIndex: datas[index].periodIndex,
            largeClass: itemTitle[0],
            mediumClass: itemTitle.join('_'),
            smallClass: datas[index].evaluations[i].evaluationPro[j].itemTitle
              .split('_')
              .pop(),
            difficulty: datas[index].evaluations[i].evaluationPro[j].difficulty,
            pointEvaluator2:
              datas[index].evaluations[i].evaluationPro[j].pointEvaluator2,
            evaluationId:
              datas[index].evaluations[i].evaluationPro[j].evaluationId,
            jobType: datas[index].evaluations[i].evaluationPro[j].jobType,
          });
        }
      }
    }
    // Gộp PRO SKILL của tất cả kỳ đánh giá với nhau
    const mergeObjectsJobType: {
      year: string;
      periodIndex: number;
      jobType: string;
      totalJobType: number;
      childrens: {
        mediumClass: string;
        largeClass: string;
        smallClass: string;
        difficulty: number;
        pointEvaluator2: number;
        evaluationId: number;
        year: string;
        periodIndex: number;
      }[];
    }[] = resultsEvaluationProList.reduce((acc, curr) => {
      if (!acc[`${curr.jobType}`]) {
        acc[`${curr.jobType}`] = {
          jobType: curr.jobType,
          childrens: [],
        };
      }
      acc[`${curr.jobType}`].childrens.push({
        mediumClass: curr.mediumClass,
        largeClass: curr.largeClass,
        smallClass: curr.smallClass,
        difficulty: curr.difficulty,
        pointEvaluator2: curr.pointEvaluator2,
        evaluationId: curr.evaluationId,
        year: curr.year,
        periodIndex: curr.periodIndex,
      });
      return acc;
    }, {});

    // Chia Tách Job theo kì mục tiêu
    const resultsJobByPeriod: any = Object.values(mergeObjectsJobType).map(
      (v, i) => {
        const childrensByPeriod = v.childrens.reduce((acc, curr) => {
          if (!acc[`${curr.year}-${curr.periodIndex}`]) {
            acc[`${curr.year}-${curr.periodIndex}`] = {
              year: curr.year,
              periodIndex: curr.periodIndex,
              childs: [],
            };
          }
          acc[`${curr.year}-${curr.periodIndex}`].childs.push({
            year: curr.year,
            periodIndex: curr.periodIndex,
            difficulty: curr.difficulty,
            mediumClass: curr.mediumClass,
            largeClass: curr.largeClass,
            smallClass: curr.smallClass,
            pointEvaluator2: curr.pointEvaluator2,
            evaluationId: curr.evaluationId,
          });
          return acc;
        }, {});
        v.childrens = Object.values(childrensByPeriod);
        return v;
      },
    );
    // Chia 2 mảng: 1 mảng tách ra theo phân loại lớn, 1 mảng tách ra theo phân loại vừa
    resultsJobByPeriod.map((v) => {
      const childrens = v.childrens.map((val) => {
        const largeClassfications = val.childs.reduce((acc, curr) => {
          const mediumClassSlice = curr.mediumClass.split('_');
          if (!acc[curr.largeClass]) {
            acc[curr.largeClass] = {
              largeClass: curr.largeClass,
              year: curr.year,
              periodIndex: curr.periodIndex,
              evaluationId: curr.evaluationId,
              childrens: [],
            };
          }
          acc[curr.largeClass].childrens.push({
            difficulty: curr.difficulty,
            mediumClass:
              mediumClassSlice.slice(1).join('_').replace(/\n/g, '') ||
              mediumClassSlice[0],
            smallClass: curr.smallClass,
            pointEvaluator2: curr.pointEvaluator2,
          });

          return acc;
        }, []);

        const mediumClassfications = val.childs.reduce((acc, curr) => {
          const mediumClassSlice = curr.mediumClass.split('_');
          if (
            !acc[
              mediumClassSlice.slice(1).join('_').replace(/\n/g, '') ||
                mediumClassSlice[0]
            ]
          ) {
            acc[
              mediumClassSlice.slice(1).join('_').replace(/\n/g, '') ||
                mediumClassSlice[0]
            ] = {
              largeClass: curr.largeClass,
              mediumClass:
                mediumClassSlice.slice(1).join('_').replace(/\n/g, '') ||
                mediumClassSlice[0],
              year: curr.year,
              periodIndex: curr.periodIndex,
              evaluationId: curr.evaluationId,
              childrens: [],
            };
          }
          acc[
            mediumClassSlice.slice(1).join('_').replace(/\n/g, '') ||
              mediumClassSlice[0]
          ].childrens.push({
            largeClass: curr.largeClass,
            difficulty: curr.difficulty,
            mediumClass:
              mediumClassSlice.slice(1).join('_').replace(/\n/g, '') ||
              mediumClassSlice[0],
            smallClass: curr.smallClass,
            pointEvaluator2: curr.pointEvaluator2,
          });

          return acc;
        }, []);

        val.childrenLarge = Object.values(largeClassfications);
        val.childrenMedium = Object.values(mediumClassfications);

        return val;
      });

      return v;
    });

    // tính điểm của từng Job theo kỳ đánh giá:
    const CaculatorJobTypeList = resultsJobByPeriod.map((v, i) => {
      const jobAnyPeriod = v.childrens.map((val, index) => {
        const totalPoint = val.childs.reduce((acc, curr) => {
          return acc + Math.floor(curr.pointEvaluator2 * curr.difficulty);
        }, 0);
        val.totalPoint = Number(
          Math.round(totalPoint / val.childs.length).toFixed(2),
        );
        // Tính điểm mediumClass
        val.childrenMedium.map((childMe, index) => {
          const totalPoint = childMe.childrens.reduce((acc, curr) => {
            return acc + Math.floor(curr.pointEvaluator2 * curr.difficulty);
          }, 0);

          childMe.totalPoint = Number(
            Math.round(totalPoint / childMe.childrens.length).toFixed(2),
          );

          return childMe;
        });
        // Tính điểm của phân loại lớn.
        val.childrenLarge.map((childMe, index) => {
          const totalPoint = childMe.childrens.reduce((acc, curr) => {
            return acc + Math.floor(curr.pointEvaluator2 * curr.difficulty);
          }, 0);

          childMe.totalPoint = Number(
            Math.round(totalPoint / childMe.childrens.length).toFixed(2),
          );

          return childMe;
        });

        return val;
      });
      return v;
    });

    const result = CaculatorJobTypeList.map((job) => {
      // Lấy danh sách tất cả các cặp mediumClass và smallClass duy nhất
      const allClassPairs = Array.from(
        new Set(
          job.childrens.flatMap((child) =>
            child.childs.map(
              (childItem) =>
                `${childItem.mediumClass}::${childItem.smallClass}`,
            ),
          ),
        ),
      ).map((pair: string) => {
        const [mediumClass, smallClass] = pair.split('::');
        return { mediumClass, smallClass };
      });

      // Cập nhật từng phần tử childrens
      const updatedChildrens = job.childrens.map((child) => {
        const childMap = new Map(
          child.childs.map((childItem) => [
            `${childItem.mediumClass}::${childItem.smallClass}`,
            childItem,
          ]),
        );
        // Đảm bảo tất cả các cặp mediumClass và smallClass đều tồn tại
        const updatedChilds = allClassPairs.map(
          ({ mediumClass, smallClass }) => {
            if (childMap.has(`${mediumClass}::${smallClass}`)) {
              return childMap.get(`${mediumClass}::${smallClass}`);
            } else {
              const mediumClassSlice = mediumClass.split('_');

              return {
                largeClass: mediumClassSlice[0],
                mediumClass,
                smallClass,
                pointEvaluator2: 0,
                difficulty: 0,
                periodIndex: child.periodIndex,
                year: child.year,
              };
            }
          },
        );

        return {
          ...child,
          childs: updatedChilds,
        };
      });
      // MediumClass
      const allClassPairsMediumClass = Array.from(
        new Set(
          job.childrens.flatMap((child) =>
            child.childrenMedium.map(
              (childItem) =>
                `${childItem.mediumClass}::${childItem.largeClass}`,
            ),
          ),
        ),
      ).map((pair: string) => {
        const [mediumClass, largeClass] = pair.split('::');
        return { mediumClass, largeClass };
      });

      const mediumClassChildrens = job.childrens.map((child) => {
        const childMap = new Map(
          child.childrenMedium.map((childItem) => [
            `${childItem.mediumClass}`,
            childItem,
          ]),
        );

        // Đảm bảo tất cả các cặp mediumClass và smallClass đều tồn tại
        const updatedChilds = allClassPairsMediumClass.map(
          ({ mediumClass, largeClass }) => {
            if (childMap.has(`${mediumClass}`)) {
              return childMap.get(`${mediumClass}`);
            } else {
              return {
                largeClass,
                mediumClass,
                pointEvaluator2: 0,
                difficulty: 0,
                periodIndex: child.periodIndex,
                year: child.year,
                totalPoint: 0,
              };
            }
          },
        );
        return updatedChilds;
      });
      // Large medium class
      // MediumClass
      const allClassPairsLargeClass = Array.from(
        new Set(
          job.childrens.flatMap((child) =>
            child.childrenLarge.map((childItem) => `${childItem.largeClass}`),
          ),
        ),
      ).map((pair: string) => {
        const [largeClass] = pair.split('::');
        return { largeClass };
      });
      const largelassChildrens = job.childrens.map((child) => {
        const childMap = new Map(
          child.childrenLarge.map((childItem) => [
            `${childItem.largeClass}`,
            childItem,
          ]),
        );
        // Đảm bảo tất cả các cặp mediumClass và smallClass đều tồn tại
        const updatedChilds = allClassPairsLargeClass.map(({ largeClass }) => {
          if (childMap.has(`${largeClass}`)) {
            return childMap.get(`${largeClass}`);
          } else {
            return {
              largeClass,
              pointEvaluator2: 0,
              difficulty: 0,
              periodIndex: child.periodIndex,
              year: child.year,
              totalPoint: 0,
            };
          }
        });
        return updatedChilds;
      });

      //
      return {
        ...job,
        childrens: updatedChildrens,
        childrenMedium: mediumClassChildrens
          .flat()
          .sort((a, b) => a.year - b.year),
        childrenLarge: largelassChildrens
          .flat()
          .sort((a, b) => a.year - b.year),
      };
    });
    result.forEach((element) => {
      element.childrens.sort((a, b) => a.year - b.year); //
    });

    return {
      results: result,
    };
  }

  async goalsPastEvaluation(
    type: number,
    year: number,
    periodIndex: number,
    userId: number,
    evaluationPeriodId: number,
  ) {
    return await this.evaluationPeriodRepo.goalsPastEvaluationRepo(
      type,
      year,
      periodIndex,
      userId,
      evaluationPeriodId,
    );
  }
}
