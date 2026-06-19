import { Model } from 'sequelize-typescript';
import { Evaluation } from './Evaluation';
export declare class SummaryDepartment extends Model {
    id: number;
    evaluationId: number;
    achievementPersonalTotalPointUser: number;
    achievementPersonalTotalPointEvaluator05: number;
    achievementPersonalTotalPointEvaluator1: number;
    achievementPersonalTotalPointEvaluator2: number;
    achievementAdditionalTotalPointUser: number;
    achievementAdditionalTotalPointEvaluator05: number;
    achievementAdditionalTotalPointEvaluator1: number;
    achievementAdditionalTotalPointEvaluator2: number;
    summaryPointUser: number;
    summaryPointEvaluator05: number;
    summaryPointEvaluator1: number;
    summaryPointEvaluator2: number;
    summaryCharPointUser: string;
    summaryCharPointEvaluator05: string;
    summaryCharPointEvaluator1: string;
    summaryCharPointEvaluator2: string;
    createdTime: Date;
    updatedTime: Date;
    evaluation: Evaluation;
}
