import { Evaluation } from 'src/entity/Evaluation';
import { AdditionData, CommentContent, EvaluatorInfo, RequestDataSave, Total } from 'src/interfaces/service/evaluation.service.interface';
import { CustomLogger } from './logger.service';
import { EvaluationAdditionalAchievementNew, EvaluationPersonalAchievementNew, UserEvaluationBasicBehaviorType, UserEvaluationToProSkillType } from 'src/interfaces/user.interfaces';
export declare class EvaluationService {
    private logger;
    private evaluationRepo;
    private proSkillRepository;
    private mailService;
    private proSkillSettingRepository;
    private evaluationPeriodRepo;
    private divisionSubClassRepository;
    private evaluationApprovalHistory;
    private summaryDepartmentRepository;
    private userRepo;
    private evaluatorRepository;
    constructor(logger: CustomLogger);
    findOne(id: number, userId: number, role: string, companyGroupCode: string): Promise<string>;
    createOrUpdateEvaluation(dataSource: RequestDataSave[], additionData: AdditionData[], commentData: CommentContent, evaluationId: number, status: number, isDraft: boolean, listEvalutor: EvaluatorInfo[], total: Total, updatedTime: string, checkList: EvaluatorInfo[], host: string, listBehaviors: UserEvaluationBasicBehaviorType[], listPersonalGoals: EvaluationPersonalAchievementNew[], achievementPersonals: EvaluationAdditionalAchievementNew[], listProSkills?: UserEvaluationToProSkillType[], timeZone?: string, userId?: string): Promise<Evaluation>;
    getGuideEvaluationByEvaluationId(id: number): Promise<Evaluation>;
    approveEvaluation(evaluationId: number, status: number, listEvalutor: EvaluatorInfo[], maxOrder: string, content: string, approverId: number, updatedTime: string, host: string, companyGroupCode: string, timeZone: string): Promise<number>;
    rejectEvaluation(evaluationId: number, status: number, selectedOrder: string, content: string, approverId: number, ownerId: number, listEvalutor: EvaluatorInfo[], updatedTime: string, maxOrder: string, host: string, companyGroupCode: string, timeZone: string): Promise<number>;
    findListEvaluationItemHistory(query: any): Promise<{
        data: import("../entity/VersionProSkill").VersionProSkill[];
        counts: number;
    }>;
    detailProSkillById(id: number): Promise<any>;
    publicVersionService(id: number, body: any, userId: number, _hostname: string, _fullName: string, companyGroupCode: string, timeZone: string): Promise<{
        code: number;
        isDuringGoalSetting: true;
        goalSettingStart: string;
        goalSettingEnd: string;
        evaluationStart: string;
        evaluationEnd: string;
        updatedTime?: undefined;
        version?: undefined;
        publicDate?: undefined;
        publicStatus?: undefined;
        versionMain?: undefined;
        subVersion?: undefined;
        status?: undefined;
        id?: undefined;
    } | {
        updatedTime: Date;
        version: string;
        publicDate: string;
        publicStatus: number;
        versionMain: number;
        subVersion: number;
        status: number;
        id: number;
        code?: undefined;
        isDuringGoalSetting?: undefined;
        goalSettingStart?: undefined;
        goalSettingEnd?: undefined;
        evaluationStart?: undefined;
        evaluationEnd?: undefined;
    }>;
    rejectVersionService(id: number, body: any, userId: number, hostname: string, companyGroupCode: string, timeZone: string): Promise<import("../entity/VersionProSkill").VersionProSkill>;
    checkPermission(evaluationId: number, userId: number): Promise<boolean>;
    checkEvaluatorPermission(evaluationId: number, userId: number): Promise<any[]>;
    sendMailFixedGoal(data: any, companyGroupCode: string, timeZone: string, emailHR: string): Promise<any>;
    sendMaiNotFixed(data: {
        listEvaluation: {
            id: number;
            status: number;
            level: number;
            division_name: string;
            creation_user: number;
            user_email: string;
            user_full_name: string;
            year: string;
            period_index: number;
            evaluator_05_email: string;
            evaluator_05_full_name: string;
            evaluator_1_email: string;
            evaluator_1_full_name: string;
            evaluator_2_email: string;
            evaluator_2_full_name: string;
        }[];
        toEmails: string[];
        title: string;
        content: string;
        evaluationPeriodId: number;
        emailType: number;
        type: string;
        companyGroupCode: string;
    }, emailHR: string): Promise<{
        message: string;
    }>;
    getRejectComment(versionId: number): Promise<import("../entity/HistoryApproveProSkill").HistoryApproveProSkill>;
    getEvalNotFixedGoalPeriod(year: string, period_index: number, day: number, companyGroupCode: string): Promise<any>;
    getEvalNotFixedEvalPeriod(year: string, period_index: number, day: number, companyGroupCode: string): Promise<any>;
    getAllDepartmentEvaluation(query: {
        year: number;
        periodIndex: number;
    }, companyGroupCode: string): Promise<any>;
    getAllDepartmentEvaluationDefault(query: {
        year: number;
        periodIndex: number;
    }, companyGroupCode: string): Promise<any>;
    getDetailProfessionalExpertise(userId: number, yearStart: string, yearEnd: string, companyGroupCode: string, evaluatorId: number): Promise<{
        results: any;
    }>;
    goalsPastEvaluation(type: number, year: number, periodIndex: number, userId: number, evaluationPeriodId: number): Promise<object[]>;
}
