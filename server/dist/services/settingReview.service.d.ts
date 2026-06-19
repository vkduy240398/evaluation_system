export declare class SettingReviewService {
    private settingReviewRepository;
    searchListUserToSettingEvaluationHistoryReference(query: any): Promise<{
        data: import("../entity/User").User[];
        counts: number;
    }>;
    getAllUser(companyGroupCode: string): Promise<import("../entity/User").User[]>;
    addEditUser(data: any, companyGroupCode: string): Promise<boolean>;
    getListDepartmentRepository(companyGroupCode: string): Promise<import("../entity/Department").Department[]>;
    getListSettingReviewHistoryReference(condition: {
        depDivAudience: number | string;
        depDivViewer: number | string;
        matchDepartment: number | string;
        targetAudience?: string;
        viewer?: string;
        page: number;
    }, companyGroupCode: string, timeZone: string): Promise<{
        data: any[];
        counts: any;
        pageSize: number;
    }>;
    deleteHistoryReference(arrayIds: number[], condition: {
        depDivAudience: number | string;
        depDivViewer: number | string;
        matchDepartment: number | string;
        targetAudience?: string;
        viewer?: string;
        page: number;
    }, companyGroupCode: string, timeZone: string): Promise<{
        data: any[];
        counts: any;
        pageSize: number;
    }>;
}
