import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { SettingProFormulaSub } from './SettingProFormulaSub';
import { VersionSetting } from './VersionSetting';

@Table({ tableName: 'setting_pro_formula_tbl', timestamps: false })
export class SettingProFormula extends Model<SettingProFormula> {
  @Column({
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => VersionSetting)
  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'version_id',
  })
  versionId: number;

  @Column({
    type: DataTypes.SMALLINT,
  })
  point: number;

  @Column({
    type: DataTypes.STRING(501),
  })
  note: string;

  @HasMany(() => SettingProFormulaSub, {
    sourceKey: 'id',
    foreignKey: 'formula_id',
    onDelete: 'cascade',
    hooks: true,
  })
  settingProFormulaSub: SettingProFormulaSub[];

  @BelongsTo(() => VersionSetting, 'version_id')
  versionSetting: VersionSetting;
}
