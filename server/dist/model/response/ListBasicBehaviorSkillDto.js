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
exports.ListBasicBehaviorSkillDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ListBasicBehaviorSkillDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: 'item1',
    }),
    __metadata("design:type", String)
], ListBasicBehaviorSkillDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 1,
    }),
    __metadata("design:type", Number)
], ListBasicBehaviorSkillDto.prototype, "versionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '企画_戦略_',
    }),
    __metadata("design:type", String)
], ListBasicBehaviorSkillDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: 'Web広告のプランニング/実行/検証/改善・Web広告制作物のディレクション・広告効果分析による示唆/改善案の立案・外部折衝によるコストパフォーマンスの向上・デジタルマーケティングノウハウの蓄積',
    }),
    __metadata("design:type", String)
], ListBasicBehaviorSkillDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 3,
    }),
    __metadata("design:type", Number)
], ListBasicBehaviorSkillDto.prototype, "difficulty", void 0);
exports.ListBasicBehaviorSkillDto = ListBasicBehaviorSkillDto;
//# sourceMappingURL=ListBasicBehaviorSkillDto.js.map