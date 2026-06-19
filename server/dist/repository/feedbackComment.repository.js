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
exports.FeedbackCommentRepository = void 0;
const common_1 = require("@nestjs/common");
const EntityConstant_1 = require("../constant/EntityConstant");
const Feedback_1 = require("../entity/Feedback");
const User_1 = require("../entity/User");
let FeedbackCommentRepository = class FeedbackCommentRepository {
    async getUpdateTime(id) {
        return await this.feedbackCommentRepository.findOne({
            attributes: ['updatedTime'],
            where: {
                id: id,
            },
        });
    }
    async getCommentById(commentId) {
        return await this.feedbackCommentRepository.findOne({
            where: {
                id: commentId,
            },
            include: [
                { model: Feedback_1.Feedback, as: 'feedback' },
                { model: User_1.User, as: 'user' },
            ],
        });
    }
    async editComment(params) {
        return await this.feedbackCommentRepository.update({ content: params.content, createdTime: new Date() }, {
            where: { id: params.id },
        });
    }
    async deleteComment(params) {
        return await this.feedbackCommentRepository.update({
            active: 0,
        }, {
            where: {
                id: params.id,
            },
        });
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.FEEDBACK_COMMENT_ENTITY),
    __metadata("design:type", Object)
], FeedbackCommentRepository.prototype, "feedbackCommentRepository", void 0);
FeedbackCommentRepository = __decorate([
    (0, common_1.Injectable)()
], FeedbackCommentRepository);
exports.FeedbackCommentRepository = FeedbackCommentRepository;
//# sourceMappingURL=feedbackComment.repository.js.map