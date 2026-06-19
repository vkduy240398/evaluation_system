import { ColumnInput } from 'jspdf-autotable';
import { UserEvaluationBasicBehaviorType } from 'src/interfaces/user.interfaces';
export declare class BasicTablePdfBusiness {
    static column(isDisplayEvaluator2: boolean): ColumnInput[];
    static dataSources(data: UserEvaluationBasicBehaviorType[], status: number): any[];
    static dataSourcesBasicBehavior(data: UserEvaluationBasicBehaviorType[], status: number): any[];
}
