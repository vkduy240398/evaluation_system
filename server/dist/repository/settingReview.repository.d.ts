import { Department } from 'src/entity/Department';
import { User } from 'src/entity/User';
export declare class SettingReviewRepository {
    private settingReviewEnity;
    private departmentEnity;
    private userEntity;
    private periodEntity;
    searchListUserToSettingEvaluationHistoryReference(query: any): Promise<{
        data: User[];
        counts: number;
    }>;
    getAllUser(companyGroupCode: string): Promise<User[]>;
    generatePeriods(year: any, period: any, quantity: any): any[];
    addEditUser(data: any, companyGroupCode: string): Promise<boolean>;
    getListDepartment(companyGroupCode: string): Promise<Department[]>;
    deleteSettingHistoryReference(arrayIds: number[]): Promise<number>;
    getListSettingReviewHistory(condition: {
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
