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
import { User } from './User';
import { Feedback } from './Feedback';

interface FeedbackCommnetI {
  id: number;
  content: string;
  feedbackId: number;
  userId: number;
  createdTime: Date;
  updatedTime: Date;
  active: number;
}

@Table({ tableName: 'feedback_comment_tbl' })
export class FeedbackCommnet extends Model<FeedbackCommnetI> {
  @Column({
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataTypes.STRING(501),
    allowNull: false,
  })
  content: string;

  @ForeignKey(() => Feedback)
  @Column({
    type: DataTypes.NUMBER,
    allowNull: true,
    field: 'feedback_id',
  })
  feedbackId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'user_id',
  })
  userId: number;

  @Column({ type: DataTypes.SMALLINT, allowNull: false })
  active: number;

  @AllowNull(false)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;

  @BelongsTo(() => User, 'user_id')
  user: User;

  @BelongsTo(() => Feedback, 'feedback_id')
  feedback: Feedback;
}
