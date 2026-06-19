import { DepartmentRoleDto } from './DepartmentRoleDto';
export declare class DepartmentDto {
    id: number;
    code: string;
    name: string;
    class: number;
    type: number;
    active: number;
    setting: number;
    divisionId: number;
    groupId: number;
    createdTime: String;
    updatedTime: String;
    departmentRoles: DepartmentRoleDto[];
    divisionSubclass: any[];
    departmentSubClasses: any;
    versionProSkill: any[];
    groups: any[];
    departments: any[];
}
