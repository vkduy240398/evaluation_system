import { Model } from 'sequelize-typescript';
import { Evaluation } from './Evaluation';
import { User } from './User';
export declare class Evaluator extends Model {
    evaluationId: number;
    evaluatorId: number;
    evaluationOrder: number;
    commentPublic: string;
    commentPrivate: string;
    createdTime: Date;
    updatedTime: Date;
    user: User;
    evaluation: Evaluation;
}
