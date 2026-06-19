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
exports.GetData810Dto = void 0;
const swagger_1 = require("@nestjs/swagger");
const additionals = [
    {
        id: 3000,
        versionId: 300,
        rating: '10.1',
        point: '10.00',
        note: 'note',
        version_id: 300,
    },
    {
        id: 2999,
        versionId: 300,
        rating: '9.1',
        point: '9.00',
        note: 'note',
        version_id: 300,
    },
];
const totalPoints = [
    {
        id: 1500,
        versionId: 300,
        point: '10.00',
        result: '10',
        note: 'note',
    },
    {
        id: 1499,
        versionId: 300,
        point: '9.00',
        result: '9',
        note: 'note',
    },
];
const data = {
    id: 300,
    type: 2,
    version: 10,
    subVersion: 0,
    status: 4,
    creationUser: 1,
    reason: 'type 2 reason 2018',
    basicMaxDifficulty: 10,
    behaviorMaxWeight: 10,
    publicDate: '2018/7/26',
    lastUpdatedTime: null,
    createdTime: '2023-10-26T07:11:50.335Z',
    updatedTime: '2018-07-26T10:46:02.492Z',
    creation_user: 1,
    user: {
        id: 1,
        employeeNumber: '2004045',
        fullName: 'ベトナム システム',
        email: 'vietnam.system@geonet.co.jp',
        departmentId: 503,
        divisionId: 502,
        companyId: 1,
        active: 1,
        level: 9,
        flagSkill: 1,
        createdTime: '2023-10-09T01:34:57.067Z',
        updatedTime: '2023-10-13T09:10:43.818Z',
        department_id: 503,
        division_id: 502,
        company_id: 1,
    },
};
class Additional {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], Additional.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], Additional.prototype, "versionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], Additional.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], Additional.prototype, "point", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], Additional.prototype, "note", void 0);
class TotalPoint {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], TotalPoint.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], TotalPoint.prototype, "versionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], TotalPoint.prototype, "point", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], TotalPoint.prototype, "result", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], TotalPoint.prototype, "note", void 0);
class GetData810Dto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [], example: [] }),
    __metadata("design:type", Array)
], GetData810Dto.prototype, "goals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Additional], example: additionals }),
    __metadata("design:type", Array)
], GetData810Dto.prototype, "additional", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TotalPoint], example: totalPoints }),
    __metadata("design:type", Array)
], GetData810Dto.prototype, "totalPoint", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: data }),
    __metadata("design:type", Object)
], GetData810Dto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, example: true }),
    __metadata("design:type", Boolean)
], GetData810Dto.prototype, "isHaveEditRecord", void 0);
exports.GetData810Dto = GetData810Dto;
//# sourceMappingURL=GetData810Dto.js.map