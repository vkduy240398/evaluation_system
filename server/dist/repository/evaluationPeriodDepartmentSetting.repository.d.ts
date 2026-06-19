import { EvaluationPeriodDepartmentSetting } from 'src/entity/EvaluationPeriodDepartmentSetting';
import { DepartmentPeriodSettingItemDTO } from 'src/model/request/ExceptionPeriodRequestDto';
export declare class EvaluationPeriodDepartmentSettingRepository {
    private entity;
    private departmentEntity;
    findByPeriodIdWithProgress(evaluationPeriodId: number, companyGroupCode: string): Promise<any[]>;
    findByPeriodAndDepartment(evaluationPeriodId: number, departmentId: number): Promise<EvaluationPeriodDepartmentSetting | null>;
    upsertOne(evaluationPeriodId: number, companyGroupCode: string, item: DepartmentPeriodSettingItemDTO): Promise<EvaluationPeriodDepartmentSetting>;
    deleteById(id: number, companyGroupCode: string): Promise<number>;
    deleteByPeriodAndDepartments(evaluationPeriodId: number, departmentIds: number[], companyGroupCode: string): Promise<number>;
    applyDeptDatesToEvaluations(evaluationPeriodId: number, companyGroupCode: string, setting: {
        departmentId: number;
        dateCreationGoalDepartmentStart: string | null;
        dateCreationGoalDepartmentEnd: string | null;
        dateCreationGoalStart: string | null;
        dateCreationGoalEnd: string | null;
        dateEvaluationDepartmentStart: string | null;
        dateEvaluationDepartmentEnd: string | null;
        dateEvaluationStart: string | null;
        dateEvaluationEnd: string | null;
    }): Promise<void>;
    applyAllDeptDatesToEvaluations(evaluationPeriodId: number, companyGroupCode: string): Promise<void>;
    getDeptSettingDatesByPeriodIds(periodIds: number[], companyGroupCode: string): Promise<any[]>;
    syncEvaluationOrgFromDefault(evaluationPeriodId: number, companyGroupCode: string, userIds: number[]): Promise<void>;
    updateEvaluationNamesFromSettings(evaluationPeriodId: number, companyGroupCode: string, userIds: number[]): Promise<void>;
}
