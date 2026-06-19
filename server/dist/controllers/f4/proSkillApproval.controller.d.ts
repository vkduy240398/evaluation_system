import { VersionProSkillDto } from 'src/model/response/VersionProSkillDto';
import { Request } from 'express';
import { ProSkillApproveRequestDto } from 'src/model/request/ProSkillApproveRequestDto';
import { ProSKillVersionRequestDto } from 'src/model/request/ProSkillSetingRequestDto';
import { RequestApprovedProSkill } from 'src/model/request/VersionListProSkillRequest';
export declare class ProSkillApprovalRoleController {
    private proSkillServices;
    private proSkillSettingServices;
    searchListApprovalProSkill(query: ProSkillApproveRequestDto, req: Request): Promise<{
        data: import("../../entity/VersionProSkill").VersionProSkill[];
        counts: number;
    }>;
    getAllDepartment(req: Request): Promise<import("../../entity/Skill").Skill[]>;
    getDetailProSkillApproval(req: Request, versionId: number, skillId: number): Promise<any>;
    getDetailProSkill(versionId: number, req: Request): Promise<VersionProSkillDto>;
    approveProSkill(versioniId: number, req: Request, body: RequestApprovedProSkill): Promise<{
        result: string;
    }>;
    rejectProSkill(versioniId: number, req: Request, body: RequestApprovedProSkill): Promise<boolean>;
    getVersionProSkillDepartment(query: ProSKillVersionRequestDto, req: Request): Promise<{
        data: import("../../entity/VersionProSkill").VersionProSkill[];
        total: number;
    }>;
    getDetailProSkillPublicOfDepartment(skillId: number, req: Request): Promise<{
        result: VersionProSkillDto;
        skill: any;
    }>;
    getHistoryApproveContent(versionId: number, userId: number, req: Request): Promise<{
        info: {
            version: string;
            skill: string;
        };
        approvalHistories: any[];
    }>;
    getListDep_TempExport(params: any, req: Request): Promise<any[]>;
    dep_TempProSkillExport(params: any, req: Request): Promise<{
        departmentName: any;
        jobType: any;
        mediumClass: any;
        smallClass: any;
        content: any;
        difficulty: any;
        note: any;
    }[]>;
}
