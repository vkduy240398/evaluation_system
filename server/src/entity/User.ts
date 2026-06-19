import { DataTypes } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Company } from './Company';
import { Department } from './Department';
import { Permission } from './Permission';
import { Role } from './Role';
import { EvaluatorDefault } from './EvaluatorDefault';
import { Evaluation } from './Evaluation';
import { SkillUser } from './SkillUser';
import { SettingReview } from './SettingReview';
import { CompanyGroup } from './CompanyGroup';
import { UserHistoryUpdate } from './UserHistoryUpdate';

@Table({ tableName: 'user_tbl' })
export class User extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.SMALLINT,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataTypes.STRING(7),
    allowNull: false,
    field: 'employee_number',
    // unique: true,
  })
  employeeNumber: string;

  @Column({
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'full_name',
  })
  fullName: string;

  @Column({ type: DataTypes.STRING(50), allowNull: false })
  email: string;

  @ForeignKey(() => Department)
  @Column({ type: DataTypes.SMALLINT, field: 'department_id' })
  departmentId: number;

  @ForeignKey(() => Department)
  @Column({ type: DataTypes.SMALLINT, field: 'division_id' })
  divisionId: number;

  @ForeignKey(() => Company)
  @Column({ type: DataTypes.SMALLINT, field: 'company_id' })
  companyId: number;

  @Column({ type: DataTypes.SMALLINT, allowNull: false })
  active: number;

  @Column({ type: DataTypes.SMALLINT })
  level: number;

  @Default(1)
  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'flag_skill',
  })
  flagSkill: number;

  @Column({
    field: 'company_group_code',
    type: DataTypes.STRING(20),
  })
  @ForeignKey(() => CompanyGroup)
  companyGroupCode: string;

  @AllowNull(false)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;

  @BelongsTo(() => Department, 'department_id')
  department: Department;

  @BelongsTo(() => Department, 'division_id')
  division: Department;

  @BelongsTo(() => Company, 'company_id')
  company: Company;

  @BelongsTo(() => CompanyGroup, 'company_group_code')
  companyGroup: CompanyGroup;

  // ** association

  @BelongsToMany(() => Role, () => Permission, 'user_id', 'role_id')
  roles: Role[];
  @BelongsToMany(() => Role, () => Permission, 'user_id', 'role_id')
  rolesCondition: Role[];
  setRoles!: (arg: any[]) => Promise<Role[]> | Role[];
  getRoles!: () => Promise<Role[]>;
  countRoles!: () => Promise<number>;

  @HasMany(() => Permission)
  permissions: Permission[];

  @HasOne(() => EvaluatorDefault)
  evaluatorDefault: EvaluatorDefault;

  @HasMany(() => Evaluation)
  evaluations: Evaluation[];

  @HasMany(() => EvaluatorDefault)
  evaluatorDefaults: EvaluatorDefault[];

  @HasMany(() => SkillUser)
  skillUser: SkillUser[];

  @HasMany(() => SettingReview)
  settingReview: SettingReview[];

  @HasMany(() => UserHistoryUpdate, 'user_id')
  userHistoryUpdates: UserHistoryUpdate[];
}
