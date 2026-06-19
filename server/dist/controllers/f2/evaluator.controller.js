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
exports.EvaluatorRoleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const util_1 = require("../../common/util");
const Roles_1 = require("../../enum/Roles");
const Tag_1 = require("../../enum/Tag");
const Authorization_1 = require("../../handler/annotation/Authorization");
const role_guard_1 = require("../../handler/guard/role.guard");
const proskillSetting_interfaces_1 = require("../../interfaces/proskillSetting.interfaces");
const EvaluationParamDto_1 = require("../../model/request/EvaluationParamDto");
const EvaluatorRequestDto_1 = require("../../model/request/EvaluatorRequestDto");
const IdNumberDto_1 = require("../../model/request/IdNumberDto");
const ProSkillSetingRequestDto_1 = require("../../model/request/ProSkillSetingRequestDto");
const ApprovalHistoryResponseDto_1 = require("../../model/response/ApprovalHistoryResponseDto");
const EvaluatorResponseDto_1 = require("../../model/response/EvaluatorResponseDto");
const evaluation_service_1 = require("../../services/evaluation.service");
const evaluator_service_1 = require("../../services/evaluator.service");
const evaluatorApproval_service_1 = require("../../services/evaluatorApproval.service");
const proSkillSetting_service_1 = require("../../services/proSkillSetting.service");
const user_service_1 = require("../../services/user.service");
let EvaluatorRoleController = class EvaluatorRoleController {
    async getEvaluation(query, req) {
        var _a, _b, _c, _d, _e;
        const departments = query.departmentSearch;
        const division = query.divisionSearch;
        const salaryRanks = (_a = query.salaryRank) === null || _a === void 0 ? void 0 : _a.split(',');
        const periodArrs = ['', '上期', '下期'];
        const evaluators = (_b = query.evaluator) === null || _b === void 0 ? void 0 : _b.split(',');
        const status = query.stringStatus !== '' ? (_c = query.stringStatus) === null || _c === void 0 ? void 0 : _c.split(',') : [];
        const params = {
            email: query.email,
            department: departments,
            division: division,
            salaryRank: salaryRanks,
            title: `${query.yearDisplayCalendar}年${periodArrs[query.periodEvaluate]}`,
            evaluators: evaluators,
            evaluatorId: req.user.id,
            offset: query.offset,
            limit: query.limit,
            sortBy: query.sortBy,
            sortType: query.sortType,
            status,
            sortColumns: (_d = query.sortColumns) !== null && _d !== void 0 ? _d : [],
            sortDirections: (_e = query.sortDirections) !== null && _e !== void 0 ? _e : [],
            companyGroupCode: req.user['companyGroupCode'],
        };
        const datas = await this.evaluatorServices.searchListUserEvaluator2(params);
        return datas;
    }
    sendApprovedStatus(id, req, body) {
        const { comment, type, updateTime } = body;
        const userId = req.user.id;
        const host = `${process.env.HOSTNAME_}/company/${req.user.companyGroupCode}/evaluator/evaluation`;
        return this.evaluatorServices.sendApproveStatus(id, comment, userId, type, updateTime, host, req.user.companyGroupCode, req.user.timeZone);
    }
    sendRejectedStatus(id, req, body) {
        const { comment, type, statusReject, updateTime } = body;
        const userId = req.user.id;
        const host = `${process.env.HOSTNAME_}/company/${req.user.companyGroupCode}`;
        return this.evaluatorServices.sendRejectStatus(id, comment, userId, type, statusReject, updateTime, host, req.user.companyGroupCode, req.user.timeZone);
    }
    async getHistoryApproveContent(versionId, req) {
        const data = await this.proSkillSettingServices.getHistoryApproveContent(versionId, req.user.id, undefined, req.user.companyGroupCode);
        return data;
    }
    async getDetailProSkill(param, req) {
        const data = await this.proSkillSettingServices.getDetailProSkillGeneric(param.versionId, req.user.companyGroupCode);
        return data;
    }
    async getVersionProSkillDepartment(req, query) {
        const results = await this.proSkillSettingServices.getVersionProSkillDepartment(query, req.user.companyGroupCode);
        return results;
    }
    evaluationSkillCheck(id) {
        return this.userServices.evaluationSkillCheck(id);
    }
    getEvaluationById(id, query, req) {
        return this.userServices.getEvaluationData(id, req.user, query.isEvaluatorUser, req.user['companyGroupCode'], req.user.timeZone);
    }
    updateEvaluation(id, req, body) {
        const host = `${process.env.HOSTNAME_}/company/${req.user.companyGroupCode}/evaluator/evaluation`;
        const decode = (0, util_1.decrypt)(body.data);
        const data = JSON.parse(decode);
        const timeZone = req.user.timeZone;
        return this.userServices.updateEvaluation(id, req.user, data, host, timeZone);
    }
    getListProSkillPublic(req, query) {
        return this.userServices.getListProSkillPublic(req.user, query.evaluationId);
    }
    getAchievementSettingPublic(query, req) {
        const achievementType = query.achievementType;
        return this.userServices.getAchievementPublic(achievementType, req.user.companyGroupCode);
    }
    getAchievementAddSettingPublic(query, req) {
        const achievementType = query.achievementType;
        const type = query.type;
        return this.userServices.getAchievementAddPublic(achievementType, type, req.user.companyGroupCode);
    }
    getBasicBehaviorSkillPublic(query, req) {
        const basicBehaviorType = query.basicBehaviorType;
        return this.userServices.getBasicBehaviorSkillPublic(basicBehaviorType, req.user.companyGroupCode, query.level);
    }
    async getListApprovalHistory(req, query, param) {
        const order = (0, util_1.decrypt)((query === null || query === void 0 ? void 0 : query.order) || '');
        const results = await this.approvalService.getListApprovalHistory(param.id, req.user.userId, order ? Number(order) : 0);
        return results;
    }
    findOne(params, query, req) {
        const { role } = query;
        const result = this.evaluationService.findOne(params.id, Number(params.userId), role, req.user.companyGroupCode);
        return result;
    }
    createNewEvaluation(dataBody, req) {
        const host = `${process.env.HOSTNAME_}/company/${req.user.companyGroupCode}/evaluator/evaluation-8-10`;
        const result = this.evaluationService.createOrUpdateEvaluation(dataBody.dataSource, dataBody.additionData, dataBody.commentData, dataBody.evaluationId, dataBody.status, dataBody.isDraft, dataBody.listEvalutor, dataBody.total, dataBody.updatedTime, dataBody.checkList, host, dataBody.listBehaviors, dataBody.listPersonalGoals, dataBody.achievementAdditionalPersonals, dataBody.listProSkills, req.user.timeZone, req.user.id);
        return result;
    }
    approveEvaluation(dataBody, req) {
        const host = `${process.env.HOSTNAME_}/company/${req.user.companyGroupCode}/evaluator/evaluation-8-10`;
        const result = this.evaluationService.approveEvaluation(Number(dataBody.evaluationId), Number(dataBody.status), dataBody.listEvalutor, dataBody.maxOrder, dataBody.content, dataBody.approverId, dataBody.updatedTime, host, req.user.companyGroupCode, req.user.timeZone);
        return result;
    }
    rejectEvaluation(dataBody, req) {
        const host = `${process.env.HOSTNAME_}/company/${req.user.companyGroupCode}`;
        const result = this.evaluationService.rejectEvaluation(Number(dataBody.evaluationId), dataBody.status, dataBody.selectedOrder, dataBody.content, dataBody.approverId, dataBody.ownerId, dataBody.listEvalutor, dataBody.updatedTime, dataBody.maxOrder, host, req.user.companyGroupCode, req.user.timeZone);
        return result;
    }
    async getDepartmentGoal(query, req) {
        const { idEvaluation } = query;
        const userId = await this.userServices.getUserIdByEvaluationId(idEvaluation);
        const departmentGoal = await this.userServices.getDepartmentGoal(idEvaluation, userId, req.user.companyGroupCode, req.user.timeZone);
        return departmentGoal;
    }
    async checkPermission(params) {
        const { evaluationId, userId } = params;
        return await this.evaluationService.checkEvaluatorPermission(evaluationId, userId);
    }
    async getDetailProskill(versionId, req) {
        const data = await this.proSkillSettingServices.getDetailProSkillVersion(versionId, 'f2', req.user.companyGroupCode);
        return data;
    }
    async exportHistoryEvaluationEvaluator(params, res, req) {
        const buffer = await this.evaluatorServices.exportHistoryEvaluationEvaluator(params, req.user.userId, req.user.companyGroupCode);
        res.send(buffer);
    }
    async getUserDetailById(query) {
        const result = await this.userServices.getUserDetailById(query.id);
        return result;
    }
    async getListDepartmentExportEvaluationHistory(req, params) {
        const result = await this.evaluatorServices.getListDepartmentToExportHistoryEvaluation(req.user.userId, req.user.companyGroupCode, params);
        return result;
    }
    async listUserProSkillExpertise(params, req) {
        return await this.evaluatorServices.listUserProSkillExpertise(params, req.user.userId, req.user.companyGroupCode);
    }
    async getListDepartmentExpertise(req, params) {
        const result = await this.evaluatorServices.getListDepartmentExpertise(req.user.userId, req.user.companyGroupCode, params);
        return result;
    }
    async exportPDFProSkillExpertise(body, req) {
        const result = await this.evaluatorServices.exportPDFProSkillExpertise(body, req.user.companyGroupCode, req.user.timeZone);
        return result;
    }
    async detailProfessionalExpertise(req, params) {
        return await this.evaluationService.getDetailProfessionalExpertise(params.userId, params.yearStart, params.yearEnd, req.user.companyGroupCode, req.user.id);
    }
};
__decorate([
    (0, common_1.Inject)(evaluator_service_1.EvaluatorServices),
    __metadata("design:type", evaluator_service_1.EvaluatorServices)
], EvaluatorRoleController.prototype, "evaluatorServices", void 0);
__decorate([
    (0, common_1.Inject)(proSkillSetting_service_1.ProSkillSettingServices),
    __metadata("design:type", proSkillSetting_service_1.ProSkillSettingServices)
], EvaluatorRoleController.prototype, "proSkillSettingServices", void 0);
__decorate([
    (0, common_1.Inject)(user_service_1.UserService),
    __metadata("design:type", user_service_1.UserService)
], EvaluatorRoleController.prototype, "userServices", void 0);
__decorate([
    (0, common_1.Inject)(evaluatorApproval_service_1.EvaluatorApprovalService),
    __metadata("design:type", Object)
], EvaluatorRoleController.prototype, "approvalService", void 0);
__decorate([
    (0, common_1.Inject)(evaluation_service_1.EvaluationService),
    __metadata("design:type", evaluation_service_1.EvaluationService)
], EvaluatorRoleController.prototype, "evaluationService", void 0);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: EvaluatorResponseDto_1.EvaluatorListResponseDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: ' Internal Server Error',
    }),
    (0, common_1.Get)('/list-user-evaluation'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluatorRequestDto_1.EvaluatorSearchDto, Object]),
    __metadata("design:returntype", Promise)
], EvaluatorRoleController.prototype, "getEvaluation", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: EvaluatorResponseDto_1.Approve17ResponseDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: ' Internal Server Error',
    }),
    (0, common_1.Put)('/approved/status/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, EvaluatorRequestDto_1.EvaluatorApproveStatusDto]),
    __metadata("design:returntype", void 0)
], EvaluatorRoleController.prototype, "sendApprovedStatus", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: EvaluatorResponseDto_1.Reject17ResponseDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: ' Internal Server Error',
    }),
    (0, common_1.Put)('/rejected/status/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, EvaluatorRequestDto_1.EvaluatorApproveStatusDto]),
    __metadata("design:returntype", void 0)
], EvaluatorRoleController.prototype, "sendRejectedStatus", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: EvaluatorResponseDto_1.ProSkillApprovalHistoryResponseDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: ' Internal Server Error',
    }),
    (0, common_1.Get)('/history-approve/:versionId'),
    __param(0, (0, common_1.Param)('versionId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], EvaluatorRoleController.prototype, "getHistoryApproveContent", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: EvaluatorResponseDto_1.DetailPublicProSkillResponseDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: ' Internal Server Error',
    }),
    (0, common_1.Get)('/detail-pro-skill-public/:versionId'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [proskillSetting_interfaces_1.ProSkillDetail, Object]),
    __metadata("design:returntype", Promise)
], EvaluatorRoleController.prototype, "getDetailProSkill", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: EvaluatorResponseDto_1.PublicProSkillListResponseDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: ' Internal Server Error',
    }),
    (0, swagger_1.ApiQuery)({ type: ProSkillSetingRequestDto_1.ProSKillVersionRequestDto }),
    (0, common_1.Get)('/version-pro-skill-department'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ProSkillSetingRequestDto_1.ProSKillVersionRequestDto]),
    __metadata("design:returntype", Promise)
], EvaluatorRoleController.prototype, "getVersionProSkillDepartment", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: EvaluatorResponseDto_1.Evaluation17SkillResponseDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: ' Internal Server Error',
    }),
    (0, common_1.Get)('/evaluation-skill/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EvaluatorRoleController.prototype, "evaluationSkillCheck", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: String }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: ' Internal Server Error',
    }),
    (0, common_1.Get)('/evaluation/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, EvaluationParamDto_1.GetEvaluationDTO, Object]),
    __metadata("design:returntype", void 0)
], EvaluatorRoleController.prototype, "getEvaluationById", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: EvaluatorResponseDto_1.Evaluation17DetailResponseDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: ' Internal Server Error',
    }),
    (0, common_1.Put)('/evaluation/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, EvaluationParamDto_1.EvaluationUpdateTypeDto]),
    __metadata("design:returntype", void 0)
], EvaluatorRoleController.prototype, "updateEvaluation", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: EvaluationParamDto_1.EvaluationListProSkillPublicResponseDto,
        isArray: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: ' Internal Server Error',
    }),
    (0, common_1.Get)('/evaluation/list-pro-skill/public'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], EvaluatorRoleController.prototype, "getListProSkillPublic", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: EvaluatorResponseDto_1.Evaluation17AchievementResponseDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: ' Internal Server Error',
    }),
    (0, common_1.Get)('/evaluation/achievement/public'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.EvaluationAchievementPublicTypeDto, Object]),
    __metadata("design:returntype", void 0)
], EvaluatorRoleController.prototype, "getAchievementSettingPublic", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: EvaluatorResponseDto_1.Evaluation17AdditionalAchievementResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: ' Internal Server Error',
    }),
    (0, common_1.Get)('/evaluation/achievement-additional/public'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.EvaluationAchievementPublicTypeDto, Object]),
    __metadata("design:returntype", void 0)
], EvaluatorRoleController.prototype, "getAchievementAddSettingPublic", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        isArray: true,
        type: EvaluationParamDto_1.GetBasicBehaviorSkillPublicResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: ' Internal Server Error',
    }),
    (0, common_1.Get)('/evaluation/basic-behavior-skill/public'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.EvaluationBasicBehaviorPublicTypeDto, Object]),
    __metadata("design:returntype", void 0)
], EvaluatorRoleController.prototype, "getBasicBehaviorSkillPublic", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: [ApprovalHistoryResponseDto_1.ApprovalHistoryResponseDto] }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: ' Internal Server Error',
    }),
    (0, common_1.Get)('/evaluation/:id/get-approval-history'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, IdNumberDto_1.IdNumberDto]),
    __metadata("design:returntype", Promise)
], EvaluatorRoleController.prototype, "getListApprovalHistory", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: EvaluationParamDto_1.GetEvaluation810ResponseDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: ' Internal Server Error',
    }),
    (0, common_1.Get)('/evaluation8-10/:id/:userId'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.Evaluation810Param, Object, Object]),
    __metadata("design:returntype", void 0)
], EvaluatorRoleController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: EvaluationParamDto_1.CreateOrUpdateEvaluationResponseDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: ' Internal Server Error',
    }),
    (0, common_1.Post)('/evaluation8-10/save'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.Evaluation810SaveInfo, Object]),
    __metadata("design:returntype", void 0)
], EvaluatorRoleController.prototype, "createNewEvaluation", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200 }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: ' Internal Server Error',
    }),
    (0, common_1.Post)('/evaluation8-10/approve'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.EvaluationApproveInfo, Object]),
    __metadata("design:returntype", void 0)
], EvaluatorRoleController.prototype, "approveEvaluation", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: EvaluationParamDto_1.CreateOrUpdateEvaluationResponseDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: ' Internal Server Error',
    }),
    (0, common_1.Post)('/evaluation8-10/reject'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.Evaluation810RejectInfo, Object]),
    __metadata("design:returntype", void 0)
], EvaluatorRoleController.prototype, "rejectEvaluation", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: EvaluationParamDto_1.GetDepartmentGoalResponseDto }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: ' Internal Server Error',
    }),
    (0, common_1.Get)('/department-goal'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluatorRoleController.prototype, "getDepartmentGoal", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: Boolean }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: ' Internal Server Error',
    }),
    (0, common_1.Get)('/check-permission/:evaluationId/:userId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.CheckPermissionRequestDto]),
    __metadata("design:returntype", Promise)
], EvaluatorRoleController.prototype, "checkPermission", null);
__decorate([
    (0, common_1.Get)('/detail-pro-skill/:versionId'),
    __param(0, (0, common_1.Param)('versionId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], EvaluatorRoleController.prototype, "getDetailProskill", null);
__decorate([
    (0, common_1.Get)('/export-history-evaluation-evaluator'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluatorRequestDto_1.ExportHistoryEvaluationEvaluatorDto, Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluatorRoleController.prototype, "exportHistoryEvaluationEvaluator", null);
__decorate([
    (0, common_1.Get)('/get-user-detail-by-id'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EvaluatorRoleController.prototype, "getUserDetailById", null);
__decorate([
    (0, common_1.Get)('/get-list-department-export-evaluation-history'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, EvaluatorRequestDto_1.GetListDepartmentExportEvaluationHistoryDto]),
    __metadata("design:returntype", Promise)
], EvaluatorRoleController.prototype, "getListDepartmentExportEvaluationHistory", null);
__decorate([
    (0, common_1.Get)('/get-list-user-pro-skill-expertise'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluatorRoleController.prototype, "listUserProSkillExpertise", null);
__decorate([
    (0, common_1.Get)('/get-list-department-pro-skill-expertise'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluatorRoleController.prototype, "getListDepartmentExpertise", null);
__decorate([
    (0, common_1.Post)('/export-pdf-pro-skill-expertise'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluatorRoleController.prototype, "exportPDFProSkillExpertise", null);
__decorate([
    (0, common_1.Get)('/development-professional-expertise/detail/:userId/:yearStart/:yearEnd'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluatorRoleController.prototype, "detailProfessionalExpertise", null);
EvaluatorRoleController = __decorate([
    (0, common_1.Controller)('v1/f2/evaluator'),
    (0, Authorization_1.Authorize)(Roles_1.Roles.F2),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, swagger_1.ApiTags)(Tag_1.Tag.F2)
], EvaluatorRoleController);
exports.EvaluatorRoleController = EvaluatorRoleController;
//# sourceMappingURL=evaluator.controller.js.map