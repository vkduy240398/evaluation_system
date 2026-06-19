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
exports.ListEvaluationItemHistoryRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ListEvaluationItemHistoryRequestDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'すべて' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListEvaluationItemHistoryRequestDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'すべて' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListEvaluationItemHistoryRequestDto.prototype, "publicStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'すべて' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListEvaluationItemHistoryRequestDto.prototype, "skill", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Object)
], ListEvaluationItemHistoryRequestDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 20 }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Object)
], ListEvaluationItemHistoryRequestDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'periodIndex' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], ListEvaluationItemHistoryRequestDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'ASC' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], ListEvaluationItemHistoryRequestDto.prototype, "sortType", void 0);
exports.ListEvaluationItemHistoryRequestDto = ListEvaluationItemHistoryRequestDto;
//# sourceMappingURL=ListEvaluationItemHistoryRequestDto.js.map