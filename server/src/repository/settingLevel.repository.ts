import { Inject, Injectable } from '@nestjs/common';
import { Op, Transaction } from 'sequelize';
import EntityConstant from 'src/constant/EntityConstant';
import { SettingLevel } from 'src/entity/SettingLevel';
import { VersionSetting } from 'src/entity/VersionSetting';
import { SettingPointI } from 'src/interfaces/repository/settingPoint.repository.interface';

@Injectable()
export class SettingLevelRepository implements SettingPointI {
  @Inject(EntityConstant.SETTING_LEVEL)
  private settingLevelEntity: typeof SettingLevel;

  @Inject(EntityConstant.VERSION_SETTING)
  private versionSettingEntity: typeof VersionSetting;

  async getListSettingLevelByVersionId(versionSettingId: number) {
    return await this.settingLevelEntity.findAll({
      where: { versionId: versionSettingId },
      order: [['level', 'ASC']],
    });
  }

  async bulkCreate(records: any, transaction: Transaction) {
    return await this.settingLevelEntity.bulkCreate(records, {
      transaction: transaction,
    });
  }

  async bulkDelete(versionId: number, transaction: Transaction) {
    return await this.settingLevelEntity.destroy({
      where: { versionId: versionId },
      transaction: transaction,
    });
  }

  async getLevelSettingPublic(companyGroupCode: string) {
    const versionSettings = (
      await this.versionSettingEntity.findAll({
        attributes: ['type'],
        where: {
          type: { [Op.in]: [1, 2, 3, 4] },
          status: 4,
          companyGroupCode: companyGroupCode,
        },
        include: [
          {
            model: SettingLevel,
            as: 'settingLevel',
            attributes: [
              'level',
              'skillPercent',
              'behaviorPercent',
              'achievementPercent',
            ],
          },
        ],
      })
    ).map((data) => data && data.get({ plain: true }));

    // return [];
    if (versionSettings.length > 0) {
      const levelSettings = [];
      versionSettings.map((versionSetting) =>
        levelSettings.push(
          ...versionSetting.settingLevel.map((v) => ({
            ...v,
            type: versionSetting.type,
          })),
        ),
      ); // as SettingLevel[];

      return levelSettings;
    }

    return [];
  }
}
