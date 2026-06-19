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
exports.EvaluationDescriptionByIdDto = exports.EvaluationDescriptionQuery = exports.EvaluationDescriptionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class EvaluationDescriptionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Contend evaluation for level 8-10' }),
    __metadata("design:type", String)
], EvaluationDescriptionDto.prototype, "contentEvaluationCriteria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Content notes for level 8-10' }),
    __metadata("design:type", String)
], EvaluationDescriptionDto.prototype, "contentNotes", void 0);
exports.EvaluationDescriptionDto = EvaluationDescriptionDto;
class EvaluationDescriptionQuery {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 9 }),
    __metadata("design:type", Number)
], EvaluationDescriptionQuery.prototype, "userLevel", void 0);
exports.EvaluationDescriptionQuery = EvaluationDescriptionQuery;
class EvaluationDescriptionByIdDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2020年下期' }),
    __metadata("design:type", String)
], EvaluationDescriptionByIdDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 'Content notes for level 8-10' }),
    __metadata("design:type", Number)
], EvaluationDescriptionByIdDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [EvaluationDescriptionDto] }),
    __metadata("design:type", Array)
], EvaluationDescriptionByIdDto.prototype, "versionGuideEvaluation", void 0);
exports.EvaluationDescriptionByIdDto = EvaluationDescriptionByIdDto;
//# sourceMappingURL=EvaluationDescriptionDto.js.map