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
import { User } from './User';
import { CompanyGroup } from './CompanyGroup';

@Table({ tableName: 'version_guide_evaluation_tbl' })
export class VersionGuideEvaluation extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.SMALLINT,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
  })
  type: number;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
  })
  version: number;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'sub_version',
  })
  subVersion: number;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
  })
  status: number;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'creation_user',
  })
  creationUser: number;

  @Column({
    type: DataTypes.STRING(501),
  })
  reason: string;

  @Column({
    type: DataTypes.TEXT,
    field: 'content_evaluation_criteria',
  })
  contentEvaluationCriteria: string;

  @Column({
    type: DataTypes.TEXT,
    field: 'content_notes',
  })
  contentNotes: string;

  @Column({
    type: DataTypes.STRING(16),
    field: 'public_date',
  })
  publicDate: string;

  @Column({
    type: DataTypes.STRING(16),
    field: 'last_updated_time',
  })
  lastUpdatedTime: string;

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

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => CompanyGroup)
  companyGroup: CompanyGroup;
}
