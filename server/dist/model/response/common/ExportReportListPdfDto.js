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
exports.ExportReportListPdfDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ChildrenArr {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 30 }),
    __metadata("design:type", Number)
], ChildrenArr.prototype, "evaluationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 4 }),
    __metadata("design:type", Number)
], ChildrenArr.prototype, "level", void 0);
class ExportReportListPdfDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ChildrenArr] }),
    __metadata("design:type", Array)
], ExportReportListPdfDto.prototype, "childrenArr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'user' }),
    __metadata("design:type", String)
], ExportReportListPdfDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], ExportReportListPdfDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 4 }),
    __metadata("design:type", Number)
], ExportReportListPdfDto.prototype, "level", void 0);
exports.ExportReportListPdfDto = ExportReportListPdfDto;
//# sourceMappingURL=ExportReportListPdfDto.js.map