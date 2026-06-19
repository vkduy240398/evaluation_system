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
exports.ConflictPublicVersionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const ResponseDto_1 = require("../ResponseDto");
const common_1 = require("@nestjs/common");
class ConflictPublicVersionDto extends ResponseDto_1.ResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: common_1.HttpStatus.CONFLICT }),
    __metadata("design:type", Number)
], ConflictPublicVersionDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Date invalid' }),
    __metadata("design:type", String)
], ConflictPublicVersionDto.prototype, "message", void 0);
exports.ConflictPublicVersionDto = ConflictPublicVersionDto;
//# sourceMappingURL=ConflictPublicVersionDto.js.map