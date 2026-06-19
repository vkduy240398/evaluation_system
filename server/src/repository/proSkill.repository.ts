import { Inject, Injectable } from '@nestjs/common';
import { Op, QueryTypes, Transaction } from 'sequelize';
import EntityConstant from 'src/constant/EntityConstant';
import { Department } from 'src/entity/Department';
import { HistoryApproveProSkill } from 'src/entity/HistoryApproveProSkill';
import { HistoryPublicProSkill } from 'src/entity/HistoryPublicProSkill';
import { ListProSkill } from 'src/entity/ListProSkill';
import { Skill } from 'src/entity/Skill';
import { SkillGroup } from 'src/entity/SkillGroup';
import { SkillRole } from 'src/entity/SkillRole';
import { User } from 'src/entity/User';
import { VersionProSkill } from 'src/entity/VersionProSkill';

@Injectable()
export class ProSkillRepository {
  @Inject(EntityConstant.VERSION_PRO_SKILL)
  private versionProSkillEntity: typeof VersionProSkill;

  @Inject(EntityConstant.SKILL_GROUP)
  private skillGroupEntity: typeof SkillGroup;

  @Inject(EntityConstant.LIST_PRO_SKILL)
  private listProSkillEntity: typeof ListProSkill;

  @Inject(EntityConstant.DEPARTMENT)
  private departmentEntity: typeof Department;

  @Inject(EntityConstant.HISTORY_APPROVE_PRO_SKILL)
  private historyApproveProSkillEntity: typeof HistoryApproveProSkill;

  @Inject(EntityConstant.SKILL_ROLE)
  private skillRoleEntity: typeof SkillRole;

  @Inject(EntityConstant.SKILL)
  private skillEntity: typeof Skill;

  @Inject(EntityConstant.HISTORY_PUBLIC_PRO_SKILL)
  private historyPublicProSkillEntity: typeof HistoryPublicProSkill;

  async searchListApprovalProSkill(
    query: any,
    userId: any,
    companyGroupCode: string,
  ) {
    let publicStatus = query.publicStatus;
    let status = query.status;
    let skill = query.skill;
    const limit = query.limit;
    const offset = query.offset;
    if (status === 'すべて') status = null;
    if (publicStatus === 'すべて') publicStatus = null;
    if (skill === 'すべて') {
      skill = null;
    } else {
      skill = parseInt(skill[0].trim());
    }

    /** get list skill of user have permission approve pro skill in table skill role*/
    const listSkillApproveOfUsers = await this.skillRoleEntity.findAll({
      attributes: ['skillId'],
      where: {
        userId: userId,
        role: 2,
      },
      include: {
        model: Skill,
        as: 'skill',
        where: {
          active: 1,
          companyGroupCode: companyGroupCode,
        },
      },
    });

    const listSkillIdApproveOfUsers = [];
    listSkillApproveOfUsers.map((item: any) => {
      listSkillIdApproveOfUsers.push(item.skillId);
    });

    const datas = await this.versionProSkillEntity.findAll({
      attributes: { exclude: ['reason', 'createdTime', 'updatedTime'] },
      where: {
        skillId: skill || {
          [Op.and]: [
            {
              [Op.not]: null,
            },
            {
              [Op.in]:
                listSkillIdApproveOfUsers /** find all the pro skills that the user have permission approve pro skill in table skill role */,
            },
          ],
        },
        status: status || {
          [Op.and]: [
            {
              [Op.not]: null,
            },
            {
              [Op.notIn]: [
                1, 2,
              ] /** 1 : 編集中 (Editing), 2 : 取消 (Cancel)  */,
            },
          ],
        },
        publicStatus: publicStatus || { [Op.not]: null },
        companyGroupCode: companyGroupCode,
      },
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
        {
          model: User,
          as: 'user',
          attributes: ['id', 'employeeNumber', 'fullName'],
        },
      ],
      order: [
        [{ model: Skill, as: 'skill' }, 'name', 'ASC'],
        ['version', 'DESC'],
        ['subVersion', 'DESC'],
      ],
      offset: offset,
      limit: limit,
    });

