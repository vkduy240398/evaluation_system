import { HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { EvaluationRepository } from 'src/repository/evaluation.repository';
import { Pdf17Service } from './pdf17.service';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { Pdf810Service } from './pdf810.service';
import { ReportRepository } from 'src/repository/report.repository';
import { Evaluation } from 'src/entity/Evaluation';
import { SettingProFormulaSub } from 'src/entity/SettingProFormulaSub';
import { AchievementAdditionalType } from 'src/interfaces/user.interfaces';
import { compareDatePeriod } from 'src/common/util';
import { PdfService } from './pdf.service';
import { EvaluationDetail17Type } from 'src/interfaces/service/pdfService.interface';
import { UserRepository } from 'src/repository/user.repository';
import { EvaluationBasicBehavior } from 'src/entity/EvaluationBasicBehavior';
import { PdfReviewService } from './pdf.review.service';
import { Pdf810Helper } from 'src/common/pdf/Pdf810Helper';

@Injectable({ scope: Scope.REQUEST })
export class ReportService {
  @Inject(EvaluationRepository)
  private evaluationRepository: EvaluationRepository;

  // ** Export report pdf
  @Inject(ReportRepository)
  private reportRepo: ReportRepository;

  @Inject(PdfService)
  private pdfService: PdfService;

  @Inject(PdfReviewService)
  private pdfReviewService: PdfReviewService;

  @Inject(UserRepository)
  private userRepo: UserRepository;

  /**
   * Export evaluation report with specified status
   *
   * @author tran.le.ha.nam
   * @last_update
   * @param evaluationId - Id of user's evaluation
   */
  async exportEvaluationReportPdf(evaluationId: number) {
    const templateOneStatus = 100;
    const templateTwoStatus = Array.from(new Array(50), (x, i) => i + 1);
    const templateThreeStatus = Array.from(new Array(49), (x, i) => i + 51);

    const evaluation = await this.evaluationRepository.getEvaluationUserById(
      evaluationId,
    );

    if (!evaluation) {
      throw new RuntimeException('Evaluation not found', HttpStatus.NOT_FOUND);
    }

    const pdfService = new Pdf17Service();

    let results = null;
    if (evaluation.status === templateOneStatus) {
      results = await pdfService.exportEvaluationReportPdf(evaluation, 1);
    }

    if (templateTwoStatus.includes(evaluation.status)) {
      results = await pdfService.exportEvaluationReportPdf(evaluation, 2);
    }

    if (templateThreeStatus.includes(evaluation.status)) {
      results = await pdfService.exportEvaluationReportPdf(evaluation, 3);
    }

    return results;
  }

  async exportMultiEvaluationReportPdf(evaluationIds: string[]) {
    const ids = evaluationIds.map((el) => parseInt(el));

    const evaluations =
      await this.evaluationRepository.getEvaluationUserByListId(ids);

    if (!evaluations || evaluations.length === 0) {
      throw new RuntimeException('Evaluation not found', HttpStatus.NOT_FOUND);
    }

    const pdfService = new Pdf17Service();
    const results = await pdfService.exportParentReportPdf(evaluations);

    return results;
  }
  async exportEvaluation810ReportPdf(
    evaluationId: number,
    orientation: 'l' | 'p' = 'p',
    size: string,
  ) {
    const evaluation = await this.evaluationRepository.getEvaluationUserById(
      evaluationId,
    );
    if (!evaluation) {
      throw new RuntimeException('Evaluation not found', HttpStatus.NOT_FOUND);
    }
    // const vertionSetting8 = await this.evaluationRepo.getversionSettingForPDF();
    const subList =
      await this.evaluationRepository.getSubListByAchievementPersonalId(
        evaluation?.evaluationAchievementPersonals,
      );
    const pdfService = new Pdf810Service();
    let results = null;
    results = await pdfService.exportEvaluationReportPdf(
      evaluation,
      evaluation?.evaluator,
      orientation,
      size,
      subList,
    );
    return results;
  }

  async exportReportPdfReview810(
    evaluationId: number[],
    userId: number,
    isF5: boolean | undefined,
    isEvaluatorUser: boolean,
    isMultiple: boolean,
    companyGroupCode: string,
    timeZone: string,
  ) {
    // ** get data of the evaluation level from 8 to 10
    // const evaluations = await this.evaluationRepository.getEvaluationByIdList(
    //   evaluationId,
    //   userId,
    //   isEvaluatorUser,
    // );
    const evaluations = await this.evaluationRepository.getDataPDF8_10(
      evaluationId,
      userId,
      isEvaluatorUser,
      companyGroupCode,
    );

    const processDataEvaluations = await this.handleDataEvaluations810Review(
      evaluations.evaluations,
      userId,
      isEvaluatorUser,
      timeZone,
    );

    if (!isMultiple) {
      const result =
        this.pdfReviewService.exportEvaluationDetailForPdfReview810(
          processDataEvaluations[0],
          isF5,
        );
      return result;
    } else {
      const result = this.pdfReviewService.exportListEvaluationPdf810(
        processDataEvaluations,
        isF5,
      );

      return result;
    }
  }

  async exportMultiEvaluation810ReportPdf(
    evaluationIds: number[],
    role: string,
    userId: number,
    orientation: 'l' | 'p' = 'p',
    size: 'a4' | 'a3' = 'a4',
  ) {
    const ids = evaluationIds;
    const evaluations =
      await this.evaluationRepository.getEvaluationUserByListId(ids);
    if (!evaluations || evaluations.length === 0) {
      throw new RuntimeException('Evaluation not found', HttpStatus.NOT_FOUND);
    }
    const tempList = [];

    evaluations.forEach((evaluation: Evaluation) => {
      if (evaluation.evaluationAchievementPersonals) {
        evaluation.evaluationAchievementPersonals.forEach((el) => {
          tempList.push(el);
        });
      }
    });
    const subList =
      await this.evaluationRepository.getSubListByAchievementPersonalId(
        tempList,
      );
    // const vertionSetting8 = await this.evaluationRepo.getversionSettingForPDF();
    const pdfService = new Pdf810Service();
    const results = await pdfService.exportParentReportPdf(
      evaluations,
      role,
      userId,
      orientation,
      size,
      subList,
    );

    return results;
  }

  private getPdfService(level: number) {
    if (level < 8) {
      return new Pdf17Service();
    }
    return new Pdf810Service();
  }

  // ** Export report pdf

  // async exportReportPdf(
  //   evaluationId: number[],
  //   userId: number,
  //   isEvaluatorUser: boolean,
  //   isMultiple: boolean,
  //   orientation: 'l' | 'p' = 'p',
  //   format: 'a4' | 'a3' = 'a4',
  // ) {
  //   // ** get data of the evaluation level from 1 to 7
  //   const evaluations = await this.reportRepo.getEvaluationByIdList(
  //     evaluationId,
  //     userId,
  //     isEvaluatorUser,
  //   );

  //   const processDataEvaluations = await this.handleDataEvaluations(
  //     evaluations.evaluations,
  //     userId,
  //     isEvaluatorUser,
  //   );

  //   if (!isMultiple) {
  //     const result = this.pdfService.exportEvaluationForPdf(
  //       processDataEvaluations[0],
  //       orientation,
  //       format,
  //     );

  //     return result;
  //   } else {
  //     const result = this.pdfService.exportListEvaluationPdf(
  //       processDataEvaluations,
  //       orientation,
  //       format,
  //     );

  //     return result;
  //   }
  // }

  // ** Export report pdf view

  async exportReportPdfReview17(
    evaluationId: number[],
    userId: number,
    isF5: boolean | undefined,
    isEvaluatorUser: boolean,
    isMultiple: boolean,
    companyGroupCode: string,
    timeZone: string,
  ) {
    // ** get data of the evaluation level from 1 to 7
    // const evaluations = await this.reportRepo.getEvaluationByIdList(
    //   evaluationId,
    //   userId,
    //   isEvaluatorUser,
    // );
    const evaluations = await this.reportRepo.getDataPDF1_7(
      evaluationId,
      userId,
      isEvaluatorUser,
      companyGroupCode,
    );

    const processDataEvaluations = await this.handleDataEvaluations17Review(
      evaluations.evaluations,
      userId,
      isEvaluatorUser,
      timeZone,
    );
    if (!isMultiple) {
      const result = this.pdfReviewService.exportEvaluationDetailForPdfReview17(
        processDataEvaluations[0],
        isF5,
      );

      return result;
    } else {
      const result = this.pdfReviewService.exportListEvaluationPdf17(
        processDataEvaluations,
        isF5,
      );

      return result;
    }
  }

  handleSearchFormula(
    settingProFormulas: SettingProFormulaSub[],
    difficulty: number,
    maxLength: number,
  ) {
    return (
      settingProFormulas.find(
        (f) =>
          f.settingProFormula?.point === difficulty && f.totalItem <= maxLength,
      )?.coefficient || 1
    );
  }

  // eslint-disable-next-line complexity
  // async handleDataEvaluations(
  //   evaluations: Evaluation[],
  //   userId: number,
  //   isEvaluatorUser?: boolean,
  // ): Promise<EvaluationDetail17Type[]> {
  //   const results: EvaluationDetail17Type[] = [];

  //   const evaluationLevels = evaluations
  //     .filter((f) => f.status === 1)
  //     .map((v) => v.level);

  //   const basicSkills: any[] = evaluationLevels.length
  //     ? (await this.userRepo.getBasicBehaviorSkillPublic('1', undefined)).map(
  //         (v, i) => ({
  //           ...v,
  //           itemTitle: v.title,
  //           itemNo: i,
  //           type: 1,
  //         }),
  //       )
  //     : [];

  //   const behaviorSkills = evaluationLevels.length
  //     ? (
  //         await this.userRepo.getBasicBehaviorSkillPublic(
  //           ['2', '3'],
  //           evaluationLevels,
  //         )
  //       ).map((v, i) => ({
  //         ...v,
  //         itemTitle: v.title,
  //         itemNo: i,
  //         ...v?.versionBasicBehavior,
  //       }))
  //     : [];

  //   for (let i = 0; i < evaluations.length; i++) {
  //     const comment: {
  //       comment05Public: string;
  //       comment05Private: string;
  //       comment1Public: string;
  //       comment1Private: string;
  //       comment2Public: string;
  //       comment2Private: string;
  //     } = {
  //       comment05Public: '',
  //       comment05Private: '',
  //       comment1Public: '',
  //       comment1Private: '',
  //       comment2Public: '',
  //       comment2Private: '',
  //     };
  //     let evaluatorOrder = 0;
  //     let isEvaluatorException = false;
  //     const evaluatorOrderList = [];
  //     const evaluationDetail = evaluations[i];

  //     if (evaluationDetail) {
  //       const evaluators = [];
  //       const findEvaluator = evaluationDetail.evaluator.find(
  //         (f) => f.evaluatorId === userId,
  //       );
  //       if (!isEvaluatorUser) {
  //         if (!findEvaluator) isEvaluatorException = true;
  //         evaluatorOrder = findEvaluator?.evaluationOrder;
  //       }

  //       if (
  //         evaluationDetail.evaluator &&
  //         evaluationDetail.evaluator.length > 0
  //       ) {
  //         const arrays = evaluationDetail.evaluator.sort(
  //           (a, b) => a.evaluationOrder - b.evaluationOrder,
  //         );
  //         for (const item of arrays) {
  //           if (Number(item.evaluationOrder) === 0.5) {
  //             comment.comment05Public = item.commentPublic;
  //             comment.comment05Private = item.commentPrivate;
  //             evaluators.push(`仮評価: ${item.user.fullName}`);
  //           } else if (Number(item.evaluationOrder) === 1) {
  //             comment.comment1Public = item.commentPublic;
  //             comment.comment1Private = item.commentPrivate;
  //             evaluators.push(`一次評価: ${item.user.fullName}`);
  //           } else if (Number(item.evaluationOrder) === 2) {
  //             comment.comment2Public = item.commentPublic;
  //             comment.comment2Private = item.commentPrivate;
  //             evaluators.push(`二次評価: ${item.user.fullName}`);
  //           }
  //           evaluatorOrderList.push(Number(item.evaluationOrder));
  //         }
  //       }
  //       // ** Check time to evaluation
  //       const isEvaluationDate = compareDatePeriod(
  //         evaluationDetail.evaluationPeriod?.dateEvaluationStart,
  //         evaluationDetail.evaluationPeriod?.dateEvaluationEnd,
  //       );

  //       const isEvaluation: boolean =
  //         [
  //           51, 52, 53, 54, 56, 57, 58, 59, 55, 58, 59, 60, 61, 98, 99, 100,
  //         ].includes(evaluationDetail.status) ||
  //         (evaluationDetail.status > 50 && isEvaluationDate);
  //       // ** End

  //       // ** Pro skill
  //       const userEvaluationToProSkills = {
  //         proSkillList: [],
  //       };
  //       let totalPointProSkillUser = 0;
  //       if (evaluationDetail.evaluationPro) {
  //         evaluationDetail.evaluationPro
  //           .map((data) => data && data.get({ plain: true }))
  //           .map((v) => {
  //             userEvaluationToProSkills.proSkillList.push({
  //               ...v,
  //             });
  //             totalPointProSkillUser =
  //               totalPointProSkillUser + v.pointUser || 0;
  //           });
  //       }
  //       // ** Achievement
  //       const userEvaluationAchievements =
  //         // eslint-disable-next-line no-await-in-loop
  //         await this.reportRepo.getEvaluationAchievement(evaluationDetail.id);

  //       const evaluationBasicSkills = [];
  //       const evaluationBehaviorSkills = [];

  //       // ** Set array object basic/behavior skill
  //       if (evaluationDetail.evaluationBasicBehavior) {
  //         const arrays = evaluationDetail.evaluationBasicBehavior;

  //         const behaviorType = evaluationDetail.flagSkill === 1 ? 2 : 3;

  //         const basics =
  //           evaluationDetail.status === 1
  //             ? basicSkills
  //             : arrays.filter((f) => f.type === 1);

  //         const behaviors =
  //           evaluationDetail.status === 1
  //             ? behaviorSkills.filter(
  //                 (f) =>
  //                   f.type === behaviorType &&
  //                   f.level === evaluationDetail.level,
  //               )
  //             : arrays.filter((f) => f.type === behaviorType);

  //         // ** Get/set array object basic skill
  //         evaluationBasicSkills.push(
  //           ...basics.map((v, i) => {
  //             const pointUser =
  //               Number(v.pointUser || 0) * Number(v.difficulty || 0);
  //             const pointEvaluator05 =
  //               Number(v.pointEvaluator05 || 0) * Number(v.difficulty || 0);
  //             const pointEvaluator1 =
  //               Number(v.pointEvaluator1 || 0) * Number(v.difficulty || 0);
  //             const pointEvaluator2 =
  //               Number(v.pointEvaluator2 || 0) * Number(v.difficulty || 0);

  //             return {
  //               itemNo: v.itemNo,
  //               title: v.itemTitle,
  //               content: v.content,
  //               difficulty: v.difficulty,
  //               key: `basic-1-key-${i}`,
  //               pointUser,
  //               pointEvaluator05,
  //               pointEvaluator1,
  //               pointEvaluator2,
  //             };
  //           }),
  //         );

  //         // ** Get/set array object behavior skill
  //         evaluationBehaviorSkills.push(
  //           ...behaviors.map((v) => {
  //             const pointUser =
  //               Number(v.pointUser || 0) * Number(v.difficulty || 0);
  //             const pointEvaluator05 =
  //               Number(v.pointEvaluator05 || 0) * Number(v.difficulty || 0);
  //             const pointEvaluator1 =
  //               Number(v.pointEvaluator1 || 0) * Number(v.difficulty || 0);
  //             const pointEvaluator2 =
  //               Number(v.pointEvaluator2 || 0) * Number(v.difficulty || 0);
  //             return {
  //               itemNo: v.itemNo,
  //               title: v.itemTitle,
  //               content: v.content,
  //               difficulty: v.difficulty,
  //               pointUser,
  //               pointEvaluator05,
  //               pointEvaluator1,
  //               pointEvaluator2,
  //             };
  //           }),
  //         );
  //       }
  //       // ** Achievement Additional
  //       const achievementAdditionals: AchievementAdditionalType[] = [];
  //       if (evaluationDetail.evaluationAchievementAdditional.length > 0) {
  //         achievementAdditionals.push(
  //           ...evaluationDetail.evaluationAchievementAdditional.map((v, i) => ({
  //             key: `achievement-additional-key-${i}`,
  //             itemNo: v.itemNo,
  //             titleAdditional: v.titleAdditional,
  //             achievementStatus: v.achievementStatus,
  //             reasonComment: v.reasonComment,
  //             pointUser: v.pointUser,
  //             pointEvaluator05: v.pointEvaluator05,
  //             pointEvaluator1: v.pointEvaluator1,
  //             pointEvaluator2: v.pointEvaluator2,
  //           })),
  //         );
  //       }

  //       // ** Period time to evaluation
  //       if (isEvaluation && evaluatorOrderList.includes(2)) {
  //         // ** Add last row total Pro skill
  //         userEvaluationToProSkills.proSkillList.push({
  //           itemId: null,
  //           itemTitle: '小計',
  //           itemNo: null,
  //           content: null,
  //           difficulty: null,
  //           totalPointUser: evaluationDetail.proTotalPointUser,
  //           totalPointEvaluator05: evaluationDetail.proTotalPointEvaluator05,
  //           totalPointEvaluator: evaluationDetail.proTotalPointEvaluator1,
  //           totalPointEvaluator2: evaluationDetail.proTotalPointEvaluator2,
  //           key: `evaluation-pro-skill-totalPointProSkillUser`,
  //         });

  //         // ** Add last row total Basic skill
  //         evaluationBasicSkills.push({
  //           pointUser: evaluationDetail.basicTotalPointUser,
  //           pointEvaluator05: evaluationDetail.basicTotalPointEvaluator05,
  //           pointEvaluator1: evaluationDetail.basicTotalPointEvaluator1,
  //           pointEvaluator2: evaluationDetail.basicTotalPointEvaluator2,
  //           title: '小計',
  //           content: null,
  //           difficulty: null,
  //           key: `basic-1-key-pointUserBasicSkill`,
  //         });

  //         achievementAdditionals.push({
  //           key: `achievement-additional-key-total`,
  //           itemNo: null,
  //           titleAdditional: '小計',
  //           achievementStatus: null,
  //           reasonComment: null,
  //           pointUser: Math.floor(
  //             evaluationDetail.achievementAdditionalTotalPointUser || 0,
  //           ),
  //           pointEvaluator05: Math.floor(
  //             evaluationDetail.achievementAdditionalTotalPointEvaluator05 || 0,
  //           ),
  //           pointEvaluator1: Math.floor(
  //             evaluationDetail.achievementAdditionalTotalPointEvaluator1 || 0,
  //           ),
  //           pointEvaluator2: Math.floor(
  //             evaluationDetail.achievementAdditionalTotalPointEvaluator2 || 0,
  //           ),
  //         });

  //         // ** Add last row total Behavior skill
  //         evaluationBehaviorSkills.push({
  //           title: '小計',
  //           content: null,
  //           difficulty: null,
  //           pointUser: evaluationDetail.behaviorTotalPointUser,
  //           pointEvaluator05: evaluationDetail.behaviorTotalPointEvaluator05,
  //           pointEvaluator1: evaluationDetail.behaviorTotalPointEvaluator1,
  //           pointEvaluator2: evaluationDetail.behaviorTotalPointEvaluator2,
  //         });

  //         // ** Add last row achievement
  //         userEvaluationAchievements.push({
  //           key: 0,
  //           itemNo: null,
  //           title: null,
  //           achievementValue: null,
  //           method: null,
  //           weight: null,
  //           difficultyUser: null,
  //           difficultyEvaluator05: null,
  //           difficultyEvaluator1: null,
  //           difficultyEvaluator2: null,
  //           achievementStatus: '小計',
  //           reasonComment: null,
  //           actionPlan: null,
  //           coefficientUser: null,
  //           coefficientEvaluator05: null,
  //           coefficientEvaluator1: null,
  //           coefficientEvaluator2: null,

  //           pointUser: Math.round(
  //             evaluationDetail.achievementPersonalTotalPointUser || 0,
  //           ),
  //           pointEvaluator05: Math.round(
  //             evaluationDetail.achievementPersonalTotalPointEvaluator05 || 0,
  //           ),
  //           pointEvaluator1: Math.round(
  //             evaluationDetail.achievementPersonalTotalPointEvaluator1 || 0,
  //           ),
  //           pointEvaluator2: Math.round(
  //             evaluationDetail.achievementPersonalTotalPointEvaluator2 || 0,
  //           ),
  //           childrens: [],
  //         });
  //       }

  //       // **Total point
  //       // const totalPoints = [];

  //       const data: EvaluationDetail17Type = {
  //         id: evaluationDetail.id,
  //         fiscalYear: evaluationDetail.title,
  //         periodStart: evaluationDetail.periodStart,
  //         periodEnd: evaluationDetail.periodEnd,
  //         level: evaluationDetail.level,
  //         evaluators,
  //         statusName: `statusEvaluation[evaluationDetail.status]`,
  //         status: evaluationDetail.status,
  //         department:
  //           evaluationDetail.status < 50
  //             ? `${evaluationDetail.user.department.name}`
  //             : evaluationDetail.departmentName,
  //         companyName: evaluationDetail.companyName,
  //         employeeNumber: evaluationDetail.user.employeeNumber,
  //         fullName: evaluationDetail.user.fullName,
  //         guideVersionId: evaluationDetail.guideVersionId,
  //         percentPoint: evaluationDetail.percentPoint,

  //         // ** Order
  //         evaluatorOrder,
  //         evaluatorOrderList,

  //         // ** Comment
  //         commentUser: evaluationDetail.commentUser,

  //         // ** Total - user
  //         basicTotalPointUser: evaluationDetail.basicTotalPointUser,
  //         proTotalPointUser: evaluationDetail.proTotalPointUser,
  //         behaviorTotalPointUser: evaluationDetail.behaviorTotalPointUser,
  //         achievementPersonalTotalPointUser:
  //           evaluationDetail.achievementPersonalTotalPointUser,
  //         achievementAdditionalTotalPointUser:
  //           evaluationDetail.achievementAdditionalTotalPointUser,

  //         // ** Total - evaluator 0.5
  //         basicTotalPointEvaluator05:
  //           evaluationDetail.basicTotalPointEvaluator05,
  //         proTotalPointEvaluator05: evaluationDetail.proTotalPointEvaluator05,
  //         behaviorTotalPointEvaluator05:
  //           evaluationDetail.behaviorTotalPointEvaluator05,
  //         achievementAdditionalTotalPointEvaluator05:
  //           evaluationDetail.achievementAdditionalTotalPointEvaluator05,
  //         achievementPersonalTotalPointEvaluator05:
  //           evaluationDetail.achievementPersonalTotalPointEvaluator05,

  //         // ** Total - evaluator 1.0
  //         basicTotalPointEvaluator1: evaluationDetail.basicTotalPointEvaluator1,
  //         proTotalPointEvaluator1: evaluationDetail.proTotalPointEvaluator1,
  //         behaviorTotalPointEvaluator1:
  //           evaluationDetail.behaviorTotalPointEvaluator1,
  //         achievementAdditionalTotalPointEvaluator1:
  //           evaluationDetail.achievementAdditionalTotalPointEvaluator1,
  //         achievementPersonalTotalPointEvaluator1:
  //           evaluationDetail.achievementPersonalTotalPointEvaluator1,

  //         // ** Total - evaluator 2.0
  //         basicTotalPointEvaluator2: evaluationDetail.basicTotalPointEvaluator2,
  //         proTotalPointEvaluator2: evaluationDetail.proTotalPointEvaluator2,
  //         behaviorTotalPointEvaluator2:
  //           evaluationDetail.behaviorTotalPointEvaluator2,
  //         achievementAdditionalTotalPointEvaluator2:
  //           evaluationDetail.achievementAdditionalTotalPointEvaluator2,
  //         achievementPersonalTotalPointEvaluator2:
  //           evaluationDetail.achievementPersonalTotalPointEvaluator2,

  //         // ** point && setting table level
  //         pointSettingLevel: {
  //           key: 'point-setting-level-key-1',
  //           skillPercent: evaluationDetail.skillPercent,
  //           behaviorPercent: evaluationDetail.behaviorPercent,
  //           achievementPercent: evaluationDetail.achievementPercent,
  //           percentPoint: evaluationDetail.percentPoint,
  //         },

  //         // ** Evaluation ProSkill
  //         ...userEvaluationToProSkills,

  //         // ** Evaluation Achievements
  //         userEvaluationAchievements,

  //         // ** Evaluation Period
  //         dateCreationGoalStart: evaluationDetail.dateCreationGoalStart,
  //         dateCreationGoalEnd: evaluationDetail.dateCreationGoalEnd,
  //         evaluationPeriod: evaluationDetail.evaluationPeriod,

  //         // ** Evaluation Basic Skill
  //         evaluationBasicSkills,

  //         // ** Evaluation Behavior Skill
  //         evaluationBehaviorSkills,

  //         // ** Evaluation Achievement Additional
  //         achievementAdditionals,

  //         // ** Setting Pro Formula
  //         settingProFormulas: [],

  //         // ** Comment Public/Private
  //         comment,

  //         // ** Evaluator exception
  //         isEvaluatorException,

  //         // ** Update Time
  //         updateTime: evaluationDetail.updatedTime.toISOString(),

  //         // ** isEvaluationDate
  //         isEvaluationDate: isEvaluationDate,

  //         isEvaluatorUser,
  //         basicProTotalPointUser: evaluationDetail.basicProTotalPointUser,
  //         basicProTotalPointEvaluator05:
  //           evaluationDetail.basicProTotalPointEvaluator05,
  //         basicProTotalPointEvaluator1:
  //           evaluationDetail.basicProTotalPointEvaluator1,
  //         basicProTotalPointEvaluator2:
  //           evaluationDetail.basicProTotalPointEvaluator2,
  //         summaryPointUser: evaluationDetail.summaryPointUser,
  //         summaryPointEvaluator05: evaluationDetail.summaryPointEvaluator05,
  //         summaryPointEvaluator1: evaluationDetail.summaryPointEvaluator1,
  //         summaryPointEvaluator2: evaluationDetail.summaryPointEvaluator2,
  //         flagSkill: evaluationDetail.flagSkill,
  //       };

  //       if (!evaluatorOrderList.includes(2)) {
  //         data.isNotEvaluator2 = true;
  //       }
  //       results.push(data);
  //     }
  //   }

  //   return results;
  // }

  // eslint-disable-next-line complexity
  async handleDataEvaluations17Review(
    evaluations: any[],
    userId: number,
    isEvaluatorUser: boolean,
    timeZone: string,
  ): Promise<EvaluationDetail17Type[]> {
    const results: EvaluationDetail17Type[] = [];

    for (let i = 0; i < evaluations.length; i++) {
      const comment: {
        commentUser: string;
        comment05Public: string;
        comment05Private: string;
        comment1Public: string;
        comment1Private: string;
        comment2Public: string;
        comment2Private: string;
      } = {
        commentUser: '',
        comment05Public: '',
        comment05Private: '',
        comment1Public: '',
        comment1Private: '',
        comment2Public: '',
        comment2Private: '',
      };
      let evaluatorOrder = 0;
      let isEvaluatorException = false;
      const evaluatorOrderList = [];
      const evaluationDetail = evaluations[i];

      if (evaluationDetail) {
        const evaluators = [];
        const findEvaluator = evaluationDetail.evaluator?.find(
          (f) => f.evaluatorId === userId,
        );
        if (!isEvaluatorUser) {
          if (!findEvaluator) isEvaluatorException = true;
          evaluatorOrder = findEvaluator?.evaluationOrder;
        }

        if (
          evaluationDetail.evaluator &&
          evaluationDetail.evaluator.length > 0
        ) {
          const arrays = evaluationDetail.evaluator.sort(
            (a, b) => a.evaluationOrder - b.evaluationOrder,
          );
          for (const item of arrays) {
            comment.commentUser = evaluationDetail.commentUser;
            if (Number(item.evaluationOrder) === 0.5) {
              comment.comment05Public = item.commentPublic;
              comment.comment05Private = item.commentPrivate;
              evaluators.push(`仮評価: ${item.user.fullName}`);
            } else if (Number(item.evaluationOrder) === 1) {
              comment.comment1Public = item.commentPublic;
              comment.comment1Private = item.commentPrivate;
              evaluators.push(`一次評価: ${item.user.fullName}`);
            } else if (Number(item.evaluationOrder) === 2) {
              comment.comment2Public = item.commentPublic;
              comment.comment2Private = item.commentPrivate;
              evaluators.push(`二次評価: ${item.user.fullName}`);
            }
            evaluatorOrderList.push(Number(item.evaluationOrder));
          }
        }
        // ** Check time to evaluation
        const isEvaluationDate = compareDatePeriod(
          evaluationDetail.evaluationPeriod?.dateEvaluationStart,
          evaluationDetail.evaluationPeriod?.dateEvaluationEnd,
          timeZone,
        );

        const isEvaluation: boolean =
          [
            51, 52, 53, 54, 56, 57, 58, 59, 55, 58, 59, 60, 61, 98, 99, 100,
          ].includes(evaluationDetail.status) ||
          (evaluationDetail.status > 50 && isEvaluationDate);
        // ** End

        // ** Pro skill
        const userEvaluationToProSkills = {
          proSkillList: [],
        };
        let totalPointProSkillUser = 0;
        if (evaluationDetail.evaluationPro) {
          evaluationDetail.evaluationPro
            // .map((data) => data && data.get({ plain: true }))
            .map((v) => {
              userEvaluationToProSkills.proSkillList.push({
                ...v,
              });
              totalPointProSkillUser =
                totalPointProSkillUser + v.pointUser || 0;
            });
        }

        userEvaluationToProSkills.proSkillList.forEach((item: any) => {
          item.totalPointUser =
            item.totalPointUser !== null
              ? item.pointUser !== null
                ? item.pointUser + `${' (' + item.totalPointUser + ')'}`
                : ''
              : '';

          item.totalPointEvaluator05 =
            item.totalPointEvaluator05 !== null
              ? item.pointEvaluator05 !== null
                ? item.pointEvaluator05 +
                  `${' (' + item.totalPointEvaluator05 + ')'}`
                : ''
              : '';

          item.totalPointEvaluator1 =
            item.totalPointEvaluator1 !== null
              ? item.pointEvaluator1 !== null
                ? item.pointEvaluator1 +
                  `${' (' + item.totalPointEvaluator1 + ')'}`
                : ''
              : '';

          item.totalPointEvaluator2 =
            item.totalPointEvaluator2 !== null
              ? item.pointEvaluator2 !== null
                ? item.pointEvaluator2 +
                  `${' (' + item.totalPointEvaluator2 + ')'}`
                : ''
              : '';
        });

        // ** Achievement personal
        const userEvaluationAchievements =
          evaluationDetail.evaluationAchievementPersonals?.filter(
            (f) => f?.type === 1,
          );

        const evaluationBasicSkills = [];
        const evaluationBehaviorSkills = [];

        // ** Set array object basic/behavior skill
        if (
          evaluationDetail.evaluationBasicBehavior ||
          evaluationDetail.listBasicPublic ||
          evaluationDetail.listBehaviorPublic
        ) {
          const arrays = evaluationDetail.evaluationBasicBehavior;

          const behaviorType = evaluationDetail.flagSkill === 1 ? 2 : 3;

          const basics =
            evaluationDetail.status === 1
              ? evaluationDetail.listBasicPublic?.map((v, i) => ({
                  ...v,
                  itemTitle: v?.title,
                  itemNo: i,
                }))
              : arrays?.filter((f) => f?.type === 1);

          const behaviors =
            evaluationDetail.status === 1
              ? evaluationDetail.listBehaviorPublic
                  ?.map((v, i) => ({
                    ...v,
                    itemTitle: v?.title,
                    itemNo: i,
                  }))
                  ?.filter(
                    (f) =>
                      f?.type === behaviorType &&
                      f?.level === evaluationDetail.level,
                  )
              : arrays?.filter((f) => f?.type === behaviorType);

          // ** Get/set array object basic skill
          if (basics) {
            evaluationBasicSkills.push(
              ...basics?.map((v, i) => {
                const pointUser =
                  v.pointUser !== null
                    ? v.pointUser +
                      `${
                        ' (' +
                        Number(v.pointUser || 0) * Number(v.difficulty || 0) +
                        ')'
                      }`
                    : '';
                const pointEvaluator05 =
                  v.pointEvaluator05 !== null
                    ? v.pointEvaluator05 +
                      `${
                        ' (' +
                        Number(v.pointEvaluator05 || 0) *
                          Number(v.difficulty || 0) +
                        ')'
                      }`
                    : '';
                const pointEvaluator1 =
                  v.pointEvaluator1 !== null
                    ? v.pointEvaluator1 +
                      `${
                        ' (' +
                        Number(v.pointEvaluator1 || 0) *
                          Number(v.difficulty || 0) +
                        ')'
                      }`
                    : '';
                const pointEvaluator2 =
                  v.pointEvaluator2 !== null
                    ? v.pointEvaluator2 +
                      `${
                        ' (' +
                        Number(v.pointEvaluator2 || 0) *
                          Number(v.difficulty || 0) +
                        ')'
                      }`
                    : '';

                return {
                  itemNo: v.itemNo,
                  title: v.itemTitle,
                  content: v.content,
                  difficulty: v.difficulty,
                  key: `basic-1-key-${i}`,
                  pointUser,
                  pointEvaluator05,
                  pointEvaluator1,
                  pointEvaluator2,
                };
              }),
            );
          }

          // ** Get/set array object behavior skill
          if (behaviors) {
            evaluationBehaviorSkills.push(
              ...behaviors.map((v) => {
                const pointUser =
                  v.pointUser !== null
                    ? v.pointUser +
                      `${
                        ' (' +
                        Number(v.pointUser || 0) * Number(v.difficulty || 0) +
                        ')'
                      }`
                    : '';
                const pointEvaluator05 =
                  v.pointEvaluator05 !== null
                    ? v.pointEvaluator05 +
                      `${
                        ' (' +
                        Number(v.pointEvaluator05 || 0) *
                          Number(v.difficulty || 0) +
                        ')'
                      }`
                    : '';
                const pointEvaluator1 =
                  v.pointEvaluator1 !== null
                    ? v.pointEvaluator1 +
                      `${
                        ' (' +
                        Number(v.pointEvaluator1 || 0) *
                          Number(v.difficulty || 0) +
                        ')'
                      }`
                    : '';
                const pointEvaluator2 =
                  v.pointEvaluator2 !== null
                    ? v.pointEvaluator2 +
                      `${
                        ' (' +
                        Number(v.pointEvaluator2 || 0) *
                          Number(v.difficulty || 0) +
                        ')'
                      }`
                    : '';
                return {
                  itemNo: v.itemNo,
                  title: v.itemTitle,
                  content: v.content,
                  difficulty: v.difficulty,
                  pointUser,
                  pointEvaluator05,
                  pointEvaluator1,
                  pointEvaluator2,
                };
              }),
            );
          }
        }
        // ** Achievement Additional
        const achievementAdditionals: AchievementAdditionalType[] = [];
        if (evaluationDetail.evaluationAchievementAdditional) {
          const tempAchievementAdditionals =
            evaluationDetail.evaluationAchievementAdditional.filter(
              (item) => item.type == 1,
            );
          if (tempAchievementAdditionals.length > 0) {
            achievementAdditionals.push(
              ...tempAchievementAdditionals.map((v, i) => ({
                key: `achievement-additional-key-${i}`,
                itemNo: v.itemNo,
                titleAdditional: v.titleAdditional,
                achievementStatus: v.achievementStatus,
                reasonComment: v.reasonComment,
                pointUser: v.pointUser,
                pointEvaluator05: v.pointEvaluator05,
                pointEvaluator1: v.pointEvaluator1,
                pointEvaluator2: v.pointEvaluator2,
              })),
            );
          }
        }

        // ** Period time to evaluation
        if (isEvaluation && evaluatorOrderList.includes(2)) {
          // ** Add last row total Pro skill
          userEvaluationToProSkills.proSkillList.push({
            itemId: null,
            itemTitle: null,
            itemNo: null,
            content: '小計',
            difficulty: null,
            totalPointUser:
              evaluationDetail.proTotalPointUser !== null
                ? evaluationDetail.proTotalPointUser
                : '',
            totalPointEvaluator05:
              evaluationDetail.proTotalPointEvaluator05 !== null
                ? evaluationDetail.proTotalPointEvaluator05
                : '',
            totalPointEvaluator1:
              evaluationDetail.proTotalPointEvaluator1 !== null
                ? evaluationDetail.proTotalPointEvaluator1
                : '',
            totalPointEvaluator2:
              evaluationDetail.proTotalPointEvaluator2 !== null
                ? evaluationDetail.proTotalPointEvaluator2
                : '',
            key: `evaluation-pro-skill-totalPointProSkillUser`,
          });

          // ** Add last row total Basic skill
          evaluationBasicSkills.push({
            pointUser:
              evaluationDetail.basicTotalPointUser !== null
                ? evaluationDetail.basicTotalPointUser
                : '',
            pointEvaluator05:
              evaluationDetail.basicTotalPointEvaluator05 !== null
                ? evaluationDetail.basicTotalPointEvaluator05
                : '',
            pointEvaluator1:
              evaluationDetail.basicTotalPointEvaluator1 !== null
                ? evaluationDetail.basicTotalPointEvaluator1
                : '',
            pointEvaluator2:
              evaluationDetail.basicTotalPointEvaluator2 !== null
                ? evaluationDetail.basicTotalPointEvaluator2
                : '',
            title: null,
            content: '小計',
            difficulty: null,
            key: `basic-1-key-pointUserBasicSkill`,
          });

          // ** Add last row total achievement Additionals
          achievementAdditionals.push({
            key: `achievement-additional-key-total`,
            itemNo: null,
            titleAdditional: null,
            achievementStatus: null,
            reasonComment: '小計',
            pointUser:
              evaluationDetail.achievementAdditionalTotalPointUser !== null
                ? Math.floor(
                    evaluationDetail.achievementAdditionalTotalPointUser,
                  )
                : '',
            pointEvaluator05:
              evaluationDetail.achievementAdditionalTotalPointEvaluator05 !==
              null
                ? Math.floor(
                    evaluationDetail.achievementAdditionalTotalPointEvaluator05,
                  )
                : '',
            pointEvaluator1:
              evaluationDetail.achievementAdditionalTotalPointEvaluator1 !==
              null
                ? Math.floor(
                    evaluationDetail.achievementAdditionalTotalPointEvaluator1,
                  )
                : '',
            pointEvaluator2:
              evaluationDetail.achievementAdditionalTotalPointEvaluator2 !==
              null
                ? Math.floor(
                    evaluationDetail.achievementAdditionalTotalPointEvaluator2,
                  )
                : '',
          });

          // ** Add last row total Behavior skill
          evaluationBehaviorSkills.push({
            title: null,
            content: '小計',
            difficulty: null,
            pointUser: evaluationDetail.behaviorTotalPointUser,
            pointEvaluator05: evaluationDetail.behaviorTotalPointEvaluator05,
            pointEvaluator1: evaluationDetail.behaviorTotalPointEvaluator1,
            pointEvaluator2: evaluationDetail.behaviorTotalPointEvaluator2,
          });

          // ** Add last row achievement
          userEvaluationAchievements?.push({
            key: 0,
            itemNo: null,
            title: null,
            achievementValue: null,
            method: null,
            weight: null,
            difficultyUser: null,
            difficultyEvaluator05: null,
            difficultyEvaluator1: null,
            difficultyEvaluator2: null,
            achievementStatus: null,
            reasonComment: null,
            actionPlan: '小計',
            coefficientUser: null,
            coefficientEvaluator05: null,
            coefficientEvaluator1: null,
            coefficientEvaluator2: null,

            pointUser: (evaluationDetail.achievementPersonalTotalPointUser !==
            null
              ? Math.round(evaluationDetail.achievementPersonalTotalPointUser)
              : '') as any,
            pointEvaluator05:
              (evaluationDetail.achievementPersonalTotalPointEvaluator05 !==
              null
                ? Math.round(
                    evaluationDetail.achievementPersonalTotalPointEvaluator05,
                  )
                : '') as any,
            pointEvaluator1:
              (evaluationDetail.achievementPersonalTotalPointEvaluator1 !== null
                ? Math.round(
                    evaluationDetail.achievementPersonalTotalPointEvaluator1,
                  )
                : '') as any,
            pointEvaluator2:
              (evaluationDetail.achievementPersonalTotalPointEvaluator2 !== null
                ? Math.round(
                    evaluationDetail.achievementPersonalTotalPointEvaluator2,
                  )
                : '') as any,
            childrens: [],
          });
        }

        // **Total point
        // const totalPoints = [];

        const data: EvaluationDetail17Type = {
          id: evaluationDetail.id,
          fiscalYear: evaluationDetail.title,
          periodStart: evaluationDetail.periodStart,
          periodEnd: evaluationDetail.periodEnd,
          level: evaluationDetail.level,
          evaluators,
          statusName: `statusEvaluation[evaluationDetail.status]`,
          status: evaluationDetail.status,
          department:
            // evaluationDetail.status < 50
            //   ? `${evaluationDetail.user.department?.name}`
            //   :
            evaluationDetail.departmentName,
          companyName: evaluationDetail.companyName,
          employeeNumber: evaluationDetail.user?.employeeNumber,
          fullName: evaluationDetail.user?.fullName,
          guideVersionId: evaluationDetail.guideVersionId,
          percentPoint: evaluationDetail.percentPoint,

          // ** Order
          evaluatorOrder,
          evaluatorOrderList,

          // ** Comment
          commentUser: evaluationDetail.commentUser,

          // ** Total - user
          basicTotalPointUser: evaluationDetail.basicTotalPointUser,
          proTotalPointUser: evaluationDetail.proTotalPointUser,
          behaviorTotalPointUser: evaluationDetail.behaviorTotalPointUser,
          achievementPersonalTotalPointUser:
            evaluationDetail.achievementPersonalTotalPointUser,
          achievementAdditionalTotalPointUser:
            evaluationDetail.achievementAdditionalTotalPointUser,

          // ** Total - evaluator 0.5
          basicTotalPointEvaluator05:
            evaluationDetail.basicTotalPointEvaluator05,
          proTotalPointEvaluator05: evaluationDetail.proTotalPointEvaluator05,
          behaviorTotalPointEvaluator05:
            evaluationDetail.behaviorTotalPointEvaluator05,
          achievementAdditionalTotalPointEvaluator05:
            evaluationDetail.achievementAdditionalTotalPointEvaluator05,
          achievementPersonalTotalPointEvaluator05:
            evaluationDetail.achievementPersonalTotalPointEvaluator05,

          // ** Total - evaluator 1.0
          basicTotalPointEvaluator1: evaluationDetail.basicTotalPointEvaluator1,
          proTotalPointEvaluator1: evaluationDetail.proTotalPointEvaluator1,
          behaviorTotalPointEvaluator1:
            evaluationDetail.behaviorTotalPointEvaluator1,
          achievementAdditionalTotalPointEvaluator1:
            evaluationDetail.achievementAdditionalTotalPointEvaluator1,
          achievementPersonalTotalPointEvaluator1:
            evaluationDetail.achievementPersonalTotalPointEvaluator1,

          // ** Total - evaluator 2.0
          basicTotalPointEvaluator2: evaluationDetail.basicTotalPointEvaluator2,
          proTotalPointEvaluator2: evaluationDetail.proTotalPointEvaluator2,
          behaviorTotalPointEvaluator2:
            evaluationDetail.behaviorTotalPointEvaluator2,
          achievementAdditionalTotalPointEvaluator2:
            evaluationDetail.achievementAdditionalTotalPointEvaluator2,
          achievementPersonalTotalPointEvaluator2:
            evaluationDetail.achievementPersonalTotalPointEvaluator2,

          // ** point && setting table level
          pointSettingLevel: {
            key: 'point-setting-level-key-1',
            skillPercent: evaluationDetail.skillPercent,
            behaviorPercent: evaluationDetail.behaviorPercent,
            achievementPercent: evaluationDetail.achievementPercent,
            percentPoint: evaluationDetail.percentPoint,
          },

          // ** Evaluation ProSkill
          ...userEvaluationToProSkills,

          // ** Evaluation Achievements
          userEvaluationAchievements,

          // ** Evaluation Period
          dateCreationGoalStart: evaluationDetail.dateCreationGoalStart,
          dateCreationGoalEnd: evaluationDetail.dateCreationGoalEnd,
          evaluationPeriod: evaluationDetail.evaluationPeriod,

          // ** Evaluation Basic Skill
          evaluationBasicSkills,

          // ** Evaluation Behavior Skill
          evaluationBehaviorSkills,

          // ** Evaluation Achievement Additional
          achievementAdditionals,

          // ** Setting Pro Formula
          settingProFormulas: [],

          // ** Comment Public/Private
          comment,

          // ** Evaluator exception
          isEvaluatorException,

          // ** Update Time
          updateTime: evaluationDetail.updatedTime.toISOString(),

          // ** isEvaluationDate
          isEvaluationDate: isEvaluationDate,

          isEvaluatorUser,
          basicProTotalPointUser: evaluationDetail.basicProTotalPointUser,
          basicProTotalPointEvaluator05:
            evaluationDetail.basicProTotalPointEvaluator05,
          basicProTotalPointEvaluator1:
            evaluationDetail.basicProTotalPointEvaluator1,
          basicProTotalPointEvaluator2:
            evaluationDetail.basicProTotalPointEvaluator2,
          summaryPointUser: evaluationDetail.summaryPointUser,
          summaryPointEvaluator05: evaluationDetail.summaryPointEvaluator05,
          summaryPointEvaluator1: evaluationDetail.summaryPointEvaluator1,
          summaryPointEvaluator2: evaluationDetail.summaryPointEvaluator2,
          flagSkill: evaluationDetail.flagSkill,
        };

        if (!evaluatorOrderList.includes(2)) {
          data.isNotEvaluator2 = true;
        }
        results.push(data);
      }
    }

    return results;
  }

  async handleDataEvaluations810Review(
    evaluations: any[],
    userId: number,
    isEvaluatorUser: boolean,
    timeZone: string,
  ): Promise<any[]> {
    const results = [];

    for (let i = 0; i < evaluations.length; i++) {
      const comment: {
        commentUser: string;
        comment05Public: string;
        comment05Private: string;
        comment1Public: string;
        comment1Private: string;
        comment2Public: string;
        comment2Private: string;
      } = {
        commentUser: '',
        comment05Public: '',
        comment05Private: '',
        comment1Public: '',
        comment1Private: '',
        comment2Public: '',
        comment2Private: '',
      };
      let evaluatorOrder = 0;
      let isEvaluatorException = false;
      const evaluatorOrderList = [];
      const evaluationDetail = evaluations[i];

      if (evaluationDetail) {
        const evaluators = [];
        const findEvaluator = evaluationDetail.evaluator?.find(
          (f) => f.evaluatorId === userId,
        );
        if (!isEvaluatorUser) {
          if (!findEvaluator) isEvaluatorException = true;
          evaluatorOrder = findEvaluator?.evaluationOrder;
        }

        if (
          evaluationDetail.evaluator &&
          evaluationDetail.evaluator.length > 0
        ) {
          const arrays = evaluationDetail.evaluator.sort(
            (a, b) => a.evaluationOrder - b.evaluationOrder,
          );
          for (const item of arrays) {
            comment.commentUser = evaluationDetail.commentUser;
            if (Number(item.evaluationOrder) === 0.5) {
              comment.comment05Public = item.commentPublic;
              comment.comment05Private = item.commentPrivate;
              evaluators.push(`仮評価: ${item.user.fullName}`);
            } else if (Number(item.evaluationOrder) === 1) {
              comment.comment1Public = item.commentPublic;
              comment.comment1Private = item.commentPrivate;
              evaluators.push(`一次評価: ${item.user.fullName}`);
            } else if (Number(item.evaluationOrder) === 2) {
              comment.comment2Public = item.commentPublic;
              comment.comment2Private = item.commentPrivate;
              evaluators.push(`二次評価: ${item.user.fullName}`);
            }
            evaluatorOrderList.push(Number(item.evaluationOrder));
          }
        }
        // ** Check time to evaluation
        const isEvaluationDate = compareDatePeriod(
          evaluationDetail.evaluationPeriod?.dateEvaluationDepartmentStart,
          evaluationDetail.evaluationPeriod?.dateEvaluationDepartmentEnd,
          timeZone,
        );

        const isEvaluation: boolean =
          [
            51, 52, 53, 54, 56, 57, 58, 59, 55, 58, 59, 60, 61, 98, 99, 100,
          ].includes(evaluationDetail.status) ||
          (evaluationDetail.status > 50 && isEvaluationDate);
        // ** End

        // ** Pro skill
        const userEvaluationToProSkills = {
          proSkillList: [],
        };
        let totalPointProSkillUser = 0;
        if (evaluationDetail.evaluationPro) {
          evaluationDetail.evaluationPro
            // .map((data) => data && data.get({ plain: true }))
            .map((v) => {
              userEvaluationToProSkills.proSkillList.push({
                ...v,
              });
              totalPointProSkillUser =
                totalPointProSkillUser + v.pointUser || 0;
            });
        }

        userEvaluationToProSkills.proSkillList.forEach((item: any) => {
          item.totalPointUser =
            item.totalPointUser !== null
              ? item.pointUser !== null
                ? item.pointUser + `${' (' + item.totalPointUser + ')'}`
                : ''
              : '';

          item.totalPointEvaluator05 =
            item.totalPointEvaluator05 !== null
              ? item.pointEvaluator05 !== null
                ? item.pointEvaluator05 +
                  `${' (' + item.totalPointEvaluator05 + ')'}`
                : ''
              : '';

          item.totalPointEvaluator1 =
            item.totalPointEvaluator1 !== null
              ? item.pointEvaluator1 !== null
                ? item.pointEvaluator1 +
                  `${' (' + item.totalPointEvaluator1 + ')'}`
                : ''
              : '';

          item.totalPointEvaluator2 =
            item.totalPointEvaluator2 !== null
              ? item.pointEvaluator2 !== null
                ? item.pointEvaluator2 +
                  `${' (' + item.totalPointEvaluator2 + ')'}`
                : ''
              : '';
        });

        // ** Achievement (mục tiêu bộ phận)
        const userEvaluationAchievementsDepartment =
          evaluationDetail.evaluationAchievementPersonals?.filter(
            (f) => f?.type === 3,
          );

        userEvaluationAchievementsDepartment?.forEach((item: any) => {
          item.coefficientUser = item.coefficientUser
            ? Number(item.coefficientUser).toFixed(1)
            : '';
          item.coefficientEvaluator05 = item.coefficientEvaluator05
            ? Number(item.coefficientEvaluator05).toFixed(1)
            : '';
          item.coefficientEvaluator1 = item.coefficientEvaluator1
            ? Number(item.coefficientEvaluator1).toFixed(1)
            : '';
          item.coefficientEvaluator2 = item.coefficientEvaluator2
            ? Number(item.coefficientEvaluator2).toFixed(1)
            : '';
        });

        // ** Achievement (mục tiêu cá nhân)
        const userEvaluationAchievementsPersonal =
          evaluationDetail.evaluationAchievementPersonals?.filter(
            (f) => f?.type === 2,
          );

        const evaluationBasicSkills = [];
        const evaluationBehaviorSkills = [];

        // ** Set array object basic/behavior skill
        if (
          evaluationDetail.evaluationBasicBehavior ||
          evaluationDetail.listBasicPublic ||
          evaluationDetail.listBehaviorPublic
        ) {
          const arrays = evaluationDetail.evaluationBasicBehavior;

          const behaviorType = evaluationDetail.flagSkill === 1 ? 5 : 6;

          const basics =
            evaluationDetail.status === 1
              ? evaluationDetail.listBasicPublic?.map((v, i) => ({
                  ...v,
                  itemTitle: v?.title,
                  itemNo: i,
                }))
              : arrays?.filter((f) => f?.type === 4);

          const behaviors =
            evaluationDetail.status === 1
              ? evaluationDetail.listBehaviorPublic
                  ?.map((v, i) => ({
                    ...v,
                    itemTitle: v?.title,
                    itemNo: i,
                  }))
                  ?.filter(
                    (f) =>
                      f?.type === behaviorType &&
                      f?.level === evaluationDetail.level,
                  )
              : arrays?.filter((f) => f?.type === behaviorType);

          // ** Get/set array object basic skill
          if (basics) {
            evaluationBasicSkills.push(
              ...basics.map((v, i) => {
                const pointUser =
                  v.pointUser !== null
                    ? v.pointUser +
                      `${
                        ' (' +
                        Number(v.pointUser || 0) * Number(v.difficulty || 0) +
                        ')'
                      }`
                    : '';
                const pointEvaluator05 =
                  v.pointEvaluator05 !== null
                    ? v.pointEvaluator05 +
                      `${
                        ' (' +
                        Number(v.pointEvaluator05 || 0) *
                          Number(v.difficulty || 0) +
                        ')'
                      }`
                    : '';
                const pointEvaluator1 =
                  v.pointEvaluator1 !== null
                    ? v.pointEvaluator1 +
                      `${
                        ' (' +
                        Number(v.pointEvaluator1 || 0) *
                          Number(v.difficulty || 0) +
                        ')'
                      }`
                    : '';
                const pointEvaluator2 =
                  v.pointEvaluator2 !== null
                    ? v.pointEvaluator2 +
                      `${
                        ' (' +
                        Number(v.pointEvaluator2 || 0) *
                          Number(v.difficulty || 0) +
                        ')'
                      }`
                    : '';

                return {
                  itemNo: v.itemNo,
                  title: v.itemTitle,
                  content: v.content,
                  difficulty: v.difficulty,
                  key: `basic-1-key-${i}`,
                  pointUser,
                  pointEvaluator05,
                  pointEvaluator1,
                  pointEvaluator2,
                };
              }),
            );
          }

          // ** Get/set array object behavior skill
          if (behaviors) {
            evaluationBehaviorSkills.push(
              ...behaviors.map((v) => {
                const pointUser =
                  v.pointUser !== null
                    ? v.pointUser +
                      `${
                        ' (' +
                        Number(v.pointUser || 0) * Number(v.difficulty || 0) +
                        ')'
                      }`
                    : '';
                const pointEvaluator05 =
                  v.pointEvaluator05 !== null
                    ? v.pointEvaluator05 +
                      `${
                        ' (' +
                        Number(v.pointEvaluator05 || 0) *
                          Number(v.difficulty || 0) +
                        ')'
                      }`
                    : '';
                const pointEvaluator1 =
                  v.pointEvaluator1 !== null
                    ? v.pointEvaluator1 +
                      `${
                        ' (' +
                        Number(v.pointEvaluator1 || 0) *
                          Number(v.difficulty || 0) +
                        ')'
                      }`
                    : '';
                const pointEvaluator2 =
                  v.pointEvaluator2 !== null
                    ? v.pointEvaluator2 +
                      `${
                        ' (' +
                        Number(v.pointEvaluator2 || 0) *
                          Number(v.difficulty || 0) +
                        ')'
                      }`
                    : '';
                return {
                  itemNo: v.itemNo,
                  title: v.itemTitle,
                  content: v.content,
                  difficulty: v.difficulty,
                  pointUser,
                  pointEvaluator05,
                  pointEvaluator1,
                  pointEvaluator2,
                };
              }),
            );
          }
        }

        // ** Achievement Additional (mục tiêu thêm - bộ phận)
        const achievementAdditionalsDepartment: AchievementAdditionalType[] =
          [];
        if (evaluationDetail.evaluationAchievementAdditional) {
          const tempAchievementAdditionalsDepartment =
            evaluationDetail.evaluationAchievementAdditional.filter(
              (item) => item.type == 3,
            );

          if (tempAchievementAdditionalsDepartment.length > 0) {
            achievementAdditionalsDepartment.push(
              ...tempAchievementAdditionalsDepartment.map((v, i) => ({
                key: `achievement-additional-department-key-${i}`,
                itemNo: v.itemNo,
                titleAdditional: v.titleAdditional,
                achievementStatus: v.achievementStatus,
                reasonComment: v.reasonComment,
                pointUser: v.pointUser,
                pointEvaluator05: v.pointEvaluator05,
                pointEvaluator1: v.pointEvaluator1,
                pointEvaluator2: v.pointEvaluator2,
              })),
            );
          }
        }

        // ** Achievement Additional (mục tiêu thêm - cá nhân)
        const achievementAdditionalsPersonal: AchievementAdditionalType[] = [];
        if (evaluationDetail.evaluationAchievementAdditional) {
          const tempAchievementAdditionalsPersonal =
            evaluationDetail.evaluationAchievementAdditional.filter(
              (item) => item.type == 2,
            );
          if (tempAchievementAdditionalsPersonal.length > 0) {
            achievementAdditionalsPersonal.push(
              ...tempAchievementAdditionalsPersonal.map((v, i) => ({
                key: `achievement-additional-personal-key-${i}`,
                itemNo: v.itemNo,
                titleAdditional: v.titleAdditional,
                achievementStatus: v.achievementStatus,
                reasonComment: v.reasonComment,
                pointUser: v.pointUser,
                pointEvaluator05: v.pointEvaluator05,
                pointEvaluator1: v.pointEvaluator1,
                pointEvaluator2: v.pointEvaluator2,
              })),
            );
          }
        }

        // ** Period time to evaluation
        if (isEvaluation && evaluatorOrderList.includes(2)) {
          // ** Add last row total Pro skill
          userEvaluationToProSkills.proSkillList.push({
            itemId: null,
            itemTitle: null,
            itemNo: null,
            content: '小計',
            difficulty: null,
            totalPointUser: evaluationDetail.proTotalPointUser,
            totalPointEvaluator05: evaluationDetail.proTotalPointEvaluator05,
            totalPointEvaluator1: evaluationDetail.proTotalPointEvaluator1,
            totalPointEvaluator2: evaluationDetail.proTotalPointEvaluator2,
            key: `evaluation-pro-skill-totalPointProSkillUser`,
          });

          // ** Add last row total Basic skill
          evaluationBasicSkills.push({
            pointUser: evaluationDetail.basicTotalPointUser,
            pointEvaluator05: evaluationDetail.basicTotalPointEvaluator05,
            pointEvaluator1: evaluationDetail.basicTotalPointEvaluator1,
            pointEvaluator2: evaluationDetail.basicTotalPointEvaluator2,
            title: null,
            content: '小計',
            difficulty: null,
            key: `basic-1-key-pointUserBasicSkill`,
          });

          // ** Add last row total achievement Additionals (mục tiêu thêm - bộ phận)
          achievementAdditionalsDepartment.push({
            key: `achievement-additional-department-key-total`,
            itemNo: null,
            titleAdditional: null,
            achievementStatus: null,
            reasonComment: '小計',
            pointUser:
              evaluationDetail.summaryDepartment == null
                ? null
                : evaluationDetail.summaryDepartment
                    .achievementAdditionalTotalPointUser !== null
                ? Pdf810Helper.get2WithoutRound(
                    evaluationDetail.summaryDepartment
                      .achievementAdditionalTotalPointUser,
                  )
                : '',
            pointEvaluator05:
              evaluationDetail.summaryDepartment == null
                ? null
                : evaluationDetail.summaryDepartment
                    .achievementAdditionalTotalPointEvaluator05 !== null
                ? Pdf810Helper.get2WithoutRound(
                    evaluationDetail.summaryDepartment
                      .achievementAdditionalTotalPointEvaluator05,
                  )
                : '',
            pointEvaluator1:
              evaluationDetail.summaryDepartment == null
                ? null
                : evaluationDetail.summaryDepartment
                    .achievementAdditionalTotalPointEvaluator1 !== null
                ? Pdf810Helper.get2WithoutRound(
                    evaluationDetail.summaryDepartment
                      .achievementAdditionalTotalPointEvaluator1,
                  )
                : '',
            pointEvaluator2:
              evaluationDetail.summaryDepartment == null
                ? null
                : evaluationDetail.summaryDepartment
                    .achievementAdditionalTotalPointEvaluator2 !== null
                ? Pdf810Helper.get2WithoutRound(
                    evaluationDetail.summaryDepartment
                      .achievementAdditionalTotalPointEvaluator2,
                  )
                : '',
          });

          // ** Add last row total achievement Additionals (mục tiêu thêm - cá nhân)
          achievementAdditionalsPersonal.push({
            key: `achievement-additional-personal-key-total`,
            itemNo: null,
            titleAdditional: null,
            achievementStatus: null,
            reasonComment: '小計',
            pointUser:
              evaluationDetail.achievementAdditionalTotalPointUser !== null
                ? Math.floor(
                    evaluationDetail.achievementAdditionalTotalPointUser,
                  )
                : '',
            pointEvaluator05:
              evaluationDetail.achievementAdditionalTotalPointEvaluator05 !==
              null
                ? Math.floor(
                    evaluationDetail.achievementAdditionalTotalPointEvaluator05,
                  )
                : '',
            pointEvaluator1:
              evaluationDetail.achievementAdditionalTotalPointEvaluator1 !==
              null
                ? Math.floor(
                    evaluationDetail.achievementAdditionalTotalPointEvaluator1,
                  )
                : '',
            pointEvaluator2:
              evaluationDetail.achievementAdditionalTotalPointEvaluator2 !==
              null
                ? Math.floor(
                    evaluationDetail.achievementAdditionalTotalPointEvaluator2,
                  )
                : '',
          });

          // ** Add last row total Behavior skill
          evaluationBehaviorSkills.push({
            title: null,
            content: '小計',
            difficulty: null,
            pointUser: evaluationDetail.behaviorTotalPointUser,
            pointEvaluator05: evaluationDetail.behaviorTotalPointEvaluator05,
            pointEvaluator1: evaluationDetail.behaviorTotalPointEvaluator1,
            pointEvaluator2: evaluationDetail.behaviorTotalPointEvaluator2,
          });

          // ** Add last row achievement (mục tiêu bộ phận)
          userEvaluationAchievementsDepartment?.push({
            key: 0,
            itemNo: null,
            title: null,
            achievementValue: null,
            method: null,
            weight: null,
            difficultyUser: null,
            difficultyEvaluator05: null,
            difficultyEvaluator1: null,
            difficultyEvaluator2: null,
            achievementStatus: null,
            reasonComment: null,
            actionPlan: '小計',

            pointUser: null,
            pointEvaluator05: null,
            pointEvaluator1: null,
            pointEvaluator2: null,

            coefficientUser: (evaluationDetail.summaryDepartment == null
              ? null
              : evaluationDetail.summaryDepartment
                  .achievementPersonalTotalPointUser
              ? Number(
                  evaluationDetail.summaryDepartment
                    .achievementPersonalTotalPointUser,
                ).toFixed(2)
              : '') as any,
            coefficientEvaluator05: (evaluationDetail.summaryDepartment == null
              ? null
              : evaluationDetail.summaryDepartment
                  .achievementPersonalTotalPointEvaluator05
              ? Number(
                  evaluationDetail.summaryDepartment
                    .achievementPersonalTotalPointEvaluator05,
                ).toFixed(2)
              : '') as any,
            coefficientEvaluator1: (evaluationDetail.summaryDepartment == null
              ? null
              : evaluationDetail.summaryDepartment
                  .achievementPersonalTotalPointEvaluator1
              ? Number(
                  evaluationDetail.summaryDepartment
                    .achievementPersonalTotalPointEvaluator1,
                ).toFixed(2)
              : '') as any,
            coefficientEvaluator2: (evaluationDetail.summaryDepartment == null
              ? null
              : evaluationDetail.summaryDepartment
                  .achievementPersonalTotalPointEvaluator2
              ? Number(
                  evaluationDetail.summaryDepartment
                    .achievementPersonalTotalPointEvaluator2,
                ).toFixed(2)
              : '') as any,

            childrens: [],
          });

          // ** Add last row achievement (mục tiêu cá nhân)
          userEvaluationAchievementsPersonal?.push({
            key: 0,
            itemNo: null,
            title: null,
            achievementValue: null,
            method: null,
            weight: null,
            difficultyUser: null,
            difficultyEvaluator05: null,
            difficultyEvaluator1: null,
            difficultyEvaluator2: null,
            achievementStatus: null,
            reasonComment: null,
            actionPlan: '小計',
            coefficientUser: null,
            coefficientEvaluator05: null,
            coefficientEvaluator1: null,
            coefficientEvaluator2: null,

            pointUser: (evaluationDetail.achievementPersonalTotalPointUser !==
            null
              ? Math.round(evaluationDetail.achievementPersonalTotalPointUser)
              : '') as any,
            pointEvaluator05:
              (evaluationDetail.achievementPersonalTotalPointEvaluator05 !==
              null
                ? Math.round(
                    evaluationDetail.achievementPersonalTotalPointEvaluator05,
                  )
                : '') as any,
            pointEvaluator1:
              (evaluationDetail.achievementPersonalTotalPointEvaluator1 !== null
                ? Math.round(
                    evaluationDetail.achievementPersonalTotalPointEvaluator1,
                  )
                : '') as any,
            pointEvaluator2:
              (evaluationDetail.achievementPersonalTotalPointEvaluator2 !== null
                ? Math.round(
                    evaluationDetail.achievementPersonalTotalPointEvaluator2,
                  )
                : '') as any,
            childrens: [],
          });
        }

        // **Total point
        // const totalPoints = [];

        const data = {
          id: evaluationDetail.id,
          fiscalYear: evaluationDetail.title,
          periodStart: evaluationDetail.periodStart,
          periodEnd: evaluationDetail.periodEnd,
          level: evaluationDetail.level,
          evaluators,
          statusName: `statusEvaluation[evaluationDetail.status]`,
          status: evaluationDetail.status,
          department:
            // evaluationDetail.status < 50
            //   ? `${evaluationDetail.user.division?.name}`
            //   :
            evaluationDetail.divisionName,
          companyName: evaluationDetail.companyName,
          employeeNumber: evaluationDetail.user?.employeeNumber,
          fullName: evaluationDetail.user?.fullName,
          guideVersionId: evaluationDetail.guideVersionId,
          percentPoint: evaluationDetail.percentPoint,

          // ** Order
          evaluatorOrder,
          evaluatorOrderList,

          // ** Comment
          commentUser: evaluationDetail.commentUser,

          // ** Total - user
          basicTotalPointUser: evaluationDetail.basicTotalPointUser,
          proTotalPointUser: evaluationDetail.proTotalPointUser,
          behaviorTotalPointUser: evaluationDetail.behaviorTotalPointUser,
          achievementPersonalTotalPointUser:
            evaluationDetail.achievementPersonalTotalPointUser,
          achievementAdditionalTotalPointUser:
            evaluationDetail.achievementAdditionalTotalPointUser,

          achievementDepartmentTotalPointUser:
            evaluationDetail.summaryDepartment == null
              ? null
              : evaluationDetail.summaryDepartment
                  ?.achievementPersonalTotalPointUser,
          achievementAdditionalDepartmentTotalPointUser:
            evaluationDetail.summaryDepartment == null
              ? null
              : evaluationDetail.summaryDepartment
                  ?.achievementAdditionalTotalPointUser,

          // ** Total - evaluator 0.5
          basicTotalPointEvaluator05:
            evaluationDetail.basicTotalPointEvaluator05,
          proTotalPointEvaluator05: evaluationDetail.proTotalPointEvaluator05,
          behaviorTotalPointEvaluator05:
            evaluationDetail.behaviorTotalPointEvaluator05,
          achievementAdditionalTotalPointEvaluator05:
            evaluationDetail.achievementAdditionalTotalPointEvaluator05,
          achievementPersonalTotalPointEvaluator05:
            evaluationDetail.achievementPersonalTotalPointEvaluator05,

          achievementAdditionalDepartmentTotalPointEvaluator05:
            evaluationDetail.summaryDepartment == null
              ? null
              : evaluationDetail.summaryDepartment
                  ?.achievementAdditionalTotalPointEvaluator05,
          achievementDepartmentTotalPointEvaluator05:
            evaluationDetail.summaryDepartment == null
              ? null
              : evaluationDetail.summaryDepartment
                  ?.achievementPersonalTotalPointEvaluator05,

          // ** Total - evaluator 1.0
          basicTotalPointEvaluator1: evaluationDetail.basicTotalPointEvaluator1,
          proTotalPointEvaluator1: evaluationDetail.proTotalPointEvaluator1,
          behaviorTotalPointEvaluator1:
            evaluationDetail.behaviorTotalPointEvaluator1,
          achievementAdditionalTotalPointEvaluator1:
            evaluationDetail.achievementAdditionalTotalPointEvaluator1,
          achievementPersonalTotalPointEvaluator1:
            evaluationDetail.achievementPersonalTotalPointEvaluator1,

          achievementAdditionalDepartmentTotalPointEvaluator1:
            evaluationDetail.summaryDepartment == null
              ? null
              : evaluationDetail.summaryDepartment
                  ?.achievementAdditionalTotalPointEvaluator1,
          achievementDepartmentTotalPointEvaluator1:
            evaluationDetail.summaryDepartment == null
              ? null
              : evaluationDetail.summaryDepartment
                  ?.achievementPersonalTotalPointEvaluator1,

          // ** Total - evaluator 2.0
          basicTotalPointEvaluator2: evaluationDetail.basicTotalPointEvaluator2,
          proTotalPointEvaluator2: evaluationDetail.proTotalPointEvaluator2,
          behaviorTotalPointEvaluator2:
            evaluationDetail.behaviorTotalPointEvaluator2,
          achievementAdditionalTotalPointEvaluator2:
            evaluationDetail.achievementAdditionalTotalPointEvaluator2,
          achievementPersonalTotalPointEvaluator2:
            evaluationDetail.achievementPersonalTotalPointEvaluator2,

          achievementAdditionalDepartmentTotalPointEvaluator2:
            evaluationDetail.summaryDepartment == null
              ? null
              : evaluationDetail.summaryDepartment
                  ?.achievementAdditionalTotalPointEvaluator2,
          achievementDepartmentTotalPointEvaluator2:
            evaluationDetail.summaryDepartment == null
              ? null
              : evaluationDetail.summaryDepartment
                  .achievementPersonalTotalPointEvaluator2,

          // ** point && setting table level
          pointSettingLevel: {
            key: 'point-setting-level-key-1',
            skillPercent: evaluationDetail.skillPercent,
            behaviorPercent: evaluationDetail.behaviorPercent,
            achievementPercent: evaluationDetail.achievementPercent,
            percentPoint: evaluationDetail.percentPoint,
          },

          // ** Evaluation ProSkill
          ...userEvaluationToProSkills,

          // ** Evaluation Achievements (mục tiêu bộ phận)
          userEvaluationAchievementsDepartment,

          // ** Evaluation Achievements (mục tiêu cá nhân)
          userEvaluationAchievementsPersonal,

          // ** Evaluation Period
          dateCreationGoalStart: evaluationDetail.dateCreationGoalStart,
          dateCreationGoalEnd: evaluationDetail.dateCreationGoalEnd,
          evaluationPeriod: evaluationDetail.evaluationPeriod,

          // ** Evaluation Basic Skill
          evaluationBasicSkills,

          // ** Evaluation Behavior Skill
          evaluationBehaviorSkills,

          // ** Evaluation Achievement Additional (mục tiêu thêm - bộ phận)
          achievementAdditionalsDepartment,

          // ** Evaluation Achievement Additional (mục tiêu thêm - cá nhân)
          achievementAdditionalsPersonal,

          // ** Setting Pro Formula
          settingProFormulas: [],

          // ** Comment Public/Private
          comment,

          // ** Evaluator exception
          isEvaluatorException,

          // ** Update Time
          updateTime: evaluationDetail.updatedTime.toISOString(),

          // ** isEvaluationDate
          isEvaluationDate: isEvaluationDate,

          isEvaluatorUser,
          basicProTotalPointUser: evaluationDetail.basicProTotalPointUser,
          basicProTotalPointEvaluator05:
            evaluationDetail.basicProTotalPointEvaluator05,
          basicProTotalPointEvaluator1:
            evaluationDetail.basicProTotalPointEvaluator1,
          basicProTotalPointEvaluator2:
            evaluationDetail.basicProTotalPointEvaluator2,

          summaryPointUser: evaluationDetail.summaryPointUser,
          summaryPointEvaluator05: evaluationDetail.summaryPointEvaluator05,
          summaryPointEvaluator1: evaluationDetail.summaryPointEvaluator1,
          summaryPointEvaluator2: evaluationDetail.summaryPointEvaluator2,

          summaryDepartmentPointUser:
            evaluationDetail.summaryDepartment == null
              ? null
              : evaluationDetail.summaryDepartment?.summaryPointUser,
          summaryDepartmentPointEvaluator05:
            evaluationDetail.summaryDepartment == null
              ? null
              : evaluationDetail.summaryDepartment?.summaryPointEvaluator05,
          summaryDepartmentPointEvaluator1:
            evaluationDetail.summaryDepartment == null
              ? null
              : evaluationDetail.summaryDepartment?.summaryPointEvaluator1,
          summaryDepartmentPointEvaluator2:
            evaluationDetail.summaryDepartment == null
              ? null
              : evaluationDetail.summaryDepartment?.summaryPointEvaluator2,

          summaryCharPointUser:
            evaluationDetail.summaryDepartment == null
              ? null
              : evaluationDetail.summaryDepartment?.summaryCharPointUser,
          summaryCharPointEvaluator05:
            evaluationDetail.summaryDepartment == null
              ? null
              : evaluationDetail.summaryDepartment?.summaryCharPointEvaluator05,
          summaryCharPointEvaluator1:
            evaluationDetail.summaryDepartment == null
              ? null
              : evaluationDetail.summaryDepartment?.summaryCharPointEvaluator1,
          summaryCharPointEvaluator2:
            evaluationDetail.summaryDepartment == null
              ? null
              : evaluationDetail.summaryDepartment?.summaryCharPointEvaluator2,
          flagSkill: evaluationDetail.flagSkill,
        } as any;

        if (!evaluatorOrderList.includes(2)) {
          data.isNotEvaluator2 = true;
        }
        results.push(data);
      }
    }

    return results;
  }

  // summary export PDF for 1~7 and 8~10
  // async exportPDFOnList(
  //   userId: number,
  //   idList17: number[],
  //   idList810: number[],
  //   role: string,
  //   orientation: 'l' | 'p' = 'p',
  //   size: 'a4' | 'a3' = 'a4',
  // ) {
  //   const evaluation810s =
  //     await this.evaluationRepository.getEvaluationUserByListId(idList810);
  //   const evaluation17s = await this.reportRepo.getEvaluationByIdList(
  //     idList17,
  //     userId,
  //     false,
  //   );

  //   const processDataEvaluations = await this.handleDataEvaluations(
  //     evaluation17s.evaluations,
  //     userId,
  //     true,
  //   );
  //   // const vertionSetting8 = await this.evaluationRepo.getversionSettingForPDF();
  //   const tempList = [];

  //   evaluation810s.forEach((evaluation: Evaluation) => {
  //     if (evaluation.evaluationAchievementPersonals) {
  //       evaluation.evaluationAchievementPersonals.forEach((el) => {
  //         tempList.push(el);
  //       });
  //     }
  //   });
  //   const subList =
  //     await this.evaluationRepository.getSubListByAchievementPersonalId(
  //       tempList,
  //     );
  //   const mergedEvaluationList = Object.values(
  //     [...processDataEvaluations, ...evaluation810s].reduce(
  //       (r, o) => ((r[o.id] = o), r),
  //       {},
  //     ),
  //   ).sort((l: Evaluation, r: Evaluation) => r.id - l.id);
  //   const pdfService = new Pdf810Service();
  //   let results = null;
  //   results = await pdfService.exportListPDFReport(
  //     mergedEvaluationList,
  //     role,
  //     userId,
  //     orientation,
  //     size,
  //     subList,
  //   );
  //   return results;
  // }

  // summary export PDF for 1~7 and 8~10
  async exportPDFMultiLevel(
    userId: number,
    idList17: number[],
    idList810: number[],
    role: string,
    isF5: boolean | undefined,
    companyGroupCode: string,
    timeZone: string,
  ) {
    // ** get data of the evaluation level from 1 to 7
    // const evaluation17s = await this.reportRepo.getEvaluationByIdList(
    //   idList17,
    //   userId,
    //   false,
    // );
    const evaluation17s = await this.reportRepo.getDataPDF1_7(
      idList17,
      userId,
      false,
      companyGroupCode,
    );

    const processDataEvaluations17 = await this.handleDataEvaluations17Review(
      evaluation17s.evaluations,
      userId,
      true,
      timeZone,
    );

    // ** get data of the evaluation level from 8 to 10
    // const evaluation810s =
    //   await this.evaluationRepository.getEvaluationByIdList(
    //     idList810,
    //     userId,
    //     false,
    //   );
    const evaluation810s = await this.evaluationRepository.getDataPDF8_10(
      idList810,
      userId,
      false,
      companyGroupCode,
    );

    const processDataEvaluations810 = await this.handleDataEvaluations810Review(
      evaluation810s.evaluations,
      userId,
      true,
      timeZone,
    );

    const mergedEvaluationList = Object.values(
      [...processDataEvaluations17, ...processDataEvaluations810].reduce(
        (r, o) => ((r[o.id] = o), r),
        {},
      ),
    ).sort((l: Evaluation, r: Evaluation) => {
      const dateL = new Date(`${l.periodStart}/01`); // Thêm ngày để tạo đối tượng Date
      const dateR = new Date(`${r.periodStart}/01`); // Thêm ngày để tạo đối tượng Date

      return dateR.getTime() - dateL.getTime(); // So sánh theo thứ tự giảm dần
    });

    let results = null;
    results = await this.pdfReviewService.exportPDFMultiLevel(
      mergedEvaluationList,
      isF5,
    );
    return results;
  }
}
