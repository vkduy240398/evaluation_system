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
exports.GetSettingEvaluationProByDivisionIdDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class Department {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], Department.prototype, "typeD", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], Department.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'GNW-123456: other division' }),
    __metadata("design:type", String)
], Department.prototype, "departmentName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 13 }),
    __metadata("design:type", Number)
], Department.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Department manage' }),
    __metadata("design:type", String)
], Department.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'department-roles-key-13' }),
    __metadata("design:type", String)
], Department.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, example: false }),
    __metadata("design:type", Boolean)
], Department.prototype, "isCheckedDep", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, example: false }),
    __metadata("design:type", Boolean)
], Department.prototype, "isCheckedDiv", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, example: false }),
    __metadata("design:type", Boolean)
], Department.prototype, "isCheckedGroup", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [], example: [] }),
    __metadata("design:type", Array)
], Department.prototype, "groups", void 0);
class GetSettingEvaluationProByDivisionIdDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Department] }),
    __metadata("design:type", Array)
], GetSettingEvaluationProByDivisionIdDto.prototype, "dataList", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], GetSettingEvaluationProByDivisionIdDto.prototype, "count", void 0);
exports.GetSettingEvaluationProByDivisionIdDto = GetSettingEvaluationProByDivisionIdDto;
//# sourceMappingURL=GetSettingEvaluationProByDivisionIdDto.js.map