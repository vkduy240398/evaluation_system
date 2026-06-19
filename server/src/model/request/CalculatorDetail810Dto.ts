import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { TypeAchievement } from 'src/enum/TypeAchievement';
import { VersionSettingType } from '../../enum/VersionSettingType';

interface achievementData {
  id: number;
  versionId: number;
  type: number;
  personal: number;
  point: string;
  note: string;
  version_id: number;
  key: string;
}

class achievementAdditionalData {
  id: number;
  versionId: number;
  personal: number;
  point: string;
  rating: string;
  note: string;
  version_id: number;
  key: string;
}

class settingFormula810Data {
  id: number;
  versionId: number;
  point: string;
  result: string;
  note: null | string;
  key: string;
}

class data810 {
  // dep data
  settingAchievementDepDiff: achievementData[];
  settingAchievementDepJudgeIndex: achievementData[];
  settingAchievementAdditionalDep: achievementAdditionalData[];
  settingFormula810: settingFormula810Data[];

  // personal data
  //   settingPointBasic:
}

class settingPointBasicProBehavior {
  key: string;
  id?: number;
  versionId: number;
  type: number;
  point: number;
  note?: null | string;
}

class settingPointProFormula {
  key: string;
  id?: number;
  versionId: number;
  point?: number;
  note?: null | string;
  settingProFormulaSub: {
    key: string;
    id: number;
    formulaId: number;
    totalItem: number;
    coefficient: number;
  }[];
}
class settingAchievementPersonal {
  key: string;
  id?: number;
  versionId: number;
  point?: number;
  note?: null | string;
  type: 1 | 2;
  typeEvaluation: TypeAchievement;
  description?: string;
}

class settingAchievementAdditional {
  key: string;
  id?: number;
  versionId: number;
  rating?: string;
  note?: null | string;
  point?: number;
  type: TypeAchievement;
}

class settingLevel {
  key: string;
  level: number;
  versionId: number;
  skillPercent?: null | number;
  achievementPercent?: null | number;
  behaviorPercent?: null | number;
}

export class CalculatorDetail810Dto extends data810 {
  @ApiProperty()
  @IsString()
  version: string;

  type: VersionSettingType;

  reason: string;

  status: number;

  creationUser: string;

  updatedTime: string;

  publicDate: string;

  isNew: number;

  isUpdate: number;

  id: number;

  lastUpdatedTime: string;

  isHaveEditRecord: boolean;

  basicMaxDifficulty: null | number;

  behaviorMaxWeight: null | number;

  data: {
    id: number;
    maxPoint?: string;
    minPoint?: string;
    maxPointDep?: string;
    minPointDep?: string;

    settingAchievementDepDiff: achievementData[];
    settingAchievementDepJudgeIndex: achievementData[];
    settingAchievementAdditionalDep: achievementAdditionalData[];
    settingFormula810: settingFormula810Data[];

    // personal
    basicMaxDifficulty?: number;
    behaviorMaxWeight?: number;
    settingPointBasic: settingPointBasicProBehavior[];
    settingPointPro: settingPointBasicProBehavior[];
    settingProFormula: settingPointProFormula[];
    settingPointBehavior: settingPointBasicProBehavior[];
    settingAchievementPersonalDiff: settingAchievementPersonal[];
    settingAchievementPersonalJudgeIndex: settingAchievementPersonal[];
    settingAchievementAdditional: settingAchievementAdditional[];
    settingLevel: settingLevel[];
  };
}

export class CalculatorDetail810NSDto extends data810 {
  @ApiProperty()
  @IsString()
  version: string;

  type: VersionSettingType;

  reason: string;

  status: number;

  creationUser: string;

  updatedTime: string;

  publicDate: string;

  isNew: number;

  isUpdate: number;

  id: number;

  lastUpdatedTime: string;

  isHaveEditRecord: boolean;

  basicMaxDifficulty: null | number;

  behaviorMaxWeight: null | number;

  data: {
    id: number;
    maxPoint?: string;
    minPoint?: string;
    maxPointDep?: string;
    minPointDep?: string;

    settingAchievementDepDiff: achievementData[];
    settingAchievementDepJudgeIndex: achievementData[];
    settingAchievementAdditionalDep: achievementAdditionalData[];
    settingFormula810: settingFormula810Data[];

    // personal
    basicMaxDifficulty?: number;
    behaviorMaxWeight?: number;
    settingPointBehavior: settingPointBasicProBehavior[];
    settingAchievementPersonalDiff: settingAchievementPersonal[];
    settingAchievementPersonalJudgeIndex: settingAchievementPersonal[];
    settingAchievementAdditional: settingAchievementAdditional[];
    settingLevel: settingLevel[];
  };
}
