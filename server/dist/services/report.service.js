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
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const evaluation_repository_1 = require("../repository/evaluation.repository");
const pdf17_service_1 = require("./pdf17.service");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const pdf810_service_1 = require("./pdf810.service");
const report_repository_1 = require("../repository/report.repository");
const util_1 = require("../common/util");
const pdf_service_1 = require("./pdf.service");
const user_repository_1 = require("../repository/user.repository");
const pdf_review_service_1 = require("./pdf.review.service");
const Pdf810Helper_1 = require("../common/pdf/Pdf810Helper");
let ReportService = class ReportService {
    async exportEvaluationReportPdf(evaluationId) {
        const templateOneStatus = 100;
        const templateTwoStatus = Array.from(new Array(50), (x, i) => i + 1);
        const templateThreeStatus = Array.from(new Array(49), (x, i) => i + 51);
        const evaluation = await this.evaluationRepository.getEvaluationUserById(evaluationId);
        if (!evaluation) {
            throw new RuntimeException_1.RuntimeException('Evaluation not found', common_1.HttpStatus.NOT_FOUND);
        }
        const pdfService = new pdf17_service_1.Pdf17Service();
        let results = null;
        if (evaluation.status === templateOneStatus) {
            results = await pdfService.exportEvaluationReportPdf(evaluation, 1);
        }
        if (templateTwoStatus.includes(evaluation.status)) {
            results = await pdfService.exportEvaluationReportPdf(evaluation, 2);
        }
        if (templateThreeStatus.includes(evaluation.status)) {
            results = await pdfService.exportEvaluationReportPdf(evaluation, 3);
        }
        return results;
    }
    async exportMultiEvaluationReportPdf(evaluationIds) {
        const ids = evaluationIds.map((el) => parseInt(el));
        const evaluations = await this.evaluationRepository.getEvaluationUserByListId(ids);
        if (!evaluations || evaluations.length === 0) {
            throw new RuntimeException_1.RuntimeException('Evaluation not found', common_1.HttpStatus.NOT_FOUND);
        }
        const pdfService = new pdf17_service_1.Pdf17Service();
        const results = await pdfService.exportParentReportPdf(evaluations);
        return results;
    }
    async exportEvaluation810ReportPdf(evaluationId, orientation = 'p', size) {
        const evaluation = await this.evaluationRepository.getEvaluationUserById(evaluationId);
        if (!evaluation) {
            throw new RuntimeException_1.RuntimeException('Evaluation not found', common_1.HttpStatus.NOT_FOUND);
        }
        const subList = await this.evaluationRepository.getSubListByAchievementPersonalId(evaluation === null || evaluation === void 0 ? void 0 : evaluation.evaluationAchievementPersonals);
        const pdfService = new pdf810_service_1.Pdf810Service();
        let results = null;
        results = await pdfService.exportEvaluationReportPdf(evaluation, evaluation === null || evaluation === void 0 ? void 0 : evaluation.evaluator, orientation, size, subList);
        return results;
    }
    async exportReportPdfReview810(evaluationId, userId, isF5, isEvaluatorUser, isMultiple, companyGroupCode, timeZone) {
        const evaluations = await this.evaluationRepository.getDataPDF8_10(evaluationId, userId, isEvaluatorUser, companyGroupCode);
        const processDataEvaluations = await this.handleDataEvaluations810Review(evaluations.evaluations, userId, isEvaluatorUser, timeZone);
        if (!isMultiple) {
            const result = this.pdfReviewService.exportEvaluationDetailForPdfReview810(processDataEvaluations[0], isF5);
            return result;
        }
        else {
            const result = this.pdfReviewService.exportListEvaluationPdf810(processDataEvaluations, isF5);
            return result;
        }
    }
    async exportMultiEvaluation810ReportPdf(evaluationIds, role, userId, orientation = 'p', size = 'a4') {
        const ids = evaluationIds;
        const evaluations = await this.evaluationRepository.getEvaluationUserByListId(ids);
        if (!evaluations || evaluations.length === 0) {
            throw new RuntimeException_1.RuntimeException('Evaluation not found', common_1.HttpStatus.NOT_FOUND);
        }
        const tempList = [];
        evaluations.forEach((evaluation) => {
            if (evaluation.evaluationAchievementPersonals) {
                evaluation.evaluationAchievementPersonals.forEach((el) => {
                    tempList.push(el);
                });
            }
        });
        const subList = await this.evaluationRepository.getSubListByAchievementPersonalId(tempList);
        const pdfService = new pdf810_service_1.Pdf810Service();
        const results = await pdfService.exportParentReportPdf(evaluations, role, userId, orientation, size, subList);
        return results;
    }
    getPdfService(level) {
        if (level < 8) {
            return new pdf17_service_1.Pdf17Service();
        }
        return new pdf810_service_1.Pdf810Service();
    }
    async exportReportPdfReview17(evaluationId, userId, isF5, isEvaluatorUser, isMultiple, companyGroupCode, timeZone) {
        const evaluations = await this.reportRepo.getDataPDF1_7(evaluationId, userId, isEvaluatorUser, companyGroupCode);
        const processDataEvaluations = await this.handleDataEvaluations17Review(evaluations.evaluations, userId, isEvaluatorUser, timeZone);
        if (!isMultiple) {
            const result = this.pdfReviewService.exportEvaluationDetailForPdfReview17(processDataEvaluations[0], isF5);
            return result;
        }
        else {
            const result = this.pdfReviewService.exportListEvaluationPdf17(processDataEvaluations, isF5);
            return result;
        }
    }
    handleSearchFormula(settingProFormulas, difficulty, maxLength) {
        var _a;
        return (((_a = settingProFormulas.find((f) => { var _a; return ((_a = f.settingProFormula) === null || _a === void 0 ? void 0 : _a.point) === difficulty && f.totalItem <= maxLength; })) === null || _a === void 0 ? void 0 : _a.coefficient) || 1);
    }
    async handleDataEvaluations17Review(evaluations, userId, isEvaluatorUser, timeZone) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const results = [];
        for (let i = 0; i < evaluations.length; i++) {
            const comment = {
                commentUser: '',
                comment05Public: '',
                comment05Private: '',
                comment1Public: '',
                comment1Private: '',
                comment2Public: '',
                comment2Private: '',
            };
            let evaluatorOrder = 0;
            let isEvaluatorException = false;
            const evaluatorOrderList = [];
            const evaluationDetail = evaluations[i];
            if (evaluationDetail) {
                const evaluators = [];
                const findEvaluator = (_a = evaluationDetail.evaluator) === null || _a === void 0 ? void 0 : _a.find((f) => f.evaluatorId === userId);
                if (!isEvaluatorUser) {
                    if (!findEvaluator)
                        isEvaluatorException = true;
                    evaluatorOrder = findEvaluator === null || findEvaluator === void 0 ? void 0 : findEvaluator.evaluationOrder;
                }
                if (evaluationDetail.evaluator &&
                    evaluationDetail.evaluator.length > 0) {
                    const arrays = evaluationDetail.evaluator.sort((a, b) => a.evaluationOrder - b.evaluationOrder);
                    for (const item of arrays) {
                        comment.commentUser = evaluationDetail.commentUser;
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
                const isEvaluationDate = (0, util_1.compareDatePeriod)((_b = evaluationDetail.evaluationPeriod) === null || _b === void 0 ? void 0 : _b.dateEvaluationStart, (_c = evaluationDetail.evaluationPeriod) === null || _c === void 0 ? void 0 : _c.dateEvaluationEnd, timeZone);
                const isEvaluation = [
                    51, 52, 53, 54, 56, 57, 58, 59, 55, 58, 59, 60, 61, 98, 99, 100,
                ].includes(evaluationDetail.status) ||
                    (evaluationDetail.status > 50 && isEvaluationDate);
                const userEvaluationToProSkills = {
                    proSkillList: [],
                };
                let totalPointProSkillUser = 0;
                if (evaluationDetail.evaluationPro) {
                    evaluationDetail.evaluationPro
                        .map((v) => {
                        userEvaluationToProSkills.proSkillList.push(Object.assign({}, v));
                        totalPointProSkillUser =
                            totalPointProSkillUser + v.pointUser || 0;
                    });
                }
                userEvaluationToProSkills.proSkillList.forEach((item) => {
                    item.totalPointUser =
                        item.totalPointUser !== null
                            ? item.pointUser !== null
                                ? item.pointUser + `${' (' + item.totalPointUser + ')'}`
                                : ''
                            : '';
                    item.totalPointEvaluator05 =
                        item.totalPointEvaluator05 !== null
                            ? item.pointEvaluator05 !== null
                                ? item.pointEvaluator05 +
                                    `${' (' + item.totalPointEvaluator05 + ')'}`
                                : ''
                            : '';
                    item.totalPointEvaluator1 =
                        item.totalPointEvaluator1 !== null
                            ? item.pointEvaluator1 !== null
                                ? item.pointEvaluator1 +
                                    `${' (' + item.totalPointEvaluator1 + ')'}`
                                : ''
                            : '';
                    item.totalPointEvaluator2 =
                        item.totalPointEvaluator2 !== null
                            ? item.pointEvaluator2 !== null
                                ? item.pointEvaluator2 +
                                    `${' (' + item.totalPointEvaluator2 + ')'}`
                                : ''
                            : '';
                });
                const userEvaluationAchievements = (_d = evaluationDetail.evaluationAchievementPersonals) === null || _d === void 0 ? void 0 : _d.filter((f) => (f === null || f === void 0 ? void 0 : f.type) === 1);
                const evaluationBasicSkills = [];
                const evaluationBehaviorSkills = [];
                if (evaluationDetail.evaluationBasicBehavior ||
                    evaluationDetail.listBasicPublic ||
                    evaluationDetail.listBehaviorPublic) {
                    const arrays = evaluationDetail.evaluationBasicBehavior;
                    const behaviorType = evaluationDetail.flagSkill === 1 ? 2 : 3;
                    const basics = evaluationDetail.status === 1
                        ? (_e = evaluationDetail.listBasicPublic) === null || _e === void 0 ? void 0 : _e.map((v, i) => (Object.assign(Object.assign({}, v), { itemTitle: v === null || v === void 0 ? void 0 : v.title, itemNo: i })))
                        : arrays === null || arrays === void 0 ? void 0 : arrays.filter((f) => (f === null || f === void 0 ? void 0 : f.type) === 1);
                    const behaviors = evaluationDetail.status === 1
                        ? (_g = (_f = evaluationDetail.listBehaviorPublic) === null || _f === void 0 ? void 0 : _f.map((v, i) => (Object.assign(Object.assign({}, v), { itemTitle: v === null || v === void 0 ? void 0 : v.title, itemNo: i })))) === null || _g === void 0 ? void 0 : _g.filter((f) => (f === null || f === void 0 ? void 0 : f.type) === behaviorType &&
                            (f === null || f === void 0 ? void 0 : f.level) === evaluationDetail.level)
                        : arrays === null || arrays === void 0 ? void 0 : arrays.filter((f) => (f === null || f === void 0 ? void 0 : f.type) === behaviorType);
                    if (basics) {
                        evaluationBasicSkills.push(...basics === null || basics === void 0 ? void 0 : basics.map((v, i) => {
                            const pointUser = v.pointUser !== null
                                ? v.pointUser +
                                    `${' (' +
                                        Number(v.pointUser || 0) * Number(v.difficulty || 0) +
                                        ')'}`
                                : '';
                            const pointEvaluator05 = v.pointEvaluator05 !== null
                                ? v.pointEvaluator05 +
                                    `${' (' +
                                        Number(v.pointEvaluator05 || 0) *
                                            Number(v.difficulty || 0) +
                                        ')'}`
                                : '';
                            const pointEvaluator1 = v.pointEvaluator1 !== null
                                ? v.pointEvaluator1 +
                                    `${' (' +
                                        Number(v.pointEvaluator1 || 0) *
                                            Number(v.difficulty || 0) +
                                        ')'}`
                                : '';
                            const pointEvaluator2 = v.pointEvaluator2 !== null
                                ? v.pointEvaluator2 +
                                    `${' (' +
                                        Number(v.pointEvaluator2 || 0) *
                                            Number(v.difficulty || 0) +
                                        ')'}`
                                : '';
                            return {
                                itemNo: v.itemNo,
                                title: v.itemTitle,
                                content: v.content,
                                difficulty: v.difficulty,
                                key: `basic-1-key-${i}`,
                                pointUser,
                                pointEvaluator05,
                                pointEvaluator1,
                                pointEvaluator2,
                            };
                        }));
                    }
                    if (behaviors) {
                        evaluationBehaviorSkills.push(...behaviors.map((v) => {
                            const pointUser = v.pointUser !== null
                                ? v.pointUser +
                                    `${' (' +
                                        Number(v.pointUser || 0) * Number(v.difficulty || 0) +
                                        ')'}`
                                : '';
                            const pointEvaluator05 = v.pointEvaluator05 !== null
                                ? v.pointEvaluator05 +
                                    `${' (' +
                                        Number(v.pointEvaluator05 || 0) *
                                            Number(v.difficulty || 0) +
                                        ')'}`
                                : '';
                            const pointEvaluator1 = v.pointEvaluator1 !== null
                                ? v.pointEvaluator1 +
                                    `${' (' +
                                        Number(v.pointEvaluator1 || 0) *
                                            Number(v.difficulty || 0) +
                                        ')'}`
                                : '';
                            const pointEvaluator2 = v.pointEvaluator2 !== null
                                ? v.pointEvaluator2 +
                                    `${' (' +
                                        Number(v.pointEvaluator2 || 0) *
                                            Number(v.difficulty || 0) +
                                        ')'}`
                                : '';
                            return {
                                itemNo: v.itemNo,
                                title: v.itemTitle,
                                content: v.content,
                                difficulty: v.difficulty,
                                pointUser,
                                pointEvaluator05,
                                pointEvaluator1,
                                pointEvaluator2,
                            };
                        }));
                    }
                }
                const achievementAdditionals = [];
                if (evaluationDetail.evaluationAchievementAdditional) {
                    const tempAchievementAdditionals = evaluationDetail.evaluationAchievementAdditional.filter((item) => item.type == 1);
                    if (tempAchievementAdditionals.length > 0) {
                        achievementAdditionals.push(...tempAchievementAdditionals.map((v, i) => ({
                            key: `achievement-additional-key-${i}`,
                            itemNo: v.itemNo,
                            titleAdditional: v.titleAdditional,
                            achievementStatus: v.achievementStatus,
                            reasonComment: v.reasonComment,
                            pointUser: v.pointUser,
                            pointEvaluator05: v.pointEvaluator05,
                            pointEvaluator1: v.pointEvaluator1,
                            pointEvaluator2: v.pointEvaluator2,
                        })));
                    }
                }
                if (isEvaluation && evaluatorOrderList.includes(2)) {
                    userEvaluationToProSkills.proSkillList.push({
                        itemId: null,
                        itemTitle: null,
                        itemNo: null,
                        content: '小計',
                        difficulty: null,
                        totalPointUser: evaluationDetail.proTotalPointUser !== null
                            ? evaluationDetail.proTotalPointUser
                            : '',
                        totalPointEvaluator05: evaluationDetail.proTotalPointEvaluator05 !== null
                            ? evaluationDetail.proTotalPointEvaluator05
                            : '',
                        totalPointEvaluator1: evaluationDetail.proTotalPointEvaluator1 !== null
                            ? evaluationDetail.proTotalPointEvaluator1
                            : '',
                        totalPointEvaluator2: evaluationDetail.proTotalPointEvaluator2 !== null
                            ? evaluationDetail.proTotalPointEvaluator2
                            : '',
                        key: `evaluation-pro-skill-totalPointProSkillUser`,
                    });
                    evaluationBasicSkills.push({
                        pointUser: evaluationDetail.basicTotalPointUser !== null
                            ? evaluationDetail.basicTotalPointUser
                            : '',
                        pointEvaluator05: evaluationDetail.basicTotalPointEvaluator05 !== null
                            ? evaluationDetail.basicTotalPointEvaluator05
                            : '',
                        pointEvaluator1: evaluationDetail.basicTotalPointEvaluator1 !== null
                            ? evaluationDetail.basicTotalPointEvaluator1
                            : '',
                        pointEvaluator2: evaluationDetail.basicTotalPointEvaluator2 !== null
                            ? evaluationDetail.basicTotalPointEvaluator2
                            : '',
                        title: null,
                        content: '小計',
                        difficulty: null,
                        key: `basic-1-key-pointUserBasicSkill`,
                    });
                    achievementAdditionals.push({
                        key: `achievement-additional-key-total`,
                        itemNo: null,
                        titleAdditional: null,
                        achievementStatus: null,
                        reasonComment: '小計',
                        pointUser: evaluationDetail.achievementAdditionalTotalPointUser !== null
                            ? Math.floor(evaluationDetail.achievementAdditionalTotalPointUser)
                            : '',
                        pointEvaluator05: evaluationDetail.achievementAdditionalTotalPointEvaluator05 !==
                            null
                            ? Math.floor(evaluationDetail.achievementAdditionalTotalPointEvaluator05)
                            : '',
                        pointEvaluator1: evaluationDetail.achievementAdditionalTotalPointEvaluator1 !==
                            null
                            ? Math.floor(evaluationDetail.achievementAdditionalTotalPointEvaluator1)
                            : '',
                        pointEvaluator2: evaluationDetail.achievementAdditionalTotalPointEvaluator2 !==
                            null
                            ? Math.floor(evaluationDetail.achievementAdditionalTotalPointEvaluator2)
                            : '',
                    });
                    evaluationBehaviorSkills.push({
                        title: null,
                        content: '小計',
                        difficulty: null,
                        pointUser: evaluationDetail.behaviorTotalPointUser,
                        pointEvaluator05: evaluationDetail.behaviorTotalPointEvaluator05,
                        pointEvaluator1: evaluationDetail.behaviorTotalPointEvaluator1,
                        pointEvaluator2: evaluationDetail.behaviorTotalPointEvaluator2,
                    });
                    userEvaluationAchievements === null || userEvaluationAchievements === void 0 ? void 0 : userEvaluationAchievements.push({
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
                        achievementStatus: null,
                        reasonComment: null,
                        actionPlan: '小計',
                        coefficientUser: null,
                        coefficientEvaluator05: null,
                        coefficientEvaluator1: null,
                        coefficientEvaluator2: null,
                        pointUser: (evaluationDetail.achievementPersonalTotalPointUser !==
                            null
                            ? Math.round(evaluationDetail.achievementPersonalTotalPointUser)
                            : ''),
                        pointEvaluator05: (evaluationDetail.achievementPersonalTotalPointEvaluator05 !==
                            null
                            ? Math.round(evaluationDetail.achievementPersonalTotalPointEvaluator05)
                            : ''),
                        pointEvaluator1: (evaluationDetail.achievementPersonalTotalPointEvaluator1 !== null
                            ? Math.round(evaluationDetail.achievementPersonalTotalPointEvaluator1)
                            : ''),
                        pointEvaluator2: (evaluationDetail.achievementPersonalTotalPointEvaluator2 !== null
                            ? Math.round(evaluationDetail.achievementPersonalTotalPointEvaluator2)
                            : ''),
                        childrens: [],
                    });
                }
                const data = Object.assign(Object.assign({ id: evaluationDetail.id, fiscalYear: evaluationDetail.title, periodStart: evaluationDetail.periodStart, periodEnd: evaluationDetail.periodEnd, level: evaluationDetail.level, evaluators, statusName: `statusEvaluation[evaluationDetail.status]`, status: evaluationDetail.status, department: evaluationDetail.departmentName, companyName: evaluationDetail.companyName, employeeNumber: (_h = evaluationDetail.user) === null || _h === void 0 ? void 0 : _h.employeeNumber, fullName: (_j = evaluationDetail.user) === null || _j === void 0 ? void 0 : _j.fullName, guideVersionId: evaluationDetail.guideVersionId, percentPoint: evaluationDetail.percentPoint, evaluatorOrder,
                    evaluatorOrderList, commentUser: evaluationDetail.commentUser, basicTotalPointUser: evaluationDetail.basicTotalPointUser, proTotalPointUser: evaluationDetail.proTotalPointUser, behaviorTotalPointUser: evaluationDetail.behaviorTotalPointUser, achievementPersonalTotalPointUser: evaluationDetail.achievementPersonalTotalPointUser, achievementAdditionalTotalPointUser: evaluationDetail.achievementAdditionalTotalPointUser, basicTotalPointEvaluator05: evaluationDetail.basicTotalPointEvaluator05, proTotalPointEvaluator05: evaluationDetail.proTotalPointEvaluator05, behaviorTotalPointEvaluator05: evaluationDetail.behaviorTotalPointEvaluator05, achievementAdditionalTotalPointEvaluator05: evaluationDetail.achievementAdditionalTotalPointEvaluator05, achievementPersonalTotalPointEvaluator05: evaluationDetail.achievementPersonalTotalPointEvaluator05, basicTotalPointEvaluator1: evaluationDetail.basicTotalPointEvaluator1, proTotalPointEvaluator1: evaluationDetail.proTotalPointEvaluator1, behaviorTotalPointEvaluator1: evaluationDetail.behaviorTotalPointEvaluator1, achievementAdditionalTotalPointEvaluator1: evaluationDetail.achievementAdditionalTotalPointEvaluator1, achievementPersonalTotalPointEvaluator1: evaluationDetail.achievementPersonalTotalPointEvaluator1, basicTotalPointEvaluator2: evaluationDetail.basicTotalPointEvaluator2, proTotalPointEvaluator2: evaluationDetail.proTotalPointEvaluator2, behaviorTotalPointEvaluator2: evaluationDetail.behaviorTotalPointEvaluator2, achievementAdditionalTotalPointEvaluator2: evaluationDetail.achievementAdditionalTotalPointEvaluator2, achievementPersonalTotalPointEvaluator2: evaluationDetail.achievementPersonalTotalPointEvaluator2, pointSettingLevel: {
                        key: 'point-setting-level-key-1',
                        skillPercent: evaluationDetail.skillPercent,
                        behaviorPercent: evaluationDetail.behaviorPercent,
                        achievementPercent: evaluationDetail.achievementPercent,
                        percentPoint: evaluationDetail.percentPoint,
                    } }, userEvaluationToProSkills), { userEvaluationAchievements, dateCreationGoalStart: evaluationDetail.dateCreationGoalStart, dateCreationGoalEnd: evaluationDetail.dateCreationGoalEnd, evaluationPeriod: evaluationDetail.evaluationPeriod, evaluationBasicSkills,
                    evaluationBehaviorSkills,
                    achievementAdditionals, settingProFormulas: [], comment,
                    isEvaluatorException, updateTime: evaluationDetail.updatedTime.toISOString(), isEvaluationDate: isEvaluationDate, isEvaluatorUser, basicProTotalPointUser: evaluationDetail.basicProTotalPointUser, basicProTotalPointEvaluator05: evaluationDetail.basicProTotalPointEvaluator05, basicProTotalPointEvaluator1: evaluationDetail.basicProTotalPointEvaluator1, basicProTotalPointEvaluator2: evaluationDetail.basicProTotalPointEvaluator2, summaryPointUser: evaluationDetail.summaryPointUser, summaryPointEvaluator05: evaluationDetail.summaryPointEvaluator05, summaryPointEvaluator1: evaluationDetail.summaryPointEvaluator1, summaryPointEvaluator2: evaluationDetail.summaryPointEvaluator2, flagSkill: evaluationDetail.flagSkill });
                if (!evaluatorOrderList.includes(2)) {
                    data.isNotEvaluator2 = true;
                }
                results.push(data);
            }
        }
        return results;
    }
    async handleDataEvaluations810Review(evaluations, userId, isEvaluatorUser, timeZone) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
        const results = [];
        for (let i = 0; i < evaluations.length; i++) {
            const comment = {
                commentUser: '',
                comment05Public: '',
                comment05Private: '',
                comment1Public: '',
                comment1Private: '',
                comment2Public: '',
                comment2Private: '',
            };
            let evaluatorOrder = 0;
            let isEvaluatorException = false;
            const evaluatorOrderList = [];
            const evaluationDetail = evaluations[i];
            if (evaluationDetail) {
                const evaluators = [];
                const findEvaluator = (_a = evaluationDetail.evaluator) === null || _a === void 0 ? void 0 : _a.find((f) => f.evaluatorId === userId);
                if (!isEvaluatorUser) {
                    if (!findEvaluator)
                        isEvaluatorException = true;
                    evaluatorOrder = findEvaluator === null || findEvaluator === void 0 ? void 0 : findEvaluator.evaluationOrder;
                }
                if (evaluationDetail.evaluator &&
                    evaluationDetail.evaluator.length > 0) {
                    const arrays = evaluationDetail.evaluator.sort((a, b) => a.evaluationOrder - b.evaluationOrder);
                    for (const item of arrays) {
                        comment.commentUser = evaluationDetail.commentUser;
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
                const isEvaluationDate = (0, util_1.compareDatePeriod)((_b = evaluationDetail.evaluationPeriod) === null || _b === void 0 ? void 0 : _b.dateEvaluationDepartmentStart, (_c = evaluationDetail.evaluationPeriod) === null || _c === void 0 ? void 0 : _c.dateEvaluationDepartmentEnd, timeZone);
                const isEvaluation = [
                    51, 52, 53, 54, 56, 57, 58, 59, 55, 58, 59, 60, 61, 98, 99, 100,
                ].includes(evaluationDetail.status) ||
                    (evaluationDetail.status > 50 && isEvaluationDate);
                const userEvaluationToProSkills = {
                    proSkillList: [],
                };
                let totalPointProSkillUser = 0;
                if (evaluationDetail.evaluationPro) {
                    evaluationDetail.evaluationPro
                        .map((v) => {
                        userEvaluationToProSkills.proSkillList.push(Object.assign({}, v));
                        totalPointProSkillUser =
                            totalPointProSkillUser + v.pointUser || 0;
                    });
                }
                userEvaluationToProSkills.proSkillList.forEach((item) => {
                    item.totalPointUser =
                        item.totalPointUser !== null
                            ? item.pointUser !== null
                                ? item.pointUser + `${' (' + item.totalPointUser + ')'}`
                                : ''
                            : '';
                    item.totalPointEvaluator05 =
                        item.totalPointEvaluator05 !== null
                            ? item.pointEvaluator05 !== null
                                ? item.pointEvaluator05 +
                                    `${' (' + item.totalPointEvaluator05 + ')'}`
                                : ''
                            : '';
                    item.totalPointEvaluator1 =
                        item.totalPointEvaluator1 !== null
                            ? item.pointEvaluator1 !== null
                                ? item.pointEvaluator1 +
                                    `${' (' + item.totalPointEvaluator1 + ')'}`
                                : ''
                            : '';
                    item.totalPointEvaluator2 =
                        item.totalPointEvaluator2 !== null
                            ? item.pointEvaluator2 !== null
                                ? item.pointEvaluator2 +
                                    `${' (' + item.totalPointEvaluator2 + ')'}`
                                : ''
                            : '';
                });
                const userEvaluationAchievementsDepartment = (_d = evaluationDetail.evaluationAchievementPersonals) === null || _d === void 0 ? void 0 : _d.filter((f) => (f === null || f === void 0 ? void 0 : f.type) === 3);
                userEvaluationAchievementsDepartment === null || userEvaluationAchievementsDepartment === void 0 ? void 0 : userEvaluationAchievementsDepartment.forEach((item) => {
                    item.coefficientUser = item.coefficientUser
                        ? Number(item.coefficientUser).toFixed(1)
                        : '';
                    item.coefficientEvaluator05 = item.coefficientEvaluator05
                        ? Number(item.coefficientEvaluator05).toFixed(1)
                        : '';
                    item.coefficientEvaluator1 = item.coefficientEvaluator1
                        ? Number(item.coefficientEvaluator1).toFixed(1)
                        : '';
                    item.coefficientEvaluator2 = item.coefficientEvaluator2
                        ? Number(item.coefficientEvaluator2).toFixed(1)
                        : '';
                });
                const userEvaluationAchievementsPersonal = (_e = evaluationDetail.evaluationAchievementPersonals) === null || _e === void 0 ? void 0 : _e.filter((f) => (f === null || f === void 0 ? void 0 : f.type) === 2);
                const evaluationBasicSkills = [];
                const evaluationBehaviorSkills = [];
                if (evaluationDetail.evaluationBasicBehavior ||
                    evaluationDetail.listBasicPublic ||
                    evaluationDetail.listBehaviorPublic) {
                    const arrays = evaluationDetail.evaluationBasicBehavior;
                    const behaviorType = evaluationDetail.flagSkill === 1 ? 5 : 6;
                    const basics = evaluationDetail.status === 1
                        ? (_f = evaluationDetail.listBasicPublic) === null || _f === void 0 ? void 0 : _f.map((v, i) => (Object.assign(Object.assign({}, v), { itemTitle: v === null || v === void 0 ? void 0 : v.title, itemNo: i })))
                        : arrays === null || arrays === void 0 ? void 0 : arrays.filter((f) => (f === null || f === void 0 ? void 0 : f.type) === 4);
                    const behaviors = evaluationDetail.status === 1
                        ? (_h = (_g = evaluationDetail.listBehaviorPublic) === null || _g === void 0 ? void 0 : _g.map((v, i) => (Object.assign(Object.assign({}, v), { itemTitle: v === null || v === void 0 ? void 0 : v.title, itemNo: i })))) === null || _h === void 0 ? void 0 : _h.filter((f) => (f === null || f === void 0 ? void 0 : f.type) === behaviorType &&
                            (f === null || f === void 0 ? void 0 : f.level) === evaluationDetail.level)
                        : arrays === null || arrays === void 0 ? void 0 : arrays.filter((f) => (f === null || f === void 0 ? void 0 : f.type) === behaviorType);
                    if (basics) {
                        evaluationBasicSkills.push(...basics.map((v, i) => {
                            const pointUser = v.pointUser !== null
                                ? v.pointUser +
                                    `${' (' +
                                        Number(v.pointUser || 0) * Number(v.difficulty || 0) +
                                        ')'}`
                                : '';
                            const pointEvaluator05 = v.pointEvaluator05 !== null
                                ? v.pointEvaluator05 +
                                    `${' (' +
                                        Number(v.pointEvaluator05 || 0) *
                                            Number(v.difficulty || 0) +
                                        ')'}`
                                : '';
                            const pointEvaluator1 = v.pointEvaluator1 !== null
                                ? v.pointEvaluator1 +
                                    `${' (' +
                                        Number(v.pointEvaluator1 || 0) *
                                            Number(v.difficulty || 0) +
                                        ')'}`
                                : '';
                            const pointEvaluator2 = v.pointEvaluator2 !== null
                                ? v.pointEvaluator2 +
                                    `${' (' +
                                        Number(v.pointEvaluator2 || 0) *
                                            Number(v.difficulty || 0) +
                                        ')'}`
                                : '';
                            return {
                                itemNo: v.itemNo,
                                title: v.itemTitle,
                                content: v.content,
                                difficulty: v.difficulty,
                                key: `basic-1-key-${i}`,
                                pointUser,
                                pointEvaluator05,
                                pointEvaluator1,
                                pointEvaluator2,
                            };
                        }));
                    }
                    if (behaviors) {
                        evaluationBehaviorSkills.push(...behaviors.map((v) => {
                            const pointUser = v.pointUser !== null
                                ? v.pointUser +
                                    `${' (' +
                                        Number(v.pointUser || 0) * Number(v.difficulty || 0) +
                                        ')'}`
                                : '';
                            const pointEvaluator05 = v.pointEvaluator05 !== null
                                ? v.pointEvaluator05 +
                                    `${' (' +
                                        Number(v.pointEvaluator05 || 0) *
                                            Number(v.difficulty || 0) +
                                        ')'}`
                                : '';
                            const pointEvaluator1 = v.pointEvaluator1 !== null
                                ? v.pointEvaluator1 +
                                    `${' (' +
                                        Number(v.pointEvaluator1 || 0) *
                                            Number(v.difficulty || 0) +
                                        ')'}`
                                : '';
                            const pointEvaluator2 = v.pointEvaluator2 !== null
                                ? v.pointEvaluator2 +
                                    `${' (' +
                                        Number(v.pointEvaluator2 || 0) *
                                            Number(v.difficulty || 0) +
                                        ')'}`
                                : '';
                            return {
                                itemNo: v.itemNo,
                                title: v.itemTitle,
                                content: v.content,
                                difficulty: v.difficulty,
                                pointUser,
                                pointEvaluator05,
                                pointEvaluator1,
                                pointEvaluator2,
                            };
                        }));
                    }
                }
                const achievementAdditionalsDepartment = [];
                if (evaluationDetail.evaluationAchievementAdditional) {
                    const tempAchievementAdditionalsDepartment = evaluationDetail.evaluationAchievementAdditional.filter((item) => item.type == 3);
                    if (tempAchievementAdditionalsDepartment.length > 0) {
                        achievementAdditionalsDepartment.push(...tempAchievementAdditionalsDepartment.map((v, i) => ({
                            key: `achievement-additional-department-key-${i}`,
                            itemNo: v.itemNo,
                            titleAdditional: v.titleAdditional,
                            achievementStatus: v.achievementStatus,
                            reasonComment: v.reasonComment,
                            pointUser: v.pointUser,
                            pointEvaluator05: v.pointEvaluator05,
                            pointEvaluator1: v.pointEvaluator1,
                            pointEvaluator2: v.pointEvaluator2,
                        })));
                    }
                }
                const achievementAdditionalsPersonal = [];
                if (evaluationDetail.evaluationAchievementAdditional) {
                    const tempAchievementAdditionalsPersonal = evaluationDetail.evaluationAchievementAdditional.filter((item) => item.type == 2);
                    if (tempAchievementAdditionalsPersonal.length > 0) {
                        achievementAdditionalsPersonal.push(...tempAchievementAdditionalsPersonal.map((v, i) => ({
                            key: `achievement-additional-personal-key-${i}`,
                            itemNo: v.itemNo,
                            titleAdditional: v.titleAdditional,
                            achievementStatus: v.achievementStatus,
                            reasonComment: v.reasonComment,
                            pointUser: v.pointUser,
                            pointEvaluator05: v.pointEvaluator05,
                            pointEvaluator1: v.pointEvaluator1,
                            pointEvaluator2: v.pointEvaluator2,
                        })));
                    }
                }
                if (isEvaluation && evaluatorOrderList.includes(2)) {
                    userEvaluationToProSkills.proSkillList.push({
                        itemId: null,
                        itemTitle: null,
                        itemNo: null,
                        content: '小計',
                        difficulty: null,
                        totalPointUser: evaluationDetail.proTotalPointUser,
                        totalPointEvaluator05: evaluationDetail.proTotalPointEvaluator05,
                        totalPointEvaluator1: evaluationDetail.proTotalPointEvaluator1,
                        totalPointEvaluator2: evaluationDetail.proTotalPointEvaluator2,
                        key: `evaluation-pro-skill-totalPointProSkillUser`,
                    });
                    evaluationBasicSkills.push({
                        pointUser: evaluationDetail.basicTotalPointUser,
                        pointEvaluator05: evaluationDetail.basicTotalPointEvaluator05,
                        pointEvaluator1: evaluationDetail.basicTotalPointEvaluator1,
                        pointEvaluator2: evaluationDetail.basicTotalPointEvaluator2,
                        title: null,
                        content: '小計',
                        difficulty: null,
                        key: `basic-1-key-pointUserBasicSkill`,
                    });
                    achievementAdditionalsDepartment.push({
                        key: `achievement-additional-department-key-total`,
                        itemNo: null,
                        titleAdditional: null,
                        achievementStatus: null,
                        reasonComment: '小計',
                        pointUser: evaluationDetail.summaryDepartment == null
                            ? null
                            : evaluationDetail.summaryDepartment
                                .achievementAdditionalTotalPointUser !== null
                                ? Pdf810Helper_1.Pdf810Helper.get2WithoutRound(evaluationDetail.summaryDepartment
                                    .achievementAdditionalTotalPointUser)
                                : '',
                        pointEvaluator05: evaluationDetail.summaryDepartment == null
                            ? null
                            : evaluationDetail.summaryDepartment
                                .achievementAdditionalTotalPointEvaluator05 !== null
                                ? Pdf810Helper_1.Pdf810Helper.get2WithoutRound(evaluationDetail.summaryDepartment
                                    .achievementAdditionalTotalPointEvaluator05)
                                : '',
                        pointEvaluator1: evaluationDetail.summaryDepartment == null
                            ? null
                            : evaluationDetail.summaryDepartment
                                .achievementAdditionalTotalPointEvaluator1 !== null
                                ? Pdf810Helper_1.Pdf810Helper.get2WithoutRound(evaluationDetail.summaryDepartment
                                    .achievementAdditionalTotalPointEvaluator1)
                                : '',
                        pointEvaluator2: evaluationDetail.summaryDepartment == null
                            ? null
                            : evaluationDetail.summaryDepartment
                                .achievementAdditionalTotalPointEvaluator2 !== null
                                ? Pdf810Helper_1.Pdf810Helper.get2WithoutRound(evaluationDetail.summaryDepartment
                                    .achievementAdditionalTotalPointEvaluator2)
                                : '',
                    });
                    achievementAdditionalsPersonal.push({
                        key: `achievement-additional-personal-key-total`,
                        itemNo: null,
                        titleAdditional: null,
                        achievementStatus: null,
                        reasonComment: '小計',
                        pointUser: evaluationDetail.achievementAdditionalTotalPointUser !== null
                            ? Math.floor(evaluationDetail.achievementAdditionalTotalPointUser)
                            : '',
                        pointEvaluator05: evaluationDetail.achievementAdditionalTotalPointEvaluator05 !==
                            null
                            ? Math.floor(evaluationDetail.achievementAdditionalTotalPointEvaluator05)
                            : '',
                        pointEvaluator1: evaluationDetail.achievementAdditionalTotalPointEvaluator1 !==
                            null
                            ? Math.floor(evaluationDetail.achievementAdditionalTotalPointEvaluator1)
                            : '',
                        pointEvaluator2: evaluationDetail.achievementAdditionalTotalPointEvaluator2 !==
                            null
                            ? Math.floor(evaluationDetail.achievementAdditionalTotalPointEvaluator2)
                            : '',
                    });
                    evaluationBehaviorSkills.push({
                        title: null,
                        content: '小計',
                        difficulty: null,
                        pointUser: evaluationDetail.behaviorTotalPointUser,
                        pointEvaluator05: evaluationDetail.behaviorTotalPointEvaluator05,
                        pointEvaluator1: evaluationDetail.behaviorTotalPointEvaluator1,
                        pointEvaluator2: evaluationDetail.behaviorTotalPointEvaluator2,
                    });
                    userEvaluationAchievementsDepartment === null || userEvaluationAchievementsDepartment === void 0 ? void 0 : userEvaluationAchievementsDepartment.push({
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
                        achievementStatus: null,
                        reasonComment: null,
                        actionPlan: '小計',
                        pointUser: null,
                        pointEvaluator05: null,
                        pointEvaluator1: null,
                        pointEvaluator2: null,
                        coefficientUser: (evaluationDetail.summaryDepartment == null
                            ? null
                            : evaluationDetail.summaryDepartment
                                .achievementPersonalTotalPointUser
                                ? Number(evaluationDetail.summaryDepartment
                                    .achievementPersonalTotalPointUser).toFixed(2)
                                : ''),
                        coefficientEvaluator05: (evaluationDetail.summaryDepartment == null
                            ? null
                            : evaluationDetail.summaryDepartment
                                .achievementPersonalTotalPointEvaluator05
                                ? Number(evaluationDetail.summaryDepartment
                                    .achievementPersonalTotalPointEvaluator05).toFixed(2)
                                : ''),
                        coefficientEvaluator1: (evaluationDetail.summaryDepartment == null
                            ? null
                            : evaluationDetail.summaryDepartment
                                .achievementPersonalTotalPointEvaluator1
                                ? Number(evaluationDetail.summaryDepartment
                                    .achievementPersonalTotalPointEvaluator1).toFixed(2)
                                : ''),
                        coefficientEvaluator2: (evaluationDetail.summaryDepartment == null
                            ? null
                            : evaluationDetail.summaryDepartment
                                .achievementPersonalTotalPointEvaluator2
                                ? Number(evaluationDetail.summaryDepartment
                                    .achievementPersonalTotalPointEvaluator2).toFixed(2)
                                : ''),
                        childrens: [],
                    });
                    userEvaluationAchievementsPersonal === null || userEvaluationAchievementsPersonal === void 0 ? void 0 : userEvaluationAchievementsPersonal.push({
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
                        achievementStatus: null,
                        reasonComment: null,
                        actionPlan: '小計',
                        coefficientUser: null,
                        coefficientEvaluator05: null,
                        coefficientEvaluator1: null,
                        coefficientEvaluator2: null,
                        pointUser: (evaluationDetail.achievementPersonalTotalPointUser !==
                            null
                            ? Math.round(evaluationDetail.achievementPersonalTotalPointUser)
                            : ''),
                        pointEvaluator05: (evaluationDetail.achievementPersonalTotalPointEvaluator05 !==
                            null
                            ? Math.round(evaluationDetail.achievementPersonalTotalPointEvaluator05)
                            : ''),
                        pointEvaluator1: (evaluationDetail.achievementPersonalTotalPointEvaluator1 !== null
                            ? Math.round(evaluationDetail.achievementPersonalTotalPointEvaluator1)
                            : ''),
                        pointEvaluator2: (evaluationDetail.achievementPersonalTotalPointEvaluator2 !== null
                            ? Math.round(evaluationDetail.achievementPersonalTotalPointEvaluator2)
                            : ''),
                        childrens: [],
                    });
                }
                const data = Object.assign(Object.assign({ id: evaluationDetail.id, fiscalYear: evaluationDetail.title, periodStart: evaluationDetail.periodStart, periodEnd: evaluationDetail.periodEnd, level: evaluationDetail.level, evaluators, statusName: `statusEvaluation[evaluationDetail.status]`, status: evaluationDetail.status, department: evaluationDetail.divisionName, companyName: evaluationDetail.companyName, employeeNumber: (_j = evaluationDetail.user) === null || _j === void 0 ? void 0 : _j.employeeNumber, fullName: (_k = evaluationDetail.user) === null || _k === void 0 ? void 0 : _k.fullName, guideVersionId: evaluationDetail.guideVersionId, percentPoint: evaluationDetail.percentPoint, evaluatorOrder,
                    evaluatorOrderList, commentUser: evaluationDetail.commentUser, basicTotalPointUser: evaluationDetail.basicTotalPointUser, proTotalPointUser: evaluationDetail.proTotalPointUser, behaviorTotalPointUser: evaluationDetail.behaviorTotalPointUser, achievementPersonalTotalPointUser: evaluationDetail.achievementPersonalTotalPointUser, achievementAdditionalTotalPointUser: evaluationDetail.achievementAdditionalTotalPointUser, achievementDepartmentTotalPointUser: evaluationDetail.summaryDepartment == null
                        ? null
                        : (_l = evaluationDetail.summaryDepartment) === null || _l === void 0 ? void 0 : _l.achievementPersonalTotalPointUser, achievementAdditionalDepartmentTotalPointUser: evaluationDetail.summaryDepartment == null
                        ? null
                        : (_m = evaluationDetail.summaryDepartment) === null || _m === void 0 ? void 0 : _m.achievementAdditionalTotalPointUser, basicTotalPointEvaluator05: evaluationDetail.basicTotalPointEvaluator05, proTotalPointEvaluator05: evaluationDetail.proTotalPointEvaluator05, behaviorTotalPointEvaluator05: evaluationDetail.behaviorTotalPointEvaluator05, achievementAdditionalTotalPointEvaluator05: evaluationDetail.achievementAdditionalTotalPointEvaluator05, achievementPersonalTotalPointEvaluator05: evaluationDetail.achievementPersonalTotalPointEvaluator05, achievementAdditionalDepartmentTotalPointEvaluator05: evaluationDetail.summaryDepartment == null
                        ? null
                        : (_o = evaluationDetail.summaryDepartment) === null || _o === void 0 ? void 0 : _o.achievementAdditionalTotalPointEvaluator05, achievementDepartmentTotalPointEvaluator05: evaluationDetail.summaryDepartment == null
                        ? null
                        : (_p = evaluationDetail.summaryDepartment) === null || _p === void 0 ? void 0 : _p.achievementPersonalTotalPointEvaluator05, basicTotalPointEvaluator1: evaluationDetail.basicTotalPointEvaluator1, proTotalPointEvaluator1: evaluationDetail.proTotalPointEvaluator1, behaviorTotalPointEvaluator1: evaluationDetail.behaviorTotalPointEvaluator1, achievementAdditionalTotalPointEvaluator1: evaluationDetail.achievementAdditionalTotalPointEvaluator1, achievementPersonalTotalPointEvaluator1: evaluationDetail.achievementPersonalTotalPointEvaluator1, achievementAdditionalDepartmentTotalPointEvaluator1: evaluationDetail.summaryDepartment == null
                        ? null
                        : (_q = evaluationDetail.summaryDepartment) === null || _q === void 0 ? void 0 : _q.achievementAdditionalTotalPointEvaluator1, achievementDepartmentTotalPointEvaluator1: evaluationDetail.summaryDepartment == null
                        ? null
                        : (_r = evaluationDetail.summaryDepartment) === null || _r === void 0 ? void 0 : _r.achievementPersonalTotalPointEvaluator1, basicTotalPointEvaluator2: evaluationDetail.basicTotalPointEvaluator2, proTotalPointEvaluator2: evaluationDetail.proTotalPointEvaluator2, behaviorTotalPointEvaluator2: evaluationDetail.behaviorTotalPointEvaluator2, achievementAdditionalTotalPointEvaluator2: evaluationDetail.achievementAdditionalTotalPointEvaluator2, achievementPersonalTotalPointEvaluator2: evaluationDetail.achievementPersonalTotalPointEvaluator2, achievementAdditionalDepartmentTotalPointEvaluator2: evaluationDetail.summaryDepartment == null
                        ? null
                        : (_s = evaluationDetail.summaryDepartment) === null || _s === void 0 ? void 0 : _s.achievementAdditionalTotalPointEvaluator2, achievementDepartmentTotalPointEvaluator2: evaluationDetail.summaryDepartment == null
                        ? null
                        : evaluationDetail.summaryDepartment
                            .achievementPersonalTotalPointEvaluator2, pointSettingLevel: {
                        key: 'point-setting-level-key-1',
                        skillPercent: evaluationDetail.skillPercent,
                        behaviorPercent: evaluationDetail.behaviorPercent,
                        achievementPercent: evaluationDetail.achievementPercent,
                        percentPoint: evaluationDetail.percentPoint,
                    } }, userEvaluationToProSkills), { userEvaluationAchievementsDepartment,
                    userEvaluationAchievementsPersonal, dateCreationGoalStart: evaluationDetail.dateCreationGoalStart, dateCreationGoalEnd: evaluationDetail.dateCreationGoalEnd, evaluationPeriod: evaluationDetail.evaluationPeriod, evaluationBasicSkills,
                    evaluationBehaviorSkills,
                    achievementAdditionalsDepartment,
                    achievementAdditionalsPersonal, settingProFormulas: [], comment,
                    isEvaluatorException, updateTime: evaluationDetail.updatedTime.toISOString(), isEvaluationDate: isEvaluationDate, isEvaluatorUser, basicProTotalPointUser: evaluationDetail.basicProTotalPointUser, basicProTotalPointEvaluator05: evaluationDetail.basicProTotalPointEvaluator05, basicProTotalPointEvaluator1: evaluationDetail.basicProTotalPointEvaluator1, basicProTotalPointEvaluator2: evaluationDetail.basicProTotalPointEvaluator2, summaryPointUser: evaluationDetail.summaryPointUser, summaryPointEvaluator05: evaluationDetail.summaryPointEvaluator05, summaryPointEvaluator1: evaluationDetail.summaryPointEvaluator1, summaryPointEvaluator2: evaluationDetail.summaryPointEvaluator2, summaryDepartmentPointUser: evaluationDetail.summaryDepartment == null
                        ? null
                        : (_t = evaluationDetail.summaryDepartment) === null || _t === void 0 ? void 0 : _t.summaryPointUser, summaryDepartmentPointEvaluator05: evaluationDetail.summaryDepartment == null
                        ? null
                        : (_u = evaluationDetail.summaryDepartment) === null || _u === void 0 ? void 0 : _u.summaryPointEvaluator05, summaryDepartmentPointEvaluator1: evaluationDetail.summaryDepartment == null
                        ? null
                        : (_v = evaluationDetail.summaryDepartment) === null || _v === void 0 ? void 0 : _v.summaryPointEvaluator1, summaryDepartmentPointEvaluator2: evaluationDetail.summaryDepartment == null
                        ? null
                        : (_w = evaluationDetail.summaryDepartment) === null || _w === void 0 ? void 0 : _w.summaryPointEvaluator2, summaryCharPointUser: evaluationDetail.summaryDepartment == null
                        ? null
                        : (_x = evaluationDetail.summaryDepartment) === null || _x === void 0 ? void 0 : _x.summaryCharPointUser, summaryCharPointEvaluator05: evaluationDetail.summaryDepartment == null
                        ? null
                        : (_y = evaluationDetail.summaryDepartment) === null || _y === void 0 ? void 0 : _y.summaryCharPointEvaluator05, summaryCharPointEvaluator1: evaluationDetail.summaryDepartment == null
                        ? null
                        : (_z = evaluationDetail.summaryDepartment) === null || _z === void 0 ? void 0 : _z.summaryCharPointEvaluator1, summaryCharPointEvaluator2: evaluationDetail.summaryDepartment == null
                        ? null
                        : (_0 = evaluationDetail.summaryDepartment) === null || _0 === void 0 ? void 0 : _0.summaryCharPointEvaluator2, flagSkill: evaluationDetail.flagSkill });
                if (!evaluatorOrderList.includes(2)) {
                    data.isNotEvaluator2 = true;
                }
                results.push(data);
            }
        }
        return results;
    }
    async exportPDFMultiLevel(userId, idList17, idList810, role, isF5, companyGroupCode, timeZone) {
        const evaluation17s = await this.reportRepo.getDataPDF1_7(idList17, userId, false, companyGroupCode);
        const processDataEvaluations17 = await this.handleDataEvaluations17Review(evaluation17s.evaluations, userId, true, timeZone);
        const evaluation810s = await this.evaluationRepository.getDataPDF8_10(idList810, userId, false, companyGroupCode);
        const processDataEvaluations810 = await this.handleDataEvaluations810Review(evaluation810s.evaluations, userId, true, timeZone);
        const mergedEvaluationList = Object.values([...processDataEvaluations17, ...processDataEvaluations810].reduce((r, o) => ((r[o.id] = o), r), {})).sort((l, r) => {
            const dateL = new Date(`${l.periodStart}/01`);
            const dateR = new Date(`${r.periodStart}/01`);
            return dateR.getTime() - dateL.getTime();
        });
        let results = null;
        results = await this.pdfReviewService.exportPDFMultiLevel(mergedEvaluationList, isF5);
        return results;
    }
};
__decorate([
    (0, common_1.Inject)(evaluation_repository_1.EvaluationRepository),
    __metadata("design:type", evaluation_repository_1.EvaluationRepository)
], ReportService.prototype, "evaluationRepository", void 0);
__decorate([
    (0, common_1.Inject)(report_repository_1.ReportRepository),
    __metadata("design:type", report_repository_1.ReportRepository)
], ReportService.prototype, "reportRepo", void 0);
__decorate([
    (0, common_1.Inject)(pdf_service_1.PdfService),
    __metadata("design:type", pdf_service_1.PdfService)
], ReportService.prototype, "pdfService", void 0);
__decorate([
    (0, common_1.Inject)(pdf_review_service_1.PdfReviewService),
    __metadata("design:type", pdf_review_service_1.PdfReviewService)
], ReportService.prototype, "pdfReviewService", void 0);
__decorate([
    (0, common_1.Inject)(user_repository_1.UserRepository),
    __metadata("design:type", user_repository_1.UserRepository)
], ReportService.prototype, "userRepo", void 0);
ReportService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST })
], ReportService);
exports.ReportService = ReportService;
//# sourceMappingURL=report.service.js.map