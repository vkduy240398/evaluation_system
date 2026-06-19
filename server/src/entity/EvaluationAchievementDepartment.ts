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
import { Evaluation } from './Evaluation';
import { EvaluationAchievementDepartmentSub } from './EvaluationAchievementDepartmentSub';

@Table({ tableName: 'evaluation_achievement_department_tbl' })
export class EvaluationAchievementDepartment extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.BIGINT,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Evaluation)
  @Column({
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'evaluation_id',
  })
  evaluationId: number;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'item_no',
  })
  itemNo: number;

  @Column({
    type: DataTypes.STRING(201),
  })
  title: string;

  @Column({
    type: DataTypes.STRING(201),
    field: 'achievement_value',
  })
  achievementValue: string;

  @Column({
    type: DataTypes.STRING(501),
  })
  method: string;

  @Column({
    type: DataTypes.SMALLINT,
  })
  weight: number;

  @Column({
    type: DataTypes.DECIMAL(5, 2),
    field: 'difficulty_user',
  })
  difficultyUser: number;

  @Column({
    type: DataTypes.DECIMAL(5, 2),
    field: 'difficulty_evaluator_0_5',
  })
  difficultyEvaluator05: number;

  @Column({
    type: DataTypes.DECIMAL(5, 2),
    field: 'difficulty_evaluator_1',
  })
  difficultyEvaluator1: number;

  @Column({
    type: DataTypes.DECIMAL(5, 2),
    field: 'difficulty_evaluator_2',
  })
  difficultyEvaluator2: number;

  @Column({
    type: DataTypes.STRING(10),
    field: 'achievement_status',
  })
  achievementStatus: string;

  @Column({
    type: DataTypes.STRING(501),
    field: 'reason_comment',
  })
  reasonComment: string;

  @Column({
    type: DataTypes.STRING(501),
    field: 'action_plan',
  })
  actionPlan: string;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'point_user',
  })
  pointUser: number;

  @Column({
    type: DataTypes.DECIMAL(5, 2),
    field: 'coefficient_user',
  })
  coefficientUser: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'point_evaluator_0_5',
  })
  pointEvaluator05: number;

  @Column({
    type: DataTypes.DECIMAL(5, 2),
    field: 'coefficient_evaluator_0_5',
  })
  coefficientEvaluator05: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'point_evaluator_1',
  })
  pointEvaluator1: number;

  @Column({
    type: DataTypes.DECIMAL(5, 2),
    field: 'coefficient_evaluator_1',
  })
  coefficientEvaluator1: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'point_evaluator_2',
  })
  pointEvaluator2: number;

  @Column({
    type: DataTypes.DECIMAL(5, 2),
    field: 'coefficient_evaluator_2',
  })
  coefficientEvaluator2: number;

  @AllowNull(false)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;

  @HasMany(() => EvaluationAchievementDepartmentSub, 'achievement_personal_id')
  EvaluationAchievementDepartmentSub: EvaluationAchievementDepartmentSub[];
  getEvaluationAchievementDepartmentSub: () => EvaluationAchievementDepartmentSub[];

  @BelongsTo(() => Evaluation, 'evaluation_id')
  evaluation: Evaluation;
}
