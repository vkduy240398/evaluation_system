import { Model } from 'sequelize-typescript';
import { User } from './User';
import { Feedback } from './Feedback';
interface FeedbackCommnetI {
    id: number;
    content: string;
    feedbackId: number;
    userId: number;
    createdTime: Date;
    updatedTime: Date;
    active: number;
}
export declare class FeedbackCommnet extends Model<FeedbackCommnetI> {
    id: number;
    content: string;
    feedbackId: string;
    userId: number;
    active: number;
    createdTime: Date;
    updatedTime: Date;
    user: User;
    feedback: Feedback;
}
export {};
