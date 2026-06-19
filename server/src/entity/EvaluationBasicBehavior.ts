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

@Table({ tableName: 'evaluation_basic_behavior_tbl' })
export class EvaluationBasicBehavior extends Model {
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
    primaryKey: true,
    type: DataTypes.SMALLINT,
    allowNull: false,
  })
  type: number;

  @Column({
    type: DataTypes.STRING(101),
    allowNull: false,
    field: 'item_title',
  })
  itemTitle: string;

  @Column({
    type: DataTypes.STRING(501),
    allowNull: false,
  })
  content: string;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
  })
  difficulty: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'point_user',
  })
  pointUser: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'point_evaluator_0_5',
  })
  pointEvaluator05: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'point_evaluator_1',
  })
  pointEvaluator1: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'point_evaluator_2',
  })
  pointEvaluator2: number;

  @AllowNull(false)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;
}
