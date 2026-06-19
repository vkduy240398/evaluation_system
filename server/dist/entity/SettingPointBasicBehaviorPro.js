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
exports.SettingPointBasicBehaviorPro = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const VersionSetting_1 = require("./VersionSetting");
let SettingPointBasicBehaviorPro = class SettingPointBasicBehaviorPro extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => VersionSetting_1.VersionSetting),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'version_id',
    }),
    __metadata("design:type", Number)
], SettingPointBasicBehaviorPro.prototype, "versionId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], SettingPointBasicBehaviorPro.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
    }),
    __metadata("design:type", Number)
], SettingPointBasicBehaviorPro.prototype, "point", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(501),
    }),
    __metadata("design:type", String)
], SettingPointBasicBehaviorPro.prototype, "note", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => VersionSetting_1.VersionSetting),
    __metadata("design:type", VersionSetting_1.VersionSetting)
], SettingPointBasicBehaviorPro.prototype, "versionSetting", void 0);
SettingPointBasicBehaviorPro = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'setting_point_basic_behavior_pro_tbl', timestamps: false })
], SettingPointBasicBehaviorPro);
exports.SettingPointBasicBehaviorPro = SettingPointBasicBehaviorPro;
//# sourceMappingURL=SettingPointBasicBehaviorPro.js.map