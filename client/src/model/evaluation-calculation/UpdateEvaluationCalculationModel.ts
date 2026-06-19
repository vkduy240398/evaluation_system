import {
  CreationUserDto,
  SettingAchievementAdditionalDto,
  SettingAchievementPersonalDto,
  SettingFormula810Dto,
  SettingLevelDto,
  SettingPointBasicBehaviorProDto,
  SettingProFormulaDto,
} from './DetailEvaluationCalculationModel';

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface UpdateEvaluationCalculationDto {
  id: number;
  type: number;
  version: number;
  subVersion: number;
  status: number;
  reason: string;
  basicMaxDifficulty: null | number;
  behaviorMaxWeight: null | number;
  creationUser?: any;
  user?: CreationUserDto;
  publicDate: string;
  updatedTime?: string;
  settingPointBasicBehaviorPro?: SettingPointBasicBehaviorProDto[];
  settingProFormula?: SettingProFormulaDto[];
  settingAchievementPersonal?: SettingAchievementPersonalDto[];
  settingAchievementAdditional?: SettingAchievementAdditionalDto[];
  settingLevelDto?: SettingLevelDto[];
  settingFormula810?: SettingFormula810Dto[];
  settingLevel?: SettingLevelDto[];
}
