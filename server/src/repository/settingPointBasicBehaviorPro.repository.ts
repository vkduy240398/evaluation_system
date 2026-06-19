import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import EntityConstant from 'src/constant/EntityConstant';
import { SettingPointBasicBehaviorPro } from 'src/entity/SettingPointBasicBehaviorPro';
import { SettingPointI } from 'src/interfaces/repository/settingPoint.repository.interface';
import { SettingPointBasicBehaviorProDto } from 'src/model/generic/SettingPointBasicBehaviorProDto';

@Injectable()
export class SettingPointBasicBehaviorProRepository implements SettingPointI {
  @Inject(EntityConstant.SETTING_POINT_BASIC_BEHAVIOR_PRO)
  private settingPointBasicBehaviorProEntity: typeof SettingPointBasicBehaviorPro;

  async getListSettingPointBasicBehaviorProByVersionId(
    versionSettingId: number,
  ) {
    return await this.settingPointBasicBehaviorProEntity.findAll({
      where: { versionId: versionSettingId },
      order: [['point', 'DESC NULLS LAST']],
    });
  }

  async bulkCreate(records: any, transaction: Transaction) {
    return await this.settingPointBasicBehaviorProEntity.bulkCreate(records, {
      transaction: transaction,
    });
  }

  async bulkDelete(versionId: number, type: number, transaction: Transaction) {
    return await this.settingPointBasicBehaviorProEntity.destroy({
      where: { versionId: versionId, type: type },
      transaction: transaction,
    });
  }
}
