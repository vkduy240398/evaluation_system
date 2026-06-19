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
exports.CancelVersionNotificationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CancelVersionNotificationDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1, nullable: false }),
    __metadata("design:type", Number)
], CancelVersionNotificationDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '2023-12-25T06:40:26.556Z',
        nullable: false,
    }),
    __metadata("design:type", String)
], CancelVersionNotificationDto.prototype, "updatedTime", void 0);
exports.CancelVersionNotificationDto = CancelVersionNotificationDto;
//# sourceMappingURL=CancelVersionNotificationDto.js.map