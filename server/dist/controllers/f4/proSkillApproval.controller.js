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
exports.ProSkillApprovalRoleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const Roles_1 = require("../../enum/Roles");
const Tag_1 = require("../../enum/Tag");
const Authorization_1 = require("../../handler/annotation/Authorization");
const role_guard_1 = require("../../handler/guard/role.guard");
const VersionProSkillDto_1 = require("../../model/response/VersionProSkillDto");
const proSkill_service_1 = require("../../services/proSkill.service");
const proSkillSetting_service_1 = require("../../services/proSkillSetting.service");
const ProSkillApproveRequestDto_1 = require("../../model/request/ProSkillApproveRequestDto");
const ProSkillSetingRequestDto_1 = require("../../model/request/ProSkillSetingRequestDto");
const DepartmentDto_1 = require("../../model/response/DepartmentDto");
const VersionListProSkillRequest_1 = require("../../model/request/VersionListProSkillRequest");
let ProSkillApprovalRoleController = class ProSkillApprovalRoleController {
    async searchListApprovalProSkill(query, req) {
        const skill = query.skill !== 'すべて' ? query.skill.split(':') : query.skill;
        const params = {
            skill: skill,
            status: query.status,
            publicStatus: query.publicStatus,
            offset: query.offset,
            limit: query.limit,
            sortBy: query.sortBy,
            sortType: query.sortType,
        };
        const userId = req.user.id;
        const companyGroupCode = req.user.companyGroupCode;
        const results = await this.proSkillServices.searchListApprovalProSkill(params, userId, companyGroupCode);
        return results;
    }
    async getAllDepartment(req) {
        const userId = req.user.id;
        const companyGroupCode = req.user.companyGroupCode;
        const results = await this.proSkillServices.getSkillByRoleUser(userId, companyGroupCode);
        return results;
    }
    async getDetailProSkillApproval(req, versionId, skillId) {
        const userId = req.user.id;
        const companyGroupCode = req.user.companyGroupCode;
        const data = await this.proSkillServices.getDetailProSkillVersion(versionId, 'f4', skillId, userId, companyGroupCode);
        return data;
    }
    async getDetailProSkill(versionId, req) {
        const data = await this.proSkillSettingServices.getDetailProSkillGeneric(versionId, req.user.companyGroupCode);
        return data;
    }
    approveProSkill(versioniId, req, body) {
        const { comment, updateTime, hostName, skillId } = body;
        const userId = req.user.id;
        const companyGroupCode = req.user.companyGroupCode;
        const statusApprove = '承認';
        return this.proSkillServices.approveProSkill(versioniId, comment, statusApprove, userId, updateTime, hostName, skillId, companyGroupCode, req['user'].timeZone);
    }
    rejectProSkill(versioniId, req, body) {
        const { comment, updateTime, hostName, skillId } = body;
        const userId = req.user.id;
        const statusReject = '差戻';
        const companyGroupCode = req.user.companyGroupCode;
        return this.proSkillServices.rejectProSkill(versioniId, comment, statusReject, userId, updateTime, hostName, skillId, companyGroupCode, req['user'].timeZone);
    }
    async getVersionProSkillDepartment(query, req) {
        const results = await this.proSkillSettingServices.getVersionProSkillDepartment(query, req.user.companyGroupCode);
        return results;
    }
    async getDetailProSkillPublicOfDepartment(skillId, req) {
        const data = await this.proSkillServices.getDetailProSkillPublicOfSkill(skillId, req.user.companyGroupCode);
        return data;
    }
    async getHistoryApproveContent(versionId, userId, req) {
        const data = await this.proSkillSettingServices.getHistoryApproveContent(versionId, userId, undefined, req.user.companyGroupCode);
        return data;
    }
    async getListDep_TempExport(params, req) {
        const year = params.year;
        const periodIndex = params.periodEvaluate;
        const role = params.role;
        const companyGroupCode = req.user.companyGroupCode;
        const results = await this.proSkillServices.getListDep_TempExport(year, periodIndex, role, companyGroupCode);
        return results;
    }
    async dep_TempProSkillExport(params, req) {
        const year = params.year;
        const periodIndex = params.periodIndex;
        const role = params.role;
        const listSelected = params.listSelected;
        const companyGroupCode = req.user.companyGroupCode;
        return await this.proSkillServices.dep_TempProSkillExport(year, periodIndex, role, listSelected, companyGroupCode);
    }
};
__decorate([
    (0, common_1.Inject)(proSkill_service_1.ProSkillServices),
    __metadata("design:type", proSkill_service_1.ProSkillServices)
], ProSkillApprovalRoleController.prototype, "proSkillServices", void 0);
__decorate([
    (0, common_1.Inject)(proSkillSetting_service_1.ProSkillSettingServices),
    __metadata("design:type", proSkillSetting_service_1.ProSkillSettingServices)
], ProSkillApprovalRoleController.prototype, "proSkillSettingServices", void 0);
__decorate([
    (0, common_1.Get)('/list-approve-pro-skill'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: VersionProSkillDto_1.ListVersionPublicDto,
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProSkillApproveRequestDto_1.ProSkillApproveRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ProSkillApprovalRoleController.prototype, "searchListApprovalProSkill", null);
__decorate([
    (0, common_1.Get)('/get-skill-approval'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: DepartmentDto_1.GetDepartmentApproved,
        isArray: true,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProSkillApprovalRoleController.prototype, "getAllDepartment", null);
__decorate([
    (0, common_1.Get)('/detail-pro-skill-approve/:versionId/:skillId'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: VersionProSkillDto_1.DetailProSkillApproved,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('versionId')),
    __param(2, (0, common_1.Param)('skillId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], ProSkillApprovalRoleController.prototype, "getDetailProSkillApproval", null);
__decorate([
    (0, swagger_1.ApiParam)({ name: 'versionId', type: Number, example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 200, type: VersionProSkillDto_1.VersionProSkillDto }),
    (0, common_1.Get)('/detail-pro-skill-public/:versionId'),
    __param(0, (0, common_1.Param)('versionId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProSkillApprovalRoleController.prototype, "getDetailProSkill", null);
__decorate([
    (0, common_1.Put)('/approved/:id'),
    (0, swagger_1.ApiResponse)({ status: 200, type: VersionProSkillDto_1.ResultsApproved }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, VersionListProSkillRequest_1.RequestApprovedProSkill]),
    __metadata("design:returntype", void 0)
], ProSkillApprovalRoleController.prototype, "approveProSkill", null);
__decorate([
    (0, common_1.Put)('/rejected/:id'),
    (0, swagger_1.ApiResponse)({ status: 200, type: Boolean }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, VersionListProSkillRequest_1.RequestApprovedProSkill]),
    __metadata("design:returntype", void 0)
], ProSkillApprovalRoleController.prototype, "rejectProSkill", null);
__decorate([
    (0, common_1.Get)('/version-pro-skill-department'),
    (0, swagger_1.ApiResponse)({ status: 200, type: VersionProSkillDto_1.VersionProSkillDepartment }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProSkillSetingRequestDto_1.ProSKillVersionRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ProSkillApprovalRoleController.prototype, "getVersionProSkillDepartment", null);
__decorate([
    (0, common_1.Get)('/detail-pro-skill-public-of-skill/:skillId'),
    __param(0, (0, common_1.Param)('skillId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProSkillApprovalRoleController.prototype, "getDetailProSkillPublicOfDepartment", null);
__decorate([
    (0, common_1.Get)('/history-approve/:versionId'),
    (0, swagger_1.ApiResponse)({ status: 200, type: VersionProSkillDto_1.ResultsHistoryApproved }),
    __param(0, (0, common_1.Param)('versionId')),
    __param(1, (0, common_1.Query)('userId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], ProSkillApprovalRoleController.prototype, "getHistoryApproveContent", null);
__decorate([
    (0, common_1.Get)('/list-dep-temp-export'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProSkillApprovalRoleController.prototype, "getListDep_TempExport", null);
__decorate([
    (0, common_1.Get)('/dep-temp-export'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProSkillApprovalRoleController.prototype, "dep_TempProSkillExport", null);
ProSkillApprovalRoleController = __decorate([
    (0, common_1.Controller)('v1/f4/pro-skill-approval'),
    (0, Authorization_1.Authorize)(Roles_1.Roles.F4),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, swagger_1.ApiTags)(Tag_1.Tag.F4),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal Server Error' })
], ProSkillApprovalRoleController);
exports.ProSkillApprovalRoleController = ProSkillApprovalRoleController;
//# sourceMappingURL=proSkillApproval.controller.js.map