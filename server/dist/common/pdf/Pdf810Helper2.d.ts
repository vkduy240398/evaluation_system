import { Evaluation } from 'src/entity/Evaluation';
export declare class Pdf810Helper2 {
    static getHeaderDepartmentGoalTable(): {
        header: string;
        dataKey: string;
        styles: {
            valign: string;
            halign: string;
        };
    }[];
    static getDepartmentGoalTableData(evaluation: Evaluation): any;
}
