import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import EntityConstant from 'src/constant/EntityConstant';
import { User } from 'src/entity/User';
import { VersionBasicBehavior } from 'src/entity/VersionBasicBehavior';
import { BasicBehaviorRepositoryI } from 'src/interfaces/repository/basicBehavior.repository.interfaces';
import { BasicBehaviorSearchInterfaces } from 'src/interfaces/service/basicBehavior.interfaces';
import { ListBasicBehavior } from 'src/entity/ListBasicBehavior';
@Injectable()
export class BasicBehaviorRepository implements BasicBehaviorRepositoryI {
  @Inject(EntityConstant.VERSION_BASIC_BEHAVIOR)
  private basicBehaviorEntity: typeof VersionBasicBehavior;

  @Inject(EntityConstant.LIST_BASIC_BEHAVIOR)
  private listBasicBehaviorEnity: typeof ListBasicBehavior;

  async listBasicBehavior(params: any) {
    if (params.status === 'すべて') params.status = null;
    const results = await this.basicBehaviorEntity.findAndCountAll({
      where: {
        [Op.and]: [
          { type: { [Op.in]: params.type } },
          { status: params.status || { [Op.not]: null } },
          { level: params.level && { [Op.in]: params.level } },
          { companyGroupCode: params.companyGroupCode },
        ],
      },
      attributes: [
        'id',
        'type',
        'level',
        'version',
        'subVersion',
        'status',
        'reason',
        'publicDate',
        'updatedTime',
        'lastUpdatedTime',
      ],
      include: [
        {
          model: User,
          attributes: ['fullName'],
        },
      ],
      order: [
        ['level', 'DESC'],
        ['version', 'DESC'],
        ['subVersion', 'DESC'],
      ],
      offset: params.offset,
      limit: params.limit,
    });
    return { data: results.rows, total: results.count };
  }

  async inforCriteria(id: number): Promise<ListBasicBehavior[]> {
    return await this.listBasicBehaviorEnity.findAll({
      where: {
        versionId: id,
      },
      include: [
        {
          model: VersionBasicBehavior,
          as: 'versionBasicBehavior',
          required: false,
          where: {
            id: id,
          },
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['fullName'],
            },
          ],
        },
      ],
      order: [['idItem', 'ASC']],
      limit: 100,
    });
  }
  async inforCriteriaStep(id: number): Promise<VersionBasicBehavior> {
    return await this.basicBehaviorEntity.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['fullName'],
        },
      ],
    });
  }

  async maxSubVersion(object: { [x: string]: any }) {
    const max = await this.basicBehaviorEntity.max('subVersion', {
      where: object,
    });
    return max;
  }
  async updateAllVersionToPrivate(
    object: { [x: string]: any },
    transaction: any,
  ) {
    return await this.basicBehaviorEntity.update(
      {
        status: 3,
        publicDate: null,
      },
      {
        where: object,
        transaction: transaction,
      },
    );
  }
  async updateVersion(versionId, object, transaction) {
    return await this.basicBehaviorEntity.update(object, {
      where: {
        id: versionId,
      },
      returning: true,
      transaction: transaction,
    });
  }

  async maxVersion(where: any, fields: string) {
    const max = await this.basicBehaviorEntity.max(fields, {
      where: where,
    });
    return max;
  }

  async findOne(versionId: number): Promise<VersionBasicBehavior> {
    return await this.basicBehaviorEntity.findOne({
      where: {
        id: versionId,
      },
    });
  }
  async createNewVersion(object) {
    const results = await this.basicBehaviorEntity.create(object);
    return results;
  }

  async createBulkListProSkill(object, transaction: any) {
    return await this.listBasicBehaviorEnity.bulkCreate(object, {
      transaction: transaction,
    });
  }

  async deleteAllListVersion(versionId: number, transaction: any) {
    return await this.listBasicBehaviorEnity.destroy({
      where: {
        versionId: versionId,
      },
      transaction: transaction,
    });
  }

  async cancelVersionProSkill(
    versionId: number,
    _userId: number,
    companyGroupCode: string,
  ) {
    return await this.basicBehaviorEntity.update(
      {
        status: 2,
        // creationUser: userId,
        // lastUpdatedTime: isFormatDate(new Date(), 'YYYY/M/D H:mm'),
      },
      {
        where: {
          id: versionId,
          companyGroupCode: companyGroupCode,
        },
      },
    );
  }

  async getDetailBasicBehaviorSkill(id: number) {
    const result = await this.basicBehaviorEntity.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName'],
        },
      ],
    });

    return result;
  }

  async getListBasicBehaviorSkillByVersionId(versionId: number) {
    const results = await this.listBasicBehaviorEnity.findAll({
      where: { versionId: versionId },
      order: [['idItem', 'ASC']],
    });

    return results;
  }

  async findEvaluationItemsBasicBehaviorSkill(query: any) {
    let level = query.level;
    let status = query.status;
    const classification = query.classification;
    let type: number;
    const limit = query.limit;
    const offset = query.offset;
    if (status === 'すべて') status = null;
    if (level === 'すべて') level = null;
    if (classification === '1') {
      type = 1;
    } else if (classification === '3') {
      type = 2;
    }

    const datas = await this.basicBehaviorEntity.findAll({
      where:
        classification === '1'
          ? {
              [Op.and]: [
                { status: status || { [Op.not]: null } },
                { type: type },
              ],
            }
          : {
              [Op.and]: [
                { level: level || { [Op.not]: null } },
                { status: status || { [Op.not]: null } },
                { type: type },
              ],
            },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'employeeNumber', 'fullName'],
        },
      ],
      order:
        classification === '1'
          ? [
              ['version', 'DESC'],
              ['subVersion', 'DESC'],
            ]
          : [
              ['level', 'DESC'],
              ['version', 'DESC'],
              ['subVersion', 'DESC'],
            ],
      offset: offset,
      limit: limit,
    });

    const counts = await this.basicBehaviorEntity.count({
      where:
        classification === '1'
          ? {
              [Op.and]: [
                { status: status || { [Op.not]: null } },
                { type: type },
              ],
            }
          : {
              [Op.and]: [
                { level: level || { [Op.not]: null } },
                { status: status || { [Op.not]: null } },
                { type: type },
              ],
            },
    });

    return { data: datas, counts: counts };
  }

  async transactionBehaviorBasic() {
    return await this.basicBehaviorEntity.sequelize.transaction();
  }
  async findAllByCondition(object: {
    [x: string]: any;
  }): Promise<VersionBasicBehavior[]> {
    return await this.basicBehaviorEntity.findAll({
      attributes: ['publicDate', 'type', 'id', 'status'],
      where: object,
      limit: 1,
    });
  }

  async findOneByCondition(object: {
    [x: string]: any;
  }): Promise<VersionBasicBehavior> {
    return await this.basicBehaviorEntity.findOne({
      attributes: [
        'publicDate',
        'type',
        'id',
        'status',
        'version',
        'subVersion',
      ],
      where: object,
      limit: 1,
    });
  }
}
