import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Includeable, Op, Sequelize, Transaction } from 'sequelize';
import EntityConstant from 'src/constant/EntityConstant';
import { Department } from 'src/entity/Department';
import { DivisionSubclass } from 'src/entity/DivisionSubclass';
import { Role } from 'src/entity/Role';
import { Skill } from 'src/entity/Skill';
import { SkillGroup } from 'src/entity/SkillGroup';
import { SkillRole } from 'src/entity/SkillRole';
import { SkillUser } from 'src/entity/SkillUser';
import { User } from 'src/entity/User';
import { VersionProSkill } from 'src/entity/VersionProSkill';
import { RuntimeException } from 'src/model/exception/RuntimeException';

@Injectable()
export class ManagementEvaluationRepository {
  @Inject(EntityConstant.DEPARTMENT)
  private departmentEntity: typeof Department;

  @Inject(EntityConstant.SKILL)
  private skillEntity: typeof Skill;

  @Inject(EntityConstant.USER)
  private userEntity: typeof User;

  @Inject(EntityConstant.SKILL_GROUP)
  private skillGroupEntity: typeof SkillGroup;

  @Inject(EntityConstant.SKILL_USER_ENTITY)
  private skillUserEntity: typeof SkillUser;

  async getAll(
    departmentId?: number | string | undefined,
    limit?: number | undefined,
    offset?: number | undefined,
  ) {
    const condition =
      departmentId !== '-1' ? { id: departmentId } : { id: { [Op.not]: null } };
    const results = await this.departmentEntity.findAndCountAll({
      attributes: ['id', 'code', 'name', 'type', 'setting'],
      where: { ...condition, active: 1, type: 1 },

      limit: limit || undefined,
      offset: offset || undefined,
      distinct: true,
      order: [['code', 'ASC']],
    });
    const { rows, count } = results;

    return { results: rows, count };
  }

  async getAllSkills(
    skillId?: number | string | undefined,
    detailed?: boolean,
    limit?: number | undefined,
    offset?: number | undefined,
    companyGroupCode?: string,
  ) {
    const condition =
      skillId && skillId !== '-1'
        ? { id: skillId }
        : { id: { [Op.not]: null } };

    const includes: Includeable[] = detailed
      ? ([
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
          {
            model: SkillGroup,
            as: 'skills',
            attributes: ['department_id'],
            include: [
              {
                model: Department,
                as: 'department',
                attributes: ['id', 'name', 'type'],
              },
            ],
          },
        ] as Includeable[])
      : ([] as Includeable[]);

    const results = await this.skillEntity.findAndCountAll({
      attributes: ['id', 'name'],
      where: { ...condition, active: 1, companyGroupCode: companyGroupCode },

      limit: limit || undefined,
      offset: offset || undefined,
      distinct: true,
      order: [['name', 'ASC']],
      include: includes,
    });

    const { rows, count } = results;

    return { results: rows, count };
  }

  async countSkillVersions(skillId: number) {
    const count = await this.skillGroupEntity.count({
      where: { skillId: skillId },
    });

    const sqlCountSkillUser = `SELECT COUNT(SU.*) FROM SKILL_USER_TBL SU 
    LEFT JOIN EVALUATION_PERIOD_TBL EP ON SU.PERIOD_ID = EP.ID WHERE SU.SKILL_ID = :skillId AND EP.CHECK_FIXED <> 2`;
    const countSkillUser: any = await this.skillUserEntity.sequelize.query(
      sqlCountSkillUser,
      {
        nest: true,
        replacements: {
          skillId: skillId,
        },
      },
    );

    return count + (countSkillUser[0]?.count || 0);
  }

  async deleteAdminEvalutionSkill(skillId: number) {
    const transaction = await this.skillEntity.sequelize.transaction();
    try {
      const results = await this.skillEntity.update(
        { active: 0 },
        { where: { id: skillId }, transaction: transaction },
      );

      // * Delete relations
      await SkillRole.destroy({
        where: { skillId: skillId },
        transaction: transaction,
      });

      await transaction.commit();
      return results[0] > 0;
    } catch (error) {
      await transaction.rollback();
      throw new RuntimeException(
        error,
        error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserActive(companyGroupCode: string) {
    return await this.userEntity.findAll({
      where: { active: 1, companyGroupCode: companyGroupCode },
      include: [
        { model: Role, as: 'roles', where: { id: { [Op.or]: [3, 4] } } },
      ],
      order: [['employeeNumber', 'ASC']],
    });
  }
}
