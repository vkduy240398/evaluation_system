import { Transaction } from 'sequelize';
import { SettingAchievementPersonal } from 'src/entity/SettingAchievementPersonal';
import { TypeAchievement } from 'src/enum/TypeAchievement';
import { SettingPointI } from 'src/interfaces/repository/settingPoint.repository.interface';
export declare class SettingAchievementPersonalRepository implements SettingPointI {
    private settingAchievementPersonalEntity;
    getListSettingAchievementPersonalByVersionId(versionSettingId: number, typeEvaluation: TypeAchievement): Promise<SettingAchievementPersonal[]>;
    bulkCreate(records: any, transaction: Transaction): Promise<SettingAchievementPersonal[]>;
    bulkDelete(versionId: number, transaction: Transaction): Promise<number>;
}
