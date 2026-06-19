import { DataTypes } from 'sequelize';
import {
  Column,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  Model,
  Table,
  BelongsTo,
} from 'sequelize-typescript';
import { CompanyGroup } from './CompanyGroup';

@Table({ tableName: 'mail_template_tbl' })
export class MailTemplate extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.SMALLINT,
    allowNull: false,
    // autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
  })
  type: number;

  @Column({
    type: DataTypes.STRING(30),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataTypes.STRING(200),
    allowNull: false,
  })
  subject: string;

  @Column({
    type: DataTypes.STRING(200),
    allowNull: true,
  })
  note: string;

  @Column({
    type: DataTypes.TEXT,
    allowNull: false,
  })
  content: string;

  @Column({
    type: DataTypes.SMALLINT,
  })
  sort: number;

  @Column({
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'setting',
  })
  setting: string;

  @AllowNull(false)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;

  @Column({
    primaryKey: true,
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'company_group_code',
  })
  companyGroupCode: string;

  @BelongsTo(() => CompanyGroup, 'company_group_code')
  companyGroupFK: CompanyGroup;
}
