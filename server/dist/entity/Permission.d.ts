import { Model } from 'sequelize-typescript';
import { Role } from './Role';
export declare class Permission extends Model {
    userId: number;
    roleId: number;
    createdTime: Date;
    updatedTime: Date;
    role: Role;
    user: Role;
}
