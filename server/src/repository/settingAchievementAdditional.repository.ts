import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import EntityConstant from 'src/constant/EntityConstant';
import { SettingAchievementAdditional } from 'src/entity/SettingAchievementAdditional';
import { TypeAchievement } from 'src/enum/TypeAchievement';
import { SettingPointI } from 'src/interfaces/repository/settingPoint.repository.interface';

@Injectable()
export class SettingAchievementAdditionalRepository implements SettingPointI {
  @Inject(EntityConstant.SETTING_ACHIEVEMENT_ADDITIONAL)
  private settingAchievementAdditionalEntity: typeof SettingAchievementAdditional;

  async getListSettingAchievementAdditionalByVersionId(
    versionSettingId: number,
    typeAdditional: TypeAchievement,
  ) {
    return await this.settingAchievementAdditionalEntity.findAll({
      where: { versionId: versionSettingId, type: typeAdditional },
      order: [['point', 'DESC NULLS LAST']],
    });
  }

  async bulkCreate(records: any, transaction: Transaction) {
    return await this.settingAchievementAdditionalEntity.bulkCreate(records, {
      transaction: transaction,
    });
  }

  async bulkDelete(versionId: number, transaction: Transaction) {
    return await this.settingAchievementAdditionalEntity.destroy({
      where: { versionId: versionId },
      transaction: transaction,
    });
  }
}
