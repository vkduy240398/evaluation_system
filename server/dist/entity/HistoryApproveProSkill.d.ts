import { Model } from 'sequelize-typescript';
import { User } from './User';
import { VersionProSkill } from './VersionProSkill';
export declare class HistoryApproveProSkill extends Model {
    id: number;
    versionId: number;
    comment: string;
    status: number;
    creationUser: number;
    createdTime: Date;
    updatedTime: Date;
    user: User;
    versionProSkill: VersionProSkill;
}
