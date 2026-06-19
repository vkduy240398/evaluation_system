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
exports.VersionSetting = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const SettingAchievementAdditional_1 = require("./SettingAchievementAdditional");
const SettingAchievementPersonal_1 = require("./SettingAchievementPersonal");
const SettingFormula810_1 = require("./SettingFormula810");
const SettingLevel_1 = require("./SettingLevel");
const SettingPointBasicBehaviorPro_1 = require("./SettingPointBasicBehaviorPro");
const SettingProFormula_1 = require("./SettingProFormula");
const User_1 = require("./User");
const CompanyGroup_1 = require("./CompanyGroup");
let VersionSetting = class VersionSetting extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], VersionSetting.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], VersionSetting.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], VersionSetting.prototype, "version", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'sub_version',
    }),
    __metadata("design:type", Number)
], VersionSetting.prototype, "subVersion", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], VersionSetting.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'creation_user',
    }),
    __metadata("design:type", Number)
], VersionSetting.prototype, "creationUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(501),
    }),
    __metadata("design:type", String)
], VersionSetting.prototype, "reason", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'basic_max_difficulty',
    }),
    __metadata("design:type", Number)
], VersionSetting.prototype, "basicMaxDifficulty", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'behavior_max_weight',
    }),
    __metadata("design:type", Number)
], VersionSetting.prototype, "behaviorMaxWeight", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(8, 2),
        field: 'max_point_result',
    }),
    __metadata("design:type", Number)
], VersionSetting.prototype, "maxPoint", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(8, 2),
        field: 'min_point_result',
    }),
    __metadata("design:type", Number)
], VersionSetting.prototype, "minPoint", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(8, 2),
        field: 'max_point_dep_result',
    }),
    __metadata("design:type", Number)
], VersionSetting.prototype, "maxPointDep", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(8, 2),
        field: 'min_point_dep_result',
    }),
    __metadata("design:type", Number)
], VersionSetting.prototype, "minPointDep", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(16),
        field: 'public_date',
    }),
    __metadata("design:type", String)
], VersionSetting.prototype, "publicDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(16),
        field: 'last_updated_time',
    }),
    __metadata("design:type", String)
], VersionSetting.prototype, "lastUpdatedTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], VersionSetting.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], VersionSetting.prototype, "updatedTime", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(20),
        field: 'company_group_code',
    }),
    __metadata("design:type", String)
], VersionSetting.prototype, "companyGroupCode", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User, 'creation_user'),
    __metadata("design:type", User_1.User)
], VersionSetting.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => CompanyGroup_1.CompanyGroup, 'company_group_code'),
    __metadata("design:type", CompanyGroup_1.CompanyGroup)
], VersionSetting.prototype, "companyGroup", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SettingPointBasicBehaviorPro_1.SettingPointBasicBehaviorPro),
    __metadata("design:type", Array)
], VersionSetting.prototype, "settingPointBasicBehaviorPros", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SettingPointBasicBehaviorPro_1.SettingPointBasicBehaviorPro),
    __metadata("design:type", Array)
], VersionSetting.prototype, "settingPointBasic", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SettingPointBasicBehaviorPro_1.SettingPointBasicBehaviorPro),
    __metadata("design:type", Array)
], VersionSetting.prototype, "settingPointBehavior", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SettingPointBasicBehaviorPro_1.SettingPointBasicBehaviorPro),
    __metadata("design:type", Array)
], VersionSetting.prototype, "settingPointPro", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SettingProFormula_1.SettingProFormula),
    __metadata("design:type", Array)
], VersionSetting.prototype, "settingProFormula", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SettingAchievementPersonal_1.SettingAchievementPersonal),
    __metadata("design:type", Array)
], VersionSetting.prototype, "settingAchievementPersonalType1", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SettingAchievementPersonal_1.SettingAchievementPersonal),
    __metadata("design:type", Array)
], VersionSetting.prototype, "settingAchievementPersonalType2", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SettingAchievementAdditional_1.SettingAchievementAdditional),
    __metadata("design:type", Array)
], VersionSetting.prototype, "settingAchievementAdditional", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SettingAchievementAdditional_1.SettingAchievementAdditional),
    __metadata("design:type", Array)
], VersionSetting.prototype, "settingAchievementAdditional2", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SettingAchievementPersonal_1.SettingAchievementPersonal),
    __metadata("design:type", Array)
], VersionSetting.prototype, "settingAchievementPersonalType3", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SettingAchievementPersonal_1.SettingAchievementPersonal),
    __metadata("design:type", Array)
], VersionSetting.prototype, "settingAchievementPersonalType4", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SettingLevel_1.SettingLevel),
    __metadata("design:type", Array)
], VersionSetting.prototype, "settingLevel", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SettingFormula810_1.SettingFormula810),
    __metadata("design:type", Array)
], VersionSetting.prototype, "settingFormula810", void 0);
VersionSetting = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'version_setting_tbl' })
], VersionSetting);
exports.VersionSetting = VersionSetting;
//# sourceMappingURL=VersionSetting.js.map