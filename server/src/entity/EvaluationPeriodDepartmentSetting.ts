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
import { EvaluationPeriod } from './EvaluationPeriod';
import { Department } from './Department';
import { CompanyGroup } from './CompanyGroup';

@Table({
  tableName: 'evaluation_period_department_setting_tbl',
  indexes: [
    { fields: ['evaluation_period_id'] },
    { fields: ['department_id'] },
    { fields: ['evaluation_period_id', 'department_id'], unique: true },
  ],
})
export class EvaluationPeriodDepartmentSetting extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'evaluation_period_id',
  })
  evaluationPeriodId: number;

  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'department_id',
  })
  departmentId: number;

  @Column({
    type: DataTypes.STRING(20),
    field: 'company_group_code',
  })
  companyGroupCode: string;

  // 部門目標設定 (form: deptGoalSetting)
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

  // 個人目標設定 (form: userGoalSetting)
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

  // 部門評価 (form: deptEvaluation)
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

  // 個人評価 (form: userEvaluation)
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

  // 0=未確認, 1=目標確定済, 2=評価完了
  @Column({
    type: DataTypes.SMALLINT,
    field: 'check_fixed',
    defaultValue: 0,
  })
  checkFixed: number;

  @AllowNull(false)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;

  @BelongsTo(() => EvaluationPeriod, 'evaluation_period_id')
  evaluationPeriod: EvaluationPeriod;

  @BelongsTo(() => Department, 'department_id')
  department: Department;

  @BelongsTo(() => CompanyGroup, 'company_group_code')
  companyGroup: CompanyGroup;
}
