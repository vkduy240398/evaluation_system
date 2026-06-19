import { DivisionSubclass } from 'src/entity/DivisionSubclass';
import { HistoryApproveProSkill } from 'src/entity/HistoryApproveProSkill';
import { ListProSkill } from 'src/entity/ListProSkill';
import { SkillRole } from 'src/entity/SkillRole';
import { VersionProSkill } from 'src/entity/VersionProSkill';
import { ProSkillSettingRepositoryI } from 'src/interfaces/repository/proSkillSetting.interface';
export declare class ProSkillSettingRepository implements ProSkillSettingRepositoryI {
    private versionProSkillEntity;
    private listProSkillEntiny;
    private historyApproveProSkillEntiny;
    private divisionSubclassEntity;
    private skillRoleEntity;
    getSkillRoleUser(userId: number, companyGroupCode: string): Promise<any>;
    getVersionProSkill(companyGroupCode: string, status: string, offset: number, limit: number, publicStatus: number, listSkillId: number[], type: string): Promise<{
        data: VersionProSkill[];
        total: number;
    }>;
    detailProSkill(versionId: number): Promise<ListProSkill[]>;
    getDetailProSkillF3(versionId: number): Promise<any>;
    getProskillSettersAndApproversForDepartmentId(skillId: number): Promise<any>;
    getDetailProSkillGeneric(versionId: number, companyGroupCode?: string): Promise<VersionProSkill>;
    getVersionPublic(skillId: number, companyGroupCode: string): Promise<ListProSkill[]>;
    getVersionProSkillDepartment(skillId: number, offset: number, limit: number, companyGroupCode?: string): Promise<{
        data: VersionProSkill[];
        total: number;
    }>;
    findOneVersion(object: {
        [x: string]: any;
    }): Promise<any>;
    findMax(version: number, skillId: number, companyGroupCode: string): Promise<number>;
    createNewVersionSaveDraft(data: any, transaction: any): Promise<VersionProSkill>;
    createMultipleData(data: any[], transaction: any): Promise<ListProSkill[]>;
    updatedVersion(versionId: any, objectUpdate: any, transaction: any): Promise<VersionProSkill[]>;
    deleteListProSkill(versionId: number, transaction: any): Promise<number>;
    cancelVersionProSkill(versionId: number, _userId: number): Promise<[affectedCount: number, affectedRows: VersionProSkill[]]>;
    getHistoryApproveContent(versionId: number, _userId: number): Promise<HistoryApproveProSkill[]>;
    getSkillRole(skillId: number, userId: number): Promise<SkillRole[]>;
    getDetailProSkill(versionId: number, companyGroupCode?: string): Promise<VersionProSkill>;
    getRoleUser(skillId: number, userId: number): Promise<any>;
    getListProSkillByVersionId(versionId: number): Promise<ListProSkill[]>;
    getDivSubClassByDepartmentId(departmentId: number): Promise<DivisionSubclass>;
    getDivSubClassByGroupId(groupId: number): Promise<DivisionSubclass[]>;
    findAllVersionWaiting(object: {
        [x: string]: any;
    }): Promise<number>;
    findDepartmentRoleByDepartmentId(skillId: number, role: number): Promise<SkillRole[]>;
    checkPermissionSetterOfDepartment(userId: number, skillId: number): Promise<number>;
    getTransactionVersionProSkill(): Promise<import("sequelize").Transaction>;
    getTransactionListProSkill(): Promise<import("sequelize").Transaction>;
    detailProSkillByCondition(where: {
        [x: string]: any;
    }): Promise<VersionProSkill[]>;
    listProSkillF3New(companyGroupCode: string, skillId: number, offset: number, limit: number, userId: number): Promise<{
        data: object[];
        counts: any;
    }>;
    getRejectComment(versionId: any): Promise<HistoryApproveProSkill>;
    getProskillSettersAndApproversForSkillId(skillId: number): Promise<SkillRole[]>;
    findOneVersionProSkill(object: {
        [x: string]: any;
    }): Promise<VersionProSkill>;
    getVersionPublicProSkill(skillId: number, companyGroupCode: string): Promise<ListProSkill[]>;
    getDetailProSkillByVersionId(versionId: number): Promise<ListProSkill[]>;
    findSkillRoleBySkillId(skillId: number, role: number): Promise<SkillRole[]>;
}
