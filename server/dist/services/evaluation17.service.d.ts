export declare class Evaluation17Service {
    private evaluation17Repo;
    getBasicBehaviorProOptionPublic(companyGroupCode: string, isNoSkill?: boolean): Promise<{
        basicSkillPointOptions: {
            label: any;
            value: any;
        }[];
        behaviorSkillPointOptions: {
            label: any;
            value: any;
        }[];
        proSkillPointOptions: {
            label: any;
            value: any;
        }[];
    }>;
    getMaxPointProBasicSkillPublic(companyGroupCode: string): Promise<{
        maxPointProSkill: number;
        maxPointBasicSkill: number;
    }>;
}
