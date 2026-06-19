import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { VersionSetting } from './VersionSetting';

@Table({ tableName: 'setting_achievement_additional_tbl', timestamps: false })
export class SettingAchievementAdditional extends Model {
  @ForeignKey(() => VersionSetting)
  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'version_id',
  })
  versionId: number;

  @Column({
    type: DataTypes.STRING(10),
  })
  rating: string;

  @Column({
    type: DataTypes.DECIMAL(8, 2),
  })
  point: number;

  @Column({
    type: DataTypes.STRING(501),
  })
  note: string;

  @BelongsTo(() => VersionSetting, 'version_id')
  versionSetting: VersionSetting;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
  })
  type: number;
}
