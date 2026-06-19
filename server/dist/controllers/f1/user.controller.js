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
exports.UserRoleController = void 0;
const common_1 = require("@nestjs/common");
const role_guard_1 = require("../../handler/guard/role.guard");
const evaluation_service_1 = require("../../services/evaluation.service");
const user_service_1 = require("../../services/user.service");
const EvaluationParamDto_1 = require("../../model/request/EvaluationParamDto");
const approval_service_1 = require("../../services/approval.service");
const IdNumberDto_1 = require("../../model/request/IdNumberDto");
const swagger_1 = require("@nestjs/swagger");
const ApprovalHistoryResponseDto_1 = require("../../model/response/ApprovalHistoryResponseDto");
const Tag_1 = require("../../enum/Tag");
const Roles_1 = require("../../enum/Roles");
const Authorization_1 = require("../../handler/annotation/Authorization");
const BasicBehaviorRequest_1 = require("../../model/request/BasicBehaviorRequest");
const util_1 = require("../../common/util");
let UserRoleController = class UserRoleController {
    async getData(query, req) {
        const results = await this.userServices.listEvaluation(query, req.user.userId, req.user['companyGroupCode']);
        return results;
    }
    evaluationSkillCheck(id) {
        return this.userServices.evaluationSkillCheck(id);
    }
    getEvaluation(id, query, req) {
        return this.userServices.getEvaluationData(id, req.user, query.isEvaluatorUser, req.user['companyGroupCode'], req.user.timeZone);
    }
    updateEvaluation(id, req, body) {
        const host = `${process.env.HOSTNAME_}/company/${req.user.companyGroupCode}/evaluator/evaluation`;
        const decode = (0, util_1.decrypt)(body.data);
        const data = JSON.parse(decode);
        const timeZone = req.user.timeZone;
        return this.userServices.updateEvaluation(id, req.user, data, host, timeZone);
    }
    getListProSkillPublic(query, req) {
        return this.userServices.getListProSkillPublic(req.user, query.evaluationId);
    }
    getAchievementSettingPublic(query, req) {
        const achievementType = query.achievementType;
        return this.userServices.getAchievementPublic(achievementType, req.user.companyGroupCode);
    }
    getAchievementSubPublic(query, req) {
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
    getSettingProFormulaPublic(req) {
        return this.userServices.getSettingProFormulaPublic(req.user.companyGroupCode);
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
        const host = `${process.env.HOSTNAME_}/company/${req.user.companyGroupCode}/user/evaluation-8-10`;
        const result = this.evaluationService.approveEvaluation(dataBody.evaluationId, dataBody.status, dataBody.listEvalutor, dataBody.maxOrder, dataBody.content, dataBody.approverId, dataBody.updatedTime, host, req.user.companyGroupCode, req.user.timeZone);
        return result;
    }
    rejectEvaluation(dataBody, req) {
        const host = `${process.env.HOSTNAME_}/company/${req.user.companyGroupCode}/user/evaluation-8-10`;
        const result = this.evaluationService.rejectEvaluation(dataBody.evaluationId, dataBody.status, dataBody.selectedOrder, dataBody.content, dataBody.approverId, dataBody.ownerId, dataBody.listEvalutor, dataBody.updatedTime, dataBody.maxOrder, host, req.user.companyGroupCode, req.user.timeZone);
        return result;
    }
    async getListApprovalHistory(req, param) {
        const results = await this.approvalService.getListApprovalHistory(param.id, req.user.id);
        return results;
    }
    async getBasicBehavior(params, req) {
        const flagSkill = req.user.flagSkill;
        const level = req.user.level;
        const companyGroupCode = req.user.companyGroupCode;
        const datas = await this.userServices.listBasicBehavior(parseInt(params.type), level, flagSkill, companyGroupCode);
        return datas;
    }
    async getProSkill(req) {
        const results = await this.userServices.getListProSkillPublicInMenu(req.user);
        return {
            department: results.departmentName,
            results: results.listProSkills,
        };
    }
    async getDepartmentGoal(query, req) {
        const { idEvaluation } = query;
        const departmentGoal = await this.userServices.getDepartmentGoal(idEvaluation, req.user.id, req.user.companyGroupCode, req.user.timeZone);
        return departmentGoal;
    }
    async checkPermission(params) {
        const { evaluationId, userId } = params;
        return await this.evaluationService.checkPermission(evaluationId, userId);
    }
    async goalsPastEvaluation(params, req) {
        const { periodIndex, type, year, evaluationPeriodId } = params;
        const userId = req.user.id;
        return await this.evaluationService.goalsPastEvaluation(type, year, periodIndex, userId, evaluationPeriodId);
    }
};
__decorate([
    (0, common_1.Inject)(user_service_1.UserService),
    __metadata("design:type", user_service_1.UserService)
], UserRoleController.prototype, "userServices", void 0);
__decorate([
    (0, common_1.Inject)(evaluation_service_1.EvaluationService),
    __metadata("design:type", evaluation_service_1.EvaluationService)
], UserRoleController.prototype, "evaluationService", void 0);
__decorate([
    (0, common_1.Inject)(approval_service_1.ApprovalService),
    __metadata("design:type", Object)
], UserRoleController.prototype, "approvalService", void 0);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: EvaluationParamDto_1.EvaluationSearchResponseDto }),
    (0, common_1.Get)('/evaluation'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.EvaluationSearchDto, Object]),
    __metadata("design:returntype", Promise)
], UserRoleController.prototype, "getData", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: EvaluationParamDto_1.EvaluationSkillCheckResponseDto }),
    (0, common_1.Get)('/evaluation-skill/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UserRoleController.prototype, "evaluationSkillCheck", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: 'string' }),
    (0, common_1.Get)('/evaluation/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, EvaluationParamDto_1.GetEvaluationDTO, Object]),
    __metadata("design:returntype", void 0)
], UserRoleController.prototype, "getEvaluation", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: EvaluationParamDto_1.EvaluationUpdateTypeResponseDto }),
    (0, common_1.Put)('/evaluation/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, EvaluationParamDto_1.EvaluationUpdateTypeDto]),
    __metadata("design:returntype", void 0)
], UserRoleController.prototype, "updateEvaluation", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: EvaluationParamDto_1.EvaluationListProSkillPublicResponseDto,
        isArray: true,
    }),
    (0, common_1.Get)('/evaluation/list-pro-skill/public'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.EvaluationProSkillDto, Object]),
    __metadata("design:returntype", void 0)
], UserRoleController.prototype, "getListProSkillPublic", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        isArray: true,
        type: EvaluationParamDto_1.GetAchievementSettingPublicResponseDto,
    }),
    (0, common_1.Get)('/evaluation/achievement/public'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.EvaluationAchievementPublicTypeDto, Object]),
    __metadata("design:returntype", void 0)
], UserRoleController.prototype, "getAchievementSettingPublic", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        isArray: true,
        type: EvaluationParamDto_1.GetAchievementSettingPublicResponseDto,
    }),
    (0, common_1.Get)('/evaluation/achievement-sub/public'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.EvaluationAchievementPublicTypeDto, Object]),
    __metadata("design:returntype", void 0)
], UserRoleController.prototype, "getAchievementSubPublic", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        isArray: true,
        type: EvaluationParamDto_1.GetAchievementSettingPublicResponseDto,
    }),
    (0, common_1.Get)('/evaluation/achievement-additional/public'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.EvaluationAchievementPublicTypeDto, Object]),
    __metadata("design:returntype", void 0)
], UserRoleController.prototype, "getAchievementAddSettingPublic", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        isArray: true,
        type: EvaluationParamDto_1.GetBasicBehaviorSkillPublicResponseDto,
    }),
    (0, common_1.Get)('/evaluation/basic-behavior-skill/public'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.EvaluationBasicBehaviorPublicTypeDto, Object]),
    __metadata("design:returntype", void 0)
], UserRoleController.prototype, "getBasicBehaviorSkillPublic", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        isArray: true,
        type: EvaluationParamDto_1.GetSettingProFormulaPublicResponseDto,
    }),
    (0, common_1.Get)('/evaluation/setting-pro-formula/public'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserRoleController.prototype, "getSettingProFormulaPublic", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: EvaluationParamDto_1.GetEvaluation810ResponseDto }),
    (0, common_1.Get)('/evaluation8-10/:id/:userId'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.Evaluation810Param, Object, Object]),
    __metadata("design:returntype", void 0)
], UserRoleController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: EvaluationParamDto_1.CreateOrUpdateEvaluationResponseDto }),
    (0, common_1.Post)('/evaluation8-10/save'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.Evaluation810SaveInfo, Object]),
    __metadata("design:returntype", void 0)
], UserRoleController.prototype, "createNewEvaluation", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: 'number' }),
    (0, common_1.Post)('/evaluation8-10/approve'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.EvaluationApproveInfo, Object]),
    __metadata("design:returntype", void 0)
], UserRoleController.prototype, "approveEvaluation", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: EvaluationParamDto_1.CreateOrUpdateEvaluationResponseDto }),
    (0, common_1.Post)('/evaluation8-10/reject'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.Evaluation810RejectInfo, Object]),
    __metadata("design:returntype", void 0)
], UserRoleController.prototype, "rejectEvaluation", null);
__decorate([
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [ApprovalHistoryResponseDto_1.ApprovalHistoryResponseDto] }),
    (0, common_1.Get)('/evaluation/:id/get-approval-history'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, IdNumberDto_1.IdNumberDto]),
    __metadata("design:returntype", Promise)
], UserRoleController.prototype, "getListApprovalHistory", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: EvaluationParamDto_1.ListBasicBehaviorResponseDto,
        isArray: true,
    }),
    (0, common_1.Get)('/evaluation/:type/list-basic-behavior'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BasicBehaviorRequest_1.TypeBasicBehavior, Object]),
    __metadata("design:returntype", Promise)
], UserRoleController.prototype, "getBasicBehavior", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: EvaluationParamDto_1.GetProSkillEvaluationItemResponseDto }),
    (0, common_1.Get)('/evaluation-criteria/list-pro-skill'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserRoleController.prototype, "getProSkill", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: EvaluationParamDto_1.GetDepartmentGoalResponseDto }),
    (0, common_1.Get)('/department-goal'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [IdNumberDto_1.IdDto, Object]),
    __metadata("design:returntype", Promise)
], UserRoleController.prototype, "getDepartmentGoal", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: Boolean }),
    (0, common_1.Get)('/check-permission/:evaluationId/:userId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.CheckPermissionDto]),
    __metadata("design:returntype", Promise)
], UserRoleController.prototype, "checkPermission", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200, type: Boolean }),
    (0, common_1.Get)('/goals/past'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserRoleController.prototype, "goalsPastEvaluation", null);
UserRoleController = __decorate([
    (0, common_1.Controller)('v1/f1/user'),
    (0, Authorization_1.Authorize)(Roles_1.Roles.F1),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, swagger_1.ApiTags)(Tag_1.Tag.F1),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal Server Error' })
], UserRoleController);
exports.UserRoleController = UserRoleController;
//# sourceMappingURL=user.controller.js.map