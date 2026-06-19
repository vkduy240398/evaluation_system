/* eslint-disable @typescript-eslint/no-empty-interface */
export interface DetailEvaluationCalculationDto {
  id: number;
  type: number;
  versionDisplay?: string;
  version: number;
  subVersion: number;
  status: number;
  reason: string;
  basicMaxDifficulty: null | number;
  behaviorMaxWeight: null | number;
  creationUser?: CreationUserDto;
  user?: any;
  publicDate: string;
  updatedTime: string;
  lastUpdatedTime: string;
  settingPointBasic?: SettingPointBasicBehaviorProDto[];
  settingPointBehavior?: SettingPointBasicBehaviorProDto[];
  settingPointPro?: SettingPointBasicBehaviorProDto[];
  settingProFormula?: SettingProFormulaDto[];
  settingAchievementPersonalDiff?: SettingAchievementPersonalDto[];
  settingAchievementPersonalJudgeIndex?: SettingAchievementPersonalDto[];
  settingAchievementAdditional?: SettingAchievementAdditionalDto[];
  settingLevelDto?: SettingLevelDto[];
  settingFormula810?: SettingFormula810Dto[];
  settingLevel?: SettingLevelDto[];
  maxPoint?: string;
  minPoint?: string;
}

interface SettingDto {
  id?: number;
  versionId?: number;
  point?: number;
  note?: string;
  description?: string;
}

export interface SettingPointBasicBehaviorProDto extends SettingDto {
  key?: string;
  type: number;
}

export interface SettingProFormulaDto extends SettingDto {
  key?: string;
  settingProFormulaSub?: SettingProFormulaSubDto[];
}

export interface SettingProFormulaSubDto {
  key?: string;
  id?: number;
  formulaId?: number;
  totalItem?: number;
  coefficient?: number;
}

export enum TypeAchievement {
  PERSONAL_17 = 1,
  PERSONAL_810 = 2,
  DEPARTMENT_810 = 3,
}

export interface SettingAchievementPersonalDto extends SettingPointBasicBehaviorProDto {
  typeEvaluation: TypeAchievement;
}

export interface SettingAchievementAdditionalDto extends SettingDto {
  key?: any;
  rating?: string;
  type: TypeAchievement;
}

export interface SettingLevelDto {
  key?: number;
  versionId: number;
  level: number;
  skillPercent?: number;
  behaviorPercent?: number;
  achievementPercent?: number;
}

export interface SettingFormula810Dto extends SettingDto {
  result: string;
}

export interface CreationUserDto {
  id: number;
  fullName: string;
}
