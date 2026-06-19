import { ColumnInput } from 'jspdf-autotable';
import { floor10 } from 'src/common/util';
import { EvaluationDetail17Type } from 'src/interfaces/service/pdfService.interface';

export class TotalTablePdfBusiness {
  public static columnTotalTable(haveSkill: boolean) {
    const columns: ColumnInput[] = [
      { header: '', dataKey: 'title' },
      { header: 'スキル評価計', dataKey: 'skillTotalPoint' },
      { header: 'ウェイト', dataKey: 'skillPercent' },
      { header: '行動・情意評価計', dataKey: 'behaviorTotalPoint' },
      { header: 'ウェイト', dataKey: 'behaviorPercent' },
      { header: '成果評価計', dataKey: 'achievementPersonalTotalPoint' },
      { header: 'ウェイト', dataKey: 'achievementPercent' },
      { header: '追加目標・成果', dataKey: 'achievementAddition' },
      { header: '総計', dataKey: 'percentPoint' },
    ];
    if (!haveSkill) {
      const columns: ColumnInput[] = [
        { header: '', dataKey: 'title' },
        { header: '成果評価計', dataKey: 'achievementPersonalTotalPoint' },
        { header: 'ウェイト', dataKey: 'achievementPercent' },
        { header: '行動・情意評価計	', dataKey: 'behaviorTotalPoint' },
        { header: 'ウェイト', dataKey: 'behaviorPercent' },
        { header: '追加目標・成果', dataKey: 'achievementAddition' },

        { header: '総計', dataKey: 'percentPoint' },
      ];
      return columns;
    }
    return columns;
  }
  // eslint-disable-next-line complexity
  public static dataSourceTotalTable(
    data: EvaluationDetail17Type,
    isDisplayEvaluator05: boolean,
    isDisplayEvaluator1: boolean,
    isDisplayEvaluator2: boolean,
  ) {
    const {
      pointSettingLevel,
      behaviorTotalPointUser,
      achievementPersonalTotalPointUser,
      achievementAdditionalTotalPointUser,
      behaviorTotalPointEvaluator05,
      achievementAdditionalTotalPointEvaluator05,
      achievementPersonalTotalPointEvaluator05,

      behaviorTotalPointEvaluator1,
      achievementAdditionalTotalPointEvaluator1,
      achievementPersonalTotalPointEvaluator1,

      behaviorTotalPointEvaluator2,
      achievementAdditionalTotalPointEvaluator2,
      achievementPersonalTotalPointEvaluator2,

      basicProTotalPointUser,
      basicProTotalPointEvaluator05,
      basicProTotalPointEvaluator1,
      basicProTotalPointEvaluator2,
    } = data;

    // ** Display column user to evaluation
    const convertBasicProTotalPointUser = basicProTotalPointUser;
    const convertBehaviorTotalPointUser = behaviorTotalPointUser;
    const convertAchievementPersonalTotalPointUser =
      achievementPersonalTotalPointUser;

    const convertAchievementAdditionalTotalPointUser =
      achievementAdditionalTotalPointUser;

    // ** Display column evaluator 0.5 to evaluation
    const convertBasicProTotalPointEvaluator05 = basicProTotalPointEvaluator05;
    const convertBehaviorTotalPointEvaluator05 = behaviorTotalPointEvaluator05;
    const convertAchievementPersonalTotalPointEvaluator05 =
      achievementPersonalTotalPointEvaluator05;

    const convertAchievementAdditionalTotalPointEvaluator05 =
      achievementAdditionalTotalPointEvaluator05;

    // ** Display column evaluator 1.0 to evaluation
    const convertBasicProTotalPointEvaluator1 = basicProTotalPointEvaluator1;
    const convertBehaviorTotalPointEvaluator1 = behaviorTotalPointEvaluator1;
    const convertAchievementPersonalTotalPointEvaluator1 =
      achievementPersonalTotalPointEvaluator1;

    const convertAchievementAdditionalTotalPointEvaluator1 =
      achievementAdditionalTotalPointEvaluator1;

    // ** Display column evaluator 2.0 to evaluation
    const convertBasicProTotalPointEvaluator2 = basicProTotalPointEvaluator2;

    const convertBehaviorTotalPointEvaluator2 = behaviorTotalPointEvaluator2;

    const convertAchievementPersonalTotalPointEvaluator2 =
      achievementPersonalTotalPointEvaluator2;

    const convertAchievementAdditionalTotalPointEvaluator2 =
      achievementAdditionalTotalPointEvaluator2;

    // ** Data source return
    const handleTotal = (total: number | undefined) => {
      return total !== null ? Math.round(total) : null;
    };

    const dataSources: any[] = [];

    /**Point user */
    dataSources.push({
      ...pointSettingLevel,
      title: '本人',
      skillTotalPoint:
        convertBasicProTotalPointUser !== null
          ? Math.round(convertBasicProTotalPointUser)
          : null,
      behaviorTotalPoint:
        convertBehaviorTotalPointUser !== null
          ? Math.round(convertBehaviorTotalPointUser)
          : null,
      achievementPersonalTotalPoint:
        convertAchievementPersonalTotalPointUser !== null
          ? Math.round(convertAchievementPersonalTotalPointUser)
          : null,
      percentPoint: handleTotal(data.summaryPointUser),
      achievementAddition:
        convertAchievementAdditionalTotalPointUser !== null
          ? Math.round(convertAchievementAdditionalTotalPointUser)
          : null,

      skillPercent: `${pointSettingLevel.skillPercent}%`,
      behaviorPercent: `${pointSettingLevel.behaviorPercent}%`,
      achievementPercent: `${pointSettingLevel.achievementPercent}%`,
    });

    /**Point evaluator 0.5 */
    if (isDisplayEvaluator05) {
      dataSources.push({
        ...pointSettingLevel,
        title: '仮評価',
        skillTotalPoint:
          convertBasicProTotalPointEvaluator05 !== null
            ? Math.round(convertBasicProTotalPointEvaluator05)
            : null,
        behaviorTotalPoint:
          convertBehaviorTotalPointEvaluator05 !== null
            ? Math.round(convertBehaviorTotalPointEvaluator05)
            : null,
        achievementPersonalTotalPoint:
          convertAchievementPersonalTotalPointEvaluator05 !== null
            ? Math.round(convertAchievementPersonalTotalPointEvaluator05)
            : null,
        percentPoint: handleTotal(data.summaryPointEvaluator05),
        achievementAddition:
          convertAchievementAdditionalTotalPointEvaluator05 !== null
            ? Math.round(convertAchievementAdditionalTotalPointEvaluator05)
            : null,

        skillPercent: `${pointSettingLevel.skillPercent}%`,
        behaviorPercent: `${pointSettingLevel.behaviorPercent}%`,
        achievementPercent: `${pointSettingLevel.achievementPercent}%`,
      });
    }

    /**Point evaluator 1 */
    if (isDisplayEvaluator1) {
      dataSources.push({
        ...pointSettingLevel,
        title: '一次評価',
        skillTotalPoint:
          convertBasicProTotalPointEvaluator1 !== null
            ? Math.round(convertBasicProTotalPointEvaluator1)
            : null,
        behaviorTotalPoint:
          convertBehaviorTotalPointEvaluator1 !== null
            ? Math.round(convertBehaviorTotalPointEvaluator1)
            : null,
        achievementPersonalTotalPoint:
          convertAchievementPersonalTotalPointEvaluator1 !== null
            ? Math.round(convertAchievementPersonalTotalPointEvaluator1)
            : null,
        percentPoint: handleTotal(data.summaryPointEvaluator1),
        achievementAddition:
          convertAchievementAdditionalTotalPointEvaluator1 !== null
            ? Math.round(convertAchievementAdditionalTotalPointEvaluator1)
            : null,

        skillPercent: `${pointSettingLevel.skillPercent}%`,
        behaviorPercent: `${pointSettingLevel.behaviorPercent}%`,
        achievementPercent: `${pointSettingLevel.achievementPercent}%`,
      });
    }

    /**Point evaluator 2 */
    if (isDisplayEvaluator2) {
      dataSources.push({
        ...pointSettingLevel,
        title: '二次評価',
        skillTotalPoint:
          convertBasicProTotalPointEvaluator2 !== null
            ? Math.round(convertBasicProTotalPointEvaluator2)
            : null,
        behaviorTotalPoint:
          convertBehaviorTotalPointEvaluator2 !== null
            ? Math.round(convertBehaviorTotalPointEvaluator2)
            : null,
        achievementPersonalTotalPoint:
          convertAchievementPersonalTotalPointEvaluator2 !== null
            ? Math.round(convertAchievementPersonalTotalPointEvaluator2)
            : null,
        percentPoint: handleTotal(data.summaryPointEvaluator2),
        achievementAddition:
          convertAchievementAdditionalTotalPointEvaluator2 !== null
            ? Math.round(convertAchievementAdditionalTotalPointEvaluator2)
            : null,

        skillPercent: `${pointSettingLevel.skillPercent}%`,
        behaviorPercent: `${pointSettingLevel.behaviorPercent}%`,
        achievementPercent: `${pointSettingLevel.achievementPercent}%`,
      });
    }

    return dataSources;
  }
}
