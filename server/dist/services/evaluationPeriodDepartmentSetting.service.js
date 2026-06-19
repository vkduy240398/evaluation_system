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
exports.EvaluationPeriodDepartmentSettingService = void 0;
const common_1 = require("@nestjs/common");
const evaluationPeriodDepartmentSetting_repository_1 = require("../repository/evaluationPeriodDepartmentSetting.repository");
let EvaluationPeriodDepartmentSettingService = class EvaluationPeriodDepartmentSettingService {
    constructor(repo) {
        this.repo = repo;
    }
    async list(evaluationPeriodId, companyGroupCode) {
        return this.repo.findByPeriodIdWithProgress(evaluationPeriodId, companyGroupCode);
    }
    async save(dto, companyGroupCode) {
        var _a;
        for (const item of dto.departments) {
            if (item.isDivisionLevel && ((_a = item.childDepartmentIds) === null || _a === void 0 ? void 0 : _a.length)) {
                await this.repo.deleteByPeriodAndDepartments(dto.evaluationPeriodId, item.childDepartmentIds, companyGroupCode);
            }
            await this.repo.upsertOne(dto.evaluationPeriodId, companyGroupCode, item);
        }
        await this.repo.applyAllDeptDatesToEvaluations(dto.evaluationPeriodId, companyGroupCode);
        return {
            saved: dto.departments.length,
            evaluationPeriodId: dto.evaluationPeriodId,
        };
    }
    async delete(dto, companyGroupCode) {
        const deleted = await this.repo.deleteById(dto.id, companyGroupCode);
        if (deleted === 0) {
            throw new common_1.NotFoundException('Record not found or already deleted');
        }
        return { deleted };
    }
};
EvaluationPeriodDepartmentSettingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [evaluationPeriodDepartmentSetting_repository_1.EvaluationPeriodDepartmentSettingRepository])
], EvaluationPeriodDepartmentSettingService);
exports.EvaluationPeriodDepartmentSettingService = EvaluationPeriodDepartmentSettingService;
//# sourceMappingURL=evaluationPeriodDepartmentSetting.service.js.map