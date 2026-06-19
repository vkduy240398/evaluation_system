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
exports.Feedback = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./User");
const CompanyGroup_1 = require("./CompanyGroup");
const FeedbackComment_1 = require("./FeedbackComment");
const FeedbackType_1 = require("../enum/FeedbackType");
const FeedbackPhase_1 = require("../enum/FeedbackPhase");
const FeedbackImpactScope_1 = require("../enum/FeedbackImpactScope");
const FeedbackStatus_1 = require("../enum/FeedbackStatus");
let Feedback = class Feedback extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], Feedback.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.SMALLINT),
        allowNull: true,
    }),
    __metadata("design:type", Array)
], Feedback.prototype, "role", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        comment: `0: other
              1: bug
              2: request
              3: question`,
    }),
    __metadata("design:type", Number)
], Feedback.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        comment: `0: other
              1: goal
              2: evaluation`,
    }),
    __metadata("design:type", Number)
], Feedback.prototype, "phase", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true,
    }),
    __metadata("design:type", Array)
], Feedback.prototype, "feature", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DataTypes.STRING(1001), allowNull: false }),
    __metadata("design:type", String)
], Feedback.prototype, "summary", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DataTypes.TEXT, allowNull: true }),
    __metadata("design:type", String)
], Feedback.prototype, "detail", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: true,
        comment: `1: low
              2: normal
              3: high`,
        field: 'impact_scope',
    }),
    __metadata("design:type", Number)
], Feedback.prototype, "impactScope", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DataTypes.TEXT, field: 'attach_files', allowNull: true }),
    __metadata("design:type", String)
], Feedback.prototype, "attachFiles", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        comment: `1: Submitted
              2: Confirming content
              3: No action needed
              4: Action required
              5: In Progress
              6: Resolved
              7: Closed
              8: Canceled`,
    }),
    __metadata("design:type", Number)
], Feedback.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], Feedback.prototype, "group", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'user_id',
    }),
    __metadata("design:type", Number)
], Feedback.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], Feedback.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], Feedback.prototype, "updatedTime", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(20),
        field: 'company_group_code',
    }),
    __metadata("design:type", String)
], Feedback.prototype, "companyGroupCode", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User, 'user_id'),
    __metadata("design:type", User_1.User)
], Feedback.prototype, "userFK", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => CompanyGroup_1.CompanyGroup, 'company_group_code'),
    __metadata("design:type", CompanyGroup_1.CompanyGroup)
], Feedback.prototype, "companyGroupFK", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => FeedbackComment_1.FeedbackCommnet),
    __metadata("design:type", Array)
], Feedback.prototype, "comments", void 0);
Feedback = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'feedback_tbl' })
], Feedback);
exports.Feedback = Feedback;
//# sourceMappingURL=Feedback.js.map