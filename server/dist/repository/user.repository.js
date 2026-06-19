"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const EntityConstant_1 = require("../constant/EntityConstant");
const Company_1 = require("../entity/Company");
const Department_1 = require("../entity/Department");
const Evaluation_1 = require("../entity/Evaluation");
const EvaluationPeriod_1 = require("../entity/EvaluationPeriod");
const Evaluator_1 = require("../entity/Evaluator");
const Role_1 = require("../entity/Role");
const User_1 = require("../entity/User");
const EvaluationBasicBehavior_1 = require("../entity/EvaluationBasicBehavior");
const EvaluationPro_1 = require("../entity/EvaluationPro");
const ListProSkill_1 = require("../entity/ListProSkill");
const VersionProSkill_1 = require("../entity/VersionProSkill");
const VersionBasicBehavior_1 = require("../entity/VersionBasicBehavior");
const EvaluationAchievementPersonal_1 = require("../entity/EvaluationAchievementPersonal");
const VersionSetting_1 = require("../entity/VersionSetting");
const Permission_1 = require("../entity/Permission");
const EvaluationAchievementAdditional_1 = require("../entity/EvaluationAchievementAdditional");
const util_1 = require("../common/util");
const SettingProFormula_1 = require("../entity/SettingProFormula");
const EvaluatorDefault_1 = require("../entity/EvaluatorDefault");
const sequelize_typescript_1 = require("sequelize-typescript");
const Roles_1 = require("../enum/Roles");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const EvaluationAchievementPersonalSub_1 = require("../entity/EvaluationAchievementPersonalSub");
const HistoryApproveEvaluation_1 = require("../entity/HistoryApproveEvaluation");
const Skill_1 = require("../entity/Skill");
const EvaluationPeriodHelper_1 = require("../common/datetime/EvaluationPeriodHelper");
const SkillUser_1 = require("../entity/SkillUser");
const SummaryDepartment_1 = require("../entity/SummaryDepartment");
const CompanyGroup_1 = require("../entity/CompanyGroup");
const moment = require("moment");
let UserRepository = class UserRepository {
    getVersionSrtting() {
        throw new Error('Method not implemented.');
    }
    async getUserByEmail(email, companyGroupCode) {
        const condition = { email: email, active: 1 };
        if (companyGroupCode) {
            condition['companyGroupCode'] = companyGroupCode;
        }
        return await this.userEntity.findOne({
            where: condition,
            include: [
                {
                    model: Role_1.Role,
                    as: 'roles',
                    through: { attributes: [] },
                },
                { model: Department_1.Department, as: 'department' },
                { model: Company_1.Company, as: 'company' },
                { model: CompanyGroup_1.CompanyGroup },
            ],
        });
    }
    async getUsersWithCompanyGroup(email) {
        return await this.userEntity.findAll({
            where: { email, active: 1 },
            include: [
                {
                    model: Role_1.Role,
                    as: 'roles',
                    attributes: ['id'],
                    through: { attributes: [] },
                },
                { model: Department_1.Department, as: 'department' },
                { model: Company_1.Company, as: 'company' },
                { model: CompanyGroup_1.CompanyGroup },
            ],
        });
    }
    async getUserActive(id) {
        return await this.userEntity.findOne({
            where: { id, active: 1 },
        });
    }
    async getEvaluationPeriod(query, userId, companyGroupCode) {
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
                    [sequelize_1.Op.between]: [query.yearStart, query.yearEnd],
                },
                companyGroupCode: companyGroupCode,
            },
            include: [
                {
                    model: Evaluation_1.Evaluation,
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
                        [sequelize_1.Op.and]: [
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
                            model: Evaluator_1.Evaluator,
                            as: 'evaluator',
                            attributes: ['evaluatorId', 'evaluationOrder'],
                            include: [
                                {
                                    model: User_1.User,
                                    as: 'user',
                                    attributes: ['fullName', 'id'],
                                },
                            ],
                        },
                        {
                            model: User_1.User,
                            as: 'user',
                            attributes: ['id', 'fullName', 'employeeNumber'],
                            include: [
                                {
                                    model: Department_1.Department,
                                    as: 'department',
                                    attributes: ['code', 'name', 'type', 'class', 'active'],
                                },
                            ],
                        },
                        {
                            model: SummaryDepartment_1.SummaryDepartment,
                            as: 'summaryDepartment',
                        },
                    ],
                },
                {
                    model: EvaluatorDefault_1.EvaluatorDefault,
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
                [{ model: Evaluation_1.Evaluation, as: 'evaluations' }, 'periodStart', 'DESC'],
            ],
            offset: query.offset,
            limit: query.limit,
        });
        return evaluations;
    }
    async evaluationSkillCheck(evaluationId) {
        return await this.evaluationEntity.findOne({
            attributes: ['flagSkill'],
            where: { id: evaluationId },
        });
    }
    async getEvaluationById(id, userId, isEvaluatorUser) {
        const userCondition = isEvaluatorUser
            ? { userId }
            : { userId: { [sequelize_1.Op.not]: null } };
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
                'flagSkill',
                'evaluationPeriodId',
            ],
            where: Object.assign({ id }, userCondition),
            include: [
                {
                    model: EvaluationPeriod_1.EvaluationPeriod,
                    as: 'evaluationPeriod',
                    attributes: [
                        'dateCreationGoalStart',
                        'dateCreationGoalEnd',
                        'dateEvaluationStart',
                        'dateEvaluationEnd',
                    ],
                },
                {
                    model: Evaluator_1.Evaluator,
                    as: 'evaluator',
                    include: [{ model: User_1.User, as: 'user', attributes: ['fullName'] }],
                },
                {
                    model: EvaluationBasicBehavior_1.EvaluationBasicBehavior,
                    as: 'evaluationBasicBehavior',
                    separate: true,
                    order: [['itemNo', 'ASC']],
                },
                {
                    model: EvaluationPro_1.EvaluationPro,
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
                    model: EvaluationAchievementPersonal_1.EvaluationAchievementPersonal,
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
                            model: EvaluationAchievementPersonalSub_1.EvaluationAchievementPersonalSub,
                            as: 'evaluationAchievementPersonalSub',
                        },
                    ],
                },
                {
                    model: EvaluationAchievementAdditional_1.EvaluationAchievementAdditional,
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
                    model: User_1.User,
                    as: 'user',
                    attributes: ['id', 'fullName', 'active', 'employeeNumber'],
                    include: [
                        {
                            model: Department_1.Department,
                            as: 'department',
                            attributes: ['name', 'code'],
                        },
                    ],
                },
                {
                    model: HistoryApproveEvaluation_1.HistoryApproveEvaluation,
                    as: 'historyApproveEvaluations',
                    where: { status: { [sequelize_1.Op.ne]: '承認' } },
                    separate: true,
                    order: [['id', 'DESC']],
                    limit: 1,
                },
            ],
        });
        const evaluationAchievementPersonals = await this.evaluationAchievementPersonal
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
                    model: EvaluationAchievementPersonalSub_1.EvaluationAchievementPersonalSub,
                    as: 'evaluationAchievementPersonalSub',
                    attributes: ['coefficient', 'evaluationDecision', 'degree'],
                },
            ],
            order: [
                ['itemNo', 'ASC'],
                [
                    {
                        model: EvaluationAchievementPersonalSub_1.EvaluationAchievementPersonalSub,
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
                childrens: v.evaluationAchievementPersonalSub.map((e, i2) => {
                    var _a;
                    return ({
                        index: i,
                        note: e.evaluationDecision,
                        point: (_a = Number(e.coefficient)) === null || _a === void 0 ? void 0 : _a.toFixed(1),
                        key: `evaluation-achievement-${v.id}-${i}-${i2}`,
                        degree: e.degree,
                    });
                }),
            }));
        });
        return { evaluationDetail, evaluationAchievementPersonals };
    }
    async getEvaluationById2(id, userId, isEvaluatorUser, companyGroupCode) {
        var _a, _b;
        const evaluationDetail = await this.evaluationEntity.sequelize.query(`select "Evaluation"."id",
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
            `, {
            nest: true,
            replacements: {
                id: id,
                userId: userId,
                isEvaluatorUser: isEvaluatorUser,
            },
        });
        const evaluationAchievementPersonals = (_b = (_a = evaluationDetail[0]) === null || _a === void 0 ? void 0 : _a.evaluationAchievementPersonals) === null || _b === void 0 ? void 0 : _b.map((v, i) => {
            var _a;
            return (Object.assign(Object.assign({}, v), { childrens: (_a = v === null || v === void 0 ? void 0 : v.evaluationAchievementPersonalSub) === null || _a === void 0 ? void 0 : _a.map((e, i2) => {
                    var _a;
                    return ({
                        index: i,
                        note: e.evaluationDecision,
                        point: (_a = Number(e.coefficient)) === null || _a === void 0 ? void 0 : _a.toFixed(1),
                        key: `evaluation-achievement-${v.id}-${i}-${i2}`,
                        degree: e.degree,
                    });
                }) }));
        });
        return {
            evaluationDetail: evaluationDetail[0],
            evaluationAchievementPersonals,
        };
    }
    async getEvaluationByIdV2(id, userId, isEvaluatorUser, companyGroupCode) {
        const evaluationDetail = (await this.evaluationEntity.sequelize.query(`WITH historyApprove AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY h.evaluation_id order by h.id DESC) as rn
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
            group by e.id, e.title, pr.id, urs.id, dp.name, dp.code;`, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: {
                id: id,
                userId: userId,
                isEvaluatorUser: isEvaluatorUser,
                companyGroupCode: companyGroupCode,
            },
            raw: true,
        }));
        const evaluationAchievementPersonals = await this.evaluationAchievementPersonal
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
                    model: EvaluationAchievementPersonalSub_1.EvaluationAchievementPersonalSub,
                    as: 'evaluationAchievementPersonalSub',
                    attributes: ['coefficient', 'evaluationDecision', 'degree'],
                },
            ],
            order: [
                ['itemNo', 'ASC'],
                [
                    {
                        model: EvaluationAchievementPersonalSub_1.EvaluationAchievementPersonalSub,
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
                childrens: v.evaluationAchievementPersonalSub.map((e, i2) => {
                    var _a;
                    return ({
                        index: i,
                        note: e.evaluationDecision,
                        point: (_a = Number(e.coefficient)) === null || _a === void 0 ? void 0 : _a.toFixed(1),
                        key: `evaluation-achievement-key-${i}-${i2}`,
                        degree: e.degree,
                    });
                }),
            }));
        });
        return {
            evaluationDetail: Object.assign({}, evaluationDetail[0]),
            evaluationAchievementPersonals,
        };
    }
    async getSettingLevel(level) {
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
    async getIdEvaluation(userId, evaluationId, isEvaluatorUser) {
        const userCondition = isEvaluatorUser
            ? { userId }
            : { userId: { [sequelize_1.Op.not]: null } };
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
            where: Object.assign({ id: evaluationId }, userCondition),
            include: [
                {
                    model: Evaluator_1.Evaluator,
                    as: 'evaluator',
                },
                {
                    model: User_1.User,
                    as: 'user',
                    attributes: ['id', 'active'],
                },
                {
                    model: EvaluationPeriod_1.EvaluationPeriod,
                    as: 'evaluationPeriod',
                },
            ],
        });
    }
    async getProSkillPublicList(departmentId, divisionId, companyGroupCode, evaluationId) {
        const period = await this.evaluationEntity.findOne({
            where: { id: evaluationId },
            attributes: [],
            include: [
                { model: EvaluationPeriod_1.EvaluationPeriod, attributes: ['year', 'periodIndex'] },
            ],
        });
        const { year, periodIndex } = period.evaluationPeriod;
        const listVersionProSkill = await this.versionProSkillEntity.sequelize.query(`SELECT DISTINCT
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
        `, {
            nest: true,
            replacements: {
                evaluationId: evaluationId,
            },
        });
        const arrayVersionId = listVersionProSkill.map((item) => item.versionId);
        const versionProSkills = await this.versionProSkillEntity.findAll({
            attributes: [],
            where: {
                companyGroupCode: companyGroupCode,
                id: {
                    [sequelize_1.Op.in]: arrayVersionId,
                },
            },
            include: [
                {
                    model: ListProSkill_1.ListProSkill,
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
            order: [[{ model: ListProSkill_1.ListProSkill, as: 'listProSkills' }, 'id', 'ASC']],
        });
        if ((versionProSkills === null || versionProSkills === void 0 ? void 0 : versionProSkills.length) > 0)
            return versionProSkills;
        return [];
    }
    async getProSkillPublicListInMenu(userId, companyGroupCode, timeZone) {
        var _a, _b;
        const year = EvaluationPeriodHelper_1.EvaluationPeriodHelper.getCurrentPeriodYear(timeZone).toString();
        const periodIndex = EvaluationPeriodHelper_1.EvaluationPeriodHelper.getCurrentPeriodIndex(timeZone) == '上期' ? 1 : 2;
        const dataEvaluationPeroid = await this.evaluationPeriodEntity.findOne({
            attributes: ['id', 'checkFixed'],
            where: {
                year: year,
                periodIndex: periodIndex,
                companyGroupCode: companyGroupCode,
            },
        });
        let versionProSkills;
        versionProSkills = await this.versionProSkillEntity.findAll({
            attributes: [],
            where: {
                publicStatus: 1,
                companyGroupCode: companyGroupCode,
            },
            include: [
                {
                    model: Skill_1.Skill,
                    as: 'skill',
                    where: {
                        active: 1,
                        companyGroupCode: companyGroupCode,
                    },
                    include: [
                        {
                            model: SkillUser_1.SkillUser,
                            where: {
                                evaluationId: { [sequelize_1.Op.is]: null },
                                type: 0,
                                periodId: dataEvaluationPeroid === null || dataEvaluationPeroid === void 0 ? void 0 : dataEvaluationPeroid.id,
                                userId: userId,
                            },
                        },
                    ],
                    required: true,
                },
                {
                    model: ListProSkill_1.ListProSkill,
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
            order: [[{ model: ListProSkill_1.ListProSkill, as: 'listProSkills' }, 'id', 'ASC']],
        });
        const depDivName = await this.userEntity.findOne({
            attributes: ['level'],
            include: [
                {
                    model: Department_1.Department,
                    as: 'department',
                    attributes: ['name'],
                },
                {
                    model: Department_1.Department,
                    as: 'division',
                    attributes: ['name'],
                },
            ],
            where: { id: userId, active: 1, companyGroupCode: companyGroupCode },
        });
        const results = [];
        if (versionProSkills.length > 0) {
            versionProSkills.map((v, versionIndex) => {
                results.push(...v.listProSkills.map((pro, i) => ({
                    itemId: `${pro.itemId}_${versionIndex}_${i}`,
                    smallClass: pro.smallClass,
                    mediumClass: pro.mediumClass,
                    content: pro.content,
                    difficulty: pro.difficulty,
                    note: pro.note,
                    jobType: pro.jobType,
                    key: `${pro.itemId}_${versionIndex}_${i}`,
                })));
            });
        }
        return {
            results: results,
            depDivName: (depDivName === null || depDivName === void 0 ? void 0 : depDivName.level) > 8
                ? ((_a = depDivName === null || depDivName === void 0 ? void 0 : depDivName.division) === null || _a === void 0 ? void 0 : _a.name) || ''
                : ((_b = depDivName === null || depDivName === void 0 ? void 0 : depDivName.department) === null || _b === void 0 ? void 0 : _b.name) || '',
        };
    }
    async getNewTransaction() {
        return await this.evaluationEntity.sequelize.transaction();
    }
    async updateEvaluationProSkill(evaluationId, evaluationPro, transaction) {
        const values = evaluationPro.map((v, i) => (Object.assign(Object.assign({}, v), { itemNo: i, evaluationId })));
        return await this.evaluationProEntity
            .destroy({ where: { evaluationId }, transaction: transaction })
            .then(() => this.evaluationProEntity.bulkCreate(values, {
            transaction: transaction,
        }));
    }
    async getBasicBehavior(type, level, flagSkill, companyGroupCode) {
        const datas = (await this.listBasicBehaviorEntity.findAll({
            include: [
                {
                    model: VersionBasicBehavior_1.VersionBasicBehavior,
                    as: 'versionBasicBehavior',
                    attributes: ['id', 'version', 'subVersion'],
                    where: type === 1
                        ? {
                            type: level < 8 ? 1 : 4,
                            status: 4,
                            companyGroupCode: companyGroupCode,
                        }
                        : {
                            type: level < 8
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
        })).map((data) => data && data.get({ plain: true }));
        return datas;
    }
    async getProSkill(skillId) {
        const versionId = await this.versionProSkillEntity.findOne({
            attributes: ['id'],
            where: {
                publicStatus: 1,
                skillId: skillId,
            },
        });
        if (versionId === null || versionId === void 0 ? void 0 : versionId.id) {
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
        }
        else {
            return [];
        }
    }
    async getDivisionByIdEvaluation(idEvaluation) {
        const datas = await this.evaluationEntity.findOne({
            attributes: ['divisionName', 'evaluationPeriodId'],
            where: { id: idEvaluation },
        });
        return datas;
    }
    async getAchievementPublicByType(type, companyGroupCode) {
        return await this.settingAchievementPersonalEntity.findAll({
            include: [
                {
                    model: VersionSetting_1.VersionSetting,
                    as: 'versionSetting',
                    attributes: [],
                    where: { status: 4, type, companyGroupCode: companyGroupCode },
                },
            ],
            order: [['point', 'DESC']],
        });
    }
    async getAchievementAddPublicByType(type, typeNew, companyGroupCode) {
        return await this.settingAchievementAdditionalEntity.findAll({
            include: [
                {
                    model: VersionSetting_1.VersionSetting,
                    as: 'versionSetting',
                    attributes: [],
                    where: { status: 4, type, companyGroupCode: companyGroupCode },
                },
            ],
            where: { type: typeNew },
        });
    }
    processValueNull(value) {
        return value === null ||
            value === '' ||
            isNaN(Number(value)) ||
            (0, util_1.isFloat)(value)
            ? null
            : value;
    }
    async updateEvaluationAchievement(evaluationId, evaluationAchievement, achievementSubs, status, transaction) {
        let values = evaluationAchievement
            .filter((f) => f.achievementStatus !== '小計')
            .map((v, i) => (Object.assign(Object.assign({}, v), { evaluationId, itemNo: i, weight: v.weight === null ||
                v.weight === '' ||
                isNaN(Number(v.weight)) ||
                (0, util_1.isFloat)(v.weight)
                ? null
                : v.weight, pointUser: this.processValueNull(v.pointUser), pointEvaluator05: this.processValueNull(v.pointEvaluator05), pointEvaluator1: this.processValueNull(v.pointEvaluator1), pointEvaluator2: this.processValueNull(v.pointEvaluator2), type: v.type })));
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
            where: { achievementPersonalId: { [sequelize_1.Op.is]: null } },
            transaction: transaction,
        });
        return await this.evaluationAchievementPersonal
            .destroy({
            where: { evaluationId },
            transaction: transaction,
        })
            .then(async () => {
            return (values.length > 0 &&
                (await this.evaluationAchievementPersonal
                    .bulkCreate(values.map((e) => {
                    return Object.assign(Object.assign({}, e), { type: 1 });
                }), {
                    transaction: transaction,
                })
                    .then(async (achievements) => {
                    if (achievements.length) {
                        if (achievementSubs.length) {
                            const subs = [];
                            for (let i = 0; i < achievements.length; i++) {
                                const achievement = achievements[i];
                                if (achievementSubs[i] && achievementSubs[i].length) {
                                    subs.push(...achievementSubs[i]
                                        .filter((f) => (f === null || f === void 0 ? void 0 : f.index) === i)
                                        .map((v) => ({
                                        achievementPersonalId: achievement.id,
                                        coefficient: v.point,
                                        evaluationDecision: v.note,
                                        degree: v.degree,
                                    })));
                                }
                            }
                            const removeDuplicates = subs.filter((v, i, s) => i ===
                                s.findIndex((f) => f.achievementPersonalId === v.achievementPersonalId &&
                                    f.coefficient === v.coefficient));
                            await this.evaluationAchievementPersonalSub.bulkCreate(removeDuplicates, {
                                transaction: transaction,
                            });
                        }
                    }
                    return achievements;
                })));
        });
    }
    async updateEvaluationBasicOrBehaviorSkill(evaluationId, evaluationBasicBehavior, type, transaction) {
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
            .then(async () => values.length > 0 &&
            (await this.evaluationBasicBehaviorEntity.bulkCreate(values, {
                transaction: transaction,
            })));
    }
    async updateEvaluationAchievementAdditional(evaluationId, achievementAdditionals, transaction) {
        const values = achievementAdditionals.map((v, i) => (Object.assign(Object.assign({}, v), { itemNo: i, evaluationId })));
        return await this.evaluationAchievementAdditionalEntity
            .destroy({
            where: { evaluationId },
            transaction: transaction,
        })
            .then(() => values.length > 0 &&
            this.evaluationAchievementAdditionalEntity.bulkCreate(values, {
                transaction: transaction,
            }));
    }
    async getSettingProFormulaPublic(companyGroupCode) {
        return await this.settingProFormulaSubEntity.findAll({
            include: {
                model: SettingProFormula_1.SettingProFormula,
                as: 'settingProFormula',
                include: [
                    {
                        attributes: [],
                        model: VersionSetting_1.VersionSetting,
                        as: 'versionSetting',
                        where: { status: 4, type: 1, companyGroupCode: companyGroupCode },
                    },
                ],
            },
            order: [['totalItem', 'DESC']],
        });
    }
    async getDepartmentGoalbyEvaluationDepartmentId(evaluationDepartmentId) {
        const datas = await this.evaluationEntity.findOne({
            attributes: ['divisionName', 'title'],
            include: [
                {
                    model: EvaluationAchievementPersonal_1.EvaluationAchievementPersonal,
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
    async getDepartmentGoal(divisionId, evaluationPeriodId, companyGroupCode) {
        let level = null;
        const data = await this.evaluationEntity.findOne({
            attributes: ['level'],
            include: [
                {
                    model: User_1.User,
                    attributes: [],
                    as: 'user',
                    where: { active: 1 },
                },
            ],
            where: {
                [sequelize_1.Op.and]: [
                    {
                        divisionId: divisionId,
                    },
                    { level: { [sequelize_1.Op.gte]: 8 } },
                    { evaluationPeriodId: evaluationPeriodId },
                    { companyGroupCode: companyGroupCode },
                ],
            },
            order: [
                ['level', 'DESC'],
                sequelize_typescript_1.Sequelize.literal(`TO_DATE("Evaluation"."period_end",'YYYY/MM') DESC `),
                [sequelize_typescript_1.Sequelize.col('user.employee_number'), 'ASC'],
            ],
        });
        if (data)
            level = data.level;
        const datas = await this.evaluationEntity.findAll({
            attributes: ['id', 'divisionName', 'title'],
            include: [
                {
                    model: EvaluationAchievementPersonal_1.EvaluationAchievementPersonal,
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
                    model: User_1.User,
                    as: 'user',
                    attributes: ['employeeNumber'],
                    where: { active: 1 },
                },
            ],
            where: {
                [sequelize_1.Op.and]: [
                    {
                        divisionId: divisionId,
                    },
                    { evaluationPeriodId: evaluationPeriodId },
                    { level: level },
                    { status: { [sequelize_1.Op.gte]: 49 } },
                    { companyGroupCode: companyGroupCode },
                ],
            },
            order: [
                ['level', 'DESC'],
                sequelize_typescript_1.Sequelize.literal(`TO_DATE("Evaluation"."period_end",'YYYY/MM') DESC `),
                [sequelize_typescript_1.Sequelize.col('user.employee_number'), 'ASC'],
            ],
            nest: true,
        });
        return (datas === null || datas === void 0 ? void 0 : datas.length) >= 1 ? datas[0] : undefined;
    }
    async findPersonalSub(id) {
        return await this.evaluationAchievementPersonalSub.findAll({
            where: { achievementPersonalId: id },
        });
    }
    async getEvaluationDepartmentId(evaluationId) {
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
    async getDivisionByUserId(userId) {
        const data = await this.userEntity.findOne({
            attributes: [],
            include: [
                {
                    model: Department_1.Department,
                    attributes: ['id', 'code', 'name'],
                    as: 'division',
                },
            ],
            where: { id: userId },
        });
        return data;
    }
    async getEvaluationPeriodId(companyGroupCode, timeZone) {
        const today = moment().tz(timeZone).format('YYYY/MM/DD');
        const todayEnd = moment()
            .subtract(1, 'months')
            .tz(timeZone)
            .format('YYYY/MM/DD');
        const data = await this.evaluationPeriodEntity.findOne({
            attributes: ['id', 'year', 'periodIndex'],
            where: {
                [sequelize_1.Op.and]: [
                    sequelize_typescript_1.Sequelize.where(sequelize_typescript_1.Sequelize.fn('TO_TIMESTAMP', sequelize_typescript_1.Sequelize.col('period_start'), 'YYYY/MM'), {
                        [sequelize_1.Op.lte]: today,
                    }),
                    sequelize_typescript_1.Sequelize.where(sequelize_typescript_1.Sequelize.fn('TO_TIMESTAMP', sequelize_typescript_1.Sequelize.col('period_end'), 'YYYY/MM'), {
                        [sequelize_1.Op.gte]: todayEnd,
                    }),
                    { companyGroupCode: companyGroupCode },
                ],
            },
        });
        return data;
    }
    async getListUser(query) {
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
            [sequelize_1.Op.or]: [
                {
                    employeeNumber: nameAndEmail
                        ? { [sequelize_1.Op.iLike]: `%${nameAndEmail}%` }
                        : { [sequelize_1.Op.not]: null },
                },
                {
                    fullName: nameAndEmail
                        ? { [sequelize_1.Op.iLike]: `%${nameAndEmail}%` }
                        : { [sequelize_1.Op.not]: null },
                },
                {
                    email: nameAndEmail
                        ? { [sequelize_1.Op.iLike]: `%${nameAndEmail}%` }
                        : { [sequelize_1.Op.not]: null },
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
        if (department &&
            department !== '-1' &&
            department !== '_blank' &&
            department[0] !== 'null' &&
            department !== undefined) {
            arrayWhere.push({
                departmentId: parseInt(department[0].trim()),
            });
        }
        if (division !== '-1' && division !== '_blank') {
            arrayWhere.push({
                divisionId: parseInt(division[0].trim()),
            });
        }
        if (company !== '-1') {
            arrayWhere.push({
                companyId: parseInt(company),
            });
        }
        if (skill !== '-1') {
            arrayWhere.push({
                flagSkill: parseInt(skill),
            });
        }
        const levelArray = level
            .toString()
            .split(',')
            .map((num) => parseInt(num.trim(), 10));
        if (level !== '-1') {
            arrayWhere.push({
                level: {
                    [sequelize_1.Op.in]: levelArray,
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
                [sequelize_1.Op.and]: arrayWhere,
                active: 1,
                companyGroupCode: companyGroupCode,
            },
            include: [
                {
                    model: Department_1.Department,
                    as: 'department',
                    attributes: ['id', 'code', 'name'],
                },
                {
                    model: Department_1.Department,
                    as: 'division',
                    attributes: ['id', 'code', 'name'],
                },
                {
                    model: Company_1.Company,
                    as: 'company',
                    attributes: ['id', 'name'],
                },
                {
                    model: Role_1.Role,
                    as: 'rolesCondition',
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                    where: role !== '-1' && role !== undefined
                        ? {
                            [sequelize_1.Op.and]: [{ id: role }],
                        }
                        : undefined,
                },
                {
                    model: Role_1.Role,
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
    async deleteListUser(query, companyGroupCode, timeZone) {
        var _a;
        const countUser = await this.userEntity.count({
            where: {
                [sequelize_1.Op.and]: [
                    { active: 1 },
                    { id: { [sequelize_1.Op.in]: query } },
                    { companyGroupCode: companyGroupCode },
                ],
            },
        });
        if (countUser !== (query === null || query === void 0 ? void 0 : query.length)) {
            throw new RuntimeException_1.RuntimeException('Conflict delete user', 409);
        }
        const today = new Date();
        const year = today.getFullYear();
        const currentPeriodIndex = EvaluationPeriodHelper_1.EvaluationPeriodHelper.getCurrentPeriodIndex(timeZone) === '上期' ? 1 : 2;
        const prevYear = currentPeriodIndex === 1 ? year - 1 : year;
        const prevPeriodIndex = currentPeriodIndex === 1 ? 2 : 1;
        const listUserNotDelete = [];
        let listUserDelete = [];
        let userInForNotDelete;
        const listPeriodUnPublic = (await ((_a = (await this.evaluationPeriodEntity.findAll({
            attributes: ['id'],
            where: {
                checkFixed: { [sequelize_1.Op.ne]: 2 },
                companyGroupCode: companyGroupCode,
            },
        }))) === null || _a === void 0 ? void 0 : _a.map((a) => a === null || a === void 0 ? void 0 : a.id))) || [];
        const transaction = await EvaluatorDefault_1.EvaluatorDefault.sequelize.transaction();
        try {
            const listEvaluation = await this.evaluationEntity.findAll({
                attributes: ['id', 'status'],
                where: { companyGroupCode: companyGroupCode },
                include: [
                    {
                        model: Evaluator_1.Evaluator,
                        attributes: ['evaluationId', 'evaluatorId', 'evaluationOrder'],
                        where: {
                            evaluator_id: query,
                        },
                    },
                    {
                        model: EvaluationPeriod_1.EvaluationPeriod,
                        where: {
                            [sequelize_1.Op.or]: [
                                {
                                    [sequelize_1.Op.and]: {
                                        year: `${year}`,
                                        period_index: currentPeriodIndex,
                                    },
                                },
                                {
                                    [sequelize_1.Op.and]: {
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
                for (let i = 0; i < query.length; i++) {
                    const item = query[i];
                    await EvaluatorDefault_1.EvaluatorDefault.update({ evaluator_0_5_id: null }, {
                        where: {
                            [sequelize_1.Op.and]: [
                                { evaluator_0_5_id: item },
                                {
                                    evaluation_period_id: {
                                        [sequelize_1.Op.in]: listPeriodUnPublic,
                                    },
                                },
                                { companyGroupCode: companyGroupCode },
                            ],
                        },
                        transaction: transaction,
                        returning: true,
                    });
                    await EvaluatorDefault_1.EvaluatorDefault.update({ evaluator_1_id: null }, {
                        where: {
                            [sequelize_1.Op.and]: [
                                { evaluator_1_id: item },
                                {
                                    evaluation_period_id: {
                                        [sequelize_1.Op.in]: listPeriodUnPublic,
                                    },
                                },
                                { companyGroupCode: companyGroupCode },
                            ],
                        },
                        transaction: transaction,
                        returning: true,
                    });
                    await EvaluatorDefault_1.EvaluatorDefault.update({ evaluator_2_id: null }, {
                        where: {
                            [sequelize_1.Op.and]: [
                                { evaluator_2_id: item },
                                {
                                    evaluation_period_id: {
                                        [sequelize_1.Op.in]: listPeriodUnPublic,
                                    },
                                },
                                { companyGroupCode: companyGroupCode },
                            ],
                        },
                        transaction: transaction,
                        returning: true,
                    });
                    const user = await this.userEntity.findOne({
                        where: { id: item },
                        include: [
                            {
                                model: Role_1.Role,
                                as: 'roles',
                                attributes: ['name'],
                                through: { attributes: [] },
                            },
                        ],
                    });
                    if (user &&
                        user.roles.findIndex((v) => v.name === 'PRO_SKILL_SETTING') >= 0) {
                        await this.skillRole.destroy({
                            where: { userId: item, role: 1 },
                            transaction: transaction,
                        });
                    }
                    if (user &&
                        user.roles.findIndex((v) => v.name === 'PRO_SKILL_APPROVAL') >= 0) {
                        await this.skillRole.destroy({
                            where: { userId: item, role: 2 },
                            transaction: transaction,
                        });
                    }
                    const changeActives = await User_1.User.update({ active: 0 }, {
                        where: { id: item },
                        transaction: transaction,
                        returning: true,
                    });
                    if (!changeActives) {
                        await transaction.rollback();
                        throw new RuntimeException_1.RuntimeException('not Found', 500);
                    }
                    await this.permission.destroy({
                        where: { userId: item },
                        transaction: transaction,
                    });
                    await EvaluatorDefault_1.EvaluatorDefault.destroy({
                        where: {
                            [sequelize_1.Op.and]: [
                                { userId: item },
                                {
                                    evaluation_period_id: {
                                        [sequelize_1.Op.in]: listPeriodUnPublic,
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
            }
            else {
                const listEvaluationId = [];
                listEvaluation.map((item) => {
                    item.evaluator.map((e) => {
                        query.map((id) => {
                            if ((id === e.evaluatorId &&
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
                                    item.status < 100)) {
                                listUserNotDelete.push(id);
                            }
                        });
                    });
                    if (item.status < 100) {
                        listEvaluationId.push(item.id);
                    }
                });
                listUserDelete = query.filter((word) => !listUserNotDelete.includes(word));
                userInForNotDelete = await User_1.User.findAll({
                    attributes: ['employeeNumber', 'fullName'],
                    where: {
                        id: listUserNotDelete,
                    },
                });
                for (let i = 0; i < listUserDelete.length; i++) {
                    const item = listUserDelete[i];
                    await EvaluatorDefault_1.EvaluatorDefault.update({ evaluator_0_5_id: null }, {
                        where: {
                            [sequelize_1.Op.and]: [
                                { evaluator_0_5_id: item },
                                {
                                    evaluation_period_id: {
                                        [sequelize_1.Op.in]: listPeriodUnPublic,
                                    },
                                },
                                { companyGroupCode: companyGroupCode },
                            ],
                        },
                        transaction: transaction,
                        returning: true,
                    });
                    await EvaluatorDefault_1.EvaluatorDefault.update({ evaluator_1_id: null }, {
                        where: {
                            [sequelize_1.Op.and]: [
                                { evaluator_1_id: item },
                                {
                                    evaluation_period_id: {
                                        [sequelize_1.Op.in]: listPeriodUnPublic,
                                    },
                                },
                                { companyGroupCode: companyGroupCode },
                            ],
                        },
                        transaction: transaction,
                        returning: true,
                    });
                    await EvaluatorDefault_1.EvaluatorDefault.update({ evaluator_2_id: null }, {
                        where: {
                            [sequelize_1.Op.and]: [
                                { evaluator_2_id: item },
                                {
                                    evaluation_period_id: {
                                        [sequelize_1.Op.in]: listPeriodUnPublic,
                                    },
                                },
                                { companyGroupCode: companyGroupCode },
                            ],
                        },
                        transaction: transaction,
                        returning: true,
                    });
                    const user = await this.userEntity.findOne({
                        where: { id: item },
                        include: [
                            {
                                model: Role_1.Role,
                                as: 'roles',
                                attributes: ['name'],
                                through: { attributes: [] },
                            },
                        ],
                    });
                    if (user &&
                        user.roles.findIndex((v) => v.name === 'PRO_SKILL_SETTING') >= 0) {
                        await this.skillRole.destroy({
                            where: { userId: item, role: 1 },
                            transaction: transaction,
                        });
                    }
                    if (user &&
                        user.roles.findIndex((v) => v.name === 'PRO_SKILL_APPROVAL') >= 0) {
                        await this.skillRole.destroy({
                            where: { userId: item, role: 2 },
                            transaction: transaction,
                        });
                    }
                    listEvaluationId.forEach(async (evaluationId) => {
                        await Evaluator_1.Evaluator.destroy({
                            where: {
                                [sequelize_1.Op.and]: [
                                    {
                                        evaluationId: evaluationId,
                                        evaluatorId: item,
                                        evaluationOrder: { [sequelize_1.Op.ne]: 2.0 },
                                    },
                                ],
                            },
                            transaction: transaction,
                        });
                    });
                    await User_1.User.update({ active: 0 }, {
                        where: { id: item },
                        transaction: transaction,
                        returning: true,
                    });
                    await this.permission.destroy({
                        where: { userId: item },
                        transaction: transaction,
                    });
                    await EvaluatorDefault_1.EvaluatorDefault.destroy({
                        where: {
                            [sequelize_1.Op.and]: [
                                { userId: item },
                                {
                                    evaluation_period_id: {
                                        [sequelize_1.Op.in]: listPeriodUnPublic,
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
        }
        catch (error) {
            await transaction.rollback();
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return { userInfor: userInForNotDelete };
    }
    updateListUser(query) {
        const listID = query.listId;
        const company = query.company;
        const department = query.department;
        const division = query.division;
        const level = query.level;
        if (company !== '変更しない') {
            listID.forEach(async (item) => {
                const check = await User_1.User.update({ companyId: company }, {
                    where: { id: item },
                    returning: true,
                });
                if (!check) {
                    throw new RuntimeException_1.RuntimeException('not Found', 500);
                }
            });
        }
        if (department !== '変更しない') {
            listID.forEach(async (item) => {
                const check = await User_1.User.update({ departmentId: department }, {
                    where: { id: item },
                    returning: true,
                });
                if (!check) {
                    throw new RuntimeException_1.RuntimeException('not Found', 500);
                }
            });
        }
        if (division !== '変更しない') {
            listID.forEach(async (item) => {
                const check = await User_1.User.update({ divisionId: division }, {
                    where: { id: item },
                    returning: true,
                });
                if (!check) {
                    throw new RuntimeException_1.RuntimeException('not Found', 500);
                }
            });
        }
        if (level !== '変更しない') {
            listID.forEach(async (item) => {
                const check = await User_1.User.update({ level: level }, {
                    where: { id: item },
                    returning: true,
                });
                if (!check) {
                    throw new RuntimeException_1.RuntimeException('not Found', 500);
                }
            });
        }
    }
    async getBasicBehaviorSkillPublic(type, companyGroupCode, level) {
        return (await this.listBasicBehaviorEntity.findAll({
            include: {
                model: VersionBasicBehavior_1.VersionBasicBehavior,
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
        })).map((data) => data && data.get({ plain: true }));
    }
    async updateEvaluationBasicBehaviorSkill(evaluationId, level, flagSkill, companyGroupCode, transaction) {
        await this.evaluationBasicBehaviorEntity.destroy({
            where: { evaluationId },
            transaction: transaction,
        });
        const basicBehaviors = (await this.listBasicBehaviorEntity.findAll({
            include: {
                model: VersionBasicBehavior_1.VersionBasicBehavior,
                as: 'versionBasicBehavior',
                where: {
                    status: 4,
                    [sequelize_1.Op.or]: [{ type: 1 }, { type: flagSkill === 0 ? 3 : 2, level }],
                    companyGroupCode: companyGroupCode,
                },
                attributes: ['type'],
            },
            order: [['idItem', 'ASC']],
        }))
            .map((data) => data && data.get({ plain: true }))
            .map((v, i) => (Object.assign(Object.assign({}, v), { evaluationId, itemNo: i, type: v.versionBasicBehavior.type, itemTitle: v.title })));
        return await this.evaluationBasicBehaviorEntity.bulkCreate(basicBehaviors, {
            transaction: transaction,
        });
    }
    async updateUserInfo(body, userId) {
        return await this.userEntity.update(body, { where: { id: userId } });
    }
    async deletePermission(userId, isChangeRole2, isChangeRoleF3, isChangeRoleF4, transaction) {
        if (isChangeRole2) {
            await EvaluatorDefault_1.EvaluatorDefault.update({ evaluator_0_5_id: null }, {
                where: { evaluator_0_5_id: userId },
                transaction: transaction,
                returning: true,
            });
            await EvaluatorDefault_1.EvaluatorDefault.update({ evaluator_1_id: null }, {
                where: { evaluator_1_id: userId },
                transaction: transaction,
                returning: true,
            });
            await EvaluatorDefault_1.EvaluatorDefault.update({ evaluator_2_id: null }, {
                where: { evaluator_2_id: userId },
                transaction: transaction,
                returning: true,
            });
        }
        if (isChangeRoleF3) {
            await this.skillRole.destroy({ where: { userId: userId, role: 1 } });
        }
        if (isChangeRoleF4) {
            await this.skillRole.destroy({ where: { userId: userId, role: 2 } });
        }
        return await this.permission.destroy({ where: { userId: userId } });
    }
    async updatePermission(body, transaction) {
        return await this.permission.bulkCreate(body, {
            transaction: transaction,
        });
    }
    async getEvaluator(userId, order, companyGroupCode) {
        const evaluations = await this.evaluationEntity.findAll({
            attributes: ['id', 'userId', 'status'],
            where: { companyGroupCode: companyGroupCode },
            include: [
                {
                    model: Evaluator_1.Evaluator,
                    as: 'evaluator',
                    attributes: ['evaluatorId', 'evaluationOrder', 'evaluationId'],
                    where: { evaluatorId: userId, evaluationOrder: order },
                },
            ],
        });
        return evaluations;
    }
    async getLengthEvaluationPeriod(query, userId, companyGroupCode) {
        const evaluations = await this.evaluationPeriodEntity.count({
            where: {
                year: {
                    [sequelize_1.Op.between]: [query.yearStart, query.yearEnd],
                },
                companyGroupCode: companyGroupCode,
            },
            include: [
                {
                    model: Evaluation_1.Evaluation,
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
                            model: Evaluator_1.Evaluator,
                            as: 'evaluator',
                            attributes: ['evaluatorId', 'evaluationOrder'],
                            include: [
                                {
                                    model: User_1.User,
                                    as: 'user',
                                    attributes: ['fullName'],
                                },
                            ],
                        },
                        {
                            model: User_1.User,
                            as: 'user',
                            attributes: ['fullName', 'employeeNumber'],
                            include: [
                                {
                                    model: Department_1.Department,
                                    as: 'department',
                                },
                            ],
                        },
                    ],
                },
                {
                    model: EvaluatorDefault_1.EvaluatorDefault,
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
    async getEvaluationByUserId(id, companyGroupCode) {
        var _a, _b, _c, _d;
        const arrayWheres = [];
        const userInfo = await this.userEntity.findOne({
            attributes: ['level', 'flagSkill'],
            include: [
                {
                    model: Department_1.Department,
                    as: 'department',
                    attributes: ['name'],
                },
                {
                    model: Department_1.Department,
                    as: 'division',
                    attributes: ['name'],
                },
            ],
            where: { id: id },
        });
        arrayWheres.push({ userId: id });
        arrayWheres.push({ creationUser: { [sequelize_1.Op.eq]: null } });
        arrayWheres.push({ companyGroupCode: companyGroupCode });
        arrayWheres.push({ status: { [sequelize_1.Op.lt]: 50 } });
        if (userInfo) {
            arrayWheres.push({
                level: userInfo === null || userInfo === void 0 ? void 0 : userInfo.level,
            });
            arrayWheres.push({
                flagSkill: userInfo === null || userInfo === void 0 ? void 0 : userInfo.flagSkill,
            });
            if ((_a = userInfo === null || userInfo === void 0 ? void 0 : userInfo.division) === null || _a === void 0 ? void 0 : _a.name) {
                arrayWheres.push({
                    divisionName: (_b = userInfo === null || userInfo === void 0 ? void 0 : userInfo.division) === null || _b === void 0 ? void 0 : _b.name,
                });
            }
            if ((_c = userInfo === null || userInfo === void 0 ? void 0 : userInfo.department) === null || _c === void 0 ? void 0 : _c.name) {
                arrayWheres.push({
                    departmentName: (_d = userInfo === null || userInfo === void 0 ? void 0 : userInfo.department) === null || _d === void 0 ? void 0 : _d.name,
                });
            }
        }
        return await this.evaluationEntity.findAll({
            attributes: ['level'],
            where: {
                [sequelize_1.Op.and]: arrayWheres,
            },
            include: [
                {
                    model: EvaluationPeriod_1.EvaluationPeriod,
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
    async getUserDetailById(id) {
        return await this.userEntity.findOne({
            where: {
                id: id,
            },
            include: [
                {
                    model: Department_1.Department,
                    as: 'department',
                    attributes: ['id', 'code', 'name'],
                },
                {
                    model: Department_1.Department,
                    as: 'division',
                    attributes: ['id', 'code', 'name'],
                },
                {
                    model: Company_1.Company,
                    as: 'company',
                    attributes: ['id', 'name'],
                },
                {
                    model: Role_1.Role,
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
    async searchListUserSettingEvaluator(query) {
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
        let statement = '';
        const condition = {};
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
        else if (departmentId) {
            statement += ' AND ED.DEPARTMENT_ID = :departmentId';
            condition['departmentId'] = departmentId;
        }
        else if (departmentName === 'すべて') {
            statement +=
                ' AND ( ED.DEPARTMENT_NAME IS NOT NULL OR ED.DIVISION_NAME IS NOT NULL )';
        }
        else {
            statement +=
                ' AND ( ED.DEPARTMENT_NAME LIKE :depDivName OR ED.DIVISION_NAME LIKE :depDivName )';
            condition['depDivName'] = `%${departmentName[0]}%`;
        }
        if (skill !== 'すべて') {
            statement += ' AND ( SU.SKILL_ID = :skillId )';
            condition['skillId'] = parseInt(skill);
        }
        if (level === 'すべて') {
            statement += ' AND ED.LEVEL IS NOT NULL';
        }
        else {
            statement += ' AND ED.LEVEL = :level';
            condition['level'] = parseInt(level);
        }
        if (flagSkill === 'すべて') {
            statement += ' AND ED.FLAG_SKILL IS NOT NULL';
        }
        else {
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
                    ' ( U1.FULL_NAME LIKE :evaluatorName OR U1.EMPLOYEE_NUMBER LIKE :evaluatorName OR U1.EMAIL LIKE :evaluatorName ) ' +
                    ' OR ( U2.FULL_NAME LIKE :evaluatorName OR U2.EMPLOYEE_NUMBER LIKE :evaluatorName OR U2.EMAIL LIKE :evaluatorName ) ' +
                    ' OR ( U3.FULL_NAME LIKE :evaluatorName OR U3.EMPLOYEE_NUMBER LIKE :evaluatorName OR U3.EMAIL LIKE :evaluatorName ) ' +
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
        const finalData = await this.evaluatorDefaultEntity.sequelize.query(queryUserId, {
            nest: true,
            replacements: condition,
            logging: false,
        });
        let listUsersId = [];
        finalData.map((item) => {
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
        results.forEach((item) => {
            if (item.childrens) {
                item.childrens.map((itemSub) => {
                    var _a, _b, _c;
                    let evaluator05Obj = (_a = itemSub === null || itemSub === void 0 ? void 0 : itemSub.evaluator) === null || _a === void 0 ? void 0 : _a.find(({ evaluationOrder }) => evaluationOrder === 0.5);
                    if (evaluator05Obj === null || evaluator05Obj === void 0 ? void 0 : evaluator05Obj.user) {
                        itemSub.evaluator05 =
                            (evaluator05Obj === null || evaluator05Obj === void 0 ? void 0 : evaluator05Obj.user.employeeNumber) +
                                ': ' +
                                (evaluator05Obj === null || evaluator05Obj === void 0 ? void 0 : evaluator05Obj.user.fullName);
                        itemSub.evaluator05Email = evaluator05Obj === null || evaluator05Obj === void 0 ? void 0 : evaluator05Obj.user.email;
                        itemSub.evaluator05Id = evaluator05Obj === null || evaluator05Obj === void 0 ? void 0 : evaluator05Obj.user.id;
                    }
                    let evaluator1Obj = (_b = itemSub === null || itemSub === void 0 ? void 0 : itemSub.evaluator) === null || _b === void 0 ? void 0 : _b.find(({ evaluationOrder }) => evaluationOrder === 1);
                    if (evaluator1Obj === null || evaluator1Obj === void 0 ? void 0 : evaluator1Obj.user) {
                        itemSub.evaluator10 =
                            (evaluator1Obj === null || evaluator1Obj === void 0 ? void 0 : evaluator1Obj.user.employeeNumber) +
                                ': ' +
                                (evaluator1Obj === null || evaluator1Obj === void 0 ? void 0 : evaluator1Obj.user.fullName);
                        itemSub.evaluator10Email = evaluator1Obj === null || evaluator1Obj === void 0 ? void 0 : evaluator1Obj.user.email;
                        itemSub.evaluator10Id = evaluator1Obj === null || evaluator1Obj === void 0 ? void 0 : evaluator1Obj.user.id;
                    }
                    let evaluator2Obj = (_c = itemSub === null || itemSub === void 0 ? void 0 : itemSub.evaluator) === null || _c === void 0 ? void 0 : _c.find(({ evaluationOrder }) => evaluationOrder === 2);
                    if (evaluator2Obj === null || evaluator2Obj === void 0 ? void 0 : evaluator2Obj.user) {
                        itemSub.evaluator20 =
                            (evaluator2Obj === null || evaluator2Obj === void 0 ? void 0 : evaluator2Obj.user.employeeNumber) +
                                ': ' +
                                (evaluator2Obj === null || evaluator2Obj === void 0 ? void 0 : evaluator2Obj.user.fullName);
                        itemSub.evaluator20Email = evaluator2Obj === null || evaluator2Obj === void 0 ? void 0 : evaluator2Obj.user.email;
                        itemSub.evaluator20Id = evaluator2Obj === null || evaluator2Obj === void 0 ? void 0 : evaluator2Obj.user.id;
                    }
                    itemSub.userEmail = item.email;
                });
            }
        });
        return { data: results, counts: listUsersId.length };
    }
    async searchListUserSettingEvaluator2(query) {
        var _a, _b, _c, _d;
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
        const datas = (await this.evaluationEntity.sequelize.query(`select jsonb_agg("userId") "listUserId",
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
            `, {
            nest: true,
            replacements: {
                departmentName: `%${departmentName === 'すべて' ? '' : departmentName}%`,
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
        }));
        const listUsersId = ((_a = datas[0]) === null || _a === void 0 ? void 0 : _a.listUserId) ? (_b = datas[0]) === null || _b === void 0 ? void 0 : _b.listUserId : [];
        const test = (await this.evaluationEntity.sequelize.query(`select ut.id               "userId",
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
            `, {
            nest: true,
            replacements: {
                periodId: evaluationPeriodId,
                listUserId: listUsersId.length > 0 ? listUsersId : -1,
            },
        }));
        return { data: test, counts: ((_c = datas[0]) === null || _c === void 0 ? void 0 : _c.count) ? (_d = datas[0]) === null || _d === void 0 ? void 0 : _d.count : 0 };
    }
    async getUserListForMail(condition, roleId) {
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
                    model: Permission_1.Permission,
                    as: 'permissions',
                    where: { roleId: { [sequelize_1.Op.in]: roleId } },
                },
                { model: Department_1.Department, as: 'department' },
            ],
        }));
    }
    async getUserActiveByCondition(departmentId, companyId, periodId, searchInput, limit, offset) {
        const searchInputCondition = (searchInput === null || searchInput === void 0 ? void 0 : searchInput.length) > 0
            ? {
                [sequelize_1.Op.or]: [
                    { fullName: { [sequelize_1.Op.iLike]: `%${searchInput}%` } },
                    { email: { [sequelize_1.Op.iLike]: `%${searchInput}%` } },
                    { employeeNumber: { [sequelize_1.Op.iLike]: `%${searchInput}%` } },
                ],
            }
            : { employeeNumber: { [sequelize_1.Op.not]: null } };
        const departmentCondition = departmentId
            ? {
                [sequelize_1.Op.or]: {
                    departmentId,
                    divisionId: departmentId,
                },
            }
            : {};
        const conditions = Object.assign(Object.assign({ active: 1 }, searchInputCondition), departmentCondition);
        if (companyId)
            conditions['companyId'] = companyId;
        const users = await this.userEntity.findAll({
            where: Object.assign({}, conditions),
            include: [
                {
                    model: Department_1.Department,
                    as: 'department',
                    attributes: ['id', 'code', 'name'],
                },
                { model: Company_1.Company, as: 'company', attributes: ['id', 'name'] },
                {
                    model: EvaluatorDefault_1.EvaluatorDefault,
                    as: 'evaluatorDefault',
                    where: { evaluationPeriodId: periodId },
                },
            ],
            order: [['employeeNumber', 'ASC']],
            limit: limit || 20,
            offset: offset || 0,
        });
        const count = await this.userEntity.count({
            where: Object.assign({}, conditions),
            include: [
                {
                    model: Department_1.Department,
                    as: 'department',
                    attributes: ['id', 'code', 'name'],
                },
                { model: Company_1.Company, as: 'company', attributes: ['id', 'name'] },
                {
                    model: EvaluatorDefault_1.EvaluatorDefault,
                    as: 'evaluatorDefault',
                    where: { evaluationPeriodId: periodId },
                },
            ],
        });
        return { users, count };
    }
    async getListEvaluator(evaluationCreatorId, companyGroupCode) {
        const condition = evaluationCreatorId
            ? {
                id: { [sequelize_1.Op.ne]: evaluationCreatorId },
            }
            : {};
        const listEvaluator = await this.userEntity.findAll({
            attributes: ['id', 'employeeNumber', 'fullName'],
            where: Object.assign({ active: 1, companyGroupCode: companyGroupCode }, condition),
            include: [
                {
                    model: Role_1.Role,
                    as: 'roles',
                    attributes: [],
                    where: { id: Roles_1.Roles.F2 },
                },
            ],
            order: [['employeeNumber', 'ASC']],
            logging: true,
        });
        return listEvaluator;
    }
    async updateSettingEvaluatorOfOneUser(query, companyGroupCode) {
        const skills = query.skills;
        const year = query.state.year;
        const periodIndex = query.state.periodIndex;
        const evaluatorHaft = query.evaluatorHaft === undefined ? null : query.evaluatorHaft;
        const evaluatorFirst = query.evaluatorFirst === undefined ? null : query.evaluatorFirst;
        const evaluatorSecond = query.evaluatorSecond === undefined ? null : query.evaluatorSecond;
        const userId = query.userId;
        let tempEvaluatorHaft = null;
        let tempEvaluatorFirst = null;
        let tempEvaluatorSecond = null;
        const listEvaluatorDeleted = [];
        const listCanNotDeleteEvaluator = [];
        let userNotRoleUserOrDeleted;
        let checkEvaluator0_5 = 'notPermission';
        let checkEvaluator1_0 = 'notPermission';
        let checkEvaluator2_0 = 'notPermission';
        tempEvaluatorHaft = evaluatorHaft === null ? null : evaluatorHaft;
        tempEvaluatorFirst = evaluatorFirst === null ? null : evaluatorFirst;
        tempEvaluatorSecond = evaluatorSecond === null ? null : evaluatorSecond;
        let checkUserCanEdit = false;
        const findUserCanEdit = await User_1.User.findOne({
            attributes: ['employeeNumber', 'fullName'],
            where: {
                id: userId,
                active: 1,
                companyGroupCode: companyGroupCode,
            },
            include: [
                {
                    model: Role_1.Role,
                    as: 'roles',
                    where: {
                        id: 1,
                    },
                },
            ],
        });
        if (findUserCanEdit === null) {
            checkUserCanEdit = false;
            userNotRoleUserOrDeleted = await User_1.User.findAll({
                attributes: ['employeeNumber', 'fullName'],
                where: {
                    id: userId,
                    companyGroupCode: companyGroupCode,
                },
            });
        }
        else {
            checkUserCanEdit = true;
            userNotRoleUserOrDeleted = [];
        }
        if (tempEvaluatorHaft !== null) {
            const check = await User_1.User.findAll({
                attributes: ['id'],
                where: {
                    id: tempEvaluatorHaft,
                    active: 1,
                    companyGroupCode: companyGroupCode,
                },
                include: [
                    {
                        model: Role_1.Role,
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
            else {
                checkEvaluator0_5 = 'permission';
                tempEvaluatorHaft = tempEvaluatorHaft;
            }
        }
        if (tempEvaluatorFirst !== null) {
            const check = await User_1.User.findAll({
                attributes: ['id'],
                where: {
                    id: tempEvaluatorFirst,
                    active: 1,
                    companyGroupCode: companyGroupCode,
                },
                include: [
                    {
                        model: Role_1.Role,
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
            else {
                checkEvaluator1_0 = 'permission';
                tempEvaluatorFirst = tempEvaluatorFirst;
            }
        }
        if (tempEvaluatorSecond !== null) {
            const check = await User_1.User.findAll({
                attributes: ['id'],
                where: {
                    id: tempEvaluatorSecond,
                    active: 1,
                    companyGroupCode: companyGroupCode,
                },
                include: [
                    {
                        model: Role_1.Role,
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
            else {
                checkEvaluator2_0 = 'permission';
                tempEvaluatorSecond = tempEvaluatorSecond;
            }
        }
        if (checkUserCanEdit) {
            const financialPeriod = periodIndex === 1 ? '上期' : '下期';
            const financialYear = year;
            const listEvaluation = await this.evaluationEntity.findAll({
                attributes: ['id', 'status'],
                where: {
                    [sequelize_1.Op.and]: {
                        title: `${financialYear}年${financialPeriod}`,
                        userId: userId,
                        creationUser: { [sequelize_1.Op.eq]: null },
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
            const transaction = await EvaluatorDefault_1.EvaluatorDefault.sequelize.transaction();
            try {
                const userInfo = await EvaluatorDefault_1.EvaluatorDefault.findOne({
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
                            creationUser: { [sequelize_1.Op.is]: null },
                        },
                    });
                    if (userInfo.flagSkill == 1 && (skills === null || skills === void 0 ? void 0 : skills.length) > 0) {
                        if (evaluation && evaluation.status < 50) {
                            const temSkillAlreadySetting = await this.skillUserEntity.findAll({
                                attributes: ['skillId'],
                                where: {
                                    periodId: dataEvaluationPeroid.id,
                                    userId: userId,
                                    evaluationId: null,
                                    type: 0,
                                },
                            });
                            const skillAlreadySetting = [];
                            if (temSkillAlreadySetting.length > 0) {
                                temSkillAlreadySetting.map((item) => {
                                    skillAlreadySetting.push(item.skillId);
                                });
                            }
                            const skillDelete = (0, util_1.findDeletedIdsSkill)(skills, skillAlreadySetting);
                            if (skillDelete.length > 0) {
                                await this.evaluationEntity.sequelize.query('CALL delete_skill_evaluation(ARRAY[:skillDelete], :evaluationId, :companyGroupCode)', {
                                    replacements: {
                                        skillDelete: skillDelete,
                                        evaluationId: evaluation.id,
                                        companyGroupCode: companyGroupCode,
                                    },
                                    type: sequelize_1.QueryTypes.RAW,
                                    logging: false,
                                });
                            }
                        }
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
                if (tempEvaluatorSecond !== null) {
                    await EvaluatorDefault_1.EvaluatorDefault.update({
                        evaluator_2_id: checkEvaluator2_0 === 'permission' ? tempEvaluatorSecond : null,
                    }, {
                        where: {
                            userId: userId,
                            evaluationPeriodId: dataEvaluationPeroid.id,
                            companyGroupCode: companyGroupCode,
                        },
                        returning: true,
                        transaction: transaction,
                    });
                }
                if (tempEvaluatorFirst !== null) {
                    await EvaluatorDefault_1.EvaluatorDefault.update({
                        evaluator_1_id: checkEvaluator1_0 === 'permission' ? tempEvaluatorFirst : null,
                    }, {
                        where: {
                            userId: userId,
                            evaluationPeriodId: dataEvaluationPeroid.id,
                            companyGroupCode: companyGroupCode,
                        },
                        returning: true,
                        transaction: transaction,
                    });
                }
                if (tempEvaluatorHaft !== null) {
                    await EvaluatorDefault_1.EvaluatorDefault.update({
                        evaluator_0_5_id: checkEvaluator0_5 === 'permission' ? tempEvaluatorHaft : null,
                    }, {
                        where: {
                            userId: userId,
                            evaluationPeriodId: dataEvaluationPeroid.id,
                            companyGroupCode: companyGroupCode,
                        },
                        returning: true,
                        transaction: transaction,
                    });
                }
                if (listEvaluation.length === 0) {
                    if (tempEvaluatorHaft === null) {
                        await EvaluatorDefault_1.EvaluatorDefault.update({
                            evaluator_0_5_id: null,
                        }, {
                            where: {
                                userId: userId,
                                evaluationPeriodId: dataEvaluationPeroid.id,
                                companyGroupCode: companyGroupCode,
                            },
                            returning: true,
                            transaction: transaction,
                        });
                    }
                    if (tempEvaluatorFirst === null) {
                        await EvaluatorDefault_1.EvaluatorDefault.update({
                            evaluator_1_id: null,
                        }, {
                            where: {
                                userId: userId,
                                evaluationPeriodId: dataEvaluationPeroid.id,
                                companyGroupCode: companyGroupCode,
                            },
                            returning: true,
                            transaction: transaction,
                        });
                    }
                }
                else {
                    for (let i = 0; i < listEvaluation.length; i++) {
                        if (tempEvaluatorHaft === null &&
                            ![3, 4, 53, 54, 55].includes(listEvaluation[i].status)) {
                            await EvaluatorDefault_1.EvaluatorDefault.update({
                                evaluator_0_5_id: null,
                            }, {
                                where: {
                                    userId: userId,
                                    evaluationPeriodId: dataEvaluationPeroid.id,
                                    companyGroupCode: companyGroupCode,
                                },
                                returning: true,
                                transaction: transaction,
                            });
                        }
                        else if (tempEvaluatorHaft === null &&
                            [3, 4, 53, 54, 55].includes(listEvaluation[i].status) &&
                            query.getValueDelete05) {
                            listCanNotDeleteEvaluator.push(query.getValueDelete05);
                        }
                        if (tempEvaluatorFirst === null &&
                            ![5, 6, 56, 57, 58].includes(listEvaluation[i].status)) {
                            await EvaluatorDefault_1.EvaluatorDefault.update({
                                evaluator_1_id: null,
                            }, {
                                where: {
                                    userId: userId,
                                    evaluationPeriodId: dataEvaluationPeroid.id,
                                    companyGroupCode: companyGroupCode,
                                },
                                returning: true,
                                transaction: transaction,
                            });
                        }
                        else if (tempEvaluatorFirst === null &&
                            [5, 6, 56, 57, 58].includes(listEvaluation[i].status) &&
                            query.getValueDelete10) {
                            listCanNotDeleteEvaluator.push(query.getValueDelete10);
                        }
                    }
                }
                if (listEvaluation.length > 0) {
                    for (let i = 0; i < listEvaluation.length; i++) {
                        const item = listEvaluation[i];
                        if (tempEvaluatorHaft === null &&
                            ![3, 4, 53, 54, 55].includes(item.status)) {
                            await this.evaluatorEntity.destroy({
                                where: {
                                    [sequelize_1.Op.and]: [
                                        {
                                            evaluationId: item.id,
                                            evaluationOrder: 0.5,
                                        },
                                    ],
                                },
                                transaction: transaction,
                            });
                        }
                        if (tempEvaluatorFirst === null &&
                            ![5, 6, 56, 57, 58].includes(item.status)) {
                            await this.evaluatorEntity.destroy({
                                where: {
                                    [sequelize_1.Op.and]: [
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
                                    [sequelize_1.Op.and]: [
                                        {
                                            evaluationId: item.id,
                                            evaluationOrder: 2.0,
                                        },
                                    ],
                                },
                                transaction: transaction,
                            });
                        }
                        if (tempEvaluatorHaft !== null) {
                            await this.evaluatorEntity.update({
                                evaluatorId: checkEvaluator0_5 === 'permission'
                                    ? tempEvaluatorHaft
                                    : null,
                            }, {
                                where: {
                                    [sequelize_1.Op.and]: [
                                        {
                                            evaluationId: item.id,
                                            evaluationOrder: 0.5,
                                        },
                                    ],
                                },
                                transaction: transaction,
                            });
                        }
                        if (tempEvaluatorFirst !== null) {
                            await this.evaluatorEntity.update({
                                evaluatorId: checkEvaluator1_0 === 'permission'
                                    ? tempEvaluatorFirst
                                    : null,
                            }, {
                                where: {
                                    [sequelize_1.Op.and]: [
                                        {
                                            evaluationId: item.id,
                                            evaluationOrder: 1.0,
                                        },
                                    ],
                                },
                                transaction: transaction,
                            });
                        }
                        if (tempEvaluatorSecond !== null) {
                            await this.evaluatorEntity.update({
                                evaluatorId: checkEvaluator2_0 === 'permission'
                                    ? tempEvaluatorSecond
                                    : null,
                            }, {
                                where: {
                                    [sequelize_1.Op.and]: [
                                        {
                                            evaluationId: item.id,
                                            evaluationOrder: 2.0,
                                        },
                                    ],
                                },
                                transaction: transaction,
                            });
                            const checkExitEvaluator0_5 = await this.evaluatorEntity.findOne({
                                where: {
                                    [sequelize_1.Op.and]: [
                                        {
                                            evaluationId: item.id,
                                            evaluationOrder: 0.5,
                                        },
                                    ],
                                },
                                transaction: transaction,
                            });
                            if (checkExitEvaluator0_5 === null &&
                                tempEvaluatorHaft !== null) {
                                await this.evaluatorEntity.create({
                                    evaluationId: item.id,
                                    evaluatorId: checkEvaluator0_5 === 'permission'
                                        ? tempEvaluatorHaft
                                        : null,
                                    evaluationOrder: 0.5,
                                    commentPublic: null,
                                    commentPrivate: null,
                                }, { transaction: transaction });
                            }
                            const checkExitEvaluator1 = await this.evaluatorEntity.findOne({
                                where: {
                                    [sequelize_1.Op.and]: [
                                        {
                                            evaluationId: item.id,
                                            evaluationOrder: 1.0,
                                        },
                                    ],
                                },
                                transaction: transaction,
                            });
                            if (checkExitEvaluator1 === null && tempEvaluatorFirst !== null) {
                                await this.evaluatorEntity.create({
                                    evaluationId: item.id,
                                    evaluatorId: checkEvaluator1_0 === 'permission'
                                        ? tempEvaluatorFirst
                                        : null,
                                    evaluationOrder: 1.0,
                                    commentPublic: null,
                                    commentPrivate: null,
                                }, { transaction: transaction });
                            }
                            const checkExitEvaluator2 = await this.evaluatorEntity.findOne({
                                where: {
                                    [sequelize_1.Op.and]: [
                                        {
                                            evaluationId: item.id,
                                            evaluationOrder: 2.0,
                                        },
                                    ],
                                },
                                transaction: transaction,
                            });
                            if (checkExitEvaluator2 === null &&
                                tempEvaluatorSecond !== null) {
                                await this.evaluatorEntity.create({
                                    evaluationId: item.id,
                                    evaluatorId: checkEvaluator2_0 === 'permission'
                                        ? tempEvaluatorSecond
                                        : null,
                                    evaluationOrder: 2.0,
                                    commentPublic: null,
                                    commentPrivate: null,
                                }, { transaction: transaction });
                            }
                        }
                    }
                }
                await transaction.commit();
            }
            catch (error) {
                await transaction.rollback();
                throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) ||
                    (error === null || error === void 0 ? void 0 : error.statusCode) ||
                    common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        const evaluatorNotRoleEvaluatorOrDeleted = await User_1.User.findAll({
            attributes: ['employeeNumber', 'fullName'],
            where: {
                id: listEvaluatorDeleted,
                companyGroupCode: companyGroupCode,
            },
        });
        const evaluatorCanNotDelete = await User_1.User.findAll({
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
    async updateSettingEvaluatorListUser(query, companyGroupCode) {
        const typeEdit = query.typeEdit;
        const skills = query.skills;
        const evaluatorHaft = query.evaluatorHaft;
        const evaluatorFirst = query.evaluatorFirst;
        const evaluatorSecond = query.evaluatorSecond;
        const listIdUserSelected = [];
        let listUserCanEdit = [];
        let listUserCanNotEdit = [];
        const listSettingEvaluator = [];
        let userInForNotEdit;
        let userInForNotRoleUserOrDeleted;
        let evaluatorNotRoleEvaluatorOrDeleted;
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
        query.listUserSelected.map((item) => {
            listIdUserSelected.push(item.id);
        });
        listUserCanEdit = listIdUserSelected.filter((word) => !listSettingEvaluator.includes(word));
        listUserCanNotEdit = listIdUserSelected.filter((word) => listSettingEvaluator.includes(word));
        const tempListCheckUser = [];
        const listCheckUser = await User_1.User.findAll({
            attributes: ['id'],
            where: {
                id: listUserCanEdit,
                active: 1,
                companyGroupCode: companyGroupCode,
            },
            include: [
                {
                    model: Role_1.Role,
                    as: 'roles',
                    where: {
                        id: 1,
                    },
                },
            ],
        });
        listCheckUser.map((item) => {
            tempListCheckUser.push(item.id);
        });
        const userCanEdit = listUserCanEdit.filter((value) => tempListCheckUser.includes(value));
        const userCanNotEdit = listUserCanEdit.filter((value) => !tempListCheckUser.includes(value));
        let tempEvaluatorHaft = null;
        let tempEvaluatorFirst = null;
        let tempEvaluatorSecond = null;
        const listEvaluatorDeleted = [];
        tempEvaluatorHaft = evaluatorHaft === '変更しない' ? null : evaluatorHaft;
        tempEvaluatorFirst =
            evaluatorFirst === '変更しない' ? null : evaluatorFirst;
        tempEvaluatorSecond =
            evaluatorSecond === '変更しない' ? null : evaluatorSecond;
        if (tempEvaluatorHaft !== null) {
            const check = await User_1.User.findAll({
                attributes: ['id'],
                where: {
                    id: tempEvaluatorHaft,
                    active: 1,
                    companyGroupCode: companyGroupCode,
                },
                include: [
                    {
                        model: Role_1.Role,
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
        if (tempEvaluatorFirst !== null) {
            const check = await User_1.User.findAll({
                attributes: ['id'],
                where: {
                    id: tempEvaluatorFirst,
                    active: 1,
                    companyGroupCode: companyGroupCode,
                },
                include: [
                    {
                        model: Role_1.Role,
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
        if (tempEvaluatorSecond !== null) {
            const check = await User_1.User.findAll({
                attributes: ['id'],
                where: {
                    id: tempEvaluatorSecond,
                    active: 1,
                    companyGroupCode: companyGroupCode,
                },
                include: [
                    {
                        model: Role_1.Role,
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
        const dataEvaluationPeroid = await this.evaluationPeriodEntity.findOne({
            attributes: ['id'],
            where: {
                year: year,
                periodIndex: periodIndex,
                companyGroupCode: companyGroupCode,
            },
        });
        const transaction = await EvaluatorDefault_1.EvaluatorDefault.sequelize.transaction();
        try {
            for (let i = 0; i < userCanEdit.length; i++) {
                const item = userCanEdit[i];
                const userInfo = await EvaluatorDefault_1.EvaluatorDefault.findOne({
                    attributes: ['flagSkill'],
                    where: {
                        userId: item,
                        evaluationPeriodId: dataEvaluationPeroid.id,
                        companyGroupCode: companyGroupCode,
                    },
                });
                if (typeEdit == 1 &&
                    skills.length > 0 &&
                    !skills.includes(-1) &&
                    userInfo.flagSkill == 1) {
                    const evaluation = await this.evaluationEntity.findOne({
                        attributes: ['id', 'status'],
                        where: {
                            userId: item,
                            evaluationPeriodId: dataEvaluationPeroid.id,
                            creationUser: { [sequelize_1.Op.is]: null },
                        },
                    });
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
                            temSkillAlreadySetting.map((item) => {
                                skillAlreadySetting.push(item.skillId);
                            });
                        }
                        const skillDelete = (0, util_1.findDeletedIdsSkill)(skills, skillAlreadySetting);
                        if (skillDelete.length > 0) {
                            await this.evaluationEntity.sequelize.query('CALL delete_skill_evaluation(ARRAY[:skillDelete], :evaluationId, :companyGroupCode)', {
                                replacements: {
                                    skillDelete: skillDelete,
                                    evaluationId: evaluation.id,
                                    companyGroupCode: companyGroupCode,
                                },
                                type: sequelize_1.QueryTypes.RAW,
                                logging: false,
                            });
                        }
                    }
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
                }
                else if (typeEdit == 2 &&
                    skills.length > 0 &&
                    !skills.includes(-1) &&
                    userInfo.flagSkill == 1) {
                    const skillOld = await this.skillUserEntity.findAll({
                        attributes: ['skillId'],
                        where: {
                            userId: item,
                            periodId: dataEvaluationPeroid.id,
                            evaluationId: { [sequelize_1.Op.is]: null },
                            type: 0,
                        },
                    });
                    const tempList = [];
                    skillOld.map((item) => {
                        tempList.push(item.skillId);
                    });
                    const skillAdds = skills.filter((word) => !tempList.includes(word));
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
                            creationUser: { [sequelize_1.Op.is]: null },
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
                if (evaluatorSecond !== '変更しない') {
                    const checkTheSameEvaluator_0_5 = await EvaluatorDefault_1.EvaluatorDefault.findOne({
                        where: {
                            [sequelize_1.Op.and]: [
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
                    const checkTheSameEvaluator_1 = await EvaluatorDefault_1.EvaluatorDefault.findOne({
                        where: {
                            [sequelize_1.Op.and]: [
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
                        await EvaluatorDefault_1.EvaluatorDefault.update({
                            evaluator_0_5_id: null,
                        }, {
                            where: {
                                userId: item,
                                evaluationPeriodId: dataEvaluationPeroid.id,
                                companyGroupCode: companyGroupCode,
                            },
                            returning: true,
                            transaction: transaction,
                        });
                        await EvaluatorDefault_1.EvaluatorDefault.update({
                            evaluator_2_id: evaluatorSecond,
                        }, {
                            where: {
                                userId: item,
                                evaluationPeriodId: dataEvaluationPeroid.id,
                                companyGroupCode: companyGroupCode,
                            },
                            returning: true,
                            transaction: transaction,
                        });
                    }
                    if (checkTheSameEvaluator_1 !== null) {
                        await EvaluatorDefault_1.EvaluatorDefault.update({
                            evaluator_1_id: null,
                        }, {
                            where: {
                                userId: item,
                                evaluationPeriodId: dataEvaluationPeroid.id,
                                companyGroupCode: companyGroupCode,
                            },
                            returning: true,
                            transaction: transaction,
                        });
                        await EvaluatorDefault_1.EvaluatorDefault.update({
                            evaluator_2_id: evaluatorSecond,
                        }, {
                            where: {
                                userId: item,
                                evaluationPeriodId: dataEvaluationPeroid.id,
                                companyGroupCode: companyGroupCode,
                            },
                            returning: true,
                            transaction: transaction,
                        });
                    }
                    if (checkTheSameEvaluator_0_5 === null &&
                        checkTheSameEvaluator_1 === null) {
                        await EvaluatorDefault_1.EvaluatorDefault.update({
                            evaluator_2_id: evaluatorSecond,
                        }, {
                            where: {
                                userId: item,
                                evaluationPeriodId: dataEvaluationPeroid.id,
                                companyGroupCode: companyGroupCode,
                            },
                            returning: true,
                            transaction: transaction,
                        });
                    }
                }
                if (evaluatorFirst !== '変更しない') {
                    const checkTheSameEvaluator_2 = await EvaluatorDefault_1.EvaluatorDefault.findOne({
                        where: {
                            [sequelize_1.Op.and]: [
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
                    if (checkTheSameEvaluator_2 === null) {
                        await EvaluatorDefault_1.EvaluatorDefault.update({
                            evaluator_1_id: evaluatorFirst,
                        }, {
                            where: {
                                userId: item,
                                evaluationPeriodId: dataEvaluationPeroid.id,
                                companyGroupCode: companyGroupCode,
                            },
                            returning: true,
                            transaction: transaction,
                        });
                    }
                    const checkTheSameEvaluator_0_5 = await EvaluatorDefault_1.EvaluatorDefault.findOne({
                        where: {
                            [sequelize_1.Op.and]: [
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
                    if (checkTheSameEvaluator_0_5 !== null) {
                        await EvaluatorDefault_1.EvaluatorDefault.update({
                            evaluator_0_5_id: null,
                        }, {
                            where: {
                                userId: item,
                                evaluationPeriodId: dataEvaluationPeroid.id,
                                companyGroupCode: companyGroupCode,
                            },
                            returning: true,
                            transaction: transaction,
                        });
                    }
                    if (checkTheSameEvaluator_0_5 === null &&
                        checkTheSameEvaluator_2 === null) {
                        await EvaluatorDefault_1.EvaluatorDefault.update({
                            evaluator_1_id: evaluatorFirst,
                        }, {
                            where: {
                                userId: item,
                                evaluationPeriodId: dataEvaluationPeroid.id,
                                companyGroupCode: companyGroupCode,
                            },
                            returning: true,
                            transaction: transaction,
                        });
                    }
                }
                if (evaluatorHaft !== '変更しない') {
                    const checkTheSameEvaluator_1 = await EvaluatorDefault_1.EvaluatorDefault.findOne({
                        where: {
                            [sequelize_1.Op.and]: [
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
                    const checkTheSameEvaluator_2 = await EvaluatorDefault_1.EvaluatorDefault.findOne({
                        where: {
                            [sequelize_1.Op.and]: [
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
                    if (checkTheSameEvaluator_1 === null &&
                        checkTheSameEvaluator_2 === null) {
                        await EvaluatorDefault_1.EvaluatorDefault.update({
                            evaluator_0_5_id: evaluatorHaft,
                        }, {
                            where: {
                                userId: item,
                                evaluationPeriodId: dataEvaluationPeroid.id,
                                companyGroupCode: companyGroupCode,
                            },
                            returning: true,
                            transaction: transaction,
                        });
                    }
                }
            }
            const financialPeriod = periodIndex === 1 ? '上期' : '下期';
            const financialYear = year;
            const listEvaluation = await this.evaluationEntity.findAll({
                attributes: ['id'],
                where: {
                    [sequelize_1.Op.and]: {
                        title: `${financialYear}年${financialPeriod}`,
                        userId: userCanEdit,
                        creationUser: { [sequelize_1.Op.eq]: null },
                        companyGroupCode: companyGroupCode,
                    },
                },
                transaction: transaction,
            });
            const listEvaluationId = [];
            if (listEvaluation.length > 0) {
                listEvaluation.map((item) => {
                    listEvaluationId.push(item.id);
                });
            }
            if (listEvaluation.length > 0) {
                for (let i = 0; i < listEvaluationId.length; i++) {
                    const item = listEvaluationId[i];
                    if ((evaluatorSecond !== '変更しない' ||
                        evaluatorFirst !== '変更しない' ||
                        evaluatorHaft !== '変更しない') &&
                        tempEvaluatorSecond !== null) {
                        const checkTheSameEvaluator0_5 = await this.evaluatorEntity.findOne({
                            where: {
                                [sequelize_1.Op.and]: [
                                    {
                                        evaluationId: item,
                                        evaluatorId: tempEvaluatorSecond,
                                        evaluationOrder: 0.5,
                                    },
                                ],
                            },
                            transaction: transaction,
                        });
                        const checkTheSameEvaluator1 = await this.evaluatorEntity.findOne({
                            where: {
                                [sequelize_1.Op.and]: [
                                    {
                                        evaluationId: item,
                                        evaluatorId: tempEvaluatorSecond,
                                        evaluationOrder: 1.0,
                                    },
                                ],
                            },
                            transaction: transaction,
                        });
                        if (checkTheSameEvaluator0_5 !== null) {
                            await this.evaluatorEntity.destroy({
                                where: {
                                    [sequelize_1.Op.and]: [
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
                        if (checkTheSameEvaluator1 !== null) {
                            await this.evaluatorEntity.destroy({
                                where: {
                                    [sequelize_1.Op.and]: [
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
                        const checkExitEvaluator2 = await this.evaluatorEntity.findOne({
                            where: {
                                [sequelize_1.Op.and]: [
                                    {
                                        evaluationId: item,
                                        evaluationOrder: 2.0,
                                    },
                                ],
                            },
                            transaction: transaction,
                        });
                        if (checkExitEvaluator2 === null) {
                            await this.evaluatorEntity.create({
                                evaluationId: item,
                                evaluatorId: tempEvaluatorSecond,
                                evaluationOrder: 2.0,
                                commentPublic: null,
                                commentPrivate: null,
                            }, { transaction: transaction });
                        }
                        else {
                            await this.evaluatorEntity.update({ evaluatorId: tempEvaluatorSecond }, {
                                where: {
                                    [sequelize_1.Op.and]: [
                                        {
                                            evaluationId: item,
                                            evaluationOrder: 2.0,
                                        },
                                    ],
                                },
                                transaction: transaction,
                            });
                        }
                    }
                    if ((evaluatorSecond !== '変更しない' ||
                        evaluatorFirst !== '変更しない' ||
                        evaluatorHaft !== '変更しない') &&
                        tempEvaluatorFirst !== null) {
                        if (evaluatorFirst !== '変更しない') {
                            const checkTheSameEvaluator_1_And_2 = await this.evaluatorEntity.findOne({
                                where: {
                                    [sequelize_1.Op.and]: [
                                        {
                                            evaluationId: item,
                                            evaluatorId: tempEvaluatorFirst,
                                            evaluationOrder: 2.0,
                                        },
                                    ],
                                },
                                transaction: transaction,
                            });
                            if (checkTheSameEvaluator_1_And_2 === null) {
                                const checkTheSameEvaluator0_5 = await this.evaluatorEntity.findOne({
                                    where: {
                                        [sequelize_1.Op.and]: [
                                            {
                                                evaluationId: item,
                                                evaluatorId: tempEvaluatorFirst,
                                                evaluationOrder: 0.5,
                                            },
                                        ],
                                    },
                                    transaction: transaction,
                                });
                                if (checkTheSameEvaluator0_5 !== null) {
                                    await this.evaluatorEntity.destroy({
                                        where: {
                                            [sequelize_1.Op.and]: [
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
                                const checkExitEvaluator1 = await this.evaluatorEntity.findOne({
                                    where: {
                                        [sequelize_1.Op.and]: [
                                            {
                                                evaluationId: item,
                                                evaluationOrder: 1.0,
                                            },
                                        ],
                                    },
                                    transaction: transaction,
                                });
                                if (checkExitEvaluator1 === null) {
                                    await this.evaluatorEntity.create({
                                        evaluationId: item,
                                        evaluatorId: tempEvaluatorFirst,
                                        evaluationOrder: 1.0,
                                        commentPublic: null,
                                        commentPrivate: null,
                                    }, { transaction: transaction });
                                }
                                else {
                                    await this.evaluatorEntity.update({ evaluatorId: tempEvaluatorFirst }, {
                                        where: {
                                            [sequelize_1.Op.and]: [
                                                {
                                                    evaluationId: item,
                                                    evaluationOrder: 1.0,
                                                },
                                            ],
                                        },
                                        transaction: transaction,
                                    });
                                }
                            }
                        }
                    }
                    if ((evaluatorSecond !== '変更しない' ||
                        evaluatorFirst !== '変更しない' ||
                        evaluatorHaft !== '変更しない') &&
                        tempEvaluatorHaft !== null) {
                        if (evaluatorHaft !== '変更しない') {
                            const checkTheSameEvaluator_0_5_And_1 = await this.evaluatorEntity.findOne({
                                where: {
                                    [sequelize_1.Op.and]: [
                                        {
                                            evaluationId: item,
                                            evaluatorId: tempEvaluatorHaft,
                                            evaluationOrder: 1.0,
                                        },
                                    ],
                                },
                                transaction: transaction,
                            });
                            const checkTheSameEvaluator_0_5_And_2 = await this.evaluatorEntity.findOne({
                                where: {
                                    [sequelize_1.Op.and]: [
                                        {
                                            evaluationId: item,
                                            evaluatorId: tempEvaluatorHaft,
                                            evaluationOrder: 2.0,
                                        },
                                    ],
                                },
                                transaction: transaction,
                            });
                            if (checkTheSameEvaluator_0_5_And_1 === null &&
                                checkTheSameEvaluator_0_5_And_2 === null) {
                                const checkExitEvaluator0_5 = await this.evaluatorEntity.findOne({
                                    where: {
                                        [sequelize_1.Op.and]: [
                                            {
                                                evaluationId: item,
                                                evaluationOrder: 0.5,
                                            },
                                        ],
                                    },
                                    transaction: transaction,
                                });
                                if (checkExitEvaluator0_5 === null) {
                                    await this.evaluatorEntity.create({
                                        evaluationId: item,
                                        evaluatorId: tempEvaluatorHaft,
                                        evaluationOrder: 0.5,
                                        commentPublic: null,
                                        commentPrivate: null,
                                    }, { transaction: transaction });
                                }
                                else {
                                    await this.evaluatorEntity.update({ evaluatorId: tempEvaluatorHaft }, {
                                        where: {
                                            [sequelize_1.Op.and]: [
                                                {
                                                    evaluationId: item,
                                                    evaluationOrder: 0.5,
                                                },
                                            ],
                                        },
                                        transaction: transaction,
                                    });
                                }
                            }
                        }
                    }
                }
            }
            userInForNotEdit = await User_1.User.findAll({
                attributes: ['employeeNumber', 'fullName'],
                where: {
                    id: listUserCanNotEdit,
                    companyGroupCode: companyGroupCode,
                },
            });
            userInForNotRoleUserOrDeleted = await User_1.User.findAll({
                attributes: ['employeeNumber', 'fullName'],
                where: {
                    id: userCanNotEdit,
                    companyGroupCode: companyGroupCode,
                },
            });
            evaluatorNotRoleEvaluatorOrDeleted = await User_1.User.findAll({
                attributes: ['employeeNumber', 'fullName'],
                where: {
                    id: listEvaluatorDeleted,
                    companyGroupCode: companyGroupCode,
                },
            });
            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return {
            userInfor: userInForNotEdit,
            userDeleted: userInForNotRoleUserOrDeleted,
            evaluatorDeleted: evaluatorNotRoleEvaluatorOrDeleted,
        };
    }
    async listUserDepartment(condition) {
        return await this.userEntity.findAll({
            where: condition,
            include: [
                { model: Department_1.Department, as: 'division' },
                { model: Department_1.Department, as: 'department' },
                { model: Company_1.Company, as: 'company' },
            ],
        });
    }
    async listEvaluatorDefault(condition) {
        return await this.evaluatorDefaultEntity.findOne({
            where: condition,
        });
    }
    async updateEvaluatorDefault(condition, data, transaction) {
        await this.evaluatorDefaultEntity.update(data, {
            where: condition,
            transaction: transaction,
        });
    }
    async getAllEvaluatorDefault() {
        return (await this.evaluatorDefaultEntity.findAll()).map((data) => data && data.get({ plain: true }));
    }
    async listEvaluationByPeriod(periodId, evaluatorId) {
        return await this.evaluationEntity.findAll({
            where: {
                [sequelize_1.Op.and]: [{ evaluationPeriodId: periodId }],
            },
            include: [
                {
                    model: User_1.User,
                    as: 'user',
                    where: {
                        active: 1,
                        id: { [sequelize_1.Op.in]: evaluatorId },
                    },
                    include: [
                        {
                            model: Permission_1.Permission,
                            as: 'permissions',
                            where: { roleId: { [sequelize_1.Op.in]: [1, 2] } },
                        },
                    ],
                },
                {
                    model: Evaluator_1.Evaluator,
                    as: 'evaluator',
                    include: [
                        {
                            model: User_1.User,
                            as: 'user',
                            where: {
                                active: 1,
                            },
                            include: [
                                {
                                    model: Permission_1.Permission,
                                    as: 'permissions',
                                    where: { roleId: { [sequelize_1.Op.in]: [1, 2] } },
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    }
    async getUserIdByEvaluationId(evaluationId) {
        return await this.evaluationEntity.findOne({
            attributes: ['userId'],
            where: { id: evaluationId },
        });
    }
    async listToEmail(_type, year, periodIndex, companyGroupCode, departmentId) {
        if (departmentId) {
            return await this.listToEmailByDepartment(year, periodIndex, companyGroupCode, departmentId);
        }
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
                    [sequelize_1.Op.not]: null,
                },
                companyGroupCode: companyGroupCode,
            },
        });
        const listEvaluator1 = await this.evaluatorDefaultEntity.findAll({
            attributes: ['id', 'evaluator1Id'],
            where: {
                evaluationPeriodId: periodId.id,
                evaluator1Id: {
                    [sequelize_1.Op.not]: null,
                },
                companyGroupCode: companyGroupCode,
            },
        });
        const listEvaluator2 = await this.evaluatorDefaultEntity.findAll({
            attributes: ['id', 'evaluator2Id'],
            where: {
                evaluationPeriodId: periodId.id,
                evaluator2Id: {
                    [sequelize_1.Op.not]: null,
                },
                companyGroupCode: companyGroupCode,
            },
        });
        const listEvaluatedUserId = listEvaluatedUser.map((user) => user.userId);
        const listEvaluator05Id = listEvaluator05.map((evaluator) => evaluator.evaluator05Id);
        const listEvaluator1Id = listEvaluator1.map((evaluator) => evaluator.evaluator1Id);
        const listEvaluator2Id = listEvaluator2.map((evaluator) => evaluator.evaluator2Id);
        const listMailUserId = [
            ...listEvaluatedUserId,
            ...listEvaluator05Id,
            ...listEvaluator1Id,
            ...listEvaluator2Id,
        ].filter((id, index, array) => {
            return array.indexOf(id) === index;
        });
        if (listMailUserId.length) {
            return await this.userEntity.findAll({
                where: {
                    [sequelize_1.Op.and]: [
                        { active: 1 },
                        {
                            id: { [sequelize_1.Op.in]: listMailUserId },
                        },
                        { companyGroupCode: companyGroupCode },
                    ],
                },
                attributes: ['id', 'email', 'fullName'],
                include: [
                    {
                        model: Permission_1.Permission,
                        as: 'permissions',
                        where: { roleId: { [sequelize_1.Op.in]: [1, 2] } },
                    },
                ],
            });
        }
        else {
            return [];
        }
    }
    async listToEmailByDepartment(year, periodIndex, companyGroupCode, departmentId) {
        const periodRecord = await this.evaluationPeriodEntity.findOne({
            attributes: ['id'],
            where: { year, periodIndex, companyGroupCode },
        });
        if (!periodRecord)
            return [];
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
        const mainResults = await this.evaluationEntity.sequelize.query(mainQuery, {
            replacements: {
                companyGroupCode,
                evaluationPeriodId: periodRecord.id,
                departmentId,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (!mainResults.length)
            return [];
        const evaluationIds = [
            ...new Set(mainResults.map((r) => r.evaluationId).filter(Boolean)),
        ];
        let evaluatorEmails = [];
        if (evaluationIds.length > 0) {
            const evaluatorQuery = `
        SELECT DISTINCT u.email AS "email"
        FROM evaluator_tbl ev
        JOIN user_tbl u ON u.id = ev.evaluator_id
        WHERE ev.evaluation_id IN (:evaluationIds)
          AND u.active = 1
      `;
            evaluatorEmails = await this.evaluationEntity.sequelize.query(evaluatorQuery, {
                replacements: { evaluationIds },
                type: sequelize_1.QueryTypes.SELECT,
            });
        }
        const seen = new Set();
        const merged = [];
        for (const r of [...mainResults, ...evaluatorEmails]) {
            if (r.email && !seen.has(r.email)) {
                seen.add(r.email);
                merged.push({ email: r.email });
            }
        }
        return merged;
    }
    async checkImportUser(query, companyGroupCode) {
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
        if (dataEvaluationPeroid === null || dataEvaluationPeroid === void 0 ? void 0 : dataEvaluationPeroid.id) {
            const listUser = await this.evaluatorDefaultEntity.findAll({
                where: {
                    evaluationPeriodId: dataEvaluationPeroid.id,
                    companyGroupCode: companyGroupCode,
                },
            });
            return listUser;
        }
        else {
            return [];
        }
    }
    async importUser(listUserImport) {
        return await this.evaluatorDefaultEntity.bulkCreate(listUserImport);
    }
    async markEvaluationsAsPersonal(userIds, evaluationPeriodId, creationUser, companyGroupCode) {
        await this.evaluationEntity.update({ creationUser }, {
            where: {
                userId: { [sequelize_1.Op.in]: userIds },
                evaluationPeriodId,
                companyGroupCode,
                creationUser: { [sequelize_1.Op.is]: null },
            },
        });
        await this.evaluationEntity.sequelize.query(`UPDATE evaluation_tbl et
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
       WHERE et.id = src.eval_id`, {
            replacements: {
                userIds,
                evaluationPeriodId,
                companyGroupCode,
                creationUser,
            },
            type: sequelize_1.QueryTypes.RAW,
        });
    }
    async importUserProcedure(year, periodIndex, userIds, isImport, companyGroupCode, timeZone) {
        await this.evaluatorDefaultEntity.sequelize.query('CALL import_user(:year, :periodIndex, :currentDateInput, ARRAY[:userIds], :isImport, :companyGroupCode)', {
            replacements: {
                year: year,
                periodIndex: periodIndex,
                currentDateInput: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D', timeZone),
                userIds: !userIds ? [0] : userIds,
                isImport: isImport,
                companyGroupCode: companyGroupCode,
            },
            type: sequelize_1.QueryTypes.RAW,
        });
    }
    async getListUserRoleF1() {
        return await this.userEntity.findAll({
            where: {
                active: 1,
            },
            include: [
                {
                    model: Department_1.Department,
                    as: 'department',
                    attributes: ['id', 'code', 'name'],
                },
                {
                    model: Department_1.Department,
                    as: 'division',
                    attributes: ['id', 'code', 'name'],
                },
                {
                    model: Role_1.Role,
                    as: 'rolesCondition',
                    where: { id: 1 },
                },
            ],
        });
    }
    async countUserBeforeImport(userId, evaluationPeriodId) {
        return await this.evaluatorDefaultEntity.count({
            where: {
                userId: userId,
                evaluationPeriodId: evaluationPeriodId,
            },
        });
    }
    async findListUserToSettingEvaluation(query) {
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
        if (dataEvaluationPeroid === null || dataEvaluationPeroid === void 0 ? void 0 : dataEvaluationPeroid.id) {
            listUserAlredySettingEvaluations =
                await this.evaluatorDefaultEntity.findAll({
                    attributes: ['userId'],
                    where: {
                        evaluationPeriodId: dataEvaluationPeroid === null || dataEvaluationPeroid === void 0 ? void 0 : dataEvaluationPeroid.id,
                        companyGroupCode: companyGroupCode,
                    },
                });
        }
        const temListUserAlreadySetting = [];
        listUserAlredySettingEvaluations.map((item) => {
            temListUserAlreadySetting.push(item.userId);
        });
        const arrayWhere = [];
        arrayWhere.push({
            [sequelize_1.Op.and]: [
                {
                    [sequelize_1.Op.or]: [
                        {
                            employeeNumber: nameAndEmail
                                ? { [sequelize_1.Op.iLike]: `%${nameAndEmail}%` }
                                : { [sequelize_1.Op.not]: null },
                        },
                        {
                            fullName: nameAndEmail
                                ? { [sequelize_1.Op.iLike]: `%${nameAndEmail}%` }
                                : { [sequelize_1.Op.not]: null },
                        },
                        {
                            email: nameAndEmail
                                ? { [sequelize_1.Op.iLike]: `%${nameAndEmail}%` }
                                : { [sequelize_1.Op.not]: null },
                        },
                    ],
                },
                {
                    id: {
                        [sequelize_1.Op.notIn]: temListUserAlreadySetting,
                    },
                },
            ],
        });
        if (department !== 'すべて') {
            arrayWhere.push({
                departmentId: parseInt(department[0].trim()),
            });
        }
        if (division !== 'すべて') {
            arrayWhere.push({
                divisionId: parseInt(division[0].trim()),
            });
        }
        const datas = await this.userEntity.findAndCountAll({
            attributes: ['id', 'employeeNumber', 'fullName', 'email', 'level'],
            where: {
                [sequelize_1.Op.and]: arrayWhere,
                active: 1,
                level: { [sequelize_1.Op.not]: null },
                companyGroupCode: companyGroupCode,
            },
            include: [
                {
                    model: Department_1.Department,
                    as: 'department',
                    attributes: ['id', 'code', 'name'],
                },
                {
                    model: Department_1.Department,
                    as: 'division',
                    attributes: ['id', 'code', 'name'],
                },
                {
                    model: Company_1.Company,
                    as: 'company',
                    attributes: ['id', 'name'],
                },
                {
                    model: Role_1.Role,
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
    async getEvaluationPeriodByYear(year, periodIndex) {
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
    async getEvaluationPeriodByEvaluationId(EvaluationId) {
        return await this.evaluationPeriodEntity.findOne({
            attributes: ['id', 'year', 'periodIndex', 'periodStart', 'periodEnd'],
            include: [
                {
                    model: Evaluation_1.Evaluation,
                    where: { id: EvaluationId },
                },
            ],
        });
    }
    async checkUserAdded(listUserSelected, id) {
        return await this.evaluatorDefaultEntity.count({
            where: {
                userId: listUserSelected,
                evaluationPeriodId: id,
            },
        });
    }
    async getListUserEvaluationByEvaluationPeriodId(listUserSelected, id) {
        return await this.evaluationEntity.findAll({
            attributes: ['userId'],
            where: {
                [sequelize_1.Op.and]: [
                    {
                        evaluationPeriodId: id,
                        userId: listUserSelected,
                    },
                ],
            },
        });
    }
    async getListUserInforByListId(id) {
        return await this.userEntity.findAll({
            where: { id: id, active: 1 },
        });
    }
    async findMaxIdEvaluation(userId, evaluationPeriodId) {
        return await this.evaluationEntity.max('id', {
            where: {
                [sequelize_1.Op.and]: [
                    {
                        evaluationPeriodId: evaluationPeriodId,
                        userId: userId,
                    },
                ],
            },
        });
    }
    async getEvaluatorByEvaluationIdAndOrder(id, order) {
        return await this.evaluatorEntity.findOne({
            attributes: ['evaluatorId'],
            where: { [sequelize_1.Op.and]: [{ evaluation_id: id, evaluationOrder: order }] },
        });
    }
    async createUserEvaluatorDefault(listUserImport) {
        return await this.evaluatorDefaultEntity.bulkCreate(listUserImport);
    }
    async getUserInforById(id) {
        return await this.userEntity.findOne({
            where: { id: id },
            include: [
                { model: Department_1.Department, as: 'division' },
                { model: Department_1.Department, as: 'department' },
                { model: Company_1.Company, as: 'company' },
            ],
        });
    }
    async getEvaluatorDefaultUpdateTime(id) {
        return await this.evaluatorDefaultEntity.findOne({
            attributes: ['updatedTime'],
            where: {
                id: id,
            },
        });
    }
    async deleteUserSettingEvaluator(params, companyGroupCode) {
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
                [sequelize_1.Op.and]: [
                    {
                        userId: listUserDelete,
                        evaluationPeriodId: dataEvaluationPeroid.id,
                        companyGroupCode: companyGroupCode,
                    },
                ],
            },
        });
        if (countUser !== listUserDelete.length) {
            throw new RuntimeException_1.RuntimeException('Conflict delete user', 409);
        }
        if (listUserDelete.length > 0) {
            const listEvaluationId = await this.evaluationEntity.findAll({
                attributes: ['id'],
                where: {
                    userId: listUserDelete,
                    evaluationPeriodId: dataEvaluationPeroid.id,
                    creationUser: { [sequelize_1.Op.is]: null },
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
            await this.evaluatorDefaultEntity.destroy({
                where: {
                    [sequelize_1.Op.and]: [
                        {
                            userId: listUserDelete,
                            evaluationPeriodId: dataEvaluationPeroid.id,
                            companyGroupCode: companyGroupCode,
                        },
                    ],
                },
            });
            await this.skillUserEntity.destroy({
                where: {
                    [sequelize_1.Op.and]: [
                        {
                            userId: listUserDelete,
                            periodId: dataEvaluationPeroid.id,
                            type: 0,
                            evaluationId: { [sequelize_1.Op.is]: null },
                        },
                    ],
                },
            });
        }
        return true;
    }
    async checkIsFixed(query, companyGroupCode) {
        const year = query.year;
        const periodIndex = query.periodIndex;
        return await this.evaluationPeriodEntity.findAll({
            attributes: ['id'],
            where: {
                [sequelize_1.Op.and]: [
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
    async countsEvaluationPeriod(query, userId) {
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
                    [sequelize_1.Op.between]: [query.yearStart, query.yearEnd],
                },
            },
            include: [
                {
                    model: Evaluation_1.Evaluation,
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
                            model: Evaluator_1.Evaluator,
                            as: 'evaluator',
                            attributes: ['evaluatorId', 'evaluationOrder'],
                            include: [
                                {
                                    model: User_1.User,
                                    as: 'user',
                                    attributes: ['fullName', 'id'],
                                },
                            ],
                        },
                        {
                            model: User_1.User,
                            as: 'user',
                            attributes: ['id', 'fullName', 'employeeNumber'],
                            include: [
                                {
                                    model: Department_1.Department,
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
                [{ model: Evaluation_1.Evaluation, as: 'evaluations' }, 'periodStart', 'DESC'],
            ],
        });
        return evaluations;
    }
    async getListProSkillPublicByDepartmentIds(Ids) {
        const versionProSkills = await this.versionProSkillEntity.findAll({
            where: {
                publicStatus: 1,
                skillId: Ids,
            },
            include: [
                {
                    model: ListProSkill_1.ListProSkill,
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
            order: [[{ model: ListProSkill_1.ListProSkill, as: 'listProSkills' }, 'id', 'ASC']],
        });
        return versionProSkills;
    }
    async listToEmailEvaluation(where) {
        return await this.evaluationEntity.findAll({
            where: where,
            include: [
                {
                    model: User_1.User,
                    as: 'user',
                    attributes: ['email'],
                    where: {
                        active: 1,
                    },
                    include: [
                        {
                            model: Permission_1.Permission,
                            as: 'permissions',
                            where: { roleId: 1 },
                        },
                    ],
                },
            ],
        });
    }
    async listUserDepartmentVersionTwo(condition, periodId) {
        return await this.evaluatorDefaultEntity.findAll({
            where: {
                evaluationPeriodId: periodId,
            },
            include: [
                {
                    model: User_1.User,
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
                            model: Department_1.Department,
                            as: 'department',
                            attributes: ['code', 'name', 'id'],
                        },
                        {
                            model: Department_1.Department,
                            as: 'division',
                            attributes: ['code', 'name', 'id'],
                        },
                        { model: Company_1.Company, as: 'company' },
                    ],
                },
            ],
        });
    }
    async getEvaluatorDefault(userId, evaluationPeriodId) {
        return await this.evaluatorDefaultEntity.findOne({
            where: { userId, evaluationPeriodId },
        });
    }
    async getDefaultActive(condition) {
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
    async getListUserByInEmail(condition) {
        return await this.userEntity.findAll({
            attributes: ['email', 'fullName'],
            where: condition,
        });
    }
    async usersMailList(conditions, companyGroupCode) {
        return await this.userEntity.findAll({
            where: {
                active: 1,
                email: {
                    [sequelize_1.Op.notIn]: JSON.parse(conditions !== null && conditions !== void 0 ? conditions : 'null'),
                },
                companyGroupCode: companyGroupCode,
            },
            attributes: ['id', 'email', 'employeeNumber'],
            order: [['employeeNumber', 'ASC']],
        });
    }
    async getUserNameFromEmail(email, companyGroupCode) {
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
    async countEvaluationException(condition) {
        return await this.evaluationEntity.count({
            where: condition,
        });
    }
    async getUserEvaluatorByEvaluationId(id) {
        return await this.evaluationEntity.findOne({
            where: {
                id: id,
            },
            include: [
                {
                    model: User_1.User,
                    as: 'user',
                    attributes: ['email', 'fullName'],
                    where: { active: 1 },
                },
                {
                    model: Evaluator_1.Evaluator,
                    as: 'evaluator',
                    include: [
                        {
                            model: User_1.User,
                            attributes: ['email', 'fullName'],
                            where: { active: 1 },
                        },
                    ],
                },
            ],
        });
    }
    async getUserInfoByFullname(fullName) {
        return await this.userEntity.findOne({
            attributes: ['id'],
            where: { fullName: fullName },
        });
    }
    async importUserFromExcel(data) {
        return await this.evaluatorDefaultEntity.findOrCreate({
            where: {
                evaluationPeriodId: data.evaluationPeriodId,
                userId: data.userId,
            },
            defaults: data,
        });
    }
    async getDataExportListUser(query) {
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
            [sequelize_1.Op.or]: [
                {
                    employeeNumber: nameAndEmail
                        ? { [sequelize_1.Op.iLike]: `%${nameAndEmail}%` }
                        : { [sequelize_1.Op.not]: null },
                },
                {
                    fullName: nameAndEmail
                        ? { [sequelize_1.Op.iLike]: `%${nameAndEmail}%` }
                        : { [sequelize_1.Op.not]: null },
                },
                {
                    email: nameAndEmail
                        ? { [sequelize_1.Op.iLike]: `%${nameAndEmail}%` }
                        : { [sequelize_1.Op.not]: null },
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
                departmentId: parseInt(department[0].trim()),
            });
        }
        if (division !== 'すべて' && division !== '_blank') {
            arrayWhere.push({
                divisionId: parseInt(division[0].trim()),
            });
        }
        if (company !== 'すべて') {
            arrayWhere.push({
                companyId: parseInt(company),
            });
        }
        if (skill !== 'すべて') {
            arrayWhere.push({
                flagSkill: parseInt(skill),
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
                [sequelize_1.Op.and]: arrayWhere,
                active: 1,
            },
            include: [
                {
                    model: Department_1.Department,
                    as: 'department',
                    attributes: ['id', 'code', 'name'],
                },
                {
                    model: Department_1.Department,
                    as: 'division',
                    attributes: ['id', 'code', 'name'],
                },
                {
                    model: Company_1.Company,
                    as: 'company',
                    attributes: ['id', 'name'],
                },
                {
                    model: Role_1.Role,
                    as: 'rolesCondition',
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                    where: role !== 'すべて'
                        ? {
                            [sequelize_1.Op.and]: [{ id: role }],
                        }
                        : undefined,
                },
                {
                    model: Role_1.Role,
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
    async getDataExportListUser2(query) {
        const role = query.role;
        const department = query.department;
        const division = query.division;
        const nameAndEmail = query.nameAndEmail;
        const company = query.company;
        const skill = query.skill;
        const companyGroupCode = query.companyGroupCode;
        console.log(role, department, division, nameAndEmail, company, skill);
        const data = await this.userEntity.sequelize.query(`
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

            `, {
            nest: true,
            type: sequelize_1.QueryTypes.SELECT,
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
                flagSkill: Number(skill) !== -1 ? Number(skill) : null,
                companyGroupCode: companyGroupCode,
            },
            logging: false,
        });
        return { data: data, counts: data.length };
    }
    async listTemplateCreationGoal(query, id) {
        const data = await this.userEntity.sequelize.query(`select ut.id,
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
                or ut.email like : name)`, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: {
                division: query.division || null,
                department: query.department || null,
                userId: id,
                name: `%${query.name || ''}%`,
            },
        });
        return data;
    }
    async listUserTheSameInforWithEvaluator(query) {
        var _a, _b;
        const offset = query.offset;
        const limit = query.limit;
        const nameAndEmail = query.nameAndEmail;
        const deparmentId = ((_a = query.userInfor) === null || _a === void 0 ? void 0 : _a.departmentId) || null;
        const divisionId = ((_b = query.userInfor) === null || _b === void 0 ? void 0 : _b.divisionId) || null;
        const arrayWhere = [];
        arrayWhere.push({
            [sequelize_1.Op.or]: [
                {
                    employeeNumber: nameAndEmail
                        ? { [sequelize_1.Op.iLike]: `%${nameAndEmail}%` }
                        : { [sequelize_1.Op.not]: null },
                },
                {
                    fullName: nameAndEmail
                        ? { [sequelize_1.Op.iLike]: `%${nameAndEmail}%` }
                        : { [sequelize_1.Op.not]: null },
                },
                {
                    email: nameAndEmail
                        ? { [sequelize_1.Op.iLike]: `%${nameAndEmail}%` }
                        : { [sequelize_1.Op.not]: null },
                },
            ],
        });
        if (deparmentId !== null && divisionId !== null) {
            arrayWhere.push({
                departmentId: deparmentId,
            });
        }
        else {
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
                [sequelize_1.Op.and]: arrayWhere,
                active: 1,
            },
            include: [
                {
                    model: Department_1.Department,
                    as: 'department',
                    attributes: ['id', 'code', 'name'],
                },
                {
                    model: Department_1.Department,
                    as: 'division',
                    attributes: ['id', 'code', 'name'],
                },
                {
                    model: Company_1.Company,
                    as: 'company',
                    attributes: ['id', 'name'],
                },
                {
                    model: Role_1.Role,
                    as: 'rolesCondition',
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                    where: {
                        [sequelize_1.Op.and]: [{ id: 1 }],
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
    async getListSkillByDepDivId(ids) {
        return await this.skillGroupEntity.findAll({
            attributes: ['skillId'],
            where: { departmentId: { [sequelize_1.Op.or]: ids } },
        });
    }
    async deleteSkillUser(conditions, transaction) {
        return await this.skillUserEntity.destroy({
            where: conditions,
            transaction: transaction,
        });
    }
    async importSkillUser(listUserSkill, transaction) {
        return await this.skillUserEntity.bulkCreate(listUserSkill, {
            transaction: transaction,
        });
    }
    async getAllSkill(companyGroupCode) {
        return await this.skillEntity.findAll({
            attributes: ['id', 'name'],
            where: { active: 1, companyGroupCode: companyGroupCode },
            order: [['name', 'ASC']],
        });
    }
    async getAllSkillPublic(companyGroupCode) {
        return await this.skillEntity.findAll({
            attributes: ['id', 'name'],
            where: { active: 1, companyGroupCode: companyGroupCode },
            include: [
                {
                    model: VersionProSkill_1.VersionProSkill,
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
    async updateSkillUser(userId, evaluationId, periodId) {
        return await this.skillUserEntity.update({
            evaluationId: evaluationId,
        }, {
            where: {
                userId: userId,
                periodId: periodId,
            },
        });
    }
    async getListUserWithRole(roleId, companyGroupCode) {
        return await this.userEntity.findAll({
            where: Object.assign({ active: 1 }, (companyGroupCode && { companyGroupCode: companyGroupCode })),
            attributes: ['fullName', 'email'],
            include: [
                {
                    model: Role_1.Role,
                    as: 'roles',
                    where: {
                        id: roleId,
                    },
                    attributes: [],
                },
            ],
        });
    }
    async undoException(data, req) {
        const skillUser = data === null || data === void 0 ? void 0 : data.skillUser;
        const skillList = [];
        if ((skillUser === null || skillUser === void 0 ? void 0 : skillUser.length) > 0) {
            for (let i = 0; i < skillUser.length; i++) {
                const element = skillUser[i];
                skillList.push(element.skillId);
            }
        }
        return await this.evaluationEntity.sequelize.query(`
      CALL undo_exception(
      :periodId, :userId, :companyGroupCode, :level, :flagSkill, ARRAY[:skillList]::integer[],
      :evaluationId, :year, :periodIndex,
      :evaluator05Id, :evaluator1Id, :evaluator2Id,
      :departmentName, :departmentId, :divisionId, :divisionName
      );
      `, {
            replacements: {
                periodId: data === null || data === void 0 ? void 0 : data.evaluationPeriodId,
                userId: data === null || data === void 0 ? void 0 : data.userId,
                companyGroupCode: req.user.companyGroupCode,
                level: data === null || data === void 0 ? void 0 : data.level,
                flagSkill: data === null || data === void 0 ? void 0 : data.flagSkill,
                skillList: skillList,
                evaluationId: data === null || data === void 0 ? void 0 : data.id,
                year: parseInt(data.year),
                periodIndex: data.periodIndex,
                evaluator05Id: (data === null || data === void 0 ? void 0 : data.evaluator05Id) || null,
                evaluator1Id: (data === null || data === void 0 ? void 0 : data.evaluator10Id) || null,
                evaluator2Id: (data === null || data === void 0 ? void 0 : data.evaluator20Id) || null,
                departmentName: (data === null || data === void 0 ? void 0 : data.departmentName) || null,
                departmentId: (data === null || data === void 0 ? void 0 : data.departmentId) || null,
                divisionId: (data === null || data === void 0 ? void 0 : data.divisionId) || null,
                divisionName: (data === null || data === void 0 ? void 0 : data.divisionName) || null,
            },
            type: sequelize_1.QueryTypes.RAW,
        });
    }
    async getlistProSkillByIdEvaluation(condition) {
        return this.evaluationProEntity.findAll({
            where: condition,
        });
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.USER),
    __metadata("design:type", Object)
], UserRepository.prototype, "userEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_PERIOD),
    __metadata("design:type", Object)
], UserRepository.prototype, "evaluationPeriodEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION),
    __metadata("design:type", Object)
], UserRepository.prototype, "evaluationEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_LEVEL),
    __metadata("design:type", Object)
], UserRepository.prototype, "settingLevelEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_PRO),
    __metadata("design:type", Object)
], UserRepository.prototype, "evaluationProEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.LIST_BASIC_BEHAVIOR),
    __metadata("design:type", Object)
], UserRepository.prototype, "listBasicBehaviorEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.LIST_PRO_SKILL),
    __metadata("design:type", Object)
], UserRepository.prototype, "listProSkillEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_ACHIEVEMENT_PERSONAL),
    __metadata("design:type", Object)
], UserRepository.prototype, "settingAchievementPersonalEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_ACHIEVEMENT_PERSONAL),
    __metadata("design:type", Object)
], UserRepository.prototype, "evaluationAchievementPersonal", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_ACHIEVEMENT_PERSONAL_SUB),
    __metadata("design:type", Object)
], UserRepository.prototype, "evaluationAchievementPersonalSub", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_BASIC_BEHAVIOR),
    __metadata("design:type", Object)
], UserRepository.prototype, "evaluationBasicBehaviorEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_ACHIEVEMENT_ADDITIONAL),
    __metadata("design:type", Object)
], UserRepository.prototype, "settingAchievementAdditionalEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_ACHIEVEMENT_ADDITIONAL),
    __metadata("design:type", Object)
], UserRepository.prototype, "evaluationAchievementAdditionalEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.PERMISSION),
    __metadata("design:type", Object)
], UserRepository.prototype, "permission", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_PRO_FORMULA_SUB),
    __metadata("design:type", Object)
], UserRepository.prototype, "settingProFormulaSubEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATOR),
    __metadata("design:type", Object)
], UserRepository.prototype, "evaluatorEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATOR_DEFAULT),
    __metadata("design:type", Object)
], UserRepository.prototype, "evaluatorDefaultEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.VERSION_PRO_SKILL),
    __metadata("design:type", Object)
], UserRepository.prototype, "versionProSkillEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SKILL_ROLE),
    __metadata("design:type", Object)
], UserRepository.prototype, "skillRole", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SKILL_GROUP),
    __metadata("design:type", Object)
], UserRepository.prototype, "skillGroupEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SKILL_USER_ENTITY),
    __metadata("design:type", Object)
], UserRepository.prototype, "skillUserEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SKILL),
    __metadata("design:type", Object)
], UserRepository.prototype, "skillEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_DEFAULT_PERIOD_VIEWING),
    __metadata("design:type", Object)
], UserRepository.prototype, "settingDefaultPeriodEnity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_REVIEW),
    __metadata("design:type", Object)
], UserRepository.prototype, "settingReviewEnity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATOR_DEFAULT),
    __metadata("design:type", Object)
], UserRepository.prototype, "evaluatorDefault", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SKILL_USER_ENTITY),
    __metadata("design:type", Object)
], UserRepository.prototype, "skillUser", void 0);
UserRepository = __decorate([
    (0, common_1.Injectable)()
], UserRepository);
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map