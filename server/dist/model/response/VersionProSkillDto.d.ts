export declare class VersionProSkillDto {
    id: number;
    version: string;
    versionMain: number;
    versionSub: number;
    department: string;
    skill: string;
    division: string;
    listDepartment: string;
    departmentType: number;
    status: number;
    userUpdated: string;
    reason: string;
    publicStatus: number;
    publicDate: string;
    settersAndApprovers: {
        setters: string[];
        approvers: string[];
    };
    lastUpdatedTime: string;
    updatedTime: Date;
    children: any[];
}
export declare class ListVersionPublicDto {
    counts: number;
    data: {
        creationUser: number;
        department: {
            id: number;
            code: string;
            name: string;
            type: number;
        };
        departmentId: number;
        id: number;
        lastUpdatedTime: string;
        publicDate: string;
        publicStatus: number;
        status: number;
        subVersion: number;
        user: {
            id: number;
            employeeNumber: string;
            fullName: string;
        };
        version: number;
    }[];
}
export declare class DetailProSkillApproved {
    children: {
        content: string;
        difficulty: Number;
        itemId: string;
        jobType: string;
        mediumClass: string;
        note: string;
        smallClass: string;
        versionId: Number;
    };
    department: string;
    departmentActive: Number;
    lastUpdatedTime: string;
    listSettersAndApprovers: {
        setters: string[];
        approvers: string[];
    };
    publicDate: string;
    publicStatus: Number;
    reason: string;
    status: Number;
    updated: string;
    userUpdated: string;
    version: string;
    versionId: Number;
    versionMain: Number;
    versionSub: Number;
}
export declare class ResultsApproved {
    result: string;
}
export declare class VersionProSkillDepartment {
    data: {
        department: {
            id: number;
            code: string;
            name: string;
        };
        id: number;
        lastUpdatedTime: string;
        publicDate: string;
        publicStatus: number;
        status: number;
        subVersion: number;
        updatedTime: string;
        user: {
            fullName: string;
        };
        version: number;
    }[];
    total: Number;
}
export declare class ResultsHistoryApproved {
    approvalHistories: {
        approverUser: {
            id: number;
            fullName: string;
        };
        comment: string | null;
        createdTime: string;
        status: string;
    }[];
    info: {
        department: string;
        version: string;
    };
}
