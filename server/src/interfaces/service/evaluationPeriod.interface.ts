export interface EvaluationByPeriodType {
  companyName: string;
  departmentId?: number;
  departmentName: string;
  divisionId?: number;
  divisionName: string;
  period: string;
  percentPoint: number | null;
  level: number;

  periodStart: string;
  periodEnd: string;
  dateCreationGoalStart: string | null;
  dateCreationGoalEnd: string | null;

  evaluator05: number | null;
  evaluator05Name: string | null;
  evaluator05Email?: string;
  evaluator10: number | null;
  evaluator10Name: string | null;
  evaluator10Email?: string;
  evaluator20: number | null;
  evaluator20Name: string | null;
  evaluator20Email?: string;

  // checkSendMail: boolean;
  // dateSendMail: string | null;

  // checkSendMailEvaluation: boolean;
  // dateSendMailEvaluation: string | null;

  evaluationPeriodId: number;

  id: number;
  key: string;
  isEdit: boolean;

  status: number;
  creationUser: number | null;
  flagSkill: number;
  skillUser?: any;
  [x: string]: any;
}

// export interface EvaluationByPeriodType {
// 	departmentName: string;
// 	level: string;
// 	percentPoint: number | null;
// 	dateCreationGoalStart: string | null;
// 	dateCreationGoalEnd: string | null;
// 	checkSendMail: boolean;
// 	dateSendMail: string | null;
// 	id: number;
//   }
