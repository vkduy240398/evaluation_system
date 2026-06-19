import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EvaluationPeriodDepartmentSettingRepository } from 'src/repository/evaluationPeriodDepartmentSetting.repository';
import {
  DeletePeriodDepartmentSettingDTO,
  DepartmentPeriodSettingItemDTO,
  SavePeriodDepartmentSettingDTO,
} from 'src/model/request/ExceptionPeriodRequestDto';
import { DepartmentType } from 'src/enum/DepartmentType';

@Injectable()
export class EvaluationPeriodDepartmentSettingService {
  constructor(
    private readonly repo: EvaluationPeriodDepartmentSettingRepository,
  ) {}

  async list(evaluationPeriodId: number, companyGroupCode: string) {
    return this.repo.findByPeriodIdWithProgress(evaluationPeriodId, companyGroupCode);
  }

  // Batch upsert: 1 record per (evaluationPeriodId, departmentId).
  //
  // For each item, query department_tbl.type to determine the actual level:
  //   type === 1 (DIVISION / bộ phận):
  //     1. Delete ALL child department records in this period via division_subclass_tbl.
  //     2. Upsert the division-level record.
  //     3. Force-apply dates to evaluation_tbl for every employee under this division,
  //        bypassing the goal-setting period time restriction (always override).
  //   type === 0 (DEPARTMENT / phòng ban):
  //     Keep existing behavior — delete only explicitly passed childDepartmentIds.
  //
  // After all upserts, re-apply ALL settings with the priority-aware SQL
  // (phòng ban takes precedence over bộ phận; time-restricted for dept-level).
  async save(dto: SavePeriodDepartmentSettingDTO, companyGroupCode: string) {
    const divisionItems: DepartmentPeriodSettingItemDTO[] = [];

    for (const item of dto.departments) {
      // Verify actual type from DB instead of trusting the frontend flag
      const deptType = await this.repo.getDepartmentType(item.departmentId, companyGroupCode);
      const isDivision = deptType === DepartmentType.DIVISION; // type === 1

      if (isDivision) {
        // Delete ALL individual phòng ban records belonging to this bộ phận
        await this.repo.deleteAllByPeriodAndDivision(
          dto.evaluationPeriodId,
          item.departmentId,
          companyGroupCode,
        );
        divisionItems.push(item);
      } else if (item.childDepartmentIds?.length) {
        await this.repo.deleteByPeriodAndDepartments(
          dto.evaluationPeriodId,
          item.childDepartmentIds,
          companyGroupCode,
        );
      }
      await this.repo.upsertOne(dto.evaluationPeriodId, companyGroupCode, item);
    }

    // Re-apply ALL department settings with priority rules (time-restricted for dept-level)
    await this.repo.applyAllDeptDatesToEvaluations(dto.evaluationPeriodId, companyGroupCode);

    // Force-apply division-level dates without time restriction — always overrides
    for (const item of divisionItems) {
      await this.repo.applyDivisionDatesToEvaluations(
        dto.evaluationPeriodId,
        companyGroupCode,
        item,
      );
    }

    return {
      saved: dto.departments.length,
      evaluationPeriodId: dto.evaluationPeriodId,
    };
  }

  async delete(dto: DeletePeriodDepartmentSettingDTO, companyGroupCode: string) {
    const deleted = await this.repo.deleteById(dto.id, companyGroupCode);
    if (deleted === 0) {
      throw new NotFoundException('Record not found or already deleted');
    }
    return { deleted };
  }
}
