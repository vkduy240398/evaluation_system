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
import { EvaluationPeriod } from './EvaluationPeriod';
import { validate } from 'class-validator';

interface SettingReviewI {
  id: number;
  viewerId: number;
  userId: number;
  evaluationPeriodId: number;
  type: number;
  createdTime: Date;
  updatedTime: Date;
  companyGroupCode: string;
  order: number;
  creationType: number;
}

@Table({ tableName: 'setting_review_tbl' })
export class SettingReview extends Model<SettingReviewI> {
  @Column({
    primaryKey: true,
    type: DataTypes.BIGINT,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'viewer_id',
  })
  viewerId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'user_id',
  })
  userId: number;

  @ForeignKey(() => EvaluationPeriod)
  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'evaluation_period_id',
  })
  evaluationPeriodId: number;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    comment: `1: 目標
    2: 目標&目標承認履歴
    3: 評価結果（点数のみ）
    4: 評価結果（自己評価）
    5: 評価結果&承認履歴（非公開コメント以外）
    6: 評価結果詳細（非公開コメントを含めて）`,
  })
  type: number;

  @Column({
    primaryKey: true,
    type: DataTypes.DECIMAL(2, 1),
    allowNull: false,
    field: 'order',
  })
  order: number;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'creation_type',
  })
  creationType: number;

  @AllowNull(false)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;

  @Column({
    type: DataTypes.STRING(255),
    field: 'company_group_code',
  })
  companyGroupCode: string;

  @BelongsTo(() => User, 'viewer_id')
  viewerIdFk: User;

  @BelongsTo(() => User, 'user_id')
  userIdFk: User;

  @BelongsTo(() => EvaluationPeriod, 'evaluation_period_id')
  evaluationPeriodIdFk: EvaluationPeriod;
}
