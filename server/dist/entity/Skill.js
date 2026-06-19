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
exports.Skill = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const VersionProSkill_1 = require("./VersionProSkill");
const SkillRole_1 = require("./SkillRole");
const SkillGroup_1 = require("./SkillGroup");
const SkillUser_1 = require("./SkillUser");
const CompanyGroup_1 = require("./CompanyGroup");
let Skill = class Skill extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], Skill.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Skill.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Skill.prototype, "active", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: 'company_group_code',
        type: sequelize_1.DataTypes.STRING(20),
    }),
    (0, sequelize_typescript_1.ForeignKey)(() => CompanyGroup_1.CompanyGroup),
    __metadata("design:type", String)
], Skill.prototype, "companyGroupCode", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], Skill.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], Skill.prototype, "updatedTime", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => CompanyGroup_1.CompanyGroup, 'company_group_code'),
    __metadata("design:type", CompanyGroup_1.CompanyGroup)
], Skill.prototype, "companyGroup", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SkillRole_1.SkillRole),
    __metadata("design:type", Array)
], Skill.prototype, "skillRoles", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => VersionProSkill_1.VersionProSkill, 'skill_id'),
    __metadata("design:type", Array)
], Skill.prototype, "versionProSkill", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SkillGroup_1.SkillGroup, 'skill_id'),
    __metadata("design:type", Array)
], Skill.prototype, "skills", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SkillUser_1.SkillUser, 'skill_id'),
    __metadata("design:type", Array)
], Skill.prototype, "skillUsers", void 0);
Skill = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'skill_tbl' })
], Skill);
exports.Skill = Skill;
//# sourceMappingURL=Skill.js.map