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
exports.GetHistoryApproveContentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const console_1 = require("console");
const datas = [
    {
        approverUser: {
            id: 4,
            fullName: 'User3',
        },
        createdTime: '2023-10-20T08:05:57.677Z',
        comment: 'asfsaf',
        status: '公開',
    },
    {
        approverUser: {
            id: 4,
            fullName: 'User3',
        },
        createdTime: '2023-10-20T08:05:01.993Z',
        comment: 'hah',
        status: '承認',
    },
];
class Info {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '1.0' }),
    __metadata("design:type", String)
], Info.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '000299: Department 199' }),
    __metadata("design:type", String)
], Info.prototype, "department", void 0);
class GetHistoryApproveContentDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: console_1.info }),
    __metadata("design:type", Info)
], GetHistoryApproveContentDto.prototype, "info", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [], example: datas }),
    __metadata("design:type", Array)
], GetHistoryApproveContentDto.prototype, "approvalHistories", void 0);
exports.GetHistoryApproveContentDto = GetHistoryApproveContentDto;
//# sourceMappingURL=GetHistoryApproveContentDto.js.map