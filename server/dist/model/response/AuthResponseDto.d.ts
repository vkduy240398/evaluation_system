declare class RoleDto {
    name: string;
}
export declare class UserResponseDto {
    userId: number;
    email: string;
    fullName: string;
    employeeNumber: string;
    active: number;
    roles: RoleDto[];
    departmentId: number;
    departmentName: string;
    companyId: number;
    companyName: string;
    level: number;
    emailHR: string;
}
export declare class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: UserResponseDto;
}
export {};
