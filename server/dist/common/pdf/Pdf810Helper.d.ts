import { RowInput } from 'jspdf-autotable';
import { Evaluation } from 'src/entity/Evaluation';
import { Evaluator } from 'src/entity/Evaluator';
export declare class Pdf810Helper {
    static getHeaderSummaryTable(): RowInput[];
    static getSummaryTableData(evaluation: Evaluation, exist05: boolean, exist1: boolean, exist2: boolean): RowInput[];
    static getHeaderDepartmentGoalTable(exist05: boolean, exist1: boolean, exist2: boolean): ({
        header: string;
        dataKey: string;
        styles: {
            valign: string;
            halign: string;
            align?: undefined;
        };
    } | {
        header: string;
        dataKey: string;
        styles: {
            align: string;
            valign?: undefined;
            halign?: undefined;
        };
    })[];
    static getDepartmentGoalTableData(evaluation: Evaluation): any;
    static getHeaderDepartmentAchievementTable(exist05: boolean, exist1: boolean, exist2: boolean): {
        header: string;
        dataKey: string;
        styles: {
            valign: string;
            halign: string;
        };
    }[];
    static getDepartmentAchievementTableData(evaluation: Evaluation): any;
    static getHeaderAdditionalTable(exist05: boolean, exist1: boolean, exist2: boolean): {
        header: string;
        dataKey: string;
        styles: {
            valign: string;
            halign: string;
        };
    }[];
    static getAdditionalTableData(evaluation: Evaluation): any[];
    static getColumnTypeTotalPointAdditionalTable(exist05: boolean): {
        0: {
            cellWidth: number;
        };
        1: {
            cellWidth: number;
        };
        2: {
            cellWidth: number;
        };
        3: {
            cellWidth: number;
        };
        4: {
            cellWidth: number;
        };
    } | {
        0: {
            cellWidth: number;
        };
        1: {
            cellWidth: number;
        };
        2: {
            cellWidth: number;
        };
        3: {
            cellWidth: number;
        };
        4?: undefined;
    };
    static getTotalPointAdditionalTableData(evaluation: Evaluation, exist05: boolean): import("jspdf-autotable").CellInput[][];
    static getSummaryPeriodTableData(evaluations: Evaluation[]): any[];
    static getEvaluatorByOrder(evaluators: Evaluator[], order: string): Evaluator;
    static get2WithoutRound(num: number): number;
}
