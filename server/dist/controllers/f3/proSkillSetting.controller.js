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
exports.ProSkillSettingRoleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const Roles_1 = require("../../enum/Roles");
const Tag_1 = require("../../enum/Tag");
const Authorization_1 = require("../../handler/annotation/Authorization");
const role_guard_1 = require("../../handler/guard/role.guard");
const proSkillSetting_service_1 = require("../../services/proSkillSetting.service");
const ProSkillSetingRequestDto_1 = require("../../model/request/ProSkillSetingRequestDto");
const mail_service_1 = require("../../services/mail.service");
const proskillSetting_interfaces_1 = require("../../interfaces/proskillSetting.interfaces");
const ProSkillSettingResponse_1 = require("../../model/response/F3/ProSkillSettingResponse");
const ProSkillSettingRequestDto_1 = require("../../model/request/ProSkillSettingRequestDto");
const proSkill_service_1 = require("../../services/proSkill.service");
let ProSkillSettingRoleController = class ProSkillSettingRoleController {
    async getDetailProskill(versionId, query, req) {
        const data = await this.proSkillSettingServices.getDetailProSkill(versionId, req.user.id, query.isReadOnly, req.user.companyGroupCode);
        return data;
    }
    async getSkillRoleUser(req) {
        const userId = req.user.id;
        const companyGroupCode = req.user.companyGroupCode;
        const results = await this.proSkillSettingServices.getSkillRoleUser(userId, companyGroupCode);
        return results;
    }
    async getVersionProSkill(query, req) {
        const userId = req.user.id;
        const companyGroupCode = req.user.companyGroupCode;
        const results = await this.proSkillSettingServices.getVersionProSkill(query, userId, companyGroupCode);
        return results;
    }
    async saveDraft(versionId, request) {
        const { data } = request.body;
        const response = await this.proSkillSettingServices.createNewVersionSaveDraft(versionId, data, request.user.id, request.user.companyGroupCode, request['user'].timeZone);
        if (response.code === 200) {
            const childrens = data.children.map((v) => {
                delete v.id;
                delete v.version_id;
                v.versionId = parseInt(response.id.toString());
                if (typeof v.difficulty === 'string') {
                    v.difficulty = null;
                }
                return v;
            });
            await this.proSkillSettingServices.createBulk(parseInt(response.id.toString()), childrens);
            return {
                code: 200,
                id: parseInt(response.id.toString()),
                updated: response.updatedTime,
                status: response.status,
                publicStatus: response.publicStatus,
                skillId: response.skillId,
                version: response.version,
                subVersion: response.subVersion,
                fullName: request.user.fullName,
                reason: response.reason,
                skillActive: response.skillActive,
                skill: response.skill,
                skillName: response.skillName,
                creationUser: { fullName: request.user.fullName, id: request.user.id },
                lastUpdatedTime: response.lastUpdatedTime,
            };
        }
        else {
            return response;
        }
    }
    async getVersionProSkillDepartment(query, req) {
        const results = await this.proSkillSettingServices.getVersionProSkillDepartment(query, req.user.companyGroupCode);
        return results;
    }
    async submitVersion(versionId, request) {
        const host = process.env.HOSTNAME_;
        const { data } = request.body;
        const tempListPoint = data.children.filter((obj, index, self) => index === self.findIndex((t) => t.difficulty === obj.difficulty));
        const response = await this.proSkillSettingServices.createNewVersionSubmit(versionId, data, request.user.id, request.user.companyGroupCode, tempListPoint, request['user'].timeZone);
        if ((response === null || response === void 0 ? void 0 : response.code) === 200) {
            const childrens = data.children.map((v) => {
                delete v.id;
                delete v.version_id;
                v.versionId = response.id;
                return v;
            });
            await this.proSkillSettingServices.createBulk(response.id, childrens);
            const mailData = {
                skillId: response.skillId,
                versionId: response.id,
                versionMain: response.version,
                versionSub: response.subVersion,
                skillName: response.skillName,
                createdUser: { fullName: request.user.fullName, id: request.user.id },
            };
            await this.mailService.submitProSkill(Object.assign(Object.assign({}, mailData), { skillName: response.skillName }), host, request.user.companyGroupCode);
            return Object.assign(Object.assign({}, response), { code: 200 });
        }
        return Object.assign({}, response);
    }
    async cancelVersion(versionId, req, body) {
        return await this.proSkillSettingServices.cancelVersionPro(versionId, req.user.id, body.updated);
    }
    async editProSkill(versionId, query, req) {
        const data = await this.proSkillSettingServices.getEditProSkillVersion(versionId, req.user.id, req.user.companyGroupCode);
        return data;
    }
    async getHistoryApproveContent(versionId, req) {
        const data = await this.proSkillSettingServices.getHistoryApproveContent(versionId, req.user.id, undefined, req.user.companyGroupCode);
        return data;
    }
    async createInitialVersion(skillId, req) {
        const response = await this.proSkillSettingServices.createNewVersionInit(req.body, req.user.id, skillId, req.user.companyGroupCode, req['user'].timeZone);
        if (response.code === 200) {
            if (req.body.status === 3) {
                const data = {
                    skillId: skillId,
                    versionId: response.id,
                    versionMain: response.version,
                    versionSub: response.subVersion,
                    skillName: response.skillName,
                    createdUser: { fullName: req.user.fullName, id: req.user.id },
                };
                await this.mailService.submitProSkill(Object.assign(Object.assign({}, data), { skillName: response.skillName }), process.env.HOSTNAME_, req.user.companyGroupCode);
            }
            return Object.assign(Object.assign({}, response), { fullName: req.user.fullName, skillId: skillId, skillName: response.skillName, skill: response.skill, creationUser: { fullName: req.user.fullName, id: req.user.id } });
        }
        return Object.assign(Object.assign({}, response), { fullName: req.user.fullName, skillId: skillId, creationUser: { fullName: req.user.fullName, id: req.user.id } });
    }
    async listPointOfVersion(skillId, req) {
        return await this.proSkillSettingServices.listPointByVersion(skillId, req.user.id, req.user.companyGroupCode);
    }
    async checkPermissionSetterOfDepartment(req, versionId) {
        const userId = req.user.id;
        return await this.proSkillSettingServices.checkPermissionSetterOfDepartment(userId, versionId);
    }
    async getVersionPublic(req) {
        const companyGroupCode = req.user.companyGroupCode;
        return await this.proSkillSettingServices.listVersionPublic(companyGroupCode);
    }
    async getDetailProSkill(param, req) {
        const data = await this.proSkillSettingServices.getDetailProSkillGeneric(param.versionId, req.user.companyGroupCode);
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
    async listItemTemplateSkill(param) {
        const datas = await this.proSkillServices.getItemsTemplateProSkill(param.versionId);
        return datas;
    }
};
__decorate([
    (0, common_1.Inject)(proSkillSetting_service_1.ProSkillSettingServices),
    __metadata("design:type", proSkillSetting_service_1.ProSkillSettingServices)
], ProSkillSettingRoleController.prototype, "proSkillSettingServices", void 0);
__decorate([
    (0, common_1.Inject)(proSkill_service_1.ProSkillServices),
    __metadata("design:type", proSkill_service_1.ProSkillServices)
], ProSkillSettingRoleController.prototype, "proSkillServices", void 0);
__decorate([
    (0, common_1.Inject)(mail_service_1.MailService),
    __metadata("design:type", mail_service_1.MailService)
], ProSkillSettingRoleController.prototype, "mailService", void 0);
__decorate([
    (0, common_1.Get)('/detail-pro-skill/:versionId'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: ProSkillSettingResponse_1.DetailProSkillResponse,
    }),
    (0, swagger_1.ApiQuery)({
        type: ProSkillSettingRequestDto_1.GetDetailProSkill,
    }),
    __param(0, (0, common_1.Param)('versionId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ProSkillSettingRoleController.prototype, "getDetailProskill", null);
__decorate([
    (0, common_1.Get)('/get-skill'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        isArray: true,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProSkillSettingRoleController.prototype, "getSkillRoleUser", null);
__decorate([
    (0, common_1.Get)('/version-pro-skill'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: ProSkillSettingResponse_1.VersionProSkillResponse,
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProSkillSetingRequestDto_1.ListProSKillVersionRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ProSkillSettingRoleController.prototype, "getVersionProSkill", null);
__decorate([
    (0, common_1.Put)('/save-draft/:versionId'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: ProSkillSettingResponse_1.ProSkillSaveDrafReponse,
    }),
    __param(0, (0, common_1.Param)('versionId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProSkillSettingRoleController.prototype, "saveDraft", null);
__decorate([
    (0, common_1.Get)('/version-pro-skill-department'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: ProSkillSettingResponse_1.VersionProSkillDepartmentResponse,
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProSkillSetingRequestDto_1.ProSKillVersionRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ProSkillSettingRoleController.prototype, "getVersionProSkillDepartment", null);
__decorate([
    (0, common_1.Put)('/submit-version/:versionId'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: ProSkillSettingResponse_1.VersionSubmitResponse,
    }),
    __param(0, (0, common_1.Param)('versionId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProSkillSettingRoleController.prototype, "submitVersion", null);
__decorate([
    (0, common_1.Put)('/cancel-version/:versionId'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: ProSkillSettingResponse_1.VersionCancelResponse,
    }),
    __param(0, (0, common_1.Param)('versionId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ProSkillSettingRoleController.prototype, "cancelVersion", null);
__decorate([
    (0, common_1.Get)('/edit-pro-skill/:versionId'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: ProSkillSettingResponse_1.ProSkillEditResponse,
    }),
    __param(0, (0, common_1.Param)('versionId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ProSkillSettingRoleController.prototype, "editProSkill", null);
__decorate([
    (0, common_1.Get)('/history-approve/:versionId'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: ProSkillSettingResponse_1.HistoryApproveResponse,
    }),
    __param(0, (0, common_1.Param)('versionId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProSkillSettingRoleController.prototype, "getHistoryApproveContent", null);
__decorate([
    (0, common_1.Post)('/:skillId/create-initial-version'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        type: ProSkillSettingResponse_1.InitialVersionResponse,
    }),
    __param(0, (0, common_1.Param)('skillId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProSkillSettingRoleController.prototype, "createInitialVersion", null);
__decorate([
    (0, common_1.Get)('/list-point-of-version/:skillId'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: ProSkillSettingResponse_1.ListPointResponse,
    }),
    __param(0, (0, common_1.Param)('skillId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProSkillSettingRoleController.prototype, "listPointOfVersion", null);
__decorate([
    (0, common_1.Get)('/check-permission/:versionId'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: ProSkillSettingResponse_1.PermissionResponse,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('versionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ProSkillSettingRoleController.prototype, "checkPermissionSetterOfDepartment", null);
__decorate([
    (0, common_1.Get)('/get-version-public'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: ProSkillSettingResponse_1.VersionPublicResponse,
        isArray: true,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProSkillSettingRoleController.prototype, "getVersionPublic", null);
__decorate([
    (0, common_1.Get)('/detail-pro-skill-public/:versionId'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: ProSkillSettingResponse_1.DetailProSkillPublicResponse,
    }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [proskillSetting_interfaces_1.ProSkillDetail, Object]),
    __metadata("design:returntype", Promise)
], ProSkillSettingRoleController.prototype, "getDetailProSkill", null);
__decorate([
    (0, common_1.Get)('/list-dep-temp-export'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProSkillSettingRoleController.prototype, "getListDep_TempExport", null);
__decorate([
    (0, common_1.Get)('/dep-temp-export'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProSkillSettingRoleController.prototype, "dep_TempProSkillExport", null);
__decorate([
    (0, common_1.Get)('/get-item-template-skill/:versionId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProSkillSettingRoleController.prototype, "listItemTemplateSkill", null);
ProSkillSettingRoleController = __decorate([
    (0, common_1.Controller)('v1/f3/pro-setting'),
    (0, Authorization_1.Authorize)(Roles_1.Roles.F3),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, swagger_1.ApiTags)(Tag_1.Tag.F3),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal Server Error',
    })
], ProSkillSettingRoleController);
exports.ProSkillSettingRoleController = ProSkillSettingRoleController;
//# sourceMappingURL=proSkillSetting.controller.js.map