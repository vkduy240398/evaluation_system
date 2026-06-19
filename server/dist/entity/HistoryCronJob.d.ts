import { Model } from 'sequelize-typescript';
import { CompanyGroup } from './CompanyGroup';
export declare class HistoryCronJob extends Model {
    id: number;
    name: string;
    type: number;
    periodIndex: number;
    year: string;
    dateCreationGoalStart: string;
    dateCreationGoalEnd: string;
    dateCreationGoalDepartmentStart: string;
    dateCreationGoalDepartmentEnd: string;
    dateSendMailEvaluationGoal: string;
    evaluationPeriodId: number;
    createdTime: Date;
    updatedTime: Date;
    companyGroupCode: string;
    companyGroupFK: CompanyGroup;
}
