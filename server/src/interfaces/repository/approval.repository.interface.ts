import { Evaluation } from 'src/entity/Evaluation';
import { Evaluator } from 'src/entity/Evaluator';
import { HistoryApproveEvaluation } from 'src/entity/HistoryApproveEvaluation';

export interface ApprovalRepositoryI {
  getListApprovalHistoryByEvaluationId(
    evaluationId: number,
  ): Promise<HistoryApproveEvaluation[]>;

  getListEvaluatorByEvaluationId(evaluationId: number): Promise<Evaluator[]>;
  getEvaluationById(evaluationId: number): Promise<Evaluation>;
  // getUserDetail(userId: number): Promise<User>;
}
