export interface PropsPdf {
  dateEvaluationDepartmentEnd: string | null;
  dateEvaluationDepartmentStart: string | null;
  dateEvaluationEnd: string | null;
  dateEvaluationEndEval: string | null;
  dateEvaluationStart: string | null;
  dateEvaluationStartEval: string | null;
  departmentName: string;
  divisionName: string;
  employeeNumber: string;
  evaluationId: number;
  evaluationOrder: string;
  evaluatorId: number;
  fullName: string;
  isInActive: boolean;
  level: number;
  percentPoint: number;
  periodEnd: string;
  periodStart: string;
  status: number;
  stringStatus: string;
  summaryPointEvaluator2: string;
  title: string;
  userId: number;
}

export interface ParentProps {
  dateEvaluationDepartmentEnd: string | null;
  dateEvaluationDepartmentStart: string | null;
  dateEvaluationEnd: string | null;
  dateEvaluationEndEval: string | null;
  dateEvaluationStart: string | null;
  dateEvaluationStartEval: string | null;
  evaluationId: 28;
  fullName: string;
  id: string;
  isInActive: boolean;
  stringNotSameRank: string;
  stringStatus: string;
  summaryPointEvaluator2: string;
  title: string;
  userId: number;
  status: number;
  level: number;
  childs: PropsPdf[];
}
