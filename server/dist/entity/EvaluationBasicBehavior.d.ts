import { Model } from 'sequelize-typescript';
export declare class EvaluationBasicBehavior extends Model {
    evaluationId: number;
    itemNo: number;
    type: number;
    itemTitle: string;
    content: string;
    difficulty: number;
    pointUser: number;
    pointEvaluator05: number;
    pointEvaluator1: number;
    pointEvaluator2: number;
    createdTime: Date;
    updatedTime: Date;
}
