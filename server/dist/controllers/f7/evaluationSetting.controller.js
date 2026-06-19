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
exports.ManagementEvaluationSettingRoleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const Roles_1 = require("../../enum/Roles");
const Tag_1 = require("../../enum/Tag");
const Authorization_1 = require("../../handler/annotation/Authorization");
const role_guard_1 = require("../../handler/guard/role.guard");
const user_service_1 = require("../../services/user.service");
const mail_service_1 = require("../../services/mail.service");
const ExceptionPeriodRequestDto_1 = require("../../model/request/ExceptionPeriodRequestDto");
const MailManagementDto_1 = require("../../model/request/MailManagementDto");
let ManagementEvaluationSettingRoleController = class ManagementEvaluationSettingRoleController {
    async getUsersEmailList(conditions, req) {
        return await this.userService.getUsersEmailList(conditions.conditions, req.user.companyGroupCode);
    }
    async getMailHistoryList(query, req) {
        return await this.mailService.getMailHistoryList(query, req);
    }
    async updateMailHistory(body, id, req) {
        return await this.mailService.updateMailHistory(body, id, req);
    }
    async deleteMail(id) {
        return await this.mailService.deleteMail(id);
    }
    async importUserFromExcel(body) {
        return await this.userService.importUserFromExcel(body);
    }
    async getMailTemplateList(query, req) {
        return await this.mailService.getMailTemplateList(query, req);
    }
    async getMailTemplateListById(query, req) {
        return await this.mailService.getMailTemplateListById(query, req);
    }
    async editMailTemplate(body, req) {
        return await this.mailService.editMailTemplate(body, req);
    }
};
__decorate([
    (0, common_1.Inject)(user_service_1.UserService),
    __metadata("design:type", user_service_1.UserService)
], ManagementEvaluationSettingRoleController.prototype, "userService", void 0);
__decorate([
    (0, common_1.Inject)(mail_service_1.MailService),
    __metadata("design:type", mail_service_1.MailService)
], ManagementEvaluationSettingRoleController.prototype, "mailService", void 0);
__decorate([
    (0, common_1.Post)('/users-email-list'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationSettingRoleController.prototype, "getUsersEmailList", null);
__decorate([
    (0, common_1.Get)('/mail-history-list'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExceptionPeriodRequestDto_1.GetMailHistoryListDTO, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationSettingRoleController.prototype, "getMailHistoryList", null);
__decorate([
    (0, common_1.Put)('/update-mail-history/:id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationSettingRoleController.prototype, "updateMailHistory", null);
__decorate([
    (0, common_1.Delete)('/delete-mail/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationSettingRoleController.prototype, "deleteMail", null);
__decorate([
    (0, common_1.Post)('/import-user-from-excel'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationSettingRoleController.prototype, "importUserFromExcel", null);
__decorate([
    (0, common_1.Get)('/mail-template-list'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MailManagementDto_1.GetMailTemplateListDTO, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationSettingRoleController.prototype, "getMailTemplateList", null);
__decorate([
    (0, common_1.Get)('/mail-template-list-by-id'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationSettingRoleController.prototype, "getMailTemplateListById", null);
__decorate([
    (0, common_1.Put)('/edit-mail-template'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MailManagementDto_1.EditMailTemplateObj, Object]),
    __metadata("design:returntype", Promise)
], ManagementEvaluationSettingRoleController.prototype, "editMailTemplate", null);
ManagementEvaluationSettingRoleController = __decorate([
    (0, common_1.Controller)('v1/f7/management-evaluation-setting'),
    (0, Authorization_1.Authorize)(Roles_1.Roles.F7),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, swagger_1.ApiTags)(Tag_1.Tag.F7)
], ManagementEvaluationSettingRoleController);
exports.ManagementEvaluationSettingRoleController = ManagementEvaluationSettingRoleController;
//# sourceMappingURL=evaluationSetting.controller.js.map