import { VersionBasicBehavior } from 'src/entity/VersionBasicBehavior';
import { BasicBehaviorRepositoryI } from 'src/interfaces/repository/basicBehavior.repository.interfaces';
import { ListBasicBehavior } from 'src/entity/ListBasicBehavior';
export declare class BasicBehaviorRepository implements BasicBehaviorRepositoryI {
    private basicBehaviorEntity;
    private listBasicBehaviorEnity;
    listBasicBehavior(params: any): Promise<{
        data: VersionBasicBehavior[];
        total: number;
    }>;
    inforCriteria(id: number): Promise<ListBasicBehavior[]>;
    inforCriteriaStep(id: number): Promise<VersionBasicBehavior>;
    maxSubVersion(object: {
        [x: string]: any;
    }): Promise<unknown>;
    updateAllVersionToPrivate(object: {
        [x: string]: any;
    }, transaction: any): Promise<[affectedCount: number]>;
    updateVersion(versionId: any, object: any, transaction: any): Promise<[affectedCount: number, affectedRows: VersionBasicBehavior[]]>;
    maxVersion(where: any, fields: string): Promise<unknown>;
    findOne(versionId: number): Promise<VersionBasicBehavior>;
    createNewVersion(object: any): Promise<VersionBasicBehavior>;
    createBulkListProSkill(object: any, transaction: any): Promise<ListBasicBehavior[]>;
    deleteAllListVersion(versionId: number, transaction: any): Promise<number>;
    cancelVersionProSkill(versionId: number, _userId: number, companyGroupCode: string): Promise<[affectedCount: number]>;
    getDetailBasicBehaviorSkill(id: number): Promise<VersionBasicBehavior>;
    getListBasicBehaviorSkillByVersionId(versionId: number): Promise<ListBasicBehavior[]>;
    findEvaluationItemsBasicBehaviorSkill(query: any): Promise<{
        data: VersionBasicBehavior[];
        counts: number;
    }>;
    transactionBehaviorBasic(): Promise<import("sequelize").Transaction>;
    findAllByCondition(object: {
        [x: string]: any;
    }): Promise<VersionBasicBehavior[]>;
    findOneByCondition(object: {
        [x: string]: any;
    }): Promise<VersionBasicBehavior>;
}
