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
exports.HistoryPublicProSkill = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const Department_1 = require("./Department");
const VersionProSkill_1 = require("./VersionProSkill");
const Skill_1 = require("./Skill");
let HistoryPublicProSkill = class HistoryPublicProSkill extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], HistoryPublicProSkill.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(4),
        allowNull: false,
    }),
    __metadata("design:type", String)
], HistoryPublicProSkill.prototype, "year", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'period_index',
    }),
    __metadata("design:type", Number)
], HistoryPublicProSkill.prototype, "periodIndex", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => VersionProSkill_1.VersionProSkill),
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DataTypes.INTEGER, field: 'version_id' }),
    __metadata("design:type", Number)
], HistoryPublicProSkill.prototype, "versionId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Skill_1.Skill),
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DataTypes.SMALLINT, field: 'skill_id' }),
    __metadata("design:type", Number)
], HistoryPublicProSkill.prototype, "skillId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Department_1.Department),
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.SMALLINT,
        unique: false,
        field: 'department_id',
        references: {
            key: 'id',
            model: 'department_tbl',
        },
    }),
    __metadata("design:type", Number)
], HistoryPublicProSkill.prototype, "departmentId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
        field: 'company_group_code',
    }),
    __metadata("design:type", String)
], HistoryPublicProSkill.prototype, "companyGroupCode", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], HistoryPublicProSkill.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], HistoryPublicProSkill.prototype, "updatedTime", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Skill_1.Skill, {
        targetKey: 'id',
        foreignKey: 'skill_id',
    }),
    __metadata("design:type", Skill_1.Skill)
], HistoryPublicProSkill.prototype, "skill", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Department_1.Department, {
        targetKey: 'id',
        foreignKey: 'department_id',
    }),
    __metadata("design:type", Department_1.Department)
], HistoryPublicProSkill.prototype, "department", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => VersionProSkill_1.VersionProSkill, {
        targetKey: 'id',
        foreignKey: 'version_id',
    }),
    __metadata("design:type", VersionProSkill_1.VersionProSkill)
], HistoryPublicProSkill.prototype, "versionProSkill", void 0);
HistoryPublicProSkill = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'history_public_pro_skill_tbl' })
], HistoryPublicProSkill);
exports.HistoryPublicProSkill = HistoryPublicProSkill;
//# sourceMappingURL=HistoryPublicProSkill.js.map