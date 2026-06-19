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
import { User } from './User';
import { CompanyGroup } from './CompanyGroup';
import { FeedbackCommnet } from './FeedbackComment';
import { Roles } from '../enum/Roles';
import { FeedbackType } from '../enum/FeedbackType';
import { FeedbackPhase } from '../enum/FeedbackPhase';
import { FeedbackImpactScope } from '../enum/FeedbackImpactScope';
import { FeedbackStatus } from '../enum/FeedbackStatus';

interface FeedbackI {
  id: number;
  role: Roles[];
  type: FeedbackType;
  phase: FeedbackPhase;
  feature: string[];
  summary: string;
  detail: string;
  impactScope: FeedbackImpactScope;
  status: FeedbackStatus;
  attachFiles: string;
  userId: number;
  group: number;
  createdTime: Date;
  updatedTime: Date;
  companyGroupCode: string;
}

@Table({ tableName: 'feedback_tbl' })
export class Feedback extends Model<FeedbackI> {
  @Column({
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataTypes.ARRAY(DataTypes.SMALLINT),
    allowNull: true,
  })
  role: Roles[];

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    comment: `0: other
              1: bug
              2: request
              3: question`,
  })
  type: FeedbackType;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    comment: `0: other
              1: goal
              2: evaluation`,
  })
  phase: FeedbackPhase;

  @Column({
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  })
  feature: string[];

  @Column({ type: DataTypes.STRING(1001), allowNull: false })
  summary: string;

  @Column({ type: DataTypes.TEXT, allowNull: true })
  detail: string;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: true,
    comment: `1: low
              2: normal
              3: high`,
    field: 'impact_scope',
  })
  impactScope: FeedbackImpactScope;

  @Column({ type: DataTypes.TEXT, field: 'attach_files', allowNull: true })
  attachFiles: string;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    comment: `1: Submitted
              2: Confirming content
              3: No action needed
              4: Action required
              5: In Progress
              6: Resolved
              7: Closed
              8: Canceled`,
  })
  status: FeedbackStatus;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: true,
  })
  group: number;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'user_id',
  })
  userId: number;

  // @Column({
  //   type: DataTypes.STRING(16),
  //   allowNull: false,
  //   field: 'send_time',
  // })
  // sendTime: string;

  @AllowNull(false)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;

  @Column({
    type: DataTypes.STRING(20),
    field: 'company_group_code',
  })
  companyGroupCode: string;

  @BelongsTo(() => User, 'user_id')
  userFK: User;

  @BelongsTo(() => CompanyGroup, 'company_group_code')
  companyGroupFK: CompanyGroup;

  @HasMany(() => FeedbackCommnet)
  comments: FeedbackCommnet[];
}
