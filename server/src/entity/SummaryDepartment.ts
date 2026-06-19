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
import { Evaluation } from './Evaluation';

@Table({ tableName: 'summary_department_tbl' })
export class SummaryDepartment extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.BIGINT,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Evaluation)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'evaluation_id',
    references: {
      model: Evaluation,
      key: 'id',
    },
  })
  evaluationId: number;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    field: 'achievement_personal_total_point_user',
  })
  achievementPersonalTotalPointUser: number;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    field: 'achievement_personal_total_point_evaluator_0_5',
  })
  achievementPersonalTotalPointEvaluator05: number;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    field: 'achievement_personal_total_point_evaluator_1',
  })
  achievementPersonalTotalPointEvaluator1: number;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    field: 'achievement_personal_total_point_evaluator_2',
  })
  achievementPersonalTotalPointEvaluator2: number;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    field: 'achievement_additional_total_point_user',
  })
  achievementAdditionalTotalPointUser: number;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    field: 'achievement_additional_total_point_evaluator_0_5',
  })
  achievementAdditionalTotalPointEvaluator05: number;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    field: 'achievement_additional_total_point_evaluator_1',
  })
  achievementAdditionalTotalPointEvaluator1: number;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    field: 'achievement_additional_total_point_evaluator_2',
  })
  achievementAdditionalTotalPointEvaluator2: number;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    field: 'summary_point_user',
  })
  summaryPointUser: number;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    field: 'summary_point_evaluator_0_5',
  })
  summaryPointEvaluator05: number;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    field: 'summary_point_evaluator_1',
  })
  summaryPointEvaluator1: number;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    field: 'summary_point_evaluator_2',
  })
  summaryPointEvaluator2: number;

  @Column({
    type: DataTypes.STRING(10),
    field: 'summary_char_point_user',
  })
  summaryCharPointUser: string;

  @Column({
    type: DataTypes.STRING(10),
    field: 'summary_char_point_evaluator_0_5',
  })
  summaryCharPointEvaluator05: string;

  @Column({
    type: DataTypes.STRING(10),
    field: 'summary_char_point_evaluator_1',
  })
  summaryCharPointEvaluator1: string;

  @Column({
    type: DataTypes.STRING(10),
    field: 'summary_char_point_evaluator_2',
  })
  summaryCharPointEvaluator2: string;

  @AllowNull(false)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;

  @HasOne(() => Evaluation, 'id')
  evaluation: Evaluation;
}
