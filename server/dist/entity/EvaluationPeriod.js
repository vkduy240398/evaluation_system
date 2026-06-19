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
exports.EvaluationPeriod = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const Evaluation_1 = require("./Evaluation");
const EvaluatorDefault_1 = require("./EvaluatorDefault");
const CompanyGroup_1 = require("./CompanyGroup");
let EvaluationPeriod = class EvaluationPeriod extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], EvaluationPeriod.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(4),
        allowNull: false,
    }),
    __metadata("design:type", String)
], EvaluationPeriod.prototype, "year", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'period_index',
    }),
    __metadata("design:type", Number)
], EvaluationPeriod.prototype, "periodIndex", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(7),
        allowNull: false,
        field: 'period_start',
    }),
    __metadata("design:type", String)
], EvaluationPeriod.prototype, "periodStart", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(7),
        allowNull: false,
        field: 'period_end',
    }),
    __metadata("design:type", String)
], EvaluationPeriod.prototype, "periodEnd", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'date_creation_goal_start',
    }),
    __metadata("design:type", String)
], EvaluationPeriod.prototype, "dateCreationGoalStart", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'date_creation_goal_end',
    }),
    __metadata("design:type", String)
], EvaluationPeriod.prototype, "dateCreationGoalEnd", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'date_evaluation_start',
    }),
    __metadata("design:type", String)
], EvaluationPeriod.prototype, "dateEvaluationStart", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'date_evaluation_end',
    }),
    __metadata("design:type", String)
], EvaluationPeriod.prototype, "dateEvaluationEnd", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'date_creation_goal_department_start',
    }),
    __metadata("design:type", String)
], EvaluationPeriod.prototype, "dateCreationGoalDepartmentStart", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'date_creation_goal_department_end',
    }),
    __metadata("design:type", String)
], EvaluationPeriod.prototype, "dateCreationGoalDepartmentEnd", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'date_evaluation_department_start',
    }),
    __metadata("design:type", String)
], EvaluationPeriod.prototype, "dateEvaluationDepartmentStart", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'date_evaluation_department_end',
    }),
    __metadata("design:type", String)
], EvaluationPeriod.prototype, "dateEvaluationDepartmentEnd", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], EvaluationPeriod.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], EvaluationPeriod.prototype, "updatedTime", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'check_fixed',
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], EvaluationPeriod.prototype, "checkFixed", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(20),
        field: 'company_group_code',
    }),
    __metadata("design:type", String)
], EvaluationPeriod.prototype, "companyGroupCode", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => CompanyGroup_1.CompanyGroup, 'company_group_code'),
    __metadata("design:type", CompanyGroup_1.CompanyGroup)
], EvaluationPeriod.prototype, "companyGroup", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Evaluation_1.Evaluation),
    __metadata("design:type", Array)
], EvaluationPeriod.prototype, "evaluations", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => EvaluatorDefault_1.EvaluatorDefault),
    __metadata("design:type", Array)
], EvaluationPeriod.prototype, "evaluatorDefaults", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => EvaluatorDefault_1.EvaluatorDefault),
    __metadata("design:type", EvaluatorDefault_1.EvaluatorDefault)
], EvaluationPeriod.prototype, "evaluatorDefault", void 0);
EvaluationPeriod = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'evaluation_period_tbl',
        indexes: [{ fields: ['year', 'period_index'], unique: false }],
    })
], EvaluationPeriod);
exports.EvaluationPeriod = EvaluationPeriod;
//# sourceMappingURL=EvaluationPeriod.js.map