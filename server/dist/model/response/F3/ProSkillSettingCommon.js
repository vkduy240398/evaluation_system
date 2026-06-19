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
exports.VersionDto = exports.ListPoint = exports.VersionProSkillDetail = exports.SettersAndApproversDto = exports.ProskillChildren = void 0;
const swagger_1 = require("@nestjs/swagger");
class ProskillChildren {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 13 }),
    __metadata("design:type", Number)
], ProskillChildren.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '5zmm' }),
    __metadata("design:type", String)
], ProskillChildren.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Webマーケター' }),
    __metadata("design:type", String)
], ProskillChildren.prototype, "jobType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '媒体理解' }),
    __metadata("design:type", String)
], ProskillChildren.prototype, "smallClass", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Web広告ディレクション_プランニング_' }),
    __metadata("design:type", String)
], ProskillChildren.prototype, "mediumClass", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '目的にそった効率的な広告媒体とターゲティングを提案・判断できているか。' }),
    __metadata("design:type", String)
], ProskillChildren.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 5 }),
    __metadata("design:type", Number)
], ProskillChildren.prototype, "difficulty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'ﾏｰｹﾃｨﾝｸﾞ部' }),
    __metadata("design:type", String)
], ProskillChildren.prototype, "note", void 0);
exports.ProskillChildren = ProskillChildren;
class SettersAndApproversDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], example: ['ベトナム システム', 'vo.thi.huyen.trang'] }),
    __metadata("design:type", Array)
], SettersAndApproversDto.prototype, "setters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], example: ['tran.dang.khoa', 'huynh.ngoc.hung'] }),
    __metadata("design:type", Array)
], SettersAndApproversDto.prototype, "approvers", void 0);
exports.SettersAndApproversDto = SettersAndApproversDto;
class VersionProSkillDetail {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], VersionProSkillDetail.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '215ca4c8dede7742ca1f2fd0469c6668' }),
    __metadata("design:type", Number)
], VersionProSkillDetail.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'GNW-000001' }),
    __metadata("design:type", String)
], VersionProSkillDetail.prototype, "departmentCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'department_1' }),
    __metadata("design:type", String)
], VersionProSkillDetail.prototype, "departmentName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '1.0' }),
    __metadata("design:type", String)
], VersionProSkillDetail.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], VersionProSkillDetail.prototype, "versionSub", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T09:38:07.685Z' }),
    __metadata("design:type", Date)
], VersionProSkillDetail.prototype, "publicDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], VersionProSkillDetail.prototype, "publicStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T09:38:07.685Z' }),
    __metadata("design:type", Date)
], VersionProSkillDetail.prototype, "lastUpdatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T09:38:07.685Z' }),
    __metadata("design:type", Date)
], VersionProSkillDetail.prototype, "updatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'huynh.ngoc.hung' }),
    __metadata("design:type", String)
], VersionProSkillDetail.prototype, "userUpdated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 4 }),
    __metadata("design:type", Number)
], VersionProSkillDetail.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], VersionProSkillDetail.prototype, "departmentId", void 0);
exports.VersionProSkillDetail = VersionProSkillDetail;
class ProFormula {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], ProFormula.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], ProFormula.prototype, "versionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], ProFormula.prototype, "point", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: "note" }),
    __metadata("design:type", String)
], ProFormula.prototype, "note", void 0);
class ListPoint {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], ListPoint.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], ListPoint.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], ListPoint.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 0 }),
    __metadata("design:type", String)
], ListPoint.prototype, "subVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 4 }),
    __metadata("design:type", Number)
], ListPoint.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], ListPoint.prototype, "creationUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'reason' }),
    __metadata("design:type", String)
], ListPoint.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], ListPoint.prototype, "basicMaxDifficulty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], ListPoint.prototype, "behaviorMaxWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T09:38:07.685Z' }),
    __metadata("design:type", Date)
], ListPoint.prototype, "publicDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T09:38:07.685Z' }),
    __metadata("design:type", Date)
], ListPoint.prototype, "lastUpdatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T09:38:07.685Z' }),
    __metadata("design:type", Date)
], ListPoint.prototype, "createTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T09:38:07.685Z' }),
    __metadata("design:type", Date)
], ListPoint.prototype, "updatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProFormula] }),
    __metadata("design:type", Array)
], ListPoint.prototype, "settingProFormula", void 0);
exports.ListPoint = ListPoint;
class VersionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], VersionDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'GNW-000001: Department-01' }),
    __metadata("design:type", String)
], VersionDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'huynh.ngoc.hung' }),
    __metadata("design:type", String)
], VersionDto.prototype, "userUpdated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T09:38:07.685Z' }),
    __metadata("design:type", Date)
], VersionDto.prototype, "updatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], VersionDto.prototype, "publicStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 4 }),
    __metadata("design:type", Number)
], VersionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '1.0' }),
    __metadata("design:type", String)
], VersionDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], VersionDto.prototype, "versionSub", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date, example: '2023-11-16T09:38:07.685Z' }),
    __metadata("design:type", Date)
], VersionDto.prototype, "publicDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: "reason" }),
    __metadata("design:type", String)
], VersionDto.prototype, "reason", void 0);
exports.VersionDto = VersionDto;
//# sourceMappingURL=ProSkillSettingCommon.js.map