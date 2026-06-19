import { Model } from 'sequelize-typescript';
export declare class EvaluationAchievementPersonalSub extends Model {
    id: number;
    achievementPersonalId: number;
    coefficient: number;
    degree: string;
    evaluationDecision: string;
    createdTime: Date;
    updatedTime: Date;
}
