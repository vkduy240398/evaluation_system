export declare class UserSearchRequestDto {
    offset: any;
    limit: any;
    sortBy: any;
    sortType: any;
    role: string;
    department: string;
    division: string;
    company: string;
    nameAndEmail: string;
    skill: string;
    level: string;
}
export declare class DataAddUserOralce {
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
export declare class DataAddUserOracleDb {
    data: DataAddUserOralce;
}
export declare class FindUser {
    offset: string;
    limit: string;
    sortBy: string;
    sortType: string;
    nameAndEmail: string;
    department: string;
    role: string;
    division: string;
    current: string;
    search: string;
}
export declare class RequestDeleteUser {
    selectedRowKeys: number[];
}
export declare class RequestUpdatedUser {
    company: number;
    department: number;
    division: number;
    flagSkillValue: number;
    level: number;
    listId: number[];
    listUserSelecteds: [{}];
    radioLevelValue: number;
}
export declare class RequestFindSubDepartment {
    departmentCodeAndName: any;
    offset: any;
    limit: any;
    sortBy: any;
    sortType: any;
}
