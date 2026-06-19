/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import { RowInput } from 'jspdf-autotable';
import { Evaluation } from 'src/entity/Evaluation';
import { Evaluator } from 'src/entity/Evaluator';
import { Pdf810Helper } from './Pdf810Helper';
import { formatNumber } from '../util';

export class Pdf810Helper3 {
  public static getHeaderSummaryTable() {
    const results: RowInput[] = [
      [
        {
          content: '',
          styles: { valign: 'middle', halign: 'center' },
        },
        {
          content: '部門成果',
          styles: { valign: 'middle', halign: 'center' },
        },
        { content: '追加成果', styles: { valign: 'middle', halign: 'center' } },
        {
          content: '部門評価計',
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

  public static getSummaryTableData(evaluation: Evaluation) {
    const results: RowInput[] = [
      [
        '二次評価',
        Number(evaluation.achievementPersonalTotalPointEvaluator2).toFixed(2),
        Pdf810Helper.get2WithoutRound(
          evaluation.achievementAdditionalTotalPointEvaluator2,
        ) ?? '',
        evaluation.summaryPointEvaluator2
          ? Number(evaluation.summaryPointEvaluator2).toFixed(1)
          : '',
        evaluation.summaryCharPointEvaluator2,
      ],
    ];
    return results;
  }

  public static getHeaderDepartmentGoalTable(status: number) {
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
    ];
    if (status > 50) {
      columns.push({
        header: '二次評価',
        dataKey: 'difficultyEvaluator2',
        styles: { valign: 'middle', halign: 'center' },
      });
    }
    return columns;
  }

  public static getDepartmentGoalTableData(evaluationAchievementPersonal: any) {
    // const results: {
    //   title: string;
    //   achievementValue: string;
    //   method: string;
    //   weight: number;
    //   difficultyEvaluator2: string;
    // }[] = [];
    const results: any = [];
    const list = {
      title: evaluationAchievementPersonal.title || '',
      achievementValue: evaluationAchievementPersonal.achievementValue || '',
      method: evaluationAchievementPersonal.method || '',
      weight: evaluationAchievementPersonal.weight || 0,
      difficultyEvaluator2: evaluationAchievementPersonal.difficultyEvaluator2
        ? Number(evaluationAchievementPersonal.difficultyEvaluator2).toFixed(1)
        : '',
    };
    results.push(list);

    return results;
  }

  public static getSubListData(
    evaluationAchievementPersonal: any,
    subList: any,
  ) {
    // const results: {
    //   title: string;
    //   achievementValue: string;
    //   method: string;
    //   weight: number;
    //   difficultyEvaluator2: string;
    // }[] = [];
    const achievementPersonalsubList = subList.filter((value) => {
      return value.achievementPersonalId === evaluationAchievementPersonal.id;
    });
    const results: any = [];
    achievementPersonalsubList.map((el) => {
    
      const list = {
        coefficient: formatNumber(el.coefficient) || '',
        evaluationDecision: el.evaluationDecision || '',
      };
      results.push(list);
    });
    return results;
  }

  public static getHeaderDepartmentAchievementTable() {
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
      {
        header: '二次評価(点数)',
        dataKey: 'pointEvaluator2',
        styles: { valign: 'middle', halign: 'center' },
      },
      {
        header: '二次評価(係数)',
        dataKey: 'coefficientEvaluator2',
        styles: { valign: 'middle', halign: 'center' },
      },
    ];

    return results;
  }

  public static getDepartmentAchievementTableData(evaluation: Evaluation) {
    const results: {
      achievementStatus: string;
      reasonComment: string;
      actionPlan: string;
      pointUser: number;
      coefficientUser: number;
      pointEvaluator05: number;
      coefficientEvaluator05: number;
      pointEvaluator1: number;
      coefficientEvaluator1: number;
      pointEvaluator2: number;
      coefficientEvaluator2: number;
    }[] = [];
    evaluation.evaluationAchievementPersonals.map((el) => {
      const list = {
        achievementStatus: el.achievementStatus || '',
        reasonComment: el.reasonComment || '',
        actionPlan: el.actionPlan || '',
        pointUser: el.pointUser || 0,
        coefficientUser: el.coefficientUser || 0,
        pointEvaluator05: el.pointEvaluator05 || 0,
        coefficientEvaluator05: el.coefficientEvaluator05 || 0,
        pointEvaluator1: el.pointEvaluator1 || 0,
        coefficientEvaluator1: el.coefficientEvaluator1 || 0,
        pointEvaluator2: el.pointEvaluator2 || 0,
        coefficientEvaluator2: el.coefficientEvaluator2 || 0,
      };
      results.push(list);
    });

    return results;
  }

  public static getHeaderAdditionalTable() {
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
      {
        header: '二次',
        dataKey: 'pointEvaluator2',
        styles: { valign: 'middle', halign: 'center' },
      },
    ];

    return results;
  }

  public static getAdditionalTableData(evaluation: Evaluation) {
    const results = [];
    evaluation.evaluationAchievementAdditional.map((el) => {
      const list = {
        titleAdditional: el.titleAdditional || '',
        achievementStatus: el.achievementStatus || '',
        reasonComment: el.reasonComment || '',
        pointUser: el.pointUser || 0,
        pointEvaluator05: el.pointEvaluator05 || 0,
        pointEvaluator1: el.pointEvaluator1 || 0,
        pointEvaluator2: el.pointEvaluator2 || 0,
      };
      results.push(list);
    });

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
}
