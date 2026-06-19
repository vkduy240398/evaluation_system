import { UserDto } from '../generic/UserDto';
export declare class EvaluatorResponseDto {
    id: number;
    user: UserDto;
}
export declare class EvaluatorListResponseDto {
    counts: number;
    data: any;
}
export declare class Approve17ResponseDto {
    statusNumber: number;
    updateTime: string;
}
export declare class Reject17ResponseDto {
    statusNumber: number;
    updateTime: string;
}
export declare class ProSkillApprovalHistoryResponseDto {
    info: any;
    approvalHistories: any;
}
export declare class DetailPublicProSkillResponseDto {
    children: any;
    department: string;
    departmentType: number;
    group: number;
    id: number;
    lastUpdatedTime: string;
    publicDate: string;
    publicStatus: number;
    reason: string;
    settersAndApprovers: any;
    status: number;
    updatedTime: string;
    userUpdated: string;
    version: string;
    versionMain: number;
    versionSub: number;
}
export declare class PublicProSkillListResponseDto {
    total: number;
    data: any;
}
export declare class Evaluation17SkillResponseDto {
    flagSkill: any;
}
export declare class Evaluation17DetailResponseDto {
    statusNumber: number;
    updateTime: string;
}
export declare class Evaluation17AchievementResponseDto {
    data: any;
}
export declare class Evaluation17AdditionalAchievementResponseDto {
    data: any;
}
