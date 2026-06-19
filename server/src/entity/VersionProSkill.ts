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
import { Department } from './Department';
import { User } from './User';
import { ListProSkill } from './ListProSkill';
import { Skill } from './Skill';
import { CompanyGroup } from './CompanyGroup';
import { HistoryPublicProSkill } from './HistoryPublicProSkill';

interface VersionProSkillI {
  id: number;
  version: number;
  subVersion: number;
  skillId: number;
  status: number;
  creationUser: number;
  reason: string;
  publicStatus: number;
  publicDate: string;
  createdTime: Date;
  updatedTime: Date;
  department: Department;
  skill: Skill;
  user: User;
  lastUpdatedTime: string;
  listProSkills: ListProSkill[];
  companyGroupCode: string;
}

@Table({
  tableName: 'version_pro_skill_tbl',
})
export class VersionProSkill extends Model<VersionProSkillI> {
  @Column({
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

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

  @ForeignKey(() => Skill)
  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'skill_id',
  })
  skillId: number;

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
    type: DataTypes.SMALLINT,
    field: 'public_status',
  })
  publicStatus: number;

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

  @BelongsTo(() => Skill, 'skill_id')
  skill: Skill;

  @BelongsTo(() => User, 'creation_user')
  user: User;

  @BelongsTo(() => CompanyGroup, 'company_group_code')
  companyGroup: CompanyGroup;

  @HasMany(() => ListProSkill, 'version_id')
  listProSkills: ListProSkill[];

  @HasMany(() => HistoryPublicProSkill, 'version_id')
  historyPublicProSkills: HistoryPublicProSkill[];
}
