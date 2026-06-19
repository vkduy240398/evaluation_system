import { ApprovalServiceI } from 'src/interfaces/service/approval.service.interface';
import { ApprovalHistoryResponseDto } from 'src/model/response/ApprovalHistoryResponseDto';
export declare class ApprovalService implements ApprovalServiceI {
    private approvalRepository;
    getListApprovalHistory(evaluationId: number, currentAccessId: number): Promise<ApprovalHistoryResponseDto>;
}
