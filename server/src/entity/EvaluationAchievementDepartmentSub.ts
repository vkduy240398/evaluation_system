import { DataTypes } from 'sequelize';
import {
  AllowNull,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { EvaluationAchievementDepartment } from './EvaluationAchievementDepartment';

@Table({ tableName: 'evaluation_achievement_department_sub_tbl' })
export class EvaluationAchievementDepartmentSub extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.BIGINT,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => EvaluationAchievementDepartment)
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
    type: DataTypes.STRING(201),
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
