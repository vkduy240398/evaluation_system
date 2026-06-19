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
exports.DeleteSettingDTO = exports.AddUserSettingEvaluationDTO = exports.UserSettingEvaluatorSearchRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UserSettingEvaluatorSearchRequestDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 0,
    }),
    __metadata("design:type", Number)
], UserSettingEvaluatorSearchRequestDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 10,
    }),
    __metadata("design:type", Number)
], UserSettingEvaluatorSearchRequestDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: 'すべて',
    }),
    __metadata("design:type", String)
], UserSettingEvaluatorSearchRequestDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '',
        required: false,
    }),
    __metadata("design:type", String)
], UserSettingEvaluatorSearchRequestDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '',
        required: false,
    }),
    __metadata("design:type", String)
], UserSettingEvaluatorSearchRequestDto.prototype, "evaluatorName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '2023',
    }),
    __metadata("design:type", String)
], UserSettingEvaluatorSearchRequestDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 1,
    }),
    __metadata("design:type", Number)
], UserSettingEvaluatorSearchRequestDto.prototype, "periodIndex", void 0);
exports.UserSettingEvaluatorSearchRequestDto = UserSettingEvaluatorSearchRequestDto;
class AddUserSettingEvaluationDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Array,
        example: [14, 1],
    }),
    __metadata("design:type", Array)
], AddUserSettingEvaluationDTO.prototype, "selectedRowKeys", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'object',
        example: {
            periodIndex: 2,
            goals: '2023/11/22 ～ 2023/11/30',
            departmentGoals: '2023/11/22 ～ 2023/11/30',
            personalEvaluation: '2023/11/20 ～ 2023/11/29',
            divisionEvaluate: '2023/11/20 ～ 2023/11/30',
            key: 'pp7bkyfq',
            year: '2023',
            id: 8,
            checkFixed: 0,
            evaluationPeriod: '2023年下期',
            goalRecord: 7,
            evaluationRecord: 12,
            evaluationConfirmRecord: 13,
            totalRecord: 15,
            goalFixedRecord: 8,
            evaluationFixedRecord: 2,
            evaluationConfirmFixedRecord: 2,
            periodId: 8,
            goals810Time: '2023/11/22 ～ 2023/11/30',
            goals17Time: '2023/11/22 ～ 2023/11/30',
            title: '2023年下期',
            department: 'すべて',
            isSearch: true,
            current: 1,
            offset: 0,
            limit: 20,
        },
    }),
    __metadata("design:type", Object)
], AddUserSettingEvaluationDTO.prototype, "state", void 0);
exports.AddUserSettingEvaluationDTO = AddUserSettingEvaluationDTO;
class DeleteSettingDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '2023-11-23T07:45:29.913Z',
    }),
    __metadata("design:type", String)
], DeleteSettingDTO.prototype, "updateTime", void 0);
exports.DeleteSettingDTO = DeleteSettingDTO;
//# sourceMappingURL=UserSettingEvaluatorSearchRequestDto.js.map