import { CustomLogger } from './logger.service';
interface EvaluationAuto {
    id: number;
    status: number;
    level: number;
    creation_user: number;
    user_email: string;
    year: string;
    period_index: number;
    evaluator_05_email: string;
    evaluator_1_email: string;
    evaluator_2_email: string;
}
export declare class CronJobServices {
    private logger;
    private historyCronJobRepository;
    private evaluationPeriodRepo;
    private userRepo;
    private evaluatorRepository;
    private mailService;
    private mailSettingRepository;
    private evaluationRepository;
    private evaluationServices;
    private evaluationPeriodService;
    private companyGroupService;
    private versionSettingRepository;
    private guideEvaluationRepository;
    private proSkillRepository;
    constructor(logger: CustomLogger);
    triggerNotifications(): Promise<void>;
    processCompanyGroupSettingGoals(group: any): Promise<void>;
    addCronJobSettingDepartmentGoals(name: string, title: string, year: string, start: string, end: string, periodIndex: number, companyGroupCode: string, timezone: string): Promise<boolean>;
    addCronJobSettingPersonalGoals(name: string, title: string, year: string, start: string, end: string, periodIndex: number, companyGroupCode: string, timezone: string): Promise<boolean>;
    processCompanyGroupSendMail(group: any): Promise<void>;
    addCronJobSettingSendMailCreation(name: string, periodIndex: number, year: string, dateSendMail: string, type: number, companyGroupCode: string, timezone: string): Promise<void>;
    addCronJobSettingSendMailEvaluation(name: string, periodIndex: number, year: string, dateSendMail: string, type: number, companyGroupCode: string, timezone: string): Promise<void>;
    addCronJobExeptionsCreationByUser(name: string, dateSendMail: string, type: number, companyGroupCode: string, timezone: string): Promise<void>;
    getDayStrSendMail(day: number): string;
    getListEmailFromEvaluation(listEvaluation: EvaluationAuto[]): any[];
    handleCronJobSendMailRemindEvaluation(): Promise<void>;
    sendMailRemindGoalPeriod(day: number, dateEndStr: string, companyGroupCode: string, emailHR: string): Promise<void>;
    sendMailRemindEvalPeriod(day: number, dateEndStr: string, companyGroupCode: string, emailHR: string): Promise<void>;
}
export {};
