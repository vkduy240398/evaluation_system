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
import { Department } from './Department';
import { CompanyGroup } from './CompanyGroup';

@Table({ tableName: 'history_update_department_tbl' })
export class HistoryUpdateDepartment extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.SMALLINT,
    allowNull: false,
    autoIncrement: true,
    field: 'id',
  })
  id: number;

  @Column({
    type: DataTypes.STRING(4),
    allowNull: false,
    field: 'year',
  })
  year: string;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'period_index',
  })
  periodIndex: number;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'type',
  })
  type: number;

  @Column({
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'department_name',
  })
  departmentName: string;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'department_id',
  })
  departmentId: number;

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

  @BelongsTo(() => Department, 'department_id')
  department: Department;
}
