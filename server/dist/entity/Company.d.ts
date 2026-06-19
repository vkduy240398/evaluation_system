import { Model } from 'sequelize-typescript';
export declare class Company extends Model {
    id: number;
    name: string;
    createdTime: Date;
    updatedTime: Date;
}
