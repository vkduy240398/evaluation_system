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
exports.ManagementUserRoleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const Roles_1 = require("../../enum/Roles");
const Tag_1 = require("../../enum/Tag");
const Authorization_1 = require("../../handler/annotation/Authorization");
const FeedbackRequestDto_1 = require("../../model/request/FeedbackRequestDto");
const feedback_service_1 = require("../../services/feedback.service");
const role_guard_1 = require("../../handler/guard/role.guard");
const platform_express_1 = require("@nestjs/platform-express");
const feedbackComment_service_1 = require("../../services/feedbackComment.service");
let ManagementUserRoleController = class ManagementUserRoleController {
    constructor(feedbackService) {
        this.feedbackService = feedbackService;
    }
    async getFeedbacks(body, req) {
        return await this.feedbackService.getUserFeedbacks(body, null, null, req.user.timeZone);
    }
    async getNonRelatedFeedbacks(body) {
        return await this.feedbackService.getNonRelatedFeedbacks(body);
    }
    async addRelatedFeedbacks(originalId, body) {
        await this.feedbackService.addRelatedFeedbacks(originalId, body.ids);
    }
    async updateImpactScope(query) {
        return await this.feedbackService.updateImpactScope(query);
    }
    async updateStatus(query, req) {
        return await this.feedbackService.updateStatus(query, req.user.companyGroupCode, req.user.timeZone);
    }
    async updateFeedbackDetail(params, files, req) {
        return await this.feedbackService.updateFeedbackDetail(params, req.user.companyGroupCode, files);
    }
    async getDetailFeedback(query, req) {
        const result = await this.feedbackService.getDetailFeedback(query.id, req.user.timeZone);
        return result;
    }
    async deleteIssueRelated(query) {
        return await this.feedbackService.deleteIssueRelated(query);
    }
    async addComment(body, req) {
        const params = {
            userId: req.user.id,
            feedbackId: body.feedbackId,
            content: body.content,
            updatedTime: body.updatedTime,
        };
        return await this.feedbackService.addComment(params, 2, req.user.timeZone);
    }
    async addCommentAllRelated(body, req) {
        const params = {
            userId: req.user.id,
            feedbackId: body.feedbackId,
            content: body.content,
            updatedTime: body.updatedTime,
        };
        return await this.feedbackService.addCommentAllRelated(params, req.user.timeZone);
    }
    async getFeedbacksForExcel(body, req) {
        return await this.feedbackService.getFeedbacksForExcel(body, null, req.user.timeZone);
    }
    async downloadFile(id, fileName) {
        return await this.feedbackService.downloadAttachFile(id, fileName);
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
        return await this.feedbackCommentService.deleteComment(params, 2);
    }
};
__decorate([
    (0, common_1.Inject)(feedbackComment_service_1.FeedbackCommentService),
    __metadata("design:type", feedbackComment_service_1.FeedbackCommentService)
], ManagementUserRoleController.prototype, "feedbackCommentService", void 0);
__decorate([
    (0, common_1.Post)('/feedbacks'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FeedbackRequestDto_1.UserFeedbackSearchDto, Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "getFeedbacks", null);
__decorate([
    (0, common_1.Post)('/feedbacks/non-related'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FeedbackRequestDto_1.NonRelatedFeedbackSearchDto]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "getNonRelatedFeedbacks", null);
__decorate([
    (0, common_1.Put)('/feedbacks/:id/related'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "addRelatedFeedbacks", null);
__decorate([
    (0, common_1.Put)('/update-impact-scope'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "updateImpactScope", null);
__decorate([
    (0, common_1.Put)('/update-status'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)('/update-feedbacks'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array, Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "updateFeedbackDetail", null);
__decorate([
    (0, common_1.Get)('/get-detail-feedback'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "getDetailFeedback", null);
__decorate([
    (0, common_1.Put)('/delete-issue-related'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "deleteIssueRelated", null);
__decorate([
    (0, common_1.Post)('/add-comment'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FeedbackRequestDto_1.AddCommentFeedbackDto, Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "addComment", null);
__decorate([
    (0, common_1.Post)('/add-comment-all-related'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FeedbackRequestDto_1.AddCommentFeedbackDto, Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "addCommentAllRelated", null);
__decorate([
    (0, common_1.Post)('/feedbacks/excel'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FeedbackRequestDto_1.UserFeedbackSearchDto, Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "getFeedbacksForExcel", null);
__decorate([
    (0, common_1.Get)('/feedbacks/:id/file'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('fileName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "downloadFile", null);
__decorate([
    (0, common_1.Post)('/edit-comment'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FeedbackRequestDto_1.EditCommentFeedbackDto, Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "editComment", null);
__decorate([
    (0, common_1.Put)('/delete-comment'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FeedbackRequestDto_1.DeleteCommentFeedbackDto, Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "deleteComment", null);
ManagementUserRoleController = __decorate([
    (0, common_1.Controller)('v1/f9/system-admin'),
    (0, Authorization_1.Authorize)(Roles_1.Roles.F9),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, swagger_1.ApiTags)(Tag_1.Tag.F9),
    __metadata("design:paramtypes", [feedback_service_1.FeedbackService])
], ManagementUserRoleController);
exports.ManagementUserRoleController = ManagementUserRoleController;
//# sourceMappingURL=systemAdmin.controller.js.map