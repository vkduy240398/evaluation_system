import { Transaction } from 'sequelize';
import { DataExcel } from 'src/repository/feedback.repository';
import { Feedback } from '../../entity/Feedback';
import {
  NonRelatedFeedbackSearchDto,
  UserFeedbackSearchDto,
} from '../../model/request/FeedbackRequestDto';
import { Request } from 'express';

export interface FeedbackRepositoryI {
  getNewTransaction(): Promise<Transaction>;
  listFeedback(params: any): Promise<any>;
  listFeedbackExcel(params: {
    department: string;
    user: string;
    dateStart: string;
    dateEnd: string;
    type: string[];
    status: string[];
    companyGroupCode: string;
  }): Promise<DataExcel[]>;
  countListFeedback(params: any): Promise<any>;
  downloadFeedbackZIP(params: any, req: Request): Promise<any>;
  deleteFeedback(
    params: any,
    transaction: Transaction,
    companyGroupCode: string,
  ): Promise<any>;
  findOneFeedback(condition: any): Promise<any>;

  // detail
  detailFeedback(params: any, companyGroupCode: string): Promise<any>;
  updateFeedback(
    params: any,
    companyGroupCode: string,
    transaction?: Transaction,
  ): Promise<any>;

  getFeedbacksByUserId(
    body: UserFeedbackSearchDto,
    userId: number,
    companyGroupCode: string,
    timeZone: string,
  ): Promise<{ rows: Feedback[]; count: number }>;

  getUserFeedbackById(
    feedbackId: number,
    userId: number,
  ): Promise<Feedback | null>;

  addFeedback(
    params: Partial<Feedback>,
    transaction?: Transaction,
  ): Promise<Feedback>;

  deleteUserFeedbacks(
    userId: number,
    feedbackIds: number[],
    transaction?: Transaction,
  ): Promise<number>;

  downloadAttachFile(
    id: number,
    fileName: string,
    companyGroupCode: string,
  ): Promise<any>;

  getUserFeedbacksByIds(
    feedbackId: number[],
    userId: number,
  ): Promise<Feedback[]>;

  getFolderName(id: string): Promise<string>;
  getDetailFeedback(id: any, timeZone: string): any;
  cancelFeedback(id: any): any;
  addComment(params: any): Promise<any>;
  addCommentBulkCreate(data: any): Promise<any>;
  getCommentById(commentId: number): Promise<any>;
  editComment(params: any): Promise<any>;
  updateImpactScope(query: any): any;
  updateStatus(query: any): any;
  updateFeedbackDetail(params: any): any;
  getUpdateTime(id: any): any;
  deleteIssueRelated(id: number): any;
  getNonRelatedFeedbacks(
    originalFeedback: Feedback,
    criteria: NonRelatedFeedbackSearchDto,
  ): Promise<{ rows: Feedback[]; count: number }>;
  groupFeedbacks(originalId: number, addedIds: number[]): Promise<void>;
  getFeedbacksForExcel(
    body: UserFeedbackSearchDto,
    companyGroupCode: string,
    timeZone: string,
  ): Promise<{ rows: Feedback[]; count: number }>;
  deleteComment(data: any): any;
  getUpdateTimeComment(id: any): any;
  getUserIdByFeedbackId(id: any): any;
}
