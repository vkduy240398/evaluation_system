type PointSkillType = 1 | 2 | 3;
export declare class PointRepository {
    private settingPointEntity;
    private versionSettingEntity;
    getPointSkill(type: PointSkillType, companyGroupCode: string): Promise<{
        value: number;
        label: any;
    }[]>;
}
export {};
