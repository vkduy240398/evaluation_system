import { Inject, Injectable } from '@nestjs/common';
import { QueryTypes } from 'sequelize';
import EntityConstant from 'src/constant/EntityConstant';
import { Evaluation } from 'src/entity/Evaluation';
import { SettingReview } from 'src/entity/SettingReview';
import { ReferenceReviewRepositoryI } from 'src/interfaces/repository/referenceReview.repository';
import { Request } from 'express';

@Injectable()
export class ReferenceReview implements ReferenceReviewRepositoryI {
  @Inject(EntityConstant.SETTING_REVIEW)
  private settingReviewRepository: typeof SettingReview;

  @Inject(EntityConstant.EVALUATION)
  private evaluationRepository: typeof Evaluation;

  async getListReferenceEvaluation(params: any, req: Request): Promise<any> {
    const { email, department, salaryRank, title, offset, limit, type } =
      params;
    const departmentName =
      department.name === 'すべて' ? '%%' : department.name;
    const departmentType = department.type;

    let departmentConditions = ``;
    let departmentConditionsNews = ``;
    if (departmentType === '0') {
      departmentConditions = `and ("Evaluation"."department_name" LIKE 
      :departmentName)`;
      departmentConditionsNews = `and ("e"."departmentName" LIKE 
      :departmentName)`;
    } else if (departmentType === '1') {
      departmentConditions = `and ( "Evaluation"."division_name" LIKE 
      :departmentName)`;
      departmentConditionsNews = `and ("e"."divisionName" LIKE 
      :departmentName)`;
    }
    const listUserCountQuery = `
            select "Evaluation"."user_id",
                   count(distinct ("Evaluation"."id")) as "count"
            from "evaluation_tbl" as "Evaluation"
                     inner join "user_tbl" as "user" on
                "Evaluation"."user_id" = "user"."id"
                    and ("user"."email" ilike :email
          or "user"."full_name" ilike :email
          or "user"."employee_number" like :email)
                     inner join evaluator_default_tbl edt on edt.user_id = "user".id and edt.evaluation_period_id =
                                                                                         "Evaluation".evaluation_period_id
                     INNER JOIN SETTING_REVIEW_TBL SR ON SR.user_id = "Evaluation"."user_id" AND
                                                         "Evaluation"."evaluation_period_id" =
                                                         SR.evaluation_period_id AND SR.viewer_id = :viewerId
            where ("Evaluation"."title" like :title ${departmentConditions}
            and "Evaluation"."level" in (:level) and "Evaluation"."company_group_code" = :companyGroupCode
            AND SR.type IN (:type)
                      )
            GROUP BY "Evaluation"."user_id";`;
    const listUserCounts = await this.evaluationRepository.sequelize.query(
      listUserCountQuery,
      {
        replacements: {
          email: `%${email}%`,
          title: title,
          level: salaryRank,
          departmentName: departmentName,
          companyGroupCode: req?.user?.companyGroupCode,
          viewerId: req?.user?.id,
          type: type,
        },
        type: QueryTypes.SELECT,
      },
    );

    const evaluationList = (await this.evaluationRepository.sequelize.query(
      `
                WITH UserEvaluations AS (SELECT u.employee_number,
                                                e.user_id                    as "userId",
                                                e.id,
                                                e.title,
                                                e.level,
                                                e.department_name            as "departmentName",
                                                e.division_name              as "divisionName",
                                                e.status,
                                                CASE
                                                    WHEN e.level IN (1, 2, 3, 4, 5, 6, 7)
                                                        THEN e.summary_point_evaluator_2
                                                    ELSE sd.summary_point_evaluator_2
                                                    END                      AS "summaryPointEvaluator2",
                                                e.percent_point              as "percentPoint",
                                                e.period_start               as "periodStart",
                                                e.period_end                 as "periodEnd",
                                                e.creation_user              as "creationUser",
                                                e.date_evaluation_start      as "dateEvaluationStart",
                                                e.date_evaluation_end        as "dateEvaluationEnd",
                                                e.evaluation_period_id       as "evaluationPeriodId",
                                                sd.summary_point_evaluator_2 as "summaryPointEvaluator2_8_10",
                                                sr.type                      as "type",
                                                sr.order                     as "order"
                                         FROM Evaluation_tbl e
                                                  INNER JOIN evaluator_default_tbl ed ON e.evaluation_period_id = ed.evaluation_period_id 
                                                    AND e.user_id = ed.user_id
                                                  LEFT JOIN user_tbl u ON u.id = e.user_id
                                                  LEFT JOIN summary_department_tbl sd ON sd.evaluation_id = e.id
                                                  INNER JOIN SETTING_REVIEW_TBL SR ON SR.user_id = e.user_id AND
                                                                                      sr.evaluation_period_id =
                                                                                      e.evaluation_period_id AND
                                                                                      SR.viewer_id = :viewerId
                                         Where (u.email like :email or u.full_name like :email or
                                                u.employee_number like :email)
                                           AND e.level in (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
                                           AND e.title = :title
                                           AND SR.type IN (:type)
                                           AND e.company_group_code = :companyGroupCode),
                     FilteredUsers AS (SELECT DISTINCT e."userId"
                                       FROM UserEvaluations e
                                       WHERE e.level IN (:level)
                                         AND e.title = :title -- Filter theo bậc lương
                     ),
                     Evaluators AS (SELECT evt.evaluation_id,
                                           JSONB_AGG(
                                                   JSONB_BUILD_OBJECT(
                                                           'evaluatorId', us.id,
                                                           'fullName', us.full_name,
                                                           'evaluationOrder', evt.evaluation_order
                                                   )
                                           ) AS evaluators
                                    FROM evaluator_tbl evt
                                             JOIN user_tbl us ON us.id = evt.evaluator_id
                                             INNER JOIN UserEvaluations e on e.id = evt.evaluation_id
                                    GROUP BY evt.evaluation_id),
                     MinStatusLevels AS (SELECT "userId",
                                                MIN(status) AS minStatus
                                         FROM UserEvaluations
                                         GROUP BY "userId"),
                     MaxLevelByMinStatus AS (SELECT ue."userId",
                                                    MAX(ue.level) AS maxLevel
                                             FROM UserEvaluations ue
                                                      JOIN MinStatusLevels msl
                                                           ON ue."userId" = msl."userId" AND ue.status = msl.minStatus
                                             GROUP BY ue."userId"),
                     LevelByLatestRecord AS (SELECT DISTINCT
                ON ("userId")
                    "userId", level
                FROM UserEvaluations
                ORDER BY "userId", "periodStart" DESC
                    )
                SELECT u.employee_number as "employeeNumber",
                       e.title           as title,

                       -- Thông tin user thuộc evaluation này
                       COALESCE(jsonb_build_object(
                               'id', u.id,
                               'fullName', u.full_name,
                               'employeeNumber', u.employee_number
                                )) as user, 
          
          -- Thông tin kỳ đặt mục tiêu và đánh giá
          COALESCE(JSONB_BUILD_OBJECT(
            'dateEvaluationStart'				, evp.date_evaluation_start,
            'dateEvaluationEnd'					, evp.date_evaluation_end,
            'dateEvaluationDepartmentStart'	, evp.date_evaluation_department_start,
            'dateEvaluationDepartmentEnd'		, evp.date_evaluation_department_end
          )) as "evaluationPeriod", 
          
          -- status nhỏ nhất
          MIN(e.status) as status,
          
          -- Record children
          COALESCE(JSONB_AGG(JSONB_BUILD_OBJECT(
            'userId', e."userId",
            'id', e.id,
            'title', e.title,
            'level', e.level,
            'fullName', u.full_name,
            'departmentName', e."departmentName",
            'divisionName', e."divisionName",
            'employeeNumber', u.employee_number,
            'status', e.status,
           'summaryPointEvaluator2', CASE 
              WHEN e.level IN (1,2,3,4,5,6,7) 
                THEN ROUND(e."summaryPointEvaluator2") 
              ELSE ROUND(e."summaryPointEvaluator2_8_10", 1) END,
            'percentPoint', e."percentPoint",
            'periodStart', e."periodStart",
            'periodEnd', e."periodEnd",
            'creationUser', e."creationUser",
            'periodStartEnd', CONCAT(e."periodStart",' ~ ', e."periodEnd"),
            'dateEvaluationStart', CASE WHEN e."dateEvaluationStart" IS NOT NULL THEN e."dateEvaluationStart" ELSE evp.date_evaluation_start END,
            'dateEvaluationEnd', CASE WHEN e."dateEvaluationEnd" IS NOT NULL THEN e."dateEvaluationEnd" ELSE evp.date_evaluation_end END ,
            'dateEvaluationDepartmentStart', evp.date_evaluation_department_start,
            'dateEvaluationDepartmentEnd', evp.date_evaluation_department_end,
            'evaluator', COALESCE(evals.evaluators, '[]'),
            'type', e.type,
            'order', e.order
          ) ORDER BY  TO_TIMESTAMP(e."periodStart", 'YYYY/MM/DD') DESC) FILTER (where e.status IS NOT NULL), '[]') as childs,
          e.type as type,
          e.order as "order"
                ------------------------------------------------ 
                FROM UserEvaluations e
                    LEFT JOIN user_tbl u
                ON u.id = e."userId"
                    LEFT JOIN evaluation_period_tbl evp ON evp.id = e."evaluationPeriodId"
                    LEFT JOIN Evaluators evals ON evals.evaluation_id = e.id
                    JOIN LevelByLatestRecord llc ON e."userId" = llc."userId"
                    JOIN MaxLevelByMinStatus mls ON e."userId" = mls."userId"
                WHERE e."userId" IN (
                    SELECT DISTINCT e."userId"
                    FROM UserEvaluations e
                    WHERE e."userId" IN (SELECT "userId" FROM FilteredUsers) ${departmentConditionsNews}
                    )
                GROUP BY u.employee_number, user, u.id, e.title, "evaluationPeriod", llc.level, mls.maxlevel, e.type, e.order
                ORDER BY min (u.employee_number) ASC LIMIT :limit
                OFFSET :offset;
            `,
      {
        replacements: {
          email: `%${email}%`,
          title: title,
          level: salaryRank,
          departmentName: departmentName,
          limit: limit,
          offset: offset,
          viewerId: req?.user?.id,
          type: type,
          companyGroupCode: req?.user?.companyGroupCode,
        },
        type: QueryTypes.SELECT,
      },
    )) as any;
    const arrays = [];
    for (let index = 0; index < evaluationList.length; index++) {
      if (evaluationList[index].childs.length === 1) {
        const data = { ...evaluationList[index].childs[0] };
        arrays.push({
          departmentName: data.departmentName,
          divisionName: data.divisionName,
          employeeNumber: data.employeeNumber,
          fullName: data.fullName,
          id: data.id,
          key: data.id,
          level: data.level,
          periodStartEnd: data.periodStartEnd,
          title: data.title,
          type: data.type,
          order: data.order,
        });
      } else {
        const dataList = evaluationList[index].childs;
        const childrens = [];
        const arrayRanks = [];

        for (let i = 0, length = dataList.length; i < length; i++) {
          const data = dataList[i];
          arrayRanks.push(data.level);
          childrens.push({
            financialYear: data.title,
            departmentName: data.departmentName,
            divisionName: data.divisionName,
            employeeNumber: data.employeeNumber,
            fullName: data.fullName,
            id: data.id,
            key: data.id,
            level: data.level,
            periodStartEnd: data.periodStartEnd,
            title: data.periodStartEnd,
            type: data.type,
            order: data.order,
          });
        }
        arrays.push({
          employeeNumber: evaluationList[index].employeeNumber,
          fullName: evaluationList[index].user.fullName,
          key: dataList[0].id,
          title: evaluationList[index].title,
          type: evaluationList[index].type,
          order: +evaluationList[index].order,
          childs: childrens,
        });
      }
    }

    return { counts: listUserCounts.length, data: arrays };
  }
}
