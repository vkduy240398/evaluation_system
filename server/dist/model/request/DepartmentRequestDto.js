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
exports.DeleteDepartment = exports.RequestEditDepartmentGnw = exports.DepartmentSearchRequestDto = exports.DepartmentUpdateRequestDto = exports.DivisionSubclassRequestDTO = exports.DepartmentRequestAdd = exports.DepartmentRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class DepartmentRequestDto {
}
exports.DepartmentRequestDto = DepartmentRequestDto;
class DepartmentRequestAdd {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DepartmentRequestAdd.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DepartmentRequestAdd.prototype, "class", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DepartmentRequestAdd.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DepartmentRequestAdd.prototype, "active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DepartmentRequestAdd.prototype, "division", void 0);
exports.DepartmentRequestAdd = DepartmentRequestAdd;
class DivisionSubclassRequestDTO {
}
exports.DivisionSubclassRequestDTO = DivisionSubclassRequestDTO;
class DepartmentUpdateRequestDto {
}
exports.DepartmentUpdateRequestDto = DepartmentUpdateRequestDto;
class DepartmentSearchRequestDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DepartmentSearchRequestDto.prototype, "catergory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DepartmentSearchRequestDto.prototype, "classification", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DepartmentSearchRequestDto.prototype, "departmentCodeAndName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Object)
], DepartmentSearchRequestDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Object)
], DepartmentSearchRequestDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], DepartmentSearchRequestDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], DepartmentSearchRequestDto.prototype, "sortType", void 0);
exports.DepartmentSearchRequestDto = DepartmentSearchRequestDto;
class RequestEditDepartmentGnw {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RequestEditDepartmentGnw.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RequestEditDepartmentGnw.prototype, "divisionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RequestEditDepartmentGnw.prototype, "divisionOldId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RequestEditDepartmentGnw.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RequestEditDepartmentGnw.prototype, "oldCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RequestEditDepartmentGnw.prototype, "oldName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RequestEditDepartmentGnw.prototype, "updatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RequestEditDepartmentGnw.prototype, "uptDepName", void 0);
exports.RequestEditDepartmentGnw = RequestEditDepartmentGnw;
class DeleteDepartment {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DeleteDepartment.prototype, "updatedTime", void 0);
exports.DeleteDepartment = DeleteDepartment;
//# sourceMappingURL=DepartmentRequestDto.js.map