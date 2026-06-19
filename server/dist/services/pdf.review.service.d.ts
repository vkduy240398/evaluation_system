import { EvaluationDetail17Type, HeaderPdfType } from 'src/interfaces/service/pdfService.interface';
import { UserEvaluationBasicBehaviorType } from 'src/interfaces/user.interfaces';
export declare class PdfReviewService {
    constructor();
    exportEvaluationDetailForPdfReview17(evaluation: EvaluationDetail17Type, isF5: boolean | undefined): {
        dataReview: any[];
        fileName: string;
    };
    exportEvaluationDetailForPdfReview810(evaluation: any, isF5: boolean | undefined): Promise<{
        dataReview: any[];
        fileName: string;
    }>;
    getDataTotal810(evaluation: any, isDisplayEvaluator05: boolean, isDisplayEvaluator1: boolean, isDisplayEvaluator2: boolean): any[];
    departmentTargetTable(titleTale: any, data: any, subList: any): {
        titleTable: any;
        dataSource: any;
    };
    departmentAchievementtable(titleTale: any, data: any): {
        titleTable: any;
        dataSource: any;
    };
    additionalTable(titleTale: any, data: any): {
        titleTable: any;
        dataSource: any;
    };
    private dataReportReview810;
    headerPdf(userInfo: HeaderPdfType): {
        logo: string;
        titleHeader: string;
        fullName: string;
        employeeNumber: string;
        companyName: string;
        department: string;
        evaluator: string;
        periodTime: string;
        level: string | number;
    };
    totalTable(evaluation: EvaluationDetail17Type, isDisplayEvaluator05: boolean, isDisplayEvaluator1: boolean, isDisplayEvaluator2: boolean): {
        dataSource: any[];
    };
    basicBehaviorSkillTable(titleTable: string, data: UserEvaluationBasicBehaviorType[], status: number): {
        titleTable: string;
        dataSource: any[];
    };
    proSkillTable(titleTable: string, data: any[], status: number): {
        titleTable: string;
        dataSource: any[];
    };
    achievementPersonalMainTable(titleTable: string, data: any): {
        titleTable: string;
        dataSource: any;
    };
    achievementPersonalSubTable(titleTable: string, data: any[]): {
        titleTable: string;
        dataSource: any[];
    };
    achievementAdditionalTable(titleTable: string, data: any[]): any;
    dataReportReview17(evaluation: EvaluationDetail17Type, isF5: boolean | undefined): any[];
    headerSummaryPdf(userInfo: HeaderPdfType): {
        logo: string;
        titleHeader: string;
        fullName: string;
        employeeNumber: string;
        level: string | number;
    };
    dataSummary17(evaluations: EvaluationDetail17Type[]): any[];
    dataSummary810(evaluations: any): any[];
    private getSummaryPeriodTable;
    private getSummaryPeriodTable810;
    exportListEvaluationPdf17(evaluations: EvaluationDetail17Type[], isF5: boolean | undefined): Promise<{
        dataReview: any[];
        fileName: string;
        summaryData: {
            header: {
                logo: string;
                titleHeader: string;
                fullName: string;
                employeeNumber: string;
                level: string | number;
            };
            dataSource: any[];
        };
        sameLevel: string;
        multiLevel: boolean;
    }>;
    private getSummaryPeriodTable810te;
    exportListEvaluationPdf810(evaluations: any, isF5: boolean | undefined): Promise<{
        dataReview: any[];
        fileName: string;
        summaryData: {
            header: {
                logo: string;
                titleHeader: string;
                fullName: string;
                employeeNumber: string;
                level: string | number;
            };
            dataSource: any[];
        };
        sameLevel: string;
        multiLevel: boolean;
    }>;
    exportPDFMultiLevel(evaluations: any, isF5: boolean | undefined): Promise<{
        dataReview: any[];
        fileName: string;
        sameLevel: string;
        multiLevel: boolean;
    }>;
}
