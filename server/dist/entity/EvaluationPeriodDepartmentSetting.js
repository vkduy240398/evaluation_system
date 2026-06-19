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
exports.EvaluationPeriodDepartmentSetting = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const EvaluationPeriod_1 = require("./EvaluationPeriod");
const Department_1 = require("./Department");
const CompanyGroup_1 = require("./CompanyGroup");
let EvaluationPeriodDepartmentSetting = class EvaluationPeriodDepartmentSetting extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], EvaluationPeriodDepartmentSetting.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'evaluation_period_id',
    }),
    __metadata("design:type", Number)
], EvaluationPeriodDepartmentSetting.prototype, "evaluationPeriodId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'department_id',
    }),
    __metadata("design:type", Number)
], EvaluationPeriodDepartmentSetting.prototype, "departmentId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(20),
        field: 'company_group_code',
    }),
    __metadata("design:type", String)
], EvaluationPeriodDepartmentSetting.prototype, "companyGroupCode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'date_creation_goal_department_start',
    }),
    __metadata("design:type", String)
], EvaluationPeriodDepartmentSetting.prototype, "dateCreationGoalDepartmentStart", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'date_creation_goal_department_end',
    }),
    __metadata("design:type", String)
], EvaluationPeriodDepartmentSetting.prototype, "dateCreationGoalDepartmentEnd", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'date_creation_goal_start',
    }),
    __metadata("design:type", String)
], EvaluationPeriodDepartmentSetting.prototype, "dateCreationGoalStart", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'date_creation_goal_end',
    }),
    __metadata("design:type", String)
], EvaluationPeriodDepartmentSetting.prototype, "dateCreationGoalEnd", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'date_evaluation_department_start',
    }),
    __metadata("design:type", String)
], EvaluationPeriodDepartmentSetting.prototype, "dateEvaluationDepartmentStart", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'date_evaluation_department_end',
    }),
    __metadata("design:type", String)
], EvaluationPeriodDepartmentSetting.prototype, "dateEvaluationDepartmentEnd", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'date_evaluation_start',
    }),
    __metadata("design:type", String)
], EvaluationPeriodDepartmentSetting.prototype, "dateEvaluationStart", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'date_evaluation_end',
    }),
    __metadata("design:type", String)
], EvaluationPeriodDepartmentSetting.prototype, "dateEvaluationEnd", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'check_fixed',
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], EvaluationPeriodDepartmentSetting.prototype, "checkFixed", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], EvaluationPeriodDepartmentSetting.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], EvaluationPeriodDepartmentSetting.prototype, "updatedTime", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => EvaluationPeriod_1.EvaluationPeriod, 'evaluation_period_id'),
    __metadata("design:type", EvaluationPeriod_1.EvaluationPeriod)
], EvaluationPeriodDepartmentSetting.prototype, "evaluationPeriod", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Department_1.Department, 'department_id'),
    __metadata("design:type", Department_1.Department)
], EvaluationPeriodDepartmentSetting.prototype, "department", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => CompanyGroup_1.CompanyGroup, 'company_group_code'),
    __metadata("design:type", CompanyGroup_1.CompanyGroup)
], EvaluationPeriodDepartmentSetting.prototype, "companyGroup", void 0);
EvaluationPeriodDepartmentSetting = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'evaluation_period_department_setting_tbl',
        indexes: [
            { fields: ['evaluation_period_id'] },
            { fields: ['department_id'] },
            { fields: ['evaluation_period_id', 'department_id'], unique: true },
        ],
    })
], EvaluationPeriodDepartmentSetting);
exports.EvaluationPeriodDepartmentSetting = EvaluationPeriodDepartmentSetting;
//# sourceMappingURL=EvaluationPeriodDepartmentSetting.js.map