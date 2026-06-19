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
exports.SettingLevelRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const EntityConstant_1 = require("../constant/EntityConstant");
const SettingLevel_1 = require("../entity/SettingLevel");
let SettingLevelRepository = class SettingLevelRepository {
    async getListSettingLevelByVersionId(versionSettingId) {
        return await this.settingLevelEntity.findAll({
            where: { versionId: versionSettingId },
            order: [['level', 'ASC']],
        });
    }
    async bulkCreate(records, transaction) {
        return await this.settingLevelEntity.bulkCreate(records, {
            transaction: transaction,
        });
    }
    async bulkDelete(versionId, transaction) {
        return await this.settingLevelEntity.destroy({
            where: { versionId: versionId },
            transaction: transaction,
        });
    }
    async getLevelSettingPublic(companyGroupCode) {
        const versionSettings = (await this.versionSettingEntity.findAll({
            attributes: ['type'],
            where: {
                type: { [sequelize_1.Op.in]: [1, 2, 3, 4] },
                status: 4,
                companyGroupCode: companyGroupCode,
            },
            include: [
                {
                    model: SettingLevel_1.SettingLevel,
                    as: 'settingLevel',
                    attributes: [
                        'level',
                        'skillPercent',
                        'behaviorPercent',
                        'achievementPercent',
                    ],
                },
            ],
        })).map((data) => data && data.get({ plain: true }));
        if (versionSettings.length > 0) {
            const levelSettings = [];
            versionSettings.map((versionSetting) => levelSettings.push(...versionSetting.settingLevel.map((v) => (Object.assign(Object.assign({}, v), { type: versionSetting.type })))));
            return levelSettings;
        }
        return [];
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_LEVEL),
    __metadata("design:type", Object)
], SettingLevelRepository.prototype, "settingLevelEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.VERSION_SETTING),
    __metadata("design:type", Object)
], SettingLevelRepository.prototype, "versionSettingEntity", void 0);
SettingLevelRepository = __decorate([
    (0, common_1.Injectable)()
], SettingLevelRepository);
exports.SettingLevelRepository = SettingLevelRepository;
//# sourceMappingURL=settingLevel.repository.js.map