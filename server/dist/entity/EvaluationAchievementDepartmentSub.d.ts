import { Model } from 'sequelize-typescript';
export declare class EvaluationAchievementDepartmentSub extends Model {
    id: number;
    achievementPersonalId: number;
    coefficient: number;
    evaluationDecision: string;
    createdTime: Date;
    updatedTime: Date;
}
