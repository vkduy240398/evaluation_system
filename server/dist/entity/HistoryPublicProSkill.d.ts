import { Model } from 'sequelize-typescript';
import { Department } from './Department';
import { VersionProSkill } from './VersionProSkill';
import { Skill } from './Skill';
export declare class HistoryPublicProSkill extends Model {
    id: number;
    year: string;
    periodIndex: number;
    versionId: number;
    skillId: number;
    departmentId: number;
    companyGroupCode: string;
    createdTime: Date;
    updatedTime: Date;
    skill: Skill;
    department: Department;
    versionProSkill: VersionProSkill;
}
