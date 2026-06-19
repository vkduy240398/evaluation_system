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
exports.FindListEvaluationItemHistoryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const datas = [
    {
        id: 18314,
        version: 11,
        subVersion: 1,
        departmentId: 13,
        status: 1,
        creationUser: 1,
        reason: 'haha',
        publicStatus: 0,
        publicDate: null,
        lastUpdatedTime: '2023/11/22 16:25',
        createdTime: '2023-10-09T07:21:58.472Z',
        updatedTime: '2023-11-22T07:39:48.250Z',
        department_id: 13,
        creation_user: 1,
        department: {
            id: 13,
            code: '000014',
            name: 'Division 13',
        },
        user: {
            id: 1,
            employeeNumber: '2004045',
            fullName: 'ベトナム システム',
        },
    },
    {
        id: 12414,
        version: 10,
        subVersion: 0,
        departmentId: 13,
        status: 4,
        creationUser: 1,
        reason: null,
        publicStatus: 1,
        publicDate: '2023/10/16 13:55',
        lastUpdatedTime: '2023/10/09 16:21',
        createdTime: '2023-10-09T07:21:58.472Z',
        updatedTime: '2023-10-16T04:55:49.990Z',
        department_id: 13,
        creation_user: 1,
        department: {
            id: 13,
            code: '000014',
            name: 'Division 13',
        },
        user: {
            id: 1,
            employeeNumber: '2004045',
            fullName: 'ベトナム システム',
        },
    },
];
class FindListEvaluationItemHistoryDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [], example: datas }),
    __metadata("design:type", Array)
], FindListEvaluationItemHistoryDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 2 }),
    __metadata("design:type", Number)
], FindListEvaluationItemHistoryDto.prototype, "counts", void 0);
exports.FindListEvaluationItemHistoryDto = FindListEvaluationItemHistoryDto;
//# sourceMappingURL=FindListEvaluationItemHistoryDto.js.map