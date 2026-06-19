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
exports.EditMailTemplateObj = exports.GetMailTemplateListDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
class GetMailTemplateListDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '',
    }),
    __metadata("design:type", String)
], GetMailTemplateListDTO.prototype, "name", void 0);
exports.GetMailTemplateListDTO = GetMailTemplateListDTO;
class EditMailTemplateObj {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 1,
    }),
    __metadata("design:type", Number)
], EditMailTemplateObj.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '',
    }),
    __metadata("design:type", String)
], EditMailTemplateObj.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '',
    }),
    __metadata("design:type", String)
], EditMailTemplateObj.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '',
    }),
    __metadata("design:type", String)
], EditMailTemplateObj.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '',
    }),
    __metadata("design:type", String)
], EditMailTemplateObj.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Object,
        example: {
            active: 1,
            days: [0, 1, 2],
        },
    }),
    __metadata("design:type", Object)
], EditMailTemplateObj.prototype, "setting", void 0);
exports.EditMailTemplateObj = EditMailTemplateObj;
//# sourceMappingURL=MailManagementDto.js.map