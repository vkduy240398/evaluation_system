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
exports.GetListCommonSkillDto = void 0;
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
class GetListCommonSkillDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [], example: dataSources }),
    __metadata("design:type", Array)
], GetListCommonSkillDto.prototype, "dataSources", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 2 }),
    __metadata("design:type", Object)
], GetListCommonSkillDto.prototype, "counts", void 0);
exports.GetListCommonSkillDto = GetListCommonSkillDto;
//# sourceMappingURL=GetListCommonSkillDto.js.map