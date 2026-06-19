import { Transaction } from 'sequelize';
import { SettingPointBasicBehaviorPro } from 'src/entity/SettingPointBasicBehaviorPro';
import { SettingPointI } from 'src/interfaces/repository/settingPoint.repository.interface';
export declare class SettingPointBasicBehaviorProRepository implements SettingPointI {
    private settingPointBasicBehaviorProEntity;
    getListSettingPointBasicBehaviorProByVersionId(versionSettingId: number): Promise<SettingPointBasicBehaviorPro[]>;
    bulkCreate(records: any, transaction: Transaction): Promise<SettingPointBasicBehaviorPro[]>;
    bulkDelete(versionId: number, type: number, transaction: Transaction): Promise<number>;
}
