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
exports.PublicVersionNotificationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PublicVersionNotificationDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    (0, class_validator_1.IsNumber)({}, { message: 'id must be a number' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'id cannot be blank' }),
    __metadata("design:type", Number)
], PublicVersionNotificationDto.prototype, "versionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 4 }),
    (0, class_validator_1.IsNumber)({}, { message: 'status must be a number' }),
    __metadata("design:type", Number)
], PublicVersionNotificationDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2023-10-30T08:03:05.247Z' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'updatedTime cannot be blank' }),
    __metadata("design:type", String)
], PublicVersionNotificationDto.prototype, "updatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PublicVersionNotificationDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PublicVersionNotificationDto.prototype, "subVersion", void 0);
exports.PublicVersionNotificationDto = PublicVersionNotificationDto;
//# sourceMappingURL=PublicVersionSettingDto.js.map