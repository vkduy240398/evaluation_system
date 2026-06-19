import { Model } from 'sequelize-typescript';
interface ICompanyGroup {
    id: number;
    name: string;
    createdTime: Date;
    updatedTime: Date;
}
export declare class CompanyGroup extends Model<ICompanyGroup> {
    code: string;
    name: string;
    icon: string;
    timezone: string;
    emailHR: string;
    createdTime: Date;
    updatedTime: Date;
}
export {};
