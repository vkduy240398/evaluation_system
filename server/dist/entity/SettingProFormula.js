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
exports.SettingProFormula = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const SettingProFormulaSub_1 = require("./SettingProFormulaSub");
const VersionSetting_1 = require("./VersionSetting");
let SettingProFormula = class SettingProFormula extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], SettingProFormula.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => VersionSetting_1.VersionSetting),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'version_id',
    }),
    __metadata("design:type", Number)
], SettingProFormula.prototype, "versionId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
    }),
    __metadata("design:type", Number)
], SettingProFormula.prototype, "point", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(501),
    }),
    __metadata("design:type", String)
], SettingProFormula.prototype, "note", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SettingProFormulaSub_1.SettingProFormulaSub, {
        sourceKey: 'id',
        foreignKey: 'formula_id',
        onDelete: 'cascade',
        hooks: true,
    }),
    __metadata("design:type", Array)
], SettingProFormula.prototype, "settingProFormulaSub", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => VersionSetting_1.VersionSetting, 'version_id'),
    __metadata("design:type", VersionSetting_1.VersionSetting)
], SettingProFormula.prototype, "versionSetting", void 0);
SettingProFormula = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'setting_pro_formula_tbl', timestamps: false })
], SettingProFormula);
exports.SettingProFormula = SettingProFormula;
//# sourceMappingURL=SettingProFormula.js.map