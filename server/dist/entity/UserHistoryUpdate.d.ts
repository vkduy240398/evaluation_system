import { Model } from 'sequelize-typescript';
import { User } from './User';
export declare class UserHistoryUpdate extends Model {
    id: number;
    userId: number;
    beforeUpdateContent: string;
    afterUpdateContent: string;
    option: string;
    companyGroupCode: string;
    creationUserId: number;
    createdTime: Date;
    updatedTime: Date;
    user: User;
    creationUser: User;
}
