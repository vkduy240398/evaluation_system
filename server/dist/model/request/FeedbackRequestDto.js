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
exports.DeleteCommentFeedbackDto = exports.EditCommentFeedbackDto = exports.AddCommentFeedbackDto = exports.NonRelatedFeedbackSearchDto = exports.FeedbackCreateDto = exports.UserFeedbackSearchDto = exports.ListFeedbackDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const FeedbackType_1 = require("../../enum/FeedbackType");
const FeedbackStatus_1 = require("../../enum/FeedbackStatus");
const class_transformer_1 = require("class-transformer");
const FeedbackPhase_1 = require("../../enum/FeedbackPhase");
class ListFeedbackDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListFeedbackDto.prototype, "dateStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListFeedbackDto.prototype, "dateEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListFeedbackDto.prototype, "typeFeedback", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListFeedbackDto.prototype, "statusFeedback", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListFeedbackDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListFeedbackDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], ListFeedbackDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], ListFeedbackDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListFeedbackDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.Matches)('ASC|DESC'),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListFeedbackDto.prototype, "sortType", void 0);
exports.ListFeedbackDto = ListFeedbackDto;
class UserFeedbackSearchDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UserFeedbackSearchDto.prototype, "dates", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(FeedbackType_1.FeedbackType),
    (0, class_transformer_1.Transform)(({ value }) => FeedbackType_1.FeedbackType[value]),
    __metadata("design:type", Number)
], UserFeedbackSearchDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UserFeedbackSearchDto.prototype, "phase", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], UserFeedbackSearchDto.prototype, "feature", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(FeedbackStatus_1.FeedbackStatus),
    (0, class_transformer_1.Transform)(({ value }) => FeedbackStatus_1.FeedbackStatus[value]),
    __metadata("design:type", Number)
], UserFeedbackSearchDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UserFeedbackSearchDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UserFeedbackSearchDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserFeedbackSearchDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UserFeedbackSearchDto.prototype, "impactScope", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserFeedbackSearchDto.prototype, "keywork", void 0);
exports.UserFeedbackSearchDto = UserFeedbackSearchDto;
class FeedbackCreateDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FeedbackCreateDto.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEnum)(FeedbackType_1.FeedbackType),
    (0, class_transformer_1.Transform)(({ value }) => FeedbackType_1.FeedbackType[value]),
    __metadata("design:type", Number)
], FeedbackCreateDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEnum)(FeedbackPhase_1.FeedbackPhase),
    (0, class_transformer_1.Transform)(({ value }) => FeedbackPhase_1.FeedbackPhase[value]),
    __metadata("design:type", Number)
], FeedbackCreateDto.prototype, "phase", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FeedbackCreateDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeedbackCreateDto.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FeedbackCreateDto.prototype, "detail", void 0);
exports.FeedbackCreateDto = FeedbackCreateDto;
class NonRelatedFeedbackSearchDto {
}
exports.NonRelatedFeedbackSearchDto = NonRelatedFeedbackSearchDto;
class AddCommentFeedbackDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddCommentFeedbackDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AddCommentFeedbackDto.prototype, "feedbackId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddCommentFeedbackDto.prototype, "updatedTime", void 0);
exports.AddCommentFeedbackDto = AddCommentFeedbackDto;
class EditCommentFeedbackDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EditCommentFeedbackDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EditCommentFeedbackDto.prototype, "commentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EditCommentFeedbackDto.prototype, "updatedTime", void 0);
exports.EditCommentFeedbackDto = EditCommentFeedbackDto;
class DeleteCommentFeedbackDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DeleteCommentFeedbackDto.prototype, "commentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeleteCommentFeedbackDto.prototype, "updatedTime", void 0);
exports.DeleteCommentFeedbackDto = DeleteCommentFeedbackDto;
//# sourceMappingURL=FeedbackRequestDto.js.map