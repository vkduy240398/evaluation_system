/* eslint-disable @typescript-eslint/no-var-requires */
import { Inject, Injectable } from '@nestjs/common';
import { Op, QueryTypes, Sequelize } from 'sequelize';
import {
  areSortedArraysDifferent,
  findDeletedIdsSkill,
  getListPeriods,
  resetEvaluationData,
} from 'src/common/util';
import EntityConstant from 'src/constant/EntityConstant';
import { Company } from 'src/entity/Company';
import { Department } from 'src/entity/Department';
import { Evaluation } from 'src/entity/Evaluation';
import { EvaluationAchievementAdditional } from 'src/entity/EvaluationAchievementAdditional';
import { EvaluationAchievementPersonal } from 'src/entity/EvaluationAchievementPersonal';
import { EvaluationAchievementPersonalSub } from 'src/entity/EvaluationAchievementPersonalSub';
import { EvaluationBasicBehavior } from 'src/entity/EvaluationBasicBehavior';
import { EvaluationPeriod } from 'src/entity/EvaluationPeriod';
import { EvaluationPro } from 'src/entity/EvaluationPro';
import { Evaluator } from 'src/entity/Evaluator';
import { EvaluatorDefault } from 'src/entity/EvaluatorDefault';
import { HistoryApproveEvaluation } from 'src/entity/HistoryApproveEvaluation';
import { ListBasicBehavior } from 'src/entity/ListBasicBehavior';
import { SettingDefaultPeriod } from 'src/entity/SettingDefaultPeriod';
import { SettingReview } from 'src/entity/SettingReview';
import { Skill } from 'src/entity/Skill';
import { SkillUser } from 'src/entity/SkillUser';
import { User } from 'src/entity/User';
import { VersionBasicBehavior } from 'src/entity/VersionBasicBehavior';
import { VersionGuideEvaluation } from 'src/entity/VersionGuideEvaluation';
import { EvaluationByPeriodType } from 'src/interfaces/service/evaluationPeriod.interface';
// const moment = require('moment');
// moment.tz.setDefault('Asia/Tokyo');
import * as moment from 'moment';
import { SkillGroup } from 'src/entity/SkillGroup';
import { SummaryDepartment } from 'src/entity/SummaryDepartment';
@Injectable()
export class EvaluationPeriodRepository {
  @Inject(EntityConstant.EVALUATION_PERIOD)
  private evaluationPeriodEntity: typeof EvaluationPeriod;

  @Inject(EntityConstant.EVALUATION)
  private evaluationEntity: typeof Evaluation;

  @Inject(EntityConstant.EVALUATOR_DEFAULT)
  private evaluatorDefaultEntity: typeof EvaluatorDefault;

  @Inject(EntityConstant.USER)
  private userEntity: typeof User;

  @Inject(EntityConstant.SKILL_GROUP)
  private skillGroupEntity: typeof SkillGroup;

  @Inject(EntityConstant.EVALUATION_ACHIEVEMENT_PERSONAL)
  private evaluationAchievementPersonalEntity: typeof EvaluationAchievementPersonal;

  @Inject(EntityConstant.EVALUATION_ACHIEVEMENT_PERSONAL_SUB)
  private evaluationAchievementPersonalSubEntity: typeof EvaluationAchievementPersonalSub;

  @Inject(EntityConstant.EVALUATION_BASIC_BEHAVIOR)
  private evaluationBasicBehaviorEntity: typeof EvaluationBasicBehavior;

  @Inject(EntityConstant.HISTORY_APPROVE_EVALUATION)
  private historyApproveEvaluation: typeof HistoryApproveEvaluation;

  @Inject(EntityConstant.EVALUATION_PRO)
  private evaluationPro: typeof EvaluationPro;

  @Inject(EntityConstant.VERSION_BASIC_BEHAVIOR)
  private versionBasicBehavior: typeof VersionBasicBehavior;

  @Inject(EntityConstant.SKILL_USER_ENTITY)
  private skillUser: typeof SkillUser;

  @Inject(EntityConstant.SUMMARY_DEPARTMENT)
  private summaryDepartment: typeof SummaryDepartment;

  @Inject(EntityConstant.SETTING_REVIEW)
  private settingReviewEnity: typeof SettingReview;

  @Inject(EntityConstant.SETTING_DEFAULT_PERIOD_VIEWING)
  private settingDefaultPeriodEnity: typeof SettingDefaultPeriod;

