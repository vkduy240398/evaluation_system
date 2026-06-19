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
exports.VersionSetting810Dto = exports.VersionSetting810NSDto = exports.VersionSettingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const SettingPointBasicBehaviorProDto_1 = require("../generic/SettingPointBasicBehaviorProDto");
const SettingProFormulaDto_1 = require("../generic/SettingProFormulaDto");
const SettingAchievementPersonalDto_1 = require("../generic/SettingAchievementPersonalDto");
const SettingAchievementAdditionalDto_1 = require("../generic/SettingAchievementAdditionalDto");
const SettingLevelDto_1 = require("./SettingLevelDto");
const CreationUserDto_1 = require("./CreationUserDto");
class VersionSettingDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], VersionSettingDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], VersionSettingDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 2 }),
    __metadata("design:type", Number)
], VersionSettingDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], VersionSettingDto.prototype, "subVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2.0' }),
    __metadata("design:type", String)
], VersionSettingDto.prototype, "versionDisplay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 3 }),
    __metadata("design:type", Number)
], VersionSettingDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 97 }),
    __metadata("design:type", Number)
], VersionSettingDto.prototype, "creationUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '理由' }),
    __metadata("design:type", String)
], VersionSettingDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 5 }),
    __metadata("design:type", Number)
], VersionSettingDto.prototype, "basicMaxDifficulty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 10 }),
    __metadata("design:type", Number)
], VersionSettingDto.prototype, "behaviorMaxWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '' }),
    __metadata("design:type", String)
], VersionSettingDto.prototype, "publicDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2023-07-12T09:34:54.983Z' }),
    __metadata("design:type", Date)
], VersionSettingDto.prototype, "updatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '' }),
    __metadata("design:type", String)
], VersionSettingDto.prototype, "lastUpdatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", CreationUserDto_1.CreationUserDto)
], VersionSettingDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], VersionSettingDto.prototype, "companyGroupCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SettingPointBasicBehaviorProDto_1.SettingPointBasicBehaviorProDto] }),
    __metadata("design:type", Array)
], VersionSettingDto.prototype, "settingPointBasic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SettingPointBasicBehaviorProDto_1.SettingPointBasicBehaviorProDto] }),
    __metadata("design:type", Array)
], VersionSettingDto.prototype, "settingPointBehavior", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SettingPointBasicBehaviorProDto_1.SettingPointBasicBehaviorProDto] }),
    __metadata("design:type", Array)
], VersionSettingDto.prototype, "settingPointPro", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SettingProFormulaDto_1.SettingProFormulaDto] }),
    __metadata("design:type", Array)
], VersionSettingDto.prototype, "settingProFormula", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SettingAchievementPersonalDto_1.SettingAchievementPersonalDto] }),
    __metadata("design:type", Array)
], VersionSettingDto.prototype, "settingAchievementPersonalDiff", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SettingAchievementPersonalDto_1.SettingAchievementPersonalDto] }),
    __metadata("design:type", Array)
], VersionSettingDto.prototype, "settingAchievementPersonalJudgeIndex", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SettingAchievementAdditionalDto_1.SettingAchievementAdditionalDto] }),
    __metadata("design:type", Array)
], VersionSettingDto.prototype, "settingAchievementAdditional", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SettingLevelDto_1.SettingLevelDto] }),
    __metadata("design:type", Array)
], VersionSettingDto.prototype, "settingLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, example: false }),
    __metadata("design:type", Boolean)
], VersionSettingDto.prototype, "existEditingVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], VersionSettingDto.prototype, "maxPoint", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], VersionSettingDto.prototype, "minPoint", void 0);
exports.VersionSettingDto = VersionSettingDto;
class VersionSetting810NSDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], VersionSetting810NSDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], VersionSetting810NSDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 2 }),
    __metadata("design:type", Number)
], VersionSetting810NSDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], VersionSetting810NSDto.prototype, "subVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2.0' }),
    __metadata("design:type", String)
], VersionSetting810NSDto.prototype, "versionDisplay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 3 }),
    __metadata("design:type", Number)
], VersionSetting810NSDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 97 }),
    __metadata("design:type", Number)
], VersionSetting810NSDto.prototype, "creationUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '理由' }),
    __metadata("design:type", String)
], VersionSetting810NSDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 5 }),
    __metadata("design:type", Number)
], VersionSetting810NSDto.prototype, "basicMaxDifficulty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 10 }),
    __metadata("design:type", Number)
], VersionSetting810NSDto.prototype, "behaviorMaxWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '' }),
    __metadata("design:type", String)
], VersionSetting810NSDto.prototype, "publicDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '2023-07-12T09:34:54.983Z' }),
    __metadata("design:type", Date)
], VersionSetting810NSDto.prototype, "updatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: '' }),
    __metadata("design:type", String)
], VersionSetting810NSDto.prototype, "lastUpdatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", CreationUserDto_1.CreationUserDto)
], VersionSetting810NSDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SettingPointBasicBehaviorProDto_1.SettingPointBasicBehaviorProDto] }),
    __metadata("design:type", Array)
], VersionSetting810NSDto.prototype, "settingPointBehavior", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SettingAchievementPersonalDto_1.SettingAchievementPersonalDto] }),
    __metadata("design:type", Array)
], VersionSetting810NSDto.prototype, "settingAchievementPersonalDiff", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SettingAchievementPersonalDto_1.SettingAchievementPersonalDto] }),
    __metadata("design:type", Array)
], VersionSetting810NSDto.prototype, "settingAchievementPersonalJudgeIndex", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SettingAchievementAdditionalDto_1.SettingAchievementAdditionalDto] }),
    __metadata("design:type", Array)
], VersionSetting810NSDto.prototype, "settingAchievementAdditional", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SettingLevelDto_1.SettingLevelDto] }),
    __metadata("design:type", Array)
], VersionSetting810NSDto.prototype, "settingLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], VersionSetting810NSDto.prototype, "maxPoint", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], VersionSetting810NSDto.prototype, "minPoint", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], VersionSetting810NSDto.prototype, "maxPointDep", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], VersionSetting810NSDto.prototype, "minPointDep", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'GEOVN' }),
    __metadata("design:type", String)
], VersionSetting810NSDto.prototype, "companyGroupCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SettingAchievementPersonalDto_1.SettingAchievementPersonalDto }),
    __metadata("design:type", Array)
], VersionSetting810NSDto.prototype, "settingAchievementDepDiff", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SettingAchievementPersonalDto_1.SettingAchievementPersonalDto }),
    __metadata("design:type", Array)
], VersionSetting810NSDto.prototype, "settingAchievementDepJudgeIndex", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SettingAchievementAdditionalDto_1.SettingAchievementAdditionalDto }),
    __metadata("design:type", Array)
], VersionSetting810NSDto.prototype, "settingAchievementAdditionalDep", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, example: false }),
    __metadata("design:type", Boolean)
], VersionSetting810NSDto.prototype, "isHaveEditRecord", void 0);
exports.VersionSetting810NSDto = VersionSetting810NSDto;
class VersionSetting810Dto extends VersionSetting810NSDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SettingPointBasicBehaviorProDto_1.SettingPointBasicBehaviorProDto] }),
    __metadata("design:type", Array)
], VersionSetting810Dto.prototype, "settingPointBasic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SettingPointBasicBehaviorProDto_1.SettingPointBasicBehaviorProDto] }),
    __metadata("design:type", Array)
], VersionSetting810Dto.prototype, "settingPointPro", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SettingProFormulaDto_1.SettingProFormulaDto] }),
    __metadata("design:type", Array)
], VersionSetting810Dto.prototype, "settingProFormula", void 0);
exports.VersionSetting810Dto = VersionSetting810Dto;
//# sourceMappingURL=VersionSettingDto.js.map