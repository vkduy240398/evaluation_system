import { Model } from 'sequelize-typescript';
import { EvaluationPeriod } from './EvaluationPeriod';
import { Department } from './Department';
import { CompanyGroup } from './CompanyGroup';
export declare class EvaluationPeriodDepartmentSetting extends Model {
    id: number;
    evaluationPeriodId: number;
    departmentId: number;
    companyGroupCode: string;
    dateCreationGoalDepartmentStart: string;
    dateCreationGoalDepartmentEnd: string;
    dateCreationGoalStart: string;
    dateCreationGoalEnd: string;
    dateEvaluationDepartmentStart: string;
    dateEvaluationDepartmentEnd: string;
    dateEvaluationStart: string;
    dateEvaluationEnd: string;
    checkFixed: number;
    createdTime: Date;
    updatedTime: Date;
    evaluationPeriod: EvaluationPeriod;
    department: Department;
    companyGroup: CompanyGroup;
}
