/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable default-case */
/* eslint-disable complexity */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Op, QueryTypes, Transaction } from 'sequelize';
import EntityConstant from 'src/constant/EntityConstant';
import { Company } from 'src/entity/Company';
import { Department } from 'src/entity/Department';
import { Evaluation } from 'src/entity/Evaluation';
import { EvaluationPeriod } from 'src/entity/EvaluationPeriod';
import { Evaluator } from 'src/entity/Evaluator';
import { Role } from 'src/entity/Role';
import { User } from 'src/entity/User';
import {
  AchievementAdditionalType,
  AchievementType,
  BasicBehaviorType,
  EvaluationQuery,
  UserEvaluationAchievementType,
  UserEvaluationBasicBehaviorType,
  UserEvaluationToProSkillType,
} from 'src/interfaces/user.interfaces';
import { UserRepositoryI } from 'src/interfaces/repository/user.repository.interface';
import { SettingLevel } from 'src/entity/SettingLevel';
import { EvaluationBasicBehavior } from 'src/entity/EvaluationBasicBehavior';
import { EvaluationPro } from 'src/entity/EvaluationPro';
import { ListProSkill } from 'src/entity/ListProSkill';
import { VersionProSkill } from 'src/entity/VersionProSkill';
import { VersionBasicBehavior } from 'src/entity/VersionBasicBehavior';
import { ListBasicBehavior } from 'src/entity/ListBasicBehavior';
import { EvaluationAchievementPersonal } from 'src/entity/EvaluationAchievementPersonal';
import { SettingAchievementPersonal } from 'src/entity/SettingAchievementPersonal';
import { VersionSetting } from 'src/entity/VersionSetting';
import { Permission } from 'src/entity/Permission';
import { EvaluationAchievementAdditional } from 'src/entity/EvaluationAchievementAdditional';
import { SettingAchievementAdditional } from 'src/entity/SettingAchievementAdditional';
import {
  findDeletedIdsSkill,
  getListPeriods,
  isFloat,
  isFormatDate,
} from 'src/common/util';
import { SettingProFormula } from 'src/entity/SettingProFormula';
import { SettingProFormulaSub } from 'src/entity/SettingProFormulaSub';
import { EvaluatorDefault } from 'src/entity/EvaluatorDefault';
import { Sequelize } from 'sequelize-typescript';
import { Roles } from 'src/enum/Roles';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { EvaluationAchievementPersonalSub } from 'src/entity/EvaluationAchievementPersonalSub';
import { HistoryApproveEvaluation } from 'src/entity/HistoryApproveEvaluation';
import { Skill } from 'src/entity/Skill';
import { SkillGroup } from 'src/entity/SkillGroup';
import { SkillRole } from 'src/entity/SkillRole';
import { EvaluationPeriodHelper } from 'src/common/datetime/EvaluationPeriodHelper';
import { SkillUser } from 'src/entity/SkillUser';
import { SummaryDepartment } from 'src/entity/SummaryDepartment';
import { CompanyGroup } from '../entity/CompanyGroup';
import { SettingDefaultPeriod } from 'src/entity/SettingDefaultPeriod';
import { SettingReview } from 'src/entity/SettingReview';
import { HistoryPublicProSkill } from 'src/entity/HistoryPublicProSkill';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const moment = require('moment');
// moment.tz.setDefault('Asia/Tokyo');
import * as moment from 'moment';

@Injectable()
export class UserRepository implements UserRepositoryI {
  getVersionSrtting() {
    throw new Error('Method not implemented.');
  }

  @Inject(EntityConstant.USER)
  private userEntity: typeof User;

  @Inject(EntityConstant.EVALUATION_PERIOD)
  private evaluationPeriodEntity: typeof EvaluationPeriod;

  @Inject(EntityConstant.EVALUATION)
  private evaluationEntity: typeof Evaluation;

  @Inject(EntityConstant.SETTING_LEVEL)
  private settingLevelEntity: typeof SettingLevel;

  @Inject(EntityConstant.EVALUATION_PRO)
  private evaluationProEntity: typeof EvaluationPro;

  @Inject(EntityConstant.LIST_BASIC_BEHAVIOR)
  private listBasicBehaviorEntity: typeof ListBasicBehavior;

  @Inject(EntityConstant.LIST_PRO_SKILL)
  private listProSkillEntity: typeof ListProSkill;

  @Inject(EntityConstant.SETTING_ACHIEVEMENT_PERSONAL)
  private settingAchievementPersonalEntity: typeof SettingAchievementPersonal;

  @Inject(EntityConstant.EVALUATION_ACHIEVEMENT_PERSONAL)
  private evaluationAchievementPersonal: typeof EvaluationAchievementPersonal;

  @Inject(EntityConstant.EVALUATION_ACHIEVEMENT_PERSONAL_SUB)
  private evaluationAchievementPersonalSub: typeof EvaluationAchievementPersonalSub;

  @Inject(EntityConstant.EVALUATION_BASIC_BEHAVIOR)
  private evaluationBasicBehaviorEntity: typeof EvaluationBasicBehavior;

  @Inject(EntityConstant.SETTING_ACHIEVEMENT_ADDITIONAL)
  private settingAchievementAdditionalEntity: typeof SettingAchievementAdditional;

  @Inject(EntityConstant.EVALUATION_ACHIEVEMENT_ADDITIONAL)
  private evaluationAchievementAdditionalEntity: typeof EvaluationAchievementAdditional;

  @Inject(EntityConstant.PERMISSION)
  private permission: typeof Permission;

  @Inject(EntityConstant.SETTING_PRO_FORMULA_SUB)
  private settingProFormulaSubEntity: typeof SettingProFormulaSub;

  @Inject(EntityConstant.EVALUATOR)
  private evaluatorEntity: typeof Evaluator;

  @Inject(EntityConstant.EVALUATOR_DEFAULT)
  private evaluatorDefaultEntity: typeof EvaluatorDefault;

  @Inject(EntityConstant.VERSION_PRO_SKILL)
  private versionProSkillEntity: typeof VersionProSkill;

  @Inject(EntityConstant.SKILL_ROLE)
  private skillRole: typeof SkillRole;

  @Inject(EntityConstant.SKILL_GROUP)
  private skillGroupEntity: typeof SkillGroup;

  @Inject(EntityConstant.SKILL_USER_ENTITY)
  private skillUserEntity: typeof SkillUser;

  @Inject(EntityConstant.SKILL)
  private skillEntity: typeof Skill;

  @Inject(EntityConstant.SETTING_DEFAULT_PERIOD_VIEWING)
  private settingDefaultPeriodEnity: typeof SettingDefaultPeriod;

  @Inject(EntityConstant.SETTING_REVIEW)
  private settingReviewEnity: typeof SettingReview;

  @Inject(EntityConstant.EVALUATOR_DEFAULT)
  private evaluatorDefault: typeof EvaluatorDefault;

  @Inject(EntityConstant.SKILL_USER_ENTITY)
  private skillUser: typeof SkillUser;

