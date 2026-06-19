export declare class SettingDefaultPeriodServices {
    private settingReviewRepository;
    findOneSettingDefaultService(companyGroupCode: string | null): Promise<import("../entity/SettingDefaultPeriod").SettingDefaultPeriod>;
    updateOrCreateSetting(defaultPeriod: number, companyGroupCode: string): Promise<import("../entity/SettingDefaultPeriod").SettingDefaultPeriod>;
}
