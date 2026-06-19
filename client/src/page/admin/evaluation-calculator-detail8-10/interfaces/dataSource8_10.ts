import { SettingAchievementPersonalType } from '../../../../constant/SettingAchievementPersonalType';
import { TypeAchievement, VersionSettingType } from '../../../../constant/VersionSettingType';

interface BasicBehaviorProPoint {
  key?: string;
  id?: number;
  versionId?: number;
  type: number;
  point?: number;
  note?: string;
}

interface AchievementData {
  key?: string;
  id?: number;
  versionId?: number;
  type: SettingAchievementPersonalType;
  point?: string;
  note?: string;
  typeEvaluation: TypeAchievement;
  description?: string;
}

interface ProFormula {
  key: string;
  id?: number;
  versionId?: number;
  point?: number;
  note?: null | string;

  settingProFormulaSub: {
    key: string;
    id?: number;
    formulaId?: number;
    totalItem?: number;
    coefficient?: number;
  }[];
}

export interface dataSubSetting810NS {
  id: number;
  updatedTime: string;

  settingAchievementDepDiff: AchievementData[];
  settingAchievementDepJudgeIndex: AchievementData[];
  settingAchievementAdditionalDep: {
    key: string;
    id?: number;
    versionId: number;
    rating?: string;
    point?: string;
    note?: null | string;
    type: TypeAchievement;
  }[];
  settingFormula810: {
    key?: string;
    id?: null | number;
    versionId?: null | number;
    point?: string;
    result?: null | string;
    note?: null | string;
  }[];

  //data personal
  settingPointBehavior: BasicBehaviorProPoint[];
  settingAchievementPersonalDiff: AchievementData[];
  settingAchievementPersonalJudgeIndex: AchievementData[];
  settingAchievementAdditional: {
    key: string;
    id?: number;
    versionId?: number;
    rating?: string;
    point?: number;
    note?: null | string;
    type: TypeAchievement;
  }[];
  settingLevel: {
    key: string;
    versionId?: number;
    level: number;
    skillPercent?: number;
    behaviorPercent?: number;
    achievementPercent?: number;
  }[];
  basicMaxDifficulty?: number | null;
  behaviorMaxWeight?: number | null;
  maxPoint: string;
  minPoint: string;
  maxPointDep: string;
  minPointDep: string;
}

export interface dataSubSetting810 extends dataSubSetting810NS {
  settingPointBasic?: BasicBehaviorProPoint[];
  settingPointPro?: BasicBehaviorProPoint[];
  settingProFormula?: ProFormula[];
}

export interface dataSource810 extends dataSubSetting810 {

  // data department
  id: number;
  type: number;
  version: number;
  subVersion: number;
  status:
    | VersionSettingType.LEVEL_1_7
    | VersionSettingType.LEVEL_8_10
    | VersionSettingType.LEVEL_1_7_NO_SKILL
    | VersionSettingType.LEVEL_8_10_NO_SKILL;
  creationUser: number;
  reason: string;
  publicDate: null | string;
  lastUpdatedTime: null | string;
  createdTime: string;
  updatedTime: string;
  creation_user: number;
  user: {
    id: number;
    employeeNumber: string;
    fullName: string;
    email: string;
  };
  isHaveEditRecord: boolean;
}

export interface dataTab810GoalDepartment {
  settingAchievementDepDiff: AchievementData[];
  settingAchievementDepJudgeIndex: AchievementData[];
}

export interface dataTab810GoalDepartmentAdditional {
  settingAchievementAdditionalDep: {
    key: string;
    id?: number;
    versionId?: number;
    rating?: string;
    point?: string;
    note?: null | string;
    type: TypeAchievement;
  }[];
}

export interface dataTab810Formula {
  settingFormula810: {
    key?: string;
    id?: null | number;
    versionId?: null | number;
    point?: string;
    result?: null | string;
    note?: null | string;
  }[];
}

export interface dataTab17BasicSkill {
  basicMaxDifficulty?: number | null;
  settingPointBasic?: BasicBehaviorProPoint[];
}

export interface dataTab17ProSkill {
  settingPointPro?: BasicBehaviorProPoint[];
  settingProFormula?: ProFormula[];
}

export interface dataTab17Behavior {
  settingPointBehavior: BasicBehaviorProPoint[];
}

export interface dataTab17GoalPersonal {
  settingAchievementPersonalDiff: AchievementData[];
  settingAchievementPersonalJudgeIndex: AchievementData[];
}

export interface dataTab17GoalPersonalAdditional {
  settingAchievementAdditional: {
    key: string;
    id?: number;
    versionId?: number;
    rating?: string;
    point?: number;
    note?: null | string;
    type: TypeAchievement;
  }[];
}

export interface dataTab17Level {
  settingLevel: {
    key: string;
    versionId?: number;
    level: number;
    skillPercent?: number;
    behaviorPercent?: number;
    achievementPercent?: number;
  }[];
}
