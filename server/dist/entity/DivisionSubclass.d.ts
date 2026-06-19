import { Model } from 'sequelize-typescript';
import { Department } from './Department';
export declare class DivisionSubclass extends Model {
    id: number;
    divisionId: number;
    departmentId: number;
    division: Department;
    department: Department;
}
