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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagementUserRoleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const Roles_1 = require("../../enum/Roles");
const Tag_1 = require("../../enum/Tag");
const Authorization_1 = require("../../handler/annotation/Authorization");
const role_guard_1 = require("../../handler/guard/role.guard");
const DepartmentRequestDto_1 = require("../../model/request/DepartmentRequestDto");
const UserRequestDto_1 = require("../../model/request/UserRequestDto");
const department_service_1 = require("../../services/department.service");
const managementUser_service_1 = require("../../services/managementUser.service");
const oracle_service_1 = require("../../services/oracle.service");
const user_service_1 = require("../../services/user.service");
const managementUser_Dto_1 = require("../../model/request/managementUser.Dto");
const DepartmentDto_1 = require("../../model/response/DepartmentDto");
const UserResponse_1 = require("../../model/response/UserResponse");
const getUserDataOracleDto_1 = require("../../model/getUserDataOracleDto");
const evaluationPeriod_service_1 = require("../../services/evaluationPeriod.service");
let ManagementUserRoleController = class ManagementUserRoleController {
    constructor(departmentService, evaluationPeriodService, oracleService, managementUserService, userService) {
        this.departmentService = departmentService;
        this.evaluationPeriodService = evaluationPeriodService;
        this.oracleService = oracleService;
        this.managementUserService = managementUserService;
        this.userService = userService;
    }
    getData(query, req) {
        const params = {
            catergory: query.catergory,
            classification: query.classification,
            departmentCodeAndName: query.departmentCodeAndName,
            offset: query.offset,
            limit: query.limit,
            sortBy: query.sortBy,
            sortType: query.sortType,
        };
        return this.departmentService.findListDepartment(params, req.user.companyGroupCode);
    }
    getAllDepartmentGNW(req) {
        return this.departmentService.getAllDepartmentGNW(req.user.companyGroupCode);
    }
    getAllDepartment(req) {
        return this.departmentService.getAllDepartment(req.user.companyGroupCode);
    }
    createNewDepartmentOfGNW(newDepartmentGNW, req) {
        return this.departmentService.createNewDivisionDepartment(newDepartmentGNW, req.user.companyGroupCode);
    }
    addDivisionSub(data) {
        return this.departmentService.addDivisionSub(data);
    }
    updateNewDepartmentOfGNW(id, departmentGNW, req) {
        return this.departmentService.updateDepartmentForGNW(id, departmentGNW, req.user.companyGroupCode, req.user.timeZone);
    }
    deleteDepartment(id, department, req) {
        return this.departmentService.deleteDepartment(id, department, req.user.companyGroupCode);
    }
    async getDepartmentOracleDb() {
        return await this.oracleService.getDepartment();
    }
    async getDivisionDepartmentOracleDb(req) {
        return await this.departmentService.mergeDivision(req.user.companyGroupCode);
    }
    async getUserDataOracleDb(query, req) {
        return await this.oracleService.getUserDataOracleDb(query, req.user.companyGroupCode);
    }
    async addUser(body, req) {
        return await this.managementUserService.addUser(body.data, req.user.companyGroupCode);
    }
    searchListUser(query, req) {
        const departments = query.department !== 'すべて' && query.department !== '_blank'
            ? query.department.split(':')
            : query.department;
        const divisions = query.division !== 'すべて' && query.division !== '_blank'
            ? query.division.split(':')
            : query.division;
        const params = {
            nameAndEmail: query.nameAndEmail,
            department: departments,
            division: divisions,
            company: query.company,
            role: query.role,
            offset: query.offset,
            limit: query.limit,
            sortBy: query.sortBy,
            sortType: query.sortType,
            skill: query.skill,
            companyGroupCode: req.user.companyGroupCode,
            level: query.level,
        };
        return this.userService.getListUser(params);
    }
    userList(query, req) {
        const departments = query.department &&
            query.department !== '-1' &&
            query.department !== '_blank'
            ? query.department.split(':')
            : query.department;
        const divisions = query.division !== '-1' && query.division !== '_blank'
            ? query.division.split(':')
            : query.division;
        const params = {
            nameAndEmail: query.nameAndEmail,
            department: departments,
            division: divisions,
            company: query.company,
            role: query.role,
            offset: query.offset,
            limit: query.limit,
            sortBy: query.sortBy,
            sortType: query.sortType,
            skill: query.skill,
            companyGroupCode: req.user.companyGroupCode,
            level: query.level,
        };
        return this.userService.getListUser(params);
    }
    deleteListUser(query, req) {
        return this.userService.deleteListUser(query.selectedRowKeys, req.user.companyGroupCode, req.user.timeZone);
    }
    updateListUser(query, req) {
        return this.managementUserService.updateListUserProcedure(query, req.user.companyGroupCode, req.user.timeZone, req.user.id);
    }
    updateOneUser(body, req) {
        const { userId, company, department, division, level, levelOld, roles, isChangeRoleF2, isChangeRoleF3, isChangeRoleF4, typeChangeRoleF1, updatedTime, radioLevelvalue, flagSkillValue, oldFlagSkill, fullName, } = body;
        return this.managementUserService.updateOneUserProcedure(userId, company, department, division, level, levelOld, roles, isChangeRoleF2, isChangeRoleF3, isChangeRoleF4, typeChangeRoleF1, updatedTime, radioLevelvalue, flagSkillValue, oldFlagSkill, req.user.companyGroupCode, req.user.timeZone, req.user.id, fullName);
    }
    async getUserDetailById(query) {
        const result = await this.userService.getUserDetailById(query.id);
        return result;
    }
    async getEvaluationByUserId(query, req) {
        const result = await this.userService.getEvaluationByUserId(query.id, req.user.companyGroupCode);
        return result;
    }
    async getSubDepartmentData(query, req) {
        const params = {
            departmentCodeAndName: query.departmentCodeAndName || null,
            offset: query.offset,
            limit: query.limit,
            sortBy: query.sortBy,
            sortType: query.sortType,
        };
        return await this.departmentService.getListSubDepartment(params, query.divisionId, req.user.companyGroupCode);
    }
    async getSubDepartmentListByDivisionId(divisionId) {
        return await this.departmentService.getSubDepartmentListByDivisionId(divisionId);
    }
    async getListDivision(req) {
        return await this.departmentService.getAllDepartmentTypeDivision(req.user.companyGroupCode);
    }
    async getCompanyOracleDb() {
        return await this.oracleService.getCompany();
    }
    async exportListUser(query, res, req) {
        const departments = query.department !== '-1' && query.department !== '_blank'
            ? query.department.split(':')
            : query.department;
        const divisions = query.division !== '-1' && query.division !== '_blank'
            ? query.division.split(':')
            : query.division;
        const skill = query.skill;
        const params = {
            nameAndEmail: query.nameAndEmail,
            department: departments,
            division: divisions,
            company: query.company,
            role: query.role,
            offset: query.offset,
            limit: query.limit,
            sortBy: query.sortBy,
            sortType: query.sortType,
            skill: skill,
            companyGroupCode: req.user.companyGroupCode,
            level: query.level,
        };
        const buffer = await this.userService.exportListUser(params);
        res.send(buffer);
    }
    async confirmEditOneUser(query, req) {
        const { userId, company, department, division, level, levelOld, roles, radioLevelvalue, flagSkillValue, oldFlagSkill, } = query.dataChange;
        return await this.managementUserService.confirmEditOneUser(userId, company, department, division, level, levelOld, roles, radioLevelvalue, flagSkillValue, oldFlagSkill, req.user.companyGroupCode, req.user.timeZone);
    }
    async confirmEditListUser(query, req) {
        return await this.managementUserService.confirmEditListUser(query.dataChange, req.user.companyGroupCode, req.user.timeZone);
    }
    async getEvaluationPeriod(req) {
        return await this.evaluationPeriodService.getEvaluationPeriodCurrent(req.user.companyGroupCode, req.user.timeZone);
    }
    async getHistoryUpdateUser(id, req) {
        return await this.managementUserService.historyUpdateUserList(req.user.companyGroupCode, id);
    }
    async changeRoleUser(query, req) {
        const { userId, newRole, isChangeRoleF2, isChangeRoleF3, isChangeRoleF4, typeChangeRoleF1, } = query;
        return await this.managementUserService.changeRoleUserManagement(userId, newRole, req.user.companyGroupCode, isChangeRoleF2, isChangeRoleF3, isChangeRoleF4, typeChangeRoleF1, req.user.timeZone);
    }
    async updateFullName(query, req) {
        const { userId, fullName } = query;
        return await this.managementUserService.updateFullNameUser(userId, fullName);
    }
};
__decorate([
    (0, common_1.Get)('/find-department'),
    (0, swagger_1.ApiQuery)({
        type: DepartmentRequestDto_1.DepartmentSearchRequestDto,
    }),
    (0, swagger_1.ApiResponse)({
        type: DepartmentDto_1.ListDepartment,
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DepartmentRequestDto_1.DepartmentSearchRequestDto, Object]),
    __metadata("design:returntype", void 0)
], ManagementUserRoleController.prototype, "getData", null);
__decorate([
    (0, common_1.Get)('/get-all-department-gnw'),
    (0, swagger_1.ApiResponse)({
        type: DepartmentDto_1.GetDepartmentGnw,
        isArray: true,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ManagementUserRoleController.prototype, "getAllDepartmentGNW", null);
__decorate([
    (0, common_1.Get)('/get-list'),
    (0, swagger_1.ApiResponse)({
        type: DepartmentDto_1.GetListDepartment,
        isArray: true,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ManagementUserRoleController.prototype, "getAllDepartment", null);
__decorate([
    (0, common_1.Post)('/add-division-deparment'),
    (0, swagger_1.ApiBody)({
        type: DepartmentRequestDto_1.DepartmentRequestAdd,
    }),
    (0, swagger_1.ApiResponse)({
        type: DepartmentDto_1.ResultsAddDepartment,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DepartmentRequestDto_1.DepartmentRequestDto, Object]),
    __metadata("design:returntype", void 0)
], ManagementUserRoleController.prototype, "createNewDepartmentOfGNW", null);
__decorate([
    (0, common_1.Post)('/add-division-sub'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DepartmentRequestDto_1.DivisionSubclassRequestDTO]),
    __metadata("design:returntype", void 0)
], ManagementUserRoleController.prototype, "addDivisionSub", null);
__decorate([
    (0, common_1.Put)('/edit-deparment-gnw/:id'),
    (0, swagger_1.ApiBody)({
        type: DepartmentRequestDto_1.RequestEditDepartmentGnw,
    }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, DepartmentRequestDto_1.DepartmentUpdateRequestDto, Object]),
    __metadata("design:returntype", void 0)
], ManagementUserRoleController.prototype, "updateNewDepartmentOfGNW", null);
__decorate([
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiBody)({
        type: DepartmentRequestDto_1.DeleteDepartment,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
    }),
    (0, common_1.Put)('/delete-deparment/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ManagementUserRoleController.prototype, "deleteDepartment", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        type: DepartmentDto_1.ListDepartmentOracle,
        isArray: true,
    }),
    (0, common_1.Get)('/get-department-oracledb'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "getDepartmentOracleDb", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        type: DepartmentDto_1.ListDepartmentOracleMerge,
        isArray: true,
    }),
    (0, common_1.Get)('/get-division-department-oracledb-merge'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "getDivisionDepartmentOracleDb", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        type: UserResponse_1.GetUserDataOracleDb,
        isArray: true,
    }),
    (0, common_1.Get)('/get-user-data-oracleDb'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getUserDataOracleDto_1.GetUserDataOracleDto, Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "getUserDataOracleDb", null);
__decorate([
    (0, swagger_1.ApiBody)({
        type: UserRequestDto_1.DataAddUserOracleDb,
        isArray: true,
    }),
    (0, swagger_1.ApiResponse)({
        type: UserResponse_1.ResultsAddUserOracle,
    }),
    (0, common_1.Post)('/add-user'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "addUser", null);
__decorate([
    (0, swagger_1.ApiQuery)({
        type: UserRequestDto_1.UserSearchRequestDto,
    }),
    (0, swagger_1.ApiResponse)({
        type: UserResponse_1.FindUser,
    }),
    (0, common_1.Get)('/find-user'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserRequestDto_1.UserSearchRequestDto, Object]),
    __metadata("design:returntype", void 0)
], ManagementUserRoleController.prototype, "searchListUser", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        type: UserResponse_1.FindUser,
    }),
    (0, common_1.Get)('/user-list'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ManagementUserRoleController.prototype, "userList", null);
__decorate([
    (0, common_1.Put)('/delete-user'),
    (0, swagger_1.ApiBody)({
        type: UserRequestDto_1.RequestDeleteUser,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ManagementUserRoleController.prototype, "deleteListUser", null);
__decorate([
    (0, swagger_1.ApiBody)({
        type: UserRequestDto_1.RequestUpdatedUser,
    }),
    (0, swagger_1.ApiResponse)({ type: UserResponse_1.ResponseUpdatedUser }),
    (0, common_1.Put)('/update-user'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ManagementUserRoleController.prototype, "updateListUser", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
    }),
    (0, common_1.Put)('/edit-user'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [managementUser_Dto_1.EditUserRequestDto, Object]),
    __metadata("design:returntype", void 0)
], ManagementUserRoleController.prototype, "updateOneUser", null);
__decorate([
    (0, swagger_1.ApiQuery)({ name: 'id', type: String }),
    (0, swagger_1.ApiResponse)({ type: UserResponse_1.ResponseDetailUser }),
    (0, common_1.Get)('/get-user-detail-by-id'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "getUserDetailById", null);
__decorate([
    (0, swagger_1.ApiQuery)({ name: 'id', type: String }),
    (0, common_1.Get)('/get-evaluation-by-user'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "getEvaluationByUserId", null);
__decorate([
    (0, common_1.Get)('/find-sub-department'),
    (0, swagger_1.ApiQuery)({
        type: UserRequestDto_1.RequestFindSubDepartment,
    }),
    (0, swagger_1.ApiResponse)({
        type: DepartmentDto_1.ResponseFindSubDepartment,
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "getSubDepartmentData", null);
__decorate([
    (0, common_1.Get)('/sub-department-list/:divisionId'),
    __param(0, (0, common_1.Param)('divisionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "getSubDepartmentListByDivisionId", null);
__decorate([
    (0, swagger_1.ApiResponse)({ isArray: true, type: DepartmentDto_1.ListDepartmentSub }),
    (0, common_1.Get)('/list-division'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "getListDivision", null);
__decorate([
    (0, swagger_1.ApiResponse)({ isArray: true, type: UserResponse_1.CompanyResponse }),
    (0, common_1.Get)('/get-company-oracledb'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "getCompanyOracleDb", null);
__decorate([
    (0, common_1.Get)('/export-list-user'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserRequestDto_1.UserSearchRequestDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "exportListUser", null);
__decorate([
    (0, common_1.Put)('/confirm-edit-one-user'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "confirmEditOneUser", null);
__decorate([
    (0, common_1.Put)('/confirm-edit-list-user'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "confirmEditListUser", null);
__decorate([
    (0, common_1.Get)('/getEvaluationPeriod'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "getEvaluationPeriod", null);
__decorate([
    (0, common_1.Get)('/get-history-update-user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "getHistoryUpdateUser", null);
__decorate([
    (0, common_1.Put)('/change-role-user'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "changeRoleUser", null);
__decorate([
    (0, common_1.Put)('/update-full-name'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementUserRoleController.prototype, "updateFullName", null);
ManagementUserRoleController = __decorate([
    (0, common_1.Controller)('v1/f8/management-user'),
    (0, Authorization_1.Authorize)(Roles_1.Roles.F8),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, swagger_1.ApiTags)(Tag_1.Tag.F8),
    __metadata("design:paramtypes", [department_service_1.DepartmentService,
        evaluationPeriod_service_1.EvaluationPeriodService,
        oracle_service_1.default,
        managementUser_service_1.ManagemantUserServices,
        user_service_1.UserService])
], ManagementUserRoleController);
exports.ManagementUserRoleController = ManagementUserRoleController;
//# sourceMappingURL=managementUser.controller.js.map