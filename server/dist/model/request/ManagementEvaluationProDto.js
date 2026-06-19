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
exports.EvaluationSearchDto = exports.UserPeriodExceptionParamDto = exports.UpdateSettingEvaluationProMultipleDto = exports.UpdateSettingEvaluationProDto = exports.UpdateGroupBodyDto = exports.UpdateGroupParamDto = exports.DeleteGroupDto = exports.CreateGroupDto = exports.GetGroupDto = exports.UpdateSettingEvaluationProParamDto = exports.IsNumberOrArray = exports.GetManagementEvaluationProByDivisionIdDto = exports.GetManagementEvaluationSkillDto = exports.GetManagementEvaluationProDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class GetManagementEvaluationProDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], GetManagementEvaluationProDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 20 }),
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetManagementEvaluationProDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetManagementEvaluationProDto.prototype, "offset", void 0);
exports.GetManagementEvaluationProDto = GetManagementEvaluationProDto;
class GetManagementEvaluationSkillDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], GetManagementEvaluationSkillDto.prototype, "skillId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, example: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    __metadata("design:type", Boolean)
], GetManagementEvaluationSkillDto.prototype, "detailed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 20 }),
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetManagementEvaluationSkillDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetManagementEvaluationSkillDto.prototype, "offset", void 0);
exports.GetManagementEvaluationSkillDto = GetManagementEvaluationSkillDto;
class GetManagementEvaluationProByDivisionIdDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], GetManagementEvaluationProByDivisionIdDto.prototype, "divisionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 20 }),
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetManagementEvaluationProByDivisionIdDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetManagementEvaluationProByDivisionIdDto.prototype, "offset", void 0);
exports.GetManagementEvaluationProByDivisionIdDto = GetManagementEvaluationProByDivisionIdDto;
let IsNumberOrArray = class IsNumberOrArray {
    validate(text, _args) {
        return typeof text === 'number' || typeof text === 'object';
    }
    defaultMessage(_args) {
        return '($value) must be number or array';
    }
};
IsNumberOrArray = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'string-or-number', async: false })
], IsNumberOrArray);
exports.IsNumberOrArray = IsNumberOrArray;
class UpdateSettingEvaluationProParamDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], UpdateSettingEvaluationProParamDto.prototype, "departmentId", void 0);
exports.UpdateSettingEvaluationProParamDto = UpdateSettingEvaluationProParamDto;
class GetGroupDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], GetGroupDto.prototype, "divisionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], GetGroupDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], GetGroupDto.prototype, "offset", void 0);
exports.GetGroupDto = GetGroupDto;
class CreateGroupDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], CreateGroupDto.prototype, "divisionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'GEO System Solutions VN' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGroupDto.prototype, "groupName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Number], example: [1, 2, 3] }),
    __metadata("design:type", Array)
], CreateGroupDto.prototype, "departmentIds", void 0);
exports.CreateGroupDto = CreateGroupDto;
class DeleteGroupDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], DeleteGroupDto.prototype, "groupId", void 0);
exports.DeleteGroupDto = DeleteGroupDto;
class UpdateGroupParamDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], UpdateGroupParamDto.prototype, "groupId", void 0);
exports.UpdateGroupParamDto = UpdateGroupParamDto;
class UpdateGroupBodyDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Test group' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGroupBodyDto.prototype, "groupName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Number], example: [1, 2] }),
    __metadata("design:type", Array)
], UpdateGroupBodyDto.prototype, "departmentIds", void 0);
exports.UpdateGroupBodyDto = UpdateGroupBodyDto;
class UpdateSettingEvaluationProDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateSettingEvaluationProDto.prototype, "divisionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Number], example: [1, 2] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateSettingEvaluationProDto.prototype, "skillSetters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Number], example: [1, 2] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateSettingEvaluationProDto.prototype, "skillApprovers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, example: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateSettingEvaluationProDto.prototype, "isCheckedDep", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, example: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateSettingEvaluationProDto.prototype, "isCheckedDiv", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, example: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateSettingEvaluationProDto.prototype, "isCheckedGroup", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateSettingEvaluationProDto.prototype, "group", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Number], example: [1, 2] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateSettingEvaluationProDto.prototype, "groups", void 0);
exports.UpdateSettingEvaluationProDto = UpdateSettingEvaluationProDto;
class UpdateSettingEvaluationProMultipleDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Number], example: [1, 2] }),
    (0, class_validator_1.Validate)(IsNumberOrArray),
    __metadata("design:type", Array)
], UpdateSettingEvaluationProMultipleDto.prototype, "departmentIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Number], example: [1, 2] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateSettingEvaluationProMultipleDto.prototype, "skillSetters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Number], example: [1, 2] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateSettingEvaluationProMultipleDto.prototype, "skillApprovers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateSettingEvaluationProMultipleDto.prototype, "divisionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, example: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateSettingEvaluationProMultipleDto.prototype, "isCheckedDep", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, example: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateSettingEvaluationProMultipleDto.prototype, "isCheckedDiv", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, example: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateSettingEvaluationProMultipleDto.prototype, "isCheckedGroup", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateSettingEvaluationProMultipleDto.prototype, "group", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Number], example: [1, 2] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateSettingEvaluationProMultipleDto.prototype, "groups", void 0);
exports.UpdateSettingEvaluationProMultipleDto = UpdateSettingEvaluationProMultipleDto;
class UserPeriodExceptionParamDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], UserPeriodExceptionParamDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], UserPeriodExceptionParamDto.prototype, "periodIndex", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UserPeriodExceptionParamDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UserPeriodExceptionParamDto.prototype, "offset", void 0);
exports.UserPeriodExceptionParamDto = UserPeriodExceptionParamDto;
class EvaluationSearchDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'offset',
        example: 0,
    }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], EvaluationSearchDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'limit',
        example: 10,
    }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], EvaluationSearchDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'sort by',
        example: 'periodStart',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluationSearchDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'sort type',
        example: 'ASC',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluationSearchDto.prototype, "sortType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'email',
        example: '',
        required: false,
    }),
    __metadata("design:type", String)
], EvaluationSearchDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'department',
        example: 'すべて',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluationSearchDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'year',
        example: '2023',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluationSearchDto.prototype, "yearDisplayCalendar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'salary rank',
        example: '1,2,3,4,5,6,7,8,9,10',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluationSearchDto.prototype, "salaryRank", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'period evaluate',
        example: '2',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluationSearchDto.prototype, "periodEvaluate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'string status',
        example: '0,1,2,3,4,5,6,7,8,49,50,51,52,53,54,55,56,57,58,59,60,61,98,99,100',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluationSearchDto.prototype, "stringStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], EvaluationSearchDto.prototype, "sortColumns", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], EvaluationSearchDto.prototype, "sortDirections", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], EvaluationSearchDto.prototype, "departmentSearch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], EvaluationSearchDto.prototype, "divisionSearch", void 0);
exports.EvaluationSearchDto = EvaluationSearchDto;
//# sourceMappingURL=ManagementEvaluationProDto.js.map