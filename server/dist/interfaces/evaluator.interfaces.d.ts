export declare class EvaluatorSearchInterfaces {
    email: string;
    salaryRank: any[];
    title: string;
    evaluators: any[];
    evaluatorId: number;
    offset: number;
    limit: number;
    sortBy: string;
    sortType: string;
    status: any[];
    sortColumns: string[];
    sortDirections: string[];
    companyGroupCode: string | null;
    department: {
        name: string;
        type: number;
    };
    division: {
        name: string;
        type: number;
    };
}
export type ReceiverOrderType = 0 | 0.5 | 1 | 2 | number;
export type TypeApprovedStatus = 0 | 1;
export type StatusRejectType = '2' | '4' | '6' | '8' | '52' | '55' | '58' | '61';
