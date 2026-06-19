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
exports.ExportHistoryEvaluationEvaluatorDto = exports.GetListDepartmentExportEvaluationHistoryDto = exports.EvaluatorApproveStatusDto = exports.EvaluatorSearchDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class EvaluatorSearchDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], EvaluatorSearchDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], EvaluatorSearchDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluatorSearchDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluatorSearchDto.prototype, "sortType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluatorSearchDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluatorSearchDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluatorSearchDto.prototype, "evaluator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluatorSearchDto.prototype, "yearDisplayCalendar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluatorSearchDto.prototype, "salaryRank", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluatorSearchDto.prototype, "periodEvaluate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluatorSearchDto.prototype, "stringStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], EvaluatorSearchDto.prototype, "sortColumns", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], EvaluatorSearchDto.prototype, "sortDirections", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], EvaluatorSearchDto.prototype, "departmentSearch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], EvaluatorSearchDto.prototype, "divisionSearch", void 0);
exports.EvaluatorSearchDto = EvaluatorSearchDto;
class EvaluatorApproveStatusDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Comment' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluatorApproveStatusDto.prototype, "comment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EvaluatorApproveStatusDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EvaluatorApproveStatusDto.prototype, "statusReject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2023-10-26T07:17:02.142Z' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], EvaluatorApproveStatusDto.prototype, "updateTime", void 0);
exports.EvaluatorApproveStatusDto = EvaluatorApproveStatusDto;
class GetListDepartmentExportEvaluationHistoryDto {
}
__decorate([
    (0, class_validator_1.IsNumberString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetListDepartmentExportEvaluationHistoryDto.prototype, "yearEvaluate", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetListDepartmentExportEvaluationHistoryDto.prototype, "periodEvaluate", void 0);
exports.GetListDepartmentExportEvaluationHistoryDto = GetListDepartmentExportEvaluationHistoryDto;
class ExportHistoryEvaluationEvaluatorDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ExportHistoryEvaluationEvaluatorDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], ExportHistoryEvaluationEvaluatorDto.prototype, "department", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ExportHistoryEvaluationEvaluatorDto.prototype, "yearStart", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ExportHistoryEvaluationEvaluatorDto.prototype, "yearEnd", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ExportHistoryEvaluationEvaluatorDto.prototype, "periodEvaluate", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ExportHistoryEvaluationEvaluatorDto.prototype, "yearEvaluate", void 0);
exports.ExportHistoryEvaluationEvaluatorDto = ExportHistoryEvaluationEvaluatorDto;
//# sourceMappingURL=EvaluatorRequestDto.js.map