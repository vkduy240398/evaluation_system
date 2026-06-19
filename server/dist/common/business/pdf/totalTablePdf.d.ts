import { ColumnInput } from 'jspdf-autotable';
import { EvaluationDetail17Type } from 'src/interfaces/service/pdfService.interface';
export declare class TotalTablePdfBusiness {
    static columnTotalTable(haveSkill: boolean): ColumnInput[];
    static dataSourceTotalTable(data: EvaluationDetail17Type, isDisplayEvaluator05: boolean, isDisplayEvaluator1: boolean, isDisplayEvaluator2: boolean): any[];
}