  async getEvaluationPeriod(timeZone: string) {
    const today = moment().tz(timeZone).format('YYYY/MM/DD');
    const sql = `select date_creation_goal_start, date_creation_goal_end, date_creation_goal_department_start, date_creation_goal_department_end, year, period_index "periodIndex", period_start "periodStart", period_end "periodEnd"
      from evaluation_period_tbl where (TO_TIMESTAMP(date_creation_goal_start, 'YYYY/MM/DD') <= :today AND TO_TIMESTAMP(date_creation_goal_end, 'YYYY/MM/DD') >= :today)
      or (TO_TIMESTAMP(date_creation_goal_department_start, 'YYYY/MM/DD') <= :today AND TO_TIMESTAMP(date_creation_goal_department_end, 'YYYY/MM/DD') >= :today)`;
    const periods = await this.evaluationPeriodEntity.sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements: {
        today: today,
      },
    });
    return periods;
  }

  async getProgressingPeriod(companyGroupCode: string, timeZone: string) {
    const today = moment().tz(timeZone).format('YYYY/MM/DD');
    const sql = `select *
      from evaluation_period_tbl where ((TO_TIMESTAMP(date_creation_goal_start, 'YYYY/MM/DD') <= :today AND TO_TIMESTAMP(date_creation_goal_end, 'YYYY/MM/DD') >= :today)
      or (TO_TIMESTAMP(date_evaluation_start, 'YYYY/MM/DD') <= :today AND TO_TIMESTAMP(date_evaluation_end, 'YYYY/MM/DD') >= :today)
      or (TO_TIMESTAMP(date_creation_goal_department_start, 'YYYY/MM/DD') <= :today AND TO_TIMESTAMP(date_creation_goal_department_end, 'YYYY/MM/DD') >= :today)
      or (TO_TIMESTAMP(date_evaluation_department_start, 'YYYY/MM/DD') <= :today AND TO_TIMESTAMP(date_evaluation_department_end, 'YYYY/MM/DD') >= :today))
      and year in (date_part('year', now())::text, date_part('year', now() - interval '1 year')::text)
      AND company_group_code = :companyGroupCode
      `;
    const periods = await this.evaluationPeriodEntity.sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements: {
        today: today,
        companyGroupCode: companyGroupCode,
      },
    });
    return periods;
  }
  async getAll(condition: any) {
    return await this.evaluationPeriodEntity.findAll({
      attributes: [
        'id',
        'dateCreationGoalStart',
        'dateCreationGoalEnd',
        'dateEvaluationStart',
        'dateEvaluationEnd',
        'dateCreationGoalDepartmentStart',
        'dateCreationGoalDepartmentEnd',
        'dateEvaluationDepartmentStart',
        'dateEvaluationDepartmentEnd',
      ],
      where: condition,
    });
  }
  async getPeriodByCondition(condition: any) {
    const currentPeriod = await this.evaluationPeriodEntity.findOne({
      where: [condition],
    });
    return currentPeriod;
  }

  async listPeriodByYear(
    yearStart: number,
    yearEnd: number,
    companyGroupCode: string,
  ) {
    return await this.evaluationPeriodEntity.findAll({
      where: {
        year: {
          [Op.between]: [yearStart, yearEnd.toString()],
        },
        companyGroupCode,
      },
      order: [
        ['year', 'DESC'],
        ['periodIndex', 'DESC'],
      ],
    });
  }
  async getEvaluationDatesByPeriodIds(
    periodIds: number[],
    companyGroupCode: string,
  ): Promise<any[]> {
    if (!periodIds.length) return [];
    const sql = `
      SELECT
        evaluation_period_id AS "evaluationPeriodId",
        date_creation_goal_start AS "dateCreationGoalStart",
        date_creation_goal_end AS "dateCreationGoalEnd",
        date_evaluation_start AS "dateEvaluationStart",
        date_evaluation_end AS "dateEvaluationEnd"
      FROM evaluation_tbl
      WHERE evaluation_period_id IN (:periodIds)
        AND company_group_code = :companyGroupCode
    `;
    return this.evaluationPeriodEntity.sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements: { periodIds, companyGroupCode },
    });
  }

  async getPeriodListByCondition(condition: any) {
    return await this.evaluationPeriodEntity.findAll({
      where: condition,
    });
  }
  async savePeriod(condition: any, updateValues: any) {
    // const results = await this.evaluationPeriodEnity.findOrCreate({
    //   defaults: {
    //     ...updateValues,
    //     checkNewEvaluationDepartment: true,
    //     checkNewEvaluationGoal: true,
    //     checkNewCreationDepartment: true,
    //     checkNewCreationGoal: true,
    //   },
    //   where: condition,
    // });

    return await this.evaluationPeriodEntity.update(updateValues, {
      where: condition,
      returning: true,
    });
  }

  // ** Exception Period
  async getEvaluationByPeriod(
    userId: number,
    evaluationPeriodId: number,
    companyGroupCode: string,
  ) {
    return await this.evaluationEntity.findAll({
      where: {
        userId: userId,
        evaluationPeriodId: evaluationPeriodId,
        companyGroupCode: companyGroupCode,
      },
      attributes: [
        'id',
        'companyName',
        'departmentName',
        'divisionName',
        'level',
        'percentPoint',
        'dateCreationGoalStart',
        'dateCreationGoalEnd',
        'dateEvaluationStart',
        'dateEvaluationEnd',
        'status',
        'periodStart',
        'periodEnd',
        'creationUser',
        'createdByCronjob',
        'flagSkill',
      ],
      include: [
        {
          attributes: ['evaluationOrder', 'evaluatorId'],
          model: Evaluator,
          as: 'evaluator',
          include: [
            {
              model: User,
              as: 'user',
            },
          ],
        },
      ],
    });
    // return await this.evaluationPeriodEntity.findOrCreate({
    //   where: { year, periodIndex },
    //   defaults: {
    //     periodStart,
    //     periodEnd,
    //   },
    //   include: [
    //     {
    //       model: Evaluation,
    //       as: 'evaluations',
    //       where: { userId },
    //       attributes: [
    //         'id',
    //         'companyName',
    //         'departmentName',
    //         'divisionName',
    //         'level',
    //         'percentPoint',
    //         'dateCreationGoalStart',
    //         'dateCreationGoalEnd',
    //         'dateEvaluationStart',
    //         'dateEvaluationEnd',

    //         'status',

    //         'periodStart',
    //         'periodEnd',
    //         'creationUser',
    //         'createdByCronjob',
    //         'flagSkill',
    //       ],
    //       required: false,
    //       include: [
    //         {
    //           attributes: ['evaluationOrder', 'evaluatorId'],
    //           model: Evaluator,
    //           as: 'evaluator',
    //           order: [['evaluationOrder', 'ASC']],
    //           include: [
    //             {
    //               model: User,
    //               as: 'user',
    //             },
    //           ],
    //         },
    //         {
    //           model: SkillUser,
    //           as: 'skillUser',

    //           include: [
    //             {
    //               model: Skill,
    //               as: 'skill',
    //               attributes: ['id', 'name'],
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       model: EvaluatorDefault,
    //       as: 'evaluatorDefaults',
    //       attributes: ['userId'],
    //     },
    //   ],
    // });
  }

  async getSkillUserOfEvaluation(evaluationId: number) {
    return await this.skillUser.findAll({
      where: { evaluationId },
      include: [
        {
          model: Skill,
          as: 'skill',
          attributes: ['id', 'name'],
        },
      ],
    });
  }

  // eslint-disable-next-line complexity
  async updateEvaluationPeriodException(
    evaluations: EvaluationByPeriodType[],
    userId: number,
    creationUser: number,
    deleteIds: number[],
    year: number,
    periodIndex: number,
    levelSettings: {
      level: number;
      skillPercent: number | null;
      behaviorPercent: number | null;
      achievementPercent: number | null;
      type: number;
    }[],
    guideEvaluation: VersionGuideEvaluation[],
    companyGroupCode: string,
  ) {
    const convertEvaluations = evaluations.map((v) => {
      if (v.evaluator20 === v.evaluator05) v.evaluator05 = null;

      if (v.evaluator20 === v.evaluator10 && v.evaluator10 !== v.evaluator05) {
        v.evaluator10 = null;
      }

      if (v.evaluator10 === v.evaluator05) v.evaluator05 = null;
      return v;
    });

    const resetPersonalAchievement: number[] = [];
    const resetEvaluationIds: number[] = [];
    const updateBehaviorByEvaluationIds: number[] = [];
    const updateGoalPersonal17ByEvaluationIds: number[] = [];
    const updateGoalPersonal810ByEvaluationIds: number[] = [];
    const evaluator05ErrorIds: number[] = [];
    const evaluator10ErrorIds: number[] = [];
    const evaluatorErrorNames: string[] = [];

    const evaluationArrays: EvaluationByPeriodType[] = [];

    if (convertEvaluations.length > 0) {
      const evaluationOlds = convertEvaluations.filter((f) => f.id !== 0);
      const evaluationNews = convertEvaluations
        .filter((f) => f.id === 0)
        .map((v) => {
          // const isSkill = v.flagSkill === 1 ? 1 : 3;
          // const isGuide17 = v.level < 8 ? (v.flagSkill === 1 ? 1 : 3) : 2;
          const isSkill =
            v.level < 8
              ? v.flagSkill === 1
                ? 1
                : 3
              : v.flagSkill === 1
              ? 2
              : 4;
          const isGuide =
            v.level < 8
              ? v.flagSkill === 1
                ? 1
                : 3
              : v.flagSkill === 1
              ? 2
              : 4;

          return {
            // ...v,
            // checkNew: true,
            percentPoint: v.percentPoint,
            level: v.level,
            title: v.period,
            status: 0,
            companyName: v.companyName,
            departmentId: v.departmentId,
            departmentName: v.departmentName,
            divisionId: v.divisionId,
            divisionName: v.divisionName,
            periodStart: v.periodStart,
            periodEnd: v.periodEnd,
            dateCreationGoalStart: v.dateCreationGoalStart,
            dateCreationGoalEnd: v.dateCreationGoalEnd,
            dateEvaluationStart: v.dateEvaluationStart,
            dateEvaluationEnd: v.dateEvaluationEnd,
            // checkSendMailEvaluation: v.checkSendMailEvaluation,
            // dateSendMailEvaluation: v.dateSendMailEvaluation,
            evaluator05: v.evaluator05,
            evaluator10: v.evaluator10,
            evaluator20: v.evaluator20,
            evaluationPeriodId: v.evaluationPeriodId,
            // checkSendMail: v.checkSendMail,
            // dateSendMail: v.dateSendMail,
            userId,
            creationUser,
            skillPercent: levelSettings.find(
              (f) => f?.level === v.level && f.type === isSkill,
            )?.skillPercent,
            behaviorPercent: levelSettings.find(
              (f) => f?.level === v.level && f.type === isSkill,
            )?.behaviorPercent,
            achievementPercent: levelSettings.find(
              (f) => f?.level === v.level && f.type === isSkill,
            )?.achievementPercent,
            guideVersionId: guideEvaluation.find((f) => f.type === isGuide)?.id,
            flagSkill: v.flagSkill,
            skillUser: v.skillUser,
            companyGroupCode: companyGroupCode,
          };
        });

      if (evaluationOlds.length > 0) {
        evaluationArrays.push(...evaluationOlds);

        const ids = evaluationOlds.map((v) => v.id);
        const evaluations = await this.evaluationEntity.findAll({
          where: { id: { [Op.in]: ids } },
          include: { model: Evaluator, as: 'evaluator' },
        });
        if (evaluations.length > 0) {
          for await (const v of evaluations) {
            const item = evaluationOlds.find((f) => f.id === v.id);
            if (item) {
              const listDepDivId: number[] = [];
              if (v.status < 50) {
                if (
                  (item.departmentId !== undefined &&
                    v.departmentId !== item.departmentId &&
                    (item.level || v.level) < 8) ||
                  (item.divisionId !== undefined &&
                    v.divisionId !== item.divisionId) ||
                  (v.level < 8 && item.level > 7) ||
                  (v.level > 7 && item.level < 8) ||
                  v.flagSkill !== item.flagSkill
                ) {
                  resetEvaluationIds.push(v.id);
                  if (
                    (item.departmentId !== undefined &&
                      v.departmentId !== item.departmentId &&
                      (item.level || v.level) < 8) ||
                    (item.divisionId !== undefined &&
                      v.divisionId !== item.divisionId)
                  ) {
                    resetPersonalAchievement.push(v.id);
                  } else if (v.level < 8 && item.level > 7) {
                    //1-7 -> 8-10
                    updateGoalPersonal810ByEvaluationIds.push(v.id);
                  } else if (v.level > 7 && item.level < 8) {
                    //8-10 -> 1-7
                    updateGoalPersonal17ByEvaluationIds.push(v.id);
                  }
                } else if (item.level !== v.level) {
                  updateBehaviorByEvaluationIds.push(v.id);
                }

                //luu tạm để dùng xử lý sau
                if (item?.departmentId || item?.divisionId) {
                  if (item?.departmentId || v.departmentId) {
                    listDepDivId.push(item?.departmentId || v.departmentId);
                  }
                  listDepDivId.push(item?.divisionId || v.divisionId);
                }

                v.level = item.level;
                v.departmentId = item.departmentId;
                v.departmentName = item.departmentName;
                v.divisionId = item.divisionId;
                v.divisionName = item.divisionName;
                v.companyName = item.companyName;

                // const isSkill = v.flagSkill === 1 ? 1 : 3;
                // const isGuide17 = v.level < 8 ? (v.flagSkill === 1 ? 1 : 3) : 2;
                const isSkill =
                  item.level < 8
                    ? item.flagSkill === 1
                      ? 1
                      : 3
                    : item.flagSkill === 1
                    ? 2
                    : 4;
                const isGuide =
                  item.level < 8
                    ? item.flagSkill === 1
                      ? 1
                      : 3
                    : item.flagSkill === 1
                    ? 2
                    : 4;

                v.skillPercent = levelSettings.find(
                  (f) => f?.level === item.level && f.type === isSkill,
                )?.skillPercent;
                v.behaviorPercent = levelSettings.find(
                  (f) => f?.level === item.level && f.type === isSkill,
                )?.behaviorPercent;
                v.achievementPercent = levelSettings.find(
                  (f) => f?.level === item.level && f.type === isSkill,
                )?.achievementPercent;

                v.guideVersionId = guideEvaluation.find(
                  (f) => f.type === isGuide,
                )?.id;
              }
              v.periodStart = item.periodStart;
              v.periodEnd = item.periodEnd;
              v.percentPoint = item.percentPoint;
              v.dateCreationGoalStart = item.dateCreationGoalStart;
              v.dateCreationGoalEnd = item.dateCreationGoalEnd;
              v.dateEvaluationStart = item.dateEvaluationStart;
              v.dateEvaluationEnd = item.dateEvaluationEnd;
              v.creationUser = creationUser;
              v.flagSkill = item.flagSkill;

              const evaluators = await v.getEvaluator();

              if (item.evaluator05) {
                const findEvaluator = evaluators.find(
                  (f) => Number(f.evaluationOrder) === 0.5,
                );
                if (findEvaluator) {
                  findEvaluator.evaluatorId = item.evaluator05 || null;
                  findEvaluator.save();
                } else {
                  const data = {
                    evaluatorId: item.evaluator05,
                    evaluationOrder: 0.5,
                    commentPrivate: '',
                    commentPublic: '',
                  };

                  v.createEvaluator(data);
                }
              } else if (![3, 4, 53, 54, 55].includes(v.status)) {
                evaluators
                  .find((f) => Number(f.evaluationOrder) === 0.5)
                  ?.destroy();
              } else {
                evaluatorErrorNames.push(item.evaluator05Name);
                evaluator05ErrorIds.push(v.id);
              }

              if (item.evaluator10) {
                const findEvaluator = evaluators.find(
                  (f) => Number(f.evaluationOrder) === 1.0,
                );
                if (findEvaluator) {
                  findEvaluator.evaluatorId = item.evaluator10;
                  findEvaluator.save();
                } else {
                  const data = {
                    evaluatorId: item.evaluator10,
                    evaluationOrder: 1.0,
                    commentPrivate: '',
                    commentPublic: '',
                  };

                  v.createEvaluator(data);
                }
              } else if (![5, 6, 56, 57, 58].includes(v.status)) {
                evaluators
                  .find((f) => Number(f.evaluationOrder) === 1.0)
                  ?.destroy();
              } else {
                evaluatorErrorNames.push(item.evaluator10Name);
                evaluator10ErrorIds.push(v.id);
              }

              if (item.evaluator20) {
                const findEvaluator = evaluators.find(
                  (f) => Number(f.evaluationOrder) === 2.0,
                );
                if (findEvaluator) {
                  findEvaluator.evaluatorId = item.evaluator20;
                  findEvaluator.save();
                } else {
                  const data = {
                    evaluatorId: item.evaluator20,
                    evaluationOrder: 2.0,
                    commentPrivate: '',
                    commentPublic: '',
                  };

                  v.createEvaluator(data);
                }
              }

              //**Update skill user cho các record evaluation cũ */
              const evaluationId = item.id;

              //* xóa skill đã đăng ký trong evaluation nếu skill setting bị xóa trong giai đoạn đặt mục tiêu
              const temSkillAlreadySetting = await this.skillUser.findAll({
                attributes: ['skillId'],
                where: {
                  evaluationId: evaluationId,
                },
              });
              const skillAlreadySetting = [];
              if (temSkillAlreadySetting.length > 0) {
                temSkillAlreadySetting.map((item: any) => {
                  skillAlreadySetting.push(item.skillId);
                });
              }
              if (v.status < 50) {
                const skillDelete = findDeletedIdsSkill(
                  item?.skillUser,
                  skillAlreadySetting,
                );

                if (skillDelete.length > 0) {
                  await this.evaluationEntity.sequelize.query(
                    'CALL delete_skill_evaluation(ARRAY[:skillDelete], :evaluationId, :companyGroupCode)',
                    {
                      replacements: {
                        skillDelete: skillDelete,
                        evaluationId: evaluationId,
                        companyGroupCode: companyGroupCode,
                      },
                      type: QueryTypes.RAW, // Hoặc QueryTypes.SELECT nếu bạn muốn xử lý kết quả
                      logging: false,
                    },
                  );
                }
              }

              //* Update skill mới
              await this.skillUser.destroy({
                where: {
                  evaluationId: evaluationId,
                },
              });

              const listSkillUpdate = [];
              if (item?.flagSkill) {
                const arrayDiffernet = await areSortedArraysDifferent(
                  skillAlreadySetting,
                  item?.skillUser,
                );
                if (
                  resetPersonalAchievement.includes(v.id) &&
                  !arrayDiffernet
                ) {
                  const skillGroups = await this.skillGroupEntity.findAll({
                    attributes: ['skillId'],
                    where: {
                      departmentId: listDepDivId,
                    },
                  });
                  for (let i = 0; i < skillGroups?.length; i++) {
                    const element = skillGroups[i];
                    listSkillUpdate.push({
                      userId: userId,
                      skillId: element?.skillId,
                      periodId: item.evaluationPeriodId,
                      evaluationId: item.id,
                      type: 1,
                    });
                  }
                } else {
                  if (item?.skillUser?.length > 0) {
                    for (let i = 0; i < item?.skillUser?.length; i++) {
                      const element = item?.skillUser[i];
                      listSkillUpdate.push({
                        userId: userId,
                        skillId: element,
                        periodId: item.evaluationPeriodId,
                        evaluationId: item.id,
                        type: 1,
                      });
                    }
                  }
                }
                if (listSkillUpdate.length > 0) {
                  await this.skillUser.bulkCreate(listSkillUpdate);
                }
              }

              await v.save();
            }
          }
        }
      }
      if (evaluationNews) {
        await this.evaluationEntity
          .bulkCreate([...evaluationNews], { ignoreDuplicates: true })
          .then(async (res) => {
            if (res.length > 0) {
              res.map(async (v, i) => {
                const evaluator = evaluationNews[i];
                if (evaluator) {
                  if (evaluator.evaluator05) {
                    v.createEvaluator({
                      evaluatorId: evaluator.evaluator05,
                      evaluationOrder: 0.5,
                    });
                  }

                  if (evaluator.evaluator10) {
                    v.createEvaluator({
                      evaluatorId: evaluator.evaluator10,
                      evaluationOrder: 1.0,
                    });
                  }

                  if (evaluator.evaluator20) {
                    v.createEvaluator({
                      evaluatorId: evaluator.evaluator20,
                      evaluationOrder: 2.0,
                    });
                  }
                  evaluationArrays.push({
                    id: v.id,
                    ...evaluator,
                    period: '',
                    evaluator05Name: '',
                    evaluator10Name: '',
                    evaluator20Name: '',
                    key: '',
                    isEdit: false,
                  });

                  //**Tạo skill user cho các record evaluation mới */
                  if (evaluator.flagSkill == 1) {
                    const listSkillUpdate = [];
                    for (let i = 0; i < evaluator.skillUser?.length; i++) {
                      const skillId = evaluator?.skillUser[i];
                      listSkillUpdate.push({
                        userId: evaluator.userId,
                        skillId: skillId,
                        periodId: evaluator.evaluationPeriodId,
                        evaluationId: v.id,
                        type: 1,
                      });
                    }
                    await this.skillUser.bulkCreate(listSkillUpdate);
                  }
                }
              });
            }
          });
      }

      if (deleteIds.length > 0) {
        await this.evaluationEntity.sequelize.query(
          ` CALL backup_evaluation(ARRAY[:deleteIds]::integer[]);`,
          {
            replacements: {
              deleteIds: deleteIds,
            },
            type: QueryTypes.RAW, // Hoặc QueryTypes.SELECT nếu bạn muốn xử lý kết quả
            logging: false,
          },
        );

        await this.deleteEvaluation(
          deleteIds,
          false,
          year,
          periodIndex,
          userId,
          companyGroupCode,
        );
      }
    } else {
      await this.evaluationEntity.sequelize.query(
        ` CALL backup_evaluation(ARRAY[:deleteIds]::integer[]);`,
        {
          replacements: {
            deleteIds: deleteIds,
          },
          type: QueryTypes.RAW, // Hoặc QueryTypes.SELECT nếu bạn muốn xử lý kết quả
          logging: false,
        },
      );

      await this.deleteEvaluation(
        deleteIds,
        true,
        year,
        periodIndex,
        userId,
        companyGroupCode,
      );
    }

    return {
      updateGoalPersonal810ByEvaluationIds,
      updateGoalPersonal17ByEvaluationIds,
      updateBehaviorByEvaluationIds,
      resetEvaluationIds,
      resetPersonalAchievement,
      evaluationArrays,
      evaluator05ErrorIds,
      evaluator10ErrorIds,
      evaluatorErrorNames: [...new Set(evaluatorErrorNames)],
    };
  }

  async deleteEvaluation(
    deleteIds: number[],
    isEmpty = false,
    year = 2023,
    periodIndex = 1,
    userId = 1,
    companyGroupCode: string,
  ) {
    const includes = isEmpty
      ? [
          {
            model: EvaluationPeriod,
            as: 'evaluationPeriod',
            where: {
              year: year,
              periodIndex: periodIndex,
              companyGroupCode: companyGroupCode,
            },
          },
        ]
      : undefined;

    const ids = [...new Set(deleteIds)];

    const condition =
      isEmpty || deleteIds.length > 0 ? { id: { [Op.in]: ids } } : {};

    await this.evaluationEntity
      .findAll({
        attributes: ['id'],
        where: {
          ...condition,
          userId: userId,
          // status: 0, //** vì có backup data nên xóa */
          companyGroupCode: companyGroupCode,
        },
        include: includes,
      })
      .then(async (evaluations) => {
        if (evaluations.length > 0) {
          const evaluationIds = evaluations.map((v) => v.id);
          await this.summaryDepartment.destroy({
            where: { evaluationId: evaluationIds },
          });
          await this.skillUser.destroy({
            where: { evaluationId: evaluationIds },
          });
          await this.evaluationEntity.destroy({ where: { id: evaluationIds } });
        }
      });
  }

  async resetEvaluationData(ids: number[], resetPersonalAchievement: number[]) {
    await this.evaluationEntity.update(
      { ...resetEvaluationData },
      { where: { id: { [Op.in]: ids } } },
    );
    // // ** Achievement Personal
    if (resetPersonalAchievement.length > 0) {
      await this.evaluationAchievementPersonalEntity.destroy({
        where: { evaluationId: { [Op.in]: resetPersonalAchievement } },
      });
      await this.evaluationAchievementPersonalSubEntity.destroy({
        where: { achievementPersonalId: { [Op.is]: null } },
      });
    }

    // await this.evaluationAchievementAdditionalEntity.destroy({
    //   where: { evaluationId: { [Op.in]: ids } },
    // });

    this.historyApproveEvaluation.destroy({
      where: { evaluationId: { [Op.in]: ids } },
    });

    await this.evaluationBasicBehaviorEntity.destroy({
      where: { evaluationId: { [Op.in]: ids } },
    });

    await this.evaluationPro.destroy({
      where: { evaluationId: { [Op.in]: ids } },
    });
  }

  async updateBehaviorByEvaluationIds(ids: number[], companyGroupCode: string) {
    await this.evaluationBasicBehaviorEntity.destroy({
      where: {
        evaluationId: ids,
        type: {
          [Op.not]: [1, 4],
        },
      },
    });

    const evaluations = (
      await this.evaluationEntity.findAll({
        attributes: ['id', 'level', 'flagSkill'],
        where: { id: ids },
      })
    ).map((data) => data && data.get({ plain: true }));

    if (evaluations) {
      const levels = evaluations.map((v) => v.level);

      const getBehaviors = (
        await this.versionBasicBehavior.findAll({
          where: {
            status: 4,
            level: levels,
            companyGroupCode: companyGroupCode,
            type: {
              [Op.not]: [1, 4],
            },
          },
          include: { model: ListBasicBehavior, as: 'listBasicBehaviors' },
        })
      ).map(
        (data) => data && data.get({ plain: true }),
      ) as VersionBasicBehavior[];

      if (getBehaviors.length > 0) {
        //
        for (let i = 0; i < evaluations.length; i++) {
          const element = evaluations[i];
          const behaviorType =
            evaluations[i].level < 8
              ? evaluations[i].flagSkill === 1
                ? 2
                : 3
              : evaluations[i].flagSkill === 1
              ? 5
              : 6;
          const behaviors = getBehaviors.find(
            (f) => f.level === element.level && f.type === behaviorType,
          );

          if (behaviors && behaviors.listBasicBehaviors?.length > 0) {
            const datas = behaviors.listBasicBehaviors.map((v, i) => ({
              ...v,
              itemNo: i,
              type: behaviorType,
              itemTitle: v.title,
              evaluationId: element.id,
            }));

            this.evaluationBasicBehaviorEntity.bulkCreate(datas, {
              ignoreDuplicates: true,
            });
          }
        }
      }
    }
  }

  async updateGoalPersonalByEvaluationIds(
    idsUpdateGoal17: number[],
    idsUpdateGoal810: number[],
  ) {
    if (idsUpdateGoal17.length > 0) {
      await this.evaluationAchievementPersonalEntity.update(
        { type: 1 },
        { where: { evaluationId: idsUpdateGoal17, type: 2 } },
      );

      await this.evaluationAchievementPersonalEntity.destroy({
        where: { evaluationId: idsUpdateGoal17, type: 3 },
      });
    }

    if (idsUpdateGoal810.length > 0) {
      await this.evaluationAchievementPersonalEntity.update(
        { type: 2 },
        { where: { evaluationId: idsUpdateGoal810 } },
      );
    }
  }

  async findOnePeriod(where: { [x: string]: any }) {
    return await this.evaluationPeriodEntity.findOne({
      where: where,
    });
  }
  //
  async getPeriodListSendMailDepartment(condition: { [x: string]: any }) {
    return await this.evaluationPeriodEntity.findOne({
      where: condition,
    });
  }

  async getUserPeriodException(
    year: number,
    periodIndex: number,
    listUserId: number[],
  ) {
    //

    const results = await this.userEntity.findAll({
      include: [
        {
          attributes: [
            'id',
            'companyName',
            'departmentName',
            'divisionName',
            'periodStart',
            'periodEnd',
            'percentPoint',
            'level',
            'dateCreationGoalStart',
            'dateCreationGoalEnd',
            'dateEvaluationStart',
            'dateEvaluationEnd',
            'createdByCronjob',
            'flagSkill',
          ],
          model: Evaluation,
          as: 'evaluations',
          required: true,
          subQuery: true,
          where: { creationUser: { [Op.ne]: null } },
          include: [
            {
              attributes: ['evaluationOrder'],
              model: Evaluator,
              as: 'evaluator',
              include: [
                {
                  attributes: [
                    'fullName',
                    'email',
                    [
                      Sequelize.fn(
                        'CONCAT',
                        Sequelize.col('employee_number'),
                        ': ',
                        Sequelize.col('full_name'),
                      ),
                      'employeeNumberName',
                    ],
                  ],
                  model: User,
                  as: 'user',
                },
              ],
            },
            {
              model: SkillUser,
              as: 'skillUser',

              include: [
                {
                  model: Skill,
                  as: 'skill',
                  attributes: ['id', 'name'],
                },
              ],
            },
            {
              required: true,
              attributes: [
                'dateCreationGoalStart',
                'dateCreationGoalDepartmentStart',
                'dateCreationGoalEnd',
                'dateCreationGoalDepartmentEnd',
                'year',
                'periodIndex',
              ],
              model: EvaluationPeriod,
              as: 'evaluationPeriod',
              where: { year, periodIndex },
            },
          ],
        },
        { model: Department, as: 'department', attributes: ['code', 'name'] },
        { model: Department, as: 'division', attributes: ['code', 'name'] },
        { model: Company, as: 'company', attributes: ['name'] },

        {
          model: EvaluatorDefault,
          as: 'evaluatorDefault',
          attributes: ['departmentName', 'level'],
        },
      ],
      where: { id: { [Op.in]: listUserId } },
      limit: 99999,
      offset: 0,
      order: [['employeeNumber', 'ASC']],
    });

    // const counts = await this.userEntity.count({
    //   distinct: true,
    //   include: [
    //     {
    //       attributes: [],
    //       model: Evaluation,
    //       as: 'evaluations',
    //       required: true,
    //       where: { creationUser: { [Op.ne]: null } },
    //       include: [
    //         {
    //           attributes: [],
    //           model: EvaluationPeriod,
    //           as: 'evaluationPeriod',
    //           where: { year, periodIndex },
    //         },
    //       ],
    //     },
    //   ],
    // });

    return { dataList: results };
  }
  async getAllByCondition(where: { [x: string]: any }) {
    return await this.evaluationPeriodEntity.findAll({
      where: where,
    });
  }

  async getAllPeriodNotFixedGoalPeriod(day: number, companyGroupCode: string) {
    const datas: any = await this.evaluationPeriodEntity.sequelize.query(
      `
      SELECT DISTINCT
        ep.id,
        ep.year,
        ep.period_index
      FROM public.evaluation_tbl ev
      LEFT JOIN public.evaluation_period_tbl ep
        ON ev.evaluation_period_id = ep.id
      LEFT JOIN public.user_tbl us
        ON ev.user_id = us.id
      INNER JOIN public.evaluator_default_tbl ed
        ON ed.user_id = ev.user_id AND ed.evaluation_period_id = ev.evaluation_period_id
      WHERE 
        ((
          ev.creation_user IS NOT NULL
            AND ev.date_creation_goal_end IS NOT NULL
          AND CURRENT_DATE + :day = TO_DATE(ev.date_creation_goal_end, 'YYYY/MM/DD')
        )
        OR
        (
          ev.creation_user IS NULL
          AND 
          (
            (
            ev.level <= 7
            AND CURRENT_DATE + :day = TO_DATE(ep.date_creation_goal_end, 'YYYY/MM/DD')
          )
          OR
          (
            ev.level > 7 AND ev.level <= 10
            AND CURRENT_DATE + :day = TO_DATE(ep.date_creation_goal_department_end, 'YYYY/MM/DD')
          )
          )
        ))
        AND ev.status < 49
        AND us.active = 1
        AND ev.company_group_code = :companyGroupCode
    `,
      {
        replacements: {
          day: day,
          companyGroupCode: companyGroupCode,
        },
      },
    );

    return datas;
  }

  async getAllPeriodNotFixedEvalPeriod(day: number, companyGroupCode: string) {
    const datas: any = await this.evaluationPeriodEntity.sequelize.query(
      `
      SELECT DISTINCT
        ep.id,
        ep.year,
        ep.period_index
      FROM public.evaluation_tbl ev
      LEFT JOIN public.evaluation_period_tbl ep
        ON ev.evaluation_period_id = ep.id
      LEFT JOIN public.user_tbl us
        ON ev.user_id = us.id
      INNER JOIN public.evaluator_default_tbl ed
        ON ed.user_id = ev.user_id AND ed.evaluation_period_id = ev.evaluation_period_id
      WHERE 
        ((
          ev.creation_user IS NOT NULL
          AND
          (
            ev.date_evaluation_end IS NOT NULL
            AND CURRENT_DATE + :day = TO_DATE(ev.date_evaluation_end, 'YYYY/MM/DD')
          ) OR
          (
            ev.date_evaluation_end IS NULL
            AND
            (
              ev.level <= 7
	            AND CURRENT_DATE + :day = TO_DATE(ep.date_evaluation_end, 'YYYY/MM/DD')
            ) OR
            (
              ev.level > 7 AND ev.level <= 10
	            AND CURRENT_DATE + :day = TO_DATE(ep.date_evaluation_department_end, 'YYYY/MM/DD')
            )
          )
        )
        OR
        (
          ev.creation_user IS NULL
          AND 
          (
            (
            ev.level <= 7
            AND CURRENT_DATE + :day = TO_DATE(ep.date_evaluation_end, 'YYYY/MM/DD')
          )
          OR
          (
            ev.level > 7 AND ev.level <= 10
            AND CURRENT_DATE + :day = TO_DATE(ep.date_evaluation_department_end, 'YYYY/MM/DD')
          )
          )
        ))
        AND ev.status > 49 AND ev.status < 98
        AND us.active = 1
        AND ev.company_group_code = :companyGroupCode
    `,
      {
        replacements: {
          day: day,
          companyGroupCode: companyGroupCode,
        },
      },
    );

    return datas;
  }

  async getPeriodDetail(year: any, periodIndex: any, companyGroupCode: string) {
    const currentPeriod = await this.evaluationPeriodEntity.findOne({
      where: {
        year: year,
        periodIndex: periodIndex,
        companyGroupCode: companyGroupCode,
      },
    });
    return currentPeriod;
  }

  async goalsPastEvaluationRepo(
    type: number,
    year: number,
    periodIndex: number,
    userId: number,
    evaluationPeriodId: number,
  ) {
    return await this.evaluationPeriodEntity.sequelize.query(
      `
          SELECT pg.id,pg.title as title, pg.achievement_value as "achievementValue",
          pg.method as method, pg.weight as weight, pg.difficulty_user as difficulty,
          COALESCE(
          json_agg(json_build_object(
            'evaluationDecision', pgSub.evaluation_decision,
            'degree', pgSub.degree,
            'achievementId', pgSub.achievement_personal_id,
            'point', pgSub.coefficient
          ) ORDER BY pgSub.id ASC) FILTER (where pgSub.id IS NOT NULL)
          ) as "evaluationAchievementPersonalSub",
        CASE 
          WHEN eval.creation_user IS NOT NULL 
            THEN evaluation_period_tbl.period_start || ' ~ ' || evaluation_period_tbl.period_end
          ELSE 
            eval.period_start || ' ~ ' || eval.period_end
        END AS period,
          case when eval.level <= 7 then eval.department_name ELSE eval.division_name END as "departmentName"
          FROM evaluation_achievement_personal_tbl as pg
            INNER JOIN evaluation_achievement_personal_sub_tbl as pgSub ON pgSub.achievement_personal_id = pg.id
            INNER JOIN evaluation_tbl as eval ON eval.id = pg.evaluation_id
            INNER JOIN evaluation_period_tbl ON evaluation_period_tbl.id = eval.evaluation_period_id
            WHERE evaluation_period_tbl.year = :year 
            AND evaluation_period_tbl.period_index = :periodIndex 
            AND eval.user_id = :userId 
            AND eval.evaluation_period_id < :evaluationPeriodId
            AND pg.type = :type
          GROUP BY pg.title,
          pg.achievement_value, pg.method,
          pg.weight, pg.difficulty_user,
          pg.id, period, 
         "departmentName", eval.creation_user,
         evaluation_period_tbl.period_start, eval.period_start
         ORDER BY 
        CASE
            WHEN eval.creation_user IS NOT NULL 
                THEN evaluation_period_tbl.period_start -- Sắp xếp theo ngày bắt đầu của kỳ đánh giá
            ELSE 
                eval.period_start -- Hoặc theo ngày bắt đầu tùy chỉnh
        END DESC; -- Sắp xếp GIẢM DẦN (DESC) để hiển thị thời gian mới nhất trước
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          type: Number(type),
          year: year,
          userId: userId,
          periodIndex: periodIndex,
          evaluationPeriodId: evaluationPeriodId,
        },
      },
    );
  }
}
