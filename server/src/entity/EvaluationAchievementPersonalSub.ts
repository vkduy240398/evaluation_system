import { DataTypes } from 'sequelize';
import {
  AllowNull,
  Column,
  CreatedAt,
  ForeignKey,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { EvaluationAchievementPersonal } from './EvaluationAchievementPersonal';

@Table({ tableName: 'evaluation_achievement_personal_sub_tbl' })
export class EvaluationAchievementPersonalSub extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.BIGINT,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => EvaluationAchievementPersonal)
  @Column({
    type: DataTypes.BIGINT,
    field: 'achievement_personal_id',
  })
  achievementPersonalId: number;

  @Column({
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  })
  coefficient: number;

  @Column({
    type: DataTypes.STRING(500),
  })
  degree: string;

  @Column({
    type: DataTypes.STRING(1001),
    field: 'evaluation_decision',
  })
  evaluationDecision: string;

  @AllowNull(false)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;
}
