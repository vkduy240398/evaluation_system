import { Model } from 'sequelize-typescript';
import { User } from './User';
import { EvaluationPeriod } from './EvaluationPeriod';
interface SettingReviewI {
    id: number;
    viewerId: number;
    userId: number;
    evaluationPeriodId: number;
    type: number;
    createdTime: Date;
    updatedTime: Date;
    companyGroupCode: string;
    order: number;
    creationType: number;
}
export declare class SettingReview extends Model<SettingReviewI> {
    id: number;
    viewerId: number;
    userId: number;
    evaluationPeriodId: number;
    type: number;
    order: number;
    creationType: number;
    createdTime: Date;
    updatedTime: Date;
    companyGroupCode: string;
    viewerIdFk: User;
    userIdFk: User;
    evaluationPeriodIdFk: EvaluationPeriod;
}
export {};
