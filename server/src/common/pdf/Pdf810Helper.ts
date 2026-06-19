/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import { RowInput } from 'jspdf-autotable';
import { Evaluation } from 'src/entity/Evaluation';
import { Evaluator } from 'src/entity/Evaluator';

export class Pdf810Helper {
  public static getHeaderSummaryTable() {
    const results: RowInput[] = [
      [
        {
          content: '',
          styles: { valign: 'middle', halign: 'center' },
        },
        {
          content: '部署評価',
          styles: { valign: 'middle', halign: 'center' },
        },
        {
          content: '個人評価',
          styles: { valign: 'middle', halign: 'center' },
        },
      ],
    ];

    return results;
  }
  public static getSummaryTableData(
    evaluation: Evaluation,
    exist05: boolean,
    exist1: boolean,
    exist2: boolean,
  ) {
    const results: RowInput[] = [
      [
        // '本人',
        // evaluation.summaryPointUser
        //   ? evaluation.summaryPointUser.toFixed(1)
        //   : '',
        // evaluation.summaryCharPointUser,
      ],
    ];
    // if (exist05)
    //   results.push([
    //     '仮評価',
    //     evaluation.summaryPointEvaluator05
    //       ? evaluation.summaryPointEvaluator05.toFixed(1)
    //       : '',
    //     evaluation.summaryCharPointEvaluator05,
    //   ]);
    // if (exist1)
    //   results.push([
    //     '一次',
    //     evaluation.summaryPointEvaluator1
    //       ? evaluation.summaryPointEvaluator1.toFixed(1)
    //       : '',
    //     evaluation.summaryCharPointEvaluator1,
    //   ]);
    if (exist2)
      results.push([
        '二次',
        evaluation.summaryPointEvaluator2
          ? evaluation.summaryPointEvaluator2.toFixed(1)
          : '',
        evaluation.summaryCharPointEvaluator2,
      ]);
    return results;
  }

  public static getHeaderDepartmentGoalTable(
    exist05: boolean,
    exist1: boolean,
    exist2: boolean,
  ) {
    const buffList: string[] = [];
    const columns = [
      {
        header: '部門目標',
        dataKey: 'title',
        styles: { valign: 'middle', halign: 'center' },
      },
      {
        header: '指標・水準\n（達成数値）',
        dataKey: 'achievementValue',
        styles: { valign: 'middle', halign: 'center' },
      },
      {
        header: '手段・方法\n（どのように）',
        dataKey: 'method',
        styles: { valign: 'middle', halign: 'center' },
      },
      {
        header: 'ウェイト',
        dataKey: 'weight',
        styles: { valign: 'middle', halign: 'center' },
      },
      // {
      //   header: '本人',
      //   dataKey: 'difficultyUser',
      //   styles: { valign: 'middle', halign: 'center' },
      // },
      // {
      //   header: '仮評価',
      //   dataKey: 'difficultyEvaluator05',
      //   styles: { valign: 'middle', halign: 'center' },
      // },
      // {
      //   header: '一次',
      //   dataKey: 'difficultyEvaluator1',
      //   styles: { align: 'center' },
      // },
      {
        header: '二次',
        dataKey: 'difficultyEvaluator2',
        styles: { align: 'center' },
      },
    ].filter((v) => {
      if (!exist05) buffList.push('difficultyEvaluator05');
      if (!exist1) buffList.push('difficultyEvaluator1');
      if (!exist2) buffList.push('difficultyEvaluator2');
      return !buffList.includes(v.dataKey);
    });
    return columns;
  }

  public static getDepartmentGoalTableData(evaluation: Evaluation) {
    const results: any = [];
    evaluation.evaluationAchievementPersonals.map((el) => {
      const list = {
        title: el.title || '',
        achievementValue: el.achievementValue || '',
        method: el.method || '',
        weight: el.weight || '',
        // difficultyUser: el.difficultyUser ? el.difficultyUser.toFixed(1) : '',
        // difficultyEvaluator05: el.difficultyEvaluator05
        //   ? el.difficultyEvaluator05.toFixed(1)
        //   : '',
        // difficultyEvaluator1: el.difficultyEvaluator1
        //   ? el.difficultyEvaluator1.toFixed(1)
        //   : '',
        difficultyEvaluator2: el.difficultyEvaluator2
          ? el.difficultyEvaluator2.toFixed(1)
          : '',
      };
      results.push(list);
    });

    return results;
  }

