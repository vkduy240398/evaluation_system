import { ApprovalServiceI } from 'src/interfaces/service/approval.service.interface';
import { ApprovalHistoryResponseDto } from 'src/model/response/ApprovalHistoryResponseDto';
export declare class AdminApprovalService implements ApprovalServiceI {
    private approvalRepository;
    getListApprovalHistory(evaluationId: number, userId: number, order: number): Promise<ApprovalHistoryResponseDto>;
}
