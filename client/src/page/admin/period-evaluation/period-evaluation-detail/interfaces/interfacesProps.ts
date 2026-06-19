export interface MailTemplate {
  evaluationPeriodId: number;
  status: number;
  type: number;
  sendTimeSetting: string | null;
  sendTimeActual?: string | null;
  title: string;
  contentMail: string;
  mailTo: string;
  mailToObjList?: string[];
  dataMailCCs?: any;
}
export interface MailToSend {
  toEmails: string;
  mailContent: {
    subject: string;
    editor: string;
  };
}
export interface MailProperty {
  key?: number;
  contentMail: string;
  createdTime: string;
  cronjobId: number;
  evaluationId: number;
  evaluationPeriodId: number;
  evaluationTime: string;
  evaluationDepartmentTime: string;
  id: number;
  mailTo: string;
  sendTimeActual: string;
  sendTimeSetting: string;
  status: number;
  title: string;
  type: number;
  updatedTime: string;
  typeNumber: number;
}
export interface EvaluationPeriod {
  id: number;
  dateCreationGoalDepartmentEnd?: string;
  dateCreationGoalDepartmentStart?: string;
  dateCreationGoalEnd?: string;
  dateCreationGoalStart?: string;
  dateEvaluationDepartmentEnd?: string;
  dateEvaluationDepartmentStart?: string;
  dateEvaluationEnd?: string;
  dateEvaluationStart?: string;

  // dateSendMailCreationGoal: string;
  // dateSendMailCreationGoalDepartment: string;
  // dateSendMailEvaluation: string;
  // dateSendMailEvaluationDepartment: string;
  periodEnd?: string;
  periodIndex?: number;
  periodStart?: string;
  year?: string | number;

  // checkSendMailCreationGoal: boolean;
  // checkSendMailCreationGoalDepartment: boolean;
  // checkSendMailEvaluation: boolean;
  // checkSendMailEvaluationDepartment: boolean;
  checkFixed?: number;
  updatedTime?: string;
}
export interface MailQuery {
  type: number;
  title: string;
  year: number;
  periodIndex: number;
  isOpenTabException: boolean;
  goals810Time: string;
  goals17Time: string;
  offset: number;
  current: number;
  limit: number;
  periodId?: number;
  checkFixed?: number;
}
export interface ToMailList {
  email: string;
  id?: number;
  fullName?: string;
  permissions?: Permissions[];
}
export interface Permissions {
  createdTime: string;
  roleId: number;
  role_id?: number;
  updatedTime: string;
  userId: number;
  user_id?: number;
}
