import { SettingPointBasicBehaviorPro } from 'src/entity/SettingPointBasicBehaviorPro';
export declare class Evaluation17Repository {
    private versionSettingEntity;
    private settingProFormulaEntity;
    private settingPointEntity;
    getBasicBehaviorProPointPublic(companyGroupCode: string, isNoSkill?: boolean): Promise<SettingPointBasicBehaviorPro[]>;
    getMaxPointProBasicSkillPublic(companyGroupCode: string): Promise<{
        maxPointProSkill: number;
        maxPointBasicSkill: number;
    }>;
}
