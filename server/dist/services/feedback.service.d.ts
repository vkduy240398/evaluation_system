/// <reference types="multer" />
import { Request } from 'express';
import { AddComment } from 'src/interfaces/service/feedback.service.interface';
import { Feedback } from '../entity/Feedback';
import { FeedbackCreateDto, NonRelatedFeedbackSearchDto, UserFeedbackSearchDto } from '../model/request/FeedbackRequestDto';
import { CustomLogger } from './logger.service';
export declare class FeedbackService {
    private logger;
    private feedbackRepository;
    private userRepository;
    private mailService;
    constructor(logger: CustomLogger);
    STATUS_ADD_COMMENT: number[];
    listFeedback(params: any): Promise<{
        data: any;
        counts: any;
    }>;
    deleteFeedback(params: any, companyGroupCode: string): Promise<any>;
    detailFeedback(params: any, companyGroupCode: string): Promise<any>;
    getZipFeedback(params: any, req: Request): Promise<any>;
    updateFeedback(params: any, companyGroupCode: string, files?: Express.Multer.File[]): Promise<boolean>;
    updateFeedbackWithFiles(params: any, companyGroupCode: string, userId: number, files: Express.Multer.File[]): Promise<any>;
    downloadExcel(params: {
        department: string;
        user: string;
        dateStart: string;
        dateEnd: string;
        type: string[];
        status: string[];
        companyGroupCode: string;
    }): Promise<{
        link: string;
        id: number;
        subject: string;
        type: number;
        status: number;
        employeeNumber: number;
        fullName: string;
        level: number;
        departmentName: string;
        divisionName: string;
        sendTime: string;
        attachFiles: string;
        description: string;
    }[]>;
    getUserFeedbacks(body: UserFeedbackSearchDto, userId: number, companyGroupCode: string, timeZone: string): Promise<{
        rows: Feedback[];
        count: number;
    }>;
    getUserFeedbackById(feedbackId: number, userId: number): Promise<Feedback | null>;
    createFeedback(userId: number, params: FeedbackCreateDto, files: Express.Multer.File[], companyGroupCode: string, timeZone: string): Promise<Feedback>;
    sendEmailOnFeedbackCreated(createdFeedback: Feedback): Promise<void>;
    deleteUserFeedbacks(userId: number, feedbackIds: number[], companyGroupCode: string): Promise<void>;
    downloadAttachFile(id: number, fileName: string, companyGroupCode?: string): Promise<any>;
    downloadFileFromExcel(id: string, companyGroupCode: string): Promise<{
        data: any[];
        folderName: string;
    }>;
    getDetailFeedback(id: any, timeZone: string): Promise<any>;
    cancelFeedback(query: any): Promise<any>;
    addComment(params: AddComment, typeAddComment: number, timeZone: string): Promise<{
        code: number;
    }>;
    addCommentAllRelated(params: AddComment, timeZone: string): Promise<{
        code: number;
    }>;
    updateImpactScope(query: any): Promise<any>;
    updateStatus(query: any, companyGroupCode: string, timeZone: string): Promise<any>;
    updateFeedbackDetail(params: any, companyGroupCode: string, files: Express.Multer.File[]): Promise<any>;
    deleteIssueRelated(query: any): Promise<any>;
    getNonRelatedFeedbacks(criteria: NonRelatedFeedbackSearchDto): Promise<{
        rows: Feedback[];
        count: number;
    }>;
    addRelatedFeedbacks(originalId: number, addedIds: number[]): Promise<void>;
    getFeedbacksForExcel(param: UserFeedbackSearchDto, companyGroupCode: string, timeZone: string): Promise<{
        rows: Feedback[];
        count: number;
    }>;
    deleteComment(data: any): Promise<any>;
    getUserIdByFeedbackId(id: any): Promise<any>;
}