  async getUserByEmail(email: string, companyGroupCode: string) {
    const condition = { email: email, active: 1 };
    if (companyGroupCode) {
      condition['companyGroupCode'] = companyGroupCode;
    }
    return await this.userEntity.findOne({
      where: condition,
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] },
        },
        { model: Department, as: 'department' },
        { model: Company, as: 'company' },
        { model: CompanyGroup },
      ],
    });
  }

  async getUsersWithCompanyGroup(email: string): Promise<User[]> {
    return await this.userEntity.findAll({
      where: { email, active: 1 },
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['id'],
          through: { attributes: [] },
        },
        { model: Department, as: 'department' },
        { model: Company, as: 'company' },
        { model: CompanyGroup },
      ],
    });
  }

  async getUserActive(id: number) {
    return await this.userEntity.findOne({
      where: { id, active: 1 },
    });
  }

  async getEvaluationPeriod(
    query: EvaluationQuery,
    userId: number,
    companyGroupCode: string,
  ) {
    const evaluations = await this.evaluationPeriodEntity.findAll({
      attributes: [
        'id',
        'year',
        'periodIndex',
        'periodStart',
        'periodEnd',
        'dateEvaluationStart',
        'dateEvaluationEnd',
        'dateEvaluationDepartmentStart',
        'dateEvaluationDepartmentEnd',
      ],
      where: {
        year: {
          [Op.between]: [query.yearStart, query.yearEnd],
        },
        companyGroupCode: companyGroupCode,
      },
      include: [
        {
          model: Evaluation,
          as: 'evaluations',
          attributes: [
            'id',
            'departmentName',
            'divisionName',
            'companyName',
            'title',
            'periodStart',
            'periodEnd',
            'status',
            'level',
            'summaryPointEvaluator2',
            'percentPoint',
            'userId',
            'creationUser',
            'dateCreationGoalStart',
            'dateCreationGoalEnd',
            'dateEvaluationStart',
            'dateEvaluationEnd',
            'companyGroupCode',
          ],
          where: {
            [Op.and]: [
              {
                userId: userId || 0,
              },
              {
                companyGroupCode: companyGroupCode,
              },
            ],
          },

          include: [
            {
              model: Evaluator,
              as: 'evaluator',
              attributes: ['evaluatorId', 'evaluationOrder'],
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['fullName', 'id'],
                },
              ],
            },
            {
              model: User,
              as: 'user',
              attributes: ['id', 'fullName', 'employeeNumber'],
              include: [
                {
                  model: Department,
                  as: 'department',
                  attributes: ['code', 'name', 'type', 'class', 'active'],
                },
              ],
            },

            {
              model: SummaryDepartment,
              as: 'summaryDepartment',
            },
          ],
        },
        {
          model: EvaluatorDefault,
          as: 'evaluatorDefault',
          required: false,
          where: {
            userId: userId || 0,
          },
        },
      ],
      order: [
        ['year', 'DESC'],
        ['periodIndex', 'DESC'],
        [query.sortBy, query.sortType],
        [{ model: Evaluation, as: 'evaluations' }, 'periodStart', 'DESC'],
      ],
      offset: query.offset,
      limit: query.limit,
    });

    return evaluations;
  }

  async evaluationSkillCheck(evaluationId: number) {
    return await this.evaluationEntity.findOne({
      attributes: ['flagSkill'],
      where: { id: evaluationId },
    });
  }

  async getEvaluationById(
    id: number,
    userId: any,
    isEvaluatorUser: boolean,
  ): Promise<{
    evaluationDetail: Evaluation;
    evaluationAchievementPersonals: any;
  }> {
    //
    const userCondition = isEvaluatorUser
      ? { userId }
      : { userId: { [Op.not]: null } };

    const evaluationDetail = await this.evaluationEntity.findOne({
      attributes: [
        'id',
        'title',
        'periodStart',
        'periodEnd',
        'departmentName',
        'status',
        'level',

        'basicTotalPointUser',
        'proTotalPointUser',
        'behaviorTotalPointUser',
        'achievementAdditionalTotalPointUser',
        'achievementPersonalTotalPointUser',

        'basicTotalPointEvaluator05',
        'proTotalPointEvaluator05',
        'behaviorTotalPointEvaluator05',
        'achievementAdditionalTotalPointEvaluator05',
        'achievementPersonalTotalPointEvaluator05',

        'basicTotalPointEvaluator1',
        'proTotalPointEvaluator1',
        'behaviorTotalPointEvaluator1',
        'achievementAdditionalTotalPointEvaluator1',
        'achievementPersonalTotalPointEvaluator1',

        'basicTotalPointEvaluator2',
        'proTotalPointEvaluator2',
        'behaviorTotalPointEvaluator2',
        'achievementAdditionalTotalPointEvaluator2',
        'achievementPersonalTotalPointEvaluator2',

        'skillPercent',
        'behaviorPercent',
        'achievementPercent',
        'percentPoint',

        'guideVersionId',

        'dateCreationGoalStart',
        'dateCreationGoalEnd',
        'dateEvaluationStart',
        'dateEvaluationEnd',

        // ** Comment user
        'commentUser',
        'updatedTime',

        'basicProTotalPointUser',
        'basicProTotalPointEvaluator05',
        'basicProTotalPointEvaluator1',
        'basicProTotalPointEvaluator2',

        'summaryPointUser',
        'summaryPointEvaluator05',
        'summaryPointEvaluator1',
        'summaryPointEvaluator2',
        // ** Flag Skill
        'flagSkill',

        'evaluationPeriodId',
      ],
      where: { id, ...userCondition },
      include: [
        {
          model: EvaluationPeriod,
          as: 'evaluationPeriod',
          attributes: [
            'dateCreationGoalStart',
            'dateCreationGoalEnd',
            'dateEvaluationStart',
            'dateEvaluationEnd',
          ],
        },
        {
          model: Evaluator,
          as: 'evaluator',
          include: [{ model: User, as: 'user', attributes: ['fullName'] }],
        },
        {
          model: EvaluationBasicBehavior,
          as: 'evaluationBasicBehavior',
          separate: true,
          order: [['itemNo', 'ASC']],
        },
        {
          model: EvaluationPro,
          as: 'evaluationPro',
          attributes: [
            'jobType',
            'itemNo',
            'itemId',
            'itemTitle',
            'content',
            'difficulty',
            'pointUser',
            'pointEvaluator05',
            'pointEvaluator1',
            'pointEvaluator2',
            'totalPointUser',
            'totalPointEvaluator05',
            'totalPointEvaluator1',
            'totalPointEvaluator2',
            'note',
          ],
          separate: true,
          order: [['itemNo', 'ASC']],
        },
        {
          model: EvaluationAchievementPersonal,
          as: 'evaluationAchievementPersonals',
          attributes: [
            'id',
            'itemNo',
            'title',
            'achievementValue',
            'method',
            'weight',
            'difficultyUser',
            'difficultyEvaluator05',
            'difficultyEvaluator1',
            'difficultyEvaluator2',
            'achievementStatus',
            'reasonComment',
            'actionPlan',
            'pointUser',
            'coefficientUser',
            'pointEvaluator05',
            'coefficientEvaluator05',
            'pointEvaluator1',
            'coefficientEvaluator1',
            'pointEvaluator2',
            'coefficientEvaluator2',
          ],
          include: [
            {
              subQuery: true,
              model: EvaluationAchievementPersonalSub,
              as: 'evaluationAchievementPersonalSub',
            },
          ],
        },
        {
          model: EvaluationAchievementAdditional,
          as: 'evaluationAchievementAdditional',
          attributes: [
            'itemNo',
            'titleAdditional',
            'achievementStatus',
            'reasonComment',
            'pointUser',
            'pointEvaluator05',
            'pointEvaluator1',
            'pointEvaluator2',
            'evaluationOrder',
          ],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'active', 'employeeNumber'],
          include: [
            {
              model: Department,
              as: 'department',
              attributes: ['name', 'code'],
            },
          ],
        },

        {
          model: HistoryApproveEvaluation,
          as: 'historyApproveEvaluations',
          where: { status: { [Op.ne]: '承認' } },
          separate: true,
          order: [['id', 'DESC']],
          limit: 1,
        },
      ],
    });

    const evaluationAchievementPersonals =
      await this.evaluationAchievementPersonal
        .findAll({
          attributes: [
            'id',
            'itemNo',
            'title',
            'achievementValue',
            'method',
            'weight',
            'difficultyUser',
            'difficultyEvaluator05',
            'difficultyEvaluator1',
            'difficultyEvaluator2',
            'achievementStatus',
            'reasonComment',
            'actionPlan',
            'pointUser',
            'coefficientUser',
            'pointEvaluator05',
            'coefficientEvaluator05',
            'pointEvaluator1',
            'coefficientEvaluator1',
            'pointEvaluator2',
            'coefficientEvaluator2',
            'type',
          ],
          where: { evaluationId: id },
          include: [
            {
              model: EvaluationAchievementPersonalSub,
              as: 'evaluationAchievementPersonalSub',
              attributes: ['coefficient', 'evaluationDecision', 'degree'],
            },
          ],
          order: [
            ['itemNo', 'ASC'],
            [
              {
                model: EvaluationAchievementPersonalSub,
                as: 'evaluationAchievementPersonalSub',
              },
              'coefficient',
              'DESC',
            ],
          ],
        })
        .then((achievements) => {
          return achievements.map((v, i) => ({
            key: `achievements-key-${v.id}`,
            itemNo: v.itemNo,
            title: v.title,
            achievementValue: v.achievementValue,
            method: v.method,
            weight: v.weight,
            difficultyUser: v.difficultyUser,
            difficultyEvaluator05: v.difficultyEvaluator05,
            difficultyEvaluator1: v.difficultyEvaluator1,
            difficultyEvaluator2: v.difficultyEvaluator2,
            achievementStatus: v.achievementStatus,
            reasonComment: v.reasonComment,
            actionPlan: v.actionPlan,
            pointUser: v.pointUser,
            coefficientUser: v.coefficientUser,
            pointEvaluator05: v.pointEvaluator05,
            coefficientEvaluator05: v.coefficientEvaluator05,
            pointEvaluator1: v.pointEvaluator1,
            coefficientEvaluator1: v.coefficientEvaluator1,
            pointEvaluator2: v.pointEvaluator2,
            coefficientEvaluator2: v.coefficientEvaluator2,
            childrens: v.evaluationAchievementPersonalSub.map((e, i2) => ({
              index: i,
              note: e.evaluationDecision,
              point: Number(e.coefficient)?.toFixed(1),
              key: `evaluation-achievement-${v.id}-${i}-${i2}`,
              degree: e.degree,
            })),
          }));
        });
    return { evaluationDetail, evaluationAchievementPersonals };
  }

  async getEvaluationById2(
    id: number,
    userId: any,
    isEvaluatorUser: boolean,
    companyGroupCode: string | null,
  ): Promise<{
    evaluationDetail: Evaluation;
    evaluationAchievementPersonals: any;
  }> {
    //

    const evaluationDetail: any = await this.evaluationEntity.sequelize.query(
      `select "Evaluation"."id",
                    "Evaluation"."title",
                    "Evaluation"."period_start"                                     as "periodStart",
                    "Evaluation"."period_end"                                       as "periodEnd",
                    "Evaluation"."department_name"                                  as "departmentName",
                    "Evaluation"."status",
                    "Evaluation"."level",
                    "Evaluation"."basic_total_point_user"                           as "basicTotalPointUser",
                    "Evaluation"."pro_total_point_user"                             as "proTotalPointUser",
                    "Evaluation"."behavior_total_point_user"                        as "behaviorTotalPointUser",
                    "Evaluation"."achievement_additional_total_point_user"          as "achievementAdditionalTotalPointUser",
                    "Evaluation"."achievement_personal_total_point_user"            as "achievementPersonalTotalPointUser",
                    "Evaluation"."basic_total_point_evaluator_0_5"                  as "basicTotalPointEvaluator05",
                    "Evaluation"."pro_total_point_evaluator_0_5"                    as "proTotalPointEvaluator05",
                    "Evaluation"."behavior_total_point_evaluator_0_5"               as "behaviorTotalPointEvaluator05",
                    "Evaluation"."achievement_additional_total_point_evaluator_0_5" as "achievementAdditionalTotalPointEvaluator05",
                    "Evaluation"."achievement_personal_total_point_evaluator_0_5"   as "achievementPersonalTotalPointEvaluator05",
                    "Evaluation"."basic_total_point_evaluator_1"                    as "basicTotalPointEvaluator1",
                    "Evaluation"."pro_total_point_evaluator_1"                      as "proTotalPointEvaluator1",
                    "Evaluation"."behavior_total_point_evaluator_1"                 as "behaviorTotalPointEvaluator1",
                    "Evaluation"."achievement_additional_total_point_evaluator_1"   as "achievementAdditionalTotalPointEvaluator1",
                    "Evaluation"."achievement_personal_total_point_evaluator_1"     as "achievementPersonalTotalPointEvaluator1",
                    "Evaluation"."basic_total_point_evaluator_2"                    as "basicTotalPointEvaluator2",
                    "Evaluation"."pro_total_point_evaluator_2"                      as "proTotalPointEvaluator2",
                    "Evaluation"."behavior_total_point_evaluator_2"                 as "behaviorTotalPointEvaluator2",
                    "Evaluation"."achievement_additional_total_point_evaluator_2"   as "achievementAdditionalTotalPointEvaluator2",
                    "Evaluation"."achievement_personal_total_point_evaluator_2"     as "achievementPersonalTotalPointEvaluator2",
                    "Evaluation"."skill_percent"                                    as "skillPercent",
                    "Evaluation"."behavior_percent"                                 as "behaviorPercent",
                    "Evaluation"."achievement_percent"                              as "achievementPercent",
                    "Evaluation"."percent_point"                                    as "percentPoint",
                    "Evaluation"."guide_version_id"                                 as "guideVersionId",
                    "Evaluation"."date_creation_goal_start"                         as "dateCreationGoalStart",
                    "Evaluation"."date_creation_goal_end"                           as "dateCreationGoalEnd",
                    "Evaluation"."date_evaluation_start"                            as "dateEvaluationStart",
                    "Evaluation"."date_evaluation_end"                              as "dateEvaluationEnd",
                    "Evaluation"."comment_user"                                     as "commentUser",
                    "Evaluation"."updated_time"                                     as "updatedTime",
                    "Evaluation"."basic_pro_total_point_user"                       as "basicProTotalPointUser",
                    "Evaluation"."basic_pro_total_point_evaluator_0_5"              as "basicProTotalPointEvaluator05",
                    "Evaluation"."basic_pro_total_point_evaluator_1"                as "basicProTotalPointEvaluator1",
                    "Evaluation"."basic_pro_total_point_evaluator_2"                as "basicProTotalPointEvaluator2",
                    "Evaluation"."summary_point_user"                               as "summaryPointUser",
                    "Evaluation"."summary_point_evaluator_0_5"                      as "summaryPointEvaluator05",
                    "Evaluation"."summary_point_evaluator_1"                        as "summaryPointEvaluator1",
                    "Evaluation"."summary_point_evaluator_2"                        as "summaryPointEvaluator2",
                    "Evaluation"."flag_skill"                                       as "flagSkill",
                    "Evaluation"."evaluation_period_id"                             as "evaluationPeriodId",
                    "evaluationPeriod"."id"                                         as "evaluationPeriod.id",
                    "evaluationPeriod"."date_creation_goal_start"                   as "evaluationPeriod.dateCreationGoalStart",
                    "evaluationPeriod"."date_creation_goal_end"                     as "evaluationPeriod.dateCreationGoalEnd",
                    "evaluationPeriod"."date_evaluation_start"                      as "evaluationPeriod.dateEvaluationStart",
                    "evaluationPeriod"."date_evaluation_end"                        as "evaluationPeriod.dateEvaluationEnd",

                    (select coalesce(jsonb_agg(row_to_json(t)), '[]')
                     from (select evaluation_id    "evaluatorId",
                                  evaluation_order "evaluationOrder",
                                  comment_public   "commentPublic",
                                  comment_private  "commentPrivate",
                                  et.created_time  "createdTime",
                                  et.updated_time  "updatedTime",
                                  jsonb_build_object('id', ut.id, 'fullName', ut.full_name) user
                           from
                               evaluator_tbl et inner join user_tbl ut
                           on ut.id= et.evaluator_id
                           where
                               et.evaluation_id = "Evaluation"."id"
                           order by
                               evaluation_order asc) t)                             as "evaluator",
                    (select coalesce(jsonb_agg(row_to_json(t)), '[]')
                     from (select concat('achievements-key-',
                                         id)                               as "key",
                                  eapt.id                                  as "id",
                                  item_no                                  as "itemNo",
                                  title,
                                  achievement_value                        as "achievementValue",
                                  method,
                                  weight,
                                  to_char(difficulty_user, '0.9')          as "difficultyUser",
                                  to_char(difficulty_evaluator_0_5, '0.9') as "difficultyEvaluator05",
                                  to_char(difficulty_evaluator_1, '0.9')   as "difficultyEvaluator1",
                                  to_char(difficulty_evaluator_2, '0.9')   as "difficultyEvaluator2",
                                  achievement_status                       as "achievementStatus",
                                  reason_comment                           as "reasonComment",
                                  action_plan                              as "actionPlan",
                                  point_user                               as "pointUser",
                                  coefficient_user                         as "coefficientUser",
                                  point_evaluator_0_5                      as "pointEvaluator05",
                                  coefficient_evaluator_0_5                as "coefficientEvaluator05",
                                  point_evaluator_1                        as "pointEvaluator1",
                                  coefficient_evaluator_1                  as "coefficientEvaluator1",
                                  point_evaluator_2                        as "pointEvaluator2",
                                  coefficient_evaluator_2                  as "coefficientEvaluator2",
                                  (select coalesce(jsonb_agg(row_to_json(t1)), '[]')
                                   from (select id,
                                                row_number()                over (
				order by
					coefficient desc
  ) as "index" , concat('evaluation-achievement-',
                        id) "key",
                                                achievement_personal_id     "achievementPersonalId",
                                                to_char(coefficient, '0.9') "coefficient",
                                                evaluation_decision         "evaluationDecision",
                                                evaluation_decision         "note",
                                                created_time                "createdTime",
                                                updated_time                "updatedTime",
                                                degree
                                         from evaluation_achievement_personal_sub_tbl eapst2
                                         where eapst2.achievement_personal_id = eapt.id
                                           and eapt.type = 1
                                         order by coefficient desc) t1)    as "evaluationAchievementPersonalSub"
                           from evaluation_achievement_personal_tbl eapt
                           where evaluation_id = "Evaluation"."id"
                           order by item_no asc) t)                                 as "evaluationAchievementPersonals",
                    (select coalesce(jsonb_agg(row_to_json(t)), '[]')
                     from (select type,
                                  evaluation_id       as "evaluationId",
                                  item_no             as "itemNo",
                                  title_additional    as "titleAdditional",
                                  achievement_status  as "achievementStatus",
                                  reason_comment      as "reasonComment",
                                  point_user          as "pointUser",
                                  point_evaluator_0_5 as "pointEvaluator05",
                                  point_evaluator_1   as "pointEvaluator1",
                                  point_evaluator_2   as "pointEvaluator2",
                                  evaluation_order    as "evaluationOrder"
                           from evaluation_achievement_additional_tbl eaat
                           where eaat.evaluation_id = "Evaluation"."id") t)         as "evaluationAchievementAdditional",
                    "user"."id"                                                     as "user.id",
                    "user"."full_name"                                              as "user.fullName",
                    "user"."active"                                                 as "user.active",
                    "user"."employee_number"                                        as
                                                                                       "user.employeeNumber",
                    "user->department"."id"                                         as "user.department.id",
                    "user->department"."name"                                       as "user.department.name",
                    "user->department"."code"                                       as "user.department.code",
                    (select coalesce(jsonb_agg(row_to_json(t)), '[]')
                     from (select job_type                                 "jobType",
                                  item_no                                  "itemNo",
                                  item_id                                  "itemId",
                                  item_title                               "itemTitle",
                                  concat('evaluation-pro-skill-', item_id) "key",
                                  content,
                                  difficulty,
                                  point_user                               "pointUser",
                                  point_evaluator_0_5                      "pointEvaluator05",
                                  point_evaluator_1                        "pointEvaluator1",
                                  point_evaluator_2                        "pointEvaluator2",
                                  total_point_user                         "totalPointUser",
                                  total_point_evaluator_0_5                "totalPointEvaluator05",
                                  total_point_evaluator_1                  "totalPointEvaluator1",
                                  total_point_evaluator_2                  "totalPointEvaluator2",
                                  note, 
                                  is_disable                               "isDisable"
                           from evaluation_pro_tbl ept
                           where ept.evaluation_id = "Evaluation"."id"
                           order by item_no asc) t)                                 as "evaluationPro",
                    (select coalesce(jsonb_agg(row_to_json(t)), '[]')
                     from (select evaluation_id                   "evaluationId",
                                  concat('basic-1-key-', item_no) "key",
                                  item_no                         "itemNo",
                                  type,
                                  item_title                      "title",
                                  content,
                                  difficulty,
                                  point_user                      "pointUser",
                                  point_evaluator_0_5             "pointEvaluator05",
                                  point_evaluator_1               "pointEvaluator1",
                                  point_evaluator_2               "pointEvaluator2",
                                  created_time                    "createdTime",
                                  updated_time                    "updatedTime"
                           from evaluation_basic_behavior_tbl ebbt
                           where ebbt.evaluation_id = "Evaluation"."id"
                             and type = 1
                           order by item_no asc) t)                                 as "evaluationBasic",

                    (select coalesce(jsonb_agg(row_to_json(t)), '[]')
                     from (select evaluation_id                      "evaluationId",
                                  concat('behavior-1-key-', item_no) "key",
                                  item_no                            "itemNo",
                                  type,
                                  item_title                         "title",
                                  content,
                                  difficulty,
                                  point_user                         "pointUser",
                                  point_evaluator_0_5                "pointEvaluator05",
                                  point_evaluator_1                  "pointEvaluator1",
                                  point_evaluator_2                  "pointEvaluator2",
                                  created_time                       "createdTime",
                                  updated_time                       "updatedTime"
                           from evaluation_basic_behavior_tbl ebbt
                           where ebbt.evaluation_id = "Evaluation"."id"
                             and type = 2
                           order by item_no asc) t)                                 as "evaluationBehavior",
                    (select row_to_json(t)
                     from (select id,
                                  evaluation_id  "evaluationId",
                                  "comment",
                                  approver_id    "approverId",
                                  receiver_id    "receiverId",
                                  receiver_order "receiverOrder",
                                  type,
                                  status,
                                  created_time   "createdTime",
                                  updated_time   "updatedTime"
                           from history_approve_evaluation_tbl haet
                           where haet.evaluation_id = "Evaluation"."id"
                             and status <> '承認'
                           order by id desc limit 1) t)                             as "historyApproveEvaluations",
                    case
                        when :isEvaluatorUser = false then (select evaluation_order
                                                            from evaluator_tbl et
                                                            where et.evaluation_id = "Evaluation"."id"
                                                              and evaluator_id = :userId)
                        else 0
                        end                                                         as "evaluatorOrder"
             from evaluation_tbl "Evaluation"
                      left outer join "evaluation_period_tbl" as "evaluationPeriod" on
                 "Evaluation"."evaluation_period_id" = "evaluationPeriod"."id"

                      left outer join "user_tbl" as "user" on
                 "Evaluation"."user_id" =
                 "user"."id"
                      left outer join "department_tbl" as "user->department" on
                 "user"."department_id" = "user->department"."id"
             where "Evaluation"."id" = :id
               and case
                       when :isEvaluatorUser = true then "Evaluation"."user_id" = :userId
                       else "Evaluation"."user_id" is not null
                 end
             group by "Evaluation"."id",
                      "Evaluation"."title",
                      "Evaluation"."period_start",
                      "Evaluation"."period_end",
                      "Evaluation"."department_name",
                      "Evaluation"."status",
                      "Evaluation"."level",
                      "Evaluation"."basic_total_point_user",
                      "Evaluation"."pro_total_point_user",
                      "Evaluation"."behavior_total_point_user",
                      "Evaluation"."achievement_additional_total_point_user",
                      "Evaluation"."achievement_personal_total_point_user",
                      "Evaluation"."basic_total_point_evaluator_0_5",
                      "Evaluation"."pro_total_point_evaluator_0_5",
                      "Evaluation"."behavior_total_point_evaluator_0_5",
                      "Evaluation"."achievement_additional_total_point_evaluator_0_5",
                      "Evaluation"."achievement_personal_total_point_evaluator_0_5",
                      "Evaluation"."basic_total_point_evaluator_1",
                      "Evaluation"."pro_total_point_evaluator_1",
                      "Evaluation"."behavior_total_point_evaluator_1",
                      "Evaluation"."achievement_additional_total_point_evaluator_1",
                      "Evaluation"."achievement_personal_total_point_evaluator_1",
                      "Evaluation"."basic_total_point_evaluator_2",
                      "Evaluation"."pro_total_point_evaluator_2",
                      "Evaluation"."behavior_total_point_evaluator_2",
                      "Evaluation"."achievement_additional_total_point_evaluator_2",
                      "Evaluation"."achievement_personal_total_point_evaluator_2",
                      "Evaluation"."skill_percent",
                      "Evaluation"."behavior_percent",
                      "Evaluation"."achievement_percent",
                      "Evaluation"."percent_point",
                      "Evaluation"."guide_version_id",
                      "Evaluation"."date_creation_goal_start",
                      "Evaluation"."date_creation_goal_end",
                      "Evaluation"."date_evaluation_start",
                      "Evaluation"."date_evaluation_end",
                      "Evaluation"."comment_user",
                      "Evaluation"."updated_time",
                      "Evaluation"."basic_pro_total_point_user",
                      "Evaluation"."basic_pro_total_point_evaluator_0_5",
                      "Evaluation"."basic_pro_total_point_evaluator_1",
                      "Evaluation"."basic_pro_total_point_evaluator_2",
                      "Evaluation"."summary_point_user",
                      "Evaluation"."summary_point_evaluator_0_5",
                      "Evaluation"."summary_point_evaluator_1",
                      "Evaluation"."summary_point_evaluator_2",
                      "Evaluation"."flag_skill",
                      "Evaluation"."evaluation_period_id",
                      "evaluationPeriod"."id",
                      "evaluationPeriod"."date_creation_goal_start",
                      "evaluationPeriod"."date_creation_goal_end",
                      "evaluationPeriod"."date_evaluation_start",
                      "evaluationPeriod"."date_evaluation_end",
                      "user"."id",
                      "user"."full_name",
                      "user"."active",
                      "user"."employee_number",
                      "user->department"."id",
                      "user->department"."name",
                      "user->department"."code"
            `,
      {
        nest: true,
        replacements: {
          id: id,
          userId: userId,
          isEvaluatorUser: isEvaluatorUser,
        },
      },
    );

    const evaluationAchievementPersonals =
      evaluationDetail[0]?.evaluationAchievementPersonals?.map((v, i) => ({
        ...v,
        childrens: v?.evaluationAchievementPersonalSub?.map((e, i2) => ({
          index: i,
          note: e.evaluationDecision,
          point: Number(e.coefficient)?.toFixed(1),
          key: `evaluation-achievement-${v.id}-${i}-${i2}`,
          degree: e.degree,
        })),
      }));

    return {
      evaluationDetail: evaluationDetail[0],
      evaluationAchievementPersonals,
    };
  }

  async getEvaluationByIdV2(
    id: number,
    userId: any,
    isEvaluatorUser: boolean,
    companyGroupCode: string | null,
  ): Promise<any> {
    const evaluationDetail = (await this.evaluationEntity.sequelize.query(
      `WITH historyApprove AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY h.evaluation_id order by h.id DESC) as rn
                                     from history_approve_evaluation_tbl h
                                     where h.status
                 != '承認'
                 )
                , evaluators AS (
             SELECT ev.evaluator_id, ev.evaluation_id
             FROM evaluator_tbl ev
             where ev.evaluation_id = :id
                 )
            select e.id,
                   e.title,
                   e.period_start                                                                                 as "periodStart",
                   e.period_end                                                                                   as "periodEnd",
                   e.department_name                                                                              as "departmentName",
                   e.status,
                   e.level,

                   e.basic_total_point_user                                                                       as "basicTotalpointUser",
                   e.pro_total_point_user                                                                         as "proTotalPointUser",
                   e.behavior_total_point_user                                                                    as "behaviorTotalPointUser",
                   e.achievement_additional_total_point_user                                                      as "achievementAdditionalTotalPointUser",
                   e.achievement_personal_total_point_user                                                        as "achievementPersonalTotalPointUser",

                   e.basic_total_point_evaluator_0_5                                                              as "basicTotalPointEvaluator05",
                   e.pro_total_point_evaluator_0_5                                                                as "proTotalPointEvaluator05",
                   e.behavior_total_point_evaluator_0_5                                                           as "behaviorTotalPointEvaluator05",
                   e.achievement_additional_total_point_evaluator_0_5                                             as "achievementAdditionalTotalPointEvaluator05",
                   e.achievement_personal_total_point_evaluator_0_5                                               as "achievementPersonalTotalPointEvaluator05",

                   e.basic_total_point_evaluator_1                                                                as "basicTotalPointEvaluator1",
                   e.pro_total_point_evaluator_1                                                                  as "proTotalPointEvaluator1",
                   e.behavior_total_point_evaluator_1                                                             as "behaviorTotalPointEvaluator1",
                   e.achievement_additional_total_point_evaluator_1                                               as "achievementAdditionalTotalPointEvaluator1",
                   e.achievement_personal_total_point_evaluator_1                                                 as "achievementPersonalTotalPointEvaluator1",

                   e.basic_total_point_evaluator_2                                                                as "basicTotalPointEvaluator2",
                   e.pro_total_point_evaluator_2                                                                  as "proTotalPointEvaluator2",
                   e.behavior_total_point_evaluator_2                                                             as "behaviorTotalPointEvaluator2",
                   e.achievement_additional_total_point_evaluator_2                                               as "achievementAdditionalTotalPointEvaluator2",
                   e.achievement_personal_total_point_evaluator_2                                                 as "achievementPersonalTotalPointEvaluator2",

                   e.skill_percent                                                                                as "skillPercent",
                   e.behavior_percent                                                                             as "behaviorPercent",
                   e.achievement_percent                                                                          as "achievementPercent",
                   e.percent_point                                                                                as "percentPoint",

                   e.guide_version_id                                                                             as "guideVersionId",

                   e.date_creation_goal_start                                                                     as "dateCreationGoalStart",
                   e.date_creation_goal_end                                                                       as "dateCreationGoalEnd",
                   e.date_evaluation_start                                                                        as "dateEvaluationStart",
                   e.date_evaluation_end                                                                          as "dateEvaluationEnd",

                   e.comment_user                                                                                 as "commentUser",
                   e.updated_time                                                                                 as "updatedTime",

                   e.basic_pro_total_point_user                                                                   as "basicProTotalPointUser",
                   e.basic_pro_total_point_evaluator_0_5                                                          as "basicProTotalPointEvaluator05",
                   e.basic_pro_total_point_evaluator_1                                                            as "basicProTotalPointEvaluator1",
                   e.basic_pro_total_point_evaluator_2                                                            as "basicProTotalPointEvaluator2",

                   e.summary_point_user                                                                           as "summaryPointUser",
                   e.summary_point_evaluator_0_5                                                                  as "summaryPointEvaluator05",
                   e.summary_point_evaluator_1                                                                    as "summaryPointEvaluator1",
                   e.summary_point_evaluator_2                                                                    as "summaryPointEvaluator2",

                   e.flag_skill                                                                                   as "flagSkill",

                   e.evaluation_period_id                                                                         as "evaluationPeriodId",
                   -- get evaluation_period_tbl
                   JSON_BUILD_OBJECT('id', pr.id,
                                     'dateCreationGoalStart', pr.date_creation_goal_start,
                                     'dateCreationGoalEnd', pr.date_creation_goal_end,
                                     'dateEvaluationStart', pr.date_evaluation_start,
                                     'dateEvaluationEnd',
                                     pr.date_evaluation_end)                                                      as "evaluationPeriod",
                   -- get evaluator_tbl
                   COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
            'evaluatorId', ev.evaluator_id,
            'evaluationOrder', ev.evaluation_order,
            'commentPublic', ev.comment_public,
            'commentPrivate', ev.comment_private,
            'user', jsonb_build_object(
              'id', us.id,
              'fullName', us.full_name,
              'departmentId', us.department_id,
              'active', us.active,
              'employeeNumber', us.employee_number
            )
          )
        ) FILTER(WHERE ev.evaluator_id IS NOT NULL), '[]')                  AS evaluator,
                   -- get evaluation_basic_behavior_tbl
                   COALESCE(jsonb_agg(DISTINCT(jsonb_build_object(
        'evaluationId', b.evaluation_id,
        'type', b.type,
        'itemNo', b.item_no,
        'itemTitle', b.item_title,
        'content', b.content,
        'difficulty', b.difficulty,
        'pointUser', b.point_user,
        'pointEvaluator05', b.point_evaluator_0_5,
        'pointEvaluator1', b.point_evaluator_1,
        'pointEvaluator2', b.point_evaluator_2
        ))) FILTER(where b.evaluation_id IS NOT NULL and b.type = 3), '[]') as "evaluationBasicBehavior",
                   -- get evaluation_achievement_additional_tbl
                   COALESCE(jsonb_agg(DISTINCT(
          jsonb_build_object(
            'itemNo', ad.item_no,
            'titleAdditional', ad.title_additional,
            'achievementStatus', ad.achievement_status,
            'reasonComment', ad.reason_comment,
            'pointUser', ad.point_user,
            'pointEvaluator05', ad.point_evaluator_0_5,
            'pointEvaluator1', ad.point_evaluator_1,
            'pointEvaluator2', ad.point_evaluator_2,
            'evaluationOrder', ad.evaluation_order
          )
        )) FILTER(where ad.evaluation_id IS NOT NULL), '[]')                as "evaluationAchievementAdditional",
                   -- get information of user
                   JSONB_BUILD_OBJECT(
                           'id', urs.id,
                           'fullName', urs.full_name,
                           'active', urs.active,
                           'employeeNumber', urs.employee_number,
                           'department', jsonb_build_object(
                                   'name', dp.name,
                                   'code', dp.code
                                         )
                   ) as user,
        -- get history_approve_evaluation_tbl
        COALESCE(jsonb_agg(DISTINCT(jsonb_build_object(
          'id', h.id,
          'evaluationId', h.evaluation_id,
          'comment', h.comment,
          'approverId', h.approver_id,
          'receiverId', h.receiver_id,
          'receiverOrder', h.receiver_order,
          'type', h.type,
          'status', h.status,
          'createdTime', h.created_time,
          'updatedTime', h.updated_time
          ))
        ) FILTER (where h.evaluation_id IS NOT NULL), '[]') as "historyApproveEvaluations"
            from evaluation_tbl e
                LEFT JOIN evaluation_basic_behavior_tbl b
            ON e.id = b.evaluation_id
                LEFT JOIN historyApprove h ON e.id = h.evaluation_id and h.rn = 1
                LEFT JOIN evaluation_period_tbl pr ON pr.id = e.evaluation_period_id
                LEFT JOIN evaluator_tbl ev ON ev.evaluation_id = e.id
                LEFT JOIN User_tbl us ON us.id = ev.evaluator_id
                LEFT JOIN User_tbl urs ON urs.id = e.user_id
                LEFT JOIN department_tbl dp ON dp.id = urs.department_id
                LEFT JOIN evaluation_achievement_additional_tbl ad ON ad.evaluation_id = e.id

            where e.id = :id
              and (
                (:isEvaluatorUser
              AND e.user_id = :userId)
               OR
                (NOT :isEvaluatorUser
              AND e.user_id IS NOT NULL)
                )
              and e.company_group_code = :companyGroupCode
            group by e.id, e.title, pr.id, urs.id, dp.name, dp.code;`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          id: id,
          userId: userId,
          isEvaluatorUser: isEvaluatorUser,
          companyGroupCode: companyGroupCode,
        },
        raw: true,
      },
    )) as any;
    const evaluationAchievementPersonals =
      await this.evaluationAchievementPersonal
        .findAll({
          attributes: [
            'id',
            'itemNo',
            'title',
            'achievementValue',
            'method',
            'weight',
            'difficultyUser',
            'difficultyEvaluator05',
            'difficultyEvaluator1',
            'difficultyEvaluator2',
            'achievementStatus',
            'reasonComment',
            'actionPlan',
            'pointUser',
            'coefficientUser',
            'pointEvaluator05',
            'coefficientEvaluator05',
            'pointEvaluator1',
            'coefficientEvaluator1',
            'pointEvaluator2',
            'coefficientEvaluator2',
            'type',
          ],
          where: { evaluationId: id, type: 1 },
          include: [
            {
              model: EvaluationAchievementPersonalSub,
              as: 'evaluationAchievementPersonalSub',
              attributes: ['coefficient', 'evaluationDecision', 'degree'],
            },
          ],
          order: [
            ['itemNo', 'ASC'],
            [
              {
                model: EvaluationAchievementPersonalSub,
                as: 'evaluationAchievementPersonalSub',
              },
              'coefficient',
              'DESC',
            ],
          ],
        })
        .then((achievements) => {
          return achievements.map((v, i) => ({
            key: v.id,
            id: v.id,
            itemNo: v.itemNo,
            title: v.title,
            achievementValue: v.achievementValue,
            method: v.method,
            weight: v.weight,
            difficultyUser: v.difficultyUser,
            difficultyEvaluator05: v.difficultyEvaluator05,
            difficultyEvaluator1: v.difficultyEvaluator1,
            difficultyEvaluator2: v.difficultyEvaluator2,
            achievementStatus: v.achievementStatus,
            reasonComment: v.reasonComment,
            actionPlan: v.actionPlan,
            pointUser: v.pointUser,
            coefficientUser: v.coefficientUser,
            pointEvaluator05: v.pointEvaluator05,
            coefficientEvaluator05: v.coefficientEvaluator05,
            pointEvaluator1: v.pointEvaluator1,
            coefficientEvaluator1: v.coefficientEvaluator1,
            pointEvaluator2: v.pointEvaluator2,
            coefficientEvaluator2: v.coefficientEvaluator2,
            type: v.type,
            childrens: v.evaluationAchievementPersonalSub.map((e, i2) => ({
              index: i,
              note: e.evaluationDecision,
              point: Number(e.coefficient)?.toFixed(1),
              key: `evaluation-achievement-key-${i}-${i2}`,
              degree: e.degree,
            })),
          }));
        });
    return {
      evaluationDetail: {
        ...evaluationDetail[0],
      },
      evaluationAchievementPersonals,
    };
  }

  async getSettingLevel(level: number) {
    return await this.settingLevelEntity.findAll({
      attributes: [
        'level',
        'skillPercent',
        'behaviorPercent',
        'achievementPercent',
      ],
      where: { level },
    });
  }

  async getIdEvaluation(
    userId: number,
    evaluationId: number,
    isEvaluatorUser: boolean,
  ) {
    const userCondition = isEvaluatorUser
      ? { userId }
      : { userId: { [Op.not]: null } };

    return await this.evaluationEntity.findOne({
      attributes: [
        'id',
        'status',
        'updatedTime',
        'userId',
        'summaryPointUser',
        'summaryPointEvaluator05',
        'summaryPointEvaluator1',
        'summaryPointEvaluator2',
        'skillPercent',
        'behaviorPercent',
        'achievementPercent',
        'basicProTotalPointUser',
        'behaviorTotalPointUser',
        'achievementPersonalTotalPointUser',
        'achievementAdditionalTotalPointUser',
        'basicProTotalPointEvaluator05',
        'behaviorTotalPointEvaluator05',
        'achievementPersonalTotalPointEvaluator05',
        'achievementAdditionalTotalPointEvaluator05',
        'basicProTotalPointEvaluator1',
        'behaviorTotalPointEvaluator1',
        'achievementPersonalTotalPointEvaluator1',
        'achievementAdditionalTotalPointEvaluator1',
        'basicProTotalPointEvaluator2',
        'behaviorTotalPointEvaluator2',
        'achievementPersonalTotalPointEvaluator2',
        'achievementAdditionalTotalPointEvaluator2',
        'level',
        'flagSkill',
        'evaluationPeriodId',
      ],
      where: { id: evaluationId, ...userCondition },
      include: [
        {
          model: Evaluator,
          as: 'evaluator',
          // attributes: ['evaluationOrder', 'evaluatorId'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'active'],
        },
        {
          model: EvaluationPeriod,
          as: 'evaluationPeriod',
        },
      ],
    });
  }

  async getProSkillPublicList(
    departmentId: number,
    divisionId: number,
    companyGroupCode: string,
    evaluationId?: number,
  ) {
    const period = await this.evaluationEntity.findOne({
      where: { id: evaluationId },
      attributes: [],
      include: [
        { model: EvaluationPeriod, attributes: ['year', 'periodIndex'] },
      ],
    });
    const { year, periodIndex } = period.evaluationPeriod;

    const listVersionProSkill: any =
      await this.versionProSkillEntity.sequelize.query(
        `SELECT DISTINCT
          CASE 
            WHEN HP.VERSION_ID IS NOT NULL THEN HP.VERSION_ID
            ELSE VP.ID
          END AS "versionId"
        FROM
          PUBLIC.SKILL_USER_TBL SU
          JOIN PUBLIC.EVALUATION_PERIOD_TBL EP ON SU.PERIOD_ID = EP.ID
          LEFT JOIN PUBLIC.HISTORY_PUBLIC_PRO_SKILL_TBL HP ON SU.SKILL_ID = HP.SKILL_ID
          AND EP.YEAR = HP.YEAR
          AND EP.PERIOD_INDEX = HP.PERIOD_INDEX
          LEFT JOIN PUBLIC.VERSION_PRO_SKILL_TBL VP ON SU.SKILL_ID = VP.SKILL_ID
          AND VP.PUBLIC_STATUS = 1
        WHERE
          SU.EVALUATION_ID = :evaluationId
        `,
        {
          nest: true,
          replacements: {
            evaluationId: evaluationId,
          },
        },
      );
    const arrayVersionId: number[] = listVersionProSkill.map(
      (item: { versionId: number }) => item.versionId,
    );

    const versionProSkills = await this.versionProSkillEntity.findAll({
      attributes: [],
      where: {
        companyGroupCode: companyGroupCode,
        id: {
          [Op.in]: arrayVersionId,
        },
      },
      include: [
        {
          model: ListProSkill,
          as: 'listProSkills',
          attributes: [
            'jobType',
            'itemId',
            'smallClass',
            'mediumClass',
            'content',
            'difficulty',
            'note',
          ],
        },
      ],
      order: [[{ model: ListProSkill, as: 'listProSkills' }, 'id', 'ASC']],
    });

    if (versionProSkills?.length > 0) return versionProSkills;
    return [];
  }

  async getProSkillPublicListInMenu(
    userId: number,
    companyGroupCode: string,
    timeZone: string,
  ) {
    const year =
      EvaluationPeriodHelper.getCurrentPeriodYear(timeZone).toString();
    const periodIndex =
      EvaluationPeriodHelper.getCurrentPeriodIndex(timeZone) == '上期' ? 1 : 2;

    const dataEvaluationPeroid = await this.evaluationPeriodEntity.findOne({
      attributes: ['id', 'checkFixed'],
      where: {
        year: year,
        periodIndex: periodIndex,
        companyGroupCode: companyGroupCode,
      },
    });

    let versionProSkills;
    //* lấy theo data được setting trong bảng skill_user_tbl (user đã dược setting template)
    versionProSkills = await this.versionProSkillEntity.findAll({
      attributes: [],
      where: {
        publicStatus: 1,
        companyGroupCode: companyGroupCode,
      },
      include: [
        {
          model: Skill,
          as: 'skill',
          where: {
            active: 1,
            companyGroupCode: companyGroupCode,
          },
          include: [
            {
              model: SkillUser,
              // as: 'skills',
              where: {
                evaluationId: { [Op.is]: null },
                type: 0,
                periodId: dataEvaluationPeroid?.id,
                userId: userId,
              },
            },
          ],
          required: true,
        },
        {
          model: ListProSkill,
          as: 'listProSkills',
          attributes: [
            'jobType',
            'itemId',
            'smallClass',
            'mediumClass',
            'content',
            'difficulty',
            'note',
          ],
        },
      ],
      order: [[{ model: ListProSkill, as: 'listProSkills' }, 'id', 'ASC']],
    });

    //* lấy thông tin department/division
    const depDivName = await this.userEntity.findOne({
      attributes: ['level'],
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['name'],
        },
        {
          model: Department,
          as: 'division',
          attributes: ['name'],
        },
      ],
      where: { id: userId, active: 1, companyGroupCode: companyGroupCode },
    });

    const results = [];
    if (versionProSkills.length > 0) {
      versionProSkills.map((v, versionIndex) => {
        results.push(
          ...v.listProSkills.map((pro, i) => ({
            itemId: `${pro.itemId}_${versionIndex}_${i}`,
            smallClass: pro.smallClass,
            mediumClass: pro.mediumClass,
            content: pro.content,
            difficulty: pro.difficulty,
            note: pro.note,
            jobType: pro.jobType,
            key: `${pro.itemId}_${versionIndex}_${i}`,
          })),
        );
      });
    }

    return {
      results: results,
      depDivName:
        depDivName?.level > 8
          ? depDivName?.division?.name || ''
          : depDivName?.department?.name || '',
    };
  }

  async getNewTransaction() {
    return await this.evaluationEntity.sequelize.transaction();
  }

  async updateEvaluationProSkill(
    evaluationId: number,
    evaluationPro: UserEvaluationToProSkillType[],
    transaction: Transaction,
  ) {
    const values = evaluationPro.map((v, i) => ({
      ...v,
      itemNo: i,
      evaluationId,
    }));

    return await this.evaluationProEntity
      .destroy({ where: { evaluationId }, transaction: transaction })
      .then(() =>
        this.evaluationProEntity.bulkCreate(values, {
          transaction: transaction,
        }),
      );
  }

  async getBasicBehavior(
    type: number,
    level: any,
    flagSkill: number,
    companyGroupCode: string,
  ): Promise<ListBasicBehavior[]> {
    const datas = (
      await this.listBasicBehaviorEntity.findAll({
        include: [
          {
            model: VersionBasicBehavior,
            as: 'versionBasicBehavior',
            attributes: ['id', 'version', 'subVersion'],
            where:
              type === 1
                ? {
                    type: level < 8 ? 1 : 4,
                    status: 4,
                    companyGroupCode: companyGroupCode,
                  }
                : {
                    type:
                      level < 8
                        ? flagSkill === 1
                          ? 2
                          : 3
                        : flagSkill === 1
                        ? 5
                        : 6,
                    status: 4,
                    level: level,
                    companyGroupCode: companyGroupCode,
                  },
          },
        ],
        order: [['idItem', 'ASC']],
      })
    ).map((data) => data && data.get({ plain: true }));
    return datas;
  }

  async getProSkill(skillId: number): Promise<ListProSkill[]> {
    const versionId = await this.versionProSkillEntity.findOne({
      attributes: ['id'],
      where: {
        publicStatus: 1,
        skillId: skillId,
      },
    });
    if (versionId?.id) {
      return await this.listProSkillEntity.findAll({
        attributes: [
          'itemId',
          'mediumClass',
          'smallClass',
          'content',
          'difficulty',
          'note',
        ],
        where: {
          versionId: versionId.id,
        },
        order: [['id', 'ASC']],
        limit: 100,
      });
    } else {
      return [];
    }
  }

  async getDivisionByIdEvaluation(
    idEvaluation: number,
  ): Promise<{ divisionName: string; evaluationPeriodId: number }> {
    const datas = await this.evaluationEntity.findOne({
      attributes: ['divisionName', 'evaluationPeriodId'],
      where: { id: idEvaluation },
    });
    return datas;
  }

  async getAchievementPublicByType(
    type: AchievementType,
    companyGroupCode: string,
  ): Promise<SettingAchievementPersonal[]> {
    return await this.settingAchievementPersonalEntity.findAll({
      include: [
        {
          model: VersionSetting,
          as: 'versionSetting',
          attributes: [],
          where: { status: 4, type, companyGroupCode: companyGroupCode },
        },
      ],
      order: [['point', 'DESC']],
    });
  }

  async getAchievementAddPublicByType(
    type: AchievementType,
    typeNew: number,
    companyGroupCode: string,
  ): Promise<SettingAchievementAdditional[]> {
    return await this.settingAchievementAdditionalEntity.findAll({
      include: [
        {
          model: VersionSetting,
          as: 'versionSetting',
          attributes: [],
          where: { status: 4, type, companyGroupCode: companyGroupCode },
        },
      ],
      where: { type: typeNew },
    });
  }

  processValueNull(value: any) {
    return value === null ||
      value === '' ||
      isNaN(Number(value)) ||
      isFloat(value)
      ? null
      : value;
  }

  async updateEvaluationAchievement(
    evaluationId: number,
    evaluationAchievement: UserEvaluationAchievementType[],
    achievementSubs: any[],
    status: number,
    transaction: Transaction,
  ): Promise<EvaluationAchievementPersonal[]> {
    let values = evaluationAchievement
      .filter((f) => f.achievementStatus !== '小計')
      .map((v, i) => ({
        ...v,
        evaluationId,
        itemNo: i,
        weight:
          v.weight === null ||
          v.weight === '' ||
          isNaN(Number(v.weight)) ||
          isFloat(v.weight)
            ? null
            : v.weight,
        pointUser: this.processValueNull(v.pointUser),
        pointEvaluator05: this.processValueNull(v.pointEvaluator05),
        pointEvaluator1: this.processValueNull(v.pointEvaluator1),
        pointEvaluator2: this.processValueNull(v.pointEvaluator2),
        type: v.type,
      }));

    if (evaluationAchievement.length === 0 && achievementSubs.length > 0) {
      values = achievementSubs.map((_, i) => ({
        evaluationId,
        itemNo: i,
        weight: null,
        pointUser: null,
        pointEvaluator05: null,
        pointEvaluator1: null,
        pointEvaluator2: null,
        achievementStatus: null,
        achievementValue: null,
        actionPlan: null,
        coefficientEvaluator05: null,
        coefficientEvaluator1: null,
        coefficientEvaluator2: null,
        coefficientUser: null,
        difficultyEvaluator05: null,
        difficultyEvaluator1: null,
        difficultyEvaluator2: null,
        difficultyUser: null,
        key: null,
        method: null,
        reasonComment: null,
        title: null,
        type: 1,
      }));
    }

    await this.evaluationAchievementPersonalSub.destroy({
      where: { achievementPersonalId: { [Op.is]: null } },
      transaction: transaction,
    });

    return await this.evaluationAchievementPersonal
      .destroy({
        where: { evaluationId },
        transaction: transaction,
      })
      .then(async () => {
        return (
          values.length > 0 &&
          (await this.evaluationAchievementPersonal
            .bulkCreate(
              values.map((e) => {
                return { ...e, type: 1 };
              }),
              {
                transaction: transaction,
              },
            )
            .then(async (achievements) => {
              if (achievements.length) {
                if (achievementSubs.length) {
                  const subs: any[] = [];
                  for (let i = 0; i < achievements.length; i++) {
                    const achievement = achievements[i];
                    if (achievementSubs[i] && achievementSubs[i].length) {
                      subs.push(
                        ...achievementSubs[i]
                          .filter((f) => f?.index === i)
                          .map((v) => ({
                            achievementPersonalId: achievement.id,
                            coefficient: v.point,
                            evaluationDecision: v.note,
                            degree: v.degree,
                          })),
                      );
                    }
                  }

                  const removeDuplicates = subs.filter(
                    (v, i, s) =>
                      i ===
                      s.findIndex(
                        (f) =>
                          f.achievementPersonalId === v.achievementPersonalId &&
                          f.coefficient === v.coefficient,
                        //  &&
                        // f.evaluationDecision === v.evaluationDecision,
                      ),
                  );

                  await this.evaluationAchievementPersonalSub.bulkCreate(
                    removeDuplicates,
                    {
                      transaction: transaction,
                      // logging: true,
                    },
                  );
                }
              }

              return achievements;
            }))
        );
      });
  }

  async updateEvaluationBasicOrBehaviorSkill(
    evaluationId: number,
    evaluationBasicBehavior: UserEvaluationBasicBehaviorType[],
    type: BasicBehaviorType,
    transaction: Transaction,
  ): Promise<any> {
    //
    const values = evaluationBasicBehavior.map((v) => ({
      itemTitle: v.title,
      content: v.content,
      difficulty: v.difficulty,
      evaluationId,
      itemNo: v.itemNo,
      type,
      pointUser: v.pointUser,
      pointEvaluator05: v.pointEvaluator05,
      pointEvaluator1: v.pointEvaluator1,
      pointEvaluator2: v.pointEvaluator2,
    }));

    return await this.evaluationBasicBehaviorEntity
      .destroy({
        where: { evaluationId, type },
        transaction: transaction,
      })
      .then(
        async () =>
          values.length > 0 &&
          (await this.evaluationBasicBehaviorEntity.bulkCreate(values, {
            transaction: transaction,
          })),
      );
  }

  //
  async updateEvaluationAchievementAdditional(
    evaluationId: number,
    achievementAdditionals: AchievementAdditionalType[],
    transaction: Transaction,
  ): Promise<EvaluationAchievementAdditional[]> {
    const values = achievementAdditionals.map((v, i) => ({
      ...v,
      itemNo: i,
      evaluationId,
    }));

    return await this.evaluationAchievementAdditionalEntity
      .destroy({
        where: { evaluationId },
        transaction: transaction,
      })
      .then(
        () =>
          values.length > 0 &&
          this.evaluationAchievementAdditionalEntity.bulkCreate(values, {
            transaction: transaction,
          }),
      );
  }

  async getSettingProFormulaPublic(
    companyGroupCode: string,
  ): Promise<SettingProFormulaSub[]> {
    return await this.settingProFormulaSubEntity.findAll({
      include: {
        model: SettingProFormula,
        as: 'settingProFormula',
        include: [
          {
            attributes: [],
            model: VersionSetting,
            as: 'versionSetting',
            where: { status: 4, type: 1, companyGroupCode: companyGroupCode },
          },
        ],
      },
      order: [['totalItem', 'DESC']],
    });
  }

  async getDepartmentGoalbyEvaluationDepartmentId(
    evaluationDepartmentId: number,
  ): Promise<any> {
    const datas = await this.evaluationEntity.findOne({
      attributes: ['divisionName', 'title'],
      include: [
        {
          model: EvaluationAchievementPersonal,
          as: 'evaluationAchievementPersonals',
          attributes: [
            ['id', 'key'],
            ['id', 'itemNo'],
            'title',
            'achievementValue',
            'method',
          ],
          where: { type: 3 },
        },
      ],

      where: {
        id: evaluationDepartmentId,
      },
      order: [['id', 'ASC']],
    });
    return datas;
  }

  async getDepartmentGoal(
    divisionId: number,
    evaluationPeriodId: number,
    companyGroupCode: string,
  ): Promise<any> {
    let level = null;
    const data = await this.evaluationEntity.findOne({
      attributes: ['level'],
      include: [
        {
          model: User,
          attributes: [],
          as: 'user',
          where: { active: 1 },
        },
      ],
      where: {
        [Op.and]: [
          {
            divisionId: divisionId,
          },
          { level: { [Op.gte]: 8 } },
          { evaluationPeriodId: evaluationPeriodId },
          { companyGroupCode: companyGroupCode },
        ],
      },
      order: [
        ['level', 'DESC'],
        Sequelize.literal(`TO_DATE("Evaluation"."period_end",'YYYY/MM') DESC `),
        [Sequelize.col('user.employee_number'), 'ASC'],
      ],
    });

    if (data) level = data.level;
    const datas = await this.evaluationEntity.findAll({
      attributes: ['id', 'divisionName', 'title'],
      include: [
        {
          model: EvaluationAchievementPersonal,
          as: 'evaluationAchievementPersonals',
          where: { type: 3 },
          attributes: [
            ['id', 'key'],
            ['id', 'itemNo'],
            'title',
            'achievementValue',
            'method',
            'id',
          ],
        },
        {
          model: User,
          as: 'user',
          attributes: ['employeeNumber'],
          where: { active: 1 },
        },
      ],

      where: {
        [Op.and]: [
          {
            divisionId: divisionId,
          },
          { evaluationPeriodId: evaluationPeriodId },
          { level: level },
          { status: { [Op.gte]: 49 } },
          { companyGroupCode: companyGroupCode },
        ],
      },
      // order: [['id', 'ASC']],
      order: [
        ['level', 'DESC'],
        Sequelize.literal(`TO_DATE("Evaluation"."period_end",'YYYY/MM') DESC `),
        [Sequelize.col('user.employee_number'), 'ASC'],
      ],
      nest: true,
    });

    return datas?.length >= 1 ? datas[0] : undefined;
  }

  async findPersonalSub(id: number[]): Promise<any> {
    return await this.evaluationAchievementPersonalSub.findAll({
      where: { achievementPersonalId: id },
    });
  }

  async getEvaluationDepartmentId(evaluationId: number): Promise<any> {
    const data = await this.evaluationEntity.findOne({
      attributes: [
        'evaluationDepartmentId',
        'divisionName',
        'divisionId',
        'title',
      ],
      where: { id: evaluationId },
    });
    return data;
  }

  async getDivisionByUserId(userId: number): Promise<any> {
    const data = await this.userEntity.findOne({
      attributes: [],
      include: [
        {
          model: Department,
          attributes: ['id', 'code', 'name'],
          as: 'division',
        },
      ],
      where: { id: userId },
    });
    return data;
  }

  async getEvaluationPeriodId(
    companyGroupCode: string,
    timeZone: string,
  ): Promise<EvaluationPeriod> {
    const today = moment().tz(timeZone).format('YYYY/MM/DD');
    const todayEnd = moment()
      .subtract(1, 'months')
      .tz(timeZone)
      .format('YYYY/MM/DD');
    const data = await this.evaluationPeriodEntity.findOne({
      attributes: ['id', 'year', 'periodIndex'],
      where: {
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn(
              'TO_TIMESTAMP',
              Sequelize.col('period_start'),
              'YYYY/MM',
            ),
            {
              [Op.lte]: today,
            },
          ),
          Sequelize.where(
            Sequelize.fn(
              'TO_TIMESTAMP',
              Sequelize.col('period_end'),
              'YYYY/MM',
            ),
            {
              [Op.gte]: todayEnd,
            },
          ),
          { companyGroupCode: companyGroupCode },
        ],
      },
    });
    return data;
  }

  async getListUser(query: any) {
    const role = query.role;
    const department = query.department;
    const division = query.division;
    const nameAndEmail = query.nameAndEmail;
    const skill = query.skill;
    const company = query.company;
    const limit = query.limit;
    const offset = query.offset;
    const companyGroupCode = query.companyGroupCode;
    const level = query.level;

    const arrayWhere = [];
    arrayWhere.push({
      [Op.or]: [
        {
          employeeNumber: nameAndEmail
            ? { [Op.iLike]: `%${nameAndEmail}%` }
            : { [Op.not]: null },
        },
        {
          fullName: nameAndEmail
            ? { [Op.iLike]: `%${nameAndEmail}%` }
            : { [Op.not]: null },
        },
        {
          email: nameAndEmail
            ? { [Op.iLike]: `%${nameAndEmail}%` }
            : { [Op.not]: null },
        },
      ],
    });
    if (department === '_blank') {
      arrayWhere.push({
        departmentId: null,
      });
    }

    if (division === '_blank') {
      arrayWhere.push({
        divisionId: null,
      });
    }

    if (
      department &&
      department !== '-1' &&
      department !== '_blank' &&
      department[0] !== 'null' &&
      department !== undefined
    ) {
      arrayWhere.push({
        departmentId: parseInt(department[0].trim()), // get department id
      });
    }

    if (division !== '-1' && division !== '_blank') {
      arrayWhere.push({
        divisionId: parseInt(division[0].trim()), // get division id
      });
    }

    if (company !== '-1') {
      arrayWhere.push({
        companyId: parseInt(company), // get company id
      });
    }

    if (skill !== '-1') {
      arrayWhere.push({
        flagSkill: parseInt(skill), // get flag_skill
      });
    }
    const levelArray = level
      .toString()
      .split(',')
      .map((num) => parseInt(num.trim(), 10));
    if (level !== '-1') {
      arrayWhere.push({
        level: {
          [Op.in]: levelArray,
        },
      });
    }

    const datas = await this.userEntity.findAndCountAll({
      attributes: [
        'id',
        'employeeNumber',
        'fullName',
        'email',
        'level',
        'flagSkill',
      ],
      where: {
        [Op.and]: arrayWhere,
        active: 1,
        companyGroupCode: companyGroupCode,
      },
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'code', 'name'],
        },
        {
          model: Department,
          as: 'division',
          attributes: ['id', 'code', 'name'],
        },
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name'],
        },
        {
          model: Role,
          as: 'rolesCondition',
          attributes: ['id', 'name'],
          through: { attributes: [] },
          where:
            role !== '-1' && role !== undefined
              ? {
                  [Op.and]: [{ id: role }],
                }
              : undefined,
        },
        {
          model: Role,
          as: 'roles',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
      order: [['employee_number', 'ASC']],
      offset: offset,
      limit: limit,
      distinct: true,
    });

    return { data: datas.rows, counts: datas.count, arrayWhere };
  }

  async deleteListUser(query: any, companyGroupCode: string, timeZone: string) {
    const countUser = await this.userEntity.count({
      where: {
        [Op.and]: [
          { active: 1 },
          { id: { [Op.in]: query } },
          { companyGroupCode: companyGroupCode },
        ],
      },
    });

    if (countUser !== query?.length) {
      throw new RuntimeException('Conflict delete user', 409);
    }

    // console.log('param: ', query);
    const today = new Date();
    const year = today.getFullYear();
    const currentPeriodIndex =
      EvaluationPeriodHelper.getCurrentPeriodIndex(timeZone) === '上期' ? 1 : 2;
    const prevYear = currentPeriodIndex === 1 ? year - 1 : year;
    const prevPeriodIndex = currentPeriodIndex === 1 ? 2 : 1;
    const listUserNotDelete = [];
    let listUserDelete = [];
    let userInForNotDelete: User[];

    const listPeriodUnPublic =
      (await (
        await this.evaluationPeriodEntity.findAll({
          attributes: ['id'],
          where: {
            checkFixed: { [Op.ne]: 2 },
            companyGroupCode: companyGroupCode,
          },
        })
      )?.map((a) => a?.id)) || [];

    const transaction: Transaction =
      await EvaluatorDefault.sequelize.transaction();

    try {
      const listEvaluation = await this.evaluationEntity.findAll({
        attributes: ['id', 'status'],
        where: { companyGroupCode: companyGroupCode },
        include: [
          {
            model: Evaluator,
            attributes: ['evaluationId', 'evaluatorId', 'evaluationOrder'],
            where: {
              evaluator_id: query,
            },
          },
          {
            model: EvaluationPeriod,
            where: {
              [Op.or]: [
                {
                  [Op.and]: {
                    year: `${year}`,
                    period_index: currentPeriodIndex,
                  },
                },
                {
                  [Op.and]: {
                    year: `${prevYear}`,
                    period_index: prevPeriodIndex,
                  },
                },
              ],
            },
          },
        ],
      });

      if (listEvaluation.length === 0) {
        // all user selected can delete
        /** Delete all user */
        for (let i = 0; i < query.length; i++) {
          const item = query[i];
          /** Update table evaluator_default_tbl column evaluator_0_5_id */
          await EvaluatorDefault.update(
            { evaluator_0_5_id: null },
            {
              where: {
                [Op.and]: [
                  { evaluator_0_5_id: item },
                  {
                    evaluation_period_id: {
                      [Op.in]: listPeriodUnPublic,
                    },
                  },
                  { companyGroupCode: companyGroupCode },
                ],
              },
              transaction: transaction,
              returning: true,
            },
          );

          /** Update table evaluator_default_tbl column evaluator_1_id */
          await EvaluatorDefault.update(
            { evaluator_1_id: null },
            {
              where: {
                [Op.and]: [
                  { evaluator_1_id: item },
                  {
                    evaluation_period_id: {
                      [Op.in]: listPeriodUnPublic,
                    },
                  },
                  { companyGroupCode: companyGroupCode },
                ],
              },
              transaction: transaction,
              returning: true,
            },
          );

          await EvaluatorDefault.update(
            { evaluator_2_id: null },
            {
              where: {
                [Op.and]: [
                  { evaluator_2_id: item },
                  {
                    evaluation_period_id: {
                      [Op.in]: listPeriodUnPublic,
                    },
                  },
                  { companyGroupCode: companyGroupCode },
                ],
              },
              transaction: transaction,
              returning: true,
            },
          );

          /** Update table history_user_active_tbl column user_end  */
          const user = await this.userEntity.findOne({
            where: { id: item },
            include: [
              {
                model: Role,
                as: 'roles',
                attributes: ['name'],
                through: { attributes: [] },
              },
            ],
          });

          if (
            user &&
            user.roles.findIndex((v) => v.name === 'PRO_SKILL_SETTING') >= 0
          ) {
            await this.skillRole.destroy({
              where: { userId: item, role: 1 },
              transaction: transaction,
            });
          }

          if (
            user &&
            user.roles.findIndex((v) => v.name === 'PRO_SKILL_APPROVAL') >= 0
          ) {
            await this.skillRole.destroy({
              where: { userId: item, role: 2 },
              transaction: transaction,
            });
          }

          const changeActives = await User.update(
            { active: 0 },
            {
              where: { id: item },
              transaction: transaction,
              returning: true,
            },
          );
          if (!changeActives) {
            await transaction.rollback();
            throw new RuntimeException('not Found', 500);
          }

          /** Delete permission with user can delete */
          await this.permission.destroy({
            where: { userId: item },
            transaction: transaction,
          });

          await EvaluatorDefault.destroy({
            where: {
              [Op.and]: [
                { userId: item },
                {
                  evaluation_period_id: {
                    [Op.in]: listPeriodUnPublic,
                  },
                },
                { companyGroupCode: companyGroupCode },
              ],
            },
            transaction: transaction,
          });
        }
        await transaction.commit();
        return { userInfor: [] };
      } else {
        const listEvaluationId = [];
        // all user selected , have user can delete, have user can not delete
        // console.log('list: ', listEvaluation);
        listEvaluation.map((item: any) => {
          // console.log('status: ', item.status);
          item.evaluator.map((e: any) => {
            query.map((id: any) => {
              if (
                (id === e.evaluatorId &&
                  e.evaluationOrder === '0.5' &&
                  (item.status === 3 ||
                    item.status === 4 ||
                    item.status === 53 ||
                    item.status === 54 ||
                    item.status === 55)) ||
                (id === e.evaluatorId &&
                  e.evaluationOrder === '1.0' &&
                  (item.status === 5 ||
                    item.status === 6 ||
                    item.status === 56 ||
                    item.status === 57 ||
                    item.status === 58)) ||
                (id === e.evaluatorId &&
                  e.evaluationOrder === '2.0' &&
                  item.status < 100)
              ) {
                /** put user can not delete  */
                listUserNotDelete.push(id);
              }
            });
          });
          if (item.status < 100) {
            listEvaluationId.push(item.id);
          }
        });

        listUserDelete = query.filter(
          (word: any) => !listUserNotDelete.includes(word),
        );

        /** get user information cannot delete*/
        userInForNotDelete = await User.findAll({
          attributes: ['employeeNumber', 'fullName'],
          where: {
            id: listUserNotDelete,
          },
        });

        /** delete list user can delete */
        for (let i = 0; i < listUserDelete.length; i++) {
          const item = listUserDelete[i];
          /** Update table evaluator_default_tbl column evaluator_0_5_id */
          await EvaluatorDefault.update(
            { evaluator_0_5_id: null },
            {
              where: {
                [Op.and]: [
                  { evaluator_0_5_id: item },
                  {
                    evaluation_period_id: {
                      [Op.in]: listPeriodUnPublic,
                    },
                  },
                  { companyGroupCode: companyGroupCode },
                ],
              },
              transaction: transaction,
              returning: true,
            },
          );

          /** Update table evaluator_default_tbl column evaluator_1_id */
          await EvaluatorDefault.update(
            { evaluator_1_id: null },
            {
              where: {
                [Op.and]: [
                  { evaluator_1_id: item },
                  {
                    evaluation_period_id: {
                      [Op.in]: listPeriodUnPublic,
                    },
                  },
                  { companyGroupCode: companyGroupCode },
                ],
              },
              transaction: transaction,
              returning: true,
            },
          );

          /** Update table evaluator_default_tbl column evaluator_2_id */
          await EvaluatorDefault.update(
            { evaluator_2_id: null },
            {
              where: {
                [Op.and]: [
                  { evaluator_2_id: item },
                  {
                    evaluation_period_id: {
                      [Op.in]: listPeriodUnPublic,
                    },
                  },
                  { companyGroupCode: companyGroupCode },
                ],
              },
              transaction: transaction,
              returning: true,
            },
          );

          /** Update table history_user_active_tbl column user_end   */
          const user = await this.userEntity.findOne({
            where: { id: item },
            include: [
              {
                model: Role,
                as: 'roles',
                attributes: ['name'],
                through: { attributes: [] },
              },
            ],
          });

          if (
            user &&
            user.roles.findIndex((v) => v.name === 'PRO_SKILL_SETTING') >= 0
          ) {
            await this.skillRole.destroy({
              where: { userId: item, role: 1 },
              transaction: transaction,
            });
          }

          if (
            user &&
            user.roles.findIndex((v) => v.name === 'PRO_SKILL_APPROVAL') >= 0
          ) {
            await this.skillRole.destroy({
              where: { userId: item, role: 2 },
              transaction: transaction,
            });
          }

          listEvaluationId.forEach(async (evaluationId: any) => {
            await Evaluator.destroy({
              where: {
                [Op.and]: [
                  {
                    evaluationId: evaluationId,
                    evaluatorId: item,
                    evaluationOrder: { [Op.ne]: 2.0 },
                  },
                ],
              },
              transaction: transaction,
            });
          });

          await User.update(
            { active: 0 },
            {
              where: { id: item },
              transaction: transaction,
              returning: true,
            },
          );

          /** Delete permission with user can delete */
          await this.permission.destroy({
            where: { userId: item },
            transaction: transaction,
          });

          await EvaluatorDefault.destroy({
            where: {
              [Op.and]: [
                { userId: item },
                {
                  evaluation_period_id: {
                    [Op.in]: listPeriodUnPublic,
                  },
                },
                { companyGroupCode: companyGroupCode },
              ],
            },
            transaction: transaction,
          });
        }
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new RuntimeException(
        error,
        error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { userInfor: userInForNotDelete };
  }

  updateListUser(query: any) {
    const listID = query.listId;
    const company = query.company;
    const department = query.department;
    const division = query.division;
    const level = query.level;

    if (company !== '変更しない') {
      listID.forEach(async (item) => {
        const check = await User.update(
          { companyId: company },
          {
            where: { id: item },
            returning: true,
          },
        );
        if (!check) {
          throw new RuntimeException('not Found', 500);
        }
      });
    }

    if (department !== '変更しない') {
      listID.forEach(async (item) => {
        const check = await User.update(
          { departmentId: department },
          {
            where: { id: item },
            returning: true,
          },
        );
        if (!check) {
          throw new RuntimeException('not Found', 500);
        }
      });
    }

    if (division !== '変更しない') {
      listID.forEach(async (item) => {
        const check = await User.update(
          { divisionId: division },
          {
            where: { id: item },
            returning: true,
          },
        );
        if (!check) {
          throw new RuntimeException('not Found', 500);
        }
      });
    }

    if (level !== '変更しない') {
      listID.forEach(async (item) => {
        const check = await User.update(
          { level: level },
          {
            where: { id: item },
            returning: true,
          },
        );
        if (!check) {
          throw new RuntimeException('not Found', 500);
        }
      });
    }
  }

  async getBasicBehaviorSkillPublic(
    type: BasicBehaviorType | BasicBehaviorType[],
    companyGroupCode: string,
    level?: number | number[],
  ): Promise<ListBasicBehavior[]> {
    return (
      await this.listBasicBehaviorEntity.findAll({
        include: {
          model: VersionBasicBehavior,
          as: 'versionBasicBehavior',
          where: {
            type,
            status: 4,
            level: level || null,
            companyGroupCode: companyGroupCode,
          },
          attributes: ['level', 'type'],
        },
        order: [['idItem', 'ASC']],
      })
    ).map((data) => data && data.get({ plain: true }));
  }

  async updateEvaluationBasicBehaviorSkill(
    evaluationId: number,
    level: number,
    flagSkill: number,
    companyGroupCode: string,
    transaction: Transaction,
  ): Promise<any> {
    await this.evaluationBasicBehaviorEntity.destroy({
      where: { evaluationId },
      transaction: transaction,
    });
    const basicBehaviors = (
      await this.listBasicBehaviorEntity.findAll({
        include: {
          model: VersionBasicBehavior,
          as: 'versionBasicBehavior',
          where: {
            status: 4,
            [Op.or]: [{ type: 1 }, { type: flagSkill === 0 ? 3 : 2, level }],
            companyGroupCode: companyGroupCode,
          },
          attributes: ['type'],
        },
        order: [['idItem', 'ASC']],
      })
    )
      .map((data) => data && data.get({ plain: true }))
      .map((v, i) => ({
        ...v,
        evaluationId,
        itemNo: i,
        type: v.versionBasicBehavior.type,
        itemTitle: v.title,
      }));
    return await this.evaluationBasicBehaviorEntity.bulkCreate(basicBehaviors, {
      transaction: transaction,
    });
  }

  //
  async updateUserInfo(body: any, userId: number): Promise<any> {
    return await this.userEntity.update(body, { where: { id: userId } });
  }

  //
  async deletePermission(
    userId: number,
    isChangeRole2: boolean,
    isChangeRoleF3: boolean,
    isChangeRoleF4: boolean,
    transaction: Transaction,
  ): Promise<any> {
    if (isChangeRole2) {
      /** Update table evaluator_default_tbl column evaluator_0_5_id */
      await EvaluatorDefault.update(
        // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
        { evaluator_0_5_id: null },
        {
          // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
          where: { evaluator_0_5_id: userId },
          transaction: transaction,
          returning: true,
        },
      );

      /** Update table evaluator_default_tbl column evaluator_1_id */
      await EvaluatorDefault.update(
        // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
        { evaluator_1_id: null },
        {
          // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
          where: { evaluator_1_id: userId },
          transaction: transaction,
          returning: true,
        },
      );

      /** Update table evaluator_default_tbl column evaluator_2_id */
      await EvaluatorDefault.update(
        // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
        { evaluator_2_id: null },
        {
          // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
          where: { evaluator_2_id: userId },
          transaction: transaction,
          returning: true,
        },
      );
    }

    if (isChangeRoleF3) {
      await this.skillRole.destroy({ where: { userId: userId, role: 1 } });
    }

    if (isChangeRoleF4) {
      await this.skillRole.destroy({ where: { userId: userId, role: 2 } });
    }

    return await this.permission.destroy({ where: { userId: userId } });
  }

  async updatePermission(body: any, transaction: Transaction): Promise<any> {
    return await this.permission.bulkCreate(body, {
      transaction: transaction,
    });
  }

  async getEvaluator(userId: number, order: string, companyGroupCode: string) {
    // const today = moment().format('YYYY/MM/DD');
    const evaluations = await this.evaluationEntity.findAll({
      attributes: ['id', 'userId', 'status'],
      where: { companyGroupCode: companyGroupCode },
      include: [
        {
          model: Evaluator,
          as: 'evaluator',
          attributes: ['evaluatorId', 'evaluationOrder', 'evaluationId'],
          where: { evaluatorId: userId, evaluationOrder: order },
        },
      ],
    });
    return evaluations;
  }

  async getLengthEvaluationPeriod(
    query: EvaluationQuery,
    userId: number,
    companyGroupCode: string,
  ) {
    const evaluations = await this.evaluationPeriodEntity.count({
      where: {
        year: {
          [Op.between]: [query.yearStart, query.yearEnd],
        },
        companyGroupCode: companyGroupCode,
      },
      include: [
        {
          model: Evaluation,
          as: 'evaluations',
          attributes: [
            'id',
            'departmentName',
            'divisionName',
            'companyName',
            'title',
            'periodStart',
            'periodEnd',
            'status',
            'level',
            'summaryPointEvaluator2',
            'percentPoint',
            'userId',
          ],
          where: {
            userId: userId || 0,
          },
          include: [
            {
              model: Evaluator,
              as: 'evaluator',
              attributes: ['evaluatorId', 'evaluationOrder'],
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['fullName'],
                },
              ],
            },
            {
              model: User,
              as: 'user',
              attributes: ['fullName', 'employeeNumber'],
              include: [
                {
                  model: Department,
                  as: 'department',
                },
              ],
            },
          ],
        },
        {
          model: EvaluatorDefault,
          as: 'evaluatorDefault',
          required: true,
          where: {
            userId: userId || 0,
          },
        },
      ],
      distinct: true,
    });
    return evaluations;
  }

  async getEvaluationByUserId(id: any, companyGroupCode: string) {
    const arrayWheres = [];

    const userInfo = await this.userEntity.findOne({
      attributes: ['level', 'flagSkill'],
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['name'],
        },
        {
          model: Department,
          as: 'division',
          attributes: ['name'],
        },
      ],
      where: { id: id },
    });

    // const periodTitle = `${EvaluationPeriodHelper.getCurrentPeriodYear()}年${EvaluationPeriodHelper.getCurrentPeriodIndex()}`;
    // arrayWheres.push({ title: periodTitle });
    arrayWheres.push({ userId: id });
    arrayWheres.push({ creationUser: { [Op.eq]: null } });
    arrayWheres.push({ companyGroupCode: companyGroupCode });
    arrayWheres.push({ status: { [Op.lt]: 50 } });
    if (userInfo) {
      arrayWheres.push({
        level: userInfo?.level,
      });

      arrayWheres.push({
        flagSkill: userInfo?.flagSkill,
      });

      if (userInfo?.division?.name) {
        arrayWheres.push({
          divisionName: userInfo?.division?.name,
        });
      }

      if (userInfo?.department?.name) {
        arrayWheres.push({
          departmentName: userInfo?.department?.name,
        });
      }
    }
    return await this.evaluationEntity.findAll({
      attributes: ['level'],
      where: {
        [Op.and]: arrayWheres,
      },
      include: [
        {
          model: EvaluationPeriod,
          as: 'evaluationPeriod',
          attributes: [
            'dateCreationGoalStart',
            'dateCreationGoalEnd',
            'dateCreationGoalDepartmentStart',
            'dateCreationGoalDepartmentEnd',
          ],
        },
      ],
      logging: true,
    });
  }

  async getUserDetailById(id: any) {
    return await this.userEntity.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'code', 'name'],
        },
        {
          model: Department,
          as: 'division',
          attributes: ['id', 'code', 'name'],
        },
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name'],
        },
        {
          model: Role,
          as: 'roles',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
      attributes: [
        'id',
        'employeeNumber',
        'fullName',
        'email',
        'departmentId',
        'divisionId',
        'companyId',
        'level',
        'updatedTime',
        'flagSkill',
      ],
    });
  }

  async searchListUserSettingEvaluator(query: any) {
    const skill = query.skill;
    const level = query.level;
    const flagSkill = query.flagSkill;
    const userName = query.userName.trim();
    const evaluatorName = query.evaluatorName.trim();
    const limit = query.limit;
    const offset = query.offset;
    const departmentName = query.department;
    const companyGroupCode = query.companyGroupCode;
    const divisionId = query.divisionId ? parseInt(query.divisionId) : null;
    const departmentId = query.departmentId
      ? parseInt(query.departmentId)
      : null;

    const year = query.year;
    const periodIndex = query.periodIndex;

    const dataEvaluationPeroid = await this.evaluationPeriodEntity.findOne({
      attributes: ['id'],
      where: {
        year: year,
        periodIndex: periodIndex,
        companyGroupCode: companyGroupCode,
      },
    });

    //* Lấy tất cả user không phân biệt exception hay tabMode
    let statement = '';
    const condition: any = {};

    statement += ' AND ED.COMPANY_GROUP_CODE = :companyGroupCode';
    condition['companyGroupCode'] = companyGroupCode;

    if (dataEvaluationPeroid.id) {
      statement += ' AND ED.EVALUATION_PERIOD_ID = :evaluationPeriodId';
      condition['evaluationPeriodId'] = dataEvaluationPeroid.id;
    }

    if (divisionId) {
      statement += ' AND ED.DIVISION_ID = :divisionId';
      condition['divisionId'] = divisionId;
    }
    if (departmentId) {
      statement += ' AND ED.DEPARTMENT_ID = :departmentId';
      condition['departmentId'] = departmentId;
    } else if (!divisionId) {
      // Name-based search only when no ID is provided
      if (departmentName === 'すべて') {
        statement +=
          ' AND ( ED.DEPARTMENT_NAME IS NOT NULL OR ED.DIVISION_NAME IS NOT NULL )';
      } else {
        statement +=
          ' AND ( ED.DEPARTMENT_NAME LIKE :depDivName OR ED.DIVISION_NAME LIKE :depDivName )';
        condition['depDivName'] = `%${departmentName[0]}%`;
      }
    }

    if (skill !== 'すべて') {
      statement += ' AND ( SU.SKILL_ID = :skillId )';
      condition['skillId'] = parseInt(skill);
    }

    if (level === 'すべて') {
      statement += ' AND ED.LEVEL IS NOT NULL';
    } else {
      statement += ' AND ED.LEVEL = :level';
      condition['level'] = parseInt(level);
    }

    if (flagSkill === 'すべて') {
      statement += ' AND ED.FLAG_SKILL IS NOT NULL';
    } else {
      statement += ' AND ED.FLAG_SKILL = :flagSkill';
      condition['flagSkill'] = parseInt(flagSkill);
    }

    if (userName.length !== 0) {
      statement +=
        ' AND ( U.FULL_NAME LIKE :userName OR U.EMPLOYEE_NUMBER LIKE :userName OR U.EMAIL LIKE :userName )';
      condition['userName'] = `%${userName}%`;
    }

    if (evaluatorName.length !== 0) {
      statement +=
        ' AND ' +
        ' ( ' +
        // Check evaluators stored directly in EVALUATOR_DEFAULT_TBL (evaluator_0_5_id / 1_id / 2_id)
        '   ( U1.FULL_NAME LIKE :evaluatorName OR U1.EMPLOYEE_NUMBER LIKE :evaluatorName OR U1.EMAIL LIKE :evaluatorName ) ' +
        '   OR ( U2.FULL_NAME LIKE :evaluatorName OR U2.EMPLOYEE_NUMBER LIKE :evaluatorName OR U2.EMAIL LIKE :evaluatorName ) ' +
        '   OR ( U3.FULL_NAME LIKE :evaluatorName OR U3.EMPLOYEE_NUMBER LIKE :evaluatorName OR U3.EMAIL LIKE :evaluatorName ) ' +
        // Also check evaluators in EVALUATOR_TBL for personal exception evaluations
        '   OR EXISTS ( ' +
        '     SELECT 1 FROM EVALUATION_TBL EVT_SRCH ' +
        '     JOIN EVALUATOR_TBL EVTR_SRCH ON EVTR_SRCH.EVALUATION_ID = EVT_SRCH.ID ' +
        '     JOIN USER_TBL U_EVTR ON U_EVTR.ID = EVTR_SRCH.EVALUATOR_ID ' +
        '     WHERE EVT_SRCH.USER_ID = ED.USER_ID ' +
        '       AND EVT_SRCH.EVALUATION_PERIOD_ID = ED.EVALUATION_PERIOD_ID ' +
        '       AND EVT_SRCH.CREATION_USER IS NOT NULL ' +
        '       AND ( U_EVTR.FULL_NAME LIKE :evaluatorName OR U_EVTR.EMPLOYEE_NUMBER LIKE :evaluatorName OR U_EVTR.EMAIL LIKE :evaluatorName ) ' +
        '   ) ' +
        ' ) ';
      condition['evaluatorName'] = `%${evaluatorName}%`;
    }

    const queryUserId = `
                SELECT DISTINCT (ED.USER_ID) AS "userId"
                FROM EVALUATOR_DEFAULT_TBL ED
                         INNER JOIN COMPANY_GROUP_TBL CGT ON ED.COMPANY_GROUP_CODE = CGT.CODE
                         LEFT JOIN USER_TBL U ON U.ID = ED.USER_ID
                         LEFT JOIN USER_TBL U1 ON U1.ID = ED.EVALUATOR_0_5_ID
                         LEFT JOIN USER_TBL U2 ON U2.ID = ED.EVALUATOR_1_ID
                         LEFT JOIN USER_TBL U3 ON U3.ID = ED.EVALUATOR_2_ID
                         LEFT JOIN SKILL_USER_TBL SU ON SU.PERIOD_ID = ED.EVALUATION_PERIOD_ID
                    AND SU.EVALUATION_ID IS NULL
                    AND ED.USER_ID = SU.USER_ID
                WHERE 1 = 1 ${statement}
            `;

    const finalData = await this.evaluatorDefaultEntity.sequelize.query(
      queryUserId,
      {
        nest: true,
        replacements: condition,
        logging: false,
      },
    );

    let listUsersId = [];
    finalData.map((item: any) => {
      listUsersId.push(item.userId);
    });

    const sqlResult = `
            SELECT U.ID                                               AS "userId",
                   U.FULL_NAME                                        AS "fullName",
                   U.EMPLOYEE_NUMBER                                  AS "employeeNumber",
                   U.EMAIL                                            AS "email",
                   U.ACTIVE,
                   U.LEVEL,
                   U.ID,
                   CASE
                       WHEN EXISTS (
                           SELECT 1 FROM EVALUATION_TBL ET3
                           WHERE ET3.USER_ID = ED.USER_ID
                             AND ET3.EVALUATION_PERIOD_ID = :periodId
                             AND ET3.COMPANY_GROUP_CODE = :companyGroupCode
                             AND ET3.CREATION_USER IS NOT NULL
                       ) THEN 'personal'
                       WHEN (
                           ED.DEPARTMENT_ID IN (
                               SELECT EPDS2.DEPARTMENT_ID FROM EVALUATION_PERIOD_DEPARTMENT_SETTING_TBL EPDS2
                               WHERE EPDS2.EVALUATION_PERIOD_ID = :periodId
                                 AND EPDS2.COMPANY_GROUP_CODE = :companyGroupCode
                           ) OR ED.DIVISION_ID IN (
                               SELECT EPDS2.DEPARTMENT_ID FROM EVALUATION_PERIOD_DEPARTMENT_SETTING_TBL EPDS2
                               WHERE EPDS2.EVALUATION_PERIOD_ID = :periodId
                                 AND EPDS2.COMPANY_GROUP_CODE = :companyGroupCode
                           )
                       ) THEN 'department'
                       ELSE 'company'
                   END                                                AS "settingType",
                   (SELECT JSONB_BUILD_OBJECT('name', C.NAME, 'id', C.ID)
                    FROM COMPANY_TBL C
                    WHERE C.ID = U.COMPANY_ID)                        AS "company",

                   (SELECT JSONB_BUILD_OBJECT('name', DEP.NAME, 'id', DEP.ID, 'code', DEP.CODE)
                    FROM DEPARTMENT_TBL DEP
                    WHERE DEP.ID = U.DEPARTMENT_ID
                      AND DEP.COMPANY_GROUP_CODE = :companyGroupCode) AS "department",

                   (SELECT JSONB_BUILD_OBJECT('name', DIV.NAME, 'id', DIV.ID, 'code', DIV.CODE)
                    FROM DEPARTMENT_TBL DIV
                    WHERE DIV.ID = U.DIVISION_ID
                      AND DIV.COMPANY_GROUP_CODE = :companyGroupCode) AS "division",

                   (SELECT JSONB_BUILD_OBJECT(
                                   'departmentName',
                                   ED2.DEPARTMENT_NAME,
                                   'level',
                                   ED2.LEVEL,
                                   'flagSkill',
                                   ED2.FLAG_SKILL,
                                   'divisionName',
                                   ED2.DIVISION_NAME,
                                   'dateCreationGoalStart',
                                   COALESCE(
                                       (SELECT ET2.DATE_CREATION_GOAL_START
                                        FROM EVALUATION_TBL ET2
                                        WHERE ET2.USER_ID = ED2.USER_ID
                                          AND ET2.EVALUATION_PERIOD_ID = :periodId
                                          AND ET2.COMPANY_GROUP_CODE = :companyGroupCode
                                          AND ET2.CREATION_USER IS NULL
                                        LIMIT 1),
                                       EPT3.DATE_CREATION_GOAL_START
                                   ),
                                   'dateCreationGoalEnd',
                                   COALESCE(
                                       (SELECT ET2.DATE_CREATION_GOAL_END
                                        FROM EVALUATION_TBL ET2
                                        WHERE ET2.USER_ID = ED2.USER_ID
                                          AND ET2.EVALUATION_PERIOD_ID = :periodId
                                          AND ET2.COMPANY_GROUP_CODE = :companyGroupCode
                                          AND ET2.CREATION_USER IS NULL
                                        LIMIT 1),
                                       EPT3.DATE_CREATION_GOAL_END
                                   ),
                                   'dateEvaluationStart',
                                   COALESCE(
                                       (SELECT ET2.DATE_EVALUATION_START
                                        FROM EVALUATION_TBL ET2
                                        WHERE ET2.USER_ID = ED2.USER_ID
                                          AND ET2.EVALUATION_PERIOD_ID = :periodId
                                          AND ET2.COMPANY_GROUP_CODE = :companyGroupCode
                                          AND ET2.CREATION_USER IS NULL
                                        LIMIT 1),
                                       EPT3.DATE_EVALUATION_START
                                   ),
                                   'dateEvaluationEnd',
                                   COALESCE(
                                       (SELECT ET2.DATE_EVALUATION_END
                                        FROM EVALUATION_TBL ET2
                                        WHERE ET2.USER_ID = ED2.USER_ID
                                          AND ET2.EVALUATION_PERIOD_ID = :periodId
                                          AND ET2.COMPANY_GROUP_CODE = :companyGroupCode
                                          AND ET2.CREATION_USER IS NULL
                                        LIMIT 1),
                                       EPT3.DATE_EVALUATION_END
                                   ),
                                   'evaluator05',
                                   (SELECT JSONB_BUILD_OBJECT(
                                                   'id',
                                                   UT1.ID,
                                                   'employeeNumber',
                                                   UT1.EMPLOYEE_NUMBER,
                                                   'fullName',
                                                   UT1.FULL_NAME,
                                                   'email',
                                                   UT1.EMAIL
                                           )
                                    FROM USER_TBL UT1
                                    WHERE UT1.ID = ED2.EVALUATOR_0_5_ID
                                      AND UT1.COMPANY_GROUP_CODE = :companyGroupCode),
                                   'evaluator1',
                                   (SELECT JSONB_BUILD_OBJECT(
                                                   'id',
                                                   UT2.ID,
                                                   'employeeNumber',
                                                   UT2.EMPLOYEE_NUMBER,
                                                   'fullName',
                                                   UT2.FULL_NAME,
                                                   'email',
                                                   UT2.EMAIL
                                           )
                                    FROM USER_TBL UT2
                                    WHERE UT2.ID = ED2.EVALUATOR_1_ID
                                      AND UT2.COMPANY_GROUP_CODE = :companyGroupCode),
                                   'evaluator2',
                                   (SELECT JSONB_BUILD_OBJECT(
                                                   'id',
                                                   UT3.ID,
                                                   'employeeNumber',
                                                   UT3.EMPLOYEE_NUMBER,
                                                   'fullName',
                                                   UT3.FULL_NAME,
                                                   'email',
                                                   UT3.EMAIL
                                           )
                                    FROM USER_TBL UT3
                                    WHERE UT3.ID = ED2.EVALUATOR_2_ID
                                      AND UT3.COMPANY_GROUP_CODE = :companyGroupCode)
                           )
                    FROM EVALUATOR_DEFAULT_TBL ED2
                    LEFT JOIN EVALUATION_PERIOD_TBL EPT3 ON EPT3.ID = ED2.EVALUATION_PERIOD_ID
                    WHERE ED2.EVALUATION_PERIOD_ID = :periodId
                      AND ED2.ID = ED.ID
                      AND ED2.COMPANY_GROUP_CODE = :companyGroupCode) AS "evaluatorDefault",

                   (SELECT JSONB_AGG(ROW_TO_JSON(T)) AS "skillUser"
                    FROM (SELECT SUT.TYPE,
                                 SUT.PERIOD_ID          AS "periodId",
                                 SUT.USER_ID            AS "userId",
                                 SUT.EVALUATION_ID      AS "evaluationId",
                                 SUT.SKILL_ID           AS "skillId",
                                 (SELECT JSONB_BUILD_OBJECT('name', ST.NAME, 'id', ST.ID)
                                  FROM SKILL_TBL ST
                                  WHERE ST.ID = SUT.SKILL_ID
                                    AND ST.COMPANY_GROUP_CODE = :companyGroupCode
                                  ORDER BY ST.NAME ASC) AS "skill"
                          FROM SKILL_USER_TBL SUT
                          WHERE SUT.EVALUATION_ID IS NULL
                            AND SUT.PERIOD_ID = :periodId
                            AND SUT.USER_ID = ED.USER_ID) AS T),

                   (SELECT JSONB_AGG(ROW_TO_JSON(T)) AS "childrens"
                    FROM (SELECT ET.ID,
                                 ET.COMPANY_NAME             AS "companyName",
                                 ET.UPDATED_TIME             AS "updatedTime",
                                 ET.EVALUATION_PERIOD_ID     AS "evaluationPeriodId",
                                 ET.DEPARTMENT_NAME          AS "departmentName",
                                 ET.DEPARTMENT_ID            AS "departmentId",
                                 ET.DIVISION_NAME            AS "divisionName",
                                 ET.DIVISION_ID              AS "divisionId",
                                 ET.PERIOD_START             AS "periodStart",
                                 ET.PERIOD_END               AS "periodEnd",
                                 ET.LEVEL,
                                 ET.DATE_CREATION_GOAL_START AS "dateCreationGoalStart",
                                 ET.DATE_CREATION_GOAL_END   AS "dateCreationGoalEnd",
                                 ET.DATE_EVALUATION_START    AS "dateEvaluationStart",
                                 ET.DATE_EVALUATION_END      AS "dateEvaluationEnd",
                                 ET.CREATED_BY_CRONJOB       AS "createdByCronjob",
                                 ET.FLAG_SKILL               AS "flagSkill",
                                 ET.PERCENT_POINT            AS "percentPoint",
                                 ET.USER_ID AS "userId",
                                 EPT.YEAR,
                                 EPT.PERIOD_INDEX            AS "periodIndex",
                                 (SELECT JSONB_AGG(ROW_TO_JSON(T)) AS "skillUser"
                                  FROM (SELECT SUT.TYPE,
                                               SUT.PERIOD_ID          AS "periodId",
                                               SUT.USER_ID            AS "userId",
                                               SUT.EVALUATION_ID      AS "evaluationId",
                                               SUT.SKILL_ID           AS "skillId",
                                               (SELECT JSONB_BUILD_OBJECT('name', ST.NAME, 'id', ST.ID)
                                                FROM SKILL_TBL ST
                                                WHERE ST.ID = SUT.SKILL_ID
                                                  AND ST.COMPANY_GROUP_CODE = :companyGroupCode
                                                ORDER BY ST.NAME ASC) AS "skill"
                                        FROM SKILL_USER_TBL SUT
                                        WHERE SUT.EVALUATION_ID IS NOT NULL
                                          AND SUT.PERIOD_ID = :periodId
                                          AND SUT.USER_ID = ET.USER_ID
                                          AND SUT.EVALUATION_ID = ET.ID) AS T),

                                 (SELECT JSONB_AGG(ROW_TO_JSON(T)) AS "evaluator"
                                  FROM (SELECT EVAT.EVALUATION_ORDER                 AS "evaluationOrder",
                                               (SELECT JSONB_BUILD_OBJECT(
                                                               'id',
                                                               UTEVAT.ID,
                                                               'employeeNumber',
                                                               UTEVAT.EMPLOYEE_NUMBER,
                                                               'fullName',
                                                               UTEVAT.FULL_NAME,
                                                               'email',
                                                               UTEVAT.EMAIL
                                                       )
                                                FROM USER_TBL UTEVAT
                                                WHERE UTEVAT.ID = EVAT.EVALUATOR_ID) AS "user"
                                        FROM EVALUATOR_TBL EVAT
                                        WHERE EVAT.EVALUATION_ID = ET.ID) AS T),
                                (
                                    SELECT
                                      JSONB_BUILD_OBJECT(
                                        'dateCreationGoalStart',
                                        EVAPT2.DATE_CREATION_GOAL_START,
                                        'dateCreationGoalEnd',
                                        EVAPT2.DATE_CREATION_GOAL_END,
                                        'dateCreationGoalDepartmentStart',
                                        EVAPT2.DATE_CREATION_GOAL_DEPARTMENT_START,
                                        'dateCreationGoalDepartmentEnd',
                                        EVAPT2.DATE_CREATION_GOAL_DEPARTMENT_END,
                                        'dateEvaluationStart',
                                        EVAPT2.DATE_EVALUATION_START,
                                        'dateEvaluationEnd',
                                        EVAPT2.DATE_EVALUATION_END,
                                        'dateEvaluationDepartmentStart',
                                        EVAPT2.DATE_EVALUATION_DEPARTMENT_START,
                                        'dateEvaluationDepartmentEnd',
                                        EVAPT2.DATE_EVALUATION_DEPARTMENT_END
                                      )
                                    FROM
                                      EVALUATION_PERIOD_TBL EVAPT2
                                    WHERE
                                      EVAPT2.ID = :periodId
                                      AND EVAPT2.COMPANY_GROUP_CODE = :companyGroupCode
                                  ) AS "timeCommon"

                          FROM EVALUATION_TBL ET
                                   LEFT JOIN EVALUATION_PERIOD_TBL EPT ON EPT.ID = ET.EVALUATION_PERIOD_ID
                          WHERE ET.CREATION_USER IS NOT NULL
                            AND ET.EVALUATION_PERIOD_ID = :periodId
                            AND ET.USER_ID = ED.USER_ID
                            AND ET.COMPANY_GROUP_CODE = :companyGroupCode
                          ORDER BY TO_DATE(ET.PERIOD_START, 'YYYY/MM') DESC) AS T)

            FROM EVALUATOR_DEFAULT_TBL ED
                     LEFT JOIN USER_TBL U ON ED.USER_ID = U.ID
            WHERE (
                      ED.USER_ID IN (:userId)
                          AND ED.EVALUATION_PERIOD_ID = :periodId
                          AND U.ACTIVE = 1
                          AND ED.COMPANY_GROUP_CODE = :companyGroupCode
                      )
            ORDER BY U.EMPLOYEE_NUMBER ASC LIMIT :limit
            OFFSET :offset
        `;

    const results = await this.evaluationEntity.sequelize.query(sqlResult, {
      nest: true,
      replacements: {
        periodId: dataEvaluationPeroid.id,
        userId: listUsersId.length > 0 ? listUsersId : -1,
        companyGroupCode: companyGroupCode,
        limit: limit,
        offset: offset,
      },
      logging: false,
    });
    results.forEach((item: any) => {
      if (item.childrens) {
        item.childrens.map((itemSub: any) => {
          //* evaluator 0.5
          let evaluator05Obj = itemSub?.evaluator?.find(
            ({ evaluationOrder }) => evaluationOrder === 0.5,
          );
          if (evaluator05Obj?.user) {
            itemSub.evaluator05 =
              evaluator05Obj?.user.employeeNumber +
              ': ' +
              evaluator05Obj?.user.fullName;

            itemSub.evaluator05Email = evaluator05Obj?.user.email;
            itemSub.evaluator05Id = evaluator05Obj?.user.id;
          }
          //* evaluator 1.0
          let evaluator1Obj = itemSub?.evaluator?.find(
            ({ evaluationOrder }) => evaluationOrder === 1,
          );
          if (evaluator1Obj?.user) {
            itemSub.evaluator10 =
              evaluator1Obj?.user.employeeNumber +
              ': ' +
              evaluator1Obj?.user.fullName;

            itemSub.evaluator10Email = evaluator1Obj?.user.email;
            itemSub.evaluator10Id = evaluator1Obj?.user.id;
          }
          //* evaluator 2.0
          let evaluator2Obj = itemSub?.evaluator?.find(
            ({ evaluationOrder }) => evaluationOrder === 2,
          );
          if (evaluator2Obj?.user) {
            itemSub.evaluator20 =
              evaluator2Obj?.user.employeeNumber +
              ': ' +
              evaluator2Obj?.user.fullName;

            itemSub.evaluator20Email = evaluator2Obj?.user.email;
            itemSub.evaluator20Id = evaluator2Obj?.user.id;
          }
          itemSub.userEmail = item.email;
        });
      }
    });

    return { data: results, counts: listUsersId.length };
  }

  async searchListUserSettingEvaluator2(query: any) {
    const skill = query.skill;
    const level = query.level;
    const flagSkill = query.flagSkill;
    const userName = query.userName.trim();
    const evaluatorName = query.evaluatorName.trim();
    const limit = query.limit;
    const offset = query.offset;
    const departmentName = query.department;
    const exception = query.exception;
    const evaluationPeriodId = query.id;

    const datas = (await this.evaluationEntity.sequelize.query(
      `select jsonb_agg("userId") "listUserId",
                    "count"
             from (select distinct("userId")      "userId",
                                  count("userId") over() as "count", "employeeNumber"
                   from v_list_f5_user_exception vlfue
                   where ("departmentName" like :departmentName
                       or "divisionName" like :departmentName)
                     and coalesce("skillId",
                                  0) = coalesce(:skill,
                                                "skillId",
                                                0)
                     and "level" = coalesce(:level,
                                            "level")
                     and "flagSkill" = coalesce(:flagSkill,
                                                "flagSkill")
                     and exception = coalesce (: exception
                       , "exception")
                     and ("fullName" like :userName
                      or "employeeNumber" like :userName
                      or "email" like :userName)
                     and (coalesce ("evaluator.fullName"
                       , '%') like coalesce (:evaluatorName
                       , "evaluator.fullName"
                       , '%')
                      or coalesce ("evaluator.employeeNumber"
                       , '%') like coalesce (:evaluatorName
                       , "evaluator.employeeNumber"
                       , '%')
                      or coalesce ("evaluator.email"
                       , '%') like coalesce (:evaluatorName
                       , "evaluator.email"
                       , '%'))
                     and "evaluationPeriodId" =:evaluationPeriodId
                   group by
                       "userId", "employeeNumber"
                   order by "employeeNumber" ASC
                   offset :offset limit :limit)
             group by "count";
            `,
      {
        nest: true,
        replacements: {
          departmentName: `%${
            departmentName === 'すべて' ? '' : departmentName
          }%`,
          skill: skill === 'すべて' ? null : skill,
          level: level === 'すべて' ? null : level,
          flagSkill: flagSkill === 'すべて' ? null : flagSkill,
          exception: exception === '-1' ? null : exception,
          userName: `%${userName}%`,
          evaluatorName: `%${evaluatorName}%`,
          offset: offset,
          limit: limit,
          evaluationPeriodId: evaluationPeriodId,
        },
      },
    )) as any;

    const listUsersId = datas[0]?.listUserId ? datas[0]?.listUserId : [];
    const test = (await this.evaluationEntity.sequelize.query(
      `select ut.id               "userId",
                    ut.active,
                    ut.employee_number  "employeeNumber",
                    ut.full_name        "fullName",
                    ut.flag_skill,
                    ut."level",
                    ct.id               "company.id",
                    ct.name             "company.name",
                    dt.id               "department.id",
                    dt.code             "department.code",
                    dt.name             "department.name",
                    dt2.id              "division.id",
                    dt2.code            "division.code",
                    dt2.name            "division.name",
                    edt.department_name "evaluatorDefault.departmentName",
                    edt.division_name   "evaluatorDefault.divisionName",
                    edt.flag_skill      "evaluatorDefault.flagSkill",
                    edt."level"         "evaluatorDefault.level",
                    case
                        when ut2.id is not null then jsonb_build_object('id', ut2.id, 'fullName', ut2.full_name,
                                                                        'employeeNumber', ut2.employee_number,
                                                                        'email', ut2.email)
                        else null end   "evaluatorDefault.evaluator05",
                    case
                        when ut3.id is not null then jsonb_build_object('id', ut3.id, 'fullName', ut3.full_name,
                                                                        'employeeNumber', ut3.employee_number,
                                                                        'email', ut3.email)
                        else null end   "evaluatorDefault.evaluator1",
                    case
                        when ut4.id is not null then jsonb_build_object('id', ut4.id, 'fullName', ut4.full_name,
                                                                        'employeeNumber', ut4.employee_number,
                                                                        'email', ut4.email)
                        else null end   "evaluatorDefault.evaluator2",
                    vsus."skillUser",
                    "childrens".childrens
             from user_tbl ut
                      left outer join company_tbl ct on
                 ct.id = ut.company_id
                      left outer join department_tbl dt on
                 dt.id = ut.department_id
                      left outer join department_tbl dt2 on
                 dt2.id = ut.division_id
                      left outer join evaluator_default_tbl edt on
                 edt.user_id = ut.id
                     and edt.evaluation_period_id = :periodId
                      left outer join user_tbl ut2 on
                 edt.evaluator_0_5_id = ut2.id
                      left outer join user_tbl ut3 on
                 edt.evaluator_1_id = ut3.id
                      left outer join user_tbl ut4 on
                 edt.evaluator_2_id = ut4.id
                      left outer join evaluation_tbl et on
                 et.user_id = ut.id
                     and et.evaluation_period_id = :periodId
                     and et.creation_user is not null
                      left outer join v_skill_user_skill vsus on
                 vsus."userId" = ut.id
                     and vsus."periodId" = :periodId
                     and vsus.type = 0
                     and vsus."evaluationId" is null
                      left outer join (select et.user_id                                     "userId",
                                              et.evaluation_period_id                        "periodId",
                                              jsonb_agg(jsonb_build_object('companyName',
                                                                           et.company_name,
                                                                           'createByCronJob',
                                                                           et.created_by_cronjob,
                                                                           'dateCreationGoalEnd',
                                                                           et.date_creation_goal_end,
                                                                           'dateCreationGoalStart',
                                                                           et.date_creation_goal_start,
                                                                           'dateEvaluationEnd',
                                                                           et.date_evaluation_end,
                                                                           'dateEvaluationStart',
                                                                           et.date_evaluation_start,
                                                                           'departmentName',
                                                                           et.department_name,
                                                                           'divisionName',
                                                                           et.division_name,
                                                                           'id',
                                                                           et.id,
                                                                           'flagSkill',
                                                                           et.flag_skill,
                                                                           'level',
                                                                           et.level,
                                                                           'evaluator', vee.user,
                                                                           'skillUser',
                                                                           vsus."skillUser",
                                                                           'evaluator05',
                                                                           vee.evaluator05,
                                                                           'evaluator10',
                                                                           vee.evaluator10,
                                                                           'evaluator20',
                                                                           vee.evaluator20)) "childrens"
                                       from evaluation_tbl et
                                                inner join evaluation_period_tbl ept on
                                           et.evaluation_period_id = ept.id
                                                inner join v_evaluation_evaluator vee on
                                           vee."evaluationId" = et.id
                                                left outer join v_skill_user_skill vsus on
                                           vsus."evaluationId" = et.id
                                               and type = 2
                                       where et.creation_user is not null
                                       group by et.user_id,
                                                et.evaluation_period_id
                                       order by "userId") childrens on
                 childrens."userId" = ut.id
                     and childrens."periodId" = :periodId
             where ut.id in (:listUserId)
             order by ut.employee_number ASC
            `,
      {
        nest: true,
        replacements: {
          periodId: evaluationPeriodId,
          listUserId: listUsersId.length > 0 ? listUsersId : -1,
        },
      },
    )) as any;

    return { data: test, counts: datas[0]?.count ? datas[0]?.count : 0 };
  }

  async getUserListForMail(condition: any, roleId: number[]) {
    return (await this.userEntity.findAll({
      where: condition,
      attributes: [
        'id',
        'employeeNumber',
        'fullName',
        'email',
        'companyId',
        'departmentId',
        'divisionId',
      ],
      include: [
        {
          model: Permission,
          as: 'permissions',
          where: { roleId: { [Op.in]: roleId } },
        },
        { model: Department, as: 'department' },
      ],
    })) as User[];
  }

  async getUserActiveByCondition(
    departmentId: number,
    companyId: number,
    periodId: number,
    searchInput: string,
    limit: number | undefined,
    offset: number | undefined,
  ) {
    const searchInputCondition =
      searchInput?.length > 0
        ? {
            [Op.or]: [
              { fullName: { [Op.iLike]: `%${searchInput}%` } },
              { email: { [Op.iLike]: `%${searchInput}%` } },
              { employeeNumber: { [Op.iLike]: `%${searchInput}%` } },
            ],
          }
        : { employeeNumber: { [Op.not]: null } };
    const departmentCondition = departmentId
      ? {
          [Op.or]: {
            departmentId,
            divisionId: departmentId,
          },
        }
      : {};
    const conditions = {
      active: 1,
      ...searchInputCondition,
      ...departmentCondition,
    };

    if (companyId) conditions['companyId'] = companyId;

    const users = await this.userEntity.findAll({
      where: {
        ...conditions,
      },

      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'code', 'name'],
        },
        { model: Company, as: 'company', attributes: ['id', 'name'] },
        {
          model: EvaluatorDefault,
          as: 'evaluatorDefault',
          where: { evaluationPeriodId: periodId },
        },
      ],
      order: [['employeeNumber', 'ASC']],
      limit: limit || 20,
      offset: offset || 0,
    });

    const count = await this.userEntity.count({
      where: {
        ...conditions,
      },

      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'code', 'name'],
        },
        { model: Company, as: 'company', attributes: ['id', 'name'] },
        {
          model: EvaluatorDefault,
          as: 'evaluatorDefault',
          where: { evaluationPeriodId: periodId },
        },
      ],
    });

    return { users, count };
  }

  async getListEvaluator(
    evaluationCreatorId: number | undefined,
    companyGroupCode: string,
  ) {
    const condition = evaluationCreatorId
      ? {
          id: { [Op.ne]: evaluationCreatorId },
        }
      : {};
    const listEvaluator = await this.userEntity.findAll({
      attributes: ['id', 'employeeNumber', 'fullName'],
      where: {
        active: 1,
        companyGroupCode: companyGroupCode,
        ...condition,
      },
      include: [
        {
          model: Role,
          as: 'roles',
          // through: { attributes: [] },
          attributes: [],
          where: { id: Roles.F2 },
        },
      ],

      order: [['employeeNumber', 'ASC']],
      logging: true,
    });
    return listEvaluator;
  }

  async updateSettingEvaluatorOfOneUser(query: any, companyGroupCode: string) {
    const skills = query.skills;
    const year = query.state.year;
    const periodIndex = query.state.periodIndex;
    const evaluatorHaft =
      query.evaluatorHaft === undefined ? null : query.evaluatorHaft;
    const evaluatorFirst =
      query.evaluatorFirst === undefined ? null : query.evaluatorFirst;
    const evaluatorSecond =
      query.evaluatorSecond === undefined ? null : query.evaluatorSecond;
    const userId = query.userId;

    let tempEvaluatorHaft = null;
    let tempEvaluatorFirst = null;
    let tempEvaluatorSecond = null;

    const listEvaluatorDeleted = [];
    const listCanNotDeleteEvaluator = [];

    let userNotRoleUserOrDeleted: User[];
    let checkEvaluator0_5 = 'notPermission';
    let checkEvaluator1_0 = 'notPermission';
    let checkEvaluator2_0 = 'notPermission';

    tempEvaluatorHaft = evaluatorHaft === null ? null : evaluatorHaft;
    tempEvaluatorFirst = evaluatorFirst === null ? null : evaluatorFirst;
    tempEvaluatorSecond = evaluatorSecond === null ? null : evaluatorSecond;
    let checkUserCanEdit = false;

    const findUserCanEdit = await User.findOne({
      attributes: ['employeeNumber', 'fullName'],
      where: {
        id: userId,
        active: 1,
        companyGroupCode: companyGroupCode,
      },
      include: [
        {
          model: Role,
          as: 'roles',
          where: {
            id: 1,
          },
        },
      ],
    });
    if (findUserCanEdit === null) {
      checkUserCanEdit = false;
      userNotRoleUserOrDeleted = await User.findAll({
        attributes: ['employeeNumber', 'fullName'],
        where: {
          id: userId,
          companyGroupCode: companyGroupCode,
        },
      });
    } else {
      checkUserCanEdit = true;
      userNotRoleUserOrDeleted = [];
    }

    /** check evaluator have role F2 or deleted */
    /** check 0.5 */
    if (tempEvaluatorHaft !== null) {
      const check = await User.findAll({
        attributes: ['id'],
        where: {
          id: tempEvaluatorHaft,
          active: 1,
          companyGroupCode: companyGroupCode,
        },
        include: [
          {
            model: Role,
            as: 'roles',
            where: {
              id: 2,
            },
          },
        ],
      });
      if (check.length === 0) {
        listEvaluatorDeleted.push(tempEvaluatorHaft);
        tempEvaluatorHaft = null;
      } else {
        checkEvaluator0_5 = 'permission';
        // eslint-disable-next-line no-self-assign
        tempEvaluatorHaft = tempEvaluatorHaft;
      }
    }
    /** check 1.0 */
    if (tempEvaluatorFirst !== null) {
      const check = await User.findAll({
        attributes: ['id'],
        where: {
          id: tempEvaluatorFirst,
          active: 1,
          companyGroupCode: companyGroupCode,
        },
        include: [
          {
            model: Role,
            as: 'roles',
            where: {
              id: 2,
            },
          },
        ],
      });
      if (check.length === 0) {
        listEvaluatorDeleted.push(tempEvaluatorFirst);
        tempEvaluatorFirst = null;
      } else {
        checkEvaluator1_0 = 'permission';
        // eslint-disable-next-line no-self-assign
        tempEvaluatorFirst = tempEvaluatorFirst;
      }
    }

    /** check 2.0 */
    if (tempEvaluatorSecond !== null) {
      const check = await User.findAll({
        attributes: ['id'],
        where: {
          id: tempEvaluatorSecond,
          active: 1,
          companyGroupCode: companyGroupCode,
        },
        include: [
          {
            model: Role,
            as: 'roles',
            where: {
              id: 2,
            },
          },
        ],
      });
      if (check.length === 0) {
        listEvaluatorDeleted.push(tempEvaluatorSecond);
        tempEvaluatorSecond = null;
      } else {
        checkEvaluator2_0 = 'permission';
        // eslint-disable-next-line no-self-assign
        tempEvaluatorSecond = tempEvaluatorSecond;
      }
    }
    if (checkUserCanEdit) {
      // user ko duoc xoa và phải còn quyền F1 mới có edit
      const financialPeriod = periodIndex === 1 ? '上期' : '下期';
      const financialYear = year;
      /** Tìm theo kỳ dể lấy data trong bảng evaluation */

      /** lấy danh sách evaluation_id để update table evaluator*/
      const listEvaluation = await this.evaluationEntity.findAll({
        attributes: ['id', 'status'],
        where: {
          [Op.and]: {
            title: `${financialYear}年${financialPeriod}`,
            userId: userId,
            creationUser: { [Op.eq]: null },
            companyGroupCode: companyGroupCode,
          },
        },
      });
      const dataEvaluationPeroid = await this.evaluationPeriodEntity.findOne({
        attributes: ['id'],
        where: {
          year: year,
          periodIndex: periodIndex,
          companyGroupCode: companyGroupCode,
        },
      });

      const transaction = await EvaluatorDefault.sequelize.transaction();

      try {
        //**Update skill của user trong bảng skill_user_tbl */
        const userInfo = await EvaluatorDefault.findOne({
          attributes: [
            'flagSkill',
            'evaluator05Id',
            'evaluator1Id',
            'evaluator2Id',
          ],
          where: {
            userId: userId,
            evaluationPeriodId: dataEvaluationPeroid.id,
            companyGroupCode: companyGroupCode,
          },
        });

        if (userInfo) {
          const evaluation = await this.evaluationEntity.findOne({
            attributes: ['id', 'status'],
            where: {
              userId: userId,
              evaluationPeriodId: dataEvaluationPeroid.id,
              creationUser: { [Op.is]: null },
            },
          });

          if (userInfo.flagSkill == 1 && skills?.length > 0) {
            //* xóa skill đã đăng ký trong evaluation nếu skill setting bị xóa trong giai đoạn đặt mục tiêu
            if (evaluation && evaluation.status < 50) {
              const temSkillAlreadySetting = await this.skillUserEntity.findAll(
                {
                  attributes: ['skillId'],
                  where: {
                    periodId: dataEvaluationPeroid.id,
                    userId: userId,
                    evaluationId: null,
                    type: 0,
                  },
                },
              );
              const skillAlreadySetting = [];
              if (temSkillAlreadySetting.length > 0) {
                temSkillAlreadySetting.map((item: any) => {
                  skillAlreadySetting.push(item.skillId);
                });
              }
              const skillDelete = findDeletedIdsSkill(
                skills,
                skillAlreadySetting,
              );

              if (skillDelete.length > 0) {
                await this.evaluationEntity.sequelize.query(
                  'CALL delete_skill_evaluation(ARRAY[:skillDelete], :evaluationId, :companyGroupCode)',
                  {
                    replacements: {
                      skillDelete: skillDelete,
                      evaluationId: evaluation.id,
                      companyGroupCode: companyGroupCode,
                    },
                    type: QueryTypes.RAW, // Hoặc QueryTypes.SELECT nếu bạn muốn xử lý kết quả
                    logging: false,
                  },
                );
              }
            }

            //* Update skill mới
            await this.skillUserEntity.destroy({
              where: {
                periodId: dataEvaluationPeroid.id,
                userId: userId,
                type: 0,
              },
              transaction: transaction,
            });

            const listSkillUpdate = [];
            for (let i = 0; i < skills.length; i++) {
              const element = skills[i];
              listSkillUpdate.push({
                userId: userId,
                skillId: element,
                periodId: dataEvaluationPeroid.id,
                evaluationId: null,
                type: 0,
              });
            }

            if (evaluation) {
              for (let i = 0; i < skills.length; i++) {
                const element = skills[i];
                listSkillUpdate.push({
                  userId: userId,
                  skillId: element,
                  periodId: dataEvaluationPeroid.id,
                  evaluationId: evaluation.id,
                  type: 0,
                });
              }
            }

            await this.skillUserEntity.bulkCreate(listSkillUpdate, {
              transaction: transaction,
            });
          }
        }

        /** Update data in table evaluator_default_tbl */

        /** Change evaluator not delete */
        /** update 2.0 */
        if (tempEvaluatorSecond !== null) {
          await EvaluatorDefault.update(
            {
              evaluator_2_id:
                checkEvaluator2_0 === 'permission' ? tempEvaluatorSecond : null,
            },
            {
              where: {
                userId: userId,
                evaluationPeriodId: dataEvaluationPeroid.id,
                companyGroupCode: companyGroupCode,
              },
              returning: true,
              transaction: transaction,
            },
          );
        }

        /** update 1.0 */
        if (tempEvaluatorFirst !== null) {
          await EvaluatorDefault.update(
            {
              evaluator_1_id:
                checkEvaluator1_0 === 'permission' ? tempEvaluatorFirst : null,
            },
            {
              where: {
                userId: userId,
                evaluationPeriodId: dataEvaluationPeroid.id,
                companyGroupCode: companyGroupCode,
              },
              returning: true,
              transaction: transaction,
            },
          );
        }

        /** update 0.5 */
        if (tempEvaluatorHaft !== null) {
          await EvaluatorDefault.update(
            {
              evaluator_0_5_id:
                checkEvaluator0_5 === 'permission' ? tempEvaluatorHaft : null,
            },
            {
              where: {
                userId: userId,
                evaluationPeriodId: dataEvaluationPeroid.id,
                companyGroupCode: companyGroupCode,
              },
              returning: true,
              transaction: transaction,
            },
          );
        }

        /** Delete evalautor 0.5, 1.0  */
        if (listEvaluation.length === 0) {
          /** xóa người dánh giá dược setting cho kỳ tiếp theo */
          /** delete 0.5 */
          if (tempEvaluatorHaft === null) {
            await EvaluatorDefault.update(
              {
                evaluator_0_5_id: null,
              },
              {
                where: {
                  userId: userId,
                  evaluationPeriodId: dataEvaluationPeroid.id,
                  companyGroupCode: companyGroupCode,
                },
                returning: true,
                transaction: transaction,
              },
            );
          }

          if (tempEvaluatorFirst === null) {
            await EvaluatorDefault.update(
              {
                evaluator_1_id: null,
              },
              {
                where: {
                  userId: userId,
                  evaluationPeriodId: dataEvaluationPeroid.id,
                  companyGroupCode: companyGroupCode,
                },
                returning: true,
                transaction: transaction,
              },
            );
          }
        } else {
          /** xóa người dánh giá dược setting trong kỳ hiện tại và check theo status */
          for (let i = 0; i < listEvaluation.length; i++) {
            /** delete 0.5 */
            if (
              tempEvaluatorHaft === null &&
              ![3, 4, 53, 54, 55].includes(listEvaluation[i].status)
            ) {
              await EvaluatorDefault.update(
                {
                  evaluator_0_5_id: null,
                },
                {
                  where: {
                    userId: userId,
                    evaluationPeriodId: dataEvaluationPeroid.id,
                    companyGroupCode: companyGroupCode,
                  },
                  returning: true,
                  transaction: transaction,
                },
              );
            } else if (
              tempEvaluatorHaft === null &&
              [3, 4, 53, 54, 55].includes(listEvaluation[i].status) &&
              query.getValueDelete05
            ) {
              listCanNotDeleteEvaluator.push(query.getValueDelete05);
            }
            /** update 1.0 */
            if (
              tempEvaluatorFirst === null &&
              ![5, 6, 56, 57, 58].includes(listEvaluation[i].status)
            ) {
              await EvaluatorDefault.update(
                {
                  evaluator_1_id: null,
                },
                {
                  where: {
                    userId: userId,
                    evaluationPeriodId: dataEvaluationPeroid.id,
                    companyGroupCode: companyGroupCode,
                  },
                  returning: true,
                  transaction: transaction,
                },
              );
            } else if (
              tempEvaluatorFirst === null &&
              [5, 6, 56, 57, 58].includes(listEvaluation[i].status) &&
              query.getValueDelete10
            ) {
              listCanNotDeleteEvaluator.push(query.getValueDelete10);
            }
          }
        }

        /** End update data in table evaluator_default_tbl */

        /** Update table evaluator_tbl */
        /** lấy danh sách các evaluator theo listEvaluation  */
        if (listEvaluation.length > 0) {
          for (let i = 0; i < listEvaluation.length; i++) {
            const item = listEvaluation[i];
            /** xóa các evaluator*/
            if (
              tempEvaluatorHaft === null &&
              ![3, 4, 53, 54, 55].includes(item.status)
            ) {
              await this.evaluatorEntity.destroy({
                where: {
                  [Op.and]: [
                    {
                      evaluationId: item.id,
                      evaluationOrder: 0.5,
                    },
                  ],
                },
                transaction: transaction,
              });
            }
            if (
              tempEvaluatorFirst === null &&
              ![5, 6, 56, 57, 58].includes(item.status)
            ) {
              await this.evaluatorEntity.destroy({
                where: {
                  [Op.and]: [
                    {
                      evaluationId: item.id,
                      evaluationOrder: 1.0,
                    },
                  ],
                },
                transaction: transaction,
              });
            }
            if (tempEvaluatorSecond === null) {
              await this.evaluatorEntity.destroy({
                where: {
                  [Op.and]: [
                    {
                      evaluationId: item.id,
                      evaluationOrder: 2.0,
                    },
                  ],
                },
                transaction: transaction,
              });
            }
            /** update data mới vào bảng evaluator*/
            if (tempEvaluatorHaft !== null) {
              await this.evaluatorEntity.update(
                {
                  evaluatorId:
                    checkEvaluator0_5 === 'permission'
                      ? tempEvaluatorHaft
                      : null,
                },
                {
                  where: {
                    [Op.and]: [
                      {
                        evaluationId: item.id,
                        evaluationOrder: 0.5,
                      },
                    ],
                  },
                  transaction: transaction,
                },
              );
            }
            if (tempEvaluatorFirst !== null) {
              await this.evaluatorEntity.update(
                {
                  evaluatorId:
                    checkEvaluator1_0 === 'permission'
                      ? tempEvaluatorFirst
                      : null,
                },
                {
                  where: {
                    [Op.and]: [
                      {
                        evaluationId: item.id,
                        evaluationOrder: 1.0,
                      },
                    ],
                  },
                  transaction: transaction,
                },
              );
            }
            if (tempEvaluatorSecond !== null) {
              await this.evaluatorEntity.update(
                {
                  evaluatorId:
                    checkEvaluator2_0 === 'permission'
                      ? tempEvaluatorSecond
                      : null,
                },
                {
                  where: {
                    [Op.and]: [
                      {
                        evaluationId: item.id,
                        evaluationOrder: 2.0,
                      },
                    ],
                  },
                  transaction: transaction,
                },
              );

              /** them mới cho các user chưa có người đánh giá  */
              /** tao 0.5 */
              const checkExitEvaluator0_5 = await this.evaluatorEntity.findOne({
                where: {
                  [Op.and]: [
                    {
                      evaluationId: item.id,
                      evaluationOrder: 0.5,
                    },
                  ],
                },
                transaction: transaction,
              });
              if (
                checkExitEvaluator0_5 === null &&
                tempEvaluatorHaft !== null
              ) {
                await this.evaluatorEntity.create(
                  {
                    evaluationId: item.id,
                    evaluatorId:
                      checkEvaluator0_5 === 'permission'
                        ? tempEvaluatorHaft
                        : null,
                    evaluationOrder: 0.5,
                    commentPublic: null,
                    commentPrivate: null,
                  },
                  { transaction: transaction },
                );
              }

              /** tao 1.0 */
              const checkExitEvaluator1 = await this.evaluatorEntity.findOne({
                where: {
                  [Op.and]: [
                    {
                      evaluationId: item.id,
                      evaluationOrder: 1.0,
                    },
                  ],
                },
                transaction: transaction,
              });
              if (checkExitEvaluator1 === null && tempEvaluatorFirst !== null) {
                await this.evaluatorEntity.create(
                  {
                    evaluationId: item.id,
                    evaluatorId:
                      checkEvaluator1_0 === 'permission'
                        ? tempEvaluatorFirst
                        : null,
                    evaluationOrder: 1.0,
                    commentPublic: null,
                    commentPrivate: null,
                  },
                  { transaction: transaction },
                );
              }

              /** tao 2.0 */
              const checkExitEvaluator2 = await this.evaluatorEntity.findOne({
                where: {
                  [Op.and]: [
                    {
                      evaluationId: item.id,
                      evaluationOrder: 2.0,
                    },
                  ],
                },
                transaction: transaction,
              });
              if (
                checkExitEvaluator2 === null &&
                tempEvaluatorSecond !== null
              ) {
                await this.evaluatorEntity.create(
                  {
                    evaluationId: item.id,
                    evaluatorId:
                      checkEvaluator2_0 === 'permission'
                        ? tempEvaluatorSecond
                        : null,
                    evaluationOrder: 2.0,
                    commentPublic: null,
                    commentPrivate: null,
                  },
                  { transaction: transaction },
                );
              }
            }
          }
        }
        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        throw new RuntimeException(
          error,
          error?.status ||
            error?.statusCode ||
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      /** End update table evaluator_tbl */
    }

    /** get user information cannot set evaluator by delete or not have role F2*/
    const evaluatorNotRoleEvaluatorOrDeleted: User[] = await User.findAll({
      attributes: ['employeeNumber', 'fullName'],
      where: {
        id: listEvaluatorDeleted,
        companyGroupCode: companyGroupCode,
      },
    });

    /** get evalutor information cannot delete have status*/
    const evaluatorCanNotDelete: User[] = await User.findAll({
      attributes: ['employeeNumber', 'fullName'],
      where: {
        id: listCanNotDeleteEvaluator,
        companyGroupCode: companyGroupCode,
      },
    });

    return {
      userDeleted: userNotRoleUserOrDeleted,
      evaluatorDeleted: evaluatorNotRoleEvaluatorOrDeleted,
      evaluatorCanNotDeleted: evaluatorCanNotDelete,
    };
  }

  async updateSettingEvaluatorListUser(query: any, companyGroupCode: string) {
    const typeEdit = query.typeEdit;
    const skills = query.skills;
    const evaluatorHaft = query.evaluatorHaft;
    const evaluatorFirst = query.evaluatorFirst;
    const evaluatorSecond = query.evaluatorSecond;

    const listIdUserSelected = [];
    let listUserCanEdit = [];
    let listUserCanNotEdit = [];
    const listSettingEvaluator = [];
    let userInForNotEdit: User[];
    let userInForNotRoleUserOrDeleted: User[];
    let evaluatorNotRoleEvaluatorOrDeleted: User[];
    const year = query.state.year;
    const periodIndex = query.state.periodIndex;

    if (evaluatorHaft !== '変更しない') {
      listSettingEvaluator.push(evaluatorHaft);
    }
    if (evaluatorFirst !== '変更しない') {
      listSettingEvaluator.push(evaluatorFirst);
    }
    if (evaluatorSecond !== '変更しない') {
      listSettingEvaluator.push(evaluatorSecond);
    }
    query.listUserSelected.map((item: any) => {
      listIdUserSelected.push(item.id);
    });

    listUserCanEdit = listIdUserSelected.filter(
      (word: any) => !listSettingEvaluator.includes(word),
    );

    listUserCanNotEdit = listIdUserSelected.filter((word: any) =>
      listSettingEvaluator.includes(word),
    );
    const tempListCheckUser = [];
    const listCheckUser = await User.findAll({
      attributes: ['id'],
      where: {
        id: listUserCanEdit,
        active: 1,
        companyGroupCode: companyGroupCode,
      },
      include: [
        {
          model: Role,
          as: 'roles',
          where: {
            id: 1,
          },
        },
      ],
    });

    listCheckUser.map((item: any) => {
      tempListCheckUser.push(item.id);
    });

    const userCanEdit = listUserCanEdit.filter((value) =>
      tempListCheckUser.includes(value),
    );
    const userCanNotEdit = listUserCanEdit.filter(
      (value) => !tempListCheckUser.includes(value),
    );

    let tempEvaluatorHaft = null;
    let tempEvaluatorFirst = null;
    let tempEvaluatorSecond = null;

    const listEvaluatorDeleted = [];

    tempEvaluatorHaft = evaluatorHaft === '変更しない' ? null : evaluatorHaft;
    tempEvaluatorFirst =
      evaluatorFirst === '変更しない' ? null : evaluatorFirst;
    tempEvaluatorSecond =
      evaluatorSecond === '変更しない' ? null : evaluatorSecond;

    /** check evaluator have role F2 or deleted */
    /** check 0.5 */
    if (tempEvaluatorHaft !== null) {
      const check = await User.findAll({
        attributes: ['id'],
        where: {
          id: tempEvaluatorHaft,
          active: 1,
          companyGroupCode: companyGroupCode,
        },
        include: [
          {
            model: Role,
            as: 'roles',
            where: {
              id: 2,
            },
          },
        ],
      });
      if (check.length === 0) {
        listEvaluatorDeleted.push(tempEvaluatorHaft);
        tempEvaluatorHaft = null;
      }
    }

    /** check 1.0 */
    if (tempEvaluatorFirst !== null) {
      const check = await User.findAll({
        attributes: ['id'],
        where: {
          id: tempEvaluatorFirst,
          active: 1,
          companyGroupCode: companyGroupCode,
        },
        include: [
          {
            model: Role,
            as: 'roles',
            where: {
              id: 2,
            },
          },
        ],
      });
      if (check.length === 0) {
        listEvaluatorDeleted.push(tempEvaluatorFirst);
        tempEvaluatorFirst = null;
      }
    }

    /** check 2.0 */
    if (tempEvaluatorSecond !== null) {
      const check = await User.findAll({
        attributes: ['id'],
        where: {
          id: tempEvaluatorSecond,
          active: 1,
          companyGroupCode: companyGroupCode,
        },
        include: [
          {
            model: Role,
            as: 'roles',
            where: {
              id: 2,
            },
          },
        ],
      });
      if (check.length === 0) {
        listEvaluatorDeleted.push(tempEvaluatorSecond);
        tempEvaluatorSecond = null;
      }
    }

    /** end check evaluator have role F2 or deleted */

    // /** Update data in table evaluator_default_tbl */

    const dataEvaluationPeroid = await this.evaluationPeriodEntity.findOne({
      attributes: ['id'],
      where: {
        year: year,
        periodIndex: periodIndex,
        companyGroupCode: companyGroupCode,
      },
    });

    const transaction = await EvaluatorDefault.sequelize.transaction();

    try {
      for (let i = 0; i < userCanEdit.length; i++) {
        const item = userCanEdit[i];
        const userInfo = await EvaluatorDefault.findOne({
          attributes: ['flagSkill'],
          where: {
            userId: item,
            evaluationPeriodId: dataEvaluationPeroid.id,
            companyGroupCode: companyGroupCode,
          },
        });
        //** update skill user trong bảng skill_user_tbl*/
        if (
          typeEdit == 1 &&
          skills.length > 0 &&
          !skills.includes(-1) &&
          userInfo.flagSkill == 1
        ) {
          //** replace all by new skill*/
          const evaluation = await this.evaluationEntity.findOne({
            attributes: ['id', 'status'],
            where: {
              userId: item,
              evaluationPeriodId: dataEvaluationPeroid.id,
              creationUser: { [Op.is]: null },
            },
          });

          //* xóa skill đã đăng ký trong evaluation nếu skill setting bị xóa trong giai đoạn đặt mục tiêu
          if (evaluation && evaluation.status < 50) {
            const temSkillAlreadySetting = await this.skillUserEntity.findAll({
              attributes: ['skillId'],
              where: {
                periodId: dataEvaluationPeroid.id,
                userId: item,
                evaluationId: null,
                type: 0,
              },
            });

            const skillAlreadySetting = [];
            if (temSkillAlreadySetting.length > 0) {
              temSkillAlreadySetting.map((item: any) => {
                skillAlreadySetting.push(item.skillId);
              });
            }

            const skillDelete = findDeletedIdsSkill(
              skills,
              skillAlreadySetting,
            );

            if (skillDelete.length > 0) {
              await this.evaluationEntity.sequelize.query(
                'CALL delete_skill_evaluation(ARRAY[:skillDelete], :evaluationId, :companyGroupCode)',
                {
                  replacements: {
                    skillDelete: skillDelete,
                    evaluationId: evaluation.id,
                    companyGroupCode: companyGroupCode,
                  },
                  type: QueryTypes.RAW, // Hoặc QueryTypes.SELECT nếu bạn muốn xử lý kết quả
                  logging: false,
                },
              );
            }
          }

          // //* Update skill mới
          await this.skillUserEntity.destroy({
            where: {
              periodId: dataEvaluationPeroid.id,
              userId: item,
              type: 0,
            },
          });

          const listSkillUpdate = [];
          for (let i = 0; i < skills.length; i++) {
            const element = skills[i];
            listSkillUpdate.push({
              userId: item,
              skillId: element,
              periodId: dataEvaluationPeroid.id,
              evaluationId: null,
              type: 0,
            });
          }

          if (evaluation) {
            for (let i = 0; i < skills.length; i++) {
              const element = skills[i];
              listSkillUpdate.push({
                userId: item,
                skillId: element,
                periodId: dataEvaluationPeroid.id,
                evaluationId: evaluation.id,
                type: 0,
              });
            }
          }

          await this.skillUserEntity.bulkCreate(listSkillUpdate);
        } else if (
          typeEdit == 2 &&
          skills.length > 0 &&
          !skills.includes(-1) &&
          userInfo.flagSkill == 1
        ) {
          //** only add new skill*/
          const skillOld = await this.skillUserEntity.findAll({
            attributes: ['skillId'],
            where: {
              userId: item,
              periodId: dataEvaluationPeroid.id,
              evaluationId: { [Op.is]: null },
              type: 0,
            },
          });
          const tempList = [];
          skillOld.map((item: any) => {
            tempList.push(item.skillId);
          });

          const skillAdds = skills.filter(
            (word: any) => !tempList.includes(word),
          );

          const listSkillUpdate = [];
          for (let i = 0; i < skillAdds.length; i++) {
            const element = skillAdds[i];
            listSkillUpdate.push({
              userId: item,
              skillId: element,
              periodId: dataEvaluationPeroid.id,
              evaluationId: null,
              type: 0,
            });
          }
          const evaluationId = await this.evaluationEntity.findOne({
            attributes: ['id'],
            where: {
              userId: item,
              evaluationPeriodId: dataEvaluationPeroid.id,
              creationUser: { [Op.is]: null },
              companyGroupCode: companyGroupCode,
            },
          });

          if (evaluationId) {
            for (let i = 0; i < skillAdds.length; i++) {
              const element = skillAdds[i];
              listSkillUpdate.push({
                userId: item,
                skillId: element,
                periodId: dataEvaluationPeroid.id,
                evaluationId: evaluationId.id,
                type: 0,
              });
            }
          }

          await this.skillUserEntity.bulkCreate(listSkillUpdate);
        }

        /** Update 2.0 */
        if (evaluatorSecond !== '変更しない') {
          /** check 2 co trung 1 hoặc 0.5 nếu trùng set 0.5 và 1 = null */
          const checkTheSameEvaluator_0_5 = await EvaluatorDefault.findOne({
            where: {
              [Op.and]: [
                {
                  userId: item,
                  evaluator_0_5_id: evaluatorSecond,
                  evaluationPeriodId: dataEvaluationPeroid.id,
                  companyGroupCode: companyGroupCode,
                },
              ],
            },
            transaction: transaction,
          });
          const checkTheSameEvaluator_1 = await EvaluatorDefault.findOne({
            where: {
              [Op.and]: [
                {
                  userId: item,
                  evaluator_1_id: evaluatorSecond,
                  evaluationPeriodId: dataEvaluationPeroid.id,
                  companyGroupCode: companyGroupCode,
                },
              ],
            },
            transaction: transaction,
          });

          if (checkTheSameEvaluator_0_5 !== null) {
            await EvaluatorDefault.update(
              {
                evaluator_0_5_id: null,
              },
              {
                where: {
                  userId: item,
                  evaluationPeriodId: dataEvaluationPeroid.id,
                  companyGroupCode: companyGroupCode,
                },
                returning: true,
                transaction: transaction,
              },
            );
            await EvaluatorDefault.update(
              {
                evaluator_2_id: evaluatorSecond,
              },
              {
                where: {
                  userId: item,
                  evaluationPeriodId: dataEvaluationPeroid.id,
                  companyGroupCode: companyGroupCode,
                },
                returning: true,
                transaction: transaction,
              },
            );
          }
          if (checkTheSameEvaluator_1 !== null) {
            await EvaluatorDefault.update(
              {
                evaluator_1_id: null,
              },
              {
                where: {
                  userId: item,
                  evaluationPeriodId: dataEvaluationPeroid.id,
                  companyGroupCode: companyGroupCode,
                },
                returning: true,
                transaction: transaction,
              },
            );
            await EvaluatorDefault.update(
              {
                evaluator_2_id: evaluatorSecond,
              },
              {
                where: {
                  userId: item,
                  evaluationPeriodId: dataEvaluationPeroid.id,
                  companyGroupCode: companyGroupCode,
                },
                returning: true,
                transaction: transaction,
              },
            );
          }
          if (
            checkTheSameEvaluator_0_5 === null &&
            checkTheSameEvaluator_1 === null
          ) {
            await EvaluatorDefault.update(
              {
                evaluator_2_id: evaluatorSecond,
              },
              {
                where: {
                  userId: item,
                  evaluationPeriodId: dataEvaluationPeroid.id,
                  companyGroupCode: companyGroupCode,
                },
                returning: true,
                transaction: transaction,
              },
            );
          }
        }

        /** Update 1.0 */
        if (evaluatorFirst !== '変更しない') {
          /** check trung với 2 nếu trung ko update ngược lại update */
          const checkTheSameEvaluator_2 = await EvaluatorDefault.findOne({
            where: {
              [Op.and]: [
                {
                  userId: item,
                  evaluator_2_id: evaluatorFirst,
                  evaluationPeriodId: dataEvaluationPeroid.id,
                  companyGroupCode: companyGroupCode,
                },
              ],
            },
            transaction: transaction,
          });

          /** ko trung 2.0 */
          if (checkTheSameEvaluator_2 === null) {
            /** update 1 nếu ko trung 2 */
            await EvaluatorDefault.update(
              {
                evaluator_1_id: evaluatorFirst,
              },
              {
                where: {
                  userId: item,
                  evaluationPeriodId: dataEvaluationPeroid.id,
                  companyGroupCode: companyGroupCode,
                },
                returning: true,
                transaction: transaction,
              },
            );
          }
          /** check 1 trùng 0.5 hay ko, neu trung update 0.5 thanh null nguoc lai ko update 0.5  */
          const checkTheSameEvaluator_0_5 = await EvaluatorDefault.findOne({
            where: {
              [Op.and]: [
                {
                  userId: item,
                  evaluator_0_5_id: evaluatorFirst,
                  evaluationPeriodId: dataEvaluationPeroid.id,
                  companyGroupCode: companyGroupCode,
                },
              ],
            },
            transaction: transaction,
          });

          /** trung 0.5 */
          if (checkTheSameEvaluator_0_5 !== null) {
            await EvaluatorDefault.update(
              {
                evaluator_0_5_id: null,
              },
              {
                where: {
                  userId: item,
                  evaluationPeriodId: dataEvaluationPeroid.id,
                  companyGroupCode: companyGroupCode,
                },
                returning: true,
                transaction: transaction,
              },
            );
          }

          /** ko trung 0.5 va ko trung 2.0*/
          if (
            checkTheSameEvaluator_0_5 === null &&
            checkTheSameEvaluator_2 === null
          ) {
            /** update 1 nếu ko trung 0.5  va 2.0*/
            await EvaluatorDefault.update(
              {
                evaluator_1_id: evaluatorFirst,
              },
              {
                where: {
                  userId: item,
                  evaluationPeriodId: dataEvaluationPeroid.id,
                  companyGroupCode: companyGroupCode,
                },
                returning: true,
                transaction: transaction,
              },
            );
          }
        }

        /** Update 0.5 */
        if (evaluatorHaft !== '変更しない') {
          /** Check 0.5 có trung voi 1 hoặc 2 hay ko, nếu trung ko update, ngược lại update */
          const checkTheSameEvaluator_1 = await EvaluatorDefault.findOne({
            where: {
              [Op.and]: [
                {
                  userId: item,
                  evaluator_1_id: evaluatorHaft,
                  evaluationPeriodId: dataEvaluationPeroid.id,
                  companyGroupCode: companyGroupCode,
                },
              ],
            },
            transaction: transaction,
          });

          const checkTheSameEvaluator_2 = await EvaluatorDefault.findOne({
            where: {
              [Op.and]: [
                {
                  userId: item,
                  evaluator_2_id: evaluatorHaft,
                  evaluationPeriodId: dataEvaluationPeroid.id,
                  companyGroupCode: companyGroupCode,
                },
              ],
            },
            transaction: transaction,
          });
          if (
            checkTheSameEvaluator_1 === null &&
            checkTheSameEvaluator_2 === null
          ) {
            await EvaluatorDefault.update(
              {
                evaluator_0_5_id: evaluatorHaft,
              },
              {
                where: {
                  userId: item,
                  evaluationPeriodId: dataEvaluationPeroid.id,
                  companyGroupCode: companyGroupCode,
                },
                returning: true,
                transaction: transaction,
              },
            );
          }
        }
      }

      // /** End update data in table evaluator_default_tbl */

      /** Update table evaluator_tbl */
      const financialPeriod = periodIndex === 1 ? '上期' : '下期';
      const financialYear = year;

      /** lấy danh sách evaluation_id để update table evaluator*/

      const listEvaluation = await this.evaluationEntity.findAll({
        attributes: ['id'],
        where: {
          [Op.and]: {
            title: `${financialYear}年${financialPeriod}`,
            userId: userCanEdit,
            creationUser: { [Op.eq]: null },
            companyGroupCode: companyGroupCode,
          },
        },
        transaction: transaction,
      });

      const listEvaluationId = [];
      if (listEvaluation.length > 0) {
        listEvaluation.map((item: any) => {
          listEvaluationId.push(item.id);
        });
      }

      /** lấy danh sách các evaluator theo listEvaluation  */
      if (listEvaluation.length > 0) {
        for (let i = 0; i < listEvaluationId.length; i++) {
          const item = listEvaluationId[i];
          /** check 2 có trùng với 1 hoặc 0.5 */
          if (
            (evaluatorSecond !== '変更しない' ||
              evaluatorFirst !== '変更しない' ||
              evaluatorHaft !== '変更しない') &&
            tempEvaluatorSecond !== null
          ) {
            const checkTheSameEvaluator0_5 = await this.evaluatorEntity.findOne(
              {
                where: {
                  [Op.and]: [
                    {
                      evaluationId: item,
                      evaluatorId: tempEvaluatorSecond,
                      evaluationOrder: 0.5,
                    },
                  ],
                },
                transaction: transaction,
              },
            );
            const checkTheSameEvaluator1 = await this.evaluatorEntity.findOne({
              where: {
                [Op.and]: [
                  {
                    evaluationId: item,
                    evaluatorId: tempEvaluatorSecond,
                    evaluationOrder: 1.0,
                  },
                ],
              },
              transaction: transaction,
            });
            /** xóa 0.5 */
            if (checkTheSameEvaluator0_5 !== null) {
              await this.evaluatorEntity.destroy({
                where: {
                  [Op.and]: [
                    {
                      evaluationId: item,
                      evaluatorId: tempEvaluatorSecond,
                      evaluationOrder: 0.5,
                    },
                  ],
                },
                transaction: transaction,
              });
            }

            /** xóa 1 */
            if (checkTheSameEvaluator1 !== null) {
              await this.evaluatorEntity.destroy({
                where: {
                  [Op.and]: [
                    {
                      evaluationId: item,
                      evaluatorId: tempEvaluatorSecond,
                      evaluationOrder: 1.0,
                    },
                  ],
                },
                transaction: transaction,
              });
            }

            /** update 2 nếu tồn tại hoặc tạo mới nếu chưa có */

            const checkExitEvaluator2 = await this.evaluatorEntity.findOne({
              where: {
                [Op.and]: [
                  {
                    evaluationId: item,
                    evaluationOrder: 2.0,
                  },
                ],
              },
              transaction: transaction,
            });

            if (checkExitEvaluator2 === null) {
              await this.evaluatorEntity.create(
                {
                  evaluationId: item,
                  evaluatorId: tempEvaluatorSecond,
                  evaluationOrder: 2.0,
                  commentPublic: null,
                  commentPrivate: null,
                },
                { transaction: transaction },
              );
            } else {
              await this.evaluatorEntity.update(
                { evaluatorId: tempEvaluatorSecond },
                {
                  where: {
                    [Op.and]: [
                      {
                        evaluationId: item,
                        evaluationOrder: 2.0,
                      },
                    ],
                  },
                  transaction: transaction,
                },
              );
            }
          }

          /** check 1 có trùng với 0.5 */
          if (
            (evaluatorSecond !== '変更しない' ||
              evaluatorFirst !== '変更しない' ||
              evaluatorHaft !== '変更しない') &&
            tempEvaluatorFirst !== null
          ) {
            /** kiễm tra 1 trùng với 2 hay ko nếu trùng với 2 ko update ngược lại update */
            if (evaluatorFirst !== '変更しない') {
              /** check trung 1 với 2 */
              const checkTheSameEvaluator_1_And_2 =
                await this.evaluatorEntity.findOne({
                  where: {
                    [Op.and]: [
                      {
                        evaluationId: item,
                        evaluatorId: tempEvaluatorFirst,
                        evaluationOrder: 2.0,
                      },
                    ],
                  },
                  transaction: transaction,
                });

              /** chỉ update khi checkTheSameEvaluator_1_And_2 === null (ko trùng), khác null là trùng */
              if (checkTheSameEvaluator_1_And_2 === null) {
                /** edit */
                const checkTheSameEvaluator0_5 =
                  await this.evaluatorEntity.findOne({
                    where: {
                      [Op.and]: [
                        {
                          evaluationId: item,
                          evaluatorId: tempEvaluatorFirst,
                          evaluationOrder: 0.5,
                        },
                      ],
                    },
                    transaction: transaction,
                  });

                /** xóa 0.5 */
                if (checkTheSameEvaluator0_5 !== null) {
                  await this.evaluatorEntity.destroy({
                    where: {
                      [Op.and]: [
                        {
                          evaluationId: item,
                          evaluatorId: tempEvaluatorFirst,
                          evaluationOrder: 0.5,
                        },
                      ],
                    },
                    transaction: transaction,
                  });
                }

                /** update 1 nếu tồn tại hoặc tạo mới nếu chưa có */

                const checkExitEvaluator1 = await this.evaluatorEntity.findOne({
                  where: {
                    [Op.and]: [
                      {
                        evaluationId: item,
                        evaluationOrder: 1.0,
                      },
                    ],
                  },
                  transaction: transaction,
                });

                if (checkExitEvaluator1 === null) {
                  await this.evaluatorEntity.create(
                    {
                      evaluationId: item,
                      evaluatorId: tempEvaluatorFirst,
                      evaluationOrder: 1.0,
                      commentPublic: null,
                      commentPrivate: null,
                    },
                    { transaction: transaction },
                  );
                } else {
                  await this.evaluatorEntity.update(
                    { evaluatorId: tempEvaluatorFirst },
                    {
                      where: {
                        [Op.and]: [
                          {
                            evaluationId: item,
                            evaluationOrder: 1.0,
                          },
                        ],
                      },
                      transaction: transaction,
                    },
                  );
                }
              }
            }
          }

          /** update 0.5 */
          if (
            (evaluatorSecond !== '変更しない' ||
              evaluatorFirst !== '変更しない' ||
              evaluatorHaft !== '変更しない') &&
            tempEvaluatorHaft !== null
          ) {
            /** kiễm tra 0.5 trùng với 1 hoặc 2 hay ko, nếu trùng với 1 hoặc 2 ko update ngược lại update */
            if (evaluatorHaft !== '変更しない') {
              /** check trung 0.5 với 1 */
              const checkTheSameEvaluator_0_5_And_1 =
                await this.evaluatorEntity.findOne({
                  where: {
                    [Op.and]: [
                      {
                        evaluationId: item,
                        evaluatorId: tempEvaluatorHaft,
                        evaluationOrder: 1.0,
                      },
                    ],
                  },
                  transaction: transaction,
                });

              /** check trung 0.5 với 2 */
              const checkTheSameEvaluator_0_5_And_2 =
                await this.evaluatorEntity.findOne({
                  where: {
                    [Op.and]: [
                      {
                        evaluationId: item,
                        evaluatorId: tempEvaluatorHaft,
                        evaluationOrder: 2.0,
                      },
                    ],
                  },
                  transaction: transaction,
                });
              /** chỉ update khi checkTheSameEvaluator_0_5_And_1 và checkTheSameEvaluator_0_5_And_2  === null ( cả 2 = null => ko trùng), ( 1 trong  2 = null => là trùng) */
              if (
                checkTheSameEvaluator_0_5_And_1 === null &&
                checkTheSameEvaluator_0_5_And_2 === null
              ) {
                /** update 0.5 nếu tồn tại hoặc tạo mới nếu chưa có */
                const checkExitEvaluator0_5 =
                  await this.evaluatorEntity.findOne({
                    where: {
                      [Op.and]: [
                        {
                          evaluationId: item,
                          evaluationOrder: 0.5,
                        },
                      ],
                    },
                    transaction: transaction,
                  });
                if (checkExitEvaluator0_5 === null) {
                  await this.evaluatorEntity.create(
                    {
                      evaluationId: item,
                      evaluatorId: tempEvaluatorHaft,
                      evaluationOrder: 0.5,
                      commentPublic: null,
                      commentPrivate: null,
                    },
                    { transaction: transaction },
                  );
                } else {
                  await this.evaluatorEntity.update(
                    { evaluatorId: tempEvaluatorHaft },
                    {
                      where: {
                        [Op.and]: [
                          {
                            evaluationId: item,
                            evaluationOrder: 0.5,
                          },
                        ],
                      },
                      transaction: transaction,
                    },
                  );
                }
              }
            }
          }
        }
      }

      // /** end update evaluator */

      /** get user information cannot edit by duplicate evaluator*/
      // eslint-disable-next-line prefer-const
      userInForNotEdit = await User.findAll({
        attributes: ['employeeNumber', 'fullName'],
        where: {
          id: listUserCanNotEdit,
          companyGroupCode: companyGroupCode,
        },
      });

      /** get user information cannot edit by delete or not have role F1*/
      // eslint-disable-next-line prefer-const
      userInForNotRoleUserOrDeleted = await User.findAll({
        attributes: ['employeeNumber', 'fullName'],
        where: {
          id: userCanNotEdit,
          companyGroupCode: companyGroupCode,
        },
      });

      /** get user information cannot set evaluator by delete or not have role F2*/
      // eslint-disable-next-line prefer-const
      evaluatorNotRoleEvaluatorOrDeleted = await User.findAll({
        attributes: ['employeeNumber', 'fullName'],
        where: {
          id: listEvaluatorDeleted,
          companyGroupCode: companyGroupCode,
        },
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new RuntimeException(
        error,
        error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      userInfor: userInForNotEdit,
      userDeleted: userInForNotRoleUserOrDeleted,
      evaluatorDeleted: evaluatorNotRoleEvaluatorOrDeleted,
    };
  }

  async listUserDepartment(condition: { [x: string]: any }) {
    return await this.userEntity.findAll({
      where: condition,
      include: [
        { model: Department, as: 'division' },
        { model: Department, as: 'department' },
        { model: Company, as: 'company' },
        // { model: EvaluatorDefault, as: 'evaluator05' },
        // { model: EvaluatorDefault, as: 'evaluator1' },
        // { model: EvaluatorDefault, as: 'evaluator2' },
      ],
    });
  }

  async listEvaluatorDefault(condition: { [x: string]: any }) {
    return await this.evaluatorDefaultEntity.findOne({
      where: condition,
    });
  }

  async updateEvaluatorDefault(condition: any, data: any, transaction: any) {
    await this.evaluatorDefaultEntity.update(data, {
      where: condition,
      transaction: transaction,
    });
  }

  async getAllEvaluatorDefault() {
    return (await this.evaluatorDefaultEntity.findAll()).map(
      (data) => data && data.get({ plain: true }),
    ) as EvaluatorDefault[];
  }

  async listEvaluationByPeriod(periodId: number, evaluatorId: any[]) {
    return await this.evaluationEntity.findAll({
      where: {
        [Op.and]: [{ evaluationPeriodId: periodId }],
      },
      include: [
        {
          model: User,
          as: 'user',
          where: {
            active: 1,
            id: { [Op.in]: evaluatorId },
          },
          include: [
            {
              model: Permission,
              as: 'permissions',
              where: { roleId: { [Op.in]: [1, 2] } },
            },
          ],
        },
        {
          model: Evaluator,
          as: 'evaluator',
          include: [
            {
              model: User,
              as: 'user',
              where: {
                active: 1,
              },
              include: [
                {
                  model: Permission,
                  as: 'permissions',
                  where: { roleId: { [Op.in]: [1, 2] } },
                },
              ],
            },
          ],
        },
      ],
    });
  }

  async getUserIdByEvaluationId(evaluationId: number): Promise<any> {
    return await this.evaluationEntity.findOne({
      attributes: ['userId'],
      where: { id: evaluationId },
    });
  }

  async listToEmail(
    _type: string,
    year: string,
    periodIndex: string,
    companyGroupCode: string,
    departmentId?: number,
  ): Promise<any[]> {
    if (departmentId) {
      return await this.listToEmailByDepartment(
        year,
        periodIndex,
        companyGroupCode,
        departmentId,
      );
    }
    // let levelList: number[] = [];
    // if (type == 5 || type == 7) {
    //   levelList = [1, 2, 3, 4, 5, 6, 7];
    // }
    // if (type == 6 || type == 8) {
    //   levelList = [8, 9, 10];
    // }
    // console.log(periodIndex);
    const periodId = await this.evaluationPeriodEntity.findOne({
      attributes: ['id'],
      where: {
        year,
        periodIndex,
        companyGroupCode,
      },
    });

    const listEvaluatedUser = await this.evaluatorDefaultEntity.findAll({
      attributes: ['id', 'userId'],
      where: {
        evaluationPeriodId: periodId.id,
        companyGroupCode: companyGroupCode,
      },
    });

    const listEvaluator05 = await this.evaluatorDefaultEntity.findAll({
      attributes: ['id', 'evaluator05Id'],
      where: {
        evaluationPeriodId: periodId.id,
        evaluator05Id: {
          [Op.not]: null,
        },
        companyGroupCode: companyGroupCode,
      },
    });

    const listEvaluator1 = await this.evaluatorDefaultEntity.findAll({
      attributes: ['id', 'evaluator1Id'],
      where: {
        evaluationPeriodId: periodId.id,
        evaluator1Id: {
          [Op.not]: null,
        },
        companyGroupCode: companyGroupCode,
      },
    });

    const listEvaluator2 = await this.evaluatorDefaultEntity.findAll({
      attributes: ['id', 'evaluator2Id'],
      where: {
        evaluationPeriodId: periodId.id,
        evaluator2Id: {
          [Op.not]: null,
        },
        companyGroupCode: companyGroupCode,
      },
    });

    const listEvaluatedUserId = listEvaluatedUser.map(
      (user: any) => user.userId,
    );

    const listEvaluator05Id = listEvaluator05.map(
      (evaluator: any) => evaluator.evaluator05Id,
    );

    const listEvaluator1Id = listEvaluator1.map(
      (evaluator: any) => evaluator.evaluator1Id,
    );

    const listEvaluator2Id = listEvaluator2.map(
      (evaluator: any) => evaluator.evaluator2Id,
    );

    // Merge list user id, list evaluator 0.5, 1, 2
    // And remove duplicate id(number)
    const listMailUserId = [
      ...listEvaluatedUserId,
      ...listEvaluator05Id,
      ...listEvaluator1Id,
      ...listEvaluator2Id,
    ].filter((id: any, index: number, array: any) => {
      return array.indexOf(id) === index;
    });

    if (listMailUserId.length) {
      return await this.userEntity.findAll({
        where: {
          [Op.and]: [
            { active: 1 },
            // {
            //   level: {
            //     [Op.in]: levelList,
            //   },
            // },
            {
              id: { [Op.in]: listMailUserId },
            },
            { companyGroupCode: companyGroupCode },
          ],
        },
        attributes: ['id', 'email', 'fullName'],
        include: [
          {
            model: Permission,
            as: 'permissions',
            where: { roleId: { [Op.in]: [1, 2] } },
          },
        ],
      });
    } else {
      return [];
    }
  }

  private async listToEmailByDepartment(
    year: string,
    periodIndex: string,
    companyGroupCode: string,
    departmentId: number,
  ): Promise<any[]> {
    const periodRecord = await this.evaluationPeriodEntity.findOne({
      attributes: ['id'],
      where: { year, periodIndex, companyGroupCode },
    });
    if (!periodRecord) return [];

    const mainQuery = `
      SELECT
        et.id   AS "evaluationId",
        u.email AS "email"
      FROM evaluation_period_department_setting_tbl epds
      LEFT JOIN department_tbl d
        ON d.id = epds.department_id
      LEFT JOIN evaluator_default_tbl edt
        ON edt.evaluation_period_id = epds.evaluation_period_id
      INNER JOIN evaluation_tbl et
        ON et.user_id               = edt.user_id
        AND et.evaluation_period_id = epds.evaluation_period_id
        AND (
          (d.type = 1 AND et.division_id   = epds.department_id)
          OR
          (d.type = 0 AND et.department_id = epds.department_id)
        )
        AND et.company_group_code = :companyGroupCode
        AND et.creation_user IS NULL
      LEFT JOIN user_tbl u
        ON u.id = et.user_id
      WHERE epds.evaluation_period_id = :evaluationPeriodId
        AND epds.company_group_code   = :companyGroupCode
        AND epds.department_id        = :departmentId
      ORDER BY epds.id ASC, et.id ASC
    `;

    const mainResults: any[] = await this.evaluationEntity.sequelize.query(
      mainQuery,
      {
        replacements: {
          companyGroupCode,
          evaluationPeriodId: periodRecord.id,
          departmentId,
        },
        type: QueryTypes.SELECT,
      },
    );

    if (!mainResults.length) return [];

    const evaluationIds = [
      ...new Set(mainResults.map((r: any) => r.evaluationId).filter(Boolean)),
    ];

    let evaluatorEmails: any[] = [];
    if (evaluationIds.length > 0) {
      const evaluatorQuery = `
        SELECT DISTINCT u.email AS "email"
        FROM evaluator_tbl ev
        JOIN user_tbl u ON u.id = ev.evaluator_id
        WHERE ev.evaluation_id IN (:evaluationIds)
          AND u.active = 1
      `;
      evaluatorEmails = await this.evaluationEntity.sequelize.query(
        evaluatorQuery,
        {
          replacements: { evaluationIds },
          type: QueryTypes.SELECT,
        },
      );
    }

    const seen = new Set<string>();
    const merged: { email: string }[] = [];
    for (const r of [...mainResults, ...evaluatorEmails]) {
      if (r.email && !seen.has(r.email)) {
        seen.add(r.email);
        merged.push({ email: r.email });
      }
    }
    return merged;
  }

  async checkImportUser(query: any, companyGroupCode: string) {
    const year = query.year;
    const periodIndex = query.periodIndex;
    const dataEvaluationPeroid = await this.evaluationPeriodEntity.findOne({
      attributes: ['id'],
      where: {
        year: year,
        periodIndex: periodIndex,
        companyGroupCode: companyGroupCode,
      },
    });
    if (dataEvaluationPeroid?.id) {
      const listUser = await this.evaluatorDefaultEntity.findAll({
        where: {
          evaluationPeriodId: dataEvaluationPeroid.id,
          companyGroupCode: companyGroupCode,
        },
      });
      return listUser;
    } else {
      return [];
    }
  }

  async importUser(listUserImport: any) {
    return await this.evaluatorDefaultEntity.bulkCreate(listUserImport);
  }

  async markEvaluationsAsPersonal(
    userIds: number[],
    evaluationPeriodId: number,
    creationUser: number,
    companyGroupCode: string,
  ) {
    await this.evaluationEntity.update(
      { creationUser },
      {
        where: {
          userId: { [Op.in]: userIds },
          evaluationPeriodId,
          companyGroupCode,
          creationUser: { [Op.is]: null },
        },
      },
    );

    // Populate default dates using same two-level priority as applyAllDeptDatesToEvaluations:
    // dept-level setting > division-level setting > company period dates.
    await this.evaluationEntity.sequelize.query(
      `UPDATE evaluation_tbl et
       SET
         date_creation_goal_start = CASE WHEN et.level > 7
           THEN COALESCE(src.dept_goal_dept_start, src.div_goal_dept_start, ep.date_creation_goal_department_start)
           ELSE COALESCE(src.dept_goal_start,      src.div_goal_start,      ep.date_creation_goal_start)
         END,
         date_creation_goal_end = CASE WHEN et.level > 7
           THEN COALESCE(src.dept_goal_dept_end, src.div_goal_dept_end, ep.date_creation_goal_department_end)
           ELSE COALESCE(src.dept_goal_end,      src.div_goal_end,      ep.date_creation_goal_end)
         END,
         date_evaluation_start = CASE WHEN et.level > 7
           THEN COALESCE(src.dept_eval_dept_start, src.div_eval_dept_start, ep.date_evaluation_department_start)
           ELSE COALESCE(src.dept_eval_start,      src.div_eval_start,      ep.date_evaluation_start)
         END,
         date_evaluation_end = CASE WHEN et.level > 7
           THEN COALESCE(src.dept_eval_dept_end, src.div_eval_dept_end, ep.date_evaluation_department_end)
           ELSE COALESCE(src.dept_eval_end,      src.div_eval_end,      ep.date_evaluation_end)
         END,
         updated_time = NOW()
       FROM (
         SELECT
           et2.id                                          AS eval_id,
           dept_s.date_creation_goal_department_start     AS dept_goal_dept_start,
           dept_s.date_creation_goal_department_end       AS dept_goal_dept_end,
           dept_s.date_creation_goal_start                AS dept_goal_start,
           dept_s.date_creation_goal_end                  AS dept_goal_end,
           dept_s.date_evaluation_department_start        AS dept_eval_dept_start,
           dept_s.date_evaluation_department_end          AS dept_eval_dept_end,
           dept_s.date_evaluation_start                   AS dept_eval_start,
           dept_s.date_evaluation_end                     AS dept_eval_end,
           div_s.date_creation_goal_department_start      AS div_goal_dept_start,
           div_s.date_creation_goal_department_end        AS div_goal_dept_end,
           div_s.date_creation_goal_start                 AS div_goal_start,
           div_s.date_creation_goal_end                   AS div_goal_end,
           div_s.date_evaluation_department_start         AS div_eval_dept_start,
           div_s.date_evaluation_department_end           AS div_eval_dept_end,
           div_s.date_evaluation_start                    AS div_eval_start,
           div_s.date_evaluation_end                      AS div_eval_end
         FROM evaluation_tbl et2
         LEFT JOIN evaluation_period_department_setting_tbl dept_s
           ON dept_s.department_id        = et2.department_id
           AND dept_s.evaluation_period_id = :evaluationPeriodId
           AND dept_s.company_group_code   = :companyGroupCode
         LEFT JOIN evaluation_period_department_setting_tbl div_s
           ON div_s.department_id         = et2.division_id
           AND div_s.evaluation_period_id  = :evaluationPeriodId
           AND div_s.company_group_code    = :companyGroupCode
         WHERE et2.user_id IN (:userIds)
           AND et2.evaluation_period_id = :evaluationPeriodId
           AND et2.company_group_code   = :companyGroupCode
           AND et2.creation_user        = :creationUser
       ) AS src
       JOIN evaluation_period_tbl ep ON ep.id = :evaluationPeriodId
       WHERE et.id = src.eval_id`,
      {
        replacements: {
          userIds,
          evaluationPeriodId,
          companyGroupCode,
          creationUser,
        },
        type: QueryTypes.RAW,
      },
    );
  }

  async importUserProcedure(
    year: number,
    periodIndex: number,
    userIds: number[],
    isImport: number,
    companyGroupCode: string,
    timeZone: string,
  ) {
    await this.evaluatorDefaultEntity.sequelize.query(
      'CALL import_user(:year, :periodIndex, :currentDateInput, ARRAY[:userIds], :isImport, :companyGroupCode)',
      {
        replacements: {
          year: year,
          periodIndex: periodIndex,
          currentDateInput: isFormatDate(new Date(), 'YYYY/M/D', timeZone),
          userIds: !userIds ? [0] : userIds,
          isImport: isImport,
          companyGroupCode: companyGroupCode,
        },
        type: QueryTypes.RAW, // Hoặc QueryTypes.SELECT nếu bạn muốn xử lý kết quả
      },
    );
  }

  async getListUserRoleF1() {
    return await this.userEntity.findAll({
      where: {
        active: 1,
      },
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'code', 'name'],
        },
        {
          model: Department,
          as: 'division',
          attributes: ['id', 'code', 'name'],
        },
        {
          model: Role,
          as: 'rolesCondition',
          where: { id: 1 },
        },
      ],
    });
  }

  async countUserBeforeImport(userId: any, evaluationPeriodId: any) {
    return await this.evaluatorDefaultEntity.count({
      where: {
        userId: userId,
        evaluationPeriodId: evaluationPeriodId,
      },
    });
  }

  async findListUserToSettingEvaluation(query: any) {
    const year = query.state.year;
    const periodIndex = query.state.periodIndex;
    const limit = query.limit;
    const offset = query.offset;
    const department = query.department;
    const division = query.division;
    const nameAndEmail = query.nameAndEmail;
    const companyGroupCode = query.companyGroupCode;
    let listUserAlredySettingEvaluations = [];

    const dataEvaluationPeroid = await this.evaluationPeriodEntity.findOne({
      attributes: ['id'],
      where: {
        year: year,
        periodIndex: periodIndex,
        companyGroupCode: companyGroupCode,
      },
    });
    if (dataEvaluationPeroid?.id) {
      listUserAlredySettingEvaluations =
        await this.evaluatorDefaultEntity.findAll({
          attributes: ['userId'],
          where: {
            evaluationPeriodId: dataEvaluationPeroid?.id,
            companyGroupCode: companyGroupCode,
          },
        });
    }

    const temListUserAlreadySetting = [];
    listUserAlredySettingEvaluations.map((item: any) => {
      temListUserAlreadySetting.push(item.userId);
    });

    const arrayWhere = [];
    arrayWhere.push({
      [Op.and]: [
        {
          [Op.or]: [
            {
              employeeNumber: nameAndEmail
                ? { [Op.iLike]: `%${nameAndEmail}%` }
                : { [Op.not]: null },
            },
            {
              fullName: nameAndEmail
                ? { [Op.iLike]: `%${nameAndEmail}%` }
                : { [Op.not]: null },
            },
            {
              email: nameAndEmail
                ? { [Op.iLike]: `%${nameAndEmail}%` }
                : { [Op.not]: null },
            },
          ],
        },
        {
          id: {
            [Op.notIn]: temListUserAlreadySetting,
          },
        },
      ],
    });

    if (department !== 'すべて') {
      arrayWhere.push({
        departmentId: parseInt(department[0].trim()), // get department id
      });
    }

    if (division !== 'すべて') {
      arrayWhere.push({
        divisionId: parseInt(division[0].trim()), // get division id
      });
    }

    const datas = await this.userEntity.findAndCountAll({
      attributes: ['id', 'employeeNumber', 'fullName', 'email', 'level'],
      where: {
        [Op.and]: arrayWhere,
        active: 1,
        level: { [Op.not]: null },
        companyGroupCode: companyGroupCode,
      },
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'code', 'name'],
        },
        {
          model: Department,
          as: 'division',
          attributes: ['id', 'code', 'name'],
        },
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name'],
        },
        {
          model: Role,
          as: 'rolesCondition',
          attributes: ['id', 'name'],
          through: { attributes: [] },
          where: { id: 1 },
        },
      ],
      order: [['employee_number', 'ASC']],
      distinct: true,
      offset: offset || 0,
      limit: limit || 20,
    });

    return { data: datas.rows, counts: datas.count };
  }

  async getEvaluationPeriodByYear(year: any, periodIndex: any) {
    return await this.evaluationPeriodEntity.findOne({
      attributes: [
        'id',
        'year',
        'periodIndex',
        'periodStart',
        'periodEnd',
        'dateCreationGoalStart',
        'dateCreationGoalEnd',
        'dateCreationGoalDepartmentStart',
        'dateCreationGoalDepartmentEnd',
      ],
      where: { year: year, periodIndex: periodIndex },
    });
  }

  async getEvaluationPeriodByEvaluationId(EvaluationId: number) {
    return await this.evaluationPeriodEntity.findOne({
      attributes: ['id', 'year', 'periodIndex', 'periodStart', 'periodEnd'],
      include: [
        {
          model: Evaluation,
          where: { id: EvaluationId },
        },
      ],
    });
  }

  async checkUserAdded(listUserSelected: any, id: any) {
    return await this.evaluatorDefaultEntity.count({
      where: {
        userId: listUserSelected,
        evaluationPeriodId: id,
      },
    });
  }

  async getListUserEvaluationByEvaluationPeriodId(
    listUserSelected: any,
    id: any,
  ) {
    return await this.evaluationEntity.findAll({
      attributes: ['userId'],
      where: {
        [Op.and]: [
          {
            evaluationPeriodId: id,
            userId: listUserSelected,
          },
        ],
      },
    });
  }

  async getListUserInforByListId(id: any) {
    return await this.userEntity.findAll({
      // attributes: ['level', 'id'],
      where: { id: id, active: 1 },
    });
  }

  async findMaxIdEvaluation(userId: any, evaluationPeriodId: any) {
    return await this.evaluationEntity.max('id', {
      where: {
        [Op.and]: [
          {
            evaluationPeriodId: evaluationPeriodId,
            userId: userId,
          },
        ],
      },
    });
  }

  async getEvaluatorByEvaluationIdAndOrder(id: any, order: any) {
    return await this.evaluatorEntity.findOne({
      attributes: ['evaluatorId'],
      where: { [Op.and]: [{ evaluation_id: id, evaluationOrder: order }] },
    });
  }

  async createUserEvaluatorDefault(listUserImport: any) {
    return await this.evaluatorDefaultEntity.bulkCreate(listUserImport);
  }

  async getUserInforById(id: any) {
    return await this.userEntity.findOne({
      where: { id: id },
      include: [
        { model: Department, as: 'division' },
        { model: Department, as: 'department' },
        { model: Company, as: 'company' },
      ],
    });
  }

  async getEvaluatorDefaultUpdateTime(id: any) {
    return await this.evaluatorDefaultEntity.findOne({
      attributes: ['updatedTime'],
      where: {
        id: id,
      },
    });
  }

  async deleteUserSettingEvaluator(params: any, companyGroupCode: string) {
    const year = params.state.year;
    const periodIndex = params.state.periodIndex;
    const listUserDelete = params.selectedKeyDeleted;

    const dataEvaluationPeroid = await this.evaluationPeriodEntity.findOne({
      attributes: ['id'],
      where: {
        year: year,
        periodIndex: periodIndex,
        companyGroupCode: companyGroupCode,
      },
    });

    const countUser = await this.evaluatorDefaultEntity.count({
      where: {
        [Op.and]: [
          {
            userId: listUserDelete,
            evaluationPeriodId: dataEvaluationPeroid.id,
            companyGroupCode: companyGroupCode,
          },
        ],
      },
    });

    if (countUser !== listUserDelete.length) {
      throw new RuntimeException('Conflict delete user', 409);
    }

    if (listUserDelete.length > 0) {
      //* xóa evaluator khi xóa đối tượng đánh giá ờ bảng evaluator_tbl (ko có ngoại lệ)
      const listEvaluationId = await this.evaluationEntity.findAll({
        attributes: ['id'],
        where: {
          userId: listUserDelete,
          evaluationPeriodId: dataEvaluationPeroid.id,
          creationUser: { [Op.is]: null },
          companyGroupCode: companyGroupCode,
        },
      });
      if (listEvaluationId.length > 0) {
        const listIdDelete = [];
        for (let i = 0; i < listEvaluationId.length; i++) {
          const item = listEvaluationId[i];
          listIdDelete.push(item.id);
        }
        await this.evaluatorEntity.destroy({
          where: {
            evaluationId: listIdDelete,
          },
        });
      }

      //* xóa data khi xóa đối tượng đánh giá ờ bảng evaluator_default_tbl
      await this.evaluatorDefaultEntity.destroy({
        where: {
          [Op.and]: [
            {
              userId: listUserDelete,
              evaluationPeriodId: dataEvaluationPeroid.id,
              companyGroupCode: companyGroupCode,
            },
          ],
        },
      });

      //* xóa data khi xóa đối tượng đánh giá ờ bảng skill_useer_tbl
      await this.skillUserEntity.destroy({
        where: {
          [Op.and]: [
            {
              userId: listUserDelete,
              periodId: dataEvaluationPeroid.id,
              type: 0,
              evaluationId: { [Op.is]: null },
            },
          ],
        },
      });
    }

    return true;
  }

  async checkIsFixed(query: any, companyGroupCode: string) {
    const year = query.year;
    const periodIndex = query.periodIndex;
    return await this.evaluationPeriodEntity.findAll({
      attributes: ['id'],
      where: {
        [Op.and]: [
          {
            year: year,
            periodIndex: periodIndex,
            checkFixed: 2,
            companyGroupCode: companyGroupCode,
          },
        ],
      },
    });
  }

  async countsEvaluationPeriod(query: EvaluationQuery, userId: number) {
    const evaluations = await this.evaluationPeriodEntity.findAll({
      attributes: [
        'id',
        'year',
        'periodIndex',
        'periodStart',
        'periodEnd',
        'dateEvaluationStart',
        'dateEvaluationEnd',
        'dateEvaluationDepartmentStart',
        'dateEvaluationDepartmentEnd',
      ],
      where: {
        year: {
          [Op.between]: [query.yearStart, query.yearEnd],
        },
      },
      include: [
        {
          model: Evaluation,
          as: 'evaluations',
          attributes: [
            'id',
            'departmentName',
            'divisionName',
            'companyName',
            'title',
            'periodStart',
            'periodEnd',
            'status',
            'level',
            'summaryPointEvaluator2',
            'percentPoint',
            'userId',
          ],
          where: {
            userId: userId || 0,
          },

          include: [
            {
              model: Evaluator,
              as: 'evaluator',
              attributes: ['evaluatorId', 'evaluationOrder'],
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['fullName', 'id'],
                },
              ],
            },
            {
              model: User,
              as: 'user',
              attributes: ['id', 'fullName', 'employeeNumber'],
              include: [
                {
                  model: Department,
                  as: 'department',
                  attributes: ['code', 'name', 'type', 'class', 'active'],
                },
              ],
            },
          ],
        },
      ],
      order: [
        ['year', 'DESC'],
        [query.sortBy, query.sortType],
        [{ model: Evaluation, as: 'evaluations' }, 'periodStart', 'DESC'],
      ],
    });

    return evaluations;
  }

  async getListProSkillPublicByDepartmentIds(Ids: number[]) {
    const versionProSkills = await this.versionProSkillEntity.findAll({
      where: {
        publicStatus: 1,
        skillId: Ids,
      },
      include: [
        {
          model: ListProSkill,
          as: 'listProSkills',
          attributes: [
            'itemId',
            'smallClass',
            'mediumClass',
            'content',
            'difficulty',
            'note',
            'jobType',
          ],
        },
      ],
      order: [[{ model: ListProSkill, as: 'listProSkills' }, 'id', 'ASC']],
    });

    return versionProSkills;
  }

  async listToEmailEvaluation(where: { [x: string]: any }): Promise<any> {
    return await this.evaluationEntity.findAll({
      where: where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email'],
          where: {
            active: 1,
          },
          include: [
            {
              model: Permission,
              as: 'permissions',
              where: { roleId: 1 },
            },
          ],
        },
      ],
    });
  }

  async listUserDepartmentVersionTwo(
    condition: { [x: string]: any },
    periodId: number,
  ) {
    return await this.evaluatorDefaultEntity.findAll({
      where: {
        evaluationPeriodId: periodId,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: [
            'id',
            'email',
            'fullName',
            'flagSkill',
            'level',
            'companyGroupCode',
          ],
          where: condition,
          include: [
            {
              model: Department,
              as: 'department',
              attributes: ['code', 'name', 'id'],
            },
            {
              model: Department,
              as: 'division',
              attributes: ['code', 'name', 'id'],
            },
            { model: Company, as: 'company' },
          ],
        },
      ],
    });
  }

  async getEvaluatorDefault(userId: number, evaluationPeriodId: number) {
    return await this.evaluatorDefaultEntity.findOne({
      where: { userId, evaluationPeriodId },
    });
  }

  async getDefaultActive(condition: { [x: string]: any }) {
    return await this.evaluatorDefaultEntity
      .findAll({
        where: condition,
      })
      .then((res) => {
        return res.map((v) => {
          return {
            userId: v.userId,
          };
        });
      });
  }

  async getListUserByInEmail(condition: { [x: string]: any }) {
    return await this.userEntity.findAll({
      attributes: ['email', 'fullName'],
      where: condition,
    });
  }

  async usersMailList(conditions: string, companyGroupCode: string) {
    return await this.userEntity.findAll({
      where: {
        active: 1,
        email: {
          [Op.notIn]: JSON.parse(conditions ?? 'null'),
        },
        companyGroupCode: companyGroupCode,
      },
      attributes: ['id', 'email', 'employeeNumber'],
      order: [['employeeNumber', 'ASC']],
    });
  }

  async getUserNameFromEmail(email: string, companyGroupCode?: string) {
    const condition = {
      email: email,
      active: 1,
    };

    if (companyGroupCode) {
      condition['companyGroupCode'] = companyGroupCode;
    }

    return await this.userEntity.findOne({
      where: condition,
      attributes: ['fullName', 'id'],
    });
  }

  async countEvaluationException(condition: any) {
    return await this.evaluationEntity.count({
      where: condition,
    });
  }

  async getUserEvaluatorByEvaluationId(id: number) {
    return await this.evaluationEntity.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['email', 'fullName'],
          where: { active: 1 },
        },
        {
          model: Evaluator,
          as: 'evaluator',
          include: [
            {
              model: User,
              attributes: ['email', 'fullName'],
              where: { active: 1 },
            },
          ],
        },
      ],
    });
  }

  async getUserInfoByFullname(fullName: any) {
    return await this.userEntity.findOne({
      attributes: ['id'],
      where: { fullName: fullName },
    });
  }

  async importUserFromExcel(data: any) {
    return await this.evaluatorDefaultEntity.findOrCreate({
      where: {
        evaluationPeriodId: data.evaluationPeriodId,
        userId: data.userId,
      },
      defaults: data,
    });
  }

  async getDataExportListUser(query: any) {
    const role = query.role;
    const department = query.department;
    const division = query.division;
    const nameAndEmail = query.nameAndEmail;
    const company = query.company;
    const skill = query.skill;
    const limit = query.limit;
    const offset = query.offset;
    const arrayWhere = [];
    arrayWhere.push({
      [Op.or]: [
        {
          employeeNumber: nameAndEmail
            ? { [Op.iLike]: `%${nameAndEmail}%` }
            : { [Op.not]: null },
        },
        {
          fullName: nameAndEmail
            ? { [Op.iLike]: `%${nameAndEmail}%` }
            : { [Op.not]: null },
        },
        {
          email: nameAndEmail
            ? { [Op.iLike]: `%${nameAndEmail}%` }
            : { [Op.not]: null },
        },
      ],
    });
    if (department === '_blank') {
      arrayWhere.push({
        departmentId: null,
      });
    }

    if (division === '_blank') {
      arrayWhere.push({
        divisionId: null,
      });
    }

    if (department !== 'すべて' && department !== '_blank') {
      arrayWhere.push({
        departmentId: parseInt(department[0].trim()), // get department id
      });
    }

    if (division !== 'すべて' && division !== '_blank') {
      arrayWhere.push({
        divisionId: parseInt(division[0].trim()), // get division id
      });
    }

    if (company !== 'すべて') {
      arrayWhere.push({
        companyId: parseInt(company), // get company id
      });
    }
    if (skill !== 'すべて') {
      arrayWhere.push({
        flagSkill: parseInt(skill), // get flag_skill
      });
    }

    const datas = await this.userEntity.findAndCountAll({
      attributes: [
        'id',
        'employeeNumber',
        'fullName',
        'email',
        'level',
        'flagSkill',
      ],
      where: {
        [Op.and]: arrayWhere,
        active: 1,
      },
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'code', 'name'],
        },
        {
          model: Department,
          as: 'division',
          attributes: ['id', 'code', 'name'],
        },
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name'],
        },
        {
          model: Role,
          as: 'rolesCondition',
          attributes: ['id', 'name'],
          through: { attributes: [] },
          where:
            role !== 'すべて'
              ? {
                  [Op.and]: [{ id: role }],
                }
              : undefined,
        },
        {
          model: Role,
          as: 'roles',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
      order: [['employee_number', 'ASC']],
      offset: offset,
      limit: limit,
      distinct: true,
    });

    return { data: datas.rows, counts: datas.count };
  }

  async getDataExportListUser2(query: any) {
    const role = query.role;
    const department = query.department;
    const division = query.division;
    const nameAndEmail = query.nameAndEmail;
    const company = query.company;
    const skill = query.skill;
    const companyGroupCode = query.companyGroupCode;
    console.log(role, department, division, nameAndEmail, company, skill);

    const data = await this.userEntity.sequelize.query(
      `
                select ut.id,
                       ut.employee_number                     as "employeeNumber",
                       ut.full_name                           as "fullName",
                       ut.email,
                       ut.level,
                       ut.flag_skill                          as "flagSkill",
                       ut.department_id,
                       ut.division_id,
                       ut.company_id,
                       case
                           when dt.id is not null then jsonb_build_object('name',
                                                                          dt.name,
                                                                          'id',
                                                                          dt.id)
                           else null end                      as "department",
                       dt2.id                                 as "division.id",
                       dt2.name                               as "division.name",
                       ct.id                                  as "company.id",
                       ct.name                                as "company.name",
                       ut.company_group_code                  as "companyGroupCode"
                        ,
                       jsonb_agg(jsonb_build_object('name',
                                                    rt.name,
                                                    'id',
                                                    rt.id))   as "rolesCondition",
                       coalesce((select jsonb_agg(jsonb_build_object('name',
                                                                     rt1.name,
                                                                     'id',
                                                                     rt1.id))
                                 from permission_tbl pt1
                                          inner join role_tbl rt1 on
                                     pt1.role_id = rt1.id
                                         and pt1.user_id = ut.id
                                 group by pt1.user_id), '[]') as "roles"
                from user_tbl ut
                         left outer join department_tbl dt on
                    ut.department_id = dt.id
                         left outer join department_tbl dt2 on
                    ut.division_id = dt2.id
                         left outer join company_tbl ct on
                    ut.company_id = ct.id
                         left outer join permission_tbl pt on
                    ut.id = pt.user_id
                         left outer join role_tbl rt on
                    pt.role_id = rt.id
                where ut.active = 1
                  and ut.company_group_code = :companyGroupCode
                  and coalesce(rt.id, -1) = COALESCE(:roleId, rt.id, -1)
                  and (ut.employee_number like :nameAndEmail
                    or ut.full_name like :nameAndEmail
                    or ut.email like :nameAndEmail)

                  and case
                          when :department like '_blank' then dt.id is null
                          when :department <> '_blank'
                              and :department <> '-1' then dt.id = :departmentId
                          else 1 = 1
                    end
                  and case
                          when :division like '_blank' then dt2.id is null
                          when :division <> '_blank'
                              and :division <> '-1' then dt2.id = :divisionId
                          else 1 = 1
                    end
                  and ct.id = COALESCE(:companyId, ct.id)
                  and ut.flag_skill = COALESCE(:flagSkill, ut.flag_skill)
                group by ut.id,
                         "employeeNumber",
                         "fullName",
                         ut.email,
                         ut.level,
                         "flagSkill",
                         ut.department_id,
                         ut.division_id,
                         ut.company_id,
                         dt.id,
                         dt.name,
                         "division.id",
                         "division.name",
                         "company.id",
                         "company.name",
                         ut.company_group_code,
                         "department"
                order by "employeeNumber" asc

            `,
      {
        nest: true,
        type: QueryTypes.SELECT,
        replacements: {
          roleId: role !== '-1' ? Number(role) : null,
          nameAndEmail: `%${nameAndEmail}%`,
          department: department.toString(),
          departmentId: isNaN(parseInt(department[0].trim()))
            ? null
            : parseInt(department[0].trim()),
          division: division.toString(),
          divisionId: isNaN(parseInt(division[0].trim()))
            ? null
            : parseInt(division[0].trim()),
          companyId: company !== '-1' ? Number(company) : null,
          // skill: skill,
          flagSkill: Number(skill) !== -1 ? Number(skill) : null,
          companyGroupCode: companyGroupCode,
        },
        logging: false,
      },
    );
    return { data: data, counts: data.length };
  }

  async listTemplateCreationGoal(query, id) {
    const data = await this.userEntity.sequelize.query(
      `select ut.id,
                    ut.employee_number "employeeNumber",
                    full_name          "fullName",
                    dt.name            "departmentName",
                    dt2.name           "divisionName",
                    ut.level
             from user_tbl ut
                      inner join evaluator_default_tbl edt on
                 ut.id = user_id
                      inner join department_tbl dt on
                 ut.department_id = dt.id
                      inner join department_tbl dt2 on
                 ut.division_id = dt2.id
             where evaluation_period_id = (select id
                                           from evaluation_period_tbl ept
                                           where to_date(ept.period_start,
                                                         'YYYY/MM') <=
                 date (now()) at TIME zone 'Asia/Tokyo'
               and to_date(ept.period_end
                 , 'YYYY/MM') >= date (now()) at TIME zone 'Asia/Tokyo')
               and (evaluator_0_5_id = :userId
                or evaluator_1_id = :userId
                or evaluator_2_id = :userId)
               and ut.department_id = COALESCE (:department
                 , ut.department_id)
               and
                 ut.division_id = COALESCE ( :division
                 , ut.division_id)
               and (ut.full_name like : name
                or ut.email like : name)`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          division: query.division || null,
          department: query.department || null,
          userId: id,
          name: `%${query.name || ''}%`,
        },
      },
    );
    return data;
  }

  async listUserTheSameInforWithEvaluator(query: any) {
    const offset = query.offset;
    const limit = query.limit;
    const nameAndEmail = query.nameAndEmail;
    const deparmentId = query.userInfor?.departmentId || null;
    const divisionId = query.userInfor?.divisionId || null;

    const arrayWhere = [];
    arrayWhere.push({
      [Op.or]: [
        {
          employeeNumber: nameAndEmail
            ? { [Op.iLike]: `%${nameAndEmail}%` }
            : { [Op.not]: null },
        },
        {
          fullName: nameAndEmail
            ? { [Op.iLike]: `%${nameAndEmail}%` }
            : { [Op.not]: null },
        },
        {
          email: nameAndEmail
            ? { [Op.iLike]: `%${nameAndEmail}%` }
            : { [Op.not]: null },
        },
      ],
    });

    if (deparmentId !== null && divisionId !== null) {
      arrayWhere.push({
        departmentId: deparmentId,
      });
    } else {
      arrayWhere.push({
        divisionId: divisionId,
      });
    }

    const datas = await this.userEntity.findAndCountAll({
      attributes: [
        'id',
        'employeeNumber',
        'fullName',
        'email',
        'level',
        'flagSkill',
      ],
      where: {
        [Op.and]: arrayWhere,
        active: 1,
      },
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'code', 'name'],
        },
        {
          model: Department,
          as: 'division',
          attributes: ['id', 'code', 'name'],
        },
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name'],
        },
        {
          model: Role,
          as: 'rolesCondition',
          attributes: ['id', 'name'],
          through: { attributes: [] },
          where: {
            [Op.and]: [{ id: 1 }],
          },
        },
      ],
      order: [['employee_number', 'ASC']],
      offset: offset,
      limit: limit,
      distinct: true,
    });

    return { data: datas.rows, counts: datas.count };
  }

  async getListSkillByDepDivId(ids: number[]) {
    return await this.skillGroupEntity.findAll({
      attributes: ['skillId'],
      where: { departmentId: { [Op.or]: ids } },
    });
  }

  async deleteSkillUser(conditions: any, transaction: Transaction) {
    return await this.skillUserEntity.destroy({
      where: conditions,
      transaction: transaction,
    });
  }

  async importSkillUser(listUserSkill: any, transaction?: Transaction) {
    return await this.skillUserEntity.bulkCreate(listUserSkill, {
      transaction: transaction,
    });
  }

  async getAllSkill(companyGroupCode: string) {
    return await this.skillEntity.findAll({
      attributes: ['id', 'name'],
      where: { active: 1, companyGroupCode: companyGroupCode },
      order: [['name', 'ASC']],
    });
  }

  async getAllSkillPublic(companyGroupCode: string) {
    return await this.skillEntity.findAll({
      attributes: ['id', 'name'],
      where: { active: 1, companyGroupCode: companyGroupCode },
      include: [
        {
          model: VersionProSkill,
          as: 'versionProSkill',
          attributes: ['id'],
          where: {
            status: 4,
          },
        },
      ],

      order: [['name', 'ASC']],
    });
  }

  async updateSkillUser(userId: any, evaluationId: any, periodId: any) {
    return await this.skillUserEntity.update(
      {
        evaluationId: evaluationId,
      },
      {
        where: {
          userId: userId,
          periodId: periodId,
        },
      },
    );
  }

  async getListUserWithRole(
    roleId: number,
    companyGroupCode?: string,
  ): Promise<User[]> {
    return await this.userEntity.findAll({
      where: {
        active: 1,
        ...(companyGroupCode && { companyGroupCode: companyGroupCode }),
      },
      attributes: ['fullName', 'email'],
      include: [
        {
          model: Role,
          as: 'roles',
          where: {
            id: roleId,
          },
          attributes: [],
        },
      ],
    });
  }

  async undoException(data: any, req: any) {
    const skillUser = data?.skillUser;
    const skillList = [];
    if (skillUser?.length > 0) {
      for (let i = 0; i < skillUser.length; i++) {
        const element = skillUser[i];
        skillList.push(element.skillId);
      }
    }
    return await this.evaluationEntity.sequelize.query(
      `
      CALL undo_exception(
      :periodId, :userId, :companyGroupCode, :level, :flagSkill, ARRAY[:skillList]::integer[],
      :evaluationId, :year, :periodIndex,
      :evaluator05Id, :evaluator1Id, :evaluator2Id,
      :departmentName, :departmentId, :divisionId, :divisionName
      );
      `,
      {
        replacements: {
          periodId: data?.evaluationPeriodId,
          userId: data?.userId,
          companyGroupCode: req.user.companyGroupCode,
          level: data?.level,
          flagSkill: data?.flagSkill,
          skillList: skillList,
          evaluationId: data?.id,
          year: parseInt(data.year),
          periodIndex: data.periodIndex,
          evaluator05Id: data?.evaluator05Id || null,
          evaluator1Id: data?.evaluator10Id || null,
          evaluator2Id: data?.evaluator20Id || null,
          departmentName: data?.departmentName || null,
          departmentId: data?.departmentId || null,
          divisionId: data?.divisionId || null,
          divisionName: data?.divisionName || null,
        },
        type: QueryTypes.RAW, // Hoặc QueryTypes.SELECT nếu bạn muốn xử lý kết quả
      },
    );
  }

  async getlistProSkillByIdEvaluation(condition: {
    [x: string]: any;
  }): Promise<EvaluationPro[]> {
    return this.evaluationProEntity.findAll({
      where: condition,
    });
  }
}
