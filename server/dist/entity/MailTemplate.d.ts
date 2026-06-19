import { Model } from 'sequelize-typescript';
import { CompanyGroup } from './CompanyGroup';
export declare class MailTemplate extends Model {
    id: number;
    type: number;
    name: string;
    subject: string;
    note: string;
    content: string;
    sort: number;
    setting: string;
    createdTime: Date;
    updatedTime: Date;
    companyGroupCode: string;
    companyGroupFK: CompanyGroup;
}
