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
exports.FeedbackCommnet = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./User");
const Feedback_1 = require("./Feedback");
let FeedbackCommnet = class FeedbackCommnet extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], FeedbackCommnet.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(501),
        allowNull: false,
    }),
    __metadata("design:type", String)
], FeedbackCommnet.prototype, "content", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Feedback_1.Feedback),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: true,
        field: 'feedback_id',
    }),
    __metadata("design:type", String)
], FeedbackCommnet.prototype, "feedbackId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'user_id',
    }),
    __metadata("design:type", Number)
], FeedbackCommnet.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DataTypes.SMALLINT, allowNull: false }),
    __metadata("design:type", Number)
], FeedbackCommnet.prototype, "active", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], FeedbackCommnet.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], FeedbackCommnet.prototype, "updatedTime", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User, 'user_id'),
    __metadata("design:type", User_1.User)
], FeedbackCommnet.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Feedback_1.Feedback, 'feedback_id'),
    __metadata("design:type", Feedback_1.Feedback)
], FeedbackCommnet.prototype, "feedback", void 0);
FeedbackCommnet = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'feedback_comment_tbl' })
], FeedbackCommnet);
exports.FeedbackCommnet = FeedbackCommnet;
//# sourceMappingURL=FeedbackComment.js.map