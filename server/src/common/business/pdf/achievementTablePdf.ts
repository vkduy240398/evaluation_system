import { ColumnInput } from 'jspdf-autotable';

export class AchievementPersonalTablePdfBusiness {
  public static column(isDisplayEvaluator2: boolean) {
    //
    const columns: ColumnInput[] = [
      { header: '達成/未達成', dataKey: 'achievementStatus' },
      { header: '達成理由・未達成理由', dataKey: 'reasonComment' },
      {
        header: '未達成の場合の達成するためのアクションプラン	',
        dataKey: 'actionPlan',
      },
    ];

    if (isDisplayEvaluator2)
      columns.push({ header: '二次評価', dataKey: 'pointEvaluator2' });

    return columns;
  }

  public static column2(isDisplayEvaluator2: boolean) {
    //
    const columns: ColumnInput[] = [
      { header: '個人目標', dataKey: 'title' },
      { header: '指標・水準 (達成数値)', dataKey: 'achievementValue' },
      {
        header: '手段・方法 (どのように)',
        dataKey: 'method',
      },
      { header: 'ウェイト', dataKey: 'weight' },
    ];
    if (isDisplayEvaluator2)
      columns.push({
        header: '難易度\n(二次評価)',
        dataKey: 'difficultyEvaluator2',
      });
    return columns;
  }

  public static dataSources(data: any[]) {
    //
    const dataSources: any[] = data.map((v) => ({
      ...v,
      difficultyEvaluator2: v.difficultyEvaluator2 || 0,
    }));
    if (dataSources.length > 0) {
      const length = dataSources.length;
      if (dataSources[length - 1].achievementStatus === '小計') {
        dataSources.splice(-1);
        // const item: any = dataSources[length - 1];
        // dataSources[length - 1] = [
        //   { colSpan: 4, styles: { halign: 'center' }, content: '小計' },
        //   item.pointEvaluator2,
        // ];
      }
    } else {
      dataSources.push([
        {
          content: '',
          colSpan: 4,
        },
      ]);
    }
    return dataSources;
  }

  public static dataSources2(data: any[]) {
    //
    const dataSources: any[] = data.map((v) => ({
      ...v,
      difficultyUser: Math.floor(v.difficultyUser),
    }));
    if (dataSources.length > 0) {
      const length = dataSources.length;
      if (dataSources[length - 1].achievementStatus === '小計') {
        const item: any = dataSources[length - 1];
        dataSources[length - 1] = [
          { colSpan: 3, styles: { halign: 'center' }, content: '小計' },
          item.pointEvaluator2,
        ];
      }
    }
    return dataSources;
  }

  /**Function print review */

  // public static column2(isDisplayEvaluator2: boolean) {
  //   //
  //   const columns: ColumnInput[] = [
  //     { header: '個人目標', dataKey: 'title' },
  //     { header: '指標・水準 (達成数値)', dataKey: 'achievementValue' },
  //     {
  //       header: '手段・方法 (どのように)',
  //       dataKey: 'method',
  //     },
  //     { header: 'ウェイト', dataKey: 'weight' },
  //   ];
  //   if (isDisplayEvaluator2)
  //     columns.push({
  //       header: '難易度\n(二次評価)',
  //       dataKey: 'difficultyEvaluator2',
  //     });
  //   return columns;
  // }

  public static dataSourcesSub(data: any[]) {
    //
    const dataSources: any[] = data?.map((v) => ({
      ...v,
      difficultyUser: Math.floor(v.difficultyUser),
    }));

    return dataSources;
  }
}
