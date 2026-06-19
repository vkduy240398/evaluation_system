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
exports.SettingAchievementPersonalRepository = void 0;
const common_1 = require("@nestjs/common");
const EntityConstant_1 = require("../constant/EntityConstant");
let SettingAchievementPersonalRepository = class SettingAchievementPersonalRepository {
    async getListSettingAchievementPersonalByVersionId(versionSettingId, typeEvaluation) {
        return await this.settingAchievementPersonalEntity.findAll({
            where: { versionId: versionSettingId, typeEvaluation: typeEvaluation },
        });
    }
    async bulkCreate(records, transaction) {
        return await this.settingAchievementPersonalEntity.bulkCreate(records, {
            transaction: transaction,
        });
    }
    async bulkDelete(versionId, transaction) {
        return await this.settingAchievementPersonalEntity.destroy({
            where: { versionId: versionId },
            transaction: transaction,
        });
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_ACHIEVEMENT_PERSONAL),
    __metadata("design:type", Object)
], SettingAchievementPersonalRepository.prototype, "settingAchievementPersonalEntity", void 0);
SettingAchievementPersonalRepository = __decorate([
    (0, common_1.Injectable)()
], SettingAchievementPersonalRepository);
exports.SettingAchievementPersonalRepository = SettingAchievementPersonalRepository;
//# sourceMappingURL=settingAchievementPersonal.repository.js.map