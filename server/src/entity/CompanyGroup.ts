import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

interface ICompanyGroup {
  id: number;
  name: string;
  createdTime: Date;
  updatedTime: Date;
}

@Table({ tableName: 'company_group_tbl' })
export class CompanyGroup extends Model<ICompanyGroup> {
  @Column({
    primaryKey: true,
    type: DataType.STRING(20),
    allowNull: false,
  })
  code: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
  })
  icon: string;

  @Column({
    type: DataType.STRING(100),
  })
  timezone: string;

  @Column({
    field: 'email_hr',
    type: DataType.STRING(100),
  })
  emailHR: string;

  @Column({ field: 'created_time', allowNull: false })
  @CreatedAt
  createdTime: Date;

  @Column({ field: 'updated_time', allowNull: false })
  @UpdatedAt
  updatedTime: Date;
}
