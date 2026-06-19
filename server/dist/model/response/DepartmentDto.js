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
exports.ResponseFindSubDepartment = exports.SelectedDivision = exports.ListDepartmentSub = exports.ListDepartmentOracleMerge = exports.ListDepartmentOracle = exports.ResultsAddDepartment = exports.GetListDepartment = exports.GetDepartmentGnw = exports.ListDepartment = exports.GetDepartmentApproved = exports.DepartmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class DepartmentDto {
}
exports.DepartmentDto = DepartmentDto;
class GetDepartmentApproved {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetDepartmentApproved.prototype, "active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetDepartmentApproved.prototype, "class", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetDepartmentApproved.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetDepartmentApproved.prototype, "createdTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetDepartmentApproved.prototype, "divisionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetDepartmentApproved.prototype, "groupId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetDepartmentApproved.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetDepartmentApproved.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetDepartmentApproved.prototype, "setting", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetDepartmentApproved.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetDepartmentApproved.prototype, "updatedTime", void 0);
exports.GetDepartmentApproved = GetDepartmentApproved;
class ListDepartment {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListDepartment.prototype, "counts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Array,
        example: [
            {
                active: 1,
                class: 1,
                code: 'GNW-000001',
                createdTime: '2023-11-16T02:09:12.385Z',
                divisionId: null,
                divisionSubclass: [
                    {
                        department: {
                            active: 1,
                            class: 1,
                            code: 'GNW-00001',
                            createdTime: '2023-11-16T02:12:34.787Z',
                            divisionId: null,
                            groupId: null,
                            id: 4,
                            name: 'department_thai_no_ 1',
                            setting: 1,
                            type: 0,
                            updatedTime: '2023-11-20T06:07:16.059Z',
                        },
                        departmentId: 4,
                        division: {
                            active: 1,
                            class: 1,
                            code: 'GNW-000001',
                            createdTime: '2023-11-16T02:09:12.385Z',
                            divisionId: null,
                            groupId: null,
                            id: 2,
                            name: 'division_thai_no_1',
                            setting: 1,
                            type: 1,
                            updatedTime: '2023-11-16T09:27:59.603Z',
                        },
                        divisionId: 2,
                        id: 1,
                    },
                ],
                groupId: null,
                id: 2,
                name: 'division_thai_no_1',
                setting: 1,
                type: 1,
                updatedTime: '2023-11-16T09:27:59.603Z',
            },
        ],
    }),
    __metadata("design:type", Array)
], ListDepartment.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Array,
        example: [
            {
                active: 1,
                class: 1,
                code: 'GNW-1209',
                createdTime: '2023-11-16T06:13:40.049Z',
                divisionId: null,
                groupId: null,
                id: 23,
                name: 'Division Hung',
                setting: 1,
                type: 1,
                updatedTime: '2023-11-20T04:38:56.027Z',
            },
        ],
    }),
    __metadata("design:type", Array)
], ListDepartment.prototype, "fullData", void 0);
exports.ListDepartment = ListDepartment;
class GetDepartmentGnw {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetDepartmentGnw.prototype, "active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetDepartmentGnw.prototype, "class", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetDepartmentGnw.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetDepartmentGnw.prototype, "createdTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetDepartmentGnw.prototype, "divisionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetDepartmentGnw.prototype, "groupId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetDepartmentGnw.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetDepartmentGnw.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetDepartmentGnw.prototype, "setting", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetDepartmentGnw.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetDepartmentGnw.prototype, "updatedTime", void 0);
exports.GetDepartmentGnw = GetDepartmentGnw;
class GetListDepartment {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetListDepartment.prototype, "active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetListDepartment.prototype, "class", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetListDepartment.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetListDepartment.prototype, "createdTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetListDepartment.prototype, "divisionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetListDepartment.prototype, "groupId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetListDepartment.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetListDepartment.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetListDepartment.prototype, "setting", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetListDepartment.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetListDepartment.prototype, "updatedTime", void 0);
exports.GetListDepartment = GetListDepartment;
class ResultsAddDepartment {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ResultsAddDepartment.prototype, "active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ResultsAddDepartment.prototype, "class", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ResultsAddDepartment.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ResultsAddDepartment.prototype, "createdTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ResultsAddDepartment.prototype, "divisionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ResultsAddDepartment.prototype, "groupId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ResultsAddDepartment.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ResultsAddDepartment.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ResultsAddDepartment.prototype, "setting", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ResultsAddDepartment.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ResultsAddDepartment.prototype, "updatedTime", void 0);
exports.ResultsAddDepartment = ResultsAddDepartment;
class ListDepartmentOracle {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListDepartmentOracle.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListDepartmentOracle.prototype, "departmentName", void 0);
exports.ListDepartmentOracle = ListDepartmentOracle;
class ListDepartmentOracleMerge {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListDepartmentOracleMerge.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListDepartmentOracleMerge.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListDepartmentOracleMerge.prototype, "name", void 0);
exports.ListDepartmentOracleMerge = ListDepartmentOracleMerge;
class ListDepartmentSub {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListDepartmentSub.prototype, "active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListDepartmentSub.prototype, "class", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListDepartmentSub.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListDepartmentSub.prototype, "createdTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListDepartmentSub.prototype, "divisionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListDepartmentSub.prototype, "groupId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListDepartmentSub.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListDepartmentSub.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListDepartmentSub.prototype, "setting", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListDepartmentSub.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListDepartmentSub.prototype, "updatedTime", void 0);
exports.ListDepartmentSub = ListDepartmentSub;
class SelectedDivision {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SelectedDivision.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SelectedDivision.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SelectedDivision.prototype, "name", void 0);
exports.SelectedDivision = SelectedDivision;
class ResponseFindSubDepartment {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ResponseFindSubDepartment.prototype, "counts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", ListDepartmentSub)
], ResponseFindSubDepartment.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", ListDepartmentSub)
], ResponseFindSubDepartment.prototype, "fullData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", SelectedDivision)
], ResponseFindSubDepartment.prototype, "selectedDivision", void 0);
exports.ResponseFindSubDepartment = ResponseFindSubDepartment;
//# sourceMappingURL=DepartmentDto.js.map