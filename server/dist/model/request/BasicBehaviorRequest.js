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
exports.BasicBehaviorSearchDto = exports.TypeBasicBehavior = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class TypeBasicBehavior {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], TypeBasicBehavior.prototype, "type", void 0);
exports.TypeBasicBehavior = TypeBasicBehavior;
class BasicBehaviorSearchDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Object)
], BasicBehaviorSearchDto.prototype, "offset", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 20 }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Object)
], BasicBehaviorSearchDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'version' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], BasicBehaviorSearchDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'DESC' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], BasicBehaviorSearchDto.prototype, "sortType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], BasicBehaviorSearchDto.prototype, "basicBehavior", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], BasicBehaviorSearchDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, example: false }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], BasicBehaviorSearchDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 2 }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], BasicBehaviorSearchDto.prototype, "flagSkill", void 0);
exports.BasicBehaviorSearchDto = BasicBehaviorSearchDto;
//# sourceMappingURL=BasicBehaviorRequest.js.map