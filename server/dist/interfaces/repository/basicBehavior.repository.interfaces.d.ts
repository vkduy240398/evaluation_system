import { VersionBasicBehavior } from 'src/entity/VersionBasicBehavior';
import { BasicBehaviorSearchInterfaces } from '../service/basicBehavior.interfaces';
import { ListBasicBehavior } from 'src/entity/ListBasicBehavior';
export interface BasicBehaviorRepositoryI {
    listBasicBehavior(params: BasicBehaviorSearchInterfaces): any;
    inforCriteria(id: number): Promise<ListBasicBehavior[]>;
    inforCriteriaStep(id: number): Promise<VersionBasicBehavior>;
    maxSubVersion(object: {
        [x: string]: any;
    }): any;
    maxVersion(where: any, fields: string): any;
    updateAllVersionToPrivate(object: {
        [x: string]: any;
    }, transaction: any): any;
    updateVersion(versionId: number, object: any, transaction: any): any;
    findOne(versionId: number): Promise<VersionBasicBehavior>;
    createNewVersion(object: any): any;
    createBulkListProSkill(object: any, transaction: any): any;
    deleteAllListVersion(versionId: number, transaction: any): any;
    cancelVersionProSkill(versionId: number, userId: number, companyGroupCode: string): any;
    getDetailBasicBehaviorSkill(id: number): any;
    getListBasicBehaviorSkillByVersionId(id: any): any;
    findEvaluationItemsBasicBehaviorSkill(query: any): any;
    transactionBehaviorBasic(): any;
    findAllByCondition(object: {
        [x: string]: any;
    }): Promise<VersionBasicBehavior[]>;
    findOneByCondition(object: {
        [x: string]: any;
    }): Promise<VersionBasicBehavior>;
}
