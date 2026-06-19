import { DataTypes } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './User';
import { ListBasicBehavior } from './ListBasicBehavior';
import { CompanyGroup } from './CompanyGroup';

@Table({ tableName: 'version_basic_behavior_tbl' })
export class VersionBasicBehavior extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
  })
  type: number;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: true,
  })
  level: number;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
  })
  version: number;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'sub_version',
  })
  subVersion: number;

  @Column({
    type: DataTypes.SMALLINT,
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

  @Column({
    type: DataTypes.STRING(501),
  })
  reason: string;

  @Column({
    type: DataTypes.STRING(16),
    field: 'public_date',
  })
  publicDate: string;

  @Column({
    type: DataTypes.STRING(16),
    field: 'last_updated_time',
  })
  lastUpdatedTime: string;

  @AllowNull(false)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;

  @Column({
    type: DataTypes.STRING(20),
    field: 'company_group_code',
  })
  companyGroupCode: string;

  @HasMany(() => ListBasicBehavior)
  listBasicBehaviors: ListBasicBehavior[];

  @BelongsTo(() => User, 'creation_user')
  user: User;

  @BelongsTo(() => CompanyGroup, 'company_group_code')
  companyGroup: CompanyGroup;
}
