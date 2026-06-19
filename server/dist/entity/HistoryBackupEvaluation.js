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
exports.HistoryBackupEvaluation = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
let HistoryBackupEvaluation = class HistoryBackupEvaluation extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], HistoryBackupEvaluation.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.BIGINT,
        field: 'evaluation_id',
        allowNull: false,
    }),
    __metadata("design:type", Number)
], HistoryBackupEvaluation.prototype, "evaluationId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.TEXT,
        field: 'evaluation_record',
    }),
    __metadata("design:type", String)
], HistoryBackupEvaluation.prototype, "evaluationRecord", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.TEXT,
        field: 'evaluation_pro',
    }),
    __metadata("design:type", String)
], HistoryBackupEvaluation.prototype, "evaluationPro", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.TEXT,
        field: 'evaluation_basic_behavior',
    }),
    __metadata("design:type", String)
], HistoryBackupEvaluation.prototype, "evaluationBasicBehavior", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.TEXT,
        field: 'evaluator',
    }),
    __metadata("design:type", String)
], HistoryBackupEvaluation.prototype, "evaluator", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.TEXT,
        field: 'history_approve_evaluation',
    }),
    __metadata("design:type", String)
], HistoryBackupEvaluation.prototype, "historyApproveEvaluation", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.TEXT,
        field: 'skill_user',
    }),
    __metadata("design:type", String)
], HistoryBackupEvaluation.prototype, "skillUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.TEXT,
        field: 'evaluation_achievement_personal',
    }),
    __metadata("design:type", String)
], HistoryBackupEvaluation.prototype, "evaluationAchievementPersonal", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], HistoryBackupEvaluation.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], HistoryBackupEvaluation.prototype, "updatedTime", void 0);
HistoryBackupEvaluation = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'history_backup_evaluation_tbl' })
], HistoryBackupEvaluation);
exports.HistoryBackupEvaluation = HistoryBackupEvaluation;
//# sourceMappingURL=HistoryBackupEvaluation.js.map