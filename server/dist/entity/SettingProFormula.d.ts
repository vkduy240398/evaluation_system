import { Model } from 'sequelize-typescript';
import { SettingProFormulaSub } from './SettingProFormulaSub';
import { VersionSetting } from './VersionSetting';
export declare class SettingProFormula extends Model<SettingProFormula> {
    id: number;
    versionId: number;
    point: number;
    note: string;
    settingProFormulaSub: SettingProFormulaSub[];
    versionSetting: VersionSetting;
}
