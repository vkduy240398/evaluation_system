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
exports.SettingReviewRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const util_1 = require("../common/util");
const EntityConstant_1 = require("../constant/EntityConstant");
const Company_1 = require("../entity/Company");
const Department_1 = require("../entity/Department");
const Role_1 = require("../entity/Role");
const RuntimeException_1 = require("../model/exception/RuntimeException");
let SettingReviewRepository = class SettingReviewRepository {
    async searchListUserToSettingEvaluationHistoryReference(query) {
        var _a, _b, _c, _d, _e;
        const nameAndEmail = (_a = query.nameAndEmail) === null || _a === void 0 ? void 0 : _a.trim();
        const limit = query.limit;
        const offset = query.offset;
        const department = query.department;
        const companyGroupCode = query.companyGroupCode;
        const arrayWhere = [];
        arrayWhere.push({
            [sequelize_1.Op.and]: [
                {
                    [sequelize_1.Op.or]: [
                        {
                            employeeNumber: nameAndEmail
                                ? { [sequelize_1.Op.iLike]: `%${nameAndEmail}%` }
                                : { [sequelize_1.Op.not]: null },
                        },
                        {
                            fullName: nameAndEmail
                                ? { [sequelize_1.Op.iLike]: `%${nameAndEmail}%` }
                                : { [sequelize_1.Op.not]: null },
                        },
                        {
                            email: nameAndEmail
                                ? { [sequelize_1.Op.iLike]: `%${nameAndEmail}%` }
                                : { [sequelize_1.Op.not]: null },
                        },
                    ],
                },
            ],
        });
        if (department !== 'すべて') {
            if (parseInt((_b = department[2]) === null || _b === void 0 ? void 0 : _b.trim()) === 0) {
                arrayWhere.push({
                    departmentId: parseInt((_c = department[0]) === null || _c === void 0 ? void 0 : _c.trim()),
                });
            }
            else if (parseInt((_d = department[2]) === null || _d === void 0 ? void 0 : _d.trim()) === 1) {
                arrayWhere.push({
                    divisionId: parseInt((_e = department[0]) === null || _e === void 0 ? void 0 : _e.trim()),
                });
            }
        }
        const datas = await this.userEntity.findAndCountAll({
            attributes: ['id', 'employeeNumber', 'fullName', 'email', 'level'],
            where: {
                [sequelize_1.Op.and]: arrayWhere,
                active: 1,
                companyGroupCode: companyGroupCode,
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
                {
                    model: Company_1.Company,
                    as: 'company',
                    attributes: ['id', 'name'],
                },
                {
                    model: Role_1.Role,
                    as: 'rolesCondition',
                    through: { attributes: [] },
                    where: {
                        id: {
                            [sequelize_1.Op.in]: [1, 2, 3, 4, 5, 6, 7, 8],
                        },
                    },
                },
            ],
            order: [['employee_number', 'ASC']],
            distinct: true,
            offset: offset || 0,
            limit: limit || 20,
        });
        return { data: datas.rows, counts: datas.count };
    }
    async getAllUser(companyGroupCode) {
        return await this.userEntity.findAll({
            attributes: ['id', 'employeeNumber', 'fullName', 'level'],
            where: {
                active: 1,
                companyGroupCode: companyGroupCode,
            },
            include: [
                {
                    model: Department_1.Department,
                    as: 'department',
                    attributes: ['id', 'name'],
                },
                {
                    model: Department_1.Department,
                    as: 'division',
                    attributes: ['id', 'name'],
                },
                {
                    model: Role_1.Role,
                    as: 'rolesCondition',
                    through: { attributes: [] },
                    where: {
                        id: {
                            [sequelize_1.Op.in]: [1, 2, 3, 4, 5, 6, 7, 8],
                        },
                    },
                },
            ],
            order: [['employee_number', 'ASC']],
        });
    }
    generatePeriods(year, period, quantity) {
        if (quantity <= 0) {
            return [];
        }
        const result = [];
        result.push({ year: year, periodIndex: period });
        let currentYear = year;
        let currentPeriod = period;
        for (let i = 1; i < quantity; i++) {
            currentPeriod--;
            if (currentPeriod === 0) {
                currentYear--;
                currentPeriod = 2;
            }
            result.push({ year: currentYear, periodIndex: currentPeriod });
        }
        return result;
    }
    async addEditUser(data, companyGroupCode) {
        const viewer = data.viewer;
        const targetAudience = data.targetAudience;
        const viewPeriod = data.viewPeriod;
        const viewRange = data.viewRange;
        const year = data.year;
        const order = data.order;
        const periodIndex = data.periodIndex;
        const typeAction = data.typeAction;
        const listId = data.listId;
        let isCheck = false;
        if (typeAction === 'edit') {
            const isDelete = await this.settingReviewEnity.findAll({
                where: {
                    id: listId,
                },
            });
            if (isDelete.length > 0) {
                isCheck = true;
            }
        }
        else {
            isCheck = true;
        }
        if (isCheck) {
            const listYearAndPeriod = this.generatePeriods(year, periodIndex, viewPeriod);
            const listUser = [];
            targetAudience.map((item) => {
                listUser.push({
                    userId: item,
                });
            });
            const listViewer = [];
            viewer.map((item) => {
                listViewer.push({
                    userId: item,
                    order: 0.0,
                });
            });
            const yearAndPeriodArray = listYearAndPeriod
                .map((item) => `ROW(${item === null || item === void 0 ? void 0 : item.year}, ${item === null || item === void 0 ? void 0 : item.periodIndex})`)
                .join(',');
            const viewerArray = listViewer
                .map((item) => `ROW(${item === null || item === void 0 ? void 0 : item.userId}, '${item === null || item === void 0 ? void 0 : item.order}')`)
                .join(',');
            const userArray = listUser
                .map((item) => `ROW(${item === null || item === void 0 ? void 0 : item.userId})`)
                .join(',');
            await this.settingReviewEnity.sequelize.query(`
      CALL add_edit_setting_evaluation_reference(
        ARRAY[${yearAndPeriodArray}]::evaluation_period_type[],
        ARRAY[${viewerArray}]::role_evaluator_type[],
        ARRAY[${userArray}]::role_user_type[],
        :role,
        :companyGroupCode,
        :type,
        :order,
        :typeRegister
      )
    `, {
                replacements: {
                    role: 'f6',
                    companyGroupCode: companyGroupCode,
                    type: viewRange,
                    order: order,
                    typeRegister: 'manual',
                },
                logging: false,
                type: sequelize_1.QueryTypes.RAW,
            });
            return true;
        }
        else {
            throw new RuntimeException_1.RuntimeException('List id not exit', 409);
        }
    }
    async getListDepartment(companyGroupCode) {
        return await this.departmentEnity.findAll({
            where: { active: 1, companyGroupCode: companyGroupCode },
        });
    }
    async deleteSettingHistoryReference(arrayIds) {
        return await this.settingReviewEnity.destroy({
            where: {
                id: { [sequelize_1.Op.in]: [...arrayIds] },
            },
        });
    }
    async getListSettingReviewHistory(condition, companyGroupCode, timeZone) {
        var _a;
        const limit = 20;
        const offset = (condition.page - 1) * limit;
        const currentPeriod = (0, util_1.getPeriodCurrent)(null, timeZone);
        const datas = await this.settingReviewEnity.sequelize.query(`


select
	count(*) over() count,
	concat(ut.employee_number,
	': ' ,
	ut.full_name) "user",
	ut.id "user_id",
	dt.name "department_user",
	dt2.name "division_user",
	concat(ut2.employee_number,
	': ' ,
	ut2.full_name) "viewer",
	ut2.id "viewer_id",
	dt3.name "department_viewer",
	dt4.name "division_viewer",
	srt.type,
	concat(count(srt.evaluation_period_id),
	'期分\r\n',
	'（',
	(
	select
		year
	from
		evaluation_period_tbl
	where
		id = min(srt.evaluation_period_id)
    ),
	case
		when (
		select
			period_index
		from
			evaluation_period_tbl
		where
			id = min(srt.evaluation_period_id)
    )= 1 then '年上期'
		else '年下期'
	end,
	'～',
	(
	select
		year
	from
		evaluation_period_tbl
	where
		id = max(srt.evaluation_period_id)
    ),
	case
		when (
		select
			period_index
		from
			evaluation_period_tbl
		where
			id = max(srt.evaluation_period_id)
    )= 1 then '年上期'
		else '年下期'
	end,
	'）') "rangePeriod",
	jsonb_agg(srt.id) "ListHistoryId" ,
	srt."order",
	( case
		when exists (
		select
			1
		from
			evaluator_tbl et
		inner join evaluation_tbl et2 on
			et.evaluation_id = et2.id
		inner join evaluation_period_tbl ept2 on
			et2.evaluation_period_id = ept2.id
		where
			ept2.year = :current_period_year
			and ept2.period_index = :current_period_index
			and et.evaluator_id = srt.viewer_id
			and et2.user_id = srt.user_id)then true
		else false
	end and case when exists (select 1 from evaluator_default_tbl edt inner join evaluation_period_tbl ept3 on
			edt.evaluation_period_id = ept3.id
		where
			ept3.year = :current_period_year
			and ept3.period_index = :current_period_index and edt.user_id=ut.id ) then true else false end) "evaluation_evaluators",
	(
	select
		year
	from
		evaluation_period_tbl
	where
		id = max(srt.evaluation_period_id)) "maxYear",
		(
	select
		period_index
	from
		evaluation_period_tbl
	where
		id = max(srt.evaluation_period_id)) "maxYearPeriod"
from
	setting_review_tbl srt
inner join user_tbl ut on
	srt.user_id = ut.id and ut.active = 1
left join department_tbl dt on
	dt.id = ut.department_id
left join department_tbl dt2 on
	dt2.id = ut.division_id
inner join user_tbl ut2 on
	srt.viewer_id = ut2.id and ut2.active = 1
left join department_tbl dt3 on
	dt3.id = ut2.department_id
left join department_tbl dt4 on
	dt4.id = ut2.division_id
inner join evaluation_period_tbl ept on
	srt.evaluation_period_id = ept.id 
	
where (coalesce(dt.id,-1)= coalesce(:depDivAudience,dt.id,-1) or coalesce(dt2.id,-1)= coalesce(:depDivAudience,dt2.id,-1))
and (coalesce(dt3.id,-1)= coalesce(:depDivViewer,dt3.id,-1) or coalesce(dt4.id,-1)= coalesce(:depDivViewer,dt4.id,-1))
and (ut.full_name ilike coalesce(:targetAudience,'%%') or ut.email ilike coalesce(:targetAudience,'%%') or ut.employee_number ilike coalesce(:targetAudience,'%%'))
and (ut2.full_name ilike coalesce(:viewer,'%%') or ut2.email ilike coalesce(:viewer,'%%') or ut2.employee_number ilike coalesce(:viewer,'%%'))
and case when :matchDepartment = 1 then dt2.id=dt4.id when :matchDepartment = 0 then dt2.id != dt4.id else true end
and srt.company_group_code like :companyGroupCode

group by ut.employee_number,
ut.full_name,
dt.name,
dt2.name,
ut2.employee_number,
ut2.full_name,
dt3.name,
dt4.name,
srt.type,
srt."order",
srt.viewer_id,
srt.user_id,
ut.id,
ut2.id

limit :limit
offset :offset

    `, {
            type: sequelize_1.QueryTypes.SELECT,
            logging: false,
            replacements: {
                depDivAudience: (condition === null || condition === void 0 ? void 0 : condition.depDivAudience) || null,
                depDivViewer: (condition === null || condition === void 0 ? void 0 : condition.depDivViewer) || null,
                targetAudience: `%${condition.targetAudience}%`,
                viewer: `%${condition.viewer}%`,
                matchDepartment: (condition === null || condition === void 0 ? void 0 : condition.matchDepartment) || null,
                limit,
                offset: offset,
                companyGroupCode: companyGroupCode,
                current_period_year: `${currentPeriod.year}`,
                current_period_index: currentPeriod.periodIndex,
            },
        });
        return {
            data: datas,
            counts: ((_a = datas[0]) === null || _a === void 0 ? void 0 : _a.count) || 0,
            pageSize: limit,
        };
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_REVIEW),
    __metadata("design:type", Object)
], SettingReviewRepository.prototype, "settingReviewEnity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.DEPARTMENT),
    __metadata("design:type", Object)
], SettingReviewRepository.prototype, "departmentEnity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.USER),
    __metadata("design:type", Object)
], SettingReviewRepository.prototype, "userEntity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.EVALUATION_PERIOD),
    __metadata("design:type", Object)
], SettingReviewRepository.prototype, "periodEntity", void 0);
SettingReviewRepository = __decorate([
    (0, common_1.Injectable)()
], SettingReviewRepository);
exports.SettingReviewRepository = SettingReviewRepository;
//# sourceMappingURL=settingReview.repository.js.map