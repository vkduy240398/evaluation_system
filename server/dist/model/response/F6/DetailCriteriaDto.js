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
exports.DetailCriteriaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const data = {
    id: 5,
    level: '1 ～ 7',
    versionId: 5,
    createdTime: '2023/10/9',
    creationUser: 1,
    publicDate: false,
    reason: 'Version is edited',
    status: 3,
    subVersion: 3,
    type: 1,
    updatedTime: '2023/10/9 17:01',
    statusName: '非公開',
    updatedBy: 'ベトナム システム',
    version: 1,
    timer: '2023-10-09T08:01:25.406Z',
    contentEvaluationCriteria: 'Contend evaluation for level 1-7',
    contentNotes: 'Content notes for level 1-7',
    lastUpdatedTime: '2023/10/6 17:21',
};
class DetailCriteriaDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, example: true }),
    __metadata("design:type", Boolean)
], DetailCriteriaDto.prototype, "isShowEdit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: data }),
    __metadata("design:type", Object)
], DetailCriteriaDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 9 }),
    __metadata("design:type", Number)
], DetailCriteriaDto.prototype, "subVersion", void 0);
exports.DetailCriteriaDto = DetailCriteriaDto;
//# sourceMappingURL=DetailCriteriaDto.js.map