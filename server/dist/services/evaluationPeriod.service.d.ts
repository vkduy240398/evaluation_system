import { EvaluationByPeriodType } from 'src/interfaces/service/evaluationPeriod.interface';
import { CustomLogger } from './logger.service';
export declare class EvaluationPeriodService {
    private logger;
    private evaluationPeriodRepo;
    private userRepo;
    private managementUserRepository;
    private evaluationRepository;
    private guideEvaluationRepository;
    private evaluatorRepository;
    private historyCronJobRepository;
    private settingLevelRepo;
    private adminEvaluationRepo;
    private deptSettingRepo;
    constructor(logger: CustomLogger);
    getNotificationPeriod(companyGroupCode: string, timeZone: string): Promise<any[]>;
    getEvaluationPeriod(timeZone: string): Promise<object[]>;
    getAllPeriod(companyGroupCode: string, timeZone: string): Promise<import("../entity/EvaluationPeriod").EvaluationPeriod[]>;
    getPeriodDetailByCondition(condition: any): Promise<import("../entity/EvaluationPeriod").EvaluationPeriod>;
    listPeriodByYear(yearStart: number, yearEnd: number, companyGroupCode: string): Promise<any[]>;
    savePeriod(condition: any, body: any): Promise<[affectedCount: number, affectedRows: import("../entity/EvaluationPeriod").EvaluationPeriod[]]>;
    getUserActiveByCondition(departmentId: number, companyId: number, periodId: number, searchInput: string, limit: number | undefined, offset: number | undefined): Promise<{
        dataList: {
            id: number;
            fullName: string;
            departmentName: string;
            companyName: string;
            key: string;
        }[];
        count: number;
    }>;
    getEvaluatorUser(evaluationCreatorId: number | undefined, companyGroupCode: string): Promise<{
        value: any;
        label: string;
    }[]>;
    getEvaluationByPeriod(userId: number, year: number, periodIndex: number, companyGroupCode: string): Promise<{
        period: {
            id: number;
            dateCreationGoalStart: string;
            dateCreationGoalEnd: string;
            dateEvaluationStart: string;
            dateEvaluationEnd: string;
            dateCreationGoalDepartmentStart: string;
            dateCreationGoalDepartmentEnd: string;
            dateEvaluationDepartmentStart: string;
            dateEvaluationDepartmentEnd: string;
        };
        evaluations: EvaluationByPeriodType[];
    }>;
    updateEvaluationPeriodException(evaluations: EvaluationByPeriodType[], userId: number, creationUser: number, deleteIds: number[], year: number, periodIndex: number, companyGroupCode: string): Promise<{
        resetEvaluationIds: number[];
        evaluator05ErrorIds: number[];
        evaluator10ErrorIds: number[];
        evaluatorErrorNames: string[];
        evaluationNewIds: number[];
    }>;
    getUserPeriodException(year: number, periodIndex: number, listUserId: number[], timeZone: string): Promise<{
        dataList: {
            childrens: {
                isEdit: boolean;
                id: number;
                userEmail: string;
                key: string;
                companyName: string;
                departmentName: string;
                divisionName: string;
                periodStart: string;
                periodEnd: string;
                percentPoint: number;
                level: number;
                dateCreationGoalStart: string;
                dateCreationGoalEnd: string;
                dateEvaluationStart: string;
                dateEvaluationEnd: string;
                year: string;
                periodIndex: number;
                evaluator05: any;
                evaluator05Email: any;
                evaluator10: any;
                evaluator10Email: any;
                evaluator20: any;
                evaluator20Email: any;
                isDisable: boolean;
                createdByCronjob: number;
                flagSkill: number;
                skillUser: import("../entity/SkillUser").SkillUser[];
            }[];
            key: string;
            isEdit: boolean;
            isColSpan: boolean;
            companyName: string;
            userId: number;
            fullName: string;
            email: string;
            departmentName: string;
            companyName2: string;
        }[];
    }>;
    getDetailEvaluationPeriodForMail(condition: any): Promise<import("../entity/EvaluationPeriod").EvaluationPeriod[]>;
    fixEmergencyPeriod810(params: {
        [x: string]: any;
    }): Promise<void>;
    getAllPeriodNotFixedGoalPeriod(day: number, companyGroupCode: string): Promise<any>;
    getAllPeriodNotFixedEvalPeriod(day: number, companyGroupCode: string): Promise<any>;
    getEvaluationPeriodCurrent(companyGroupCode: string, timeZone: string): Promise<{
        datePersonal: string;
        dateDepartment: string;
        year: string;
        periodIndex: number;
    }>;
}
