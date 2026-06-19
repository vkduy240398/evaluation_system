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
import { CompanyGroup } from './CompanyGroup';

@Table({ tableName: 'version_notification_tbl' })
export class VersionNotification extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.SMALLINT,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

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
    type: DataTypes.TEXT,
  })
  reason: string;

  @Column({
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'content',
  })
  content: string;

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

  @Column({
    field: 'company_group_code',
    type: DataTypes.STRING(20),
  })
  @ForeignKey(() => CompanyGroup)
  companyGroupCode: string;

  @AllowNull(true)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(true)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;

  @BelongsTo(() => User, 'creation_user')
  user: User;

  @BelongsTo(() => CompanyGroup, 'company_group_code')
  companyGroup: CompanyGroup;
}
