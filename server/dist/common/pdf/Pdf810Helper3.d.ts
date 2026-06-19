import { RowInput } from 'jspdf-autotable';
import { Evaluation } from 'src/entity/Evaluation';
import { Evaluator } from 'src/entity/Evaluator';
export declare class Pdf810Helper3 {
    static getHeaderSummaryTable(): RowInput[];
    static getSummaryTableData(evaluation: Evaluation): RowInput[];
    static getHeaderDepartmentGoalTable(status: number): {
        header: string;
        dataKey: string;
        styles: {
            valign: string;
            halign: string;
        };
    }[];
    static getDepartmentGoalTableData(evaluationAchievementPersonal: any): any;
    static getSubListData(evaluationAchievementPersonal: any, subList: any): any;
    static getHeaderDepartmentAchievementTable(): {
        header: string;
        dataKey: string;
        styles: {
            valign: string;
            halign: string;
        };
    }[];
    static getDepartmentAchievementTableData(evaluation: Evaluation): {
        achievementStatus: string;
        reasonComment: string;
        actionPlan: string;
        pointUser: number;
        coefficientUser: number;
        pointEvaluator05: number;
        coefficientEvaluator05: number;
        pointEvaluator1: number;
        coefficientEvaluator1: number;
        pointEvaluator2: number;
        coefficientEvaluator2: number;
    }[];
    static getHeaderAdditionalTable(): {
        header: string;
        dataKey: string;
        styles: {
            valign: string;
            halign: string;
        };
    }[];
    static getAdditionalTableData(evaluation: Evaluation): any[];
    static getEvaluatorByOrder(evaluators: Evaluator[], order: string): Evaluator;
}
