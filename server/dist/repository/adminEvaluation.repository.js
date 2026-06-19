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
exports.AdminEvaluationRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const EntityConstant_1 = require("../constant/EntityConstant");
const Company_1 = require("../entity/Company");
const Department_1 = require("../entity/Department");
const EvaluationPeriod_1 = require("../entity/EvaluationPeriod");
const Evaluator_1 = require("../entity/Evaluator");
const User_1 = require("../entity/User");
const statusEvaluation_1 = require("../constant/statusEvaluation");
const sequelize_typescript_1 = require("sequelize-typescript");
const SkillRole_1 = require("../entity/SkillRole");
const SkillGroup_1 = require("../entity/SkillGroup");
const DivisionSubclass_1 = require("../entity/DivisionSubclass");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const TypeAchievement_1 = require("../enum/TypeAchievement");
const moment = require("moment");
let AdminEvaluationRepository = class AdminEvaluationRepository {
    async getListEvaluationConfirm(body, companyGroupCode) {
        const { periodId } = body;
        await this.evaluationPeriodRepository.update({
            checkFixed: 0,
        }, {
            where: { id: periodId },
        });
        return await this.evaluationRepository.findAll({
            attributes: [
                'id',
                'userId',
                'evaluationPeriodId',
                'status',
                'divisionId',
            ],
            where: {
                [sequelize_1.Op.and]: [
                    { status: { [sequelize_1.Op.lte]: 49 } },
                    { evaluationPeriodId: periodId },
                    { companyGroupCode: companyGroupCode },
                ],
            },
        });
    }
    async getuserInfo(userId) {
        return await this.userRepository.findOne({
            attributes: [],
            where: {
                id: userId,
            },
            include: [
                {
                    attributes: ['code', 'name', 'type'],
                    model: Department_1.Department,
                    as: 'department',
                },
                {
                    attributes: ['code', 'name', 'type'],
                    model: Department_1.Department,
                    as: 'division',
                },
                {
                    model: Company_1.Company,
                },
            ],
        });
    }
    async goalConfirm(periodId, companyGroupCode) {
        return await this.evaluationRepository.update({
            status: 50,
        }, {
            where: {
                [sequelize_1.Op.and]: [
                    { evaluationPeriodId: periodId },
                    { status: { [sequelize_1.Op.lt]: 50 } },
                    { companyGroupCode: companyGroupCode },
                ],
            },
        });
    }
    async listUserEvaluation(params, companyGroupCode, timeZone) {
        var _a;
        const { email, department, division, salaryRank, year, periodIndex, offset, limit, status, } = params;
        const departmentName = department.name === 'すべて' ? '%%' : department.name;
        const departmentType = department.type;
        const divisionName = division.name === 'すべて' ? '%%' : division.name;
        const divisionType = division.type;
        const evaluationList1 = (await this.evaluationRepository.sequelize.query(`select
	count(*) over(),
	ut.full_name "fullName",
	ut.employee_number "employeeNumber",
	case when count(*)=1 then max(et.id )  else null end "id",
	max(et.id )"key",
	case when count(*)=1 then max(et.level)else (ARRAY_AGG(et.level ORDER BY to_date(et.period_end ,'YYYY/MM') DESC))[1] end "level",
	case when count(*)=1 then max(et.department_name)else null end "departmentName",
	case when count(*)=1 then max(et.division_name)else null end "divisionName",
	case when count(*)=1 then max(et.title) else (ARRAY_AGG(et.title ORDER BY to_date(et.period_end ,'YYYY/MM') DESC))[1] end "title",
	case when count(*)=1 then max(et.status)else  (ARRAY_AGG(et.status ORDER BY to_date(et.period_end ,'YYYY/MM') DESC))[1] end "status" , 
	case when count(*)=1 then max(et.period_start)||' ~ ' || max(et.period_end) else null end "periodStartEnd",
	case when count(*)=1 then (select full_name from evaluator_tbl inner join user_tbl on evaluator_tbl.evaluator_id =user_tbl.id where evaluator_tbl.evaluation_id=max(et.id) and evaluation_order=1) else null end"evaluator1",
	case when count(*)=1 then (select full_name from evaluator_tbl inner join user_tbl on evaluator_tbl.evaluator_id =user_tbl.id where evaluator_tbl.evaluation_id=max(et.id) and evaluation_order=2) else null end "evaluator2",
	--- find string status bằng hàm get_status
	(select get_status(coalesce((ARRAY_AGG(et.date_evaluation_start ORDER BY to_date(et.period_end ,'YYYY/MM') DESC))[1],(ARRAY_AGG(ept.date_evaluation_start ORDER BY to_date(et.period_end ,'YYYY/MM') DESC))[1]),
	coalesce((ARRAY_AGG(et.date_evaluation_end ORDER BY to_date(et.period_end ,'YYYY/MM') DESC))[1],(ARRAY_AGG(ept.date_evaluation_end ORDER BY to_date(et.period_end ,'YYYY/MM') DESC))[1]),
	(ARRAY_AGG(et.status ORDER BY et.status ASC))[1], :statusEvaluation, 'Asia/Tokyo')) "stringStatus",
--- kiếm điểm summary
	case when count(*)>1 then 
		case when ARRAY_AGG(et.level)::int[] <@ array[1,2,3,4,5,6,7]
			then 
				round(sum(et.summary_point_evaluator_2*et.percent_point/100))::varchar
			when  ARRAY_AGG(et.level)::int[] <@ array[8,9,10]
			then
			round(sum(sdt.summary_point_evaluator_2*et.percent_point/100),1)::varchar
			else
				'-'
			end
	else
		case when (ARRAY_AGG(et.level ORDER BY et.status ASC))[1]>7 then 
			round((ARRAY_AGG(sdt.summary_point_evaluator_2 ORDER BY to_date(et.period_end ,'YYYY/MM') DESC))[1],1)::varchar
		else
		  round((ARRAY_AGG(et.summary_point_evaluator_2 ORDER BY to_date(et.period_end ,'YYYY/MM') DESC))[1])::varchar
			
		end
	end "summaryPointEvaluator2",
--- kết thúc kiếm điểm summary
----- record con
	case when count(*)>1 then
	(select array_agg(jsonb_build_object('employeeNumber',ut3.employee_number,
	'fullName',ut3.full_name,
	'key',et3.id,
	'id',et3.id,
	'status',et3.status,
	'financialYear',et3.title,
	'departmentName',et3.department_name,
	'divisionName',et3.division_name,
	'level',et3.level,
	'periodStartEnd',et3.period_start||' ~ ' || et3.period_end,
	'title',et3.period_start||' ~ ' || et3.period_end,
	'stringStatus',
	(select get_status(coalesce(et3.date_evaluation_start,ept3.date_evaluation_start),coalesce(et3.date_evaluation_end,ept3.date_evaluation_end),et3.status,:statusEvaluation,'Asia/Tokyo')),
	
	'evaluator1',(select full_name from evaluator_tbl inner join user_tbl on evaluator_tbl.evaluator_id =user_tbl.id where evaluator_tbl.evaluation_id=et3.id and evaluation_order=1),
	'evaluator2',(select full_name from evaluator_tbl inner join user_tbl on evaluator_tbl.evaluator_id =user_tbl.id where evaluator_tbl.evaluation_id=et3.id and evaluation_order=2),
	'summaryPointEvaluator2',
	--- kiếm điểm summary
	case when et3.level >7 then 
			round(sdt3.summary_point_evaluator_2,1)::varchar
		else
		round(et3.summary_point_evaluator_2)::varchar
			
		end

--- kết thúc kiếm điểm summary
 ) order by to_date(et3.period_end,'YYYY/MM') DESC) 
	from evaluation_tbl et3
	inner join user_tbl ut3 on et3.user_id=ut3.id 
	inner join evaluation_period_tbl ept3 on et3.evaluation_period_id= ept3.id 
	left join summary_department_tbl sdt3 on sdt3.evaluation_id=et3.id 
	where et3.id= any(array_agg(et.id))  )
	 else null end "childs"
	
from
	evaluation_tbl et
inner join user_tbl ut on
	et.user_id = ut.id
inner join evaluation_period_tbl ept on
	et.evaluation_period_id = ept.id 
inner join evaluator_default_tbl edt on
edt.evaluation_period_id =ept.id and edt.user_id =ut.id
left join summary_department_tbl sdt on
	sdt.evaluation_id =et.id
where ept."year" like :year and ept."period_index"= :periodIndex 
and (ut.email ilike :email or ut.full_name ilike :email or ut.employee_number ilike :email)

and et.company_group_code like :companyGroupCode

group by ut.full_name,
	ut.employee_number, ept.id 
 having array_agg(et.status) && :status::smallint[]
 and array_agg(et.level) && :level::smallint[]
 and case when :departmentType = 0 then (array_agg(et.department_name)::text[] && :departmentName)
 when :departmentType = 1 then array_agg(et.division_name)::text[] && :departmentName else true end

 and case when :divisionType = 0 then (array_agg(et.division_name)::text[] && :divisionName)
 when :divisionType = 1 then array_agg(et.division_name)::text[] && :divisionName else true end
 
order by ${(() => {
            let sortStr = '';
            let index = params.sortColumns.indexOf('level');
            if (index >= 0) {
                sortStr = `"level" ${this.escapeSortDirection(params.sortDirections[index])},`;
            }
            index = params.sortColumns.indexOf('status');
            if (index >= 0) {
                sortStr += `"status" ${this.escapeSortDirection(params.sortDirections[index])},`;
            }
            return sortStr;
        })()} ut.employee_number asc limit :limit offset :offset
;

`, {
            replacements: {
                email: `%${email}%`,
                year: year,
                periodIndex: periodIndex,
                status: `{${status.join(',')}}`,
                level: `{${salaryRank.join(',')}}`,
                departmentName: `{${[departmentName].join(',')}}`,
                companyGroupCode: companyGroupCode,
                limit: limit,
                offset: offset,
                departmentType: departmentType,
                statusEvaluation: JSON.stringify(statusEvaluation_1.statusEvaluation),
                timeZone: timeZone,
                divisionName: `{${[divisionName].join(',')}}`,
                divisionType: divisionType,
            },
            type: sequelize_1.QueryTypes.SELECT,
            nest: true,
            logging: false,
        }));
        return { counts: ((_a = evaluationList1[0]) === null || _a === void 0 ? void 0 : _a.count) || 0, data: evaluationList1 };
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
    async exportCSV(params, companyGroupCode) {
        var _a;
        const { email, department, salaryRank, title, status } = params;
        const departmentName = department === 'すべて' ? '' : `${department[0]}`;
        const arrOfNum = salaryRank.map((str) => {
            return Number(str);
        });
        const arrOfStatus = status.map((str) => {
            return Number(str);
        });
        const datas = await this.evaluationRepository.sequelize.query(`
    select TMP.employee_number , TMP.full_name , SPLIT_PART(department_display, ',', 1) as department,arr_department, SPLIT_PART(division_display, ',', 1) as division,
TMP.period  
, TMP.comment_public_evaluator_1 , TMP.comment_public_evaluator_2 , TMP.comment_private_evaluator_1 , TMP.comment_private_evaluator_2 ,
case when TMP.status<>50 then STT.value else case when (SELECT j.value::int from json_each_text(TMP.level::json) j order by j.key ASC limit 1) >7 then
case when CURRENT_DATE >= to_date(date_evaluation_department_start,'YYYY/MM/DD') and CURRENT_DATE<=
 to_date(date_evaluation_department_end,'YYYY/MM/DD') then
split_part(STT.value,'/', case when split_status< 2 then split_status::int else 2 end)
else
split_part(STT.value,'/',1)
end
else
case when CURRENT_DATE>= to_date(date_evaluation_start,'YYYY/MM/DD') and CURRENT_DATE<= to_date(date_evaluation_end,'YYYY/MM/DD') then
split_part(STT.value,'/',case when split_status< 2 then split_status::int else 2 end)
else
split_part(STT.value,'/',1)
end
end end
 status
, TMP.evaluator_1 , TMP.evaluator_2 ,
TMP.point
, TMP.note,
TMP.statusNo,
(SELECT j.value::int from json_each_text(TMP.period_level::json) j order by j.key::date DESC limit 1) as level
,
-- case when TMP.status=100 then
(SELECT j.value::varchar from json_each_text(TMP.period_summary_char_point_evaluator_2::json) j order by j.key::date DESC limit 1) 
-- else '' end 
as summary_char_point_evaluator_2
from
(select  U.employee_number, U.full_name, 
 concat('{',string_agg(concat('"',E.status,'":"',E.level,'"'),','),'}') as level,
 concat('{',string_agg(concat('"',to_date(E.period_end,'YYYY/MM/DD'),'":"',E.level,'"'),','),'}') as period_level,
 concat('{',string_agg(concat('"',to_date(E.period_end,'YYYY/MM/DD'),'":"',sd.summary_char_point_evaluator_2 ,'"'),','),'}') as period_summary_char_point_evaluator_2,
 case when count(E.id)=1 
then string_agg(E.department_name,'') else null end department,
case when count(E.id)=1 
then string_agg(E.division_name,'') else null end division,
  case when count(E.id)=1 
then string_agg(concat(period_start,'~',period_end),'') else null end period,
min(E.status) status,
 case when min(E.status)=50 and string_agg(creation_user::varchar,',') is not null then
 min(case when CURRENT_DATE>= to_date(date_evaluation_start,'YYYY/MM/DD') and CURRENT_DATE<= to_date(date_evaluation_end,'YYYY/MM/DD')
	then case when status=50 then 2 else null end else case when status=50 and date_evaluation_start is not null and date_evaluation_end is not null then 1 else null end
	end) 
 else null end
 as split_status,
 case when count(E.id)=1 
then (select full_name from (select evaluation_id, full_name, evaluation_order from evaluator_tbl inner join user_tbl on evaluator_id=user_tbl.id)
as tmp where tmp.evaluation_id=max(e.id) and evaluation_order=1.0) else null end evaluator_1,
case when count(E.id)=1 
then (select full_name from (select evaluation_id, full_name, evaluation_order from evaluator_tbl inner join user_tbl on evaluator_id=user_tbl.id)
as tmp where tmp.evaluation_id=max(e.id) and evaluation_order=2.0) else null end evaluator_2,
case when count(E.id)=1 
then (select comment_private from evaluator_tbl
as tmp where tmp.evaluation_id=max(e.id) and evaluation_order=1.0) else (select comment_private from evaluator_tbl H inner join evaluation_tbl K on H.evaluation_id=K.id where to_date(K.period_start,'YYYY/MM/DD')=max(to_date(e.period_start,'YYYY/MM/DD'))
  and evaluation_order=1.0 and K.user_id=E.user_id
 order by K.id DESC limit 1) end comment_private_evaluator_1,
 min(E.status) statusNo,
 case when count(E.id)=1 
then (select comment_private from evaluator_tbl
as tmp where tmp.evaluation_id=max(e.id) and evaluation_order=2.0) else
 (select comment_private from evaluator_tbl H inner join evaluation_tbl K on H.evaluation_id=K.id where to_date(K.period_start,'YYYY/MM/DD')=max(to_date(e.period_start,'YYYY/MM/DD'))
  and evaluation_order=2.0 and K.user_id=E.user_id
 order by K.id DESC limit 1)
 
  end comment_private_evaluator_2,
  
case when count(E.id)=1 
then (select comment_public from evaluator_tbl
as tmp where tmp.evaluation_id=max(e.id) and evaluation_order=1.0) else (select comment_public from evaluator_tbl H inner join evaluation_tbl K on H.evaluation_id=K.id where to_date(K.period_start,'YYYY/MM/DD')=max(to_date(e.period_start,'YYYY/MM/DD'))
  and evaluation_order=1.0 and K.user_id=E.user_id
 order by K.id DESC limit 1) end comment_public_evaluator_1,

 case when count(E.id)=1 
then (select comment_public from evaluator_tbl
as tmp where tmp.evaluation_id=max(e.id) and evaluation_order=2.0) else
 (select comment_public from evaluator_tbl H inner join evaluation_tbl K on H.evaluation_id=K.id where to_date(K.period_start,'YYYY/MM/DD')=max(to_date(e.period_start,'YYYY/MM/DD'))
  and evaluation_order=2.0 and K.user_id=E.user_id
 order by K.id DESC limit 1)
 
  end comment_public_evaluator_2,
 case when 
 (string_to_array(string_agg(concat(E.level,''),','),',')::int[] <@ array[1,2,3,4,5,6,7] or 
 string_to_array(string_agg(concat(E.level,''),','),',')::int[] <@ array[8,9,10]) then
 --case when min(status)=100  then
 round((sum((case when E.level > 7 then sd.summary_point_evaluator_2 else e.summary_point_evaluator_2 end)*coalesce (percent_point, 100)/100)*case when max(E.level)>7 then 10 else 1 end/case when max(E.level)>7 then 10 else 1 end),case when max(E.level)>7 then 1 else 0 end)::varchar
  --else null end 
  else '-' end point
 ,case when count(E.id)>1 
then string_agg(concat(E.period_start,'~',E.period_end,': 結果: ',
-- case when E.status=100 then

case WHEN E.status <= 61 THEN '' ELSE
concat(round(((case when E.level > 7 then sd.summary_point_evaluator_2 else e.summary_point_evaluator_2 end) * case when E.level >7 then 10 else 1 end/case when E.level >7 
	then 10 else 1 end),case when E.level >7 then 1 else 0 end)::varchar,case when sd.summary_char_point_evaluator_2 is not NULL then concat('(',sd.summary_char_point_evaluator_2,')')else '' end)
END
-- else 'N/A' end
,' 等級: ', E.level,' - ',case when E.level<8 then E.department_name else E.division_name end),'\n' order by to_date(E.period_start,'YYYY/MM/DD') DESC) else '' end note,
 max(E.evaluation_period_id) evaluation_period_id, array_agg(status) arr_status, array_agg(E.level) arr_level, array_agg(case when E.level<8 then E.department_name else E.division_name end) arr_department,
string_agg(concat(E.department_name),',' order by to_date(E.period_start,'YYYY/MM/DD') DESC) department_display,
string_agg(concat(E.division_name),',' order by to_date(E.period_start,'YYYY/MM/DD') DESC) division_display
 from evaluation_tbl E 
left join summary_department_tbl sd on E.id = sd.evaluation_id
inner join user_tbl U on E.user_id=U.id 
inner join evaluator_default_tbl edt on edt.user_id= U.id and edt.evaluation_period_id=E.evaluation_period_id
where E.company_group_code=:companyGroupCode and title like '${title}'
 -- and department_name like '%${departmentName}%'
 --and E.level in (${arrOfNum.toString()})
    and (full_name like :email or email like :email or employee_number like :email) group by E.user_id,U.employee_number,U.full_name,E.evaluation_period_id ) as TMP
inner join (SELECT j.key::int, j.value from json_each_text('${JSON.stringify(statusEvaluation_1.statusEvaluation)}') as j)
as STT on TMP.status=STT.key inner join evaluation_period_tbl P on TMP.evaluation_period_id=P.id where (TMP.arr_status::int[] && array[${arrOfStatus.toString() || -1}]) 
  --and TMP.department::text[] like '%${departmentName}%' 
and TMP.arr_level::int[] && array[${arrOfNum.toString()}] 
${departmentName &&
            `and '${departmentName}' = ${((_a = department[1]) === null || _a === void 0 ? void 0 : _a.trim()) === '0' ? 'ANY(arr_department)' : 'division'} `}

order by TMP.employee_number ASC 
    `, {
            replacements: {
                email: `%${email}%`,
                companyGroupCode: companyGroupCode,
            },
        });
        return { data: datas[0] };
    }
    async evaluationConfirm(body, companyGroupCode) {
        const { periodId } = body;
        const t = await this.evaluationRepository.sequelize.transaction();
        const listEvaluatiion = await this.evaluationRepository.findAll({
            where: {
                [sequelize_1.Op.and]: [
                    { status: { [sequelize_1.Op.lte]: 98 } },
                    { status: { [sequelize_1.Op.gte]: 50 } },
                    { evaluationPeriodId: periodId },
                    { companyGroupCode: companyGroupCode },
                ],
            },
        });
        try {
            await this.evaluationRepository.update({
                status: 99,
            }, {
                where: {
                    [sequelize_1.Op.and]: [
                        { status: { [sequelize_1.Op.lte]: 98 } },
                        { status: { [sequelize_1.Op.gte]: 50 } },
                        { evaluationPeriodId: periodId },
                        { companyGroupCode: companyGroupCode },
                    ],
                },
                transaction: t,
            });
            await this.evaluationPeriodRepository.update({
                checkFixed: 1,
            }, {
                where: { id: periodId, companyGroupCode: companyGroupCode },
                transaction: t,
            });
            await t.commit();
        }
        catch (error) {
            await t.rollback();
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return listEvaluatiion;
    }
    async publicEvaluation(body, companyGroupCode) {
        const { periodId } = body;
        const t = await this.evaluationRepository.sequelize.transaction();
        try {
            await this.evaluationRepository.update({
                status: 100,
            }, {
                where: {
                    [sequelize_1.Op.and]: [
                        { status: { [sequelize_1.Op.lte]: 99 } },
                        { status: { [sequelize_1.Op.gte]: 50 } },
                        { evaluationPeriodId: periodId },
                        { companyGroupCode: companyGroupCode },
                    ],
                },
                transaction: t,
            });
            await this.evaluationPeriodRepository.update({
                checkFixed: 2,
            }, {
                where: { id: periodId },
                transaction: t,
            });
            await t.commit();
        }
        catch (error) {
            await t.rollback();
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return 1;
    }
    async getAchievementPersonal(versionId) {
        return await this.settingAchievementPersonalRepository.findAll({
            where: { versionId: versionId },
            order: [['point', 'ASC']],
        });
    }
    async getAchievementDep(versionId, type, typeEvaluation) {
        return await this.settingAchievementPersonalRepository.findAll({
            where: {
                versionId: versionId,
                typeEvaluation: typeEvaluation,
                type: type,
            },
            order: [['point', 'ASC']],
        });
    }
    async getAchievementAdditional(versionId, type) {
        return await this.settingAchievementAdditionalRepository.findAll({
            where: { versionId: versionId, type: type },
            order: sequelize_typescript_1.Sequelize.literal('"SettingAchievementAdditional"."point" DESC NULLS LAST '),
        });
    }
    async getAchievementAdditionalDep(versionId) {
        return await this.settingAchievementAdditionalRepository.findAll({
            where: { versionId: versionId, type: TypeAchievement_1.TypeAchievement.DEPARTMENT_810 },
            order: sequelize_typescript_1.Sequelize.literal('"SettingAchievementAdditional"."point" DESC NULLS LAST '),
        });
    }
    async getFormula(versionId) {
        return await this.settingFormula810.findAll({
            where: { versionId: versionId },
            order: sequelize_typescript_1.Sequelize.literal('"SettingFormula810"."point" DESC NULLS LAST '),
        });
    }
    async getData810(versionId) {
        return await this.versionSettingEntity.findOne({
            where: { id: versionId },
            include: [
                {
                    model: User_1.User,
                },
            ],
        });
    }
    async haveRecordEdit(req) {
        var _a;
        const editRecord = await this.versionSettingEntity.findOne({
            where: {
                [sequelize_1.Op.and]: [
                    { status: 1 },
                    { type: 2 },
                    { companyGroupCode: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode },
                ],
            },
        });
        return editRecord ? true : false;
    }
    async haveRecordEditNS(req) {
        var _a;
        const editRecord = await this.versionSettingEntity.findOne({
            where: {
                [sequelize_1.Op.and]: [
                    { status: 1 },
                    { type: 4 },
                    { companyGroupCode: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode },
                ],
            },
        });
        return editRecord ? true : false;
    }
    async listUserEvaluationPeriod(params, companyGroupCode) {
        const { periodId, stringStatus, type } = params;
        const arrStatus = stringStatus
            ? stringStatus.split(',').map((num) => parseFloat(num))
            : [];
        const datas = await this.evaluationRepository.sequelize.query(`select
	case
		when et.level <8 then et.department_name
		else et.division_name
	end "departmentName",
	1 "active",
	et.period_start "periodStart",
	et.period_end "periodEnd",
  et.id,
	et.status "status",
	(
	select
		get_status(coalesce(max(et.date_evaluation_start),
		case
			when et.level<8 then max(ept.date_evaluation_start)
			else max(ept.date_evaluation_department_start)
		end ),
		coalesce(max(et.date_evaluation_end),
		case
			when et.level<8 then max(ept.date_evaluation_end)
			else max(ept.date_evaluation_department_end)
		end),
		et.status,
		:evaluationStatus,
		:timeZone)) "stringStatus",
	jsonb_build_object('fullName',
	ut.full_name,
	'employeeNumber',
	ut.employee_number,
	'email',
	ut.email) "user",
  case when count (et2.evaluation_order) <>0 then
	array_agg(json_build_object ('evaluationId',
	et.id,
	'evaluatorId',
	et2.evaluator_id,
	'evaluationOrder',
	et2.evaluation_order::numeric(5,1)::varchar,
	'evaluator_id',
	et2.evaluator_id,
	'user',
	jsonb_build_object('fullName',
	ut2.full_name,
	'email',
	ut2.email))
order by
	et2.evaluation_order asc) else '{}' end "evaluator"
from
	evaluation_tbl et
inner join user_tbl ut on
	ut.id = et.user_id
inner join evaluation_period_tbl ept on
	ept.id = et.evaluation_period_id
inner join evaluator_default_tbl edt on
	edt.evaluation_period_id = et.evaluation_period_id
	and edt.user_id = et.user_id
left join evaluator_tbl et2 on
	et2.evaluation_id = et.id
left join user_tbl ut2 on
	et2.evaluator_id = ut2.id 
where
	et.evaluation_period_id =:periodId
	and et.company_group_code =:companyGroupCode
	and case
		when :type = 'fixedGoal' then et.status<49
		when :type = 'fixedEvaluation' then et.status<98
		else et.status<99
	end
		${arrStatus && arrStatus.length ? 'and et.status in (:status)' : ''}
group by
	et.level,
	et.department_name,
	et.division_name,
	et.period_start,
	et.period_end,
	et.status,
	ut.full_name,
	ut.employee_number,
	ut.email,
  et.id
order by
	ut.employee_number asc`, {
            replacements: {
                evaluationStatus: JSON.stringify(statusEvaluation_1.statusEvaluation),
                timeZone: 'Asia/Tokyo',
                periodId: periodId,
                companyGroupCode: companyGroupCode,
                type: type,
                status: arrStatus,
            },
            nest: true,
        });
        return datas;
    }
    async getEvaluatinPeriod(type, timeZone) {
        const today = moment().tz(timeZone).format('YYYY/MM');
        const evaluationPeriods = await this.evaluationPeriodRepository.findAll({
            order: [['id', 'ASC']],
        });
        let data = {};
        evaluationPeriods.forEach((e) => {
            if (moment(e.periodStart).tz(timeZone).format('YYYY/MM') <= today &&
                moment(e.periodEnd).tz(timeZone).format('YYYY/MM') >= today) {
                data = e;
            }
        });
        if (type !== 'fixedGoal') {
            data = await this.evaluationPeriodRepository.findOne({
                where: {
                    [sequelize_1.Op.and]: [
                        {
                            year: data.periodIndex === 1
                                ? (Number(data.year) - 1).toString()
                                : data.year.toString(),
                        },
                        { periodIndex: data.periodIndex === 1 ? 2 : 1 },
                    ],
                },
            });
        }
        return data;
    }
    async getAllEvaluation(condition) {
        return await this.evaluationRepository.findAll({
            where: condition,
            attributes: ['id', 'updatedTime', 'level', 'userId'],
            include: [
                {
                    model: EvaluationPeriod_1.EvaluationPeriod,
                    as: 'evaluationPeriod',
                    attributes: ['periodIndex', 'year'],
                },
                {
                    model: Evaluator_1.Evaluator,
                    as: 'evaluator',
                    attributes: ['evaluatorId'],
                    include: [{ model: User_1.User, as: 'user', attributes: ['email'] }],
                },
            ],
        });
    }
    async evaluationFixed(yearStart, yearEnd) {
        const datas = await this.evaluationPeriodRepository.findAll({
            attributes: [
                'id',
                'year',
                'periodIndex',
                'checkFixed',
                'dateCreationGoalStart',
                'dateCreationGoalEnd',
                'dateCreationGoalDepartmentStart',
                'dateCreationGoalDepartmentEnd',
            ],
            where: {
                [sequelize_1.Op.and]: [
                    { year: { [sequelize_1.Op.gte]: yearStart } },
                    { year: { [sequelize_1.Op.lte]: yearEnd } },
                ],
            },
            order: [
                ['year', 'ASC'],
                ['periodIndex', 'ASC'],
            ],
        });
        return datas;
    }
    async getAllSkillByCondition(userId) {
        return await this.skillRoleEntity.findAll({
            attributes: ['skillId'],
            where: {
                userId: userId,
                role: 1,
            },
        });
    }
    async countAllEvaluationFixed(query) {
        const { yearStart, yearEnd } = query;
        const counts = await this.evaluationPeriodRepository.findAll({
            attributes: [[sequelize_typescript_1.Sequelize.fn('COUNT', sequelize_typescript_1.Sequelize.col('id')), 'count']],
            where: {
                [sequelize_1.Op.and]: [
                    { year: { [sequelize_1.Op.gte]: yearStart } },
                    { year: { [sequelize_1.Op.lte]: yearEnd } },
                ],
            },
        });
        return counts;
    }
    async countEvaluationFixed(type, periodId, companyGroupCode) {
        const query = `select
	count(*)
from
	evaluation_tbl
inner join
	evaluation_period_tbl
	on evaluation_tbl.evaluation_period_id = evaluation_period_tbl.id
inner join
	evaluator_default_tbl
on evaluator_default_tbl.user_id = evaluation_tbl.user_id
where evaluation_period_tbl.id = :periodId
	and status< :status 
	and evaluation_tbl.company_group_code like :companyGroupCode
	and evaluator_default_tbl.evaluation_period_id =:periodId`;
        const datas = await this.evaluationRepository.sequelize.query(query, {
            replacements: {
                status: type === 'goal' ? 49 : type === 'evaluation' ? 98 : 99,
                periodId: periodId,
                companyGroupCode: companyGroupCode,
            },
        });
        return datas[0][0].count;
    }
    async totalEvaluation(id, type, companyGroupCode) {
        const query = `select
	count("Evaluation"."id") as "count"
from
	"evaluation_tbl" as "Evaluation"
inner join "evaluation_period_tbl" as "evaluationPeriod" on
	"Evaluation"."evaluation_period_id" = "evaluationPeriod"."id"
  inner join
	evaluator_default_tbl
on "evaluator_default_tbl".user_id = "Evaluation".user_id
  where
	("Evaluation"."evaluation_period_id" = :id
		and "Evaluation"."status" >= :status) and evaluator_default_tbl.evaluation_period_id =:id
     and "Evaluation".company_group_code like :companyGroupCode`;
        const datas = await this.evaluationRepository.sequelize.query(query, {
            replacements: {
                id: id,
                status: type === 'goal'
                    ? 50
                    : type === 'evaluation'
                        ? 99
                        : type === 'evaluationConfirm'
                            ? 100
                            : 0,
                companyGroupCode,
            },
        });
        return datas[0][0].count;
    }
    async checkDatePeriod(id) {
        const data = await this.evaluationPeriodRepository.findOne({
            where: { id: id },
        });
        return data;
    }
    async addHistoryFixEvaluation(periodId, jsonStr, type, checkFixed) {
        await this.historyFixEvaluation.destroy({
            where: {
                periodId: periodId,
            },
        });
        return await this.historyFixEvaluation.create({
            periodId: periodId,
            type: type,
            note: jsonStr,
            checkFixed: checkFixed,
        });
    }
    async findHistoryFixEvaluation(periodId, type) {
        return await this.historyFixEvaluation.findOne({
            where: { periodId: periodId, type: type },
        });
    }
    async transactionUndo() {
        return await this.evaluationRepository.sequelize.transaction();
    }
    async updateEvaluationPeriod(checkFixed, periodId, t) {
        return await this.evaluationPeriodRepository.update({
            checkFixed: checkFixed,
        }, { where: { id: periodId }, transaction: t });
    }
    async undoGoal(data, t) {
        return await this.evaluationRepository.bulkCreate(Object.keys(data).map((id) => ({
            id: +id,
            status: +data[id],
            evaluationDepartmentId: null,
            title: '',
            periodStart: '',
            periodEnd: '',
        })), {
            updateOnDuplicate: ['status', 'evaluationDepartmentId'],
            transaction: t,
        });
    }
    async undoEvaluation(data, t) {
        return await this.evaluationRepository.bulkCreate(Object.keys(data).map((id) => ({
            id: +id,
            status: +data[id],
            title: '',
            periodStart: '',
            periodEnd: '',
        })), {
            updateOnDuplicate: ['status'],
            transaction: t,
        });
    }
    async deleteHistoryEvaluationFixed(periodId, t) {
        return await this.historyFixEvaluation.destroy({
            where: { periodId: periodId },
            transaction: t,
        });
    }
    async getAllDepartmentsWithSubClass(companyGroupCode) {
        return await this.departmentEntity.findAll({
            where: { active: 1, companyGroupCode: companyGroupCode },
            include: [
                {
                    model: DivisionSubclass_1.DivisionSubclass,
                    as: 'divisionSubclass',
                    attributes: ['departmentId', 'divisionId'],
                },
            ],
            order: [['name', 'ASC']],
        });
    }
    async addProSkill(payload, companyGroupCode) {
        const transaction = await this.skillEntity.sequelize.transaction();
        try {
            const newSkill = await this.skillEntity.create({
                name: payload.skillName,
                active: 1,
                companyGroupCode: companyGroupCode,
            }, { transaction: transaction });
            const setters = payload.skillSetters.map((setter) => ({
                skillId: newSkill.id,
                userId: setter,
                role: 1,
            }));
            const approvers = payload.skillApprovers.map((approver) => ({
                skillId: newSkill.id,
                userId: approver,
                role: 2,
            }));
            await this.skillRoleEntity.bulkCreate([...setters, ...approvers], {
                transaction: transaction,
            });
            const departments = [...payload.departments, ...payload.divisions].map((dep) => ({
                skillId: newSkill.id,
                departmentId: dep,
            }));
            await this.skillGroupEntity.bulkCreate(departments, {
                transaction: transaction,
            });
            const skillData = await this.skillEntity.findOne({
                where: { id: newSkill.id },
                include: [
                    { model: SkillRole_1.SkillRole, as: 'skillRoles' },
                    { model: SkillGroup_1.SkillGroup, as: 'skills' },
                ],
                transaction: transaction,
            });
            await transaction.commit();
            return skillData;
        }
        catch (error) {
            await transaction.rollback();
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    getDifferenceSkillRoles(dbSkillRoles, inputSkillRoles) {
        const newSkillRoles = inputSkillRoles.filter((tpl) => dbSkillRoles.find((sk) => sk.userId === tpl.userId && sk.role === tpl.role) == null);
        const deletedSkillRoles = dbSkillRoles.filter((tpl) => inputSkillRoles.find((sk) => sk.userId === tpl.userId && sk.role === tpl.role) == null);
        return { newSkillRoles, deletedSkillRoles };
    }
    getDifferenceSkillGroups(dbSkillGroups, inputSkillGroups) {
        const newSkillGroups = inputSkillGroups.filter((tpl) => dbSkillGroups.find((sk) => sk.departmentId === tpl.departmentId) ==
            null);
        const deletedSkillGroups = dbSkillGroups.filter((tpl) => inputSkillGroups.find((sk) => sk.departmentId === tpl.departmentId) ==
            null);
        return { newSkillGroups, deletedSkillGroups };
    }
    async editProSkill(skillId, payload, companyGroupCode) {
        const existingName = await this.skillEntity.findOne({
            where: {
                name: payload.skillName.trim(),
                id: { [sequelize_1.Op.ne]: skillId },
                active: 1,
                companyGroupCode: companyGroupCode,
            },
        });
        if (existingName) {
            throw new RuntimeException_1.RuntimeException('IDM_SKILL_NAME_EXIST', common_1.HttpStatus.CONFLICT);
        }
        const skill = await this.skillEntity.findOne({
            attributes: ['id', 'name'],
            where: { id: skillId, active: 1, companyGroupCode: companyGroupCode },
            order: [['name', 'ASC']],
            include: [
                {
                    model: SkillRole_1.SkillRole,
                    as: 'skillRoles',
                    attributes: ['role', 'userId', 'id'],
                },
                {
                    model: SkillGroup_1.SkillGroup,
                    as: 'skills',
                    attributes: ['department_id', 'id'],
                },
            ],
        });
        const dbSkillRoles = skill.skillRoles.map((sr) => ({
            userId: sr.userId,
            role: sr.role,
            id: sr.id,
        }));
        const setters = payload.skillSetters.map((setterId) => ({
            skillId: skill.id,
            userId: setterId,
            role: 1,
        }));
        const approvers = payload.skillApprovers.map((approverId) => ({
            skillId: skill.id,
            userId: approverId,
            role: 2,
        }));
        const inputSkillRoles = [...setters, ...approvers];
        const dbSkillGroups = skill.skills.map((sr) => ({
            departmentId: sr.departmentId,
            id: sr.id,
        }));
        const inputSkillGroups = [...payload.departments, ...payload.divisions].map((depId) => ({
            departmentId: depId,
            skillId: skill.id,
        }));
        const { newSkillRoles, deletedSkillRoles } = this.getDifferenceSkillRoles(dbSkillRoles, inputSkillRoles);
        const { newSkillGroups, deletedSkillGroups } = this.getDifferenceSkillGroups(dbSkillGroups, inputSkillGroups);
        const transaction = await this.skillEntity.sequelize.transaction();
        try {
            skill.set('name', payload.skillName.trim());
            await skill.save({ transaction });
            if (deletedSkillRoles.length > 0) {
                await SkillRole_1.SkillRole.destroy({
                    where: {
                        skillId: skillId,
                        id: { [sequelize_1.Op.in]: deletedSkillRoles.map((x) => x.id) },
                    },
                    transaction,
                });
            }
            if (deletedSkillGroups.length > 0) {
                await SkillGroup_1.SkillGroup.destroy({
                    where: {
                        skillId: skillId,
                        id: { [sequelize_1.Op.in]: deletedSkillGroups.map((x) => x.id) },
                    },
                    transaction,
                });
            }
            if (newSkillRoles.length > 0) {
                await this.skillRoleEntity.bulkCreate(newSkillRoles, {
                    transaction,
                });
            }
            if (newSkillGroups.length > 0) {
                await this.skillGroupEntity.bulkCreate(newSkillGroups, {
                    transaction: transaction,
                });
            }
            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        skill.skills = [...payload.departments, ...payload.divisions].map((dep) => ({
            skillId: skill.id,
            departmentId: dep,
        }));
        skill.skillRoles = [...setters, ...approvers];
        return skill;
    }
    async exportHistoryEvaluation(division, department, userInfo, status, yearStart, yearEnd, companyGroupCode) {
        const datas = await this.userRepository.sequelize.query(`
        SELECT ut.full_name                                                                     "userName",
               ut.employee_number                                                               "employeeNumber",
               ut.level,
               ut.id                                                                            "userId",
               ut.active,
               dt."name"                                                                        "departmentName",
               dt2."name"                                                                       "divisionName",
               COALESCE(JSON_AGG(evaluation.*) FILTER(WHERE evaluation.* IS NOT NULL), '[]') AS "evaluations"
        FROM user_tbl ut
               LEFT JOIN department_tbl dt ON
          dt.id = department_id
               LEFT JOIN department_tbl dt2 ON
          dt2.id = division_id
          --inner join evaluation_tbl et on ut.id = et.user_id
               LEFT JOIN (SELECT et.user_id,
                                 ept."year",
                                 ept.period_index                        "periodIndex",
                                 STRING_AGG(et.level::varchar, ' - ') AS "level",
                                 CASE
                                   WHEN COUNT(et.level) > 1 THEN
                                      CASE
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
                                                   WHEN et.LEVEL >= 8 THEN sdt.SUMMARY_POINT_EVALUATOR_2::NUMERIC(5, 1)::VARCHAR
                                                   ELSE et.SUMMARY_POINT_EVALUATOR_2::NUMERIC(5, 0)::VARCHAR
                                                   END,
                                               ' - ' ORDER BY TO_DATE(ET.PERIOD_END, 'YYYY/MM') DESC
                                            )::VARCHAR
                                       END
                               ELSE
                                   CASE
                                       WHEN MAX(et.level) < 8 THEN MAX(et.summary_point_evaluator_2)::numeric(5, 0)::varchar
                                       ELSE MAX(sdt.summary_point_evaluator_2)::numeric(5, 1)::varchar
                                       END
                               END                              AS "totalPoint"
                          FROM evaluation_tbl et
                            INNER JOIN evaluation_period_tbl ept
                          ON et.evaluation_period_id = ept.id
                            LEFT JOIN summary_department_tbl sdt
                            ON et.id = sdt.evaluation_id
                          WHERE et.status = 100
                            AND ept."year":: int BETWEEN :yearStart
                            AND :yearEnd
                          GROUP BY et.user_id,
                            ept."year",
                            ept.period_index) evaluation ON evaluation.user_id = ut.id
        WHERE COALESCE(ut.department_id, -1) = COALESCE(:departmentId, ut.department_id, -1)
          AND COALESCE(ut.division_id, -1) = COALESCE(:divisionId, ut.division_id, -1)
          AND (
          ut.full_name ILIKE '%' || COALESCE(:userInfo, '') || '%'
            OR ut.employee_number ILIKE '%' || COALESCE(:userInfo, '') || '%'
            OR ut.email ILIKE '%' || COALESCE(:userInfo, '') || '%'
          )
          AND ut.active = COALESCE(:active, ut.active)
          AND ut.company_group_code = :companyGroupCode
        GROUP BY "userName", "employeeNumber", ut."level", "userId", ut."active", "departmentName", "divisionName"
        ORDER BY ut.active DESC, "divisionName", "departmentName", "employeeNumber";
      `, {
            nest: true,
            replacements: {
                yearStart: yearStart,
                yearEnd: yearEnd,
                userInfo,
                departmentId: department,
                divisionId: division,
                active: status,
                companyGroupCode: companyGroupCode,
            },
        });
        return datas;
    }
    async getListUser(periodId, companyGroupCode) {
        return await this.evaluatorDefault.findAll({
            attributes: ['userId'],
            where: {
                evaluationPeriodId: periodId,
                companyGroupCode: companyGroupCode,
            },
        });
    }
    async getDataExcel(params, companyGroupCode, timeZone) {
        const { email, department, salaryRank, year, periodIndex, status } = params;
        const departmentName = department.name === 'すべて' ? '%%' : department.name;
        const departmentType = department.type;
        const evaluationList = (await this.evaluationRepository.sequelize.query(`
    select
    -- Lấy data record bình thường
    -- Data evaluation
          ut.full_name "fullName",
          ut.employee_number "employeeNumber",
          case when count(*) = 1 then max(et.id) else null end "id",
      case when count(*) = 1 then max(et.status) else null end "status",
          case when count(*) = 1 then max(et.department_name) else null end "departmentName",
          case when count(*) = 1 then max(et.division_name) else null end "divisionName",
      case when count(*) = 1 then max(et.company_name) else null end "companyName",
      case when count(*) = 1 then max(et.title) else null end "title",
      case when count(*) = 1 then max(et.period_start) else null end "periodStart",
      case when count(*) = 1 then max(et.period_end) else null end "periodEnd",
      case when count(*) = 1 then max(et.level) else null end "level",
      case when count(*) = 1 then max(et.comment_user) else null end "commentUser",
      case when count(*) = 1 then max(et.skill_percent) else null end "skillPercent",
      case when count(*) = 1 then max(et.behavior_percent) else null end "behaviorPercent",
      case when count(*) = 1 then max(et.achievement_percent) else null end "achievementPercent",
      case when count(*) = 1 then max(et.basic_pro_total_point_user) else null end "basicProTotalPointUser",
      case when count(*) = 1 then max(et.basic_pro_total_point_evaluator_0_5) else null end "basicProTotalPointEvaluator05",
      case when count(*) = 1 then max(et.basic_pro_total_point_evaluator_1) else null end "basicProTotalPointEvaluator1",
      case when count(*) = 1 then max(et.basic_pro_total_point_evaluator_2) else null end "basicProTotalPointEvaluator2",
      case when count(*) = 1 then max(et.basic_total_point_user) else null end "basicTotalPointUser",
      case when count(*) = 1 then max(et.basic_total_point_evaluator_0_5) else null end "basicTotalPointEvaluator05",
      case when count(*) = 1 then max(et.basic_total_point_evaluator_1) else null end "basicTotalPointEvaluator1",
      case when count(*) = 1 then max(et.basic_total_point_evaluator_2) else null end "basicTotalPointEvaluator2",
      case when count(*) = 1 then max(et.pro_total_point_user) else null end "proTotalPointUser",
      case when count(*) = 1 then max(et.pro_total_point_evaluator_0_5) else null end "proTotalPointEvaluator05",
      case when count(*) = 1 then max(et.pro_total_point_evaluator_1) else null end "proTotalPointEvaluator1",
      case when count(*) = 1 then max(et.pro_total_point_evaluator_2) else null end "proTotalPointEvaluator2",
      case when count(*) = 1 then max(et.behavior_total_point_user) else null end "behaviorTotalPointUser",
      case when count(*) = 1 then max(et.behavior_total_point_evaluator_0_5) else null end "behaviorTotalPointEvaluator05",
      case when count(*) = 1 then max(et.behavior_total_point_evaluator_1) else null end "behaviorTotalPointEvaluator1",
      case when count(*) = 1 then max(et.behavior_total_point_evaluator_2) else null end "behaviorTotalPointEvaluator2",
      case when count(*) = 1 then max(et.achievement_personal_total_point_user) else null end "achievementPersonalTotalPointUser",
      case when count(*) = 1 then max(et.achievement_personal_total_point_evaluator_0_5) else null end "achievementPersonalTotalPointEvaluator05",
      case when count(*) = 1 then max(et.achievement_personal_total_point_evaluator_1) else null end "achievementPersonalTotalPointEvaluator1",
      case when count(*) = 1 then max(et.achievement_personal_total_point_evaluator_2) else null end "achievementPersonalTotalPointEvaluator2",
      case when count(*) = 1 then max(et.achievement_additional_total_point_user) else null end "achievementAdditionalTotalPointUser",
      case when count(*) = 1 then max(et.achievement_additional_total_point_evaluator_0_5) else null end "achievementAdditionalTotalPointEvaluator05",
      case when count(*) = 1 then max(et.achievement_additional_total_point_evaluator_1) else null end "achievementAdditionalTotalPointEvaluator1",
      case when count(*) = 1 then max(et.achievement_additional_total_point_evaluator_2) else null end "achievementAdditionalTotalPointEvaluator2",
      case when count(*) = 1 then max(et.summary_point_user) else null end "summaryPointUser",
      case when count(*) = 1 then max(et.summary_point_evaluator_0_5) else null end "summaryPointEvaluator05",
      case when count(*) = 1 then max(et.summary_point_evaluator_1) else null end "summaryPointEvaluator1",
      case when count(*) = 1 then max(et.summary_point_evaluator_2) else null end "summaryPointEvaluator2",
      case when count(*) = 1 then max(et.summary_char_point_user) else null end "summaryCharPointUser",
      case when count(*) = 1 then max(et.summary_char_point_evaluator_0_5) else null end "summaryCharPointEvaluator05",
      case when count(*) = 1 then max(et.summary_char_point_evaluator_1) else null end "summaryCharPointEvaluator1",
      case when count(*) = 1 then max(et.summary_char_point_evaluator_2) else null end "summaryCharPointEvaluator2",
      case when count(*) = 1 then max(et.flag_skill) else null end "flagSkill",
      
      -- Data evaluator 0.5
          case when count(*) = 1 then
        ( 
          select  
            jsonb_build_object(
            'fullName', full_name,
            'employeeNumber', employee_number,
            'commentPublic', comment_public,
            'commentPrivate', comment_private					 
        )
          from evaluator_tbl
          inner join user_tbl on evaluator_tbl.evaluator_id = user_tbl.id 
          where evaluator_tbl.evaluation_id = max(et.id) and evaluation_order = 0.5) else null end "evaluator05",
          
      -- Data evaluator 1.0
          case when count(*) = 1 then
        ( 
          select  
            jsonb_build_object(
            'fullName', full_name,
            'employeeNumber', employee_number,
            'commentPublic', comment_public,
            'commentPrivate', comment_private
        )
          from evaluator_tbl
          inner join user_tbl on evaluator_tbl.evaluator_id = user_tbl.id 
          where evaluator_tbl.evaluation_id = max(et.id) and evaluation_order = 1) else null end "evaluator1",

      -- Data evaluator 2.0
          case when count(*) = 1 then
        ( 
          select  
            jsonb_build_object(
            'fullName', full_name,
            'employeeNumber', employee_number,
            'commentPublic', comment_public,
            'commentPrivate', comment_private					 
        )
          from evaluator_tbl
          inner join user_tbl on evaluator_tbl.evaluator_id = user_tbl.id 
          where evaluator_tbl.evaluation_id = max(et.id) and evaluation_order = 2) else null end "evaluator2",		

      -- Data summary department 
          case when count(*) = 1 then
        ( 
          select  
            jsonb_build_object(
            'evaluationId', evaluation_id,
            'achievementPersonalTotalPointUser', sdt.achievement_personal_total_point_user,
            'achievementPersonalTotalPointEvaluator05', sdt.achievement_personal_total_point_evaluator_0_5,
            'achievementPersonalTotalPointEvaluator1', sdt.achievement_personal_total_point_evaluator_1,
            'achievementPersonalTotalPointEvaluator2', sdt.achievement_personal_total_point_evaluator_2,
            'achievementAdditionalTotalPointUser', sdt.achievement_additional_total_point_user,
            'achievementAdditionalTotalPointEvaluator05', sdt.achievement_additional_total_point_evaluator_0_5,
            'achievementAdditionalTotalPointEvaluator1', sdt.achievement_additional_total_point_evaluator_1,
            'achievementAdditionalTotalPointEvaluator2', sdt.achievement_additional_total_point_evaluator_2,
            'summaryPointUser', sdt.summary_point_user,
            'summaryPointEvaluator05', sdt.summary_point_evaluator_0_5,
            'summaryPointEvaluator1', sdt.summary_point_evaluator_1,
            'summaryPointEvaluator2', sdt.summary_point_evaluator_2,
            'summaryCharPointUser', sdt.summary_char_point_user,
            'summaryCharPointEvaluator05', sdt.summary_char_point_evaluator_0_5,
            'summaryCharPointEvaluator1', sdt.summary_char_point_evaluator_1,
            'summaryCharPointEvaluator2', sdt.summary_char_point_evaluator_2
        )
          from summary_department_tbl sdt 
          inner join evaluation_tbl on evaluation_tbl.id = sdt.evaluation_id
          where sdt.evaluation_id = max(et.id)) else null end "summaryDepartment"	,

      -- Data basic, behavior skill 
          case when count(*) = 1 then
        ( 
          select jsonb_agg(row_to_json(t))
          from
            (
              select
                evaluation_id "evaluationId",
                item_no "itemNo",
                type,
                item_title "itemTitle",
                content,
                difficulty,
                point_user "pointUser",
                point_evaluator_0_5 "pointEvaluator05",
                point_evaluator_1 "pointEvaluator1",
                point_evaluator_2 "pointEvaluator2"
              from
                evaluation_basic_behavior_tbl ebbt
            inner join evaluation_tbl on evaluation_tbl.id = ebbt.evaluation_id
            where ebbt.evaluation_id = max(et.id)
              order by
                item_no asc
            ) t
        ) else null end "listBasicBehaviorSkill",

      -- Data pro skill 
          case when count(*) = 1 then
        ( 
          select jsonb_agg(row_to_json(t))
          from
            (
              select
                job_type "jobType",
                item_no "itemNo",
                item_id "itemId",
                item_title "itemTitle",
                content,
                difficulty,
                point_user "pointUser",
                point_evaluator_0_5 "pointEvaluator05",
                point_evaluator_1 "pointEvaluator1",
                point_evaluator_2 "pointEvaluator2",
                total_point_user "totalPointUser",
                total_point_evaluator_0_5 "totalPointEvaluator05",
                total_point_evaluator_1 "totalPointEvaluator1",
                total_point_evaluator_2 "totalPointEvaluator2",
                note
              from
                evaluation_pro_tbl ept
              inner join evaluation_tbl on evaluation_tbl.id = ept.evaluation_id
            where ept.evaluation_id = max(et.id) and ept.is_disable = false 
              order by
                item_no asc
            ) t
        ) else null end "listProSKill",

      -- Data mục tiêu 
          case when count(*) = 1 then
        ( 
          select jsonb_agg(row_to_json(t))
          from
          (
              select
                type,
                eapt.id as "id",
                item_no as "itemNo",
                eapt.title as "title",
                achievement_value as "achievementValue",
                method,
                weight,
                difficulty_user as "difficultyUser",
                difficulty_evaluator_0_5 as "difficultyEvaluator05",
                difficulty_evaluator_1 as "difficultyEvaluator1",
                difficulty_evaluator_2 as "difficultyEvaluator2",
                achievement_status as "achievementStatus",
                reason_comment as "reasonComment",
                action_plan as "actionPlan",
                point_user as "pointUser",
                coefficient_user as "coefficientUser",
                point_evaluator_0_5 as "pointEvaluator05",
                coefficient_evaluator_0_5 as "coefficientEvaluator05",
                point_evaluator_1 as "pointEvaluator1",
                coefficient_evaluator_1 as "coefficientEvaluator1",
                point_evaluator_2 as "pointEvaluator2",
                coefficient_evaluator_2 as "coefficientEvaluator2",
                (
                  select
                    jsonb_agg(row_to_json(t1))
                  from
                    (
                      select
                        id,
                        achievement_personal_id as "achievementPersonalId",
                        coefficient::numeric(5,1)::varchar,
                        evaluation_decision as "evaluationDecision",
                        evaluation_decision as "note",
                        degree,
                        created_time as "createdTime",
                        updated_time as "updatedTime"
                      from
                        evaluation_achievement_personal_sub_tbl eapst2
                      where
                        eapst2.achievement_personal_id = eapt.id
                      order by
                        coefficient desc
                    ) t1
                ) as "goalSub"
              from
                evaluation_achievement_personal_tbl eapt
            inner join evaluation_tbl on evaluation_tbl.id = eapt.evaluation_id
            where eapt.evaluation_id = max(et.id)
              order by
                item_no asc
            ) t
        
        ) else null end "listGoal",

      -- Data mục tiêu thêm 
          case when count(*) = 1 then
        ( 
          select jsonb_agg(row_to_json(t))
          from
            (
              select
                type,
                evaluation_id as "evaluationId",
                item_no as "itemNo",
                title_additional as "titleAdditional",
                achievement_status as "achievementStatus",
                reason_comment as "reasonComment",
                point_user as "pointUser",
                point_evaluator_0_5 as "pointEvaluator05",
                point_evaluator_1 as "pointEvaluator1",
                point_evaluator_2 as "pointEvaluator2",
                evaluation_order as "evaluationOrder"
              from
                evaluation_achievement_additional_tbl eaat
            inner join evaluation_tbl on evaluation_tbl.id = eaat.evaluation_id
            where eaat.evaluation_id = max(et.id)
              order by
                item_no asc
            ) t
        ) else null end "listGoalAdditional",

      -- Check hiển thị sheet tổng điểm khi có exception
            case when count(*) > 1 then 
              case when ARRAY_AGG(et.level)::int[] <@ array[1,2,3,4,5,6,7]
                  then 
                      '1-7'
                    when  ARRAY_AGG(et.level)::int[] <@ array[8,9,10]
                    then
                        '8-10'
                    else
                      '1-10'
                    end
              else
                    null
              end "sameLevel",

      -- Data record exception
          case when count(*) > 1 then
          (
        select array_agg( 
          jsonb_build_object(
          'fullName', ut3.full_name,
          'employeeNumber', ut3.employee_number,
          'id', et3.id,
          'status', et3.status,
          'departmentName', et3.department_name,
          'divisionName', et3.division_name,
          'companyName', et3.company_name,
          'title', et3.title,
          'periodStart', et3.period_start,
          'periodEnd', et3.period_end,
          'level', et3.level,
          'commentUser', et3.comment_user,
          'skillPercent', et3.skill_percent,
          'behaviorPercent', et3.behavior_percent,
          'achievementPercent', et3.achievement_percent,
          'basicProTotalPointUser', et3.basic_pro_total_point_user,
          'basicProTotalPointEvaluator05', et3.basic_pro_total_point_evaluator_0_5,
          'basicProTotalPointEvaluator1', et3.basic_pro_total_point_evaluator_1,
          'basicProTotalPointEvaluator2', et3.basic_pro_total_point_evaluator_2,
          'basicTotalPointUser', et3.basic_total_point_user,
          'basicTotalPointEvaluator05', et3.basic_total_point_evaluator_0_5,
          'basicTotalPointEvaluator1', et3.basic_total_point_evaluator_1,
          'basicTotalPointEvaluator2', et3.basic_total_point_evaluator_2,
          'proTotalPointUser', et3.pro_total_point_user,
          'proTotalPointEvaluator05', et3.pro_total_point_evaluator_0_5,
          'proTotalPointEvaluator1', et3.pro_total_point_evaluator_1,
          'proTotalPointEvaluator2', et3.pro_total_point_evaluator_2,
          'behaviorTotalPointUser', et3.behavior_total_point_user,
          'behaviorTotalPointEvaluator05', et3.behavior_total_point_evaluator_0_5,
          'behaviorTotalPointEvaluator1', et3.behavior_total_point_evaluator_1,
          'behaviorTotalPointEvaluator2', et3.behavior_total_point_evaluator_2,
          'achievementPersonalTotalPointUser', et3.achievement_personal_total_point_user,
          'achievementPersonalTotalPointEvaluator05', et3.achievement_personal_total_point_evaluator_0_5,
          'achievementPersonalTotalPointEvaluator1', et3.achievement_personal_total_point_evaluator_1,
          'achievementPersonalTotalPointEvaluator2', et3.achievement_personal_total_point_evaluator_2,
          'achievementAdditionalTotalPointUser', et3.achievement_additional_total_point_user,
          'achievementAdditionalTotalPointEvaluator05', et3.achievement_additional_total_point_evaluator_0_5,
          'achievementAdditionalTotalPointEvaluator1', et3.achievement_additional_total_point_evaluator_1,
          'achievementAdditionalTotalPointEvaluator2', et3.achievement_additional_total_point_evaluator_2,
          'summaryPointUser', et3.summary_point_user,
          'summaryPointEvaluator05', et3.summary_point_evaluator_0_5,
          'summaryPointEvaluator1', et3.summary_point_evaluator_1,
          'summaryPointEvaluator2', et3.summary_point_evaluator_2,
          'summaryCharPointUser', et3.summary_char_point_user,
          'summaryCharPointEvaluator05', et3.summary_char_point_evaluator_0_5,
          'summaryCharPointEvaluator1', et3.summary_char_point_evaluator_1,
          'summaryCharPointEvaluator2', et3.summary_char_point_evaluator_2,
          'flagSkill', et3.flag_skill,
          'percentPoint', et3.percent_point
          ) 
          || jsonb_build_object(
          -- Data evaluator 0.5 
          'evaluator05', 
              (	
              select  
                jsonb_build_object(
                'fullName', full_name,
                'employeeNumber', employee_number,
                'commentPublic', comment_public,
                'commentPrivate', comment_private					 
            )
              from evaluator_tbl
              inner join user_tbl on evaluator_tbl.evaluator_id = user_tbl.id 
              where evaluator_tbl.evaluation_id = et3.id and evaluation_order = 0.5),
      
          -- Data evaluator 1.0
          'evaluator1', 
          ( 
              select  
                jsonb_build_object(
                'fullName', full_name,
                'employeeNumber', employee_number,
                'commentPublic', comment_public,
                'commentPrivate', comment_private
            )
              from evaluator_tbl
              inner join user_tbl on evaluator_tbl.evaluator_id = user_tbl.id 
              where evaluator_tbl.evaluation_id = et3.id and evaluation_order = 1),
      
          -- Data evaluator 2.0
          'evaluator2',
          ( 
              select  
                jsonb_build_object(
                'fullName', full_name,
                'employeeNumber', employee_number,
                'commentPublic', comment_public,
                'commentPrivate', comment_private					 
            )
              from evaluator_tbl
              inner join user_tbl on evaluator_tbl.evaluator_id = user_tbl.id 
              where evaluator_tbl.evaluation_id = et3.id and evaluation_order = 2),
      
          -- Data summary department
          'summaryDepartment',
          ( 
              select  
                jsonb_build_object(
                'evaluationId', evaluation_id,
                'achievementPersonalTotalPointUser', sdt.achievement_personal_total_point_user,
                'achievementPersonalTotalPointEvaluator05', sdt.achievement_personal_total_point_evaluator_0_5,
                'achievementPersonalTotalPointEvaluator1', sdt.achievement_personal_total_point_evaluator_1,
                'achievementPersonalTotalPointEvaluator2', sdt.achievement_personal_total_point_evaluator_2,
                'achievementAdditionalTotalPointUser', sdt.achievement_additional_total_point_user,
                'achievementAdditionalTotalPointEvaluator05', sdt.achievement_additional_total_point_evaluator_0_5,
                'achievementAdditionalTotalPointEvaluator1', sdt.achievement_additional_total_point_evaluator_1,
                'achievementAdditionalTotalPointEvaluator2', sdt.achievement_additional_total_point_evaluator_2,
                'summaryPointUser', sdt.summary_point_user,
                'summaryPointEvaluator05', sdt.summary_point_evaluator_0_5,
                'summaryPointEvaluator1', sdt.summary_point_evaluator_1,
                'summaryPointEvaluator2', sdt.summary_point_evaluator_2,
                'summaryCharPointUser', sdt.summary_char_point_user,
                'summaryCharPointEvaluator05', sdt.summary_char_point_evaluator_0_5,
                'summaryCharPointEvaluator1', sdt.summary_char_point_evaluator_1,
                'summaryCharPointEvaluator2', sdt.summary_char_point_evaluator_2
            )
              from summary_department_tbl sdt 
              inner join evaluation_tbl on evaluation_tbl.id = sdt.evaluation_id
              where sdt.evaluation_id = et3.id),
      
          -- Data basic, behavior skill 
          'listBasicBehaviorSkill',
          ( 
              select jsonb_agg(row_to_json(t))
              from
                (
                  select
                    evaluation_id "evaluationId",
                    item_no "itemNo",
                    type,
                    item_title "itemTitle",
                    content,
                    difficulty,
                    point_user "pointUser",
                    point_evaluator_0_5 "pointEvaluator05",
                    point_evaluator_1 "pointEvaluator1",
                    point_evaluator_2 "pointEvaluator2"
                  from
                    evaluation_basic_behavior_tbl ebbt
                inner join evaluation_tbl on evaluation_tbl.id = ebbt.evaluation_id
                where ebbt.evaluation_id = et3.id
                  order by
                    item_no asc
                ) t
            ),
      
          -- Data pro skill
          'listProSKill',
          ( 
              select jsonb_agg(row_to_json(t))
              from
                (
                  select
                    job_type "jobType",
                    item_no "itemNo",
                    item_id "itemId",
                    item_title "itemTitle",
                    content,
                    difficulty,
                    point_user "pointUser",
                    point_evaluator_0_5 "pointEvaluator05",
                    point_evaluator_1 "pointEvaluator1",
                    point_evaluator_2 "pointEvaluator2",
                    total_point_user "totalPointUser",
                    total_point_evaluator_0_5 "totalPointEvaluator05",
                    total_point_evaluator_1 "totalPointEvaluator1",
                    total_point_evaluator_2 "totalPointEvaluator2",
                    note
                  from
                    evaluation_pro_tbl ept
                  inner join evaluation_tbl on evaluation_tbl.id = ept.evaluation_id
                where ept.evaluation_id = et3.id and ept.is_disable = false
                  order by
                    item_no asc
                ) t
            ),
      
          -- Data mục tiêu
          'listGoal',
          ( 
              select jsonb_agg(row_to_json(t))
              from
              (
                  select
                    type,
                    eapt.id as "id",
                    item_no as "itemNo",
                    eapt.title as "title",
                    achievement_value as "achievementValue",
                    method,
                    weight,
                    difficulty_user as "difficultyUser",
                    difficulty_evaluator_0_5 as "difficultyEvaluator05",
                    difficulty_evaluator_1 as "difficultyEvaluator1",
                    difficulty_evaluator_2 as "difficultyEvaluator2",
                    achievement_status as "achievementStatus",
                    reason_comment as "reasonComment",
                    action_plan as "actionPlan",
                    point_user as "pointUser",
                    coefficient_user as "coefficientUser",
                    point_evaluator_0_5 as "pointEvaluator05",
                    coefficient_evaluator_0_5 as "coefficientEvaluator05",
                    point_evaluator_1 as "pointEvaluator1",
                    coefficient_evaluator_1 as "coefficientEvaluator1",
                    point_evaluator_2 as "pointEvaluator2",
                    coefficient_evaluator_2 as "coefficientEvaluator2",
                    (
                      select
                        jsonb_agg(row_to_json(t1))
                      from
                        (
                          select
                            id,
                            achievement_personal_id as "achievementPersonalId",
                            coefficient::numeric(5,1)::varchar,
                            evaluation_decision as "evaluationDecision",
                            evaluation_decision as "note",
                            degree,
                            created_time as "createdTime",
                            updated_time as "updatedTime"
                          from
                            evaluation_achievement_personal_sub_tbl eapst2
                          where
                            eapst2.achievement_personal_id = eapt.id
                          order by
                            coefficient desc
                        ) t1
                    ) as "goalSub"
                  from
                    evaluation_achievement_personal_tbl eapt
                inner join evaluation_tbl on evaluation_tbl.id = eapt.evaluation_id
                where eapt.evaluation_id = et3.id
                  order by
                    item_no asc
                ) t
            ),
      
          -- Data mục tiêu thêm
          'listGoalAdditional',
          ( 
              select jsonb_agg(row_to_json(t))
              from
                (
                  select
                    type,
                    evaluation_id as "evaluationId",
                    item_no as "itemNo",
                    title_additional as "titleAdditional",
                    achievement_status as "achievementStatus",
                    reason_comment as "reasonComment",
                    point_user as "pointUser",
                    point_evaluator_0_5 as "pointEvaluator05",
                    point_evaluator_1 as "pointEvaluator1",
                    point_evaluator_2 as "pointEvaluator2",
                    evaluation_order as "evaluationOrder"
                  from
                    evaluation_achievement_additional_tbl eaat
                inner join evaluation_tbl on evaluation_tbl.id = eaat.evaluation_id
                where eaat.evaluation_id = et3.id
                  order by
                    item_no asc
                ) t
            )
          
      ) order by to_date(et3.period_end,'YYYY/MM') DESC)
              from evaluation_tbl et3
                inner join user_tbl ut3 on et3.user_id=ut3.id
                inner join evaluation_period_tbl ept3 on et3.evaluation_period_id= ept3.id
              left join summary_department_tbl sdt3 on sdt3.evaluation_id=et3.id
                where et3.id= any(array_agg(et.id)))
              else null end "childs"
      from
        evaluation_tbl et
      inner join user_tbl ut on
        et.user_id = ut.id
      inner join evaluation_period_tbl ept on
        et.evaluation_period_id = ept.id 
      inner join evaluator_default_tbl edt on
      edt.evaluation_period_id =ept.id and edt.user_id =ut.id
      left join summary_department_tbl sdt on
        sdt.evaluation_id =et.id
      where ept."year" like :year and ept."period_index"= :periodIndex 
      and (ut.email ilike :email or ut.full_name ilike :email or ut.employee_number ilike :email)

      and et.company_group_code like :companyGroupCode

      group by ut.full_name,
        ut.employee_number, ept.id 
      having array_agg(et.status) && :status::smallint[]
      and array_agg(et.level) && :level::smallint[]
      and case when :departmentType = 0 then (array_agg(et.department_name)::text[] && :departmentName)
      when :departmentType = 1 then array_agg(et.division_name)::text[] && :departmentName else true end;
`, {
            replacements: {
                email: `%${email}%`,
                year: year,
                periodIndex: periodIndex,
                level: `{${salaryRank.join(',')}}`,
                departmentName: `{${[departmentName].join(',')}}`,
                status: `{${status.join(',')}}`,
                companyGroupCode: companyGroupCode,
                departmentType: departmentType,
                timeZone: timeZone,
            },
            type: sequelize_1.QueryTypes.SELECT,
            nest: true,
            logging: false,
        }));
        return evaluationList;
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION),
    __metadata("design:type", Object)
], AdminEvaluationRepository.prototype, "evaluationRepository", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.USER),
    __metadata("design:type", Object)
], AdminEvaluationRepository.prototype, "userRepository", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_ACHIEVEMENT_PERSONAL),
    __metadata("design:type", Object)
], AdminEvaluationRepository.prototype, "settingAchievementPersonalRepository", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_ACHIEVEMENT_ADDITIONAL),
    __metadata("design:type", Object)
], AdminEvaluationRepository.prototype, "settingAchievementAdditionalRepository", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_FORMULA_8_10),
    __metadata("design:type", Object)
], AdminEvaluationRepository.prototype, "settingFormula810", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.VERSION_SETTING),
    __metadata("design:type", Object)
], AdminEvaluationRepository.prototype, "versionSettingEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_PERIOD),
    __metadata("design:type", Object)
], AdminEvaluationRepository.prototype, "evaluationPeriodRepository", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.HISTORY_FIX_EVALUATION),
    __metadata("design:type", Object)
], AdminEvaluationRepository.prototype, "historyFixEvaluation", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATOR_DEFAULT),
    __metadata("design:type", Object)
], AdminEvaluationRepository.prototype, "evaluatorDefault", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SKILL),
    __metadata("design:type", Object)
], AdminEvaluationRepository.prototype, "skillEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SKILL_ROLE),
    __metadata("design:type", Object)
], AdminEvaluationRepository.prototype, "skillRoleEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SKILL_GROUP),
    __metadata("design:type", Object)
], AdminEvaluationRepository.prototype, "skillGroupEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.DEPARTMENT),
    __metadata("design:type", Object)
], AdminEvaluationRepository.prototype, "departmentEntity", void 0);
AdminEvaluationRepository = __decorate([
    (0, common_1.Injectable)()
], AdminEvaluationRepository);
exports.AdminEvaluationRepository = AdminEvaluationRepository;
const isAllLowLevel = (currentValue) => {
    var _a;
    let isLowlevel = true;
    for (let i = 0; i < currentValue.length; i++) {
        if (((_a = currentValue[i]) === null || _a === void 0 ? void 0 : _a.level) > 7) {
            isLowlevel = false;
            break;
        }
    }
    return isLowlevel;
};
const isAllHighLevel = (currentValue) => {
    var _a;
    let isHightlevel = true;
    for (let i = 0; i < currentValue.length; i++) {
        if (((_a = currentValue[i]) === null || _a === void 0 ? void 0 : _a.level) < 8) {
            isHightlevel = false;
            break;
        }
    }
    return isHightlevel;
};
const summaryPointEvaluator2 = (currentValue) => {
    let totalSum = 0;
    let isNull = false;
    currentValue.forEach((e) => {
        var _a;
        totalSum +=
            ((e.level <= 7
                ? e.summaryPointEvaluator2
                : (_a = e.summaryDepartment) === null || _a === void 0 ? void 0 : _a.summaryPointEvaluator2) *
                (e.percentPoint !== null ? e.percentPoint : 100)) /
                100;
    });
    currentValue.forEach((e) => {
        var _a;
        if ((e.level <= 7
            ? e.summaryPointEvaluator2
            : (_a = e.summaryDepartment) === null || _a === void 0 ? void 0 : _a.summaryPointEvaluator2) === null)
            isNull = true;
    });
    return isNull ? null : totalSum;
};
const findStringStatus = (dataList) => {
    let stringStatus;
    if (dataList.status !== 50) {
        stringStatus = statusEvaluation_1.statusEvaluation[dataList.status];
    }
    else {
        const today = moment().format('YYYY/MM/DD');
        if (dataList.evaluationPeriod) {
            if (!dataList.creationUser ||
                !dataList.dateEvaluationStart ||
                !dataList.dateEvaluationEnd)
                if (dataList.level < 8) {
                    if (today >=
                        moment(dataList.evaluationPeriod.dateEvaluationStart).format('YYYY/MM/DD') &&
                        today <=
                            moment(dataList.evaluationPeriod.dateEvaluationEnd).format('YYYY/MM/DD')) {
                        stringStatus = statusEvaluation_1.statusEvaluation[dataList.status].split('/')[1];
                    }
                    else
                        stringStatus = statusEvaluation_1.statusEvaluation[dataList.status].split('/')[0];
                }
                else {
                    if (today >=
                        moment(dataList.evaluationPeriod.dateEvaluationDepartmentStart).format('YYYY/MM/DD') &&
                        today <=
                            moment(dataList.evaluationPeriod.dateEvaluationDepartmentEnd).format('YYYY/MM/DD')) {
                        stringStatus = statusEvaluation_1.statusEvaluation[dataList.status].split('/')[1];
                    }
                    else
                        stringStatus = statusEvaluation_1.statusEvaluation[dataList.status].split('/')[0];
                }
            else {
                if (today >= moment(dataList.dateEvaluationStart).format('YYYY/MM/DD') &&
                    today <= moment(dataList.dateEvaluationEnd).format('YYYY/MM/DD')) {
                    stringStatus = statusEvaluation_1.statusEvaluation[dataList.status].split('/')[1];
                }
                else
                    stringStatus = statusEvaluation_1.statusEvaluation[dataList.status].split('/')[0];
            }
        }
    }
    return stringStatus;
};
function checkArray(arr) {
    const hasOneToSeven = arr.some((num) => num >= 1 && num <= 7);
    const hasEightToTen = arr.some((num) => num >= 8 && num <= 10);
    return hasOneToSeven && hasEightToTen;
}
//# sourceMappingURL=adminEvaluation.repository.js.map