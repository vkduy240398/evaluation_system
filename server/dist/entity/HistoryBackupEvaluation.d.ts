import { Model } from 'sequelize-typescript';
export declare class HistoryBackupEvaluation extends Model {
    id: number;
    evaluationId: number;
    evaluationRecord: string;
    evaluationPro: string;
    evaluationBasicBehavior: string;
    evaluator: string;
    historyApproveEvaluation: string;
    skillUser: string;
    evaluationAchievementPersonal: string;
    createdTime: Date;
    updatedTime: Date;
}
