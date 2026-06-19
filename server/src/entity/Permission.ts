import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Role } from './Role';
import { User } from './User';

@Table({ tableName: 'permission_tbl' })
export class Permission extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataTypes.SMALLINT,
    field: 'user_id',
  })
  userId: number;

  @ForeignKey(() => Role)
  @Column({
    type: DataTypes.SMALLINT,
    field: 'role_id',
  })
  roleId: number;

  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;

  // ** association

  @BelongsTo(() => Role, 'role_id')
  role: Role;
  @BelongsTo(() => User, 'role_id')
  user: Role;
}
