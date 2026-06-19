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
exports.FeedbackCommentService = void 0;
const common_1 = require("@nestjs/common");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const feedbackComment_repository_1 = require("../repository/feedbackComment.repository");
const mail_service_1 = require("./mail.service");
const user_repository_1 = require("../repository/user.repository");
const Roles_1 = require("../enum/Roles");
const util_1 = require("../common/mail/util");
let FeedbackCommentService = class FeedbackCommentService {
    constructor() {
        this.STATUS_ADD_COMMENT = [1, 2, 4, 5];
    }
    async editComment(params) {
        const currentComment = await this.feedbackCommentRepository.getUpdateTime(params.commentId);
        if (new Date(currentComment.updatedTime).getTime() !==
            new Date(params.updatedTime).getTime()) {
            throw new RuntimeException_1.RuntimeException('Invalid time', 409);
        }
        const result = await this.feedbackCommentRepository.getCommentById(params.commentId);
        if (result.userId === params.userId) {
            await this.feedbackCommentRepository.editComment({
                id: params.commentId,
                content: params.content,
            });
        }
        return { code: 200 };
    }
    async deleteComment(params, typeAddComment) {
        const currentUpdateTimeComment = await this.feedbackCommentRepository.getUpdateTime(params.commentId);
        if (new Date(currentUpdateTimeComment.updatedTime).getTime() !==
            new Date(params.updatedTime).getTime()) {
            throw new RuntimeException_1.RuntimeException('Invalid time', 409);
        }
        const result = await this.feedbackCommentRepository.getCommentById(params.commentId);
        if (result.userId === params.userId &&
            this.STATUS_ADD_COMMENT.includes(result.feedback.status)) {
            if (typeAddComment === 1) {
                const getListEmailSystemAdmins = await this.userRepository.getListUserWithRole(Roles_1.Roles.F9);
                const data = {
                    feedbackId: result.feedback.id,
                    listFullName: getListEmailSystemAdmins.map((value) => value.fullName),
                    typeFeedback: result.feedback.type,
                };
                const { title, content } = await this.mailService.getSendMailDeleteComment(data, result.feedback.companyGroupCode, 1);
                (0, util_1.sendEmailsWith)(getListEmailSystemAdmins.map((value) => value.email), [], title, content);
            }
            else if (typeAddComment === 2) {
                const getUserCreatedFeedback = await this.userRepository.getUserInforById(result.feedback.userId);
                if (getUserCreatedFeedback.active === 1) {
                    const data = {
                        feedbackId: result.feedback.id,
                        listFullName: [getUserCreatedFeedback.fullName],
                        typeFeedback: result.feedback.type,
                    };
                    const { title, content } = await this.mailService.getSendMailDeleteComment(data, result.feedback.companyGroupCode, 2);
                    (0, util_1.sendEmailsWith)([getUserCreatedFeedback.email], [], title, content);
                }
            }
            await this.feedbackCommentRepository.deleteComment({
                id: params.commentId,
            });
            return { code: 200 };
        }
    }
};
__decorate([
    (0, common_1.Inject)(feedbackComment_repository_1.FeedbackCommentRepository),
    __metadata("design:type", Object)
], FeedbackCommentService.prototype, "feedbackCommentRepository", void 0);
__decorate([
    (0, common_1.Inject)(mail_service_1.MailService),
    __metadata("design:type", mail_service_1.MailService)
], FeedbackCommentService.prototype, "mailService", void 0);
__decorate([
    (0, common_1.Inject)(user_repository_1.UserRepository),
    __metadata("design:type", Object)
], FeedbackCommentService.prototype, "userRepository", void 0);
FeedbackCommentService = __decorate([
    (0, common_1.Injectable)()
], FeedbackCommentService);
exports.FeedbackCommentService = FeedbackCommentService;
//# sourceMappingURL=feedbackComment.service.js.map