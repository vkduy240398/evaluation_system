import { SettingPointBasicBehaviorProDto } from '../generic/SettingPointBasicBehaviorProDto';
import { SettingProFormulaDto } from '../generic/SettingProFormulaDto';
import { SettingAchievementPersonalDto } from '../generic/SettingAchievementPersonalDto';
import { SettingAchievementAdditionalDto } from '../generic/SettingAchievementAdditionalDto';
import { SettingLevelDto } from './SettingLevelDto';
import { SettingFormula810Dto } from '../generic/SettingFormula810Dto';
import { CreationUserDto } from './CreationUserDto';
export declare class VersionSettingDto {
    id: number;
    type: number;
    version: number;
    subVersion: number;
    versionDisplay: string;
    status: number;
    creationUser: number;
    reason: string;
    basicMaxDifficulty: number;
    behaviorMaxWeight: number;
    publicDate: string;
    updatedTime: Date;
    lastUpdatedTime: string;
    user?: CreationUserDto;
    companyGroupCode?: string;
    settingPointBasic: SettingPointBasicBehaviorProDto[];
    settingPointBehavior: SettingPointBasicBehaviorProDto[];
    settingPointPro: SettingPointBasicBehaviorProDto[];
    settingProFormula: SettingProFormulaDto[];
    settingAchievementPersonalDiff: SettingAchievementPersonalDto[];
    settingAchievementPersonalJudgeIndex: SettingAchievementPersonalDto[];
    settingAchievementAdditional: SettingAchievementAdditionalDto[];
    settingLevel: SettingLevelDto[];
    existEditingVersion: boolean;
    maxPoint?: number;
    minPoint?: number;
    settingPointBasicBehaviorPros?: SettingPointBasicBehaviorProDto[];
    settingFormula810: SettingFormula810Dto[];
}
export declare class VersionSetting810NSDto {
    id: number;
    type: number;
    version: number;
    subVersion: number;
    versionDisplay: string;
    status: number;
    creationUser: number;
    reason: string;
    basicMaxDifficulty: number;
    behaviorMaxWeight: number;
    publicDate: string;
    updatedTime: Date;
    lastUpdatedTime: string;
    user?: CreationUserDto;
    settingPointBehavior: SettingPointBasicBehaviorProDto[];
    settingAchievementPersonalDiff: SettingAchievementPersonalDto[];
    settingAchievementPersonalJudgeIndex: SettingAchievementPersonalDto[];
    settingAchievementAdditional: SettingAchievementAdditionalDto[];
    settingLevel: SettingLevelDto[];
    maxPoint?: number;
    minPoint?: number;
    maxPointDep?: number;
    minPointDep?: number;
    companyGroupCode: string;
    settingAchievementDepDiff: SettingAchievementPersonalDto[];
    settingAchievementDepJudgeIndex: SettingAchievementPersonalDto[];
    settingAchievementAdditionalDep: SettingAchievementAdditionalDto[];
    settingFormula810: {
        id: number;
        versionId: number;
        point: string;
        result: string;
        note: null | string;
    }[];
    isHaveEditRecord: boolean;
}
export declare class VersionSetting810Dto extends VersionSetting810NSDto {
    settingPointBasic: SettingPointBasicBehaviorProDto[];
    settingPointPro: SettingPointBasicBehaviorProDto[];
    settingProFormula: SettingProFormulaDto[];
}
