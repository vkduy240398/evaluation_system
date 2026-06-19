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

@Table({ tableName: 'user_history_update' })
export class UserHistoryUpdate extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.BIGINT,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'user_id',
  })
  userId: number;

  @Column({
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'before_update_content',
  })
  beforeUpdateContent: string;

  @Column({
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'after_update_content',
  })
  afterUpdateContent: string;

  @Column({
    type: DataTypes.STRING(255),
    allowNull: false,
  })
  option: string;

  @Column({
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'company_group_code',
  })
  companyGroupCode: string;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'creation_user_id',
  })
  creationUserId: number;

  @AllowNull(false)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;

  @BelongsTo(() => User, 'user_id')
  user: User;

  @BelongsTo(() => User, 'creation_user_id')
  creationUser: User;
}
