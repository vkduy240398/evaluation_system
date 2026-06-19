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
import { Department } from './Department';
import { VersionProSkill } from './VersionProSkill';
import { Skill } from './Skill';

@Table({ tableName: 'history_public_pro_skill_tbl' })
export class HistoryPublicProSkill extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.BIGINT,
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

  @ForeignKey(() => VersionProSkill)
  @Column({ type: DataTypes.INTEGER, field: 'version_id' })
  versionId: number;

  @ForeignKey(() => Skill)
  @Column({ type: DataTypes.SMALLINT, field: 'skill_id' })
  skillId: number;

  @ForeignKey(() => Department)
  @Column({
    primaryKey: true,
    type: DataTypes.SMALLINT,
    unique: false,
    field: 'department_id',
    references: {
      key: 'id',
      model: 'department_tbl',
    },
  })
  departmentId: number;

  @Column({
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'company_group_code',
  })
  companyGroupCode: string;

  @AllowNull(false)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;

  @BelongsTo(() => Skill, {
    targetKey: 'id',
    foreignKey: 'skill_id',
  })
  skill: Skill;

  @BelongsTo(() => Department, {
    targetKey: 'id',
    foreignKey: 'department_id',
  })
  department: Department;

  @BelongsTo(() => VersionProSkill, {
    targetKey: 'id',
    foreignKey: 'version_id',
  })
  versionProSkill: VersionProSkill;
}
