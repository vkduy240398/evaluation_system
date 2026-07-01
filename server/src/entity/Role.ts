import { DataTypes } from 'sequelize';
import {
  AllowNull,
  BelongsToMany,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Department } from './Department';
import { User } from './User';
import { Permission } from './Permission';

@Table({ tableName: 'role_tbl' })
export class Role extends Model {
  @ForeignKey(() => User)
  @Column({
    primaryKey: true,
    type: DataTypes.SMALLINT,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Department)
  @Column({
    type: DataTypes.STRING(50),
    allowNull: false,
  })
  name: string;

  @AllowNull(false)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;

  // ** association

  @BelongsToMany(() => User, () => Permission, 'role_id', 'user_id')
  users: User[];
}
