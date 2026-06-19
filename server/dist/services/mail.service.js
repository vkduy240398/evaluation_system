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
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("../repository/user.repository");
const util_1 = require("../common/mail/util");
const mailTemplates_1 = require("../common/mail/mailTemplates");
const evaluationPeriod_repository_1 = require("../repository/evaluationPeriod.repository");
const evaluation_repository_1 = require("../repository/evaluation.repository");
const proSkillSetting_repository_1 = require("../repository/proSkillSetting.repository");
const proSkill_repository_1 = require("../repository/proSkill.repository");
const util_2 = require("../common/util");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
const mailSetting_repository_1 = require("../repository/mailSetting.repository");
const historyCronjob_repository_1 = require("../repository/historyCronjob.repository");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const TemplateMailId_1 = require("../enum/TemplateMailId");
const sequelize_1 = require("sequelize");
const ReplaceKeyword_1 = require("../common/ReplaceKeyword");
const moment = require("moment");
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, '../../.env') });
let MailService = class MailService {
    constructor() {
        this.DATE_FORMAT = 'YYYY/M/DD';
    }
    async sendMailStartGoalSetting(period, type, listToMail, ccEmail) {
        const toEmails = [];
        let titleEmail = ``;
        let infoEmail = ``;
        if (listToMail) {
            if (type === 2) {
                titleEmail = period.checkNew
                    ? (0, mailTemplates_1.startGoalSettingPeriodTemplate2)().title
                    : (0, mailTemplates_1.updateGoalSettingTimeTemplate2)().title;
                infoEmail = period.checkNew
                    ? (0, mailTemplates_1.startGoalSettingPeriodTemplate2)().body
                    : (0, mailTemplates_1.updateGoalSettingTimeTemplate2)().body;
            }
            if (type === 1) {
                titleEmail = period.checkNew
                    ? (0, mailTemplates_1.startGoalSettingPeriodTemplate1)().title
                    : (0, mailTemplates_1.updateGoalSettingTimeTemplate1)().title;
                infoEmail = period.checkNew
                    ? (0, mailTemplates_1.startGoalSettingPeriodTemplate1)().body
                    : (0, mailTemplates_1.updateGoalSettingTimeTemplate1)().body;
            }
            if (type === 3) {
                titleEmail = period.checkNew
                    ? (0, mailTemplates_1.startGoalSettingPeriodTemplate)().title
                    : (0, mailTemplates_1.updateGoalSettingTimeTemplate)().title;
                infoEmail = period.checkNew
                    ? (0, mailTemplates_1.startGoalSettingPeriodTemplate)().body
                    : (0, mailTemplates_1.updateGoalSettingTimeTemplate)().body;
            }
            let periodString = '';
            if (period.periodIndex === 1)
                periodString = '上期';
            if (period.periodIndex === 2)
                periodString = '下期';
            const dateCreationGoalEndMonth = period.dateCreationGoalEnd
                ? moment(period.dateCreationGoalEnd).month() + 1
                : '';
            const dateCreationGoalEndDay = period.dateCreationGoalEnd
                ? moment(period.dateCreationGoalEnd).date()
                : '';
            const dateCreationGoalEndDOW = Object.values(TemplateMailId_1.day)[period.dateCreationGoalEnd
                ? moment(period.dateCreationGoalEnd).day()
                : 0];
            const dayCreationGoalEnd = `${dateCreationGoalEndMonth}月${dateCreationGoalEndDay}日 (${dateCreationGoalEndDOW})`;
            toEmails.push(...listToMail);
            titleEmail = titleEmail.replace(/{{evaluationYear}}/gi, period.year);
            titleEmail = titleEmail.replace(/{{evaluationPeriod}}/gi, periodString);
            titleEmail = titleEmail.replace(/{{periodStartMonth}}/gi, period.periodStart);
            titleEmail = titleEmail.replace(/{{periodEndMonth}}/gi, period.periodEnd);
            titleEmail = titleEmail.replace(/{{goalCreateStartDate}}/gi, period.dateCreationGoalStart);
            titleEmail = titleEmail.replace(/{{dayCreationGoalEnd}}/gi, dayCreationGoalEnd);
            titleEmail = titleEmail.replace(/{{goalCreateEndDate}}/gi, period.dateCreationGoalEnd);
            titleEmail = titleEmail.replace(/{{dateCreationGoalDepartmentStart}}/gi, period.dateCreationGoalDepartmentStart);
            titleEmail = titleEmail.replace(/{{dateCreationGoalDepartmentEnd}}/gi, period.dateCreationGoalDepartmentEnd);
            titleEmail = titleEmail.replace(/{{detailUrl}}/gi, `${process.env.HOSTNAME_}/user/list-evaluation`);
            infoEmail = infoEmail.replace(/{{evaluationYear}}/gi, period.year);
            infoEmail = infoEmail.replace(/{{evaluationPeriod}}/gi, periodString);
            infoEmail = infoEmail.replace(/{{periodStartMonth}}/gi, period.periodStart);
            infoEmail = infoEmail.replace(/{{periodEndMonth}}/gi, period.periodEnd);
            infoEmail = infoEmail.replace(/{{dayCreationGoalEnd}}/gi, dayCreationGoalEnd);
            infoEmail = infoEmail.replace(/{{goalCreateStartDate}}/gi, period.dateCreationGoalStart);
            infoEmail = infoEmail.replace(/{{goalCreateEndDate}}/gi, period.dateCreationGoalEnd);
            infoEmail = infoEmail.replace(/{{dateCreationGoalDepartmentStart}}/gi, period.dateCreationGoalDepartmentStart);
            infoEmail = infoEmail.replace(/{{dateCreationGoalDepartmentEnd}}/gi, period.dateCreationGoalDepartmentEnd);
            infoEmail = infoEmail.replace(/{{detailUrl}}/gi, `${process.env.HOSTNAME_}/user/list-evaluation`);
        }
        return await (0, util_1.sendEmailsWith)(toEmails, ccEmail, titleEmail, infoEmail);
    }
    async sendMailStartEvaluation(period, type, listToMail, ccEmail) {
        let titleEmail = ``;
        let infoEmail = ``;
        if (type === 2) {
            titleEmail = period.checkNew
                ? (0, mailTemplates_1.startEvaluationPeriodTemplate2)().title
                : (0, mailTemplates_1.updateEvaluationTimeTemplate2)().title;
            infoEmail = period.checkNew
                ? (0, mailTemplates_1.startEvaluationPeriodTemplate2)().body
                : (0, mailTemplates_1.updateEvaluationTimeTemplate2)().body;
        }
        if (type === 1) {
            titleEmail = period.checkNew
                ? (0, mailTemplates_1.startEvaluationPeriodTemplate1)().title
                : (0, mailTemplates_1.updateEvaluationTimeTemplate1)().title;
            infoEmail = period.checkNew
                ? (0, mailTemplates_1.startEvaluationPeriodTemplate1)().body
                : (0, mailTemplates_1.updateEvaluationTimeTemplate1)().body;
        }
        if (type === 3) {
            titleEmail = period.checkNew
                ? (0, mailTemplates_1.startEvaluationPeriodTemplate)().title
                : (0, mailTemplates_1.updateEvaluationTimeTemplate)().title;
            infoEmail = period.checkNew
                ? (0, mailTemplates_1.startEvaluationPeriodTemplate)().body
                : (0, mailTemplates_1.updateEvaluationTimeTemplate)().body;
        }
        let periodString = '';
        if (period.periodIndex === 1)
            periodString = '上期';
        if (period.periodIndex === 2)
            periodString = '下期';
        titleEmail = titleEmail.replace(/{{evaluationYear}}/gi, period.year);
        titleEmail = titleEmail.replace(/{{evaluationPeriod}}/gi, periodString);
        titleEmail = titleEmail.replace(/{{periodStartMonth}}/gi, period.periodStart);
        titleEmail = titleEmail.replace(/{{periodEndMonth}}/gi, period.periodEnd);
        titleEmail = titleEmail.replace(/{{evaluationStartDate}}/gi, period.dateEvaluationStart);
        titleEmail = titleEmail.replace(/{{evaluationEndDate}}/gi, period.dateEvaluationEnd);
        titleEmail = titleEmail.replace(/{{dateEvaluationDepartmentStart}}/gi, period.dateEvaluationDepartmentStart);
        titleEmail = titleEmail.replace(/{{dateEvaluationDepartmentEnd}}/gi, period.dateEvaluationDepartmentEnd);
        titleEmail = titleEmail.replace(/{{detailUrl}}/gi, `${process.env.HOSTNAME_}/user/list-evaluation`);
        infoEmail = infoEmail.replace(/{{evaluationYear}}/gi, period.year);
        infoEmail = infoEmail.replace(/{{evaluationPeriod}}/gi, periodString);
        infoEmail = infoEmail.replace(/{{periodStartMonth}}/gi, period.periodStart);
        infoEmail = infoEmail.replace(/{{periodEndMonth}}/gi, period.periodEnd);
        infoEmail = infoEmail.replace(/{{evaluationStartDate}}/gi, period.dateEvaluationStart);
        infoEmail = infoEmail.replace(/{{evaluationEndDate}}/gi, period.dateEvaluationEnd);
        infoEmail = infoEmail.replace(/{{dateEvaluationDepartmentStart}}/gi, period.dateEvaluationDepartmentStart);
        infoEmail = infoEmail.replace(/{{dateEvaluationDepartmentEnd}}/gi, period.dateEvaluationDepartmentEnd);
        infoEmail = infoEmail.replace(/{{detailUrl}}/gi, `${process.env.HOSTNAME_}/user/list-evaluation`);
        return await (0, util_1.sendEmailsWith)(listToMail, ccEmail, titleEmail, infoEmail);
    }
    async sendMailRejectGoalSetting(evaluatorId, rejecteeId, ownerId, evaluationId, status, rejectCcList, hostName, type, companyGroupCode) {
        var _a, _b;
        const userInfo = await this.userRepo.getUserDetailById(ownerId);
        const evaluatorInfo = await this.userRepo.getUserDetailById(evaluatorId);
        const rejecteeInfo = await this.userRepo.getUserDetailById(rejecteeId);
        const evaluationInfo = await this.evaluationRepo.getUpdateTime(evaluationId);
        const toEmails = [];
        const ccEmails = [];
        let titleEmail = ``;
        let infoEmail = ``;
        let { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.EVALUATOR_REJECTING, companyGroupCode);
        titleEmail = title;
        infoEmail = content;
        if (userInfo && evaluatorInfo) {
            const encryptedId = (0, util_2.encrypt)(evaluationId.toString());
            let url = ``;
            if (![2, 52].includes(status)) {
                url = `${hostName}/evaluator/${type}/${encryptedId}`;
            }
            else {
                url = `${hostName}/user/${type}/${encryptedId}`;
            }
            toEmails.push(rejecteeInfo.email);
            let periodString = '';
            if (evaluationInfo.evaluationPeriod.periodIndex === 1)
                periodString = '上期';
            if (evaluationInfo.evaluationPeriod.periodIndex === 2)
                periodString = '下期';
            const period = status < 50 ? '目標' : '評価';
            let departmentName = ``;
            if ([1, 2, 3, 4, 5, 6, 7].includes(evaluatorInfo.level))
                departmentName = evaluatorInfo === null || evaluatorInfo === void 0 ? void 0 : evaluatorInfo.department.name;
            if ([8, 9, 10].includes(evaluatorInfo.level))
                departmentName = evaluatorInfo === null || evaluatorInfo === void 0 ? void 0 : evaluatorInfo.division.name;
            titleEmail = titleEmail.replace(/{{departmentName}}/gi, departmentName !== null && departmentName !== void 0 ? departmentName : '');
            titleEmail = titleEmail.replace(/{{evaluateeName}}/gi, (_a = userInfo.fullName) !== null && _a !== void 0 ? _a : '');
            titleEmail = titleEmail.replace(/{{rejecter}}/gi, evaluatorInfo.fullName);
            titleEmail = titleEmail.replace(/{{rejectee}}/gi, rejecteeInfo.fullName);
            titleEmail = titleEmail.replace(/{{evaluationYear}}/gi, evaluationInfo.evaluationPeriod.year);
            titleEmail = titleEmail.replace(/{{evaluationPeriod}}/gi, periodString);
            titleEmail = titleEmail.replace(/{{periodStartMonth}}/gi, evaluationInfo.evaluationPeriod.periodStart);
            titleEmail = titleEmail.replace(/{{periodEndMonth}}/gi, evaluationInfo.evaluationPeriod.periodEnd);
            titleEmail = titleEmail.replace(/{{evaluationType}}/gi, period);
            titleEmail = titleEmail.replace(/{{detailUrl}}/gi, url);
            infoEmail = infoEmail.replace(/{{departmentName}}/gi, departmentName !== null && departmentName !== void 0 ? departmentName : '');
            infoEmail = infoEmail.replace(/{{evaluateeName}}/gi, (_b = userInfo.fullName) !== null && _b !== void 0 ? _b : '');
            infoEmail = infoEmail.replace(/{{rejecter}}/gi, evaluatorInfo.fullName);
            infoEmail = infoEmail.replace(/{{rejectee}}/gi, rejecteeInfo.fullName);
            infoEmail = infoEmail.replace(/{{evaluationYear}}/gi, evaluationInfo.evaluationPeriod.year);
            infoEmail = infoEmail.replace(/{{evaluationPeriod}}/gi, periodString);
            infoEmail = infoEmail.replace(/{{periodStartMonth}}/gi, evaluationInfo.evaluationPeriod.periodStart);
            infoEmail = infoEmail.replace(/{{periodEndMonth}}/gi, evaluationInfo.evaluationPeriod.periodEnd);
            infoEmail = infoEmail.replace(/{{evaluationType}}/gi, period);
            infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);
            return await (0, util_1.sendEmailsWith)(toEmails, ccEmails, titleEmail, infoEmail);
        }
    }
    async sendMailApproveGoalSetting(approverId, ownerId, evaluationId, host, companyGroupCode) {
        const userInfo = await this.userRepo.getUserDetailById(ownerId);
        const approverInfo = await this.userRepo.getUserDetailById(approverId);
        const evaluationInfo = await this.evaluationRepo.getUpdateTime(evaluationId);
        const toEmails = [];
        const ccEmails = [];
        let titleEmail = ``;
        let infoEmail = ``;
        const { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.EVAL_APPROVE_GOAL_SETTING, companyGroupCode);
        titleEmail = title;
        infoEmail = content;
        if (userInfo) {
            const encryptedId = (0, util_2.encrypt)(evaluationId.toString());
            const url = `${host}/${encryptedId}`;
            toEmails.push(approverInfo.email);
            let departmentName = ``;
            if ([1, 2, 3, 4, 5, 6, 7].includes(userInfo.level))
                departmentName = userInfo === null || userInfo === void 0 ? void 0 : userInfo.department.name;
            if ([8, 9, 10].includes(userInfo.level))
                departmentName = userInfo === null || userInfo === void 0 ? void 0 : userInfo.division.name;
            let periodString = '';
            if (evaluationInfo.evaluationPeriod.periodIndex === 1)
                periodString = '上期';
            if (evaluationInfo.evaluationPeriod.periodIndex === 2)
                periodString = '下期';
            titleEmail = titleEmail.replace(/{{evaluatorName}}/gi, approverInfo.fullName);
            titleEmail = titleEmail.replace(/{{departmentName}}/gi, departmentName !== null && departmentName !== void 0 ? departmentName : '');
            titleEmail = titleEmail.replace(/{{evaluateeName}}/gi, userInfo.fullName);
            titleEmail = titleEmail.replace(/{{evaluationYear}}/gi, evaluationInfo.evaluationPeriod.year);
            titleEmail = titleEmail.replace(/{{evaluationPeriod}}/gi, periodString);
            titleEmail = titleEmail.replace(/{{periodStartMonth}}/gi, evaluationInfo.evaluationPeriod.periodStart);
            titleEmail = titleEmail.replace(/{{periodEndMonth}}/gi, evaluationInfo.evaluationPeriod.periodEnd);
            titleEmail = titleEmail.replace(/{{detailUrl}}/gi, url);
            infoEmail = infoEmail.replace(/{{evaluatorName}}/gi, approverInfo.fullName);
            infoEmail = infoEmail.replace(/{{departmentName}}/gi, departmentName !== null && departmentName !== void 0 ? departmentName : '');
            infoEmail = infoEmail.replace(/{{evaluateeName}}/gi, userInfo.fullName);
            infoEmail = infoEmail.replace(/{{evaluationYear}}/gi, evaluationInfo.evaluationPeriod.year);
            infoEmail = infoEmail.replace(/{{evaluationPeriod}}/gi, periodString);
            infoEmail = infoEmail.replace(/{{periodStartMonth}}/gi, evaluationInfo.evaluationPeriod.periodStart);
            infoEmail = infoEmail.replace(/{{periodEndMonth}}/gi, evaluationInfo.evaluationPeriod.periodEnd);
            infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);
            return await (0, util_1.sendEmailsWith)(toEmails, ccEmails, titleEmail, infoEmail);
        }
    }
    async sendMailEvaluatorApproved(evaluators, ownerId, evaluationId, host, companyGroupCode) {
        const userInfo = await this.userRepo.getUserDetailById(ownerId);
        const evaluationInfo = await this.evaluationRepo.getUpdateTime(evaluationId);
        const toEmails = [];
        const ccEmails = [];
        let titleEmail = ``;
        let infoEmail = ``;
        for (const evaluator of evaluators) {
            const infoEvaluator = await this.userRepo.getUserDetailById(evaluator.evaluatorId);
            ccEmails.push(infoEvaluator.email);
        }
        const { title, content } = await this.getTitleContentFromTemplateMailId(19, companyGroupCode);
        titleEmail = title;
        infoEmail = content;
        if (userInfo) {
            const encryptedId = (0, util_2.encrypt)(evaluationId.toString());
            const url = `${host}/${encryptedId}`;
            toEmails.push(userInfo.email);
            let departmentName = ``;
            if ([1, 2, 3, 4, 5, 6, 7].includes(userInfo.level))
                departmentName = userInfo === null || userInfo === void 0 ? void 0 : userInfo.department.name;
            if ([8, 9, 10].includes(userInfo.level))
                departmentName = userInfo === null || userInfo === void 0 ? void 0 : userInfo.division.name;
            let periodString = '';
            if (evaluationInfo.evaluationPeriod.periodIndex === 1)
                periodString = '上期';
            if (evaluationInfo.evaluationPeriod.periodIndex === 2)
                periodString = '下期';
            titleEmail = titleEmail.replace(/{{departmentName}}/gi, departmentName !== null && departmentName !== void 0 ? departmentName : '');
            titleEmail = titleEmail.replace(/{{evaluateeName}}/gi, userInfo.fullName);
            titleEmail = titleEmail.replace(/{{evaluationYear}}/gi, evaluationInfo.evaluationPeriod.year);
            titleEmail = titleEmail.replace(/{{evaluationPeriod}}/gi, periodString);
            titleEmail = titleEmail.replace(/{{periodStartMonth}}/gi, evaluationInfo.evaluationPeriod.periodStart);
            titleEmail = titleEmail.replace(/{{periodEndMonth}}/gi, evaluationInfo.evaluationPeriod.periodEnd);
            titleEmail = titleEmail.replace(/{{detailUrl}}/gi, url);
            infoEmail = infoEmail.replace(/{{departmentName}}/gi, departmentName !== null && departmentName !== void 0 ? departmentName : '');
            infoEmail = infoEmail.replace(/{{evaluateeName}}/gi, userInfo.fullName);
            infoEmail = infoEmail.replace(/{{evaluationYear}}/gi, evaluationInfo.evaluationPeriod.year);
            infoEmail = infoEmail.replace(/{{evaluationPeriod}}/gi, periodString);
            infoEmail = infoEmail.replace(/{{periodStartMonth}}/gi, evaluationInfo.evaluationPeriod.periodStart);
            infoEmail = infoEmail.replace(/{{periodEndMonth}}/gi, evaluationInfo.evaluationPeriod.periodEnd);
            infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);
            return await (0, util_1.sendEmailsWith)(toEmails, ccEmails, titleEmail, infoEmail);
        }
    }
    async submitGoalAndEvaluation(submitTo, ownerId, evaluationInfo, host) {
        const userInfo = await this.userRepo.getUserDetailById(ownerId);
        const submitToInfo = await this.userRepo.getUserDetailById(submitTo);
        const toEmails = [];
        const ccEmails = [];
        let titleEmail = ``;
        let infoEmail = ``;
        if (evaluationInfo.status < 50) {
            const { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.EVAL_APPROVE_GOAL_SETTING, evaluationInfo.evaluationPeriod.companyGroupCode);
            titleEmail = title;
            infoEmail = content;
        }
        else {
            const { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.SUBMIT_GOAL_AND_EVALUATION, evaluationInfo.evaluationPeriod.companyGroupCode);
            titleEmail = title;
            infoEmail = content;
        }
        if (userInfo) {
            const encryptedId = (0, util_2.encrypt)(evaluationInfo.id.toString());
            const url = `${host}/${encryptedId}`;
            toEmails.push(submitToInfo.email);
            let departmentName = ``;
            if ([1, 2, 3, 4, 5, 6, 7].includes(userInfo.level))
                departmentName = userInfo === null || userInfo === void 0 ? void 0 : userInfo.department.name;
            if ([8, 9, 10].includes(userInfo.level))
                departmentName = userInfo === null || userInfo === void 0 ? void 0 : userInfo.division.name;
            let periodString = '';
            if (evaluationInfo.evaluationPeriod.periodIndex === 1)
                periodString = '上期';
            if (evaluationInfo.evaluationPeriod.periodIndex === 2)
                periodString = '下期';
            titleEmail = titleEmail.replace(/{{evaluatorName}}/gi, submitToInfo.fullName);
            titleEmail = titleEmail.replace(/{{departmentName}}/gi, departmentName !== null && departmentName !== void 0 ? departmentName : '');
            titleEmail = titleEmail.replace(/{{evaluateeName}}/gi, userInfo.fullName);
            titleEmail = titleEmail.replace(/{{evaluationYear}}/gi, evaluationInfo.evaluationPeriod.year);
            titleEmail = titleEmail.replace(/{{evaluationPeriod}}/gi, periodString);
            titleEmail = titleEmail.replace(/{{periodStartMonth}}/gi, evaluationInfo.evaluationPeriod.periodStart);
            titleEmail = titleEmail.replace(/{{periodEndMonth}}/gi, evaluationInfo.evaluationPeriod.periodEnd);
            titleEmail = titleEmail.replace(/{{detailUrl}}/gi, url);
            infoEmail = infoEmail.replace(/{{evaluatorName}}/gi, submitToInfo.fullName);
            infoEmail = infoEmail.replace(/{{departmentName}}/gi, departmentName !== null && departmentName !== void 0 ? departmentName : '');
            infoEmail = infoEmail.replace(/{{evaluateeName}}/gi, userInfo.fullName);
            infoEmail = infoEmail.replace(/{{evaluationYear}}/gi, evaluationInfo.evaluationPeriod.year);
            infoEmail = infoEmail.replace(/{{evaluationPeriod}}/gi, periodString);
            infoEmail = infoEmail.replace(/{{periodStartMonth}}/gi, evaluationInfo.evaluationPeriod.periodStart);
            infoEmail = infoEmail.replace(/{{periodEndMonth}}/gi, evaluationInfo.evaluationPeriod.periodEnd);
            infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);
            return await (0, util_1.sendEmailsWith)(toEmails, ccEmails, titleEmail, infoEmail);
        }
    }
    async sendMailPublicAllEvaluationForUser(list, host, companyGroupCode) {
        const condition = { active: 1, companyGroupCode: companyGroupCode };
        const evaluationPeriodList = await this.userRepo.getUserListForMail(condition, [1]);
        let toEmails = [];
        const ccEmails = [];
        let titleEmail = ``;
        let infoEmail = ``;
        const tempIdList = [];
        evaluationPeriodList.map((user) => {
            tempIdList.push(user.id);
        });
        if (evaluationPeriodList) {
            for (const evaluationInfo of list) {
                toEmails = [];
                let url = ``;
                titleEmail = ``;
                infoEmail = ``;
                if (tempIdList.includes(evaluationInfo.userId)) {
                    evaluationPeriodList.map((user) => {
                        if (user.id === evaluationInfo.userId)
                            toEmails.push(user.email);
                    });
                    const encryptedId = (0, util_2.encrypt)(evaluationInfo.id.toString());
                    if ((0, util_2.checkDupliateMail)(list, evaluationInfo.userId)) {
                        if (evaluationInfo.level < 8) {
                            url = `${host}/user/evaluation/${encryptedId} <br>
              ${host}/evaluator/list-user-evaluation`;
                        }
                        else {
                            url = `${host}/user/evaluation-8-10/${encryptedId} <br>
              ${host}/evaluator/list-user-evaluation`;
                        }
                    }
                    else {
                        if (evaluationInfo.level < 8) {
                            url = `${host}/user/evaluation/${encryptedId}`;
                        }
                        else {
                            url = `${host}/user/evaluation-8-10/${encryptedId}`;
                        }
                    }
                }
                const { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.ADMIN_PUBLIC_EVALUATION, companyGroupCode);
                titleEmail = title;
                infoEmail = content;
                let periodString = '';
                if (evaluationInfo.evaluationPeriod.periodIndex === 1)
                    periodString = '上期';
                if (evaluationInfo.evaluationPeriod.periodIndex === 2)
                    periodString = '下期';
                titleEmail = titleEmail.replace(/{{evaluationYear}}/gi, evaluationInfo.evaluationPeriod.year);
                titleEmail = titleEmail.replace(/{{evaluationPeriod}}/gi, periodString);
                titleEmail = titleEmail.replace(/{{detailUrl}}/gi, url);
                infoEmail = infoEmail.replace(/{{evaluationYear}}/gi, evaluationInfo.evaluationPeriod.year);
                infoEmail = infoEmail.replace(/{{evaluationPeriod}}/gi, periodString);
                infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);
                await (0, util_1.sendEmailsWith)(toEmails, ccEmails, titleEmail, infoEmail);
            }
        }
        return;
    }
    async sendMailPublicAllEvaluationForEvaluator(list, host, companyGroupCode) {
        const evaluatorMailList = [];
        const tempList = list.map((evaluation) => evaluation.userId);
        list.map((user) => {
            if (user.evaluator) {
                user.evaluator.map((evaluator) => {
                    if (!tempList.includes(evaluator.evaluatorId)) {
                        evaluatorMailList.push(evaluator.user.email);
                    }
                });
            }
        });
        let toEmails = [];
        const ccEmails = [];
        let titleEmail = ``;
        let infoEmail = ``;
        toEmails = evaluatorMailList.filter((item, pos) => {
            return evaluatorMailList.indexOf(item) == pos;
        });
        if (evaluatorMailList) {
            const url = `${host}/evaluator/list-user-evaluation`;
            const { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.ADMIN_PUBLIC_EVALUATION, companyGroupCode);
            titleEmail = title;
            infoEmail = content;
            let periodString = '';
            if (list[0].evaluationPeriod.periodIndex === 1)
                periodString = '上期';
            if (list[0].evaluationPeriod.periodIndex === 2)
                periodString = '下期';
            titleEmail = titleEmail.replace(/{{evaluationYear}}/gi, list[0].evaluationPeriod.year);
            titleEmail = titleEmail.replace(/{{evaluationPeriod}}/gi, periodString);
            titleEmail = titleEmail.replace(/{{detailUrl}}/gi, url);
            infoEmail = infoEmail.replace(/{{evaluationYear}}/gi, list[0].evaluationPeriod.year);
            infoEmail = infoEmail.replace(/{{evaluationPeriod}}/gi, periodString);
            infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);
            await (0, util_1.sendEmailsWith)(toEmails, ccEmails, titleEmail, infoEmail);
        }
        return;
    }
    async submitProSkill(data, host, companyGroupCode) {
        var _a, _b;
        const userList = await this.proSkillSettingRepo.findDepartmentRoleByDepartmentId(data.skillId, 2);
        const toEmails = [];
        const ccEmails = [];
        let titleEmail = ``;
        let infoEmail = ``;
        for (const skill of userList) {
            toEmails.push(skill.user.email);
        }
        const { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.REQUEST_PRO_SKILL_APPROVE, companyGroupCode);
        titleEmail = title;
        infoEmail = content;
        if (data) {
            const encryptedId = (0, util_2.encrypt)(data.versionId.toString());
            const encryptedSkillId = (0, util_2.encrypt)(data.skillId.toString());
            const url = `${host}/company/${companyGroupCode}/pro-skill-approval/detail-pro-skill-approve/${encryptedSkillId}/${encryptedId}`;
            const version = data.versionMain + '.' + data.versionSub;
            titleEmail = titleEmail.replace(/{{proskillCreatorName}}/gi, data.createdUser.fullName);
            titleEmail = titleEmail.replace(/{{proskillName}}/gi, (_a = data.skillName) !== null && _a !== void 0 ? _a : '');
            titleEmail = titleEmail.replace(/{{versionProskill}}/gi, version);
            titleEmail = titleEmail.replace(/{{detailUrl}}/gi, url);
            infoEmail = infoEmail.replace(/{{proskillCreatorName}}/gi, data.createdUser.fullName);
            infoEmail = infoEmail.replace(/{{proskillName}}/gi, (_b = data.skillName) !== null && _b !== void 0 ? _b : '');
            infoEmail = infoEmail.replace(/{{versionProskill}}/gi, version);
            infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);
            return await (0, util_1.sendEmailsWith)(toEmails, ccEmails, titleEmail, infoEmail);
        }
    }
    async sendMailApproveProSkillToAdmin(data, hostName, companyGroupCode) {
        var _a, _b;
        const condition = { active: 1, companyGroupCode: companyGroupCode };
        const userList = await this.userRepo.getUserListForMail(condition, [6]);
        const toEmails = [];
        const ccEmails = [];
        let titleEmail = ``;
        let infoEmail = ``;
        for (const user of userList) {
            toEmails.push(user.email);
        }
        const { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.APPROVE_PRO_SKILL_VERSION_TO_ADMIN, companyGroupCode);
        titleEmail = title;
        infoEmail = content;
        if (data) {
            const encryptedId = (0, util_2.encrypt)(data.id.toString());
            const url = `${hostName}/company/${companyGroupCode}/admin-evaluation/detail-pro-skill/${encryptedId}`;
            const version = data.version + '.' + data.subVersion;
            titleEmail = titleEmail.replace(/{{proskillName}}/gi, (_a = data.skill.name) !== null && _a !== void 0 ? _a : '');
            titleEmail = titleEmail.replace(/{{versionProskill}}/gi, version);
            titleEmail = titleEmail.replace(/{{detailUrl}}/gi, url);
            infoEmail = infoEmail.replace(/{{proskillName}}/gi, (_b = data.skill.name) !== null && _b !== void 0 ? _b : '');
            infoEmail = infoEmail.replace(/{{versionProskill}}/gi, version);
            infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);
            return await (0, util_1.sendEmailsWith)(toEmails, ccEmails, titleEmail, infoEmail);
        }
    }
    async sendMailApproveProSkillToOther(data, approverId, hostName, companyGroupCode) {
        var _a, _b;
        const userList = await this.proSkillSettingRepo.findSkillRoleBySkillId(data.skillId, 2);
        const toEmails = [];
        const ccEmails = [];
        let titleEmail = ``;
        let infoEmail = ``;
        for (const user of userList) {
            if (user.user.id !== approverId)
                toEmails.push(user.user.email);
        }
        const { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.APPROVE_PRO_SKILL_VERSION_TO_OTHER, companyGroupCode);
        titleEmail = title;
        infoEmail = content;
        if (data) {
            const encryptedId = (0, util_2.encrypt)(data.id.toString());
            const encryptedDepartmentId = (0, util_2.encrypt)(data.skillId.toString());
            const url = `${hostName}/company/${companyGroupCode}/pro-skill-approval/detail-pro-skill-approve/${encryptedDepartmentId}/${encryptedId}`;
            const version = data.version + '.' + data.subVersion;
            titleEmail = titleEmail.replace(/{{proskillName}}/gi, (_a = data.skill.name) !== null && _a !== void 0 ? _a : '');
            titleEmail = titleEmail.replace(/{{versionProskill}}/gi, version);
            titleEmail = titleEmail.replace(/{{detailUrl}}/gi, url);
            infoEmail = infoEmail.replace(/{{proskillName}}/gi, (_b = data.skill.name) !== null && _b !== void 0 ? _b : '');
            infoEmail = infoEmail.replace(/{{versionProskill}}/gi, version);
            infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);
            return await (0, util_1.sendEmailsWith)(toEmails, ccEmails, titleEmail, infoEmail);
        }
    }
    async sendMailRejectProSkill(data, approverId, hostName, companyGroupCode) {
        var _a, _b;
        const proskillSetterList = await this.proSkillSettingRepo.findSkillRoleBySkillId(data.skillId, 1);
        const proskillApproverList = await this.proSkillSettingRepo.findSkillRoleBySkillId(data.skillId, 2);
        const toEmails = [];
        const ccEmails = [];
        let titleEmail = ``;
        let infoEmail = ``;
        for (const user of proskillSetterList) {
            if (user.user.id !== approverId)
                toEmails.push(user.user.email);
        }
        for (const user of proskillApproverList) {
            if (user.user.id !== approverId)
                ccEmails.push(user.user.email);
        }
        const { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.REJECT_PRO_SKILL_VERSION, companyGroupCode);
        titleEmail = title;
        infoEmail = content;
        if (data) {
            const encryptedId = (0, util_2.encrypt)(data.id.toString());
            const url = `${hostName}/company/${companyGroupCode}/pro-setting/detail-pro-skill/${encryptedId}`;
            const version = data.version + '.' + data.subVersion;
            titleEmail = titleEmail.replace(/{{proskillName}}/gi, (_a = data.skill.name) !== null && _a !== void 0 ? _a : '');
            titleEmail = titleEmail.replace(/{{versionProskill}}/gi, version);
            titleEmail = titleEmail.replace(/{{detailUrl}}/gi, url);
            infoEmail = infoEmail.replace(/{{proskillName}}/gi, (_b = data.skill.name) !== null && _b !== void 0 ? _b : '');
            infoEmail = infoEmail.replace(/{{versionProskill}}/gi, version);
            infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);
            return await (0, util_1.sendEmailsWith)(toEmails, ccEmails, titleEmail, infoEmail);
        }
    }
    async sendMailPublicBasicAndBehavior(version, subVersion, hostName, type, level) {
        let condition = {};
        if (type === 2) {
            condition = {
                active: 1,
                level: level,
                flagSkill: 1,
            };
        }
        else if (type === 3) {
            condition = {
                active: 1,
                level: level,
                flagSkill: 0,
            };
        }
        else {
            condition = { active: 1, level: [1, 2, 3, 4, 5, 6, 7] };
        }
        const userList = await this.userRepo.getUserListForMail(condition, [1]);
        const toEmails = [];
        const ccEmails = [];
        let titleEmail = ``;
        let infoEmail = ``;
        for (const user of userList) {
            toEmails.push(user.email);
        }
        if (type === 1) {
            titleEmail = (0, mailTemplates_1.publicBasicSkillTemplate)().title;
            infoEmail = (0, mailTemplates_1.publicBasicSkillTemplate)().body;
        }
        else {
            titleEmail = (0, mailTemplates_1.publicBehaviorTemplate)().title;
            infoEmail = (0, mailTemplates_1.publicBehaviorTemplate)().body;
        }
        if (version && subVersion !== undefined) {
            let url = ``;
            if (type === 1)
                url = `${hostName}/user/evaluation-reference-basic`;
            if (type === 2 || type === 3)
                url = `${hostName}/user/evaluation-reference-behavior`;
            titleEmail = titleEmail.replace(/{{versionProskill}}/gi, version + '.' + subVersion);
            infoEmail = infoEmail.replace(/{{versionProskill}}/gi, version + '.' + subVersion);
            if (type === 2 || type === 3) {
                infoEmail = infoEmail.replace(/{{level}}/gi, level.toString());
                titleEmail = titleEmail.replace(/{{level}}/gi, level.toString());
            }
            infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);
            return await (0, util_1.sendEmailsWith)(toEmails, ccEmails, titleEmail, infoEmail);
        }
    }
    async sendMailRejectProSkillFromAdmin(versionId, rejecterId, hostName, companyGroupCode) {
        var _a, _b;
        const data = await this.proSkillRepo.getProSkillById(versionId);
        const proskillSetterList = await this.proSkillSettingRepo.findDepartmentRoleByDepartmentId(data.skillId, 1);
        const proskillApproverList = await this.proSkillSettingRepo.findDepartmentRoleByDepartmentId(data.skillId, 2);
        const toEmails = [];
        const ccEmails = [];
        let titleEmail = ``;
        let infoEmail = ``;
        for (const user of proskillSetterList) {
            if (user.user.id !== rejecterId)
                toEmails.push(user.user.email);
        }
        for (const user of proskillApproverList) {
            if (user.user.id !== rejecterId)
                ccEmails.push(user.user.email);
        }
        const { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.REJECT_PRO_SKILL_VERSION, companyGroupCode);
        titleEmail = title;
        infoEmail = content;
        if (data) {
            const encryptedId = (0, util_2.encrypt)(data.id.toString());
            const url = `${hostName}/company/${companyGroupCode}/pro-setting/detail-pro-skill/${encryptedId}`;
            const version = data.version + '.' + data.subVersion;
            titleEmail = titleEmail.replace(/{{proskillName}}/gi, (_a = data.skill.name) !== null && _a !== void 0 ? _a : '');
            titleEmail = titleEmail.replace(/{{versionProskill}}/gi, version);
            titleEmail = titleEmail.replace(/{{detailUrl}}/gi, url);
            infoEmail = infoEmail.replace(/{{proskillName}}/gi, (_b = data.skill.name) !== null && _b !== void 0 ? _b : '');
            infoEmail = infoEmail.replace(/{{versionProskill}}/gi, version);
            infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);
            return await (0, util_1.sendEmailsWith)(toEmails, ccEmails, titleEmail, infoEmail);
        }
    }
    async sendMailFixedGoal(data, mailList, companyGroupCode, evaluationPeriodId, type) {
        var _a, _b, _c;
        const mailToObjList = mailList;
        const ccEmails = [];
        const titleMail = data.mailContent.subject;
        const infoMail = data.mailContent.editor;
        let periods = undefined;
        if (type === 8) {
            periods = await this.evaluationPeriodRepo.getPeriodListSendMailDepartment({
                id: evaluationPeriodId,
                companyGroupCode: companyGroupCode,
            });
        }
        for (const email of mailToObjList) {
            let toUserText = ``;
            const username = await this.userRepo.getUserNameFromEmail(email, companyGroupCode);
            if (type === 8 && periods && username) {
                const conditionCountException = {
                    userId: username.id,
                    evaluationPeriodId: evaluationPeriodId,
                    creationUser: { [sequelize_1.Op.ne]: null },
                    dateEvaluationStart: { [sequelize_1.Op.ne]: null },
                    dateEvaluationEnd: { [sequelize_1.Op.ne]: null },
                    companyGroupCode: companyGroupCode,
                };
                const countException = await this.userRepo.countEvaluationException(conditionCountException);
                if (countException > 0) {
                    const condition17 = {
                        userId: username.id,
                        evaluationPeriodId: evaluationPeriodId,
                        creationUser: { [sequelize_1.Op.ne]: null },
                        dateEvaluationStart: periods.dateEvaluationStart,
                        dateEvaluationEnd: periods.dateEvaluationEnd,
                        level: { [sequelize_1.Op.lte]: 7 },
                        companyGroupCode: companyGroupCode,
                    };
                    const exception17 = await this.userRepo.countEvaluationException(condition17);
                    const condition810 = {
                        userId: username.id,
                        evaluationPeriodId: evaluationPeriodId,
                        creationUser: { [sequelize_1.Op.ne]: null },
                        dateEvaluationStart: periods.dateEvaluationDepartmentStart,
                        dateEvaluationEnd: periods.dateEvaluationDepartmentEnd,
                        level: { [sequelize_1.Op.gte]: 8 },
                        companyGroupCode: companyGroupCode,
                    };
                    const exception810 = await this.userRepo.countEvaluationException(condition810);
                    if (!exception17 && !exception810) {
                        continue;
                    }
                }
            }
            if (username) {
                toUserText += `${(_a = username === null || username === void 0 ? void 0 : username.fullName) === null || _a === void 0 ? void 0 : _a.split(' ')[0]}${((_c = (_b = username === null || username === void 0 ? void 0 : username.fullName) === null || _b === void 0 ? void 0 : _b.split(' ')) === null || _c === void 0 ? void 0 : _c.length) > 1 ? 'さん' : ''}<br><br>`;
            }
            await (0, util_1.sendEmailsWith)(email, ccEmails, titleMail, toUserText + infoMail);
        }
        return { message: 'success' };
    }
    async sendMailFixedUserEvaluator(data, object, companyGroupCode, transaction) {
        var _a, _b, _c, _d, _e, _f;
        const titleMail = data.mailContent.subject;
        for (const emailInfo of data.dataMailCCs) {
            const toUser = await this.userRepo.getUserByEmail(emailInfo === null || emailInfo === void 0 ? void 0 : emailInfo.user, companyGroupCode);
            let infoEmail = data.mailContent.editor;
            infoEmail = infoEmail.replace(/{{toUser}}/gi, ((_b = (_a = toUser === null || toUser === void 0 ? void 0 : toUser.fullName) === null || _a === void 0 ? void 0 : _a.toString()) === null || _b === void 0 ? void 0 : _b.split(' ')[0]) +
                `${((_e = (_d = (_c = toUser === null || toUser === void 0 ? void 0 : toUser.fullName) === null || _c === void 0 ? void 0 : _c.toString()) === null || _d === void 0 ? void 0 : _d.split(' ')) === null || _e === void 0 ? void 0 : _e.length) > 1 ? 'さん' : ''}`);
            const toEmails = [];
            toEmails.push(emailInfo.user);
            const ccEmails = [];
            if (((_f = emailInfo.evaluators) === null || _f === void 0 ? void 0 : _f.length) > 0) {
                const listNameCCs = [];
                for (const evaluator of emailInfo.evaluators) {
                    ccEmails.push(evaluator);
                    const nameCC = await this.userRepo.getUserByEmail(evaluator, companyGroupCode);
                    if (nameCC) {
                        listNameCCs.push(nameCC.fullName);
                    }
                }
                infoEmail = infoEmail.replace(/{{ccEvaluator}}/gi, listNameCCs
                    .map((e) => {
                    var _a, _b, _c;
                    return `${(_a = e === null || e === void 0 ? void 0 : e.toString()) === null || _a === void 0 ? void 0 : _a.split(' ')[0]}${((_c = (_b = e === null || e === void 0 ? void 0 : e.toString()) === null || _b === void 0 ? void 0 : _b.split(' ')) === null || _c === void 0 ? void 0 : _c.length) > 1 ? 'さん' : ''}`;
                })
                    .join('、'));
            }
            else {
                infoEmail = infoEmail.replace(/{{ccEvaluator}}/gi, '');
            }
            await (0, util_1.sendEmailsWith)(toEmails, ccEmails, titleMail, infoEmail);
            const dtUpdate = {
                toEmails: toEmails.join(','),
                mailContent: {
                    subject: titleMail,
                    editor: infoEmail,
                },
                emailType: object.emailType,
                status: object.status,
                evaluationPeriodId: object.evaluationPeriodId,
                evaluationTime: object.evaluationTime,
                evaluationDepartmentTime: object.evaluationDepartmentTime,
                sendTimeActual: object.sendTimeActual,
                ccMails: ccEmails === null || ccEmails === void 0 ? void 0 : ccEmails.join(','),
            };
            await this.evaluationRepo.updateHistoryMail(dtUpdate, companyGroupCode, transaction);
        }
        return { message: 'success' };
    }
    async sendMailFixedEvaluator(data, object, companyGroupCode, transaction, emailHR) {
        var _a, _b, _c, _d;
        const isFilterStatus = data.isFilterStatus;
        const statusList = data.type === 'fixedGoal'
            ? [3, 4, 5, 6, 7, 8]
            : [53, 54, 55, 56, 57, 58, 59, 60, 61];
        const listEvaluations = await this.evaluationRepo.getInfoEvaluationMail(data.id, statusList);
        const evaluatorConfigs = [
            { key: '05', status: [3, 4, 53, 54, 55] },
            { key: '1', status: [5, 6, 56, 57, 58] },
            { key: '2', status: [7, 8, 59, 60, 61] },
        ];
        if (((_a = listEvaluations === null || listEvaluations === void 0 ? void 0 : listEvaluations[0]) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            for (const evaluation of listEvaluations[0]) {
                let titleMail = data.mailContent.subject;
                const toEmails = [];
                const encryptedId = (0, util_2.encrypt)(evaluation.id.toString());
                const typeDetail = evaluation.level > 7 ? 'evaluation-8-10' : 'evaluation';
                const url = `${process.env.HOSTNAME_}/company/${companyGroupCode}/evaluator/${typeDetail}/${encryptedId}`;
                const userName = (_c = (_b = evaluation.user_full_name) === null || _b === void 0 ? void 0 : _b.split(' ')[0]) !== null && _c !== void 0 ? _c : '';
                const userSuffix = ((_d = evaluation.user_full_name) === null || _d === void 0 ? void 0 : _d.split(' ').length) > 1 ? 'さん' : '';
                let infoEmail = data.mailContent.editor.replace(/{{toUser}}/gi, `${userName}${userSuffix}`);
                infoEmail = infoEmail.replace(/{{detailUrl}}/gi, url);
                infoEmail = infoEmail.replace(/{{userName}}/gi, evaluation.user_full_name);
                infoEmail = infoEmail.replace(/{{divisionName}}/gi, evaluation.division_name);
                infoEmail = infoEmail.replace(/{{level}}/gi, evaluation.level);
                titleMail = titleMail.replace(/{{toUser}}/gi, `${userName}${userSuffix}`);
                titleMail = titleMail.replace(/{{detailUrl}}/gi, url);
                titleMail = titleMail.replace(/{{userName}}/gi, evaluation.user_full_name);
                titleMail = titleMail.replace(/{{divisionName}}/gi, evaluation.division_name);
                titleMail = titleMail.replace(/{{level}}/gi, evaluation.level);
                if (emailHR) {
                    toEmails.push(emailHR);
                    await (0, util_1.sendEmailsWith)(toEmails, [], titleMail, infoEmail);
                }
                for (const config of evaluatorConfigs) {
                    const emailKey = `evaluator_email_${config.key}`;
                    const nameKey = `evaluator_full_name_${config.key}`;
                    const emails = evaluation[emailKey];
                    const names = evaluation[nameKey];
                    const shouldSend = isFilterStatus
                        ? config.status.includes(evaluation.status)
                        : !!emails;
                    if (emails && shouldSend) {
                        let toUserText = '';
                        if (names === null || names === void 0 ? void 0 : names[0]) {
                            const nameParts = names[0].split(' ');
                            toUserText = `${nameParts[0]}${nameParts.length > 1 ? 'さん' : ''}<br><br>`;
                        }
                        toEmails.push(emails[0]);
                        await (0, util_1.sendEmailsWith)(emails, [], titleMail, toUserText + infoEmail);
                    }
                }
                const dtUpdate = {
                    toEmails: toEmails.join(','),
                    mailContent: { subject: titleMail, editor: infoEmail },
                    emailType: object.emailType,
                    status: object.status,
                    evaluationPeriodId: object.evaluationPeriodId,
                    evaluationTime: object.evaluationTime,
                    evaluationDepartmentTime: object.evaluationDepartmentTime,
                    sendTimeActual: object.sendTimeActual,
                };
                await this.evaluationRepo.updateHistoryMail(dtUpdate, companyGroupCode, transaction);
            }
        }
        return { message: 'success' };
    }
    getFullNameEmailByStatus(evaluation) {
        const status = evaluation.status;
        let email = '';
        let fullName = '';
        let isSendEvaluator = false;
        if ([0, 1, 50, 51, 52].includes(status)) {
            email = evaluation.user_email;
            fullName = evaluation.user_full_name;
        }
        else if ([3, 4, 53, 54, 55].includes(status)) {
            email = evaluation.evaluator_05_email;
            fullName = evaluation.evaluator_05_full_name;
            isSendEvaluator = true;
        }
        else if ([5, 6, 56, 57, 58].includes(status)) {
            email = evaluation.evaluator_1_email;
            fullName = evaluation.evaluator_1_full_name;
            isSendEvaluator = true;
        }
        else if ([7, 8, 59, 60, 61].includes(status)) {
            email = evaluation.evaluator_2_email;
            fullName = evaluation.evaluator_2_full_name;
            isSendEvaluator = true;
        }
        return { email, fullName, isSendEvaluator };
    }
    async sendMailNotFixed(data, transaction, emailHR) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        for (const evaluation of data.listEvaluation) {
            let content = data.content;
            let titleMail = data.title;
            const { fullName, email, isSendEvaluator } = this.getFullNameEmailByStatus(evaluation);
            const encryptedId = (0, util_2.encrypt)(evaluation.id.toString());
            const typeDetail = evaluation.level > 7 ? 'evaluation-8-10' : 'evaluation';
            content = content.replace(/{{toUser}}/, ((_a = fullName === null || fullName === void 0 ? void 0 : fullName.toString()) === null || _a === void 0 ? void 0 : _a.split(' ')[0]) +
                `${((_c = (_b = fullName === null || fullName === void 0 ? void 0 : fullName.toString()) === null || _b === void 0 ? void 0 : _b.split(' ')) === null || _c === void 0 ? void 0 : _c.length) > 1 ? 'さん' : ''}`);
            content = content.replace(/{{userName}}/gi, evaluation.user_full_name);
            content = content.replace(/{{divisionName}}/gi, evaluation.division_name);
            content = content.replace(/{{level}}/gi, (_d = evaluation.level) === null || _d === void 0 ? void 0 : _d.toString());
            titleMail = titleMail.replace(/{{toUser}}/, ((_e = fullName === null || fullName === void 0 ? void 0 : fullName.toString()) === null || _e === void 0 ? void 0 : _e.split(' ')[0]) +
                `${((_g = (_f = fullName === null || fullName === void 0 ? void 0 : fullName.toString()) === null || _f === void 0 ? void 0 : _f.split(' ')) === null || _g === void 0 ? void 0 : _g.length) > 1 ? 'さん' : ''}`);
            titleMail = titleMail.replace(/{{userName}}/gi, evaluation.user_full_name);
            titleMail = titleMail.replace(/{{divisionName}}/gi, evaluation.division_name);
            titleMail = titleMail.replace(/{{level}}/gi, (_h = evaluation.level) === null || _h === void 0 ? void 0 : _h.toString());
            let url = '';
            if (!isSendEvaluator) {
                url = `${process.env.HOSTNAME_}/company/${data.companyGroupCode}/user/${typeDetail}/${encryptedId}`;
            }
            else {
                url = `${process.env.HOSTNAME_}/company/${data.companyGroupCode}/evaluator/${typeDetail}/${encryptedId}`;
            }
            titleMail = titleMail.replace(/{{detailUrl}}/gi, url);
            content = content.replace(/{{detailUrl}}/gi, url);
            const toEmails = [emailHR, email];
            if (toEmails && toEmails.length > 0) {
                await (0, util_1.sendEmailsWith)(toEmails, '', titleMail, content);
                const object = Object.assign(Object.assign({}, data), { toEmails: toEmails.toString(), content: content, title: titleMail, status: 1, sendTimeActual: (0, util_2.isFormatDate)(new Date(), 'YYYY/M/D H:mm') });
                await this.evaluationRepo.updateHistoryMailNotFixed(object, transaction);
            }
        }
        return { message: 'success' };
    }
    async saveMailTemplate(body, companyGroupCode, isCreateHistoryCronjob) {
        var _a;
        if (isCreateHistoryCronjob) {
            const nameCronJobs = [
                '',
                '',
                '',
                '',
                '',
                'sendMailExceptionCreationGoals_',
                'sendMailExceptionEvaluationGoals_',
                'sendMailCreationGoals_',
                'sendMailEvaluationGoals_',
            ];
            const period = await this.evaluationPeriodRepo.findOnePeriod({
                id: body.evaluationPeriodId,
                companyGroupCode: companyGroupCode,
            });
            const cronbJobId = await this.historyCronJobRepository.addNews({
                type: body.type,
                name: `${Math.random().toString(36).slice(2)}${nameCronJobs[body.type]}${period.periodIndex === 1
                    ? period.year + '年上期'
                    : period.year + '年下期'}`,
                periodIndex: period.periodIndex,
                year: period.year,
                dateSendMailEvaluationGoal: body.sendTimeSetting,
                evaluationPeriodId: body.evaluationPeriodId,
                companyGroupCode: companyGroupCode,
            });
            body.cronjobId = cronbJobId.id;
        }
        body.companyGroupCode = companyGroupCode;
        if ([5, 6].includes(body.type)) {
            body.mailTo = body.dataMailCCs[0].user;
            body.mailCC = (_a = body.dataMailCCs[0].evaluators) === null || _a === void 0 ? void 0 : _a.join(',');
        }
        return await this.mailSettingRepo.saveMailTemplate(body);
    }
    async getMailHistoryList(query, req) {
        return await this.mailSettingRepo.getMailHistoryList(query, req);
    }
    async updateMailHistory(body, id, req) {
        var _a, _b;
        const getHistoryCron = await this.mailSettingRepo.findOne({
            id: id,
            companyGroupCode: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode,
        });
        if (body.sendTimeSetting) {
            await this.historyCronJobRepository.updateHistory({
                dateSendMailCreationGoalDepartment: body.sendTimeSetting,
                dateSendMailCreationGoal: body.sendTimeSetting,
                dateSendMailEvaluationGoalDepartment: body.sendTimeSetting,
                dateSendMailEvaluationGoal: body.sendTimeSetting,
            }, {
                id: getHistoryCron.cronjobId,
                companyGroupCode: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.companyGroupCode,
            });
        }
        return await this.mailSettingRepo.updateMailHistory(body, id);
    }
    async deleteMail(id) {
        const transaction = await this.mailSettingRepo.transaction();
        const cronId = await this.mailSettingRepo.findOne({ id: id });
        try {
            const results = await this.mailSettingRepo.deleteMail(id, transaction);
            await this.historyCronJobRepository.deleteHistory({
                id: cronId.cronjobId,
            }, transaction);
            await transaction.commit();
            return results;
        }
        catch (error) {
            transaction.rollback();
            throw new RuntimeException_1.RuntimeException(error, 500);
        }
    }
    async getTitleContentFromTemplateMailId(idTemplateMail, companyGroupCode) {
        try {
            const dataMail = await this.mailSettingRepo.getMailTemplateById({
                id: idTemplateMail,
                companyGroupCode: companyGroupCode,
            });
            const title = dataMail.get('subject') || '';
            const content = dataMail.get('content') || '';
            return { title, content };
        }
        catch (error) {
            throw new RuntimeException_1.RuntimeException(error === null || error === void 0 ? void 0 : error.message.toString(), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getRawMailTemplate(idTemplateMail, companyGroupCode) {
        try {
            const dataMail = await this.mailSettingRepo.getMailTemplateById({
                id: idTemplateMail,
                companyGroupCode,
            });
            if (!dataMail)
                return null;
            return {
                id: dataMail.get('id'),
                name: dataMail.get('name'),
                subject: dataMail.get('subject'),
                content: dataMail.get('content'),
                note: dataMail.get('note'),
            };
        }
        catch (_a) {
            return null;
        }
    }
    async getSettingSendMailRemindGoalUserPeriod(companyGroupCode) {
        const result = [];
        try {
            const dataMails = await this.mailSettingRepo.getListMailTemplateById({
                id: TemplateMailId_1.TemplateMailId.SEND_MAIL_REMIND_AUTO_GOAL,
                companyGroupCode: companyGroupCode,
            });
            for (const dataMail of dataMails) {
                const setting = dataMail.get('setting') || '';
                let active = 0;
                let days = [];
                if (setting !== '') {
                    const objectSetting = JSON.parse(setting);
                    active = objectSetting.active;
                    days = objectSetting.days;
                }
                result.push({
                    goalActive: active,
                    goalDays: days,
                    companyGroupCode: dataMail.get('companyGroupCode'),
                });
            }
            return result;
        }
        catch (error) {
            throw new RuntimeException_1.RuntimeException(error === null || error === void 0 ? void 0 : error.message.toString(), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getSettingSendMailRemindEvalPeriod(companyGroupCode) {
        try {
            const result = [];
            const dataMails = await this.mailSettingRepo.getListMailTemplateById({
                id: TemplateMailId_1.TemplateMailId.SEND_MAIL_REMIND_AUTO_EVAL,
                companyGroupCode: companyGroupCode,
            });
            for (const dataMail of dataMails) {
                const setting = dataMail.get('setting') || '';
                let active = 0;
                let days = [];
                if (setting !== '') {
                    const objectSetting = JSON.parse(setting);
                    active = objectSetting.active;
                    days = objectSetting.days;
                }
                result.push({
                    evalActive: active,
                    evalDays: days,
                    companyGroupCode: dataMail.get('companyGroupCode'),
                });
            }
            return result;
        }
        catch (error) {
            throw new RuntimeException_1.RuntimeException(error === null || error === void 0 ? void 0 : error.message.toString(), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async sendMailCustoms(toEmails, ccEmail, titleEmail, infoEmail) {
        return await (0, util_1.sendEmailsWith)(toEmails, ccEmail, titleEmail, infoEmail);
    }
    async getMailNotificateEvaluation(year, periodIndex, companyGroupCode) {
        let { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.COMMON_EVALUATION_SETTING, companyGroupCode);
        const periodText = periodIndex === '1' ? '上期' : '下期';
        const periodDate = periodIndex === '1' ? `${year}年4月1日` : `${year}年10月1日`;
        const periodMonth = periodIndex === '1' ? `${year}年9月` : `${Number(year) + 1}年3月`;
        const loginURL = `${process.env.HOSTNAME_}/login`;
        title = title.replace(/{{evaluationYear}}/gi, year);
        title = title.replace(/{{evaluationPeriod}}/gi, periodText);
        title = title.replace(/{{periodFirstDate}}/gi, periodDate);
        title = title.replace(/{{periodMonth}}/gi, periodMonth);
        title = title.replace(/{{loginUrl}}/gi, loginURL);
        content = content.replace(/{{evaluationYear}}/gi, year);
        content = content.replace(/{{evaluationPeriod}}/gi, periodText);
        content = content.replace(/{{periodFirstDate}}/gi, periodDate);
        content = content.replace(/{{periodMonth}}/gi, periodMonth);
        content = content.replace(/{{loginUrl}}/gi, loginURL);
        return { title, content };
    }
    async getMailNotificateGoalSetting(year, periodIndex, companyGroupCode) {
        let { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.COMMON_GOAL_SETTING, companyGroupCode);
        const periodText = periodIndex === '1' ? '上期' : '下期';
        const firstPeriodDate = periodIndex === '1' ? `${year}年4月1日` : `${year}年10月1日`;
        const secondPeriodDate = periodIndex === '1' ? `${year}年10月2日` : `${year}年4月2日`;
        const periodMonth = periodIndex === '1' ? `${year}年3月` : `${year}年9月`;
        const loginURL = `${process.env.HOSTNAME_}/login`;
        title = title.replace(/{{evaluationYear}}/gi, year);
        title = title.replace(/{{evaluationPeriod}}/gi, periodText);
        title = title.replace(/{{periodFirstDate}}/gi, firstPeriodDate);
        title = title.replace(/{{periodSecondDate}}/gi, secondPeriodDate);
        title = title.replace(/{{secondPeriodMonth}}/gi, periodMonth);
        title = title.replace(/{{loginUrl}}/gi, loginURL);
        content = content.replace(/{{evaluationYear}}/gi, year);
        content = content.replace(/{{evaluationPeriod}}/gi, periodText);
        content = content.replace(/{{periodFirstDate}}/gi, firstPeriodDate);
        content = content.replace(/{{periodSecondDate}}/gi, secondPeriodDate);
        content = content.replace(/{{secondPeriodMonth}}/gi, periodMonth);
        content = content.replace(/{{loginUrl}}/gi, loginURL);
        return { title, content };
    }
    async getMailNotificateEvaluationException(year, periodIndex, companyGroupCode) {
        let { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.EXCEPTION_EVALUATION_SETTING, companyGroupCode);
        const periodText = periodIndex === '1' ? '上期' : '下期';
        const periodDate = periodIndex === '1' ? `${year}年4月1日` : `${year}年10月1日`;
        const periodMonth = periodIndex === '1' ? `${year}年9月` : `${Number(year) + 1}年3月`;
        const loginURL = `${process.env.HOSTNAME_}/login`;
        title = title.replace(/{{evaluationYear}}/gi, year);
        title = title.replace(/{{evaluationPeriod}}/gi, periodText);
        title = title.replace(/{{periodFirstDate}}/gi, periodDate);
        title = title.replace(/{{periodMonth}}/gi, periodMonth);
        title = title.replace(/{{loginUrl}}/gi, loginURL);
        content = content.replace(/{{evaluationYear}}/gi, year);
        content = content.replace(/{{evaluationPeriod}}/gi, periodText);
        content = content.replace(/{{periodFirstDate}}/gi, periodDate);
        content = content.replace(/{{periodMonth}}/gi, periodMonth);
        content = content.replace(/{{loginUrl}}/gi, loginURL);
        return { title, content };
    }
    async getMailNotificateGoalSettingException(year, periodIndex, companyGroupCode) {
        let { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.EXCEPTION_GOAL_SETTING, companyGroupCode);
        const periodText = periodIndex === '1' ? '上期' : '下期';
        const firstPeriodDate = periodIndex === '1' ? `${year}年4月1日` : `${year}年10月1日`;
        const secondPeriodDate = periodIndex === '1' ? `${year}年10月2日` : `${year}年4月2日`;
        const periodMonth = periodIndex === '1' ? `${year}年3月` : `${year}年9月`;
        const loginURL = `${process.env.HOSTNAME_}/login`;
        title = title.replace(/{{evaluationYear}}/gi, year);
        title = title.replace(/{{evaluationPeriod}}/gi, periodText);
        title = title.replace(/{{periodFirstDate}}/gi, firstPeriodDate);
        title = title.replace(/{{periodSecondDate}}/gi, secondPeriodDate);
        title = title.replace(/{{secondPeriodMonth}}/gi, periodMonth);
        title = title.replace(/{{loginUrl}}/gi, loginURL);
        content = content.replace(/{{evaluationYear}}/gi, year);
        content = content.replace(/{{evaluationPeriod}}/gi, periodText);
        content = content.replace(/{{periodFirstDate}}/gi, firstPeriodDate);
        content = content.replace(/{{periodSecondDate}}/gi, secondPeriodDate);
        content = content.replace(/{{secondPeriodMonth}}/gi, periodMonth);
        content = content.replace(/{{loginUrl}}/gi, loginURL);
        return { title, content };
    }
    async getMailNotiGoalFixedUserAndEvaluatorWOTime(period, companyGroupCode) {
        const { periodIndex, year, dateCreationGoalEnd } = period;
        let { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.GOAL_USER_AND_EVALUATOR_WITHOUT_TIME, companyGroupCode);
        const periodText = periodIndex == 1 ? '上期' : '下期';
        const loginURL = `${process.env.HOSTNAME_}/login`;
        const dateCreationGoalEndMonth = dateCreationGoalEnd
            ? moment(dateCreationGoalEnd, this.DATE_FORMAT).month() + 1
            : '';
        const dateCreationGoalEndDay = dateCreationGoalEnd
            ? moment(dateCreationGoalEnd, this.DATE_FORMAT).date()
            : '';
        const dateCreationGoalEndDOW = Object.values(TemplateMailId_1.day)[dateCreationGoalEnd
            ? moment(dateCreationGoalEnd, this.DATE_FORMAT).day()
            : 0];
        const dayCreationGoalEnd = `${dateCreationGoalEndMonth}月${dateCreationGoalEndDay}日 (${dateCreationGoalEndDOW})`;
        title = title.replace(/{{evaluationYear}}/gi, year);
        title = title.replace(/{{evaluationPeriod}}/gi, periodText);
        title = title.replace(/{{loginUrl}}/gi, loginURL);
        title = title.replace(/{{dayCreationGoalEnd}}/gi, dayCreationGoalEnd);
        title = title.replace(/{{goalCreateEndDate}}/gi, dateCreationGoalEnd);
        content = content.replace(/{{evaluationYear}}/gi, year);
        content = content.replace(/{{evaluationPeriod}}/gi, periodText);
        content = content.replace(/{{loginUrl}}/gi, loginURL);
        content = content.replace(/{{dayCreationGoalEnd}}/gi, dayCreationGoalEnd);
        content = content.replace(/{{goalCreateEndDate}}/gi, dateCreationGoalEnd);
        return { title, content };
    }
    async getMailNotiGoalFixedEvaluatorWOTime(period, companyGroupCode, evaluationId) {
        var _a, _b;
        const { periodIndex, year, dateCreationGoalEnd } = period;
        let { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.GOAL_EVALUATOR_WITHOUT_TIME, companyGroupCode);
        const periodText = periodIndex == 1 ? '上期' : '下期';
        const loginURL = `${process.env.HOSTNAME_}/login`;
        const dateCreationGoalEndMonth = dateCreationGoalEnd
            ? moment(dateCreationGoalEnd, this.DATE_FORMAT).month() + 1
            : '';
        const dateCreationGoalEndDay = dateCreationGoalEnd
            ? moment(dateCreationGoalEnd, this.DATE_FORMAT).date()
            : '';
        const dateCreationGoalEndDOW = Object.values(TemplateMailId_1.day)[dateCreationGoalEnd
            ? moment(dateCreationGoalEnd, this.DATE_FORMAT).day()
            : 0];
        const dayCreationGoalEnd = `${dateCreationGoalEndMonth}月${dateCreationGoalEndDay}日 (${dateCreationGoalEndDOW})`;
        let infoUserEvaluation = undefined;
        let url = ``;
        if (evaluationId > 0) {
            infoUserEvaluation = await this.evaluationRepo.getEvaluationUserById(evaluationId);
            const encryptedId = (0, util_2.encrypt)(evaluationId.toString());
            const typeDetail = (infoUserEvaluation === null || infoUserEvaluation === void 0 ? void 0 : infoUserEvaluation.level) > 7 ? 'evaluation-8-10' : 'evaluation';
            url = `${process.env.HOSTNAME_}/company/${companyGroupCode}/evaluator/${typeDetail}/${encryptedId}`;
        }
        title = title.replace(/{{evaluationYear}}/gi, year);
        title = title.replace(/{{evaluationPeriod}}/gi, periodText);
        title = title.replace(/{{loginUrl}}/gi, loginURL);
        title = title.replace(/{{dayCreationGoalEnd}}/gi, dayCreationGoalEnd);
        title = title.replace(/{{goalCreateEndDate}}/gi, dateCreationGoalEnd);
        content = content.replace(/{{evaluationYear}}/gi, year);
        content = content.replace(/{{evaluationPeriod}}/gi, periodText);
        content = content.replace(/{{loginUrl}}/gi, loginURL);
        content = content.replace(/{{dayCreationGoalEnd}}/gi, dayCreationGoalEnd);
        content = content.replace(/{{goalCreateEndDate}}/gi, dateCreationGoalEnd);
        if (evaluationId > 0) {
            title = title.replace(/{{detailUrl}}/gi, url);
            content = content.replace(/{{detailUrl}}/gi, url);
            if (infoUserEvaluation) {
                title = title.replace(/{{userName}}/gi, (_a = infoUserEvaluation.user) === null || _a === void 0 ? void 0 : _a.fullName);
                content = content.replace(/{{userName}}/gi, (_b = infoUserEvaluation.user) === null || _b === void 0 ? void 0 : _b.fullName);
                title = title.replace(/{{divisionName}}/gi, infoUserEvaluation.divisionName);
                content = content.replace(/{{divisionName}}/gi, infoUserEvaluation.divisionName);
                title = title.replace(/{{level}}/gi, infoUserEvaluation.level);
                content = content.replace(/{{level}}/gi, infoUserEvaluation.level);
            }
        }
        return { title, content };
    }
    async getMailNotiGoalFixedUserAndEvaluator(period, companyGroupCode) {
        const { periodIndex, year, dateCreationGoalStart, dateCreationGoalEnd } = period;
        let { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.GOAL_USER_AND_EVALUATOR, companyGroupCode);
        const periodText = periodIndex == 1 ? '上期' : '下期';
        const loginURL = `${process.env.HOSTNAME_}/login`;
        const dateCreationGoalStartMonth = dateCreationGoalStart
            ? moment(dateCreationGoalStart, this.DATE_FORMAT).month() + 1
            : '';
        const dateCreationGoalStartDay = dateCreationGoalStart
            ? moment(dateCreationGoalStart, this.DATE_FORMAT).date()
            : '';
        const dateCreationGoalStartDOW = Object.values(TemplateMailId_1.day)[dateCreationGoalStart
            ? moment(dateCreationGoalStart, this.DATE_FORMAT).day()
            : 0];
        const dayCreationGoalStart = `${dateCreationGoalStartMonth}月${dateCreationGoalStartDay}日 (${dateCreationGoalStartDOW})`;
        const dateCreationGoalEndMonth = dateCreationGoalEnd
            ? moment(dateCreationGoalEnd, this.DATE_FORMAT).month() + 1
            : '';
        const dateCreationGoalEndDay = dateCreationGoalEnd
            ? moment(dateCreationGoalEnd, this.DATE_FORMAT).date()
            : '';
        const dateCreationGoalEndDOW = Object.values(TemplateMailId_1.day)[dateCreationGoalEnd
            ? moment(dateCreationGoalEnd, this.DATE_FORMAT).day()
            : 0];
        const dayCreationGoalEnd = `${dateCreationGoalEndMonth}月${dateCreationGoalEndDay}日 (${dateCreationGoalEndDOW})`;
        title = title.replace(/{{evaluationYear}}/gi, year);
        title = title.replace(/{{evaluationPeriod}}/gi, periodText);
        title = title.replace(/{{loginUrl}}/gi, loginURL);
        title = title.replace(/{{dayCreationGoalStart}}/gi, dayCreationGoalStart);
        title = title.replace(/{{goalCreateStartDate}}/gi, dateCreationGoalStart);
        title = title.replace(/{{dayCreationGoalEnd}}/gi, dayCreationGoalEnd);
        title = title.replace(/{{goalCreateEndDate}}/gi, dateCreationGoalEnd);
        content = content.replace(/{{evaluationYear}}/gi, year);
        content = content.replace(/{{evaluationPeriod}}/gi, periodText);
        content = content.replace(/{{loginUrl}}/gi, loginURL);
        content = content.replace(/{{dayCreationGoalStart}}/gi, dayCreationGoalStart);
        content = content.replace(/{{goalCreateStartDate}}/gi, dateCreationGoalStart);
        content = content.replace(/{{dayCreationGoalEnd}}/gi, dayCreationGoalEnd);
        content = content.replace(/{{goalCreateEndDate}}/gi, dateCreationGoalEnd);
        return { title, content };
    }
    async getMailNotiEvalFixedUserAndEvaluatorWOTime(period, companyGroupCode) {
        const { periodIndex, year, dateEvaluationEnd } = period;
        let { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.EVAL_USER_AND_EVALUATOR_WITHOUT_TIME, companyGroupCode);
        const periodText = periodIndex == 1 ? '上期' : '下期';
        const loginURL = `${process.env.HOSTNAME_}/login`;
        const dateEvaluationEndMonth = dateEvaluationEnd
            ? moment(dateEvaluationEnd, this.DATE_FORMAT).month() + 1
            : '';
        const dateEvaluationEndDay = dateEvaluationEnd
            ? moment(dateEvaluationEnd, this.DATE_FORMAT).date()
            : '';
        const dateEvaluationEndDOW = Object.values(TemplateMailId_1.day)[dateEvaluationEnd
            ? moment(dateEvaluationEnd, this.DATE_FORMAT).day()
            : 0];
        const dayEvaluationEnd = `${dateEvaluationEndMonth}月${dateEvaluationEndDay}日 (${dateEvaluationEndDOW})`;
        title = title.replace(/{{evaluationYear}}/gi, year);
        title = title.replace(/{{evaluationPeriod}}/gi, periodText);
        title = title.replace(/{{dayEvaluationEnd}}/gi, dayEvaluationEnd);
        title = title.replace(/{{evaluationEndDate}}/gi, dateEvaluationEnd);
        title = title.replace(/{{loginUrl}}/gi, loginURL);
        content = content.replace(/{{evaluationYear}}/gi, year);
        content = content.replace(/{{evaluationPeriod}}/gi, periodText);
        content = content.replace(/{{loginUrl}}/gi, loginURL);
        content = content.replace(/{{dayEvaluationEnd}}/gi, dayEvaluationEnd);
        content = content.replace(/{{evaluationEndDate}}/gi, dateEvaluationEnd);
        return { title, content };
    }
    async getMailNotiEvalFixedEvaluatorWOTime(period, companyGroupCode, evaluationId) {
        var _a, _b;
        const { periodIndex, year, dateEvaluationEnd } = period;
        let { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.EVAL_EVALUATOR_WITHOUT_TIME, companyGroupCode);
        const periodText = periodIndex == 1 ? '上期' : '下期';
        const loginURL = `${process.env.HOSTNAME_}/login`;
        const dateEvaluationEndMonth = dateEvaluationEnd
            ? moment(dateEvaluationEnd, this.DATE_FORMAT).month() + 1
            : '';
        const dateEvaluationEndDay = dateEvaluationEnd
            ? moment(dateEvaluationEnd, this.DATE_FORMAT).date()
            : '';
        const dateEvaluationEndDOW = Object.values(TemplateMailId_1.day)[dateEvaluationEnd
            ? moment(dateEvaluationEnd, this.DATE_FORMAT).day()
            : 0];
        const dayEvaluationEnd = `${dateEvaluationEndMonth}月${dateEvaluationEndDay}日 (${dateEvaluationEndDOW})`;
        let infoUserEvaluation = undefined;
        let url = ``;
        if (evaluationId > 0) {
            infoUserEvaluation = await this.evaluationRepo.getEvaluationUserById(evaluationId);
            const encryptedId = (0, util_2.encrypt)(evaluationId.toString());
            const typeDetail = (infoUserEvaluation === null || infoUserEvaluation === void 0 ? void 0 : infoUserEvaluation.level) > 7 ? 'evaluation-8-10' : 'evaluation';
            url = `${process.env.HOSTNAME_}/company/${companyGroupCode}/evaluator/${typeDetail}/${encryptedId}`;
        }
        title = title.replace(/{{evaluationYear}}/gi, year);
        title = title.replace(/{{evaluationPeriod}}/gi, periodText);
        title = title.replace(/{{dayEvaluationEnd}}/gi, dayEvaluationEnd);
        title = title.replace(/{{evaluationEndDate}}/gi, dateEvaluationEnd);
        title = title.replace(/{{loginUrl}}/gi, loginURL);
        content = content.replace(/{{evaluationYear}}/gi, year);
        content = content.replace(/{{evaluationPeriod}}/gi, periodText);
        content = content.replace(/{{loginUrl}}/gi, loginURL);
        content = content.replace(/{{dayEvaluationEnd}}/gi, dayEvaluationEnd);
        content = content.replace(/{{evaluationEndDate}}/gi, dateEvaluationEnd);
        if (evaluationId > 0) {
            title = title.replace(/{{detailUrl}}/gi, url);
            content = content.replace(/{{detailUrl}}/gi, url);
            if (infoUserEvaluation) {
                title = title.replace(/{{userName}}/gi, (_a = infoUserEvaluation.user) === null || _a === void 0 ? void 0 : _a.fullName);
                content = content.replace(/{{userName}}/gi, (_b = infoUserEvaluation.user) === null || _b === void 0 ? void 0 : _b.fullName);
                title = title.replace(/{{divisionName}}/gi, infoUserEvaluation.divisionName);
                content = content.replace(/{{divisionName}}/gi, infoUserEvaluation.divisionName);
                title = title.replace(/{{level}}/gi, infoUserEvaluation.level);
                content = content.replace(/{{level}}/gi, infoUserEvaluation.level);
            }
        }
        return { title, content };
    }
    async getMailNotiEvalFixedUserAndEvaluator(period, companyGroupCode) {
        const { periodIndex, year, dateEvaluationStart, dateEvaluationEnd } = period;
        let { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.EVAL_USER_AND_EVALUATOR, companyGroupCode);
        const periodText = periodIndex == 1 ? '上期' : '下期';
        const loginURL = `${process.env.HOSTNAME_}/login`;
        const dateEvaluationStartMonth = dateEvaluationStart
            ? moment(dateEvaluationStart, this.DATE_FORMAT).month() + 1
            : '';
        const dateEvaluationStartDay = dateEvaluationStart
            ? moment(dateEvaluationStart, this.DATE_FORMAT).date()
            : '';
        const dateEvaluationStartDOW = Object.values(TemplateMailId_1.day)[dateEvaluationStart
            ? moment(dateEvaluationStart, this.DATE_FORMAT).day()
            : 0];
        const dayEvaluationStart = `${dateEvaluationStartMonth}月${dateEvaluationStartDay}日 (${dateEvaluationStartDOW})`;
        const dateEvaluationEndMonth = dateEvaluationEnd
            ? moment(dateEvaluationEnd, this.DATE_FORMAT).month() + 1
            : '';
        const dateEvaluationEndDay = dateEvaluationEnd
            ? moment(dateEvaluationEnd, this.DATE_FORMAT).date()
            : '';
        const dateEvaluationEndDOW = Object.values(TemplateMailId_1.day)[dateEvaluationEnd
            ? moment(dateEvaluationEnd, this.DATE_FORMAT).day()
            : 0];
        const dayEvaluationEnd = `${dateEvaluationEndMonth}月${dateEvaluationEndDay}日 (${dateEvaluationEndDOW})`;
        title = title.replace(/{{evaluationYear}}/gi, year);
        title = title.replace(/{{evaluationPeriod}}/gi, periodText);
        title = title.replace(/{{loginUrl}}/gi, loginURL);
        title = title.replace(/{{dayEvaluationStart}}/gi, dayEvaluationStart);
        title = title.replace(/{{dayEvaluationEnd}}/gi, dayEvaluationEnd);
        title = title.replace(/{{evaluationStartDate}}/gi, dateEvaluationStart);
        title = title.replace(/{{evaluationEndDate}}/gi, dateEvaluationEnd);
        content = content.replace(/{{evaluationYear}}/gi, year);
        content = content.replace(/{{evaluationPeriod}}/gi, periodText);
        content = content.replace(/{{loginUrl}}/gi, loginURL);
        content = content.replace(/{{dayEvaluationStart}}/gi, dayEvaluationStart);
        content = content.replace(/{{dayEvaluationEnd}}/gi, dayEvaluationEnd);
        content = content.replace(/{{evaluationStartDate}}/gi, dateEvaluationStart);
        content = content.replace(/{{evaluationEndDate}}/gi, dateEvaluationEnd);
        return { title, content };
    }
    async getMailNotiGoalNotFixed(year, period_index, date_end, listEmailGoal, companyGroupCode) {
        let { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.SEND_MAIL_REMIND_AUTO_GOAL, companyGroupCode);
        const periodText = period_index == 1 ? '上期' : '下期';
        const loginURL = `${process.env.HOSTNAME_}/login`;
        const dateCreationGoalEndMonth = date_end
            ? moment(date_end, this.DATE_FORMAT).month() + 1
            : '';
        const dateCreationGoalEndDay = date_end
            ? moment(date_end, this.DATE_FORMAT).date()
            : '';
        const dateCreationGoalEndDOW = Object.values(TemplateMailId_1.day)[date_end ? moment(date_end, this.DATE_FORMAT).day() : 0];
        const dayCreationGoalEnd = `${dateCreationGoalEndMonth}月${dateCreationGoalEndDay}日 (${dateCreationGoalEndDOW})`;
        title = title.replace(/{{evaluationYear}}/gi, year);
        title = title.replace(/{{evaluationPeriod}}/gi, periodText);
        title = title.replace(/{{loginUrl}}/gi, loginURL);
        title = title.replace(/{{dayCreationGoalEnd}}/gi, dayCreationGoalEnd);
        title = title.replace(/{{goalCreateEndDate}}/gi, date_end);
        content = content.replace(/{{evaluationYear}}/gi, year);
        content = content.replace(/{{evaluationPeriod}}/gi, periodText);
        content = content.replace(/{{loginUrl}}/gi, loginURL);
        content = content.replace(/{{dayCreationGoalEnd}}/gi, dayCreationGoalEnd);
        content = content.replace(/{{goalCreateEndDate}}/gi, date_end);
        return { title, content };
    }
    async getMailNotiEvalNotFixed(year, period_index, date_end, listEmailEval, companyGroupCode) {
        let { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.SEND_MAIL_REMIND_AUTO_EVAL, companyGroupCode);
        const periodText = period_index == 1 ? '上期' : '下期';
        const loginURL = `${process.env.HOSTNAME_}/login`;
        const dateEvaluationEndMonth = date_end
            ? moment(date_end, this.DATE_FORMAT).month() + 1
            : '';
        const dateEvaluationEndDay = date_end
            ? moment(date_end, this.DATE_FORMAT).date()
            : '';
        const dateEvaluationEndDOW = Object.values(TemplateMailId_1.day)[date_end ? moment(date_end, this.DATE_FORMAT).day() : 0];
        const dayEvaluationEnd = `${dateEvaluationEndMonth}月${dateEvaluationEndDay}日 (${dateEvaluationEndDOW})`;
        title = title.replace(/{{evaluationYear}}/gi, year);
        title = title.replace(/{{evaluationPeriod}}/gi, periodText);
        title = title.replace(/{{dayEvaluationEnd}}/gi, dayEvaluationEnd);
        title = title.replace(/{{evaluationEndDate}}/gi, dayEvaluationEnd);
        title = title.replace(/{{loginUrl}}/gi, loginURL);
        content = content.replace(/{{evaluationYear}}/gi, year);
        content = content.replace(/{{evaluationPeriod}}/gi, periodText);
        content = content.replace(/{{loginUrl}}/gi, loginURL);
        content = content.replace(/{{dayEvaluationEnd}}/gi, dayEvaluationEnd);
        content = content.replace(/{{evaluationEndDate}}/gi, dayEvaluationEnd);
        return { title, content };
    }
    async getSendMailCreateFeedback(data, companyGroupCode) {
        var _a, _b, _c, _d, _e, _f;
        let { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.FEEDBACK_CREATE, companyGroupCode);
        const encryptedId = (0, util_2.encrypt)(data.feedbackId.toString());
        const companyCode = process.env.COMPANY_SYSTEM_ADMIN || companyGroupCode;
        const url = `${process.env.HOSTNAME_SYSTEM_ADMIN}/company/${companyCode}/system-admin/list-feedback/detail/${encryptedId}`;
        title = title.replace(/{{toUser}}/gi, ((_a = data.userName.toString()) === null || _a === void 0 ? void 0 : _a.split(' ')[0]) +
            `${((_c = (_b = data.userName.toString()) === null || _b === void 0 ? void 0 : _b.split(' ')) === null || _c === void 0 ? void 0 : _c.length) > 1 ? 'さん' : ''}`);
        title = title.replace(/{{departmentName}}/gi, data.departmentName);
        title = title.replace(/{{companyName}}/gi, data.companyName);
        title = title.replace(/{{detailURL}}/gi, url);
        title = title.replace(/{{typeFeedback}}/gi, ReplaceKeyword_1.typeFeedback[data.typeFeedback]);
        title = title.replace(/{{overview}}/gi, data.overview);
        title = title.replace(/{{NO.}}/gi, data.feedbackId.toString());
        content = content.replace(/{{toUser}}/gi, ((_d = data.userName.toString()) === null || _d === void 0 ? void 0 : _d.split(' ')[0]) +
            `${((_f = (_e = data.userName.toString()) === null || _e === void 0 ? void 0 : _e.split(' ')) === null || _f === void 0 ? void 0 : _f.length) > 1 ? 'さん' : ''}`);
        content = content.replace(/{{departmentName}}/gi, data.departmentName);
        content = content.replace(/{{companyName}}/gi, data.companyName);
        content = content.replace(/{{detailURL}}/gi, url);
        content = content.replace(/{{typeFeedback}}/gi, ReplaceKeyword_1.typeFeedback[data.typeFeedback]);
        content = content.replace(/{{overview}}/gi, data.overview);
        content = content.replace(/{{NO.}}/gi, data.feedbackId.toString());
        return { title, content };
    }
    async getSendMailUpdateFeedback(data, companyGroupCode) {
        var _a, _b, _c, _d, _e, _f;
        let { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.FEEDBACK_UPDATE_STATUS, companyGroupCode);
        const encryptedId = (0, util_2.encrypt)(data.feedbackId.toString());
        const url = `${process.env.HOSTNAME_}/company/${companyGroupCode}/feedback/detail/${encryptedId}`;
        title = title.replace(/{{toUser}}/gi, ((_a = data.userName.toString()) === null || _a === void 0 ? void 0 : _a.split(' ')[0]) +
            `${((_c = (_b = data.userName.toString()) === null || _b === void 0 ? void 0 : _b.split(' ')) === null || _c === void 0 ? void 0 : _c.length) > 1 ? 'さん' : ''}`);
        title = title.replace(/{{detailURL}}/gi, url);
        title = title.replace(/{{status}}/gi, ReplaceKeyword_1.statusFeedback[data.status]);
        title = title.replace(/{{NO.}}/gi, data.feedbackId.toString());
        content = content.replace(/{{toUser}}/gi, ((_d = data.userName.toString()) === null || _d === void 0 ? void 0 : _d.split(' ')[0]) +
            `${((_f = (_e = data.userName.toString()) === null || _e === void 0 ? void 0 : _e.split(' ')) === null || _f === void 0 ? void 0 : _f.length) > 1 ? 'さん' : ''}`);
        content = content.replace(/{{detailURL}}/gi, url);
        content = content.replace(/{{status}}/gi, ReplaceKeyword_1.statusFeedback[data.status]);
        content = content.replace(/{{NO.}}/gi, data.feedbackId.toString());
        return { title, content };
    }
    async getSendMailCommentFeedback(data, companyGroupCode, typeAddComment) {
        let { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.FEEDBACK_ADD_COMMENT, companyGroupCode);
        const encryptedId = (0, util_2.encrypt)(data.feedbackId.toString());
        let url = '';
        if (typeAddComment === 2) {
            url = `${process.env.HOSTNAME_}/company/${companyGroupCode}/feedback/detail/${encryptedId}`;
        }
        else {
            const companyCode = process.env.COMPANY_SYSTEM_ADMIN || companyGroupCode;
            url = `${process.env.HOSTNAME_SYSTEM_ADMIN}/company/${companyCode}/system-admin/list-feedback/detail/${encryptedId}`;
        }
        const uniqueFullNames = [
            ...new Set(data.listFullName.map((e) => e === null || e === void 0 ? void 0 : e.toString())),
        ];
        const formattedNames = uniqueFullNames
            .map((fullName) => {
            const parts = fullName.split(' ');
            const firstName = parts[0];
            return `${firstName}${parts.length > 1 ? 'さん' : ''}`;
        })
            .join('、');
        title = title.replace(/{{detailURL}}/gi, url);
        title = title.replace(/{{toUser}}/gi, formattedNames);
        title = title.replace(/{{typeFeedback}}/gi, ReplaceKeyword_1.typeFeedback[data.typeFeedback]);
        title = title.replace(/{{NO.}}/gi, data.feedbackId.toString());
        content = content.replace(/{{detailURL}}/gi, url);
        content = content.replace(/{{toUser}}/gi, formattedNames);
        content = content.replace(/{{typeFeedback}}/gi, ReplaceKeyword_1.typeFeedback[data.typeFeedback]);
        content = content.replace(/{{NO.}}/gi, data.feedbackId.toString());
        return { title, content };
    }
    async getSendMailDeleteComment(data, companyGroupCode, typeAddComment) {
        let { title, content } = await this.getTitleContentFromTemplateMailId(TemplateMailId_1.TemplateMailId.FEEDBACK_DELETE_COMMENT, companyGroupCode);
        const encryptedId = (0, util_2.encrypt)(data.feedbackId.toString());
        let url = '';
        if (typeAddComment === 2) {
            url = `${process.env.HOSTNAME_}/company/${companyGroupCode}/feedback/detail/${encryptedId}`;
        }
        else {
            const companyCode = process.env.COMPANY_SYSTEM_ADMIN || companyGroupCode;
            url = `${process.env.HOSTNAME_SYSTEM_ADMIN}/company/${companyCode}/system-admin/list-feedback/detail/${encryptedId}`;
        }
        const uniqueFullNames = [
            ...new Set(data.listFullName.map((e) => e === null || e === void 0 ? void 0 : e.toString())),
        ];
        const formattedNames = uniqueFullNames
            .map((fullName) => {
            const parts = fullName.split(' ');
            const firstName = parts[0];
            return `${firstName}${parts.length > 1 ? 'さん' : ''}`;
        })
            .join('、');
        title = title.replace(/{{detailURL}}/gi, url);
        title = title.replace(/{{toUser}}/gi, formattedNames);
        title = title.replace(/{{typeFeedback}}/gi, ReplaceKeyword_1.typeFeedback[data.typeFeedback]);
        title = title.replace(/{{NO.}}/gi, data.feedbackId.toString());
        content = content.replace(/{{detailURL}}/gi, url);
        content = content.replace(/{{toUser}}/gi, formattedNames);
        content = content.replace(/{{typeFeedback}}/gi, ReplaceKeyword_1.typeFeedback[data.typeFeedback]);
        content = content.replace(/{{NO.}}/gi, data.feedbackId.toString());
        return { title, content };
    }
    async getMailTemplateList(query, req) {
        return await this.mailSettingRepo.getMailTemplateList(query, req);
    }
    async getMailTemplateListById(query, req) {
        return await this.mailSettingRepo.getMailTemplateListById(query, req);
    }
    async editMailTemplate(body, req) {
        return await this.mailSettingRepo.editMailTemplate(body, req);
    }
    async getMailTemplateById(id) {
        return await this.mailSettingRepo.getMailTemplateById({
            id: id,
        });
    }
};
__decorate([
    (0, common_1.Inject)(user_repository_1.UserRepository),
    __metadata("design:type", Object)
], MailService.prototype, "userRepo", void 0);
__decorate([
    (0, common_1.Inject)(evaluationPeriod_repository_1.EvaluationPeriodRepository),
    __metadata("design:type", evaluationPeriod_repository_1.EvaluationPeriodRepository)
], MailService.prototype, "evaluationPeriodRepo", void 0);
__decorate([
    (0, common_1.Inject)(evaluation_repository_1.EvaluationRepository),
    __metadata("design:type", Object)
], MailService.prototype, "evaluationRepo", void 0);
__decorate([
    (0, common_1.Inject)(proSkillSetting_repository_1.ProSkillSettingRepository),
    __metadata("design:type", proSkillSetting_repository_1.ProSkillSettingRepository)
], MailService.prototype, "proSkillSettingRepo", void 0);
__decorate([
    (0, common_1.Inject)(proSkill_repository_1.ProSkillRepository),
    __metadata("design:type", proSkill_repository_1.ProSkillRepository)
], MailService.prototype, "proSkillRepo", void 0);
__decorate([
    (0, common_1.Inject)(mailSetting_repository_1.MailSettingRepository),
    __metadata("design:type", Object)
], MailService.prototype, "mailSettingRepo", void 0);
__decorate([
    (0, common_1.Inject)(historyCronjob_repository_1.HistoryCronJobRepository),
    __metadata("design:type", historyCronjob_repository_1.HistoryCronJobRepository)
], MailService.prototype, "historyCronJobRepository", void 0);
MailService = __decorate([
    (0, common_1.Injectable)()
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=mail.service.js.map