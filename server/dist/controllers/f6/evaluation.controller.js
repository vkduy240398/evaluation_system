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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagementEvaluationRoleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const Roles_1 = require("../../enum/Roles");
const Tag_1 = require("../../enum/Tag");
const Authorization_1 = require("../../handler/annotation/Authorization");
const role_guard_1 = require("../../handler/guard/role.guard");
const VersionNotificationDto_1 = require("../../model/generic/VersionNotificationDto");
const VersionSettingDto_1 = require("../../model/generic/VersionSettingDto");
const CalculatorDetail810Dto_1 = require("../../model/request/CalculatorDetail810Dto");
const AddProSkillDto_1 = require("../../model/request/F6/AddProSkillDto");
const BasicBehaviorPublicVersionBody_1 = require("../../model/request/F6/BasicBehaviorPublicVersionBody");
const CancelSetting810Ex_1 = require("../../model/request/F6/CancelSetting810Ex");
const CancelVersionEvaluationItemBody_1 = require("../../model/request/F6/CancelVersionEvaluationItemBody");
const CancelVersionNotificationDto_1 = require("../../model/request/F6/CancelVersionNotificationDto");
const EditProskillDto_1 = require("../../model/request/F6/EditProskillDto");
const ListEvaluationCalculationHistoryDto_1 = require("../../model/request/F6/ListEvaluationCalculationHistoryDto");
const ListVersionNotificationParam_1 = require("../../model/request/F6/ListVersionNotificationParam");
const PublicVersionSettingDto_1 = require("../../model/request/F6/PublicVersionSettingDto");
const SaveDraftSetting810Ex_1 = require("../../model/request/F6/SaveDraftSetting810Ex");
const ListEvaluationCriteriaHistoryRequestDto_1 = require("../../model/request/ListEvaluationCriteriaHistoryRequestDto");
const ListEvaluationItemHistoryRequestDto_1 = require("../../model/request/ListEvaluationItemHistoryRequestDto");
const ManagementEvaluationProDto_1 = require("../../model/request/ManagementEvaluationProDto");
const PublicVersionSettingDto_2 = require("../../model/request/PublicVersionSettingDto");
const BasicBehaviorPublicVersionDto_1 = require("../../model/response/F6/BasicBehaviorPublicVersionDto");
const ConflictCancelVersionEvaluationItemDto_1 = require("../../model/response/F6/ConflictCancelVersionEvaluationItemDto");
const ConflictPublicVersionDto_1 = require("../../model/response/F6/ConflictPublicVersionDto");
const DetailCriteriaDto_1 = require("../../model/response/F6/DetailCriteriaDto");
const DetailEvaluationItemDto_1 = require("../../model/response/F6/DetailEvaluationItemDto");
const FindListEvaluationCriteriaHistoryDto_1 = require("../../model/response/F6/FindListEvaluationCriteriaHistoryDto");
const FindListEvaluationItemHistoryDto_1 = require("../../model/response/F6/FindListEvaluationItemHistoryDto");
const GetHistoryApproveContentDto_1 = require("../../model/response/F6/GetHistoryApproveContentDto");
const GetListCommonSkillDto_1 = require("../../model/response/F6/GetListCommonSkillDto");
const GetNextVersion810Dto_1 = require("../../model/response/F6/GetNextVersion810Dto");
const GetSettingEvaluationSkillDto_1 = require("../../model/response/F6/GetSettingEvaluationSkillDto");
const GetUserActiveDto_1 = require("../../model/response/F6/GetUserActiveDto");
const ListEvaluationCalculationResponseDto_1 = require("../../model/response/F6/ListEvaluationCalculationResponseDto");
const ListVersionNotificationResponse_1 = require("../../model/response/F6/ListVersionNotificationResponse");
const PublicVersionDto_1 = require("../../model/response/F6/PublicVersionDto");
const SaveDraftDto_1 = require("../../model/response/F6/SaveDraftDto");
const SaveDraftEvaluationItemDto_1 = require("../../model/response/F6/SaveDraftEvaluationItemDto");
const SaveDraftSetting810ResEx_1 = require("../../model/response/F6/SaveDraftSetting810ResEx");
const SavePrivateVersionDto_1 = require("../../model/response/F6/SavePrivateVersionDto");
const SavePublicVersionDto_1 = require("../../model/response/F6/SavePublicVersionDto");
const SavePublicVersionEvaluationItemDto_1 = require("../../model/response/F6/SavePublicVersionEvaluationItemDto");
const VersionSettingConflictUpdateDto_1 = require("../../model/response/F6/VersionSettingConflictUpdateDto");
const VersionProSkillDto_1 = require("../../model/response/VersionProSkillDto");
const adminEvaluation_service_1 = require("../../services/adminEvaluation.service");
const basicBehavior_service_1 = require("../../services/basicBehavior.service");
const evaluation_service_1 = require("../../services/evaluation.service");
const guideEvaluation_service_1 = require("../../services/guideEvaluation.service");
const managementEvaluation_service_1 = require("../../services/managementEvaluation.service");
const proSkill_service_1 = require("../../services/proSkill.service");
const proSkillSetting_service_1 = require("../../services/proSkillSetting.service");
const versionNotification_service_1 = require("../../services/versionNotification.service");
const versionSetting_service_1 = require("../../services/versionSetting.service");
const versionSettingNs_service_1 = require("../../services/versionSettingNs.service");
const settingReview_service_1 = require("../../services/settingReview.service");
const settingDefaultPeriod_service_1 = require("../../services/settingDefaultPeriod.service");
let ManagementEvaluationRoleController = class ManagementEvaluationRoleController {
    async getSettingEvaluationSkills(query, req) {
        return await this.managementEvaluationService.getSettingEvaluationSkills(query, req.user.companyGroupCode);
    }
    async deleteAdminEvalutionSkill(skillId) {
        return await this.managementEvaluationService.deleteAdminEvalutionSkill(skillId);
    }
    async getUserActive(req) {
        return await this.managementEvaluationService.getUserActive(req.user.companyGroupCode);
    }
    async getListCommonSkill(query, req) {
        let type = [];
        let level;
        if (query.basicBehavior === '1' &&
            query.typeLevel === '1') {
            type = [1];
        }
        else if (query.basicBehavior === '1' &&
            query.typeLevel === '2') {
            type = [4];
        }
        else if (query.basicBehavior === '2' &&
            query.flagSkill === '1') {
            type = [2, 5];
        }
        else if (query.basicBehavior === '2' &&
            query.flagSkill === '0') {
            type = [3, 6];
        }
        if (query.basicBehavior === '2' &&
            query.level === 'すべて') {
            level = '1,2,3,4,5,6,7,8,9,10'.split(',');
        }
        else if (query.basicBehavior === '2' &&
            query.level !== 'すべて') {
            level = query.level.split(',');
        }
        const companyGroupCode = req.user.companyGroupCode;
        const params = {
            offset: query.offset,
            limit: query.limit,
            sortBy: query.sortBy,
            sortType: query.sortType,
            basicBehavior: query.basicBehavior,
            status: query.status,
            level: query.basicBehavior === '2' ? level : null,
            flagSkill: query.flagSkill,
            type: type,
            companyGroupCode: companyGroupCode,
        };
        const datas = await this.basicBehaviorServices.searchListBasicBehavior(params);
        return datas;
    }
    async detailEvaluationItem(id, query, req) {
        return await this.basicBehaviorServices.getInformationCriteria(id, query.isEdit, req.user.companyGroupCode);
    }
    async saveDraftEvaluationItem(req) {
        const results = await this.basicBehaviorServices.saveDraftData(req.body, req.user.id, req.user.companyGroupCode, req.user.timeZone);
        return {
            fullName: req.user.fullName,
            versionId: results.id,
            timer: results.updatedTime,
            subVersion: results.subVersion,
            version: results.version,
            status: results.status,
            lastUpdatedTime: results.lastUpdatedTime,
            edited: results.edited || false,
            code: results.code,
        };
    }
    async savePublicVersionEvaluationItem(id, req) {
        return await this.basicBehaviorServices.savePublicVersion({
            versionId: id,
            version: req.body.version,
            subVersion: req.body.subVersion,
            timer: req.body.timer,
            userId: req.user.id,
            type: req.body.type,
            data: req.body.children,
            status: req.body.status,
            reason: req.body.reason,
            hostname: req.body.hostname,
            level: req.body.level,
            companyGroupCode: req.user.companyGroupCode,
            timeZone: req.user.timeZone,
        });
    }
    async cancelVersionEvaluationItem(versionId, req, body) {
        return await this.basicBehaviorServices.cancelVersionPro(versionId, req.user.id, body, req.user.companyGroupCode);
    }
    async getListEvaluationCalculationHistory(query, req) {
        return await this.versionSettingService.getListEvaluationCalculationHistory(query, req);
    }
    async getDetailEvaluationCalculation(id, req) {
        return await this.versionSettingService.getDetailEvaluationCalculation17(id, req);
    }
    async getDetailEvaluationCalculationNs(id, req) {
        return await this.versionSettingNsService.getDetailEvaluationCalculation17ns(id, req);
    }
    async getDetailEvaluationCalculationCommon(id, req) {
        return await this.versionSettingService.getDetailEvaluationCalculationCommon(id, req);
    }
    async saveDraftVersionSettingCommon(req, type, dto) {
        return await this.versionSettingService.saveDraftVersionSettingCommon(dto, type, req);
    }
    findListEvaluationCriteriaHistory(query, req) {
        const params = {
            status: query.status,
            type: query.type,
            offset: query.offset,
            limit: query.limit,
            sortBy: query.sortBy,
            sortType: query.sortType,
            flagSkill: query.flagSkill,
        };
        return this.guideEvaluationService.findListEvaluationCriteriaHistory(params, req.user.companyGroupCode);
    }
    async getHistoryApproveContent(versionId, userId) {
        const data = await this.proSkillSettingServices.getHistoryApproveContent(versionId, userId, true);
        return data;
    }
    findListEvaluationItemHistory(query, req) {
        const skill = query.skill !== 'すべて' ? query === null || query === void 0 ? void 0 : query.skill.split(':') : query.skill;
        const params = {
            status: query.status,
            skill: skill,
            offset: query.offset,
            limit: query.limit,
            sortBy: query.sortBy,
            sortType: query.sortType,
            publicStatus: query.publicStatus,
            companyGroupCode: req.user.companyGroupCode,
        };
        return this.evaluationServices.findListEvaluationItemHistory(params);
    }
    async getData810(versionId, req) {
        const result = await this.versionSettingService.getDetailEvaluationCalculation810(versionId, req);
        return result;
    }
    async getData810NS(versionId, req) {
        const result = await this.versionSettingService.getDetailEvaluationCalculation810NS(versionId, req);
        return result;
    }
    async detailCriteria(id, req) {
        return await this.guideEvaluationService.getInformationCriteria(id, req.user.companyGroupCode);
    }
    async publicVersion(id, req) {
        return await this.guideEvaluationService.publicVersion({
            versionId: id,
            version: req.body.version,
            subVersion: req.body.subVersion,
            timer: req.body.timer,
            userId: req.user.id,
            type: req.body.type,
        }, req.user.companyGroupCode, req.user.timeZone);
    }
    async saveDraft(req) {
        const results = await this.guideEvaluationService.saveDraftData(req.body, req.user.id, req.user.companyGroupCode, req.user.timeZone);
        return Object.assign(Object.assign({}, results), { fullName: req.user.fullName, versionId: results.id, timer: results.updatedTime, subVersion: results.subVersion, version: results.version, lastUpdatedTime: results.lastUpdatedTime });
    }
    async cancelVersion(versionId, req, body) {
        return await this.guideEvaluationService.cancelVersionPro(versionId, req.user.id, body, req.user.companyGroupCode);
    }
    async savePrivateVersion(id, req) {
        return await this.guideEvaluationService.savePrivateVersion({
            versionId: id,
            version: req.body.version,
            subVersion: req.body.subVersion,
            timer: req.body.timer,
            userId: req.user.id,
            type: req.body.type,
            status: req.body.status,
            reason: req.body.reason,
            contentEvaluationCriteria: req.body.contentEvaluationCriteria,
            contentNotes: req.body.contentNotes,
            companyGroupCode: req.user.companyGroupCode,
        });
    }
    async savePublicVersion(id, req) {
        return await this.guideEvaluationService.savePublicVersion({
            versionId: id,
            version: req.body.version,
            subVersion: req.body.subVersion,
            timer: req.body.timer,
            userId: req.user.id,
            type: req.body.type,
            status: req.body.status,
            reason: req.body.reason,
            contentEvaluationCriteria: req.body.contentEvaluationCriteria,
            contentNotes: req.body.contentNotes,
        }, req.user.companyGroupCode, req.user.timeZone);
    }
    async getDetailProSkill(id) {
        return await this.evaluationServices.detailProSkillById(id);
    }
    async publicVersionById(id, body, req) {
        const results = await this.evaluationServices.publicVersionService(id, body, req.user.id, body.hostname, req.user.fullName, req.user.companyGroupCode, req.user.timeZone);
        return results;
    }
    async rejectVersionById(id, body, req) {
        const host = process.env.HOSTNAME_;
        const results = await this.evaluationServices.rejectVersionService(id, body, req.user.id, host, req.user.companyGroupCode, req.user.timeZone);
        const rejectComment = await this.evaluationServices.getRejectComment(results.id);
        return {
            updatedTime: results.updatedTime,
            version: `${results.version}.${results.subVersion}`,
            publicDate: results.publicDate,
            publicStatus: results.publicStatus,
            versionMain: results.version,
            subVersion: results.subVersion,
            status: results.status,
            id: results.id,
            rejectComment: (rejectComment === null || rejectComment === void 0 ? void 0 : rejectComment.comment) || '',
        };
    }
    async getNextVersion810(version, req) {
        const results = await this.versionSettingService.getNextVersion810(version, req);
        return results;
    }
    async getNextVersion810NS(version, req) {
        const results = await this.versionSettingService.getNextVersion810NS(version, req);
        return results;
    }
    async listUserEvaluationPeriod(params, req) {
        const results = await this.adminEvaluationService.listUserEvaluationPeriod(params, req.user.companyGroupCode);
        return results;
    }
    async saveDraftSetting(params, req) {
        const results = await this.versionSettingService.saveDraft810(params, req.user.id, req);
        return results;
    }
    async saveDraftSettingNS(params, req) {
        const results = await this.versionSettingNsService.saveDraft810NS(params, req.user.id, req);
        return results;
    }
    async savePublicOrPrivate(params, req) {
        const results = await this.versionSettingService.savePublicOrPrivate(params, req.user.id, req);
        return results;
    }
    async savePublicOrPrivateNS(params, req) {
        const results = await this.versionSettingNsService.savePublicOrPrivateNS(params, req.user.id, req);
        return results;
    }
    async checkDatePublic(req) {
        const isResult = await this.versionSettingService.checkDatePublic(req.user.companyGroupCode, req.user.timeZone);
        return isResult;
    }
    async cancelSetting(id, params, req) {
        const results = await this.versionSettingService.cancelSetting(id, params, req.user.id, req);
        return results;
    }
    async publicVersionSetting(req, publicVersionSettingDto) {
        return await this.versionSettingService.publicVersionSetting17(publicVersionSettingDto, req);
    }
    async publicVersionSettingCommon(req, publicVersionSettingDto) {
        return await this.versionSettingService.publicVersionSettingCommon(publicVersionSettingDto, req);
    }
    async getMaxSubVersion(version, type, req) {
        return await this.versionSettingService.findMaxSubVersion(version, type, req);
    }
    async savePublicDetailCalculationCommon(req, dto) {
        return await this.versionSettingService.savePublicVersionSettingCommon(dto, req);
    }
    async saveDraftVersionSetting17(req, type, dto) {
        return await this.versionSettingService.saveDraftVersionSetting17(dto, type, req);
    }
    async saveDraftVersionSetting17ns(req, type, dto) {
        return await this.versionSettingNsService.saveDraftVersionSetting17ns(dto, type, req);
    }
    async cancelVersionSetting(id, body, req) {
        const data = Object.assign({}, body);
        return await this.versionSettingService.cancelVersionSetting17(id, data, req);
    }
    async savePublicDetailCalculation(req, dto) {
        return await this.versionSettingService.savePublicVersionSetting17(dto, req);
    }
    async basicBehaviorPublicVersion(id, req) {
        return await this.basicBehaviorServices.publicVersion({
            versionId: id,
            version: req.body.version,
            subVersion: req.body.subVersion,
            timer: req.body.timer,
            userId: req.user.id,
            type: req.body.type,
            hostname: req.body.hostname,
            companyGroupCode: req.user.companyGroupCode,
            timeZone: req.user.timeZone,
        });
    }
    async savePublicDetailCalculationNs(req, dto) {
        return await this.versionSettingNsService.savePublicVersionSetting17ns(dto, req);
    }
    async getListVersionNotification(query, req) {
        return await this.versionNotificationService.getListVersionNotification(query, req.user.companyGroupCode);
    }
    async getDetailNotification(id, req) {
        return await this.versionNotificationService.getDetailNotification(id, req.user.companyGroupCode);
    }
    async saveDraftVersionNotification(req, type, dto) {
        return await this.versionNotificationService.saveDraftVersionNotification(dto, type, req);
    }
    async cancelVersionNotification(id, body, req) {
        const data = Object.assign({}, body);
        data.id = id;
        return await this.versionNotificationService.cancelVersionNotification(data, req.user.companyGroupCode);
    }
    async savePublicDetailNotification(req, dto) {
        return await this.versionNotificationService.savePublicVersionNotification(dto, req);
    }
    async getMaxSubVersionNotification(version, req) {
        return await this.versionNotificationService.findMaxSubVersion(version, req.user.companyGroupCode);
    }
    async publicVersionNotification(publicVersionSettingDto, req) {
        return await this.versionNotificationService.publicVersionNotification(publicVersionSettingDto, req.user.companyGroupCode, req.user.timeZone);
    }
    async getAllDepartmentsWithSubClass(req) {
        return await this.adminEvaluationService.getAllDepartmentsWithSubClass(req.user.companyGroupCode);
    }
    async addProSkill(payload, req) {
        return await this.adminEvaluationService.addProSkill(payload, req.user.companyGroupCode);
    }
    async editProSkill(skillId, payload, req) {
        return await this.adminEvaluationService.editProSkill(skillId, payload, req.user.companyGroupCode);
    }
    async getListDep_TempExport(params, req) {
        const year = params.year;
        const periodIndex = params.periodEvaluate;
        const role = params.role;
        const companyGroupCode = req.user.companyGroupCode;
        const results = await this.proSkillServices.getListDep_TempExport(year, periodIndex, role, companyGroupCode);
        return results;
    }
    async dep_TempProSkillExport(params, req) {
        const year = params.year;
        const periodIndex = params.periodIndex;
        const role = params.role;
        const listSelected = params.listSelected;
        const companyGroupCode = req.user.companyGroupCode;
        return await this.proSkillServices.dep_TempProSkillExport(year, periodIndex, role, listSelected, companyGroupCode);
    }
    async searchListUserToSettingEvaluationHistoryReference(query, req) {
        var _a;
        const departments = query.department !== 'すべて'
            ? (_a = query === null || query === void 0 ? void 0 : query.department) === null || _a === void 0 ? void 0 : _a.split(':')
            : query.department;
        query = Object.assign(Object.assign({}, query), { userName: query.userName === undefined ? '' : query.userName, department: departments, offset: query.offset, limit: query.limit, companyGroupCode: req.user.companyGroupCode });
        return await this.settingReviewService.searchListUserToSettingEvaluationHistoryReference(query);
    }
    async getAllUser(req) {
        return await this.settingReviewService.getAllUser(req.user.companyGroupCode);
    }
    addEditUser(data, req) {
        return this.settingReviewService.addEditUser(data, req.user.companyGroupCode);
    }
    async listDepartment(req) {
        return await this.settingReviewService.getListDepartmentRepository(req.user.companyGroupCode);
    }
    async listSettingReviewHistory(query, req) {
        return await this.settingReviewService.getListSettingReviewHistoryReference(query, req.user['companyGroupCode'], req.user.timeZone);
    }
    async saveNumberPeriod(payload, req) {
        return await this.settingDefaultPeriodServices.updateOrCreateSetting(payload.defaultPeriod, req.user['companyGroupCode']);
    }
    async findOne(req) {
        return await this.settingDefaultPeriodServices.findOneSettingDefaultService(req.user['companyGroupCode']);
    }
    async deleteHistoryReference(payload, query, req) {
        const arrayIds = [];
        payload.map((v) => {
            v.split(',').map((val) => {
                arrayIds.push(Number(val));
            });
        });
        return await this.settingReviewService.deleteHistoryReference(arrayIds, query, req.user['companyGroupCode'], req.user.timeZone);
    }
};
__decorate([
    (0, common_1.Inject)(managementEvaluation_service_1.ManagementEvaluationService),
    __metadata("design:type", managementEvaluation_service_1.ManagementEvaluationService)
], ManagementEvaluationRoleController.prototype, "managementEvaluationService", void 0);
__decorate([
    (0, common_1.Inject)(versionSetting_service_1.VersionSettingService),
    __metadata("design:type", Object)
], ManagementEvaluationRoleController.prototype, "versionSettingService", void 0);
__decorate([
    (0, common_1.Inject)(versionSettingNs_service_1.VersionSettingNsService),
    __metadata("design:type", Object)
], ManagementEvaluationRoleController.prototype, "versionSettingNsService", void 0);
__decorate([
    (0, common_1.Inject)(adminEvaluation_service_1.AdminEvaluationService),
    __metadata("design:type", Object)
], ManagementEvaluationRoleController.prototype, "adminEvaluationService", void 0);
__decorate([
    (0, common_1.Inject)(guideEvaluation_service_1.GuideEvaluationService),
    __metadata("design:type", guideEvaluation_service_1.GuideEvaluationService)
], ManagementEvaluationRoleController.prototype, "guideEvaluationService", void 0);
__decorate([
    (0, common_1.Inject)(proSkillSetting_service_1.ProSkillSettingServices),
    __metadata("design:type", proSkillSetting_service_1.ProSkillSettingServices)
], ManagementEvaluationRoleController.prototype, "proSkillSettingServices", void 0);
__decorate([
    (0, common_1.Inject)(basicBehavior_service_1.BasicBehaviorServices),
    __metadata("design:type", basicBehavior_service_1.BasicBehaviorServices)
], ManagementEvaluationRoleController.prototype, "basicBehaviorServices", void 0);
__decorate([
    (0, common_1.Inject)(evaluation_service_1.EvaluationService),
    __metadata("design:type", evaluation_service_1.EvaluationService)
], ManagementEvaluationRoleController.prototype, "evaluationServices", void 0);
__decorate([
    (0, common_1.Inject)(versionNotification_service_1.VersionNotificationService),
    __metadata("design:type", Object)
], ManagementEvaluationRoleController.prototype, "versionNotificationService", void 0);
__decorate([
    (0, common_1.Inject)(proSkill_service_1.ProSkillServices),
    __metadata("design:type", proSkill_service_1.ProSkillServices)
], ManagementEvaluationRoleController.prototype, "proSkillServices", void 0);
__decorate([
    (0, common_1.Inject)(settingReview_service_1.SettingReviewService),
    __metadata("design:type", settingReview_service_1.SettingReviewService)
], ManagementEvaluationRoleController.prototype, "settingReviewService", void 0);
__decorate([
    (0, common_1.Inject)(settingDefaultPeriod_service_1.SettingDefaultPeriodServices),
    __metadata("design:type", settingDefaultPeriod_service_1.SettingDefaultPeriodServices)
], ManagementEvaluationRoleController.prototype, "settingDefaultPeriodServices", void 0);
__decorate([
    (0, common_1.Get)('/setting-evaluation-skills'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: GetSettingEvaluationSkillDto_1.GetSettingEvaluationSkillDto,
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        forbidUnknownValues: true,
        transform: true,
    })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ManagementEvaluationProDto_1.GetManagementEvaluationSkillDto, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "getSettingEvaluationSkills", null);
