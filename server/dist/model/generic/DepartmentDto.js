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
exports.DepartmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class DepartmentDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], DepartmentDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '000001' }),
    __metadata("design:type", String)
], DepartmentDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Geo System Solutions VN' }),
    __metadata("design:type", String)
], DepartmentDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], DepartmentDto.prototype, "class", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], DepartmentDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], DepartmentDto.prototype, "active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], DepartmentDto.prototype, "setting", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], DepartmentDto.prototype, "divisionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], DepartmentDto.prototype, "groupId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2023-10-26T07:17:02.142Z' }),
    __metadata("design:type", String)
], DepartmentDto.prototype, "createdTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2023-10-26T07:17:02.142Z' }),
    __metadata("design:type", String)
], DepartmentDto.prototype, "updatedTime", void 0);
exports.DepartmentDto = DepartmentDto;
//# sourceMappingURL=DepartmentDto.js.map