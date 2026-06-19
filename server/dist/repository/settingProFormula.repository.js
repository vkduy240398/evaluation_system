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
exports.SettingProFormulaRepository = void 0;
const common_1 = require("@nestjs/common");
const EntityConstant_1 = require("../constant/EntityConstant");
const SettingProFormulaSub_1 = require("../entity/SettingProFormulaSub");
let SettingProFormulaRepository = class SettingProFormulaRepository {
    async getListSettingProFormulaByVersionId(versionSettingId) {
        return await this.settingProFormulaEntity.findAll({
            where: { versionId: versionSettingId },
            include: [
                {
                    model: SettingProFormulaSub_1.SettingProFormulaSub,
                    as: 'settingProFormulaSub',
                    order: [['id', 'ASC']],
                    separate: true,
                    required: false,
                },
            ],
            order: [['point', 'DESC NULLS LAST']],
        });
    }
    async bulkCreate(records, transaction) {
        return await this.settingProFormulaEntity.bulkCreate(records, {
            include: [{ model: SettingProFormulaSub_1.SettingProFormulaSub, as: 'settingProFormulaSub' }],
            transaction: transaction,
        });
    }
    async bulkDelete(versionId, transaction) {
        return await this.settingProFormulaEntity.destroy({
            where: { versionId: versionId },
            transaction: transaction,
        });
    }
    async bulkCreateSub(records, transaction) {
        return await this.settingProFormulaSubEntity.bulkCreate(records, {
            transaction: transaction,
        });
    }
    async bulkDeleteSub(iDs, transaction) {
        return await this.settingProFormulaSubEntity.destroy({
            where: {
                formulaId: iDs,
            },
            transaction: transaction,
        });
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_PRO_FORMULA),
    __metadata("design:type", Object)
], SettingProFormulaRepository.prototype, "settingProFormulaEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_PRO_FORMULA_SUB),
    __metadata("design:type", Object)
], SettingProFormulaRepository.prototype, "settingProFormulaSubEntity", void 0);
SettingProFormulaRepository = __decorate([
    (0, common_1.Injectable)()
], SettingProFormulaRepository);
exports.SettingProFormulaRepository = SettingProFormulaRepository;
//# sourceMappingURL=settingProFormula.repository.js.map