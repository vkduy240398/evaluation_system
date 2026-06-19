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
exports.EvaluationPeriodDepartmentSettingRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const EntityConstant_1 = require("../constant/EntityConstant");
let EvaluationPeriodDepartmentSettingRepository = class EvaluationPeriodDepartmentSettingRepository {
    async findByPeriodIdWithProgress(evaluationPeriodId, companyGroupCode) {
        const sql = `
      SELECT
        epds.id,
        epds.evaluation_period_id          AS "evaluationPeriodId",
        epds.department_id                 AS "departmentId",
        epds.company_group_code            AS "companyGroupCode",
        epds.date_creation_goal_department_start AS "dateCreationGoalDepartmentStart",
        epds.date_creation_goal_department_end   AS "dateCreationGoalDepartmentEnd",
        epds.date_creation_goal_start            AS "dateCreationGoalStart",
        epds.date_creation_goal_end              AS "dateCreationGoalEnd",
        epds.date_evaluation_department_start    AS "dateEvaluationDepartmentStart",
        epds.date_evaluation_department_end      AS "dateEvaluationDepartmentEnd",
        epds.date_evaluation_start               AS "dateEvaluationStart",
        epds.date_evaluation_end                 AS "dateEvaluationEnd",
        epds.check_fixed                         AS "checkFixed",
        epds.updated_time                        AS "updatedTime",
        d.name                                   AS "departmentName",
        d.code                                   AS "departmentCode",
        COALESCE(COUNT(DISTINCT et.id), 0)::int  AS "totalCount",
        COALESCE(COUNT(DISTINCT CASE WHEN et.status >= 50 THEN et.id END), 0)::int AS "goalCount",
        COALESCE(COUNT(DISTINCT CASE WHEN et.status >= 99 THEN et.id END), 0)::int AS "evalCount"
      FROM evaluation_period_department_setting_tbl epds
      LEFT JOIN department_tbl d
        ON d.id = epds.department_id
      LEFT JOIN evaluator_default_tbl edt
        ON edt.evaluation_period_id = epds.evaluation_period_id
      LEFT JOIN evaluation_tbl et
        ON et.user_id = edt.user_id
        AND et.evaluation_period_id = epds.evaluation_period_id
        AND (et.department_id = epds.department_id OR et.division_id = epds.department_id)
        AND et.company_group_code = :companyGroupCode
        AND et.creation_user IS NULL
      WHERE epds.evaluation_period_id = :evaluationPeriodId
        AND epds.company_group_code    = :companyGroupCode
      GROUP BY
        epds.id, epds.evaluation_period_id, epds.department_id, epds.company_group_code,
        epds.date_creation_goal_department_start, epds.date_creation_goal_department_end,
        epds.date_creation_goal_start, epds.date_creation_goal_end,
        epds.date_evaluation_department_start, epds.date_evaluation_department_end,
        epds.date_evaluation_start, epds.date_evaluation_end,
        epds.check_fixed, epds.updated_time,
        d.name, d.code
      ORDER BY epds.id ASC
    `;
        return this.entity.sequelize.query(sql, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: { evaluationPeriodId, companyGroupCode },
        });
    }
    async findByPeriodAndDepartment(evaluationPeriodId, departmentId) {
        return this.entity.findOne({
            where: { evaluationPeriodId, departmentId },
        });
    }
    async upsertOne(evaluationPeriodId, companyGroupCode, item) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const [record] = await this.entity.upsert({
            evaluationPeriodId,
            departmentId: item.departmentId,
            companyGroupCode,
            dateCreationGoalDepartmentStart: (_a = item.dateCreationGoalDepartmentStart) !== null && _a !== void 0 ? _a : null,
            dateCreationGoalDepartmentEnd: (_b = item.dateCreationGoalDepartmentEnd) !== null && _b !== void 0 ? _b : null,
            dateCreationGoalStart: (_c = item.dateCreationGoalStart) !== null && _c !== void 0 ? _c : null,
            dateCreationGoalEnd: (_d = item.dateCreationGoalEnd) !== null && _d !== void 0 ? _d : null,
            dateEvaluationDepartmentStart: (_e = item.dateEvaluationDepartmentStart) !== null && _e !== void 0 ? _e : null,
            dateEvaluationDepartmentEnd: (_f = item.dateEvaluationDepartmentEnd) !== null && _f !== void 0 ? _f : null,
            dateEvaluationStart: (_g = item.dateEvaluationStart) !== null && _g !== void 0 ? _g : null,
            dateEvaluationEnd: (_h = item.dateEvaluationEnd) !== null && _h !== void 0 ? _h : null,
        }, {
            conflictFields: ['evaluation_period_id', 'department_id'],
            returning: true,
        });
        return record;
    }
    async deleteById(id, companyGroupCode) {
        return this.entity.destroy({
            where: { id, companyGroupCode },
        });
    }
    async deleteByPeriodAndDepartments(evaluationPeriodId, departmentIds, companyGroupCode) {
        return this.entity.destroy({
            where: {
                evaluationPeriodId,
                departmentId: { [sequelize_1.Op.in]: departmentIds },
                companyGroupCode,
            },
        });
    }
    async applyDeptDatesToEvaluations(evaluationPeriodId, companyGroupCode, setting) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const sql = `
      UPDATE evaluation_tbl SET
        date_creation_goal_start = CASE WHEN level > 7
          THEN :deptGoalStart ELSE :userGoalStart END,
        date_creation_goal_end = CASE WHEN level > 7
          THEN :deptGoalEnd ELSE :userGoalEnd END,
        date_evaluation_start = CASE WHEN level > 7
          THEN :deptEvalStart ELSE :userEvalStart END,
        date_evaluation_end = CASE WHEN level > 7
          THEN :deptEvalEnd ELSE :userEvalEnd END,
        updated_time = NOW()
      WHERE evaluation_period_id = :evaluationPeriodId
        AND (department_id = :departmentId OR division_id = :departmentId)
        AND company_group_code = :companyGroupCode
    `;
        await this.entity.sequelize.query(sql, {
            type: sequelize_1.QueryTypes.UPDATE,
            replacements: {
                evaluationPeriodId,
                companyGroupCode,
                departmentId: setting.departmentId,
                deptGoalStart: (_a = setting.dateCreationGoalDepartmentStart) !== null && _a !== void 0 ? _a : null,
                deptGoalEnd: (_b = setting.dateCreationGoalDepartmentEnd) !== null && _b !== void 0 ? _b : null,
                userGoalStart: (_c = setting.dateCreationGoalStart) !== null && _c !== void 0 ? _c : null,
                userGoalEnd: (_d = setting.dateCreationGoalEnd) !== null && _d !== void 0 ? _d : null,
                deptEvalStart: (_e = setting.dateEvaluationDepartmentStart) !== null && _e !== void 0 ? _e : null,
                deptEvalEnd: (_f = setting.dateEvaluationDepartmentEnd) !== null && _f !== void 0 ? _f : null,
                userEvalStart: (_g = setting.dateEvaluationStart) !== null && _g !== void 0 ? _g : null,
                userEvalEnd: (_h = setting.dateEvaluationEnd) !== null && _h !== void 0 ? _h : null,
            },
        });
    }
    async applyAllDeptDatesToEvaluations(evaluationPeriodId, companyGroupCode) {
        const sql = `
      UPDATE evaluation_tbl
      SET
        date_creation_goal_start = CASE WHEN evaluation_tbl.level > 7
          THEN COALESCE(src.dept_goal_dept_start, src.div_goal_dept_start)
          ELSE COALESCE(src.dept_goal_start,      src.div_goal_start)
        END,
        date_creation_goal_end = CASE WHEN evaluation_tbl.level > 7
          THEN COALESCE(src.dept_goal_dept_end, src.div_goal_dept_end)
          ELSE COALESCE(src.dept_goal_end,      src.div_goal_end)
        END,
        date_evaluation_start = CASE WHEN evaluation_tbl.level > 7
          THEN COALESCE(src.dept_eval_dept_start, src.div_eval_dept_start)
          ELSE COALESCE(src.dept_eval_start,      src.div_eval_start)
        END,
        date_evaluation_end = CASE WHEN evaluation_tbl.level > 7
          THEN COALESCE(src.dept_eval_dept_end, src.div_eval_dept_end)
          ELSE COALESCE(src.dept_eval_end,      src.div_eval_end)
        END,
        updated_time = NOW()
      FROM (
        SELECT
          et.id                                          AS evaluation_id,
          -- department-level setting (phòng ban – specific)
          dept_s.date_creation_goal_department_start     AS dept_goal_dept_start,
          dept_s.date_creation_goal_department_end       AS dept_goal_dept_end,
          dept_s.date_creation_goal_start                AS dept_goal_start,
          dept_s.date_creation_goal_end                  AS dept_goal_end,
          dept_s.date_evaluation_department_start        AS dept_eval_dept_start,
          dept_s.date_evaluation_department_end          AS dept_eval_dept_end,
          dept_s.date_evaluation_start                   AS dept_eval_start,
          dept_s.date_evaluation_end                     AS dept_eval_end,
          -- division-level setting (bộ phận – parent fallback)
          div_s.date_creation_goal_department_start      AS div_goal_dept_start,
          div_s.date_creation_goal_department_end        AS div_goal_dept_end,
          div_s.date_creation_goal_start                 AS div_goal_start,
          div_s.date_creation_goal_end                   AS div_goal_end,
          div_s.date_evaluation_department_start         AS div_eval_dept_start,
          div_s.date_evaluation_department_end           AS div_eval_dept_end,
          div_s.date_evaluation_start                    AS div_eval_start,
          div_s.date_evaluation_end                      AS div_eval_end,
          -- Company period boundary for time-range check (NULL propagates → no update)
          CASE WHEN et.level > 7
            THEN TO_DATE(ep.date_creation_goal_department_start, 'YYYY/MM/DD')
            ELSE TO_DATE(ep.date_creation_goal_start, 'YYYY/MM/DD')
          END AS period_goal_check_start,
          CASE WHEN et.level > 7
            THEN TO_DATE(ep.date_creation_goal_department_end, 'YYYY/MM/DD')
            ELSE TO_DATE(ep.date_creation_goal_end, 'YYYY/MM/DD')
          END AS period_goal_check_end
        FROM evaluation_tbl et
        JOIN evaluation_period_tbl ep ON ep.id = :evaluationPeriodId
        LEFT JOIN evaluation_period_department_setting_tbl dept_s
          ON  dept_s.department_id       = et.department_id
          AND dept_s.evaluation_period_id = :evaluationPeriodId
          AND dept_s.company_group_code   = :companyGroupCode
        LEFT JOIN evaluation_period_department_setting_tbl div_s
          ON  div_s.department_id        = et.division_id
          AND div_s.evaluation_period_id  = :evaluationPeriodId
          AND div_s.company_group_code    = :companyGroupCode
        WHERE et.evaluation_period_id = :evaluationPeriodId
          AND et.company_group_code   = :companyGroupCode
          AND et.creation_user IS NULL
          AND (dept_s.id IS NOT NULL OR div_s.id IS NOT NULL)
      ) AS src
      WHERE evaluation_tbl.id = src.evaluation_id
        AND NOW()::date BETWEEN src.period_goal_check_start AND src.period_goal_check_end
    `;
        await this.entity.sequelize.query(sql, {
            type: sequelize_1.QueryTypes.UPDATE,
            replacements: { evaluationPeriodId, companyGroupCode },
        });
    }
    async getDeptSettingDatesByPeriodIds(periodIds, companyGroupCode) {
        if (!periodIds.length)
            return [];
        const sql = `
      SELECT
        evaluation_period_id AS "evaluationPeriodId",
        date_creation_goal_start AS "dateCreationGoalStart",
        date_creation_goal_end AS "dateCreationGoalEnd",
        date_creation_goal_department_start AS "dateCreationGoalDepartmentStart",
        date_creation_goal_department_end AS "dateCreationGoalDepartmentEnd",
        date_evaluation_start AS "dateEvaluationStart",
        date_evaluation_end AS "dateEvaluationEnd",
        date_evaluation_department_start AS "dateEvaluationDepartmentStart",
        date_evaluation_department_end AS "dateEvaluationDepartmentEnd"
      FROM evaluation_period_department_setting_tbl
      WHERE evaluation_period_id IN (:periodIds)
        AND company_group_code = :companyGroupCode
    `;
        return this.entity.sequelize.query(sql, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: { periodIds, companyGroupCode },
        });
    }
    async syncEvaluationOrgFromDefault(evaluationPeriodId, companyGroupCode, userIds) {
        if (!(userIds === null || userIds === void 0 ? void 0 : userIds.length))
            return;
        const sql = `
      UPDATE evaluation_tbl et
      SET
        division_id     = edt.division_id,
        department_id   = edt.department_id,
        division_name   = div_d.name,
        department_name = dept_d.name,
        updated_time    = NOW()
      FROM evaluator_default_tbl edt
      LEFT JOIN department_tbl div_d  ON div_d.id  = edt.division_id
      LEFT JOIN department_tbl dept_d ON dept_d.id = edt.department_id
      WHERE edt.user_id              = et.user_id
        AND edt.evaluation_period_id  = et.evaluation_period_id
        AND et.user_id           IN (:userIds)
        AND et.evaluation_period_id   = :evaluationPeriodId
        AND et.company_group_code     = :companyGroupCode
    `;
        await this.entity.sequelize.query(sql, {
            type: sequelize_1.QueryTypes.UPDATE,
            replacements: { evaluationPeriodId, companyGroupCode, userIds },
        });
    }
    async updateEvaluationNamesFromSettings(evaluationPeriodId, companyGroupCode, userIds) {
        if (!(userIds === null || userIds === void 0 ? void 0 : userIds.length))
            return;
        const sql = `
      UPDATE evaluation_tbl et
      SET
        department_name = CASE
          WHEN src.dept_s_id IS NOT NULL THEN src.dept_name
          ELSE et.department_name
        END,
        division_name = CASE
          WHEN src.dept_s_id IS NOT NULL THEN src.user_div_name
          WHEN src.div_s_id IS NOT NULL  THEN src.div_name
          ELSE et.division_name
        END,
        updated_time = NOW()
      FROM (
        SELECT
          et2.id           AS eval_id,
          dept_s.id        AS dept_s_id,
          dept_d.name      AS dept_name,
          div_of_edt.name  AS user_div_name,
          div_s.id         AS div_s_id,
          div_d.name       AS div_name
        FROM evaluation_tbl et2
        LEFT JOIN evaluator_default_tbl edt
          ON  edt.user_id              = et2.user_id
          AND edt.evaluation_period_id = et2.evaluation_period_id
        LEFT JOIN evaluation_period_department_setting_tbl dept_s
          ON  dept_s.department_id       = et2.department_id
          AND dept_s.evaluation_period_id = :evaluationPeriodId
          AND dept_s.company_group_code   = :companyGroupCode
        LEFT JOIN department_tbl dept_d ON dept_d.id = dept_s.department_id
        LEFT JOIN department_tbl div_of_edt ON div_of_edt.id = edt.division_id
        LEFT JOIN evaluation_period_department_setting_tbl div_s
          ON  div_s.department_id        = et2.division_id
          AND div_s.evaluation_period_id  = :evaluationPeriodId
          AND div_s.company_group_code    = :companyGroupCode
        LEFT JOIN department_tbl div_d ON div_d.id = div_s.department_id
        WHERE et2.user_id IN (:userIds)
          AND et2.evaluation_period_id = :evaluationPeriodId
          AND et2.company_group_code   = :companyGroupCode
          AND (dept_s.id IS NOT NULL OR div_s.id IS NOT NULL)
      ) AS src
      WHERE et.id = src.eval_id
    `;
        await this.entity.sequelize.query(sql, {
            type: sequelize_1.QueryTypes.UPDATE,
            replacements: { evaluationPeriodId, companyGroupCode, userIds },
        });
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_PERIOD_DEPARTMENT_SETTING),
    __metadata("design:type", Object)
], EvaluationPeriodDepartmentSettingRepository.prototype, "entity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.DEPARTMENT),
    __metadata("design:type", Object)
], EvaluationPeriodDepartmentSettingRepository.prototype, "departmentEntity", void 0);
EvaluationPeriodDepartmentSettingRepository = __decorate([
    (0, common_1.Injectable)()
], EvaluationPeriodDepartmentSettingRepository);
exports.EvaluationPeriodDepartmentSettingRepository = EvaluationPeriodDepartmentSettingRepository;
//# sourceMappingURL=evaluationPeriodDepartmentSetting.repository.js.map