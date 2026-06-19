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
exports.HistoryCronJob = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const CompanyGroup_1 = require("./CompanyGroup");
let HistoryCronJob = class HistoryCronJob extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], HistoryCronJob.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], HistoryCronJob.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], HistoryCronJob.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: true,
        field: 'period_index',
    }),
    __metadata("design:type", Number)
], HistoryCronJob.prototype, "periodIndex", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(4),
        allowNull: true,
        field: 'year',
    }),
    __metadata("design:type", String)
], HistoryCronJob.prototype, "year", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
        field: 'date_creation_goal_start',
    }),
    __metadata("design:type", String)
], HistoryCronJob.prototype, "dateCreationGoalStart", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
        field: 'date_creation_goal_end',
    }),
    __metadata("design:type", String)
], HistoryCronJob.prototype, "dateCreationGoalEnd", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
        field: 'date_creation_goal_department_start',
    }),
    __metadata("design:type", String)
], HistoryCronJob.prototype, "dateCreationGoalDepartmentStart", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
        field: 'date_creation_goal_department_end',
    }),
    __metadata("design:type", String)
], HistoryCronJob.prototype, "dateCreationGoalDepartmentEnd", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
        field: 'date_send_mail_evaluation_goal',
    }),
    __metadata("design:type", String)
], HistoryCronJob.prototype, "dateSendMailEvaluationGoal", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        field: 'evaluation_period_id',
    }),
    __metadata("design:type", Number)
], HistoryCronJob.prototype, "evaluationPeriodId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], HistoryCronJob.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], HistoryCronJob.prototype, "updatedTime", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
        field: 'company_group_code',
    }),
    __metadata("design:type", String)
], HistoryCronJob.prototype, "companyGroupCode", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => CompanyGroup_1.CompanyGroup, 'company_group_code'),
    __metadata("design:type", CompanyGroup_1.CompanyGroup)
], HistoryCronJob.prototype, "companyGroupFK", void 0);
HistoryCronJob = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'history_cron_job_tbl' })
], HistoryCronJob);
exports.HistoryCronJob = HistoryCronJob;
//# sourceMappingURL=HistoryCronJob.js.map