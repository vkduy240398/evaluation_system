export declare class GetUserDataOracleDb {
    company: string;
    companyId: string;
    department: string;
    departmentId: string;
    email: string;
    employeeNumber: string;
    fullName: string;
    key: string;
    username: string;
}
export declare class ResultsAddUserOracle {
    message: string;
}
export declare class Company {
    id: number;
    name: string;
}
export declare class Department {
    id: number;
    code: string;
    name: string;
}
export declare class Division {
    id: number;
    code: string;
    name: string;
}
export declare class Roles {
    id: number;
    name: string;
}
export declare class RolesCondition {
    id: number;
    name: string;
}
export declare class ListUsers {
    company: Company;
    department: Department;
    division: Division;
    email: string;
    employeeNumber: string;
    flagSkill: number;
    fullName: string;
    id: number;
    level: number;
    roles: Roles;
    rolesCondition: RolesCondition;
}
export declare class FindUser {
    counts: number;
    data: ListUsers;
}
export declare class ResponseUpdatedUser {
    companyName: number;
    departmentName: number;
    divisionName: number;
    level: number;
    userIdResetDatas: number[];
}
export declare class ResponseDetailUser {
    company: Company;
    companyId: number;
    department: Department;
    departmentId: number | null;
    division: Division;
    divisionId: number | null;
    email: string;
    employeeNumber: string;
    flagSkill: number;
    fullName: string;
    id: number;
    level: number | null;
    roles: Roles;
    updatedTime: number;
}
export declare class CompanyResponse {
    conpanyId: string;
    companyName: string;
}
