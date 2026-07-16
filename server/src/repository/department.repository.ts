import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { isNumber } from 'class-validator';
import { Op } from 'sequelize';
import EntityConstant from 'src/constant/EntityConstant';
import { Department } from 'src/entity/Department';
import { DivisionSubclass } from 'src/entity/DivisionSubclass';
import { Evaluation } from 'src/entity/Evaluation';
import { EvaluationPeriod } from 'src/entity/EvaluationPeriod';
import { Skill } from 'src/entity/Skill';
import { User } from 'src/entity/User';
import { VersionProSkill } from 'src/entity/VersionProSkill';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { DepartmentUpdateRequestDto } from 'src/model/request/DepartmentRequestDto';
import { SkillGroup } from 'src/entity/SkillGroup';
import { EvaluatorDefault } from 'src/entity/EvaluatorDefault';
import { EvaluationPeriodHelper } from 'src/common/datetime/EvaluationPeriodHelper';
import { HistoryUpdateDepartment } from 'src/entity/HistoryUpdateDepartment';

@Injectable()
export class DepartmentRepository {
  @Inject(EntityConstant.DEPARTMENT)
  private departmentEntity: typeof Department;

  @Inject(EntityConstant.DIVISION_SUBCLASS)
  private divisionSubEntity: typeof DivisionSubclass;

  @Inject(EntityConstant.USER)
  private userEntity: typeof User;

  @Inject(EntityConstant.EVALUATION)
  private evaluationEntity: typeof Evaluation;

  @Inject(EntityConstant.SKILL)
  private skillEntity: typeof Skill;

  @Inject(EntityConstant.SKILL_GROUP)
  private skillGroupEntity: typeof SkillGroup;

  @Inject(EntityConstant.EVALUATOR_DEFAULT)
  private evaluatorDefault: typeof EvaluatorDefault;

  @Inject(EntityConstant.EVALUATION_PERIOD)
  private evaluationPeriodEntity: typeof EvaluationPeriod;

  @Inject(EntityConstant.HISTORY_UPDATE_DEPARTMENT)
  private historyUpdateDepartmentdEntity: typeof HistoryUpdateDepartment;

  async createNewDivisionDepartment(
    saveData: {
      code: string;
      name: string;
      class: number;
      type: number;
      active: number;
      division: any;
    },
    companyGroupCode?: string,
  ) {
    // check duplicate when adding division/department from OracleDB
    const checkCondition = {
      name: saveData.name,
      active: 1,
    };
    if (companyGroupCode !== undefined)
      checkCondition['companyGroupCode'] = companyGroupCode;

    const duplicateRecord = await this.departmentEntity.findOne({
      where: checkCondition,
    });

    if (duplicateRecord) {
      throw new RuntimeException(`${saveData.type} is duplicate`, 204);
    }

    saveData['companyGroupCode'] = companyGroupCode;
    // add new division
    if (saveData.type === 1) {
      return await this.departmentEntity.create(saveData).then(async (data) => {
        if (saveData.class !== 0) {
          const seqId: any = await this.departmentEntity.sequelize.query(
            `SELECT nextval('department_creation_seq') as id`,
          );
          data.code = `GNW-${seqId[0][0].id}`;
          data.save();
        }

        return data;
      });
    }
    // add new department
    if (saveData.type === 0) {
      if (isNumber(saveData.division)) {
        const result = await this.departmentEntity.create(saveData);
        if (result) {
          // create division_subclass
          const dataAdd = {
            departmentId: result.id,
            divisionId: Number(saveData.division),
          };
          if (saveData.class !== 0) {
            const seqId: any = await this.departmentEntity.sequelize.query(
              `SELECT nextval('department_creation_seq') as id`,
            );
            result.code = `GNW-${seqId[0][0].id}`;
            result.save();
          }
          await this.divisionSubEntity.create(dataAdd);
        }
        return result;
      } else {
        // if selected department and selected division are same
        if (saveData.code == saveData.division.split(':')[0].trim()) {
          throw new RuntimeException(
            `${saveData.division}: department and division are same`,
            204,
          );
        }
        // check and create division if selected division is not existed
        const conditions = {
          code: saveData.division.split(':')[0].trim(),
          name: saveData.division.split(':')[1].trim(),
          active: 1,
          type: 1,
          class: 0,
          companyGroupCode,
        };
        const checkExistDivision = await this.departmentEntity.findOne({
          where: {
            name: saveData.division.split(':')[1].trim(),
            active: 1,
            ...(companyGroupCode !== undefined && { companyGroupCode }),
          },
        });

        if (!checkExistDivision) {
          const result = await this.departmentEntity.create(saveData);
          if (result) {
            // create division to which the department belong
            await this.departmentEntity
              .create(conditions)
              .then(async (division) => {
                // create division_subclass
                const dataAdd = {
                  divisionId: division.id,
                  departmentId: result.id,
                };
                await this.divisionSubEntity.create(dataAdd);
              });
          }
          return result;
        } else {
          throw new RuntimeException('Division is duplicate', 204);
        }
      }
    }
  }

