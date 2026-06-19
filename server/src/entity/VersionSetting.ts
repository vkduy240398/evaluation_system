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
import { SettingAchievementAdditional } from './SettingAchievementAdditional';
import { SettingAchievementPersonal } from './SettingAchievementPersonal';
import { SettingFormula810 } from './SettingFormula810';
import { SettingLevel } from './SettingLevel';
import { SettingPointBasicBehaviorPro } from './SettingPointBasicBehaviorPro';
import { SettingProFormula } from './SettingProFormula';
import { User } from './User';
import { CompanyGroup } from './CompanyGroup';

@Table({ tableName: 'version_setting_tbl' })
export class VersionSetting extends Model {
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
    type: DataTypes.SMALLINT,
    field: 'basic_max_difficulty',
  })
  basicMaxDifficulty: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'behavior_max_weight',
  })
  behaviorMaxWeight: number;

  @Column({
    type: DataTypes.DECIMAL(8, 2),
    field: 'max_point_result',
  })
  maxPoint: number;

  @Column({
    type: DataTypes.DECIMAL(8, 2),
    field: 'min_point_result',
  })
  minPoint: number;

  @Column({
    type: DataTypes.DECIMAL(8, 2),
    field: 'max_point_dep_result',
  })
  maxPointDep: number;

  @Column({
    type: DataTypes.DECIMAL(8, 2),
    field: 'min_point_dep_result',
  })
  minPointDep: number;

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
    field: 'company_group_code',
  })
  companyGroupCode: string;

  @BelongsTo(() => User, 'creation_user')
  user: User;

  @BelongsTo(() => CompanyGroup, 'company_group_code')
  companyGroup: CompanyGroup;

  @HasMany(() => SettingPointBasicBehaviorPro)
  settingPointBasicBehaviorPros: SettingPointBasicBehaviorPro[];

  @HasMany(() => SettingPointBasicBehaviorPro)
  settingPointBasic: SettingPointBasicBehaviorPro[];

  @HasMany(() => SettingPointBasicBehaviorPro)
  settingPointBehavior: SettingPointBasicBehaviorPro[];

  @HasMany(() => SettingPointBasicBehaviorPro)
  settingPointPro: SettingPointBasicBehaviorPro[];

  @HasMany(() => SettingProFormula)
  settingProFormula: SettingProFormula[];

  @HasMany(() => SettingAchievementPersonal)
  settingAchievementPersonalType1: SettingAchievementPersonal[];

  @HasMany(() => SettingAchievementPersonal)
  settingAchievementPersonalType2: SettingAchievementPersonal[];

  @HasMany(() => SettingAchievementAdditional)
  settingAchievementAdditional: SettingAchievementAdditional[];

  @HasMany(() => SettingAchievementAdditional)
  settingAchievementAdditional2: SettingAchievementAdditional[];

  @HasMany(() => SettingAchievementPersonal)
  settingAchievementPersonalType3: SettingAchievementPersonal[];

  @HasMany(() => SettingAchievementPersonal)
  settingAchievementPersonalType4: SettingAchievementPersonal[];

  @HasMany(() => SettingLevel)
  settingLevel: SettingLevel[];

  @HasMany(() => SettingFormula810)
  settingFormula810: SettingFormula810[];
}
