import { Model } from 'sequelize-typescript';
import { Department } from './Department';
import { User } from './User';
import { ListProSkill } from './ListProSkill';
import { Skill } from './Skill';
import { CompanyGroup } from './CompanyGroup';
import { HistoryPublicProSkill } from './HistoryPublicProSkill';
interface VersionProSkillI {
    id: number;
    version: number;
    subVersion: number;
    skillId: number;
    status: number;
    creationUser: number;
    reason: string;
    publicStatus: number;
    publicDate: string;
    createdTime: Date;
    updatedTime: Date;
    department: Department;
    skill: Skill;
    user: User;
    lastUpdatedTime: string;
    listProSkills: ListProSkill[];
    companyGroupCode: string;
}
export declare class VersionProSkill extends Model<VersionProSkillI> {
    id: number;
    version: number;
    subVersion: number;
    skillId: number;
    status: number;
    creationUser: number;
    reason: string;
    publicStatus: number;
    publicDate: string;
    lastUpdatedTime: string;
    companyGroupCode: string;
    createdTime: Date;
    updatedTime: Date;
    skill: Skill;
    user: User;
    companyGroup: CompanyGroup;
    listProSkills: ListProSkill[];
    historyPublicProSkills: HistoryPublicProSkill[];
}
export {};
