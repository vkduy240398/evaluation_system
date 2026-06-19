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
exports.PdfReviewService = void 0;
const common_1 = require("@nestjs/common");
const achievementAdditionalTablePdf_1 = require("../common/business/pdf/achievementAdditionalTablePdf");
const achievementTablePdf_1 = require("../common/business/pdf/achievementTablePdf");
const basicTablePdf_1 = require("../common/business/pdf/basicTablePdf");
const proSkillTablePdf_1 = require("../common/business/pdf/proSkillTablePdf");
const totalTablePdf_1 = require("../common/business/pdf/totalTablePdf");
const Pdf810Helper_1 = require("../common/pdf/Pdf810Helper");
const Pdf810Helper3_1 = require("../common/pdf/Pdf810Helper3");
let PdfReviewService = class PdfReviewService {
    constructor() {
    }
    exportEvaluationDetailForPdfReview17(evaluation, isF5) {
        let results = [];
        results.push(this.dataReportReview17(evaluation, isF5));
        return {
            dataReview: results,
            fileName: `【${evaluation.fiscalYear}】${evaluation.fullName}評価表.pdf`,
        };
    }
    async exportEvaluationDetailForPdfReview810(evaluation, isF5) {
        let results = [];
        results.push(this.dataReportReview810(evaluation, isF5));
        return {
            dataReview: results,
            fileName: `【${evaluation.fiscalYear}】${evaluation.fullName}評価表.pdf`,
        };
    }
    getDataTotal810(evaluation, isDisplayEvaluator05, isDisplayEvaluator1, isDisplayEvaluator2) {
        let result = [];
        result.push({
            title: '本人',
            achievementPersonalTotalPoint: evaluation.achievementDepartmentTotalPointUser !== null
                ? Number(evaluation.achievementDepartmentTotalPointUser).toFixed(2)
                : '',
            achievementAdditionalTotalPoint: evaluation.achievementAdditionalDepartmentTotalPointUser !== null
                ? Pdf810Helper_1.Pdf810Helper.get2WithoutRound(evaluation.achievementAdditionalDepartmentTotalPointUser)
                : '',
            summaryPoint: evaluation.summaryDepartmentPointUser !== null
                ? evaluation.summaryDepartmentPointUser
                : '',
            summaryCharPoint: evaluation.summaryCharPointUser !== null
                ? evaluation.summaryCharPointUser
                : '',
        });
        if (isDisplayEvaluator05) {
            result.push({
                title: '仮評価',
                achievementPersonalTotalPoint: evaluation.achievementDepartmentTotalPointEvaluator05 !== null
                    ? Number(evaluation.achievementDepartmentTotalPointEvaluator05).toFixed(2)
                    : '',
                achievementAdditionalTotalPoint: evaluation.achievementAdditionalDepartmentTotalPointEvaluator05 !==
                    null
                    ? Pdf810Helper_1.Pdf810Helper.get2WithoutRound(evaluation.achievementAdditionalDepartmentTotalPointEvaluator05)
                    : '',
                summaryPoint: evaluation.summaryDepartmentPointEvaluator05 !== null
                    ? evaluation.summaryDepartmentPointEvaluator05
                    : '',
                summaryCharPoint: evaluation.summaryCharPointEvaluator05 !== null
                    ? evaluation.summaryCharPointEvaluator05
                    : '',
            });
        }
        if (isDisplayEvaluator1) {
            result.push({
                title: '一次評価',
                achievementPersonalTotalPoint: evaluation.achievementDepartmentTotalPointEvaluator1 !== null
                    ? Number(evaluation.achievementDepartmentTotalPointEvaluator1).toFixed(2)
                    : '',
                achievementAdditionalTotalPoint: evaluation.achievementAdditionalDepartmentTotalPointEvaluator1 !==
                    null
                    ? Pdf810Helper_1.Pdf810Helper.get2WithoutRound(evaluation.achievementAdditionalDepartmentTotalPointEvaluator1)
                    : '',
                summaryPoint: evaluation.summaryDepartmentPointEvaluator1 !== null
                    ? evaluation.summaryDepartmentPointEvaluator1
                    : '',
                summaryCharPoint: evaluation.summaryCharPointEvaluator1 !== null
                    ? evaluation.summaryCharPointEvaluator1
                    : '',
            });
        }
        if (isDisplayEvaluator2) {
            result.push({
                title: '二次評価',
                achievementPersonalTotalPoint: evaluation.achievementDepartmentTotalPointEvaluator2 !== null
                    ? Number(evaluation.achievementDepartmentTotalPointEvaluator2).toFixed(2)
                    : '',
                achievementAdditionalTotalPoint: evaluation.achievementAdditionalDepartmentTotalPointEvaluator2 !==
                    null
                    ? Pdf810Helper_1.Pdf810Helper.get2WithoutRound(evaluation.achievementAdditionalDepartmentTotalPointEvaluator2)
                    : '',
                summaryPoint: evaluation.summaryDepartmentPointEvaluator2 !== null
                    ? evaluation.summaryDepartmentPointEvaluator2
                    : '',
                summaryCharPoint: evaluation.summaryCharPointEvaluator2 !== null
                    ? evaluation.summaryCharPointEvaluator2
                    : '',
            });
        }
        return result;
    }
    departmentTargetTable(titleTale, data, subList) {
        let dataSource = [];
        if (data.length) {
            data.forEach((el) => {
                dataSource.push({
                    title: el.title || '',
                    achievementValue: el.achievementValue || '',
                    method: el.method || '',
                    weight: el.weight || 0,
                    difficultyUser: el.difficultyUser
                        ? Number(el.difficultyUser).toFixed(1)
                        : '',
                    difficultyEvaluator2: el.difficultyEvaluator2
                        ? Number(el.difficultyEvaluator2).toFixed(1)
                        : '',
                    subList: Pdf810Helper3_1.Pdf810Helper3.getSubListData(el, subList),
                });
            });
        }
        else {
            dataSource = [];
        }
        const sublists = !(dataSource === null || dataSource === void 0 ? void 0 : dataSource.length)
            ? [[]]
            : dataSource.reduce((result, item) => {
                const key = item.city;
                let sublist = result.find((sub) => sub[0].title === key);
                if (!sublist) {
                    sublist = [];
                    result.push(sublist);
                }
                sublist.push(item);
                return result;
            }, []);
        const departmentTargetTable = {
            titleTable: titleTale,
            dataSource: sublists,
        };
        return departmentTargetTable;
    }
    departmentAchievementtable(titleTale, data) {
        const dataSource = [];
        data.evaluationAchievementPersonals.map((el) => {
            const list = {
                achievementStatus: el.achievementStatus || '',
                reasonComment: el.reasonComment || '',
                actionPlan: el.actionPlan || '',
                pointEvaluator2: el.pointEvaluator2 || '',
                coefficientEvaluator2: el.coefficientEvaluator2
                    ? Number(el.coefficientEvaluator2).toFixed(1)
                    : '',
            };
            dataSource.push(list);
        });
        dataSource.push({
            actionPlan: `小計`,
            coefficientEvaluator2: !isNaN(Number(data.achievementPersonalTotalPointEvaluator2))
                ? Number(data.achievementPersonalTotalPointEvaluator2).toFixed(2)
                : '',
        });
        const departmentAchievementtable = {
            titleTable: titleTale,
            dataSource: dataSource,
        };
        return departmentAchievementtable;
    }
    additionalTable(titleTale, data) {
        var _a;
        let dataSource = [];
        if (Pdf810Helper_1.Pdf810Helper.getAdditionalTableData(data).length > 1) {
            data.evaluationAchievementAdditional.map((el) => {
                const list = {
                    titleAdditional: el.titleAdditional || '',
                    achievementStatus: el.achievementStatus || '',
                    reasonComment: el.reasonComment || '',
                    pointEvaluator2: el.pointEvaluator2 || '',
                };
                dataSource.push(list);
            });
            dataSource.push({
                reasonComment: '小計',
                pointEvaluator2: (_a = Pdf810Helper_1.Pdf810Helper.get2WithoutRound(data.achievementAdditionalTotalPointEvaluator2)) !== null && _a !== void 0 ? _a : '',
            });
        }
        else {
            dataSource = [];
        }
        const additionalTable = {
            titleTable: titleTale,
            dataSource: dataSource,
        };
        return additionalTable;
    }
    dataReportReview810(evaluation, isF5) {
        var _a, _b, _c, _d, _e;
        const finalData = [];
        const header = this.headerPdf(Object.assign({}, evaluation));
        const { status, isEvaluationDate, evaluatorOrderList, isEvaluatorUser, isEvaluatorException, evaluatorOrder, } = evaluation;
        const skillPercent = ((_a = evaluation === null || evaluation === void 0 ? void 0 : evaluation.pointSettingLevel) === null || _a === void 0 ? void 0 : _a.skillPercent) || 0;
        const behaviorPercent = ((_b = evaluation === null || evaluation === void 0 ? void 0 : evaluation.pointSettingLevel) === null || _b === void 0 ? void 0 : _b.behaviorPercent) || 0;
        const achievementPercent = ((_c = evaluation === null || evaluation === void 0 ? void 0 : evaluation.pointSettingLevel) === null || _c === void 0 ? void 0 : _c.achievementPercent) || 0;
        const percent100 = parseInt(skillPercent) +
            parseInt(behaviorPercent) +
            parseInt(achievementPercent);
        const isDisplayComponent810 = percent100 == 100 ? true : false;
        const isDisplayUser = [51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 98, 99, 100].includes(status) ||
            (status === 50 && isEvaluationDate);
        const isDisplayEvaluator05 = ([54, 55, 56, 57, 58, 59, 60, 61, 98, 99].includes(status) &&
            evaluatorOrderList.some((s) => Number(s) === 0.5) &&
            !isEvaluatorUser) ||
            (status === 100 && evaluatorOrderList.some((s) => Number(s) === 0.5)) ||
            ([54, 55, 56, 57, 58, 59, 60, 61, 98, 99].includes(status) &&
                isEvaluatorException &&
                !isF5) ||
            (evaluatorOrderList.some((s) => Number(s) === 0.5) &&
                [54, 55, 56, 57, 58, 59, 60, 61, 98, 99].includes(status) &&
                (isF5 || false));
        const isDisplayEvaluator1 = ([57, 58, 59, 60, 61, 98, 99].includes(status) &&
            evaluatorOrderList.some((s) => Number(s) === 1) &&
            [1, 2].includes(Number(evaluatorOrder)) &&
            !isEvaluatorUser) ||
            (status === 100 && evaluatorOrderList.some((s) => Number(s) === 1)) ||
            ([57, 58, 59, 60, 61, 98, 99].includes(status) &&
                isEvaluatorException &&
                !isF5) ||
            (evaluatorOrderList.some((s) => Number(s) === 1) &&
                [57, 58, 59, 60, 61, 98, 99].includes(status) &&
                (isF5 || false));
        const isDisplayEvaluator2 = ([60, 61, 98, 99].includes(status) &&
            evaluatorOrderList.some((s) => Number(s) === 2) &&
            Number(evaluatorOrder) === 2 &&
            !isEvaluatorUser) ||
            (status === 100 && evaluatorOrderList.some((s) => Number(s) === 2)) ||
            ([60, 61, 98, 99].includes(status) && isEvaluatorException && !isF5) ||
            (evaluatorOrderList.some((s) => Number(s) === 2) &&
                [60, 61, 98, 99].includes(status) &&
                (isF5 || false));
        const haveSkill = evaluation.flagSkill === 1;
        const totalTable = this.totalTable(evaluation, isDisplayEvaluator05, isDisplayEvaluator1, isDisplayEvaluator2);
        let dataTotalDepartment;
        if ((evaluation.status === 50 && evaluation.isEvaluationDate) ||
            evaluation.status > 50) {
            dataTotalDepartment = this.getDataTotal810(evaluation, isDisplayEvaluator05, isDisplayEvaluator1, isDisplayEvaluator2);
        }
        const departmentalGoalsMain = this.achievementPersonalMainTable((evaluation.status === 50 && evaluation.isEvaluationDate) ||
            evaluation.status > 50
            ? '部門成果'
            : '部門目標', (_d = evaluation.userEvaluationAchievementsDepartment) === null || _d === void 0 ? void 0 : _d.entries());
        let achievementAdditionalDepartment;
        let achievementAdditionalPersonal;
        let commentUser;
        let commentEvaluator05;
        let commentEvaluator1;
        let commentEvaluator2;
        const personalGoalsMain = this.achievementPersonalMainTable((evaluation.status === 50 && evaluation.isEvaluationDate) ||
            evaluation.status > 50
            ? '個人成果'
            : '個人目標', (_e = evaluation.userEvaluationAchievementsPersonal) === null || _e === void 0 ? void 0 : _e.entries());
        const behaviorTable = this.basicBehaviorSkillTable('行動・情意', evaluation.evaluationBehaviorSkills, status);
        if ((evaluation.status === 50 && evaluation.isEvaluationDate) ||
            evaluation.status > 50) {
            achievementAdditionalDepartment = this.achievementAdditionalTable('部門追加目標／成果', evaluation.achievementAdditionalsDepartment);
            achievementAdditionalPersonal = this.achievementAdditionalTable('個人追加目標／成果', evaluation.achievementAdditionalsPersonal);
            commentUser = evaluation.comment.commentUser || '該当データがありません';
            commentEvaluator05 =
                evaluation.comment.comment05Public || '該当データがありません';
            commentEvaluator1 =
                evaluation.comment.comment1Public || '該当データがありません';
            commentEvaluator2 =
                evaluation.comment.comment2Public || '該当データがありません';
        }
        if (haveSkill) {
            const basicSkillTable = this.basicBehaviorSkillTable('基本スキル', evaluation.evaluationBasicSkills, status);
            const proSkillTable = this.proSkillTable('専門スキル', evaluation.proSkillList, status);
            finalData.push({
                isDisplayComponent810: isDisplayComponent810,
                isDisplayUser: isDisplayUser,
                isDisplayEvaluator05: isDisplayEvaluator05,
                isDisplayEvaluator1: isDisplayEvaluator1,
                isDisplayEvaluator2: isDisplayEvaluator2,
                status: status,
                isEvaluationDate: isEvaluationDate,
                haveSkill: haveSkill,
                flagSkill: evaluation.flagSkill,
                level: evaluation.level,
                header: header,
                totalTable: totalTable,
                basicSkillTable: basicSkillTable,
                proSkillTable: proSkillTable,
                behaviorTable: behaviorTable,
                personalGoalsMain: personalGoalsMain,
                achievementAdditionalPersonal: achievementAdditionalPersonal,
                isAchievementAdditionalPersonal: achievementAdditionalTablePdf_1.AchievementAdditionalTablePdfBusiness.dataSourcesAchievementAdditional(evaluation.achievementAdditionalsPersonal).length > 1
                    ? true
                    : false,
                dataTotalDepartment: dataTotalDepartment,
                departmentalGoalsMain: departmentalGoalsMain,
                achievementAdditionalDepartment: achievementAdditionalDepartment,
                isAchievementAdditionalDepartment: achievementAdditionalTablePdf_1.AchievementAdditionalTablePdfBusiness.dataSourcesAchievementAdditional(evaluation.achievementAdditionalsDepartment).length > 1
                    ? true
                    : false,
                commentUser: commentUser,
                commentEvaluator05: commentEvaluator05,
                commentEvaluator1: commentEvaluator1,
                commentEvaluator2: commentEvaluator2,
            });
        }
        else {
            finalData.push({
                isDisplayComponent810: isDisplayComponent810,
                isDisplayUser: isDisplayUser,
                isDisplayEvaluator05: isDisplayEvaluator05,
                isDisplayEvaluator1: isDisplayEvaluator1,
                isDisplayEvaluator2: isDisplayEvaluator2,
                status: status,
                isEvaluationDate: isEvaluationDate,
                haveSkill: haveSkill,
                flagSkill: evaluation.flagSkill,
                level: evaluation.level,
                header: header,
                totalTable: totalTable,
                behaviorTable: behaviorTable,
                personalGoalsMain: personalGoalsMain,
                achievementAdditionalPersonal: achievementAdditionalPersonal,
                isAchievementAdditionalPersonal: achievementAdditionalTablePdf_1.AchievementAdditionalTablePdfBusiness.dataSourcesAchievementAdditional(evaluation.achievementAdditionalsPersonal).length > 1
                    ? true
                    : false,
                dataTotalDepartment: dataTotalDepartment,
                departmentalGoalsMain: departmentalGoalsMain,
                achievementAdditionalDepartment: achievementAdditionalDepartment,
                isAchievementAdditionalDepartment: achievementAdditionalTablePdf_1.AchievementAdditionalTablePdfBusiness.dataSourcesAchievementAdditional(evaluation.achievementAdditionalsDepartment).length > 1
                    ? true
                    : false,
                commentUser: commentUser,
                commentEvaluator05: commentEvaluator05,
                commentEvaluator1: commentEvaluator1,
                commentEvaluator2: commentEvaluator2,
            });
        }
        return finalData;
    }
    headerPdf(userInfo) {
        const logo = 'data:image/png;base64,' +
            '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';
        const titleHeader = 'EVALUATION REPORT';
        if (userInfo) {
            const { employeeNumber, fullName, department, periodStart, periodEnd, companyName, evaluators, level, } = userInfo;
            const headerInfor = {
                logo: logo,
                titleHeader: titleHeader,
                fullName: fullName,
                employeeNumber: employeeNumber,
                companyName: companyName,
                department: department,
                evaluator: `${(evaluators === null || evaluators === void 0 ? void 0 : evaluators.length) > 0 ? evaluators.join('、') : ''}`,
                periodTime: ` ${periodStart} ～ ${periodEnd}`,
                level: level,
            };
            return headerInfor;
        }
    }
    totalTable(evaluation, isDisplayEvaluator05, isDisplayEvaluator1, isDisplayEvaluator2) {
        const dataSource = totalTablePdf_1.TotalTablePdfBusiness.dataSourceTotalTable(evaluation, isDisplayEvaluator05, isDisplayEvaluator1, isDisplayEvaluator2);
        const totalTable = { dataSource: dataSource };
        return totalTable;
    }
    basicBehaviorSkillTable(titleTable, data, status) {
        const dataSource = basicTablePdf_1.BasicTablePdfBusiness.dataSourcesBasicBehavior(data, status);
        const basicSkillTable = {
            titleTable: titleTable,
            dataSource: dataSource,
        };
        return basicSkillTable;
    }
    proSkillTable(titleTable, data, status) {
        const dataSource = proSkillTablePdf_1.ProSkillTablePdfBusiness.dataSourcesProSkill(data, status);
        const basicSkillTable = {
            titleTable: titleTable,
            dataSource: dataSource,
        };
        return basicSkillTable;
    }
    achievementPersonalMainTable(titleTable, data) {
        let dataSource = [];
        if (data) {
            for (const [index, userEvaluationAchievement] of data) {
                dataSource.push({
                    key: userEvaluationAchievement.actionPlan !== '小計' ? index : -1,
                    title: userEvaluationAchievement.title,
                    achievementValue: userEvaluationAchievement.achievementValue,
                    method: userEvaluationAchievement.method,
                    weight: userEvaluationAchievement.weight,
                    difficultyUser: userEvaluationAchievement.difficultyUser
                        ? Number(userEvaluationAchievement.difficultyUser).toFixed(1)
                        : '',
                    difficultyEvaluator05: userEvaluationAchievement.difficultyEvaluator05
                        ? Number(userEvaluationAchievement.difficultyEvaluator05).toFixed(1)
                        : '',
                    difficultyEvaluator1: userEvaluationAchievement.difficultyEvaluator1
                        ? Number(userEvaluationAchievement.difficultyEvaluator1).toFixed(1)
                        : '',
                    difficultyEvaluator2: userEvaluationAchievement.difficultyEvaluator2
                        ? Number(userEvaluationAchievement.difficultyEvaluator2).toFixed(1)
                        : '',
                    achievementStatus: userEvaluationAchievement.achievementStatus,
                    reasonComment: userEvaluationAchievement.reasonComment,
                    actionPlan: userEvaluationAchievement.actionPlan,
                    pointUser: userEvaluationAchievement.pointUser,
                    pointEvaluator05: userEvaluationAchievement.pointEvaluator05,
                    pointEvaluator1: userEvaluationAchievement.pointEvaluator1,
                    pointEvaluator2: userEvaluationAchievement.pointEvaluator2,
                    coefficientUser: userEvaluationAchievement.coefficientUser,
                    coefficientEvaluator05: userEvaluationAchievement.coefficientEvaluator05,
                    coefficientEvaluator1: userEvaluationAchievement.coefficientEvaluator1,
                    coefficientEvaluator2: userEvaluationAchievement.coefficientEvaluator2,
                    subList: userEvaluationAchievement === null || userEvaluationAchievement === void 0 ? void 0 : userEvaluationAchievement.evaluationAchievementPersonalSub,
                });
            }
        }
        const sublists = !(dataSource === null || dataSource === void 0 ? void 0 : dataSource.length)
            ? [[]]
            : dataSource.reduce((result, item) => {
                const key = item.city;
                let sublist = result === null || result === void 0 ? void 0 : result.find((sub) => { var _a; return ((_a = sub[0]) === null || _a === void 0 ? void 0 : _a.title) === key; });
                if (!sublist) {
                    sublist = [];
                    result.push(sublist);
                }
                sublist.push(item);
                return result;
            }, []);
        const achievementPersonalTable = {
            titleTable: titleTable,
            dataSource: sublists,
        };
        return achievementPersonalTable;
    }
    achievementPersonalSubTable(titleTable, data) {
        const dataSource = achievementTablePdf_1.AchievementPersonalTablePdfBusiness.dataSourcesSub(data);
        const achievementPersonalSubTable = {
            titleTable: titleTable,
            dataSource: dataSource,
        };
        return achievementPersonalSubTable;
    }
    achievementAdditionalTable(titleTable, data) {
        let achievementAdditionalTable;
        if (achievementAdditionalTablePdf_1.AchievementAdditionalTablePdfBusiness.dataSourcesAchievementAdditional(data).length > 1) {
            const dataSource = achievementAdditionalTablePdf_1.AchievementAdditionalTablePdfBusiness.dataSourcesAchievementAdditional(data);
            achievementAdditionalTable = {
                titleTable: titleTable,
                dataSource: dataSource,
            };
        }
        return achievementAdditionalTable;
    }
    dataReportReview17(evaluation, isF5) {
        var _a;
        const finalData = [];
        const header = this.headerPdf(Object.assign({}, evaluation));
        const { status, isEvaluationDate, evaluatorOrderList, isEvaluatorUser, isEvaluatorException, evaluatorOrder, } = evaluation;
        const isDisplayUser = [51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 98, 99, 100].includes(status) ||
            (status === 50 && isEvaluationDate);
        const isDisplayEvaluator05 = ([54, 55, 56, 57, 58, 59, 60, 61, 98, 99].includes(status) &&
            evaluatorOrderList.some((s) => Number(s) === 0.5) &&
            !isEvaluatorUser) ||
            (status === 100 && evaluatorOrderList.some((s) => Number(s) === 0.5)) ||
            ([54, 55, 56, 57, 58, 59, 60, 61, 98, 99].includes(status) &&
                isEvaluatorException &&
                !isF5) ||
            (evaluatorOrderList.some((s) => Number(s) === 0.5) &&
                [54, 55, 56, 57, 58, 59, 60, 61, 98, 99].includes(status) &&
                (isF5 || false));
        const isDisplayEvaluator1 = ([57, 58, 59, 60, 61, 98, 99].includes(status) &&
            evaluatorOrderList.some((s) => Number(s) === 1) &&
            [1, 2].includes(Number(evaluatorOrder)) &&
            !isEvaluatorUser) ||
            (status === 100 && evaluatorOrderList.some((s) => Number(s) === 1)) ||
            ([57, 58, 59, 60, 61, 98, 99].includes(status) &&
                isEvaluatorException &&
                !isF5) ||
            (evaluatorOrderList.some((s) => Number(s) === 1) &&
                [57, 58, 59, 60, 61, 98, 99].includes(status) &&
                (isF5 || false));
        const isDisplayEvaluator2 = ([60, 61, 98, 99].includes(status) &&
            evaluatorOrderList.some((s) => Number(s) === 2) &&
            Number(evaluatorOrder) === 2 &&
            !isEvaluatorUser) ||
            (status === 100 && evaluatorOrderList.some((s) => Number(s) === 2)) ||
            ([60, 61, 98, 99].includes(status) && isEvaluatorException && !isF5) ||
            (evaluatorOrderList.some((s) => Number(s) === 2) &&
                [60, 61, 98, 99].includes(status) &&
                (isF5 || false));
        const haveSkill = evaluation.flagSkill === 1;
        const totalTable = this.totalTable(evaluation, isDisplayEvaluator05, isDisplayEvaluator1, isDisplayEvaluator2);
        const behaviorTable = this.basicBehaviorSkillTable('行動・情意', evaluation.evaluationBehaviorSkills, status);
        const achievementPersonalMainTable = this.achievementPersonalMainTable((status === 50 && isEvaluationDate) || status > 50
            ? '個人成果'
            : '個人目標', (_a = evaluation.userEvaluationAchievements) === null || _a === void 0 ? void 0 : _a.entries());
        let achievementAdditional;
        let commentUser;
        let commentEvaluator05;
        let commentEvaluator1;
        let commentEvaluator2;
        if ((status === 50 && isEvaluationDate) || status > 50) {
            achievementAdditional = this.achievementAdditionalTable('追加目標/成果', evaluation.achievementAdditionals);
            commentUser = evaluation.comment.commentUser || '該当データがありません';
            commentEvaluator05 =
                evaluation.comment.comment05Public || '該当データがありません';
            commentEvaluator1 =
                evaluation.comment.comment1Public || '該当データがありません';
            commentEvaluator2 =
                evaluation.comment.comment2Public || '該当データがありません';
        }
        if (haveSkill) {
            const basicSkillTable = this.basicBehaviorSkillTable('基本スキル', evaluation.evaluationBasicSkills, status);
            const proSkillTable = this.proSkillTable('専門スキル', evaluation.proSkillList, status);
            finalData.push({
                isDisplayUser: isDisplayUser,
                isDisplayEvaluator05: isDisplayEvaluator05,
                isDisplayEvaluator1: isDisplayEvaluator1,
                isDisplayEvaluator2: isDisplayEvaluator2,
                status: status,
                isEvaluationDate: isEvaluationDate,
                haveSkill: haveSkill,
                flagSkill: evaluation.flagSkill,
                level: evaluation.level,
                header: header,
                totalTable: totalTable,
                basicSkillTable: basicSkillTable,
                proSkillTable: proSkillTable,
                behaviorTable: behaviorTable,
                achievementPersonalMainTable: achievementPersonalMainTable,
                achievementAdditional: achievementAdditional,
                isAchievementAdditional: achievementAdditionalTablePdf_1.AchievementAdditionalTablePdfBusiness.dataSourcesAchievementAdditional(evaluation.achievementAdditionals).length > 1
                    ? true
                    : false,
                commentUser: commentUser,
                commentEvaluator05: commentEvaluator05,
                commentEvaluator1: commentEvaluator1,
                commentEvaluator2: commentEvaluator2,
            });
        }
        else {
            finalData.push({
                isDisplayUser: isDisplayUser,
                isDisplayEvaluator05: isDisplayEvaluator05,
                isDisplayEvaluator1: isDisplayEvaluator1,
                isDisplayEvaluator2: isDisplayEvaluator2,
                status: status,
                isEvaluationDate: isEvaluationDate,
                haveSkill: haveSkill,
                flagSkill: evaluation.flagSkill,
                level: evaluation.level,
                header: header,
                totalTable: totalTable,
                behaviorTable: behaviorTable,
                achievementPersonalMainTable: achievementPersonalMainTable,
                achievementAdditional: achievementAdditional,
                isAchievementAdditional: achievementAdditionalTablePdf_1.AchievementAdditionalTablePdfBusiness.dataSourcesAchievementAdditional(evaluation.achievementAdditionals).length > 1
                    ? true
                    : false,
                commentUser: commentUser,
                commentEvaluator05: commentEvaluator05,
                commentEvaluator1: commentEvaluator1,
                commentEvaluator2: commentEvaluator2,
            });
        }
        return finalData;
    }
    headerSummaryPdf(userInfo) {
        const logo = 'data:image/png;base64,' +
            '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';
        const titleHeader = 'EVALUATION REPORT';
        if (userInfo) {
            const { employeeNumber, fullName, level } = userInfo;
            const headerInfor = {
                logo: logo,
                titleHeader: titleHeader,
                fullName: fullName,
                employeeNumber: employeeNumber,
                level: level,
            };
            return headerInfor;
        }
    }
    dataSummary17(evaluations) {
        let total = 0;
        const results = [];
        const sortData = evaluations.sort((a, b) => {
            const dateA = new Date(a.periodStart);
            const dateB = new Date(b.periodStart);
            if (dateA < dateB) {
                return 1;
            }
            if (dateA > dateB) {
                return -1;
            }
            return 0;
        });
        sortData.map((evaluation) => {
            results.push({
                periodTime: `${evaluation.periodStart} ～ ${evaluation.periodEnd}`,
                basicProTotalPointEvaluator2: evaluation.basicProTotalPointEvaluator2 !== null
                    ? Math.round(evaluation.basicProTotalPointEvaluator2)
                    : null,
                behaviorTotalPointEvaluator2: evaluation.behaviorTotalPointEvaluator2 !== null
                    ? Math.round(evaluation.behaviorTotalPointEvaluator2)
                    : null,
                achievementPersonalTotalPointEvaluator2: evaluation.achievementPersonalTotalPointEvaluator2 !== null
                    ? Math.round(evaluation.achievementPersonalTotalPointEvaluator2)
                    : null,
                achievementAdditionalTotalPointEvaluator2: evaluation.achievementAdditionalTotalPointEvaluator2 !== null
                    ? Math.round(evaluation.achievementAdditionalTotalPointEvaluator2)
                    : null,
                summaryPointEvaluator2: evaluation.summaryPointEvaluator2 !== null
                    ? Math.round(evaluation.summaryPointEvaluator2)
                    : null,
            });
            total +=
                evaluation.summaryPointEvaluator2 *
                    (evaluation.percentPoint === null
                        ? 1
                        : evaluation.percentPoint / 100);
        });
        results.push({
            periodTime: '評価結果',
            summaryPointEvaluator2: total ? Math.round(total) : '',
        });
        return results;
    }
    dataSummary810(evaluations) {
        let total = 0;
        const results = [];
        const sortData = evaluations.sort((a, b) => {
            const dateA = new Date(a.periodStart);
            const dateB = new Date(b.periodStart);
            if (dateA < dateB) {
                return 1;
            }
            if (dateA > dateB) {
                return -1;
            }
            return 0;
        });
        sortData.map((evaluation) => {
            total +=
                evaluation.summaryDepartmentPointEvaluator2 *
                    (evaluation.percentPoint === null
                        ? 1
                        : evaluation.percentPoint / 100);
            results.push({
                periodTime: `${evaluation.periodStart} ～ ${evaluation.periodEnd}`,
                summaryCharPointEvaluator2: evaluation.summaryCharPointEvaluator2 || '',
                summaryPointEvaluator2: evaluation.summaryDepartmentPointEvaluator2
                    ? evaluation.summaryDepartmentPointEvaluator2
                    : '',
            });
        });
        results.push({
            periodTime: '評価結果',
            summaryPointEvaluator2: total
                ? (Math.round(Number(total) * 10) / 10).toFixed(1)
                : '',
        });
        return results;
    }
    getSummaryPeriodTable(evaluations) {
        let result;
        const header = this.headerSummaryPdf(Object.assign({}, evaluations[0]));
        const dataSource = this.dataSummary17(evaluations);
        return (result = {
            header: header,
            dataSource: dataSource,
        });
    }
    getSummaryPeriodTable810(evaluations) {
        let result;
        const header = this.headerSummaryPdf(Object.assign({}, evaluations[0]));
        const dataSource = this.dataSummary810(evaluations);
        return (result = {
            header: header,
            dataSource: dataSource,
        });
    }
    async exportListEvaluationPdf17(evaluations, isF5) {
        const summaryData = this.getSummaryPeriodTable(evaluations);
        let results = [];
        for (let i = 0; i < evaluations.length; i++) {
            results.push(this.dataReportReview17(evaluations[i], isF5));
        }
        return {
            dataReview: results,
            fileName: `【${evaluations[0].fiscalYear}】${evaluations[0].fullName}評価表.pdf`,
            summaryData: summaryData,
            sameLevel: '1-7',
            multiLevel: false,
        };
    }
    getSummaryPeriodTable810te(evaluations) {
        const logo = 'data:image/png;base64,' +
            'iVBORw0KGgoAAAANSUhEUgAAAIAAAAAxCAYAAAASqKEbAAAAAXNSR0IArs4c6QAADhFJREFUeF7FXHlcVdUW/nDAIYdEcyqflL1MTSrzpU/NqQypSNE0VBRFAWUWEElEwgERmZVBUIw0nilkPn85lDj9bHbIAdNy1pzFHBJRk/db971Dl3vPOXudc8/1nX/PPmvtYe211/ettY9DVVVVFez0nL9Yjph5HyN40jvo9uKzdtKiT+zDhw+RtPgzVN69h5kRnqhdu5Y+QXb66uDhU0haVIKEmePQ7skn7KQFcLCXAVRW3ofryDiUHT0Dx7p1ULI8Gj27P2+3gWgVPD99DdLz1gOogu+YQZgbM06rCLu133vgON71movKe/fxXIe22FIyBw3q17OLPrsYwJlzV+ATmoH9ZaeqO92mVTPkpwahxysd7TIQLUIXZBYjOfvzGp8ET3wbs6aN0iLGLm2/33MUk6dl49z5a9XyO/39KRQuDsPT7VsbrtNwAyi/fgtjpqRg90/HrDrb7PFGKCmIRtfOzoYPhCPwwYM/kZy1Fik5NRdf+jZg/GDTcVC3bh2OOMPbkNsf7pOI67/ftpLt0rk9VuVF4YkWTQ3Va6gB0OIPGz/f5PaVHjKCFVlT/y+eIDGjGBn560GGIPfUqV0LfmPfRHy0l6GTzBFGO39sYJrs4kvfd+zQFmsLYww1AsMMgNy+f2SW7M43n4BnnVtjaXowujzfnjMvhrWRc/uWwuvXc8TsqFGYMGaQYXo5gujMnxiWWcPtK31HnmBpWrBhx4EhBkAB39uj42uc+XIDaNuqGTavjkfrVk6ceTGkDUX7CzJLkJq7TlUe7f74qFHw83YzRC9XCLl9N894U8DHfSgm2Lwm3pDA0GYDIKg32j9Z1e3TwMh9FWZNRQfnNtxxGtIuMbMYabn/BhmC2rMwzhvjRz3anf/tj0fgF5GFi5evax4roYNVedNshog2GQAtvu/URfhh36+qA/jbky2wMicCnZ5rp3mgej+QcH6KRbRvKa9hg3qYFT4SE8e6yqq6d/8B6tapDQcHB71dkf2Odv7oySm6Fl8S+FIXZxRkhtpkBLoNwBznq80MLf5XJXPg9HhjQydQJEzC+aKdnxgzFj5erlBa3+1fHwQFaNND3hOpZL83x/nsjxQa2soT6DIAOZwv1z9y+/lpwcKdT5M8N+VTzIr0RN9eL9g6J+AEfHTmz585Vuj2P1xQhKzlGxAZMNQQI5DD+XID7t+rCyIDhyF6zsc4dOS06pzYwhNoNgA1nG/eSwr4PiucITzzd313GO/7JoFcbdMmDbF6aRS6ueijjUU4X+ofRfux4SOEAd/Dh1Xo5RaJ46cvmT6NmDIUkYEeqFOnti4jVcP55gIH9umKVflRpmPn9LnL8BiXgLPnr6rq1MsTaDKAq9duYviE+Tj8y1nVzhDUW1s4Qxjtb9mxH5Mjs3Dj1p1qeWQEBekhujyBCOdLSpJivVlQ7/DRM+g/ZAakZAktfKivO6JDtR8HHJxP/Xu9T1csSQ1C0yaPVc/Jlas3TPP+86/nVOddD0/ANoCTpy9i0tRFOHBY3R1xcT7tfN/wxbhaftNqUG1aNkNeaqCm3AHH7WvF+anZazE/s8Sqf7ER7yPE153tBbg4n3Z+nsXiS0rKjpzGpLBFOHbqotATaOEJWAZQcbcSriPihBbIxfm0+B7jE1QHQgmk9StnCrOI9sL5hMs9fRdi1/eHrfrpNaI/0uZMYhkAF+fTmb96WbQq2rh4qdyUYDt/SR02auEJhAZw9rcr8PRbiF+Onxe6Hw7OJ7cf/MES2Z1vqaBli6bISvRH/z4uirqNxPm06GScm7fuwU9lp3D46FlZgiZ7gT9GDHlNaABcnD+g9wvIWRiA5k5NhDKPn7oA78A0HBWsB5cnUDUAWnyfkAzTZKg9XJxPkzs+OL3GmS8aMRkB5Q4s6wmMwvl37lRiQ+lubNq6B6U79uP2nUrVLtWq5YC9pel4sk1z1XZcnE9uf0V2OBwd64qmovr9z7+chdeUFJz5TT0w5PAEigZAbv+N4bHCnc/F+QT1xkxOMUX7Wh+5egKjcD4FZ0PHzcODP9WZQqnPr7g8g02rZ6sOgYvzaecTQaZl8SXF5b/fwqDhsUIjEPEEsgZAAZ93ULrwzNeC8wOn5+Ly1Rta1766PcUXFCBRPQEn4OPi/EX56zE75VN2vxbEesNHJVmkBefnJgey3L5S58gTEBMrOg7UeAIrAyDI4emXJIz29eB8tVlu4dREGBdQKvmdN7pjRfF21QXj4nwS8pbnh/hRpnbBUgERwc2dGuOLojg84yxfmKEH57MtT6EhxQTDvBOEgaEST1DDAGjxPbznCS3KFpwvNw73Qd2REOuN6DmF+OKr3bbOCbg4/8Kl63h5QCj+VEkUkTG59n8Rw9x7o2snZ7Rt7SRbP8jF+YP6uiAnObAGzrd1wIQOPLwThBBRjieoNgCjcf7Obw/BPyJbuKuHuvVAdtIUUxXOrdsVCIjKwaate3XNiVacX7iqFJEfLrfS5fR4I3gO64u+PTvj1W4d0bhRA+GZz8nnDx7YzTRWkTw9g9fLE5gMwGicX7rzJ3j6JQvH4f5mdyzLCLXCvl5TUrF5mzYj0JLPp0JognwTgjOwZed+q366u76KgowQYf+pARfnuw7ohpU54SyZehvp4Qkczpy7XGUkzv/iyx8QPqsA5TJ1beYDo8VPn+eHJo0bWo33+o3bCJ2Rj42le9hzwcnnX7l2A19u3Wta9F9PXMCJM5dwXwaVzJ4+GlMmvCXUzcX5bq+/gowEXzRr2kgo09YGWnkCB6/JyVWbtu0T6v288AP07tFFtd2FS+UY6BGDq+W3VNuR26eIXi3HfvfuPfQbMgMnTqtTn6TIe0R/JCswcxUVlVj+ry2m2IKCPc41iNKSOXDp8rTqGLg4v4Nza2xflwA6nh7V8/X3ZRjqPV+obvCAl+FwoOxkFackiUNV0uTmLN+IuKQiReUU8FGyQ1R5G5/0CbI/2gTKyIketXsH+8tOmkqu5Ha6nNyWzZvg0K4sVePk4nyST8TRo7x3QGswcmIitn9Tpjpt9RzrYuOquP9eDDEiWWGuLeejjZiV+IlVB4YMfhUZ8/zw2GP1VTvHwfmWAiiBtDjR3yqLuHLNNkyNXSayoer3ARPcED99jGJ7Ls63FPAo7h3cuPkH/MIXY+uug6rjfaptcyxLD0E3lw5/3Qziwhi5dKWctuyCDUhIX1PNpdPiU3GImtvn5vOVRidXT+AdmIoNpeKAkq6GUfRflBuBl7p2kFWx98AxjJyUhBs3/0pfsy0LgD3vHdDi+4cvRqlg8S3L8mvwAEYSGeSKcskTLCgCuf1FiZOFO5+bz1ebdDKC5RkheO2fL+BORSWe6zkZVL6m9DzRvAnee6cX3n7zH2jfriUo91CrlvU9wZ3fHIJPWKbuxSf99rp3QHPt6Zsk3PlyF3OsmECui6OYgENlfrltLwb0cRGe+Ry3T4EU0Zr7Dp1gubhLl69jXFC6VdumjRtiqv+76N2js+mWkuhi6He7j8AvPAsXBNW7XTu1x7FTF1BRcU+1f0YeB9fKb5qKakRnPrn93IUBVhdyZHMB3CDHlmSGNEN68vkcnoCCnM4dn8K+gyetFqNfry4oLviA5b337j8Gd6+5wiSWFCR/Urwd0+I/Urx9JCn1/98NJJHxqXXy3r37pqzgtq8PqY7F0ZFqK2JNZ77lo5gN5MIcPelM807oyefr4QnMdYb5uSMm/H2hAWzfdQCB0UuESSzLfH5RyQ6ExuSryid0EDDeDXFRo4X9kGtAiz82IFXo9ulIIwLqZYW4RrUegEt0aCloMN/5dD9fb90+wTqf0ExdtHHxsuno17ur6sTTzqe7eqIMptIGKCregRkJK/DHnbuqeoJ83tL8fwJy+1OmZQt3PqegRlgRxKU6OTyB+UwYkc8nI5gYtkgTY0iB2Ik9S9GgvjIxQ2f+8AmJQrcvOgLJCEJnij2BFp6Ai/O5JXVCA6BFM5on4AR83Hw+HQfB0Xns3IGHW0/kpQUp7kqK9oOilwgDPm4QTMdBRFyBMCbgBIZcnK+lqJZlADRbRvAEXJyvJZ8vrSSdh5wsYupsH4wdOdAmnG9et885wImMouNAhA7UeAIuztdaVs82ABqorTwBF+dz8/nmk0+pZCo2FdUTKE0QF+dziTBLw+AEhko8ARfn67lYo8kAJE9g+QsTuV1g6SI5bl9rPt9SL7eewNJFcnG+Wt0+xxOQEUTPLRR6AvPjgIvzlahwUb80G4AUE0g/MVJTQEHSx1nhSMtd90jv53N4AilIov5rwfm23hKm44DLE8REeIKobCHOt+EnXLoMQDoOONebKR168szlR3o/n8sTEEyiRwT19MBctY3BOQ6IJ3Bu10qYDlcqmxftfOm9bgMgAVyeQK0zovv53IFYtrOFJzCXZSvRpdR/Lk+gNn4OzhfNn00GIHkCTj2BUkdE9/NFA1B7r4cnMJcnwvm29I2+5fAESjq4OF/UR5sNQIoJOEWR5p3h4nzRAETvtfIEkjwuzhfpF73n8gTmcrTgfJF+QwyAlHB5AmqrB+eLBiJ6z+UJSI5WnC/SLXrP5QlIjlacL9JtmAFIx4HSjw7NO6IH54sGInrP5Qn04nyRftF7TmCoB+eL9BpqAJInUOIJbMX5osGI3ot4Altxvki/6L0aT6AX54t0Gm4AUkxgyRNoqdsXddrW93I8gdZklq19UPpejiew58+27WIA0nFgzhNw6vbtNamWci15AqNxvq3jMD8ObMX5or7YzQBIMfEEYTOXws9rkOJ/+EQdtNd7iSegwgqt9/Pt1SdzuQQR0/PWIWnWeNUfZNjal/8A3HOgdX4iJHsAAAAASUVORK5CYII=';
        const titleHeader = 'EVALUATION REPORT';
        const header = {
            logo: logo,
            titleHeader: titleHeader,
            fullName: evaluations[0].user.fullName,
            employeeNumber: evaluations[0].user.employeeNumber,
        };
        let result;
        const dataSource = this.dataSummary810(evaluations);
        return (result = {
            header: header,
            dataSource: dataSource,
        });
    }
    async exportListEvaluationPdf810(evaluations, isF5) {
        const summaryData = this.getSummaryPeriodTable810(evaluations);
        let results = [];
        for (let i = 0; i < evaluations.length; i++) {
            results.push(this.dataReportReview810(evaluations[i], isF5));
        }
        return {
            dataReview: results,
            fileName: `【${evaluations[0].fiscalYear}】${evaluations[0].fullName}評価表.pdf`,
            summaryData: summaryData,
            sameLevel: '8-10',
            multiLevel: false,
        };
    }
    async exportPDFMultiLevel(evaluations, isF5) {
        var _a;
        let results = [];
        let fileName = ``;
        if (((_a = evaluations[0]) === null || _a === void 0 ? void 0 : _a.user) && evaluations[0].user.fullName) {
            fileName = `【${evaluations[0].fiscalYear}】${evaluations[0].user.fullName}評価表.pdf`;
        }
        else {
            fileName = `【${evaluations[0].fiscalYear}】${evaluations[0].fullName}評価表.pdf`;
        }
        for (let i = 0; i < evaluations.length; i++) {
            if (evaluations[i].level < 8) {
                results.push(this.dataReportReview17(evaluations[i], isF5));
            }
            else {
                results.push(this.dataReportReview810(evaluations[i], isF5));
            }
        }
        return {
            dataReview: results,
            fileName: fileName,
            sameLevel: '1-10',
            multiLevel: true,
        };
    }
};
PdfReviewService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PdfReviewService);
exports.PdfReviewService = PdfReviewService;
//# sourceMappingURL=pdf.review.service.js.map