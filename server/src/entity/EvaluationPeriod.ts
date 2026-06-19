import { DataTypes } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  HasMany,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Evaluation } from './Evaluation';
import { EvaluatorDefault } from './EvaluatorDefault';
import { CompanyGroup } from './CompanyGroup';

@Table({
  tableName: 'evaluation_period_tbl',
  indexes: [{ fields: ['year', 'period_index'], unique: false }],
})
export class EvaluationPeriod extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataTypes.STRING(4),
    allowNull: false,
  })
  year: string;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'period_index',
  })
  periodIndex: number;

  @Column({
    type: DataTypes.STRING(7),
    allowNull: false,
    field: 'period_start',
  })
  periodStart: string;

  @Column({
    type: DataTypes.STRING(7),
    allowNull: false,
    field: 'period_end',
  })
  periodEnd: string;

  @Column({
    type: DataTypes.STRING(10),
    field: 'date_creation_goal_start',
  })
  dateCreationGoalStart: string;

  @Column({
    type: DataTypes.STRING(10),
    field: 'date_creation_goal_end',
  })
  dateCreationGoalEnd: string;

  @Column({
    type: DataTypes.STRING(10),
    field: 'date_evaluation_start',
  })
  dateEvaluationStart: string;

  @Column({
    type: DataTypes.STRING(10),
    field: 'date_evaluation_end',
  })
  dateEvaluationEnd: string;

  @Column({
    type: DataTypes.STRING(10),
    field: 'date_creation_goal_department_start',
  })
  dateCreationGoalDepartmentStart: string;

  @Column({
    type: DataTypes.STRING(10),
    field: 'date_creation_goal_department_end',
  })
  dateCreationGoalDepartmentEnd: string;

  @Column({
    type: DataTypes.STRING(10),
    field: 'date_evaluation_department_start',
  })
  dateEvaluationDepartmentStart: string;

  @Column({
    type: DataTypes.STRING(10),
    field: 'date_evaluation_department_end',
  })
  dateEvaluationDepartmentEnd: string;

  // @Column({
  //   type: DataTypes.BOOLEAN,
  //   field: 'check_send_mail_creation_goal',
  // })
  // checkSendMailCreationGoal: boolean;

  // @Column({
  //   type: DataTypes.STRING(10),
  //   field: 'date_send_mail_creation_goal',
  // })
  // dateSendMailCreationGoal: string;

  // @Column({
  //   type: DataTypes.BOOLEAN,
  //   field: 'check_send_mail_evaluation',
  // })
  // checkSendMailEvaluation: boolean;

  // @Column({
  //   type: DataTypes.STRING(10),
  //   field: 'date_send_mail_evaluation',
  // })
  // dateSendMailEvaluation: string;

  // @Column({
  //   type: DataTypes.BOOLEAN,
  //   field: 'check_send_mail_creation_goal_department',
  // })
  // checkSendMailCreationGoalDepartment: boolean;

  // @Column({
  //   type: DataTypes.STRING(10),
  //   field: 'date_send_mail_creation_goal_department',
  // })
  // dateSendMailCreationGoalDepartment: string;

  // @Column({
  //   type: DataTypes.BOOLEAN,
  //   field: 'check_send_mail_evaluation_department',
  // })
  // checkSendMailEvaluationDepartment: boolean;

  // @Column({
  //   type: DataTypes.STRING(10),
  //   field: 'date_send_mail_evaluation_department',
  // })
  // dateSendMailEvaluationDepartment: string;

  // @Column({
  //   type: DataTypes.BOOLEAN,
  //   field: 'check_new_creation_goal',
  // })
  // checkNewCreationGoal: boolean;

  // @Column({
  //   type: DataTypes.BOOLEAN,
  //   field: 'check_new_creation_department',
  // })
  // checkNewCreationDepartment: boolean;

  // @Column({
  //   type: DataTypes.BOOLEAN,
  //   field: 'check_new_evaluation_goal',
  // })
  // checkNewEvaluationGoal: boolean;

  // @Column({
  //   type: DataTypes.BOOLEAN,
  //   field: 'check_new_evaluation_department',
  // })
  // checkNewEvaluationDepartment: boolean;

  @AllowNull(false)
  @AllowNull(false)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'check_fixed',
    defaultValue: 0,
  })
  checkFixed: number;

  @Column({
    type: DataTypes.STRING(20),
    field: 'company_group_code',
  })
  companyGroupCode: string;

  @BelongsTo(() => CompanyGroup, 'company_group_code')
  companyGroup: CompanyGroup;

  @HasMany(() => Evaluation)
  evaluations: Evaluation[];

  @HasMany(() => EvaluatorDefault)
  evaluatorDefaults: EvaluatorDefault[];

  @HasOne(() => EvaluatorDefault)
  evaluatorDefault: EvaluatorDefault;
}
