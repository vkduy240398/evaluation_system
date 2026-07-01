import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  Op,
  QueryTypes,
  Sequelize,
  Transaction,
  WhereOptions,
} from 'sequelize';
import EntityConstant from 'src/constant/EntityConstant';
import { User } from 'src/entity/User';
import { VersionNotification } from 'src/entity/VersionNotification';
import { VersionNotificationStatus } from 'src/enum/VersionNotificationStatus';
import { VersionNotificationRepositoryI } from 'src/interfaces/repository/versionNotification.repository.interface';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { VersionNotificationDto } from 'src/model/generic/VersionNotificationDto';
import { ListVersionNotificationParam } from 'src/model/request/F6/ListVersionNotificationParam';

@Injectable()
export class VersionNotificationRepository
  implements VersionNotificationRepositoryI
{
  @Inject(EntityConstant.VERSION_NOTIFICATION)
  private versionNotificationEntity: typeof VersionNotification;

  async getListVersionPaging(
    param: ListVersionNotificationParam,
    companyGroupCode?: string,
  ) {
    const condition: WhereOptions = {};
    if (param.status !== '-1') {
      condition.status = param.status;
    }
    if (companyGroupCode !== undefined) {
      condition.companyGroupCode = companyGroupCode;
    }

    return await this.versionNotificationEntity.findAll({
      limit: param.limit,
      offset: param.offset,
      where: condition,
      attributes: [
        'id',
        'version',
        'subVersion',
        'status',
        'reason',
        'publicDate',
        'updatedTime',
        'lastUpdatedTime',
      ],
      include: [{ model: User, as: 'user' }],
      order: [
        ['version', 'DESC'],
        ['subVersion', 'DESC'],
      ],
    });
  }

  async countListVersionNotification(
    param: ListVersionNotificationParam,
    companyGroupCode?: string,
  ) {
    const condition: WhereOptions<any> = {};
    if (param.status !== '-1') {
      condition.status = param.status;
    }
    if (companyGroupCode !== undefined) {
      condition.companyGroupCode = companyGroupCode;
    }

    return await this.versionNotificationEntity.count({
      where: condition,
    });
  }

  async getVersionNotificationById(
    versionId: number,
    companyGroupCode?: string,
  ) {
    return await this.versionNotificationEntity.findOne({
      where: {
        id: versionId,
        ...(companyGroupCode !== undefined && { companyGroupCode }),
      },
      include: [{ model: User, attributes: ['id', 'fullName'] }],
    });
  }

  async existEditingVersion(versionId: number, companyGroupCode?: string) {
    let versionIdStatement = '';
    const condition: any = {};
    if (versionId) {
      versionIdStatement = ' AND id != :versionId';
      condition['versionId'] = versionId;
    }
    if (companyGroupCode !== undefined) {
      versionIdStatement += ' AND company_group_code = :companyGroupCode';
      condition['companyGroupCode'] = companyGroupCode;
    }

    const querys = await this.versionNotificationEntity.sequelize.query(
      `SELECT EXISTS(SELECT 1 FROM version_notification_tbl WHERE status = 1 ${versionIdStatement})`,
      {
        replacements: condition,
      },
    );
    const hasResult = querys[0][0]['exists'] as boolean;

    return hasResult;
  }

  async isMainVersionPublic(version: number, companyGroupCode?: string) {
    const querys = await this.versionNotificationEntity.sequelize.query(
      `SELECT EXISTS(SELECT 1
                     FROM version_notification_tbl
                     WHERE version = :version
                       AND sub_version = 0
                       AND status = 4
          ${
            companyGroupCode !== undefined
              ? ' AND company_group_code = :companyGroupCode'
              : ''
          })`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          version: version,
          ...(companyGroupCode !== undefined && { companyGroupCode }),
        },
      },
    );

    const hasResult = querys[0]['exists'] as boolean;

    return hasResult;
  }

  async findMaxSubVersion(version: number, companyGroupCode?: string) {
    return await this.versionNotificationEntity.findOne({
      attributes: [
        [Sequelize.fn('max', Sequelize.col('sub_version')), 'subVersion'],
      ],
      where: {
        version: version,
        ...(companyGroupCode !== undefined && { companyGroupCode }),
      },
    });
  }

  async createVersionNotification(data: any, t?: Transaction) {
    const result = await this.versionNotificationEntity.create(data, {
      transaction: t,
    });

    return result;
  }

  async updateVersionNotification(
    data: VersionNotificationDto,
    companyGroupCode?: string,
    t?: Transaction,
  ) {
    return await this.versionNotificationEntity.update(data, {
      where: {
        id: data.id,
        ...(companyGroupCode !== undefined && { companyGroupCode }),
      },
      transaction: t,
    });
  }

  async getVersionUpdatedTime(versionId: number) {
    return await this.versionNotificationEntity.findByPk(versionId, {
      attributes: ['updatedTime'],
    });
  }

  async findUpdateTimeVersion(id: number, companyGroupCode?: string) {
    return await this.versionNotificationEntity.findOne({
      where: {
        id: id,
        ...(companyGroupCode !== undefined && { companyGroupCode }),
      },
      include: [{ model: User, as: 'user' }],
    });
  }

  async findMaxVersion(companyGroupCode?: string) {
    return await this.versionNotificationEntity.findOne({
      where: {
        ...(companyGroupCode !== undefined && { companyGroupCode }),
      },
      attributes: [[Sequelize.fn('max', Sequelize.col('version')), 'version']],
    });
  }

  async unPublicVersionSetting(
    idException: number,
    transaction: Transaction,
    companyGroupCode?: string,
  ) {
    await this.versionNotificationEntity.update(
      { status: VersionNotificationStatus.PRIVATE, publicDate: null },
      {
        where: {
          id: {
            [Op.ne]: idException,
          },
          status: VersionNotificationStatus.PUBLISHED,
          ...(companyGroupCode !== undefined && { companyGroupCode }),
        },
        transaction: transaction,
      },
    );

    return true;
  }

  async getNewTransaction() {
    return await this.versionNotificationEntity.sequelize.transaction();
  }

  async getPublicVersionNotification(companyGroupCode?: string) {
    return await this.versionNotificationEntity.findOne({
      where: {
        status: VersionNotificationStatus.PUBLISHED,
        ...(companyGroupCode !== undefined && { companyGroupCode }),
      },
    });
  }

  async findVersionById(versionId: number) {
    return await this.versionNotificationEntity.findByPk(versionId);
  }

  async publicVersionSetting(
    versionId: number,
    data: any,
    companyGroupCode: string,
  ) {
    const t = await this.versionNotificationEntity.sequelize.transaction();

    try {
      await this.versionNotificationEntity.update(data, {
        where: { id: versionId },
        transaction: t,
      });

      await this.versionNotificationEntity.update(
        { status: VersionNotificationStatus.PRIVATE, publicDate: null },
        {
          where: {
            id: {
              [Op.ne]: versionId,
            },
            status: VersionNotificationStatus.PUBLISHED,
            companyGroupCode: companyGroupCode,
          },
          transaction: t,
        },
      );

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw new RuntimeException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return true;
  }

  async create(dto: any) {
    return await this.versionNotificationEntity.create(dto);
  }
}
