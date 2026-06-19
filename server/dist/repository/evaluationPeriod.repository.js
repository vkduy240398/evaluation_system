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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationPeriodRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const util_1 = require("../common/util");
const EntityConstant_1 = require("../constant/EntityConstant");
const Company_1 = require("../entity/Company");
const Department_1 = require("../entity/Department");
const Evaluation_1 = require("../entity/Evaluation");
const EvaluationPeriod_1 = require("../entity/EvaluationPeriod");
const Evaluator_1 = require("../entity/Evaluator");
const EvaluatorDefault_1 = require("../entity/EvaluatorDefault");
const ListBasicBehavior_1 = require("../entity/ListBasicBehavior");
const Skill_1 = require("../entity/Skill");
const SkillUser_1 = require("../entity/SkillUser");
const User_1 = require("../entity/User");
const moment = require("moment");
let EvaluationPeriodRepository = class EvaluationPeriodRepository {
    async getEvaluationPeriod(timeZone) {
        const today = moment().tz(timeZone).format('YYYY/MM/DD');
        const sql = `select date_creation_goal_start, date_creation_goal_end, date_creation_goal_department_start, date_creation_goal_department_end, year, period_index "periodIndex", period_start "periodStart", period_end "periodEnd"
      from evaluation_period_tbl where (TO_TIMESTAMP(date_creation_goal_start, 'YYYY/MM/DD') <= :today AND TO_TIMESTAMP(date_creation_goal_end, 'YYYY/MM/DD') >= :today)
      or (TO_TIMESTAMP(date_creation_goal_department_start, 'YYYY/MM/DD') <= :today AND TO_TIMESTAMP(date_creation_goal_department_end, 'YYYY/MM/DD') >= :today)`;
        const periods = await this.evaluationPeriodEntity.sequelize.query(sql, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: {
                today: today,
            },
        });
        return periods;
    }
    async getProgressingPeriod(companyGroupCode, timeZone) {
        const today = moment().tz(timeZone).format('YYYY/MM/DD');
        const sql = `select *
      from evaluation_period_tbl where ((TO_TIMESTAMP(date_creation_goal_start, 'YYYY/MM/DD') <= :today AND TO_TIMESTAMP(date_creation_goal_end, 'YYYY/MM/DD') >= :today)
      or (TO_TIMESTAMP(date_evaluation_start, 'YYYY/MM/DD') <= :today AND TO_TIMESTAMP(date_evaluation_end, 'YYYY/MM/DD') >= :today)
      or (TO_TIMESTAMP(date_creation_goal_department_start, 'YYYY/MM/DD') <= :today AND TO_TIMESTAMP(date_creation_goal_department_end, 'YYYY/MM/DD') >= :today)
      or (TO_TIMESTAMP(date_evaluation_department_start, 'YYYY/MM/DD') <= :today AND TO_TIMESTAMP(date_evaluation_department_end, 'YYYY/MM/DD') >= :today))
      and year in (date_part('year', now())::text, date_part('year', now() - interval '1 year')::text)
      AND company_group_code = :companyGroupCode
      `;
        const periods = await this.evaluationPeriodEntity.sequelize.query(sql, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: {
                today: today,
                companyGroupCode: companyGroupCode,
            },
        });
        return periods;
    }
    async getAll(condition) {
        return await this.evaluationPeriodEntity.findAll({
            attributes: [
                'id',
                'dateCreationGoalStart',
                'dateCreationGoalEnd',
                'dateEvaluationStart',
                'dateEvaluationEnd',
                'dateCreationGoalDepartmentStart',
                'dateCreationGoalDepartmentEnd',
                'dateEvaluationDepartmentStart',
                'dateEvaluationDepartmentEnd',
            ],
            where: condition,
        });
    }
    async getPeriodByCondition(condition) {
        const currentPeriod = await this.evaluationPeriodEntity.findOne({
            where: [condition],
        });
        return currentPeriod;
    }
    async listPeriodByYear(yearStart, yearEnd, companyGroupCode) {
        return await this.evaluationPeriodEntity.findAll({
            where: {
                year: {
                    [sequelize_1.Op.between]: [yearStart, yearEnd.toString()],
                },
                companyGroupCode,
            },
            order: [
                ['year', 'DESC'],
                ['periodIndex', 'DESC'],
            ],
        });
    }
    async getEvaluationDatesByPeriodIds(periodIds, companyGroupCode) {
        if (!periodIds.length)
            return [];
        const sql = `
      SELECT
        evaluation_period_id AS "evaluationPeriodId",
        date_creation_goal_start AS "dateCreationGoalStart",
        date_creation_goal_end AS "dateCreationGoalEnd",
        date_evaluation_start AS "dateEvaluationStart",
        date_evaluation_end AS "dateEvaluationEnd"
      FROM evaluation_tbl
      WHERE evaluation_period_id IN (:periodIds)
        AND company_group_code = :companyGroupCode
    `;
        return this.evaluationPeriodEntity.sequelize.query(sql, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: { periodIds, companyGroupCode },
        });
    }
    async getPeriodListByCondition(condition) {
        return await this.evaluationPeriodEntity.findAll({
            where: condition,
        });
    }
    async savePeriod(condition, updateValues) {
        return await this.evaluationPeriodEntity.update(updateValues, {
            where: condition,
            returning: true,
        });
    }
    async getEvaluationByPeriod(userId, evaluationPeriodId, companyGroupCode) {
        return await this.evaluationEntity.findAll({
            where: {
                userId: userId,
                evaluationPeriodId: evaluationPeriodId,
                companyGroupCode: companyGroupCode,
            },
            attributes: [
                'id',
                'companyName',
                'departmentName',
                'divisionName',
                'level',
                'percentPoint',
                'dateCreationGoalStart',
                'dateCreationGoalEnd',
                'dateEvaluationStart',
                'dateEvaluationEnd',
                'status',
                'periodStart',
                'periodEnd',
                'creationUser',
                'createdByCronjob',
                'flagSkill',
            ],
            include: [
                {
                    attributes: ['evaluationOrder', 'evaluatorId'],
                    model: Evaluator_1.Evaluator,
                    as: 'evaluator',
                    include: [
                        {
                            model: User_1.User,
                            as: 'user',
                        },
                    ],
                },
            ],
        });
    }
    async getSkillUserOfEvaluation(evaluationId) {
        return await this.skillUser.findAll({
            where: { evaluationId },
            include: [
                {
                    model: Skill_1.Skill,
                    as: 'skill',
                    attributes: ['id', 'name'],
                },
            ],
        });
    }
    async updateEvaluationPeriodException(evaluations, userId, creationUser, deleteIds, year, periodIndex, levelSettings, guideEvaluation, companyGroupCode) {
        var _a, e_1, _b, _c;
        var _d, _e, _f, _g, _h, _j, _k, _l;
        const convertEvaluations = evaluations.map((v) => {
            if (v.evaluator20 === v.evaluator05)
                v.evaluator05 = null;
            if (v.evaluator20 === v.evaluator10 && v.evaluator10 !== v.evaluator05) {
                v.evaluator10 = null;
            }
            if (v.evaluator10 === v.evaluator05)
                v.evaluator05 = null;
            return v;
        });
        const resetPersonalAchievement = [];
        const resetEvaluationIds = [];
        const updateBehaviorByEvaluationIds = [];
        const updateGoalPersonal17ByEvaluationIds = [];
        const updateGoalPersonal810ByEvaluationIds = [];
        const evaluator05ErrorIds = [];
        const evaluator10ErrorIds = [];
        const evaluatorErrorNames = [];
        const evaluationArrays = [];
        if (convertEvaluations.length > 0) {
            const evaluationOlds = convertEvaluations.filter((f) => f.id !== 0);
            const evaluationNews = convertEvaluations
                .filter((f) => f.id === 0)
                .map((v) => {
                var _a, _b, _c, _d;
                const isSkill = v.level < 8
                    ? v.flagSkill === 1
                        ? 1
                        : 3
                    : v.flagSkill === 1
                        ? 2
                        : 4;
                const isGuide = v.level < 8
                    ? v.flagSkill === 1
                        ? 1
                        : 3
                    : v.flagSkill === 1
                        ? 2
                        : 4;
                return {
                    percentPoint: v.percentPoint,
                    level: v.level,
                    title: v.period,
                    status: 0,
                    companyName: v.companyName,
                    departmentId: v.departmentId,
                    departmentName: v.departmentName,
                    divisionId: v.divisionId,
                    divisionName: v.divisionName,
                    periodStart: v.periodStart,
                    periodEnd: v.periodEnd,
                    dateCreationGoalStart: v.dateCreationGoalStart,
                    dateCreationGoalEnd: v.dateCreationGoalEnd,
                    dateEvaluationStart: v.dateEvaluationStart,
                    dateEvaluationEnd: v.dateEvaluationEnd,
                    evaluator05: v.evaluator05,
                    evaluator10: v.evaluator10,
                    evaluator20: v.evaluator20,
                    evaluationPeriodId: v.evaluationPeriodId,
                    userId,
                    creationUser,
                    skillPercent: (_a = levelSettings.find((f) => (f === null || f === void 0 ? void 0 : f.level) === v.level && f.type === isSkill)) === null || _a === void 0 ? void 0 : _a.skillPercent,
                    behaviorPercent: (_b = levelSettings.find((f) => (f === null || f === void 0 ? void 0 : f.level) === v.level && f.type === isSkill)) === null || _b === void 0 ? void 0 : _b.behaviorPercent,
                    achievementPercent: (_c = levelSettings.find((f) => (f === null || f === void 0 ? void 0 : f.level) === v.level && f.type === isSkill)) === null || _c === void 0 ? void 0 : _c.achievementPercent,
                    guideVersionId: (_d = guideEvaluation.find((f) => f.type === isGuide)) === null || _d === void 0 ? void 0 : _d.id,
                    flagSkill: v.flagSkill,
                    skillUser: v.skillUser,
                    companyGroupCode: companyGroupCode,
                };
            });
            if (evaluationOlds.length > 0) {
                evaluationArrays.push(...evaluationOlds);
                const ids = evaluationOlds.map((v) => v.id);
                const evaluations = await this.evaluationEntity.findAll({
                    where: { id: { [sequelize_1.Op.in]: ids } },
                    include: { model: Evaluator_1.Evaluator, as: 'evaluator' },
                });
                if (evaluations.length > 0) {
                    try {
                        for (var _m = true, evaluations_1 = __asyncValues(evaluations), evaluations_1_1; evaluations_1_1 = await evaluations_1.next(), _a = evaluations_1_1.done, !_a;) {
                            _c = evaluations_1_1.value;
                            _m = false;
                            try {
                                const v = _c;
                                const item = evaluationOlds.find((f) => f.id === v.id);
                                if (item) {
                                    const listDepDivId = [];
                                    if (v.status < 50) {
                                        if ((item.departmentId !== undefined &&
                                            v.departmentId !== item.departmentId &&
                                            (item.level || v.level) < 8) ||
                                            (item.divisionId !== undefined &&
                                                v.divisionId !== item.divisionId) ||
                                            (v.level < 8 && item.level > 7) ||
                                            (v.level > 7 && item.level < 8) ||
                                            v.flagSkill !== item.flagSkill) {
                                            resetEvaluationIds.push(v.id);
                                            if ((item.departmentId !== undefined &&
                                                v.departmentId !== item.departmentId &&
                                                (item.level || v.level) < 8) ||
                                                (item.divisionId !== undefined &&
                                                    v.divisionId !== item.divisionId)) {
                                                resetPersonalAchievement.push(v.id);
                                            }
                                            else if (v.level < 8 && item.level > 7) {
                                                updateGoalPersonal810ByEvaluationIds.push(v.id);
                                            }
                                            else if (v.level > 7 && item.level < 8) {
                                                updateGoalPersonal17ByEvaluationIds.push(v.id);
                                            }
                                        }
                                        else if (item.level !== v.level) {
                                            updateBehaviorByEvaluationIds.push(v.id);
                                        }
                                        if ((item === null || item === void 0 ? void 0 : item.departmentId) || (item === null || item === void 0 ? void 0 : item.divisionId)) {
                                            if ((item === null || item === void 0 ? void 0 : item.departmentId) || v.departmentId) {
                                                listDepDivId.push((item === null || item === void 0 ? void 0 : item.departmentId) || v.departmentId);
                                            }
                                            listDepDivId.push((item === null || item === void 0 ? void 0 : item.divisionId) || v.divisionId);
                                        }
                                        v.level = item.level;
                                        v.departmentId = item.departmentId;
                                        v.departmentName = item.departmentName;
                                        v.divisionId = item.divisionId;
                                        v.divisionName = item.divisionName;
                                        v.companyName = item.companyName;
                                        const isSkill = item.level < 8
                                            ? item.flagSkill === 1
                                                ? 1
                                                : 3
                                            : item.flagSkill === 1
                                                ? 2
                                                : 4;
                                        const isGuide = item.level < 8
                                            ? item.flagSkill === 1
                                                ? 1
                                                : 3
                                            : item.flagSkill === 1
                                                ? 2
                                                : 4;
                                        v.skillPercent = (_d = levelSettings.find((f) => (f === null || f === void 0 ? void 0 : f.level) === item.level && f.type === isSkill)) === null || _d === void 0 ? void 0 : _d.skillPercent;
                                        v.behaviorPercent = (_e = levelSettings.find((f) => (f === null || f === void 0 ? void 0 : f.level) === item.level && f.type === isSkill)) === null || _e === void 0 ? void 0 : _e.behaviorPercent;
                                        v.achievementPercent = (_f = levelSettings.find((f) => (f === null || f === void 0 ? void 0 : f.level) === item.level && f.type === isSkill)) === null || _f === void 0 ? void 0 : _f.achievementPercent;
                                        v.guideVersionId = (_g = guideEvaluation.find((f) => f.type === isGuide)) === null || _g === void 0 ? void 0 : _g.id;
                                    }
                                    v.periodStart = item.periodStart;
                                    v.periodEnd = item.periodEnd;
                                    v.percentPoint = item.percentPoint;
                                    v.dateCreationGoalStart = item.dateCreationGoalStart;
                                    v.dateCreationGoalEnd = item.dateCreationGoalEnd;
                                    v.dateEvaluationStart = item.dateEvaluationStart;
                                    v.dateEvaluationEnd = item.dateEvaluationEnd;
                                    v.creationUser = creationUser;
                                    v.flagSkill = item.flagSkill;
                                    const evaluators = await v.getEvaluator();
                                    if (item.evaluator05) {
                                        const findEvaluator = evaluators.find((f) => Number(f.evaluationOrder) === 0.5);
                                        if (findEvaluator) {
                                            findEvaluator.evaluatorId = item.evaluator05 || null;
                                            findEvaluator.save();
                                        }
                                        else {
                                            const data = {
                                                evaluatorId: item.evaluator05,
                                                evaluationOrder: 0.5,
                                                commentPrivate: '',
                                                commentPublic: '',
                                            };
                                            v.createEvaluator(data);
                                        }
                                    }
                                    else if (![3, 4, 53, 54, 55].includes(v.status)) {
                                        (_h = evaluators
                                            .find((f) => Number(f.evaluationOrder) === 0.5)) === null || _h === void 0 ? void 0 : _h.destroy();
                                    }
                                    else {
                                        evaluatorErrorNames.push(item.evaluator05Name);
                                        evaluator05ErrorIds.push(v.id);
                                    }
                                    if (item.evaluator10) {
                                        const findEvaluator = evaluators.find((f) => Number(f.evaluationOrder) === 1.0);
                                        if (findEvaluator) {
                                            findEvaluator.evaluatorId = item.evaluator10;
                                            findEvaluator.save();
                                        }
                                        else {
                                            const data = {
                                                evaluatorId: item.evaluator10,
                                                evaluationOrder: 1.0,
                                                commentPrivate: '',
                                                commentPublic: '',
                                            };
                                            v.createEvaluator(data);
                                        }
                                    }
                                    else if (![5, 6, 56, 57, 58].includes(v.status)) {
                                        (_j = evaluators
                                            .find((f) => Number(f.evaluationOrder) === 1.0)) === null || _j === void 0 ? void 0 : _j.destroy();
                                    }
                                    else {
                                        evaluatorErrorNames.push(item.evaluator10Name);
                                        evaluator10ErrorIds.push(v.id);
                                    }
                                    if (item.evaluator20) {
                                        const findEvaluator = evaluators.find((f) => Number(f.evaluationOrder) === 2.0);
                                        if (findEvaluator) {
                                            findEvaluator.evaluatorId = item.evaluator20;
                                            findEvaluator.save();
                                        }
                                        else {
                                            const data = {
                                                evaluatorId: item.evaluator20,
                                                evaluationOrder: 2.0,
                                                commentPrivate: '',
                                                commentPublic: '',
                                            };
                                            v.createEvaluator(data);
                                        }
                                    }
                                    const evaluationId = item.id;
                                    const temSkillAlreadySetting = await this.skillUser.findAll({
                                        attributes: ['skillId'],
                                        where: {
                                            evaluationId: evaluationId,
                                        },
                                    });
                                    const skillAlreadySetting = [];
                                    if (temSkillAlreadySetting.length > 0) {
                                        temSkillAlreadySetting.map((item) => {
                                            skillAlreadySetting.push(item.skillId);
                                        });
                                    }
                                    if (v.status < 50) {
                                        const skillDelete = (0, util_1.findDeletedIdsSkill)(item === null || item === void 0 ? void 0 : item.skillUser, skillAlreadySetting);
                                        if (skillDelete.length > 0) {
                                            await this.evaluationEntity.sequelize.query('CALL delete_skill_evaluation(ARRAY[:skillDelete], :evaluationId, :companyGroupCode)', {
                                                replacements: {
                                                    skillDelete: skillDelete,
                                                    evaluationId: evaluationId,
                                                    companyGroupCode: companyGroupCode,
                                                },
                                                type: sequelize_1.QueryTypes.RAW,
                                                logging: false,
                                            });
                                        }
                                    }
                                    await this.skillUser.destroy({
                                        where: {
                                            evaluationId: evaluationId,
                                        },
                                    });
                                    const listSkillUpdate = [];
                                    if (item === null || item === void 0 ? void 0 : item.flagSkill) {
                                        const arrayDiffernet = await (0, util_1.areSortedArraysDifferent)(skillAlreadySetting, item === null || item === void 0 ? void 0 : item.skillUser);
                                        if (resetPersonalAchievement.includes(v.id) &&
                                            !arrayDiffernet) {
                                            const skillGroups = await this.skillGroupEntity.findAll({
                                                attributes: ['skillId'],
                                                where: {
                                                    departmentId: listDepDivId,
                                                },
                                            });
                                            for (let i = 0; i < (skillGroups === null || skillGroups === void 0 ? void 0 : skillGroups.length); i++) {
                                                const element = skillGroups[i];
                                                listSkillUpdate.push({
                                                    userId: userId,
                                                    skillId: element === null || element === void 0 ? void 0 : element.skillId,
                                                    periodId: item.evaluationPeriodId,
                                                    evaluationId: item.id,
                                                    type: 1,
                                                });
                                            }
                                        }
                                        else {
                                            if (((_k = item === null || item === void 0 ? void 0 : item.skillUser) === null || _k === void 0 ? void 0 : _k.length) > 0) {
                                                for (let i = 0; i < ((_l = item === null || item === void 0 ? void 0 : item.skillUser) === null || _l === void 0 ? void 0 : _l.length); i++) {
                                                    const element = item === null || item === void 0 ? void 0 : item.skillUser[i];
                                                    listSkillUpdate.push({
                                                        userId: userId,
                                                        skillId: element,
                                                        periodId: item.evaluationPeriodId,
                                                        evaluationId: item.id,
                                                        type: 1,
                                                    });
                                                }
                                            }
                                        }
                                        if (listSkillUpdate.length > 0) {
                                            await this.skillUser.bulkCreate(listSkillUpdate);
                                        }
                                    }
                                    await v.save();
                                }
                            }
                            finally {
                                _m = true;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (!_m && !_a && (_b = evaluations_1.return)) await _b.call(evaluations_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
            }
            if (evaluationNews) {
                await this.evaluationEntity
                    .bulkCreate([...evaluationNews], { ignoreDuplicates: true })
                    .then(async (res) => {
                    if (res.length > 0) {
                        res.map(async (v, i) => {
                            var _a;
                            const evaluator = evaluationNews[i];
                            if (evaluator) {
                                if (evaluator.evaluator05) {
                                    v.createEvaluator({
                                        evaluatorId: evaluator.evaluator05,
                                        evaluationOrder: 0.5,
                                    });
                                }
                                if (evaluator.evaluator10) {
                                    v.createEvaluator({
                                        evaluatorId: evaluator.evaluator10,
                                        evaluationOrder: 1.0,
                                    });
                                }
                                if (evaluator.evaluator20) {
                                    v.createEvaluator({
                                        evaluatorId: evaluator.evaluator20,
                                        evaluationOrder: 2.0,
                                    });
                                }
                                evaluationArrays.push(Object.assign(Object.assign({ id: v.id }, evaluator), { period: '', evaluator05Name: '', evaluator10Name: '', evaluator20Name: '', key: '', isEdit: false }));
                                if (evaluator.flagSkill == 1) {
                                    const listSkillUpdate = [];
                                    for (let i = 0; i < ((_a = evaluator.skillUser) === null || _a === void 0 ? void 0 : _a.length); i++) {
                                        const skillId = evaluator === null || evaluator === void 0 ? void 0 : evaluator.skillUser[i];
                                        listSkillUpdate.push({
                                            userId: evaluator.userId,
                                            skillId: skillId,
                                            periodId: evaluator.evaluationPeriodId,
                                            evaluationId: v.id,
                                            type: 1,
                                        });
                                    }
                                    await this.skillUser.bulkCreate(listSkillUpdate);
                                }
                            }
                        });
                    }
                });
            }
            if (deleteIds.length > 0) {
                await this.evaluationEntity.sequelize.query(` CALL backup_evaluation(ARRAY[:deleteIds]::integer[]);`, {
                    replacements: {
                        deleteIds: deleteIds,
                    },
                    type: sequelize_1.QueryTypes.RAW,
                    logging: false,
                });
                await this.deleteEvaluation(deleteIds, false, year, periodIndex, userId, companyGroupCode);
            }
        }
        else {
            await this.evaluationEntity.sequelize.query(` CALL backup_evaluation(ARRAY[:deleteIds]::integer[]);`, {
                replacements: {
                    deleteIds: deleteIds,
                },
                type: sequelize_1.QueryTypes.RAW,
                logging: false,
            });
            await this.deleteEvaluation(deleteIds, true, year, periodIndex, userId, companyGroupCode);
        }
        return {
            updateGoalPersonal810ByEvaluationIds,
            updateGoalPersonal17ByEvaluationIds,
            updateBehaviorByEvaluationIds,
            resetEvaluationIds,
            resetPersonalAchievement,
            evaluationArrays,
            evaluator05ErrorIds,
            evaluator10ErrorIds,
            evaluatorErrorNames: [...new Set(evaluatorErrorNames)],
        };
    }
    async deleteEvaluation(deleteIds, isEmpty = false, year = 2023, periodIndex = 1, userId = 1, companyGroupCode) {
        const includes = isEmpty
            ? [
                {
                    model: EvaluationPeriod_1.EvaluationPeriod,
                    as: 'evaluationPeriod',
                    where: {
                        year: year,
                        periodIndex: periodIndex,
                        companyGroupCode: companyGroupCode,
                    },
                },
            ]
            : undefined;
        const ids = [...new Set(deleteIds)];
        const condition = isEmpty || deleteIds.length > 0 ? { id: { [sequelize_1.Op.in]: ids } } : {};
        await this.evaluationEntity
            .findAll({
            attributes: ['id'],
            where: Object.assign(Object.assign({}, condition), { userId: userId, companyGroupCode: companyGroupCode }),
            include: includes,
        })
            .then(async (evaluations) => {
            if (evaluations.length > 0) {
                const evaluationIds = evaluations.map((v) => v.id);
                await this.summaryDepartment.destroy({
                    where: { evaluationId: evaluationIds },
                });
                await this.skillUser.destroy({
                    where: { evaluationId: evaluationIds },
                });
                await this.evaluationEntity.destroy({ where: { id: evaluationIds } });
            }
        });
    }
    async resetEvaluationData(ids, resetPersonalAchievement) {
        await this.evaluationEntity.update(Object.assign({}, util_1.resetEvaluationData), { where: { id: { [sequelize_1.Op.in]: ids } } });
        if (resetPersonalAchievement.length > 0) {
            await this.evaluationAchievementPersonalEntity.destroy({
                where: { evaluationId: { [sequelize_1.Op.in]: resetPersonalAchievement } },
            });
            await this.evaluationAchievementPersonalSubEntity.destroy({
                where: { achievementPersonalId: { [sequelize_1.Op.is]: null } },
            });
        }
        this.historyApproveEvaluation.destroy({
            where: { evaluationId: { [sequelize_1.Op.in]: ids } },
        });
        await this.evaluationBasicBehaviorEntity.destroy({
            where: { evaluationId: { [sequelize_1.Op.in]: ids } },
        });
        await this.evaluationPro.destroy({
            where: { evaluationId: { [sequelize_1.Op.in]: ids } },
        });
    }
    async updateBehaviorByEvaluationIds(ids, companyGroupCode) {
        var _a;
        await this.evaluationBasicBehaviorEntity.destroy({
            where: {
                evaluationId: ids,
                type: {
                    [sequelize_1.Op.not]: [1, 4],
                },
            },
        });
        const evaluations = (await this.evaluationEntity.findAll({
            attributes: ['id', 'level', 'flagSkill'],
            where: { id: ids },
        })).map((data) => data && data.get({ plain: true }));
        if (evaluations) {
            const levels = evaluations.map((v) => v.level);
            const getBehaviors = (await this.versionBasicBehavior.findAll({
                where: {
                    status: 4,
                    level: levels,
                    companyGroupCode: companyGroupCode,
                    type: {
                        [sequelize_1.Op.not]: [1, 4],
                    },
                },
                include: { model: ListBasicBehavior_1.ListBasicBehavior, as: 'listBasicBehaviors' },
            })).map((data) => data && data.get({ plain: true }));
            if (getBehaviors.length > 0) {
                for (let i = 0; i < evaluations.length; i++) {
                    const element = evaluations[i];
                    const behaviorType = evaluations[i].level < 8
                        ? evaluations[i].flagSkill === 1
                            ? 2
                            : 3
                        : evaluations[i].flagSkill === 1
                            ? 5
                            : 6;
                    const behaviors = getBehaviors.find((f) => f.level === element.level && f.type === behaviorType);
                    if (behaviors && ((_a = behaviors.listBasicBehaviors) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                        const datas = behaviors.listBasicBehaviors.map((v, i) => (Object.assign(Object.assign({}, v), { itemNo: i, type: behaviorType, itemTitle: v.title, evaluationId: element.id })));
                        this.evaluationBasicBehaviorEntity.bulkCreate(datas, {
                            ignoreDuplicates: true,
                        });
                    }
                }
            }
        }
    }
    async updateGoalPersonalByEvaluationIds(idsUpdateGoal17, idsUpdateGoal810) {
        if (idsUpdateGoal17.length > 0) {
            await this.evaluationAchievementPersonalEntity.update({ type: 1 }, { where: { evaluationId: idsUpdateGoal17, type: 2 } });
            await this.evaluationAchievementPersonalEntity.destroy({
                where: { evaluationId: idsUpdateGoal17, type: 3 },
            });
        }
        if (idsUpdateGoal810.length > 0) {
            await this.evaluationAchievementPersonalEntity.update({ type: 2 }, { where: { evaluationId: idsUpdateGoal810 } });
        }
    }
    async findOnePeriod(where) {
        return await this.evaluationPeriodEntity.findOne({
            where: where,
        });
    }
    async getPeriodListSendMailDepartment(condition) {
        return await this.evaluationPeriodEntity.findOne({
            where: condition,
        });
    }
    async getUserPeriodException(year, periodIndex, listUserId) {
        const results = await this.userEntity.findAll({
            include: [
                {
                    attributes: [
                        'id',
                        'companyName',
                        'departmentName',
                        'divisionName',
                        'periodStart',
                        'periodEnd',
                        'percentPoint',
                        'level',
                        'dateCreationGoalStart',
                        'dateCreationGoalEnd',
                        'dateEvaluationStart',
                        'dateEvaluationEnd',
                        'createdByCronjob',
                        'flagSkill',
                    ],
                    model: Evaluation_1.Evaluation,
                    as: 'evaluations',
                    required: true,
                    subQuery: true,
                    where: { creationUser: { [sequelize_1.Op.ne]: null } },
                    include: [
                        {
                            attributes: ['evaluationOrder'],
                            model: Evaluator_1.Evaluator,
                            as: 'evaluator',
                            include: [
                                {
                                    attributes: [
                                        'fullName',
                                        'email',
                                        [
                                            sequelize_1.Sequelize.fn('CONCAT', sequelize_1.Sequelize.col('employee_number'), ': ', sequelize_1.Sequelize.col('full_name')),
                                            'employeeNumberName',
                                        ],
                                    ],
                                    model: User_1.User,
                                    as: 'user',
                                },
                            ],
                        },
                        {
                            model: SkillUser_1.SkillUser,
                            as: 'skillUser',
                            include: [
                                {
                                    model: Skill_1.Skill,
                                    as: 'skill',
                                    attributes: ['id', 'name'],
                                },
                            ],
                        },
                        {
                            required: true,
                            attributes: [
                                'dateCreationGoalStart',
                                'dateCreationGoalDepartmentStart',
                                'dateCreationGoalEnd',
                                'dateCreationGoalDepartmentEnd',
                                'year',
                                'periodIndex',
                            ],
                            model: EvaluationPeriod_1.EvaluationPeriod,
                            as: 'evaluationPeriod',
                            where: { year, periodIndex },
                        },
                    ],
                },
                { model: Department_1.Department, as: 'department', attributes: ['code', 'name'] },
                { model: Department_1.Department, as: 'division', attributes: ['code', 'name'] },
                { model: Company_1.Company, as: 'company', attributes: ['name'] },
                {
                    model: EvaluatorDefault_1.EvaluatorDefault,
                    as: 'evaluatorDefault',
                    attributes: ['departmentName', 'level'],
                },
            ],
            where: { id: { [sequelize_1.Op.in]: listUserId } },
            limit: 99999,
            offset: 0,
            order: [['employeeNumber', 'ASC']],
        });
        return { dataList: results };
    }
    async getAllByCondition(where) {
        return await this.evaluationPeriodEntity.findAll({
            where: where,
        });
    }
    async getAllPeriodNotFixedGoalPeriod(day, companyGroupCode) {
        const datas = await this.evaluationPeriodEntity.sequelize.query(`
      SELECT DISTINCT
        ep.id,
        ep.year,
        ep.period_index
      FROM public.evaluation_tbl ev
      LEFT JOIN public.evaluation_period_tbl ep
        ON ev.evaluation_period_id = ep.id
      LEFT JOIN public.user_tbl us
        ON ev.user_id = us.id
      INNER JOIN public.evaluator_default_tbl ed
        ON ed.user_id = ev.user_id AND ed.evaluation_period_id = ev.evaluation_period_id
      WHERE 
        ((
          ev.creation_user IS NOT NULL
            AND ev.date_creation_goal_end IS NOT NULL
          AND CURRENT_DATE + :day = TO_DATE(ev.date_creation_goal_end, 'YYYY/MM/DD')
        )
        OR
        (
          ev.creation_user IS NULL
          AND 
          (
            (
            ev.level <= 7
            AND CURRENT_DATE + :day = TO_DATE(ep.date_creation_goal_end, 'YYYY/MM/DD')
          )
          OR
          (
            ev.level > 7 AND ev.level <= 10
            AND CURRENT_DATE + :day = TO_DATE(ep.date_creation_goal_department_end, 'YYYY/MM/DD')
          )
          )
        ))
        AND ev.status < 49
        AND us.active = 1
        AND ev.company_group_code = :companyGroupCode
    `, {
            replacements: {
                day: day,
                companyGroupCode: companyGroupCode,
            },
        });
        return datas;
    }
    async getAllPeriodNotFixedEvalPeriod(day, companyGroupCode) {
        const datas = await this.evaluationPeriodEntity.sequelize.query(`
      SELECT DISTINCT
        ep.id,
        ep.year,
        ep.period_index
      FROM public.evaluation_tbl ev
      LEFT JOIN public.evaluation_period_tbl ep
        ON ev.evaluation_period_id = ep.id
      LEFT JOIN public.user_tbl us
        ON ev.user_id = us.id
      INNER JOIN public.evaluator_default_tbl ed
        ON ed.user_id = ev.user_id AND ed.evaluation_period_id = ev.evaluation_period_id
      WHERE 
        ((
          ev.creation_user IS NOT NULL
          AND
          (
            ev.date_evaluation_end IS NOT NULL
            AND CURRENT_DATE + :day = TO_DATE(ev.date_evaluation_end, 'YYYY/MM/DD')
          ) OR
          (
            ev.date_evaluation_end IS NULL
            AND
            (
              ev.level <= 7
	            AND CURRENT_DATE + :day = TO_DATE(ep.date_evaluation_end, 'YYYY/MM/DD')
            ) OR
            (
              ev.level > 7 AND ev.level <= 10
	            AND CURRENT_DATE + :day = TO_DATE(ep.date_evaluation_department_end, 'YYYY/MM/DD')
            )
          )
        )
        OR
        (
          ev.creation_user IS NULL
          AND 
          (
            (
            ev.level <= 7
            AND CURRENT_DATE + :day = TO_DATE(ep.date_evaluation_end, 'YYYY/MM/DD')
          )
          OR
          (
            ev.level > 7 AND ev.level <= 10
            AND CURRENT_DATE + :day = TO_DATE(ep.date_evaluation_department_end, 'YYYY/MM/DD')
          )
          )
        ))
        AND ev.status > 49 AND ev.status < 98
        AND us.active = 1
        AND ev.company_group_code = :companyGroupCode
    `, {
            replacements: {
                day: day,
                companyGroupCode: companyGroupCode,
            },
        });
        return datas;
    }
    async getPeriodDetail(year, periodIndex, companyGroupCode) {
        const currentPeriod = await this.evaluationPeriodEntity.findOne({
            where: {
                year: year,
                periodIndex: periodIndex,
                companyGroupCode: companyGroupCode,
            },
        });
        return currentPeriod;
    }
    async goalsPastEvaluationRepo(type, year, periodIndex, userId, evaluationPeriodId) {
        return await this.evaluationPeriodEntity.sequelize.query(`
          SELECT pg.id,pg.title as title, pg.achievement_value as "achievementValue",
          pg.method as method, pg.weight as weight, pg.difficulty_user as difficulty,
          COALESCE(
          json_agg(json_build_object(
            'evaluationDecision', pgSub.evaluation_decision,
            'degree', pgSub.degree,
            'achievementId', pgSub.achievement_personal_id,
            'point', pgSub.coefficient
          ) ORDER BY pgSub.id ASC) FILTER (where pgSub.id IS NOT NULL)
          ) as "evaluationAchievementPersonalSub",
        CASE 
          WHEN eval.creation_user IS NOT NULL 
            THEN evaluation_period_tbl.period_start || ' ~ ' || evaluation_period_tbl.period_end
          ELSE 
            eval.period_start || ' ~ ' || eval.period_end
        END AS period,
          case when eval.level <= 7 then eval.department_name ELSE eval.division_name END as "departmentName"
          FROM evaluation_achievement_personal_tbl as pg
            INNER JOIN evaluation_achievement_personal_sub_tbl as pgSub ON pgSub.achievement_personal_id = pg.id
            INNER JOIN evaluation_tbl as eval ON eval.id = pg.evaluation_id
            INNER JOIN evaluation_period_tbl ON evaluation_period_tbl.id = eval.evaluation_period_id
            WHERE evaluation_period_tbl.year = :year 
            AND evaluation_period_tbl.period_index = :periodIndex 
            AND eval.user_id = :userId 
            AND eval.evaluation_period_id < :evaluationPeriodId
            AND pg.type = :type
          GROUP BY pg.title,
          pg.achievement_value, pg.method,
          pg.weight, pg.difficulty_user,
          pg.id, period, 
         "departmentName", eval.creation_user,
         evaluation_period_tbl.period_start, eval.period_start
         ORDER BY 
        CASE
            WHEN eval.creation_user IS NOT NULL 
                THEN evaluation_period_tbl.period_start -- Sắp xếp theo ngày bắt đầu của kỳ đánh giá
            ELSE 
                eval.period_start -- Hoặc theo ngày bắt đầu tùy chỉnh
        END DESC; -- Sắp xếp GIẢM DẦN (DESC) để hiển thị thời gian mới nhất trước
      `, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: {
                type: Number(type),
                year: year,
                userId: userId,
                periodIndex: periodIndex,
                evaluationPeriodId: evaluationPeriodId,
            },
        });
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_PERIOD),
    __metadata("design:type", Object)
], EvaluationPeriodRepository.prototype, "evaluationPeriodEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION),
    __metadata("design:type", Object)
], EvaluationPeriodRepository.prototype, "evaluationEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATOR_DEFAULT),
    __metadata("design:type", Object)
], EvaluationPeriodRepository.prototype, "evaluatorDefaultEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.USER),
    __metadata("design:type", Object)
], EvaluationPeriodRepository.prototype, "userEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SKILL_GROUP),
    __metadata("design:type", Object)
], EvaluationPeriodRepository.prototype, "skillGroupEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_ACHIEVEMENT_PERSONAL),
    __metadata("design:type", Object)
], EvaluationPeriodRepository.prototype, "evaluationAchievementPersonalEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_ACHIEVEMENT_PERSONAL_SUB),
    __metadata("design:type", Object)
], EvaluationPeriodRepository.prototype, "evaluationAchievementPersonalSubEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_BASIC_BEHAVIOR),
    __metadata("design:type", Object)
], EvaluationPeriodRepository.prototype, "evaluationBasicBehaviorEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.HISTORY_APPROVE_EVALUATION),
    __metadata("design:type", Object)
], EvaluationPeriodRepository.prototype, "historyApproveEvaluation", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_PRO),
    __metadata("design:type", Object)
], EvaluationPeriodRepository.prototype, "evaluationPro", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.VERSION_BASIC_BEHAVIOR),
    __metadata("design:type", Object)
], EvaluationPeriodRepository.prototype, "versionBasicBehavior", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SKILL_USER_ENTITY),
    __metadata("design:type", Object)
], EvaluationPeriodRepository.prototype, "skillUser", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SUMMARY_DEPARTMENT),
    __metadata("design:type", Object)
], EvaluationPeriodRepository.prototype, "summaryDepartment", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_REVIEW),
    __metadata("design:type", Object)
], EvaluationPeriodRepository.prototype, "settingReviewEnity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_DEFAULT_PERIOD_VIEWING),
    __metadata("design:type", Object)
], EvaluationPeriodRepository.prototype, "settingDefaultPeriodEnity", void 0);
EvaluationPeriodRepository = __decorate([
    (0, common_1.Injectable)()
], EvaluationPeriodRepository);
exports.EvaluationPeriodRepository = EvaluationPeriodRepository;
//# sourceMappingURL=evaluationPeriod.repository.js.map