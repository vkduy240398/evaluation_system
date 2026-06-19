import { Model } from 'sequelize-typescript';
import { Department } from './Department';
import { CompanyGroup } from './CompanyGroup';
export declare class HistoryUpdateDepartment extends Model {
    id: number;
    year: string;
    periodIndex: number;
    type: number;
    departmentName: string;
    departmentId: number;
    createdTime: Date;
    updatedTime: Date;
    companyGroupCode: string;
    companyGroup: CompanyGroup;
    department: Department;
}
