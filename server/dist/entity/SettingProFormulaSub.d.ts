import { Model } from 'sequelize-typescript';
import { SettingProFormula } from './SettingProFormula';
export declare class SettingProFormulaSub extends Model<SettingProFormulaSub> {
    formulaId: number;
    totalItem: number;
    coefficient: number;
    settingProFormula: SettingProFormula;
}
