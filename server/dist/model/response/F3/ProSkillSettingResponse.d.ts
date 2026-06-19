import { ListPoint, ProskillChildren, SettersAndApproversDto, VersionDto, VersionProSkillDetail } from './ProSkillSettingCommon';
export declare class DetailProSkillResponse {
    departmentActive: number;
    versionId: number;
    department: string;
    userUpdated: string;
    updated: Date;
    publicStatus: number;
    status: number;
    version: string;
    publicDate: Date;
    reason: string;
    versionMain: number;
    versionSub: number;
    lastUpdatedTime: Date;
    children: ProskillChildren[];
    settersAndApprovers: SettersAndApproversDto;
    editAlready: boolean;
}
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
    createdTime: Date;
    updatedTime: Date;
}
export declare class VersionProSkillResponse {
    data: VersionProSkillDetail[];
    counts: number;
}
declare class CreationUser {
    fullName: string;
    id: number;
}
export declare class ProSkillSaveDrafReponse {
    code: number;
    id: number;
    updated: Date;
    status: number;
    publicStatus: number;
    departmentId: number;
    version: string;
    subVersion: number;
    fullName: string;
    reason: string;
    departmentActive: number;
    departmentName: string;
    creationUser: CreationUser;
    lastUpdatedTime: Date;
    listDepartment: string;
}
declare class Department {
    id: number;
    code: number;
    name: string;
}
declare class VersionProSkillDepartment {
    id: number;
    version: number;
    subVersion: number;
    status: number;
    publicStatus: number;
    publicDate: Date;
    updateDate: Date;
    lastUpdatedTime: Date;
    department: Department;
    user: object;
}
export declare class VersionProSkillDepartmentResponse {
    data: VersionProSkillDepartment[];
    total: number;
}
export declare class VersionSubmitResponse {
    id: number;
    code: number;
    updatedTime: Date;
    status: number;
    publicStatus: number;
    departmentId: number;
    version: number;
    subVersion: number;
    reason: string;
    departmentActive: number;
    lastUpdatedTime: Date;
    departmentName: string;
}
export declare class VersionCancelResponse {
    code: number;
    id: string;
}
declare class ApprovalHistories {
    approverUser: Object;
    createdTime: Date;
    comment: string;
    status: string;
}
declare class Infor {
    version: number;
    department: string;
}
export declare class HistoryApproveResponse {
    infor: Infor;
    approvalHistories: ApprovalHistories;
}
export declare class InitialVersionResponse {
    code: number;
    fullName: string;
    departmentId: string;
    creationUser: object;
}
export declare class ListPointResponse {
    code: number;
    listPoint: ListPoint;
    settersAndApprovers: SettersAndApproversDto;
    department: string;
    listDepartment: string;
}
export declare class PermissionResponse {
    status: number;
}
export declare class VersionPublicResponse {
    versionId: number;
    departmentId: number;
    departmentName: string;
    updatedTime: Date;
    publicStatus: number;
    status: number;
    version: string;
    publicDate: Date;
    reason: string;
    versionMain: number;
    versionSub: number;
    creationUser: Object;
    lastUpdatedTime: Date;
    children: ProskillChildren[];
}
export declare class ProSkillEditResponse {
    data: VersionPublicResponse;
    settersAndApprovers: SettersAndApproversDto;
    subVersion: number;
    listPoint: ListPoint;
    lengths: number;
    editAlready: boolean;
}
export declare class DetailProSkillPublicResponse extends VersionDto {
    group: string;
    departmentType: number;
    versionMain: number;
    lastUpdatedTime: number;
    children: ProskillChildren[];
    settersAndApprovers: SettersAndApproversDto;
}
export {};
