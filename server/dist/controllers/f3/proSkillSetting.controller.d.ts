import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { ListProSKillVersionRequestDto, ProSKillVersionRequestDto } from 'src/model/request/ProSkillSetingRequestDto';
import { ProSkillDetail } from 'src/interfaces/proskillSetting.interfaces';
export declare class ProSkillSettingRoleController {
    private proSkillSettingServices;
    private proSkillServices;
    private mailService;
    getDetailProskill(versionId: number, query: any, req: Request): Promise<{
        code: HttpStatus;
    } | {
        editAlready: boolean;
        versionId: any;
        skill: any;
        userUpdated: any;
        updated: any;
        publicStatus: any;
        status: any;
        version: string;
        publicDate: any;
        reason: any;
        versionMain: any;
        versionSub: any;
        lastUpdatedTime: any;
        children: any;
        settersAndApprovers: any;
        rejectComment: string;
        skillActive: any;
        code?: undefined;
    }>;
    getSkillRoleUser(req: Request): Promise<{
        skill: any;
    }>;
    getVersionProSkill(query: ListProSKillVersionRequestDto, req: Request): Promise<{
        data: object[];
        counts: any;
    } | {
        data: import("../../entity/VersionProSkill").VersionProSkill[];
        total: number;
    }>;
    saveDraft(versionId: number, request: Request): Promise<any>;
    getVersionProSkillDepartment(query: ProSKillVersionRequestDto, req: Request): Promise<{
        data: import("../../entity/VersionProSkill").VersionProSkill[];
        total: number;
    }>;
    submitVersion(versionId: number, request: Request): Promise<any>;
    cancelVersion(versionId: number, req: Request, body: any): Promise<any>;
    editProSkill(versionId: number, query: any, req: Request): Promise<{
        code: number;
        data?: undefined;
        rejectComment?: undefined;
        settersAndApprovers?: undefined;
        subVersion?: undefined;
        listPoint?: undefined;
        lengths?: undefined;
        editAlready?: undefined;
    } | {
        data: any;
        rejectComment: string;
        settersAndApprovers: any;
        subVersion: number;
        listPoint: import("../../entity/VersionSetting").VersionSetting;
        lengths: number;
        editAlready: boolean;
        code?: undefined;
    }>;
    getHistoryApproveContent(versionId: number, req: Request): Promise<{
        info: {
            version: string;
            skill: string;
        };
        approvalHistories: any[];
    }>;
    createInitialVersion(skillId: number, req: Request): Promise<any>;
    listPointOfVersion(skillId: string, req: Request): Promise<{
        code: HttpStatus;
        listPoint: import("../../entity/VersionSetting").VersionSetting;
        settersAndApprovers: any;
        skill: any;
    } | {
        code: HttpStatus;
        listPoint?: undefined;
        settersAndApprovers?: undefined;
        skill?: undefined;
    }>;
    checkPermissionSetterOfDepartment(req: Request, versionId: number): Promise<{
        status?: undefined;
        publicStatus?: undefined;
    } | {
        status: number;
        publicStatus: number;
    }>;
    getVersionPublic(req: Request): Promise<import("../../entity/VersionProSkill").VersionProSkill[]>;
    getDetailProSkill(param: ProSkillDetail, req: Request): Promise<import("../../model/response/VersionProSkillDto").VersionProSkillDto>;
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
    listItemTemplateSkill(param: {
        versionId: number;
    }): Promise<import("../../entity/ListProSkill").ListProSkill[]>;
}
