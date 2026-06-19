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
exports.Evaluation = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const EvaluationAchievementAdditional_1 = require("./EvaluationAchievementAdditional");
const EvaluationAchievementPersonal_1 = require("./EvaluationAchievementPersonal");
const EvaluationBasicBehavior_1 = require("./EvaluationBasicBehavior");
const EvaluationPeriod_1 = require("./EvaluationPeriod");
const EvaluationPro_1 = require("./EvaluationPro");
const Evaluator_1 = require("./Evaluator");
const User_1 = require("./User");
const VersionGuideEvaluation_1 = require("./VersionGuideEvaluation");
const HistoryApproveEvaluation_1 = require("./HistoryApproveEvaluation");
const SummaryDepartment_1 = require("./SummaryDepartment");
const SkillUser_1 = require("./SkillUser");
const CompanyGroup_1 = require("./CompanyGroup");
const Department_1 = require("./Department");
let Evaluation = class Evaluation extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.BIGINT,
        field: 'evaluation_department_id',
        allowNull: true,
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "evaluationDepartmentId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(116),
        field: 'department_name',
    }),
    __metadata("design:type", String)
], Evaluation.prototype, "departmentName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(116),
        field: 'division_name',
    }),
    __metadata("design:type", String)
], Evaluation.prototype, "divisionName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(100),
        field: 'company_name',
    }),
    __metadata("design:type", String)
], Evaluation.prototype, "companyName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Evaluation.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(7),
        allowNull: false,
        field: 'period_start',
    }),
    __metadata("design:type", String)
], Evaluation.prototype, "periodStart", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(7),
        allowNull: false,
        field: 'period_end',
    }),
    __metadata("design:type", String)
], Evaluation.prototype, "periodEnd", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "level", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(2001),
        field: 'comment_user',
    }),
    __metadata("design:type", String)
], Evaluation.prototype, "commentUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'skill_percent',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "skillPercent", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'behavior_percent',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "behaviorPercent", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'achievement_percent',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "achievementPercent", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'basic_pro_total_point_user',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "basicProTotalPointUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'basic_pro_total_point_evaluator_0_5',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "basicProTotalPointEvaluator05", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'basic_pro_total_point_evaluator_1',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "basicProTotalPointEvaluator1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'basic_pro_total_point_evaluator_2',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "basicProTotalPointEvaluator2", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'basic_total_point_user',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "basicTotalPointUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'basic_total_point_evaluator_0_5',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "basicTotalPointEvaluator05", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'basic_total_point_evaluator_1',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "basicTotalPointEvaluator1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'basic_total_point_evaluator_2',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "basicTotalPointEvaluator2", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'pro_total_point_user',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "proTotalPointUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'pro_total_point_evaluator_0_5',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "proTotalPointEvaluator05", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'pro_total_point_evaluator_1',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "proTotalPointEvaluator1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'pro_total_point_evaluator_2',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "proTotalPointEvaluator2", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'behavior_total_point_user',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "behaviorTotalPointUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'behavior_total_point_evaluator_0_5',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "behaviorTotalPointEvaluator05", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'behavior_total_point_evaluator_1',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "behaviorTotalPointEvaluator1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'behavior_total_point_evaluator_2',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "behaviorTotalPointEvaluator2", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        field: 'achievement_personal_total_point_user',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "achievementPersonalTotalPointUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        field: 'achievement_personal_total_point_evaluator_0_5',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "achievementPersonalTotalPointEvaluator05", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        field: 'achievement_personal_total_point_evaluator_1',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "achievementPersonalTotalPointEvaluator1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        field: 'achievement_personal_total_point_evaluator_2',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "achievementPersonalTotalPointEvaluator2", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        field: 'achievement_additional_total_point_user',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "achievementAdditionalTotalPointUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        field: 'achievement_additional_total_point_evaluator_0_5',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "achievementAdditionalTotalPointEvaluator05", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        field: 'achievement_additional_total_point_evaluator_1',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "achievementAdditionalTotalPointEvaluator1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        field: 'achievement_additional_total_point_evaluator_2',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "achievementAdditionalTotalPointEvaluator2", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        field: 'summary_point_user',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "summaryPointUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        field: 'summary_point_evaluator_0_5',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "summaryPointEvaluator05", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        field: 'summary_point_evaluator_1',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "summaryPointEvaluator1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        field: 'summary_point_evaluator_2',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "summaryPointEvaluator2", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'summary_char_point_user',
    }),
    __metadata("design:type", String)
], Evaluation.prototype, "summaryCharPointUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'summary_char_point_evaluator_0_5',
    }),
    __metadata("design:type", String)
], Evaluation.prototype, "summaryCharPointEvaluator05", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'summary_char_point_evaluator_1',
    }),
    __metadata("design:type", String)
], Evaluation.prototype, "summaryCharPointEvaluator1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'summary_char_point_evaluator_2',
    }),
    __metadata("design:type", String)
], Evaluation.prototype, "summaryCharPointEvaluator2", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'date_creation_goal_start',
    }),
    __metadata("design:type", String)
], Evaluation.prototype, "dateCreationGoalStart", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'date_creation_goal_end',
    }),
    __metadata("design:type", String)
], Evaluation.prototype, "dateCreationGoalEnd", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'date_evaluation_start',
    }),
    __metadata("design:type", String)
], Evaluation.prototype, "dateEvaluationStart", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'date_evaluation_end',
    }),
    __metadata("design:type", String)
], Evaluation.prototype, "dateEvaluationEnd", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(1),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'flag_skill',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "flagSkill", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'percent_point',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "percentPoint", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'user_id',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => EvaluationPeriod_1.EvaluationPeriod),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'evaluation_period_id',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "evaluationPeriodId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => VersionGuideEvaluation_1.VersionGuideEvaluation),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'guide_version_id',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "guideVersionId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'creation_user',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "creationUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'created_by_cronjob',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "createdByCronjob", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Department_1.Department),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'department_id',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "departmentId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Department_1.Department),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'division_id',
    }),
    __metadata("design:type", Number)
], Evaluation.prototype, "divisionId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: 'company_group_code',
        type: sequelize_1.DataTypes.STRING(20),
    }),
    (0, sequelize_typescript_1.ForeignKey)(() => CompanyGroup_1.CompanyGroup),
    __metadata("design:type", String)
], Evaluation.prototype, "companyGroupCode", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], Evaluation.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], Evaluation.prototype, "updatedTime", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => CompanyGroup_1.CompanyGroup, 'company_group_code'),
    __metadata("design:type", CompanyGroup_1.CompanyGroup)
], Evaluation.prototype, "companyGroup", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Evaluator_1.Evaluator),
    __metadata("design:type", Array)
], Evaluation.prototype, "evaluator", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => EvaluationBasicBehavior_1.EvaluationBasicBehavior),
    __metadata("design:type", Array)
], Evaluation.prototype, "evaluationBasicBehavior", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => EvaluationPro_1.EvaluationPro),
    __metadata("design:type", Array)
], Evaluation.prototype, "evaluationPro", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => EvaluationAchievementPersonal_1.EvaluationAchievementPersonal),
    __metadata("design:type", Array)
], Evaluation.prototype, "evaluationAchievementPersonals", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => EvaluationAchievementAdditional_1.EvaluationAchievementAdditional),
    __metadata("design:type", Array)
], Evaluation.prototype, "evaluationAchievementAdditional", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => EvaluationAchievementPersonal_1.EvaluationAchievementPersonal),
    __metadata("design:type", Array)
], Evaluation.prototype, "evaluationAchievementPersonalsNew", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => EvaluationAchievementAdditional_1.EvaluationAchievementAdditional),
    __metadata("design:type", Array)
], Evaluation.prototype, "evaluationAchievementAdditionalNew", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User, 'user_id'),
    __metadata("design:type", User_1.User)
], Evaluation.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => EvaluationPeriod_1.EvaluationPeriod, 'evaluation_period_id'),
    __metadata("design:type", EvaluationPeriod_1.EvaluationPeriod)
], Evaluation.prototype, "evaluationPeriod", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => VersionGuideEvaluation_1.VersionGuideEvaluation, 'guide_version_id'),
    __metadata("design:type", VersionGuideEvaluation_1.VersionGuideEvaluation)
], Evaluation.prototype, "versionGuideEvaluation", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User, 'creation_user'),
    __metadata("design:type", User_1.User)
], Evaluation.prototype, "creationUserFK", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => HistoryApproveEvaluation_1.HistoryApproveEvaluation),
    __metadata("design:type", Array)
], Evaluation.prototype, "historyApproveEvaluations", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => HistoryApproveEvaluation_1.HistoryApproveEvaluation),
    __metadata("design:type", HistoryApproveEvaluation_1.HistoryApproveEvaluation)
], Evaluation.prototype, "historyApproveEvaluation", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => SummaryDepartment_1.SummaryDepartment),
    __metadata("design:type", SummaryDepartment_1.SummaryDepartment)
], Evaluation.prototype, "summaryDepartment", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SkillUser_1.SkillUser),
    __metadata("design:type", Array)
], Evaluation.prototype, "skillUser", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Department_1.Department, 'department_id'),
    __metadata("design:type", Department_1.Department)
], Evaluation.prototype, "department", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Department_1.Department, 'division_id'),
    __metadata("design:type", Department_1.Department)
], Evaluation.prototype, "division", void 0);
Evaluation = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'evaluation_tbl' })
], Evaluation);
exports.Evaluation = Evaluation;
//# sourceMappingURL=Evaluation.js.map