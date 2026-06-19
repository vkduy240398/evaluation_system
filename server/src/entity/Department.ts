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
import { DivisionSubclass } from './DivisionSubclass';
import { CompanyGroup } from './CompanyGroup';

@Table({ tableName: 'department_tbl' })
export class Department extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.SMALLINT,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataTypes.STRING(100),
    allowNull: false,
  })
  code: string;

  @Column({
    type: DataTypes.STRING(100),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
  })
  class: number;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
  })
  type: number;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
  })
  active: number;

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

  @BelongsTo(() => CompanyGroup, 'company_group_code')
  companyGroup: CompanyGroup;

  @HasMany(() => DivisionSubclass, 'division_id')
  divisionSubclass: any[];

  @HasMany(() => DivisionSubclass, 'department_id')
  departmentSubClasses: any;
}
