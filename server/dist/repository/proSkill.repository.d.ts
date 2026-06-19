import { ListProSkill } from 'src/entity/ListProSkill';
import { Skill } from 'src/entity/Skill';
import { SkillRole } from 'src/entity/SkillRole';
import { VersionProSkill } from 'src/entity/VersionProSkill';
export declare class ProSkillRepository {
    private versionProSkillEntity;
    private skillGroupEntity;
    private listProSkillEntity;
    private departmentEntity;
    private historyApproveProSkillEntity;
    private skillRoleEntity;
    private skillEntity;
    private historyPublicProSkillEntity;
    searchListApprovalProSkill(query: any, userId: any, companyGroupCode: string): Promise<{
        data: VersionProSkill[];
        counts: number;
    }>;
    getSkillByRoleUser(userId: number, companyGroupCode: string): Promise<Skill[]>;
    detailProSkill(versionId: number): Promise<ListProSkill[]>;
    getVersionPublic(): Promise<ListProSkill[]>;
    createHistoryApproveOrRejectProSkill(versionId: number, comment: string, status: string, creationUser: number, createTime: Date): Promise<any>;
    getProSkillById(id: number): Promise<VersionProSkill>;
    changeCurrentStatusProSkillToApproved(id: any, _userId: any): Promise<[affectedCount: number]>;
    changeCurrentStatusProSkillToRejected(id: any, _userId: any): Promise<[affectedCount: number]>;
    checkProSkillPendingStatusInDepartmentToApprove(id: any, companyGroupCode: string): Promise<VersionProSkill[]>;
    getDepartmentById(id: number): Promise<any>;
    checkPermissionApproverOfSkill(userId: number, skillId: number): Promise<SkillRole>;
    findEvaluationItemsProSkill(query: any): Promise<{
        data: VersionProSkill[];
        counts: number;
    }>;
    versionMax(fields: any, where: {
        [x: string]: any;
    }): Promise<number>;
    updateVersion(object: {
        [x: string]: any;
    }, where: {
        [x: string]: any;
    }, transaction: any): Promise<VersionProSkill[]>;
    createHistory(object: {
        [x: string]: any;
    }, transaction: any): Promise<any>;
    getVersionPublicOfDivision(departmentId: number): Promise<ListProSkill[]>;
    getVersionPublicOfDepartment(departmentId: number): Promise<ListProSkill[]>;
    buildCreate(array: any[], transaction: any): Promise<VersionProSkill[]>;
    adminEvaluationDetailProSkillById(id: number): Promise<{
        id: number;
        version: number;
        subVersion: number;
        status: number;
        fullName: string;
        updatedTime: Date;
        reason: string;
        publicStatus: number;
        publicDate: string;
        type: number;
        departmentCode: string;
        departmentName: string;
        content: string;
        difficulty: number;
        idListProSkill: number;
        itemId: string;
        jobType: string;
        mediumClass: string;
        note: string;
        smallClass: string;
        departmentIdSub: number;
        departmentCodeSub: string;
        departmentNameSub: string;
    }[]>;
    getProSkillDetailById(id: number): Promise<VersionProSkill>;
    getSkilltById(id: number, companyGroupCode: string): Promise<any>;
    getVersionProSkillPublicOfSkill(skillId: number, companyGroupCode: string): Promise<VersionProSkill>;
    insertHistoryPublicProSkill(year: string, periodIndex: number, companyGroupCode: string): Promise<void>;
    getListDep_TempExport(year: number, periodIndex: number, role: string, companyGroupCode: string): Promise<any[]>;
    getDataExportProSkill(year: number, periodIndex: number, role: string, listSelected: [], companyGroupCode: any): Promise<{
        departmentName: any;
        jobType: any;
        mediumClass: any;
        smallClass: any;
        content: any;
        difficulty: any;
        note: any;
    }[]>;
    listItemTemplate(versionId: number): Promise<ListProSkill[]>;
}
