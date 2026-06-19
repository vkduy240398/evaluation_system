import { ListProSkill } from 'src/entity/ListProSkill';
import { VersionProSkillDto } from 'src/model/response/VersionProSkillDto';
export declare class ProSkillServices {
    private proSkillRepository;
    private proSkillSettingRepository;
    private mailService;
    searchListApprovalProSkill(query: any, userId: any, companyGroupCode: string): Promise<{
        data: import("../entity/VersionProSkill").VersionProSkill[];
        counts: number;
    }>;
    getSkillByRoleUser(userId: number, companyGroupCode: string): Promise<import("../entity/Skill").Skill[]>;
    getDetailProSkillVersion(versionId: number, role: string, skillId: number, userId: number, companyGroupCode: string): Promise<any>;
    approveProSkill(versionId: number, comment: string, statusProSkill: string, creationUser: number, updateTime: string, hostName: string, skillId: number, companyGroupCode: string, timeZone: string): Promise<{
        result: string;
    }>;
    rejectProSkill(versionId: number, comment: string, statusProSkill: string, creationUser: number, updateTime: string, hostName: string, skillId: number, companyGroupCode: string, timeZone: string): Promise<boolean>;
    getDetailProSkillPublicOfSkill(skillId: number, companyGroupCode: string): Promise<{
        result: VersionProSkillDto;
        skill: any;
    }>;
    checkPermissionApproverOfDepartment(userId: number, departmentId: number): Promise<import("../entity/SkillRole").SkillRole>;
    getListDep_TempExport(year: number, periodIndex: number, role: string, companyGroupCode: string): Promise<any[]>;
    dep_TempProSkillExport(year: number, periodIndex: number, role: string, listSelected: [], companyGroupCode: string): Promise<{
        departmentName: any;
        jobType: any;
        mediumClass: any;
        smallClass: any;
        content: any;
        difficulty: any;
        note: any;
    }[]>;
    getItemsTemplateProSkill(versionId: number): Promise<ListProSkill[]>;
}
