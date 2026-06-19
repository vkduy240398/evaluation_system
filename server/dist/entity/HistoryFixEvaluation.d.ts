import { Model } from 'sequelize-typescript';
export declare class HistoryFixEvaluation extends Model {
    periodId: number;
    type: number;
    note: string;
    checkFixed: number;
    createdTime: Date;
    updatedTime: Date;
}
