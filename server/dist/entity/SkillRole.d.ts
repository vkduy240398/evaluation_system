import { Model } from 'sequelize-typescript';
import { User } from './User';
import { Skill } from './Skill';
export declare class SkillRole extends Model {
    id: number;
    skillId: number;
    userId: number;
    role: number;
    createdTime: Date;
    updatedTime: Date;
    user: User;
    skill: Skill;
}
