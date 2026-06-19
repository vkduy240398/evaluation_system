import { ApiProperty } from '@nestjs/swagger';
import { SettingPointBasicBehaviorProDto } from '../generic/SettingPointBasicBehaviorProDto';
import { SettingProFormulaDto } from '../generic/SettingProFormulaDto';
import { SettingAchievementPersonalDto } from '../generic/SettingAchievementPersonalDto';
import { SettingAchievementAdditionalDto } from '../generic/SettingAchievementAdditionalDto';
import { SettingLevelDto } from './SettingLevelDto';
import { SettingFormula810Dto } from '../generic/SettingFormula810Dto';
import { CreationUserDto } from './CreationUserDto';

export class VersionSettingDto {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: Number, example: 1 })
  type: number;

  @ApiProperty({ type: Number, example: 2 })
  version: number;

  @ApiProperty({ type: Number, example: 0 })
  subVersion: number;

  @ApiProperty({ type: String, example: '2.0' })
  versionDisplay: string;

  @ApiProperty({ type: Number, example: 3 })
  status: number;

  @ApiProperty({ type: Number, example: 97 })
  creationUser: number;

  @ApiProperty({ type: String, example: '理由' })
  reason: string;

  @ApiProperty({ type: Number, example: 5 })
  basicMaxDifficulty: number;

  @ApiProperty({ type: Number, example: 10 })
  behaviorMaxWeight: number;

  @ApiProperty({ type: String, example: '' })
  publicDate: string;

  @ApiProperty({ type: String, example: '2023-07-12T09:34:54.983Z' })
  updatedTime: Date;

  @ApiProperty({ type: String, example: '' })
  lastUpdatedTime: string;

  @ApiProperty()
  user?: CreationUserDto;

  @ApiProperty()
  companyGroupCode?: string;

  @ApiProperty({ type: [SettingPointBasicBehaviorProDto] })
  settingPointBasic: SettingPointBasicBehaviorProDto[];

  @ApiProperty({ type: [SettingPointBasicBehaviorProDto] })
  settingPointBehavior: SettingPointBasicBehaviorProDto[];

  @ApiProperty({ type: [SettingPointBasicBehaviorProDto] })
  settingPointPro: SettingPointBasicBehaviorProDto[];

  @ApiProperty({ type: [SettingProFormulaDto] })
  settingProFormula: SettingProFormulaDto[];

  @ApiProperty({ type: [SettingAchievementPersonalDto] })
  settingAchievementPersonalDiff: SettingAchievementPersonalDto[];

  @ApiProperty({ type: [SettingAchievementPersonalDto] })
  settingAchievementPersonalJudgeIndex: SettingAchievementPersonalDto[];

  @ApiProperty({ type: [SettingAchievementAdditionalDto] })
  settingAchievementAdditional: SettingAchievementAdditionalDto[];

  @ApiProperty({ type: [SettingLevelDto] })
  settingLevel: SettingLevelDto[];

  @ApiProperty({ type: Boolean, example: false })
  existEditingVersion: boolean;

  @ApiProperty({ type: Number, example: 1 })
  maxPoint?: number;

  @ApiProperty({ type: Number, example: 1 })
  minPoint?: number;

  settingPointBasicBehaviorPros?: SettingPointBasicBehaviorProDto[];
  settingFormula810: SettingFormula810Dto[];
}

export class VersionSetting810NSDto {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: Number, example: 1 })
  type: number;

  @ApiProperty({ type: Number, example: 2 })
  version: number;

  @ApiProperty({ type: Number, example: 0 })
  subVersion: number;

  @ApiProperty({ type: String, example: '2.0' })
  versionDisplay: string;

  @ApiProperty({ type: Number, example: 3 })
  status: number;

  @ApiProperty({ type: Number, example: 97 })
  creationUser: number;

  @ApiProperty({ type: String, example: '理由' })
  reason: string;

  @ApiProperty({ type: Number, example: 5 })
  basicMaxDifficulty: number;

  @ApiProperty({ type: Number, example: 10 })
  behaviorMaxWeight: number;

  @ApiProperty({ type: String, example: '' })
  publicDate: string;

  @ApiProperty({ type: String, example: '2023-07-12T09:34:54.983Z' })
  updatedTime: Date;

  @ApiProperty({ type: String, example: '' })
  lastUpdatedTime: string;

  @ApiProperty()
  user?: CreationUserDto;

  @ApiProperty({ type: [SettingPointBasicBehaviorProDto] })
  settingPointBehavior: SettingPointBasicBehaviorProDto[];

  @ApiProperty({ type: [SettingAchievementPersonalDto] })
  settingAchievementPersonalDiff: SettingAchievementPersonalDto[];

  @ApiProperty({ type: [SettingAchievementPersonalDto] })
  settingAchievementPersonalJudgeIndex: SettingAchievementPersonalDto[];

  @ApiProperty({ type: [SettingAchievementAdditionalDto] })
  settingAchievementAdditional: SettingAchievementAdditionalDto[];

  @ApiProperty({ type: [SettingLevelDto] })
  settingLevel: SettingLevelDto[];

  @ApiProperty({ type: Number, example: 1 })
  maxPoint?: number;

  @ApiProperty({ type: Number, example: 1 })
  minPoint?: number;

  @ApiProperty({ type: Number, example: 1 })
  maxPointDep?: number;

  @ApiProperty({ type: Number, example: 1 })
  minPointDep?: number;

  @ApiProperty({ type: String, example: 'GEOVN' })
  companyGroupCode: string;

  // old data 8~10 but change name
  @ApiProperty({ type: SettingAchievementPersonalDto })
  settingAchievementDepDiff: SettingAchievementPersonalDto[];

  @ApiProperty({ type: SettingAchievementPersonalDto })
  settingAchievementDepJudgeIndex: SettingAchievementPersonalDto[];

  @ApiProperty({ type: SettingAchievementAdditionalDto })
  settingAchievementAdditionalDep: SettingAchievementAdditionalDto[];

  settingFormula810: {
    id: number;
    versionId: number;
    point: string;
    result: string;
    note: null | string;
  }[];

  @ApiProperty({ type: Boolean, example: false })
  isHaveEditRecord: boolean;
}
export class VersionSetting810Dto extends VersionSetting810NSDto {
  @ApiProperty({ type: [SettingPointBasicBehaviorProDto] })
  settingPointBasic: SettingPointBasicBehaviorProDto[];

  @ApiProperty({ type: [SettingPointBasicBehaviorProDto] })
  settingPointPro: SettingPointBasicBehaviorProDto[];

  @ApiProperty({ type: [SettingProFormulaDto] })
  settingProFormula: SettingProFormulaDto[];
}
