import { Model } from 'sequelize-typescript';
import { User } from './User';
import { CompanyGroup } from './CompanyGroup';
import { FeedbackCommnet } from './FeedbackComment';
import { Roles } from '../enum/Roles';
import { FeedbackType } from '../enum/FeedbackType';
import { FeedbackPhase } from '../enum/FeedbackPhase';
import { FeedbackImpactScope } from '../enum/FeedbackImpactScope';
import { FeedbackStatus } from '../enum/FeedbackStatus';
interface FeedbackI {
    id: number;
    role: Roles[];
    type: FeedbackType;
    phase: FeedbackPhase;
    feature: string[];
    summary: string;
    detail: string;
    impactScope: FeedbackImpactScope;
    status: FeedbackStatus;
    attachFiles: string;
    userId: number;
    group: number;
    createdTime: Date;
    updatedTime: Date;
    companyGroupCode: string;
}
export declare class Feedback extends Model<FeedbackI> {
    id: number;
    role: Roles[];
    type: FeedbackType;
    phase: FeedbackPhase;
    feature: string[];
    summary: string;
    detail: string;
    impactScope: FeedbackImpactScope;
    attachFiles: string;
    status: FeedbackStatus;
    group: number;
    userId: number;
    createdTime: Date;
    updatedTime: Date;
    companyGroupCode: string;
    userFK: User;
    companyGroupFK: CompanyGroup;
    comments: FeedbackCommnet[];
}
export {};
