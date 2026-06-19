import { RowInput } from 'jspdf-autotable';
import { Evaluation } from 'src/entity/Evaluation';
import { Evaluator } from 'src/entity/Evaluator';
import { EvaluationDetail17Type } from 'src/interfaces/service/pdfService.interface';
export declare class Pdf17Helper {
    static getHeaderSummaryTable(): import("jspdf-autotable").CellInput[];
    static getSummaryData(evaluation: Evaluation): RowInput[];
    static getHeaderBasicTable(exist05: boolean): string[];
    static getBasicTableData(evaluation: Evaluation, type: number, exist05: any): RowInput[];
    static getProTableData(evaluation: Evaluation, exist05: boolean): RowInput[];
    static getHeaderGoalTable(exist05: boolean): string[];
    static getGoalTableData(evaluation: Evaluation, exist05: boolean): RowInput[];
    static getColumnTypeTotalPointGoalTable(exist05: boolean): {
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
        5: {
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
        4: {
            cellWidth: number;
        };
        5?: undefined;
    };
    static getTotalPointGoalTableData(evaluation: Evaluation, exist05: boolean): import("jspdf-autotable").CellInput[][];
    static getHeaderAchievementTable(exist05: boolean): string[];
    static getAchievementTableData(evaluation: Evaluation, exist05: boolean): RowInput[];
    static getColumnTypeTotalPointAchievementTable(exist05: boolean): {
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
        5: {
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
        4: {
            cellWidth: number;
        };
        5?: undefined;
    };
    static getTotalPointAchievementTableData(evaluation: Evaluation, exist05: boolean): import("jspdf-autotable").CellInput[][];
    static getHeaderAdditionalTable(exist05: boolean): string[];
    static getAdditionalTableData(evaluation: Evaluation, exist05: boolean): RowInput[];
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
    static getEvaluatorByOrder(evaluators: Evaluator[], order: string): Evaluator;
    static getHeaderSummaryPeriodTable(): import("jspdf-autotable").CellInput[];
    static getSummaryPeriodTableData(evaluations: EvaluationDetail17Type[]): any[];
}
