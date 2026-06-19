/// <reference types="multer" />
import { Request } from 'express';
import { AddCommentFeedbackDto, DeleteCommentFeedbackDto, EditCommentFeedbackDto, NonRelatedFeedbackSearchDto, UserFeedbackSearchDto } from 'src/model/request/FeedbackRequestDto';
import { FeedbackService } from 'src/services/feedback.service';
export declare class ManagementUserRoleController {
    private feedbackService;
    constructor(feedbackService: FeedbackService);
    private feedbackCommentService;
    getFeedbacks(body: UserFeedbackSearchDto, req: Request): Promise<{
        rows: import("../../entity/Feedback").Feedback[];
        count: number;
    }>;
    getNonRelatedFeedbacks(body: NonRelatedFeedbackSearchDto): Promise<{
        rows: import("../../entity/Feedback").Feedback[];
        count: number;
    }>;
    addRelatedFeedbacks(originalId: number, body: {
        ids: number[];
    }): Promise<void>;
    updateImpactScope(query: any): Promise<any>;
    updateStatus(query: any, req: Request): Promise<any>;
    updateFeedbackDetail(params: any, files: Express.Multer.File[], req: Request): Promise<any>;
    getDetailFeedback(query: any, req: Request): Promise<any>;
    deleteIssueRelated(query: any): Promise<any>;
    addComment(body: AddCommentFeedbackDto, req: Request): Promise<{
        code: number;
    }>;
    addCommentAllRelated(body: AddCommentFeedbackDto, req: Request): Promise<{
        code: number;
    }>;
    getFeedbacksForExcel(body: UserFeedbackSearchDto, req: Request): Promise<{
        rows: import("../../entity/Feedback").Feedback[];
        count: number;
    }>;
    downloadFile(id: number, fileName: string): Promise<any>;
    editComment(body: EditCommentFeedbackDto, req: Request): Promise<{
        code: number;
    }>;
    deleteComment(body: DeleteCommentFeedbackDto, req: Request): Promise<{
        code: number;
    }>;
}
