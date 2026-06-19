import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { VersionSetting } from './VersionSetting';

@Table({ tableName: 'setting_achievement_personal_tbl', timestamps: false })
export class SettingAchievementPersonal extends Model {
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
  type: number;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'type_evaluation',
  })
  typeEvaluation: number;

  @Column({
    type: DataTypes.DECIMAL(8, 2),
  })
  point: number;

  @Column({
    type: DataTypes.STRING(501),
  })
  note: string;

  @Column({
    type: DataTypes.STRING(501),
  })
  description: string;

  @BelongsTo(() => VersionSetting, 'version_id')
  versionSetting: VersionSetting;
}
