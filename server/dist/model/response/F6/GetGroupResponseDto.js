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
exports.GetGroupResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class GroupDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 341 }),
    __metadata("design:type", Number)
], GroupDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '000341: Group 41' }),
    __metadata("design:type", String)
], GroupDto.prototype, "groupName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Number], example: [277, 299] }),
    __metadata("design:type", Array)
], GroupDto.prototype, "departmentIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '000277: Department 177、000299: Department 199',
    }),
    __metadata("design:type", String)
], GroupDto.prototype, "departmentArrString", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'group-data-table-key-0' }),
    __metadata("design:type", String)
], GroupDto.prototype, "key", void 0);
class GetGroupResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [GroupDto] }),
    __metadata("design:type", Array)
], GetGroupResponseDto.prototype, "results", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 2 }),
    __metadata("design:type", Number)
], GetGroupResponseDto.prototype, "count", void 0);
exports.GetGroupResponseDto = GetGroupResponseDto;
//# sourceMappingURL=GetGroupResponseDto.js.map