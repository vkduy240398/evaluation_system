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
exports.DetailEvaluationItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const dataSources = [
    {
        key: 1602,
        level: null,
        versionNo: '23.0',
        state: '公開中',
        updatedBy: 'ベトナム システム',
        updatedAt: '2023-11-20T02:37:40.173Z',
        releasedDate: '2023/11/20 11:37',
        status: 4,
        type: 1,
        lastUpdatedTime: '2023/11/20 11:37',
    },
    {
        key: 1601,
        level: null,
        versionNo: '22.0',
        state: '非公開',
        updatedBy: 'ベトナム システム',
        updatedAt: '2023-11-20T02:37:40.166Z',
        releasedDate: null,
        status: 3,
        type: 1,
        lastUpdatedTime: '2023/11/20 11:37',
    },
];
const listPoints = [
    {
        value: 1,
        label: 1,
    },
    {
        value: 2,
        label: 2,
    },
];
class DetailEvaluationItemDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [], example: dataSources }),
    __metadata("design:type", Array)
], DetailEvaluationItemDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 9 }),
    __metadata("design:type", Number)
], DetailEvaluationItemDto.prototype, "subVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [], example: listPoints }),
    __metadata("design:type", Array)
], DetailEvaluationItemDto.prototype, "listPoints", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, example: false }),
    __metadata("design:type", Boolean)
], DetailEvaluationItemDto.prototype, "edited", void 0);
exports.DetailEvaluationItemDto = DetailEvaluationItemDto;
//# sourceMappingURL=DetailEvaluationItemDto.js.map