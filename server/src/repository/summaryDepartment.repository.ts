import { Inject, Injectable } from '@nestjs/common';
import EntityConstant from 'src/constant/EntityConstant';
import { SummaryDepartment } from 'src/entity/SummaryDepartment';
@Injectable()
export class SummaryDepartmentRepository {
  @Inject(EntityConstant.SUMMARY_DEPARTMENT)
  private summaryDepartmentEnity: typeof SummaryDepartment;

  async createOrUpdate({
    evaluationId,
    achievementPersonalTotalPointUser,
    achievementPersonalTotalPointEvaluator05,
    achievementPersonalTotalPointEvaluator1,
    achievementPersonalTotalPointEvaluator2,

    achievementAdditionalTotalPointUser,
    achievementAdditionalTotalPointEvaluator05,
    achievementAdditionalTotalPointEvaluator1,
    achievementAdditionalTotalPointEvaluator2,

    summaryCharPointUser,
    summaryCharPointEvaluator05,
    summaryCharPointEvaluator1,
    summaryCharPointEvaluator2,

    summaryPointUser,
    summaryPointEvaluator05,
    summaryPointEvaluator1,
    summaryPointEvaluator2,
  }: {
    evaluationId: number;
    achievementPersonalTotalPointUser: string;
    achievementPersonalTotalPointEvaluator05: string;
    achievementPersonalTotalPointEvaluator1: string;
    achievementPersonalTotalPointEvaluator2: string;

    achievementAdditionalTotalPointUser: string;
    achievementAdditionalTotalPointEvaluator05: string;
    achievementAdditionalTotalPointEvaluator1: string;
    achievementAdditionalTotalPointEvaluator2: string;

    summaryCharPointUser: string;
    summaryCharPointEvaluator05: string;
    summaryCharPointEvaluator1: string;
    summaryCharPointEvaluator2: string;

    summaryPointUser: string;
    summaryPointEvaluator05: string;
    summaryPointEvaluator1: string;
    summaryPointEvaluator2: string;
  }) {
    return await this.summaryDepartmentEnity
      .findOne({
        where: {
          evaluationId,
        },
      })
      .then((res) => {
        if (res) {
          return res.update({
            achievementPersonalTotalPointUser,
            achievementPersonalTotalPointEvaluator05,
            achievementPersonalTotalPointEvaluator1,
            achievementPersonalTotalPointEvaluator2,

            achievementAdditionalTotalPointUser,
            achievementAdditionalTotalPointEvaluator05,
            achievementAdditionalTotalPointEvaluator1,
            achievementAdditionalTotalPointEvaluator2,

            summaryCharPointUser,
            summaryCharPointEvaluator05,
            summaryCharPointEvaluator1,
            summaryCharPointEvaluator2,

            summaryPointUser,
            summaryPointEvaluator05,
            summaryPointEvaluator1,
            summaryPointEvaluator2,
          });
        }
        return this.summaryDepartmentEnity.create({
          evaluationId,

          achievementPersonalTotalPointUser,
          achievementPersonalTotalPointEvaluator05,
          achievementPersonalTotalPointEvaluator1,
          achievementPersonalTotalPointEvaluator2,

          achievementAdditionalTotalPointUser,
          achievementAdditionalTotalPointEvaluator05,
          achievementAdditionalTotalPointEvaluator1,
          achievementAdditionalTotalPointEvaluator2,

          summaryCharPointUser,
          summaryCharPointEvaluator05,
          summaryCharPointEvaluator1,
          summaryCharPointEvaluator2,

          summaryPointUser,
          summaryPointEvaluator05,
          summaryPointEvaluator1,
          summaryPointEvaluator2,
        });
      });
  }
}
