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
exports.GetSettingEvaluationSkillDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class Department {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], Department.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'ER#' }),
    __metadata("design:type", String)
], Department.prototype, "name", void 0);
class User {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Username' }),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
class Skill {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], Skill.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'Skill 1' }),
    __metadata("design:type", String)
], Skill.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: User, example: [] }),
    __metadata("design:type", Array)
], Skill.prototype, "skillApprovers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: User, example: [] }),
    __metadata("design:type", Array)
], Skill.prototype, "skillSetters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Department] }),
    __metadata("design:type", Array)
], Skill.prototype, "skillDepartments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, example: 'skill-key-2' }),
    __metadata("design:type", String)
], Skill.prototype, "key", void 0);
class GetSettingEvaluationSkillDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Skill] }),
    __metadata("design:type", Array)
], GetSettingEvaluationSkillDto.prototype, "dataList", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 1 }),
    __metadata("design:type", Number)
], GetSettingEvaluationSkillDto.prototype, "count", void 0);
exports.GetSettingEvaluationSkillDto = GetSettingEvaluationSkillDto;
//# sourceMappingURL=GetSettingEvaluationSkillDto.js.map