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
exports.CronJobServices = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const evaluationPeriod_repository_1 = require("../repository/evaluationPeriod.repository");
const historyCronjob_repository_1 = require("../repository/historyCronjob.repository");
const user_repository_1 = require("../repository/user.repository");
const mail_service_1 = require("./mail.service");
const util_1 = require("../common/util");
const evaluation_repository_1 = require("../repository/evaluation.repository");
const mailSetting_repository_1 = require("../repository/mailSetting.repository");
const logger_service_1 = require("./logger.service");
const evaluationPeriod_service_1 = require("./evaluationPeriod.service");
const evaluation_service_1 = require("./evaluation.service");
const sequelize_1 = require("sequelize");
const companyGroup_service_1 = require("./companyGroup.service");
const evaluator_repository_1 = require("../repository/evaluator.repository");
const versionSetting_repository_1 = require("../repository/versionSetting.repository");
const guideEvaluation_repository_1 = require("../repository/guideEvaluation.repository");
const proSkill_repository_1 = require("../repository/proSkill.repository");
const momentTz = require('moment-timezone');
let CronJobServices = class CronJobServices {
    constructor(logger) {
        this.logger = logger;
    }
    async triggerNotifications() {
        const companyGroups = await this.companyGroupService.getCompanyByHour([
            3, 5,
        ]);
        for (const group of companyGroups) {
            this.logger.log(null, `Running cron job for company: ${group.name}, Timezone: ${group.timezone}`);
            if (group.hour == '3') {
                await this.processCompanyGroupSettingGoals(group);
            }
            else if (group.hour == '5') {
                await this.processCompanyGroupSendMail(group);
            }
        }
    }
    async processCompanyGroupSettingGoals(group) {
        const historyLists = await this.historyCronJobRepository.getAllByCondition({
            companyGroupCode: group.code,
        });
        for (const history of historyLists) {
            const period = history.periodIndex === 1
                ? `${history.year}年上期`
                : `${history.year}年下期`;
            if (history.type === 1) {
                await this.addCronJobSettingDepartmentGoals(history.name, period, history.year, history.dateCreationGoalDepartmentStart, history.dateCreationGoalDepartmentEnd, history.periodIndex, history.companyGroupCode, group.timezone);
            }
            else if (history.type === 2) {
                await this.addCronJobSettingPersonalGoals(history.name, period, history.year, history.dateCreationGoalStart, history.dateCreationGoalEnd, history.periodIndex, history.companyGroupCode, group.timezone);
            }
        }
    }
    async addCronJobSettingDepartmentGoals(name, title, year, start, end, periodIndex, companyGroupCode, timezone) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.logger.log(null, `Check addCronJobSettingDepartmentGoals - ${start}`);
        if ((0, util_1.isFormatDate)(momentTz(new Date()).tz(timezone), 'YYYY/M/D', timezone) ===
            start) {
            this.logger.log(null, `start addCronJobSettingDepartmentGoals ---${name} - ${momentTz(new Date()).tz(timezone)}`);
            const periodId = await this.evaluationPeriodRepo.findOnePeriod({
                [sequelize_1.Op.and]: [
                    { periodIndex: periodIndex },
                    { year: year },
                    {
                        dateCreationGoalDepartmentStart: start,
                    },
                    {
                        companyGroupCode: companyGroupCode,
                    },
                ],
            });
            if (periodId) {
                const transaction = await this.evaluatorRepository.getNewTransaction();
                await this.proSkillRepository.insertHistoryPublicProSkill(year, periodIndex, companyGroupCode);
                const versionSettings = (await this.versionSettingRepository.listPointSettingCron(companyGroupCode)).reduce((acc, curr) => {
                    acc[curr.type] = curr;
                    return acc;
                }, {});
                const guideSkill = await this.guideEvaluationRepository.findOneGuide({
                    status: 4,
                    type: 2,
                    companyGroupCode: companyGroupCode,
                });
                const guideNoSkill = await this.guideEvaluationRepository.findOneGuide({
                    status: 4,
                    type: 4,
                    companyGroupCode: companyGroupCode,
                });
                const listUsers810s = await this.userRepo.listUserDepartmentVersionTwo({
                    level: {
                        [sequelize_1.Op.in]: [8, 9, 10],
                    },
                    active: 1,
                    companyGroupCode: companyGroupCode,
                }, periodId.id);
                const arrays = [];
                const evaluators = [];
                for (let index = 0; index < listUsers810s.length; index++) {
                    if (Object.keys(versionSettings).length > 0) {
                        const levelSetting = await this.versionSettingRepository.findOneSetting({
                            versionId: versionSettings[listUsers810s[index].user.flagSkill === 1 ? 2 : 4].id,
                            level: listUsers810s[index].user.level,
                        });
                        arrays.push({
                            title: title,
                            userId: listUsers810s[index].user.id,
                            departmentId: listUsers810s[index].user.department
                                ? `${listUsers810s[index].user.department.id}`
                                : null,
                            departmentName: listUsers810s[index].user.department
                                ? listUsers810s[index].user.department.name
                                : null,
                            divisionId: ((_a = listUsers810s[index]) === null || _a === void 0 ? void 0 : _a.user.division)
                                ? `${(_b = listUsers810s[index]) === null || _b === void 0 ? void 0 : _b.user.division.id}`
                                : null,
                            divisionName: ((_c = listUsers810s[index]) === null || _c === void 0 ? void 0 : _c.user.division)
                                ? (_d = listUsers810s[index]) === null || _d === void 0 ? void 0 : _d.user.division.name
                                : null,
                            companyName: listUsers810s[index].user.company
                                ? listUsers810s[index].user.company.name
                                : null,
                            periodStart: periodId.periodStart,
                            periodEnd: periodId.periodEnd,
                            status: 0,
                            level: listUsers810s[index].user.level,
                            evaluationPeriodId: periodId.id,
                            guideVersionId: listUsers810s[index].user.flagSkill === 1
                                ? guideSkill.id
                                : guideNoSkill.id,
                            creationUser: null,
                            skillPercent: listUsers810s[index].user.flagSkill === 1
                                ? (levelSetting === null || levelSetting === void 0 ? void 0 : levelSetting.skillPercent) || null
                                : null,
                            achievementPercent: (levelSetting === null || levelSetting === void 0 ? void 0 : levelSetting.achievementPercent) || null,
                            behaviorPercent: (levelSetting === null || levelSetting === void 0 ? void 0 : levelSetting.behaviorPercent) || null,
                            createdByCronjob: 1,
                            flagSkill: listUsers810s[index].user.flagSkill,
                            companyGroupCode: listUsers810s[index].user.companyGroupCode,
                        });
                    }
                    else {
                        arrays.push({
                            title: title,
                            userId: listUsers810s[index].user.id,
                            departmentId: listUsers810s[index].user.department
                                ? `${listUsers810s[index].user.department.id}`
                                : null,
                            departmentName: listUsers810s[index].user.department
                                ? listUsers810s[index].user.department.name
                                : null,
                            divisionId: ((_e = listUsers810s[index]) === null || _e === void 0 ? void 0 : _e.user.division)
                                ? `${(_f = listUsers810s[index]) === null || _f === void 0 ? void 0 : _f.user.division.id}`
                                : null,
                            divisionName: ((_g = listUsers810s[index]) === null || _g === void 0 ? void 0 : _g.user.division)
                                ? (_h = listUsers810s[index]) === null || _h === void 0 ? void 0 : _h.user.division.name
                                : null,
                            companyName: listUsers810s[index].user.company
                                ? listUsers810s[index].user.company.name
                                : null,
                            periodStart: periodId.periodStart,
                            periodEnd: periodId.periodEnd,
                            status: 0,
                            level: listUsers810s[index].user.level,
                            evaluationPeriodId: periodId.id,
                            guideVersionId: listUsers810s[index].user.flagSkill === 1
                                ? guideSkill.id
                                : guideNoSkill.id,
                            creationUser: null,
                            skillPercent: null,
                            achievementPercent: null,
                            behaviorPercent: null,
                            createdByCronjob: 1,
                            flagSkill: listUsers810s[index].user.flagSkill,
                            companyGroupCode: listUsers810s[index].user.companyGroupCode,
                        });
                    }
                }
                try {
                    const results = await this.evaluationRepository.createDepartmentGoals(arrays, transaction);
                    if (results) {
                        this.logger.log(null, `Creation department goals success - ${results} ---- ${name}`);
                        for (let index = 0; index < results.length; index++) {
                            if (results[index].id !== undefined) {
                                const evaluatorDefaults05 = await this.userRepo.listEvaluatorDefault({
                                    userId: results[index].userId,
                                    evaluationPeriodId: periodId.id,
                                });
                                const condition = {
                                    [sequelize_1.Op.and]: [
                                        { user_id: results[index].userId },
                                        {
                                            evaluation_period_id: periodId.id,
                                        },
                                    ],
                                };
                                const data = {
                                    departmentName: results[index].departmentName,
                                    level: results[index].level,
                                    flagSkill: results[index].flagSkill,
                                    departmentId: results[index].departmentId,
                                    divisionId: results[index].divisionId,
                                    divisionName: results[index].divisionName,
                                    companyGroupCode: companyGroupCode,
                                };
                                await this.userRepo.updateEvaluatorDefault(condition, data, transaction);
                                if (evaluatorDefaults05 && evaluatorDefaults05.evaluator05Id) {
                                    evaluators.push({
                                        evaluationId: results[index].id,
                                        evaluatorId: evaluatorDefaults05.evaluator05Id,
                                        evaluationOrder: Number(0.5),
                                    });
                                }
                                if (evaluatorDefaults05 && evaluatorDefaults05.evaluator1Id) {
                                    evaluators.push({
                                        evaluationId: results[index].id,
                                        evaluatorId: evaluatorDefaults05.evaluator1Id,
                                        evaluationOrder: 1.0,
                                    });
                                }
                                if (evaluatorDefaults05 && evaluatorDefaults05.evaluator2Id) {
                                    evaluators.push({
                                        evaluationId: results[index].id,
                                        evaluatorId: evaluatorDefaults05.evaluator2Id,
                                        evaluationOrder: 2.0,
                                    });
                                }
                            }
                        }
                        await this.evaluatorRepository.createEvaluator(evaluators, transaction);
                        this.logger.log(null, `success creation ${results} --- ${name}`);
                        await this.historyCronJobRepository.deleteHistory({
                            name: name,
                            companyGroupCode: companyGroupCode,
                        }, transaction);
                        await transaction.commit();
                    }
                }
                catch (error) {
                    this.logger.log(null, `Error exception ${error} --- ${name}`);
                    await transaction.rollback();
                }
            }
            else {
                this.logger.log(null, `No search have period ${periodId} --- ${name}`);
            }
        }
        return true;
    }
    async addCronJobSettingPersonalGoals(name, title, year, start, end, periodIndex, companyGroupCode, timezone) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.logger.log(null, `Check addCronJobSettingPersonalGoals - ${start}`);
        if ((0, util_1.isFormatDate)(momentTz(new Date()).tz(timezone), 'YYYY/M/D', timezone) ===
            start) {
            this.logger.log(null, `start addCronJobSettingPersonalGoals ---- ${name}`);
            const periodId = await this.evaluationPeriodRepo.findOnePeriod({
                [sequelize_1.Op.and]: [
                    { periodIndex: periodIndex },
                    { year: year },
                    {
                        dateCreationGoalStart: start,
                    },
                    {
                        companyGroupCode: companyGroupCode,
                    },
                ],
            });
            if (periodId) {
                const transaction = await this.evaluatorRepository.getNewTransaction();
                try {
                    await this.proSkillRepository.insertHistoryPublicProSkill(year, periodIndex, companyGroupCode);
                    const versionSettings = (await this.versionSettingRepository.listPointSettingCron(companyGroupCode)).reduce((acc, curr) => {
                        acc[curr.type] = curr;
                        return acc;
                    }, {});
                    const guideSkill = await this.guideEvaluationRepository.findOneGuide({
                        status: 4,
                        type: 1,
                        companyGroupCode: companyGroupCode,
                    });
                    const guideNoSkill = await this.guideEvaluationRepository.findOneGuide({
                        status: 4,
                        type: 3,
                        companyGroupCode: companyGroupCode,
                    });
                    const listUsers = await this.userRepo.listUserDepartmentVersionTwo({
                        level: {
                            [sequelize_1.Op.in]: [1, 2, 3, 4, 5, 6, 7],
                        },
                        active: 1,
                        companyGroupCode: companyGroupCode,
                    }, periodId.id);
                    const arrays = [];
                    const evaluatorsArrays = [];
                    for (let index = 0; index < listUsers.length; index++) {
                        if (Object.keys(versionSettings).length > 0) {
                            const levelSetting = await this.versionSettingRepository.findOneSetting({
                                versionId: versionSettings[listUsers[index].user.flagSkill === 1 ? 1 : 3].id,
                                level: listUsers[index].user.level,
                            });
                            arrays.push({
                                title: title,
                                userId: listUsers[index].user.id,
                                departmentId: listUsers[index].user.department
                                    ? `${listUsers[index].user.department.id}`
                                    : null,
                                departmentName: listUsers[index].user.department
                                    ? listUsers[index].user.department.name
                                    : null,
                                divisionId: ((_a = listUsers[index]) === null || _a === void 0 ? void 0 : _a.user.division)
                                    ? `${(_b = listUsers[index]) === null || _b === void 0 ? void 0 : _b.user.division.id}`
                                    : null,
                                divisionName: ((_c = listUsers[index]) === null || _c === void 0 ? void 0 : _c.user.division)
                                    ? (_d = listUsers[index]) === null || _d === void 0 ? void 0 : _d.user.division.name
                                    : null,
                                companyName: listUsers[index].user.company.name,
                                periodStart: periodId.periodStart,
                                periodEnd: periodId.periodEnd,
                                status: 0,
                                level: listUsers[index].user.level,
                                evaluationPeriodId: periodId.id,
                                guideVersionId: listUsers[index].user.flagSkill === 1
                                    ? guideSkill.id
                                    : guideNoSkill.id,
                                creationUser: null,
                                skillPercent: listUsers[index].user.flagSkill === 1
                                    ? (levelSetting === null || levelSetting === void 0 ? void 0 : levelSetting.skillPercent) || null
                                    : null,
                                achievementPercent: (levelSetting === null || levelSetting === void 0 ? void 0 : levelSetting.achievementPercent) || null,
                                behaviorPercent: (levelSetting === null || levelSetting === void 0 ? void 0 : levelSetting.behaviorPercent) || null,
                                createdByCronjob: 1,
                                flagSkill: listUsers[index].user.flagSkill,
                                companyGroupCode: listUsers[index].user.companyGroupCode,
                            });
                        }
                        else {
                            arrays.push({
                                title: title,
                                userId: listUsers[index].user.id,
                                departmentId: listUsers[index].user.department
                                    ? `${listUsers[index].user.department.id}`
                                    : null,
                                departmentName: listUsers[index].user.department
                                    ? listUsers[index].user.department.name
                                    : null,
                                divisionId: ((_e = listUsers[index]) === null || _e === void 0 ? void 0 : _e.user.division)
                                    ? `${(_f = listUsers[index]) === null || _f === void 0 ? void 0 : _f.user.division.id}`
                                    : null,
                                divisionName: ((_g = listUsers[index]) === null || _g === void 0 ? void 0 : _g.user.division)
                                    ? (_h = listUsers[index]) === null || _h === void 0 ? void 0 : _h.user.division.name
                                    : null,
                                companyName: listUsers[index].user.company.name,
                                periodStart: periodId.periodStart,
                                periodEnd: periodId.periodEnd,
                                status: 0,
                                level: listUsers[index].user.level,
                                evaluationPeriodId: periodId.id,
                                guideVersionId: listUsers[index].user.flagSkill === 1
                                    ? guideSkill.id
                                    : guideNoSkill.id,
                                creationUser: null,
                                skillPercent: null,
                                achievementPercent: null,
                                behaviorPercent: null,
                                createdByCronjob: 1,
                                flagSkill: listUsers[index].user.flagSkill,
                                companyGroupCode: listUsers[index].user.companyGroupCode,
                            });
                        }
                    }
                    const results = await this.evaluationRepository.createPersonalGoals(arrays, transaction);
                    for (let index = 0; index < results.length; index++) {
                        if (results[index].id !== undefined) {
                            const evaluatorDefaults05 = await this.userRepo.listEvaluatorDefault({
                                userId: results[index].userId,
                                evaluationPeriodId: periodId.id,
                            });
                            const condition = {
                                [sequelize_1.Op.and]: [
                                    { user_id: results[index].userId },
                                    {
                                        evaluation_period_id: periodId.id,
                                    },
                                ],
                            };
                            const data = {
                                departmentName: results[index].departmentName,
                                level: results[index].level,
                                flagSkill: results[index].flagSkill,
                                departmentId: results[index].departmentId,
                                divisionId: results[index].divisionId,
                                divisionName: results[index].divisionName,
                                companyGroupCode: companyGroupCode,
                            };
                            await this.userRepo.updateEvaluatorDefault(condition, data, transaction);
                            if (evaluatorDefaults05 && evaluatorDefaults05.evaluator05Id) {
                                evaluatorsArrays.push({
                                    evaluationId: results[index].id,
                                    evaluatorId: evaluatorDefaults05.evaluator05Id,
                                    evaluationOrder: Number(0.5),
                                });
                            }
                            if (evaluatorDefaults05 && evaluatorDefaults05.evaluator1Id) {
                                evaluatorsArrays.push({
                                    evaluationId: results[index].id,
                                    evaluatorId: evaluatorDefaults05.evaluator1Id,
                                    evaluationOrder: 1.0,
                                });
                            }
                            if (evaluatorDefaults05 && evaluatorDefaults05.evaluator2Id) {
                                evaluatorsArrays.push({
                                    evaluationId: results[index].id,
                                    evaluatorId: evaluatorDefaults05.evaluator2Id,
                                    evaluationOrder: 2.0,
                                });
                            }
                        }
                    }
                    if (results) {
                        this.logger.log(null, `creation peronal goals success ${results.length} ---- ${name}`);
                        await this.evaluatorRepository.createEvaluator(evaluatorsArrays, transaction);
                        await this.historyCronJobRepository.deleteHistory({ name: name, companyGroupCode: companyGroupCode }, transaction);
                        await transaction.commit();
                    }
                }
                catch (error) {
                    this.logger.error(null, ` ${error} -- ${name}`);
                    await transaction.rollback();
                }
            }
            else {
                this.logger.log(null, ` Exist period ${periodId} --- ${start} ~ ${end} ---- ${name}`);
            }
        }
        return true;
    }
    async processCompanyGroupSendMail(group) {
        const historyLists = await this.historyCronJobRepository.getAllByCondition({
            companyGroupCode: group.code,
        });
        this.logger.log(null, `Running cron job  ${historyLists.toString()}   ${new Date()}`);
        for (let index = 0; index < historyLists.length; index++) {
            if (historyLists[index].type === 7) {
                await this.addCronJobSettingSendMailCreation(historyLists[index].name, historyLists[index].periodIndex, historyLists[index].year, historyLists[index].dateSendMailEvaluationGoal, historyLists[index].type, historyLists[index].companyGroupCode, group.timezone);
            }
            if (historyLists[index].type === 8) {
                await this.addCronJobSettingSendMailEvaluation(historyLists[index].name, historyLists[index].periodIndex, historyLists[index].year, historyLists[index].dateSendMailEvaluationGoal, historyLists[index].type, historyLists[index].companyGroupCode, group.timezone);
            }
            if ([5, 6].includes(historyLists[index].type)) {
                await this.addCronJobExeptionsCreationByUser(historyLists[index].name, historyLists[index].dateSendMailEvaluationGoal, historyLists[index].type, historyLists[index].companyGroupCode, group.timezone);
            }
        }
    }
    async addCronJobSettingSendMailCreation(name, periodIndex, year, dateSendMail, type, companyGroupCode, timezone) {
        var _a, _b, _c, _d;
        this.logger.log(null, `Check addCronJobSettingSendMailCreation - ${dateSendMail}`);
        if (dateSendMail) {
            if ((0, util_1.isFormatDate)(momentTz(new Date()).tz(timezone), 'YYYY/M/D', timezone) === dateSendMail) {
                this.logger.log(null, `start addCronJobSettingSendMailCreation---${name} - ${momentTz(new Date()).tz(timezone)}`);
                const getCronb = await this.historyCronJobRepository.findOneByCondition({
                    name: name,
                    companyGroupCode,
                });
                const periods = await this.evaluationPeriodRepo.getPeriodListSendMailDepartment({
                    id: getCronb.evaluationPeriodId,
                });
                if (periods) {
                    const idMailSetting = await this.mailSettingRepository.findOne({
                        cronjobId: getCronb.id,
                        companyGroupCode: companyGroupCode,
                    });
                    try {
                        for (const email of (_a = idMailSetting === null || idMailSetting === void 0 ? void 0 : idMailSetting.mailTo) === null || _a === void 0 ? void 0 : _a.split(',')) {
                            let toUserText = ``;
                            const username = await this.userRepo.getUserNameFromEmail(email, companyGroupCode);
                            if (username) {
                                toUserText += `${(_b = username === null || username === void 0 ? void 0 : username.fullName) === null || _b === void 0 ? void 0 : _b.split(' ')[0]}${((_d = (_c = username === null || username === void 0 ? void 0 : username.fullName) === null || _c === void 0 ? void 0 : _c.split(' ')) === null || _d === void 0 ? void 0 : _d.length) > 1 ? 'さん' : ''}<br><br>`;
                            }
                            await this.mailService.sendMailCustoms([email], [], idMailSetting.title, `${toUserText}${idMailSetting.contentMail}`);
                        }
                        await this.historyCronJobRepository.deleteHistory({ name: name, companyGroupCode: companyGroupCode }, null);
                        await this.mailSettingRepository.updateMailHistory({
                            status: 1,
                            sendTimeActual: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm'),
                        }, idMailSetting.id);
                    }
                    catch (error) {
                        this.logger.error(null, `Error send mail  sendMailStartGoalSetting To:${idMailSetting === null || idMailSetting === void 0 ? void 0 : idMailSetting.mailTo} --- ${name} ---- Error: ${error}`);
                    }
                }
                else {
                    this.logger.log(null, `Exist period  * ${periods} ${dateSendMail}*---${name} - ${new Date()}`);
                }
            }
        }
    }
    async addCronJobSettingSendMailEvaluation(name, periodIndex, year, dateSendMail, type, companyGroupCode, timezone) {
        var _a, _b, _c, _d;
        this.logger.log(null, `Check addCronJobSettingSendMailEvaluationDepartment - ${dateSendMail}`);
        if (dateSendMail) {
            if ((0, util_1.isFormatDate)(momentTz(new Date()).tz(timezone), 'YYYY/M/D', timezone) === dateSendMail) {
                const getCronb = await this.historyCronJobRepository.findOneByCondition({
                    name: name,
                    companyGroupCode,
                });
                this.logger.log(null, `Running addCronJobSettingSendMailEvaluationDepartment  ---${name} - ${momentTz(new Date()).tz(timezone)}`);
                const periods = await this.evaluationPeriodRepo.getPeriodListSendMailDepartment({
                    id: getCronb.evaluationPeriodId,
                });
                if (periods) {
                    const idMailSetting = await this.mailSettingRepository.findOne({
                        cronjobId: getCronb.id,
                        companyGroupCode: companyGroupCode,
                    });
                    try {
                        for (const email of (_a = idMailSetting === null || idMailSetting === void 0 ? void 0 : idMailSetting.mailTo) === null || _a === void 0 ? void 0 : _a.split(',')) {
                            let toUserText = ``;
                            const username = await this.userRepo.getUserNameFromEmail(email, companyGroupCode);
                            if (username) {
                                toUserText += `${(_b = username === null || username === void 0 ? void 0 : username.fullName) === null || _b === void 0 ? void 0 : _b.split(' ')[0]}${((_d = (_c = username === null || username === void 0 ? void 0 : username.fullName) === null || _c === void 0 ? void 0 : _c.split(' ')) === null || _d === void 0 ? void 0 : _d.length) > 1 ? 'さん' : ''}<br><br>`;
                                const conditionCountException = {
                                    userId: username.id,
                                    evaluationPeriodId: getCronb.evaluationPeriodId,
                                    creationUser: { [sequelize_1.Op.ne]: null },
                                    dateEvaluationStart: { [sequelize_1.Op.ne]: null },
                                    dateEvaluationEnd: { [sequelize_1.Op.ne]: null },
                                };
                                const countException = await this.userRepo.countEvaluationException(conditionCountException);
                                if (countException > 0) {
                                    const condition17 = {
                                        userId: username.id,
                                        evaluationPeriodId: getCronb.evaluationPeriodId,
                                        creationUser: { [sequelize_1.Op.ne]: null },
                                        dateEvaluationStart: periods.dateEvaluationStart,
                                        dateEvaluationEnd: periods.dateEvaluationEnd,
                                        level: { [sequelize_1.Op.lte]: 7 },
                                    };
                                    const exception17 = await this.userRepo.countEvaluationException(condition17);
                                    const condition810 = {
                                        userId: username.id,
                                        evaluationPeriodId: getCronb.evaluationPeriodId,
                                        creationUser: { [sequelize_1.Op.ne]: null },
                                        dateEvaluationStart: periods.dateEvaluationDepartmentStart,
                                        dateEvaluationEnd: periods.dateEvaluationDepartmentEnd,
                                        level: { [sequelize_1.Op.gte]: 8 },
                                    };
                                    const exception810 = await this.userRepo.countEvaluationException(condition810);
                                    if (!exception17 && !exception810) {
                                        continue;
                                    }
                                }
                            }
                            await this.mailService.sendMailCustoms([email], [], idMailSetting.title, `${toUserText}${idMailSetting.contentMail}`);
                        }
                        await this.historyCronJobRepository.deleteHistory({ name: name, companyGroupCode: companyGroupCode }, null);
                        this.mailSettingRepository.updateMailHistory({
                            status: 1,
                            sendTimeActual: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm'),
                        }, idMailSetting.id);
                    }
                    catch (error) {
                        this.logger.error(null, `Error send mail  sendMailStartGoalSetting To:${idMailSetting === null || idMailSetting === void 0 ? void 0 : idMailSetting.mailTo} --- ${name} ---- Error: ${error}`);
                    }
                }
                else {
                    this.logger.log(null, `Exist period  * ${periods} ${dateSendMail}*---${name} - ${new Date()}`);
                }
            }
        }
    }
    async addCronJobExeptionsCreationByUser(name, dateSendMail, type, companyGroupCode, timezone) {
        var _a, _b, _c, _d, _e, _f, _g;
        this.logger.log(null, `Check addCronJobExeptionsCreationByUser - ${dateSendMail}`);
        if (dateSendMail) {
            if ((0, util_1.isFormatDate)(momentTz(new Date()).tz(timezone), 'YYYY/M/D', timezone) === dateSendMail) {
                this.logger.log(null, `Running addCronJobExeptionsCreationByUser  * ${dateSendMail} *---${name} - ${momentTz(new Date()).tz(timezone)}`);
                const getCronb = await this.historyCronJobRepository.findOneByCondition({
                    name: name,
                    companyGroupCode,
                });
                const periods = await this.evaluationPeriodRepo.getPeriodListSendMailDepartment({
                    id: getCronb.evaluationPeriodId,
                });
                if (periods) {
                    const listMailTo = await this.mailSettingRepository.findOne({
                        cronjobId: getCronb.id,
                        companyGroupCode: companyGroupCode,
                    });
                    try {
                        let infoEmail = listMailTo.contentMail;
                        const mailUser = listMailTo === null || listMailTo === void 0 ? void 0 : listMailTo.mailTo;
                        const toUser = await this.userRepo.getUserNameFromEmail(mailUser, companyGroupCode);
                        infoEmail = infoEmail.replace(/{{toUser}}/gi, ((_b = (_a = toUser === null || toUser === void 0 ? void 0 : toUser.fullName) === null || _a === void 0 ? void 0 : _a.toString()) === null || _b === void 0 ? void 0 : _b.split(' ')[0]) +
                            `${((_e = (_d = (_c = toUser === null || toUser === void 0 ? void 0 : toUser.fullName) === null || _c === void 0 ? void 0 : _c.toString()) === null || _d === void 0 ? void 0 : _d.split(' ')) === null || _e === void 0 ? void 0 : _e.length) > 1
                                ? 'さん'
                                : ''}`);
                        const ccEmails = [];
                        if (((_f = listMailTo === null || listMailTo === void 0 ? void 0 : listMailTo.mailCC) === null || _f === void 0 ? void 0 : _f.split(',').length) > 0) {
                            const listNameCCs = [];
                            for (const evaluator of (_g = listMailTo === null || listMailTo === void 0 ? void 0 : listMailTo.mailCC) === null || _g === void 0 ? void 0 : _g.split(',')) {
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
                        await this.mailService.sendMailCustoms([mailUser], ccEmails, listMailTo.title, infoEmail);
                        await this.historyCronJobRepository.deleteHistory({ name: name, companyGroupCode: companyGroupCode }, null);
                        this.mailSettingRepository.updateMailHistory({
                            status: 1,
                            sendTimeActual: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm'),
                            contentMail: infoEmail,
                        }, listMailTo.id);
                    }
                    catch (error) {
                        this.logger.error(null, `Error send mail  sendMailStartGoalSetting To:${listMailTo === null || listMailTo === void 0 ? void 0 : listMailTo.mailTo} --- ${name} ---- Error: ${error}`);
                    }
                }
                else {
                    this.logger.log(null, `Exist period  * ${periods} -  ${dateSendMail}*---${name} - ${new Date()}`);
                }
            }
        }
    }
    getDayStrSendMail(day) {
        const dateNow = new Date();
        dateNow.setDate(dateNow.getDate() + day);
        const dateStr = `${dateNow.getFullYear()}/${dateNow.getMonth() + 1}/${dateNow.getDate()}`;
        return dateStr;
    }
    getListEmailFromEvaluation(listEvaluation) {
        let listEmail = [];
        listEvaluation.forEach((item) => {
            if ([0, 1, 2, 50, 51, 52].includes(item.status) &&
                item.user_email !== null &&
                !listEmail.some((email) => email === item.user_email)) {
                listEmail.push(item.user_email);
            }
            if ([3, 4, 53, 54, 55].includes(item.status) &&
                item.evaluator_05_email !== null &&
                !listEmail.some((email) => email === item.evaluator_05_email)) {
                listEmail.push(item.evaluator_05_email);
            }
            if ([5, 6, 56, 57, 58].includes(item.status) &&
                item.evaluator_1_email !== null &&
                !listEmail.some((email) => email === item.evaluator_1_email)) {
                listEmail.push(item.evaluator_1_email);
            }
            if ([7, 8, 59, 60, 61].includes(item.status) &&
                item.evaluator_2_email !== null &&
                !listEmail.some((email) => email === item.evaluator_2_email)) {
                listEmail.push(item.evaluator_2_email);
            }
        });
        return listEmail;
    }
    async handleCronJobSendMailRemindEvaluation() {
        this.logger.log(null, `Check addCronJobSendMailRemindEvaluation`);
        const listCompanyGroup = await this.companyGroupService.getAllCompanyGroup();
        for (const companyGroup of listCompanyGroup) {
            this.logger.log(null, `check companyGroupCode - ${companyGroup.code}`);
            const resultGoals = await this.mailService.getSettingSendMailRemindGoalUserPeriod(companyGroup.code);
            for (const data of resultGoals) {
                const { goalActive, goalDays } = data;
                if (goalActive) {
                    for (let day of goalDays) {
                        const dateEndStr = this.getDayStrSendMail(day);
                        await this.sendMailRemindGoalPeriod(day, dateEndStr, companyGroup.code, companyGroup.emailHR);
                    }
                }
            }
            const resultEvals = await this.mailService.getSettingSendMailRemindEvalPeriod(companyGroup.code);
            for (const data of resultEvals) {
                const { evalActive, evalDays } = data;
                if (evalActive) {
                    for (let day of evalDays) {
                        const dateEndStr = this.getDayStrSendMail(day);
                        await this.sendMailRemindEvalPeriod(day, dateEndStr, companyGroup.code, companyGroup.emailHR);
                    }
                }
            }
        }
    }
    async sendMailRemindGoalPeriod(day, dateEndStr, companyGroupCode, emailHR) {
        const listGoalPeriodRaw = await this.evaluationPeriodService.getAllPeriodNotFixedGoalPeriod(day, companyGroupCode);
        const listGoalPeriod = listGoalPeriodRaw[0];
        if (listGoalPeriod.length > 0) {
            for (let indexPeriod = 0; indexPeriod < listGoalPeriod.length; indexPeriod++) {
                const period = listGoalPeriod[indexPeriod];
                const listEvaluationGoalRaw = await this.evaluationServices.getEvalNotFixedGoalPeriod(period.year, period.period_index, day, companyGroupCode);
                const listEvaluationGoal = listEvaluationGoalRaw[0];
                let listEmailGoal = this.getListEmailFromEvaluation(listEvaluationGoal);
                const { title, content } = await this.mailService.getMailNotiGoalNotFixed(period.year, period.period_index, dateEndStr, listEmailGoal, companyGroupCode);
                const dataNotFixedGoal = {
                    listEvaluation: listEvaluationGoal,
                    toEmails: listEmailGoal,
                    title,
                    content,
                    type: 'notFixedGoal',
                    emailType: 1,
                    evaluationPeriodId: period.id,
                    companyGroupCode: companyGroupCode,
                };
                await this.evaluationServices.sendMaiNotFixed(dataNotFixedGoal, emailHR);
            }
        }
    }
    async sendMailRemindEvalPeriod(day, dateEndStr, companyGroupCode, emailHR) {
        const listEvalPeriodRaw = await this.evaluationPeriodService.getAllPeriodNotFixedEvalPeriod(day, companyGroupCode);
        const listEvalPeriod = listEvalPeriodRaw[0];
        if (listEvalPeriod.length > 0) {
            for (let indexPeriod = 0; indexPeriod < listEvalPeriod.length; indexPeriod++) {
                const period = listEvalPeriod[indexPeriod];
                const listEvaluationEvalRaw = await this.evaluationServices.getEvalNotFixedEvalPeriod(period.year, period.period_index, day, companyGroupCode);
                const listEvaluationEval = listEvaluationEvalRaw[0];
                let listEmailEval = this.getListEmailFromEvaluation(listEvaluationEval);
                const { title, content } = await this.mailService.getMailNotiEvalNotFixed(period.year, period.period_index, dateEndStr, listEmailEval, companyGroupCode);
                const dataNotFixedEval = {
                    listEvaluation: listEvaluationEval,
                    toEmails: listEmailEval,
                    title,
                    content,
                    type: 'notFixedEval',
                    emailType: 3,
                    evaluationPeriodId: period.id,
                    companyGroupCode,
                };
                await this.evaluationServices.sendMaiNotFixed(dataNotFixedEval, emailHR);
            }
        }
    }
};
__decorate([
    (0, common_1.Inject)(historyCronjob_repository_1.HistoryCronJobRepository),
    __metadata("design:type", historyCronjob_repository_1.HistoryCronJobRepository)
], CronJobServices.prototype, "historyCronJobRepository", void 0);
__decorate([
    (0, common_1.Inject)(evaluationPeriod_repository_1.EvaluationPeriodRepository),
    __metadata("design:type", evaluationPeriod_repository_1.EvaluationPeriodRepository)
], CronJobServices.prototype, "evaluationPeriodRepo", void 0);
__decorate([
    (0, common_1.Inject)(user_repository_1.UserRepository),
    __metadata("design:type", user_repository_1.UserRepository)
], CronJobServices.prototype, "userRepo", void 0);
__decorate([
    (0, common_1.Inject)(evaluator_repository_1.EvaluatorRepository),
    __metadata("design:type", evaluator_repository_1.EvaluatorRepository)
], CronJobServices.prototype, "evaluatorRepository", void 0);
__decorate([
    (0, common_1.Inject)(mail_service_1.MailService),
    __metadata("design:type", mail_service_1.MailService)
], CronJobServices.prototype, "mailService", void 0);
__decorate([
    (0, common_1.Inject)(mailSetting_repository_1.MailSettingRepository),
    __metadata("design:type", mailSetting_repository_1.MailSettingRepository)
], CronJobServices.prototype, "mailSettingRepository", void 0);
__decorate([
    (0, common_1.Inject)(evaluation_repository_1.EvaluationRepository),
    __metadata("design:type", evaluation_repository_1.EvaluationRepository)
], CronJobServices.prototype, "evaluationRepository", void 0);
__decorate([
    (0, common_1.Inject)(evaluation_service_1.EvaluationService),
    __metadata("design:type", evaluation_service_1.EvaluationService)
], CronJobServices.prototype, "evaluationServices", void 0);
__decorate([
    (0, common_1.Inject)(evaluationPeriod_service_1.EvaluationPeriodService),
    __metadata("design:type", evaluationPeriod_service_1.EvaluationPeriodService)
], CronJobServices.prototype, "evaluationPeriodService", void 0);
__decorate([
    (0, common_1.Inject)(companyGroup_service_1.CompanyGroupService),
    __metadata("design:type", companyGroup_service_1.CompanyGroupService)
], CronJobServices.prototype, "companyGroupService", void 0);
__decorate([
    (0, common_1.Inject)(versionSetting_repository_1.VersionSettingRepository),
    __metadata("design:type", versionSetting_repository_1.VersionSettingRepository)
], CronJobServices.prototype, "versionSettingRepository", void 0);
__decorate([
    (0, common_1.Inject)(guideEvaluation_repository_1.GuideEvaluationRepository),
    __metadata("design:type", guideEvaluation_repository_1.GuideEvaluationRepository)
], CronJobServices.prototype, "guideEvaluationRepository", void 0);
__decorate([
    (0, common_1.Inject)(proSkill_repository_1.ProSkillRepository),
    __metadata("design:type", proSkill_repository_1.ProSkillRepository)
], CronJobServices.prototype, "proSkillRepository", void 0);
__decorate([
    (0, schedule_1.Cron)('0 1 * * * *', {
        timeZone: 'Asia/Tokyo',
        name: 'notifications',
        disabled: false,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronJobServices.prototype, "triggerNotifications", null);
__decorate([
    (0, schedule_1.Cron)('0 0 10 * * *', {
        timeZone: 'Asia/Tokyo',
        name: 'remindEvaluation',
        disabled: false,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronJobServices.prototype, "handleCronJobSendMailRemindEvaluation", null);
CronJobServices = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.CustomLogger])
], CronJobServices);
exports.CronJobServices = CronJobServices;
//# sourceMappingURL=cronJob.services.js.map