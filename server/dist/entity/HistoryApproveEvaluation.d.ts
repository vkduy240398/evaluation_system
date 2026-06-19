import { Model } from 'sequelize-typescript';
import { Evaluation } from './Evaluation';
import { User } from './User';
interface HistoryApproveEvaluationI {
    evaluationId: number;
    comment: string;
    approverId: number;
    receiverId: number;
    receiverOrder: number;
    type: number;
    status: string;
    createdTime: Date;
    updatedTime: Date;
}
export declare class HistoryApproveEvaluation extends Model<HistoryApproveEvaluationI> {
    id: number;
    evaluationId: number;
    comment: string;
    approverId: number;
    receiverId: number;
    receiverOrder: number;
    type: number;
    status: string;
    createdTime: Date;
    updatedTime: Date;
    evaluation: Evaluation;
    approverUser: User;
    receiverUser: User;
}
export {};
