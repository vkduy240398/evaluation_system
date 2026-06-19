import { ColumnInput } from 'jspdf-autotable';
import { UserEvaluationAchievementType } from 'src/interfaces/user.interfaces';

export class AchievementAdditionalTablePdfBusiness {
  public static column(isDisplayEvaluator2: boolean) {
    //
    const columns: ColumnInput[] = [
      { header: 'その他特記項目', dataKey: 'titleAdditional' },
      { header: '達成/未達成', dataKey: 'achievementStatus' },
      {
        header: '理由および本人コメント',
        dataKey: 'reasonComment',
      },
    ];

    if (isDisplayEvaluator2)
      columns.push({ header: '二次評価', dataKey: 'pointEvaluator2' });

    return columns;
  }

  public static dataSources(data: any[]) {
    //
    const dataSources: any[] = data;
    if (dataSources.length > 0) {
      const length = dataSources.length;
      if (dataSources[length - 1].titleAdditional === '小計') {
        const item: UserEvaluationAchievementType = dataSources[length - 1];
        dataSources[length - 1] = [
          { colSpan: 3, styles: { halign: 'center' }, content: '小計' },
          item.pointEvaluator2,
        ];
      }
    }
    return dataSources;
  }

  /**Function print review */

  public static dataSourcesAchievementAdditional(data: any[]) {
    const dataSources: any[] = data;
    return dataSources;
  }
}
