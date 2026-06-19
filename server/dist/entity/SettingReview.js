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
exports.SettingReview = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./User");
const EvaluationPeriod_1 = require("./EvaluationPeriod");
let SettingReview = class SettingReview extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], SettingReview.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'viewer_id',
    }),
    __metadata("design:type", Number)
], SettingReview.prototype, "viewerId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'user_id',
    }),
    __metadata("design:type", Number)
], SettingReview.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => EvaluationPeriod_1.EvaluationPeriod),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'evaluation_period_id',
    }),
    __metadata("design:type", Number)
], SettingReview.prototype, "evaluationPeriodId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        comment: `1: 目標
    2: 目標&目標承認履歴
    3: 評価結果（点数のみ）
    4: 評価結果（自己評価）
    5: 評価結果&承認履歴（非公開コメント以外）
    6: 評価結果詳細（非公開コメントを含めて）`,
    }),
    __metadata("design:type", Number)
], SettingReview.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.DECIMAL(2, 1),
        allowNull: false,
        field: 'order',
    }),
    __metadata("design:type", Number)
], SettingReview.prototype, "order", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'creation_type',
    }),
    __metadata("design:type", Number)
], SettingReview.prototype, "creationType", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], SettingReview.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], SettingReview.prototype, "updatedTime", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(255),
        field: 'company_group_code',
    }),
    __metadata("design:type", String)
], SettingReview.prototype, "companyGroupCode", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User, 'viewer_id'),
    __metadata("design:type", User_1.User)
], SettingReview.prototype, "viewerIdFk", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User, 'user_id'),
    __metadata("design:type", User_1.User)
], SettingReview.prototype, "userIdFk", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => EvaluationPeriod_1.EvaluationPeriod, 'evaluation_period_id'),
    __metadata("design:type", EvaluationPeriod_1.EvaluationPeriod)
], SettingReview.prototype, "evaluationPeriodIdFk", void 0);
SettingReview = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'setting_review_tbl' })
], SettingReview);
exports.SettingReview = SettingReview;
//# sourceMappingURL=SettingReview.js.map