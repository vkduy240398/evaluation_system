import { SettingDefaultPeriod } from 'src/entity/SettingDefaultPeriod';
export declare class SettingDefaultPeriodRepository {
    private settingDefaultPeriodEnity;
    findOneSettingDefault(companyGroupCode: string | null): Promise<SettingDefaultPeriod>;
    updateSettingDefaultPeriod(defaultPeriod: number, companyGroupCode: string): Promise<SettingDefaultPeriod>;
}
