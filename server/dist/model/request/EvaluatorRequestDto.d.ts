import { StatusRejectType, TypeApprovedStatus } from 'src/interfaces/evaluator.interfaces';
export declare class EvaluatorSearchDto {
    offset: number;
    limit: number;
    sortBy: string;
    sortType: string;
    email: string;
    department: string;
    evaluator: string;
    yearDisplayCalendar: string;
    salaryRank: string;
    periodEvaluate: string;
    stringStatus: string;
    sortColumns: string[];
    sortDirections: string[];
    departmentSearch: {
        name: string;
        type: number;
    };
    divisionSearch: {
        name: string;
        type: number;
    };
}
export declare class EvaluatorApproveStatusDto {
    comment: string;
    type: TypeApprovedStatus;
    statusReject: StatusRejectType;
    updateTime: any;
}
export declare class GetListDepartmentExportEvaluationHistoryDto {
    yearEvaluate: string;
    periodEvaluate: string;
}
export declare class ExportHistoryEvaluationEvaluatorDto {
    fullName: string;
    department: string[];
    yearStart: string;
    yearEnd: string;
    periodEvaluate: string;
    yearEvaluate: string;
}
