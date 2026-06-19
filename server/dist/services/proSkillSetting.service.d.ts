import { HttpStatus } from '@nestjs/common';
import { ListProSKillVersionRequestDto, ProSKillVersionRequestDto } from 'src/model/request/ProSkillSetingRequestDto';
import { VersionProSkillDto } from 'src/model/response/VersionProSkillDto';
import { Request } from 'express';
export declare class ProSkillSettingServices {
    private proSkillSettingRepository;
    private adminEvaluation;
    private versionSettingRepository;
    private departmentRepository;
    getSkillRoleUser(userId: number, companyGroupCode: string): Promise<{
        skill: any;
    }>;
    getVersionProSkill(query: ListProSKillVersionRequestDto, userId: number, companyGroupCode: string): Promise<{
        data: object[];
        counts: any;
    } | {
        data: import("../entity/VersionProSkill").VersionProSkill[];
        total: number;
    }>;
    getDetailProSkillGeneric(versionId: number, companyGroupCode?: string): Promise<VersionProSkillDto>;
    getVersionProSkillDepartment(query: ProSKillVersionRequestDto, companyGroupCode?: string): Promise<{
        data: import("../entity/VersionProSkill").VersionProSkill[];
        total: number;
    }>;
    createNewVersionSaveDraft(versionId: number, objectUpdated: any, creationUser: number, companyGroupCode: string, timeZone: string): Promise<any>;
    createBulk(versionId: number, data: any[]): Promise<void>;
    createNewVersionSubmit(versionId: number, objectUpdated: any, creationUser: number, companyGroupCode: string, tempListPoint: any, timeZone: string): Promise<any>;
    cancelVersionPro(versionId: number, userId: number, updatedTime: any): Promise<any>;
    getDetailProSkillVersion(versionId: number, role: string, companyGroupCode: string): Promise<any>;
    getHistoryApproveContent(versionId: number, userId: number, isAdmin?: boolean, companyGroupCode?: string): Promise<{
        info: {
            version: string;
            skill: string;
        };
        approvalHistories: any[];
    }>;
    getEditProSkillVersion(versionId: number, creationUser: number, companyGroupCode: string): Promise<{
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
        listPoint: import("../entity/VersionSetting").VersionSetting;
        lengths: number;
        editAlready: boolean;
        code?: undefined;
    }>;
    createNewVersionInit(params: any, userId: any, skillId: any, companyGroupCode: any, timeZone: any): Promise<any>;
    getAchievementPersonal(versionId: number): Promise<any>;
    getAchievementAdditional(versionId: number): Promise<any>;
    getData810(versionId: number, req: Request): Promise<{
        goals: any;
        additional: any;
        totalPoint: any;
        data: any;
        isHaveEditRecord: boolean;
    }>;
    listPointByVersion(skillId: string, userId: number, companyGroupCode: string): Promise<{
        code: HttpStatus;
        listPoint: import("../entity/VersionSetting").VersionSetting;
        settersAndApprovers: any;
        skill: any;
    } | {
        code: HttpStatus;
        listPoint?: undefined;
        settersAndApprovers?: undefined;
        skill?: undefined;
    }>;
    checkPermissionSetterOfDepartment(userId: number, versionId: number): Promise<{
        status?: undefined;
        publicStatus?: undefined;
    } | {
        status: number;
        publicStatus: number;
    }>;
    getDetailProSkill(versionId: number, userId: number, readonly: string, companyGroupCode: string): Promise<{
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
    listVersionPublic(companyGroupCode: string): Promise<import("../entity/VersionProSkill").VersionProSkill[]>;
}
