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
import { EvaluationPeriod } from './EvaluationPeriod';
import { HistoryCronJob } from './HistoryCronJob';
import { CompanyGroup } from './CompanyGroup';

@Table({ tableName: 'history_mail_tbl' })
export class HistoryMail extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Evaluation)
  @Column({
    type: DataTypes.BIGINT,
    field: 'evaluation_id',
  })
  evaluationId: number;

  @ForeignKey(() => EvaluationPeriod)
  @Column({
    type: DataTypes.INTEGER,
    field: 'evaluation_period_id',
  })
  evaluationPeriodId: number;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
  })
  status: number;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
  })
  type: number;

  @Column({
    type: DataTypes.TEXT,
    field: 'mail_to',
  })
  mailTo: string;

  @Column({
    type: DataTypes.TEXT,
    field: 'mail_cc',
  })
  mailCC: string;

  @Column({
    type: DataTypes.STRING(30),
    field: 'evaluation_time',
  })
  evaluationTime: string;

  @Column({
    type: DataTypes.STRING(30),
    field: 'evaluation_department_time',
  })
  evaluationDepartmentTime: string;

  @Column({
    type: DataTypes.STRING(16),
    field: 'send_time_setting',
  })
  sendTimeSetting: string;

  @Column({
    type: DataTypes.STRING(16),
    field: 'send_time_actual',
  })
  sendTimeActual: string;

  @Column({
    type: DataTypes.TEXT,
  })
  title: string;

  @Column({
    type: DataTypes.TEXT,
    field: 'content_mail',
  })
  contentMail: string;

  @ForeignKey(() => HistoryCronJob)
  @Column({
    type: DataTypes.INTEGER,
    field: 'cronjob_id',
  })
  cronjobId: number;

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

  @BelongsTo(() => Evaluation, 'evaluation_id')
  evaluation: Evaluation;

  @BelongsTo(() => EvaluationPeriod, 'evaluation_period_id')
  evaluationPeriod: EvaluationPeriod;

  @BelongsTo(() => HistoryCronJob, 'cronjob_id')
  historyCronjob: HistoryCronJob;

  @BelongsTo(() => CompanyGroup, 'company_group_code')
  companyGroupFK: CompanyGroup;
}
