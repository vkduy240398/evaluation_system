declare class DepartmentDto {
    divisionId: number;
    code: string;
    name: string;
    codeName: string;
}
export declare class GetAllDivisionDepartmentDto extends DepartmentDto {
    childrens: DepartmentDto[];
}
export {};
