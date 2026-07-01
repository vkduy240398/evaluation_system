import { Inject, Injectable } from '@nestjs/common';
import { Op, QueryTypes } from 'sequelize';
import EntityConstant from 'src/constant/EntityConstant';
import { Department } from 'src/entity/Department';
import { EvaluationPeriodDepartmentSetting } from 'src/entity/EvaluationPeriodDepartmentSetting';
import { DepartmentPeriodSettingItemDTO } from 'src/model/request/ExceptionPeriodRequestDto';

@Injectable()
export class EvaluationPeriodDepartmentSettingRepository {
  @Inject(EntityConstant.EVALUATION_PERIOD_DEPARTMENT_SETTING)
  private entity: typeof EvaluationPeriodDepartmentSetting;

  @Inject(EntityConstant.DEPARTMENT)
  private departmentEntity: typeof Department;

  // Returns settings with progress counts from evaluation_tbl.
  // goal_count  : evaluations with status >= 50 (目標確定)
  // eval_count  : evaluations with status >= 99 (評価結果確定)
  // total_count : all evaluations imported into this period for this dept
  async findByPeriodIdWithProgress(
    evaluationPeriodId: number,
    companyGroupCode: string,
  ): Promise<any[]> {
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
        parent_div.name                          AS "divisionName",
        COALESCE(COUNT(DISTINCT et.id), 0)::int  AS "totalCount",
        COALESCE(COUNT(DISTINCT CASE WHEN et.status >= 50 THEN et.id END), 0)::int AS "goalCount",
        COALESCE(COUNT(DISTINCT CASE WHEN et.status >= 99 THEN et.id END), 0)::int AS "evalCount"
      FROM evaluation_period_department_setting_tbl epds
      LEFT JOIN department_tbl d
        ON d.id = epds.department_id
      LEFT JOIN division_subclass_tbl dsc
        ON dsc.department_id = epds.department_id
      LEFT JOIN department_tbl parent_div
        ON parent_div.id = dsc.division_id
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
        d.name, d.code, parent_div.name
      ORDER BY epds.id ASC
    `;

    return this.entity.sequelize.query(sql, {
      type: QueryTypes.SELECT,
      replacements: { evaluationPeriodId, companyGroupCode },
    });
  }

  async findByPeriodAndDepartment(
    evaluationPeriodId: number,
    departmentId: number,
  ): Promise<EvaluationPeriodDepartmentSetting | null> {
    return this.entity.findOne({
      where: { evaluationPeriodId, departmentId },
    });
  }

  async upsertOne(
    evaluationPeriodId: number,
    companyGroupCode: string,
    item: DepartmentPeriodSettingItemDTO,
  ): Promise<EvaluationPeriodDepartmentSetting> {
    const [record] = await this.entity.upsert(
      {
        evaluationPeriodId,
        departmentId: item.departmentId,
        companyGroupCode,
        dateCreationGoalDepartmentStart:
          item.dateCreationGoalDepartmentStart ?? null,
        dateCreationGoalDepartmentEnd:
          item.dateCreationGoalDepartmentEnd ?? null,
        dateCreationGoalStart: item.dateCreationGoalStart ?? null,
        dateCreationGoalEnd: item.dateCreationGoalEnd ?? null,
        dateEvaluationDepartmentStart:
          item.dateEvaluationDepartmentStart ?? null,
        dateEvaluationDepartmentEnd: item.dateEvaluationDepartmentEnd ?? null,
        dateEvaluationStart: item.dateEvaluationStart ?? null,
        dateEvaluationEnd: item.dateEvaluationEnd ?? null,
      },
      {
        conflictFields: ['evaluation_period_id', 'department_id'],
        returning: true,
      },
    );
    return record;
  }

  async deleteById(id: number, companyGroupCode: string): Promise<number> {
    return this.entity.destroy({
      where: { id, companyGroupCode },
    });
  }

  async deleteByPeriodAndDepartments(
    evaluationPeriodId: number,
    departmentIds: number[],
    companyGroupCode: string,
  ): Promise<number> {
    return this.entity.destroy({
      where: {
        evaluationPeriodId,
        departmentId: { [Op.in]: departmentIds },
        companyGroupCode,
      },
    });
  }

  // Apply department-specific period dates to already-imported evaluations.
  // Level > 7  → 部門目標設定 / 部門評価 dates.
  // Level <= 7 → 個人目標設定 / 個人評価 dates.
  async applyDeptDatesToEvaluations(
    evaluationPeriodId: number,
    companyGroupCode: string,
    setting: {
      departmentId: number;
      dateCreationGoalDepartmentStart: string | null;
      dateCreationGoalDepartmentEnd: string | null;
      dateCreationGoalStart: string | null;
      dateCreationGoalEnd: string | null;
      dateEvaluationDepartmentStart: string | null;
      dateEvaluationDepartmentEnd: string | null;
      dateEvaluationStart: string | null;
      dateEvaluationEnd: string | null;
    },
  ): Promise<void> {
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
      type: QueryTypes.UPDATE,
      replacements: {
        evaluationPeriodId,
        companyGroupCode,
        departmentId: setting.departmentId,
        deptGoalStart: setting.dateCreationGoalDepartmentStart ?? null,
        deptGoalEnd: setting.dateCreationGoalDepartmentEnd ?? null,
        userGoalStart: setting.dateCreationGoalStart ?? null,
        userGoalEnd: setting.dateCreationGoalEnd ?? null,
        deptEvalStart: setting.dateEvaluationDepartmentStart ?? null,
        deptEvalEnd: setting.dateEvaluationDepartmentEnd ?? null,
        userEvalStart: setting.dateEvaluationStart ?? null,
        userEvalEnd: setting.dateEvaluationEnd ?? null,
      },
    });
  }

  // Apply all department settings for a period to their matching evaluations.
  //
  // Priority rule (per employee):
  //   1. department_id match (phòng ban – more specific)  → dept_s
  //   2. division_id  match (bộ phận – parent)           → div_s
  //   3. No match → leave 全社設定 dates untouched
  //
  // Only updates non-personal evaluations (creation_user IS NULL).
  // Only updates when NOW() is within the company goal-setting period
  // (level-dependent: dept goal period for level>7, personal goal period for level<=7).
  async applyAllDeptDatesToEvaluations(
    evaluationPeriodId: number,
    companyGroupCode: string,
  ): Promise<void> {
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
      type: QueryTypes.UPDATE,
      replacements: { evaluationPeriodId, companyGroupCode },
    });
  }

  // Returns the `type` column from department_tbl for the given ID:
  //   1 (DIVISION) → bộ phận (parent), 0 (DEPARTMENT) → phòng ban (leaf).
  // Used in save() to decide whether to apply division-level override logic.
  async getDepartmentType(
    departmentId: number,
    companyGroupCode: string,
  ): Promise<number | null> {
    const dept = await this.departmentEntity.findOne({
      where: { id: departmentId, companyGroupCode },
      attributes: ['type'],
    });
    return dept?.type ?? null;
  }

  // When a division-level record is saved, delete ALL individual department records
  // for that division (looked up from division_subclass_tbl), so only the single
  // division-level record remains as the authoritative setting.
  async deleteAllByPeriodAndDivision(
    evaluationPeriodId: number,
    divisionId: number,
    companyGroupCode: string,
  ): Promise<void> {
    await this.entity.sequelize.query(
      `DELETE FROM evaluation_period_department_setting_tbl
       WHERE evaluation_period_id = :evaluationPeriodId
         AND company_group_code   = :companyGroupCode
         AND department_id IN (
           SELECT department_id FROM division_subclass_tbl WHERE division_id = :divisionId
         )`,
      {
        type: QueryTypes.DELETE,
        replacements: { evaluationPeriodId, divisionId, companyGroupCode },
      },
    );
  }

  // Force-apply division-level dates to all evaluations under that division,
  // bypassing the goal-setting period time restriction used in applyAllDeptDatesToEvaluations.
  // Called only when the user selects all departments (division-level override).
  // Level > 7  → 部門目標設定 / 部門評価 dates.
  // Level <= 7 → 個人目標設定 / 個人評価 dates.
  async applyDivisionDatesToEvaluations(
    evaluationPeriodId: number,
    companyGroupCode: string,
    item: DepartmentPeriodSettingItemDTO,
  ): Promise<void> {
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
        AND division_id          = :divisionId
        AND company_group_code   = :companyGroupCode
        AND creation_user IS NULL
    `;
    await this.entity.sequelize.query(sql, {
      type: QueryTypes.UPDATE,
      replacements: {
        evaluationPeriodId,
        companyGroupCode,
        divisionId: item.departmentId,
        deptGoalStart: item.dateCreationGoalDepartmentStart ?? null,
        deptGoalEnd: item.dateCreationGoalDepartmentEnd ?? null,
        userGoalStart: item.dateCreationGoalStart ?? null,
        userGoalEnd: item.dateCreationGoalEnd ?? null,
        deptEvalStart: item.dateEvaluationDepartmentStart ?? null,
        deptEvalEnd: item.dateEvaluationDepartmentEnd ?? null,
        userEvalStart: item.dateEvaluationStart ?? null,
        userEvalEnd: item.dateEvaluationEnd ?? null,
      },
    });
  }

