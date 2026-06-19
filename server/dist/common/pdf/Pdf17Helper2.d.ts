import { RowInput } from 'jspdf-autotable';
import { Evaluation } from 'src/entity/Evaluation';
import { Evaluator } from 'src/entity/Evaluator';
export declare class Pdf17Helper2 {
    static getHeaderSummaryTable(): import("jspdf-autotable").CellInput[];
    static getSummaryData(evaluation: Evaluation): RowInput[];
    static getHeaderBasicTable(): import("jspdf-autotable").CellInput[];
    static getBasicTableData(evaluation: Evaluation, type: number): RowInput[];
    static getProTableData(evaluation: Evaluation): RowInput[];
    static getHeaderGoalTable(): import("jspdf-autotable").CellInput[];
    static getGoalTableData(evaluation: Evaluation): RowInput[];
    static getHeaderAchievementTable(): import("jspdf-autotable").CellInput[];
    static getAchievementTableData(evaluation: Evaluation): RowInput[];
    static getEvaluatorByOrder(evaluators: Evaluator[], order: string): Evaluator;
}
