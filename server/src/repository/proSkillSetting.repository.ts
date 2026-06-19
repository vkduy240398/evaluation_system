import { Inject, Injectable } from '@nestjs/common';
import { Op, QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import EntityConstant from 'src/constant/EntityConstant';
import { Department } from 'src/entity/Department';
import { DivisionSubclass } from 'src/entity/DivisionSubclass';
import { HistoryApproveProSkill } from 'src/entity/HistoryApproveProSkill';
import { ListProSkill } from 'src/entity/ListProSkill';
import { Skill } from 'src/entity/Skill';
import { SkillRole } from 'src/entity/SkillRole';
import { User } from 'src/entity/User';
import { VersionProSkill } from 'src/entity/VersionProSkill';
import { ProSkillSettingRepositoryI } from 'src/interfaces/repository/proSkillSetting.interface';

@Injectable()
export class ProSkillSettingRepository implements ProSkillSettingRepositoryI {
  @Inject(EntityConstant.VERSION_PRO_SKILL)
  private versionProSkillEntity: typeof VersionProSkill;

  @Inject(EntityConstant.LIST_PRO_SKILL)
  private listProSkillEntiny: typeof ListProSkill;

  @Inject(EntityConstant.HISTORY_APPROVE_PRO_SKILL)
  private historyApproveProSkillEntiny: typeof HistoryApproveProSkill;

  @Inject(EntityConstant.DIVISION_SUBCLASS)
  private divisionSubclassEntity: typeof DivisionSubclass;
  @Inject(EntityConstant.SKILL_ROLE)
  private skillRoleEntity: typeof SkillRole;

  async getSkillRoleUser(
    userId: number,
    companyGroupCode: string,
  ): Promise<any> {
    const datas = await this.skillRoleEntity.findAll({
      where: {
        userId: userId,
        role: 1,
      },
      include: {
        model: Skill,
        where: { active: 1, companyGroupCode: companyGroupCode },
      },
      order: [['id', 'ASC']],
    });
    return datas;
  }

  async getVersionProSkill(
    companyGroupCode: string,
    status: string,
    offset: number,
    limit: number,
    publicStatus: number,
    listSkillId: number[],
    type: string,
  ): Promise<{
    data: VersionProSkill[];
    total: number;
  }> {
    const whereStatus =
      parseInt(status) !== -1 ? [parseInt(status)] : [1, 2, 3, 4, 5];

    const where = {
      [Op.and]: [
        {
          skillId: { [Op.in]: listSkillId },
        },
        {
          status: {
            [Op.in]: type === '1' ? whereStatus : [4],
          },
        },
        {
          ...(publicStatus &&
            publicStatus != -1 && { publicStatus: publicStatus }),
        },
        {
          companyGroupCode: companyGroupCode,
        },
      ],
    };

    const results = await this.versionProSkillEntity.findAll({
      attributes: [
        'id',
        'version',
        'subVersion',
        'status',
        'publicStatus',
        'publicDate',
        'updatedTime',
        'lastUpdatedTime',
      ],
      where: where,
      include: [
        {
          model: Skill,
          as: 'skill',
          attributes: ['id', 'name'],
          where: {
            active: 1,
            companyGroupCode: companyGroupCode,
          },
        },

        { model: User, attributes: ['fullName'] },
      ],
      order: [[{ model: Skill, as: 'skill' }, 'name', 'ASC']],
      // distinct: true,
      limit: limit,
      offset: offset,
    });

    const count = await this.versionProSkillEntity.count({
      where: where,
    });

    return { data: results, total: count };
  }

  async detailProSkill(versionId: number): Promise<ListProSkill[]> {
    const datas = await this.listProSkillEntiny.findAll({
      include: [
        {
          model: VersionProSkill,
          as: 'versionProSkill',
          required: true,
          where: {
            id: versionId,
          },

          include: [
            {
              model: Skill,
              attributes: ['id', 'name'],
              include: [
                {
                  model: SkillRole,
                  attributes: ['id', 'userId', 'role'],
                  include: [
                    {
                      model: User,
                      as: 'user',
                      attributes: ['id', 'fullName'],
                    },
                  ],
                },
              ],
            },
            {
              model: User,
              as: 'user',
              attributes: ['id', 'fullName'],
            },
          ],
        },
      ],
      order: [['id', 'ASC']],
    });
    return datas;
  }

  async getDetailProSkillF3(versionId: number): Promise<any> {
    const result = await this.versionProSkillEntity.findOne({
      where: { id: versionId },
      include: [
        {
          model: Skill,
          attributes: ['id', 'name', 'active'],
          include: [
            {
              model: SkillRole,
              attributes: ['id', 'userId', 'role'],
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['id', 'fullName'],
                },
              ],
            },
          ],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName'],
        },
        {
          model: ListProSkill,
          attributes: [
            'id',
            'itemId',
            'jobType',
            'smallClass',
            'mediumClass',
            'content',
            'difficulty',
            'note',
          ],
          as: 'listProSkills',
          order: ['id', 'ASC'],
          required: false,
        },
      ],
      order: [[{ model: ListProSkill, as: 'listProSkills' }, 'id', 'ASC']],
    });

    return result;
  }

  async getProskillSettersAndApproversForDepartmentId(
    skillId: number,
  ): Promise<any> {
    const datas = await this.skillRoleEntity.findAll({
      where: { skillId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName'],
        },
      ],
      order: [['userId', 'ASC']],
    });

    return datas;
  }

  async getDetailProSkillGeneric(versionId: number, companyGroupCode?: string) {
    const result = await this.versionProSkillEntity.findOne({
      where: {
        id: versionId,
        ...(companyGroupCode !== undefined && { companyGroupCode }),
      },
      include: [
        {
          model: Skill,
          as: 'skill',
          attributes: ['id', 'name'],
          include: [
            {
              model: SkillRole,
              as: 'skillRoles',
              attributes: ['id', 'userId', 'role'],
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['id', 'fullName'],
                },
              ],
            },
          ],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName'],
        },
      ],
    });

    return result;
  }

  async getVersionPublic(
    skillId: number,
    companyGroupCode: string,
  ): Promise<ListProSkill[]> {
    const datas = await this.listProSkillEntiny.findAll({
      include: [
        {
          model: VersionProSkill,
          as: 'versionProSkill',
          required: true,
          where: {
            publicStatus: 1,
            skillId: skillId,
            companyGroupCode: companyGroupCode,
          },
        },
      ],
    });

    return datas;
  }

  async getVersionProSkillDepartment(
    skillId: number,
    offset: number,
    limit: number,
    companyGroupCode?: string,
  ) {
    const where = {
      ...(skillId != -1 && { skillId: skillId }),
      ...(companyGroupCode !== undefined && { companyGroupCode }),
      publicStatus: 1,
    };

    const results = await this.versionProSkillEntity.findAndCountAll({
      attributes: [
        'id',
        'version',
        'subVersion',
        'status',
        'publicStatus',
        'publicDate',
        'updatedTime',
        'lastUpdatedTime',
      ],

      where: where,
      include: [
        {
          model: Skill,
          attributes: ['id', 'name'],
          where: {
            active: 1,
          },
        },
        { model: User, attributes: ['fullName'] },
      ],
      order: [
        [{ model: Skill, as: 'skill' }, 'name', 'ASC'],
        ['version', 'DESC'],
        ['subVersion', 'DESC'],
      ],
      limit: limit,
      offset: offset,
    });

    return { data: results.rows, total: results.count };
  }

  async findOneVersion(object: { [x: string]: any }): Promise<any> {
    return await this.versionProSkillEntity.findOne({
      where: object,
      include: [
        {
          model: Skill,
          include: [
            {
              model: SkillRole,
              attributes: ['id', 'userId', 'role'],
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['id', 'fullName'],
                },
              ],
            },
          ],
        },
        { model: User, as: 'user' },
      ],
      attributes: { exclude: ['creation_user', 'department_id'] },
    });
  }

  async findMax(
    version: number,
    skillId: number,
    companyGroupCode: string,
  ): Promise<number> {
    const num: number = await this.versionProSkillEntity.max('subVersion', {
      where: {
        version: version,
        skillId: skillId,
        companyGroupCode: companyGroupCode,
      },
    });
    return num;
  }

  async createNewVersionSaveDraft(
    data: any,
    transaction: any,
  ): Promise<VersionProSkill> {
    const results = await this.versionProSkillEntity.create(data, {
      transaction: transaction,
    });
    return results;
  }

  async createMultipleData(data: any[], transaction: any) {
    return await this.listProSkillEntiny.bulkCreate(data, {
      transaction: transaction,
    });
  }

  async updatedVersion(versionId, objectUpdate, transaction: any) {
    const results = (
      await this.versionProSkillEntity
        .update(objectUpdate, {
          where: {
            id: versionId,
          },
          returning: true,
          transaction: transaction,
        })
        .then(([_, data]) => data)
    ).map(
      (data) => data && data.get({ plain: true }),
    ) as unknown as VersionProSkill[];

    return results;
  }

  async deleteListProSkill(versionId: number, transaction: any) {
    return await this.listProSkillEntiny.destroy({
      where: {
        versionId: versionId,
      },
      transaction: transaction,
    });
  }

  async cancelVersionProSkill(versionId: number, _userId: number) {
    return await this.versionProSkillEntity.update(
      {
        status: 2,
        // creationUser: userId,
        // lastUpdatedTime: isFormatDate(new Date(), 'YYYY/M/D H:mm'),
      },
      {
        where: {
          id: versionId,
        },
        returning: true,
      },
    );
  }
  async getHistoryApproveContent(versionId: number, _userId: number) {
    return await this.historyApproveProSkillEntiny.findAll({
      where: { versionId: versionId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName'],
        },
      ],
      order: [['createdTime', 'DESC']],
    });
  }

  async getSkillRole(skillId: number, userId: number) {
    return await this.skillRoleEntity.findAll({
      where: { skillId: skillId, userId: userId },
    });
  }

  async getDetailProSkill(
    versionId: number,
    companyGroupCode?: string,
  ): Promise<VersionProSkill> {
    const result = await this.versionProSkillEntity.findOne({
      where: {
        id: versionId,
        ...(companyGroupCode !== undefined && { companyGroupCode }),
      },
      include: [
        {
          model: Skill,
          attributes: ['id', 'name'],
          where: { active: 1 },
        },
      ],
    });

    return result;
  }

  async getRoleUser(skillId: number, userId: number): Promise<any> {
    return await this.skillRoleEntity.findOne({
      where: {
        [Op.and]: [
          {
            skillId: skillId,
          },
          {
            userId: userId,
          },
          { role: 1 },
        ],
      },
      include: [
        {
          model: Skill,
          attributes: ['id', 'name', 'active'],
        },
      ],
    });
  }

  async getListProSkillByVersionId(versionId: number) {
    const results = await this.listProSkillEntiny.findAll({
      where: { versionId: versionId },
      attributes: [
        'itemId',
        'versionId',
        'jobType',
        'mediumClass',
        'smallClass',
        'content',
        'difficulty',
        'note',
      ],
      order: [['id', 'ASC']],
      raw: true,
    });

    return results;
  }

  async getDivSubClassByDepartmentId(departmentId: number) {
    const result = await this.divisionSubclassEntity.findOne({
      where: { departmentId: departmentId },
      include: {
        model: Department,
        as: 'division',
        attributes: ['id', 'code', 'name'],
      },
    });

    return result;
  }

  async getDivSubClassByGroupId(groupId: number) {
    const results = await this.divisionSubclassEntity.findAll({
      where: { divisionId: groupId },
      attributes: [],
      include: {
        model: Department,
        as: 'department',
        attributes: ['id', 'code', 'name'],
        required: true,
      },
    });

    return results;
  }

  async findAllVersionWaiting(object: { [x: string]: any }): Promise<number> {
    return await this.versionProSkillEntity.count({
      where: object,
    });
  }

  async findDepartmentRoleByDepartmentId(skillId: number, role: number) {
    return await this.skillRoleEntity.findAll({
      where: { skillId: skillId, role: role },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['fullName', 'email', 'id'],
        },
      ],
    });
  }

  async checkPermissionSetterOfDepartment(userId: number, skillId: number) {
    const result = await this.skillRoleEntity.count({
      where: {
        [Op.and]: [
          {
            skillId: skillId,
            role: 1,
            userId: userId,
          },
        ],
      },
    });
    return result;
  }
  async getTransactionVersionProSkill() {
    return await this.versionProSkillEntity.sequelize.transaction();
  }
  async getTransactionListProSkill() {
    return await this.listProSkillEntiny.sequelize.transaction();
  }

  async detailProSkillByCondition(where: {
    [x: string]: any;
  }): Promise<VersionProSkill[]> {
    const datas = await this.versionProSkillEntity.findAll({
      where: where,
      include: [
        {
          model: Skill,
          as: 'skill',
          attributes: ['id', 'name'],
          where: {
            active: 1,
          },
        },
      ],
    });

    return datas;
  }
  async listProSkillF3New(
    companyGroupCode: string,
    skillId: number,
    offset: number,
    limit: number,
    userId: number,
  ) {
    skillId = Number(skillId) == -1 ? null : skillId;
    const datas = await this.listProSkillEntiny.sequelize.query(
      `
select
	*
from
	(
	select
		version_pro_skill_tbl.company_group_code ,
		version_pro_skill_tbl.id,
		md5(random()::text) as key,
		skill_tbl.id as skill_id,
		skill_tbl.name as skill_name
,
		version,
		sub_version,
		public_date,
		public_status,
		last_updated_time,
		version_pro_skill_tbl.updated_time,
		user_tbl.full_name,
		status
	from
		version_pro_skill_tbl
	inner join skill_tbl on
		version_pro_skill_tbl.skill_id = skill_tbl.id
		and skill_tbl.active = 1
	inner join skill_role_tbl on
		version_pro_skill_tbl.skill_id =
skill_role_tbl.skill_id
	left join user_tbl on
		version_pro_skill_tbl.creation_user = user_tbl.id
	where
		user_id = :userId
		and role = 1
		and (status = 5
			or status = 1)
union
	select
		skill_tbl.company_group_code ,
		(
		select
			id
		from
			version_pro_skill_tbl
		where
			public_status = 1
			and skill_id = skill_tbl.id
		limit 1 ) as id,
		md5(random()::text) as key,
		skill_tbl.id as skill_id,
		skill_tbl.name as skill_name
,
		null as version,
		null as sub_version,
		null as public_date,
		null as public_status,
		null as last_updated_time,
		null as updated_time,
		null as full_name,
		null as status
	from
		skill_tbl
	left join skill_role_tbl on
		skill_tbl.id = skill_role_tbl.skill_id
	where
		skill_tbl.id not in (
		select
			distinct skill_id
		from
			version_pro_skill_tbl
		where
			status in (1, 3, 5)
				or public_status = 2 )
		and active = 1
		and user_id = :userId
		and role = 1
	group by
		skill_tbl.name,
		skill_tbl.id) as temp
where
	skill_id = coalesce(:skillId,
	skill_id) and company_group_code like :companyGroupCode
order by
	skill_id asc offset :offset
limit :limit
    `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          companyGroupCode: companyGroupCode,
          userId: userId,
          skillId: skillId,
          offset: offset,
          limit: limit,
        },
        logging: false,
      },
    );
    const totals: any = await this.listProSkillEntiny.sequelize.query(
      `
select count(*) as total
from
	(
	select
		version_pro_skill_tbl.company_group_code ,
		version_pro_skill_tbl.id,
		md5(random()::text) as key,
		skill_tbl.id as skill_id,
		skill_tbl.name as skill_name
,
		version,
		sub_version,
		public_date,
		public_status,
		last_updated_time,
		version_pro_skill_tbl.updated_time,
		user_tbl.full_name,
		status
	from
		version_pro_skill_tbl
	inner join skill_tbl on
		version_pro_skill_tbl.skill_id = skill_tbl.id
		and skill_tbl.active = 1
	inner join skill_role_tbl on
		version_pro_skill_tbl.skill_id =
skill_role_tbl.skill_id
	left join user_tbl on
		version_pro_skill_tbl.creation_user = user_tbl.id
	where
		user_id = :userId
		and role = 1
		and (status = 5
			or status = 1)
union
	select
		skill_tbl.company_group_code ,
		(
		select
			id
		from
			version_pro_skill_tbl
		where
			public_status = 1
			and skill_id = skill_tbl.id
		limit 1 ) as id,
		md5(random()::text) as key,
		skill_tbl.id as skill_id,
		skill_tbl.name as skill_name
,
		null as version,
		null as sub_version,
		null as public_date,
		null as public_status,
		null as last_updated_time,
		null as updated_time,
		null as full_name,
		null as status
	from
		skill_tbl
	left join skill_role_tbl on
		skill_tbl.id = skill_role_tbl.skill_id
	where
		skill_tbl.id not in (
		select
			distinct skill_id
		from
			version_pro_skill_tbl
		where
			status in (1, 3, 5)
				or public_status = 2 )
		and active = 1
		and user_id = :userId
		and role = 1
	group by
		skill_tbl.name,
		skill_tbl.id) as temp
where
	skill_id = coalesce(:skillId,
	skill_id) and company_group_code like :companyGroupCode
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          userId: userId,
          skillId: skillId,
          companyGroupCode: companyGroupCode,
        },
      },
    );

    return { data: datas, counts: totals[0].total };
  }

  async getRejectComment(versionId: any) {
    const maxId = await this.historyApproveProSkillEntiny.max('id', {
      where: {
        [Op.and]: [
          {
            versionId: versionId,
            status: '差戻',
          },
        ],
      },
    });
    if (maxId) {
      return await this.historyApproveProSkillEntiny.findOne({
        attributes: ['comment'],
        where: {
          id: maxId,
        },
      });
    } else return null;
  }

  async getProskillSettersAndApproversForSkillId(
    skillId: number,
  ): Promise<SkillRole[]> {
    const datas = await this.skillRoleEntity.findAll({
      where: { skillId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName'],
        },
      ],
      order: [['userId', 'ASC']],
    });

    return datas;
  }

  async findOneVersionProSkill(object: {
    [x: string]: any;
  }): Promise<VersionProSkill> {
    return await this.versionProSkillEntity.findOne({
      where: object,
      include: [
        {
          model: Skill,
          as: 'skill',
          include: [
            {
              model: SkillRole,
              as: 'skillRoles',
              attributes: ['id', 'userId', 'role'],
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['id', 'fullName'],
                },
              ],
            },
          ],
        },
        { model: User, as: 'user' },
      ],
      attributes: { exclude: ['creation_user', 'department_id'] },
    });
  }

  async getVersionPublicProSkill(
    skillId: number,
    companyGroupCode: string,
  ): Promise<ListProSkill[]> {
    const datas = await this.listProSkillEntiny.findAll({
      include: [
        {
          model: VersionProSkill,
          as: 'versionProSkill',
          required: true,
          where: {
            publicStatus: 1,
            skillId: skillId,
            companyGroupCode: companyGroupCode,
          },
        },
      ],
    });

    return datas;
  }

  async getDetailProSkillByVersionId(
    versionId: number,
  ): Promise<ListProSkill[]> {
    const datas = await this.listProSkillEntiny.findAll({
      include: [
        {
          model: VersionProSkill,
          as: 'versionProSkill',
          required: true,
          where: {
            id: versionId,
          },

          include: [
            {
              model: Skill,
              as: 'skill',
              attributes: ['id', 'name'],
              include: [
                {
                  model: SkillRole,
                  as: 'skillRoles',
                  attributes: ['id', 'userId', 'role'],
                  include: [
                    {
                      model: User,
                      as: 'user',
                      attributes: ['id', 'fullName'],
                    },
                  ],
                },
              ],
            },
            {
              model: User,
              as: 'user',
              attributes: ['id', 'fullName'],
            },
          ],
        },
      ],
      order: [['id', 'ASC']],
    });
    return datas;
  }

  async findSkillRoleBySkillId(skillId: number, role: number) {
    return await this.skillRoleEntity.findAll({
      where: { skillId: skillId, role: role },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['fullName', 'email', 'id'],
        },
      ],
    });
  }
}
