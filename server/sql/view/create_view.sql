-- tao view tai su dung
--- tao view achievement personal
-- public.v_evaluation_achievement_personal source

CREATE OR REPLACE VIEW public.v_evaluation_achievement_personal
AS SELECT "evaluationId",
    type,
    jsonb_agg(row_to_json(t.*)) AS "evaluationAchievementPersonals"
   FROM ( SELECT "EvaluationAchievementPersonal".achievement_status AS "achievementStatus",
            "EvaluationAchievementPersonal".achievement_value AS "achievementValue",
            "EvaluationAchievementPersonal".action_plan AS "actionPlan",
            "EvaluationAchievementPersonal".coefficient_evaluator_1::character varying AS "coefficientEvaluator1",
            "EvaluationAchievementPersonal".coefficient_evaluator_0_5::character varying AS "coefficientEvaluator05",
            "EvaluationAchievementPersonal".coefficient_evaluator_2::character varying AS "coefficientEvaluator2",
            "EvaluationAchievementPersonal".coefficient_user::character varying AS "coefficientUser",
            "EvaluationAchievementPersonal".difficulty_user::character varying AS "difficultyUser",
            "EvaluationAchievementPersonal".difficulty_evaluator_0_5::character varying AS "difficultyEvaluator05",
            "EvaluationAchievementPersonal".difficulty_evaluator_1::character varying AS "difficultyEvaluator1",
            "EvaluationAchievementPersonal".difficulty_evaluator_2::character varying AS "difficultyEvaluator2",
            "EvaluationAchievementPersonal".evaluation_id AS "evaluationId",
            "EvaluationAchievementPersonal".id,
            "EvaluationAchievementPersonal".item_no AS "itemNo",
            "EvaluationAchievementPersonal".method,
            "EvaluationAchievementPersonal".point_user AS "pointUser",
            "EvaluationAchievementPersonal".point_evaluator_0_5 AS "pointEvaluator05",
            "EvaluationAchievementPersonal".point_evaluator_1 AS "pointEvaluator1",
            "EvaluationAchievementPersonal".point_evaluator_2 AS "pointEvaluator2",
            "EvaluationAchievementPersonal".reason_comment AS "reasonComment",
            "EvaluationAchievementPersonal".title,
            "EvaluationAchievementPersonal".weight,
            "EvaluationAchievementPersonal".type
           FROM evaluation_achievement_personal_tbl "EvaluationAchievementPersonal"
          ORDER BY "EvaluationAchievementPersonal".item_no) t
  GROUP BY "evaluationId", type;
--- tao view achievement addition
create or replace
view v_evaluation_achievement_addition as
select
	t."evaluationId",
	t.type,
	jsonb_agg(row_to_json(t)) "evaluationAchievementAdditionals"
from
	(
	select
		evaluation_id "evaluationId",
		item_no "itemNo",
		title_additional "titleAdditional",
		achievement_status "achievementStatus",
		reason_comment "reasonComment",
		point_user "pointUser",
		point_evaluator_0_5 "pointEvaluator05",
		point_evaluator_1 "pointEvaluator1",
		point_evaluator_2 "pointEvaluator2",
		evaluation_order "evaluationOrder",
		type
	from
		evaluation_achievement_additional_tbl
	order by
		"itemNo" asc) t
group by
	t."evaluationId",
	t.type;
--- tao view cho evaluator
create or replace
view v_evaluation_evaluator as
select
	t."evaluationId",
	jsonb_agg(jsonb_build_object('evaluationOrder',
	t."evaluationOrder",
	'evaluatorId',
	t."evaluatorId",
	'commentPublic',
	t."commentPublic",
	'commentPrivate',
	t."commentPrivate",
	'user',
	t."user")) "user"
from
	(
	select
		evaluation_id "evaluationId",
		evaluation_order::varchar "evaluationOrder",
		evaluator_id "evaluatorId",
		comment_public "commentPublic",
		comment_private "commentPrivate",
		jsonb_build_object('employeeNumber',
		ut.employee_number,
		'fullName',
		ut.full_name,
		email,
		ut.email) "user"
	from
		evaluator_tbl
	inner join user_tbl ut on
		evaluator_tbl.evaluator_id = ut.id
	order by
		"evaluationOrder" asc)t
