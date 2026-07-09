export interface ListPeriods {
  departmentGoals: string;
  divisionEvaluate: string;
  evaluationPeriod: string;
  goals: string;
  id: number;
  key: string;
  periodIndex: number;
  personalEvaluation: string;
  year: string;
  checkFixed?: number;
  goalRecord: number;
  goalFixedRecord: number;
  totalRecord: number;
  checkFixedNextPeriod: number;
  evaluationFixedRecord: number;
  evaluationConfirmRecord: number;
  goalDeptRange?: { start: string | null; end: string | null };
  evalDeptRange?: { start: string | null; end: string | null };
}