  // After import_user runs, sync division_id / department_id / names into evaluation_tbl
  // from evaluator_default_tbl (which the stored procedure always populates correctly).
  // This is necessary because import_user may leave division_id NULL in evaluation_tbl,
  // which breaks JOIN conditions in applyAllDeptDatesToEvaluations.
  async getDeptSettingDatesByPeriodIds(
    periodIds: number[],
    companyGroupCode: string,
  ): Promise<any[]> {
    if (!periodIds.length) return [];
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
      type: QueryTypes.SELECT,
      replacements: { periodIds, companyGroupCode },
    });
  }

  async syncEvaluationOrgFromDefault(
    evaluationPeriodId: number,
    companyGroupCode: string,
    userIds: number[],
  ): Promise<void> {
    if (!userIds?.length) return;

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
      type: QueryTypes.UPDATE,
      replacements: { evaluationPeriodId, companyGroupCode, userIds },
    });
  }

  // After importing employees into 部署別 tab, update division_name / department_name
  // in evaluation_tbl to reflect the configured dept/division setting name.
  //
  // Division-level setting (div_s) → update division_name.
  // Department-level setting (dept_s) → update department_name AND derive division_name
  //   from the employee's actual division (evaluator_default_tbl.division_id).
  async updateEvaluationNamesFromSettings(
    evaluationPeriodId: number,
    companyGroupCode: string,
    userIds: number[],
  ): Promise<void> {
    if (!userIds?.length) return;

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
      type: QueryTypes.UPDATE,
      replacements: { evaluationPeriodId, companyGroupCode, userIds },
    });
  }
}
