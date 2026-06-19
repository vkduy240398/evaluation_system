import { Model } from 'sequelize-typescript';
import { User } from './User';
import { ListBasicBehavior } from './ListBasicBehavior';
import { CompanyGroup } from './CompanyGroup';
export declare class VersionBasicBehavior extends Model {
    id: number;
    type: number;
    level: number;
    version: number;
    subVersion: number;
    status: number;
    creationUser: number;
    reason: string;
    publicDate: string;
    lastUpdatedTime: string;
    createdTime: Date;
    updatedTime: Date;
    companyGroupCode: string;
    listBasicBehaviors: ListBasicBehavior[];
    user: User;
    companyGroup: CompanyGroup;
}