  async addDivisionSub(data: any) {
    const checkSubDivisionList = await this.divisionSubEntity.findAll({
      where: { departmentId: data.departmentId },
    });
    if (checkSubDivisionList.length > 0) {
      throw new RuntimeException(
        'Department is already add for another division',
        410,
      );
    } else {
      return await this.divisionSubEntity.create(data);
    }
  }

  async updateDepartmentForGNW(
    id: any,
    department: DepartmentUpdateRequestDto,
    data: Department,
    companyGroupCode: string,
    timeZone: string,
  ) {
    const transaction = await this.evaluationEntity.sequelize.transaction();

    try {
      // //** update department_name table evaluator_default_tbl */
      const year =
        EvaluationPeriodHelper.getCurrentPeriodYear(timeZone).toString();
      const periodIndex =
        EvaluationPeriodHelper.getCurrentPeriodIndex(timeZone) == '上期'
          ? 1
          : 2;

      const dataEvaluationPeroid = await this.evaluationPeriodEntity.findOne({
        attributes: ['id', 'checkFixed'],
        where: {
          year: year,
          periodIndex: periodIndex,
          companyGroupCode: companyGroupCode,
        },
      });

      const indexTime = department.radioPeriod;

      if (dataEvaluationPeroid) {
        let objectCondition = {};
        if (indexTime == 0) {
          //** Kỳ hiện tại theo optinal 1 hoặc optinal 2  */
          objectCondition = {
            [Op.gte]: dataEvaluationPeroid.id,
          };
        } else if (indexTime == 2 || indexTime == 1) {
          //** Kỳ tương lai theo optinal 3 */
          objectCondition = {
            [Op.gt]: dataEvaluationPeroid.id,
          };
        }

        // const oldData = department.oldName;
        const newData = department.name.trim();
        /** update column departmentName */

        if (data?.type === 0) {
          await this.evaluationEntity.update(
            { departmentName: newData },
            {
              where: {
                [Op.and]: [
                  {
                    evaluationPeriodId: objectCondition,
                  },
                  { departmentId: id },
                  { companyGroupCode: companyGroupCode },
                ],
              },
              transaction: transaction,
            },
          );

          /** update departmentName cua evaluator default*/
          await this.evaluatorDefault.update(
            { departmentName: newData },
            {
              where: {
                [Op.and]: [
                  {
                    evaluationPeriodId: objectCondition,
                  },
                  { departmentId: id },
                  { companyGroupCode: companyGroupCode },
                ],
              },
              transaction: transaction,
            },
          );
        }
        /** update column  divisionName*/
        if (data?.type === 1) {
          await this.evaluationEntity.update(
            { divisionName: newData },
            {
              where: {
                [Op.and]: [
                  {
                    evaluationPeriodId: objectCondition,
                  },
                  { divisionId: id },
                  { companyGroupCode: companyGroupCode },
                ],
              },
              transaction: transaction,
            },
          );

          /** update divisionName cua evaluator default*/
          await this.evaluatorDefault.update(
            { divisionName: newData },
            {
              where: {
                [Op.and]: [
                  {
                    evaluationPeriodId: objectCondition,
                  },
                  { divisionId: id },
                  { companyGroupCode: companyGroupCode },
                ],
              },
              transaction: transaction,
            },
          );
        }
      }
      // ** End

      if (data && data?.type === 0) {
        // ** Remove sub department when change this department to division other
        await this.divisionSubEntity.destroy({
          where: {
            departmentId: id,
            divisionId: { [Op.ne]: department.divisionOldId },
          },
        });
        // ** End

        // update table division_sub_class_tbl khi department doi division
        await this.divisionSubEntity.update(
          { divisionId: department.divisionId },
          {
            where: { divisionId: department.divisionOldId, departmentId: id },
            transaction: transaction,
          },
        );
      }

      //** lưu tên department cũ vào bảng history_update_department_tbl khi chọn optinal 2 */
      const listHistoryDataDepartment = [];
      const departmentNew = department.name.trim();
      if (indexTime == 1) {
        listHistoryDataDepartment.push(
          {
            year: year,
            periodIndex: periodIndex,
            type: data?.type,
            departmentId: parseInt(id),
            departmentName: department.oldName,
            companyGroupCode: companyGroupCode,
          },
          {
            year: year,
            periodIndex: periodIndex,
            type: data?.type,
            departmentId: parseInt(id),
            departmentName: departmentNew,
            companyGroupCode: companyGroupCode,
          },
        );

        await this.historyUpdateDepartmentdEntity.bulkCreate(
          listHistoryDataDepartment,
        );
      } else if (indexTime == 2) {
        listHistoryDataDepartment.push({
          year: year,
          periodIndex: periodIndex,
          type: data?.type,
          departmentId: parseInt(id),
          departmentName: department.oldName,
          companyGroupCode: companyGroupCode,
        });

        await this.historyUpdateDepartmentdEntity.bulkCreate(
          listHistoryDataDepartment,
        );
      } else if (indexTime == 0) {
        await this.historyUpdateDepartmentdEntity.destroy({
          where: {
            year: year,
            periodIndex: periodIndex,
            companyGroupCode: companyGroupCode,
            departmentId: parseInt(id),
          },
        });
      }

      //**update tên department mới vào bảng department  */
      const results = await this.departmentEntity.update(
        { code: department.code, name: department.name },
        { where: { id: id }, transaction: transaction },
      );
      await transaction.commit();
      /** update in table department */
      return results;
    } catch (error) {
      await transaction.rollback();
      throw new RuntimeException(
        error,
        error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findListDepartment(query: any, companyGroupCode?: string) {
    let category = query.catergory;
    let classification = query.classification;
    const departmentCodeAndName = query.departmentCodeAndName;
    const limit = query.limit;
    const offset = query.offset;

    if (category === 'すべて') category = null;
    if (classification === 'すべて') classification = null;

    const datas = await this.departmentEntity.findAndCountAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              {
                code: departmentCodeAndName
                  ? { [Op.iLike]: `%${departmentCodeAndName}%` }
                  : { [Op.not]: null },
              },
              {
                name: departmentCodeAndName
                  ? { [Op.iLike]: `%${departmentCodeAndName}%` }
                  : { [Op.not]: null },
              },
            ],
          },
          { type: category || { [Op.not]: null } },
          { class: classification || { [Op.not]: null } },
          companyGroupCode !== undefined ? { companyGroupCode } : {},
        ],
        active: 1,
      },
      include: [
        {
          model: DivisionSubclass,
          as: 'divisionSubclass',
          include: [
            {
              model: Department,
              as: 'division',
            },
            {
              model: Department,
              as: 'department',
            },
          ],
        },
      ],
      order: [
        // ['class', 'ASC'],
        // [
        //   Sequelize.literal(
        //     "CAST(regexp_replace(\"Department\".code, '\\D', '', 'g') AS INTEGER)",
        //   ),
        //   'ASC',
        // ],
        ['name', 'ASC'],
      ],
      offset: offset,
      limit: limit,
      distinct: true,
    });

    const fullDatas = await this.departmentEntity.findAll({
      where: {
        [Op.and]: [
          { type: 1 },
          { active: 1 },
          companyGroupCode !== undefined ? { companyGroupCode } : {},
        ],
      },
    });

    return { data: datas.rows, counts: datas.count, fullData: fullDatas };
  }

  async getAllDepartment(companyGroupCode: string) {
    return await this.departmentEntity.findAll({
      where: {
        active: 1,
        companyGroupCode: companyGroupCode,
      },
      order: [
        // ['class', 'ASC'],
        // ['type', 'ASC'],
        // [
        //   Sequelize.literal(
        //     "CAST(regexp_replace(\"Department\".code, '\\D', '', 'g') AS INTEGER)",
        //   ),
        //   'ASC',
        // ],
        ['name', 'ASC'],
      ],
    });
  }

  async getHistoryUpdateDepartment(
    year: number,
    periodIndex: number,
    companyGroupCode: string,
    timeZone: string,
  ) {
    const result = [];
    const selectedPeriod = `${year}${periodIndex}`;

    const currentYear = EvaluationPeriodHelper.getCurrentPeriodYear(timeZone);
    const currentPeriodIndex =
      EvaluationPeriodHelper.getCurrentPeriodIndex(timeZone) == '上期' ? 1 : 2;

    const currentPeriod = `${currentYear}${currentPeriodIndex}`;
    if (selectedPeriod > currentPeriod) return [];

    // get department của kỳ đang chọn
    const oldDepartments = await this.historyUpdateDepartmentdEntity.findAll({
      attributes: ['type', 'departmentName', 'departmentId'],
      where: {
        year: year.toString(),
        periodIndex: periodIndex,
        companyGroupCode: companyGroupCode,
      },
      include: [
        {
          model: Department,
          as: 'department',
          where: { active: 1 },
        },
      ],
      raw: true,
    });
    result.push(oldDepartments);

    return result;
  }

  async getAllDepartmentNotSetDivision(companyGroupCode: string) {
    const departmentAlreadySetDivisionList =
      await this.divisionSubEntity.findAll();
    const tempList = [];
    departmentAlreadySetDivisionList.map((item: any) => {
      tempList.push(item.departmentId);
    });

    const datas = await this.departmentEntity.findAll({
      where: {
        [Op.and]: [
          { active: 1 },
          { type: 0 },
          { id: { [Op.notIn]: tempList } },
          { companyGroupCode: companyGroupCode },
        ],
      },
      order: [['name', 'ASC']],
    });

    return datas;
  }

  async getAllDepartmentTypeDepartment(companyGroupCode: string) {
    return await this.departmentEntity.findAll({
      where: {
        [Op.and]: [
          { active: 1 },
          { type: 0 },
          { companyGroupCode: companyGroupCode },
        ],
      },
      order: [
        // ['class', 'ASC'],
        // ['type', 'ASC'],
        // [
        // Sequelize.literal(
        //   "CAST(regexp_replace(\"Department\".code, '\\D', '', 'g') AS INTEGER)",
        // ),
        // 'ASC',
        // ],
        ['name', 'ASC'],
      ],
    });
  }

  async getAllDepartmentTypeDivision(companyGroupCode: string) {
    return await this.departmentEntity.findAll({
      where: {
        [Op.and]: [
          { active: 1 },
          { type: 1 },
          { companyGroupCode: companyGroupCode },
        ],
      },
      order: [['name', 'ASC']],
    });
  }

  async getAllDepartmentNotGroup(companyGroupCode: string) {
    return await this.departmentEntity.findAll({
      where: {
        [Op.and]: [
          { active: 1 },
          { type: { [Op.not]: 2 } },
          { companyGroupCode: companyGroupCode },
        ],
      },
      order: [
        // ['class', 'ASC'],
        // [
        //   Sequelize.literal(
        //     "CAST(regexp_replace(\"Department\".code, '\\D', '', 'g') AS INTEGER)",
        //   ),
        //   'ASC',
        // ],
        ['name', 'ASC'],
      ],
    });
  }

  async getAllDivisionDepartment(companyGroupCode: string) {
    return await this.departmentEntity.findAll({
      where: { active: 1, type: 1, companyGroupCode: companyGroupCode },
      include: [
        {
          model: DivisionSubclass,
          as: 'divisionSubclass',
          include: [
            { model: Department, as: 'department', where: { type: 0 } },
          ],
        },
      ],
      order: [
        // ['class', 'ASC'],
        // [
        //   Sequelize.literal(
        //     "CAST(regexp_replace(\"Department\".code, '\\D', '', 'g') AS INTEGER)",
        //   ),
        //   'ASC',
        // ],
        ['name', 'ASC'],
      ],
    });
  }

  async getAllDepartmentGNW(companyGroupCode: string) {
    return await this.departmentEntity.findAll({
      where: {
        [Op.and]: [
          { active: 1 },
          { class: 1 },
          { companyGroupCode: companyGroupCode },
        ],
      },
    });
  }

  async getDepartmentUpdateTime(id: any, companyGroupCode?: string) {
    return await this.departmentEntity.findOne({
      attributes: ['type', 'updatedTime'],
      where: {
        id: id,
        active: 1,
        ...(companyGroupCode !== undefined && { companyGroupCode }),
      },
    });
  }

  async deleteDepartment(id: any, department: any, companyGroupCode: string) {
    const listUsers = await this.userEntity.findAll({
      where: {
        [Op.or]: [{ departmentId: id }, { divisionId: id }],
        active: 1,
        companyGroupCode: companyGroupCode,
      },
    });

    if (listUsers.length === 0) {
      const transaction = await this.departmentEntity.sequelize.transaction();
      try {
        if (department?.type === 1) {
          const countDepartment = await this.divisionSubEntity.count({
            include: [
              {
                model: Department,
                as: 'department',
                where: {
                  type: 0,
                },
              },
            ],
            where: { divisionId: id },
            distinct: true,
            transaction: transaction,
          });
          if (countDepartment > 0) {
            throw new RuntimeException(
              'Division has departments, can not be deleted ',
              204,
            );
          }
        } else if (department?.type === 0) {
          await this.divisionSubEntity.destroy({
            where: {
              departmentId: id,
            },
            transaction: transaction,
          });
        }

        await this.skillGroupEntity.destroy({
          where: {
            departmentId: id,
          },
          transaction: transaction,
        });

        await this.departmentEntity.update(
          { active: 0 },
          { where: { id: id }, transaction: transaction },
        );

        await transaction.commit();
        return { result: 200 };
      } catch (error) {
        await transaction.rollback();
        throw new RuntimeException(
          error,
          error?.status ||
            error?.statusCode ||
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      return { result: 204 };
    }
  }

  async getDepartmentById(id: any | undefined) {
    if (id)
      return await this.departmentEntity.findOne({
        where: { id: id },
        // attributes: ['code', 'name'],
      });
    return null;
  }

  async getTransactionDepartment() {
    return await this.departmentEntity.sequelize.transaction();
  }

  async findOne(where: { [x: string]: any }) {
    return await this.departmentEntity.findOne({ where: where });
  }

  async findOnesSkill(where: { [x: string]: any }) {
    return await this.skillEntity.findOne({ where: where });
  }

  async checkIsDivision(id: any) {
    return await this.departmentEntity.findOne({
      where: {
        [Op.and]: [{ active: 1 }, { type: 1 }, { id: id }],
      },
    });
  }

  async getVersionProSkillbyDepartment(where: {
    [x: string]: any;
  }): Promise<Department[]> {
    return await this.departmentEntity.findAll({
      where: where,
      include: [
        {
          model: VersionProSkill,
          as: 'versionProSkill',
          required: false,
          include: [
            {
              model: User,
              as: 'user',
            },
          ],
        },
      ],
      order: [
        ['code', 'ASC'],
        [{ model: VersionProSkill, as: 'versionProSkill' }, 'version', 'DESC'],
      ],
    });
  }

  async getListSubDepartment(
    query: any,
    id: number,
    companyGroupCode?: string,
  ) {
    const departmentCodeAndName = query.departmentCodeAndName;
    const limit = query.limit;
    const offset = query.offset;

    const selectedDivision = await this.departmentEntity.findOne({
      where: {
        id,
        ...(companyGroupCode !== undefined && { companyGroupCode }),
      },
      attributes: ['id', 'code', 'name'],
    });

    if (!selectedDivision) {
      throw new RuntimeException('NOT FOUND', HttpStatus.NOT_FOUND);
    }

    const datas = await this.divisionSubEntity.findAll({
      where: { divisionId: id },
      attributes: ['departmentId'],
      order: [['departmentId', 'DESC']],
    });

    const temps = datas.filter((data: any) => {
      if (data.departmentId !== null) return data.departmentId;
    });
    const subDepartmentIdList = temps.map((data: any) => data.departmentId);
    const subDepartmentList = await this.departmentEntity.findAndCountAll({
      where: {
        [Op.and]: [
          { id: { [Op.in]: subDepartmentIdList } },
          {
            [Op.or]: [
              {
                code: departmentCodeAndName
                  ? { [Op.iLike]: `%${departmentCodeAndName}%` }
                  : { [Op.not]: null },
              },
              {
                name: departmentCodeAndName
                  ? { [Op.iLike]: `%${departmentCodeAndName}%` }
                  : { [Op.not]: null },
              },
            ],
          },
          {
            type: 0,
          },
        ],
      },
      offset: offset,
      limit: limit,
      order: [
        // ['class', 'ASC'],
        // [
        //   Sequelize.literal(
        //     "CAST(regexp_replace(\"Department\".code, '\\D', '', 'g') AS INTEGER)",
        //   ),
        //   'ASC',
        // ],
        ['name', 'ASC'],
      ],
    });

    const fullDatas = await this.departmentEntity.findAll({
      where: {
        [Op.and]: [
          { type: 0 },
          { active: 1 },
          companyGroupCode !== undefined ? { companyGroupCode } : {},
        ],
      },
    });

    return {
      data: subDepartmentList.rows,
      counts: subDepartmentList.count,
      selectedDivision,
      fullData: fullDatas,
    };
  }

  async getSubDepartmentListByDivisionId(id: number) {
    const datas = await this.divisionSubEntity.findAll({
      where: { divisionId: id },
      attributes: ['departmentId'],
    });
    const temps = datas.filter((data: any) => {
      if (data.departmentId !== null) return data.departmentId;
    });
    const subDepartmentIdList = temps.map((data: any) => data.departmentId);
    const subDepartmentList = await this.departmentEntity.findAll({
      where: {
        [Op.and]: [
          { id: { [Op.in]: subDepartmentIdList } },
          {
            active: 1,
          },
        ],
      },
      attributes: ['id', 'code', 'name'],
    });
    return subDepartmentList;
  }

  async getList() {
    return await this.departmentEntity.findAll({
      where: { active: 1 },
      order: [['code', 'ASC']],
    });
  }

  async getAllSkill(companyGroupCode: string) {
    return await this.skillEntity.findAll({
      attributes: ['id', 'name'],
      where: {
        active: 1,
        companyGroupCode: companyGroupCode,
      },
      order: [['name', 'ASC']],
    });
  }

  async getUserDivision(userId: number) {
    const divisionInfo = await this.userEntity.findOne({
      where: {
        id: userId,
      },
      include: [
        {
          model: Department,
          as: 'division',
          where: {
            type: 1,
          },
        },
      ],
    });

    return divisionInfo;
  }
}
