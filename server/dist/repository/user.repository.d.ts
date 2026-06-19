import { Transaction } from 'sequelize';
import { Evaluation } from 'src/entity/Evaluation';
import { EvaluationPeriod } from 'src/entity/EvaluationPeriod';
import { Evaluator } from 'src/entity/Evaluator';
import { User } from 'src/entity/User';
import { AchievementAdditionalType, AchievementType, BasicBehaviorType, EvaluationQuery, UserEvaluationAchievementType, UserEvaluationBasicBehaviorType, UserEvaluationToProSkillType } from 'src/interfaces/user.interfaces';
import { UserRepositoryI } from 'src/interfaces/repository/user.repository.interface';
import { SettingLevel } from 'src/entity/SettingLevel';
import { EvaluationPro } from 'src/entity/EvaluationPro';
import { ListProSkill } from 'src/entity/ListProSkill';
import { VersionProSkill } from 'src/entity/VersionProSkill';
import { ListBasicBehavior } from 'src/entity/ListBasicBehavior';
import { EvaluationAchievementPersonal } from 'src/entity/EvaluationAchievementPersonal';
import { SettingAchievementPersonal } from 'src/entity/SettingAchievementPersonal';
import { EvaluationAchievementAdditional } from 'src/entity/EvaluationAchievementAdditional';
import { SettingAchievementAdditional } from 'src/entity/SettingAchievementAdditional';
import { SettingProFormulaSub } from 'src/entity/SettingProFormulaSub';
import { EvaluatorDefault } from 'src/entity/EvaluatorDefault';
import { Skill } from 'src/entity/Skill';
import { SkillGroup } from 'src/entity/SkillGroup';
import { SkillUser } from 'src/entity/SkillUser';
export declare class UserRepository implements UserRepositoryI {
    getVersionSrtting(): void;
    private userEntity;
    private evaluationPeriodEntity;
    private evaluationEntity;
    private settingLevelEntity;
    private evaluationProEntity;
    private listBasicBehaviorEntity;
    private listProSkillEntity;
    private settingAchievementPersonalEntity;
    private evaluationAchievementPersonal;
    private evaluationAchievementPersonalSub;
    private evaluationBasicBehaviorEntity;
    private settingAchievementAdditionalEntity;
    private evaluationAchievementAdditionalEntity;
    private permission;
    private settingProFormulaSubEntity;
    private evaluatorEntity;
    private evaluatorDefaultEntity;
    private versionProSkillEntity;
    private skillRole;
    private skillGroupEntity;
    private skillUserEntity;
    private skillEntity;
    private settingDefaultPeriodEnity;
    private settingReviewEnity;
    private evaluatorDefault;
    private skillUser;
    getUserByEmail(email: string, companyGroupCode: string): Promise<User>;
    getUsersWithCompanyGroup(email: string): Promise<User[]>;
    getUserActive(id: number): Promise<User>;
    getEvaluationPeriod(query: EvaluationQuery, userId: number, companyGroupCode: string): Promise<EvaluationPeriod[]>;
    evaluationSkillCheck(evaluationId: number): Promise<Evaluation>;
    getEvaluationById(id: number, userId: any, isEvaluatorUser: boolean): Promise<{
        evaluationDetail: Evaluation;
        evaluationAchievementPersonals: any;
    }>;
    getEvaluationById2(id: number, userId: any, isEvaluatorUser: boolean, companyGroupCode: string | null): Promise<{
        evaluationDetail: Evaluation;
        evaluationAchievementPersonals: any;
    }>;
    getEvaluationByIdV2(id: number, userId: any, isEvaluatorUser: boolean, companyGroupCode: string | null): Promise<any>;
    getSettingLevel(level: number): Promise<SettingLevel[]>;
    getIdEvaluation(userId: number, evaluationId: number, isEvaluatorUser: boolean): Promise<Evaluation>;
    getProSkillPublicList(departmentId: number, divisionId: number, companyGroupCode: string, evaluationId?: number): Promise<VersionProSkill[]>;
    getProSkillPublicListInMenu(userId: number, companyGroupCode: string, timeZone: string): Promise<{
        results: any[];
        depDivName: string;
    }>;
    getNewTransaction(): Promise<Transaction>;
    updateEvaluationProSkill(evaluationId: number, evaluationPro: UserEvaluationToProSkillType[], transaction: Transaction): Promise<EvaluationPro[]>;
    getBasicBehavior(type: number, level: any, flagSkill: number, companyGroupCode: string): Promise<ListBasicBehavior[]>;
    getProSkill(skillId: number): Promise<ListProSkill[]>;
    getDivisionByIdEvaluation(idEvaluation: number): Promise<{
        divisionName: string;
        evaluationPeriodId: number;
    }>;
    getAchievementPublicByType(type: AchievementType, companyGroupCode: string): Promise<SettingAchievementPersonal[]>;
    getAchievementAddPublicByType(type: AchievementType, typeNew: number, companyGroupCode: string): Promise<SettingAchievementAdditional[]>;
    processValueNull(value: any): any;
    updateEvaluationAchievement(evaluationId: number, evaluationAchievement: UserEvaluationAchievementType[], achievementSubs: any[], status: number, transaction: Transaction): Promise<EvaluationAchievementPersonal[]>;
    updateEvaluationBasicOrBehaviorSkill(evaluationId: number, evaluationBasicBehavior: UserEvaluationBasicBehaviorType[], type: BasicBehaviorType, transaction: Transaction): Promise<any>;
    updateEvaluationAchievementAdditional(evaluationId: number, achievementAdditionals: AchievementAdditionalType[], transaction: Transaction): Promise<EvaluationAchievementAdditional[]>;
    getSettingProFormulaPublic(companyGroupCode: string): Promise<SettingProFormulaSub[]>;
    getDepartmentGoalbyEvaluationDepartmentId(evaluationDepartmentId: number): Promise<any>;
    getDepartmentGoal(divisionId: number, evaluationPeriodId: number, companyGroupCode: string): Promise<any>;
    findPersonalSub(id: number[]): Promise<any>;
    getEvaluationDepartmentId(evaluationId: number): Promise<any>;
    getDivisionByUserId(userId: number): Promise<any>;
    getEvaluationPeriodId(companyGroupCode: string, timeZone: string): Promise<EvaluationPeriod>;
    getListUser(query: any): Promise<{
        data: User[];
        counts: number;
        arrayWhere: any[];
    }>;
    deleteListUser(query: any, companyGroupCode: string, timeZone: string): Promise<{
        userInfor: User[];
    }>;
    updateListUser(query: any): void;
    getBasicBehaviorSkillPublic(type: BasicBehaviorType | BasicBehaviorType[], companyGroupCode: string, level?: number | number[]): Promise<ListBasicBehavior[]>;
    updateEvaluationBasicBehaviorSkill(evaluationId: number, level: number, flagSkill: number, companyGroupCode: string, transaction: Transaction): Promise<any>;
    updateUserInfo(body: any, userId: number): Promise<any>;
    deletePermission(userId: number, isChangeRole2: boolean, isChangeRoleF3: boolean, isChangeRoleF4: boolean, transaction: Transaction): Promise<any>;
    updatePermission(body: any, transaction: Transaction): Promise<any>;
    getEvaluator(userId: number, order: string, companyGroupCode: string): Promise<Evaluation[]>;
    getLengthEvaluationPeriod(query: EvaluationQuery, userId: number, companyGroupCode: string): Promise<number>;
    getEvaluationByUserId(id: any, companyGroupCode: string): Promise<Evaluation[]>;
    getUserDetailById(id: any): Promise<User>;
    searchListUserSettingEvaluator(query: any): Promise<{
        data: [unknown[], unknown];
        counts: number;
    }>;
    searchListUserSettingEvaluator2(query: any): Promise<{
        data: any;
        counts: any;
    }>;
    getUserListForMail(condition: any, roleId: number[]): Promise<User[]>;
    getUserActiveByCondition(departmentId: number, companyId: number, periodId: number, searchInput: string, limit: number | undefined, offset: number | undefined): Promise<{
        users: User[];
        count: number;
    }>;
    getListEvaluator(evaluationCreatorId: number | undefined, companyGroupCode: string): Promise<User[]>;
    updateSettingEvaluatorOfOneUser(query: any, companyGroupCode: string): Promise<{
        userDeleted: User[];
        evaluatorDeleted: User[];
        evaluatorCanNotDeleted: User[];
    }>;
    updateSettingEvaluatorListUser(query: any, companyGroupCode: string): Promise<{
        userInfor: User[];
        userDeleted: User[];
        evaluatorDeleted: User[];
    }>;
    listUserDepartment(condition: {
        [x: string]: any;
    }): Promise<User[]>;
    listEvaluatorDefault(condition: {
        [x: string]: any;
    }): Promise<EvaluatorDefault>;
    updateEvaluatorDefault(condition: any, data: any, transaction: any): Promise<void>;
    getAllEvaluatorDefault(): Promise<EvaluatorDefault[]>;
    listEvaluationByPeriod(periodId: number, evaluatorId: any[]): Promise<Evaluation[]>;
    getUserIdByEvaluationId(evaluationId: number): Promise<any>;
    listToEmail(_type: string, year: string, periodIndex: string, companyGroupCode: string, departmentId?: number): Promise<any[]>;
    private listToEmailByDepartment;
    checkImportUser(query: any, companyGroupCode: string): Promise<EvaluatorDefault[]>;
    importUser(listUserImport: any): Promise<EvaluatorDefault[]>;
    markEvaluationsAsPersonal(userIds: number[], evaluationPeriodId: number, creationUser: number, companyGroupCode: string): Promise<void>;
    importUserProcedure(year: number, periodIndex: number, userIds: number[], isImport: number, companyGroupCode: string, timeZone: string): Promise<void>;
    getListUserRoleF1(): Promise<User[]>;
    countUserBeforeImport(userId: any, evaluationPeriodId: any): Promise<number>;
    findListUserToSettingEvaluation(query: any): Promise<{
        data: User[];
        counts: number;
    }>;
    getEvaluationPeriodByYear(year: any, periodIndex: any): Promise<EvaluationPeriod>;
    getEvaluationPeriodByEvaluationId(EvaluationId: number): Promise<EvaluationPeriod>;
    checkUserAdded(listUserSelected: any, id: any): Promise<number>;
    getListUserEvaluationByEvaluationPeriodId(listUserSelected: any, id: any): Promise<Evaluation[]>;
    getListUserInforByListId(id: any): Promise<User[]>;
    findMaxIdEvaluation(userId: any, evaluationPeriodId: any): Promise<unknown>;
    getEvaluatorByEvaluationIdAndOrder(id: any, order: any): Promise<Evaluator>;
    createUserEvaluatorDefault(listUserImport: any): Promise<EvaluatorDefault[]>;
    getUserInforById(id: any): Promise<User>;
    getEvaluatorDefaultUpdateTime(id: any): Promise<EvaluatorDefault>;
    deleteUserSettingEvaluator(params: any, companyGroupCode: string): Promise<boolean>;
    checkIsFixed(query: any, companyGroupCode: string): Promise<EvaluationPeriod[]>;
    countsEvaluationPeriod(query: EvaluationQuery, userId: number): Promise<EvaluationPeriod[]>;
    getListProSkillPublicByDepartmentIds(Ids: number[]): Promise<VersionProSkill[]>;
    listToEmailEvaluation(where: {
        [x: string]: any;
    }): Promise<any>;
    listUserDepartmentVersionTwo(condition: {
        [x: string]: any;
    }, periodId: number): Promise<EvaluatorDefault[]>;
    getEvaluatorDefault(userId: number, evaluationPeriodId: number): Promise<EvaluatorDefault>;
    getDefaultActive(condition: {
        [x: string]: any;
    }): Promise<{
        userId: number;
    }[]>;
    getListUserByInEmail(condition: {
        [x: string]: any;
    }): Promise<User[]>;
    usersMailList(conditions: string, companyGroupCode: string): Promise<User[]>;
    getUserNameFromEmail(email: string, companyGroupCode?: string): Promise<User>;
    countEvaluationException(condition: any): Promise<number>;
    getUserEvaluatorByEvaluationId(id: number): Promise<Evaluation>;
    getUserInfoByFullname(fullName: any): Promise<User>;
    importUserFromExcel(data: any): Promise<[EvaluatorDefault, boolean]>;
    getDataExportListUser(query: any): Promise<{
        data: User[];
        counts: number;
    }>;
    getDataExportListUser2(query: any): Promise<{
        data: object[];
        counts: number;
    }>;
    listTemplateCreationGoal(query: any, id: any): Promise<object[]>;
    listUserTheSameInforWithEvaluator(query: any): Promise<{
        data: User[];
        counts: number;
    }>;
    getListSkillByDepDivId(ids: number[]): Promise<SkillGroup[]>;
    deleteSkillUser(conditions: any, transaction: Transaction): Promise<number>;
    importSkillUser(listUserSkill: any, transaction?: Transaction): Promise<SkillUser[]>;
    getAllSkill(companyGroupCode: string): Promise<Skill[]>;
    getAllSkillPublic(companyGroupCode: string): Promise<Skill[]>;
    updateSkillUser(userId: any, evaluationId: any, periodId: any): Promise<[affectedCount: number]>;
    getListUserWithRole(roleId: number, companyGroupCode?: string): Promise<User[]>;
    undoException(data: any, req: any): Promise<[unknown[], unknown]>;
    getlistProSkillByIdEvaluation(condition: {
        [x: string]: any;
    }): Promise<EvaluationPro[]>;
}
