import { Model } from 'sequelize-typescript';
import { User } from './User';
import { CompanyGroup } from './CompanyGroup';
export declare class VersionGuideEvaluation extends Model {
    id: number;
    type: number;
    version: number;
    subVersion: number;
    status: number;
    creationUser: number;
    reason: string;
    contentEvaluationCriteria: string;
    contentNotes: string;
    publicDate: string;
    lastUpdatedTime: string;
    companyGroupCode: string;
    createdTime: Date;
    updatedTime: Date;
    user: User;
    companyGroup: CompanyGroup;
}
