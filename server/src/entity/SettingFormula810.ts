import { DataTypes } from 'sequelize';
import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { VersionSetting } from './VersionSetting';

@Table({ tableName: 'setting_formula_8_10_tbl', timestamps: false })
export class SettingFormula810 extends Model {
  @ForeignKey(() => VersionSetting)
  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'version_id',
  })
  versionId: number;

  @Column({
    type: DataTypes.DECIMAL(8, 2),
  })
  point: number;

  @Column({
    type: DataTypes.STRING(10),
  })
  result: string;

  @Column({
    type: DataTypes.STRING(501),
  })
  note: string;
}
