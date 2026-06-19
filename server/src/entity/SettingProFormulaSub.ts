import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { SettingProFormula } from './SettingProFormula';

@Table({ tableName: 'setting_pro_formula_sub_tbl', timestamps: false })
export class SettingProFormulaSub extends Model<SettingProFormulaSub> {
  @ForeignKey(() => SettingProFormula)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'formula_id',
  })
  formulaId: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'total_item',
  })
  totalItem: number;

  @Column({
    type: DataTypes.DECIMAL(12, 5),
  })
  coefficient: number;

  @BelongsTo(() => SettingProFormula, 'formula_id')
  settingProFormula: SettingProFormula;
}
