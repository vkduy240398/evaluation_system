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
exports.VersionBasicBehaviorSkillDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const ListBasicBehaviorSkillDto_1 = require("./ListBasicBehaviorSkillDto");
class VersionBasicBehaviorSkillDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 1,
    }),
    __metadata("design:type", Number)
], VersionBasicBehaviorSkillDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '1.0',
    }),
    __metadata("design:type", String)
], VersionBasicBehaviorSkillDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 1,
    }),
    __metadata("design:type", Number)
], VersionBasicBehaviorSkillDto.prototype, "versionMain", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 0,
    }),
    __metadata("design:type", Number)
], VersionBasicBehaviorSkillDto.prototype, "versionSub", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '1',
    }),
    __metadata("design:type", String)
], VersionBasicBehaviorSkillDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: '4',
    }),
    __metadata("design:type", Number)
], VersionBasicBehaviorSkillDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: '4',
    }),
    __metadata("design:type", Number)
], VersionBasicBehaviorSkillDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: 'Lam DucHuy',
    }),
    __metadata("design:type", String)
], VersionBasicBehaviorSkillDto.prototype, "userUpdated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '理由',
    }),
    __metadata("design:type", String)
], VersionBasicBehaviorSkillDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '2023/3/3 8:00',
    }),
    __metadata("design:type", String)
], VersionBasicBehaviorSkillDto.prototype, "publicDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '2023/3/3 8:00',
    }),
    __metadata("design:type", String)
], VersionBasicBehaviorSkillDto.prototype, "lastUpdatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '2023-05-24T03:13:30.552Z',
    }),
    __metadata("design:type", Date)
], VersionBasicBehaviorSkillDto.prototype, "updatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [ListBasicBehaviorSkillDto_1.ListBasicBehaviorSkillDto],
        description: 'List basic behavior skill',
    }),
    __metadata("design:type", Array)
], VersionBasicBehaviorSkillDto.prototype, "children", void 0);
exports.VersionBasicBehaviorSkillDto = VersionBasicBehaviorSkillDto;
//# sourceMappingURL=VersionBasicBehaviorSkillDto.js.map