  public static getHeaderDepartmentAchievementTable(
    exist05: boolean,
    exist1: boolean,
    exist2: boolean,
  ) {
    const buffList2s: string[] = [];
    const results = [
      {
        header: '達成 / 未達成',
        dataKey: 'achievementStatus',
        styles: { valign: 'middle', halign: 'center' },
      },
      {
        header: '達成理由・未達成理由',
        dataKey: 'reasonComment',
        styles: { valign: 'middle', halign: 'center' },
      },
      {
        header:
          '達成するためのアクションプラン記載・ミス発生などインシデント内容の記載',
        dataKey: 'actionPlan',
        styles: { valign: 'middle', halign: 'center' },
      },
      // {
      //   header: '本人(点数)',
      //   dataKey: 'pointUser',
      //   styles: { valign: 'middle', halign: 'center' },
      // },
      // {
      //   header: '本人(係数)',
      //   dataKey: 'coefficientUser',
      //   styles: { valign: 'middle', halign: 'center' },
      // },
      // {
      //   header: '仮評価（点数）',
      //   dataKey: 'pointEvaluator05',
      //   styles: { valign: 'middle', halign: 'center' },
      // },
      // {
      //   header: '仮評価（係数）',
      //   dataKey: 'coefficientEvaluator05',
      //   styles: { valign: 'middle', halign: 'center' },
      // },
      // {
      //   header: '一次（点数）',
      //   dataKey: 'pointEvaluator1',
      //   styles: { valign: 'middle', halign: 'center' },
      // },
      // {
      //   header: '一次（係数）',
      //   dataKey: 'coefficientEvaluator1',
      //   styles: { valign: 'middle', halign: 'center' },
      // },
      {
        header: '二次（点数）',
        dataKey: 'pointEvaluator2',
        styles: { valign: 'middle', halign: 'center' },
      },
      {
        header: '二次（係数）',
        dataKey: 'coefficientEvaluator2',
        styles: { valign: 'middle', halign: 'center' },
      },
    ].filter((v) => {
      // if (!exist05)
      //   buffList2s.push('pointEvaluator05', 'coefficientEvaluator05');
      // if (!exist1) buffList2s.push('pointEvaluator1', 'coefficientEvaluator1');
      if (!exist2) buffList2s.push('pointEvaluator2', 'coefficientEvaluator2');

      return !buffList2s.includes(v.dataKey);
    });

    return results;
  }

  public static getDepartmentAchievementTableData(evaluation: Evaluation) {
    const results: any = [];
    evaluation.evaluationAchievementPersonals.map((el) => {
      const list = {
        achievementStatus: el.achievementStatus || '',
        reasonComment: el.reasonComment || '',
        actionPlan: el.actionPlan || '',
        pointEvaluator2: el.pointEvaluator2 || '',
        coefficientEvaluator2: el.coefficientEvaluator2
          ? Number(el.coefficientEvaluator2).toFixed(1)
          : '',
      };
      results.push(list);
    });
    const lastRow = [
      {
        content: `小計`,
        colSpan: 3,
      },
      {
        content: !isNaN(
          Number(evaluation.achievementPersonalTotalPointEvaluator2),
        )
          ? Number(evaluation.achievementPersonalTotalPointEvaluator2).toFixed(
              2,
            )
          : '',
        colSpan: 2,
      },
    ];
    results.push(lastRow);
    return results;
  }

  public static getHeaderAdditionalTable(
    exist05: boolean,
    exist1: boolean,
    exist2: boolean,
  ) {
    const buffList2s: string[] = [];
    const results = [
      {
        header: 'その他特記項目	',
        dataKey: 'titleAdditional',
        styles: { valign: 'middle', halign: 'center' },
      },
      {
        header: '達成/未達成',
        dataKey: 'achievementStatus',
        styles: { valign: 'middle', halign: 'center' },
      },
      {
        header: '理由および本人コメント',
        dataKey: 'reasonComment',
        styles: { valign: 'middle', halign: 'center' },
      },
      // {
      //   header: '本人',
      //   dataKey: 'pointUser',
      //   styles: { valign: 'middle', halign: 'center' },
      // },
      // {
      //   header: '仮評価',
      //   dataKey: 'pointEvaluator05',
      //   styles: { valign: 'middle', halign: 'center' },
      // },
      // {
      //   header: '一次',
      //   dataKey: 'pointEvaluator1',
      //   styles: { valign: 'middle', halign: 'center' },
      // },
      {
        header: '二次',
        dataKey: 'pointEvaluator2',
        styles: { valign: 'middle', halign: 'center' },
      },
    ].filter((v) => {
      // if (!exist05) buffList2s.push('pointEvaluator05');
      // if (!exist1) buffList2s.push('pointEvaluator1');
      if (!exist2) buffList2s.push('pointEvaluator2');

      return !buffList2s.includes(v.dataKey);
    });

    return results;
  }

