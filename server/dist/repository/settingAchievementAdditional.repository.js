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
exports.SettingAchievementAdditionalRepository = void 0;
const common_1 = require("@nestjs/common");
const EntityConstant_1 = require("../constant/EntityConstant");
let SettingAchievementAdditionalRepository = class SettingAchievementAdditionalRepository {
    async getListSettingAchievementAdditionalByVersionId(versionSettingId, typeAdditional) {
        return await this.settingAchievementAdditionalEntity.findAll({
            where: { versionId: versionSettingId, type: typeAdditional },
            order: [['point', 'DESC NULLS LAST']],
        });
    }
    async bulkCreate(records, transaction) {
        return await this.settingAchievementAdditionalEntity.bulkCreate(records, {
            transaction: transaction,
        });
    }
    async bulkDelete(versionId, transaction) {
        return await this.settingAchievementAdditionalEntity.destroy({
            where: { versionId: versionId },
            transaction: transaction,
        });
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_ACHIEVEMENT_ADDITIONAL),
    __metadata("design:type", Object)
], SettingAchievementAdditionalRepository.prototype, "settingAchievementAdditionalEntity", void 0);
SettingAchievementAdditionalRepository = __decorate([
    (0, common_1.Injectable)()
], SettingAchievementAdditionalRepository);
exports.SettingAchievementAdditionalRepository = SettingAchievementAdditionalRepository;
//# sourceMappingURL=settingAchievementAdditional.repository.js.map