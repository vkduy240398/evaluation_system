import { Transaction } from 'sequelize';
import { SettingProFormula } from 'src/entity/SettingProFormula';
import { SettingProFormulaSub } from 'src/entity/SettingProFormulaSub';
import { SettingPointI } from 'src/interfaces/repository/settingPoint.repository.interface';
export declare class SettingProFormulaRepository implements SettingPointI {
    private settingProFormulaEntity;
    private settingProFormulaSubEntity;
    getListSettingProFormulaByVersionId(versionSettingId: number): Promise<SettingProFormula[]>;
    bulkCreate(records: any, transaction: Transaction): Promise<SettingProFormula[]>;
    bulkDelete(versionId: number, transaction: Transaction): Promise<number>;
    bulkCreateSub(records: any, transaction: Transaction): Promise<SettingProFormulaSub[]>;
    bulkDeleteSub(iDs: any, transaction: Transaction): Promise<number>;
}