group by
	t."evaluationId";
-- public.v_evaluation_basic_behavior source

CREATE OR REPLACE VIEW public.v_evaluation_basic_behavior
AS SELECT "evaluationId",
    jsonb_agg(row_to_json(t.*)) AS "evaluationBasicBehaviors"
   FROM ( SELECT ebbt.evaluation_id AS "evaluationId",
            ebbt.item_title AS title,
            ebbt.item_no AS "itemNo",
            ebbt.content,
            ebbt.difficulty,
            ebbt.point_user AS "pointUser",
            ebbt.point_evaluator_0_5 AS "pointEvaluator05",
            ebbt.point_evaluator_1 AS "pointEvaluator1",
            ebbt.point_evaluator_2 AS "pointEvaluator2",
            ebbt.type,
            concat(case when ebbt.type=4 then 'basic-2-key-' else 'behavior-2-key-' end, ebbt.item_no) AS key,
            jsonb_build_object('type', ebbt.type) AS "versionBasicBehavior"
           FROM evaluation_basic_behavior_tbl ebbt
          ORDER BY ebbt.item_no ASC) t
  GROUP BY "evaluationId";
--- view evaluation pro skill
-- public.v_evaluation_pro source

CREATE OR REPLACE VIEW public.v_evaluation_pro
AS SELECT "evaluationId",
    jsonb_agg(row_to_json(t.*)) AS "evaluationPros"
   FROM ( SELECT evaluation_pro_tbl.content,
            evaluation_pro_tbl.difficulty,
            evaluation_pro_tbl.item_id AS "itemId",
            evaluation_pro_tbl.item_id AS key,
            evaluation_pro_tbl.item_no AS "itemNo",
            evaluation_pro_tbl.item_title AS "itemTitle",
            evaluation_pro_tbl.job_type AS "jobType",
            evaluation_pro_tbl.note,
            evaluation_pro_tbl.point_user AS "pointUser",
            evaluation_pro_tbl.point_evaluator_0_5 AS "pointEvaluator05",
            evaluation_pro_tbl.point_evaluator_1 AS "pointEvaluator1",
            evaluation_pro_tbl.point_evaluator_2 AS "pointEvaluator2",
            evaluation_pro_tbl.total_point_user AS "totalPointUser",
            evaluation_pro_tbl.total_point_evaluator_0_5 AS "totalPointEvaluator05",
            evaluation_pro_tbl.total_point_evaluator_1 AS "totalPointEvaluator1",
            evaluation_pro_tbl.total_point_evaluator_2 AS "totalPointEvaluator2",
            evaluation_pro_tbl.evaluation_id AS "evaluationId",
			evaluation_pro_tbl.is_disable as "isDisable"
           FROM evaluation_pro_tbl order by item_no asc) t
  GROUP BY "evaluationId";
---- view setting achievement personal group theo type, type evaluation và versionId
create or replace
view v_setting_achievement_personal as
select
	t."versionId",
	t."type",
	t."typeEvaluation",
	jsonb_agg(json_build_object('point',
	t.point,
	'type',
	t.type, 
	'note',
	t.note)) "arrayPoint"
from
	(
	select
		sapt.id,
		sapt.version_id "versionId",
		sapt.point,
		sapt.note,
		sapt.type_evaluation "typeEvaluation",
		sapt.type
	from
		setting_achievement_personal_tbl sapt
	order by
		sapt."point" desc) t
group by
	t."versionId",
	t."type",
	t."typeEvaluation";
--- view setting achievement additional group theo type và version setting
create or replace
view v_setting_achievement_additional as
select
	t."versionId",
	t."type",
	jsonb_agg(json_build_object('point',
	t.point,
	'rating',
	t.rating)) "arrayPoint"
