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
exports.SavePrivateVersionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class SavePrivateVersionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], SavePrivateVersionDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], SavePrivateVersionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], SavePrivateVersionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Contend evaluation for level 1-7' }),
    __metadata("design:type", String)
], SavePrivateVersionDto.prototype, "contentEvaluationCriteria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Content notes for level 1-7' }),
    __metadata("design:type", String)
], SavePrivateVersionDto.prototype, "contentNotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], SavePrivateVersionDto.prototype, "creationUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 'Version is edited' }),
    __metadata("design:type", String)
], SavePrivateVersionDto.prototype, "reason", void 0);
exports.SavePrivateVersionDto = SavePrivateVersionDto;
//# sourceMappingURL=SavePrivateVersionDto.js.map