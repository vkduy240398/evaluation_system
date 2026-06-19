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
exports.SummaryDepartment = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const Evaluation_1 = require("./Evaluation");
let SummaryDepartment = class SummaryDepartment extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], SummaryDepartment.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Evaluation_1.Evaluation),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'evaluation_id',
        references: {
            model: Evaluation_1.Evaluation,
            key: 'id',
        },
    }),
    __metadata("design:type", Number)
], SummaryDepartment.prototype, "evaluationId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        field: 'achievement_personal_total_point_user',
    }),
    __metadata("design:type", Number)
], SummaryDepartment.prototype, "achievementPersonalTotalPointUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        field: 'achievement_personal_total_point_evaluator_0_5',
    }),
    __metadata("design:type", Number)
], SummaryDepartment.prototype, "achievementPersonalTotalPointEvaluator05", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        field: 'achievement_personal_total_point_evaluator_1',
    }),
    __metadata("design:type", Number)
], SummaryDepartment.prototype, "achievementPersonalTotalPointEvaluator1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        field: 'achievement_personal_total_point_evaluator_2',
    }),
    __metadata("design:type", Number)
], SummaryDepartment.prototype, "achievementPersonalTotalPointEvaluator2", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        field: 'achievement_additional_total_point_user',
    }),
    __metadata("design:type", Number)
], SummaryDepartment.prototype, "achievementAdditionalTotalPointUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        field: 'achievement_additional_total_point_evaluator_0_5',
    }),
    __metadata("design:type", Number)
], SummaryDepartment.prototype, "achievementAdditionalTotalPointEvaluator05", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        field: 'achievement_additional_total_point_evaluator_1',
    }),
    __metadata("design:type", Number)
], SummaryDepartment.prototype, "achievementAdditionalTotalPointEvaluator1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        field: 'achievement_additional_total_point_evaluator_2',
    }),
    __metadata("design:type", Number)
], SummaryDepartment.prototype, "achievementAdditionalTotalPointEvaluator2", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        field: 'summary_point_user',
    }),
    __metadata("design:type", Number)
], SummaryDepartment.prototype, "summaryPointUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        field: 'summary_point_evaluator_0_5',
    }),
    __metadata("design:type", Number)
], SummaryDepartment.prototype, "summaryPointEvaluator05", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        field: 'summary_point_evaluator_1',
    }),
    __metadata("design:type", Number)
], SummaryDepartment.prototype, "summaryPointEvaluator1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        field: 'summary_point_evaluator_2',
    }),
    __metadata("design:type", Number)
], SummaryDepartment.prototype, "summaryPointEvaluator2", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'summary_char_point_user',
    }),
    __metadata("design:type", String)
], SummaryDepartment.prototype, "summaryCharPointUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'summary_char_point_evaluator_0_5',
    }),
    __metadata("design:type", String)
], SummaryDepartment.prototype, "summaryCharPointEvaluator05", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'summary_char_point_evaluator_1',
    }),
    __metadata("design:type", String)
], SummaryDepartment.prototype, "summaryCharPointEvaluator1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'summary_char_point_evaluator_2',
    }),
    __metadata("design:type", String)
], SummaryDepartment.prototype, "summaryCharPointEvaluator2", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], SummaryDepartment.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], SummaryDepartment.prototype, "updatedTime", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => Evaluation_1.Evaluation, 'id'),
    __metadata("design:type", Evaluation_1.Evaluation)
], SummaryDepartment.prototype, "evaluation", void 0);
SummaryDepartment = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'summary_department_tbl' })
], SummaryDepartment);
exports.SummaryDepartment = SummaryDepartment;
//# sourceMappingURL=SummaryDepartment.js.map