  public static getAdditionalTableData(evaluation: Evaluation) {
    const results = [];

    evaluation.evaluationAchievementAdditional.map((el) => {
      const list = {
        titleAdditional: el.titleAdditional || '',
        achievementStatus: el.achievementStatus || '',
        reasonComment: el.reasonComment || '',
        pointEvaluator2: el.pointEvaluator2 || '',
      };
      results.push(list);
    });
    const lastRow = [
      {
        content: `小計` as string | number,
        colSpan: 3,
        styles: { halign: 'center' },
      },
      {
        content:
          Pdf810Helper.get2WithoutRound(
            evaluation.achievementAdditionalTotalPointEvaluator2,
          ) ?? '',
        colSpan: 1,
        styles: { halign: 'center' },
      },
    ];
    results.push(lastRow);
    return results;
  }

  public static getColumnTypeTotalPointAdditionalTable(exist05: boolean) {
    if (exist05) {
      return {
        0: { cellWidth: 135 },
        1: { cellWidth: 18.95 },
        2: { cellWidth: 18.95 },
        3: { cellWidth: 13.55 },
        4: { cellWidth: 13.55 },
      };
    }
    return {
      0: { cellWidth: 135 },
      1: { cellWidth: 24.38 },
      2: { cellWidth: 20.3 },
      3: { cellWidth: 20.32 },
    };
  }

  public static getTotalPointAdditionalTableData(
    evaluation: Evaluation,
    exist05: boolean,
  ) {
    let totalSelf = 0;
    let totalRater05 = 0;
    let totalRater1 = 0;
    let totalRater2 = 0;

    evaluation.evaluationAchievementPersonals.forEach((el) => {
      totalSelf += el.pointUser;
      if (exist05) {
        totalRater05 += el.pointEvaluator05 || 0;
      }
      totalRater1 += el.pointEvaluator1;
      totalRater2 += el.pointEvaluator2;
    });

    const results: RowInput = [
      {
        content: '小計',
        styles: { halign: 'center' },
      },
      {
        content: totalSelf,
        styles: { halign: 'center' },
      },
      {
        content: totalRater1,
        styles: { halign: 'center' },
      },
      {
        content: totalRater2,
        styles: { halign: 'center' },
      },
    ];

    if (exist05) {
      results.splice(3, 0, {
        content: totalRater05,
        styles: { halign: 'center' },
      });
    }

    return [results];
  }
  public static getSummaryPeriodTableData(evaluations: Evaluation[]) {
    let total = 0;
    const results = [];
    evaluations.map((evaluation) => {
      const row: RowInput = [
        {
          content: `${evaluation.periodStart} ～ ${evaluation.periodEnd}`,
          styles: { halign: 'center' },
        },
        {
          content: evaluation.summaryCharPointEvaluator2 || '',
          styles: { halign: 'center' },
        },
        {
          content: evaluation.summaryPointEvaluator2
            ? parseFloat(evaluation.summaryPointEvaluator2.toString()).toFixed(
                1,
              )
            : '',
          styles: { halign: 'center' },
        },
      ];
      total +=
        evaluation.summaryPointEvaluator2 *
        (Math.floor(
          evaluation.percentPoint === null ? 100 : evaluation.percentPoint,
        ) /
          100);
      results.push(row);
    });
    const lastRow = [
      {
        content: `評価結果` as string | number,
        colSpan: 2,
        styles: { halign: 'center' },
      },
      {
        content: total ? Math.round(Number(total) * 10) / 10 : '',
        colSpan: 1,
        styles: { halign: 'center' },
      },
    ];
    results.push(lastRow);

    return results;
  }

  public static getEvaluatorByOrder(evaluators: Evaluator[], order: string) {
    const filter = evaluators.filter(
      (el) => el.evaluationOrder.toString() === order,
    );

    if (filter.length === 0) {
      return null;
    }

    return filter[0];
  }
  // public static sortObject(obj: any, order: string) {
  //   let tempList = [];
  //   if (obj && order) {
  //     if (order === 'DESC') {
  //       tempList = obj.sort((a: any, b: any) => {
  //         return b.point - a.point;
  //       });
  //     } else {
  //       tempList = obj.sort((a: any, b: any) => {
  //         return a.point - b.point;
  //       });
  //     }
  //   }

  //   return tempList;
  // }
  public static get2WithoutRound(num: number) {
    let temp = '';
    if (num) {
      temp = num.toString(); // If it's not already a String
      temp = temp.slice(0, temp.indexOf('.') + 3); // With 3 exposing the hundredths place
    }

    return Number(temp);
  }
}
