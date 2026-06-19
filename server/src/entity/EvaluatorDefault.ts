import { DataTypes } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  Default,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './User';
import { EvaluationPeriod } from './EvaluationPeriod';
import { CompanyGroup } from './CompanyGroup';
import { Department } from './Department';

@Table({ tableName: 'evaluator_default_tbl' })
export class EvaluatorDefault extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.SMALLINT,
    field: 'user_id',
  })
  userId: number;

  @Column({
    type: DataTypes.STRING(100),
    field: 'department_name',
  })
  departmentName: string;

  @Column({
    type: DataTypes.STRING(100),
    field: 'division_name',
  })
  divisionName: string;

  @Column({ type: DataTypes.SMALLINT })
  level: number;

  @Column({ type: DataTypes.SMALLINT, field: 'flag_skill' })
  flagSkill: number;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.SMALLINT,
    field: 'evaluator_0_5_id',
  })
  evaluator05Id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.SMALLINT,
    field: 'evaluator_1_id',
  })
  evaluator1Id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.SMALLINT,
    field: 'evaluator_2_id',
  })
  evaluator2Id: number;

  @ForeignKey(() => EvaluationPeriod)
  @Column({
    type: DataTypes.INTEGER,
    field: 'evaluation_period_id',
  })
  evaluationPeriodId: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'department_id',
  })
  departmentId: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'division_id',
  })
  divisionId: number;

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
  companyGroup: CompanyGroup;

  @BelongsTo(() => User, 'user_id')
  user: User;

  @BelongsTo(() => User, 'evaluator_0_5_id')
  evaluator05: User;

  @BelongsTo(() => User, 'evaluator_1_id')
  evaluator1: User;

  @BelongsTo(() => User, 'evaluator_2_id')
  evaluator2: User;

  @BelongsTo(() => EvaluationPeriod, 'evaluation_period_id')
  evaluationPeriod: EvaluationPeriod;

  @BelongsTo(() => Department, 'department_id')
  department: Department;

  @BelongsTo(() => Department, 'division_id')
  division: Department;
}
