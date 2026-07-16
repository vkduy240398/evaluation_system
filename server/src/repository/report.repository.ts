import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import EntityConstant from 'src/constant/EntityConstant';
import { Department } from 'src/entity/Department';
import { Evaluation } from 'src/entity/Evaluation';
import { EvaluationAchievementAdditional } from 'src/entity/EvaluationAchievementAdditional';
import { EvaluationAchievementPersonal } from 'src/entity/EvaluationAchievementPersonal';
import { EvaluationAchievementPersonalSub } from 'src/entity/EvaluationAchievementPersonalSub';
import { EvaluationBasicBehavior } from 'src/entity/EvaluationBasicBehavior';
import { EvaluationPeriod } from 'src/entity/EvaluationPeriod';
import { EvaluationPro } from 'src/entity/EvaluationPro';
import { Evaluator } from 'src/entity/Evaluator';
import { User } from 'src/entity/User';

@Injectable()
export class ReportRepository {
  @Inject(EntityConstant.EVALUATION)
  private evaluationEntity: typeof Evaluation;

  @Inject(EntityConstant.EVALUATION_ACHIEVEMENT_PERSONAL)
  private evaluationAchievementPersonal: typeof EvaluationAchievementPersonal;

  async getEvaluationByIdList(
    id: number[],
    userId: any,
    isEvaluatorUser: boolean,
  ): Promise<{
    evaluations: Evaluation[];
  }> {
    //
    const userCondition = isEvaluatorUser
      ? { userId }
      : { userId: { [Op.not]: null } };

    const evaluations = await this.evaluationEntity.findAll({
      attributes: [
        'id',
        'title',
        'periodStart',
        'periodEnd',
        'departmentName',
        'companyName',
        'status',
        'level',

        'basicTotalPointUser',
        'basicTotalPointEvaluator05',
        'basicTotalPointEvaluator1',
        'basicTotalPointEvaluator2',

        'behaviorTotalPointUser',
        'behaviorTotalPointEvaluator05',
        'behaviorTotalPointEvaluator1',
        'behaviorTotalPointEvaluator2',

        'proTotalPointUser',
        'proTotalPointEvaluator05',
        'proTotalPointEvaluator1',
        'proTotalPointEvaluator2',

        'achievementPersonalTotalPointUser',
        'achievementPersonalTotalPointEvaluator05',
        'achievementPersonalTotalPointEvaluator1',
        'achievementPersonalTotalPointEvaluator2',

        'achievementAdditionalTotalPointUser',
        'achievementAdditionalTotalPointEvaluator05',
        'achievementAdditionalTotalPointEvaluator1',

        'achievementAdditionalTotalPointEvaluator2',

        'skillPercent',
        'behaviorPercent',
        'achievementPercent',
        'percentPoint',

        'guideVersionId',

        'dateCreationGoalStart',
        'dateCreationGoalEnd',

        // ** Comment user
        'commentUser',
        'updatedTime',

        'basicProTotalPointUser',
        'basicProTotalPointEvaluator05',
        'basicProTotalPointEvaluator1',
        'basicProTotalPointEvaluator2',

        'summaryPointUser',
        'summaryPointEvaluator05',
        'summaryPointEvaluator1',
        'summaryPointEvaluator2',
        'flagSkill',
      ],
      where: { id: { [Op.in]: id }, ...userCondition },
      include: [
        {
          model: EvaluationPeriod,
          as: 'evaluationPeriod',
          attributes: [
            'dateCreationGoalStart',
            'dateCreationGoalEnd',
            'dateEvaluationStart',
            'dateEvaluationEnd',
          ],
        },
        {
          model: Evaluator,
          as: 'evaluator',
          include: [{ model: User, as: 'user', attributes: ['fullName'] }],
        },
        {
          model: EvaluationBasicBehavior,
          as: 'evaluationBasicBehavior',
          separate: true,
          order: [['itemNo', 'ASC']],
        },
        {
          model: EvaluationPro,
          as: 'evaluationPro',
          attributes: [
            'itemNo',
            'itemId',
            'itemTitle',
            'content',
            'difficulty',
            'pointUser',
            'pointEvaluator05',
            'pointEvaluator1',
            'pointEvaluator2',
            'note',
            'totalPointUser',
            'totalPointEvaluator05',
            'totalPointEvaluator1',
            'totalPointEvaluator2',
          ],
          separate: true,
          order: [['itemNo', 'ASC']],
        },
        {
          model: EvaluationAchievementPersonal,
          as: 'evaluationAchievementPersonals',
          attributes: [
            'id',
            'itemNo',
            'title',
            'achievementValue',
            'method',
            'weight',
            'difficultyUser',
            'difficultyEvaluator05',
            'difficultyEvaluator1',
            'difficultyEvaluator2',
            'achievementStatus',
            'reasonComment',
            'actionPlan',
            'pointUser',
            'coefficientUser',
            'pointEvaluator05',
            'coefficientEvaluator05',
            'pointEvaluator1',
            'coefficientEvaluator1',
            'pointEvaluator2',
            'coefficientEvaluator2',
          ],
          separate: true,
          order: [['itemNo', 'ASC']],
          include: [
            {
              model: EvaluationAchievementPersonalSub,
              as: 'evaluationAchievementPersonalSub',
              attributes: ['coefficient', 'evaluationDecision'],
            },
          ],
        },
        {
          model: EvaluationAchievementAdditional,
          as: 'evaluationAchievementAdditional',
          attributes: [
            'type',
            'itemNo',
            'titleAdditional',
            'achievementStatus',
            'reasonComment',
            'pointUser',
            'pointEvaluator05',
            'pointEvaluator1',
            'pointEvaluator2',
          ],
          separate: true,
          order: [['itemNo', 'ASC']],
        },
        {
          model: User,
          as: 'user',
          attributes: ['fullName', 'active', 'employeeNumber'],
          include: [
            {
              model: Department,
              as: 'department',
              attributes: ['name', 'code'],
            },
          ],
        },
      ],
    });

    return {
      evaluations,
    };
  }

