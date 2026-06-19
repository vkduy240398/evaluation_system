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
exports.SaveDraftEvaluationItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class SaveDraftEvaluationItemDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Tran LeHaNam' }),
    __metadata("design:type", String)
], SaveDraftEvaluationItemDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], SaveDraftEvaluationItemDto.prototype, "versionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2023-10-26T07:17:02.142Z' }),
    __metadata("design:type", String)
], SaveDraftEvaluationItemDto.prototype, "timer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], SaveDraftEvaluationItemDto.prototype, "subVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], SaveDraftEvaluationItemDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], SaveDraftEvaluationItemDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2023-10-26T07:17:02.142Z' }),
    __metadata("design:type", String)
], SaveDraftEvaluationItemDto.prototype, "lastUpdatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, example: true }),
    __metadata("design:type", Boolean)
], SaveDraftEvaluationItemDto.prototype, "edited", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], SaveDraftEvaluationItemDto.prototype, "code", void 0);
exports.SaveDraftEvaluationItemDto = SaveDraftEvaluationItemDto;
//# sourceMappingURL=SaveDraftEvaluationItemDto.js.map