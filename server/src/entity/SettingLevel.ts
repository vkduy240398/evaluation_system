import { DataTypes } from 'sequelize';
import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { VersionSetting } from './VersionSetting';

@Table({ tableName: 'setting_level_tbl', timestamps: false })
export class SettingLevel extends Model {
  @ForeignKey(() => VersionSetting)
  @Column({
    primaryKey: true,
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'version_id',
  })
  versionId: number;

  @Column({
    primaryKey: true,
    type: DataTypes.SMALLINT,
    allowNull: false,
  })
  level: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'skill_percent',
  })
  skillPercent: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'behavior_percent',
  })
  behaviorPercent: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'achievement_percent',
  })
  achievementPercent: number;
}
