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
exports.GetUserActiveDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const setters = [
    {
        id: 2,
        employeeNumber: '0000001',
        fullName: 'User1',
        email: 'user1@geonet.co.jp',
        departmentId: 503,
        divisionId: 502,
        companyId: 2,
        active: 1,
        level: 2,
        flagSkill: 1,
        createdTime: '2023-10-09T02:50:49.710Z',
        updatedTime: '2023-10-16T06:16:16.443Z',
        department_id: 503,
        division_id: 502,
        company_id: 2,
        roles: [
            {
                id: 4,
                name: 'PRO_SKILL_APPROVAL',
                createdTime: '2023-10-09T01:34:56.074Z',
                updatedTime: '2023-10-09T01:34:56.074Z',
                Permission: {
                    userId: 2,
                    roleId: 4,
                    createdTime: '2023-10-09T02:59:25.083Z',
                    updatedTime: '2023-10-09T02:59:25.083Z',
                    user_id: 2,
                    role_id: 4,
                },
            },
            {
                id: 3,
                name: 'PRO_SKILL_SETTING',
                createdTime: '2023-10-09T01:34:56.074Z',
                updatedTime: '2023-10-09T01:34:56.074Z',
                Permission: {
                    userId: 2,
                    roleId: 3,
                    createdTime: '2023-10-09T02:59:25.083Z',
                    updatedTime: '2023-10-09T02:59:25.083Z',
                    user_id: 2,
                    role_id: 3,
                },
            },
        ],
    },
    {
        id: 3,
        employeeNumber: '0000002',
        fullName: 'User2',
        email: 'user2@geonet.co.jp',
        departmentId: 503,
        divisionId: 502,
        companyId: 2,
        active: 1,
        level: 2,
        flagSkill: 1,
        createdTime: '2023-10-09T02:50:49.710Z',
        updatedTime: '2023-10-24T03:52:29.351Z',
        department_id: 503,
        division_id: 502,
        company_id: 2,
        roles: [
            {
                id: 3,
                name: 'PRO_SKILL_SETTING',
                createdTime: '2023-10-09T01:34:56.074Z',
                updatedTime: '2023-10-09T01:34:56.074Z',
                Permission: {
                    userId: 3,
                    roleId: 3,
                    createdTime: '2023-10-24T03:52:27.411Z',
                    updatedTime: '2023-10-24T03:52:27.411Z',
                    user_id: 3,
                    role_id: 3,
                },
            },
            {
                id: 4,
                name: 'PRO_SKILL_APPROVAL',
                createdTime: '2023-10-09T01:34:56.074Z',
                updatedTime: '2023-10-09T01:34:56.074Z',
                Permission: {
                    userId: 3,
                    roleId: 4,
                    createdTime: '2023-10-24T03:52:27.411Z',
                    updatedTime: '2023-10-24T03:52:27.411Z',
                    user_id: 3,
                    role_id: 4,
                },
            },
        ],
    },
];
const approvers = [
    {
        id: 2,
        employeeNumber: '0000001',
        fullName: 'User1',
        email: 'user1@geonet.co.jp',
        departmentId: 503,
        divisionId: 502,
        companyId: 2,
        active: 1,
        level: 2,
        flagSkill: 1,
        createdTime: '2023-10-09T02:50:49.710Z',
        updatedTime: '2023-10-16T06:16:16.443Z',
        department_id: 503,
        division_id: 502,
        company_id: 2,
        roles: [
            {
                id: 4,
                name: 'PRO_SKILL_APPROVAL',
                createdTime: '2023-10-09T01:34:56.074Z',
                updatedTime: '2023-10-09T01:34:56.074Z',
                Permission: {
                    userId: 2,
                    roleId: 4,
                    createdTime: '2023-10-09T02:59:25.083Z',
                    updatedTime: '2023-10-09T02:59:25.083Z',
                    user_id: 2,
                    role_id: 4,
                },
            },
            {
                id: 3,
                name: 'PRO_SKILL_SETTING',
                createdTime: '2023-10-09T01:34:56.074Z',
                updatedTime: '2023-10-09T01:34:56.074Z',
                Permission: {
                    userId: 2,
                    roleId: 3,
                    createdTime: '2023-10-09T02:59:25.083Z',
                    updatedTime: '2023-10-09T02:59:25.083Z',
                    user_id: 2,
                    role_id: 3,
                },
            },
        ],
    },
    {
        id: 3,
        employeeNumber: '0000002',
        fullName: 'User2',
        email: 'user2@geonet.co.jp',
        departmentId: 503,
        divisionId: 502,
        companyId: 2,
        active: 1,
        level: 2,
        flagSkill: 1,
        createdTime: '2023-10-09T02:50:49.710Z',
        updatedTime: '2023-10-24T03:52:29.351Z',
        department_id: 503,
        division_id: 502,
        company_id: 2,
        roles: [
            {
                id: 3,
                name: 'PRO_SKILL_SETTING',
                createdTime: '2023-10-09T01:34:56.074Z',
                updatedTime: '2023-10-09T01:34:56.074Z',
                Permission: {
                    userId: 3,
                    roleId: 3,
                    createdTime: '2023-10-24T03:52:27.411Z',
                    updatedTime: '2023-10-24T03:52:27.411Z',
                    user_id: 3,
                    role_id: 3,
                },
            },
            {
                id: 4,
                name: 'PRO_SKILL_APPROVAL',
                createdTime: '2023-10-09T01:34:56.074Z',
                updatedTime: '2023-10-09T01:34:56.074Z',
                Permission: {
                    userId: 3,
                    roleId: 4,
                    createdTime: '2023-10-24T03:52:27.411Z',
                    updatedTime: '2023-10-24T03:52:27.411Z',
                    user_id: 3,
                    role_id: 4,
                },
            },
        ],
    },
];
class GetUserActiveDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: [], example: setters }),
    __metadata("design:type", Array)
], GetUserActiveDto.prototype, "setters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [], example: approvers }),
    __metadata("design:type", Array)
], GetUserActiveDto.prototype, "approvers", void 0);
exports.GetUserActiveDto = GetUserActiveDto;
//# sourceMappingURL=GetUserActiveDto.js.map