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
exports.SettingProFormulaSub = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const SettingProFormula_1 = require("./SettingProFormula");
let SettingProFormulaSub = class SettingProFormulaSub extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => SettingProFormula_1.SettingProFormula),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        field: 'formula_id',
    }),
    __metadata("design:type", Number)
], SettingProFormulaSub.prototype, "formulaId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'total_item',
    }),
    __metadata("design:type", Number)
], SettingProFormulaSub.prototype, "totalItem", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.DECIMAL(12, 5),
    }),
    __metadata("design:type", Number)
], SettingProFormulaSub.prototype, "coefficient", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => SettingProFormula_1.SettingProFormula, 'formula_id'),
    __metadata("design:type", SettingProFormula_1.SettingProFormula)
], SettingProFormulaSub.prototype, "settingProFormula", void 0);
SettingProFormulaSub = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'setting_pro_formula_sub_tbl', timestamps: false })
], SettingProFormulaSub);
exports.SettingProFormulaSub = SettingProFormulaSub;
//# sourceMappingURL=SettingProFormulaSub.js.map