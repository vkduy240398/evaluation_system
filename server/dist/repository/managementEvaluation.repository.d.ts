import { Department } from 'src/entity/Department';
import { Skill } from 'src/entity/Skill';
import { User } from 'src/entity/User';
export declare class ManagementEvaluationRepository {
    private departmentEntity;
    private skillEntity;
    private userEntity;
    private skillGroupEntity;
    private skillUserEntity;
    getAll(departmentId?: number | string | undefined, limit?: number | undefined, offset?: number | undefined): Promise<{
        results: Department[];
        count: number;
    }>;
    getAllSkills(skillId?: number | string | undefined, detailed?: boolean, limit?: number | undefined, offset?: number | undefined, companyGroupCode?: string): Promise<{
        results: Skill[];
        count: number;
    }>;
    countSkillVersions(skillId: number): Promise<any>;
    deleteAdminEvalutionSkill(skillId: number): Promise<boolean>;
    getUserActive(companyGroupCode: string): Promise<User[]>;
}
