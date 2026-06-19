import { Model } from 'sequelize-typescript';
import { Evaluation } from './Evaluation';
import { EvaluationPeriod } from './EvaluationPeriod';
import { HistoryCronJob } from './HistoryCronJob';
import { CompanyGroup } from './CompanyGroup';
export declare class HistoryMail extends Model {
    id: number;
    evaluationId: number;
    evaluationPeriodId: number;
    status: number;
    type: number;
    mailTo: string;
    mailCC: string;
    evaluationTime: string;
    evaluationDepartmentTime: string;
    sendTimeSetting: string;
    sendTimeActual: string;
    title: string;
    contentMail: string;
    cronjobId: number;
    createdTime: Date;
    updatedTime: Date;
    companyGroupCode: string;
    evaluation: Evaluation;
    evaluationPeriod: EvaluationPeriod;
    historyCronjob: HistoryCronJob;
    companyGroupFK: CompanyGroup;
}
