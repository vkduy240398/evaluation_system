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
exports.ApprovalHistoryResponseDto = exports.ApprovalHistoryDto = exports.EvaluatorDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const Mock_1 = require("../../enum/Mock");
const EvaluationDto_1 = require("./EvaluationDto");
const UserDto_1 = require("../generic/UserDto");
class ApprovalUserDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Id of approver',
        example: 1,
    }),
    __metadata("design:type", Number)
], ApprovalUserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Full name of approver',
        example: Mock_1.Mock.fullName,
    }),
    __metadata("design:type", String)
], ApprovalUserDto.prototype, "fullName", void 0);
class EvaluatorDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Id of evaluator',
        example: 1,
    }),
    __metadata("design:type", Number)
], EvaluatorDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Full name of evaluator',
        example: Mock_1.Mock.fullName,
    }),
    __metadata("design:type", String)
], EvaluatorDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Order of evaluator',
        example: 2,
    }),
    __metadata("design:type", Number)
], EvaluatorDto.prototype, "evaluationOrder", void 0);
exports.EvaluatorDto = EvaluatorDto;
class ApprovalHistoryDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Evaluation id',
        example: 1,
    }),
    __metadata("design:type", Number)
], ApprovalHistoryDto.prototype, "evaluationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Comment of approver/receiver',
        example: Mock_1.Mock.sendBackComment,
    }),
    __metadata("design:type", String)
], ApprovalHistoryDto.prototype, "comment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Receiver order',
        example: null,
    }),
    __metadata("design:type", Number)
], ApprovalHistoryDto.prototype, "receiverOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Status of history',
        example: Mock_1.Mock.statusApprove,
    }),
    __metadata("design:type", String)
], ApprovalHistoryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'Type of history',
        example: 0,
    }),
    __metadata("design:type", Number)
], ApprovalHistoryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: ApprovalUserDto,
        description: 'Approver user',
    }),
    __metadata("design:type", ApprovalUserDto)
], ApprovalHistoryDto.prototype, "approverUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: ApprovalUserDto,
        description: 'Receiver user',
        example: null,
    }),
    __metadata("design:type", ApprovalUserDto)
], ApprovalHistoryDto.prototype, "receiverUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Date,
        description: 'Created date',
        example: Mock_1.Mock.date,
    }),
    __metadata("design:type", Date)
], ApprovalHistoryDto.prototype, "createdTime", void 0);
exports.ApprovalHistoryDto = ApprovalHistoryDto;
class ApprovalHistoryResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], ApprovalHistoryResponseDto.prototype, "approvalHistories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], ApprovalHistoryResponseDto.prototype, "evaluators", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", EvaluationDto_1.EvaluationDto)
], ApprovalHistoryResponseDto.prototype, "evaluation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", UserDto_1.UserDto)
], ApprovalHistoryResponseDto.prototype, "userDetail", void 0);
exports.ApprovalHistoryResponseDto = ApprovalHistoryResponseDto;
//# sourceMappingURL=ApprovalHistoryResponseDto.js.map