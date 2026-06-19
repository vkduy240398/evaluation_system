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
exports.ResultsHistoryApproved = exports.VersionProSkillDepartment = exports.ResultsApproved = exports.DetailProSkillApproved = exports.ListVersionPublicDto = exports.VersionProSkillDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const ListProSkillDto_1 = require("./ListProSkillDto");
class VersionProSkillDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 1,
    }),
    __metadata("design:type", Number)
], VersionProSkillDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '1.0',
    }),
    __metadata("design:type", String)
], VersionProSkillDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 1,
    }),
    __metadata("design:type", Number)
], VersionProSkillDto.prototype, "versionMain", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 0,
    }),
    __metadata("design:type", Number)
], VersionProSkillDto.prototype, "versionSub", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '00921: 経理1課',
    }),
    __metadata("design:type", String)
], VersionProSkillDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: 'skill 1',
    }),
    __metadata("design:type", String)
], VersionProSkillDto.prototype, "skill", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '00001: 経理2課',
    }),
    __metadata("design:type", String)
], VersionProSkillDto.prototype, "division", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '00001: 経理1課, 00002: 経理2課',
    }),
    __metadata("design:type", String)
], VersionProSkillDto.prototype, "listDepartment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 0,
    }),
    __metadata("design:type", Number)
], VersionProSkillDto.prototype, "departmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: '4',
    }),
    __metadata("design:type", Number)
], VersionProSkillDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: 'Lam DucHuy',
    }),
    __metadata("design:type", String)
], VersionProSkillDto.prototype, "userUpdated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '理由',
    }),
    __metadata("design:type", String)
], VersionProSkillDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: '0: private, 1: public, 2: pending',
        example: 1,
    }),
    __metadata("design:type", Number)
], VersionProSkillDto.prototype, "publicStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '2023/3/3 8:00',
    }),
    __metadata("design:type", String)
], VersionProSkillDto.prototype, "publicDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Object,
        example: {
            setters: ['Lieu HongThai', 'Le NgocAnh'],
            approvers: ['Lieu HongThai', 'Le NgocAnh'],
        },
    }),
    __metadata("design:type", Object)
], VersionProSkillDto.prototype, "settersAndApprovers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '2023/3/3 8:00',
    }),
    __metadata("design:type", String)
], VersionProSkillDto.prototype, "lastUpdatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '2023-05-24T03:13:30.552Z',
    }),
    __metadata("design:type", Date)
], VersionProSkillDto.prototype, "updatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [ListProSkillDto_1.ListProSkillDto],
        description: 'List pro skill',
    }),
    __metadata("design:type", Array)
], VersionProSkillDto.prototype, "children", void 0);
exports.VersionProSkillDto = VersionProSkillDto;
class ListVersionPublicDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        example: 2,
    }),
    __metadata("design:type", Number)
], ListVersionPublicDto.prototype, "counts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Array,
        example: [
            {
                creationUser: 10,
                department: {
                    id: 5,
                    code: 'GNW-10001',
                    name: 'division test 1',
                    type: 1,
                },
                departmentId: 5,
                id: 16,
                lastUpdatedTime: '2023/11/16 18:58',
                publicDate: '2023/11/16 18:59',
                publicStatus: 1,
                status: 4,
                subVersion: 0,
                user: {
                    id: 10,
                    employeeNumber: '2011111',
                    fullName: 'nguyen.hoang.thien',
                },
                version: 1,
            },
        ],
    }),
    __metadata("design:type", Array)
], ListVersionPublicDto.prototype, "data", void 0);
exports.ListVersionPublicDto = ListVersionPublicDto;
class DetailProSkillApproved {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Array,
        isArray: true,
        example: [
            {
                content: 'string',
                difficulty: 1,
                itemId: 'string',
                jobType: 'string',
                mediumClass: 'string',
                note: 'string',
                smallClass: 'string',
                versionId: 1,
            },
        ],
    }),
    __metadata("design:type", Object)
], DetailProSkillApproved.prototype, "children", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DetailProSkillApproved.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DetailProSkillApproved.prototype, "departmentActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DetailProSkillApproved.prototype, "lastUpdatedTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], DetailProSkillApproved.prototype, "listSettersAndApprovers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DetailProSkillApproved.prototype, "publicDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DetailProSkillApproved.prototype, "publicStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DetailProSkillApproved.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DetailProSkillApproved.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DetailProSkillApproved.prototype, "updated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DetailProSkillApproved.prototype, "userUpdated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DetailProSkillApproved.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DetailProSkillApproved.prototype, "versionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DetailProSkillApproved.prototype, "versionMain", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DetailProSkillApproved.prototype, "versionSub", void 0);
exports.DetailProSkillApproved = DetailProSkillApproved;
class ResultsApproved {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ResultsApproved.prototype, "result", void 0);
exports.ResultsApproved = ResultsApproved;
class VersionProSkillDepartment {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Object,
        example: [
            {
                department: { id: 1, code: '123', name: 'string' },
                id: 1,
                lastUpdatedTime: '2023/11/16 18:36',
                publicDate: '2023/11/16 18:38',
                publicStatus: 1,
                status: 1,
                subVersion: 1,
                updatedTime: '2023-11-16T09:38:07.685Z',
                user: { fullName: 'huynh.ngoc.hung' },
                version: 1,
            },
        ],
    }),
    __metadata("design:type", Array)
], VersionProSkillDepartment.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], VersionProSkillDepartment.prototype, "total", void 0);
exports.VersionProSkillDepartment = VersionProSkillDepartment;
class ResultsHistoryApproved {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Array,
        example: [
            {
                approverUser: { id: 1, fullName: 'ベトナム システム' },
                comment: null,
                createdTime: '2023-11-16T09:56:04.846Z',
                status: '公開',
            },
        ],
    }),
    __metadata("design:type", Array)
], ResultsHistoryApproved.prototype, "approvalHistories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Object,
        example: {
            department: 'GNW-20002: department test 2',
            version: '1.0',
        },
    }),
    __metadata("design:type", Object)
], ResultsHistoryApproved.prototype, "info", void 0);
exports.ResultsHistoryApproved = ResultsHistoryApproved;
//# sourceMappingURL=VersionProSkillDto.js.map