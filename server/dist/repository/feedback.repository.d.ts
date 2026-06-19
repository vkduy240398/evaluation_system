import { Transaction } from 'sequelize';
import { Feedback } from 'src/entity/Feedback';
import { FeedbackRepositoryI } from 'src/interfaces/repository/feedback.repository.interface';
import { NonRelatedFeedbackSearchDto, UserFeedbackSearchDto } from '../model/request/FeedbackRequestDto';
import { Request } from 'express';
import { FeedbackCommnet } from 'src/entity/FeedbackComment';
export interface DataExcel {
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
}
export declare class FeedbackRepository implements FeedbackRepositoryI {
    private readonly COMPARE_TIME_FORMAT;
    private readonly COMPARE_TIME_FORMAT_YYYY_MM_DD;
    private readonly SAVED_TIME_FORMAT;
    private feedBackRepository;
    private feedbackCommentRepository;
    getNewTransaction(): Promise<Transaction>;
    listFeedback(params: any): Promise<any>;
    countListFeedback(params: any): Promise<[unknown[], unknown]>;
    getFeedbacksForExcel(body: UserFeedbackSearchDto, companyGroupCode: string, timeZone: string): Promise<{
        rows: Feedback[];
        count: number;
    }>;
    downloadFeedbackZIP(params: any, req: Request): Promise<any>;
    deleteFeedback(params: any, transaction: Transaction, companyGroupCode: string): Promise<any>;
    detailFeedback(params: any, companyGroupCode: string): Promise<any>;
    updateFeedback(params: any, companyGroupCode: string, transaction?: Transaction): Promise<any>;
    listFeedbackExcel(params: {
        department: string;
        user: string;
        dateStart: string;
        dateEnd: string;
        type: string[];
        status: string[];
        companyGroupCode: string;
    }): Promise<DataExcel[]>;
    getFeedbacksByUserId(body: UserFeedbackSearchDto, userId: number, companyGroupCode: string, timeZone: string): Promise<{
        rows: Feedback[];
        count: number;
    }>;
    getUserFeedbackById(feedbackId: number, userId: number): Promise<Feedback | null>;
    getUserFeedbacksByIds(feedbackId: number[], userId: number): Promise<Feedback[]>;
    addFeedback(params: Partial<Feedback>, transaction?: Transaction): Promise<Feedback>;
    deleteUserFeedbacks(userId: number, feedbackIds: number[], transaction?: Transaction): Promise<number>;
    downloadAttachFile(id: number, fileName: string, companyGroupCode: string): Promise<any>;
    getFolderName(id: string): Promise<string>;
    findOneFeedback(condition: any): Promise<any>;
    getDetailFeedback(id: any, timeZone: string): Promise<{
        feedbackDetail: any;
    }>;
    cancelFeedback(id: any): Promise<[affectedCount: number]>;
    addComment(params: {
        content: string;
        feedbackId: number;
        userId: number;
    }): Promise<any>;
    addCommentBulkCreate(data: any): Promise<any>;
    getCommentById(commentId: number): Promise<any>;
    editComment(params: {
        content: string;
        id: number;
    }): Promise<any>;
    updateImpactScope(query: any): Promise<[affectedCount: number]>;
    updateStatus(query: any): Promise<[affectedCount: number]>;
    updateFeedbackDetail(params: any): Promise<[affectedCount: number]>;
    getUpdateTime(id: number): Promise<Feedback>;
    deleteIssueRelated(id: number): Promise<void>;
    getNonRelatedFeedbacks(originalFeedback: Feedback, criteria: NonRelatedFeedbackSearchDto): Promise<{
        rows: Feedback[];
        count: number;
    }>;
    groupFeedbacks(originalId: number, addedIds: number[]): Promise<void>;
    getUpdateTimeComment(id: number): Promise<FeedbackCommnet>;
    deleteComment(data: any): Promise<number>;
    getUserIdByFeedbackId(id: number): Promise<Feedback>;
}
