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
exports.FindListEvaluationCriteriaHistoryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const datas = [
    {
        id: 101,
        type: 1,
        version: 10,
        subVersion: 9,
        status: 3,
        creationUser: 1,
        reason: 'Version is edited',
        contentEvaluationCriteria: 'Contend evaluation for level 1-7',
        contentNotes: 'Content notes for level 1-7',
        publicDate: null,
        lastUpdatedTime: '2023/10/6 17:21',
        createdTime: '2023-10-09T02:54:44.246Z',
        updatedTime: '2023-10-09T08:01:25.406Z',
        creation_user: 1,
        user: {
            id: 1,
            employeeNumber: '2004045',
            fullName: 'ベトナム システム',
        },
    },
    {
        id: 100,
        type: 1,
        version: 10,
        subVersion: 8,
        status: 3,
        creationUser: 1,
        reason: 'Version is edited',
        contentEvaluationCriteria: 'Contend evaluation for level 1-7',
        contentNotes: 'Content notes for level 1-7',
        publicDate: null,
        lastUpdatedTime: '2023/10/6 17:21',
        createdTime: '2023-10-09T02:54:44.165Z',
        updatedTime: '2023-10-09T08:01:25.406Z',
        creation_user: 1,
        user: {
            id: 1,
            employeeNumber: '2004045',
            fullName: 'ベトナム システム',
        },
    },
];
class FindListEvaluationCriteriaHistoryDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [], example: datas }),
    __metadata("design:type", Array)
], FindListEvaluationCriteriaHistoryDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 2 }),
    __metadata("design:type", Number)
], FindListEvaluationCriteriaHistoryDto.prototype, "counts", void 0);
exports.FindListEvaluationCriteriaHistoryDto = FindListEvaluationCriteriaHistoryDto;
//# sourceMappingURL=FindListEvaluationCriteriaHistoryDto.js.map