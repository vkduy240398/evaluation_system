import { AdditionData, CommentContent, EvaluatorInfo, RequestDataSave, Total } from 'src/interfaces/service/evaluation.service.interface';
import { AchievementType, BasicBehaviorType, EvaluationAdditionalAchievementNew, EvaluationPersonalAchievementNew, UserEvaluationBasicBehaviorType, UserEvaluationToProSkillType } from 'src/interfaces/user.interfaces';
export declare class EvaluationQueryDto {
    periodStart: string;
    periodEnd: string;
}
export declare class EvaluationSearchDto {
    offset: number;
    limit: number;
    sortBy: string;
    sortType: string;
    yearStart: string;
    yearEnd: string;
}
export declare class EvaluationProSkillDto {
    evaluationId: number;
}
export declare class EvaluationAchievementPublicTypeDto {
    achievementType: AchievementType;
    type: number;
}
export declare class EvaluationBasicBehaviorPublicTypeDto {
    basicBehaviorType: BasicBehaviorType;
    level: number;
}
export declare class EvaluationUpdateTypeDto {
    data: string;
}
export declare class GetEvaluationDTO {
    isEvaluatorUser: string;
}
export declare class Evaluation810Param {
    id: number;
    userId: number;
}
export declare class EvaluationApproveInfo {
    evaluationId: number;
    status: number;
    listEvalutor: EvaluatorInfo[];
    maxOrder: string;
    content: string;
    approverId: number;
    updatedTime: string;
}
export declare class Evaluation810RejectInfo {
    evaluationId: number;
    status: number;
    selectedOrder: string;
    content: string;
    approverId: number;
    ownerId: number;
    listEvalutor: EvaluatorInfo[];
    updatedTime: string;
    maxOrder: string;
}
export declare class Evaluation810SaveInfo {
    dataSource: RequestDataSave[];
    additionData: AdditionData[];
    commentData: CommentContent;
    evaluationId: number;
    status: number;
    isDraft: boolean;
    listEvalutor: EvaluatorInfo[];
    total: Total;
    updatedTime: string;
    checkList: EvaluatorInfo[];
    evaluationOrder: number;
    listBehaviors: UserEvaluationBasicBehaviorType[];
    listPersonalGoals: EvaluationPersonalAchievementNew[];
    achievementAdditionalPersonals: EvaluationAdditionalAchievementNew[];
    listBasics?: UserEvaluationBasicBehaviorType[];
    listProSkills?: UserEvaluationToProSkillType[];
}
export declare class EvaluationSearchResponseDto {
    data: any[];
    counts: number;
}
export declare class EvaluationSkillCheckResponseDto {
    flagSkill: number;
}
export declare class EvaluationUpdateTypeResponseDto {
    statusNumber: number;
    updateTime: string;
}
export declare class EvaluationListProSkillPublicResponseDto {
    itemId: string;
    smallClass: string;
    mediumClass: string;
    content: string;
    difficulty: number;
    note: string;
    jobType: string;
    key: string;
}
export declare class GetAchievementSettingPublicResponseDto {
    id: number;
    versionId: number;
    type: string;
    point: string;
    note: number;
}
export declare class GetBasicBehaviorSkillPublicResponseDto {
    id: number;
    versionId: number;
    title: string;
    content: string;
    difficulty: number;
    key: string;
}
export declare class GetSettingProFormulaPublicResponseDto {
    id: number;
    formulaId: number;
    totalItem: number;
    coefficient: number;
    settingProFormula: any;
}
export declare class GetEvaluation810ResponseDto {
    results: any;
    'hasMode1': boolean;
    'hasMode2': boolean;
    'allowSeeList': any[];
    'maxOrder': string;
    'isDisable': boolean;
    'hasMode3': boolean;
    'hasEvaluator2': boolean;
    userInfo: any;
}
export declare class CreateOrUpdateEvaluationResponseDto {
    id: number;
    status: number;
    updatedTime: string;
    level: number;
    summaryCharPointUser: number;
    summaryCharPointEvaluator05: number;
    summaryCharPointEvaluator1: number;
    summaryCharPointEvaluator2: number;
    evaluationPeriod: any;
    evaluator: any[];
}
export declare class ListBasicBehaviorResponseDto {
    idItem: number;
    versionId: number;
    title: string;
    content: string;
    difficulty: string;
    versionBasicBehavior: {
        id: number;
        version: number;
        subVersion: number;
    };
    key: string;
}
export declare class GetProSkillEvaluationItemResponseDto {
    results: {
        itemId: string;
        smallClass: string;
        mediumClass: string;
        content: string;
        difficulty: number;
        note: string;
        jobType: string;
        key: string;
    };
    department: string;
}
export declare class GetDepartmentGoalResponseDto {
    title: string;
    divisionName: string;
    evaluationAchievementPersonals: any[];
}
export declare class CheckPermissionDto {
    evaluationId: number;
    userId: number;
}
export declare class CheckPermissionResponseDto {
    evaluationId: boolean;
}
export declare class CheckPermissionRequestDto {
    evaluationId: number;
    userId: number;
}
