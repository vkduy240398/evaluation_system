export declare class DepartmentDto {
    id?: number;
    code?: string;
    name?: string;
}
export declare class GetDepartmentApproved {
    active: number;
    class: number;
    code: string;
    createdTime: string;
    divisionId: number | null;
    groupId: number | null;
    id: number;
    name: string;
    setting: number;
    type: number;
    updatedTime: string;
}
export declare class ListDepartment {
    counts: number;
    data: {
        active: number;
        class: number;
        code: string;
        createdTime: string;
        divisionId: number | null;
        divisionSubclass: [
            {
                department: {
                    active: number;
                    class: number;
                    code: string;
                    createdTime: string;
                    divisionId: number | null;
                    groupId: number | null;
                    id: number;
                    name: string;
                    setting: number;
                    type: number;
                    updatedTime: string;
                };
                departmentId: number;
                division: {
                    active: number;
                    class: number;
                    code: string;
                    createdTime: string;
                    divisionId: number | null;
                    groupId: number | null;
                    id: number;
                    name: string;
                    setting: number;
                    type: number;
                    updatedTime: string;
                };
                divisionId: number;
                id: number;
            }
        ];
        groupId: number | null;
        id: number;
        name: string;
        setting: number;
        type: number;
        updatedTime: string;
    }[];
    fullData: {
        active: number;
        class: number;
        code: string;
        createdTime: string;
        divisionId: number | null;
        groupId: number | null;
        id: number;
        name: string;
        setting: number;
        type: number;
        updatedTime: string;
    }[];
}
export declare class GetDepartmentGnw {
    active: number;
    class: number;
    code: string;
    createdTime: string;
    divisionId: number | null;
    groupId: number | null;
    id: number;
    name: string;
    setting: number | null;
    type: number;
    updatedTime: string;
}
export declare class GetListDepartment {
    active: number;
    class: number;
    code: string;
    createdTime: string;
    divisionId: number | null;
    groupId: number | null;
    id: number;
    name: string;
    setting: number | null;
    type: number;
    updatedTime: string;
}
export declare class ResultsAddDepartment {
    active: number;
    class: number;
    code: string;
    createdTime: string;
    divisionId: number | null;
    groupId: number | null;
    id: number | null;
    name: string;
    setting: number | null;
    type: number;
    updatedTime: string;
}
export declare class ListDepartmentOracle {
    departmentId: number;
    departmentName: string;
}
export declare class ListDepartmentOracleMerge {
    code: string;
    id: string;
    name: string;
}
export declare class ListDepartmentSub {
    active: number;
    class: number;
    code: string;
    createdTime: string;
    divisionId: number | null;
    groupId: number | null;
    id: number;
    name: string;
    setting: number | null;
    type: number;
    updatedTime: string;
}
export declare class SelectedDivision {
    code: string;
    id: number;
    name: string;
}
export declare class ResponseFindSubDepartment {
    counts: number;
    data: ListDepartmentSub;
    fullData: ListDepartmentSub;
    selectedDivision: SelectedDivision;
}
