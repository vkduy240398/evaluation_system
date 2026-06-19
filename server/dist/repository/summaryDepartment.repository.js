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
exports.SummaryDepartmentRepository = void 0;
const common_1 = require("@nestjs/common");
const EntityConstant_1 = require("../constant/EntityConstant");
let SummaryDepartmentRepository = class SummaryDepartmentRepository {
    async createOrUpdate({ evaluationId, achievementPersonalTotalPointUser, achievementPersonalTotalPointEvaluator05, achievementPersonalTotalPointEvaluator1, achievementPersonalTotalPointEvaluator2, achievementAdditionalTotalPointUser, achievementAdditionalTotalPointEvaluator05, achievementAdditionalTotalPointEvaluator1, achievementAdditionalTotalPointEvaluator2, summaryCharPointUser, summaryCharPointEvaluator05, summaryCharPointEvaluator1, summaryCharPointEvaluator2, summaryPointUser, summaryPointEvaluator05, summaryPointEvaluator1, summaryPointEvaluator2, }) {
        return await this.summaryDepartmentEnity
            .findOne({
            where: {
                evaluationId,
            },
        })
            .then((res) => {
            if (res) {
                return res.update({
                    achievementPersonalTotalPointUser,
                    achievementPersonalTotalPointEvaluator05,
                    achievementPersonalTotalPointEvaluator1,
                    achievementPersonalTotalPointEvaluator2,
                    achievementAdditionalTotalPointUser,
                    achievementAdditionalTotalPointEvaluator05,
                    achievementAdditionalTotalPointEvaluator1,
                    achievementAdditionalTotalPointEvaluator2,
                    summaryCharPointUser,
                    summaryCharPointEvaluator05,
                    summaryCharPointEvaluator1,
                    summaryCharPointEvaluator2,
                    summaryPointUser,
                    summaryPointEvaluator05,
                    summaryPointEvaluator1,
                    summaryPointEvaluator2,
                });
            }
            return this.summaryDepartmentEnity.create({
                evaluationId,
                achievementPersonalTotalPointUser,
                achievementPersonalTotalPointEvaluator05,
                achievementPersonalTotalPointEvaluator1,
                achievementPersonalTotalPointEvaluator2,
                achievementAdditionalTotalPointUser,
                achievementAdditionalTotalPointEvaluator05,
                achievementAdditionalTotalPointEvaluator1,
                achievementAdditionalTotalPointEvaluator2,
                summaryCharPointUser,
                summaryCharPointEvaluator05,
                summaryCharPointEvaluator1,
                summaryCharPointEvaluator2,
                summaryPointUser,
                summaryPointEvaluator05,
                summaryPointEvaluator1,
                summaryPointEvaluator2,
            });
        });
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SUMMARY_DEPARTMENT),
    __metadata("design:type", Object)
], SummaryDepartmentRepository.prototype, "summaryDepartmentEnity", void 0);
SummaryDepartmentRepository = __decorate([
    (0, common_1.Injectable)()
], SummaryDepartmentRepository);
exports.SummaryDepartmentRepository = SummaryDepartmentRepository;
//# sourceMappingURL=summaryDepartment.repository.js.map