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
exports.EvaluatorRepository = void 0;
const common_1 = require("@nestjs/common");
const EntityConstant_1 = require("../constant/EntityConstant");
const Evaluation_1 = require("../entity/Evaluation");
const Evaluator_1 = require("../entity/Evaluator");
const sequelize_1 = require("sequelize");
const User_1 = require("../entity/User");
const sequelize_typescript_1 = require("sequelize-typescript");
const Department_1 = require("../entity/Department");
const Company_1 = require("../entity/Company");
const EvaluatorDefault_1 = require("../entity/EvaluatorDefault");
let EvaluatorRepository = class EvaluatorRepository {
    constructor() {
        this.getStringOrderByLevelStatus = (orderLevel, orderLevelType, orderStatus, orderStatusType) => {
            if (orderLevel === false && orderStatus === false) {
                return '';
            }
            else if (orderLevel === false && orderStatus === true) {
                return `"status" ${orderStatusType}, `;
            }
            else if (orderLevel === true && orderStatus === false) {
                return `"evaluationLevel" ${orderLevelType}, `;
            }
            else {
                return `"evaluationLevel" ${orderLevelType}, "status" ${orderStatusType}, `;
            }
        };
    }
    escapeSortDirection(orig) {
        const uOrig = orig.toUpperCase();
        if (uOrig === 'ASC' || uOrig === 'ASCEND' || uOrig === 'ASCENDING') {
            return 'ASC';
        }
        if (uOrig === 'DESC' || uOrig === 'DESCEND' || uOrig === 'DESCENDING') {
            return 'DESC';
        }
        return '';
    }
    async listUserEvaluator(params) {
        const title = params.title;
        const evaluationEnds = await this.evaluationEntity.sequelize.query(`WITH RankedEvaluations AS (
        SELECT  "Evaluation"."user_id" AS "userId", 
              "Evaluation"."evaluation_period_id" AS "evaluationPeriodId", 
              "user"."employee_number" as "employeeNumber",
              "Evaluation"."level" as "evaluationLevel", 
              "Evaluation"."status" as "status",
              ROW_NUMBER() OVER (PARTITION BY "Evaluation"."user_id" ORDER BY TO_DATE("Evaluation"."period_start", 'YYYY/MM') DESC) AS rn
  FROM "evaluation_tbl" AS "Evaluation"
  INNER JOIN "evaluator_tbl" AS "evaluator" ON "Evaluation"."id" = "evaluator"."evaluation_id" 
  INNER JOIN "user_tbl" as "user" ON "Evaluation"."user_id" = "user"."id"
  INNER JOIN "evaluation_period_tbl" as "evaluationPeriod" ON "Evaluation"."evaluation_period_id" = "evaluationPeriod"."id"
  AND "evaluator"."evaluator_id" = :evaluator 
  INNER JOIN "evaluator_default_tbl" as "evaluatorDefault" ON "user"."id"= "evaluatorDefault".user_id 
  and "evaluatorDefault".evaluation_period_id="Evaluation".evaluation_period_id

  WHERE "Evaluation"."title" = :title  AND "evaluator"."evaluation_order" IN (:evaluators)
        ${params.status.length > 0
            ? `AND "Evaluation"."status" IN (:status)`
            : ``}
        AND "Evaluation"."level" IN (:level)
        AND (COALESCE("Evaluation"."department_name",'%') like coalesce(:department,"Evaluation"."department_name",'%')
        AND COALESCE("Evaluation"."division_name",'%') like coalesce(:division,"Evaluation"."division_name",'%')) 
        AND ("user"."email" LIKE '%' || :email || '%' OR "user"."full_name" LIKE '%' || :email || '%' OR "user"."employee_number" LIKE '%' || :email || '%')
        AND "Evaluation".company_group_code = :companyGroupCode
        ORDER BY ${(() => {
            let sortStr = '';
            let index = params.sortColumns.indexOf('level');
            if (index >= 0) {
                sortStr = `"Evaluation"."level" ${this.escapeSortDirection(params.sortDirections[index])},`;
            }
            index = params.sortColumns.indexOf('status');
            if (index >= 0) {
                sortStr += `"Evaluation"."status" ${this.escapeSortDirection(params.sortDirections[index])},`;
            }
            return sortStr;
        })()}
         "user"."employee_number" ASC
      )
        SELECT *, count(*) OVER() AS "count" FROM RankedEvaluations WHERE rn = 1 LIMIT :limit OFFSET :offset`, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: {
                title: title,
                evaluator: params.evaluatorId,
                department: params.department.name === 'すべて'
                    ? null
                    : params.department.name,
                division: params.division.name === 'すべて'
                    ? null
                    : params.division.name,
                email: params.email,
                limit: params.limit,
                offset: params.offset,
                evaluators: params.evaluators,
                status: params.status,
                level: params.salaryRank,
                companyGroupCode: params.companyGroupCode,
            },
        });
        return evaluationEnds;
    }
    async getNewTransaction() {
        return await this.evaluationEntity.sequelize.transaction();
    }
    async getEvaluationById(id) {
        const result = await this.evaluationEntity.findOne({
            attributes: [
                'id',
                'status',
                'userId',
                'guideVersionId',
                'evaluationPeriodId',
                'departmentName',
                'divisionName',
                'companyName',
                'level',
                'flagSkill',
                'evaluationDepartmentId',
                'updatedTime',
                'departmentId',
                'divisionId',
            ],
            where: { id },
            include: [
                {
                    model: Evaluator_1.Evaluator,
                    as: 'evaluator',
                    separate: true,
                    order: [['evaluationOrder', 'ASC']],
                    include: [
                        {
                            model: User_1.User,
                            as: 'user',
                        },
                    ],
                },
                {
                    model: User_1.User,
                    as: 'user',
                },
            ],
        });
        return result;
    }
    async updateApprovedStatus(evaluationId, comment, approverId, receiverId, receiverOrder, type, status, transaction) {
        return await this.historyApproveEvaluationEntity.create({
            evaluationId,
            comment,
            approverId,
            receiverId,
            receiverOrder,
            type,
            status,
        }, { transaction: transaction });
    }
    async countListUserEvaluator(params) {
        var _a;
        const title = params.title;
        const countsEvaluations = await this.evaluationEntity.sequelize.query(`SELECT COUNT(DISTINCT("Evaluation"."user_id")) as count
FROM "evaluation_tbl" AS "Evaluation"
INNER JOIN "evaluator_tbl" AS "evaluator" ON "Evaluation"."id" = "evaluator"."evaluation_id" 
INNER JOIN "user_tbl" as "user" ON "Evaluation"."user_id" = "user"."id"
AND "evaluator"."evaluator_id" = :evaluator 
INNER JOIN "evaluator_default_tbl" as "evaluatorDefault" ON "user"."id"= "evaluatorDefault".user_id 
  and "evaluatorDefault".evaluation_period_id="Evaluation".evaluation_period_id
WHERE "Evaluation"."title" = :title  AND "evaluator"."evaluation_order" IN (:evaluators)
        AND "Evaluation"."status" IN (:status)
        AND "Evaluation"."level" IN (:level)
        AND (COALESCE("Evaluation"."department_name",'%') like coalesce(:department,"Evaluation"."department_name",'%')
        OR COALESCE("Evaluation"."division_name",'%') like coalesce(:department,"Evaluation"."division_name",'%')) 
        AND ("user"."email" LIKE '%' || :email || '%' OR "user"."full_name" LIKE '%' || :email || '%' OR "user"."employee_number" LIKE '%' || :email || '%')`, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: {
                title: title,
                evaluator: params.evaluatorId,
                department: params.department.name === 'すべて' ? null : params.department.name,
                email: params.email,
                status: params.status,
                level: params.salaryRank,
                evaluators: params.evaluators,
            },
        });
        return !countsEvaluations ? 0 : Number((_a = countsEvaluations[0]) === null || _a === void 0 ? void 0 : _a.count);
    }
    async findEvaluatorByPeriod(userId, params) {
        const sql = `SELECT "Evaluation"."id",
		"Evaluation"."department_name" AS "departmentName",
		"Evaluation"."division_name" AS "divisionName",
		"Evaluation"."company_name" AS "companyName",
		"Evaluation"."title",
		"Evaluation"."period_start" AS "periodStart",
		"Evaluation"."period_end" AS "periodEnd",
		"Evaluation"."status",
		"Evaluation"."level",
		"Evaluation"."summary_point_evaluator_2" AS "summaryPointEvaluator2",
		"Evaluation"."percent_point" AS "percentPoint",
		"Evaluation"."user_id" AS "userId",
		"Evaluation"."date_evaluation_start" AS "dateEvaluationStart",
		"Evaluation"."date_evaluation_end" AS "dateEvaluationEnd",
		"Evaluation"."creation_user" AS "creationUser",
		ARRAY_AGG(
        json_build_object(
            'evaluationId', Evaluator.evaluation_id,
            'evaluatorId', Evaluator.evaluator_id,
            'evaluationOrder', Evaluator.evaluation_order,
            'commentPublic', Evaluator.comment_public,
            'commentPrivate', Evaluator.comment_private,
            'createdTime', Evaluator.created_time,
            'updatedTime', Evaluator.updated_time
        )
    ) AS evaluator,
		ARRAY_AGG(
        json_build_object(
            'id', "evaluationPeriodTbl".id,
            'year', "evaluationPeriodTbl".year,
            'periodIndex', "evaluationPeriodTbl".period_index,  
            'periodStart', "evaluationPeriodTbl".period_start,  
            'periodEnd', "evaluationPeriodTbl".period_end,     
            'dateCreationGoalStart', "evaluationPeriodTbl".date_creation_goal_start,  
            'dateCreationGoalEnd', "evaluationPeriodTbl".date_creation_goal_end,      
            'dateEvaluationStart', "evaluationPeriodTbl".date_evaluation_start,        
            'dateEvaluationEnd', "evaluationPeriodTbl".date_evaluation_end,            
            'dateCreationGoalDepartmentStart', "evaluationPeriodTbl".date_creation_goal_department_start,  
            'dateCreationGoalDepartmentEnd', "evaluationPeriodTbl".date_creation_goal_department_end,      
            'dateEvaluationDepartmentStart', "evaluationPeriodTbl".date_evaluation_department_start,        
            'dateEvaluationDepartmentEnd', "evaluationPeriodTbl".date_evaluation_department_end,            
            'createdTime', "evaluationPeriodTbl".created_time,                             
            'updatedTime', "evaluationPeriodTbl".updated_time,                          
            'checkFixed', "evaluationPeriodTbl".check_fixed                             
        )
    ) AS "evaluationPeriod",
		"user"."id" AS "user.id",
		"user"."employee_number" AS "user.employeeNumber",
		"user"."full_name" AS "user.fullName",
		"user"."email" AS "user.email",
		"user"."department_id" AS "user.departmentId",
		"user"."division_id" AS "user.divisionId",
		"user"."company_id" AS "user.companyId",
		"user"."active" AS "user.active",
		"user"."level" AS "user.level",
		"user"."flag_skill" AS "user.flagSkill",
		"user"."created_time" AS "user.createdTime",
		"user"."updated_time" AS "user.updatedTime",
		"user"."department_id" AS "user.department_id",
		"user"."division_id" AS "user.division_id",
		"user"."company_id" AS "user.company_id",
		"summaryDepartment"."id" AS "summaryDepartment.id",
		"summaryDepartment"."evaluation_id" AS "summaryDepartment.evaluationId",
		"summaryDepartment"."achievement_personal_total_point_user" AS "summaryDepartment.achievementPersonalTotalPointUser",
		"summaryDepartment"."achievement_personal_total_point_evaluator_0_5" AS "summaryDepartment.achievementPersonalTotalPointEvaluator05",
		"summaryDepartment"."achievement_personal_total_point_evaluator_1" AS "summaryDepartment.achievementPersonalTotalPointEvaluator1",
		"summaryDepartment"."achievement_personal_total_point_evaluator_2" AS "summaryDepartment.achievementPersonalTotalPointEvaluator2",
		"summaryDepartment"."achievement_additional_total_point_user" AS "summaryDepartment.achievementAdditionalTotalPointUser",
		"summaryDepartment"."achievement_additional_total_point_evaluator_0_5" AS "summaryDepartment.achievementAdditionalTotalPointEvaluator05",
		"summaryDepartment"."achievement_additional_total_point_evaluator_1" AS "summaryDepartment.achievementAdditionalTotalPointEvaluator1",
		"summaryDepartment"."achievement_additional_total_point_evaluator_2" AS "summaryDepartment.achievementAdditionalTotalPointEvaluator2",
		"summaryDepartment"."summary_point_user" AS "summaryDepartment.summaryPointUser",
		"summaryDepartment"."summary_point_evaluator_0_5" AS "summaryDepartment.summaryPointEvaluator05",
		"summaryDepartment"."summary_point_evaluator_1" AS "summaryDepartment.summaryPointEvaluator1",
		"summaryDepartment"."summary_point_evaluator_2" AS "summaryDepartment.summaryPointEvaluator2",
		"summaryDepartment"."summary_char_point_user" AS "summaryDepartment.summaryCharPointUser",
		"summaryDepartment"."summary_char_point_evaluator_0_5" AS "summaryDepartment.summaryCharPointEvaluator05",
		"summaryDepartment"."summary_char_point_evaluator_1" AS "summaryDepartment.summaryCharPointEvaluator1",
		"summaryDepartment"."summary_char_point_evaluator_2" AS "summaryDepartment.summaryCharPointEvaluator2",
		"summaryDepartment"."created_time" AS "summaryDepartment.createdTime",
		"summaryDepartment"."updated_time" AS "summaryDepartment.updatedTime"
FROM "evaluation_tbl" AS "Evaluation"
LEFT OUTER JOIN "evaluator_tbl" AS "evaluator" ON "Evaluation"."id" = "evaluator"."evaluation_id"
LEFT OUTER JOIN "evaluation_period_tbl" AS "evaluationPeriodTbl" ON "Evaluation"."evaluation_period_id" = "evaluationPeriodTbl"."id"
LEFT OUTER JOIN "user_tbl" AS "user" ON "Evaluation"."user_id" = "user"."id"
LEFT OUTER JOIN "summary_department_tbl" AS "summaryDepartment" ON "Evaluation"."id" = "summaryDepartment"."evaluation_id"
WHERE "Evaluation"."user_id" in (:userId) and "Evaluation"."title" = :title AND "Evaluation"."company_group_code" = :companyGroupCode
							
GROUP BY 
    "Evaluation".id, 
    "user".id, 
    "summaryDepartment".id, 
    "evaluationPeriodTbl".id
ORDER BY TO_TIMESTAMP("Evaluation"."period_start",
										'YYYY/MM') DESC
`;
        const finds = await this.evaluationEntity.sequelize.query(sql, {
            nest: true,
            type: sequelize_1.QueryTypes.SELECT,
            replacements: {
                userId: userId.length > 0 ? userId : null,
                companyGroupCode: params.companyGroupCode,
                title: params.title,
            },
        });
        return finds;
    }
    async getUserById(id) {
        return await this.userEntity
            .findByPk(id, {
            include: [
                { model: Department_1.Department, as: 'department' },
                { model: Company_1.Company, as: 'company' },
                { model: Department_1.Department, as: 'division' },
            ],
        })
            .then((user) => {
            return user;
        });
    }
    async getDivisionHighest(evaluationPeriodId, divisionName) {
        const evaluations = await this.evaluationEntity.findOne({
            attributes: [
                'id',
                [sequelize_typescript_1.Sequelize.fn('MAX', sequelize_typescript_1.Sequelize.col('Evaluation.level')), 'maxLevel'],
            ],
            where: {
                divisionName,
                level: {
                    [sequelize_1.Op.gte]: 8,
                },
                evaluationPeriodId,
            },
            include: [
                { model: User_1.User, as: 'user', attributes: ['id', 'employeeNumber'] },
            ],
            group: ['Evaluation.id', 'user.id'],
            order: [[{ model: User_1.User, as: 'user' }, 'employeeNumber', 'ASC']],
        });
        return evaluations;
    }
    async getGuideVersionPublic() {
        return await this.versionGuideEvaluationEntity.findOne({
            attributes: ['id'],
            where: {
                type: 1,
                status: 4,
            },
        });
    }
    async createEvaluator(arrays, transaction) {
        return await this.evaluatorEnity.bulkCreate(arrays, {
            ignoreDuplicates: true,
            transaction: transaction,
        });
    }
    async exportHistoryEvaluationEvaluator(department, fullName, yearStart, yearEnd, userId, companyGroupCode, yearEvaluate, periodEvaluate) {
        const datas = await this.userRepository.sequelize.query(`WITH
          CURRENT_PERIOD AS (
            SELECT DISTINCT
              EP.ID,
              EP.YEAR,
              EP.PERIOD_INDEX
            FROM
              PUBLIC.EVALUATION_PERIOD_TBL EP
              JOIN PUBLIC.COMPANY_GROUP_TBL CG ON EP.COMPANY_GROUP_CODE = CG.CODE
              JOIN PUBLIC.EVALUATOR_DEFAULT_TBL EDT ON EDT.EVALUATION_PERIOD_ID = EP.ID
              LEFT JOIN PUBLIC.EVALUATION_TBL EV ON EP.ID = EV.EVALUATION_PERIOD_ID
            WHERE
              EP.COMPANY_GROUP_CODE = :companyGroupCode
              AND EP.YEAR = :year
              AND EP.PERIOD_INDEX = :periodIndex
            GROUP BY
              EP.ID,
              EP.YEAR,
              EP.PERIOD_INDEX
          ),
          EVALUATION_CURRENT_PERIOD AS (
            SELECT
              EV.USER_ID,
              COALESCE(
                JSONB_AGG(
                  JSONB_BUILD_OBJECT(
                  'divisionName', EV.DIVISION_NAME,
                  'periodEnd', EV.PERIOD_END
                  )
                ),
                '[]'::JSONB
              ) AS "divisionName",
              COALESCE(
                JSONB_AGG(
                  JSONB_BUILD_OBJECT(
                  'departmentName', EV.DEPARTMENT_NAME,
                  'periodEnd', EV.PERIOD_END
                  )
                ),
                '[]'::JSONB
              ) AS "departmentName",
              ARRAY_AGG(DISTINCT EV.DIVISION_ID) AS "ARR_DIVISION_ID",
              ARRAY_AGG(DISTINCT EV.DEPARTMENT_ID) AS "ARR_DEPARTMENT_ID"
            FROM
              EVALUATION_TBL EV
              JOIN CURRENT_PERIOD CP ON EV.EVALUATION_PERIOD_ID = CP.ID
            GROUP BY
              EV.USER_ID
          ),
          EVALUATION_PERIOD_ID_YEAR_START AS (
            SELECT
              EP.ID
            FROM
              EVALUATION_PERIOD_TBL EP
            WHERE
              EP.COMPANY_GROUP_CODE = :companyGroupCode
              AND (
                EP.YEAR = :yearStart
                AND EP.PERIOD_INDEX = 1
                OR EP.ID IN (
                  SELECT
                    ID
                  FROM
                    CURRENT_PERIOD
                )
              )
            ORDER BY
              ID ASC
            LIMIT
              1
          ),
          EVALUATION_PERIOD_ID_YEAR_END AS (
            SELECT
              EP.ID
            FROM
              EVALUATION_PERIOD_TBL EP
            WHERE
              EP.COMPANY_GROUP_CODE = :companyGroupCode
              AND (
                EP.YEAR = :yearEnd
                AND EP.PERIOD_INDEX = 2
                OR ID IN (
                  SELECT
                    ID
                  FROM
                    CURRENT_PERIOD
                )
              )
            ORDER BY
              ID ASC
            LIMIT
              1
          )
        SELECT
          UT.FULL_NAME "userName",
          UT.EMPLOYEE_NUMBER "employeeNumber",
          UT.LEVEL,
          CASE
            WHEN EC."divisionName" <> '[]'::JSONB THEN EC."divisionName"
            ELSE JSONB_AGG(JSONB_BUILD_OBJECT('divisionName', EDT.DIVISION_NAME))
          END AS "divisionName",
          CASE
            WHEN EC."departmentName" <> '[]'::JSONB THEN EC."departmentName"
            ELSE JSONB_AGG(JSONB_BUILD_OBJECT('departmentName', EDT.DEPARTMENT_NAME))
          END AS "departmentName",
          UT.ID "userId",
          UT.ACTIVE,
          COALESCE(
            JSON_AGG(EVALUATION.*) FILTER (
              WHERE
                EVALUATION.* IS NOT NULL
            ),
            '[]'
          ) AS "evaluations"
        FROM
          EVALUATOR_DEFAULT_TBL EDT
          INNER JOIN CURRENT_PERIOD CP ON CP.ID = EDT.EVALUATION_PERIOD_ID
          INNER JOIN USER_TBL UT ON EDT.USER_ID = UT.ID
          LEFT JOIN EVALUATION_CURRENT_PERIOD EC ON UT.ID = EC.USER_ID
          LEFT JOIN (
            SELECT
              ET.USER_ID,
              EPT."year",
              EPT.PERIOD_INDEX "periodIndex",
              STRING_AGG(ET.LEVEL::VARCHAR, ' - ' ORDER BY TO_DATE(ET.PERIOD_END, 'YYYY/MM') DESC) AS "level",
              CASE
                WHEN COUNT(ET.LEVEL) > 1 THEN CASE
                  WHEN ARRAY_AGG(ET.LEVEL ORDER BY TO_DATE(ET.PERIOD_END, 'YYYY/MM') DESC)::INT[] <@ ARRAY[1, 2, 3, 4, 5, 6, 7] THEN ROUND(
                    SUM(
                      ET.SUMMARY_POINT_EVALUATOR_2 * ET.PERCENT_POINT / 100
                    )
                  )::VARCHAR
                  WHEN ARRAY_AGG(ET.LEVEL ORDER BY TO_DATE(ET.PERIOD_END, 'YYYY/MM') DESC)::INT[] <@ ARRAY[8, 9, 10] THEN ROUND(
                    SUM(
                      SDT.SUMMARY_POINT_EVALUATOR_2 * ET.PERCENT_POINT / 100
                    ),
                    1
                  )::VARCHAR
                  ELSE STRING_AGG(
                    CASE
                      WHEN ET.LEVEL >= 8 THEN SDT.SUMMARY_POINT_EVALUATOR_2::NUMERIC(5, 1)::VARCHAR
                      ELSE ET.SUMMARY_POINT_EVALUATOR_2::NUMERIC(5, 0)::VARCHAR
                    END,
                    ' - ' ORDER BY TO_DATE(ET.PERIOD_END, 'YYYY/MM') DESC
                  )::VARCHAR
                END
                ELSE CASE
                  WHEN MAX(ET.LEVEL) < 8 THEN MAX(ET.SUMMARY_POINT_EVALUATOR_2)::NUMERIC(5, 0)::VARCHAR
                  ELSE MAX(SDT.SUMMARY_POINT_EVALUATOR_2)::NUMERIC(5, 1)::VARCHAR
                END
              END AS "totalPoint"
            FROM
              EVALUATION_TBL ET
              INNER JOIN EVALUATION_PERIOD_TBL EPT ON ET.EVALUATION_PERIOD_ID = EPT.ID
              LEFT JOIN SUMMARY_DEPARTMENT_TBL SDT ON ET.ID = SDT.EVALUATION_ID
            WHERE
              ET.STATUS = 100
              AND EPT.ID BETWEEN (
                SELECT
                  ID
                FROM
                  EVALUATION_PERIOD_ID_YEAR_START
              ) AND (
                SELECT
                  ID
                FROM
                  EVALUATION_PERIOD_ID_YEAR_END
              )
            GROUP BY
              ET.USER_ID,
              EPT."year",
              EPT.PERIOD_INDEX
          ) EVALUATION ON EVALUATION.USER_ID = UT.ID
          INNER JOIN COMPANY_GROUP_TBL CGT ON UT.COMPANY_GROUP_CODE = CGT.CODE
          LEFT JOIN EVALUATION_TBL ET ON UT.ID = ET.USER_ID
          LEFT JOIN EVALUATOR_TBL ET2 ON ET2.EVALUATION_ID = ET.ID
        WHERE
          ${department !== null
            ? department.length > 0 &&
                `(EC."ARR_DIVISION_ID" && ARRAY[${department.join(',')}]::smallint[] OR EC."ARR_DEPARTMENT_ID" && ARRAY[${department.join(',')}]::smallint[] OR EDT.division_id = ANY(ARRAY[${department.join(',')} ]::smallint[]) OR EDT.department_id = ANY(ARRAY[${department.join(',')}]::smallint[])) AND`
            : ''}
          UT.ACTIVE = 1
          AND UT.COMPANY_GROUP_CODE = :companyGroupCode
          AND (
            UT.FULL_NAME ILIKE '%' || :fullName || '%'
            OR UT.EMAIL ILIKE '%' || :fullName || '%'
            OR UT.EMPLOYEE_NUMBER ILIKE '%' || :fullName || '%'
          )
          AND (
            -- check có record ngoại lệ, nếu không có ngoại lệ
            EXISTS (
              SELECT
                1
              FROM
                EVALUATION_TBL EVT
                INNER JOIN EVALUATOR_TBL EVA ON EVT.ID = EVA.EVALUATION_ID
              WHERE
                EVT.USER_ID = EDT.USER_ID
                AND EVT.EVALUATION_PERIOD_ID = EDT.EVALUATION_PERIOD_ID
                AND EVT.CREATION_USER IS NOT NULL
                AND EVA.EVALUATOR_ID = :userId
            )
            OR
            (
              EDT.EVALUATOR_0_5_ID = :userId
              OR EDT.EVALUATOR_1_ID = :userId
              OR EDT.EVALUATOR_2_ID = :userId
            )
          )
        GROUP BY
          "userName",
          "employeeNumber",
          UT."level",
          "userId",
          UT."active",
          EC."divisionName",
          EDT.division_name,
          EC."departmentName",
          EDT.department_name
        ORDER BY
          "divisionName" ASC,
          "departmentName" ASC,
          "employee_number" ASC
      `, {
            nest: true,
            replacements: {
                yearStart: yearStart,
                yearEnd: yearEnd,
                fullName: fullName,
                companyGroupCode: companyGroupCode,
                userId: userId,
                year: yearEvaluate,
                periodIndex: periodEvaluate,
            },
        });
        return datas;
    }
    async getDivDepToExportHistoryEvaluation(userId, companyGroupCode, params) {
        const datas = await this.userRepository.sequelize.query(`
        WITH
          CURRENT_PERIOD AS (
            SELECT DISTINCT
              EP.ID,
              EP.YEAR,
              EP.PERIOD_INDEX
            FROM
              PUBLIC.EVALUATION_PERIOD_TBL EP
              JOIN PUBLIC.COMPANY_GROUP_TBL CG ON EP.COMPANY_GROUP_CODE = CG.CODE
              JOIN PUBLIC.EVALUATOR_DEFAULT_TBL EDT ON EDT.EVALUATION_PERIOD_ID = EP.ID
              LEFT JOIN PUBLIC.EVALUATION_TBL EV ON EP.ID = EV.EVALUATION_PERIOD_ID
            WHERE
              EP.COMPANY_GROUP_CODE = :companyGroupCode
              AND EP.YEAR = :year
              AND EP.PERIOD_INDEX = :periodIndex
            GROUP BY
              EP.ID,
              EP.YEAR,
              EP.PERIOD_INDEX
          ),
          EVALUATION_CURRENT_PERIOD AS (
            SELECT
              EV.USER_ID,
              EV.DIVISION_NAME AS "divisionName",
              EV.DEPARTMENT_NAME AS "departmentName",
              EV.DIVISION_ID AS "divisionId",
              EV.DEPARTMENT_ID AS "departmentId"
            FROM
              EVALUATION_TBL EV
              JOIN CURRENT_PERIOD CP ON EV.EVALUATION_PERIOD_ID = CP.ID
              -- lấy những record của user đánh giá
              JOIN EVALUATOR_TBL ET2 ON ET2.EVALUATION_ID = EV.ID
              AND ET2.EVALUATOR_ID = :userId
            GROUP BY
              EV.USER_ID,
              EV.DIVISION_NAME,
              EV.DEPARTMENT_NAME,
              EV.DIVISION_ID,
              EV.DEPARTMENT_ID
          )
        SELECT DISTINCT
          CASE 
              WHEN EC."departmentId" IS NOT NULL THEN EC."departmentId"
            ELSE EDT.department_id
            END AS "id",
          CASE 
              WHEN EC."departmentName" IS NOT NULL THEN EC."departmentName"
            ELSE EDT.department_name
          END AS "name",
          0 AS "type"
        FROM
          EVALUATOR_DEFAULT_TBL EDT
          INNER JOIN CURRENT_PERIOD CP ON CP.ID = EDT.EVALUATION_PERIOD_ID
          INNER JOIN USER_TBL UT ON EDT.USER_ID = UT.ID
          INNER JOIN COMPANY_GROUP_TBL CGT ON UT.COMPANY_GROUP_CODE = CGT.CODE
          LEFT JOIN EVALUATION_CURRENT_PERIOD EC ON UT.ID = EC.USER_ID
          LEFT JOIN EVALUATION_TBL ET ON UT.ID = ET.USER_ID
          LEFT JOIN EVALUATOR_TBL ET2 ON ET2.EVALUATION_ID = ET.ID
        WHERE
          UT.ACTIVE = 1
          AND UT.COMPANY_GROUP_CODE = :companyGroupCode
          AND (
            EC."departmentName" IS NOT NULL
            OR EDT.department_name IS NOT NULL
          )
          AND (
            -- check có record ngoại lệ, nếu không có ngoại lệ
            EXISTS (
              SELECT
                1
              FROM
                EVALUATION_TBL EVT
                INNER JOIN EVALUATOR_TBL EVA ON EVT.ID = EVA.EVALUATION_ID
              WHERE
                EVT.USER_ID = EDT.USER_ID
                AND EVT.EVALUATION_PERIOD_ID = EDT.EVALUATION_PERIOD_ID
                AND EVT.CREATION_USER IS NOT NULL
                AND EVA.EVALUATOR_ID = :userId
            )
            OR
            (
              EDT.EVALUATOR_0_5_ID = :userId
              OR EDT.EVALUATOR_1_ID = :userId
              OR EDT.EVALUATOR_2_ID = :userId
            )
          )
        UNION ALL
        SELECT DISTINCT
          CASE 
              WHEN EC."divisionId" IS NOT NULL THEN EC."divisionId"
              ELSE EDT.division_id
          END AS "id",
          CASE 
            WHEN EC."divisionName" IS NOT NULL THEN EC."divisionName"
            ELSE EDT.division_name
          END AS "name",
          1 AS "type"
        FROM
          EVALUATOR_DEFAULT_TBL EDT
          INNER JOIN CURRENT_PERIOD CP ON CP.ID = EDT.EVALUATION_PERIOD_ID
          INNER JOIN USER_TBL UT ON EDT.USER_ID = UT.ID
          INNER JOIN COMPANY_GROUP_TBL CGT ON UT.COMPANY_GROUP_CODE = CGT.CODE
          LEFT JOIN EVALUATION_CURRENT_PERIOD EC ON UT.ID = EC.USER_ID
          LEFT JOIN EVALUATION_TBL ET ON UT.ID = ET.USER_ID
          LEFT JOIN EVALUATOR_TBL ET2 ON ET2.EVALUATION_ID = ET.ID
        WHERE
          UT.ACTIVE = 1
          AND UT.COMPANY_GROUP_CODE = :companyGroupCode
          AND (
            EC."divisionName" IS NOT NULL
            OR EDT.division_name IS NOT NULL
            )
          AND (
            -- check có record ngoại lệ, nếu không có ngoại lệ
            EXISTS (
              SELECT
                1
              FROM
                EVALUATION_TBL EVT
                INNER JOIN EVALUATOR_TBL EVA ON EVT.ID = EVA.EVALUATION_ID
              WHERE
                EVT.USER_ID = EDT.USER_ID
                AND EVT.EVALUATION_PERIOD_ID = EDT.EVALUATION_PERIOD_ID
                AND EVT.CREATION_USER IS NOT NULL
                AND EVA.EVALUATOR_ID = :userId
            )
            OR
            (
              EDT.EVALUATOR_0_5_ID = :userId
              OR EDT.EVALUATOR_1_ID = :userId
              OR EDT.EVALUATOR_2_ID = :userId
            )
          )
      `, {
            nest: true,
            replacements: {
                userId: userId,
                companyGroupCode: companyGroupCode,
                year: params.yearEvaluate,
                periodIndex: params.periodEvaluate,
            },
        });
        return datas;
    }
    async listUserProSkillExpertise(department, fullName, yearStart, yearEnd, userId, companyGroupCode, offset, limit, sortColumns, sortDirections, yearEvaluate, periodEvaluate) {
        const getIdEvaluationPeriods = await this.evaluationPeriodEntity.findOne({
            attributes: ['id', 'companyGroupCode'],
            where: {
                year: yearEvaluate,
                periodIndex: periodEvaluate,
                companyGroupCode: companyGroupCode,
            },
            include: [
                {
                    model: EvaluatorDefault_1.EvaluatorDefault,
                    as: 'evaluatorDefaults',
                    required: false,
                    where: {
                        [sequelize_1.Op.and]: [
                            {
                                [sequelize_1.Op.or]: [
                                    { evaluator05Id: userId },
                                    { evaluator1Id: userId },
                                    { evaluator2Id: userId },
                                ],
                            },
                            {
                                flagSkill: 1,
                            },
                            department
                                ? {
                                    [sequelize_1.Op.or]: [
                                        {
                                            departmentId: {
                                                [sequelize_1.Op.in]: department.map((v) => Number(v)),
                                            },
                                        },
                                        {
                                            divisionId: {
                                                [sequelize_1.Op.in]: department.map((v) => Number(v)),
                                            },
                                        },
                                    ],
                                }
                                : {},
                            {
                                companyGroupCode: companyGroupCode,
                            },
                        ],
                    },
                    include: [
                        {
                            model: Department_1.Department,
                            as: 'department',
                            attributes: ['id', 'code', 'name'],
                        },
                        {
                            model: Department_1.Department,
                            as: 'division',
                            attributes: ['id', 'code', 'name'],
                        },
                    ],
                },
                {
                    model: Evaluation_1.Evaluation,
                    as: 'evaluations',
                    required: false,
                    attributes: ['userId', 'id', 'departmentId', 'divisionId'],
                    where: {
                        [sequelize_1.Op.and]: [
                            { companyGroupCode: companyGroupCode },
                            {
                                flagSkill: 1,
                            },
                            department
                                ? {
                                    [sequelize_1.Op.or]: [
                                        {
                                            departmentId: {
                                                [sequelize_1.Op.in]: department.map((v) => Number(v)),
                                            },
                                        },
                                        {
                                            divisionId: {
                                                [sequelize_1.Op.in]: department.map((v) => Number(v)),
                                            },
                                        },
                                    ],
                                }
                                : {},
                        ],
                    },
                    include: [
                        {
                            model: Evaluator_1.Evaluator,
                            where: {
                                evaluatorId: userId,
                            },
                        },
                        {
                            model: Department_1.Department,
                            as: 'department',
                            attributes: ['id', 'code', 'name'],
                        },
                        {
                            model: Department_1.Department,
                            as: 'division',
                            attributes: ['id', 'code', 'name'],
                        },
                    ],
                },
            ],
        });
        const userLists = [
            getIdEvaluationPeriods &&
                getIdEvaluationPeriods.evaluations !== null &&
                getIdEvaluationPeriods.evaluations.map((v) => v.userId).flat(),
            getIdEvaluationPeriods &&
                getIdEvaluationPeriods.evaluatorDefaults !== null &&
                getIdEvaluationPeriods.evaluatorDefaults.map((v) => v.userId).flat(),
        ];
        const getlistDepartmentDivisionByEvaluation = await this.evaluationPeriodEntity.findOne({
            attributes: ['id', 'companyGroupCode'],
            where: {
                year: yearEvaluate,
                periodIndex: periodEvaluate,
                companyGroupCode: companyGroupCode,
            },
            include: [
                {
                    model: Evaluation_1.Evaluation,
                    as: 'evaluations',
                    required: false,
                    attributes: ['userId', 'id', 'departmentId', 'divisionId'],
                    where: {
                        [sequelize_1.Op.and]: [
                            { companyGroupCode: companyGroupCode },
                            {
                                flagSkill: 1,
                            },
                            {
                                userId: {
                                    [sequelize_1.Op.in]: [...Array.from(new Set(userLists.flat()))],
                                },
                            },
                        ],
                    },
                    include: [
                        {
                            model: Evaluator_1.Evaluator,
                            where: {
                                evaluatorId: userId,
                            },
                        },
                        {
                            model: Department_1.Department,
                            as: 'department',
                            attributes: ['id', 'code', 'name'],
                        },
                        {
                            model: Department_1.Department,
                            as: 'division',
                            attributes: ['id', 'code', 'name'],
                        },
                    ],
                },
            ],
        });
        const listUsersByEvaluations = getlistDepartmentDivisionByEvaluation
            ? getlistDepartmentDivisionByEvaluation.evaluations.reduce((acc, evaluation) => {
                const userId = evaluation.userId;
                if (!acc[userId]) {
                    acc[userId] = {
                        userId: userId,
                        evaluations: [
                            {
                                department: evaluation.department,
                                division: evaluation.division,
                            },
                        ],
                    };
                }
                acc[userId].evaluations.push({
                    department: evaluation.department,
                    division: evaluation.division,
                });
                return acc;
            }, {})
            : [];
        const listEvaluationPublic = await this.evaluationPeriodEntity.findAll({
            where: {
                year: { [sequelize_1.Op.between]: [yearStart, yearEnd] },
                companyGroupCode: companyGroupCode,
            },
            include: [
                {
                    model: Evaluation_1.Evaluation,
                    where: {
                        [sequelize_1.Op.and]: [
                            {
                                userId: { [sequelize_1.Op.in]: Array.from(new Set(userLists.flat())) },
                            },
                            { flagSkill: 1 },
                            { status: 100 },
                        ],
                    },
                },
            ],
        });
        const UserIdList = listEvaluationPublic &&
            listEvaluationPublic.map((v) => v.evaluations.map((v) => v.userId));
        const countUsers = await this.userEntity.count({
            where: {
                [sequelize_1.Op.and]: [
                    { id: { [sequelize_1.Op.in]: [...Array.from(new Set(UserIdList.flat()))] } },
                    {
                        [sequelize_1.Op.or]: [
                            { fullName: { [sequelize_1.Op.iLike]: `%${fullName}%` } },
                            { employeeNumber: { [sequelize_1.Op.iLike]: `%${fullName}%` } },
                            { email: { [sequelize_1.Op.iLike]: `%${fullName}%` } },
                        ],
                    },
                    { active: 1 },
                ],
            },
        });
        let index = sortColumns.indexOf('level');
        const users = await this.userEntity.findAll({
            attributes: [
                'employeeNumber',
                'level',
                ['full_name', 'userName'],
                'active',
                'id',
            ],
            include: [
                {
                    model: Department_1.Department,
                    as: 'department',
                    attributes: ['id', 'code', 'name'],
                },
                {
                    model: Department_1.Department,
                    as: 'division',
                    attributes: ['id', 'code', 'name'],
                },
            ],
            where: {
                [sequelize_1.Op.and]: [
                    { id: { [sequelize_1.Op.in]: [...Array.from(new Set(UserIdList.flat()))] } },
                    {
                        [sequelize_1.Op.or]: [
                            { fullName: { [sequelize_1.Op.iLike]: `%${fullName}%` } },
                            { employeeNumber: { [sequelize_1.Op.iLike]: `%${fullName}%` } },
                            { email: { [sequelize_1.Op.iLike]: `%${fullName}%` } },
                        ],
                    },
                    { active: 1 },
                ],
            },
            offset: offset,
            limit: limit,
            order: [
                index !== -1
                    ? ['level', this.escapeSortDirection(sortDirections[index])]
                    : ['employeeNumber', 'ASC'],
            ],
        });
        const applyDepartmentAndDivision = users.map((v) => {
            let source = [];
            if (listUsersByEvaluations[v.id]) {
                source = listUsersByEvaluations[v.id].evaluations;
                const divisionDepartmentLines = source
                    .map((val, idx) => {
                    var _a, _b;
                    const divisionName = ((_a = val.division) === null || _a === void 0 ? void 0 : _a.name) || '';
                    const departmentName = ((_b = val.department) === null || _b === void 0 ? void 0 : _b.name) || '';
                    if (!divisionName && !departmentName)
                        return null;
                    const combined = [divisionName, departmentName]
                        .filter(Boolean)
                        .join('IDS_COMMA');
                    return `${combined}`;
                })
                    .filter(Boolean);
                const uniqueDivDepLines = Array.from(new Set(divisionDepartmentLines));
                v.dataValues.divisionName = uniqueDivDepLines.join('\n');
            }
            else {
                const combined = [v.division.name, v.department.name]
                    .filter(Boolean)
                    .join('IDS_COMMA');
                v.dataValues.divisionName = combined;
            }
            v.dataValues.userId = v.id;
            return v;
        });
        return { counts: countUsers || 0, data: applyDepartmentAndDivision };
    }
    async getListDepartmentExpertise(userId, companyGroupCode, param) {
        const datas = await this.userRepository.sequelize.query(`
      WITH
        CURRENT_PERIOD AS (
          SELECT DISTINCT
            EP.ID,
            EP.YEAR,
            EP.PERIOD_INDEX
          FROM
            PUBLIC.EVALUATION_PERIOD_TBL EP
            JOIN PUBLIC.COMPANY_GROUP_TBL CG ON EP.COMPANY_GROUP_CODE = CG.CODE
            JOIN PUBLIC.EVALUATOR_DEFAULT_TBL EDT ON EDT.EVALUATION_PERIOD_ID = EP.ID
            LEFT JOIN PUBLIC.EVALUATION_TBL EV ON EP.ID = EV.EVALUATION_PERIOD_ID
          WHERE
            EP.COMPANY_GROUP_CODE = :companyGroupCode
            AND EP.YEAR = :year
            AND EP.PERIOD_INDEX = :periodIndex
          GROUP BY
            EP.ID,
            EP.YEAR,
            EP.PERIOD_INDEX
        ),
        EVALUATION_CURRENT_PERIOD AS (
          SELECT
            EV.USER_ID,
            EV.DIVISION_NAME AS "divisionName",
            EV.DEPARTMENT_NAME AS "departmentName",
            EV.DIVISION_ID AS "divisionId",
            EV.DEPARTMENT_ID AS "departmentId"
          FROM
            EVALUATION_TBL EV
            JOIN CURRENT_PERIOD CP ON EV.EVALUATION_PERIOD_ID = CP.ID
            -- lấy những record của user đánh giá
            JOIN EVALUATOR_TBL ET2 ON ET2.EVALUATION_ID = EV.ID
            AND ET2.EVALUATOR_ID = :userId
          GROUP BY
            EV.USER_ID,
            EV.DIVISION_NAME,
            EV.DEPARTMENT_NAME,
            EV.DIVISION_ID,
            EV.DEPARTMENT_ID
        )
      SELECT DISTINCT
        CASE 
            WHEN EC."departmentId" IS NOT NULL THEN EC."departmentId"
          ELSE EDT.department_id
          END AS "id",
        CASE 
            WHEN EC."departmentName" IS NOT NULL THEN EC."departmentName"
          ELSE EDT.department_name
        END AS "name",
        0 AS "type"
      FROM
        EVALUATOR_DEFAULT_TBL EDT
        INNER JOIN CURRENT_PERIOD CP ON CP.ID = EDT.EVALUATION_PERIOD_ID
        INNER JOIN USER_TBL UT ON EDT.USER_ID = UT.ID
        INNER JOIN COMPANY_GROUP_TBL CGT ON UT.COMPANY_GROUP_CODE = CGT.CODE
        LEFT JOIN EVALUATION_CURRENT_PERIOD EC ON UT.ID = EC.USER_ID
        LEFT JOIN EVALUATION_TBL ET ON UT.ID = ET.USER_ID
        LEFT JOIN EVALUATOR_TBL ET2 ON ET2.EVALUATION_ID = ET.ID
      WHERE
        UT.ACTIVE = 1
        AND UT.COMPANY_GROUP_CODE = :companyGroupCode
        AND (
          EC."departmentName" IS NOT NULL
          OR EDT.department_name IS NOT NULL
        )
        AND (
          -- check có record ngoại lệ, nếu không có ngoại lệ
          EXISTS (
            SELECT
              1
            FROM
              EVALUATION_TBL EVT
              INNER JOIN EVALUATOR_TBL EVA ON EVT.ID = EVA.EVALUATION_ID
            WHERE
              EVT.USER_ID = EDT.USER_ID
              AND EVT.EVALUATION_PERIOD_ID = EDT.EVALUATION_PERIOD_ID
              AND EVT.CREATION_USER IS NOT NULL
              AND EVA.EVALUATOR_ID = :userId
          )
          OR
          (
            EDT.EVALUATOR_0_5_ID = :userId
            OR EDT.EVALUATOR_1_ID = :userId
            OR EDT.EVALUATOR_2_ID = :userId
          )
        )
      UNION ALL
      SELECT DISTINCT
        CASE 
            WHEN EC."divisionId" IS NOT NULL THEN EC."divisionId"
            ELSE EDT.division_id
        END AS "id",
        CASE 
          WHEN EC."divisionName" IS NOT NULL THEN EC."divisionName"
          ELSE EDT.division_name
        END AS "name",
        1 AS "type"
      FROM
        EVALUATOR_DEFAULT_TBL EDT
        INNER JOIN CURRENT_PERIOD CP ON CP.ID = EDT.EVALUATION_PERIOD_ID
        INNER JOIN USER_TBL UT ON EDT.USER_ID = UT.ID
        INNER JOIN COMPANY_GROUP_TBL CGT ON UT.COMPANY_GROUP_CODE = CGT.CODE
        LEFT JOIN EVALUATION_CURRENT_PERIOD EC ON UT.ID = EC.USER_ID
        LEFT JOIN EVALUATION_TBL ET ON UT.ID = ET.USER_ID
        LEFT JOIN EVALUATOR_TBL ET2 ON ET2.EVALUATION_ID = ET.ID
      WHERE
        UT.ACTIVE = 1
        AND UT.COMPANY_GROUP_CODE = :companyGroupCode
        AND (
          EC."divisionName" IS NOT NULL
          OR EDT.division_name IS NOT NULL
          )
        AND (
          -- check có record ngoại lệ, nếu không có ngoại lệ
          EXISTS (
            SELECT
              1
            FROM
              EVALUATION_TBL EVT
              INNER JOIN EVALUATOR_TBL EVA ON EVT.ID = EVA.EVALUATION_ID
            WHERE
              EVT.USER_ID = EDT.USER_ID
              AND EVT.EVALUATION_PERIOD_ID = EDT.EVALUATION_PERIOD_ID
              AND EVT.CREATION_USER IS NOT NULL
              AND EVA.EVALUATOR_ID = :userId
          )
          OR
          (
            EDT.EVALUATOR_0_5_ID = :userId
            OR EDT.EVALUATOR_1_ID = :userId
            OR EDT.EVALUATOR_2_ID = :userId
          )
        )
        ORDER BY
          "name" ASC;
    `, {
            nest: true,
            replacements: {
                userId: userId,
                companyGroupCode: companyGroupCode,
                year: param.yearEvaluate,
                periodIndex: param.periodEvaluate,
            },
            logging: false,
        });
        return datas;
    }
    async getListEvaluationToExportPDF(year, periodIndex, userId, companyGroupCode) {
        const result = await this.userRepository.sequelize.query(`
      WITH period_cte AS (
        SELECT id
        FROM evaluation_period_tbl
        WHERE
          year = :year
          AND period_index = :periodIndex
          AND company_group_code = :companyGroupCode
      ),
      evaluation_normal AS (
        SELECT id, level
        FROM evaluation_tbl
        WHERE
          status = 100
          AND user_id = :userId
          AND evaluation_period_id = (SELECT id FROM period_cte)
          AND creation_user IS NULL
          AND company_group_code = :companyGroupCode
      ),
      evaluation_exception AS (
        SELECT id, level
        FROM evaluation_tbl
        WHERE
          status = 100
          AND user_id = :userId
          AND evaluation_period_id = (SELECT id FROM period_cte)
          AND creation_user IS NOT NULL
          AND company_group_code = :companyGroupCode
      )
      SELECT
        (SELECT ROW_TO_JSON(evaluation_normal) FROM evaluation_normal) AS "evaluationNormal",
        (SELECT JSON_AGG(evaluation_exception) FROM evaluation_exception) AS "evaluationException"
      `, {
            nest: true,
            replacements: {
                year,
                periodIndex,
                companyGroupCode,
                userId,
            },
            logging: false,
        });
        return result[0];
    }
    async getLastestPeriodIdByEvaluator(evaluatorId, companyGroupCode) {
        return await this.evaluatorEnity.sequelize.query(`SELECT evaluation_tbl.evaluation_period_id as "evaluationPeriodId" FROM evaluator_tbl 
        INNER JOIN evaluation_tbl ON evaluation_tbl.id = evaluator_tbl.evaluation_id
        where evaluator_tbl.evaluator_id = :evaluatorId AND evaluation_tbl.company_group_code = :companyGroupCode 
        ORDER BY evaluation_tbl.evaluation_period_id DESC limit 1
      `, {
            replacements: {
                evaluatorId,
                companyGroupCode,
            },
            type: sequelize_1.QueryTypes.SELECT,
        });
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.HISTORY_APPROVE_EVALUATION),
    __metadata("design:type", Object)
], EvaluatorRepository.prototype, "historyApproveEvaluationEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION),
    __metadata("design:type", Object)
], EvaluatorRepository.prototype, "evaluationEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.USER),
    __metadata("design:type", Object)
], EvaluatorRepository.prototype, "userRepository", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.USER),
    __metadata("design:type", Object)
], EvaluatorRepository.prototype, "userEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATOR),
    __metadata("design:type", Object)
], EvaluatorRepository.prototype, "evaluatorEnity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_PERIOD),
    __metadata("design:type", Object)
], EvaluatorRepository.prototype, "evaluationPeriodEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATOR_DEFAULT),
    __metadata("design:type", Object)
], EvaluatorRepository.prototype, "evaluatorDefaultEnity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.VERSION_GUIDE_EVALUATION),
    __metadata("design:type", Object)
], EvaluatorRepository.prototype, "versionGuideEvaluationEntity", void 0);
EvaluatorRepository = __decorate([
    (0, common_1.Injectable)()
], EvaluatorRepository);
exports.EvaluatorRepository = EvaluatorRepository;
//# sourceMappingURL=evaluator.repository.js.map