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
exports.GetEvaluation810ReportParam = exports.GetEvaluation810ReportDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const Roles_1 = require("../../../enum/Roles");
class GetEvaluation810ReportDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Buffer }),
    __metadata("design:type", Buffer)
], GetEvaluation810ReportDto.prototype, "buffer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '【2023年下期】ベトナム システム評価表.pdf',
    }),
    __metadata("design:type", String)
], GetEvaluation810ReportDto.prototype, "filename", void 0);
exports.GetEvaluation810ReportDto = GetEvaluation810ReportDto;
class GetEvaluation810ReportParam {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: Roles_1.Roles.F1,
    }),
    __metadata("design:type", String)
], GetEvaluation810ReportParam.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 1,
    }),
    __metadata("design:type", Number)
], GetEvaluation810ReportParam.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 1,
    }),
    __metadata("design:type", Number)
], GetEvaluation810ReportParam.prototype, "userId", void 0);
exports.GetEvaluation810ReportParam = GetEvaluation810ReportParam;
//# sourceMappingURL=GetEvaluation810ReportDto.js.map