  async getDataPDF1_7(
    id: number[],
    userId: any,
    isEvaluatorUser: boolean,
    companyGroupCode: string,
  ): Promise<{
    evaluations: Evaluation[];
  }> {
    const sql = `
    SELECT
      "Evaluation"."id",
      "Evaluation"."title",
      "Evaluation"."period_start" AS "periodStart",
      "Evaluation"."period_end" AS "periodEnd",
      "Evaluation"."department_name" AS "departmentName",
      "Evaluation"."division_name" AS "divisionName",
      "Evaluation"."company_name" AS "companyName",
      "Evaluation"."status",
      "Evaluation"."level",
      "Evaluation"."basic_total_point_user" AS "basicTotalPointUser",
      "Evaluation"."basic_total_point_evaluator_0_5" AS "basicTotalPointEvaluator05",
      "Evaluation"."basic_total_point_evaluator_1" AS "basicTotalPointEvaluator1",
      "Evaluation"."basic_total_point_evaluator_2" AS "basicTotalPointEvaluator2",
      "Evaluation"."behavior_total_point_user" AS "behaviorTotalPointUser",
      "Evaluation"."behavior_total_point_evaluator_0_5" AS "behaviorTotalPointEvaluator05",
      "Evaluation"."behavior_total_point_evaluator_1" AS "behaviorTotalPointEvaluator1",
      "Evaluation"."behavior_total_point_evaluator_2" AS "behaviorTotalPointEvaluator2",
      "Evaluation"."pro_total_point_user" AS "proTotalPointUser",
      "Evaluation"."pro_total_point_evaluator_0_5" AS "proTotalPointEvaluator05",
      "Evaluation"."pro_total_point_evaluator_1" AS "proTotalPointEvaluator1",
      "Evaluation"."pro_total_point_evaluator_2" AS "proTotalPointEvaluator2",
      "Evaluation"."achievement_personal_total_point_user" AS "achievementPersonalTotalPointUser",
      "Evaluation"."achievement_personal_total_point_evaluator_0_5" AS "achievementPersonalTotalPointEvaluator05",
      "Evaluation"."achievement_personal_total_point_evaluator_1" AS "achievementPersonalTotalPointEvaluator1",
      "Evaluation"."achievement_personal_total_point_evaluator_2" AS "achievementPersonalTotalPointEvaluator2",
      "Evaluation"."achievement_additional_total_point_user" AS "achievementAdditionalTotalPointUser",
      "Evaluation"."achievement_additional_total_point_evaluator_0_5" AS "achievementAdditionalTotalPointEvaluator05",
      "Evaluation"."achievement_additional_total_point_evaluator_1" AS "achievementAdditionalTotalPointEvaluator1",
      "Evaluation"."achievement_additional_total_point_evaluator_2" AS "achievementAdditionalTotalPointEvaluator2",
      "Evaluation"."basic_pro_total_point_user" AS "basicProTotalPointUser",
      "Evaluation"."basic_pro_total_point_evaluator_0_5" AS "basicProTotalPointEvaluator05",
      "Evaluation"."basic_pro_total_point_evaluator_1" AS "basicProTotalPointEvaluator1",
      "Evaluation"."basic_pro_total_point_evaluator_2" AS "basicProTotalPointEvaluator2",
      "Evaluation"."summary_point_user" AS "summaryPointUser",
      "Evaluation"."summary_point_evaluator_0_5" AS "summaryPointEvaluator05",
      "Evaluation"."summary_point_evaluator_1" AS "summaryPointEvaluator1",
      "Evaluation"."summary_point_evaluator_2" AS "summaryPointEvaluator2",
      "Evaluation"."skill_percent" AS "skillPercent",
      "Evaluation"."behavior_percent" AS "behaviorPercent",
      "Evaluation"."achievement_percent" AS "achievementPercent",
      "Evaluation"."percent_point" AS "percentPoint",
      "Evaluation"."date_creation_goal_start" AS "dateCreationGoalStart",
      "Evaluation"."date_creation_goal_end" AS "dateCreationGoalEnd",
      "Evaluation"."date_evaluation_start" AS "dateEvaluationStart",
      "Evaluation"."date_evaluation_end" AS "dateEvaluationEnd",
      "Evaluation"."comment_user" AS "commentUser",
      "Evaluation"."updated_time" AS "updatedTime",
      "Evaluation"."guide_version_id" AS "guideVersionId",
      "Evaluation"."flag_skill" AS "flagSkill",

      (
        SELECT
          JSONB_AGG(ROW_TO_JSON(T))
        FROM
          (
            SELECT
              EVALUATION_ID "evaluatorId",
              EVALUATION_ORDER "evaluationOrder",
              COMMENT_PUBLIC "commentPublic",
              COMMENT_PRIVATE "commentPrivate",
              JSONB_BUILD_OBJECT('id', UT.ID, 'fullName', UT.FULL_NAME) USER
            FROM
              EVALUATOR_TBL ET
              INNER JOIN USER_TBL UT ON UT.ID = ET.EVALUATOR_ID
            WHERE
              ET.EVALUATION_ID = "Evaluation"."id"
            ORDER BY
              EVALUATION_ORDER ASC
          ) T
      ) AS "evaluator",

      (
        SELECT
          JSONB_AGG(ROW_TO_JSON(T))
        FROM
          (
            SELECT
              EVALUATION_ID "evaluationId",
              ITEM_NO "itemNo",
              TYPE,
              ITEM_TITLE "itemTitle",
              CONTENT,
              DIFFICULTY,
              POINT_USER "pointUser",
              POINT_EVALUATOR_0_5 "pointEvaluator05",
              POINT_EVALUATOR_1 "pointEvaluator1",
              POINT_EVALUATOR_2 "pointEvaluator2"
            FROM
              EVALUATION_BASIC_BEHAVIOR_TBL EBBT
            WHERE
              EBBT.EVALUATION_ID = "Evaluation"."id"
            ORDER BY
              ITEM_NO ASC
          ) T
      ) AS "evaluationBasicBehavior",

      (
        SELECT
          JSONB_AGG(ROW_TO_JSON(T))
        FROM
          (
            SELECT
              JOB_TYPE "jobType",
              ITEM_NO "itemNo",
              ITEM_ID "itemId",
              ITEM_TITLE "itemTitle",
              CONTENT,
              DIFFICULTY,
              POINT_USER "pointUser",
              POINT_EVALUATOR_0_5 "pointEvaluator05",
              POINT_EVALUATOR_1 "pointEvaluator1",
              POINT_EVALUATOR_2 "pointEvaluator2",
              TOTAL_POINT_USER "totalPointUser",
              TOTAL_POINT_EVALUATOR_0_5 "totalPointEvaluator05",
              TOTAL_POINT_EVALUATOR_1 "totalPointEvaluator1",
              TOTAL_POINT_EVALUATOR_2 "totalPointEvaluator2",
              NOTE
            FROM
              EVALUATION_PRO_TBL EPT
            WHERE
              EPT.EVALUATION_ID = "Evaluation"."id"
              AND EPT.IS_DISABLE = false
            ORDER BY
              ITEM_NO ASC
          ) T
      ) AS "evaluationPro",

      (
        SELECT
          JSONB_AGG(ROW_TO_JSON(T))
        FROM
          (
            SELECT
              TYPE,
              EVALUATION_ID AS "evaluationId",
              ITEM_NO AS "itemNo",
              TITLE_ADDITIONAL AS "titleAdditional",
              ACHIEVEMENT_STATUS AS "achievementStatus",
              REASON_COMMENT AS "reasonComment",
              POINT_USER AS "pointUser",
              POINT_EVALUATOR_0_5 AS "pointEvaluator05",
              POINT_EVALUATOR_1 AS "pointEvaluator1",
              POINT_EVALUATOR_2 AS "pointEvaluator2",
              EVALUATION_ORDER AS "evaluationOrder"
            FROM
              EVALUATION_ACHIEVEMENT_ADDITIONAL_TBL EAAT
            WHERE
              EAAT.EVALUATION_ID = "Evaluation"."id"
            ORDER BY
              ITEM_NO ASC
          ) T
      ) AS "evaluationAchievementAdditional",

      (
        SELECT
          JSONB_AGG(ROW_TO_JSON(T))
        FROM
          (
            SELECT
              TYPE,
              EAPT.ID AS "id",
              ITEM_NO AS "itemNo",
              TITLE,
              ACHIEVEMENT_VALUE AS "achievementValue",
              METHOD,
              WEIGHT,
              DIFFICULTY_USER AS "difficultyUser",
              DIFFICULTY_EVALUATOR_0_5 AS "difficultyEvaluator05",
              DIFFICULTY_EVALUATOR_1 AS "difficultyEvaluator1",
              DIFFICULTY_EVALUATOR_2 AS "difficultyEvaluator2",
              ACHIEVEMENT_STATUS AS "achievementStatus",
              REASON_COMMENT AS "reasonComment",
              ACTION_PLAN AS "actionPlan",
              POINT_USER AS "pointUser",
              COEFFICIENT_USER AS "coefficientUser",
              POINT_EVALUATOR_0_5 AS "pointEvaluator05",
              COEFFICIENT_EVALUATOR_0_5 AS "coefficientEvaluator05",
              POINT_EVALUATOR_1 AS "pointEvaluator1",
              COEFFICIENT_EVALUATOR_1 AS "coefficientEvaluator1",
              POINT_EVALUATOR_2 AS "pointEvaluator2",
              COEFFICIENT_EVALUATOR_2 AS "coefficientEvaluator2",
              (
                SELECT
                  JSONB_AGG(ROW_TO_JSON(T1))
                FROM
                  (
                    SELECT
                      ID,
                      ACHIEVEMENT_PERSONAL_ID "achievementPersonalId",
                      COEFFICIENT::numeric(5,1)::varchar,
                      EVALUATION_DECISION "evaluationDecision",
                      EVALUATION_DECISION "note",
                      DEGREE,
                      CREATED_TIME "createdTime",
                      UPDATED_TIME "updatedTime"
                    FROM
                      EVALUATION_ACHIEVEMENT_PERSONAL_SUB_TBL EAPST2
                    WHERE
                      EAPST2.ACHIEVEMENT_PERSONAL_ID = EAPT.ID
                    ORDER BY
                      COEFFICIENT DESC
                  ) T1
              ) AS "evaluationAchievementPersonalSub"
            FROM
              EVALUATION_ACHIEVEMENT_PERSONAL_TBL EAPT
            WHERE
              EVALUATION_ID = "Evaluation"."id"
            ORDER BY
              ITEM_NO ASC
          ) T
      ) AS "evaluationAchievementPersonals",

      (
        SELECT
          JSONB_BUILD_OBJECT(
            'dateCreationGoalDepartmentStart',
            EPT.DATE_CREATION_GOAL_DEPARTMENT_START,
            'dateCreationGoalDepartmentEnd',
            EPT.DATE_CREATION_GOAL_DEPARTMENT_END,
            'dateEvaluationDepartmentStart',
            EPT.DATE_EVALUATION_DEPARTMENT_START,
            'dateEvaluationDepartmentEnd',
            EPT.DATE_EVALUATION_DEPARTMENT_END
          )
        FROM
          EVALUATION_PERIOD_TBL EPT
        WHERE
          EPT.ID = "Evaluation"."evaluation_period_id"
      ) AS "evaluationPeriod",

      (
        SELECT
          JSONB_BUILD_OBJECT(
            'fullName',
            UT.FULL_NAME,
            'employeeNumber',
            UT.EMPLOYEE_NUMBER
          )
        FROM
          USER_TBL UT
        WHERE
          UT.ID = "Evaluation"."user_id"
      ) AS "user",

      (
        SELECT
          JSONB_AGG(ROW_TO_JSON(T)) AS "listBasicPublic"
        FROM
          (
            SELECT
              TYPE,
              TITLE,
              CONTENT,
              DIFFICULTY
            FROM
              LIST_BASIC_BEHAVIOR_TBL LBBT
              INNER JOIN VERSION_BASIC_BEHAVIOR_TBL VBBT ON VBBT.ID = LBBT.VERSION_ID
            WHERE
              VBBT.STATUS = 4
              AND VBBT.TYPE = 1
              AND VBBT.COMPANY_GROUP_CODE = :companyGroupCode
            ORDER BY
              ID_ITEM ASC
          ) T
      ),

      (
        SELECT
          JSONB_AGG(ROW_TO_JSON(T)) AS "listBehaviorPublic"
        FROM
          (
            SELECT
              TYPE,
              TITLE,
              CONTENT,
              DIFFICULTY,
              VBBT.LEVEL AS "level",
              VBBT.TYPE AS "type"
            FROM
              LIST_BASIC_BEHAVIOR_TBL LBBT
              INNER JOIN VERSION_BASIC_BEHAVIOR_TBL VBBT ON VBBT.ID = LBBT.VERSION_ID
            WHERE
              VBBT.STATUS = 4
              AND VBBT.TYPE IN (2, 3)
              AND VBBT.COMPANY_GROUP_CODE = :companyGroupCode
            ORDER BY
              ID_ITEM ASC
          ) T
      )
      

    FROM
      EVALUATION_TBL "Evaluation"
      LEFT JOIN "evaluation_period_tbl" as "evaluationPeriod"
        ON "Evaluation"."evaluation_period_id" = "evaluationPeriod"."id"
      LEFT JOIN "user_tbl" as "user"
        ON "Evaluation"."user_id" = "user"."id"
        
    WHERE
      "Evaluation"."id" IN (:id)
    AND CASE
      WHEN :isEvaluatorUser = true THEN "Evaluation"."user_id" = :userId
      ELSE "Evaluation"."user_id" IS NOT NULL
    END
    `;
    const evaluationDetail: any = await this.evaluationEntity.sequelize.query(
      sql,
      {
        nest: true,
        replacements: {
          id: id,
          userId: userId,
          isEvaluatorUser: isEvaluatorUser,
          companyGroupCode: companyGroupCode,
        },
        logging: false,
      },
    );

    return {
      evaluations: evaluationDetail,
    };
  }

