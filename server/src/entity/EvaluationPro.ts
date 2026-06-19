import { DataTypes } from 'sequelize';
import {
  AllowNull,
  Column,
  CreatedAt,
  ForeignKey,
  Table,
  UpdatedAt,
  Model,
  Default,
} from 'sequelize-typescript';
import { Evaluation } from './Evaluation';

@Table({ tableName: 'evaluation_pro_tbl' })
export class EvaluationPro extends Model {
  @ForeignKey(() => Evaluation)
  @Column({
    primaryKey: true,
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'evaluation_id',
  })
  evaluationId: number;

  @Default(null)
  @Column({
    type: DataTypes.STRING(101),
    field: 'job_type',
  })
  jobType: string;

  @Column({
    primaryKey: true,
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'item_id',
  })
  itemId: string;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'item_no',
  })
  itemNo: number;

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

  // ** new
  @Column({
    type: DataTypes.STRING(501),
  })
  note: string;

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
    field: 'total_point_user',
  })
  totalPointUser: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'point_evaluator_0_5',
  })
  pointEvaluator05: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'total_point_evaluator_0_5',
  })
  totalPointEvaluator05: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'point_evaluator_1',
  })
  pointEvaluator1: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'total_point_evaluator_1',
  })
  totalPointEvaluator1: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'point_evaluator_2',
  })
  pointEvaluator2: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'total_point_evaluator_2',
  })
  totalPointEvaluator2: number;

  @Column({
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_disable',
  })
  isDisable: boolean;

  @AllowNull(false)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;
}
