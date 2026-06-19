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
import { Skill } from './Skill';

@Table({
  tableName: 'skill_role_tbl',
})
export class SkillRole extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.BIGINT,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Skill)
  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'skill_id',
    references: {
      model: Skill,
      key: 'id',
    },
  })
  skillId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'user_id',
    // references: {
    //   model: User,
    //   key: 'id',
    // },
  })
  userId: number;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
  })
  role: number;

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

  @BelongsTo(() => Skill, {
    onDelete: 'CASCADE',
    foreignKey: 'skill_id',
    as: 'skill',
  })
  skill: Skill;
}
