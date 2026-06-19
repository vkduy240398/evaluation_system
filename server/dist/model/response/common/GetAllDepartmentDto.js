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
exports.GetAllDepartmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class GetAllDepartmentDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 13 }),
    __metadata("design:type", Number)
], GetAllDepartmentDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '000014' }),
    __metadata("design:type", String)
], GetAllDepartmentDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Division 13' }),
    __metadata("design:type", String)
], GetAllDepartmentDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], GetAllDepartmentDto.prototype, "class", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], GetAllDepartmentDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], GetAllDepartmentDto.prototype, "active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], GetAllDepartmentDto.prototype, "setting", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: null }),
    __metadata("design:type", Number)
], GetAllDepartmentDto.prototype, "divisionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: null }),
    __metadata("design:type", Number)
], GetAllDepartmentDto.prototype, "groupId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2023-10-09T01:51:48.472Z' }),
    __metadata("design:type", String)
], GetAllDepartmentDto.prototype, "createdTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2023-10-12T02:47:57.835Z' }),
    __metadata("design:type", String)
], GetAllDepartmentDto.prototype, "updatedTime", void 0);
exports.GetAllDepartmentDto = GetAllDepartmentDto;
//# sourceMappingURL=GetAllDepartmentDto.js.map