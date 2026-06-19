import { VersionProSkill } from 'src/entity/VersionProSkill';
export interface ProSkillSettingRepositoryI {
    getVersionProSkill(companyGroupCode: string, status: string, offset: number, limit: number, publicStatus: number, listDepartmentId: number[], type: string): any;
    getDetailProSkillGeneric(versionId: number, companyGroupCode?: string): Promise<VersionProSkill>;
    findOneVersion(object: any): Promise<VersionProSkill>;
    findMax(version: number, departmentId: number, companyGroupCode: string): Promise<number>;
    createNewVersionSaveDraft(data: any, transaction: any): Promise<VersionProSkill>;
    getHistoryApproveContent(versionId: number, userId: number): Promise<any>;
    getSkillRole(skillId: number, userId: number): Promise<any>;
    getDetailProSkill(versionId: number, companyGroupCode?: string): Promise<VersionProSkill>;
    findDepartmentRoleByDepartmentId(departmentId: number, role: number): Promise<any>;
}
