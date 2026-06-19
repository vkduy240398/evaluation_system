/// <reference types="multer" />
import { IdNumberDto } from 'src/model/request/IdNumberDto';
import { Request } from 'express';
import { VersionNotificationDto } from 'src/model/generic/VersionNotificationDto';
import { AddCommentFeedbackDto, FeedbackCreateDto, UserFeedbackSearchDto } from '../../model/request/FeedbackRequestDto';
import { Feedback } from '../../entity/Feedback';
import { Evaluation810Param, EvaluationBasicBehaviorPublicTypeDto } from 'src/model/request/EvaluationParamDto';
import { ApprovalHistoryResponseDto } from 'src/model/response/ApprovalHistoryResponseDto';
export declare class CommonController {
    private companyService;
    private roleService;
    private guideEvaluationService;
    private departmentService;
    private reportService;
    private evaluationService;
    private evaluationPeriodService;
    private versionNotificationService;
    private feedbackService;
    private referenceReviewService;
    private userServices;
    private approvalService;
    private feedbackCommentService;
    getNotificationPeriod(req: Request): Promise<any[]>;
    getGuideEvaluation(req: Request): Promise<import("../../entity/VersionGuideEvaluation").VersionGuideEvaluation>;
    getGuideEvaluationByEvaluationId(query: any): Promise<import("../../entity/Evaluation").Evaluation>;
    getAllDepartment(req: Request): Promise<import("../../entity/Department").Department[]>;
    getAllDepartmentEvaluation(query: {
        year: number;
        periodIndex: number;
    }, req: Request): Promise<any>;
    getAllDepartmentNotSetDivision(req: Request): Promise<import("../../entity/Department").Department[]>;
    getAllDepartmentTypeDepartment(req: Request): Promise<import("../../entity/Department").Department[]>;
    getAllDepartmentTypeDivision(req: Request): Promise<import("../../entity/Department").Department[]>;
    getAllDepartmentByCondition(req: Request): Promise<import("../../entity/Department").Department[]>;
    getAllDivisionDepartment(req: Request): Promise<{
        divisionId: number;
        code: string;
        name: string;
        childrens: any[];
    }[]>;
    getAllCompany(): Promise<import("../../entity/Company").Company[]>;
    getAllRole(): Promise<import("../../entity/Role").Role[]>;
    getUserDivisionAndDepartment(req: Request): Promise<{
        division: import("../../entity/Department").Department;
        department: import("../../entity/Department").Department[];
    } | {
        division: import("../../entity/Department").Department;
        department: import("../../entity/Department").Department;
    }>;
    getConditionUserList(req: Request): Promise<{
        divisions: {
            divisionId: number;
            code: string;
            name: string;
            childrens: any[];
        }[];
        company: import("../../entity/Company").Company[];
    }>;
    exportReportPdfReview810(res: Request, body: {
        role: any;
        evaluationId: any;
        userId: any;
        isEvaluatorUser: any;
        isF5: boolean | undefined;
    }): Promise<{
        dataReview: any[];
        fileName: string;
    }>;
    exportReportPdfReview(res: Request, body: {
        id: number[];
        isEvaluatorUser: boolean;
        isF5: boolean | undefined;
    }): Promise<{
        dataReview: any[];
        fileName: string;
    }>;
    exportReportPdfOnListReview(body: {
        evaluationId: number;
        role: string;
        userId: number;
        level: number;
        isF5: boolean | undefined;
    }, req: Request): Promise<{
        dataReview: any[];
        fileName: string;
    }>;
    exportReportListPdfReview(body: {
        childrenArr: {
            evaluationId: number;
            level: number;
        }[];
        role: string;
        isF5: boolean | undefined;
    }, req: Request): Promise<any>;
    getPublicNotification(req: Request): Promise<VersionNotificationDto>;
    getAllSkill(req: Request): Promise<import("../../entity/Skill").Skill[]>;
    downloadFileFromExcel(query: {
        id: string;
    }, req: Request): Promise<{
        data: any[];
        folderName: string;
    }>;
    getFeedbacks(body: UserFeedbackSearchDto, req: Request): Promise<{
        rows: Feedback[];
        count: number;
    }>;
    getFeedbackById(id: number, req: Request): Promise<Feedback | null>;
    createFeedback(req: Request, body: FeedbackCreateDto, files: Express.Multer.File[]): Promise<Feedback>;
    updateFeedback(params: any, files: Express.Multer.File[], req: Request): Promise<any>;
    deleteFeedbacks(ids: number[], req: Request): Promise<void>;
    downloadFile(id: number, fileName: string, req: Request): Promise<any>;
    reviewEvaluationDetail(id: number, req: Request): Promise<any>;
    checkEvaluationSkill(id: number): Promise<import("../../entity/Evaluation").Evaluation>;
    findOne(params: Evaluation810Param, query: any, req: Request): Promise<string>;
    getListReferenceReview(query: any, req: Request): Promise<any>;
    getListApprovalHistory(param: IdNumberDto, query: any): Promise<ApprovalHistoryResponseDto>;
    getDetailFeedback(query: any, req: Request): Promise<any>;
    confirmEditListUser(query: any): Promise<any>;
    updateFeedbackDetail(params: any, files: Express.Multer.File[], req: Request): Promise<any>;
    addComment(body: AddCommentFeedbackDto, req: Request): Promise<{
        code: number;
    }>;
    editComment(body: any, req: Request): Promise<{
        code: number;
    }>;
    deleteComment(body: any, req: Request): Promise<{
        code: number;
    }>;
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
}
