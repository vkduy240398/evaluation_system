import { EvaluationPeriodDepartmentSettingRepository } from 'src/repository/evaluationPeriodDepartmentSetting.repository';
import { DeletePeriodDepartmentSettingDTO, SavePeriodDepartmentSettingDTO } from 'src/model/request/ExceptionPeriodRequestDto';
export declare class EvaluationPeriodDepartmentSettingService {
    private readonly repo;
    constructor(repo: EvaluationPeriodDepartmentSettingRepository);
    list(evaluationPeriodId: number, companyGroupCode: string): Promise<any[]>;
    save(dto: SavePeriodDepartmentSettingDTO, companyGroupCode: string): Promise<{
        saved: number;
        evaluationPeriodId: number;
    }>;
    delete(dto: DeletePeriodDepartmentSettingDTO, companyGroupCode: string): Promise<{
        deleted: number;
    }>;
}
