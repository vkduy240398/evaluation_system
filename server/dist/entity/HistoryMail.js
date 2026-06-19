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
exports.HistoryMail = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const Evaluation_1 = require("./Evaluation");
const EvaluationPeriod_1 = require("./EvaluationPeriod");
const HistoryCronJob_1 = require("./HistoryCronJob");
const CompanyGroup_1 = require("./CompanyGroup");
let HistoryMail = class HistoryMail extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], HistoryMail.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Evaluation_1.Evaluation),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.BIGINT,
        field: 'evaluation_id',
    }),
    __metadata("design:type", Number)
], HistoryMail.prototype, "evaluationId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => EvaluationPeriod_1.EvaluationPeriod),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.INTEGER,
        field: 'evaluation_period_id',
    }),
    __metadata("design:type", Number)
], HistoryMail.prototype, "evaluationPeriodId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], HistoryMail.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], HistoryMail.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.TEXT,
        field: 'mail_to',
    }),
    __metadata("design:type", String)
], HistoryMail.prototype, "mailTo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.TEXT,
        field: 'mail_cc',
    }),
    __metadata("design:type", String)
], HistoryMail.prototype, "mailCC", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(30),
        field: 'evaluation_time',
    }),
    __metadata("design:type", String)
], HistoryMail.prototype, "evaluationTime", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(30),
        field: 'evaluation_department_time',
    }),
    __metadata("design:type", String)
], HistoryMail.prototype, "evaluationDepartmentTime", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(10),
        field: 'send_time_setting',
    }),
    __metadata("design:type", String)
], HistoryMail.prototype, "sendTimeSetting", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(16),
        field: 'send_time_actual',
    }),
    __metadata("design:type", String)
], HistoryMail.prototype, "sendTimeActual", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.TEXT,
    }),
    __metadata("design:type", String)
], HistoryMail.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.TEXT,
        field: 'content_mail',
    }),
    __metadata("design:type", String)
], HistoryMail.prototype, "contentMail", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => HistoryCronJob_1.HistoryCronJob),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.INTEGER,
        field: 'cronjob_id',
    }),
    __metadata("design:type", Number)
], HistoryMail.prototype, "cronjobId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], HistoryMail.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], HistoryMail.prototype, "updatedTime", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
        field: 'company_group_code',
    }),
    __metadata("design:type", String)
], HistoryMail.prototype, "companyGroupCode", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Evaluation_1.Evaluation, 'evaluation_id'),
    __metadata("design:type", Evaluation_1.Evaluation)
], HistoryMail.prototype, "evaluation", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => EvaluationPeriod_1.EvaluationPeriod, 'evaluation_period_id'),
    __metadata("design:type", EvaluationPeriod_1.EvaluationPeriod)
], HistoryMail.prototype, "evaluationPeriod", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => HistoryCronJob_1.HistoryCronJob, 'cronjob_id'),
    __metadata("design:type", HistoryCronJob_1.HistoryCronJob)
], HistoryMail.prototype, "historyCronjob", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => CompanyGroup_1.CompanyGroup, 'company_group_code'),
    __metadata("design:type", CompanyGroup_1.CompanyGroup)
], HistoryMail.prototype, "companyGroupFK", void 0);
HistoryMail = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'history_mail_tbl' })
], HistoryMail);
exports.HistoryMail = HistoryMail;
//# sourceMappingURL=HistoryMail.js.map