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
exports.EvaluationAchievementPersonalSub = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const EvaluationAchievementPersonal_1 = require("./EvaluationAchievementPersonal");
let EvaluationAchievementPersonalSub = class EvaluationAchievementPersonalSub extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], EvaluationAchievementPersonalSub.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => EvaluationAchievementPersonal_1.EvaluationAchievementPersonal),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.BIGINT,
        field: 'achievement_personal_id',
    }),
    __metadata("design:type", Number)
], EvaluationAchievementPersonalSub.prototype, "achievementPersonalId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], EvaluationAchievementPersonalSub.prototype, "coefficient", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(500),
    }),
    __metadata("design:type", String)
], EvaluationAchievementPersonalSub.prototype, "degree", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(1001),
        field: 'evaluation_decision',
    }),
    __metadata("design:type", String)
], EvaluationAchievementPersonalSub.prototype, "evaluationDecision", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], EvaluationAchievementPersonalSub.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], EvaluationAchievementPersonalSub.prototype, "updatedTime", void 0);
EvaluationAchievementPersonalSub = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'evaluation_achievement_personal_sub_tbl' })
], EvaluationAchievementPersonalSub);
exports.EvaluationAchievementPersonalSub = EvaluationAchievementPersonalSub;
//# sourceMappingURL=EvaluationAchievementPersonalSub.js.map