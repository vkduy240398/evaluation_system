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
exports.EvaluationPeriodService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const util_1 = require("../common/util");
const evaluationPeriod_repository_1 = require("../repository/evaluationPeriod.repository");
const user_repository_1 = require("../repository/user.repository");
const evaluation_repository_1 = require("../repository/evaluation.repository");
const guideEvaluation_repository_1 = require("../repository/guideEvaluation.repository");
const evaluator_repository_1 = require("../repository/evaluator.repository");
const historyCronjob_repository_1 = require("../repository/historyCronjob.repository");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const logger_service_1 = require("./logger.service");
const settingLevel_repository_1 = require("../repository/settingLevel.repository");
const adminEvaluation_repository_1 = require("../repository/adminEvaluation.repository");
const managementUser_repository_1 = require("../repository/managementUser.repository");
const evaluationPeriodDepartmentSetting_repository_1 = require("../repository/evaluationPeriodDepartmentSetting.repository");
const moment = require("moment");
let EvaluationPeriodService = class EvaluationPeriodService {
    constructor(logger) {
        this.logger = logger;
    }
    async getNotificationPeriod(companyGroupCode, timeZone) {
        const results = [];
        const today = moment().tz(timeZone).format('YYYY/MM/DD');
        const periods = await this.evaluationPeriodRepo.getProgressingPeriod(companyGroupCode, timeZone);
        if (periods && periods.length > 0) {
            for (let i = 0; i < periods.length; i++) {
                if ((today >=
                    moment(periods[i].date_creation_goal_start, 'YYYY/M/D')
                        .tz(timeZone)
                        .format('YYYY/MM/DD') &&
                    today <=
                        moment(periods[i].date_creation_goal_end, 'YYYY/M/D')
                            .tz(timeZone)
                            .format('YYYY/MM/DD')) ||
                    (today >=
                        moment(periods[i].date_creation_goal_department_start, 'YYYY/M/D')
                            .tz(timeZone)
                            .format('YYYY/MM/DD') &&
                        today <=
                            moment(periods[i].date_creation_goal_department_end, 'YYYY/M/D')
                                .tz(timeZone)
                                .format('YYYY/MM/DD'))) {
                    const condition = {
                        evaluationPeriodId: periods[i].id,
                        status: { [sequelize_1.Op.lt]: 50 },
                        companyGroupCode: companyGroupCode,
                    };
                    const count = await this.managementUserRepository.countEvaluation(condition);
                    if (count) {
                        results.push({
                            type: '目標',
                            period: `${periods[i].year}年${periods[i].period_index === 1 ? '上期' : '下期'}`,
                            datePersonal: today >=
                                moment(periods[i].date_creation_goal_start, 'YYYY/M/D')
                                    .tz(timeZone)
                                    .format('YYYY/MM/DD') &&
                                today <=
                                    moment(periods[i].date_creation_goal_end, 'YYYY/M/D')
                                        .tz(timeZone)
                                        .format('YYYY/MM/DD')
                                ? `${periods[i].date_creation_goal_start} ～ ${periods[i].date_creation_goal_end}`
                                : '',
                            dateDepartment: today >=
                                moment(periods[i].date_creation_goal_department_start, 'YYYY/M/D')
                                    .tz(timeZone)
                                    .format('YYYY/MM/DD') &&
                                today <=
                                    moment(periods[i].date_creation_goal_department_end, 'YYYY/M/D')
                                        .tz(timeZone)
                                        .format('YYYY/MM/DD')
                                ? `${periods[i].date_creation_goal_department_start} ～ ${periods[i].date_creation_goal_department_end}`
                                : '',
                        });
                    }
                }
                if ((today >=
                    moment(periods[i].date_evaluation_start, 'YYYY/M/D')
                        .tz(timeZone)
                        .format('YYYY/MM/DD') &&
                    today <=
                        moment(periods[i].date_evaluation_end, 'YYYY/M/D')
                            .tz(timeZone)
                            .format('YYYY/MM/DD')) ||
                    (today >=
                        moment(periods[i].date_evaluation_department_start, 'YYYY/M/D')
                            .tz(timeZone)
                            .format('YYYY/MM/DD') &&
                        today <=
                            moment(periods[i].date_evaluation_department_end, 'YYYY/M/D')
                                .tz(timeZone)
                                .format('YYYY/MM/DD'))) {
                    const condition = {
                        evaluationPeriodId: periods[i].id,
                        status: { [sequelize_1.Op.gte]: 99 },
                        companyGroupCode: companyGroupCode,
                    };
                    const count = await this.managementUserRepository.countEvaluation(condition);
                    if (!count) {
                        results.push({
                            type: '評価',
                            period: `${periods[i].year}年${periods[i].period_index === 1 ? '上期' : '下期'}`,
                            datePersonal: today >=
                                moment(periods[i].date_evaluation_start, 'YYYY/M/D')
                                    .tz(timeZone)
                                    .format('YYYY/MM/DD') &&
                                today <=
                                    moment(periods[i].date_evaluation_end, 'YYYY/M/D')
                                        .tz(timeZone)
                                        .format('YYYY/MM/DD')
                                ? `${periods[i].date_evaluation_start} ～ ${periods[i].date_evaluation_end}`
                                : '',
                            dateDepartment: today >=
                                moment(periods[i].date_evaluation_department_start, 'YYYY/M/D')
                                    .tz(timeZone)
                                    .format('YYYY/MM/DD') &&
                                today <=
                                    moment(periods[i].date_evaluation_department_end, 'YYYY/M/D')
                                        .tz(timeZone)
                                        .format('YYYY/MM/DD')
                                ? `${periods[i].date_evaluation_department_start} ～ ${periods[i].date_evaluation_department_end}`
                                : '',
                        });
                    }
                }
            }
        }
        return results;
    }
    async getEvaluationPeriod(timeZone) {
        return await this.evaluationPeriodRepo.getEvaluationPeriod(timeZone);
    }
    async getAllPeriod(companyGroupCode, timeZone) {
        const years = moment().tz(timeZone);
        return await this.evaluationPeriodRepo.getAll({
            year: years.format('YYYY'),
            companyGroupCode: companyGroupCode,
        });
    }
    async getPeriodDetailByCondition(condition) {
        const periods = await this.evaluationPeriodRepo.getPeriodByCondition(condition);
        return periods;
    }
    async listPeriodByYear(yearStart, yearEnd, companyGroupCode) {
        const datas = await this.evaluationPeriodRepo.listPeriodByYear(yearStart, yearEnd, companyGroupCode);
        const rangeYears = Array.from({ length: (yearEnd - yearStart) / 1 + 1 }, (value, index) => parseInt(yearStart.toString()) + parseInt(index.toString()) * 1);
        const arrays = [];
        if (datas.length > 0) {
            const reducesArrays = datas.reduce((acc, current) => {
                const founds = acc.find((v) => v.year === current.year);
                const value = {
                    periodIndex: current.periodIndex,
                    goals: current.dateCreationGoalStart &&
                        current.dateCreationGoalEnd &&
                        `${current.dateCreationGoalStart} ～ ${current.dateCreationGoalEnd}`,
                    departmentGoals: current.dateCreationGoalDepartmentStart &&
                        current.dateCreationGoalDepartmentEnd &&
                        `${current.dateCreationGoalDepartmentStart} ～ ${current.dateCreationGoalDepartmentEnd}`,
                    personalEvaluation: current.dateEvaluationStart &&
                        current.dateEvaluationEnd &&
                        `${current.dateEvaluationStart} ～ ${current.dateEvaluationEnd}`,
                    divisionEvaluate: current.dateEvaluationDepartmentStart &&
                        current.dateEvaluationDepartmentEnd &&
                        `${current.dateEvaluationDepartmentStart} ～ ${current.dateEvaluationDepartmentEnd}`,
                    key: Math.random().toString(36).slice(5),
                    year: current.year,
                    id: current.id,
                    checkFixed: current.checkFixed,
                };
                if (!founds) {
                    acc.push({
                        year: current.year,
                        children: [value],
                        periodLists: [current.periodIndex],
                    });
                }
                else {
                    founds.children.push(value);
                    founds.periodLists.push(current.periodIndex);
                }
                return acc;
            }, []);
            const arrayAlreadyExists = [];
            const sortChildrens = reducesArrays.sort((a, b) => {
                return b.children[0].periodIndex - a.children[0].periodIndex;
            });
            for (let index = yearStart; index <= parseInt(yearEnd.toString()) + 1; index++) {
                sortChildrens.forEach((v) => {
                    if (parseInt(v.year) === parseInt(index.toString())) {
                        arrayAlreadyExists.push(parseInt(v.year));
                        if (v.periodLists.includes(2)) {
                            const record = v.children.find((val) => val.periodIndex === 2);
                            record.key = Math.random().toString(36).slice(5);
                            arrays.push(Object.assign(Object.assign({}, record), { evaluationPeriod: `${v.year}年下期` }));
                        }
                        if (v.periodLists.includes(1)) {
                            const record = v.children.find((val) => val.periodIndex === 1);
                            record.key = Math.random().toString(36).slice(5);
                            arrays.push(Object.assign(Object.assign({}, record), { evaluationPeriod: `${v.year}年上期` }));
                        }
                        if (v.periodLists.includes(1) && !v.periodLists.includes(2)) {
                            arrays.push({
                                key: Math.random().toString(36).slice(5),
                                evaluationPeriod: `${index}年下期`,
                                goals: '',
                                departmentGoals: '',
                                personalEvaluation: '',
                                divisionEvaluate: '',
                                periodIndex: 2,
                                year: v.year,
                                id: 0,
                            });
                        }
                        if (v.periodLists.includes(2) && !v.periodLists.includes(1)) {
                            arrays.push({
                                key: Math.random().toString(36).slice(5),
                                evaluationPeriod: `${index}年上期`,
                                goals: '',
                                departmentGoals: '',
                                personalEvaluation: '',
                                divisionEvaluate: '',
                                periodIndex: 1,
                                year: v.year,
                                id: 0,
                            });
                        }
                    }
                });
            }
            const arraysNoMatchs = rangeYears.filter((v) => !arrayAlreadyExists.includes(v));
            for (let index = 0; index < arraysNoMatchs.length; index++) {
                arrays.push({
                    key: Math.random().toString(36).slice(5),
                    evaluationPeriod: `${arraysNoMatchs[index]}年下期`,
                    goals: '',
                    departmentGoals: '',
                    personalEvaluation: '',
                    divisionEvaluate: '',
                    periodIndex: 2,
                    year: arraysNoMatchs[index],
                    id: 0,
                });
                arrays.push({
                    key: Math.random().toString(36).slice(5),
                    evaluationPeriod: `${arraysNoMatchs[index]}年上期`,
                    goals: '',
                    departmentGoals: '',
                    personalEvaluation: '',
                    divisionEvaluate: '',
                    periodIndex: 1,
                    year: arraysNoMatchs[index],
                    id: 0,
                });
            }
            const validPeriodIds = arrays.filter((a) => a.id > 0).map((a) => a.id);
            const evalDatesMap = new Map();
            const deptDatesMap = new Map();
            if (validPeriodIds.length > 0) {
                const [evalDates, deptDates] = await Promise.all([
                    this.evaluationPeriodRepo.getEvaluationDatesByPeriodIds(validPeriodIds, companyGroupCode),
                    this.deptSettingRepo.getDeptSettingDatesByPeriodIds(validPeriodIds, companyGroupCode),
                ]);
                evalDates.forEach((e) => {
                    const list = evalDatesMap.get(e.evaluationPeriodId) || [];
                    list.push(e);
                    evalDatesMap.set(e.evaluationPeriodId, list);
                });
                deptDates.forEach((d) => {
                    const list = deptDatesMap.get(d.evaluationPeriodId) || [];
                    list.push(d);
                    deptDatesMap.set(d.evaluationPeriodId, list);
                });
            }
            const parseDateMoment = (d) => d ? moment(d, 'YYYY/M/D') : null;
            const pickMinDate = (dates) => {
                const moments = dates
                    .map(parseDateMoment)
                    .filter((m) => m !== null && m.isValid());
                if (!moments.length)
                    return null;
                return moments
                    .reduce((min, m) => (m.isBefore(min) ? m : min))
                    .format('YYYY/M/D');
            };
            const pickMaxDate = (dates) => {
                const moments = dates
                    .map(parseDateMoment)
                    .filter((m) => m !== null && m.isValid());
                if (!moments.length)
                    return null;
                return moments
                    .reduce((max, m) => (m.isAfter(max) ? m : max))
                    .format('YYYY/M/D');
            };
            for (let i = 0; i < arrays.length; i++) {
                const goalRecord = await this.adminEvaluationRepo.countEvaluationFixed('goal', arrays[i].id, companyGroupCode);
                const evaluationRecord = await this.adminEvaluationRepo.countEvaluationFixed('evaluation', arrays[i].id, companyGroupCode);
                const evaluationConfirmRecord = await this.adminEvaluationRepo.countEvaluationFixed('evaluationConfirm', arrays[i].id, companyGroupCode);
                const totalRecord = await this.adminEvaluationRepo.totalEvaluation(arrays[i].id, '', companyGroupCode);
                const goalFixedRecord = await this.adminEvaluationRepo.totalEvaluation(arrays[i].id, 'goal', companyGroupCode);
                const evaluationFixedRecord = await this.adminEvaluationRepo.totalEvaluation(arrays[i].id, 'evaluation', companyGroupCode);
                const evaluationConfirmFixedRecord = await this.adminEvaluationRepo.totalEvaluation(arrays[i].id, 'evaluationConfirm', companyGroupCode);
                arrays[i] = Object.assign(Object.assign({}, arrays[i]), { goalRecord: goalRecord, evaluationRecord: evaluationRecord, evaluationConfirmRecord: evaluationConfirmRecord, totalRecord: totalRecord, goalFixedRecord: goalFixedRecord, evaluationFixedRecord: evaluationFixedRecord, evaluationConfirmFixedRecord: evaluationConfirmFixedRecord });
                if (arrays[i].id > 0) {
                    const periodRecord = datas.find((d) => d.id === arrays[i].id);
                    const evalRecs = evalDatesMap.get(arrays[i].id) || [];
                    const deptRecs = deptDatesMap.get(arrays[i].id) || [];
                    if (periodRecord) {
                        const deptGoalStartList = [];
                        evalRecs.forEach((e) => {
                            if (e.dateCreationGoalStart)
                                deptGoalStartList.push(e.dateCreationGoalStart);
                        });
                        deptRecs.forEach((d) => {
                            const v = pickMinDate([
                                d.dateCreationGoalStart,
                                d.dateCreationGoalDepartmentStart,
                            ]);
                            if (v)
                                deptGoalStartList.push(v);
                        });
                        const pgs = pickMinDate([
                            periodRecord.dateCreationGoalStart,
                            periodRecord.dateCreationGoalDepartmentStart,
                        ]);
                        if (pgs)
                            deptGoalStartList.push(pgs);
                        const deptGoalStart = pickMinDate(deptGoalStartList);
                        const deptGoalEndList = [];
                        evalRecs.forEach((e) => {
                            if (e.dateCreationGoalEnd)
                                deptGoalEndList.push(e.dateCreationGoalEnd);
                        });
                        deptRecs.forEach((d) => {
                            const v = pickMaxDate([
                                d.dateCreationGoalEnd,
                                d.dateCreationGoalDepartmentEnd,
                            ]);
                            if (v)
                                deptGoalEndList.push(v);
                        });
                        const pge = pickMaxDate([
                            periodRecord.dateCreationGoalEnd,
                            periodRecord.dateCreationGoalDepartmentEnd,
                        ]);
                        if (pge)
                            deptGoalEndList.push(pge);
                        const deptGoalEnd = pickMaxDate(deptGoalEndList);
                        arrays[i].goalDeptRange = {
                            start: deptGoalStart || null,
                            end: deptGoalEnd || null,
                        };
                        const divEvalStartList = [];
                        evalRecs.forEach((e) => {
                            if (e.dateEvaluationStart)
                                divEvalStartList.push(e.dateEvaluationStart);
                        });
                        deptRecs.forEach((d) => {
                            const v = pickMinDate([
                                d.dateEvaluationStart,
                                d.dateEvaluationDepartmentStart,
                            ]);
                            if (v)
                                divEvalStartList.push(v);
                        });
                        const pes = pickMinDate([
                            periodRecord.dateEvaluationStart,
                            periodRecord.dateEvaluationDepartmentStart,
                        ]);
                        if (pes)
                            divEvalStartList.push(pes);
                        const divEvalStart = pickMinDate(divEvalStartList);
                        const divEvalEndList = [];
                        evalRecs.forEach((e) => {
                            if (e.dateEvaluationEnd)
                                divEvalEndList.push(e.dateEvaluationEnd);
                        });
                        deptRecs.forEach((d) => {
                            const v = pickMaxDate([
                                d.dateEvaluationEnd,
                                d.dateEvaluationDepartmentEnd,
                            ]);
                            if (v)
                                divEvalEndList.push(v);
                        });
                        const pee = pickMaxDate([
                            periodRecord.dateEvaluationEnd,
                            periodRecord.dateEvaluationDepartmentEnd,
                        ]);
                        if (pee)
                            divEvalEndList.push(pee);
                        const divEvalEnd = pickMaxDate(divEvalEndList);
                        arrays[i].evalDeptRange = {
                            start: divEvalStart || null,
                            end: divEvalEnd || null,
                        };
                    }
                }
            }
            const results = arrays.sort((a, b) => {
                return b.year - a.year;
            });
            return results;
        }
        else {
            for (let index = yearStart; index <= yearEnd; index++) {
                arrays.push({
                    key: Math.random().toString(36).slice(5),
                    evaluationPeriod: `${index}年上期`,
                    goals: '',
                    departmentGoals: '',
                    personalEvaluation: '',
                    divisionEvaluate: '',
                    periodIndex: 1,
                    year: index,
                    id: 0,
                });
                arrays.push({
                    key: Math.random().toString(36).slice(5),
                    evaluationPeriod: `${index}年下期`,
                    goals: '',
                    departmentGoals: '',
                    personalEvaluation: '',
                    divisionEvaluate: '',
                    periodIndex: 1,
                    year: index,
                    id: 0,
                });
            }
            return arrays;
        }
    }
    async savePeriod(condition, body) {
        if (isNaN(Number(condition.year)) || isNaN(condition.period_index)) {
            throw new RuntimeException_1.RuntimeException('Bad Request', 400);
        }
        const currentPeriod = await this.evaluationPeriodRepo.getPeriodByCondition(condition);
        if (currentPeriod)
            if (body.updatedTime !== currentPeriod.updatedTime.toISOString())
                throw new RuntimeException_1.RuntimeException('Evaluation is duplicate', 409);
        const temp = {};
        temp.dateCreationGoalDepartmentEnd = body.dateCreationGoalDepartmentEnd;
        temp.dateCreationGoalDepartmentStart = body.dateCreationGoalDepartmentStart;
        temp.dateCreationGoalEnd = body.dateCreationGoalEnd;
        temp.dateCreationGoalStart = body.dateCreationGoalStart;
        temp.dateEvaluationDepartmentEnd = body.dateEvaluationDepartmentEnd;
        temp.dateEvaluationDepartmentStart = body.dateEvaluationDepartmentStart;
        temp.dateEvaluationEnd = body.dateEvaluationEnd;
        temp.dateEvaluationStart = body.dateEvaluationStart;
        const results = await this.evaluationPeriodRepo.savePeriod(condition, temp);
        if (results && body) {
            if (body.dateCreationGoalDepartmentStart &&
                body.dateCreationGoalDepartmentEnd) {
                await this.historyCronJobRepository.add({
                    name: `settingCreationPersonalGoalsDepartment_${condition.period_index === 1
                        ? condition.year + '年上期'
                        : condition.year + '年下期'}`,
                    type: 1,
                    periodIndex: condition.period_index,
                    dateCreationGoalDepartmentStart: body.dateCreationGoalDepartmentStart,
                    dateCreationGoalDepartmentEnd: body.dateCreationGoalDepartmentEnd,
                    year: condition.year,
                    companyGroupCode: condition.company_group_code,
                });
            }
            if (body.dateCreationGoalStart && body.dateCreationGoalEnd) {
                await this.historyCronJobRepository.add({
                    name: `settingCreationPersonalGoals_${condition.period_index === 1
                        ? condition.year + '年上期'
                        : condition.year + '年下期'}`,
                    type: 2,
                    periodIndex: condition.period_index,
                    dateCreationGoalStart: body.dateCreationGoalStart,
                    dateCreationGoalEnd: body.dateCreationGoalEnd,
                    year: condition.year,
                    companyGroupCode: condition.company_group_code,
                });
            }
        }
        return results;
    }
    async getUserActiveByCondition(departmentId, companyId, periodId, searchInput, limit, offset) {
        const result = await this.userRepo.getUserActiveByCondition(departmentId, companyId, periodId, searchInput, limit, offset);
        if (result.users.length > 0) {
            const dataList = result.users.map((v, i) => ({
                id: v.id,
                fullName: v.fullName,
                departmentName: v.department ? `${v.department.name}` : '',
                companyName: v.company.name,
                key: `${v.employeeNumber}-${i}-key`,
            }));
            return { dataList, count: result.count };
        }
        return { dataList: [], count: 0 };
    }
    async getEvaluatorUser(evaluationCreatorId, companyGroupCode) {
        const users = await this.userRepo.getListEvaluator(evaluationCreatorId, companyGroupCode);
        if (users.length > 0) {
            const results = users.map((v) => ({
                value: v.id,
                label: `${v.employeeNumber}: ${v.fullName}`,
            }));
            return results;
        }
        return [];
    }
    async getEvaluationByPeriod(userId, year, periodIndex, companyGroupCode) {
        var _a, _b, _c;
        const period = await this.evaluationPeriodRepo.getPeriodDetail(year, periodIndex, companyGroupCode);
        if (period) {
            const itemPeriod = {
                id: period.id,
                dateCreationGoalStart: period.dateCreationGoalStart,
                dateCreationGoalEnd: period.dateCreationGoalEnd,
                dateEvaluationStart: period.dateEvaluationStart,
                dateEvaluationEnd: period.dateEvaluationEnd,
                dateCreationGoalDepartmentStart: period.dateCreationGoalDepartmentStart,
                dateCreationGoalDepartmentEnd: period.dateCreationGoalDepartmentEnd,
                dateEvaluationDepartmentStart: period.dateEvaluationDepartmentStart,
                dateEvaluationDepartmentEnd: period.dateEvaluationDepartmentEnd,
            };
            const results = [];
            const evaluations = await this.evaluationPeriodRepo.getEvaluationByPeriod(userId, period.id, companyGroupCode);
            if (evaluations.length > 0) {
                const sortedEvaluations = evaluations.sort((a, b) => {
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
                for (let i = 0; i < sortedEvaluations.length; i++) {
                    const v = sortedEvaluations[i];
                    const evaluator05 = v.evaluator.find((f) => Number(f.evaluationOrder) === 0.5);
                    const evaluator10 = v.evaluator.find((f) => Number(f.evaluationOrder) === 1.0);
                    const evaluator20 = v.evaluator.find((f) => Number(f.evaluationOrder) === 2.0);
                    const skills = await this.evaluationPeriodRepo.getSkillUserOfEvaluation(v.id);
                    results.push({
                        id: v.id,
                        companyName: v.companyName,
                        departmentName: v.departmentName,
                        divisionName: v.divisionName,
                        period: `${year}年${periodIndex === 1 ? '上期' : '下期'}`,
                        percentPoint: v.percentPoint,
                        level: v.level,
                        dateCreationGoalStart: v.dateCreationGoalStart
                            ? v.dateCreationGoalStart
                            : v.level <= 7
                                ? period.dateCreationGoalStart
                                : period.dateCreationGoalDepartmentStart,
                        dateCreationGoalEnd: v.dateCreationGoalEnd
                            ? v.dateCreationGoalEnd
                            : v.level <= 7
                                ? period.dateCreationGoalEnd
                                : period.dateCreationGoalDepartmentEnd,
                        dateEvaluationStart: v.dateEvaluationStart,
                        dateEvaluationEnd: v.dateEvaluationEnd,
                        periodStart: v.periodStart,
                        periodEnd: v.periodEnd,
                        evaluator05: (evaluator05 === null || evaluator05 === void 0 ? void 0 : evaluator05.evaluatorId) || null,
                        evaluator05Name: (evaluator05 === null || evaluator05 === void 0 ? void 0 : evaluator05.user)
                            ? `${evaluator05.user.employeeNumber}: ${evaluator05.user.fullName}`
                            : '',
                        evaluator05Email: ((_a = evaluator05 === null || evaluator05 === void 0 ? void 0 : evaluator05.user) === null || _a === void 0 ? void 0 : _a.email) || '',
                        evaluator10: (evaluator10 === null || evaluator10 === void 0 ? void 0 : evaluator10.evaluatorId) || null,
                        evaluator10Name: (evaluator10 === null || evaluator10 === void 0 ? void 0 : evaluator10.user)
                            ? `${evaluator10.user.employeeNumber}: ${evaluator10.user.fullName}`
                            : '',
                        evaluator10Email: ((_b = evaluator10 === null || evaluator10 === void 0 ? void 0 : evaluator10.user) === null || _b === void 0 ? void 0 : _b.email) || '',
                        evaluator20: (evaluator20 === null || evaluator20 === void 0 ? void 0 : evaluator20.evaluatorId) || null,
                        evaluator20Name: (evaluator20 === null || evaluator20 === void 0 ? void 0 : evaluator20.user)
                            ? `${evaluator20.user.employeeNumber}: ${evaluator20.user.fullName}`
                            : '',
                        evaluator20Email: ((_c = evaluator20 === null || evaluator20 === void 0 ? void 0 : evaluator20.user) === null || _c === void 0 ? void 0 : _c.email) || '',
                        isEdit: v.status < 50,
                        evaluationPeriodId: period.id,
                        key: `exception-key-${i}`,
                        status: v.status,
                        creationUser: v.creationUser,
                        createdByCronjob: v.createdByCronjob,
                        flagSkill: v.flagSkill,
                        skillUser: skills,
                    });
                }
            }
            return { period: itemPeriod, evaluations: results };
        }
        return { period: period, evaluations: [] };
    }
    async updateEvaluationPeriodException(evaluations, userId, creationUser, deleteIds, year, periodIndex, companyGroupCode) {
        const levelSettings = await this.settingLevelRepo.getLevelSettingPublic(companyGroupCode);
        const guideEvaluations = await this.guideEvaluationRepository.getGuideEvaluationPublic(companyGroupCode);
        const results = await this.evaluationPeriodRepo.updateEvaluationPeriodException(evaluations, userId, creationUser, deleteIds, year, periodIndex, levelSettings, guideEvaluations, companyGroupCode);
        const { updateGoalPersonal810ByEvaluationIds, updateGoalPersonal17ByEvaluationIds, resetEvaluationIds, evaluationArrays, resetPersonalAchievement, evaluator05ErrorIds, evaluator10ErrorIds, evaluatorErrorNames, updateBehaviorByEvaluationIds, } = results;
        evaluationArrays.forEach((v) => {
            const evaluatorArrays = [];
            if (v.evaluator05 !== null) {
                evaluatorArrays.push(v.evaluator05);
            }
            if (v.evaluator10 !== null) {
                evaluatorArrays.push(v.evaluator10);
            }
            if (v.evaluator20 !== null) {
                evaluatorArrays.push(v.evaluator20);
            }
        });
        if (resetEvaluationIds.length > 0) {
            await this.evaluationPeriodRepo.resetEvaluationData(resetEvaluationIds, resetPersonalAchievement);
        }
        if (updateGoalPersonal810ByEvaluationIds.length > 0 ||
            updateGoalPersonal17ByEvaluationIds.length > 0) {
            await this.evaluationPeriodRepo.updateGoalPersonalByEvaluationIds(updateGoalPersonal17ByEvaluationIds, updateGoalPersonal810ByEvaluationIds);
        }
        if (updateBehaviorByEvaluationIds.length > 0) {
            await this.evaluationPeriodRepo.updateBehaviorByEvaluationIds(updateBehaviorByEvaluationIds, companyGroupCode);
        }
        return {
            resetEvaluationIds,
            evaluator05ErrorIds,
            evaluator10ErrorIds,
            evaluatorErrorNames,
            evaluationNewIds: evaluationArrays.map((v) => v.id),
        };
    }
    async getUserPeriodException(year, periodIndex, listUserId, timeZone) {
        const results = await this.evaluationPeriodRepo.getUserPeriodException(year, periodIndex, listUserId);
        const periodCurrent = (0, util_1.getPeriodCurrent)(null, timeZone);
        const convertPeriod = Number(`${Number(year) + 1}${periodIndex}`);
        const convertPeriodCurrent = Number(`${periodCurrent.year}${periodCurrent.periodIndex}`);
        const isDisable = convertPeriodCurrent >= convertPeriod;
        if (results.dataList) {
            const dataList = results.dataList.map((v, index) => {
                var _a, _b, _c, _d;
                v.evaluations.sort((a, b) => a.id - b.id);
                return {
                    key: `parent-key-${v.id}-${index}`,
                    isEdit: !!v.evaluatorDefault,
                    isColSpan: true,
                    companyName: `${v.employeeNumber}: ${v.fullName} (${v.level > 7 ? (_a = v.division) === null || _a === void 0 ? void 0 : _a.name : (_b = v.department) === null || _b === void 0 ? void 0 : _b.name})`,
                    userId: v.id,
                    fullName: `${v.employeeNumber}: ${v.fullName}`,
                    email: v.email,
                    departmentName: v.level > 7 ? (_c = v.division) === null || _c === void 0 ? void 0 : _c.name : (_d = v.department) === null || _d === void 0 ? void 0 : _d.name,
                    companyName2: v.company.name,
                    childrens: v.evaluations.map((evaluation) => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
                        return ({
                            isEdit: !!v.evaluatorDefault,
                            id: v.id,
                            userEmail: v.email,
                            key: `children-key-${evaluation.id}`,
                            companyName: evaluation.companyName,
                            departmentName: evaluation.departmentName,
                            divisionName: evaluation.divisionName,
                            periodStart: evaluation.periodStart,
                            periodEnd: evaluation.periodEnd,
                            percentPoint: evaluation.percentPoint,
                            level: evaluation.level,
                            dateCreationGoalStart: evaluation.dateCreationGoalStart,
                            dateCreationGoalEnd: evaluation.dateCreationGoalEnd,
                            dateEvaluationStart: evaluation.dateEvaluationStart,
                            dateEvaluationEnd: evaluation.dateEvaluationEnd,
                            year: (_a = evaluation.evaluationPeriod) === null || _a === void 0 ? void 0 : _a.year,
                            periodIndex: (_b = evaluation.evaluationPeriod) === null || _b === void 0 ? void 0 : _b.periodIndex,
                            evaluator05: (_e = (_d = (_c = evaluation.evaluator.find((f) => Number(f.evaluationOrder) === 0.5)) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.dataValues) === null || _e === void 0 ? void 0 : _e.employeeNumberName,
                            evaluator05Email: (_h = (_g = (_f = evaluation.evaluator.find((f) => Number(f.evaluationOrder) === 0.5)) === null || _f === void 0 ? void 0 : _f.user) === null || _g === void 0 ? void 0 : _g.dataValues) === null || _h === void 0 ? void 0 : _h.email,
                            evaluator10: (_l = (_k = (_j = evaluation.evaluator.find((f) => Number(f.evaluationOrder) === 1.0)) === null || _j === void 0 ? void 0 : _j.user) === null || _k === void 0 ? void 0 : _k.dataValues) === null || _l === void 0 ? void 0 : _l.employeeNumberName,
                            evaluator10Email: (_p = (_o = (_m = evaluation.evaluator.find((f) => Number(f.evaluationOrder) === 1.0)) === null || _m === void 0 ? void 0 : _m.user) === null || _o === void 0 ? void 0 : _o.dataValues) === null || _p === void 0 ? void 0 : _p.email,
                            evaluator20: (_s = (_r = (_q = evaluation.evaluator.find((f) => Number(f.evaluationOrder) === 2.0)) === null || _q === void 0 ? void 0 : _q.user) === null || _r === void 0 ? void 0 : _r.dataValues) === null || _s === void 0 ? void 0 : _s.employeeNumberName,
                            evaluator20Email: (_v = (_u = (_t = evaluation.evaluator.find((f) => Number(f.evaluationOrder) === 2.0)) === null || _t === void 0 ? void 0 : _t.user) === null || _u === void 0 ? void 0 : _u.dataValues) === null || _v === void 0 ? void 0 : _v.email,
                            isDisable,
                            createdByCronjob: evaluation.createdByCronjob,
                            flagSkill: evaluation.flagSkill,
                            skillUser: evaluation.skillUser,
                        });
                    }),
                };
            });
            return {
                dataList: dataList.map((v) => (Object.assign(Object.assign({}, v), { childrens: v.childrens.sort((a, b) => {
                        const dateA = new Date(a.periodStart);
                        const dateB = new Date(b.periodStart);
                        if (dateA < dateB) {
                            return 1;
                        }
                        if (dateA > dateB) {
                            return -1;
                        }
                        return 0;
                    }) }))),
            };
        }
        return { dataList: [] };
    }
    async getDetailEvaluationPeriodForMail(condition) {
        return await this.evaluationPeriodRepo.getPeriodListByCondition(condition);
    }
    async fixEmergencyPeriod810(params) {
        var _a;
        const transaction = await this.evaluatorRepository.getNewTransaction();
        const periods = await this.evaluationPeriodRepo.getPeriodListSendMailDepartment({
            year: params.year,
            periodIndex: params.periodIndex,
        });
        const guide = await this.guideEvaluationRepository.findOneGuide({
            status: 4,
            type: 2,
        });
        const listUsers = await this.userRepo.listUserDepartment({
            level: {
                [sequelize_1.Op.in]: [8, 10, 9],
            },
            active: 1,
        });
        const arrays810s = [];
        for (let index = 0; index < listUsers.length; index++) {
            arrays810s.push({
                title: params.periodIndex === 1
                    ? params.year + '年上期'
                    : params.year + '年下期',
                userId: listUsers[index].id,
                departmentName: listUsers[index].department.name,
                divisionName: ((_a = listUsers[index]) === null || _a === void 0 ? void 0 : _a.division.name) || '',
                companyName: listUsers[index].company.name,
                periodStart: periods.periodStart,
                periodEnd: periods.periodEnd,
                status: 0,
                level: listUsers[index].level,
                evaluationPeriodId: periods.id,
                guideVersionId: guide.id,
                creationUser: null,
            });
        }
        try {
            const results = await this.evaluationRepository.createDepartmentGoals(arrays810s, transaction);
            const evaluators = [];
            if (results) {
                for (let index = 0; index < results.length; index++) {
                    if (results[index].id !== undefined) {
                        const evaluatorDefaults05 = await this.userRepo.listEvaluatorDefault({
                            userId: results[index].userId,
                            evaluationPeriodId: periods.id,
                        });
                        if (evaluatorDefaults05 && evaluatorDefaults05.evaluator05Id) {
                            evaluators.push({
                                evaluationId: results[index].id,
                                evaluatorId: results[index].userId,
                                evaluationOrder: Number(0.5),
                            });
                        }
                        if (evaluatorDefaults05 && evaluatorDefaults05.evaluator1Id) {
                            evaluators.push({
                                evaluationId: results[index].id,
                                evaluatorId: results[index].userId,
                                evaluationOrder: 1.0,
                            });
                        }
                        if (evaluatorDefaults05 && evaluatorDefaults05.evaluator2Id) {
                            evaluators.push({
                                evaluationId: results[index].id,
                                evaluatorId: results[index].userId,
                                evaluationOrder: 2.0,
                            });
                        }
                    }
                }
                await this.evaluatorRepository.createEvaluator(evaluators, transaction);
                await this.historyCronJobRepository.deleteHistory({ name: name }, transaction);
                return await transaction.commit();
            }
        }
        catch (error) {
            await transaction.rollback();
        }
    }
    async getAllPeriodNotFixedGoalPeriod(day, companyGroupCode) {
        return await this.evaluationPeriodRepo.getAllPeriodNotFixedGoalPeriod(day, companyGroupCode);
    }
    async getAllPeriodNotFixedEvalPeriod(day, companyGroupCode) {
        return await this.evaluationPeriodRepo.getAllPeriodNotFixedEvalPeriod(day, companyGroupCode);
    }
    async getEvaluationPeriodCurrent(companyGroupCode, timeZone) {
        const datas = await this.managementUserRepository.getEvaluationPeriodCurrent(companyGroupCode, timeZone);
        if (datas.length === 0) {
            return null;
        }
        return {
            datePersonal: `${datas[0].dateCreationGoalStart} ～ ${datas[0].dateCreationGoalEnd}`,
            dateDepartment: `${datas[0].dateCreationGoalDepartmentStart} ～ ${datas[0].dateCreationGoalDepartmentEnd}`,
            year: datas[0].year,
            periodIndex: datas[0].periodIndex,
        };
    }
};
__decorate([
    (0, common_1.Inject)(evaluationPeriod_repository_1.EvaluationPeriodRepository),
    __metadata("design:type", evaluationPeriod_repository_1.EvaluationPeriodRepository)
], EvaluationPeriodService.prototype, "evaluationPeriodRepo", void 0);
__decorate([
    (0, common_1.Inject)(user_repository_1.UserRepository),
    __metadata("design:type", user_repository_1.UserRepository)
], EvaluationPeriodService.prototype, "userRepo", void 0);
__decorate([
    (0, common_1.Inject)(managementUser_repository_1.ManagementUserRepository),
    __metadata("design:type", managementUser_repository_1.ManagementUserRepository)
], EvaluationPeriodService.prototype, "managementUserRepository", void 0);
__decorate([
    (0, common_1.Inject)(evaluation_repository_1.EvaluationRepository),
    __metadata("design:type", evaluation_repository_1.EvaluationRepository)
], EvaluationPeriodService.prototype, "evaluationRepository", void 0);
__decorate([
    (0, common_1.Inject)(guideEvaluation_repository_1.GuideEvaluationRepository),
    __metadata("design:type", guideEvaluation_repository_1.GuideEvaluationRepository)
], EvaluationPeriodService.prototype, "guideEvaluationRepository", void 0);
__decorate([
    (0, common_1.Inject)(evaluator_repository_1.EvaluatorRepository),
    __metadata("design:type", evaluator_repository_1.EvaluatorRepository)
], EvaluationPeriodService.prototype, "evaluatorRepository", void 0);
__decorate([
    (0, common_1.Inject)(historyCronjob_repository_1.HistoryCronJobRepository),
    __metadata("design:type", historyCronjob_repository_1.HistoryCronJobRepository)
], EvaluationPeriodService.prototype, "historyCronJobRepository", void 0);
__decorate([
    (0, common_1.Inject)(settingLevel_repository_1.SettingLevelRepository),
    __metadata("design:type", settingLevel_repository_1.SettingLevelRepository)
], EvaluationPeriodService.prototype, "settingLevelRepo", void 0);
__decorate([
    (0, common_1.Inject)(adminEvaluation_repository_1.AdminEvaluationRepository),
    __metadata("design:type", Object)
], EvaluationPeriodService.prototype, "adminEvaluationRepo", void 0);
__decorate([
    (0, common_1.Inject)(evaluationPeriodDepartmentSetting_repository_1.EvaluationPeriodDepartmentSettingRepository),
    __metadata("design:type", evaluationPeriodDepartmentSetting_repository_1.EvaluationPeriodDepartmentSettingRepository)
], EvaluationPeriodService.prototype, "deptSettingRepo", void 0);
EvaluationPeriodService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.CustomLogger])
], EvaluationPeriodService);
exports.EvaluationPeriodService = EvaluationPeriodService;
//# sourceMappingURL=evaluationPeriod.service.js.map