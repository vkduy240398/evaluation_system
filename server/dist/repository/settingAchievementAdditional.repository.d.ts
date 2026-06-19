import { Transaction } from 'sequelize';
import { SettingAchievementAdditional } from 'src/entity/SettingAchievementAdditional';
import { TypeAchievement } from 'src/enum/TypeAchievement';
import { SettingPointI } from 'src/interfaces/repository/settingPoint.repository.interface';
export declare class SettingAchievementAdditionalRepository implements SettingPointI {
    private settingAchievementAdditionalEntity;
    getListSettingAchievementAdditionalByVersionId(versionSettingId: number, typeAdditional: TypeAchievement): Promise<SettingAchievementAdditional[]>;
    bulkCreate(records: any, transaction: Transaction): Promise<SettingAchievementAdditional[]>;
    bulkDelete(versionId: number, transaction: Transaction): Promise<number>;
}
