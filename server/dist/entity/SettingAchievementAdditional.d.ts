import { Model } from 'sequelize-typescript';
import { VersionSetting } from './VersionSetting';
export declare class SettingAchievementAdditional extends Model {
    versionId: number;
    rating: string;
    point: number;
    note: string;
    versionSetting: VersionSetting;
    type: number;
}
