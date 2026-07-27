import { DataTypes } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './User';
import { VersionProSkill } from './VersionProSkill';

@Table({ tableName: 'history_approve_pro_skill_tbl' })
export class HistoryApproveProSkill extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.BIGINT,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => VersionProSkill)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'version_id',
  })
  versionId: number;

  @Column({
    type: DataTypes.STRING(500),
  })
  comment: string;

  @Column({
    type: DataTypes.STRING(50),
    allowNull: false,
  })
  status: number;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'creation_user',
  })
  creationUser: number;

  @AllowNull(false)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;

  @BelongsTo(() => User, 'creation_user')
  user: User;

  @BelongsTo(() => VersionProSkill, 'version_id')
  versionProSkill: VersionProSkill;
}
