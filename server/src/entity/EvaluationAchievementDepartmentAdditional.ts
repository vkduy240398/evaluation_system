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
import { Evaluation } from './Evaluation';

@Table({ tableName: 'evaluation_achievement_department_additional_tbl' })
export class EvaluationAchievementDepartmentAdditional extends Model {
  @ForeignKey(() => Evaluation)
  @Column({
    primaryKey: true,
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'evaluation_id',
  })
  evaluationId: number;

  @Column({
    primaryKey: true,
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'item_no',
  })
  itemNo: number;

  @Column({
    type: DataTypes.STRING(501),
    field: 'title_additional',
  })
  titleAdditional: string;

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
    type: DataTypes.STRING(10),
    field: 'point_user',
  })
  pointUser: string;

  @Column({
    type: DataTypes.STRING(10),
    field: 'point_evaluator_0_5',
  })
  pointEvaluator05: string;

  @Column({
    type: DataTypes.STRING(10),
    field: 'point_evaluator_1',
  })
  pointEvaluator1: string;

  @Column({
    type: DataTypes.STRING(10),
    field: 'point_evaluator_2',
  })
  pointEvaluator2: string;

  @AllowNull(false)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;
}
