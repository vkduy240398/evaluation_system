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
import { VersionProSkill } from './VersionProSkill';
import { SkillRole } from './SkillRole';
import { SkillGroup } from './SkillGroup';
import { SkillUser } from './SkillUser';
import { CompanyGroup } from './CompanyGroup';

@Table({ tableName: 'skill_tbl' })
export class Skill extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataTypes.STRING(100),
    allowNull: false,
  })
  name: string;

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

  @HasMany(() => SkillRole)
  skillRoles: SkillRole[];
  setSkillRoles: (arg: any[]) => Promise<any>;
  countSkillRoles: () => Promise<number>;

  @HasMany(() => VersionProSkill, 'skill_id')
  versionProSkill: VersionProSkill[];

  @HasMany(() => SkillGroup, 'skill_id')
  skills: SkillGroup[];

  @HasMany(() => SkillUser, 'skill_id')
  skillUsers: SkillUser[];
}