  async getEvaluationAchievement(id: number) {
    const evaluationAchievementPersonals =
      await this.evaluationAchievementPersonal
        .findAll({
          attributes: [
            'id',
            'itemNo',
            'title',
            'achievementValue',
            'method',
            'weight',
            'difficultyUser',
            'difficultyEvaluator05',
            'difficultyEvaluator1',
            'difficultyEvaluator2',
            'achievementStatus',
            'reasonComment',
            'actionPlan',
            'pointUser',
            'coefficientUser',
            'pointEvaluator05',
            'coefficientEvaluator05',
            'pointEvaluator1',
            'coefficientEvaluator1',
            'pointEvaluator2',
            'coefficientEvaluator2',
          ],
          where: { evaluationId: id },
          include: [
            {
              model: EvaluationAchievementPersonalSub,
              as: 'evaluationAchievementPersonalSub',
              attributes: ['coefficient', 'evaluationDecision', 'degree'],
            },
          ],
          order: [
            ['itemNo', 'ASC'],
            [
              {
                model: EvaluationAchievementPersonalSub,
                as: 'evaluationAchievementPersonalSub',
              },
              'coefficient',
              'DESC',
            ],
          ],
        })
        .then((achievements) => {
          return achievements.map((v, i) => ({
            key: v.id,
            itemNo: v.itemNo,
            title: v.title,
            achievementValue: v.achievementValue,
            method: v.method,
            weight: v.weight,
            difficultyUser: v.difficultyUser,
            difficultyEvaluator05: v.difficultyEvaluator05,
            difficultyEvaluator1: v.difficultyEvaluator1,
            difficultyEvaluator2: v.difficultyEvaluator2,
            achievementStatus: v.achievementStatus,
            reasonComment: v.reasonComment,
            actionPlan: v.actionPlan,
            pointUser: v.pointUser,
            coefficientUser: v.coefficientUser,
            pointEvaluator05: v.pointEvaluator05,
            coefficientEvaluator05: v.coefficientEvaluator05,
            pointEvaluator1: v.pointEvaluator1,
            coefficientEvaluator1: v.coefficientEvaluator1,
            pointEvaluator2: v.pointEvaluator2,
            coefficientEvaluator2: v.coefficientEvaluator2,
            childrens: v.evaluationAchievementPersonalSub.map((e, i2) => ({
              index: i,
              evaluationDecision: e.evaluationDecision,
              coefficient: Number(e.coefficient)?.toFixed(1),
              key: `evaluation-achievement-key-${i}-${i2}`,
              degree: e.degree, 
            })),
          }));
        });

    return evaluationAchievementPersonals;
  }

