import { Request, Response } from 'express';
import { EvaluationSearchDto } from 'src/model/request/ManagementEvaluationProDto';
import { Evaluation810Param, Evaluation810RejectInfo, EvaluationAchievementPublicTypeDto, EvaluationBasicBehaviorPublicTypeDto, GetEvaluationDTO } from 'src/model/request/EvaluationParamDto';
import { ApprovalHistoryResponseDto } from 'src/model/response/ApprovalHistoryResponseDto';
import { IdDto, IdNumberDto } from 'src/model/request/IdNumberDto';
import { CheckStatusRecordSendDTO, ConfirmGoalDTO, EvaluationByPeriodParamDto, GetToEmailFixedListDTO, GetToEmailListDTO, ImportUserDTO, ListPeriodDTO, ListPeriodDepartmentSettingDTO, ListUserPeriodDTO, PeriodDTO, SavePeriodDepartmentSettingDTO, SavePeriodDTO, SendMailBodyDTO, SendMailNow2DTO, UndoFixEvaluationDTO, UpdateEvaluationPeriodExceptionDto, UpdateSettingEvaluatorOfOneUserDTO, findListUserToSettingEvaluationDTO } from 'src/model/request/ExceptionPeriodRequestDto';
import { AddUserSettingEvaluationDTO } from 'src/model/request/UserSettingEvaluatorSearchRequestDto';
import { EvaluatorApproveStatusDto } from 'src/model/request/EvaluatorRequestDto';
import { ListFeedbackDto, UserFeedbackSearchDto } from 'src/model/request/FeedbackRequestDto';
export declare class ManagementBasicBehaviorSettingRoleController {
    private evaluatorServices;
    private evaluationPeriodService;
    private adminEvaluationService;
    private evaluationServices;
    private userServices;
    private approvalService;
    private userService;
    private mailService;
    private companyService;
    private departmentService;
    private cronjobService;
    private feedbackService;
    private excelService;
    private periodDeptSettingService;
    getListUserEvaluation(query: EvaluationSearchDto, req: Request): Promise<any>;
    download(query: EvaluationSearchDto, res: any, req: Request): Promise<void>;
    findOne(params: Evaluation810Param, query: any, req: Request): Promise<string>;
    evaluationSkillCheck(id: number): Promise<import("../../entity/Evaluation").Evaluation>;
    getEvaluationById(id: number, query: GetEvaluationDTO, req: Request): Promise<any>;
    rejectEvaluation(dataBody: Evaluation810RejectInfo, req: Request): Promise<number>;
    getListApprovalHistory(param: IdNumberDto): Promise<ApprovalHistoryResponseDto>;
    getDepartmentGoal(query: IdDto, req: Request): Promise<any[] | {
        evaluationAchievementPersonalSubs: any;
        data: any;
    }>;
    getAchievementSettingPublic(query: EvaluationAchievementPublicTypeDto, req: Request): Promise<import("../../entity/SettingAchievementPersonal").SettingAchievementPersonal[]>;
    getListProSkillPublic(req: Request, query: {
        evaluationId: number;
    }): Promise<any[]>;
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
    listPeriods(req: Request): Promise<import("../../entity/EvaluationPeriod").EvaluationPeriod[]>;
    exportHistoryEvaluation(params: any, req: Request): Promise<any>;
    listPeriod(params: ListPeriodDTO, req: Request): Promise<any[]>;
    evaluationPeriodList(params: {
        year: string;
    }, req: Request): Promise<void>;
    goalConfirm(body: ConfirmGoalDTO, req: Request): Promise<any>;
    evaluationConfirm(body: ConfirmGoalDTO, req: Request): Promise<any>;
    publicEvaluation(body: ConfirmGoalDTO, req: Request): Promise<any>;
    undoFixEvaluation(body: UndoFixEvaluationDTO): Promise<any>;
    listPeriodDepartmentSetting(query: ListPeriodDepartmentSettingDTO, req: Request): Promise<any[]>;
    savePeriodDepartmentSetting(body: SavePeriodDepartmentSettingDTO, req: Request): Promise<{
        saved: number;
        evaluationPeriodId: number;
    }>;
    deletePeriodDepartmentSetting(id: string, req: Request): Promise<{
        deleted: number;
    }>;
    getPeriodDetail(params: PeriodDTO, req: Request): Promise<import("../../entity/EvaluationPeriod").EvaluationPeriod>;
    checkIsFixed(query: PeriodDTO, req: Request): Promise<any>;
    exception: any;
    checkImportUser(query: PeriodDTO, req: Request): Promise<any>;
    getToEmailList(params: GetToEmailListDTO, departmentId: string, req: Request): Promise<{
        toEmailList: any;
        content: string;
        title: string;
        template: {
            id: number;
            name: string;
            subject: string;
            content: string;
            note: string;
        };
    }>;
    getToEmailListFixed(params: GetToEmailFixedListDTO, req: Request): Promise<{
        content: string;
        title: string;
    }>;
    checkStatusSelected(params: CheckStatusRecordSendDTO, query: any): Promise<{
        result: any[];
    }>;
    getUsersEmailList(conditions: any, req: Request): Promise<any>;
    saneMailNow(body: SendMailNow2DTO, req: Request): Promise<any>;
    saveMailTemplate(body: SendMailBodyDTO, req: Request): Promise<any>;
    savePeriod(body: SavePeriodDTO, req: Request): Promise<[affectedCount: number, affectedRows: import("../../entity/EvaluationPeriod").EvaluationPeriod[]]>;
    findListUserToSettingEvaluation(query: findListUserToSettingEvaluationDTO, req: Request): Promise<any>;
    addUserSettingEvaluation(body: AddUserSettingEvaluationDTO, req: Request): Promise<boolean>;
    searchListUserSettingEvaluator(query: any, req: Request): Promise<any>;
    importUser(query: ImportUserDTO, req: Request): Promise<boolean>;
    deleteUserSettingEvaluator(params: any, req: Request): Promise<any>;
    updateSettingEvaluatorOfOneUser(query: UpdateSettingEvaluatorOfOneUserDTO, req: Request): Promise<any>;
    getListEvaluator(req: Request): Promise<any>;
    updateSettingEvaluatorListUser(query: any, req: Request): Promise<any>;
    getCompanies(): Promise<{
        label: string;
        value: any;
    }[]>;
    getDepartments(query: PeriodDTO, req: Request): Promise<any[]>;
    getEvaluatorUsers(evaluationCreatorId: number | undefined, req: Request): Promise<{
        value: any;
        label: string;
    }[]>;
    getEvaluationByPeriod(query: EvaluationByPeriodParamDto, req: Request): Promise<{
        period: {
            id: number;
            dateCreationGoalStart: string;
            dateCreationGoalEnd: string;
            dateEvaluationStart: string;
            dateEvaluationEnd: string;
            dateCreationGoalDepartmentStart: string;
            dateCreationGoalDepartmentEnd: string;
            dateEvaluationDepartmentStart: string;
            dateEvaluationDepartmentEnd: string;
        };
        evaluations: import("../../interfaces/service/evaluationPeriod.interface").EvaluationByPeriodType[];
    }>;
    updateEvaluationPeriodException(req: Request, body: UpdateEvaluationPeriodExceptionDto): Promise<{
        resetEvaluationIds: number[];
        evaluator05ErrorIds: number[];
        evaluator10ErrorIds: number[];
        evaluatorErrorNames: string[];
        evaluationNewIds: number[];
    }>;
    listUserEvaluationPeriod(params: ListUserPeriodDTO, req: Request): Promise<any>;
    sendEmailFixedGoal(body: any, req: Request): {
        message: string;
    };
    getMailTemplateById(params: any): Promise<import("../../entity/MailTemplate").MailTemplate>;
    getAllDepartmentEvaluation(query: {
        year: number;
        periodIndex: number;
    }, req: Request): Promise<any>;
    cronjobSendMail(): Promise<void>;
    getAllSkill(req: Request): Promise<any>;
    getAllSkillPublic(req: Request): Promise<any>;
    sendRejectedStatus(id: number, req: Request, body: EvaluatorApproveStatusDto): Promise<{
        statusNumber: number;
        updateTime: string;
        comment: string;
    }>;
    sendApprovedStatus(id: number, req: Request, body: EvaluatorApproveStatusDto): Promise<{
        statusNumber: number;
        updateTime: string;
    }>;
    getListFeedback(query: ListFeedbackDto, req: Request): Promise<{
        data: any;
        counts: any;
    }>;
    getFeedbacksForExcel(body: UserFeedbackSearchDto, req: Request): Promise<{
        rows: import("../../entity/Feedback").Feedback[];
        count: number;
    }>;
    deleteFeedback(params: any, req: Request): Promise<any>;
    detailFeedback(params: any, req: Request): Promise<any>;
    getZipFeedback(params: any, req: Request): Promise<any>;
    updateFeedback(params: any, req: Request): Promise<boolean>;
    getFeedbacks(body: UserFeedbackSearchDto, req: Request): Promise<{
        rows: import("../../entity/Feedback").Feedback[];
        count: number;
    }>;
    getDetailFeedback(query: any, req: Request): Promise<any>;
    cronJobCreateEvaluation(req: Request): Promise<void>;
    cronJobSendMail(req: Request): Promise<void>;
    undoException(data: any, req: Request): Promise<any>;
    startExcelJob(body: any, req: Request): Promise<{
        jobId: string;
    }>;
    checkJob(jobId: string): {
        ready: boolean;
        percent: number;
        message: string;
    };
    downloadExcel(jobId: string, year: number, periodIndex: number, res: Response): Response<any, Record<string, any>>;
}
