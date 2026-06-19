import { ColumnInput } from 'jspdf-autotable';
import { UserEvaluationBasicBehaviorType } from 'src/interfaces/user.interfaces';

export class BasicTablePdfBusiness {
  public static column(isDisplayEvaluator2: boolean) {
    //
    const columns: ColumnInput[] = [
      { header: '評価項目', dataKey: 'title' },
      { header: '評価内容', dataKey: 'content' },
      { header: '難易度', dataKey: 'difficulty' },
    ];
    if (isDisplayEvaluator2)
      columns.push({ header: '二次評価', dataKey: 'pointEvaluator2' });

    return columns;
  }

  public static dataSources(
    data: UserEvaluationBasicBehaviorType[],
    status: number,
  ) {
    //
    const dataSources: any[] = data;
    if (dataSources.length > 0) {
      const length = dataSources.length;
      if (dataSources[length - 1].title === '小計' && status > 50) {
        const item: UserEvaluationBasicBehaviorType = dataSources[length - 1];
        dataSources[length - 1] = [
          { colSpan: 3, styles: { halign: 'center' }, content: '小計' },
          item.pointEvaluator2,
        ];
      }
    }
    return dataSources;
  }

  /**Function process data print review */

  public static dataSourcesBasicBehavior(
    data: UserEvaluationBasicBehaviorType[],
    status: number,
  ) {
    const dataSources: any[] = data;
    return dataSources;
  }
}
