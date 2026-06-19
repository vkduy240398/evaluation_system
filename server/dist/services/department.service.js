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
exports.DepartmentService = void 0;
const common_1 = require("@nestjs/common");
const department_repository_1 = require("../repository/department.repository");
const RuntimeException_1 = require("../model/exception/RuntimeException");
let DepartmentService = class DepartmentService {
    async createNewDivisionDepartment(department, companyGroupCode) {
        return await this.departmentRepo.createNewDivisionDepartment(department, companyGroupCode);
    }
    async addDivisionSub(data) {
        return await this.departmentRepo.addDivisionSub(data);
    }
    async updateDepartmentForGNW(id, department, companyGroupCode, timeZone) {
        const data = await this.departmentRepo.getDepartmentUpdateTime(id, companyGroupCode);
        if (!data)
            throw new RuntimeException_1.RuntimeException('Department not found', common_1.HttpStatus.NOT_FOUND);
        if (department.updatedTime !== (data === null || data === void 0 ? void 0 : data.updatedTime.toISOString()))
            throw new RuntimeException_1.RuntimeException('Department is duplicate', 409);
        return await this.departmentRepo.updateDepartmentForGNW(id, department, data, companyGroupCode, timeZone);
    }
    async findListDepartment(query, companyGroupCode) {
        return await this.departmentRepo.findListDepartment(query, companyGroupCode);
    }
    async getAllDepartment(companyGroupCode) {
        return await this.departmentRepo.getAllDepartment(companyGroupCode);
    }
    async getAllDepartmentNotSetDivision(companyGroupCode) {
        return await this.departmentRepo.getAllDepartmentNotSetDivision(companyGroupCode);
    }
    async getAllDepartmentGNW(companyGroupCode) {
        return await this.departmentRepo.getAllDepartmentGNW(companyGroupCode);
    }
    async getAllDepartmentTypeDepartment(companyGroupCode) {
        return await this.departmentRepo.getAllDepartmentTypeDepartment(companyGroupCode);
    }
    async getAllDepartmentNotGroup(companyGroupCode) {
        return await this.departmentRepo.getAllDepartmentNotGroup(companyGroupCode);
    }
    async getAllDepartmentTypeDivision(companyGroupCode) {
        const divisions = await this.departmentRepo.getAllDepartmentTypeDivision(companyGroupCode);
        return divisions;
    }
    async getAllDivisionDepartment(companyGroupCode) {
        const divisions = await this.departmentRepo.getAllDivisionDepartment(companyGroupCode);
        const results = [];
        for (let i = 0; i < divisions.length; i++) {
            const division = divisions[i];
            const childrens = division.divisionSubclass
                .filter((f) => f.department !== null)
                .map((v) => ({
                id: v.departmentId,
                code: v === null || v === void 0 ? void 0 : v.department.code,
                name: v === null || v === void 0 ? void 0 : v.department.name,
                codeName: `${v === null || v === void 0 ? void 0 : v.department.name}`,
            }));
            const item = {
                divisionId: division.id,
                code: division.code,
                name: division.name,
                codeName: `${division.name}`,
                childrens,
            };
            results.push(item);
        }
        return results;
    }
    async getUserDivisionAndDepartment(userId) {
        const divisionInfo = await this.departmentRepo.getUserDivision(userId);
        if (!divisionInfo.departmentId) {
            const departmentInfos = await this.departmentRepo.getSubDepartmentListByDivisionId(divisionInfo.division.id);
            return { division: divisionInfo.division, department: departmentInfos };
        }
        else {
            const departmentInfo = await this.departmentRepo.getDepartmentById(divisionInfo.departmentId);
            return { division: divisionInfo.division, department: departmentInfo };
        }
    }
    async mergeDivision(companyGroupCode) {
        const systemOptionList = await this.departmentRepo.getAllDepartmentTypeDivision(companyGroupCode);
        return systemOptionList;
    }
    async deleteDepartment(id, department, companyGroupCode) {
        const data = await this.departmentRepo.getDepartmentUpdateTime(id, companyGroupCode);
        if (!data)
            throw new RuntimeException_1.RuntimeException('Department not found', common_1.HttpStatus.NOT_FOUND);
        if (department && department.updateTime !== (data === null || data === void 0 ? void 0 : data.updatedTime.toISOString()))
            throw new RuntimeException_1.RuntimeException('Department is duplicate', 409);
        return await this.departmentRepo.deleteDepartment(id, data, companyGroupCode);
    }
    async getDepartmentById(id) {
        return await this.departmentRepo.getDepartmentById(id);
    }
    async getOptionDepartment(query, companyGroupCode, timeZone) {
        var _a, _b, _c;
        const results = [];
        const oldDepartments = await this.departmentRepo.getHistoryUpdateDepartment(query.year, query.periodIndex, companyGroupCode, timeZone);
        if (oldDepartments && ((_a = oldDepartments[0]) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            results.push(...oldDepartments[0].map((v) => ({
                label: `${v.departmentName}`,
                value: v.departmentId,
                type: v.type,
            })));
        }
        const departments = await this.departmentRepo.getAllDepartment(companyGroupCode);
        if (departments.length > 0) {
            const existingDepartmentIds = oldDepartments && ((_b = oldDepartments[0]) === null || _b === void 0 ? void 0 : _b.length) > 0
                ? new Set((_c = oldDepartments[0]) === null || _c === void 0 ? void 0 : _c.map((v) => v.departmentId))
                : undefined;
            const filteredDepartments = !existingDepartmentIds
                ? departments
                : departments.filter((v) => !existingDepartmentIds.has(v.id));
            results.push(...filteredDepartments.map((v) => ({
                label: `${v.name}`,
                value: v.id,
                type: v.type,
            })));
        }
        const uniqueItems = [];
        const labelsSeen = new Set();
        results.forEach((item) => {
            if (!labelsSeen.has(item.label)) {
                labelsSeen.add(item.label);
                uniqueItems.push(item);
            }
        });
        const sortedUniqueItems = uniqueItems.sort((a, b) => {
            return a.label.localeCompare(b.label);
        });
        return sortedUniqueItems;
    }
    async getListSubDepartment(query, id, companyGroupCode) {
        return await this.departmentRepo.getListSubDepartment(query, id, companyGroupCode);
    }
    async getSubDepartmentListByDivisionId(id) {
        return await this.departmentRepo.getSubDepartmentListByDivisionId(id);
    }
    async getAllSkill(companyGroupCode) {
        return await this.departmentRepo.getAllSkill(companyGroupCode);
    }
};
__decorate([
    (0, common_1.Inject)(department_repository_1.DepartmentRepository),
    __metadata("design:type", department_repository_1.DepartmentRepository)
], DepartmentService.prototype, "departmentRepo", void 0);
DepartmentService = __decorate([
    (0, common_1.Injectable)()
], DepartmentService);
exports.DepartmentService = DepartmentService;
//# sourceMappingURL=department.service.js.map