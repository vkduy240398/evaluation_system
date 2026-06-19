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
exports.EvaluationRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const EntityConstant_1 = require("../constant/EntityConstant");
const Evaluation_1 = require("../entity/Evaluation");
const EvaluationAchievementAdditional_1 = require("../entity/EvaluationAchievementAdditional");
const EvaluationAchievementPersonal_1 = require("../entity/EvaluationAchievementPersonal");
const EvaluationPeriod_1 = require("../entity/EvaluationPeriod");
const EvaluationPro_1 = require("../entity/EvaluationPro");
const Evaluator_1 = require("../entity/Evaluator");
const Permission_1 = require("../entity/Permission");
const SettingAchievementAdditional_1 = require("../entity/SettingAchievementAdditional");
const SettingAchievementPersonal_1 = require("../entity/SettingAchievementPersonal");
const SettingFormula810_1 = require("../entity/SettingFormula810");
const User_1 = require("../entity/User");
const VersionGuideEvaluation_1 = require("../entity/VersionGuideEvaluation");
const RuntimeException_1 = require("../model/exception/RuntimeException");
let EvaluationRepository = class EvaluationRepository {
    async getNewTransaction() {
        return await this.evaluationEntity.sequelize.transaction();
    }
    async updateHistoryMailTransaction() {
        return await this.historyMailEntity.sequelize.transaction();
    }
    async getEvaluationById(id, flagSkill, companyGroupCode) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const dataList = (await this.evaluationEntity.sequelize.query(`
   select
		"Evaluation"."id" "id",
		"Evaluation"."department_name" "departmentName",
		"Evaluation"."division_name" "divisionName",
		"Evaluation"."company_name" "companyName",
		"Evaluation"."title" "title",
		"Evaluation"."period_start" "periodStart",
		"Evaluation"."period_end" "periodEnd",
		"Evaluation"."status" "status",
		"Evaluation"."level" "level",
		"Evaluation".percent_point "percentPoint",
		"Evaluation".user_id "userId",
		"Evaluation".comment_user "commentUser",
		"Evaluation".updated_time "updatedTime",
		"Evaluation".summary_char_point_user "summaryCharPointUser",
		"Evaluation".summary_char_point_evaluator_0_5 "summaryCharPointEvaluator05",
		"Evaluation".summary_char_point_evaluator_1 "summaryCharPointEvaluator1",
		"Evaluation".summary_char_point_evaluator_2 "summaryCharPointEvaluator2",
		"Evaluation".summary_point_user "summaryPointUser",
		"Evaluation".summary_point_evaluator_0_5 "summaryPointEvaluator05",
		"Evaluation".summary_point_evaluator_1 "summaryPointEvaluator1",
		"Evaluation".summary_point_evaluator_2 "summaryPointEvaluator2",
		"Evaluation".achievement_personal_total_point_user "achievementPersonalTotalPointUser",
		"Evaluation".achievement_personal_total_point_evaluator_0_5 "achievementPersonalTotalPointEvaluator05",
		"Evaluation".achievement_personal_total_point_evaluator_1 "achievementPersonalTotalPointEvaluator1",
		"Evaluation".achievement_personal_total_point_evaluator_2 "achievementPersonalTotalPointEvaluator2",
		"Evaluation".achievement_additional_total_point_user "achievementAdditionalTotalPointUser",
		"Evaluation".achievement_additional_total_point_evaluator_0_5 "achievementAdditionalTotalPointEvaluator05",
		"Evaluation".achievement_additional_total_point_evaluator_1 "achievementAdditionalTotalPointEvaluator1",
		"Evaluation".achievement_additional_total_point_evaluator_2 "achievementAdditionalTotalPointEvaluator2",
		"Evaluation".date_creation_goal_start "dateCreationGoalStart",
		"Evaluation".date_creation_goal_end "dateCreationGoalEnd",
		"Evaluation".date_evaluation_start "dateEvaluationStart",
		"Evaluation".date_evaluation_end "dateEvaluationEnd",
		"Evaluation".skill_percent "skillPercent",
		"Evaluation".achievement_percent "achievementPercent",
		"Evaluation".basic_pro_total_point_user "basicProTotalPointUser",
		"Evaluation".basic_pro_total_point_evaluator_0_5 "basicProTotalPointEvaluator05",
		"Evaluation".basic_pro_total_point_evaluator_1 "basicProTotalPointEvaluator1",
		"Evaluation".basic_pro_total_point_evaluator_2 "basicProTotalPointEvaluator2",
		"Evaluation".basic_total_point_user "basicTotalPointUser",
		"Evaluation".basic_total_point_evaluator_0_5 "basicTotalPointEvaluator05",
		"Evaluation".basic_total_point_evaluator_1 "basicTotalPointEvaluator1",
		"Evaluation".basic_total_point_evaluator_2 "basicTotalPointEvaluator2",
		"Evaluation".pro_total_point_user "proTotalPointUser",
		"Evaluation".pro_total_point_evaluator_0_5 "proTotalPointEvaluator05",
		"Evaluation".pro_total_point_evaluator_1 "proTotalPointEvaluator1",
		"Evaluation".pro_total_point_evaluator_2 "proTotalPointEvaluator2",
		"Evaluation".behavior_total_point_user "behaviorTotalPointUser",
		"Evaluation".behavior_total_point_evaluator_0_5 "behaviorTotalPointEvaluator05",
		"Evaluation".behavior_total_point_evaluator_1 "behaviorTotalPointEvaluator1",
		"Evaluation".behavior_total_point_evaluator_2 "behaviorTotalPointEvaluator2",
		"Evaluation".behavior_percent "behaviorPercent",
		"Evaluation".flag_skill "flagSkill",
		coalesce("EvaluationAchievementPersonals"."evaluationAchievementPersonals" ,
		'[]') "evaluationAchievementPersonals",

		coalesce("EvaluationAchievementPersonalsOfUsers"."evaluationAchievementPersonals" ,
		'[]') "evaluationAchievementPersonalsOfUsers",

		coalesce("EvaluationAchievementAdditional"."evaluationAchievementAdditionals",
		'[]') "evaluationAchievementAdditional",

		coalesce("EvaluationAchievementAdditionalOfUsers"."evaluationAchievementAdditionals",
		'[]') "evaluationAchievementAdditionalOfUsers",
    
		coalesce(vee."user" ,
		'[]') "evaluator",
		coalesce(vebb."evaluationBasicBehaviors" ,
		'[]') "evaluationBasicBehavior",
		ept.date_creation_goal_department_end "evaluationPeriod.dateCreationGoalDepartmentEnd",
		ept.date_creation_goal_department_start "evaluationPeriod.dateCreationGoalDepartmentStart",
		ept.date_creation_goal_end "evaluationPeriod.dateCreationGoalEnd",
		ept.date_creation_goal_start "evaluationPeriod.dateCreationGoalStart",
		ept.date_evaluation_department_end "evaluationPeriod.dateEvaluationDepartmentEnd",
		ept.date_evaluation_department_start "evaluationPeriod.dateEvaluationDepartmentStart",
		ept.date_evaluation_end "evaluationPeriod.dateEvaluationEnd",
		ept.date_evaluation_start "evaluationPeriod.dateEvaluationStart",
		ept.id "evaluationPeriod.id",
		ept.period_end "evaluationPeriod.periodEnd",
		ept.period_start "evaluationPeriod.periodStart",
		ept.period_index "evaluationPeriod.periodIndex",
		ept."year" "evaluationPeriod.year",
		ut.id "user.id",
		ut.employee_number "user.employeeNumber",
		ut.full_name "user.fullName",
		ut.division_id "user.divisionId",
		ut.active "user.active",
		coalesce(vep."evaluationPros",
	'[]') "evaluationPro",
		sdt.evaluation_id "summaryDepartment.evaluationId",
		sdt.achievement_personal_total_point_user "summaryDepartment.achievementPersonalTotalPointUser",
		sdt.achievement_personal_total_point_evaluator_0_5 "summaryDepartment.achievementPersonalTotalPointEvaluator05",
		sdt.achievement_personal_total_point_evaluator_1 "summaryDepartment.achievementPersonalTotalPointEvaluator1",
		sdt.achievement_personal_total_point_evaluator_2 "summaryDepartment.achievementPersonalTotalPointEvaluator2",
		"sdt".achievement_additional_total_point_user "summaryDepartment.achievementAdditionalTotalPointUser",
		"sdt".achievement_additional_total_point_evaluator_0_5 "summaryDepartment.achievementAdditionalTotalPointEvaluator05",
		"sdt".achievement_additional_total_point_evaluator_1 "summaryDepartment.achievementAdditionalTotalPointEvaluator1",
		"sdt".achievement_additional_total_point_evaluator_2 "summaryDepartment.achievementAdditionalTotalPointEvaluator2",
		"sdt".summary_char_point_user "summaryDepartment.summaryCharPointUser",
		"sdt".summary_char_point_evaluator_0_5 "summaryDepartment.summaryCharPointEvaluator05",
		"sdt".summary_char_point_evaluator_1 "summaryDepartment.summaryCharPointEvaluator1",
		"sdt".summary_char_point_evaluator_2 "summaryDepartment.summaryCharPointEvaluator2",
		"sdt".summary_point_user "summaryDepartment.summaryPointUser",
		"sdt".summary_point_evaluator_0_5 "summaryDepartment.summaryPointEvaluator05",
		"sdt".summary_point_evaluator_1 "summaryDepartment.summaryPointEvaluator1",
		"sdt".summary_point_evaluator_2 "summaryDepartment.summaryPointEvaluator2",
		vvbb."arrayList" "listBasic",
		vvbb2."arrayList" "listBehaviorHaveSkill",
		vvbb3."arrayList" "listBehaviorNoSkill"
from
		evaluation_tbl "Evaluation"
left outer join v_evaluation_achievement_personal as "EvaluationAchievementPersonals" on
		"EvaluationAchievementPersonals"."evaluationId" = "Evaluation".id
	and "EvaluationAchievementPersonals".type = 3
left outer join v_evaluation_achievement_personal as "EvaluationAchievementPersonalsOfUsers" on
		"EvaluationAchievementPersonalsOfUsers"."evaluationId" = "Evaluation".id
	and "EvaluationAchievementPersonalsOfUsers".type = 2
left outer join v_evaluation_achievement_addition "EvaluationAchievementAdditional" on
		"EvaluationAchievementAdditional"."evaluationId" = "Evaluation".id
	and "EvaluationAchievementAdditional".type = 3
left outer join v_evaluation_achievement_addition "EvaluationAchievementAdditionalOfUsers" on
		"EvaluationAchievementAdditionalOfUsers"."evaluationId" = "Evaluation".id
	and "EvaluationAchievementAdditionalOfUsers".type = 2
left outer join v_evaluation_evaluator vee on
		vee."evaluationId" = "Evaluation".id
left outer join v_evaluation_basic_behavior vebb on
		vebb."evaluationId" = "Evaluation".id
left outer join evaluation_period_tbl ept on
		"Evaluation".evaluation_period_id = ept.id
left outer join user_tbl ut on
		"Evaluation".user_id = ut.id
left outer join v_evaluation_pro vep on
	"Evaluation".id = vep."evaluationId"
left outer join summary_department_tbl sdt on
	"Evaluation".id = sdt.evaluation_id
left outer join v_version_basic_behavior vvbb on vvbb."level" is null and vvbb."type" =4 and vvbb."companyGroupCode" like :companyGroupCode
left outer join v_version_basic_behavior vvbb2 on vvbb2."level" ="Evaluation".level and vvbb2."type" =5 and vvbb2."companyGroupCode" like :companyGroupCode
left outer join v_version_basic_behavior vvbb3 on vvbb3."level" ="Evaluation".level and vvbb3."type" =6 and vvbb3."companyGroupCode" like :companyGroupCode
where
		"Evaluation".id = :id AND "Evaluation".company_group_code = :companyGroupCode;
------subList
select jsonb_agg(t1."subList") "subList" from
(select
	jsonb_agg( row_to_json(t)) "subList"
from
	(
	select
		row_number () over(
	order by
		eapt.id asc,
		coefficient desc) "key",
		eapst.evaluation_decision "evaluationDecision",
		eapst.coefficient::varchar ,
		eapst.achievement_personal_id "achievementPersonalId",
		dense_rank() over (
	order by
		eapt.id)-1 "parentKey"
	from
		evaluation_achievement_personal_sub_tbl eapst
	inner join evaluation_achievement_personal_tbl eapt on
		eapt.id = eapst.achievement_personal_id
	inner join evaluation_tbl et on
		et.id = eapt.evaluation_id
	where
		et.id =:id
		and type = 3 and et.company_group_code = :companyGroupCode
	order by
		eapt.id asc,
		coefficient desc) t  group by t."parentKey") t1;
------subListNew
select jsonb_agg(t1."subListNew") "subListNew" from
(select
	jsonb_agg( row_to_json(t)) "subListNew"
from
	(
	select
		row_number () over(
	order by
		eapt.id asc,
		coefficient desc) "key",
		eapst.evaluation_decision "evaluationDecision",
		eapst.coefficient::numeric(5,1)::varchar ,
		eapst.achievement_personal_id "achievementPersonalId",
    eapst.degree,
		dense_rank() over (
	order by
		eapt.id)-1 "parentKey"
	from
		evaluation_achievement_personal_sub_tbl eapst
	inner join evaluation_achievement_personal_tbl eapt on
		eapt.id = eapst.achievement_personal_id
	inner join evaluation_tbl et on
		et.id = eapt.evaluation_id
	where
		et.id =:id
		and type = 2 and et.company_group_code = :companyGroupCode
	order by
		eapt.id asc,
		coefficient desc) t  group by t."parentKey") t1;
	`, {
            nest: true,
            type: sequelize_1.QueryTypes.SELECT,
            replacements: { id: id, companyGroupCode: companyGroupCode },
        }));
        const evaluationList = dataList[0];
        const subsList = (await this.evaluationEntity.sequelize.query(`
------subList
select jsonb_agg(t1."subList") "subList" from
(select
	jsonb_agg( row_to_json(t)) "subList"
from
	(
	select
		row_number () over(
	order by
		eapt.id asc,
		coefficient desc) "key",
		eapst.evaluation_decision "evaluationDecision",
		eapst.coefficient::varchar ,
		eapst.achievement_personal_id "achievementPersonalId",
		dense_rank() over (
	order by
		eapt.id)-1 "parentKey"
	from
		evaluation_achievement_personal_sub_tbl eapst
	inner join evaluation_achievement_personal_tbl eapt on
		eapt.id = eapst.achievement_personal_id
	inner join evaluation_tbl et on
		et.id = eapt.evaluation_id
	where
		et.id =:id
		and type = 3
	order by
		eapt.id asc,
		coefficient desc) t  group by t."parentKey") t1;

	`, { nest: true, type: sequelize_1.QueryTypes.SELECT, replacements: { id: id } }))[0];
        const subList = subsList.subList;
        const subListNew = (await this.evaluationEntity.sequelize.query(`
------subListNew
select jsonb_agg(t1."subListNew") "subListNew" from
(select
	jsonb_agg( row_to_json(t)) "subListNew"
from
	(
	select
		row_number () over(
	order by
		eapt.id asc,
		coefficient desc) "key",
		eapst.evaluation_decision "evaluationDecision",
		eapst.coefficient::numeric(5,1)::varchar ,
		eapst.achievement_personal_id "achievementPersonalId",
    eapst.degree,
		dense_rank() over (
	order by
		eapt.id)-1 "parentKey"
	from
		evaluation_achievement_personal_sub_tbl eapst
	inner join evaluation_achievement_personal_tbl eapt on
		eapt.id = eapst.achievement_personal_id
	inner join evaluation_tbl et on
		et.id = eapt.evaluation_id
	where
		et.id =:id
		and type = 2
	order by
		eapt.id asc,
		coefficient desc) t  group by t."parentKey") t1;
	`, { nest: true, type: sequelize_1.QueryTypes.SELECT, replacements: { id: id } }))[0];
        const subListNews = subListNew.subListNew;
        const versionSettings = (await this.versionSettingEntity.sequelize.query(`select
	vst.id,
	vst."version",
	vst.sub_version "subVersion",
	vst.max_point_dep_result::varchar "maxPoint",
	vst.min_point_dep_result::varchar "minPoint",
	vst.max_point_result::varchar "maxPoint7",
	vst.min_point_result::varchar "minPoint7",
	vsap."arrayPoint" "settingAchievementPersonalType1",
	vsap2."arrayPoint" "settingAchievementPersonalType2",
	vsap3."arrayPoint" "settingAchievementPersonalType3s",
	vsap4."arrayPoint" "settingAchievementPersonalType4s",
	vsaa."arrayPoint" "settingAchievementAdditional",
	vsaa2."arrayPoint" "settingAchievementAdditional2s",
	vsf."arrayPoint" "settingFormula810",
	vspbbp."arrayPoint" "settingPointBasic",
	vspbbp."maxPoint" "pointBasicOptionMax",
	vspbbp2."arrayPoint" "settingPointBehavior",
	vst.basic_max_difficulty "basicMaxDifficulty",
	vspbbp3."arrayPoint" "settingPointPro",
	vspbbp3."maxPoint" "pointProOptionMax",
	vspfs."arraySettingSub" "settingProFormulas",
	vspfs."difficultyProMax"
from
	version_setting_tbl vst
left outer join v_setting_achievement_personal vsap on
	vst.id = vsap."versionId"
	and vsap."type" = 1
	and vsap."typeEvaluation" = 3
left outer join v_setting_achievement_personal vsap2 on
	vst.id = vsap2."versionId"
	and vsap2."type" = 2
	and vsap2."typeEvaluation" = 3
left outer join v_setting_achievement_personal vsap3 on
	vst.id = vsap3."versionId"
	and vsap3."type" = 1
	and vsap3."typeEvaluation" = 2
left outer join v_setting_achievement_personal vsap4 on
	vst.id = vsap4."versionId"
	and vsap4."type" = 2
	and vsap4."typeEvaluation" = 2
left outer join v_setting_achievement_additional vsaa on
	vsaa."versionId" = vst.id
	and vsaa."type" = 3
left outer join v_setting_formula_8_10 vsf on
	vsf."versionId" = vst.id
left outer join v_setting_achievement_additional vsaa2 on
	vsaa2."versionId" = vst.id
	and vsaa2."type" = 2
left outer join v_setting_point_basic_behavior_pro vspbbp on
	vspbbp."versionId" = vst.id
	and vspbbp."type" = 1
left outer join v_setting_point_basic_behavior_pro vspbbp2 on
	vspbbp2."versionId" = vst.id
	and vspbbp2."type" = 2
left outer join v_setting_point_basic_behavior_pro vspbbp3 on
	vspbbp3."versionId" = vst.id
	and vspbbp3."type" = 3
left outer join v_setting_pro_formula_sub vspfs on
	vspfs."versionId" =vst.id
where
	case
		when :flagSkill = 0 then vst.type = 4
		else vst.type = 2
	end
	and vst.status = 4
  and coalesce(vst.company_group_code,'') like coalesce(:companyGroupCode,vst.company_group_code,'');
`, {
            nest: true,
            replacements: {
                flagSkill: flagSkill,
                companyGroupCode: companyGroupCode,
            },
            type: sequelize_1.QueryTypes.SELECT,
        }));
        const versionSetting8 = versionSettings[0];
        const versionSetting7 = {
            id: versionSetting8.id,
            version: versionSetting8.version,
            subVersion: versionSetting8.subVersion,
            maxPoint: versionSetting8.maxPoint7,
            minPoint: versionSetting8.minPoint7,
            settingPointBasic: Array.isArray((_a = versionSetting8.settingPointBasic) === null || _a === void 0 ? void 0 : _a.sort((a, b) => Number(b.point) - Number(a.point)))
                ? [
                    ...(_b = versionSetting8.settingPointBasic) === null || _b === void 0 ? void 0 : _b.sort((a, b) => Number(b.point) - Number(a.point)),
                ]
                : [],
            settingPointPro: Array.isArray((_c = versionSetting8.settingPointPro) === null || _c === void 0 ? void 0 : _c.sort((a, b) => Number(b.point) - Number(a.point)))
                ? [
                    ...(_d = versionSetting8.settingPointPro) === null || _d === void 0 ? void 0 : _d.sort((a, b) => Number(b.point) - Number(a.point)),
                ]
                : [],
        };
        const settingProFormulas = versionSetting8.settingProFormulas;
        const settingPointBasicBehaviorPros = [
            Array.isArray((_e = versionSetting8.settingPointBasic) === null || _e === void 0 ? void 0 : _e.sort((a, b) => Number(b.point) - Number(a.point)))
                ? [
                    ...(_f = versionSetting8.settingPointBasic) === null || _f === void 0 ? void 0 : _f.sort((a, b) => Number(b.point) - Number(a.point)),
                ]
                : [],
            ...(_g = versionSetting8.settingPointBehavior) === null || _g === void 0 ? void 0 : _g.sort((a, b) => Number(b.point) - Number(a.point)),
            Array.isArray((_h = versionSetting8.settingPointPro) === null || _h === void 0 ? void 0 : _h.sort((a, b) => Number(b.point) - Number(a.point)))
                ? [
                    ...(_j = versionSetting8.settingPointPro) === null || _j === void 0 ? void 0 : _j.sort((a, b) => Number(b.point) - Number(a.point)),
                ]
                : [],
        ];
        const settingAchievementAdditional2s = versionSettings[0].settingAchievementAdditional2s || [];
        const settingAchievementPersonalType3s = versionSettings[0].settingAchievementPersonalType3s || [];
        const settingAchievementPersonalType4s = versionSettings[0].settingAchievementPersonalType4s || [];
        const difficultyProMax = versionSetting8.difficultyProMax;
        const pointProOptionMax = versionSetting8.pointProOptionMax;
        const pointBasicOptionMax = versionSetting8.pointBasicOptionMax;
        const basicMaxDifficulty = versionSetting8.basicMaxDifficulty;
        const maxPointProSkill = (difficultyProMax || 0) * (pointProOptionMax || 0);
        const maxPointBasicSkill = (basicMaxDifficulty || 0) * (pointBasicOptionMax || 0);
        return {
            evaluationList,
            subList,
            subListNews,
            versionSetting8,
            versionSetting7,
            settingProFormulas,
            maxPointProSkill,
            maxPointBasicSkill,
            settingPointBasicBehaviorPros: [...settingPointBasicBehaviorPros],
            settingAchievementPersonalType3: [...settingAchievementPersonalType3s],
            settingAchievementPersonalType4: [...settingAchievementPersonalType4s],
            settingAchievementAdditional2: [...settingAchievementAdditional2s],
        };
    }
    async getListBasicBehavior(level) {
        const listBasicBehaviors = await this.versionBasicBehaviorEntity.sequelize.query(`select
	content , difficulty, title, type
from
	(
	select
		*
	from
		version_basic_behavior_tbl vbbt
	where
		status = 4
		and type = 4
union
	select
		*
	from
		version_basic_behavior_tbl vbbt2
	where
		type in (5, 6)
		and level = :level) tmp
inner join list_basic_behavior_tbl as "list_basic_behavior_tbl->test" on tmp.id= "list_basic_behavior_tbl->test".version_id order by id_item ASC`, {
            replacements: { level: level },
            type: sequelize_1.QueryTypes.SELECT,
        });
        return listBasicBehaviors;
    }
    async getversionSettingForPDF() {
        return await this.versionSettingEntity.findOne({
            where: {
                type: 2,
                status: 4,
            },
            attributes: ['id', 'version', 'subVersion'],
            include: [
                {
                    model: SettingAchievementPersonal_1.SettingAchievementPersonal,
                    as: 'settingAchievementPersonal',
                    attributes: ['type', 'point'],
                },
                {
                    model: SettingAchievementAdditional_1.SettingAchievementAdditional,
                    as: 'settingAchievementAdditional',
                    attributes: ['rating', 'point'],
                },
                {
                    model: SettingFormula810_1.SettingFormula810,
                    as: 'settingFormula810',
                    attributes: ['point', 'result'],
                    order: ['point', 'DESC'],
                },
            ],
        });
    }
    async checkUserActiveBYPeriod(periodId, userId) {
        return await this.evaluatorDefault.findOne({
            where: { userId: userId, evaluationPeriodId: periodId },
            attributes: ['id'],
        });
    }
    async getInfoEvaluationMail(ids, status) {
        const sql = `SELECT 
                e.id, 
                e.status,
                e.level,
                e.division_name,
              u.full_name AS user_full_name,
                u.email AS user_email,
              ARRAY_AGG(DISTINCT u05.full_name) FILTER (WHERE u05.full_name IS NOT NULL) AS evaluator_full_name_05,
                ARRAY_AGG(DISTINCT u05.email) FILTER (WHERE u05.email IS NOT NULL) AS evaluator_email_05,
              ARRAY_AGG(DISTINCT u1.full_name) FILTER (WHERE u1.full_name IS NOT NULL) AS evaluator_full_name_1,
                ARRAY_AGG(DISTINCT u1.email) FILTER (WHERE u1.email IS NOT NULL) AS evaluator_email_1,
              ARRAY_AGG(DISTINCT u2.full_name) FILTER (WHERE u2.full_name IS NOT NULL) AS evaluator_full_name_2,
                ARRAY_AGG(DISTINCT u2.email) FILTER (WHERE u2.email IS NOT NULL) AS evaluator_email_2
            FROM evaluation_tbl e
            LEFT OUTER JOIN evaluator_tbl et ON e.id = et.evaluation_id
            LEFT JOIN user_tbl u ON e.user_id = u.id
            LEFT JOIN user_tbl u05 ON u05.id = et.evaluator_id AND et.evaluation_order = '0.5'
            LEFT JOIN user_tbl u1 ON u1.id = et.evaluator_id AND et.evaluation_order = '1.0'
            LEFT JOIN user_tbl u2 ON u2.id = et.evaluator_id AND et.evaluation_order = '2.0'
            WHERE e.status in (:status) and e.id in (:ids)
            GROUP BY e.id, u.full_name, u.email; `;
        return await this.evaluationEntity.sequelize.query(sql, {
            replacements: {
                ids: ids,
                status: status,
            },
        });
    }
    async updateEvaluationAchievementPersonal(dataSource, transaction) {
        const results = await this.evaluationAchievementPersonalEntity.bulkCreate(dataSource, { transaction: transaction });
        if (!results) {
            throw new RuntimeException_1.RuntimeException(`Unable to create evaluation achievement personal with data ${dataSource}`, 500);
        }
        else {
            const subData = dataSource.map((item) => {
                return item.evaluationAchievementPersonalSub;
            });
            const tempDatas = [];
            for (let i = 0; i < results.length; i++) {
                if (subData) {
                    Object.keys(subData[i]).forEach((j) => {
                        subData[i][j]['achievementPersonalId'] = results[i].id;
                        tempDatas.push(subData[i][j]);
                    });
                }
            }
            await this.evaluationAchievementPersonalSubEntity.bulkCreate(tempDatas, {
                transaction: transaction,
            });
        }
        return results;
    }
    async deleteEvaluationAchievementPersonal(evaluationId, transaction) {
        await this.evaluationAchievementPersonalSubEntity.destroy({
            where: { achievementPersonalId: { [sequelize_1.Op.is]: null } },
            transaction: transaction,
        });
        return await this.evaluationAchievementPersonalEntity.destroy({
            where: { evaluationId: evaluationId },
            transaction: transaction,
        });
    }
    async deleteAdditionAchievement(evaluationId, transaction) {
        return await this.evaluationAchievementAdditionalEntity.destroy({
            where: { evaluationId: evaluationId },
            transaction: transaction,
        });
    }
    async deleteEvaluationPro(evaluationId, transaction) {
        return await this.evaluationPro.destroy({
            where: { evaluationId: evaluationId },
            transaction: transaction,
        });
    }
    async deleteBasicBehavior(evaluationId) {
        return await this.evaluationBasicBehaviorEntity.destroy({
            where: { evaluationId: evaluationId },
        });
    }
    async deleteProSkill(evaluationId) {
        return await this.evaluationPro.destroy({
            where: { evaluationId: evaluationId },
        });
    }
    async updateEvaluationAdditionAchievement(values, transaction) {
        return await this.evaluationAchievementAdditionalEntity.bulkCreate(values, {
            transaction: transaction,
        });
    }
    async updateEvaluationPro(values, transaction) {
        return await this.evaluationPro.bulkCreate(values, {
            transaction: transaction,
        });
    }
    async updateEvaluationWithoutTransaction(datas, condition) {
        return await this.evaluationEntity.update(datas, { where: condition });
    }
    async updateEvaluation(values, id, transaction) {
        return await this.evaluationEntity.update(values, {
            where: { id: id },
            transaction: transaction,
        });
    }
    async getEvaluationUserById(id) {
        return await this.evaluationEntity.findOne({
            where: { id: id },
            attributes: [
                'id',
                'departmentName',
                'divisionName',
                'companyName',
                'periodStart',
                'periodEnd',
                'status',
                'level',
                'title',
                'summaryPointEvaluator2',
                'percentPoint',
                'commentUser',
                'skillPercent',
                'behaviorPercent',
                'achievementPercent',
                'basicProTotalPointUser',
                'basicProTotalPointEvaluator05',
                'basicProTotalPointEvaluator1',
                'basicProTotalPointEvaluator2',
                'behaviorTotalPointUser',
                'behaviorTotalPointEvaluator05',
                'behaviorTotalPointEvaluator1',
                'behaviorTotalPointEvaluator2',
                'achievementPersonalTotalPointUser',
                'achievementPersonalTotalPointEvaluator05',
                'achievementPersonalTotalPointEvaluator1',
                'achievementPersonalTotalPointEvaluator2',
                'achievementAdditionalTotalPointUser',
                'achievementAdditionalTotalPointEvaluator05',
                'achievementAdditionalTotalPointEvaluator1',
                'achievementAdditionalTotalPointEvaluator2',
                'summaryPointUser',
                'summaryPointEvaluator05',
                'summaryPointEvaluator1',
                'summaryPointEvaluator2',
                'summaryCharPointUser',
                'summaryCharPointEvaluator05',
                'summaryCharPointEvaluator1',
                'summaryCharPointEvaluator2',
            ],
            include: [
                { model: User_1.User, attributes: ['employeeNumber', 'fullName'], as: 'user' },
                {
                    model: Evaluator_1.Evaluator,
                    attributes: ['evaluationOrder', 'commentPublic', 'evaluatorId'],
                    as: 'evaluator',
                    include: [{ model: User_1.User, attributes: ['id', 'fullName'] }],
                },
                {
                    model: EvaluationAchievementPersonal_1.EvaluationAchievementPersonal,
                    as: 'evaluationAchievementPersonals',
                    order: [['itemNo', 'ASC']],
                    attributes: { exclude: ['createdTime', 'updatedTime'] },
                },
                {
                    model: EvaluationAchievementAdditional_1.EvaluationAchievementAdditional,
                    as: 'evaluationAchievementAdditional',
                    order: [['itemNo', 'ASC']],
                    attributes: { exclude: ['createdTime', 'updatedTime'] },
                },
            ],
        });
    }
    async getDataPDF8_10(id, userId, isEvaluatorUser, companyGroupCode) {
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
            'achievementPersonalTotalPointUser',
            SDT.ACHIEVEMENT_PERSONAL_TOTAL_POINT_USER,
            'achievementPersonalTotalPointEvaluator05',
            SDT.ACHIEVEMENT_PERSONAL_TOTAL_POINT_EVALUATOR_0_5,
            'achievementPersonalTotalPointEvaluator1',
            SDT.ACHIEVEMENT_PERSONAL_TOTAL_POINT_EVALUATOR_1,
            'achievementPersonalTotalPointEvaluator2',
            SDT.ACHIEVEMENT_PERSONAL_TOTAL_POINT_EVALUATOR_2,
            'achievementAdditionalTotalPointUser',
            SDT.ACHIEVEMENT_ADDITIONAL_TOTAL_POINT_USER,
            'achievementAdditionalTotalPointEvaluator05',
            SDT.ACHIEVEMENT_ADDITIONAL_TOTAL_POINT_EVALUATOR_0_5,
            'achievementAdditionalTotalPointEvaluator1',
            SDT.ACHIEVEMENT_ADDITIONAL_TOTAL_POINT_EVALUATOR_1,
            'achievementAdditionalTotalPointEvaluator2',
            SDT.ACHIEVEMENT_ADDITIONAL_TOTAL_POINT_EVALUATOR_2,
            'summaryPointUser',
            SDT.SUMMARY_POINT_USER::numeric(5,1)::varchar,
            'summaryPointEvaluator05',
            SDT.SUMMARY_POINT_EVALUATOR_0_5::numeric(5,1)::varchar,
            'summaryPointEvaluator1',
            SDT.SUMMARY_POINT_EVALUATOR_1::numeric(5,1)::varchar,
            'summaryPointEvaluator2',
            SDT.SUMMARY_POINT_EVALUATOR_2::numeric(5,1)::varchar,
            'summaryCharPointUser',
            SDT.SUMMARY_CHAR_POINT_USER,
            'summaryCharPointEvaluator05',
            SDT.SUMMARY_CHAR_POINT_EVALUATOR_0_5,
            'summaryCharPointEvaluator1',
            SDT.SUMMARY_CHAR_POINT_EVALUATOR_1,
            'summaryCharPointEvaluator2',
            SDT.SUMMARY_CHAR_POINT_EVALUATOR_2
          )
        FROM
          SUMMARY_DEPARTMENT_TBL SDT
        WHERE
          SDT.EVALUATION_ID = "Evaluation"."id"
      ) AS "summaryDepartment",

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
              AND VBBT.TYPE = 4
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
              AND VBBT.TYPE IN (5, 6)
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
        const evaluationDetail = await this.evaluationEntity.sequelize.query(sql, {
            nest: true,
            replacements: {
                id: id,
                userId: userId,
                isEvaluatorUser: isEvaluatorUser,
                companyGroupCode: companyGroupCode,
            },
            logging: false,
        });
        return {
            evaluations: evaluationDetail,
        };
    }
    async getSubListByAchievementPersonalId(tempList) {
        let subList = [];
        const idList = tempList.map((value) => {
            return value.id;
        });
        if (idList) {
            subList = await this.evaluationAchievementPersonalSubEntity.findAll({
                where: { achievementPersonalId: { [sequelize_1.Op.in]: idList } },
                attributes: [
                    'achievementPersonalId',
                    'coefficient',
                    'evaluationDecision',
                ],
                order: [['coefficient', 'DESC']],
            });
        }
        return subList;
    }
    async getEvaluationUserByListId(ids) {
        return await this.evaluationEntity.findAll({
            where: { id: ids },
            attributes: [
                'id',
                'title',
                'departmentName',
                'divisionName',
                'companyName',
                'periodStart',
                'periodEnd',
                'status',
                'level',
                'summaryPointEvaluator2',
                'percentPoint',
                'commentUser',
                'skillPercent',
                'behaviorPercent',
                'achievementPercent',
                'basicProTotalPointUser',
                'basicProTotalPointEvaluator05',
                'basicProTotalPointEvaluator1',
                'basicProTotalPointEvaluator2',
                'behaviorTotalPointUser',
                'behaviorTotalPointEvaluator05',
                'behaviorTotalPointEvaluator1',
                'behaviorTotalPointEvaluator2',
                'achievementPersonalTotalPointUser',
                'achievementPersonalTotalPointEvaluator05',
                'achievementPersonalTotalPointEvaluator1',
                'achievementPersonalTotalPointEvaluator2',
                'summaryCharPointUser',
                'summaryCharPointEvaluator2',
                'achievementAdditionalTotalPointEvaluator2',
            ],
            include: [
                { model: User_1.User, attributes: ['employeeNumber', 'fullName'], as: 'user' },
                {
                    model: Evaluator_1.Evaluator,
                    attributes: ['evaluationOrder', 'commentPublic'],
                    as: 'evaluator',
                    include: [{ model: User_1.User, attributes: ['id', 'fullName'] }],
                },
                {
                    model: EvaluationAchievementPersonal_1.EvaluationAchievementPersonal,
                    as: 'evaluationAchievementPersonals',
                    order: [['itemNo', 'ASC']],
                    attributes: { exclude: ['createdTime', 'updatedTime'] },
                },
                {
                    model: EvaluationAchievementAdditional_1.EvaluationAchievementAdditional,
                    as: 'evaluationAchievementAdditional',
                    order: [['itemNo', 'ASC']],
                    attributes: { exclude: ['createdTime', 'updatedTime'] },
                },
            ],
        });
    }
    async getGuideEvaluationByEvaluationId(id) {
        return await this.evaluationEntity.findOne({
            where: {
                id: id,
            },
            attributes: ['title', 'level'],
            include: [
                {
                    model: VersionGuideEvaluation_1.VersionGuideEvaluation,
                    attributes: ['contentEvaluationCriteria', 'contentNotes'],
                },
            ],
        });
    }
    async updateEvaluatorComment(content, evaluationId, evaluationOrder, transaction) {
        return await this.evaluatorentity.update(content, {
            where: {
                evaluationId: evaluationId,
                evaluationOrder: evaluationOrder,
            },
            transaction: transaction,
        });
    }
    async createHistoryApproveReject(content, transaction) {
        const results = await this.historyApproveEvaluation.create(content, {
            transaction: transaction,
        });
        if (!results) {
            throw new RuntimeException_1.RuntimeException(`Unable to create history with data ${content}`, 500);
        }
        return results;
    }
    async getDepartmentName(id) {
        const result = await this.departmententity.findOne({
            where: { id: id },
            attributes: ['code', 'name', 'type', 'class', 'active'],
        });
        return result;
    }
    async getUpdateTime(id) {
        const result = await this.evaluationEntity.findOne({
            where: { id: id },
            attributes: [
                'id',
                'status',
                'updatedTime',
                'level',
                'summaryCharPointUser',
                'summaryCharPointEvaluator05',
                'summaryCharPointEvaluator1',
                'summaryCharPointEvaluator2',
                'userId',
                'flagSkill',
            ],
            include: [
                {
                    model: EvaluationPeriod_1.EvaluationPeriod,
                    as: 'evaluationPeriod',
                },
                {
                    model: Evaluator_1.Evaluator,
                    as: 'evaluator',
                },
            ],
        });
        return result;
    }
    async createDepartmentGoals(data, transaction) {
        const arrays = [];
        for (let index = 0; index < data.length; index++) {
            await this.evaluationEntity
                .findOrCreate({
                where: {
                    title: data[index].title,
                    userId: data[index].userId,
                },
                defaults: {
                    title: data[index].title,
                    userId: data[index].userId,
                    departmentName: data[index].departmentName,
                    divisionName: data[index].divisionName,
                    companyName: data[index].companyName,
                    periodStart: data[index].periodStart,
                    periodEnd: data[index].periodEnd,
                    status: 0,
                    level: data[index].level,
                    evaluationPeriodId: data[index].evaluationPeriodId,
                    guideVersionId: data[index].guideVersionId,
                    creationUser: null,
                    createdByCronjob: data[index].createdByCronjob,
                    skillPercent: data[index].skillPercent,
                    achievementPercent: data[index].achievementPercent,
                    behaviorPercent: data[index].behaviorPercent,
                    flagSkill: data[index].flagSkill,
                    companyGroupCode: data[index].companyGroupCode,
                    departmentId: data[index].departmentId,
                    divisionId: data[index].divisionId,
                },
                transaction: transaction,
                returning: true,
            })
                .then(async (value) => {
                let listSkillUsers = [];
                const userInfor = await this.userEntity.findOne({
                    attributes: ['id', 'departmentId', 'divisionId', 'flagSkill'],
                    where: {
                        id: value[0].userId,
                    },
                });
                if ((userInfor === null || userInfor === void 0 ? void 0 : userInfor.flagSkill) === 1) {
                    const userId = userInfor === null || userInfor === void 0 ? void 0 : userInfor.id;
                    const listSkills = await this.skillUserEntity.findAll({
                        attributes: ['skillId'],
                        where: {
                            [sequelize_1.Op.and]: [
                                { userId: userId },
                                { periodId: value[0].evaluationPeriodId },
                                { type: 0 },
                                { evaluationId: { [sequelize_1.Op.is]: null } },
                            ],
                        },
                    });
                    if (listSkills.length > 0) {
                        for (let i = 0; i < listSkills.length; i++) {
                            const element = listSkills[i];
                            listSkillUsers.push({
                                userId: userId,
                                skillId: element.skillId,
                                periodId: value[0].evaluationPeriodId,
                                evaluationId: value[0].id,
                                type: 0,
                            });
                        }
                    }
                    await this.skillUserEntity.bulkCreate(listSkillUsers, {
                        transaction: transaction,
                    });
                }
                arrays.push({
                    userId: value[0].userId,
                    id: value[0].id,
                    level: value[0].level,
                    flagSkill: value[0].flagSkill,
                    departmentName: value[0].departmentName,
                    divisionName: value[0].divisionName,
                    departmentId: value[0].departmentId,
                    divisionId: value[0].divisionId,
                    companyGroupCode: value[0].companyGroupCode,
                });
            });
        }
        return arrays;
    }
    async createPersonalGoals(data, transaction) {
        const arrays = [];
        for (let index = 0; index < data.length; index++) {
            await this.evaluationEntity
                .findOrCreate({
                where: {
                    title: data[index].title,
                    userId: data[index].userId,
                },
                defaults: {
                    title: data[index].title,
                    userId: data[index].userId,
                    departmentName: data[index].departmentName,
                    divisionName: data[index].divisionName,
                    companyName: data[index].companyName,
                    periodStart: data[index].periodStart,
                    periodEnd: data[index].periodEnd,
                    status: 0,
                    level: data[index].level,
                    evaluationPeriodId: data[index].evaluationPeriodId,
                    guideVersionId: data[index].guideVersionId,
                    creationUser: null,
                    skillPercent: data[index].skillPercent,
                    achievementPercent: data[index].achievementPercent,
                    behaviorPercent: data[index].behaviorPercent,
                    createdByCronjob: data[index].createdByCronjob,
                    flagSkill: data[index].flagSkill,
                    companyGroupCode: data[index].companyGroupCode,
                    departmentId: data[index].departmentId,
                    divisionId: data[index].divisionId,
                },
                transaction: transaction,
                returning: true,
            })
                .then(async (value) => {
                let listSkillUsers = [];
                const userInfor = await this.userEntity.findOne({
                    attributes: [
                        'id',
                        'departmentId',
                        'divisionId',
                        'flagSkill',
                        'companyGroupCode',
                    ],
                    where: {
                        id: value[0].userId,
                    },
                });
                if ((userInfor === null || userInfor === void 0 ? void 0 : userInfor.flagSkill) === 1) {
                    const userId = userInfor.id;
                    const listSkills = await this.skillUserEntity.findAll({
                        attributes: ['skillId'],
                        where: {
                            [sequelize_1.Op.and]: [
                                { userId: userId },
                                { periodId: value[0].evaluationPeriodId },
                                { type: 0 },
                                { evaluationId: { [sequelize_1.Op.is]: null } },
                            ],
                        },
                    });
                    if (listSkills.length > 0) {
                        for (let i = 0; i < listSkills.length; i++) {
                            const element = listSkills[i];
                            listSkillUsers.push({
                                userId: userId,
                                skillId: element.skillId,
                                periodId: value[0].evaluationPeriodId,
                                evaluationId: value[0].id,
                                type: 0,
                            });
                        }
                    }
                    await this.skillUserEntity.bulkCreate(listSkillUsers, {
                        transaction: transaction,
                    });
                }
                arrays.push({
                    userId: value[0].userId,
                    id: value[0].id,
                    level: value[0].level,
                    flagSkill: value[0].flagSkill,
                    departmentName: value[0].departmentName,
                    divisionName: value[0].divisionName,
                    companyGroupCode: value[0].companyGroupCode,
                    departmentId: value[0].departmentId,
                    divisionId: value[0].divisionId,
                });
            });
        }
        return arrays;
    }
    async createEvaluation17(data) {
        return await this.evaluationEntity.findOrCreate({
            where: {
                title: data.title,
                userId: data.userId,
            },
            defaults: data,
            returning: true,
        });
    }
    async createEvaluation810(data) {
        return await this.evaluationEntity.findOrCreate({
            where: {
                title: data.title,
                userId: data.userId,
            },
            defaults: data,
            returning: true,
        });
    }
    async listEvaluationByPeriod(periodId, level) {
        return await this.evaluationEntity.findAll({
            where: {
                [sequelize_1.Op.and]: [
                    { evaluationPeriodId: periodId },
                    {
                        level: {
                            [sequelize_1.Op.in]: level,
                        },
                    },
                    {
                        creationUser: null,
                    },
                ],
            },
            include: [
                {
                    model: User_1.User,
                    as: 'user',
                    where: {
                        active: 1,
                    },
                    include: [
                        {
                            model: Permission_1.Permission,
                            as: 'permissions',
                            where: { roleId: { [sequelize_1.Op.in]: [1, 2] } },
                        },
                    ],
                },
                {
                    model: Evaluator_1.Evaluator,
                    as: 'evaluator',
                    include: [
                        {
                            model: User_1.User,
                            as: 'user',
                            where: {
                                active: 1,
                            },
                            include: [
                                {
                                    model: Permission_1.Permission,
                                    as: 'permissions',
                                    where: { roleId: { [sequelize_1.Op.in]: [1, 2] } },
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    }
    async updateHistoryMail(data, companyGroupCode, transaction) {
        const mailData = {
            mailTo: data.toEmails,
            title: data.mailContent.subject,
            contentMail: data.mailContent.editor,
            status: data.status,
            type: data.emailType,
            evaluationPeriodId: data.evaluationPeriodId,
            evaluationTime: data.evaluationTime,
            evaluationDepartmentTime: data.evaluationDepartmentTime,
            sendTimeActual: data.sendTimeActual,
            companyGroupCode: companyGroupCode,
        };
        if (data.ccMails) {
            mailData.mailCC = data.ccMails;
        }
        return await this.historyMailEntity.create(mailData, { transaction });
    }
    async updateHistoryMailNotFixed(data, transaction) {
        return await this.historyMailEntity.create({
            mailTo: data.toEmails,
            title: data.title,
            contentMail: data.content,
            status: data.status,
            type: data.emailType,
            evaluationPeriodId: data.evaluationPeriodId,
            sendTimeActual: data.sendTimeActual,
            companyGroupCode: data.companyGroupCode,
        }, { transaction: transaction });
    }
    async updateGoalCreationTime(id, emailType, type, date, dateDepartment, transaction) {
        if (type === 'fixedGoal' && emailType == 2) {
            return await this.evaluationPeriodEntity.update({
                dateCreationGoalStart: date[0],
                dateCreationGoalEnd: date[1],
                dateCreationGoalDepartmentStart: dateDepartment[0],
                dateCreationGoalDepartmentEnd: dateDepartment[1],
            }, {
                where: { id },
                transaction: transaction,
            });
        }
        else if (type === 'fixedEvaluation' && emailType == 4) {
            return await this.evaluationPeriodEntity.update({
                dateEvaluationStart: date[0],
                dateEvaluationEnd: date[1],
                dateEvaluationDepartmentStart: dateDepartment[0],
                dateEvaluationDepartmentEnd: dateDepartment[1],
            }, {
                where: { id },
                transaction: transaction,
            });
        }
    }
    async getAllEvalNotFixedGoalPeriodByPeriod(year, period_index, day, companyGroupCode) {
        const datas = await this.evaluationEntity.sequelize.query(`
        SELECT
          ev.id, 
          ev.status, 
          ev.level,
          ev.division_name,
          us.email as user_email,
          us.full_name as user_full_name, 
          ev.creation_user, 
          ev.date_creation_goal_end as exception_date_goal_end,
          ep.date_creation_goal_end as common_17_date_goal_end,
          ep.date_creation_goal_department_end as common_810_date_goal_end,
          ep.year,
          ep.period_index,
          u1.email as evaluator_05_email,
          u1.full_name as evaluator_05_full_name,
          u2.email as evaluator_1_email,
          u2.full_name as evaluator_1_full_name,
          u3.email as evaluator_2_email,
          u3.full_name as evaluator_2_full_name
        FROM public.evaluation_tbl ev
        LEFT JOIN public.evaluation_period_tbl ep
          ON ev.evaluation_period_id = ep.id
        LEFT JOIN public.user_tbl us ON ev.user_id = us.id
        LEFT JOIN evaluator_tbl t1 ON t1.evaluation_id = ev.id and t1.evaluation_order = 0.5
        LEFT JOIN user_tbl u1 ON t1.evaluator_id = u1.id
        LEFT JOIN evaluator_tbl t2 ON t2.evaluation_id = ev.id and t2.evaluation_order = 1.0
        LEFT JOIN user_tbl u2 ON t2.evaluator_id = u2.id
        LEFT JOIN evaluator_tbl t3 ON t3.evaluation_id = ev.id and t3.evaluation_order = 2.0
        LEFT JOIN user_tbl u3 ON t3.evaluator_id = u3.id
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
          AND ep.year = :year AND ep.period_index = :period_index
          AND us.active = 1
          AND ev.company_group_code = :companyGroupCode
      `, {
            replacements: {
                year: year,
                period_index: period_index,
                day: day,
                companyGroupCode: companyGroupCode,
            },
        });
        return datas;
    }
    async getAllEvalNotFixedEvalPeriodByPeriod(year, period_index, day, companyGroupCode) {
        const datas = await this.evaluationEntity.sequelize.query(`
        SELECT
          ev.id, 
          ev.status, 
          ev.level,
          ev.division_name,
          us.email as user_email,
          us.full_name as user_full_name, 
          ev.creation_user, 
          ev.date_evaluation_end as exception_date_eval_end,
          ep.date_evaluation_end as common_17_date_eval_end,
          ep.date_evaluation_department_end as common_810_date_eval_end,
          ep.year,
          ep.period_index,
          u1.email as evaluator_05_email,
          u1.full_name as evaluator_05_full_name,
          u2.email as evaluator_1_email,
          u2.full_name as evaluator_1_full_name,
          u3.email as evaluator_2_email,
          u3.full_name as evaluator_2_full_name
        FROM public.evaluation_tbl ev
        LEFT JOIN public.evaluation_period_tbl ep
          ON ev.evaluation_period_id = ep.id
        LEFT JOIN public.user_tbl us ON ev.user_id = us.id
        LEFT JOIN evaluator_tbl t1 ON t1.evaluation_id = ev.id and t1.evaluation_order = 0.5
        LEFT JOIN user_tbl u1 ON t1.evaluator_id = u1.id
        LEFT JOIN evaluator_tbl t2 ON t2.evaluation_id = ev.id and t2.evaluation_order = 1.0
        LEFT JOIN user_tbl u2 ON t2.evaluator_id = u2.id
        LEFT JOIN evaluator_tbl t3 ON t3.evaluation_id = ev.id and t3.evaluation_order = 2.0
        LEFT JOIN user_tbl u3 ON t3.evaluator_id = u3.id
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
          AND ep.year = :year AND ep.period_index = :period_index
          AND us.active = 1
          AND ev.company_group_code = :companyGroupCode
    `, {
            replacements: {
                year: year,
                period_index: period_index,
                day: day,
                companyGroupCode: companyGroupCode,
            },
        });
        return datas;
    }
    async updateEvaluationBasicBehaviorSkill(evaluationId, transaction, listBehaviors) {
        await this.evaluationBasicBehaviorEntity.destroy({
            where: { evaluationId },
            transaction: transaction,
        });
        const basicBehaviors = [];
        for (let index = 0; index < listBehaviors.length; index++) {
            basicBehaviors.push({
                evaluationId: evaluationId,
                itemNo: listBehaviors[index].itemNo,
                type: listBehaviors[index].versionBasicBehavior.type,
                itemTitle: listBehaviors[index].title,
                content: listBehaviors[index].content,
                difficulty: listBehaviors[index].difficulty,
                pointUser: listBehaviors[index].pointUser,
                pointEvaluator05: listBehaviors[index].pointEvaluator05,
                pointEvaluator1: listBehaviors[index].pointEvaluator1,
                pointEvaluator2: listBehaviors[index].pointEvaluator2,
            });
        }
        return await this.evaluationBasicBehaviorEntity.bulkCreate(basicBehaviors, {
            transaction: transaction,
        });
    }
    async getAllDepartmentEvaluation(query, companyGroupCode) {
        const datas = await this.evaluationEntity.sequelize.query(`SELECT 
    name, 
    code, 
    type,
    department_id,
    division_id
FROM (
    -- NHÁNH 1: LẤY DEPARTMENT (TYPE 0)
    SELECT
        et.department_name AS name,
        et.department_name AS code,
        0 AS type,
        dm.id AS department_id,         -- ID phòng ban từ department_tbl
        dst.division_id AS division_id   -- ID bộ phận tương ứng từ bảng mapping
    FROM evaluation_tbl et
    INNER JOIN evaluation_period_tbl ept 
        ON et.evaluation_period_id = ept.id 
       AND ept.year = :year 
       AND ept.period_index = :periodIndex
    -- Bước 1: Từ bản ghi evaluation, lấy ra ID của Department
    INNER JOIN department_tbl dm 
        ON et.department_name = dm.name
    -- Bước 2: Từ ID Department, tra ra ID Division cha
    INNER JOIN division_subClass_tbl dst 
        ON dm.id = dst.department_id
    WHERE et.department_name IS NOT NULL 
      AND et.department_name <> ''
      AND et.company_group_code LIKE :companyGroupCode
    GROUP BY 
        et.department_name, 
        dm.id, 
        dst.division_id

    UNION ALL -- Dùng UNION ALL để tối ưu tốc độ hơn UNION

    -- NHÁNH 2: LẤY DIVISION (TYPE 1)
    SELECT
        et.division_name AS name,
        et.division_name AS code,
        1 AS type,
        NULL AS department_id,          -- Để NULL vì dòng này đại diện cho cả Division
        vm.id AS division_id            -- ID bộ phận từ department_tbl
    FROM evaluation_tbl et
    INNER JOIN evaluation_period_tbl ept 
        ON et.evaluation_period_id = ept.id 
       AND ept.year = :year 
       AND ept.period_index = :periodIndex
    -- Đi từ division_name để lấy ra ID của Division
    INNER JOIN department_tbl vm 
        ON et.division_name = vm.name
    WHERE et.division_name IS NOT NULL 
      AND et.division_name <> ''
      AND et.company_group_code LIKE :companyGroupCode
      -- Kiểm tra xem Division này có tồn tại trong bảng mapping không
      AND EXISTS (
          SELECT 1 
          FROM division_subClass_tbl dst 
          WHERE vm.id = dst.division_id
      )
    GROUP BY 
        et.division_name, 
        vm.id
) TMP 
ORDER BY name ASC;`, {
            replacements: {
                year: query.year.toString(),
                periodIndex: query.periodIndex,
                companyGroupCode: companyGroupCode,
            },
        });
        let results = [];
        if (datas[0] && datas[0].length > 0) {
            results = await this.groupDataByDivision(datas[0]);
        }
        return results;
    }
    async getAllDepartmentEvaluationDefault(query, companyGroupCode) {
        const datas = await this.evaluationEntity.sequelize.query(`select
	distinct(name)
from
	(
	select
		distinct(department_name) "name",
		department_name code,
		0 as type,
		ept.company_group_code
	from
		evaluation_tbl et
	inner join evaluation_period_tbl ept on
		evaluation_period_id = ept.id
		and year =:year
		and period_index =:periodIndex
	where
		department_name is not null and department_name <> ''
	group by
		department_name,
		ept.company_group_code
union
	select
		distinct(division_name) "name",
		division_name code,
		1 as type,
		ept.company_group_code
	from
		evaluation_tbl et
	inner join evaluation_period_tbl ept on
		evaluation_period_id = ept.id
		and year =:year
		and period_index =:periodIndex
	where
		division_name is not null and division_name <> ''
	group by
		division_name,
		ept.company_group_code
union
	select
		distinct( case when level<8 then department_name else division_name end)  "name",
		department_name code,
		2 as type,
		ept2.company_group_code
	from
		evaluator_default_tbl edt
	inner join evaluation_period_tbl ept2 on
		evaluation_period_id = ept2.id
		and year =:year
		and period_index =:periodIndex
union
	select name, name code, type ,company_group_code from department_tbl dt
  where dt.active = 1 and dt.id not in 
  (select department_id from history_update_department_tbl where year = :year and period_index =:periodIndex 
  )
union
  select 
    distinct(hdt.department_name) "name",
    hdt.department_name code,
    hdt.type,
	hdt.company_group_code
  from history_update_department_tbl hdt
  inner join department_tbl d on d.id = hdt.department_id
  where year = :year and period_index =:periodIndex and d.active = 1
  
  ) as TMP where company_group_code= :companyGroupCode
group by
	name, company_group_code
  order by name ASC
`, {
            replacements: {
                year: query.year.toString(),
                periodIndex: query.periodIndex,
                companyGroupCode: companyGroupCode,
            },
            logging: false,
        });
        return datas[0];
    }
    async listEvaluator(evaluationId) {
        return await this.evaluatorentity
            .findAll({
            where: { evaluationId: evaluationId },
            order: [['evaluationOrder', 'ASC']],
        })
            .then((evaluator) => {
            return evaluator.map((v) => v.evaluationOrder);
        });
    }
    async getProfessionalExpertiseDetail(userId, yearStart, yearEnd, companyGroupCode, evaluationPeriodId) {
        return await this.evaluationPeriodEntity.findAll({
            attributes: [
                'id',
                'year',
                'periodIndex',
                'periodStart',
                'periodEnd',
                'companyGroupCode',
            ],
            where: {
                [sequelize_1.Op.and]: [
                    {
                        year: {
                            [sequelize_1.Op.between]: [yearStart, yearEnd],
                        },
                    },
                    {
                        companyGroupCode: companyGroupCode,
                    },
                    {
                        id: {
                            [sequelize_1.Op.lte]: evaluationPeriodId,
                        },
                    },
                ],
            },
            include: [
                {
                    model: Evaluation_1.Evaluation,
                    attributes: ['id', 'userId', 'status'],
                    as: 'evaluations',
                    where: {
                        [sequelize_1.Op.and]: [{ status: 100 }, { userId: userId }],
                    },
                    include: [
                        {
                            model: EvaluationPro_1.EvaluationPro,
                            attributes: [
                                'evaluationId',
                                'jobType',
                                'itemId',
                                'itemTitle',
                                'difficulty',
                                'pointEvaluator2',
                            ],
                            where: {
                                isDisable: false,
                            },
                        },
                    ],
                },
            ],
        });
    }
    async groupDataByDivision(data) {
        const divisionMap = {};
        data.forEach((item) => {
            const divId = item.division_id;
            if (!divisionMap[divId]) {
                divisionMap[divId] = {
                    name: '',
                    code: '',
                    division_id: divId,
                    type: null,
                    children: [],
                };
            }
            if (item.type === 1) {
                divisionMap[divId].name = item.name;
                divisionMap[divId].code = item.code;
                divisionMap[divId].type = item.type;
            }
            else if (item.type === 0) {
                divisionMap[divId].children.push({
                    name: item.name,
                    code: item.code,
                    value: `${item.name}: ${item.type}`,
                    type: item.type,
                });
            }
        });
        const result = Object.values(divisionMap);
        result.forEach((division) => {
            if (division.children && division.children.length > 0) {
                division.children.unshift({
                    type: -1,
                    code: '',
                    name: 'すべて',
                    value: 'すべて',
                });
            }
        });
        return result;
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION),
    __metadata("design:type", Object)
], EvaluationRepository.prototype, "evaluationEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_ACHIEVEMENT_PERSONAL),
    __metadata("design:type", Object)
], EvaluationRepository.prototype, "evaluationAchievementPersonalEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_ACHIEVEMENT_PERSONAL_SUB),
    __metadata("design:type", Object)
], EvaluationRepository.prototype, "evaluationAchievementPersonalSubEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_ACHIEVEMENT_ADDITIONAL),
    __metadata("design:type", Object)
], EvaluationRepository.prototype, "evaluationAchievementAdditionalEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_BASIC_BEHAVIOR),
    __metadata("design:type", Object)
], EvaluationRepository.prototype, "evaluationBasicBehaviorEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_PRO),
    __metadata("design:type", Object)
], EvaluationRepository.prototype, "evaluationPro", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATOR),
    __metadata("design:type", Object)
], EvaluationRepository.prototype, "evaluatorentity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.HISTORY_APPROVE_EVALUATION),
    __metadata("design:type", Object)
], EvaluationRepository.prototype, "historyApproveEvaluation", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.DEPARTMENT),
    __metadata("design:type", Object)
], EvaluationRepository.prototype, "departmententity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.VERSION_SETTING),
    __metadata("design:type", Object)
], EvaluationRepository.prototype, "versionSettingEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.HISTORY_MAIL),
    __metadata("design:type", Object)
], EvaluationRepository.prototype, "historyMailEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_PERIOD),
    __metadata("design:type", Object)
], EvaluationRepository.prototype, "evaluationPeriodEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATOR_DEFAULT),
    __metadata("design:type", Object)
], EvaluationRepository.prototype, "evaluatorDefault", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.VERSION_BASIC_BEHAVIOR),
    __metadata("design:type", Object)
], EvaluationRepository.prototype, "versionBasicBehaviorEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.USER),
    __metadata("design:type", Object)
], EvaluationRepository.prototype, "userEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SKILL_GROUP),
    __metadata("design:type", Object)
], EvaluationRepository.prototype, "skillGroupEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SKILL_USER_ENTITY),
    __metadata("design:type", Object)
], EvaluationRepository.prototype, "skillUserEntity", void 0);
EvaluationRepository = __decorate([
    (0, common_1.Injectable)()
], EvaluationRepository);
exports.EvaluationRepository = EvaluationRepository;
//# sourceMappingURL=evaluation.repository.js.map