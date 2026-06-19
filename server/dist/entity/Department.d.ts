import { Model } from 'sequelize-typescript';
import { CompanyGroup } from './CompanyGroup';
export declare class Department extends Model {
    id: number;
    code: string;
    name: string;
    class: number;
    type: number;
    active: number;
    companyGroupCode: string;
    createdTime: Date;
    updatedTime: Date;
    companyGroup: CompanyGroup;
    divisionSubclass: any[];
    departmentSubClasses: any;
}
