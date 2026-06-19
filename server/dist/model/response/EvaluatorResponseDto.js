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
exports.Evaluation17AdditionalAchievementResponseDto = exports.Evaluation17AchievementResponseDto = exports.Evaluation17DetailResponseDto = exports.Evaluation17SkillResponseDto = exports.PublicProSkillListResponseDto = exports.DetailPublicProSkillResponseDto = exports.ProSkillApprovalHistoryResponseDto = exports.Reject17ResponseDto = exports.Approve17ResponseDto = exports.EvaluatorListResponseDto = exports.EvaluatorResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class EvaluatorResponseDto {
}
exports.EvaluatorResponseDto = EvaluatorResponseDto;
class EvaluatorListResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 20,
    }),
    __metadata("design:type", Number)
], EvaluatorListResponseDto.prototype, "counts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            dateEvaluationDepartmentEnd: '2023/11/30',
            dateEvaluationDepartmentStart: '2023/11/20',
            dateEvaluationEnd: '2023/11/29',
            dateEvaluationEndEval: null,
            dateEvaluationStart: '2023/11/20',
            dateEvaluationStartEval: null,
            departmentName: 'GNW-20002: department test 2',
            divisionName: 'GNW-10001: division test 1',
            employeeNumber: '2013788',
            evaluationId: 15,
            evaluationOrder: '2.0',
            evaluatorId: 7,
            fullName: '2013788: tran.anh.khoi',
            id: 'a41mwrtyk',
            isBool: false,
            isInActive: false,
            level: 1,
            percentPoint: null,
            periodEnd: '2024/3',
            periodStart: '2023/10',
            status: 1,
            stringStatus: '【目標】作成中',
            summaryPointEvaluator2: null,
            title: '2023年下期',
            userId: 12,
        },
    }),
    __metadata("design:type", Object)
], EvaluatorListResponseDto.prototype, "data", void 0);
exports.EvaluatorListResponseDto = EvaluatorListResponseDto;
class Approve17ResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 5,
    }),
    __metadata("design:type", Number)
], Approve17ResponseDto.prototype, "statusNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '2023-11-22T09:49:59.096Z',
    }),
    __metadata("design:type", String)
], Approve17ResponseDto.prototype, "updateTime", void 0);
exports.Approve17ResponseDto = Approve17ResponseDto;
class Reject17ResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 2,
    }),
    __metadata("design:type", Number)
], Reject17ResponseDto.prototype, "statusNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '2023-11-22T09:49:59.096Z',
    }),
    __metadata("design:type", String)
], Reject17ResponseDto.prototype, "updateTime", void 0);
exports.Reject17ResponseDto = Reject17ResponseDto;
class ProSkillApprovalHistoryResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            department: 'GNW-00001: department_thai_no_ ',
            version: '1.0',
        },
    }),
    __metadata("design:type", Object)
], ProSkillApprovalHistoryResponseDto.prototype, "info", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            approverUser: { id: 5, fullName: 'tran.dang.khoa' },
            fullName: 'tran.dang.khoa',
            id: 5,
            comment: 'as',
            createdTime: '2023-11-20T03:15:04.889Z',
            status: '承認',
        },
        isArray: true,
    }),
    __metadata("design:type", Object)
], ProSkillApprovalHistoryResponseDto.prototype, "approvalHistories", void 0);
exports.ProSkillApprovalHistoryResponseDto = ProSkillApprovalHistoryResponseDto;
class DetailPublicProSkillResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            content: '目的に対して、効果的なタイトル・説明文を提案・判断できているか。',
            difficulty: 4,
            itemId: '1icn',
            jobType: 'Webマーケター',
            mediumClass: 'Web広告ディレクション_プランニング_',
            note: 'ﾏｰｹﾃｨﾝｸﾞ部',
            smallClass: 'タイトル・説明文',
            versionId: 17,
        },
        isArray: true,
    }),
    __metadata("design:type", Object)
], DetailPublicProSkillResponseDto.prototype, "children", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: 'GNW-00001：department_thai_no_ ',
    }),
    __metadata("design:type", String)
], DetailPublicProSkillResponseDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 0,
    }),
    __metadata("design:type", Number)
], DetailPublicProSkillResponseDto.prototype, "departmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 1,
    }),
    __metadata("design:type", Number)
], DetailPublicProSkillResponseDto.prototype, "group", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 17,
    }),
    __metadata("design:type", Number)
], DetailPublicProSkillResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '2023/11/22 15:53',
    }),
    __metadata("design:type", String)
], DetailPublicProSkillResponseDto.prototype, "lastUpdatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '2023/11/20 15:07',
    }),
    __metadata("design:type", String)
], DetailPublicProSkillResponseDto.prototype, "publicDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 1,
    }),
    __metadata("design:type", Number)
], DetailPublicProSkillResponseDto.prototype, "publicStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: 'not goods',
    }),
    __metadata("design:type", String)
], DetailPublicProSkillResponseDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            approvers: ['ベトナム システム', 'tran.dang.khoa'],
            setters: ['ベトナム システム'],
        },
        isArray: true,
    }),
    __metadata("design:type", Object)
], DetailPublicProSkillResponseDto.prototype, "settersAndApprovers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 1,
    }),
    __metadata("design:type", Number)
], DetailPublicProSkillResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '2023-11-22T06:53:19.684Z',
    }),
    __metadata("design:type", String)
], DetailPublicProSkillResponseDto.prototype, "updatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: 'ベトナム システム',
    }),
    __metadata("design:type", String)
], DetailPublicProSkillResponseDto.prototype, "userUpdated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '1.0',
    }),
    __metadata("design:type", String)
], DetailPublicProSkillResponseDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 1,
    }),
    __metadata("design:type", Number)
], DetailPublicProSkillResponseDto.prototype, "versionMain", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 0,
    }),
    __metadata("design:type", Number)
], DetailPublicProSkillResponseDto.prototype, "versionSub", void 0);
exports.DetailPublicProSkillResponseDto = DetailPublicProSkillResponseDto;
class PublicProSkillListResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 1,
    }),
    __metadata("design:type", Number)
], PublicProSkillListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            department: { id: 4, code: 'GNW-00001', name: 'department_thai_no_ ' },
            id: 17,
            lastUpdatedTime: '2023/11/22 15:53',
            publicDate: '2023/11/20 15:07',
            publicStatus: 1,
            status: 1,
            subVersion: 0,
            updatedTime: '2023-11-22T06:53:19.684Z',
            user: { fullName: 'ベトナム システム' },
            version: 1,
        },
        isArray: true,
    }),
    __metadata("design:type", Object)
], PublicProSkillListResponseDto.prototype, "data", void 0);
exports.PublicProSkillListResponseDto = PublicProSkillListResponseDto;
class Evaluation17SkillResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 1,
    }),
    __metadata("design:type", Object)
], Evaluation17SkillResponseDto.prototype, "flagSkill", void 0);
exports.Evaluation17SkillResponseDto = Evaluation17SkillResponseDto;
class Evaluation17DetailResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 54,
    }),
    __metadata("design:type", Number)
], Evaluation17DetailResponseDto.prototype, "statusNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '2023-11-22T10:29:42.808Z',
    }),
    __metadata("design:type", String)
], Evaluation17DetailResponseDto.prototype, "updateTime", void 0);
exports.Evaluation17DetailResponseDto = Evaluation17DetailResponseDto;
class Evaluation17AchievementResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            id: 1,
            note: null,
            point: '1.20',
            type: 1,
            versionId: 1,
            version_id: 1,
        },
        isArray: true,
    }),
    __metadata("design:type", Object)
], Evaluation17AchievementResponseDto.prototype, "data", void 0);
exports.Evaluation17AchievementResponseDto = Evaluation17AchievementResponseDto;
class Evaluation17AdditionalAchievementResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            id: 1,
            note: null,
            point: '5.00',
            rating: 'S',
            versionId: 1,
            version_id: 1,
        },
        isArray: true,
    }),
    __metadata("design:type", Object)
], Evaluation17AdditionalAchievementResponseDto.prototype, "data", void 0);
exports.Evaluation17AdditionalAchievementResponseDto = Evaluation17AdditionalAchievementResponseDto;
//# sourceMappingURL=EvaluatorResponseDto.js.map