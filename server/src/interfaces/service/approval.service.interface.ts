import { ApprovalHistoryResponseDto } from 'src/model/response/ApprovalHistoryResponseDto';

export interface ApprovalServiceI {
  getListApprovalHistory(
    evaluationId: number,
    userId?: number,
    order?: number
  ): Promise<ApprovalHistoryResponseDto>;
}