__decorate([
    (0, common_1.Delete)('/setting-evaluation-skills/:id'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "deleteAdminEvalutionSkill", null);
__decorate([
    (0, common_1.Get)('/get-user-active'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: GetUserActiveDto_1.GetUserActiveDto,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "getUserActive", null);
__decorate([
    (0, common_1.Get)('/list-common-skill'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: GetListCommonSkillDto_1.GetListCommonSkillDto,
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "getListCommonSkill", null);
__decorate([
    (0, common_1.Get)('/detail-evaluation-item/:id'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: DetailEvaluationItemDto_1.DetailEvaluationItemDto,
    }),
    (0, swagger_1.ApiQuery)({ name: 'isEdit', type: Boolean, example: true }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "detailEvaluationItem", null);
__decorate([
    (0, common_1.Put)('evaluation-item/save-draft'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: SaveDraftEvaluationItemDto_1.SaveDraftEvaluationItemDto,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "saveDraftEvaluationItem", null);
__decorate([
    (0, common_1.Put)('evaluation-item/:id/save-public-version/'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: SavePublicVersionEvaluationItemDto_1.SavePublicVersionEvaluationItemDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "savePublicVersionEvaluationItem", null);
__decorate([
    (0, common_1.Put)('evaluation-item/cancel-version/:versionId'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: [VersionProSkillDto_1.VersionProSkillDto],
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        type: ConflictCancelVersionEvaluationItemDto_1.ConflictCancelVersionEvaluationItemDto,
    }),
    (0, swagger_1.ApiBody)({}),
    __param(0, (0, common_1.Param)('versionId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "cancelVersionEvaluationItem", null);
__decorate([
    (0, common_1.Get)('/list-evaluation-calculation-history'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: ListEvaluationCalculationResponseDto_1.ListEvaluationCalculationHistoryResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ListEvaluationCalculationHistoryDto_1.ListEvaluationCalculationHistoryDto, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "getListEvaluationCalculationHistory", null);
__decorate([
    (0, common_1.Get)('/detail-evaluation-calculation/:id'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: VersionSettingDto_1.VersionSettingDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "getDetailEvaluationCalculation", null);
__decorate([
    (0, common_1.Get)('/detail-evaluation-calculation-ns/:id'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: VersionSettingDto_1.VersionSettingDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "getDetailEvaluationCalculationNs", null);
__decorate([
    (0, common_1.Get)('/detail-evaluation-calculation-common/:id'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: VersionSettingDto_1.VersionSettingDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "getDetailEvaluationCalculationCommon", null);
__decorate([
    (0, common_1.Put)('/detail-evaluation-calculation/save-draft-common'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, type: [VersionSettingDto_1.VersionSettingDto] }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: 'Conflict update' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, VersionSettingDto_1.VersionSettingDto]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "saveDraftVersionSettingCommon", null);
__decorate([
    (0, common_1.Get)('/list-criteria-evaluation-history'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: FindListEvaluationCriteriaHistoryDto_1.FindListEvaluationCriteriaHistoryDto,
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Bad request' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ListEvaluationCriteriaHistoryRequestDto_1.ListEvaluationCriteriaHistoryRequestDto, Object]),
    __metadata("design:returntype", void 0)
], ManagementEvaluationRoleController.prototype, "findListEvaluationCriteriaHistory", null);
__decorate([
    (0, common_1.Get)('/history-approve/:versionId'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: GetHistoryApproveContentDto_1.GetHistoryApproveContentDto,
    }),
    __param(0, (0, common_1.Param)('versionId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "getHistoryApproveContent", null);
__decorate([
    (0, common_1.Get)('/list-evaluation-item-history'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: FindListEvaluationItemHistoryDto_1.FindListEvaluationItemHistoryDto,
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ListEvaluationItemHistoryRequestDto_1.ListEvaluationItemHistoryRequestDto, Object]),
    __metadata("design:returntype", void 0)
], ManagementEvaluationRoleController.prototype, "findListEvaluationItemHistory", null);
__decorate([
    (0, common_1.Get)('/get-data-8-10/:versionId'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: VersionSettingDto_1.VersionSetting810Dto,
    }),
    __param(0, (0, common_1.Param)('versionId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "getData810", null);
__decorate([
    (0, common_1.Get)('/get-data-8-10-ns/:versionId'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: VersionSettingDto_1.VersionSetting810NSDto,
    }),
    __param(0, (0, common_1.Param)('versionId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "getData810NS", null);
__decorate([
    (0, common_1.Get)('/detail-criteria-evaluation/:id'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: DetailCriteriaDto_1.DetailCriteriaDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "detailCriteria", null);
__decorate([
    (0, common_1.Put)('/:id/public-version/'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        type: ConflictPublicVersionDto_1.ConflictPublicVersionDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: PublicVersionDto_1.PublicVersionDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "publicVersion", null);
__decorate([
    (0, common_1.Put)('/criteria-evaluation/save-draft'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: SaveDraftDto_1.SaveDraftDto,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "saveDraft", null);
__decorate([
    (0, common_1.Put)('/criteria-evaluation/cancel-version/:versionId'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        schema: { type: 'number', example: 3 },
    }),
    (0, swagger_1.ApiBody)({ type: CancelVersionEvaluationItemBody_1.CancelVersionEvaluationItemBody }),
    __param(0, (0, common_1.Param)('versionId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "cancelVersion", null);
__decorate([
    (0, common_1.Put)('/:id/save-private-version-criteria-evaluation'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        type: ConflictPublicVersionDto_1.ConflictPublicVersionDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: SavePrivateVersionDto_1.SavePrivateVersionDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "savePrivateVersion", null);
__decorate([
    (0, common_1.Put)('/:id/save-public-version-criteria-evaluation'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        type: ConflictPublicVersionDto_1.ConflictPublicVersionDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: SavePublicVersionDto_1.SavePublicVersionDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "savePublicVersion", null);
__decorate([
    (0, common_1.Get)('/detail-pro-skill/:id'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: VersionProSkillDto_1.VersionProSkillDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "getDetailProSkill", null);
__decorate([
    (0, common_1.Put)('/:id/public-pro-skill'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "publicVersionById", null);
__decorate([
    (0, common_1.Put)('/:id/reject-pro-skill'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: VersionProSkillDto_1.VersionProSkillDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "rejectVersionById", null);
__decorate([
    (0, common_1.Get)('/detail-evaluation-calculation-8-10/get-next-version/:version'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: GetNextVersion810Dto_1.GetNextVersion810Dto,
    }),
    __param(0, (0, common_1.Param)('version')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "getNextVersion810", null);
__decorate([
    (0, common_1.Get)('/detail-evaluation-calculation-8-10ns/get-next-version/:version'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: GetNextVersion810Dto_1.GetNextVersion810Dto,
    }),
    __param(0, (0, common_1.Param)('version')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "getNextVersion810NS", null);
__decorate([
    (0, common_1.Get)('/list-user-evaluation-period'),
    (0, swagger_1.ApiExcludeEndpoint)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "listUserEvaluationPeriod", null);
__decorate([
    (0, common_1.Post)('/detail-evaluation-calculation-8-10/save-draft'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        schema: { example: SaveDraftSetting810ResEx_1.SaveDraftSetting810ResEx },
    }),
    (0, swagger_1.ApiBody)({ schema: { example: SaveDraftSetting810Ex_1.SaveDraftSetting810Ex } }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CalculatorDetail810Dto_1.CalculatorDetail810Dto, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "saveDraftSetting", null);
__decorate([
    (0, common_1.Post)('/detail-evaluation-calculation-8-10ns/save-draft'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        schema: { example: SaveDraftSetting810ResEx_1.SaveDraftSetting810ResEx },
    }),
    (0, swagger_1.ApiBody)({ schema: { example: SaveDraftSetting810Ex_1.SaveDraftSetting810Ex } }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CalculatorDetail810Dto_1.CalculatorDetail810NSDto, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "saveDraftSettingNS", null);
__decorate([
    (0, common_1.Post)('/detail-evaluation-calculation-8-10/save-public-or-private'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        schema: { example: SaveDraftSetting810ResEx_1.SaveDraftSetting810ResEx },
    }),
    (0, swagger_1.ApiBody)({ schema: { example: SaveDraftSetting810Ex_1.SaveDraftSetting810Ex } }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CalculatorDetail810Dto_1.CalculatorDetail810Dto, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "savePublicOrPrivate", null);
__decorate([
    (0, common_1.Post)('/detail-evaluation-calculation-8-10ns/save-public-or-private'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        schema: { example: SaveDraftSetting810ResEx_1.SaveDraftSetting810ResEx },
    }),
    (0, swagger_1.ApiBody)({ schema: { example: SaveDraftSetting810Ex_1.SaveDraftSetting810Ex } }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CalculatorDetail810Dto_1.CalculatorDetail810NSDto, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "savePublicOrPrivateNS", null);
__decorate([
    (0, common_1.Get)('/detail-evaluation-calculation-8-10/check-date-public'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        type: ConflictPublicVersionDto_1.ConflictPublicVersionDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        schema: { type: 'boolean', example: false },
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "checkDatePublic", null);
__decorate([
    (0, common_1.Put)('/detail-evaluation-calculation-8-10/cancel/:versionId'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: [Number],
        schema: { example: [1] },
    }),
    (0, swagger_1.ApiBody)({ schema: { example: CancelSetting810Ex_1.CancelSetting810Ex } }),
    __param(0, (0, common_1.Param)('versionId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "cancelSetting", null);
__decorate([
    (0, common_1.Patch)('/public-version-setting'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: PublicVersionSettingDto_2.PublicVersionSettingDto,
    }),
    (0, swagger_1.ApiBody)({ type: PublicVersionSettingDto_2.PublicVersionSettingDto, required: true }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, PublicVersionSettingDto_2.PublicVersionSettingDto]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "publicVersionSetting", null);
__decorate([
    (0, common_1.Patch)('/public-version-setting-common'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: PublicVersionSettingDto_2.PublicVersionSettingDto,
    }),
    (0, swagger_1.ApiBody)({ type: PublicVersionSettingDto_2.PublicVersionSettingDto, required: true }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, PublicVersionSettingDto_2.PublicVersionSettingDto]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "publicVersionSettingCommon", null);
__decorate([
    (0, common_1.Get)('/get-max-sub-version/:version'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, type: Number, schema: { example: 2 } }),
    __param(0, (0, common_1.Param)('version')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "getMaxSubVersion", null);
__decorate([
    (0, common_1.Put)('/detail-evaluation-calculation/save-public-common'),
    (0, swagger_1.ApiResponse)({ status: 200, type: [VersionSettingDto_1.VersionSettingDto] }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: 'Conflict update' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, VersionSettingDto_1.VersionSettingDto]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "savePublicDetailCalculationCommon", null);
__decorate([
    (0, common_1.Put)('/detail-evaluation-calculation/save-draft17'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, type: [VersionSettingDto_1.VersionSettingDto] }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: 'Conflict update' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, VersionSettingDto_1.VersionSettingDto]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "saveDraftVersionSetting17", null);
__decorate([
    (0, common_1.Put)('/detail-evaluation-calculation/save-draft17ns'),
    (0, swagger_1.ApiResponse)({ status: 200, type: [VersionSettingDto_1.VersionSettingDto] }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: 'Conflict update' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, VersionSettingDto_1.VersionSettingDto]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "saveDraftVersionSetting17ns", null);
__decorate([
    (0, common_1.Patch)('/detail-evaluation-calculation/:id/cancel'),
    (0, swagger_1.ApiResponse)({ status: 200, type: Boolean, schema: { example: true } }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "cancelVersionSetting", null);
__decorate([
    (0, common_1.Put)('/detail-evaluation-calculation/save-public17'),
    (0, swagger_1.ApiResponse)({ status: 200, type: [VersionSettingDto_1.VersionSettingDto] }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: 'Conflict update' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, VersionSettingDto_1.VersionSettingDto]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "savePublicDetailCalculation", null);
__decorate([
    (0, common_1.Put)('/:id/basic-behavior-public-version/'),
    (0, swagger_1.ApiBody)({ type: BasicBehaviorPublicVersionBody_1.BasicBehaviorPublicVersionBody }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        type: BasicBehaviorPublicVersionDto_1.BasicBehaviorPublicVersionDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "basicBehaviorPublicVersion", null);
__decorate([
    (0, common_1.Put)('/detail-evaluation-calculation/save-public17ns'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, type: [VersionSettingDto_1.VersionSettingDto] }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        type: VersionSettingConflictUpdateDto_1.VersionSettingConflictUpdateDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, VersionSettingDto_1.VersionSettingDto]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "savePublicDetailCalculationNs", null);
__decorate([
    (0, common_1.Get)('/list-version-notification'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: ListVersionNotificationResponse_1.ListVersionNotificationResponse,
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ListVersionNotificationParam_1.ListVersionNotificationParam, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "getListVersionNotification", null);
__decorate([
    (0, common_1.Get)('/detail-notification/:id'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: VersionNotificationDto_1.VersionNotificationDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "getDetailNotification", null);
__decorate([
    (0, common_1.Put)('/detail-notification/save-draft'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, type: [VersionNotificationDto_1.VersionNotificationDto] }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: 'Conflict update' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, VersionNotificationDto_1.VersionNotificationDto]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "saveDraftVersionNotification", null);
__decorate([
    (0, common_1.Patch)('/detail-notification/:id/cancel'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: Boolean,
        schema: { example: true },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, CancelVersionNotificationDto_1.CancelVersionNotificationDto, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "cancelVersionNotification", null);
__decorate([
    (0, common_1.Put)('/detail-notification/save-public'),
    (0, swagger_1.ApiResponse)({ status: 200, type: [VersionNotificationDto_1.VersionNotificationDto] }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: 'Conflict update' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, VersionNotificationDto_1.VersionNotificationDto]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "savePublicDetailNotification", null);
__decorate([
    (0, common_1.Get)('/detail-notification/:version/get-max-sub-version'),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, type: Number, schema: { example: 2 } }),
    __param(0, (0, common_1.Param)('version')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "getMaxSubVersionNotification", null);
__decorate([
    (0, common_1.Patch)('/detail-notification/public'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: PublicVersionSettingDto_1.PublicVersionNotificationDto,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PublicVersionSettingDto_1.PublicVersionNotificationDto, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "publicVersionNotification", null);
__decorate([
    (0, common_1.Post)('/get-all-departments-with-subclass'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "getAllDepartmentsWithSubClass", null);
__decorate([
    (0, common_1.Post)('/add-pro-skill'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddProSkillDto_1.AddProSkillDto, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "addProSkill", null);
__decorate([
    (0, common_1.Put)('/setting-evaluation-skills/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, EditProskillDto_1.EditProskillDto, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "editProSkill", null);
__decorate([
    (0, common_1.Get)('/list-dep-temp-export'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "getListDep_TempExport", null);
__decorate([
    (0, common_1.Get)('/dep-temp-export'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "dep_TempProSkillExport", null);
__decorate([
    (0, common_1.Get)('/find-list-user-to-setting-evaluation-history-reference'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "searchListUserToSettingEvaluationHistoryReference", null);
__decorate([
    (0, common_1.Get)('/get-all-user'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "getAllUser", null);
__decorate([
    (0, common_1.Post)('/add-edit-user-setting-evaluation-history-reference'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ManagementEvaluationRoleController.prototype, "addEditUser", null);
__decorate([
    (0, common_1.Get)('/list-department'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "listDepartment", null);
__decorate([
    (0, common_1.Get)('/list-setting-review-history'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "listSettingReviewHistory", null);
__decorate([
    (0, common_1.Put)('/update-number-period'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "saveNumberPeriod", null);
__decorate([
    (0, common_1.Get)('/get-setting-default-period'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)('/delete-history-reference'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationRoleController.prototype, "deleteHistoryReference", null);
ManagementEvaluationRoleController = __decorate([
    (0, common_1.Controller)('v1/f6/management-evaluation'),
    (0, Authorization_1.Authorize)(Roles_1.Roles.F6),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, swagger_1.ApiTags)(Tag_1.Tag.F6),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal Server Error',
    })
], ManagementEvaluationRoleController);
exports.ManagementEvaluationRoleController = ManagementEvaluationRoleController;
//# sourceMappingURL=evaluation.controller.js.map