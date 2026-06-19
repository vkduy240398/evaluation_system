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
exports.CommonController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const Tag_1 = require("../../enum/Tag");
const role_guard_1 = require("../../handler/guard/role.guard");
const company_service_1 = require("../../services/company.service");
const department_service_1 = require("../../services/department.service");
const guideEvaluation_service_1 = require("../../services/guideEvaluation.service");
const role_service_1 = require("../../services/role.service");
const IdNumberDto_1 = require("../../model/request/IdNumberDto");
const report_service_1 = require("../../services/report.service");
const evaluation_service_1 = require("../../services/evaluation.service");
const evaluationPeriod_service_1 = require("../../services/evaluationPeriod.service");
const Authentication_1 = require("../../handler/annotation/Authentication");
const NotificationPeriodDto_1 = require("../../model/response/common/NotificationPeriodDto");
const EvaluationDescriptionDto_1 = require("../../model/response/common/EvaluationDescriptionDto");
const GetAllDepartmentDto_1 = require("../../model/response/common/GetAllDepartmentDto");
const GetAllDivisionDepartment_1 = require("../../model/response/common/GetAllDivisionDepartment");
const GetAllCompanyDto_1 = require("../../model/response/common/GetAllCompanyDto");
const GetAllRoleDto_1 = require("../../model/response/common/GetAllRoleDto");
const GetAllDepartmentTypeDepartmentDto_1 = require("../../model/response/common/GetAllDepartmentTypeDepartmentDto");
const VersionNotificationDto_1 = require("../../model/generic/VersionNotificationDto");
const versionNotification_service_1 = require("../../services/versionNotification.service");
const util_1 = require("../../common/util");
const feedback_service_1 = require("../../services/feedback.service");
const RuntimeException_1 = require("../../model/exception/RuntimeException");
const FeedbackRequestDto_1 = require("../../model/request/FeedbackRequestDto");
const platform_express_1 = require("@nestjs/platform-express");
const user_service_1 = require("../../services/user.service");
const EvaluationParamDto_1 = require("../../model/request/EvaluationParamDto");
const referenceReview_service_1 = require("../../services/referenceReview.service");
const ApprovalHistoryResponseDto_1 = require("../../model/response/ApprovalHistoryResponseDto");
const adminApproval_service_1 = require("../../services/adminApproval.service");
const feedbackComment_service_1 = require("../../services/feedbackComment.service");
const contentDisposition = require('content-disposition');
let CommonController = class CommonController {
    async getNotificationPeriod(req) {
        return await this.evaluationPeriodService.getNotificationPeriod(req.user.companyGroupCode, req.user.timeZone);
    }
    async getGuideEvaluation(req) {
        const flagSkill = req.user.flagSkill;
        const level = req.user.level;
        const companyGroupCode = req.user.companyGroupCode;
        const result = await this.guideEvaluationService.getGuideEvaluation(level, flagSkill, companyGroupCode);
        return result;
    }
    async getGuideEvaluationByEvaluationId(query) {
        const result = await this.evaluationService.getGuideEvaluationByEvaluationId(query.id);
        return result;
    }
    async getAllDepartment(req) {
        const results = await this.departmentService.getAllDepartment(req.user.companyGroupCode);
        return results;
    }
    async getAllDepartmentEvaluation(query, req) {
        const results = await this.evaluationService.getAllDepartmentEvaluation(query, req.user.companyGroupCode);
        return results;
    }
    async getAllDepartmentNotSetDivision(req) {
        const results = await this.departmentService.getAllDepartmentNotSetDivision(req.user.companyGroupCode);
        return results;
    }
    async getAllDepartmentTypeDepartment(req) {
        const results = await this.departmentService.getAllDepartmentTypeDepartment(req.user.companyGroupCode);
        return results;
    }
    async getAllDepartmentTypeDivision(req) {
        const results = await this.departmentService.getAllDepartmentTypeDivision(req.user.companyGroupCode);
        return results;
    }
    async getAllDepartmentByCondition(req) {
        const results = await this.departmentService.getAllDepartmentNotGroup(req.user.companyGroupCode);
        return results;
    }
    async getAllDivisionDepartment(req) {
        return await this.departmentService.getAllDivisionDepartment(req.user.companyGroupCode);
    }
    async getAllCompany() {
        const results = await this.companyService.getAllCompany();
        return results;
    }
    async getAllRole() {
        const results = await this.roleService.getAllRole();
        return results;
    }
    async getUserDivisionAndDepartment(req) {
        const results = await this.departmentService.getUserDivisionAndDepartment(req.user.userId);
        return results;
    }
    async getConditionUserList(req) {
        const divisions = await this.departmentService.getAllDivisionDepartment(req.user.companyGroupCode);
        const company = await this.companyService.getAllCompany();
        return {
            divisions: divisions || [],
            company: company || [],
        };
    }
    async exportReportPdfReview810(res, body) {
        const { role, evaluationId, userId, isEvaluatorUser, isF5 } = body;
        return await this.reportService.exportReportPdfReview810(evaluationId, res.user.id, isF5, isEvaluatorUser, false, res.user.companyGroupCode, res.user.timeZone);
    }
    async exportReportPdfReview(res, body) {
        const { id, isEvaluatorUser, isF5 } = body;
        return await this.reportService.exportReportPdfReview17(id, res.user.id, isF5, isEvaluatorUser, false, res.user.companyGroupCode, res.user.timeZone);
    }
    async exportReportPdfOnListReview(body, req) {
        const { evaluationId, role, userId, level, isF5 } = body;
        const idList = [];
        idList.push(evaluationId);
        if (level < 8) {
            return await this.reportService.exportReportPdfReview17(idList, userId, isF5, false, false, req.user.companyGroupCode, req.user.timeZone);
        }
        else {
            return await this.reportService.exportReportPdfReview810(idList, userId, isF5, false, false, req.user.companyGroupCode, req.user.timeZone);
        }
    }
    async exportReportListPdfReview(body, req) {
        const { childrenArr, role, isF5 } = body;
        const userId = req.user.id;
        const idList810 = [];
        const idList17 = [];
        const idList = [];
        childrenArr.map((child) => {
            if ([8, 9, 10].includes(child.level))
                idList810.push(child.evaluationId);
            if (child.level <= 7)
                idList17.push(child.evaluationId);
            idList.push(child.evaluationId);
        });
        if (idList810.length === childrenArr.length) {
            return this.reportService.exportReportPdfReview810(idList810, userId, isF5, role === 'user', true, req.user.companyGroupCode, req.user.timeZone);
        }
        if (idList17.length === childrenArr.length) {
            return await this.reportService.exportReportPdfReview17(idList17, userId, isF5, role === 'user', true, req.user.companyGroupCode, req.user.timeZone);
        }
        if (idList810.length !== childrenArr.length &&
            idList17.length !== childrenArr.length) {
            return await this.reportService.exportPDFMultiLevel(userId, idList17, idList810, role, isF5, req.user.companyGroupCode, req.user.timeZone);
        }
    }
    async getPublicNotification(req) {
        return await this.versionNotificationService.getPublicNotification(req.user.companyGroupCode);
    }
    async getAllSkill(req) {
        const results = await this.departmentService.getAllSkill(req.user.companyGroupCode);
        return results;
    }
    async downloadFileFromExcel(query, req) {
        const id = (0, util_1.decrypt)(query.id);
        if (id) {
            const data = await this.feedbackService.downloadFileFromExcel(id, req.user.companyGroupCode);
            return data;
        }
        else
            throw new RuntimeException_1.RuntimeException('File not found', 204);
    }
    async getFeedbacks(body, req) {
        return await this.feedbackService.getUserFeedbacks(body, req.user.userId, req.user.companyGroupCode, req.user.timeZone);
    }
    async getFeedbackById(id, req) {
        return await this.feedbackService.getUserFeedbackById(id, req.user.userId);
    }
    async createFeedback(req, body, files) {
        body['companyGroupCode'] = req.user.companyGroupCode;
        return await this.feedbackService.createFeedback(req.user.userId, body, files, req.user.companyGroupCode, req.user.timeZone);
    }
    async updateFeedback(params, files, req) {
        return await this.feedbackService.updateFeedbackWithFiles(params, req.user.companyGroupCode, req.user.id, files);
    }
    async deleteFeedbacks(ids, req) {
        await this.feedbackService.deleteUserFeedbacks(req.user.userId, ids, req.user.companyGroupCode);
    }
    async downloadFile(id, fileName, req) {
        return await this.feedbackService.downloadAttachFile(id, fileName, req.user.companyGroupCode);
    }
    async reviewEvaluationDetail(id, req) {
        return await this.userServices.getEvaluationData(id, req.user, 'false', req.user.companyGroupCode, req.user.timeZone);
    }
    async checkEvaluationSkill(id) {
        return await this.userServices.evaluationSkillCheck(id);
    }
    findOne(params, query, req) {
        const { role } = query;
        const result = this.evaluationService.findOne(params.id, Number(params.userId), 'admin', req.user.companyGroupCode);
        return result;
    }
    async getListReferenceReview(query, req) {
        const departments = query.departmentSearch;
        const salaryRanks = query.salaryRank.split(',');
        const periodArrs = ['', '上期', '下期'];
        const type = query.typeReference !== '' ? query.typeReference.split(',') : [];
        const params = {
            email: query.email || '',
            department: departments,
            salaryRank: salaryRanks,
            title: `${query.yearDisplayCalendar}年${periodArrs[query.periodEvaluate]}`,
            offset: query.offset,
            limit: query.limit,
            sortBy: query.sortBy,
            sortType: query.sortType,
            type: type,
        };
        return await this.referenceReviewService.listReferenceReview(params, req);
    }
    async getListApprovalHistory(param, query) {
        const order = (0, util_1.decrypt)((query === null || query === void 0 ? void 0 : query.order) || '');
        const results = await this.approvalService.getListApprovalHistory(param.id, 0, order ? Number(order) : 0);
        return results;
    }
    async getDetailFeedback(query, req) {
        var _a;
        const user = await this.feedbackService.getUserIdByFeedbackId(query.id);
        if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== (user === null || user === void 0 ? void 0 : user.userId)) {
            throw new RuntimeException_1.RuntimeException('Not found', common_1.HttpStatus.NOT_FOUND);
        }
        const result = await this.feedbackService.getDetailFeedback(query.id, req.user.timeZone);
        return result;
    }
    async confirmEditListUser(query) {
        return await this.feedbackService.cancelFeedback(query);
    }
    async updateFeedbackDetail(params, files, req) {
        return await this.feedbackService.updateFeedbackDetail(params, req.user.companyGroupCode, files);
    }
    async addComment(body, req) {
        const params = {
            userId: req.user.id,
            feedbackId: body.feedbackId,
            content: body.content,
            updatedTime: body.updatedTime,
            createdTime: new Date((0, util_1.isFormatDate)(new Date(), 'YYYY-M-D HH:mm:ss', req.user.timeZone)),
        };
        return await this.feedbackService.addComment(params, 1, req.user.timeZone);
    }
    async editComment(body, req) {
        const params = {
            userId: req.user.id,
            commentId: body.commentId,
            content: body.content,
            updatedTime: body.updatedTime,
        };
        return await this.feedbackCommentService.editComment(params);
    }
    async deleteComment(body, req) {
        const params = {
            userId: req.user.id,
            commentId: body.commentId,
            updatedTime: body.updatedTime,
        };
        return await this.feedbackCommentService.deleteComment(params, 1);
    }
    getBasicBehaviorSkillPublic(query, req) {
        const basicBehaviorType = query.basicBehaviorType;
        return this.userServices.getBasicBehaviorSkillPublic(basicBehaviorType, req.user.companyGroupCode, query.level);
    }
};
__decorate([
    (0, common_1.Inject)(company_service_1.CompanyService),
    __metadata("design:type", company_service_1.CompanyService)
], CommonController.prototype, "companyService", void 0);
__decorate([
    (0, common_1.Inject)(role_service_1.RoleService),
    __metadata("design:type", role_service_1.RoleService)
], CommonController.prototype, "roleService", void 0);
__decorate([
    (0, common_1.Inject)(guideEvaluation_service_1.GuideEvaluationService),
    __metadata("design:type", guideEvaluation_service_1.GuideEvaluationService)
], CommonController.prototype, "guideEvaluationService", void 0);
__decorate([
    (0, common_1.Inject)(department_service_1.DepartmentService),
    __metadata("design:type", department_service_1.DepartmentService)
], CommonController.prototype, "departmentService", void 0);
__decorate([
    (0, common_1.Inject)(report_service_1.ReportService),
    __metadata("design:type", report_service_1.ReportService)
], CommonController.prototype, "reportService", void 0);
__decorate([
    (0, common_1.Inject)(evaluation_service_1.EvaluationService),
    __metadata("design:type", evaluation_service_1.EvaluationService)
], CommonController.prototype, "evaluationService", void 0);
__decorate([
    (0, common_1.Inject)(evaluationPeriod_service_1.EvaluationPeriodService),
    __metadata("design:type", evaluationPeriod_service_1.EvaluationPeriodService)
], CommonController.prototype, "evaluationPeriodService", void 0);
__decorate([
    (0, common_1.Inject)(versionNotification_service_1.VersionNotificationService),
    __metadata("design:type", Object)
], CommonController.prototype, "versionNotificationService", void 0);
__decorate([
    (0, common_1.Inject)(feedback_service_1.FeedbackService),
    __metadata("design:type", feedback_service_1.FeedbackService)
], CommonController.prototype, "feedbackService", void 0);
__decorate([
    (0, common_1.Inject)(referenceReview_service_1.ReferenceReviewService),
    __metadata("design:type", referenceReview_service_1.ReferenceReviewService)
], CommonController.prototype, "referenceReviewService", void 0);
__decorate([
    (0, common_1.Inject)(user_service_1.UserService),
    __metadata("design:type", user_service_1.UserService)
], CommonController.prototype, "userServices", void 0);
__decorate([
    (0, common_1.Inject)(adminApproval_service_1.AdminApprovalService),
    __metadata("design:type", adminApproval_service_1.AdminApprovalService)
], CommonController.prototype, "approvalService", void 0);
__decorate([
    (0, common_1.Inject)(feedbackComment_service_1.FeedbackCommentService),
    __metadata("design:type", feedbackComment_service_1.FeedbackCommentService)
], CommonController.prototype, "feedbackCommentService", void 0);
__decorate([
    (0, common_1.Get)('/get-notification-period'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: [NotificationPeriodDto_1.NotificationPeriodDto],
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getNotificationPeriod", null);
__decorate([
    (0, common_1.Get)('/get-evaluation-description'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: EvaluationDescriptionDto_1.EvaluationDescriptionDto,
    }),
    (0, swagger_1.ApiQuery)({ type: EvaluationDescriptionDto_1.EvaluationDescriptionQuery }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getGuideEvaluation", null);
__decorate([
    (0, common_1.Get)('/get-evaluation-description-by-evaluation-id'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: EvaluationDescriptionDto_1.EvaluationDescriptionByIdDto,
    }),
    (0, swagger_1.ApiQuery)({ type: IdNumberDto_1.IdNumberDto }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getGuideEvaluationByEvaluationId", null);
__decorate([
    (0, common_1.Get)('/get-all-department'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: [GetAllDepartmentDto_1.GetAllDepartmentDto],
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getAllDepartment", null);
__decorate([
    (0, common_1.Get)('/get-all-department-evaluation'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getAllDepartmentEvaluation", null);
__decorate([
    (0, common_1.Get)('/get-all-department-not-set-division'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: [GetAllDepartmentDto_1.GetAllDepartmentDto],
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getAllDepartmentNotSetDivision", null);
__decorate([
    (0, common_1.Get)('/get-all-department-type-department'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: [GetAllDepartmentTypeDepartmentDto_1.GetAllDepartmentTypeDepartmentDto],
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getAllDepartmentTypeDepartment", null);
__decorate([
    (0, common_1.Get)('/get-all-department-type-division'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: [GetAllDepartmentDto_1.GetAllDepartmentDto],
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getAllDepartmentTypeDivision", null);
__decorate([
    (0, common_1.Get)('/get-all-department-not-group'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: [GetAllDepartmentDto_1.GetAllDepartmentDto],
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getAllDepartmentByCondition", null);
__decorate([
    (0, common_1.Get)('get-all-division-department-by-children'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: [GetAllDivisionDepartment_1.GetAllDivisionDepartmentDto],
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getAllDivisionDepartment", null);
__decorate([
    (0, common_1.Get)('/get-all-company'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: [GetAllCompanyDto_1.GetAllCompanyDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getAllCompany", null);
__decorate([
    (0, common_1.Get)('/get-all-role'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: [GetAllRoleDto_1.GetAllRoleDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getAllRole", null);
__decorate([
    (0, common_1.Get)('/get-user-division-and-department'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getUserDivisionAndDepartment", null);
__decorate([
    (0, common_1.Get)('/condition-user-list'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getConditionUserList", null);
__decorate([
    (0, common_1.Post)('/review/report/pdf/evaluation-8-10'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "exportReportPdfReview810", null);
__decorate([
    (0, common_1.Post)('/review/report/pdf/evaluation'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "exportReportPdfReview", null);
__decorate([
    (0, common_1.Post)('/review/report/list/pdf/evaluation'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "exportReportPdfOnListReview", null);
__decorate([
    (0, common_1.Post)('/review/report/pdf/list'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "exportReportListPdfReview", null);
__decorate([
    (0, common_1.Get)('/get-public-notification'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: VersionNotificationDto_1.VersionNotificationDto,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getPublicNotification", null);
__decorate([
    (0, common_1.Get)('/get-all-skill'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getAllSkill", null);
__decorate([
    (0, common_1.Get)('download-file-from-excel'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "downloadFileFromExcel", null);
__decorate([
    (0, common_1.Post)('/feedbacks'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FeedbackRequestDto_1.UserFeedbackSearchDto, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getFeedbacks", null);
__decorate([
    (0, common_1.Get)('/feedbacks/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getFeedbackById", null);
__decorate([
    (0, common_1.Post)('/feedbacks/create'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, FeedbackRequestDto_1.FeedbackCreateDto, Array]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "createFeedback", null);
__decorate([
    (0, common_1.Put)('/feedbacks'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "updateFeedback", null);
__decorate([
    (0, common_1.Delete)('/feedbacks'),
    __param(0, (0, common_1.Query)('ids')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "deleteFeedbacks", null);
__decorate([
    (0, common_1.Get)('/feedbacks/:id/file'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('fileName')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "downloadFile", null);
__decorate([
    (0, common_1.Get)('/review-evaluation/detail/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "reviewEvaluationDetail", null);
__decorate([
    (0, common_1.Get)('/evaluation-skill/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "checkEvaluationSkill", null);
__decorate([
    (0, common_1.Get)('/review-evaluation/detail810/:id/:userId'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.Evaluation810Param, Object, Object]),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('/list-reference-review'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getListReferenceReview", null);
__decorate([
    (0, common_1.Get)('/evaluation/:id/get-approval-history'),
    (0, swagger_1.ApiResponse)({ status: 200, type: ApprovalHistoryResponseDto_1.ApprovalHistoryResponseDto }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [IdNumberDto_1.IdNumberDto, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getListApprovalHistory", null);
__decorate([
    (0, common_1.Get)('/get-detail-feedback'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "getDetailFeedback", null);
__decorate([
    (0, common_1.Put)('/cancel-feedback'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "confirmEditListUser", null);
__decorate([
    (0, common_1.Put)('/update-feedbacks'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "updateFeedbackDetail", null);
__decorate([
    (0, common_1.Post)('/add-comment'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FeedbackRequestDto_1.AddCommentFeedbackDto, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "addComment", null);
__decorate([
    (0, common_1.Post)('/edit-comment'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "editComment", null);
__decorate([
    (0, common_1.Put)('/delete-comment'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "deleteComment", null);
__decorate([
    (0, common_1.Get)('/evaluation/basic-behavior-skill/public'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.EvaluationBasicBehaviorPublicTypeDto, Object]),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "getBasicBehaviorSkillPublic", null);
CommonController = __decorate([
    (0, common_1.Controller)('v1/common'),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, swagger_1.ApiTags)(Tag_1.Tag.COMMON),
    (0, Authentication_1.Public)(),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal Server Error',
    })
], CommonController);
exports.CommonController = CommonController;
//# sourceMappingURL=common.controller.js.map