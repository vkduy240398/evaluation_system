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
exports.EvaluationAchievementPersonal = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const Evaluation_1 = require("./Evaluation");
const EvaluationAchievementPersonalSub_1 = require("./EvaluationAchievementPersonalSub");
let EvaluationAchievementPersonal = class EvaluationAchievementPersonal extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], EvaluationAchievementPersonal.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Evaluation_1.Evaluation),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        field: 'evaluation_id',
    }),
    __metadata("design:type", Number)
], EvaluationAchievementPersonal.prototype, "evaluationId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'item_no',
    }),
    __metadata("design:type", Number)
], EvaluationAchievementPersonal.prototype, "itemNo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(1001),
    }),
    __metadata("design:type", String)
], EvaluationAchievementPersonal.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(1001),
        field: 'achievement_value',
    }),
    __metadata("design:type", String)
], EvaluationAchievementPersonal.prototype, "achievementValue", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(5001),
    }),
    __metadata("design:type", String)
], EvaluationAchievementPersonal.prototype, "method", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
    }),
    __metadata("design:type", Number)
], EvaluationAchievementPersonal.prototype, "weight", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        field: 'difficulty_user',
    }),
    __metadata("design:type", Number)
], EvaluationAchievementPersonal.prototype, "difficultyUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        field: 'difficulty_evaluator_0_5',
    }),
    __metadata("design:type", Number)
], EvaluationAchievementPersonal.prototype, "difficultyEvaluator05", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        field: 'difficulty_evaluator_1',
    }),
    __metadata("design:type", Number)
], EvaluationAchievementPersonal.prototype, "difficultyEvaluator1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        field: 'difficulty_evaluator_2',
    }),
    __metadata("design:type", Number)
], EvaluationAchievementPersonal.prototype, "difficultyEvaluator2", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'achievement_status',
    }),
    __metadata("design:type", String)
], EvaluationAchievementPersonal.prototype, "achievementStatus", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(1001),
        field: 'reason_comment',
    }),
    __metadata("design:type", String)
], EvaluationAchievementPersonal.prototype, "reasonComment", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(1001),
        field: 'action_plan',
    }),
    __metadata("design:type", String)
], EvaluationAchievementPersonal.prototype, "actionPlan", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'point_user',
    }),
    __metadata("design:type", Number)
], EvaluationAchievementPersonal.prototype, "pointUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        field: 'coefficient_user',
    }),
    __metadata("design:type", Number)
], EvaluationAchievementPersonal.prototype, "coefficientUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'point_evaluator_0_5',
    }),
    __metadata("design:type", Number)
], EvaluationAchievementPersonal.prototype, "pointEvaluator05", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        field: 'coefficient_evaluator_0_5',
    }),
    __metadata("design:type", Number)
], EvaluationAchievementPersonal.prototype, "coefficientEvaluator05", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'point_evaluator_1',
    }),
    __metadata("design:type", Number)
], EvaluationAchievementPersonal.prototype, "pointEvaluator1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        field: 'coefficient_evaluator_1',
    }),
    __metadata("design:type", Number)
], EvaluationAchievementPersonal.prototype, "coefficientEvaluator1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'point_evaluator_2',
    }),
    __metadata("design:type", Number)
], EvaluationAchievementPersonal.prototype, "pointEvaluator2", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        field: 'coefficient_evaluator_2',
    }),
    __metadata("design:type", Number)
], EvaluationAchievementPersonal.prototype, "coefficientEvaluator2", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], EvaluationAchievementPersonal.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], EvaluationAchievementPersonal.prototype, "updatedTime", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: true,
        field: 'type',
    }),
    __metadata("design:type", Number)
], EvaluationAchievementPersonal.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => EvaluationAchievementPersonalSub_1.EvaluationAchievementPersonalSub, 'achievementPersonalId'),
    __metadata("design:type", Array)
], EvaluationAchievementPersonal.prototype, "evaluationAchievementPersonalSub", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Evaluation_1.Evaluation, 'evaluation_id'),
    __metadata("design:type", Evaluation_1.Evaluation)
], EvaluationAchievementPersonal.prototype, "evaluation", void 0);
EvaluationAchievementPersonal = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'evaluation_achievement_personal_tbl' })
], EvaluationAchievementPersonal);
exports.EvaluationAchievementPersonal = EvaluationAchievementPersonal;
//# sourceMappingURL=EvaluationAchievementPersonal.js.map