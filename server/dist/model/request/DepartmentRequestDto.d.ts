export declare class DepartmentRequestDto {
    code: string;
    name: string;
    class: number;
    type: number;
    active: number;
    division: number;
}
export declare class DepartmentRequestAdd {
    code: string;
    name: string;
    class: number;
    type: number;
    active: number;
    division: number;
}
export declare class DivisionSubclassRequestDTO {
    divisionId: number;
    departmentId: number;
}
export declare class DepartmentUpdateRequestDto {
    code: string;
    name: string;
    oldCode: string;
    oldName: string;
    updatedTime: string;
    divisionId: any;
    divisionOldId: any;
    radioPeriod?: number;
}
export declare class DepartmentSearchRequestDto {
    catergory: string;
    classification: string;
    departmentCodeAndName: string;
    offset: any;
    limit: any;
    sortBy: any;
    sortType: any;
}
export declare class RequestEditDepartmentGnw {
    code: string;
    divisionId: number;
    divisionOldId: number;
    name: string;
    oldCode: string;
    oldName: string;
    updatedTime: string;
    uptDepName: number;
}
export declare class DeleteDepartment {
    updatedTime: string;
}
