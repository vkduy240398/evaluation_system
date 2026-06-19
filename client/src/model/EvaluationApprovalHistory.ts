export interface EvaluationApprovalHistory {
  evaluationId: number;
  comment: string;
  receiverOrder: string;
  status: string;
  type: number;
  createdTime: string;
  approverUser?: UserApproval;
  receiverUser?: UserApproval;
}

interface UserApproval {
  id?: number;
  fullName?: string;
  employeeNumber?: string;
  department?: Department;
}

interface Department {
  id?: number;
  code?: string;
  name?: string;
}

export interface EvaluatorApproval extends UserApproval {
  evaluationOrder: number;
}

interface Evaluation {
  id: number;
  level: number;
  periodStart: string;
  periodEnd: string;
  departmentName: string;
  status: number;
  title: string;
}

export interface EvaluationApprovalHistoryResponse {
  evaluation: Evaluation;
  evaluators: EvaluatorApproval[];
  approvalHistories: EvaluationApprovalHistory[];
  userDetail: UserApproval;
}
