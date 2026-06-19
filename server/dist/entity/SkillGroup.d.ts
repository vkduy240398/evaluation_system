import { Model } from 'sequelize-typescript';
import { Department } from './Department';
import { Skill } from './Skill';
export declare class SkillGroup extends Model {
    id: number;
    skillId: number;
    departmentId: number;
    skill: Skill;
    department: Department;
}
