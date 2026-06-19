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
exports.ProSkillEvaluationItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const ListProSkillDto_1 = require("./ListProSkillDto");
class ProSkillEvaluationItemDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [ListProSkillDto_1.ListProSkillDto],
        example: [
            {
                itemId: 't9qg',
                smallClass: 'Small',
                mediumClass: 'Large',
                content: 'Description 1',
                difficulty: 3,
                note: 'Note',
                key: 't9qg',
                jobType: '1',
            },
            {
                itemId: 'lzxu',
                smallClass: 'Small',
                mediumClass: 'Large',
                content: 'Description 2',
                difficulty: 2,
                note: 'Note',
                key: 'lzxu',
                jobType: '2',
            },
        ],
    }),
    __metadata("design:type", Array)
], ProSkillEvaluationItemDto.prototype, "results", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: 'GNW-1: department 23',
    }),
    __metadata("design:type", String)
], ProSkillEvaluationItemDto.prototype, "department", void 0);
exports.ProSkillEvaluationItemDto = ProSkillEvaluationItemDto;
//# sourceMappingURL=ProSkillEvaluationItemDto.js.map