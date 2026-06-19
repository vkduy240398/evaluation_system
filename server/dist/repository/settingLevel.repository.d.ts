import { Transaction } from 'sequelize';
import { SettingLevel } from 'src/entity/SettingLevel';
import { SettingPointI } from 'src/interfaces/repository/settingPoint.repository.interface';
export declare class SettingLevelRepository implements SettingPointI {
    private settingLevelEntity;
    private versionSettingEntity;
    getListSettingLevelByVersionId(versionSettingId: number): Promise<SettingLevel[]>;
    bulkCreate(records: any, transaction: Transaction): Promise<SettingLevel[]>;
    bulkDelete(versionId: number, transaction: Transaction): Promise<number>;
    getLevelSettingPublic(companyGroupCode: string): Promise<any[]>;
}