from
	(
	select
		saat.id,
		saat.version_id "versionId",
		saat.point,
		saat.note,
		saat.rating,
		saat.type
	from
		setting_achievement_additional_tbl saat
	order by
		saat."point" desc) t
group by
	t."versionId",
	t."type";
--- view setting formula 8 10
create or replace
view v_setting_formula_8_10 as
select
	t."versionId",
	jsonb_agg(json_build_object('point',
	t.point,
	'result',
	t.result)) "arrayPoint"
from
	(
	select
		sft.id,
		sft.version_id "versionId",
		sft.point,
		sft.note,
		sft."result"
	from
		setting_formula_8_10_tbl sft
	order by
		point desc) t
group by
	t."versionId";
----view setting point basic behavior pro skill
create or replace
view v_setting_point_basic_behavior_pro as
select
	t."versionId",
	t.type,
	jsonb_agg(json_build_object('point',
	t.point,
	'type',
	t.type)) "arrayPoint",
	max(t."point") "maxPoint"
from
	(
	select
		id,
		version_id "versionId",
		type,
		point,
		note
	from
		setting_point_basic_behavior_pro_tbl spbbpt
	order by
		point desc) t
group by
	t."versionId",
	t.type;
---- setting pro formula sub
create or replace
view v_setting_pro_formula_sub as
	select
	t."versionId",
	jsonb_agg(row_to_json(t)) "arraySettingSub",
	max(t.point) "difficultyProMax"
from
	(
	select
		"SettingProFormulaSub"."id",
		"settingProFormula"."version_id" "versionId",
		"SettingProFormulaSub"."formula_id" as "formulaId",
		"SettingProFormulaSub"."total_item" as "totalItem",
		"SettingProFormulaSub"."coefficient",
		"SettingProFormulaSub"."formula_id",
		"settingProFormula"."point",
		jsonb_build_object('id',
		"settingProFormula"."id",
		'versionId',
		"settingProFormula"."version_id",
		'point',
		"settingProFormula"."point",
		'note',
		"settingProFormula"."note",
		'version_id',
		"settingProFormula"."version_id") "settingProFormula"
	from
		"setting_pro_formula_sub_tbl" as "SettingProFormulaSub"
	inner join "setting_pro_formula_tbl" as "settingProFormula" on
		"SettingProFormulaSub"."formula_id" = "settingProFormula"."id"
	inner join "version_setting_tbl" as "settingProFormula->versionSetting" on
		"settingProFormula"."version_id" = "settingProFormula->versionSetting"."id"
	order by
		"totalItem" desc) t
group by
	t."versionId";
------------------------- view version basic behavior
CREATE OR REPLACE VIEW public.v_version_basic_behavior
AS SELECT level,
    type,
    jsonb_agg(row_to_json(t.*)) AS "arrayList","companyGroupCode"
   FROM ( SELECT row_number() OVER (ORDER BY lbbt.id_item) AS "itemNo",
            concat('behavior-2-key-', row_number() OVER (ORDER BY lbbt.id_item)) AS key,
            NULL::text AS "pointUser",
            NULL::text AS "pointEvaluator05",
            NULL::text AS "pointEvaluator1",
            NULL::text AS "pointEvaluator2",
            lbbt.title,
            lbbt.content,
            lbbt.difficulty,
            jsonb_build_object('type', "versionSettingBasicBehavior".type) AS "versionBasicBehavior",
            "versionSettingBasicBehavior".level,
            "versionSettingBasicBehavior".type,
            "versionSettingBasicBehavior".company_group_code "companyGroupCode"
           FROM ( SELECT vbbt.type,
                    vbbt.id,
                    vbbt.level,
                    vbbt.company_group_code
                   FROM version_basic_behavior_tbl vbbt
                  WHERE vbbt.status = 4 AND (vbbt.type = ANY (ARRAY[4, 5, 6]))) "versionSettingBasicBehavior"
             JOIN list_basic_behavior_tbl lbbt ON "versionSettingBasicBehavior".id = lbbt.version_id
          ORDER BY lbbt.id_item) t
  GROUP BY level,"companyGroupCode", type;
		
	
