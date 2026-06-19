import { Model } from 'sequelize-typescript';
import { User } from './User';
export declare class Role extends Model {
    id: number;
    name: string;
    createdTime: Date;
    updatedTime: Date;
    users: User[];
}
