import { Model } from 'sequelize-typescript';
export declare class SettingLevel extends Model {
    versionId: number;
    level: number;
    skillPercent: number;
    behaviorPercent: number;
    achievementPercent: number;
}
