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
import { Evaluation } from './Evaluation';
import { User } from './User';

interface HistoryApproveEvaluationI {
  evaluationId: number;
  comment: string;
  approverId: number;
  receiverId: number;
  receiverOrder: number;
  type: number;
  status: string;
  createdTime: Date;
  updatedTime: Date;
}

@Table({ tableName: 'history_approve_evaluation_tbl' })
export class HistoryApproveEvaluation extends Model<HistoryApproveEvaluationI> {
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
    type: DataTypes.STRING(501),
  })
  comment: string;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'approver_id',
  })
  approverId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.DECIMAL(2, 1),
    field: 'receiver_id',
  })
  receiverId: number;

  @Column({
    type: DataTypes.DECIMAL(2, 1),
    field: 'receiver_order',
  })
  receiverOrder: number;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
  })
  type: number;

  @Column({
    type: DataTypes.STRING(50),
    allowNull: false,
  })
  status: string;

  @AllowNull(false)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;

  @BelongsTo(() => Evaluation, 'evaluation_id')
  evaluation: Evaluation;

  @BelongsTo(() => User, 'approver_id')
  approverUser: User;

  @BelongsTo(() => User, 'receiver_id')
  receiverUser: User;
}
