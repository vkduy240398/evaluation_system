import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Department } from './Department';

@Table({ tableName: 'division_subclass_tbl', timestamps: false })
export class DivisionSubclass extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.SMALLINT,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Department)
  @Column({
    type: DataTypes.SMALLINT,
    field: 'division_id',
    allowNull: false,
  })
  divisionId: number;

  @ForeignKey(() => Department)
  @Column({
    type: DataTypes.SMALLINT,
    field: 'department_id',
    allowNull: false,
  })
  departmentId: number;

  @BelongsTo(() => Department, 'division_id')
  division: Department;

  @BelongsTo(() => Department, 'department_id')
  department: Department;
}