  async getEvaluationAchievementByType(id: number, type: any) {
    //* 2: 8-10 (cá nhân)
    //* 3: 8-10 (bộ phận)
    const evaluationAchievementPersonals: any =
      await this.evaluationAchievementPersonal
        .findAll({
          attributes: [
            'id',
            'itemNo',
            'title',
            'achievementValue',
            'method',
            'weight',
            'difficultyUser',
            'difficultyEvaluator05',
            'difficultyEvaluator1',
            'difficultyEvaluator2',
            'achievementStatus',
            'reasonComment',
            'actionPlan',
            'pointUser',
            'coefficientUser',
            'pointEvaluator05',
            'coefficientEvaluator05',
            'pointEvaluator1',
            'coefficientEvaluator1',
            'pointEvaluator2',
            'coefficientEvaluator2',
          ],
          where: { evaluationId: id, type: type },
          include: [
            {
              model: EvaluationAchievementPersonalSub,
              as: 'evaluationAchievementPersonalSub',
              attributes: ['coefficient', 'evaluationDecision'],
            },
          ],
          order: [
            ['itemNo', 'ASC'],
            [
              {
                model: EvaluationAchievementPersonalSub,
                as: 'evaluationAchievementPersonalSub',
              },
              'coefficient',
              'DESC',
            ],
          ],
        })
        .then((achievements) => {
          return achievements.map((v, i) => ({
            key: v.id,
            itemNo: v.itemNo,
            title: v.title,
            achievementValue: v.achievementValue,
            method: v.method,
            weight: v.weight,
            difficultyUser: v.difficultyUser,
            difficultyEvaluator05: v.difficultyEvaluator05,
            difficultyEvaluator1: v.difficultyEvaluator1,
            difficultyEvaluator2: v.difficultyEvaluator2,
            achievementStatus: v.achievementStatus,
            reasonComment: v.reasonComment,
            actionPlan: v.actionPlan,
            pointUser: v.pointUser,
            coefficientUser: v.coefficientUser,
            pointEvaluator05: v.pointEvaluator05,
            coefficientEvaluator05: v.coefficientEvaluator05,
            pointEvaluator1: v.pointEvaluator1,
            coefficientEvaluator1: v.coefficientEvaluator1,
            pointEvaluator2: v.pointEvaluator2,
            coefficientEvaluator2: v.coefficientEvaluator2,
            childrens: v.evaluationAchievementPersonalSub.map((e, i2) => ({
              index: i,
              evaluationDecision: e.evaluationDecision,
              coefficient: Number(e.coefficient)?.toFixed(1),
              key: `evaluation-achievement-key-${i}-${i2}`,
            })),
          }));
        });

    return evaluationAchievementPersonals;
  }
}
