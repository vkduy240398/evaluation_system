import { VersionGuideEvaluation } from 'src/entity/VersionGuideEvaluation';
export declare class GuideEvaluationRepository {
    private guideEvaluationRepository;
    getGuideEvaluation(level: any, flagSkill: number, companyGroupCode: string): Promise<VersionGuideEvaluation>;
    findListEvaluationCriteriaHistory(query: any, companyGroupCode?: string): Promise<{
        data: VersionGuideEvaluation[];
        counts: number;
    }>;
    inforCriteria(id: number): Promise<VersionGuideEvaluation>;
    inforCriteriaStep(id: number, companyGroupCode?: string): Promise<VersionGuideEvaluation>;
    findOne(versionId: number, companyGroupCode?: string): Promise<VersionGuideEvaluation>;
    maxSubVersion(object: {
        [x: string]: any;
    }): Promise<unknown>;
    updateAllVersionToPrivate(object: {
        [x: string]: any;
    }, companyGroupCode?: string): Promise<[affectedCount: number]>;
    maxVersion(where: any, fields: string): Promise<unknown>;
    updateVersion(versionId: any, object: any, companyGroupCode?: string): Promise<[affectedCount: number, affectedRows: VersionGuideEvaluation[]]>;
    createNewVersion(object: any): Promise<VersionGuideEvaluation>;
    cancelVersionProSkill(versionId: number, _userId: number, _lastUpdatedTime: any, companyGroupCode?: string): Promise<[affectedCount: number]>;
    findOneGuide(where: {
        [x: string]: any;
    }): Promise<VersionGuideEvaluation>;
    getGuideEvaluationPublic(companyGroupCode: string): Promise<VersionGuideEvaluation[]>;
    getCriteriaVersionIsEditing(type: any, companyGroupCode?: string): Promise<VersionGuideEvaluation[]>;
    findAllByCondition(object: {
        [x: string]: any;
    }): Promise<VersionGuideEvaluation[]>;
}
