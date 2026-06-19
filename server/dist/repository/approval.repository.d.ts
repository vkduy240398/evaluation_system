import { Evaluation } from 'src/entity/Evaluation';
import { Evaluator } from 'src/entity/Evaluator';
import { HistoryApproveEvaluation } from 'src/entity/HistoryApproveEvaluation';
import { ApprovalRepositoryI } from 'src/interfaces/repository/approval.repository.interface';
export declare class ApprovalRepository implements ApprovalRepositoryI {
    private historyApproveEvaluationEntity;
    private userEntity;
    private evaluatorEntity;
    private evaluationEntity;
    getListApprovalHistoryByEvaluationId(evaluationId: number): Promise<HistoryApproveEvaluation[]>;
    getListEvaluatorByEvaluationId(evaluationId: number): Promise<Evaluator[]>;
    getEvaluationById(evaluationId: number): Promise<Evaluation>;
    getEvaluationByListId(evaluationId: number[]): Promise<Evaluation[]>;
    getApprovalHistory(conditions: any): Promise<HistoryApproveEvaluation[]>;
}
