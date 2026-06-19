import { Model } from 'sequelize-typescript';
import { VersionSetting } from './VersionSetting';
export declare class SettingAchievementPersonal extends Model {
    versionId: number;
    type: number;
    typeEvaluation: number;
    point: number;
    note: string;
    description: string;
    versionSetting: VersionSetting;
}
