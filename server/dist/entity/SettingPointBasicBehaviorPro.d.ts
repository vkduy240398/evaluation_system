import { Model } from 'sequelize-typescript';
import { VersionSetting } from './VersionSetting';
export declare class SettingPointBasicBehaviorPro extends Model {
    versionId: number;
    type: number;
    point: number;
    note: string;
    versionSetting: VersionSetting;
}