    const counts = await this.versionProSkillEntity.count({
      where: {
        skillId: skill || {
          [Op.and]: [
            {
              [Op.not]: null,
            },
            {
              [Op.in]:
                listSkillIdApproveOfUsers /** find all the pro skills that the user have permission approve pro skill in table skill role */,
            },
          ],
        },
        status: status || {
          [Op.and]: [
            {
              [Op.not]: null,
            },
            {
              [Op.notIn]: [
                1, 2,
              ] /** 1 : 編集中 (Editing), 2 : 取消 (Cancel)  */,
            },
          ],
        },
        publicStatus: publicStatus || { [Op.not]: null },
        companyGroupCode: companyGroupCode,
      },
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
      ],
      // distinct: true,
    });

    return { data: datas, counts: counts };

    // const data = await this.versionProSkillEntity.findAll();
    // return data;
  }

  async getSkillByRoleUser(
    userId: number,
    companyGroupCode: string,
  ): Promise<Skill[]> {
    const datas = await this.skillRoleEntity.findAll({
      attributes: [],
      where: {
        userId: userId,
        role: 2,
      },
      include: {
        model: Skill,
        as: 'skill',
        where: {
          active: 1,
          companyGroupCode: companyGroupCode,
        },
      },
      order: [
        // [{ model: Department, as: 'department' }, 'class', 'ASC'],
        // [{ model: Department, as: 'department' }, 'type', 'ASC'],
        // [
        //   Sequelize.literal(
        //     "CAST(regexp_replace(\"department\".code, '\\D', '', 'g') AS INTEGER)",
        //   ),
        //   'ASC',
        // ],
        [{ model: Skill, as: 'skill' }, 'name', 'ASC'],
      ],
    });

    const results: Skill[] = datas.map((e: any) => {
      return e.skill;
    });
    return results;
  }

  async detailProSkill(versionId: number): Promise<ListProSkill[]> {
    const datas = await this.listProSkillEntity.findAll({
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
              attributes: ['id', 'name', 'active'],
              include: [
                {
                  model: SkillRole,
                  as: 'skillRoles',
                  attributes: ['role'],
                  include: [
                    {
                      model: User,
                      as: 'user',
                      attributes: ['employeeNumber', 'fullName', 'id'],
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

  async getVersionPublic(): Promise<ListProSkill[]> {
    const datas = await this.listProSkillEntity.findAll({
      include: [
        {
          model: VersionProSkill,
          as: 'versionProSkill',
          required: true,
          where: {
            publicStatus: 1,
          },
        },
      ],
    });
    return datas;
  }

  async createHistoryApproveOrRejectProSkill(
    versionId: number,
    comment: string,
    status: string,
    creationUser: number,
    createTime: Date,
  ): Promise<any> {
    //
    return await this.historyApproveProSkillEntity.create({
      versionId,
      comment,
      status,
      creationUser,
      createdTime: createTime,
    });
  }

  async getProSkillById(id: number): Promise<VersionProSkill> {
    const result = await this.versionProSkillEntity.findOne({
      where: { id },
      include: [
        {
          model: Skill,
          as: 'skill',
          attributes: ['id', 'name', 'active'],
          include: [
            {
              model: SkillRole,
              as: 'skillRoles',
              attributes: ['role'],
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['employeeNumber', 'fullName', 'id'],
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

  async changeCurrentStatusProSkillToApproved(id: any, _userId: any) {
    return await this.versionProSkillEntity.update(
      { status: 4, publicStatus: 2 },
      { where: { id: id } },
    );
  }

  async changeCurrentStatusProSkillToRejected(id: any, _userId: any) {
    return await this.versionProSkillEntity.update(
      { status: 5 },
      { where: { id: id } },
    );
  }

  async checkProSkillPendingStatusInDepartmentToApprove(
    id: any,
    companyGroupCode: string,
  ) {
    const datas = await this.versionProSkillEntity.findAll({
      where: {
        [Op.and]: [
          {
            skillId: id,
            publicStatus: 2,
            companyGroupCode: companyGroupCode,
          },
        ],
      },
    });
    return datas;
  }

  async getDepartmentById(id: number): Promise<any> {
    const result = await this.departmentEntity.findOne({
      attributes: ['code', 'name', 'id', 'type'],
      where: { id },
    });
    return result;
  }

  async checkPermissionApproverOfSkill(userId: number, skillId: number) {
    const result = await this.skillRoleEntity.findOne({
      where: {
        [Op.and]: [
          {
            skillId: skillId,
            role: 2,
            userId: userId,
          },
        ],
      },
    });
    return result;
  }

  async findEvaluationItemsProSkill(query: any) {
    let publicStatus = query.publicStatus;
    let status = query.status;
    let skill = query.skill;
    const limit = query.limit;
    const offset = query.offset;
    const companyGroupCode = query.companyGroupCode;

    if (status === 'すべて') status = null;
    if (publicStatus === 'すべて') publicStatus = null;
    if (publicStatus === '公開待ち') publicStatus = 2;
    if (skill === 'すべて') {
      skill = null;
    } else {
      skill = parseInt(skill[0].trim());
    }

    const datas = await this.versionProSkillEntity.findAll({
      where: {
        status: status || { [Op.in]: [1, 2, 3, 4, 5] },
        skillId: skill || { [Op.not]: null },
        publicStatus: publicStatus || { [Op.not]: null },
        companyGroupCode: companyGroupCode,
      },
      include: [
        {
          model: Skill,
          as: 'skill',
          attributes: ['id', 'name'],
          where: {
            active: 1,
          },
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'employeeNumber', 'fullName'],
        },
      ],
      order: [
        [{ model: Skill, as: 'skill' }, 'name', 'ASC'],
        ['version', 'DESC'],
        ['subVersion', 'DESC'],
      ],
      offset: offset,
      limit: limit,
    });

    const counts = await this.versionProSkillEntity.count({
      where: {
        status: status || { [Op.in]: [1, 2, 3, 4, 5] },
        skillId: skill || { [Op.not]: null },
        publicStatus: publicStatus || { [Op.not]: null },
        companyGroupCode: companyGroupCode,
      },
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
      distinct: true,
    });

    return { data: datas, counts: counts };
  }

  async versionMax(fields, where: { [x: string]: any }): Promise<number> {
    return await this.versionProSkillEntity.max(fields, {
      where: where,
    });
  }

  async updateVersion(
    object: { [x: string]: any },
    where: { [x: string]: any },
    transaction: any,
  ) {
    return (
      await this.versionProSkillEntity
        .update(object, {
          where: where,
          returning: true,
          transaction: transaction,
        })
        .then(([_, data]) => data)
    ).map(
      (data) => data && data.get({ plain: true }),
    ) as unknown as VersionProSkill[];
  }

  createHistory(object: { [x: string]: any }, transaction: any): Promise<any> {
    //
    return this.historyApproveProSkillEntity.create(object, {
      transaction: transaction,
    });
  }

  async getVersionPublicOfDivision(
    departmentId: number,
  ): Promise<ListProSkill[]> {
    const datas = await this.listProSkillEntity.findAll({
      include: [
        {
          model: VersionProSkill,
          as: 'versionProSkill',
          required: true,
          where: {
            publicStatus: 1,
            departmentId: departmentId,
          },
          include: [
            {
              model: Department,
              where: {
                type: 1,
                active: 1,
              },
            },
          ],
        },
      ],
    });

    return datas;
  }

  async getVersionPublicOfDepartment(
    departmentId: number,
  ): Promise<ListProSkill[]> {
    const datas = await this.listProSkillEntity.findAll({
      include: [
        {
          model: VersionProSkill,
          as: 'versionProSkill',
          required: true,
          where: {
            publicStatus: 1,
            departmentId: departmentId,
          },
          include: [
            {
              model: Department,
              where: {
                type: 0,
                active: 1,
              },
            },
          ],
        },
      ],
    });

    return datas;
  }

  async buildCreate(array: any[], transaction: any) {
    return await this.versionProSkillEntity.bulkCreate(array, {
      transaction: transaction,
    });
  }

  async adminEvaluationDetailProSkillById(id: number): Promise<
    {
      id: number;
      version: number;
      subVersion: number;
      status: number;
      fullName: string;
      updatedTime: Date;
      reason: string;
      publicStatus: number;
      publicDate: string;
      type: number;
      departmentCode: string;
      departmentName: string;
      content: string;
      difficulty: number;
      idListProSkill: number;
      itemId: string;
      jobType: string;
      mediumClass: string;
      note: string;
      smallClass: string;
      departmentIdSub: number;
      departmentCodeSub: string;
      departmentNameSub: string;
    }[]
  > {
    return await this.versionProSkillEntity.sequelize.query(
      `SELECT version_pro_skill_tbl.id as id,version_pro_skill_tbl.version as version, 
        version_pro_skill_tbl.sub_version as "subVersion",
        version_pro_skill_tbl.department_id as "departmentId",
        version_pro_skill_tbl.status as status,
        version_pro_skill_tbl.public_status as "publicStatus", 
        version_pro_skill_tbl.reason as reason,
        version_pro_skill_tbl.updated_time as "updatedTime",
        version_pro_skill_tbl.public_date as "publicDate"
        ,divisionSubClass."departmentIdSub",
        divisionSubClass."departmentCodeSub",  
        divisionSubClass."departmentNameSub",
        divisionSubClass."departmentIdSub", 
        department_tbl.type,
        list_pro_skill_tbl.item_id as "itemId",
        list_pro_skill_tbl.job_type as "jobType",
        list_pro_skill_tbl.medium_class as "mediumClass",
        list_pro_skill_tbl.small_class as "smallClass",
        list_pro_skill_tbl.difficulty, list_pro_skill_tbl.note,
        list_pro_skill_tbl.id as "idListProSkill",
        list_pro_skill_tbl.content as "content",
        user_tbl.full_name as "fullName",
        department_tbl.code as "departmentCode",
        department_tbl.name as "departmentName"
        FROM version_pro_skill_tbl 
        LEFT JOIN department_tbl ON department_tbl.id = version_pro_skill_tbl.department_id
        LEFT JOIN (SELECT division_subclass_tbl.department_id as "departmentIdSub",
              division_subclass_tbl.division_id as "divisionSub",
              department_tbl.code as "departmentCodeSub", 
              department_tbl.name as "departmentNameSub",
              department_tbl.type as "departmentTypeSub"
              FROM division_subclass_tbl 
              INNER JOIN department_tbl on department_tbl.id = division_subclass_tbl.department_id) as divisionSubClass
              ON divisionSubClass."divisionSub" = department_tbl.id
        LEFT JOIN list_pro_skill_tbl ON list_pro_skill_tbl.version_id = version_pro_skill_tbl.id
        LEFT JOIN user_tbl ON user_tbl.id = version_pro_skill_tbl.creation_user
        WHERE version_pro_skill_tbl.id = :id limit 100`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          id: id,
        },
      },
    );
  }

  async getProSkillDetailById(id: number): Promise<VersionProSkill> {
    const result = await this.versionProSkillEntity.findOne({
      where: { id },
      include: [
        {
          model: Skill,
          as: 'skill',
          attributes: ['id', 'name'],
          include: [
            {
              model: SkillRole,
              as: 'skillRoles',
              attributes: ['role'],
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['employeeNumber', 'fullName', 'id'],
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

  async getSkilltById(id: number, companyGroupCode: string): Promise<any> {
    const result = await this.skillEntity.findOne({
      attributes: ['name', 'id'],
      where: { id: id, companyGroupCode: companyGroupCode },
    });
    return result;
  }

  async getVersionProSkillPublicOfSkill(
    skillId: number,
    companyGroupCode: string,
  ) {
    const result = await this.versionProSkillEntity.findOne({
      attributes: { exclude: ['reason', 'createdTime', 'updatedTime'] },
      where: {
        [Op.and]: [
          { skillId: skillId },
          { publicStatus: 1 },
          { companyGroupCode: companyGroupCode },
        ],
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

  async insertHistoryPublicProSkill(
    year: string,
    periodIndex: number,
    companyGroupCode: string,
  ) {
    const count = await this.historyPublicProSkillEntity.count({
      where: {
        year,
        periodIndex,
        companyGroupCode,
      },
    });
    if (!count) {
      const datasBulk = [];
      const listVersionProPublic = await this.versionProSkillEntity.findAll({
        attributes: ['id', 'skillId'],
        where: {
          publicStatus: 1,
          status: 4,
          companyGroupCode: companyGroupCode,
        },
      });
      for (let i = 0; i < listVersionProPublic?.length; i++) {
        const versionProSkill = listVersionProPublic[i];
        const skillGroups = await this.skillGroupEntity.findAll({
          attributes: ['departmentId'],
          where: {
            skillId: versionProSkill.skillId,
          },
        });

        for (let j = 0; j < skillGroups?.length; j++) {
          const data = {
            year: year,
            periodIndex: periodIndex,
            versionId: versionProSkill.id,
            skillId: versionProSkill.skillId,
            departmentId: skillGroups[j].departmentId,
            companyGroupCode: companyGroupCode,
          };
          datasBulk.push(data);
        }
      }

      await this.historyPublicProSkillEntity.destroy({
        where: {
          year: year,
          periodIndex: periodIndex,
          companyGroupCode: companyGroupCode,
        },
      });

      await this.historyPublicProSkillEntity.bulkCreate(datasBulk);
    }
  }

  async getListDep_TempExport(
    year: number,
    periodIndex: number,
    role: string,
    companyGroupCode: string,
  ) {
    let listResult = [];
    if (role == 'f3' || role == 'f4') {
      const result = await this.historyPublicProSkillEntity.findAll({
        where: {
          year: year,
          periodIndex: periodIndex,
          departmentId: { [Op.not]: null },
          companyGroupCode: companyGroupCode,
        },
        include: [
          {
            model: Department,
            as: 'department',
            attributes: ['id', 'name'],
          },
        ],
        order: [[{ model: Department, as: 'department' }, 'name', 'ASC']],
      });

      if (result.length > 0) {
        const uniqueListDep = result.filter((obj, index) => {
          return (
            index ===
            result.findIndex((o) => obj.department?.id === o.department?.id)
          );
        });

        if (uniqueListDep.length > 0) {
          uniqueListDep.map((item: any) => {
            listResult.push({
              id: item.department?.id,
              name: item.department?.name,
            });
          });
        }

        return listResult;
      } else {
        return [];
      }
    } else if (role == 'f6') {
      const result = await this.historyPublicProSkillEntity.findAll({
        where: {
          year: year,
          periodIndex: periodIndex,
          skillId: { [Op.not]: null },
          companyGroupCode: companyGroupCode,
        },
        include: [
          {
            model: Skill,
            as: 'skill',
            attributes: ['id', 'name'],
          },
        ],
        order: [[{ model: Skill, as: 'skill' }, 'name', 'ASC']],
      });

      if (result.length > 0) {
        const uniqueListTemp = result.filter((obj, index) => {
          return (
            index === result.findIndex((o) => obj.skill?.id === o.skill?.id)
          );
        });

        if (uniqueListTemp.length > 0) {
          uniqueListTemp.map((item: any) => {
            listResult.push({
              id: item.skill?.id,
              name: item.skill?.name,
            });
          });
        }

        return listResult;
      } else {
        return [];
      }
    }
  }

  async getDataExportProSkill(
    year: number,
    periodIndex: number,
    role: string,
    listSelected: [],
    companyGroupCode,
  ) {
    if (role == 'f3' || role == 'f4') {
      const result = await this.historyPublicProSkillEntity.findAll({
        where: {
          year: year,
          periodIndex: periodIndex,
          departmentId: listSelected,
          companyGroupCode: companyGroupCode,
        },
        include: [
          {
            model: Department,
            as: 'department',
            attributes: ['name'],
          },
          {
            model: VersionProSkill,
            as: 'versionProSkill',
            include: [
              {
                model: ListProSkill,
                as: 'listProSkills',
              },
            ],
          },
        ],
        order: [[{ model: Department, as: 'department' }, 'name', 'ASC']],
      });

      const listData: {
        departmentName: any;
        jobType: any;
        mediumClass: any;
        smallClass: any;
        content: any;
        difficulty: any;
        note: any;
      }[] = [];
      result.map((item: any) => {
        item.versionProSkill?.listProSkills?.map((item2: any) => {
          listData.push({
            departmentName: item.department?.name || ' ',
            jobType: item2.jobType || ' ',
            mediumClass: item2.mediumClass || ' ',
            smallClass: item2.smallClass || ' ',
            content: item2.content || ' ',
            difficulty: item2.difficulty || ' ',
            note: item2.note || ' ',
          });
        });
      });
      return listData;
    } else if (role == 'f6') {
      const result = await this.historyPublicProSkillEntity.findAll({
        where: {
          year: year,
          periodIndex: periodIndex,
          skillId: listSelected,
          companyGroupCode: companyGroupCode,
        },
        include: [
          {
            model: Department,
            as: 'department',
            attributes: ['name'],
          },
          {
            model: Skill,
            as: 'skill',
            attributes: ['name'],
          },
          {
            model: VersionProSkill,
            as: 'versionProSkill',
            include: [
              {
                model: ListProSkill,
                as: 'listProSkills',
              },
            ],
          },
        ],
        order: [[{ model: Skill, as: 'skill' }, 'name', 'ASC']],
      });

      const listData: {
        skillName: any;
        departmentName: any;
        jobType: any;
        mediumClass: any;
        smallClass: any;
        content: any;
        difficulty: any;
        note: any;
      }[] = [];
      result.map((item: any) => {
        item.versionProSkill?.listProSkills?.map((item2: any) => {
          listData.push({
            skillName: item.skill?.name || ' ',
            departmentName: item.department?.name || ' ',
            jobType: item2.jobType || ' ',
            mediumClass: item2.mediumClass || ' ',
            smallClass: item2.smallClass || ' ',
            content: item2.content || ' ',
            difficulty: item2.difficulty || ' ',
            note: item2.note || ' ',
          });
        });
      });
      return listData;
    }
  }

  async listItemTemplate(versionId: number) {
    return await this.listProSkillEntity.findAll({
      where: {
        versionId: versionId,
      },
    });
  }
}
