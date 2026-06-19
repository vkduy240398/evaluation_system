import { Model } from 'sequelize-typescript';
export declare class EvaluationAchievementDepartmentAdditional extends Model {
    evaluationId: number;
    itemNo: number;
    titleAdditional: string;
    achievementStatus: string;
    reasonComment: string;
    pointUser: string;
    pointEvaluator05: string;
    pointEvaluator1: string;
    pointEvaluator2: string;
    createdTime: Date;
    updatedTime: Date;
}
