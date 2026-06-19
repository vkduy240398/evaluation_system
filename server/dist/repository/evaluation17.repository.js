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
exports.Evaluation17Repository = void 0;
const common_1 = require("@nestjs/common");
const EntityConstant_1 = require("../constant/EntityConstant");
const SettingPointBasicBehaviorPro_1 = require("../entity/SettingPointBasicBehaviorPro");
const VersionSetting_1 = require("../entity/VersionSetting");
let Evaluation17Repository = class Evaluation17Repository {
    async getBasicBehaviorProPointPublic(companyGroupCode, isNoSkill) {
        return await this.versionSettingEntity
            .findOne({
            where: {
                type: isNoSkill ? 3 : 1,
                status: 4,
                companyGroupCode: companyGroupCode,
            },
            include: {
                model: SettingPointBasicBehaviorPro_1.SettingPointBasicBehaviorPro,
                as: 'settingPointBasicBehaviorPros',
            },
        })
            .then((data) => {
            if (data && data.settingPointBasicBehaviorPros.length > 0) {
                return data.settingPointBasicBehaviorPros
                    .map((v) => v && v.get({ plain: true }))
                    .sort((a, b) => b.point - a.point);
            }
            return [];
        });
    }
    async getMaxPointProBasicSkillPublic(companyGroupCode) {
        const difficultyProMax = await this.settingProFormulaEntity.findOne({
            attributes: ['point'],
            plain: true,
            include: {
                model: VersionSetting_1.VersionSetting,
                attributes: [],
                as: 'versionSetting',
                where: { type: 1, status: 4, companyGroupCode: companyGroupCode },
            },
            order: [['point', 'DESC']],
        });
        const pointProOptionMax = await this.settingPointEntity.findOne({
            attributes: ['point'],
            where: { type: 3 },
            plain: true,
            include: {
                model: VersionSetting_1.VersionSetting,
                attributes: [],
                as: 'versionSetting',
                where: { type: 1, status: 4, companyGroupCode: companyGroupCode },
            },
            order: [['point', 'DESC']],
        });
        const pointBasicOptionMax = await this.settingPointEntity.findOne({
            attributes: ['point'],
            where: { type: 1 },
            plain: true,
            include: {
                model: VersionSetting_1.VersionSetting,
                attributes: ['basicMaxDifficulty'],
                as: 'versionSetting',
                where: { type: 1, status: 4, companyGroupCode: companyGroupCode },
            },
            order: [['point', 'DESC']],
        });
        const maxPointProSkill = ((difficultyProMax === null || difficultyProMax === void 0 ? void 0 : difficultyProMax.point) || 0) * ((pointProOptionMax === null || pointProOptionMax === void 0 ? void 0 : pointProOptionMax.point) || 0);
        const maxPointBasicSkill = ((pointBasicOptionMax === null || pointBasicOptionMax === void 0 ? void 0 : pointBasicOptionMax.versionSetting.basicMaxDifficulty) || 0) *
            ((pointBasicOptionMax === null || pointBasicOptionMax === void 0 ? void 0 : pointBasicOptionMax.point) || 0);
        return { maxPointProSkill, maxPointBasicSkill };
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.VERSION_SETTING),
    __metadata("design:type", Object)
], Evaluation17Repository.prototype, "versionSettingEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_PRO_FORMULA),
    __metadata("design:type", Object)
], Evaluation17Repository.prototype, "settingProFormulaEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_POINT_BASIC_BEHAVIOR_PRO),
    __metadata("design:type", Object)
], Evaluation17Repository.prototype, "settingPointEntity", void 0);
Evaluation17Repository = __decorate([
    (0, common_1.Injectable)()
], Evaluation17Repository);
exports.Evaluation17Repository = Evaluation17Repository;
//# sourceMappingURL=evaluation17.repository.js.map