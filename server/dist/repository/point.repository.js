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
exports.PointRepository = void 0;
const common_1 = require("@nestjs/common");
const EntityConstant_1 = require("../constant/EntityConstant");
const SettingPointBasicBehaviorPro_1 = require("../entity/SettingPointBasicBehaviorPro");
let PointRepository = class PointRepository {
    async getPointSkill(type, companyGroupCode) {
        const pointSkills = [];
        const results = await this.versionSettingEntity.findOne({
            attributes: ['id'],
            where: {
                type: 1,
                status: 4,
                companyGroupCode: companyGroupCode,
            },
            include: [
                {
                    model: SettingPointBasicBehaviorPro_1.SettingPointBasicBehaviorPro,
                    as: 'settingPointBasicBehaviorPros',
                    where: { type },
                    separate: true,
                    order: [['point', 'ASC']],
                },
            ],
        });
        if (results && results.settingPointBasicBehaviorPros.length > 0) {
            pointSkills.push(...results.settingPointBasicBehaviorPros.map((v) => ({
                label: v.point,
                value: v.point,
            })));
        }
        return pointSkills;
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_POINT_BASIC_BEHAVIOR_PRO),
    __metadata("design:type", Object)
], PointRepository.prototype, "settingPointEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.VERSION_SETTING),
    __metadata("design:type", Object)
], PointRepository.prototype, "versionSettingEntity", void 0);
PointRepository = __decorate([
    (0, common_1.Injectable)()
], PointRepository);
exports.PointRepository = PointRepository;
//# sourceMappingURL=point.repository.js.map