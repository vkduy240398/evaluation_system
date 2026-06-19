import { AchievementType, BasicBehaviorType, EvaluationQuery, UpdateEvaluationType, UserType } from 'src/interfaces/user.interfaces';
import { EmailType, EmailTypeFixed } from 'src/enum/TemplateMailId';
export declare class UserService {
    private userRepo;
    private pointRepo;
    private mailService;
    private evaluation17Service;
    private evaluationPeriodRepo;
    private versionSettingRepository;
    private approvalRepository;
    private evaluatorRepo;
    private proSkillRepository;
    private evaluationRepo;
    private periodDeptSettingRepo;
    listEvaluation(query: EvaluationQuery, userId: number, companyGroupCode: string): Promise<{
        data: any[];
        counts: any;
    }>;
    evaluationSkillCheck(evaluationId: number): Promise<import("../entity/Evaluation").Evaluation>;
    getEvaluationData(evaluationId: number, user: UserType, isEvaluatorUser: string, companyGroupCode: string | null, timeZone: string): Promise<any | null>;
    getEvaluationV2(evaluationId: number, user: UserType, isEvaluatorUser: string, companyGroupCode: string | null, timeZone: string): Promise<any>;
    getListProSkillPublic(user: UserType, evaluationId?: number): Promise<any[]>;
    getListProSkillPublicInMenu(user: any): Promise<{
        departmentName: any;
        listProSkills: any;
    }>;
    updateEvaluation(evaluationId: number, user: UserType, data: UpdateEvaluationType, host: string, timeZone: string): Promise<{
        statusNumber: number;
        updateTime: string;
    }>;
    getSettingProFormulaPublic(companyGroupCode: string): Promise<import("../entity/SettingProFormulaSub").SettingProFormulaSub[]>;
    listBasicBehavior(type: number, level: any, flagSkill: number, companyGroupCode: string): Promise<any[]>;
    getDepartmentGoal(idEvaluation: number, userId: number, companyGroupCode: string, timeZone: string): Promise<any[] | {
        evaluationAchievementPersonalSubs: any;
        data: any;
    }>;
    getListUser(query: any): Promise<any>;
    getUserIdByEvaluationId(evaluationId: number): Promise<any>;
    deleteListUser(query: any, companyGroupCode: string, timeZone: string): Promise<any>;
    getAchievementPublic(type: AchievementType, companyGroupCode: string): Promise<import("../entity/SettingAchievementPersonal").SettingAchievementPersonal[]>;
    getAchievementAddPublic(type: AchievementType, typeNew: number, companyGroupCode: string): Promise<import("../entity/SettingAchievementAdditional").SettingAchievementAdditional[]>;
    getBasicBehaviorSkillPublic(type: BasicBehaviorType, companyGroupCode: string, level?: number): Promise<{
        key: string;
        idItem: number;
        versionId: number;
        title: string;
        content: string;
        difficulty: number;
        versionBasicBehavior: import("../entity/VersionBasicBehavior").VersionBasicBehavior;
        id?: any;
        createdAt?: any;
        updatedAt?: any;
        deletedAt?: any;
        version?: any;
        _attributes: any;
        dataValues: any;
        _creationAttributes: any;
        isNewRecord: boolean;
        sequelize: import("sequelize").Sequelize;
        _model: import("sequelize").Model<any, any>;
    }[]>;
    getUserDetailById(id: any): Promise<import("../entity/User").User>;
    getEvaluationByUserId(id: any, companyGroupCode: string): Promise<any>;
    searchListUserSettingEvaluator(query: any): Promise<any>;
    getListEvaluator(evaluationCreatorId: number | undefined, companyGroupCode: string): Promise<any>;
    updateSettingEvaluatorOfOneUser(query: any, companyGroupCode: string): Promise<any>;
    updateSettingEvaluatorListUser(query: any, companyGroupCode: string): Promise<any>;
    getToEmailList(type: EmailType, year: string, periodIndex: string, companyGroupCode: string, departmentId?: number): Promise<{
        toEmailList: any;
        content: string;
        title: string;
        template: {
            id: number;
            name: string;
            subject: string;
            content: string;
            note: string;
        };
    }>;
    getToEmailListFixed(type: EmailTypeFixed, periodId: string, companyGroupCode: string, evaluationId?: number): Promise<{
        content: string;
        title: string;
    }>;
    checkStatusRecordSend(rowData: any, type: EmailTypeFixed): Promise<{
        result: any[];
    }>;
    checkImportUser(query: any, companyGroupCode: string): Promise<any>;
    importUserProcedue(query: any, companyGroupCode: string, timeZone: string): Promise<boolean>;
    findListUserToSettingEvaluation(query: any): Promise<any>;
    addUserSettingEvaluationProcedure(query: any, companyGroupCode: string, timeZone: string, userId?: number): Promise<boolean>;
    deleteUserSettingEvaluator(params: any, companyGroupCode: string): Promise<any>;
    checkIsFixed(query: any, companyGroupCode: string): Promise<any>;
    getUsersEmailList(conditions: string, companyGroupCode: string): Promise<any>;
    importUserFromExcel(body: any): Promise<{
        listUserCanotImport: any[];
        listEvaluatorCannotSetting: unknown[];
    }>;
    handleReturnFlagSkillByLevel: (item: {
        flagSkill: number;
        level: number;
    }) => string;
    exportListUser(params: any): Promise<import("exceljs").Buffer>;
    listTemplateCreationGoal(query: any, id: number): Promise<any>;
    listUserTheSameInforWithEvaluator(query: any): Promise<any>;
    getAllSkill(companyGroupCode: string): Promise<any>;
    getAllSkillPublic(companyGroupCode: string): Promise<any>;
    undoException(data: any, req: any): Promise<any>;
}
