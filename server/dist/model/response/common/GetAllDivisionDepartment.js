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
exports.GetAllDivisionDepartmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class DepartmentDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 502 }),
    __metadata("design:type", Number)
], DepartmentDto.prototype, "divisionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'GNW-015' }),
    __metadata("design:type", String)
], DepartmentDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Division 1' }),
    __metadata("design:type", String)
], DepartmentDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'GNW-015: Division 1' }),
    __metadata("design:type", String)
], DepartmentDto.prototype, "codeName", void 0);
class GetAllDivisionDepartmentDto extends DepartmentDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [DepartmentDto],
        example: {
            id: 503,
            code: 'GNW-1234',
            name: '1234AAA',
            codeName: 'GNW-1234: 1234AAA',
        },
    }),
    __metadata("design:type", Array)
], GetAllDivisionDepartmentDto.prototype, "childrens", void 0);
exports.GetAllDivisionDepartmentDto = GetAllDivisionDepartmentDto;
//# sourceMappingURL=GetAllDivisionDepartment.js.map