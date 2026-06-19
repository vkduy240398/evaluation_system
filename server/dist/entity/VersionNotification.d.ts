import { Model } from 'sequelize-typescript';
import { User } from './User';
import { CompanyGroup } from './CompanyGroup';
export declare class VersionNotification extends Model {
    id: number;
    version: number;
    subVersion: number;
    status: number;
    creationUser: number;
    reason: string;
    content: string;
    publicDate: string;
    lastUpdatedTime: string;
    companyGroupCode: string;
    createdTime: Date;
    updatedTime: Date;
    user: User;
    companyGroup: CompanyGroup;
}
