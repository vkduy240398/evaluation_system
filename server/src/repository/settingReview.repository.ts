import { Inject, Injectable } from '@nestjs/common';
import { QueryTypes, Op } from 'sequelize';
import { EvaluationPeriodHelper } from 'src/common/datetime/EvaluationPeriodHelper';
import { getPeriodCurrent } from 'src/common/util';
import EntityConstant from 'src/constant/EntityConstant';
import { Company } from 'src/entity/Company';
import { Department } from 'src/entity/Department';
import { EvaluationPeriod } from 'src/entity/EvaluationPeriod';
import { Role } from 'src/entity/Role';
import { SettingReview } from 'src/entity/SettingReview';
import { User } from 'src/entity/User';
import { RuntimeException } from 'src/model/exception/RuntimeException';
@Injectable()
export class SettingReviewRepository {
  @Inject(EntityConstant.SETTING_REVIEW)
  private settingReviewEnity: typeof SettingReview;

  @Inject(EntityConstant.DEPARTMENT)
  private departmentEnity: typeof Department;

  @Inject(EntityConstant.USER)
  private userEntity: typeof User;

  @Inject(EntityConstant.EVALUATION_PERIOD)
  private periodEntity: typeof EvaluationPeriod;

  async searchListUserToSettingEvaluationHistoryReference(query: any) {
    const nameAndEmail = query.nameAndEmail?.trim();
    const limit = query.limit;
    const offset = query.offset;
    const department = query.department;
    const companyGroupCode = query.companyGroupCode;
    const arrayWhere = [];

    arrayWhere.push({
      [Op.and]: [
        {
          [Op.or]: [
            {
              employeeNumber: nameAndEmail
                ? { [Op.iLike]: `%${nameAndEmail}%` }
                : { [Op.not]: null },
            },
            {
              fullName: nameAndEmail
                ? { [Op.iLike]: `%${nameAndEmail}%` }
                : { [Op.not]: null },
            },
            {
              email: nameAndEmail
                ? { [Op.iLike]: `%${nameAndEmail}%` }
                : { [Op.not]: null },
            },
          ],
        },
      ],
    });

    if (department !== 'すべて') {
      if (parseInt(department[2]?.trim()) === 0) {
        arrayWhere.push({
          departmentId: parseInt(department[0]?.trim()), // get department id
        });
      } else if (parseInt(department[2]?.trim()) === 1) {
        arrayWhere.push({
          divisionId: parseInt(department[0]?.trim()), // get division id
        });
      }
    }

    const datas = await this.userEntity.findAndCountAll({
      attributes: ['id', 'employeeNumber', 'fullName', 'email', 'level'],
      where: {
        [Op.and]: arrayWhere,
        active: 1,
        companyGroupCode: companyGroupCode,
      },
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'code', 'name'],
        },
        {
          model: Department,
          as: 'division',
          attributes: ['id', 'code', 'name'],
        },
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name'],
        },
        {
          model: Role,
          as: 'rolesCondition',
          through: { attributes: [] },
          where: {
            id: {
              [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8],
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

  async getAllUser(companyGroupCode: string) {
    return await this.userEntity.findAll({
      attributes: ['id', 'employeeNumber', 'fullName', 'level'],
      where: {
        active: 1,
        companyGroupCode: companyGroupCode,
      },
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name'],
        },
        {
          model: Department,
          as: 'division',
          attributes: ['id', 'name'],
        },

        {
          model: Role,
          as: 'rolesCondition',
          through: { attributes: [] },
          where: {
            id: {
              [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8],
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

  async addEditUser(data: any, companyGroupCode: string) {
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
    } else {
      isCheck = true;
    }

    if (isCheck) {
      //* list evaluation period
      const listYearAndPeriod = this.generatePeriods(
        year,
        periodIndex,
        viewPeriod,
      );

      //* list user
      const listUser = [];
      targetAudience.map((item: any) => {
        listUser.push({
          userId: item,
        });
      });

      //* list view
      const listViewer = [];
      viewer.map((item: any) => {
        listViewer.push({
          userId: item,
          order: 0.0, //* giá trị ngẫu nhiên không ảnh hưởng
        });
      });

      //* Chuyển đổi các mảng thành định dạng array PostgreSQL
      const yearAndPeriodArray = listYearAndPeriod
        .map((item) => `ROW(${item?.year}, ${item?.periodIndex})`)
        .join(',');
      const viewerArray = listViewer
        .map((item) => `ROW(${item?.userId}, '${item?.order}')`)
        .join(',');
      const userArray = listUser
        .map((item) => `ROW(${item?.userId})`)
        .join(',');

      await this.settingReviewEnity.sequelize.query(
        `
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
    `,
        {
          replacements: {
            role: 'f6',
            companyGroupCode: companyGroupCode,
            type: viewRange,
            order: order,
            typeRegister: 'manual',
          },
          logging: false,
          type: QueryTypes.RAW,
        },
      );

      return true;
    } else {
      throw new RuntimeException('List id not exit', 409);
    }
  }

  async getListDepartment(companyGroupCode: string) {
    return await this.departmentEnity.findAll({
      where: { active: 1, companyGroupCode: companyGroupCode },
    });
  }

  async deleteSettingHistoryReference(arrayIds: number[]) {
    return await this.settingReviewEnity.destroy({
      where: {
        id: { [Op.in]: [...arrayIds] },
      },
    });
  }
  async getListSettingReviewHistory(
    condition: {
      depDivAudience: number | string;
      depDivViewer: number | string;
      matchDepartment: number | string;
      targetAudience?: string;
      viewer?: string;
      page: number;
    },
    companyGroupCode: string,
    timeZone: string,
  ) {
    const limit = 20;
    const offset = (condition.page - 1) * limit;
    const currentPeriod = getPeriodCurrent(null, timeZone);
    const datas: any[] = await this.settingReviewEnity.sequelize.query(
      `


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

    `,
      {
        type: QueryTypes.SELECT,
        logging: false,
        replacements: {
          depDivAudience: condition?.depDivAudience || null,
          depDivViewer: condition?.depDivViewer || null,
          targetAudience: `%${condition.targetAudience}%`,
          viewer: `%${condition.viewer}%`,
          matchDepartment: condition?.matchDepartment || null,
          limit,
          offset: offset,
          companyGroupCode: companyGroupCode,
          current_period_year: `${currentPeriod.year}`,
          current_period_index: currentPeriod.periodIndex,
        },
      },
    );

    // ===========================================
    return {
      data: datas,
      counts: datas[0]?.count || 0,
      pageSize: limit,
    };
  }
}
