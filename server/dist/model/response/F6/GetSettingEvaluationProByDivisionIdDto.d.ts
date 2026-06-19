declare class Department {
    typeD: number;
    id: number;
    departmentName: string;
    departmentId: number;
    type: string;
    key: string;
    isCheckedDep: boolean;
    isCheckedDiv: boolean;
    isCheckedGroup: boolean;
    groups: any[];
}
export declare class GetSettingEvaluationProByDivisionIdDto {
    dataList: Department[];
    count: number;
}
export {};
