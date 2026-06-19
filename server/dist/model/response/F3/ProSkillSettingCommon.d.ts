export declare class ProskillChildren {
    key: any;
    id: number;
    itemId: string;
    jobType: string;
    smallClass: string;
    mediumClass: string;
    content: string;
    difficulty: number;
    note: string;
}
export declare class SettersAndApproversDto {
    key: any;
    setters: string[];
    approvers: string[];
}
export declare class VersionProSkillDetail {
    id: number;
    key: number;
    departmentCode: string;
    departmentName: string;
    version: string;
    versionSub: number;
    publicDate: Date;
    publicStatus: number;
    lastUpdatedTime: Date;
    updatedTime: Date;
    userUpdated: string;
    status: number;
    departmentId: number;
}
declare class ProFormula {
    id: number;
    versionId: number;
    point: number;
    note: string;
}
export declare class ListPoint {
    id: number;
    type: number;
    version: number;
    subVersion: string;
    status: number;
    creationUser: number;
    reason: string;
    basicMaxDifficulty: number;
    behaviorMaxWeight: number;
    publicDate: Date;
    lastUpdatedTime: Date;
    createTime: Date;
    updatedTime: Date;
    settingProFormula: ProFormula[];
}
export declare class VersionDto {
    id: number;
    department: string;
    userUpdated: string;
    updatedTime: Date;
    publicStatus: number;
    status: number;
    version: string;
    versionSub: number;
    publicDate: Date;
    reason: string;
}
export {};
