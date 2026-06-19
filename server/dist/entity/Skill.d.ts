import { Model } from 'sequelize-typescript';
import { VersionProSkill } from './VersionProSkill';
import { SkillRole } from './SkillRole';
import { SkillGroup } from './SkillGroup';
import { SkillUser } from './SkillUser';
import { CompanyGroup } from './CompanyGroup';
export declare class Skill extends Model {
    id: number;
    name: string;
    active: number;
    companyGroupCode: string;
    createdTime: Date;
    updatedTime: Date;
    companyGroup: CompanyGroup;
    skillRoles: SkillRole[];
    setSkillRoles: (arg: any[]) => Promise<any>;
    countSkillRoles: () => Promise<number>;
    versionProSkill: VersionProSkill[];
    skills: SkillGroup[];
    skillUsers: SkillUser[];
}
