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
exports.SkillUser = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const Skill_1 = require("./Skill");
const User_1 = require("./User");
const EvaluationPeriod_1 = require("./EvaluationPeriod");
const Evaluation_1 = require("./Evaluation");
let SkillUser = class SkillUser extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], SkillUser.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => EvaluationPeriod_1.EvaluationPeriod),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'period_id',
        references: {
            key: 'id',
            model: 'evaluation_period_tbl',
        },
    }),
    __metadata("design:type", Number)
], SkillUser.prototype, "periodId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'user_id',
        references: {
            key: 'id',
            model: 'user_tbl',
        },
    }),
    __metadata("design:type", Number)
], SkillUser.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Skill_1.Skill),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'skill_id',
        references: {
            key: 'id',
            model: 'skill_tbl',
        },
    }),
    __metadata("design:type", Number)
], SkillUser.prototype, "skillId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Evaluation_1.Evaluation),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.BIGINT,
        field: 'evaluation_id',
        references: {
            key: 'id',
            model: 'evaluation_tbl',
        },
    }),
    __metadata("design:type", Number)
], SkillUser.prototype, "evaluationId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.INTEGER,
        field: 'type',
    }),
    __metadata("design:type", Number)
], SkillUser.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => EvaluationPeriod_1.EvaluationPeriod, {
        targetKey: 'id',
        foreignKey: 'period_id',
    }),
    __metadata("design:type", EvaluationPeriod_1.EvaluationPeriod)
], SkillUser.prototype, "period", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Skill_1.Skill, {
        targetKey: 'id',
        foreignKey: 'skill_id',
    }),
    __metadata("design:type", Skill_1.Skill)
], SkillUser.prototype, "skill", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User, {
        targetKey: 'id',
        foreignKey: 'user_id',
    }),
    __metadata("design:type", User_1.User)
], SkillUser.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], SkillUser.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], SkillUser.prototype, "updatedTime", void 0);
SkillUser = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'skill_user_tbl' })
], SkillUser);
exports.SkillUser = SkillUser;
//# sourceMappingURL=SkillUser.js.map