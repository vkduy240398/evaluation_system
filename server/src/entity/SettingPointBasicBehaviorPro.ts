import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { VersionSetting } from './VersionSetting';

@Table({ tableName: 'setting_point_basic_behavior_pro_tbl', timestamps: false })
export class SettingPointBasicBehaviorPro extends Model {
  @ForeignKey(() => VersionSetting)
  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'version_id',
  })
  versionId: number;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
  })
  type: number;

  @Column({
    type: DataTypes.SMALLINT,
  })
  point: number;

  @Column({
    type: DataTypes.STRING(501),
  })
  note: string;

  @BelongsTo(() => VersionSetting)
  versionSetting: VersionSetting;
}
