import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import EntityConstant from 'src/constant/EntityConstant';
import { SettingProFormula } from 'src/entity/SettingProFormula';
import { SettingProFormulaSub } from 'src/entity/SettingProFormulaSub';
import { SettingPointI } from 'src/interfaces/repository/settingPoint.repository.interface';

@Injectable()
export class SettingProFormulaRepository implements SettingPointI {
  @Inject(EntityConstant.SETTING_PRO_FORMULA)
  private settingProFormulaEntity: typeof SettingProFormula;

  @Inject(EntityConstant.SETTING_PRO_FORMULA_SUB)
  private settingProFormulaSubEntity: typeof SettingProFormulaSub;

  async getListSettingProFormulaByVersionId(versionSettingId: number) {
    return await this.settingProFormulaEntity.findAll({
      where: { versionId: versionSettingId },
      include: [
        {
          model: SettingProFormulaSub,
          as: 'settingProFormulaSub',
          order: [['id', 'ASC']],
          separate: true,
          required: false,
        },
      ],
      order: [['point', 'DESC NULLS LAST']],
    });
  }

  async bulkCreate(records: any, transaction: Transaction) {
    return await this.settingProFormulaEntity.bulkCreate(records, {
      include: [{ model: SettingProFormulaSub, as: 'settingProFormulaSub' }],
      transaction: transaction,
    });
  }

  async bulkDelete(versionId: number, transaction: Transaction) {
    return await this.settingProFormulaEntity.destroy({
      where: { versionId: versionId },
      transaction: transaction,
    });
  }

  async bulkCreateSub(records: any, transaction: Transaction) {
    return await this.settingProFormulaSubEntity.bulkCreate(records, {
      transaction: transaction,
    });
  }

  async bulkDeleteSub(iDs: any, transaction: Transaction) {
    return await this.settingProFormulaSubEntity.destroy({
      where: {
        formulaId: iDs,
      },
      transaction: transaction,
    });
  }
}
