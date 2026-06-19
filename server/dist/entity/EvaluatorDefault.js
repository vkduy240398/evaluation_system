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
exports.EvaluatorDefault = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./User");
const EvaluationPeriod_1 = require("./EvaluationPeriod");
const CompanyGroup_1 = require("./CompanyGroup");
const Department_1 = require("./Department");
let EvaluatorDefault = class EvaluatorDefault extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], EvaluatorDefault.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'user_id',
    }),
    __metadata("design:type", Number)
], EvaluatorDefault.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(100),
        field: 'department_name',
    }),
    __metadata("design:type", String)
], EvaluatorDefault.prototype, "departmentName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(100),
        field: 'division_name',
    }),
    __metadata("design:type", String)
], EvaluatorDefault.prototype, "divisionName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DataTypes.SMALLINT }),
    __metadata("design:type", Number)
], EvaluatorDefault.prototype, "level", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DataTypes.SMALLINT, field: 'flag_skill' }),
    __metadata("design:type", Number)
], EvaluatorDefault.prototype, "flagSkill", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'evaluator_0_5_id',
    }),
    __metadata("design:type", Number)
], EvaluatorDefault.prototype, "evaluator05Id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'evaluator_1_id',
    }),
    __metadata("design:type", Number)
], EvaluatorDefault.prototype, "evaluator1Id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'evaluator_2_id',
    }),
    __metadata("design:type", Number)
], EvaluatorDefault.prototype, "evaluator2Id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => EvaluationPeriod_1.EvaluationPeriod),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.INTEGER,
        field: 'evaluation_period_id',
    }),
    __metadata("design:type", Number)
], EvaluatorDefault.prototype, "evaluationPeriodId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'department_id',
    }),
    __metadata("design:type", Number)
], EvaluatorDefault.prototype, "departmentId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'division_id',
    }),
    __metadata("design:type", Number)
], EvaluatorDefault.prototype, "divisionId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], EvaluatorDefault.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], EvaluatorDefault.prototype, "updatedTime", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
        field: 'company_group_code',
    }),
    __metadata("design:type", String)
], EvaluatorDefault.prototype, "companyGroupCode", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => CompanyGroup_1.CompanyGroup, 'company_group_code'),
    __metadata("design:type", CompanyGroup_1.CompanyGroup)
], EvaluatorDefault.prototype, "companyGroup", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User, 'user_id'),
    __metadata("design:type", User_1.User)
], EvaluatorDefault.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User, 'evaluator_0_5_id'),
    __metadata("design:type", User_1.User)
], EvaluatorDefault.prototype, "evaluator05", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User, 'evaluator_1_id'),
    __metadata("design:type", User_1.User)
], EvaluatorDefault.prototype, "evaluator1", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User, 'evaluator_2_id'),
    __metadata("design:type", User_1.User)
], EvaluatorDefault.prototype, "evaluator2", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => EvaluationPeriod_1.EvaluationPeriod, 'evaluation_period_id'),
    __metadata("design:type", EvaluationPeriod_1.EvaluationPeriod)
], EvaluatorDefault.prototype, "evaluationPeriod", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Department_1.Department, 'department_id'),
    __metadata("design:type", Department_1.Department)
], EvaluatorDefault.prototype, "department", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Department_1.Department, 'division_id'),
    __metadata("design:type", Department_1.Department)
], EvaluatorDefault.prototype, "division", void 0);
EvaluatorDefault = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'evaluator_default_tbl' })
], EvaluatorDefault);
exports.EvaluatorDefault = EvaluatorDefault;
//# sourceMappingURL=EvaluatorDefault.js.map