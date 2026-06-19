export interface EvaluationByPeriodType {
  companyName: string;
  departmentId?: number;
  departmentName: string;
  divisionId?: number;
  divisionName: string;
  period: string;
  percentPoint: number | null;
  level: number | null;

  periodStart: string | null;
  periodEnd: string | null;
  dateCreationGoalStart: string | null | undefined;
  dateCreationGoalEnd: string | null | undefined;
  dateEvaluationStart: string | null | undefined;
  dateEvaluationEnd: string | null | undefined;

  evaluator05: number | null;
  evaluator05Name: string | null;
  evaluator05Email?: string | null;

  evaluator10: number | null;
  evaluator10Name: string | null;
  evaluator10Email?: string | null;

  evaluator20: number | null;
  evaluator20Name: string | null;
  evaluator20Email?: string | null;

  // checkSendMail: boolean;
  // dateSendMail: string | null;

  // checkSendMailEvaluation: boolean;
  // dateSendMailEvaluation: string | null;
  id: number;
  evaluationPeriodId: number | undefined;
  key: string;
  isEdit: boolean;

  isColSpan?: boolean;

  creationUser: number | null;

  status: number;

  isAddNew?: boolean;

  flagSkill: number;

  skillUser: any;
}

export interface IEvaluationByPeriodType {
  companyName: string;
  departmentName: string;
  period: string;
  percentPoint: number | null;
  level: number;

  periodStart: string | null;
  periodEnd: string | null;
  dateCreationGoalStart: string | null | undefined;
  dateCreationGoalEnd: string | null | undefined;
  dateEvaluationStart: string | null | undefined;
  dateEvaluationEnd: string | null | undefined;

  evaluator05: number | null;
  evaluator05Name: string | null;
  evaluator10: number | null;
  evaluator10Name: string | null;
  evaluator20: number | null;
  evaluator20Name: string | null;

  // checkSendMail: boolean;
  // dateSendMail: string | null;

  // checkSendMailEvaluation: boolean;
  // dateSendMailEvaluation: string | null;
  flagSkill: number;
  id: number;
  evaluationPeriodId: number | undefined;
  key: string;
  isEdit: boolean;

  isColSpan?: boolean;
  status: number;

  creationUser: number | null;

  periodPercentPlaceholder?: number;
  isDisable?: boolean;
  evaluator05Error?: boolean;
  evaluator10Error?: boolean;

  isAddNew?: boolean;

  createdByCronjob: number | null;

  skillUser?: any;
}

export interface PeriodType {
  id: number;

  dateCreationGoalStart: string;
  dateCreationGoalEnd: string;
  dateEvaluationStart: string;
  dateEvaluationEnd: string;
  dateCreationGoalDepartmentStart: string;
  dateCreationGoalDepartmentEnd: string;
  dateEvaluationDepartmentStart: string;
  dateEvaluationDepartmentEnd: string;
}

export type UserPeriodExceptionType = {
  key: string;
  isColSpan: boolean;
  userId: number;
  companyName: string;
  fullName: string;
  departmentName: string;
  companyName2: string;
  childrens: UserPeriodExceptionChildrenType[];
  email: string;
};

export type UserPeriodExceptionChildrenType = {
  id?: number;
  key: string;
  companyName: string;
  departmentName: string;
  periodStart: string;
  periodEnd: string;
  percentPoint: string;
  level: number;

  dateCreationGoalStart: string;
  dateCreationGoalEnd: string;

  year: string;
  periodIndex: number;
  evaluator05: string;
  evaluator10: string;
  evaluator20: string;

  evaluator05Email: string;
  evaluator10Email: string;
  evaluator20Email: string;

  userEmail: string;

  // checkSendMail: boolean;
  // dateSendMail: string;
};
