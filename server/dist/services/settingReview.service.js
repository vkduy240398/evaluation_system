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
exports.SettingReviewService = void 0;
const common_1 = require("@nestjs/common");
const settingReview_repository_1 = require("../repository/settingReview.repository");
let SettingReviewService = class SettingReviewService {
    async searchListUserToSettingEvaluationHistoryReference(query) {
        return await this.settingReviewRepository.searchListUserToSettingEvaluationHistoryReference(query);
    }
    async getAllUser(companyGroupCode) {
        return await this.settingReviewRepository.getAllUser(companyGroupCode);
    }
    async addEditUser(data, companyGroupCode) {
        return await this.settingReviewRepository.addEditUser(data, companyGroupCode);
    }
    async getListDepartmentRepository(companyGroupCode) {
        return await this.settingReviewRepository.getListDepartment(companyGroupCode);
    }
    async getListSettingReviewHistoryReference(condition, companyGroupCode, timeZone) {
        return await this.settingReviewRepository.getListSettingReviewHistory(condition, companyGroupCode, timeZone);
    }
    async deleteHistoryReference(arrayIds, condition, companyGroupCode, timeZone) {
        await this.settingReviewRepository.deleteSettingHistoryReference(arrayIds);
        return await this.settingReviewRepository.getListSettingReviewHistory(condition, companyGroupCode, timeZone);
    }
};
__decorate([
    (0, common_1.Inject)(settingReview_repository_1.SettingReviewRepository),
    __metadata("design:type", settingReview_repository_1.SettingReviewRepository)
], SettingReviewService.prototype, "settingReviewRepository", void 0);
SettingReviewService = __decorate([
    (0, common_1.Injectable)()
], SettingReviewService);
exports.SettingReviewService = SettingReviewService;
//# sourceMappingURL=settingReview.service.js.map