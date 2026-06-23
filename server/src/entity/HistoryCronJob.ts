import { DataTypes } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CompanyGroup } from './CompanyGroup';
@Table({ tableName: 'history_cron_job_tbl' })
export class HistoryCronJob extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataTypes.STRING(100),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
  })
  type: number;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: true,
    field: 'period_index',
  })
  periodIndex: number;

  @Column({
    type: DataTypes.STRING(4),
    allowNull: true,
    field: 'year',
  })
  year: string;

  @Column({
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'date_creation_goal_start',
  })
  dateCreationGoalStart: string;

  @Column({
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'date_creation_goal_end',
  })
  dateCreationGoalEnd: string;

  @Column({
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'date_creation_goal_department_start',
  })
  dateCreationGoalDepartmentStart: string;

  @Column({
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'date_creation_goal_department_end',
  })
  dateCreationGoalDepartmentEnd: string;

  @Column({
    type: DataTypes.STRING(16),
    allowNull: true,
    field: 'date_send_mail_evaluation_goal',
  })
  dateSendMailEvaluationGoal: string;

  @Column({
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'evaluation_period_id',
  })
  evaluationPeriodId: number;

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
    allowNull: true,
    field: 'company_group_code',
  })
  companyGroupCode: string;

  @BelongsTo(() => CompanyGroup, 'company_group_code')
  companyGroupFK: CompanyGroup;
}
