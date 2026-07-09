import {
  AchievementAdditionalType,
  AchievementType,
  BasicBehaviorType,
  EvaluationQuery,
  UserEvaluationAchievementType,
  UserEvaluationBasicBehaviorType,
} from '../user.interfaces';
import { Evaluation } from 'src/entity/Evaluation';
import { ListProSkill } from 'src/entity/ListProSkill';
import { ListBasicBehavior } from 'src/entity/ListBasicBehavior';
import { SettingAchievementPersonal } from 'src/entity/SettingAchievementPersonal';
import { EvaluationAchievementPersonal } from 'src/entity/EvaluationAchievementPersonal';
import { EvaluationBasicBehavior } from 'src/entity/EvaluationBasicBehavior';
import { SettingAchievementAdditional } from 'src/entity/SettingAchievementAdditional';
import { EvaluationAchievementAdditional } from 'src/entity/EvaluationAchievementAdditional';
import { SettingProFormulaSub } from 'src/entity/SettingProFormulaSub';
import { User } from 'src/entity/User';
import { Transaction } from 'sequelize';
import { VersionProSkill } from 'src/entity/VersionProSkill';
import { EvaluatorDefault } from 'src/entity/EvaluatorDefault';
import { EvaluationPro } from 'src/entity/EvaluationPro';

export interface UserRepositoryI {
  undoException(data: any, req: any): any;
  getEvaluatorByEvaluationIdAndOrder(id: any, order: any);
  findMaxIdEvaluation(userId: any, evaluationPeriodId: any): any;
  countUserBeforeImport(userId: any, evaluationPeriodId: any): any;
  getListUserRoleF1(): any;
  createUserEvaluatorDefault(listUserImport: any[]): any;
  getUserInforById(userId: number): any;
  getListUserInforByListId(listUserNotCreateEvaluation: any): any;
  getListUserEvaluationByEvaluationPeriodId(
    listUserSelected: any,
    id: any,
  ): any;
  checkUserAdded(listUserSelected: any, id: any): any;
  getEvaluationPeriodByYear(year: any, periodIndex: any): any;
  checkIsFixed(query: any, companyGroupCode: string): any;
  deleteUserSettingEvaluator(params: any, companyGroupCode: string): any;
  getEvaluatorDefaultUpdateTime(id: any): any;
  findListUserToSettingEvaluation(query: any): any;
  importUser(query: any): any;
  importUserProcedure(
    year: number,
    periodIndex: number,
    userIds: number[],
    isImport: number,
    companyGroupCode: string,
    timeZone: string,
  );
  markEvaluationsAsPersonal(
    userIds: number[],
    evaluationPeriodId: number,
    creationUser: number,
    companyGroupCode: string,
  ): Promise<void>;
  checkImportUser(query: any, companyGroupCode: string): any;
  listToEmail(
    type: string,
    year: string,
    periodIndex: string,
    companyGroupCode: string,
    departmentId?: number,
  ): Promise<any>;
  usersMailList(conditions: string, companyGroupCode: string): Promise<any>;
  getUserListForMail(condition: {}, roleId: number[]): Promise<User[]>;
  getUserDetailById(id: any): Promise<User>;
  getEvaluationByUserId(id: any, companyGroupCode: string): Promise<any>;
  getUserByEmail(email: string, companyGroupCode: string);
  getEvaluationPeriod(
    query: EvaluationQuery,
    userId: number,
    companyGroupCode: string,
  ): Promise<any[]>;
  getEvaluationById(
    id: number,
    userId: number,
    isEvaluatorUser: boolean,
  ): Promise<{
    evaluationDetail: Evaluation;
    evaluationAchievementPersonals: any;
  }>;
  getEvaluationById2(
    id: number,
    userId: number,
    isEvaluatorUser: boolean,
    companyGroupCode: string | null,
  ): Promise<{
    evaluationDetail: any;
    evaluationAchievementPersonals: any;
  }>;
  getProSkillPublicList(
    departmentId: number,
    divisionId: number,
    companyGroupCode: string,
    evaluationId?: number,
  ): Promise<VersionProSkill[]>;
  getNewTransaction();
  updateEvaluationProSkill(
    evaluationId: number,
    evaluationPro: any[],
    transaction: Transaction,
  ): Promise<any>;
  getBasicBehavior(
    type: number,
    level: any,
    flagSkill: number,
    companyGroupCode: string,
  ): Promise<ListBasicBehavior[]>;
  getProSkill(skillId: number): Promise<ListProSkill[]>;
  getIdEvaluation(
    userId: number,
    evaluationId: number,
    isEvaluatorUser: boolean,
  ): Promise<Evaluation>;
  getAchievementPublicByType(
    type: AchievementType,
    companyGroupCode: string,
  ): Promise<SettingAchievementPersonal[]>;

