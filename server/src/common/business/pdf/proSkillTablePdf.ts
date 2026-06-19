import { ColumnInput } from 'jspdf-autotable';

export class ProSkillTablePdfBusiness {
  public static column(isDisplayEvaluator2: boolean) {
    //
    const columns: ColumnInput[] = [
      { header: '評価項目', dataKey: 'itemTitle' },
      { header: '評価内容', dataKey: 'content' },
      { header: '難易度', dataKey: 'difficulty' },
    ];
    if (isDisplayEvaluator2)
      columns.push({ header: '二次評価', dataKey: 'totalPointEvaluator2' });

    return columns;
  }

  public static dataSources(data: any[], status: number) {
    //
    const dataSources: any[] = data;
    if (dataSources.length > 0) {
      const length = dataSources.length;
      if (dataSources[length - 1].itemTitle === '小計' && status > 50) {
        const item: any = dataSources[length - 1];
        dataSources[length - 1] = [
          { colSpan: 3, styles: { halign: 'center' }, content: '小計' },
          item.totalPointEvaluator2,
        ];
      }
    } else {
      dataSources.push([
        {
          content: '',
          colSpan: 3,
        },
      ]);
    }
    return dataSources;
  }

  /**Function print review */

  public static dataSourcesProSkill(data: any[], status: number) {
    //
    const dataSources: any[] = data;
    return dataSources;
  }
}
