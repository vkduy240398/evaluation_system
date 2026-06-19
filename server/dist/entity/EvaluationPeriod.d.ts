import { Model } from 'sequelize-typescript';
import { Evaluation } from './Evaluation';
import { EvaluatorDefault } from './EvaluatorDefault';
import { CompanyGroup } from './CompanyGroup';
export declare class EvaluationPeriod extends Model {
    id: number;
    year: string;
    periodIndex: number;
    periodStart: string;
    periodEnd: string;
    dateCreationGoalStart: string;
    dateCreationGoalEnd: string;
    dateEvaluationStart: string;
    dateEvaluationEnd: string;
    dateCreationGoalDepartmentStart: string;
    dateCreationGoalDepartmentEnd: string;
    dateEvaluationDepartmentStart: string;
    dateEvaluationDepartmentEnd: string;
    createdTime: Date;
    updatedTime: Date;
    checkFixed: number;
    companyGroupCode: string;
    companyGroup: CompanyGroup;
    evaluations: Evaluation[];
    evaluatorDefaults: EvaluatorDefault[];
    evaluatorDefault: EvaluatorDefault;
}