  updateEvaluationAchievement(
    evaluationId: number,
    evaluationAchievement: UserEvaluationAchievementType[],
    achievementSubs: any,
    status: number,
    transaction: Transaction,
  ): Promise<EvaluationAchievementPersonal[]>;
  getDivisionByIdEvaluation(idEvaluation: number): Promise<any>;
  getDepartmentGoal(
    divisionId: number,
    evaluationPeriodId: number,
    companyGroupCode: string,
  ): Promise<any>;
  getEvaluationPeriodId(
    companyGroupCode: string,
    timeZone: string,
  ): Promise<any>;
  getListUser(query: any);
  deleteListUser(query: any, companyGroupCode: string, timeZone: string);
  updateListUser(query: any);
  updateUserInfo(query: any, userId: number);
  getEvaluationPeriodByEvaluationId(EvaluationId: number): Promise<any>;
  getEvaluator(userId: number, order: string, companyGroupCode: string);
  deletePermission(
    userId: number,
    isChangeRole2: boolean,
    isChangeRoleF3: boolean,
    isChangeRoleF4: boolean,
    transaction: Transaction,
  );
  updatePermission(body: any, transaction: Transaction);
  getBasicBehaviorSkillPublic(
    type: BasicBehaviorType | BasicBehaviorType[],
    companyGroupCode: string,
    level?: number | number[],
  ): Promise<ListBasicBehavior[]>;

  updateEvaluationBasicBehaviorSkill(
    evaluationId: number,
    level: number,
    flagSkill: number,
    companyGroupCode: string,
    transaction: Transaction,
  ): Promise<any>;

  updateEvaluationBasicOrBehaviorSkill(
    evaluationId: number,
    evaluationBasicBehavior: UserEvaluationBasicBehaviorType[],
    type: BasicBehaviorType,
    transaction: Transaction,
  ): Promise<EvaluationBasicBehavior[]>;

  getAchievementAddPublicByType(
    type: AchievementType,
    typeNew: number,
    companyGroupCode: string,
  ): Promise<SettingAchievementAdditional[]>;

  updateEvaluationAchievementAdditional(
    evaluationId: number,
    achievementAdditionals: AchievementAdditionalType[],
    transaction: Transaction,
  ): Promise<EvaluationAchievementAdditional[]>;

  getSettingProFormulaPublic(
    companyGroupCode: string,
  ): Promise<SettingProFormulaSub[]>;
  getLengthEvaluationPeriod(
    query: EvaluationQuery,
    userId: number,
    companyGroupCode: string,
  );
  getDivisionByUserId(userId: number);
  getEvaluationDepartmentId(evaluationId: number);
  getDepartmentGoalbyEvaluationDepartmentId(evaluationDepartmentId: number);
  searchListUserSettingEvaluator(query: any): any;
  searchListUserSettingEvaluator2(query: any): any;
  getListEvaluator(
    evaluationCreatorId: number | undefined,
    companyGroupCode: string,
  ): any;
  updateSettingEvaluatorOfOneUser(query: any, companyGroupCode: string): any;
  updateSettingEvaluatorListUser(query: any, companyGroupCode: string): any;
  getUserIdByEvaluationId(evaluationId: number): Promise<any>;
  countsEvaluationPeriod(query: EvaluationQuery, userId: number);
  getListProSkillPublicByDepartmentIds(
    Ids: number[],
  ): Promise<VersionProSkill[]>;

  evaluationSkillCheck(evaluationId: number): Promise<Evaluation>;

  getEvaluationByIdV2(
    id: number,
    userId: any,
    isEvaluatorUser: boolean,
    companyGroupCode: string | null,
  ): Promise<{
    evaluationDetail: Evaluation;
    evaluationAchievementPersonals: any;
    achievementAdditionalSettings: any;
  }>;

  getEvaluatorDefault(
    userId: number,
    evaluationPeriodId: number,
  ): Promise<EvaluatorDefault>;

  getDefaultActive(condition: { [x: string]: any });
  getListUserByInEmail(condition: { [x: string]: any }): Promise<any>;
  getUserNameFromEmail(email: string, companyGroupCode?: string): Promise<any>;
  countEvaluationException(condition: any): Promise<any>;
  getUserEvaluatorByEvaluationId(id: number): Promise<any>;
  getUserInfoByFullname(fullName: string): any;
  importUserFromExcel(data: any): any;
  findPersonalSub(id: number[]): Promise<any>;
  getDataExportListUser(params: any): Promise<any>;
  getDataExportListUser2(params: any): Promise<any>;
  listTemplateCreationGoal(query: any, id: number): Promise<any>;
  listUserTheSameInforWithEvaluator(query: any);
  getVersionSrtting();
  getListSkillByDepDivId(id: any);
  importSkillUser(query: any): any;
  getAllSkill(companyGroupCode: string);
  getAllSkillPublic(companyGroupCode: string);
  updateSkillUser(userId: any, evaluationId: any, periodId: any);
  getProSkillPublicListInMenu(
    userId: number,
    companyGroupCode: string,
    timeZone: string,
  ): Promise<any>;

  getUsersWithCompanyGroup(email: string): Promise<User[]>;
  getListUserWithRole(
    roleId: number,
    companyGroupCode?: string,
  ): Promise<User[]>;

  getlistProSkillByIdEvaluation(condition: {
    [x: string]: any;
  }): Promise<EvaluationPro[]>;
}
