import { Model } from 'sequelize-typescript';
import { Skill } from './Skill';
import { User } from './User';
import { EvaluationPeriod } from './EvaluationPeriod';
export declare class SkillUser extends Model {
    id: number;
    periodId: number;
    userId: number;
    skillId: number;
    evaluationId: number;
    type: number;
    period: EvaluationPeriod;
    skill: Skill;
    user: User;
    createdTime: Date;
    updatedTime: Date;
}
