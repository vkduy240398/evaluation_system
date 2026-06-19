export declare class GuideEvaluationService {
    private guideEvaluationRepo;
    private evaluationRepo;
    getGuideEvaluation(level: any, flagSkill: number, companyGroupCode: string): Promise<import("../entity/VersionGuideEvaluation").VersionGuideEvaluation>;
    findListEvaluationCriteriaHistory(query: any, companyGroupCode?: string): Promise<{
        data: import("../entity/VersionGuideEvaluation").VersionGuideEvaluation[];
        counts: number;
    }>;
    getInformationCriteria(id: number, companyGroupCode?: string): Promise<{
        isShowEdit: boolean;
        data: {
            id: number;
            level: string;
            versionId: number;
            createdTime: string;
            creationUser: number;
            publicDate: string;
            reason: string;
            status: number;
            subVersion: number;
            type: number;
            updatedTime: string;
            statusName: string;
            updatedBy: string;
            version: number;
            timer: Date;
            contentEvaluationCriteria: string;
            contentNotes: string;
            lastUpdatedTime: string;
        };
        subVersion: unknown;
    }>;
    publicVersion(params: any, companyGroupCode: string, timeZone: string): Promise<[affectedCount: number, affectedRows: import("../entity/VersionGuideEvaluation").VersionGuideEvaluation[]]>;
    saveDraftData(body: any, userId: number, companyGroupCode: string, timeZone: string): Promise<{
        id: any;
        timer: any;
        subVersion: any;
        version: any;
        status: any;
        lastUpdatedTime: any;
        code: number;
        edited?: undefined;
        updatedTime?: undefined;
    } | {
        id: any;
        timer: any;
        subVersion: any;
        version: any;
        status: any;
        lastUpdatedTime: any;
        edited: boolean;
        code: number;
        updatedTime?: undefined;
    } | {
        id: number;
        updatedTime: Date;
        subVersion: number;
        version: number;
        lastUpdatedTime: string;
        code: number;
        timer?: undefined;
        status?: undefined;
        edited?: undefined;
    }>;
    cancelVersionPro(versionId: number, userId: number, body: any, companyGroupCode?: string): Promise<[affectedCount: number]>;
    savePrivateVersion(params: any): Promise<{
        id: number;
        status: number;
        type: any;
        contentEvaluationCriteria?: undefined;
        contentNotes?: undefined;
        creationUser?: undefined;
        reason?: undefined;
    } | {
        id: any;
        status: number;
        type: any;
        contentEvaluationCriteria: any;
        contentNotes: any;
        creationUser: any;
        reason: any;
    }>;
    savePublicVersion(params: any, companyGroupCode: string, timeZone: string): Promise<{
        code: number;
        id: any;
        status: number;
        type: any;
        contentEvaluationCriteria?: undefined;
        contentNotes?: undefined;
        creationUser?: undefined;
        reason?: undefined;
    } | {
        id: number;
        status: number;
        type: any;
        code?: undefined;
        contentEvaluationCriteria?: undefined;
        contentNotes?: undefined;
        creationUser?: undefined;
        reason?: undefined;
    } | {
        id: any;
        status: number;
        type: any;
        contentEvaluationCriteria: any;
        contentNotes: any;
        creationUser: any;
        reason: any;
        code?: undefined;
    }>;
    updateGuideEvaluation(type: number, versionId: number, companyGroupCode: string, timeZone: string): Promise<void>;
}
