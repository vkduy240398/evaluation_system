import { VersionBasicBehavior } from 'src/entity/VersionBasicBehavior';
import { BasicBehaviorSearchInterfaces } from '../service/basicBehavior.interfaces';
import { ListBasicBehavior } from 'src/entity/ListBasicBehavior';

export interface BasicBehaviorRepositoryI {
  listBasicBehavior(params: BasicBehaviorSearchInterfaces): any;
  // countsBasicBehavior(params: BasicBehaviorSearchInterfaces): Promise<number>;
  inforCriteria(id: number): Promise<ListBasicBehavior[]>;
  inforCriteriaStep(id: number): Promise<VersionBasicBehavior>;
  maxSubVersion(object: { [x: string]: any });
  maxVersion(where: any, fields: string);
  updateAllVersionToPrivate(object: { [x: string]: any }, transaction: any);
  updateVersion(versionId: number, object: any, transaction: any);
  findOne(versionId: number): Promise<VersionBasicBehavior>;
  createNewVersion(object: any);
  createBulkListProSkill(object: any, transaction: any);
  deleteAllListVersion(versionId: number, transaction: any);
  cancelVersionProSkill(
    versionId: number,
    userId: number,
    companyGroupCode: string,
  );
  getDetailBasicBehaviorSkill(id: number): any;
  getListBasicBehaviorSkillByVersionId(id: any): any;
  findEvaluationItemsBasicBehaviorSkill(query: any): any;
  transactionBehaviorBasic();
  findAllByCondition(object: {
    [x: string]: any;
  }): Promise<VersionBasicBehavior[]>;
  findOneByCondition(object: {
    [x: string]: any;
  }): Promise<VersionBasicBehavior>;
}
