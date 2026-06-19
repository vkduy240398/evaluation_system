import { DataTypes } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Evaluation } from './Evaluation';
import { User } from './User';

@Table({ tableName: 'evaluator_tbl' })
export class Evaluator extends Model {
  @ForeignKey(() => Evaluation)
  @Column({
    primaryKey: true,
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'evaluation_id',
    references: {
      model: Evaluation,
      key: 'id',
    },
  })
  evaluationId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'evaluator_id',
  })
  evaluatorId: number;

  @Column({
    primaryKey: true,
    type: DataTypes.DECIMAL(2, 1),
    allowNull: false,
    field: 'evaluation_order',
  })
  evaluationOrder: number;

  @Column({
    type: DataTypes.STRING(2001),
    field: 'comment_public',
  })
  commentPublic: string;

  @Column({
    type: DataTypes.STRING(2001),
    field: 'comment_private',
  })
  commentPrivate: string;

  @AllowNull(false)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;

  @BelongsTo(() => User, 'evaluator_id')
  user: User;

  @HasOne(() => Evaluation, 'id')
  evaluation: Evaluation;
}
