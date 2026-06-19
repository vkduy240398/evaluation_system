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
exports.VersionNotificationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const CreationUserDto_1 = require("./CreationUserDto");
class VersionNotificationDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], VersionNotificationDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 2 }),
    __metadata("design:type", Number)
], VersionNotificationDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], VersionNotificationDto.prototype, "subVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2.0' }),
    __metadata("design:type", String)
], VersionNotificationDto.prototype, "versionDisplay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 3 }),
    __metadata("design:type", Number)
], VersionNotificationDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 97 }),
    __metadata("design:type", Number)
], VersionNotificationDto.prototype, "creationUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '理由' }),
    __metadata("design:type", String)
], VersionNotificationDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '長所: JavaScript はクライアント側で広く使用されているため、Node.js を使用してサーバー側で JavaScript を使用すると、統一言語によるフルスタック開発が可能になります。 イベント駆動型のノンブロッキング I/O モデルで知られており、多数の同時接続の処理に適しています。',
    }),
    __metadata("design:type", String)
], VersionNotificationDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '' }),
    __metadata("design:type", String)
], VersionNotificationDto.prototype, "publicDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2023-07-12T09:34:54.983Z' }),
    __metadata("design:type", Date)
], VersionNotificationDto.prototype, "updatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '' }),
    __metadata("design:type", String)
], VersionNotificationDto.prototype, "lastUpdatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", CreationUserDto_1.CreationUserDto)
], VersionNotificationDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, example: false }),
    __metadata("design:type", Boolean)
], VersionNotificationDto.prototype, "existEditingVersion", void 0);
exports.VersionNotificationDto = VersionNotificationDto;
//# sourceMappingURL=VersionNotificationDto.js.map