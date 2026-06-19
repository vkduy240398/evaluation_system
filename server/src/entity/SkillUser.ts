import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { Skill } from './Skill';
import { User } from './User';
import { EvaluationPeriod } from './EvaluationPeriod';
import { Evaluation } from './Evaluation';

@Table({ tableName: 'skill_user_tbl' })
export class SkillUser extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.BIGINT,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => EvaluationPeriod)
  @Column({
    type: DataTypes.SMALLINT,
    field: 'period_id',
    references: {
      key: 'id',
      model: 'evaluation_period_tbl',
    },
  })
  periodId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.SMALLINT,
    field: 'user_id',
    references: {
      key: 'id',
      model: 'user_tbl',
    },
  })
  userId: number;

  @ForeignKey(() => Skill)
  @Column({
    type: DataTypes.SMALLINT,
    field: 'skill_id',
    references: {
      key: 'id',
      model: 'skill_tbl',
    },
  })
  skillId: number;

  @ForeignKey(() => Evaluation)
  @Column({
    type: DataTypes.BIGINT,
    field: 'evaluation_id',
    references: {
      key: 'id',
      model: 'evaluation_tbl',
    },
  })
  evaluationId: number;

  @Column({
    type: DataTypes.INTEGER,
    field: 'type',
  })
  type: number;

  @BelongsTo(() => EvaluationPeriod, {
    targetKey: 'id',
    foreignKey: 'period_id',
  })
  period: EvaluationPeriod;

  @BelongsTo(() => Skill, {
    targetKey: 'id',
    foreignKey: 'skill_id',
  })
  skill: Skill;

  @BelongsTo(() => User, {
    targetKey: 'id',
    foreignKey: 'user_id',
  })
  user: User;

  @AllowNull(false)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;
}
