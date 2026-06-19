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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const util_1 = require("../common/util");
const statusEvaluation_1 = require("../constant/statusEvaluation");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const point_repository_1 = require("../repository/point.repository");
const user_repository_1 = require("../repository/user.repository");
const mail_service_1 = require("./mail.service");
const evaluation17_service_1 = require("./evaluation17.service");
const evaluationPeriod_repository_1 = require("../repository/evaluationPeriod.repository");
const versionSetting_repository_1 = require("../repository/versionSetting.repository");
const exceljs_1 = require("exceljs");
const TemplateMailId_1 = require("../enum/TemplateMailId");
const approval_repository_1 = require("../repository/approval.repository");
const evaluator_repository_1 = require("../repository/evaluator.repository");
const proSkill_repository_1 = require("../repository/proSkill.repository");
const evaluation_repository_1 = require("../repository/evaluation.repository");
const evaluationPeriodDepartmentSetting_repository_1 = require("../repository/evaluationPeriodDepartmentSetting.repository");
let UserService = class UserService {
    constructor() {
        this.handleReturnFlagSkillByLevel = (item) => {
            const { flagSkill, level } = item;
            if (level === null && flagSkill === null) {
                return '未設定';
            }
            else {
                if (level >= 8) {
                    return '対象外';
                }
                else {
                    if (flagSkill === 1) {
                        return 'あり';
                    }
                    else if (flagSkill === 0) {
                        return 'なし';
                    }
                    else {
                        return '';
                    }
                }
            }
        };
    }
    async listEvaluation(query, userId, companyGroupCode) {
        var _a, _b;
        const periodEvaluationsIncludeNoActives = await this.userRepo.getEvaluationPeriod(query, userId, companyGroupCode);
        const periodEvaluations = periodEvaluationsIncludeNoActives.filter((e) => e.evaluatorDefault);
        console.log(periodEvaluationsIncludeNoActives);
        const arrays = [];
        const periods = ['', '上期', '下期'];
        const arrayPeriodIndexs = [];
        for (let index = 0; index < periodEvaluations.length; index++) {
            arrayPeriodIndexs.push(periodEvaluations[index].evaluatorDefault
                ? periodEvaluations[index].evaluatorDefault.evaluationPeriodId
                : 0);
            let stringSummary = '';
            const evaluator05s = [''];
            const evaluator1s = [''];
            const evaluator2s = [''];
            const currentCheck = new Date();
            if (periodEvaluations[index].evaluations.length === 1) {
                const status = [''];
                periodEvaluations[index].evaluations[0].evaluator.forEach((v) => {
                    var _a, _b, _c;
                    if (parseFloat(v.evaluationOrder) === 2.0) {
                        evaluator2s[0] = (_a = v.user) === null || _a === void 0 ? void 0 : _a.fullName;
                    }
                    if (parseFloat(v.evaluationOrder) === 1.0) {
                        evaluator1s[0] = (_b = v.user) === null || _b === void 0 ? void 0 : _b.fullName;
                    }
                    if (parseFloat(v.evaluationOrder) === 0.5) {
                        evaluator05s[0] = (_c = v.user) === null || _c === void 0 ? void 0 : _c.fullName;
                    }
                });
                if (periodEvaluations[index].evaluations[0].creationUser === null) {
                    if ([1, 2, 3, 4, 5, 6, 7].includes(periodEvaluations[index].evaluations[0].level)) {
                        if ((0, util_1.isFormatDate)(currentCheck, 'YYYY/MM/DD') >=
                            (0, util_1.isFormatDate)(periodEvaluations[index].dateEvaluationStart, 'YYYY/MM/DD') &&
                            (0, util_1.isFormatDate)(currentCheck, 'YYYY/MM/DD') <=
                                (0, util_1.isFormatDate)(periodEvaluations[index].dateEvaluationEnd, 'YYYY/MM/DD')) {
                            if (periodEvaluations[index].evaluations[0].status === 50) {
                                status[0] =
                                    statusEvaluation_1.statusEvaluation[periodEvaluations[index].evaluations[0].status].split('/')[1];
                            }
                            else {
                                status[0] =
                                    statusEvaluation_1.statusEvaluation[periodEvaluations[index].evaluations[0].status];
                            }
                        }
                        else {
                            if (periodEvaluations[index].evaluations[0].status === 50) {
                                status[0] =
                                    statusEvaluation_1.statusEvaluation[periodEvaluations[index].evaluations[0].status].split('/')[0];
                            }
                            else {
                                status[0] =
                                    statusEvaluation_1.statusEvaluation[periodEvaluations[index].evaluations[0].status];
                            }
                        }
                    }
                    else {
                        if ((0, util_1.isFormatDate)(currentCheck, 'YYYY/MM/DD') >=
                            (0, util_1.isFormatDate)(periodEvaluations[index].dateEvaluationDepartmentStart, 'YYYY/MM/DD') &&
                            (0, util_1.isFormatDate)(currentCheck, 'YYYY/MM/DD') <=
                                (0, util_1.isFormatDate)(periodEvaluations[index].dateEvaluationDepartmentEnd, 'YYYY/MM/DD')) {
                            if (periodEvaluations[index].evaluations[0].status === 50) {
                                status[0] =
                                    statusEvaluation_1.statusEvaluation[periodEvaluations[index].evaluations[0].status].split('/')[1];
                            }
                            else {
                                status[0] =
                                    statusEvaluation_1.statusEvaluation[periodEvaluations[index].evaluations[0].status];
                            }
                        }
                        else {
                            if (periodEvaluations[index].evaluations[0].status === 50) {
                                status[0] =
                                    statusEvaluation_1.statusEvaluation[periodEvaluations[index].evaluations[0].status].split('/')[0];
                            }
                            else {
                                status[0] =
                                    statusEvaluation_1.statusEvaluation[periodEvaluations[index].evaluations[0].status];
                            }
                        }
                    }
                }
                else {
                    if ([1, 2, 3, 4, 5, 6, 7].includes(periodEvaluations[index].evaluations[0].level)) {
                        if ((0, util_1.isFormatDate)(currentCheck, 'YYYY/MM/DD') >=
                            (0, util_1.isFormatDate)(periodEvaluations[index].evaluations[0].dateEvaluationStart ||
                                periodEvaluations[index].dateEvaluationStart, 'YYYY/MM/DD') &&
                            (0, util_1.isFormatDate)(currentCheck, 'YYYY/MM/DD') <=
                                (0, util_1.isFormatDate)(periodEvaluations[index].evaluations[0].dateEvaluationEnd ||
                                    periodEvaluations[index].dateEvaluationEnd, 'YYYY/MM/DD')) {
                            if (periodEvaluations[index].evaluations[0].status === 50) {
                                status[0] =
                                    statusEvaluation_1.statusEvaluation[periodEvaluations[index].evaluations[0].status].split('/')[1];
                            }
                            else {
                                status[0] =
                                    statusEvaluation_1.statusEvaluation[periodEvaluations[index].evaluations[0].status];
                            }
                        }
                        else {
                            if (periodEvaluations[index].evaluations[0].status === 50) {
                                status[0] =
                                    statusEvaluation_1.statusEvaluation[periodEvaluations[index].evaluations[0].status].split('/')[0];
                            }
                            else {
                                status[0] =
                                    statusEvaluation_1.statusEvaluation[periodEvaluations[index].evaluations[0].status];
                            }
                        }
                    }
                    else {
                        if ((0, util_1.isFormatDate)(currentCheck, 'YYYY/MM/DD') >=
                            (0, util_1.isFormatDate)(periodEvaluations[index].evaluations[0].dateEvaluationStart ||
                                periodEvaluations[index].dateEvaluationDepartmentStart, 'YYYY/MM/DD') &&
                            (0, util_1.isFormatDate)(currentCheck, 'YYYY/MM/DD') <=
                                (0, util_1.isFormatDate)(periodEvaluations[index].evaluations[0].dateEvaluationEnd ||
                                    periodEvaluations[index].dateEvaluationDepartmentEnd, 'YYYY/MM/DD')) {
                            if (periodEvaluations[index].evaluations[0].status === 50) {
                                status[0] =
                                    statusEvaluation_1.statusEvaluation[periodEvaluations[index].evaluations[0].status].split('/')[1];
                            }
                            else {
                                status[0] =
                                    statusEvaluation_1.statusEvaluation[periodEvaluations[index].evaluations[0].status];
                            }
                        }
                        else {
                            if (periodEvaluations[index].evaluations[0].status === 50) {
                                status[0] =
                                    statusEvaluation_1.statusEvaluation[periodEvaluations[index].evaluations[0].status].split('/')[0];
                            }
                            else {
                                status[0] =
                                    statusEvaluation_1.statusEvaluation[periodEvaluations[index].evaluations[0].status];
                            }
                        }
                    }
                }
                arrays.push({
                    id: periodEvaluations[index].id,
                    year: `${periodEvaluations[index].year}年${periods[periodEvaluations[index].periodIndex]}`,
                    periodStart: periodEvaluations[index].periodStart,
                    periodEnd: periodEvaluations[index].periodEnd,
                    summaryPointEvaluator2: periodEvaluations[index].evaluations[0].status === 100 &&
                        periodEvaluations[index].evaluations[0].level > 7 &&
                        periodEvaluations[index].evaluations[0].summaryDepartment
                        ? parseFloat(Number((_a = periodEvaluations[index].evaluations[0].summaryDepartment) === null || _a === void 0 ? void 0 : _a.summaryPointEvaluator2).toFixed(1))
                        : periodEvaluations[index].evaluations[0].status === 100 &&
                            periodEvaluations[index].evaluations[0].level < 8 &&
                            periodEvaluations[index].evaluations[0].summaryPointEvaluator2
                            ? Math.round(Number(periodEvaluations[index].evaluations[0]
                                .summaryPointEvaluator2))
                            : null,
                    totalPoint: periodEvaluations[index].evaluations[0].status === 100
                        ? periodEvaluations[index].evaluations[0].level > 7
                            ? Math.round(Number((_b = periodEvaluations[index].evaluations[0].summaryDepartment) === null || _b === void 0 ? void 0 : _b.summaryPointEvaluator2) * 10) / 10
                            : Math.round(periodEvaluations[index].evaluations[0]
                                .summaryPointEvaluator2)
                        : null,
                    stringSummary: stringSummary,
                    status: status[0],
                    evaluationId: periodEvaluations[index].evaluations[0].id,
                    evaluator05: evaluator05s[0],
                    evaluator1: evaluator1s[0],
                    evaluator2: evaluator2s[0],
                    level: periodEvaluations[index].evaluations[0].level,
                    userInfo: periodEvaluations[index].evaluations[0].user,
                    statusNo: periodEvaluations[index].evaluations[0].status,
                    dateEvaluationStart: periodEvaluations[index].dateEvaluationStart,
                    dateEvaluationEnd: periodEvaluations[index].dateEvaluationEnd,
                    isActive: arrayPeriodIndexs.includes(periodEvaluations[index].id),
                });
                evaluator05s[0] = '';
                evaluator1s[0] = '';
                evaluator2s[0] = '';
            }
            else {
                const evaluator05s = [''];
                const evaluator1s = [''];
                const evaluator2s = [''];
                let summaryPointsParents = null;
                const childrens = [];
                const status = [''];
                const minStatus = [];
                const levelsArrs = [];
                const levels810s = [8, 9, 10];
                const levels17s = [1, 2, 3, 4, 5, 6, 7];
                const levels = [[], []];
                let parentStringStatus = statusEvaluation_1.statusEvaluation[100];
                let parentStatus = 100;
                periodEvaluations[index].evaluations.forEach((v) => {
                    var _a, _b, _c, _d, _e;
                    if (levels17s.includes(v.level)) {
                        levels[0].push(v.level);
                    }
                    else {
                        levels[1].push(v.level);
                    }
                    if (v.status === 100) {
                        if (v.summaryPointEvaluator2 ||
                            ((_a = v.summaryDepartment) === null || _a === void 0 ? void 0 : _a.summaryPointEvaluator2))
                            summaryPointsParents +=
                                (v.level <= 7
                                    ? v.summaryPointEvaluator2
                                    : (_b = v.summaryDepartment) === null || _b === void 0 ? void 0 : _b.summaryPointEvaluator2) *
                                    (Math.round(v.percentPoint === null ? 100 : v.percentPoint) /
                                        100);
                    }
                    if (v.creationUser !== null) {
                        if ([1, 2, 3, 4, 5, 6, 7].includes(v.level)) {
                            if ((0, util_1.isFormatDate)(currentCheck, 'YYYY/MM/DD') >=
                                (0, util_1.isFormatDate)(v.dateEvaluationStart ||
                                    periodEvaluations[index].dateEvaluationStart, 'YYYY/MM/DD') &&
                                (0, util_1.isFormatDate)(currentCheck, 'YYYY/MM/DD') <=
                                    (0, util_1.isFormatDate)(v.dateEvaluationEnd ||
                                        periodEvaluations[index].dateEvaluationEnd, 'YYYY/MM/DD')) {
                                if (v.status === 50) {
                                    status[0] = statusEvaluation_1.statusEvaluation[v.status].split('/')[1];
                                }
                                else {
                                    status[0] = statusEvaluation_1.statusEvaluation[v.status];
                                }
                            }
                            else {
                                if (v.status === 50) {
                                    status[0] = statusEvaluation_1.statusEvaluation[v.status].split('/')[0];
                                }
                                else {
                                    status[0] = statusEvaluation_1.statusEvaluation[v.status];
                                }
                            }
                        }
                        else {
                            if ((0, util_1.isFormatDate)(currentCheck, 'YYYY/MM/DD') >=
                                (0, util_1.isFormatDate)(v.dateEvaluationStart ||
                                    periodEvaluations[index].dateEvaluationDepartmentStart, 'YYYY/MM/DD') &&
                                (0, util_1.isFormatDate)(currentCheck, 'YYYY/MM/DD') <=
                                    (0, util_1.isFormatDate)(v.dateEvaluationEnd ||
                                        periodEvaluations[index].dateEvaluationDepartmentEnd, 'YYYY/MM/DD')) {
                                if (v.status === 50) {
                                    status[0] = statusEvaluation_1.statusEvaluation[v.status].split('/')[1];
                                }
                                else {
                                    status[0] = statusEvaluation_1.statusEvaluation[v.status];
                                }
                            }
                            else {
                                if (v.status === 50) {
                                    status[0] = statusEvaluation_1.statusEvaluation[v.status].split('/')[0];
                                }
                                else {
                                    status[0] = statusEvaluation_1.statusEvaluation[v.status];
                                }
                            }
                        }
                    }
                    else {
                        if ([1, 2, 3, 4, 5, 6, 7].includes(v.level)) {
                            if ((0, util_1.isFormatDate)(currentCheck, 'YYYY/MM/DD') >=
                                (0, util_1.isFormatDate)(periodEvaluations[index].dateEvaluationStart, 'YYYY/MM/DD') &&
                                (0, util_1.isFormatDate)(currentCheck, 'YYYY/MM/DD') <=
                                    (0, util_1.isFormatDate)(periodEvaluations[index].dateEvaluationEnd, 'YYYY/MM/DD')) {
                                if (v.status === 50) {
                                    status[0] = statusEvaluation_1.statusEvaluation[v.status].split('/')[1];
                                }
                                else {
                                    status[0] = statusEvaluation_1.statusEvaluation[v.status];
                                }
                            }
                            else {
                                if (v.status === 50) {
                                    status[0] = statusEvaluation_1.statusEvaluation[v.status].split('/')[0];
                                }
                                else {
                                    status[0] = statusEvaluation_1.statusEvaluation[v.status];
                                }
                            }
                        }
                        else {
                            if ((0, util_1.isFormatDate)(currentCheck, 'YYYY/MM/DD') >=
                                (0, util_1.isFormatDate)(periodEvaluations[index].dateEvaluationDepartmentStart, 'YYYY/MM/DD') &&
                                (0, util_1.isFormatDate)(currentCheck, 'YYYY/MM/DD') <=
                                    (0, util_1.isFormatDate)(periodEvaluations[index].dateEvaluationDepartmentEnd, 'YYYY/MM/DD')) {
                                if (v.status === 50) {
                                    status[0] = statusEvaluation_1.statusEvaluation[v.status].split('/')[1];
                                }
                                else {
                                    status[0] = statusEvaluation_1.statusEvaluation[v.status];
                                }
                            }
                            else {
                                if (v.status === 50) {
                                    status[0] = statusEvaluation_1.statusEvaluation[v.status].split('/')[0];
                                }
                                else {
                                    status[0] = statusEvaluation_1.statusEvaluation[v.status];
                                }
                            }
                        }
                    }
                    minStatus.push(v.status);
                    levelsArrs.push(v.level);
                    v.evaluator.forEach((v) => {
                        var _a, _b, _c;
                        if (parseFloat(v.evaluationOrder) === 2.0) {
                            evaluator2s[0] = (_a = v.user) === null || _a === void 0 ? void 0 : _a.fullName;
                        }
                        if (parseFloat(v.evaluationOrder) === 1.0) {
                            evaluator1s[0] = (_b = v.user) === null || _b === void 0 ? void 0 : _b.fullName;
                        }
                        if (parseFloat(v.evaluationOrder) === 0.5) {
                            evaluator05s[0] = (_c = v.user) === null || _c === void 0 ? void 0 : _c.fullName;
                        }
                    });
                    childrens.push({
                        evaluationId: v.id,
                        year: `${v.periodStart} ～ ${v.periodEnd}`,
                        periodStart: v.periodStart,
                        periodEnd: v.periodEnd,
                        summaryPoint: v.level <= 7
                            ? v.summaryPointEvaluator2
                            : (_c = v.summaryDepartment) === null || _c === void 0 ? void 0 : _c.summaryPointEvaluator2,
                        stringSummary: stringSummary,
                        totalPoint: v.status === 100
                            ? levels17s.includes(v.level)
                                ? v.summaryPointEvaluator2
                                    ? Math.round(v.summaryPointEvaluator2)
                                    : null
                                : ((_d = v.summaryDepartment) === null || _d === void 0 ? void 0 : _d.summaryPointEvaluator2)
                                    ? Math.round(Number((_e = v.summaryDepartment) === null || _e === void 0 ? void 0 : _e.summaryPointEvaluator2) * 10) / 10
                                    : null
                            : null,
                        status: status[0],
                        evaluator05: evaluator05s[0],
                        evaluator1: evaluator1s[0],
                        evaluator2: evaluator2s[0],
                        level: v.level,
                        userInfo: v.user,
                        statusNo: v.status,
                        isActive: arrayPeriodIndexs.includes(periodEvaluations[index].id),
                        financialYear: `${periodEvaluations[index].year}年${periods[periodEvaluations[index].periodIndex]}`,
                    });
                    if (parentStatus >= v.status) {
                        if (v.status === 50 && parentStatus === 50) {
                            if (status[0] !== parentStringStatus)
                                parentStringStatus = statusEvaluation_1.statusEvaluation[50].split('/')[0];
                        }
                        else
                            parentStringStatus = status[0];
                        parentStatus = v.status;
                    }
                    status[0] = '';
                    evaluator05s[0] = '';
                    evaluator1s[0] = '';
                    evaluator2s[0] = '';
                });
                const Index810s = levels810s.findIndex((v) => levels[1].includes(v));
                const Index17s = levels17s.findIndex((v) => levels[0].includes(v));
                if (Index810s !== -1 && Index17s >= 0) {
                    summaryPointsParents = 0;
                    stringSummary = '-';
                }
                else {
                    if (Index17s >= 0) {
                        summaryPointsParents = Math.round(summaryPointsParents);
                    }
                    if (Index810s >= 0 && summaryPointsParents !== 0) {
                        summaryPointsParents =
                            Math.round(Number(summaryPointsParents) * 10) / 10;
                    }
                }
                arrays.push({
                    id: periodEvaluations[index].id,
                    year: `${periodEvaluations[index].year}年${periods[periodEvaluations[index].periodIndex]}`,
                    totalPoint: childrens.filter((v) => v.summaryPoint !== null).length > 0 &&
                        parentStringStatus === '【評価】公開済み'
                        ? summaryPointsParents
                        : null,
                    stringSummary: summaryPointsParents === 0 &&
                        childrens.filter((v) => v.summaryPoint !== null).length > 0 &&
                        parentStringStatus === '【評価】公開済み'
                        ? stringSummary
                        : '',
                    status: parentStringStatus,
                    statusNo: minStatus[0],
                    dateEvaluationStart: periodEvaluations[index].dateEvaluationStart,
                    dateEvaluationEnd: periodEvaluations[index].dateEvaluationEnd,
                    isActive: arrayPeriodIndexs.includes(periodEvaluations[index].id),
                    childrens: childrens.sort((a, b) => {
                        const dateA = new Date(a.periodStart);
                        const dateB = new Date(b.periodStart);
                        if (dateA < dateB) {
                            return 1;
                        }
                        if (dateA > dateB) {
                            return -1;
                        }
                        return 0;
                    }),
                    userInfo: periodEvaluations[index].evaluations[0].user,
                });
            }
        }
        const length = await this.userRepo.getLengthEvaluationPeriod(query, userId, companyGroupCode);
        return {
            data: arrays,
            counts: length,
        };
    }
    async evaluationSkillCheck(evaluationId) {
        const data = await this.userRepo.evaluationSkillCheck(evaluationId);
        if (!data)
            throw new RuntimeException_1.RuntimeException('id not found', common_1.HttpStatus.AMBIGUOUS);
        return data;
    }
    async getEvaluationData(evaluationId, user, isEvaluatorUser, companyGroupCode, timeZone) {
        var _a, _b;
        const isUser = isEvaluatorUser === 'true';
        const dataFlagSkill = await this.userRepo.evaluationSkillCheck(evaluationId);
        if (!dataFlagSkill)
            throw new RuntimeException_1.RuntimeException('id not found', common_1.HttpStatus.AMBIGUOUS);
        const flagSkill = dataFlagSkill.flagSkill;
        if (flagSkill !== 1) {
            return await this.getEvaluationV2(evaluationId, user, isEvaluatorUser, companyGroupCode, timeZone);
        }
        const { evaluationDetail, evaluationAchievementPersonals } = await this.userRepo.getEvaluationById2(evaluationId, user.id, isUser, companyGroupCode);
        const evaluatorOrder = evaluationDetail === null || evaluationDetail === void 0 ? void 0 : evaluationDetail.evaluatorOrder;
        const evaluatorOrderList = [];
        const comment = {
            comment05Public: '',
            comment05Private: '',
            comment1Public: '',
            comment1Private: '',
            comment2Public: '',
            comment2Private: '',
        };
        if (evaluationDetail) {
            const evaluators = [];
            if (evaluationDetail.evaluator && evaluationDetail.evaluator.length > 0) {
                const arrays = evaluationDetail.evaluator;
                for (const item of arrays) {
                    if (Number(item.evaluationOrder) === 0.5) {
                        comment.comment05Public = item.commentPublic;
                        comment.comment05Private = item.commentPrivate;
                        evaluators.push(`仮評価: ${item.user.fullName}`);
                    }
                    else if (Number(item.evaluationOrder) === 1) {
                        comment.comment1Public = item.commentPublic;
                        comment.comment1Private = item.commentPrivate;
                        evaluators.push(`一次評価: ${item.user.fullName}`);
                    }
                    else if (Number(item.evaluationOrder) === 2) {
                        comment.comment2Public = item.commentPublic;
                        comment.comment2Private = item.commentPrivate;
                        evaluators.push(`二次評価: ${item.user.fullName}`);
                    }
                    evaluatorOrderList.push(Number(item.evaluationOrder));
                }
            }
            const isEvaluationDate = (0, util_1.compareDatePeriod)(evaluationDetail.dateEvaluationStart ||
                ((_a = evaluationDetail.evaluationPeriod) === null || _a === void 0 ? void 0 : _a.dateEvaluationStart), evaluationDetail.dateEvaluationEnd ||
                ((_b = evaluationDetail.evaluationPeriod) === null || _b === void 0 ? void 0 : _b.dateEvaluationEnd), timeZone);
            const isEvaluation = [
                51, 52, 53, 54, 56, 57, 58, 59, 55, 58, 59, 60, 61, 98, 99, 100,
            ].includes(evaluationDetail.status) ||
                (evaluationDetail.status === 50 && isEvaluationDate);
            const userEvaluationToProSkills = {
                proSkillList: evaluationDetail.evaluationPro,
                keyPassProSkill: [],
            };
            let totalPointProSkillUser = 0;
            if (evaluationDetail.evaluationPro) {
                evaluationDetail.evaluationPro.map((v) => {
                    totalPointProSkillUser = totalPointProSkillUser + v.pointUser || 0;
                    userEvaluationToProSkills.keyPassProSkill.push(v.itemId);
                });
            }
            const userEvaluationAchievements = evaluationAchievementPersonals;
            const evaluationBasicSkills = evaluationDetail.evaluationBasic;
            const evaluationBehaviorSkills = evaluationDetail.evaluationBehavior;
            let pointUserBasicSkill = 0;
            let pointUserBehavior = 0;
            evaluationBasicSkills.map((v, i) => {
                pointUserBasicSkill = pointUserBasicSkill + v.pointUser || 0;
            }),
                evaluationBehaviorSkills.map((v, i) => {
                    pointUserBehavior = pointUserBehavior + v.pointUser || 0;
                });
            const achievementAdditionals = [];
            if (evaluationDetail.evaluationAchievementAdditional.length > 0) {
                achievementAdditionals.push(...evaluationDetail.evaluationAchievementAdditional.map((v, i) => ({
                    key: `achievement-additional-key-${i}`,
                    itemNo: v.itemNo,
                    titleAdditional: v.titleAdditional,
                    achievementStatus: v.achievementStatus,
                    reasonComment: v.reasonComment,
                    pointUser: v.pointUser,
                    pointEvaluator05: v.pointEvaluator05,
                    pointEvaluator1: v.pointEvaluator1,
                    pointEvaluator2: v.pointEvaluator2,
                    evaluationOrder: v.evaluationOrder,
                })));
            }
            if (isEvaluation && evaluatorOrderList.includes(2)) {
                userEvaluationToProSkills.proSkillList.push({
                    itemId: null,
                    itemTitle: '小計',
                    itemNo: -1,
                    content: null,
                    difficulty: null,
                    pointEvaluator1: evaluationDetail.proTotalPointEvaluator1,
                    pointEvaluator2: evaluationDetail.proTotalPointEvaluator2,
                    pointEvaluator05: evaluationDetail.proTotalPointEvaluator05,
                    pointUser: evaluationDetail.proTotalPointUser,
                    totalPointProSkillUser,
                    key: `evaluation-pro-skill-totalPointProSkillUser`,
                });
                evaluationBasicSkills.push({
                    title: '小計',
                    content: null,
                    difficulty: null,
                    key: `basic-1-key-pointUserBasicSkill`,
                    itemNo: -1,
                    pointUser: evaluationDetail.basicTotalPointUser,
                    pointEvaluator05: evaluationDetail.basicTotalPointEvaluator05,
                    pointEvaluator1: evaluationDetail.basicTotalPointEvaluator1,
                    pointEvaluator2: evaluationDetail.basicTotalPointEvaluator2,
                });
                evaluationBehaviorSkills.push({
                    title: '小計',
                    content: null,
                    difficulty: null,
                    key: `basic-1-key-pointUserBehavior`,
                    itemNo: -1,
                    pointUser: evaluationDetail.behaviorTotalPointUser,
                    pointEvaluator05: evaluationDetail.behaviorTotalPointEvaluator05,
                    pointEvaluator1: evaluationDetail.behaviorTotalPointEvaluator1,
                    pointEvaluator2: evaluationDetail.behaviorTotalPointEvaluator2,
                });
                userEvaluationAchievements.push({
                    key: 0,
                    itemNo: null,
                    title: null,
                    achievementValue: null,
                    method: null,
                    weight: null,
                    difficultyUser: null,
                    difficultyEvaluator05: null,
                    difficultyEvaluator1: null,
                    difficultyEvaluator2: null,
                    achievementStatus: '小計',
                    reasonComment: null,
                    actionPlan: null,
                    pointUser: evaluationDetail.achievementPersonalTotalPointUser,
                    pointEvaluator05: evaluationDetail.achievementPersonalTotalPointEvaluator05,
                    pointEvaluator1: evaluationDetail.achievementPersonalTotalPointEvaluator1,
                    pointEvaluator2: evaluationDetail.achievementPersonalTotalPointEvaluator2,
                    coefficientUser: null,
                    coefficientEvaluator05: null,
                    coefficientEvaluator1: null,
                    coefficientEvaluator2: null,
                    childrens: [],
                });
            }
            let achievementAdditionalSetting = [];
            if (evaluationDetail.status >= 50)
                achievementAdditionalSetting =
                    await this.userRepo.getAchievementAddPublicByType('1', 1, user.companyGroupCode);
            const data = Object.assign(Object.assign({ fiscalYear: evaluationDetail.title, periodStart: evaluationDetail.periodStart, periodEnd: evaluationDetail.periodEnd, flagSkill: evaluationDetail.flagSkill, evaluationLevel: evaluationDetail.level || user.level, evaluators, statusName: statusEvaluation_1.statusEvaluation[evaluationDetail.status], status: evaluationDetail.status, department: evaluationDetail.departmentName ||
                    `${user.departmentCode}: ${user.departmentName}`, employeeNumber: evaluationDetail.user.employeeNumber, fullName: evaluationDetail.user.fullName || user.fullName, guideVersionId: evaluationDetail.guideVersionId, evaluatorOrder,
                evaluatorOrderList, commentUser: evaluationDetail.commentUser, basicTotalPointUser: evaluationDetail.basicTotalPointUser, proTotalPointUser: evaluationDetail.proTotalPointUser, behaviorTotalPointUser: evaluationDetail.behaviorTotalPointUser, achievementPersonalTotalPointUser: evaluationDetail.achievementPersonalTotalPointUser, achievementAdditionalTotalPointUser: evaluationDetail.achievementAdditionalTotalPointUser, basicTotalPointEvaluator05: evaluationDetail.basicTotalPointEvaluator05, proTotalPointEvaluator05: evaluationDetail.proTotalPointEvaluator05, behaviorTotalPointEvaluator05: evaluationDetail.behaviorTotalPointEvaluator05, achievementAdditionalTotalPointEvaluator05: evaluationDetail.achievementAdditionalTotalPointEvaluator05, achievementPersonalTotalPointEvaluator05: evaluationDetail.achievementPersonalTotalPointEvaluator05, basicTotalPointEvaluator1: evaluationDetail.basicTotalPointEvaluator1, proTotalPointEvaluator1: evaluationDetail.proTotalPointEvaluator1, behaviorTotalPointEvaluator1: evaluationDetail.behaviorTotalPointEvaluator1, achievementAdditionalTotalPointEvaluator1: evaluationDetail.achievementAdditionalTotalPointEvaluator1, achievementPersonalTotalPointEvaluator1: evaluationDetail.achievementPersonalTotalPointEvaluator1, basicTotalPointEvaluator2: evaluationDetail.basicTotalPointEvaluator2, proTotalPointEvaluator2: evaluationDetail.proTotalPointEvaluator2, behaviorTotalPointEvaluator2: evaluationDetail.behaviorTotalPointEvaluator2, achievementAdditionalTotalPointEvaluator2: evaluationDetail.achievementAdditionalTotalPointEvaluator2, achievementPersonalTotalPointEvaluator2: evaluationDetail.achievementPersonalTotalPointEvaluator2, pointSettingLevel: {
                    key: 'point-setting-level-key-1',
                    skillPercent: evaluationDetail.skillPercent,
                    behaviorPercent: evaluationDetail.behaviorPercent,
                    achievementPercent: evaluationDetail.achievementPercent,
                    percentPoint: evaluationDetail.percentPoint,
                } }, userEvaluationToProSkills), { userEvaluationAchievements, dateCreationGoalStart: evaluationDetail.dateCreationGoalStart, dateCreationGoalEnd: evaluationDetail.dateCreationGoalEnd, dateEvaluationStart: evaluationDetail.dateEvaluationStart, dateEvaluationEnd: evaluationDetail.dateEvaluationEnd, evaluationPeriod: evaluationDetail.evaluationPeriod, evaluationBasicSkills,
                evaluationBehaviorSkills,
                achievementAdditionals,
                comment, updateTime: evaluationDetail.updatedTime.toISOString(), basicProTotalPointUser: evaluationDetail.basicProTotalPointUser, basicProTotalPointEvaluator05: evaluationDetail.basicProTotalPointEvaluator05, basicProTotalPointEvaluator1: evaluationDetail.basicProTotalPointEvaluator1, basicProTotalPointEvaluator2: evaluationDetail.basicProTotalPointEvaluator2, summaryPointUser: evaluationDetail.summaryPointUser || 0, summaryPointEvaluator05: evaluationDetail.summaryPointEvaluator05 || 0, summaryPointEvaluator1: evaluationDetail.summaryPointEvaluator1 || 0, summaryPointEvaluator2: evaluationDetail.summaryPointEvaluator2 || 0, achievementAdditionalSetting: achievementAdditionalSetting });
            const historyApproveEvaluation = evaluationDetail.historyApproveEvaluations;
            if (historyApproveEvaluation &&
                [2, 4, 6, 8, 52, 55, 58, 61].includes(evaluationDetail.status)) {
                const comment = historyApproveEvaluation.comment;
                if (Number(historyApproveEvaluation.receiverOrder) === 0) {
                    data.historyApproveEvaluation = comment;
                }
                else if (Number(historyApproveEvaluation.receiverOrder) === 0.5 &&
                    evaluatorOrder >= 0.5) {
                    data.historyApproveEvaluation = comment;
                }
                else if (Number(historyApproveEvaluation.receiverOrder) === 1 &&
                    evaluatorOrder >= 1) {
                    data.historyApproveEvaluation = comment;
                }
                else if (Number(historyApproveEvaluation.receiverOrder) === 2 &&
                    evaluatorOrder >= 2) {
                    data.historyApproveEvaluation = comment;
                }
                else if (evaluatorOrder === undefined || evaluatorOrder === null)
                    data.historyApproveEvaluation = comment;
            }
            if ([51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 98, 99, 100].includes(evaluationDetail.status) ||
                (evaluationDetail.status === 50 && isEvaluationDate)) {
                const pointBasicSkills = await this.pointRepo.getPointSkill(1, user.companyGroupCode);
                const pointBehaviorSkills = await this.pointRepo.getPointSkill(2, user.companyGroupCode);
                const pointProSkills = await this.pointRepo.getPointSkill(3, user.companyGroupCode);
                const settingProFormulas = await this.userRepo.getSettingProFormulaPublic(user.companyGroupCode);
                const getBasicBehaviorProPointOption = await this.evaluation17Service.getBasicBehaviorProOptionPublic(user.companyGroupCode);
                const { maxPointBasicSkill, maxPointProSkill } = await this.evaluation17Service.getMaxPointProBasicSkillPublic(user.companyGroupCode);
                data.settingProFormulas = settingProFormulas;
                data.basicSkillPointOptions =
                    getBasicBehaviorProPointOption.basicSkillPointOptions;
                data.behaviorSkillPointOptions =
                    getBasicBehaviorProPointOption.behaviorSkillPointOptions;
                data.proSkillPointOptions =
                    getBasicBehaviorProPointOption.proSkillPointOptions;
                data.pointProSkills = pointProSkills;
                data.pointBehaviorSkills = pointBehaviorSkills;
                data.pointBasicSkills = pointBasicSkills;
                data.maxPointBasicSkill = maxPointBasicSkill;
                data.maxPointProSkill = maxPointProSkill;
            }
            if (evaluationDetail.status >= 50) {
                const versionSetting = await this.versionSettingRepository.getVersionSrtting17(evaluationDetail === null || evaluationDetail === void 0 ? void 0 : evaluationDetail.flagSkill, user.companyGroupCode);
                data.versionSetting = versionSetting;
            }
            if (!evaluatorOrderList.includes(2)) {
                data.isNotEvaluator2 = true;
            }
            const stringData = JSON.stringify(data);
            const encode = (0, util_1.encrypt)(stringData, true);
            return encode;
        }
        return null;
    }
    async getEvaluationV2(evaluationId, user, isEvaluatorUser, companyGroupCode, timeZone) {
        var _a, _b;
        const isUser = isEvaluatorUser === 'true';
        const { evaluationDetail, evaluationAchievementPersonals } = await this.userRepo.getEvaluationByIdV2(evaluationId, user.id, isUser, companyGroupCode);
        if ((evaluationDetail === null || evaluationDetail === void 0 ? void 0 : evaluationDetail.flagSkill) !== 0) {
            return await this.getEvaluationData(evaluationId, user, isEvaluatorUser, companyGroupCode, timeZone);
        }
        let evaluatorOrder = 0;
        let isEvaluatorException = false;
        const evaluatorOrderList = [];
        if (!isUser) {
            const evaluators = evaluationDetail.evaluator;
            const findEvaluator = evaluators.find((f) => f.evaluatorId === user.id);
            if (!findEvaluator)
                isEvaluatorException = true;
            evaluatorOrder = findEvaluator === null || findEvaluator === void 0 ? void 0 : findEvaluator.evaluationOrder;
        }
        const comment = {
            comment05Public: '',
            comment05Private: '',
            comment1Public: '',
            comment1Private: '',
            comment2Public: '',
            comment2Private: '',
        };
        if (evaluationDetail) {
            const evaluators = [];
            const evaluatorDefault = await this.userRepo.getEvaluatorDefault(evaluationDetail.user.id, evaluationDetail.evaluationPeriodId);
            if (evaluationDetail.user.active !== 1 || !evaluatorDefault) {
                isEvaluatorException = true;
            }
            if (evaluationDetail.evaluator && evaluationDetail.evaluator.length > 0) {
                const arrays = evaluationDetail.evaluator.sort((a, b) => a.evaluationOrder - b.evaluationOrder);
                for (const item of arrays) {
                    if (Number(item.evaluationOrder) === 0.5) {
                        comment.comment05Public = item.commentPublic;
                        comment.comment05Private = item.commentPrivate;
                        evaluators.push(`仮評価: ${item.user.fullName}`);
                    }
                    else if (Number(item.evaluationOrder) === 1) {
                        comment.comment1Public = item.commentPublic;
                        comment.comment1Private = item.commentPrivate;
                        evaluators.push(`一次評価: ${item.user.fullName}`);
                    }
                    else if (Number(item.evaluationOrder) === 2) {
                        comment.comment2Public = item.commentPublic;
                        comment.comment2Private = item.commentPrivate;
                        evaluators.push(`二次評価: ${item.user.fullName}`);
                    }
                    evaluatorOrderList.push(Number(item.evaluationOrder));
                }
            }
            const isEvaluationDate = (0, util_1.compareDatePeriod)(evaluationDetail.dateEvaluationStart ||
                ((_a = evaluationDetail.evaluationPeriod) === null || _a === void 0 ? void 0 : _a.dateEvaluationStart), evaluationDetail.dateEvaluationEnd ||
                ((_b = evaluationDetail.evaluationPeriod) === null || _b === void 0 ? void 0 : _b.dateEvaluationEnd), timeZone);
            const isEvaluation = [
                51, 52, 53, 54, 56, 57, 58, 59, 55, 58, 59, 60, 61, 98, 99, 100,
            ].includes(evaluationDetail.status) ||
                (evaluationDetail.status === 50 && isEvaluationDate);
            const userEvaluationAchievements = evaluationAchievementPersonals.map((v) => (Object.assign({}, v)));
            const evaluationBehaviorSkills = [];
            let pointUserBehavior = 0;
            if (evaluationDetail.evaluationBasicBehavior.length > 0) {
                const arrays = evaluationDetail.evaluationBasicBehavior;
                evaluationBehaviorSkills.push(...arrays
                    .filter((f) => f.type === 3)
                    .map((v, i) => {
                    pointUserBehavior = pointUserBehavior + v.pointUser || 0;
                    return {
                        itemNo: v.itemNo,
                        pointUser: v.pointUser,
                        title: v.itemTitle,
                        content: v.content,
                        difficulty: v.difficulty,
                        key: `behavior-2-key-${i}`,
                        pointEvaluator05: v.pointEvaluator05,
                        pointEvaluator1: v.pointEvaluator1,
                        pointEvaluator2: v.pointEvaluator2,
                    };
                }));
            }
            const achievementAdditionals = [];
            if (evaluationDetail.evaluationAchievementAdditional.length > 0) {
                achievementAdditionals.push(...evaluationDetail.evaluationAchievementAdditional.map((v, i) => ({
                    key: `achievement-additional-key-${i}`,
                    itemNo: v.itemNo,
                    titleAdditional: v.titleAdditional,
                    achievementStatus: v.achievementStatus,
                    reasonComment: v.reasonComment,
                    pointUser: v.pointUser,
                    pointEvaluator05: v.pointEvaluator05,
                    pointEvaluator1: v.pointEvaluator1,
                    pointEvaluator2: v.pointEvaluator2,
                    evaluationOrder: v.evaluationOrder,
                })));
            }
            if (isEvaluation && evaluatorOrderList.includes(2)) {
                evaluationBehaviorSkills.push({
                    title: '小計',
                    content: null,
                    difficulty: null,
                    key: `basic-1-key-pointUserBehavior`,
                    itemNo: -1,
                    pointUser: evaluationDetail.behaviorTotalPointUser,
                    pointEvaluator05: evaluationDetail.behaviorTotalPointEvaluator05,
                    pointEvaluator1: evaluationDetail.behaviorTotalPointEvaluator1,
                    pointEvaluator2: evaluationDetail.behaviorTotalPointEvaluator2,
                });
                userEvaluationAchievements.push({
                    key: 0,
                    itemNo: null,
                    title: null,
                    achievementValue: null,
                    method: null,
                    weight: null,
                    difficultyUser: null,
                    difficultyEvaluator05: null,
                    difficultyEvaluator1: null,
                    difficultyEvaluator2: null,
                    achievementStatus: '小計',
                    reasonComment: null,
                    actionPlan: null,
                    pointUser: evaluationDetail.achievementPersonalTotalPointUser,
                    pointEvaluator05: evaluationDetail.achievementPersonalTotalPointEvaluator05,
                    pointEvaluator1: evaluationDetail.achievementPersonalTotalPointEvaluator1,
                    pointEvaluator2: evaluationDetail.achievementPersonalTotalPointEvaluator2,
                    coefficientUser: null,
                    coefficientEvaluator05: null,
                    coefficientEvaluator1: null,
                    coefficientEvaluator2: null,
                    childrens: [],
                });
            }
            const findRejectCondition = {
                evaluationId: evaluationId,
                type: 0,
                receiverOrder: '',
                status: '',
            };
            switch (evaluationDetail.status) {
                case 2:
                    findRejectCondition.type = 0;
                    findRejectCondition.receiverOrder = '0.0';
                    findRejectCondition.status = '被評価者へ差戻';
                    break;
                case 4:
                    findRejectCondition.type = 0;
                    findRejectCondition.receiverOrder = '0.5';
                    findRejectCondition.status = '仮評価者へ差戻';
                    break;
                case 6:
                    findRejectCondition.type = 0;
                    findRejectCondition.receiverOrder = '1.0';
                    findRejectCondition.status = '一次評価者へ差戻';
                    break;
                case 8:
                    findRejectCondition.type = 0;
                    findRejectCondition.receiverOrder = '2.0';
                    findRejectCondition.status = '二次評価者へ差戻';
                    break;
                case 52:
                    findRejectCondition.type = 1;
                    findRejectCondition.receiverOrder = '0.0';
                    findRejectCondition.status = '被評価者へ差戻';
                    break;
                case 55:
                    findRejectCondition.type = 1;
                    findRejectCondition.receiverOrder = '0.5';
                    findRejectCondition.status = '仮評価者へ差戻';
                    break;
                case 58:
                    findRejectCondition.type = 1;
                    findRejectCondition.receiverOrder = '1.0';
                    findRejectCondition.status = '一次評価者へ差戻';
                    break;
                case 61:
                    findRejectCondition.type = 1;
                    findRejectCondition.receiverOrder = '2.0';
                    findRejectCondition.status = '二次評価者へ差戻';
                    break;
                default:
                    findRejectCondition.receiverOrder = '3.0';
                    break;
            }
            let rejectComment = null;
            if (findRejectCondition.receiverOrder !== '3.0') {
                const approvalList = await this.approvalRepository.getApprovalHistory(findRejectCondition);
                rejectComment = approvalList[0];
            }
            const data = {
                fiscalYear: evaluationDetail.title,
                periodStart: evaluationDetail.periodStart,
                periodEnd: evaluationDetail.periodEnd,
                flagSkill: evaluationDetail.flagSkill,
                evaluationLevel: evaluationDetail.level || user.level,
                evaluators,
                statusName: statusEvaluation_1.statusEvaluation[evaluationDetail.status],
                status: evaluationDetail.status,
                department: evaluationDetail.departmentName ||
                    `${user.departmentCode}: ${user.departmentName}`,
                employeeNumber: evaluationDetail.user.employeeNumber,
                fullName: evaluationDetail.user.fullName || user.fullName,
                guideVersionId: evaluationDetail.guideVersionId,
                evaluatorOrder,
                evaluatorOrderList,
                commentUser: evaluationDetail.commentUser,
                basicTotalPointUser: evaluationDetail.basicTotalPointUser,
                proTotalPointUser: evaluationDetail.proTotalPointUser,
                behaviorTotalPointUser: evaluationDetail.behaviorTotalPointUser,
                achievementPersonalTotalPointUser: evaluationDetail.achievementPersonalTotalPointUser,
                achievementAdditionalTotalPointUser: evaluationDetail.achievementAdditionalTotalPointUser,
                basicTotalPointEvaluator05: evaluationDetail.basicTotalPointEvaluator05,
                proTotalPointEvaluator05: evaluationDetail.proTotalPointEvaluator05,
                behaviorTotalPointEvaluator05: evaluationDetail.behaviorTotalPointEvaluator05,
                achievementAdditionalTotalPointEvaluator05: evaluationDetail.achievementAdditionalTotalPointEvaluator05,
                achievementPersonalTotalPointEvaluator05: evaluationDetail.achievementPersonalTotalPointEvaluator05,
                basicTotalPointEvaluator1: evaluationDetail.basicTotalPointEvaluator1,
                proTotalPointEvaluator1: evaluationDetail.proTotalPointEvaluator1,
                behaviorTotalPointEvaluator1: evaluationDetail.behaviorTotalPointEvaluator1,
                achievementAdditionalTotalPointEvaluator1: evaluationDetail.achievementAdditionalTotalPointEvaluator1,
                achievementPersonalTotalPointEvaluator1: evaluationDetail.achievementPersonalTotalPointEvaluator1,
                basicTotalPointEvaluator2: evaluationDetail.basicTotalPointEvaluator2,
                proTotalPointEvaluator2: evaluationDetail.proTotalPointEvaluator2,
                behaviorTotalPointEvaluator2: evaluationDetail.behaviorTotalPointEvaluator2,
                achievementAdditionalTotalPointEvaluator2: evaluationDetail.achievementAdditionalTotalPointEvaluator2,
                achievementPersonalTotalPointEvaluator2: evaluationDetail.achievementPersonalTotalPointEvaluator2,
                pointSettingLevel: {
                    key: 'point-setting-level-key-1',
                    behaviorPercent: evaluationDetail.behaviorPercent,
                    achievementPercent: evaluationDetail.achievementPercent,
                    percentPoint: evaluationDetail.percentPoint,
                },
                userEvaluationAchievements,
                dateCreationGoalStart: evaluationDetail.dateCreationGoalStart,
                dateCreationGoalEnd: evaluationDetail.dateCreationGoalEnd,
                dateEvaluationStart: evaluationDetail.dateEvaluationStart,
                dateEvaluationEnd: evaluationDetail.dateEvaluationEnd,
                evaluationPeriod: evaluationDetail.evaluationPeriod,
                evaluationBehaviorSkills,
                achievementAdditionals,
                comment,
                isEvaluatorException,
                updateTime: evaluationDetail.updatedTime.toISOString(),
                basicProTotalPointUser: evaluationDetail.basicProTotalPointUser,
                basicProTotalPointEvaluator05: evaluationDetail.basicProTotalPointEvaluator05,
                basicProTotalPointEvaluator1: evaluationDetail.basicProTotalPointEvaluator1,
                basicProTotalPointEvaluator2: evaluationDetail.basicProTotalPointEvaluator2,
                summaryPointUser: evaluationDetail.summaryPointUser || 0,
                summaryPointEvaluator05: evaluationDetail.summaryPointEvaluator05 || 0,
                summaryPointEvaluator1: evaluationDetail.summaryPointEvaluator1 || 0,
                summaryPointEvaluator2: evaluationDetail.summaryPointEvaluator2 || 0,
                rejectComment,
            };
            const historyApproveEvaluation = null;
            if (historyApproveEvaluation &&
                [2, 4, 6, 8, 52, 55, 58, 61].includes(evaluationDetail.status)) {
                const comment = historyApproveEvaluation.comment;
                if (Number(historyApproveEvaluation.receiverOrder) === 0) {
                    data.historyApproveEvaluation = comment;
                }
                else if (Number(historyApproveEvaluation.receiverOrder) === 0.5 &&
                    evaluatorOrder >= 0.5) {
                    data.historyApproveEvaluation = comment;
                }
                else if (Number(historyApproveEvaluation.receiverOrder) === 1 &&
                    evaluatorOrder >= 1) {
                    data.historyApproveEvaluation = comment;
                }
                else if (Number(historyApproveEvaluation.receiverOrder) === 2 &&
                    evaluatorOrder >= 2) {
                    data.historyApproveEvaluation = comment;
                }
                else if (evaluatorOrder === undefined)
                    data.historyApproveEvaluation = comment;
            }
            if ([51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61].includes(evaluationDetail.status) ||
                (evaluationDetail.status === 50 && isEvaluationDate)) {
                const pointBehaviorSkills = await this.pointRepo.getPointSkill(3, user.companyGroupCode);
                const settingProFormulas = await this.userRepo.getSettingProFormulaPublic(user.companyGroupCode);
                const getBasicBehaviorProPointOption = await this.evaluation17Service.getBasicBehaviorProOptionPublic(user.companyGroupCode, true);
                data.settingProFormulas = settingProFormulas;
                data.basicSkillPointOptions =
                    getBasicBehaviorProPointOption.basicSkillPointOptions;
                data.behaviorSkillPointOptions =
                    getBasicBehaviorProPointOption.behaviorSkillPointOptions;
                data.proSkillPointOptions =
                    getBasicBehaviorProPointOption.proSkillPointOptions;
                data.pointBehaviorSkills = pointBehaviorSkills;
            }
            if (evaluationDetail.status >= 50) {
                const versionSetting = await this.versionSettingRepository.getVersionSrtting17(evaluationDetail === null || evaluationDetail === void 0 ? void 0 : evaluationDetail.flagSkill, user.companyGroupCode);
                data.versionSetting = versionSetting;
                data.achievementAdditionalSetting =
                    versionSetting.settingAchievementAdditional;
            }
            if (!evaluatorOrderList.includes(2)) {
                data.isNotEvaluator2 = true;
            }
            const stringData = JSON.stringify(data);
            const encode = (0, util_1.encrypt)(stringData, true);
            return encode;
        }
    }
    async getListProSkillPublic(user, evaluationId) {
        const results = [];
        const versionProSkills = await this.userRepo.getProSkillPublicList(user.departmentId, user.divisionId, user.companyGroupCode, evaluationId);
        versionProSkills.map((v, versionIndex) => {
            results.push(...v.listProSkills.map((pro, i) => ({
                itemId: `${pro.itemId}_${versionIndex}_${i}`,
                smallClass: pro.smallClass,
                mediumClass: pro.mediumClass,
                content: pro.content,
                difficulty: pro.difficulty,
                note: pro.note,
                jobType: pro.jobType,
                key: `${pro.itemId}_${versionIndex}_${i}`,
            })));
        });
        return results;
    }
    async getListProSkillPublicInMenu(user) {
        const versionProSkills = await this.userRepo.getProSkillPublicListInMenu(user.id, user.companyGroupCode, user.timeZone);
        return {
            departmentName: versionProSkills.depDivName,
            listProSkills: versionProSkills.results,
        };
    }
    async updateEvaluation(evaluationId, user, data, host, timeZone) {
        const { isSubmit, proTotalPointUser, basicTotalPointUser, behaviorTotalPointUser, achievementPersonalTotalPointUser, achievementAdditionalTotalPointUser, basicTotalPointEvaluator05, proTotalPointEvaluator05, behaviorTotalPointEvaluator05, achievementAdditionalTotalPointEvaluator05, achievementPersonalTotalPointEvaluator05, basicTotalPointEvaluator1, proTotalPointEvaluator1, behaviorTotalPointEvaluator1, achievementAdditionalTotalPointEvaluator1, achievementPersonalTotalPointEvaluator1, basicTotalPointEvaluator2, proTotalPointEvaluator2, behaviorTotalPointEvaluator2, achievementAdditionalTotalPointEvaluator2, achievementPersonalTotalPointEvaluator2, commentUser, isEvaluatorUser, comment05Public, comment05Private, comment1Public, comment1Private, comment2Public, comment2Private, updateTime, basicProTotalPointUser, basicProTotalPointEvaluator05, basicProTotalPointEvaluator1, basicProTotalPointEvaluator2, achievementSubs, } = data;
        let selectedOrder = '';
        const evaluation = await this.userRepo.getIdEvaluation(user.id, evaluationId, isEvaluatorUser);
        const versionSetting = await this.versionSettingRepository.getVersionSrtting17(evaluation === null || evaluation === void 0 ? void 0 : evaluation.flagSkill, user.companyGroupCode);
        const minPoint = (versionSetting === null || versionSetting === void 0 ? void 0 : versionSetting.minPoint) || 0;
        const maxPoint = (versionSetting === null || versionSetting === void 0 ? void 0 : versionSetting.maxPoint) || 100;
        const compareProSkills = data.listProSkillData.filter((v) => v.isDisable === true);
        const dates = new Date((0, util_1.isFormatDate)(new Date(), 'YYYY-M-D HH:mm:ss', timeZone));
        const updateValue = {
            evaluationId: evaluationId,
            comment: evaluation.flagSkill === 1
                ? evaluation.status < 50
                    ? ''
                    : compareProSkills.length > 0
                        ? JSON.stringify(compareProSkills)
                        : 'MESSAGE.COMMON.IDS_PRO_SKILL_ALL_EVALUATE'
                : '',
            approverId: user.id,
            receiverId: null,
            receiverOrder: 0,
            type: evaluation.status < 50 ? 0 : 1,
            status: 'IDS_BUTTON_SUBMIT',
        };
        if (!isEvaluatorUser) {
            const evaluators = evaluation.evaluator;
            const findEvaluator = evaluators.find((f) => f.evaluatorId === user.id);
            if (!findEvaluator)
                throw new RuntimeException_1.RuntimeException('Not found evaluation id', 500);
            if (Number(findEvaluator.evaluationOrder) === 0.5) {
                findEvaluator.commentPublic = comment05Public;
                findEvaluator.commentPrivate = comment05Private;
                findEvaluator.save();
            }
            if (Number(findEvaluator.evaluationOrder) === 1) {
                findEvaluator.commentPublic = comment1Public;
                findEvaluator.commentPrivate = comment1Private;
                findEvaluator.save();
            }
            if (Number(findEvaluator.evaluationOrder) === 2) {
                findEvaluator.commentPublic = comment2Public;
                findEvaluator.commentPrivate = comment2Private;
                findEvaluator.save();
            }
            updateValue.comment = '';
            updateValue.status = 'IDS_EVALUATOR_EVALUATE';
        }
        if (!evaluation || !evaluation.id)
            throw new RuntimeException_1.RuntimeException('Not found evaluation id', 500);
        if (evaluation.user.active !== 1)
            throw new RuntimeException_1.RuntimeException('User is deleted', 500);
        if (updateTime !== evaluation.updatedTime.toISOString())
            throw new RuntimeException_1.RuntimeException('Evaluation is duplicate', 409);
        const evaluatorDefault = await this.userRepo.getEvaluatorDefault(evaluation.user.id, evaluation.evaluationPeriodId);
        if (evaluation.user.active !== 1 || !evaluatorDefault) {
            throw new RuntimeException_1.RuntimeException('Evaluation is duplicate', 409);
        }
        let isEdit = false;
        const transaction = await this.userRepo.getNewTransaction();
        try {
            if (data.listProSkillData) {
                await this.userRepo
                    .updateEvaluationProSkill(evaluationId, data.listProSkillData, transaction)
                    .then(() => (isEdit = true));
            }
            if (data.achievementDatas)
                data.achievementDatas.map((v) => {
                    v.type = 1;
                    return v;
                });
            await this.userRepo
                .updateEvaluationAchievement(evaluationId, data.achievementDatas, achievementSubs, evaluation.status, transaction)
                .then(() => (isEdit = true));
            if (data.achievementAdditionals) {
                await this.userRepo.updateEvaluationAchievementAdditional(evaluationId, data.achievementAdditionals, transaction);
            }
            if (data.evaluationBasicSkills.length > 0)
                await this.userRepo.updateEvaluationBasicOrBehaviorSkill(evaluationId, data.evaluationBasicSkills, '1', transaction);
            if (data.evaluationBehaviorSkills.length > 0)
                await this.userRepo.updateEvaluationBasicOrBehaviorSkill(evaluationId, data.evaluationBehaviorSkills, evaluation.flagSkill === 1 ? '2' : '3', transaction);
            if (evaluation.achievementAdditionalTotalPointUser !=
                achievementAdditionalTotalPointUser ||
                [50, 51, 52].includes(evaluation.status)) {
                const summaryPointUser = Math.round((Number(basicProTotalPointUser !== null &&
                    basicProTotalPointUser !== undefined
                    ? basicProTotalPointUser
                    : 0) *
                    (evaluation.skillPercent || 0) +
                    Number(behaviorTotalPointUser !== null &&
                        behaviorTotalPointUser !== undefined
                        ? behaviorTotalPointUser
                        : 0) *
                        (evaluation.behaviorPercent || 0) +
                    Math.round(Number(achievementPersonalTotalPointUser !== null &&
                        achievementPersonalTotalPointUser !== undefined
                        ? achievementPersonalTotalPointUser
                        : 0)) *
                        (evaluation.achievementPercent || 0)) /
                    100 +
                    Number(achievementAdditionalTotalPointUser !== null &&
                        achievementAdditionalTotalPointUser !== undefined
                        ? achievementAdditionalTotalPointUser
                        : 0));
                evaluation.summaryPointUser =
                    (basicProTotalPointUser !== null &&
                        basicProTotalPointUser !== undefined) ||
                        (behaviorTotalPointUser !== null &&
                            behaviorTotalPointUser !== undefined) ||
                        (achievementPersonalTotalPointUser !== null &&
                            achievementPersonalTotalPointUser !== undefined) ||
                        (achievementAdditionalTotalPointUser !== null &&
                            achievementAdditionalTotalPointUser !== undefined)
                        ? Math.min(Math.max(Math.floor(summaryPointUser), minPoint), maxPoint)
                        : null;
            }
            if ([50, 51, 52].includes(evaluation.status)) {
                evaluation.behaviorTotalPointUser = behaviorTotalPointUser;
                evaluation.achievementPersonalTotalPointUser =
                    achievementPersonalTotalPointUser &&
                        Math.round(achievementPersonalTotalPointUser);
                evaluation.proTotalPointUser =
                    proTotalPointUser && Math.round(proTotalPointUser);
                evaluation.basicTotalPointUser = basicTotalPointUser;
                evaluation.achievementAdditionalTotalPointUser =
                    achievementAdditionalTotalPointUser;
                evaluation.basicProTotalPointUser = basicProTotalPointUser;
                evaluation.commentUser = commentUser;
            }
            if (evaluation.achievementAdditionalTotalPointEvaluator05 !=
                achievementAdditionalTotalPointEvaluator05 ||
                [53, 54, 55].includes(evaluation.status)) {
                const summaryPointEvaluator05 = Math.round((Number(basicProTotalPointEvaluator05 !== null &&
                    basicProTotalPointEvaluator05 !== undefined
                    ? basicProTotalPointEvaluator05
                    : 0) *
                    (evaluation.skillPercent || 0) +
                    Number(behaviorTotalPointEvaluator05 !== null &&
                        behaviorTotalPointEvaluator05 !== undefined
                        ? behaviorTotalPointEvaluator05
                        : 0) *
                        (evaluation.behaviorPercent || 0) +
                    Math.round(Number(achievementPersonalTotalPointEvaluator05 !== null &&
                        achievementPersonalTotalPointEvaluator05 !== undefined
                        ? achievementPersonalTotalPointEvaluator05
                        : 0)) *
                        (evaluation.achievementPercent || 0)) /
                    100 +
                    Number(achievementAdditionalTotalPointEvaluator05 !== null &&
                        achievementAdditionalTotalPointEvaluator05 !== undefined
                        ? achievementAdditionalTotalPointEvaluator05
                        : 0));
                evaluation.summaryPointEvaluator05 =
                    (basicProTotalPointEvaluator05 !== null &&
                        basicProTotalPointEvaluator05 !== undefined) ||
                        (behaviorTotalPointEvaluator05 !== null &&
                            behaviorTotalPointEvaluator05 !== undefined) ||
                        (achievementPersonalTotalPointEvaluator05 !== null &&
                            achievementPersonalTotalPointEvaluator05 !== undefined) ||
                        (achievementAdditionalTotalPointEvaluator05 !== null &&
                            achievementAdditionalTotalPointEvaluator05 !== undefined)
                        ? Math.min(Math.max(Math.floor(summaryPointEvaluator05), minPoint), maxPoint)
                        : null;
            }
            if ([53, 54, 55].includes(evaluation.status)) {
                evaluation.basicTotalPointEvaluator05 = basicTotalPointEvaluator05;
                evaluation.proTotalPointEvaluator05 =
                    proTotalPointEvaluator05 && Math.round(proTotalPointEvaluator05);
                evaluation.proTotalPointUser =
                    proTotalPointUser && Math.round(proTotalPointUser);
                evaluation.behaviorTotalPointEvaluator05 =
                    behaviorTotalPointEvaluator05;
                evaluation.achievementAdditionalTotalPointEvaluator05 =
                    achievementAdditionalTotalPointEvaluator05;
                evaluation.achievementPersonalTotalPointEvaluator05 =
                    achievementPersonalTotalPointEvaluator05 &&
                        Math.round(achievementPersonalTotalPointEvaluator05);
                evaluation.basicProTotalPointEvaluator05 =
                    basicProTotalPointEvaluator05;
            }
            if (evaluation.achievementAdditionalTotalPointEvaluator1 !=
                achievementAdditionalTotalPointEvaluator1 ||
                [56, 57, 58].includes(evaluation.status)) {
                const summaryPointEvaluator1 = Math.round((Number(basicProTotalPointEvaluator1 !== null &&
                    basicProTotalPointEvaluator1 !== undefined
                    ? basicProTotalPointEvaluator1
                    : 0) *
                    (evaluation.skillPercent || 0) +
                    Number(behaviorTotalPointEvaluator1 !== null &&
                        behaviorTotalPointEvaluator1 !== undefined
                        ? behaviorTotalPointEvaluator1
                        : 0) *
                        (evaluation.behaviorPercent || 0) +
                    Math.round(Number(achievementPersonalTotalPointEvaluator1 !== null &&
                        achievementPersonalTotalPointEvaluator1 !== undefined
                        ? achievementPersonalTotalPointEvaluator1
                        : 0)) *
                        (evaluation.achievementPercent || 0)) /
                    100 +
                    Number(achievementAdditionalTotalPointEvaluator1 !== null &&
                        achievementAdditionalTotalPointEvaluator1 !== undefined
                        ? achievementAdditionalTotalPointEvaluator1
                        : 0));
                evaluation.summaryPointEvaluator1 =
                    (basicProTotalPointEvaluator1 !== null &&
                        basicProTotalPointEvaluator1 !== undefined) ||
                        (behaviorTotalPointEvaluator1 !== null &&
                            behaviorTotalPointEvaluator1 !== undefined) ||
                        (achievementPersonalTotalPointEvaluator1 !== null &&
                            achievementPersonalTotalPointEvaluator1 !== undefined) ||
                        (achievementAdditionalTotalPointEvaluator1 !== null &&
                            achievementAdditionalTotalPointEvaluator1 !== undefined)
                        ? Math.min(Math.max(Math.floor(summaryPointEvaluator1), minPoint), maxPoint)
                        : null;
            }
            if ([56, 57, 58].includes(evaluation.status)) {
                evaluation.basicTotalPointEvaluator1 = basicTotalPointEvaluator1;
                evaluation.proTotalPointEvaluator1 =
                    proTotalPointEvaluator1 && Math.round(proTotalPointEvaluator1);
                evaluation.proTotalPointEvaluator05 =
                    proTotalPointEvaluator05 && Math.round(proTotalPointEvaluator05);
                evaluation.proTotalPointUser =
                    proTotalPointUser && Math.round(proTotalPointUser);
                evaluation.behaviorTotalPointEvaluator1 = behaviorTotalPointEvaluator1;
                evaluation.achievementAdditionalTotalPointEvaluator1 =
                    achievementAdditionalTotalPointEvaluator1;
                evaluation.achievementPersonalTotalPointEvaluator1 =
                    achievementPersonalTotalPointEvaluator1 &&
                        Math.round(achievementPersonalTotalPointEvaluator1);
                evaluation.basicProTotalPointEvaluator1 = basicProTotalPointEvaluator1;
            }
            if (evaluation.achievementAdditionalTotalPointEvaluator2 !=
                achievementAdditionalTotalPointEvaluator2 ||
                [59, 60, 61].includes(evaluation.status)) {
                const summaryPointEvaluator2 = Math.round((Number(basicProTotalPointEvaluator2 !== null &&
                    basicProTotalPointEvaluator2 !== undefined
                    ? basicProTotalPointEvaluator2
                    : 0) *
                    (evaluation.skillPercent || 0) +
                    Number(behaviorTotalPointEvaluator2 !== null &&
                        behaviorTotalPointEvaluator2 !== undefined
                        ? behaviorTotalPointEvaluator2
                        : 0) *
                        (evaluation.behaviorPercent || 0) +
                    Math.round(Number(achievementPersonalTotalPointEvaluator2 !== null &&
                        achievementPersonalTotalPointEvaluator2 !== undefined
                        ? achievementPersonalTotalPointEvaluator2
                        : 0)) *
                        (evaluation.achievementPercent || 0)) /
                    100 +
                    Number(achievementAdditionalTotalPointEvaluator2 !== null &&
                        achievementAdditionalTotalPointEvaluator2 !== undefined
                        ? achievementAdditionalTotalPointEvaluator2
                        : 0));
                evaluation.summaryPointEvaluator2 =
                    (basicProTotalPointEvaluator2 !== null &&
                        basicProTotalPointEvaluator2 !== undefined) ||
                        (behaviorTotalPointEvaluator2 !== null &&
                            behaviorTotalPointEvaluator2 !== undefined) ||
                        (achievementPersonalTotalPointEvaluator2 !== null &&
                            achievementPersonalTotalPointEvaluator2 !== undefined) ||
                        (achievementAdditionalTotalPointEvaluator2 !== null &&
                            achievementAdditionalTotalPointEvaluator2 !== undefined)
                        ? Math.min(Math.max(Math.floor(summaryPointEvaluator2), minPoint), maxPoint)
                        : null;
            }
            if ([59, 60, 61].includes(evaluation.status)) {
                evaluation.basicTotalPointEvaluator2 = basicTotalPointEvaluator2;
                evaluation.proTotalPointEvaluator2 =
                    proTotalPointEvaluator2 && Math.round(proTotalPointEvaluator2);
                evaluation.proTotalPointEvaluator1 =
                    proTotalPointEvaluator1 && Math.round(proTotalPointEvaluator1);
                evaluation.proTotalPointEvaluator05 =
                    proTotalPointEvaluator05 && Math.round(proTotalPointEvaluator05);
                evaluation.proTotalPointUser =
                    proTotalPointUser && Math.round(proTotalPointUser);
                evaluation.behaviorTotalPointEvaluator2 = behaviorTotalPointEvaluator2;
                evaluation.achievementAdditionalTotalPointEvaluator2 =
                    achievementAdditionalTotalPointEvaluator2;
                evaluation.achievementPersonalTotalPointEvaluator2 =
                    achievementPersonalTotalPointEvaluator2 &&
                        Math.round(achievementPersonalTotalPointEvaluator2);
                evaluation.basicProTotalPointEvaluator2 = basicProTotalPointEvaluator2;
            }
            evaluation.achievementAdditionalTotalPointUser =
                achievementAdditionalTotalPointUser;
            evaluation.achievementAdditionalTotalPointEvaluator05 =
                achievementAdditionalTotalPointEvaluator05;
            evaluation.achievementAdditionalTotalPointEvaluator1 =
                achievementAdditionalTotalPointEvaluator1;
            evaluation.achievementAdditionalTotalPointEvaluator2 =
                achievementAdditionalTotalPointEvaluator2;
            if (!isSubmit && isEdit) {
                if (evaluation.status === 0)
                    evaluation.status = 1;
                if (evaluation.status === 50)
                    evaluation.status = 51;
                await evaluation.save({ transaction });
            }
            if (isSubmit) {
                if ([50, 51, 52].includes(evaluation.status)) {
                    updateValue.status = 'IDS_BUTTON_SUBMIT';
                }
                await this.evaluationRepo.createHistoryApproveReject(updateValue, transaction);
                const evaluators = evaluation.evaluator;
                if ([0, 1, 2].some((s) => s === evaluation.status)) {
                    if (evaluators.some((s) => Number(s.evaluationOrder) === 0.5)) {
                        evaluation.status = 3;
                        selectedOrder = '0.5';
                    }
                    else if (evaluators.some((s) => Number(s.evaluationOrder) === 1)) {
                        evaluation.status = 5;
                        selectedOrder = '1.0';
                    }
                    else {
                        evaluation.status = 7;
                        selectedOrder = '2.0';
                    }
                    await this.userRepo.updateEvaluationBasicBehaviorSkill(evaluationId, evaluation.level, evaluation.flagSkill, user.companyGroupCode, transaction);
                }
                if ([59, 60, 61].some((s) => s === evaluation.status)) {
                    evaluation.status = 98;
                }
                if ([56, 57, 58].some((s) => s === evaluation.status)) {
                    if (evaluators.some((s) => Number(s.evaluationOrder) === 2)) {
                        evaluation.status = 59;
                        selectedOrder = '2.0';
                    }
                }
                if ([53, 54, 55].some((s) => s === evaluation.status)) {
                    if (evaluators.some((s) => Number(s.evaluationOrder) === 1)) {
                        evaluation.status = 56;
                        selectedOrder = '1.0';
                    }
                    else if (evaluators.some((s) => Number(s.evaluationOrder) === 2)) {
                        evaluation.status = 59;
                        selectedOrder = '2.0';
                    }
                }
                if ([50, 51, 52].some((s) => s === evaluation.status)) {
                    if (evaluators.some((s) => Number(s.evaluationOrder) === 0.5)) {
                        evaluation.status = 53;
                        selectedOrder = '0.5';
                    }
                    else if (evaluators.some((s) => Number(s.evaluationOrder) === 1)) {
                        evaluation.status = 56;
                        selectedOrder = '1.0';
                    }
                    else if (evaluators.some((s) => Number(s.evaluationOrder) === 2)) {
                        evaluation.status = 59;
                        selectedOrder = '2.0';
                    }
                }
                await evaluation.save({ transaction });
                const tempApprovers = evaluators.filter((item) => {
                    if (item.evaluationOrder === selectedOrder)
                        return item;
                });
                if (selectedOrder)
                    await this.mailService.submitGoalAndEvaluation(tempApprovers[0].evaluatorId, evaluation.userId, evaluation, host);
            }
            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            console.log(error.toString());
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return {
            statusNumber: evaluation.status,
            updateTime: evaluation.updatedTime.toISOString(),
        };
    }
    async getSettingProFormulaPublic(companyGroupCode) {
        return await this.userRepo.getSettingProFormulaPublic(companyGroupCode);
    }
    async listBasicBehavior(type, level, flagSkill, companyGroupCode) {
        const basicBehaviors = [];
        if (type.toString().match(/[1-2]/)) {
            const results = await this.userRepo.getBasicBehavior(type, level, flagSkill, companyGroupCode);
            basicBehaviors.push(...results.map((v, i) => (Object.assign(Object.assign({}, v), { key: `basic-behavior-key-${type.toString().match(/[1-2]/)}-${i}` }))));
        }
        return basicBehaviors;
    }
    async getDepartmentGoal(idEvaluation, userId, companyGroupCode, timeZone) {
        let evaluationDepartmentId;
        if (idEvaluation) {
            const evaluation = await this.userRepo.getEvaluationDepartmentId(idEvaluation);
            evaluationDepartmentId = evaluation.evaluationDepartmentId;
        }
        else {
            evaluationDepartmentId = undefined;
        }
        if (evaluationDepartmentId !== undefined &&
            evaluationDepartmentId !== 0 &&
            evaluationDepartmentId !== null) {
            const data = await this.userRepo.getDepartmentGoalbyEvaluationDepartmentId(evaluationDepartmentId);
            const personalIds = [];
            if (data) {
                data.evaluationAchievementPersonals.forEach((e) => {
                    personalIds.push(e.itemNo);
                });
            }
            const listPeronalSub = await this.userRepo.findPersonalSub(personalIds);
            return data
                ? { evaluationAchievementPersonalSubs: listPeronalSub, data }
                : {
                    data: Object.assign(Object.assign({}, data), { evaluationAchievementPersonals: [] }),
                    evaluationAchievementPersonalSubs: [],
                };
        }
        else if (evaluationDepartmentId === 0) {
            const evaluation = await this.userRepo.getEvaluationDepartmentId(idEvaluation);
            const { divisionName, title } = evaluation;
            return {
                data: {
                    title: title,
                    divisionName: divisionName,
                    evaluationAchievementPersonals: [],
                },
                evaluationAchievementPersonalSubs: [],
            };
        }
        else {
            let division;
            let divisionInfor;
            if (idEvaluation) {
                const evaluation = await this.userRepo.getEvaluationDepartmentId(idEvaluation);
                division = evaluation.divisionName;
                divisionInfor = evaluation.divisionId;
            }
            else {
                const divisionUser = await this.userRepo.getDivisionByUserId(userId);
                division = divisionUser.division;
                divisionInfor = divisionUser.division;
            }
            let evaluationPeriod;
            if (idEvaluation) {
                evaluationPeriod =
                    await this.userRepo.getEvaluationPeriodByEvaluationId(idEvaluation);
            }
            else
                evaluationPeriod = await this.userRepo.getEvaluationPeriodId(companyGroupCode, timeZone);
            if (!evaluationPeriod)
                throw new RuntimeException_1.RuntimeException(`can't found evaluation period`, 501);
            const { year, periodIndex } = evaluationPeriod;
            let title;
            switch (periodIndex) {
                case 1:
                    title = year + '年上期';
                    break;
                case 2:
                    title = year + '年下期';
                    break;
                default:
                    title = null;
            }
            let divisionName;
            let divisionId;
            if (idEvaluation) {
                divisionName = division;
                divisionId = divisionInfor;
            }
            else {
                divisionName = division ? division.name : null;
                divisionId = divisionInfor ? divisionInfor.id : null;
            }
            if (evaluationPeriod) {
                const evaluationPeriodId = evaluationPeriod.id;
                const data = await this.userRepo.getDepartmentGoal(divisionId, evaluationPeriodId, companyGroupCode);
                const personalIds = [];
                if (data) {
                    data.evaluationAchievementPersonals.forEach((e) => {
                        personalIds.push(e.id);
                    });
                }
                const listPeronalSub = await this.userRepo.findPersonalSub(personalIds);
                return data
                    ? { evaluationAchievementPersonalSubs: listPeronalSub, data }
                    : {
                        data: {
                            title: title,
                            divisionName: divisionName,
                            evaluationAchievementPersonals: [],
                        },
                        evaluationAchievementPersonalSubs: [],
                    };
            }
            else
                return [];
        }
    }
    async getListUser(query) {
        const results = await this.userRepo.getListUser(query);
        return results;
    }
    async getUserIdByEvaluationId(evaluationId) {
        const results = await this.userRepo.getUserIdByEvaluationId(evaluationId);
        return results.userId;
    }
    async deleteListUser(query, companyGroupCode, timeZone) {
        const results = await this.userRepo.deleteListUser(query, companyGroupCode, timeZone);
        return results;
    }
    async getAchievementPublic(type, companyGroupCode) {
        const results = await this.userRepo.getAchievementPublicByType(type, companyGroupCode);
        if (results && results.length > 0)
            return results;
        return [];
    }
    async getAchievementAddPublic(type, typeNew, companyGroupCode) {
        const results = await this.userRepo.getAchievementAddPublicByType(type, typeNew, companyGroupCode);
        if (results && results.length > 0)
            return results;
        return [];
    }
    async getBasicBehaviorSkillPublic(type, companyGroupCode, level) {
        const basicBehaviors = await this.userRepo.getBasicBehaviorSkillPublic(type, companyGroupCode, level);
        if (basicBehaviors && basicBehaviors.length > 0) {
            const results = basicBehaviors.map((v, i) => (Object.assign(Object.assign({}, v), { key: `basic-behavior-skill-${type}-${i}` })));
            return results;
        }
        return [];
    }
    async getUserDetailById(id) {
        return await this.userRepo.getUserDetailById(id);
    }
    async getEvaluationByUserId(id, companyGroupCode) {
        return await this.userRepo.getEvaluationByUserId(id, companyGroupCode);
    }
    async searchListUserSettingEvaluator(query) {
        const results = await this.userRepo.searchListUserSettingEvaluator(query);
        return results;
    }
    async getListEvaluator(evaluationCreatorId, companyGroupCode) {
        const results = await this.userRepo.getListEvaluator(evaluationCreatorId, companyGroupCode);
        return results;
    }
    async updateSettingEvaluatorOfOneUser(query, companyGroupCode) {
        const results = await this.userRepo.updateSettingEvaluatorOfOneUser(query, companyGroupCode);
        return results;
    }
    async updateSettingEvaluatorListUser(query, companyGroupCode) {
        const results = await this.userRepo.updateSettingEvaluatorListUser(query, companyGroupCode);
        return results;
    }
    async getToEmailList(type, year, periodIndex, companyGroupCode, departmentId) {
        const EMAIL_TYPE_TO_TEMPLATE_ID = {
            [TemplateMailId_1.EmailType.USER_GOAL_SETTING_PERIOD]: TemplateMailId_1.TemplateMailId.COMMON_GOAL_SETTING,
            [TemplateMailId_1.EmailType.USER_EVALUATION_PERIOD]: TemplateMailId_1.TemplateMailId.COMMON_EVALUATION_SETTING,
            [TemplateMailId_1.EmailType.EXCEPTION_GOAL_SETTING_PERIOD]: TemplateMailId_1.TemplateMailId.EXCEPTION_GOAL_SETTING,
            [TemplateMailId_1.EmailType.EXCEPTION_EVALUATION_PERIOD]: TemplateMailId_1.TemplateMailId.EXCEPTION_EVALUATION_SETTING,
        };
        const [toEmailList, mailResult, template] = await Promise.all([
            this.userRepo.listToEmail(type, year, periodIndex, companyGroupCode, departmentId),
            (async () => {
                if (type === TemplateMailId_1.EmailType.USER_GOAL_SETTING_PERIOD) {
                    return this.mailService.getMailNotificateGoalSetting(year, periodIndex, companyGroupCode);
                }
                else if (type === TemplateMailId_1.EmailType.USER_EVALUATION_PERIOD) {
                    return this.mailService.getMailNotificateEvaluation(year, periodIndex, companyGroupCode);
                }
                else if (type === TemplateMailId_1.EmailType.EXCEPTION_GOAL_SETTING_PERIOD) {
                    return this.mailService.getMailNotificateGoalSettingException(year, periodIndex, companyGroupCode);
                }
                else if (type === TemplateMailId_1.EmailType.EXCEPTION_EVALUATION_PERIOD) {
                    return this.mailService.getMailNotificateEvaluationException(year, periodIndex, companyGroupCode);
                }
                return { content: ``, title: `` };
            })(),
            (async () => {
                const templateId = EMAIL_TYPE_TO_TEMPLATE_ID[type];
                if (!templateId)
                    return null;
                return this.mailService.getRawMailTemplate(templateId, companyGroupCode);
            })(),
        ]);
        return {
            toEmailList,
            content: mailResult.content,
            title: mailResult.title,
            template,
        };
    }
    async getToEmailListFixed(type, periodId, companyGroupCode, evaluationId) {
        let mailResult = { content: ``, title: `` };
        const period = await this.evaluationPeriodRepo.findOnePeriod({
            id: periodId,
        });
        switch (type) {
            case TemplateMailId_1.EmailTypeFixed.GOAL_USER_AND_EVALUATOR_WITHOUT_TIME:
                mailResult =
                    await this.mailService.getMailNotiGoalFixedUserAndEvaluatorWOTime(period, companyGroupCode);
                break;
            case TemplateMailId_1.EmailTypeFixed.GOAL_EVALUATOR_WITHOUT_TIME:
                mailResult = await this.mailService.getMailNotiGoalFixedEvaluatorWOTime(period, companyGroupCode, evaluationId);
                break;
            case TemplateMailId_1.EmailTypeFixed.GOAL_USER_AND_EVALUATOR:
                mailResult =
                    await this.mailService.getMailNotiGoalFixedUserAndEvaluator(period, companyGroupCode);
                break;
            case TemplateMailId_1.EmailTypeFixed.EVAL_USER_AND_EVALUATOR_WITHOUT_TIME:
                mailResult =
                    await this.mailService.getMailNotiEvalFixedUserAndEvaluatorWOTime(period, companyGroupCode);
                break;
            case TemplateMailId_1.EmailTypeFixed.EVAL_EVALUATOR_WITHOUT_TIME:
                mailResult = await this.mailService.getMailNotiEvalFixedEvaluatorWOTime(period, companyGroupCode, evaluationId);
                break;
            case TemplateMailId_1.EmailTypeFixed.EVAL_USER_AND_EVALUATOR:
                mailResult =
                    await this.mailService.getMailNotiEvalFixedUserAndEvaluator(period, companyGroupCode);
                break;
        }
        return {
            content: mailResult.content,
            title: mailResult.title,
        };
    }
    async checkStatusRecordSend(rowData, type) {
        const idValids = [];
        const listEvaluations = await this.approvalRepository.getEvaluationByListId(rowData.id);
        listEvaluations.forEach((evaluation) => {
            if ((type === TemplateMailId_1.EmailTypeFixed.GOAL_USER_AND_EVALUATOR_WITHOUT_TIME &&
                [0, 1, 2].includes(evaluation.status)) ||
                ((type === TemplateMailId_1.EmailTypeFixed.GOAL_EVALUATOR_WITHOUT_TIME ||
                    type === TemplateMailId_1.EmailTypeFixed.GOAL_EVALUATOR_WITHOUT_TIME_STATUS) &&
                    [3, 4, 5, 6, 7, 8].includes(evaluation.status)) ||
                (type === TemplateMailId_1.EmailTypeFixed.EVAL_USER_AND_EVALUATOR_WITHOUT_TIME &&
                    [50, 51, 52].includes(evaluation.status)) ||
                ((type === TemplateMailId_1.EmailTypeFixed.EVAL_EVALUATOR_WITHOUT_TIME ||
                    type === TemplateMailId_1.EmailTypeFixed.EVAL_EVALUATOR_WITHOUT_TIME_STATUS) &&
                    [53, 54, 55, 56, 57, 58, 59, 60, 61].includes(evaluation.status))) {
                idValids.push(Number(evaluation.id));
            }
        });
        return {
            result: idValids,
        };
    }
    async checkImportUser(query, companyGroupCode) {
        const results = await this.userRepo.checkImportUser(query, companyGroupCode);
        return results;
    }
    async importUserProcedue(query, companyGroupCode, timeZone) {
        await this.proSkillRepository.insertHistoryPublicProSkill(query.year, query.periodIndex, companyGroupCode);
        await this.userRepo.importUserProcedure(query.year, query.periodIndex, null, 1, companyGroupCode, timeZone);
        const period = await this.evaluationPeriodRepo.findOnePeriod({
            year: query.year,
            periodIndex: query.periodIndex,
            companyGroupCode,
        });
        if (period === null || period === void 0 ? void 0 : period.id) {
            await this.periodDeptSettingRepo.applyAllDeptDatesToEvaluations(period.id, companyGroupCode);
        }
        return true;
    }
    async findListUserToSettingEvaluation(query) {
        const results = await this.userRepo.findListUserToSettingEvaluation(query);
        return results;
    }
    async addUserSettingEvaluationProcedure(query, companyGroupCode, timeZone, userId) {
        const period = await this.evaluationPeriodRepo.findOnePeriod({
            year: query.state.year,
            periodIndex: query.state.periodIndex,
            companyGroupCode,
        });
        if ((period === null || period === void 0 ? void 0 : period.checkFixed) === 2) {
            throw new RuntimeException_1.RuntimeException('Evaluation period is fixed', common_1.HttpStatus.PRECONDITION_FAILED);
        }
        await this.userRepo.importUserProcedure(query.state.year, query.state.periodIndex, query.selectedRowKeys, 0, companyGroupCode, timeZone);
        if (period === null || period === void 0 ? void 0 : period.id) {
            await this.periodDeptSettingRepo.syncEvaluationOrgFromDefault(period.id, companyGroupCode, query.selectedRowKeys);
            await this.periodDeptSettingRepo.applyAllDeptDatesToEvaluations(period.id, companyGroupCode);
            await this.periodDeptSettingRepo.updateEvaluationNamesFromSettings(period.id, companyGroupCode, query.selectedRowKeys);
            if (query.tabMode === 'personal' && userId) {
                await this.userRepo.markEvaluationsAsPersonal(query.selectedRowKeys, period.id, userId, companyGroupCode);
            }
        }
        return true;
    }
    async deleteUserSettingEvaluator(params, companyGroupCode) {
        var _a, _b;
        const period = await this.evaluationPeriodRepo.findOnePeriod({
            year: (_a = params.state) === null || _a === void 0 ? void 0 : _a.year,
            periodIndex: (_b = params.state) === null || _b === void 0 ? void 0 : _b.periodIndex,
            companyGroupCode,
        });
        if ((period === null || period === void 0 ? void 0 : period.checkFixed) === 2) {
            throw new RuntimeException_1.RuntimeException('Evaluation period is fixed', common_1.HttpStatus.PRECONDITION_FAILED);
        }
        return await this.userRepo.deleteUserSettingEvaluator(params, companyGroupCode);
    }
    async checkIsFixed(query, companyGroupCode) {
        const results = await this.userRepo.checkIsFixed(query, companyGroupCode);
        return results;
    }
    async getUsersEmailList(conditions, companyGroupCode) {
        return await this.userRepo.usersMailList(conditions, companyGroupCode);
    }
    async importUserFromExcel(body) {
        const year = body.state.year;
        const periodIndex = body.state.periodIndex;
        const listUser = body.itemsExcel;
        const listUserCanotImport = [];
        const listEvaluatorCannotImport = [];
        const dataEvaluationPeroid = await this.userRepo.getEvaluationPeriodByYear(year, periodIndex);
        if (dataEvaluationPeroid === null || dataEvaluationPeroid === void 0 ? void 0 : dataEvaluationPeroid.id) {
            for (let i = 0; i < listUser.length; i++) {
                const element = listUser[i];
                const user = await this.userRepo.getUserInfoByFullname(element === null || element === void 0 ? void 0 : element.fullName);
                if (user) {
                    const evaluator05 = await this.userRepo.getUserInfoByFullname(element === null || element === void 0 ? void 0 : element.evaluator05);
                    if ((element === null || element === void 0 ? void 0 : element.evaluator05) !== '-' &&
                        (evaluator05 === null || evaluator05 === undefined)) {
                        listEvaluatorCannotImport.push(element);
                    }
                    const evaluator10 = await this.userRepo.getUserInfoByFullname(element === null || element === void 0 ? void 0 : element.evaluator10);
                    if ((element === null || element === void 0 ? void 0 : element.evaluator10) !== '-' &&
                        (evaluator10 === null || evaluator10 === undefined)) {
                        listEvaluatorCannotImport.push(element);
                    }
                    const evaluator20 = await this.userRepo.getUserInfoByFullname(element === null || element === void 0 ? void 0 : element.evaluator20);
                    if ((element === null || element === void 0 ? void 0 : element.evaluator20) !== '-' &&
                        (evaluator20 === null || evaluator20 === undefined)) {
                        listEvaluatorCannotImport.push(element);
                    }
                    const data = {
                        userId: user === null || user === void 0 ? void 0 : user.id,
                        evaluationPeriodId: dataEvaluationPeroid === null || dataEvaluationPeroid === void 0 ? void 0 : dataEvaluationPeroid.id,
                        evaluator05Id: evaluator05 === null || evaluator05 === undefined
                            ? null
                            : evaluator05 === null || evaluator05 === void 0 ? void 0 : evaluator05.id,
                        evaluator1Id: evaluator10 === null || evaluator10 === undefined
                            ? null
                            : evaluator10 === null || evaluator10 === void 0 ? void 0 : evaluator10.id,
                        evaluator2Id: evaluator20 === null || evaluator20 === undefined
                            ? null
                            : evaluator20 === null || evaluator20 === void 0 ? void 0 : evaluator20.id,
                    };
                    await this.userRepo.importUserFromExcel(data);
                }
                else {
                    listUserCanotImport.push(element);
                }
            }
        }
        const listEvaluatorCannotSetting = Object.values(listEvaluatorCannotImport.reduce((acc, cur) => Object.assign(acc, { [cur.employeeNumber]: cur }), {}));
        return {
            listUserCanotImport: listUserCanotImport,
            listEvaluatorCannotSetting: listEvaluatorCannotSetting,
        };
    }
    async exportListUser(params) {
        const datas = await this.userRepo.getDataExportListUser2(params);
        const roleName = {
            1: '被評価者',
            2: '評価者',
            3: '専門スキル設定',
            4: '専門スキル承認',
            5: '評価／目標状況一覧',
            6: '評価設定',
            7: '評価／目標期間設定・状況管理',
            8: 'ユーザ管理',
        };
        const workbook = new exceljs_1.Workbook();
        const worksheet = workbook.addWorksheet();
        worksheet.columns = [
            { header: '社員番号', key: '社員番号' },
            { header: '氏名', key: '氏名' },
            { header: '会社', key: '会社' },
            { header: '部署名', key: '部署名' },
            { header: '課名', key: '課名' },
            { header: '等級', key: '等級' },
            { header: 'スキル評価', key: 'スキル評価' },
            { header: 'メール', key: 'メール' },
            { header: 'ロール', key: 'ロール' },
        ];
        for (let i = 1; i <= worksheet.columnCount; i++) {
            worksheet.getCell(1, i).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'ff91d2ff' },
            };
        }
        worksheet.getRow(1).font = {
            bold: true,
        };
        worksheet.getCell('A1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
        worksheet.columns[0].width = 10;
        worksheet.columns[1].width = 20;
        worksheet.columns[2].width = 30;
        worksheet.columns[3].width = 30;
        worksheet.columns[4].width = 30;
        worksheet.columns[5].width = 10;
        worksheet.columns[6].width = 15;
        worksheet.columns[7].width = 30;
        worksheet.columns[8].width = 30;
        const createOuterBorder = (worksheet, start = { row: 1, col: 1 }, end = { row: 1, col: 1 }, borderWidth = 'thin') => {
            const borderStyle = {
                style: borderWidth,
            };
            for (let i = start.row; i <= end.row; i++) {
                for (let j = start.col; j <= end.col; j++) {
                    const leftBorderCell = worksheet.getCell(i, j);
                    leftBorderCell.border = Object.assign(Object.assign({}, leftBorderCell.border), { left: borderStyle, right: borderStyle, top: borderStyle, bottom: borderStyle });
                }
            }
        };
        datas.data.forEach((item, _index) => {
            worksheet.addRow([
                item.employeeNumber,
                item.fullName,
                item.company === null ? '未設定' : item.company.name,
                item.division === null ? '未設定' : item.division.name,
                item.department === null ? '未設定' : item.department.name,
                item.level === null ? '未設定' : item.level,
                item.flagSkill ? 'あり' : 'なし',
                item.email ? item.email : '',
                item.roles.length === 0
                    ? '未設定'
                    : item.roles
                        .sort((a, b) => {
                        if (a.id < b.id) {
                            return -1;
                        }
                        if (a.id > b.id) {
                            return 1;
                        }
                        return 0;
                    })
                        .map((i, index) => {
                        return (roleName[`${i.id}`] +
                            (index !== item.roles.length - 1 ? '\r\n' : ''));
                    })
                        .toString()
                        .replaceAll(',', ''),
            ]);
            let rowIndex = 1;
            for (rowIndex; rowIndex <= worksheet.rowCount; rowIndex++) {
                worksheet.getRow(rowIndex).alignment = {
                    wrapText: true,
                    vertical: 'middle',
                };
            }
            worksheet.getColumn(6).alignment = {
                wrapText: true,
                horizontal: 'center',
                vertical: 'middle',
            };
            worksheet.getColumn(7).alignment = {
                wrapText: true,
                horizontal: 'center',
                vertical: 'middle',
            };
            for (let i = 1; i <= 9; i++) {
                worksheet.getCell(1, i).alignment = {
                    horizontal: 'center',
                    vertical: 'middle',
                };
            }
        });
        createOuterBorder(worksheet, { row: 1, col: 1 }, { row: worksheet.rowCount, col: worksheet.columnCount });
        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }
    async listTemplateCreationGoal(query, id) {
        return await this.userRepo.listTemplateCreationGoal(query, id);
    }
    async listUserTheSameInforWithEvaluator(query) {
        return await this.userRepo.listUserTheSameInforWithEvaluator(query);
    }
    async getAllSkill(companyGroupCode) {
        const results = await this.userRepo.getAllSkill(companyGroupCode);
        return results;
    }
    async getAllSkillPublic(companyGroupCode) {
        const results = await this.userRepo.getAllSkillPublic(companyGroupCode);
        return results;
    }
    async undoException(data, req) {
        const evaluationDetail = await this.evaluatorRepo.getEvaluationById(data.id);
        if (new Date(data.updatedTime).getTime() !==
            new Date(evaluationDetail.updatedTime).getTime())
            throw new RuntimeException_1.RuntimeException('Evaluation is duplicate', 409);
        return await this.userRepo.undoException(data, req);
    }
};
__decorate([
    (0, common_1.Inject)(user_repository_1.UserRepository),
    __metadata("design:type", Object)
], UserService.prototype, "userRepo", void 0);
__decorate([
    (0, common_1.Inject)(point_repository_1.PointRepository),
    __metadata("design:type", point_repository_1.PointRepository)
], UserService.prototype, "pointRepo", void 0);
__decorate([
    (0, common_1.Inject)(mail_service_1.MailService),
    __metadata("design:type", mail_service_1.MailService)
], UserService.prototype, "mailService", void 0);
__decorate([
    (0, common_1.Inject)(evaluation17_service_1.Evaluation17Service),
    __metadata("design:type", evaluation17_service_1.Evaluation17Service)
], UserService.prototype, "evaluation17Service", void 0);
__decorate([
    (0, common_1.Inject)(evaluationPeriod_repository_1.EvaluationPeriodRepository),
    __metadata("design:type", evaluationPeriod_repository_1.EvaluationPeriodRepository)
], UserService.prototype, "evaluationPeriodRepo", void 0);
__decorate([
    (0, common_1.Inject)(versionSetting_repository_1.VersionSettingRepository),
    __metadata("design:type", versionSetting_repository_1.VersionSettingRepository)
], UserService.prototype, "versionSettingRepository", void 0);
__decorate([
    (0, common_1.Inject)(approval_repository_1.ApprovalRepository),
    __metadata("design:type", approval_repository_1.ApprovalRepository)
], UserService.prototype, "approvalRepository", void 0);
__decorate([
    (0, common_1.Inject)(evaluator_repository_1.EvaluatorRepository),
    __metadata("design:type", Object)
], UserService.prototype, "evaluatorRepo", void 0);
__decorate([
    (0, common_1.Inject)(proSkill_repository_1.ProSkillRepository),
    __metadata("design:type", proSkill_repository_1.ProSkillRepository)
], UserService.prototype, "proSkillRepository", void 0);
__decorate([
    (0, common_1.Inject)(evaluation_repository_1.EvaluationRepository),
    __metadata("design:type", Object)
], UserService.prototype, "evaluationRepo", void 0);
__decorate([
    (0, common_1.Inject)(evaluationPeriodDepartmentSetting_repository_1.EvaluationPeriodDepartmentSettingRepository),
    __metadata("design:type", evaluationPeriodDepartmentSetting_repository_1.EvaluationPeriodDepartmentSettingRepository)
], UserService.prototype, "periodDeptSettingRepo", void 0);
UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map