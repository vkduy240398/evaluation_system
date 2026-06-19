import { CheckPermissionDto, Evaluation810Param, Evaluation810RejectInfo, Evaluation810SaveInfo, EvaluationAchievementPublicTypeDto, EvaluationApproveInfo, EvaluationBasicBehaviorPublicTypeDto, EvaluationProSkillDto, EvaluationSearchDto, EvaluationUpdateTypeDto, GetEvaluationDTO } from 'src/model/request/EvaluationParamDto';
import { IdDto, IdNumberDto } from 'src/model/request/IdNumberDto';
import { ApprovalHistoryResponseDto } from 'src/model/response/ApprovalHistoryResponseDto';
import { Request } from 'express';
import { TypeBasicBehavior } from 'src/model/request/BasicBehaviorRequest';
export declare class UserRoleController {
    private userServices;
    private evaluationService;
    private approvalService;
    getData(query: EvaluationSearchDto, req: Request): Promise<{
        data: any[];
        counts: any;
    }>;
    evaluationSkillCheck(id: number): Promise<import("../../entity/Evaluation").Evaluation>;
    getEvaluation(id: number, query: GetEvaluationDTO, req: Request): Promise<any>;
    updateEvaluation(id: number, req: Request, body: EvaluationUpdateTypeDto): Promise<{
        statusNumber: number;
        updateTime: string;
    }>;
    getListProSkillPublic(query: EvaluationProSkillDto, req: Request): Promise<any[]>;
    getAchievementSettingPublic(query: EvaluationAchievementPublicTypeDto, req: Request): Promise<import("../../entity/SettingAchievementPersonal").SettingAchievementPersonal[]>;
    getAchievementSubPublic(query: EvaluationAchievementPublicTypeDto, req: Request): Promise<import("../../entity/SettingAchievementPersonal").SettingAchievementPersonal[]>;
    getAchievementAddSettingPublic(query: EvaluationAchievementPublicTypeDto, req: Request): Promise<import("../../entity/SettingAchievementAdditional").SettingAchievementAdditional[]>;
    getBasicBehaviorSkillPublic(query: EvaluationBasicBehaviorPublicTypeDto, req: Request): Promise<{
        key: string;
        idItem: number;
        versionId: number;
        title: string;
        content: string;
        difficulty: number;
        versionBasicBehavior: import("../../entity/VersionBasicBehavior").VersionBasicBehavior;
        id?: any;
        createdAt?: any;
        updatedAt?: any;
        deletedAt?: any;
        version?: any;
        _attributes: any;
        dataValues: any;
        _creationAttributes: any;
        isNewRecord: boolean;
        sequelize: import("sequelize").Sequelize;
        _model: import("sequelize").Model<any, any>;
    }[]>;
    getSettingProFormulaPublic(req: Request): Promise<import("../../entity/SettingProFormulaSub").SettingProFormulaSub[]>;
    findOne(params: Evaluation810Param, query: any, req: Request): Promise<string>;
    createNewEvaluation(dataBody: Evaluation810SaveInfo, req: Request): Promise<import("../../entity/Evaluation").Evaluation>;
    approveEvaluation(dataBody: EvaluationApproveInfo, req: Request): Promise<number>;
    rejectEvaluation(dataBody: Evaluation810RejectInfo, req: Request): Promise<number>;
    getListApprovalHistory(req: Request, param: IdNumberDto): Promise<ApprovalHistoryResponseDto>;
    getBasicBehavior(params: TypeBasicBehavior, req: Request): Promise<any[]>;
    getProSkill(req: Request): Promise<{
        department: any;
        results: any;
    }>;
    getDepartmentGoal(query: IdDto, req: Request): Promise<any[] | {
        evaluationAchievementPersonalSubs: any;
        data: any;
    }>;
    checkPermission(params: CheckPermissionDto): Promise<boolean>;
    goalsPastEvaluation(params: {
        year: number;
        type: number;
        periodIndex: number;
        evaluationPeriodId: number;
    }, req: Request): Promise<object[]>;
}
