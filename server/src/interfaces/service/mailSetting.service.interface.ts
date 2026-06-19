export interface SendMailBody {
  contentMail: string;
  content: string;
  evaluationPeriodId: number;
  mailTo: string;
  sendTimeActual: string | null;
  sendTimeSetting: string | null;
  status: number;
  title: string;
  type: number;
  cronjobId?: number;
  mailToObjList?: any;
  companyGroupCode?: string;
  dataMailCCs?: any;
  mailCC?: string;
}
export interface SendMailNowBody {
  id?: number[];
  toEmails: string[];
  mailContent: {
    subject: string;
    editor: string;
  };
}

export interface SendMailRemindBody {
  listEvaluation: {
    id: number;
    status: number;
    level: number;
    division_name: string;
    creation_user: number;
    user_email: string;
    user_full_name: string;
    year: string;
    period_index: number;
    evaluator_05_email: string;
    evaluator_05_full_name: string;
    evaluator_1_email: string;
    evaluator_1_full_name: string;
    evaluator_2_email: string;
    evaluator_2_full_name: string;
  }[];
  toEmails: string[];
  title: string;
  content: string;
  companyGroupCode: string;
}
