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
exports.ManagementBasicBehaviorSettingRoleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const Roles_1 = require("../../enum/Roles");
const Tag_1 = require("../../enum/Tag");
const Authorization_1 = require("../../handler/annotation/Authorization");
const role_guard_1 = require("../../handler/guard/role.guard");
const evaluationPeriod_service_1 = require("../../services/evaluationPeriod.service");
const ManagementEvaluationProDto_1 = require("../../model/request/ManagementEvaluationProDto");
const adminEvaluation_service_1 = require("../../services/adminEvaluation.service");
const EvaluationParamDto_1 = require("../../model/request/EvaluationParamDto");
const evaluation_service_1 = require("../../services/evaluation.service");
const user_service_1 = require("../../services/user.service");
const ApprovalHistoryResponseDto_1 = require("../../model/response/ApprovalHistoryResponseDto");
const IdNumberDto_1 = require("../../model/request/IdNumberDto");
const adminApproval_service_1 = require("../../services/adminApproval.service");
const ExceptionPeriodRequestDto_1 = require("../../model/request/ExceptionPeriodRequestDto");
const evaluationPeriodDepartmentSetting_service_1 = require("../../services/evaluationPeriodDepartmentSetting.service");
const mail_service_1 = require("../../services/mail.service");
const UserSettingEvaluatorSearchRequestDto_1 = require("../../model/request/UserSettingEvaluatorSearchRequestDto");
const company_service_1 = require("../../services/company.service");
const department_service_1 = require("../../services/department.service");
const cronJob_services_1 = require("../../services/cronJob.services");
const SendStatusDto_1 = require("../../model/response/F6/SendStatusDto");
const EvaluatorRequestDto_1 = require("../../model/request/EvaluatorRequestDto");
const evaluator_service_1 = require("../../services/evaluator.service");
const FeedbackRequestDto_1 = require("../../model/request/FeedbackRequestDto");
const feedback_service_1 = require("../../services/feedback.service");
const authVietnamSystem_guard_1 = require("../../handler/guard/authVietnamSystem.guard");
const excel_service_1 = require("../../services/excel.service");
const fs = require("fs");
const path = require("path");
let ManagementBasicBehaviorSettingRoleController = class ManagementBasicBehaviorSettingRoleController {
    async getListUserEvaluation(query, req) {
        var _a, _b;
        const departments = query.departmentSearch;
        const divisons = query.divisionSearch;
        const salaryRanks = query.salaryRank.split(',');
        const periodArrs = ['', '上期', '下期'];
        const status = query.stringStatus !== '' ? query.stringStatus.split(',') : [];
        const params = {
            email: query.email || '',
            department: departments,
            division: divisons,
            salaryRank: salaryRanks,
            title: `${query.yearDisplayCalendar}年${periodArrs[query.periodEvaluate]}`,
            offset: query.offset,
            limit: query.limit,
            sortBy: query.sortBy,
            sortType: query.sortType,
            status,
            sortColumns: (_a = query.sortColumns) !== null && _a !== void 0 ? _a : [],
            sortDirections: (_b = query.sortDirections) !== null && _b !== void 0 ? _b : [],
            year: query.yearDisplayCalendar,
            periodIndex: query.periodEvaluate,
        };
        const datas = await this.adminEvaluationService.listUserEvaluation(params, req.user.companyGroupCode, req['user'].timeZone);
        return datas;
    }
    async download(query, res, req) {
        const departments = query.department !== 'すべて'
            ? query === null || query === void 0 ? void 0 : query.department.split(':')
            : query.department;
        const salaryRanks = query.salaryRank.split(',');
        const periodArrs = ['', '上期', '下期'];
        const status = query.stringStatus !== '' ? query.stringStatus.split(',') : [];
        const params = {
            email: query.email,
            department: departments,
            salaryRank: salaryRanks,
            title: `${query.yearDisplayCalendar}年${periodArrs[query.periodEvaluate]}`,
            offset: query.offset,
            limit: query.limit,
            sortBy: query.sortBy,
            sortType: query.sortType,
            status,
        };
        const buffer = await this.adminEvaluationService.exportCSV(params, req.user.companyGroupCode);
        res.send(buffer);
    }
    findOne(params, query, req) {
        const { role } = query;
        const result = this.evaluationServices.findOne(params.id, Number(params.userId), role, req.user.companyGroupCode);
        return result;
    }
    evaluationSkillCheck(id) {
        return this.userServices.evaluationSkillCheck(id);
    }
    getEvaluationById(id, query, req) {
        return this.userServices.getEvaluationData(id, req.user, query.isEvaluatorUser, req.user['companyGroupCode'], req.user.timeZone);
    }
    rejectEvaluation(dataBody, req) {
        const host = `${process.env.HOSTNAME_}/company/${req.user.companyGroupCode}`;
        const result = this.evaluationServices.rejectEvaluation(Number(dataBody.evaluationId), dataBody.status, dataBody.selectedOrder, dataBody.content, dataBody.approverId, dataBody.ownerId, dataBody.listEvalutor, dataBody.updatedTime, dataBody.maxOrder, host, req.user.companyGroupCode, req.user.timeZone);
        return result;
    }
    async getListApprovalHistory(param) {
        const results = await this.approvalService.getListApprovalHistory(param.id);
        return results;
    }
    async getDepartmentGoal(query, req) {
        const { idEvaluation } = query;
        const userId = await this.userServices.getUserIdByEvaluationId(idEvaluation);
        const departmentGoal = await this.userServices.getDepartmentGoal(idEvaluation, userId, req.user.companyGroupCode, req.user.timeZone);
        return departmentGoal;
    }
    getAchievementSettingPublic(query, req) {
        const achievementType = query.achievementType;
        return this.userServices.getAchievementPublic(achievementType, req.user.companyGroupCode);
    }
    getListProSkillPublic(req, query) {
        return this.userServices.getListProSkillPublic(req.user, query.evaluationId);
    }
    getAchievementAddSettingPublic(query, req) {
        const achievementType = query.achievementType;
        const type = query.type;
        return this.userServices.getAchievementAddPublic(achievementType, type, req.user.companyGroupCode);
    }
    getBasicBehaviorSkillPublic(query, req) {
        const basicBehaviorType = query.basicBehaviorType;
        return this.userServices.getBasicBehaviorSkillPublic(basicBehaviorType, req.user.companyGroupCode, query.level);
    }
    async listPeriods(req) {
        return await this.evaluationPeriodService.getAllPeriod(req.user.companyGroupCode, req.user.timeZone);
    }
    async exportHistoryEvaluation(params, req) {
        const data = await this.adminEvaluationService.exportHistoryEvaluation(params, req.user.companyGroupCode);
        return data;
    }
    async listPeriod(params, req) {
        return await this.evaluationPeriodService.listPeriodByYear(params.yearStart, params.yearEnd, req.user.companyGroupCode);
    }
    async evaluationPeriodList(params, req) {
    }
    async goalConfirm(body, req) {
        return await this.adminEvaluationService.goalConfirm(body, req.user.companyGroupCode);
    }
    async evaluationConfirm(body, req) {
        return await this.adminEvaluationService.evaluationConfirm(body, req.user.companyGroupCode);
    }
    async publicEvaluation(body, req) {
        const host = `${process.env.HOSTNAME_}/company/${req.user.companyGroupCode}`;
        return await this.adminEvaluationService.publicEvaluation(body, host, req.user.companyGroupCode);
    }
    async undoFixEvaluation(body) {
        return await this.adminEvaluationService.undoFixEvaluation(body);
    }
    async listPeriodDepartmentSetting(query, req) {
        var _a, _b;
        const companyGroupCode = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode) !== null && _b !== void 0 ? _b : null;
        return this.periodDeptSettingService.list(Number(query.evaluationPeriodId), companyGroupCode);
    }
    async savePeriodDepartmentSetting(body, req) {
        var _a, _b;
        const companyGroupCode = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode) !== null && _b !== void 0 ? _b : null;
        return this.periodDeptSettingService.save(body, companyGroupCode);
    }
    async deletePeriodDepartmentSetting(id, req) {
        var _a, _b;
        const companyGroupCode = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode) !== null && _b !== void 0 ? _b : null;
        return this.periodDeptSettingService.delete({ id: Number(id) }, companyGroupCode);
    }
    async getPeriodDetail(params, req) {
        const conditions = {
            year: params.year,
            period_index: params.periodIndex,
            company_group_code: req.user.companyGroupCode,
        };
        return await this.evaluationPeriodService.getPeriodDetailByCondition(conditions);
    }
    checkIsFixed(query, req) {
        return this.userService.checkIsFixed(query, req.user.companyGroupCode);
    }
    checkImportUser(query, req) {
        return this.userService.checkImportUser(query, req.user.companyGroupCode);
    }
    async getToEmailList(params, departmentId, req) {
        return await this.userService.getToEmailList(params.type, params.year, params.periodIndex, req.user.companyGroupCode, departmentId ? Number(departmentId) : undefined);
    }
    async getToEmailListFixed(params, req) {
        return await this.userService.getToEmailListFixed(params.type, params.periodId, req.user.companyGroupCode, params.evaluationId);
    }
    async checkStatusSelected(params, query) {
        return await this.userService.checkStatusRecordSend(query.rowData, params.type);
    }
    async getUsersEmailList(conditions, req) {
        return await this.userService.getUsersEmailList(conditions.conditions, req.user.companyGroupCode);
    }
    async saneMailNow(body, req) {
        var _a, _b, _c;
        if ([5, 6].includes((_a = body.inputedValues) === null || _a === void 0 ? void 0 : _a.type)) {
            const object = Object.assign(Object.assign({}, body.inputedValues), { emailType: body.inputedValues.type });
            const data = Object.assign(Object.assign({}, body.content), { dataMailCCs: body.inputedValues.dataMailCCs });
            return await this.mailService.sendMailFixedUserEvaluator(data, object, req.user.companyGroupCode);
        }
        else {
            this.mailService.sendMailFixedGoal(body.content, body.inputedValues.mailToObjList, req.user.companyGroupCode, (_b = body.inputedValues) === null || _b === void 0 ? void 0 : _b.evaluationPeriodId, (_c = body.inputedValues) === null || _c === void 0 ? void 0 : _c.type);
            return await this.mailService.saveMailTemplate(body.inputedValues, req.user.companyGroupCode, false);
        }
    }
    async saveMailTemplate(body, req) {
        return await this.mailService.saveMailTemplate(body, req.user.companyGroupCode, true);
    }
    async savePeriod(body, req) {
        const conditions = {
            year: body.condition.year,
            period_index: body.condition.periodIndex,
            company_group_code: req.user.companyGroupCode,
        };
        return await this.evaluationPeriodService.savePeriod(conditions, body.body);
    }
    findListUserToSettingEvaluation(query, req) {
        const departments = query.department !== 'すべて'
            ? query === null || query === void 0 ? void 0 : query.department.split(':')
            : query.department;
        const divisions = query.division !== 'すべて' ? query === null || query === void 0 ? void 0 : query.division.split(':') : query.division;
        const params = {
            nameAndEmail: query.nameAndEmail,
            department: departments,
            division: divisions,
            offset: query.offset,
            limit: query.limit,
            sortBy: query.sortBy,
            sortType: query.sortType,
            state: query.state,
            companyGroupCode: req.user.companyGroupCode,
        };
        return this.userService.findListUserToSettingEvaluation(params);
    }
    async addUserSettingEvaluation(body, req) {
        return await this.userService.addUserSettingEvaluationProcedure(body, req.user.companyGroupCode, req['user'].timeZone, req.user.id);
    }
    async searchListUserSettingEvaluator(query, req) {
        var _a, _b, _c, _d;
        const departments = query.department !== 'すべて'
            ? (_a = query === null || query === void 0 ? void 0 : query.department) === null || _a === void 0 ? void 0 : _a.split(':')
            : query.department;
        query = Object.assign(Object.assign({}, query), { userName: query.userName === undefined ? '' : query.userName, department: departments, evaluatorName: query.evaluatorName === undefined ? '' : query.evaluatorName, offset: query.offset, limit: 20, skill: query.skill, level: query.level, flagSkill: query.flagSkill, divisionId: (_b = query.divisionId) !== null && _b !== void 0 ? _b : null, departmentId: (_c = query.departmentId) !== null && _c !== void 0 ? _c : null, tabMode: (_d = query.tabMode) !== null && _d !== void 0 ? _d : null, companyGroupCode: req.user.companyGroupCode });
        return await this.userService.searchListUserSettingEvaluator(query);
    }
    importUser(query, req) {
        return this.userService.importUserProcedue(query, req.user.companyGroupCode, req['user'].timeZone);
    }
    deleteUserSettingEvaluator(params, req) {
        return this.userService.deleteUserSettingEvaluator(params, req.user.companyGroupCode);
    }
    updateSettingEvaluatorOfOneUser(query, req) {
        return this.userService.updateSettingEvaluatorOfOneUser(query, req.user.companyGroupCode);
    }
    getListEvaluator(req) {
        return this.userService.getListEvaluator(undefined, req.user.companyGroupCode);
    }
    updateSettingEvaluatorListUser(query, req) {
        return this.userService.updateSettingEvaluatorListUser(query, req.user.companyGroupCode);
    }
    getCompanies() {
        return this.companyService.getOptionCompany();
    }
    getDepartments(query, req) {
        var _a;
        return this.departmentService.getOptionDepartment(query, (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode, req.user.timeZone);
    }
    getEvaluatorUsers(evaluationCreatorId, req) {
        return this.evaluationPeriodService.getEvaluatorUser(evaluationCreatorId, req.user.companyGroupCode);
    }
    getEvaluationByPeriod(query, req) {
        const { userId, year, periodIndex } = query;
        return this.evaluationPeriodService.getEvaluationByPeriod(userId, year, periodIndex, req.user.companyGroupCode);
    }
    async updateEvaluationPeriodException(req, body) {
        return await this.evaluationPeriodService.updateEvaluationPeriodException(body.evaluations, body.userId, req.user.id, body.deleteIds, body.year, body.periodIndex, req.user.companyGroupCode);
    }
    async listUserEvaluationPeriod(params, req) {
        const results = await this.adminEvaluationService.listUserEvaluationPeriod(params, req.user.companyGroupCode);
        return results;
    }
    sendEmailFixedGoal(body, req) {
        this.evaluationServices.sendMailFixedGoal(body, req.user.companyGroupCode, req.user.timeZone, req.user.emailHR);
        return { message: 'success' };
    }
    getMailTemplateById(params) {
        return this.mailService.getMailTemplateById(params.id);
    }
    async getAllDepartmentEvaluation(query, req) {
        const results = await this.evaluationServices.getAllDepartmentEvaluationDefault(query, req.user.companyGroupCode);
        return results;
    }
    async cronjobSendMail() {
        await this.cronjobService.triggerNotifications();
    }
    async getAllSkill(req) {
        return this.userService.getAllSkill(req.user.companyGroupCode);
    }
    async getAllSkillPublic(req) {
        return this.userService.getAllSkillPublic(req.user.companyGroupCode);
    }
    async sendRejectedStatus(id, req, body) {
        const { comment, type, statusReject, updateTime } = body;
        const userId = req.user.id;
        const host = `${process.env.HOSTNAME_}/company/${req.user.companyGroupCode}`;
        return this.evaluatorServices.sendRejectStatus(id, comment, userId, type, statusReject, updateTime, host, req.user.companyGroupCode, req.user.timeZone);
    }
    async sendApprovedStatus(id, req, body) {
        const { comment, type, updateTime } = body;
        const userId = req.user.id;
        const host = `${process.env.HOSTNAME_}/company/${req.user.companyGroupCode}/approve`;
        const result = await this.evaluatorServices.sendApproveStatus(id, comment, userId, type, updateTime, host, req.user.companyGroupCode, req.user.timeZone);
        return result;
    }
    async getListFeedback(query, req) {
        var _a;
        const type = query.typeFeedback !== '' ? query.typeFeedback.split(',') : [];
        const status = query.statusFeedback !== '' ? query.statusFeedback.split(',') : [];
        const departments = query.department !== 'すべて'
            ? query.department.split(':')
            : query.department;
        const params = {
            dateStart: query.dateStart,
            dateEnd: query.dateEnd,
            type: type,
            department: departments,
            status: status,
            user: query.user,
            limit: query.limit,
            offset: query.offset,
            sortBy: query.sortBy,
            sortType: query.sortType,
            companyGroupCode: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode,
        };
        return await this.feedbackService.listFeedback(params);
    }
    async getFeedbacksForExcel(body, req) {
        return await this.feedbackService.getFeedbacksForExcel(body, req.user.companyGroupCode, req.user.timeZone);
    }
    async deleteFeedback(params, req) {
        var _a;
        return await this.feedbackService.deleteFeedback(params, (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode);
    }
    async detailFeedback(params, req) {
        var _a;
        return await this.feedbackService.detailFeedback(params, (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode);
    }
    async getZipFeedback(params, req) {
        return await this.feedbackService.getZipFeedback(params, req);
    }
    async updateFeedback(params, req) {
        var _a;
        return await this.feedbackService.updateFeedback(params, (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode);
    }
    async getFeedbacks(body, req) {
        return await this.feedbackService.getUserFeedbacks(body, null, req.user.companyGroupCode, req.user.timeZone);
    }
    async getDetailFeedback(query, req) {
        const result = await this.feedbackService.getDetailFeedback(query.id, req.user.timeZone);
        return result;
    }
    async cronJobCreateEvaluation(req) {
        const group = {
            code: req.user.companyGroupCode,
            timezone: req.user.timeZone,
        };
        return await this.cronjobService.processCompanyGroupSettingGoals(group);
    }
    async cronJobSendMail(req) {
        const group = {
            code: req.user.companyGroupCode,
            timezone: req.user.timeZone,
        };
        return await this.cronjobService.processCompanyGroupSendMail(group);
    }
    async undoException(data, req) {
        return await this.userService.undoException(data, req);
    }
    async startExcelJob(body, req) {
        const folderPath = path.join(__dirname, '../../../jobs');
        const now = Date.now();
        const FIFTEEN_MINUTES = 15 * 60 * 1000;
        fs.readdir(folderPath, (err, files) => {
            if (err) {
                console.error('Lỗi khi đọc thư mục:', err);
                return;
            }
            files.forEach((file) => {
                const match = file.match(/^temp-(\d+)\.zip$/);
                if (!match)
                    return;
                const timestamp = parseInt(match[1], 10);
                if (now - timestamp > FIFTEEN_MINUTES) {
                    const filePath = path.join(folderPath, file);
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error(`Không thể xóa file ${file}:`, err);
                        }
                        else {
                            console.log(`Đã xóa file: ${file}`);
                        }
                    });
                }
            });
        });
        const jobId = await this.excelService.createJob(body, req);
        return { jobId };
    }
    checkJob(jobId) {
        return {
            ready: this.excelService.isJobReady(jobId),
            percent: this.excelService.percentJob(jobId),
            message: this.excelService.messsageJob(jobId),
        };
    }
    downloadExcel(jobId, year, periodIndex, res) {
        const filePath = this.excelService.getFilePath(jobId);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not ready' });
        }
        res.download(filePath, `【${year}年${periodIndex == 1 ? '上期' : '下期'}】評価表.zip`, (err) => {
            if (err) {
                console.error('Lỗi khi gửi file:', err);
            }
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error(`Không thể xóa file ${filePath}:`, unlinkErr);
                }
                else {
                    console.log(`Đã xóa file tạm: ${filePath}`);
                }
            });
        });
    }
};
__decorate([
    (0, common_1.Inject)(evaluator_service_1.EvaluatorServices),
    __metadata("design:type", evaluator_service_1.EvaluatorServices)
], ManagementBasicBehaviorSettingRoleController.prototype, "evaluatorServices", void 0);
__decorate([
    (0, common_1.Inject)(evaluationPeriod_service_1.EvaluationPeriodService),
    __metadata("design:type", evaluationPeriod_service_1.EvaluationPeriodService)
], ManagementBasicBehaviorSettingRoleController.prototype, "evaluationPeriodService", void 0);
__decorate([
    (0, common_1.Inject)(adminEvaluation_service_1.AdminEvaluationService),
    __metadata("design:type", Object)
], ManagementBasicBehaviorSettingRoleController.prototype, "adminEvaluationService", void 0);
__decorate([
    (0, common_1.Inject)(evaluation_service_1.EvaluationService),
    __metadata("design:type", evaluation_service_1.EvaluationService)
], ManagementBasicBehaviorSettingRoleController.prototype, "evaluationServices", void 0);
__decorate([
    (0, common_1.Inject)(user_service_1.UserService),
    __metadata("design:type", user_service_1.UserService)
], ManagementBasicBehaviorSettingRoleController.prototype, "userServices", void 0);
__decorate([
    (0, common_1.Inject)(adminApproval_service_1.AdminApprovalService),
    __metadata("design:type", Object)
], ManagementBasicBehaviorSettingRoleController.prototype, "approvalService", void 0);
__decorate([
    (0, common_1.Inject)(user_service_1.UserService),
    __metadata("design:type", user_service_1.UserService)
], ManagementBasicBehaviorSettingRoleController.prototype, "userService", void 0);
__decorate([
    (0, common_1.Inject)(mail_service_1.MailService),
    __metadata("design:type", mail_service_1.MailService)
], ManagementBasicBehaviorSettingRoleController.prototype, "mailService", void 0);
__decorate([
    (0, common_1.Inject)(company_service_1.CompanyService),
    __metadata("design:type", company_service_1.CompanyService)
], ManagementBasicBehaviorSettingRoleController.prototype, "companyService", void 0);
__decorate([
    (0, common_1.Inject)(department_service_1.DepartmentService),
    __metadata("design:type", department_service_1.DepartmentService)
], ManagementBasicBehaviorSettingRoleController.prototype, "departmentService", void 0);
__decorate([
    (0, common_1.Inject)(cronJob_services_1.CronJobServices),
    __metadata("design:type", cronJob_services_1.CronJobServices)
], ManagementBasicBehaviorSettingRoleController.prototype, "cronjobService", void 0);
__decorate([
    (0, common_1.Inject)(feedback_service_1.FeedbackService),
    __metadata("design:type", feedback_service_1.FeedbackService)
], ManagementBasicBehaviorSettingRoleController.prototype, "feedbackService", void 0);
__decorate([
    (0, common_1.Inject)(excel_service_1.ExcelService),
    __metadata("design:type", excel_service_1.ExcelService)
], ManagementBasicBehaviorSettingRoleController.prototype, "excelService", void 0);
__decorate([
    (0, common_1.Inject)(evaluationPeriodDepartmentSetting_service_1.EvaluationPeriodDepartmentSettingService),
    __metadata("design:type", evaluationPeriodDepartmentSetting_service_1.EvaluationPeriodDepartmentSettingService)
], ManagementBasicBehaviorSettingRoleController.prototype, "periodDeptSettingService", void 0);
__decorate([
    (0, common_1.Get)('/list-user-evaluation'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ManagementEvaluationProDto_1.EvaluationSearchDto, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "getListUserEvaluation", null);
__decorate([
    (0, common_1.Get)('/export-CSV'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ManagementEvaluationProDto_1.EvaluationSearchDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "download", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200 }),
    (0, common_1.Get)('/evaluation8-10/:id/:userId'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.Evaluation810Param, Object, Object]),
    __metadata("design:returntype", void 0)
], ManagementBasicBehaviorSettingRoleController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200 }),
    (0, common_1.Get)('/evaluation-skill/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ManagementBasicBehaviorSettingRoleController.prototype, "evaluationSkillCheck", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200 }),
    (0, common_1.Get)('/evaluation/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, EvaluationParamDto_1.GetEvaluationDTO, Object]),
    __metadata("design:returntype", void 0)
], ManagementBasicBehaviorSettingRoleController.prototype, "getEvaluationById", null);
__decorate([
    (0, common_1.Post)('/evaluation8-10/reject'),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.Evaluation810RejectInfo, Object]),
    __metadata("design:returntype", void 0)
], ManagementBasicBehaviorSettingRoleController.prototype, "rejectEvaluation", null);
__decorate([
    (0, common_1.Get)('/evaluation/:id/get-approval-history'),
    (0, swagger_1.ApiResponse)({ status: 200, type: ApprovalHistoryResponseDto_1.ApprovalHistoryResponseDto }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [IdNumberDto_1.IdNumberDto]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "getListApprovalHistory", null);
__decorate([
    (0, swagger_1.ApiResponse)({ status: 200 }),
    (0, common_1.Get)('/department-goal'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [IdNumberDto_1.IdDto, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "getDepartmentGoal", null);
__decorate([
    (0, common_1.Get)('/evaluation/achievement/public'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.EvaluationAchievementPublicTypeDto, Object]),
    __metadata("design:returntype", void 0)
], ManagementBasicBehaviorSettingRoleController.prototype, "getAchievementSettingPublic", null);
__decorate([
    (0, common_1.Get)('/evaluation/list-pro-skill/public'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ManagementBasicBehaviorSettingRoleController.prototype, "getListProSkillPublic", null);
__decorate([
    (0, common_1.Get)('/evaluation/achievement-additional/public'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.EvaluationAchievementPublicTypeDto, Object]),
    __metadata("design:returntype", void 0)
], ManagementBasicBehaviorSettingRoleController.prototype, "getAchievementAddSettingPublic", null);
__decorate([
    (0, common_1.Get)('/evaluation/basic-behavior-skill/public'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EvaluationParamDto_1.EvaluationBasicBehaviorPublicTypeDto, Object]),
    __metadata("design:returntype", void 0)
], ManagementBasicBehaviorSettingRoleController.prototype, "getBasicBehaviorSkillPublic", null);
__decorate([
    (0, common_1.Get)('/list-period'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "listPeriods", null);
__decorate([
    (0, common_1.Get)('/export-history-evaluation'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "exportHistoryEvaluation", null);
__decorate([
    (0, common_1.Get)('/list-periods'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExceptionPeriodRequestDto_1.ListPeriodDTO, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "listPeriod", null);
__decorate([
    (0, common_1.Get)('/evaluation-period-list'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "evaluationPeriodList", null);
__decorate([
    (0, common_1.Post)('/goal-confirm'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExceptionPeriodRequestDto_1.ConfirmGoalDTO, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "goalConfirm", null);
__decorate([
    (0, common_1.Post)('/evaluation-confirm'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExceptionPeriodRequestDto_1.ConfirmGoalDTO, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "evaluationConfirm", null);
__decorate([
    (0, common_1.Post)('/public-evaluation'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExceptionPeriodRequestDto_1.ConfirmGoalDTO, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "publicEvaluation", null);
__decorate([
    (0, common_1.Post)('/undo-fix-evaluation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExceptionPeriodRequestDto_1.UndoFixEvaluationDTO]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "undoFixEvaluation", null);
__decorate([
    (0, common_1.Get)('/period/department/list'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExceptionPeriodRequestDto_1.ListPeriodDepartmentSettingDTO, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "listPeriodDepartmentSetting", null);
__decorate([
    (0, common_1.Post)('/period/department/save'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExceptionPeriodRequestDto_1.SavePeriodDepartmentSettingDTO, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "savePeriodDepartmentSetting", null);
__decorate([
    (0, common_1.Delete)('/period/department/delete/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "deletePeriodDepartmentSetting", null);
__decorate([
    (0, common_1.Get)('/period/:year/:periodIndex'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExceptionPeriodRequestDto_1.PeriodDTO, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "getPeriodDetail", null);
__decorate([
    (0, common_1.Get)('/check-is-fixed'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExceptionPeriodRequestDto_1.PeriodDTO, Object]),
    __metadata("design:returntype", void 0)
], ManagementBasicBehaviorSettingRoleController.prototype, "checkIsFixed", null);
__decorate([
    (0, common_1.Get)('/check-import-user'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExceptionPeriodRequestDto_1.PeriodDTO, Object]),
    __metadata("design:returntype", void 0)
], ManagementBasicBehaviorSettingRoleController.prototype, "checkImportUser", null);
__decorate([
    (0, common_1.Get)('/get-to-email-list/:type/:year/:periodIndex'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)('departmentId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExceptionPeriodRequestDto_1.GetToEmailListDTO, String, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "getToEmailList", null);
__decorate([
    (0, common_1.Get)('/get-mail-template-fixed/:type/:periodId/:evaluationId'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExceptionPeriodRequestDto_1.GetToEmailFixedListDTO, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "getToEmailListFixed", null);
__decorate([
    (0, common_1.Post)('/check-status-selected/:type'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExceptionPeriodRequestDto_1.CheckStatusRecordSendDTO, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "checkStatusSelected", null);
__decorate([
    (0, common_1.Post)('/users-email-list'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "getUsersEmailList", null);
__decorate([
    (0, common_1.Post)('/send-mail-now'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExceptionPeriodRequestDto_1.SendMailNow2DTO, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "saneMailNow", null);
__decorate([
    (0, common_1.Post)('/save-mail-template'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExceptionPeriodRequestDto_1.SendMailBodyDTO, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "saveMailTemplate", null);
__decorate([
    (0, common_1.Post)('/period/save'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExceptionPeriodRequestDto_1.SavePeriodDTO, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "savePeriod", null);
__decorate([
    (0, common_1.Get)('/find-list-user-to-setting-evaluation'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExceptionPeriodRequestDto_1.findListUserToSettingEvaluationDTO, Object]),
    __metadata("design:returntype", void 0)
], ManagementBasicBehaviorSettingRoleController.prototype, "findListUserToSettingEvaluation", null);
__decorate([
    (0, common_1.Post)('/add-user-setting-evaluation'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserSettingEvaluatorSearchRequestDto_1.AddUserSettingEvaluationDTO, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "addUserSettingEvaluation", null);
__decorate([
    (0, common_1.Get)('/find-user-setting-evaluator'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "searchListUserSettingEvaluator", null);
__decorate([
    (0, common_1.Get)('/import-user'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExceptionPeriodRequestDto_1.ImportUserDTO, Object]),
    __metadata("design:returntype", void 0)
], ManagementBasicBehaviorSettingRoleController.prototype, "importUser", null);
__decorate([
    (0, common_1.Put)('/delete-user-setting-evaluator'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ManagementBasicBehaviorSettingRoleController.prototype, "deleteUserSettingEvaluator", null);
__decorate([
    (0, common_1.Put)('/update-setting-evaluator-of-one-user'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExceptionPeriodRequestDto_1.UpdateSettingEvaluatorOfOneUserDTO, Object]),
    __metadata("design:returntype", void 0)
], ManagementBasicBehaviorSettingRoleController.prototype, "updateSettingEvaluatorOfOneUser", null);
__decorate([
    (0, common_1.Get)('/get-list-evaluator'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ManagementBasicBehaviorSettingRoleController.prototype, "getListEvaluator", null);
__decorate([
    (0, common_1.Put)('/update-setting-evaluator-list-user'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ManagementBasicBehaviorSettingRoleController.prototype, "updateSettingEvaluatorListUser", null);
__decorate([
    (0, common_1.Get)('/company'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ManagementBasicBehaviorSettingRoleController.prototype, "getCompanies", null);
__decorate([
    (0, common_1.Get)('/department'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExceptionPeriodRequestDto_1.PeriodDTO, Object]),
    __metadata("design:returntype", void 0)
], ManagementBasicBehaviorSettingRoleController.prototype, "getDepartments", null);
__decorate([
    (0, common_1.Get)('/user/evaluator'),
    __param(0, (0, common_1.Query)('evaluationCreatorId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ManagementBasicBehaviorSettingRoleController.prototype, "getEvaluatorUsers", null);
__decorate([
    (0, common_1.Get)('/exception/get-evaluation-by-period'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExceptionPeriodRequestDto_1.EvaluationByPeriodParamDto, Object]),
    __metadata("design:returntype", void 0)
], ManagementBasicBehaviorSettingRoleController.prototype, "getEvaluationByPeriod", null);
__decorate([
    (0, common_1.Put)('/exception'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ExceptionPeriodRequestDto_1.UpdateEvaluationPeriodExceptionDto]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "updateEvaluationPeriodException", null);
__decorate([
    (0, common_1.Get)('/list-user-evaluation-period'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExceptionPeriodRequestDto_1.ListUserPeriodDTO, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "listUserEvaluationPeriod", null);
__decorate([
    (0, common_1.Post)('/send-email'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ManagementBasicBehaviorSettingRoleController.prototype, "sendEmailFixedGoal", null);
__decorate([
    (0, common_1.Get)('/get-mail-template-by-id/:id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ManagementBasicBehaviorSettingRoleController.prototype, "getMailTemplateById", null);
__decorate([
    (0, common_1.Get)('/get-all-department-evaluation-default'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "getAllDepartmentEvaluation", null);
__decorate([
    (0, common_1.Post)('/cronjob-send-mail'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "cronjobSendMail", null);
__decorate([
    (0, common_1.Get)('/get-all-skill'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "getAllSkill", null);
__decorate([
    (0, common_1.Get)('/get-all-skill-public'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "getAllSkillPublic", null);
__decorate([
    (0, common_1.Put)('/rejected/status/:id'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: SendStatusDto_1.SendStatusDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, EvaluatorRequestDto_1.EvaluatorApproveStatusDto]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "sendRejectedStatus", null);
__decorate([
    (0, common_1.Put)('/approved/status/:id'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        type: SendStatusDto_1.SendStatusDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, EvaluatorRequestDto_1.EvaluatorApproveStatusDto]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "sendApprovedStatus", null);
__decorate([
    (0, common_1.Get)('/list-feedback'),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FeedbackRequestDto_1.ListFeedbackDto, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "getListFeedback", null);
__decorate([
    (0, common_1.Post)('/feedbacks/excel'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FeedbackRequestDto_1.UserFeedbackSearchDto, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "getFeedbacksForExcel", null);
__decorate([
    (0, common_1.Put)('/delete-feedback'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "deleteFeedback", null);
__decorate([
    (0, common_1.Get)('/detail-feedback'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "detailFeedback", null);
__decorate([
    (0, common_1.Get)('/list-feedback/download-zip'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "getZipFeedback", null);
__decorate([
    (0, common_1.Put)('/update-feedback'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "updateFeedback", null);
__decorate([
    (0, common_1.Post)('/feedbacks'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FeedbackRequestDto_1.UserFeedbackSearchDto, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "getFeedbacks", null);
__decorate([
    (0, common_1.Get)('/get-detail-feedback'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "getDetailFeedback", null);
__decorate([
    (0, common_1.Get)('/run-cron-job-create-evaluation'),
    (0, common_1.UseGuards)(authVietnamSystem_guard_1.AuthVietNamSystemGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "cronJobCreateEvaluation", null);
__decorate([
    (0, common_1.Get)('/run-cron-job-send-mail'),
    (0, common_1.UseGuards)(authVietnamSystem_guard_1.AuthVietNamSystemGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "cronJobSendMail", null);
__decorate([
    (0, common_1.Put)('/undo-exception'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "undoException", null);
__decorate([
    (0, common_1.Post)('excel/start'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ManagementBasicBehaviorSettingRoleController.prototype, "startExcelJob", null);
__decorate([
    (0, common_1.Get)('excel/status'),
    __param(0, (0, common_1.Query)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], ManagementBasicBehaviorSettingRoleController.prototype, "checkJob", null);
__decorate([
    (0, common_1.Get)('excel/download'),
    __param(0, (0, common_1.Query)('jobId')),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('periodIndex')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Object]),
    __metadata("design:returntype", void 0)
], ManagementBasicBehaviorSettingRoleController.prototype, "downloadExcel", null);
ManagementBasicBehaviorSettingRoleController = __decorate([
    (0, common_1.Controller)('v1/f5/management-evaluation-history'),
    (0, Authorization_1.Authorize)(Roles_1.Roles.F5),
    (0, common_1.UseGuards)(role_guard_1.RolesGuard),
    (0, swagger_1.ApiTags)(Tag_1.Tag.F5)
], ManagementBasicBehaviorSettingRoleController);
exports.ManagementBasicBehaviorSettingRoleController = ManagementBasicBehaviorSettingRoleController;
//# sourceMappingURL=basicBehaviorSetting.controller.js.map