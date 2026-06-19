import { Request } from 'express';
import { ProSkillDetail } from 'src/interfaces/proskillSetting.interfaces';
import { CheckPermissionRequestDto, Evaluation810Param, Evaluation810RejectInfo, Evaluation810SaveInfo, EvaluationAchievementPublicTypeDto, EvaluationApproveInfo, EvaluationBasicBehaviorPublicTypeDto, EvaluationUpdateTypeDto, GetEvaluationDTO } from 'src/model/request/EvaluationParamDto';
import { EvaluatorApproveStatusDto, EvaluatorSearchDto, ExportHistoryEvaluationEvaluatorDto, GetListDepartmentExportEvaluationHistoryDto } from 'src/model/request/EvaluatorRequestDto';
import { IdNumberDto } from 'src/model/request/IdNumberDto';
import { ProSKillVersionRequestDto } from 'src/model/request/ProSkillSetingRequestDto';
import { ApprovalHistoryResponseDto } from 'src/model/response/ApprovalHistoryResponseDto';
export declare class EvaluatorRoleController {
    private evaluatorServices;
    private proSkillSettingServices;
    private userServices;
    private approvalService;
    private evaluationService;
    getEvaluation(query: EvaluatorSearchDto, req: Request): Promise<{
        data: any[];
        counts: any;
    }>;
    sendApprovedStatus(id: number, req: Request, body: EvaluatorApproveStatusDto): Promise<{
        statusNumber: number;
        updateTime: string;
    }>;
    sendRejectedStatus(id: number, req: Request, body: EvaluatorApproveStatusDto): Promise<{
        statusNumber: number;
        updateTime: string;
        comment: string;
    }>;
    getHistoryApproveContent(versionId: number, req: Request): Promise<{
        info: {
            version: string;
            skill: string;
        };
        approvalHistories: any[];
    }>;
    getDetailProSkill(param: ProSkillDetail, req: Request): Promise<import("../../model/response/VersionProSkillDto").VersionProSkillDto>;
    getVersionProSkillDepartment(req: Request, query: ProSKillVersionRequestDto): Promise<{
        data: import("../../entity/VersionProSkill").VersionProSkill[];
        total: number;
    }>;
    evaluationSkillCheck(id: number): Promise<import("../../entity/Evaluation").Evaluation>;
    getEvaluationById(id: number, query: GetEvaluationDTO, req: Request): Promise<any>;
    updateEvaluation(id: number, req: Request, body: EvaluationUpdateTypeDto): Promise<{
        statusNumber: number;
        updateTime: string;
    }>;
    getListProSkillPublic(req: Request, query: {
        evaluationId: number;
    }): Promise<any[]>;
    getAchievementSettingPublic(query: EvaluationAchievementPublicTypeDto, req: Request): Promise<import("../../entity/SettingAchievementPersonal").SettingAchievementPersonal[]>;
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
    getListApprovalHistory(req: Request, query: any, param: IdNumberDto): Promise<ApprovalHistoryResponseDto>;
    findOne(params: Evaluation810Param, query: any, req: Request): Promise<string>;
    createNewEvaluation(dataBody: Evaluation810SaveInfo, req: Request): Promise<import("../../entity/Evaluation").Evaluation>;
    approveEvaluation(dataBody: EvaluationApproveInfo, req: Request): Promise<number>;
    rejectEvaluation(dataBody: Evaluation810RejectInfo, req: Request): Promise<number>;
    getDepartmentGoal(query: any, req: Request): Promise<any[] | {
        evaluationAchievementPersonalSubs: any;
        data: any;
    }>;
    checkPermission(params: CheckPermissionRequestDto): Promise<any[]>;
    getDetailProskill(versionId: number, req: any): Promise<any>;
    exportHistoryEvaluationEvaluator(params: ExportHistoryEvaluationEvaluatorDto, res: any, req: any): Promise<void>;
    getUserDetailById(query: any): Promise<import("../../entity/User").User>;
    getListDepartmentExportEvaluationHistory(req: any, params: GetListDepartmentExportEvaluationHistoryDto): Promise<any>;
    listUserProSkillExpertise(params: any, req: any): Promise<any>;
    getListDepartmentExpertise(req: any, params: any): Promise<any>;
    exportPDFProSkillExpertise(body: {
        year: number;
        periodIndex: number;
        userId: number;
    }, req: Request): Promise<{
        dataPdf: any;
        dataLenght: number;
    }>;
    detailProfessionalExpertise(req: Request, params: any): Promise<{
        results: any;
    }>;
}
