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
exports.ListProSKillVersionRequestDto = exports.ProSKillVersionRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ProSKillVersionRequestDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'category',
        example: 'department',
    }),
    __metadata("design:type", String)
], ProSKillVersionRequestDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'departmentId',
        example: 1,
    }),
    __metadata("design:type", Number)
], ProSKillVersionRequestDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'limit',
        example: 5,
    }),
    __metadata("design:type", Number)
], ProSKillVersionRequestDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'offset',
        example: 1,
    }),
    __metadata("design:type", Number)
], ProSKillVersionRequestDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'publicStatus',
        example: 1,
    }),
    __metadata("design:type", Number)
], ProSKillVersionRequestDto.prototype, "publicStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'status',
        example: 1,
    }),
    __metadata("design:type", Number)
], ProSKillVersionRequestDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'skillId',
        example: 1,
    }),
    __metadata("design:type", Number)
], ProSKillVersionRequestDto.prototype, "skillId", void 0);
exports.ProSKillVersionRequestDto = ProSKillVersionRequestDto;
class ListProSKillVersionRequestDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'category',
        example: 'department',
    }),
    __metadata("design:type", String)
], ListProSKillVersionRequestDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'skillId',
        example: 1,
    }),
    __metadata("design:type", Number)
], ListProSKillVersionRequestDto.prototype, "skillId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'limit',
        example: 5,
    }),
    __metadata("design:type", Number)
], ListProSKillVersionRequestDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'offset',
        example: 1,
    }),
    __metadata("design:type", Number)
], ListProSKillVersionRequestDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'publicStatus',
        example: 1,
    }),
    __metadata("design:type", Number)
], ListProSKillVersionRequestDto.prototype, "publicStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'status',
        example: 1,
    }),
    __metadata("design:type", String)
], ListProSKillVersionRequestDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'type',
        example: 1,
    }),
    __metadata("design:type", String)
], ListProSKillVersionRequestDto.prototype, "type", void 0);
exports.ListProSKillVersionRequestDto = ListProSKillVersionRequestDto;
//# sourceMappingURL=ProSkillSetingRequestDto.js.map