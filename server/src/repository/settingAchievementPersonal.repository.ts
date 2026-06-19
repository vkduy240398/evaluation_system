import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import EntityConstant from 'src/constant/EntityConstant';
import { SettingAchievementPersonal } from 'src/entity/SettingAchievementPersonal';
import { TypeAchievement } from 'src/enum/TypeAchievement';
import { SettingPointI } from 'src/interfaces/repository/settingPoint.repository.interface';

@Injectable()
export class SettingAchievementPersonalRepository implements SettingPointI {
  @Inject(EntityConstant.SETTING_ACHIEVEMENT_PERSONAL)
  private settingAchievementPersonalEntity: typeof SettingAchievementPersonal;

  async getListSettingAchievementPersonalByVersionId(
    versionSettingId: number,
    typeEvaluation: TypeAchievement,
  ) {
    return await this.settingAchievementPersonalEntity.findAll({
      where: { versionId: versionSettingId, typeEvaluation: typeEvaluation },
    });
  }

  async bulkCreate(records: any, transaction: Transaction) {
    return await this.settingAchievementPersonalEntity.bulkCreate(records, {
      transaction: transaction,
    });
  }

  async bulkDelete(versionId: number, transaction: Transaction) {
    return await this.settingAchievementPersonalEntity.destroy({
      where: { versionId: versionId },
      transaction: transaction,
    });
  }
}
