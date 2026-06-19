import { Model } from 'sequelize-typescript';
export declare class EvaluationPro extends Model {
    evaluationId: number;
    jobType: string;
    itemId: string;
    itemNo: number;
    itemTitle: string;
    content: string;
    note: string;
    difficulty: number;
    pointUser: number;
    totalPointUser: number;
    pointEvaluator05: number;
    totalPointEvaluator05: number;
    pointEvaluator1: number;
    totalPointEvaluator1: number;
    pointEvaluator2: number;
    totalPointEvaluator2: number;
    isDisable: boolean;
    createdTime: Date;
    updatedTime: Date;
}
