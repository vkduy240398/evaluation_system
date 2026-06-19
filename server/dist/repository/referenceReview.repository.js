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
exports.ReferenceReview = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const EntityConstant_1 = require("../constant/EntityConstant");
let ReferenceReview = class ReferenceReview {
    async getListReferenceEvaluation(params, req) {
        var _a, _b, _c, _d;
        const { email, department, salaryRank, title, offset, limit, type } = params;
        const departmentName = department.name === 'すべて' ? '%%' : department.name;
        const departmentType = department.type;
        let departmentConditions = ``;
        let departmentConditionsNews = ``;
        if (departmentType === '0') {
            departmentConditions = `and ("Evaluation"."department_name" LIKE 
      :departmentName)`;
            departmentConditionsNews = `and ("e"."departmentName" LIKE 
      :departmentName)`;
        }
        else if (departmentType === '1') {
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
        const listUserCounts = await this.evaluationRepository.sequelize.query(listUserCountQuery, {
            replacements: {
                email: `%${email}%`,
                title: title,
                level: salaryRank,
                departmentName: departmentName,
                companyGroupCode: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode,
                viewerId: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id,
                type: type,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
        const evaluationList = (await this.evaluationRepository.sequelize.query(`
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
            `, {
            replacements: {
                email: `%${email}%`,
                title: title,
                level: salaryRank,
                departmentName: departmentName,
                limit: limit,
                offset: offset,
                viewerId: (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.id,
                type: type,
                companyGroupCode: (_d = req === null || req === void 0 ? void 0 : req.user) === null || _d === void 0 ? void 0 : _d.companyGroupCode,
            },
            type: sequelize_1.QueryTypes.SELECT,
        }));
        const arrays = [];
        for (let index = 0; index < evaluationList.length; index++) {
            if (evaluationList[index].childs.length === 1) {
                const data = Object.assign({}, evaluationList[index].childs[0]);
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
            }
            else {
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
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_REVIEW),
    __metadata("design:type", Object)
], ReferenceReview.prototype, "settingReviewRepository", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION),
    __metadata("design:type", Object)
], ReferenceReview.prototype, "evaluationRepository", void 0);
ReferenceReview = __decorate([
    (0, common_1.Injectable)()
], ReferenceReview);
exports.ReferenceReview = ReferenceReview;
//# sourceMappingURL=referenceReview.repository.js.map