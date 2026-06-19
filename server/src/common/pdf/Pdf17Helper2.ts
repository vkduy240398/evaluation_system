/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import { RowInput } from 'jspdf-autotable';
import { Evaluation } from 'src/entity/Evaluation';
import { Evaluator } from 'src/entity/Evaluator';

export class Pdf17Helper2 {
  public static getHeaderSummaryTable() {
    const results: RowInput = [
      {
        content: '',
        styles: { halign: 'center' },
      },
      {
        content: 'スキル評価計',
        styles: { halign: 'center' },
      },
      {
        content: 'ウェイト',
        styles: { halign: 'center' },
      },
      {
        content: '行動・情意評価計',
        styles: { halign: 'center' },
      },
      {
        content: 'ウェイト',
        styles: { halign: 'center' },
      },
      {
        content: '成果評価計',
        styles: { halign: 'center' },
      },
      {
        content: 'ウェイト',
        styles: { halign: 'center' },
      },
      {
        content: '総計（100点満点）',
        styles: { halign: 'center' },
      },
    ];

    return results;
  }

  public static getSummaryData(evaluation: Evaluation) {
    const results: RowInput[] = [
      [
        {
          content: '本人',
          styles: { halign: 'center' },
        },
        {
          content: evaluation.basicProTotalPointUser || '',
          styles: { halign: 'center' },
        },
        {
          content: (evaluation.skillPercent || 0) + '%',
          styles: { halign: 'center' },
        },
        {
          content: evaluation.behaviorTotalPointUser || '',
          styles: { halign: 'center' },
        },
        {
          content: (evaluation.behaviorPercent || 0) + '%',
          styles: { halign: 'center' },
        },
        {
          content: evaluation.achievementPersonalTotalPointUser || '',
          styles: { halign: 'center' },
        },
        {
          content: (evaluation.achievementPercent || 0) + '%',
          styles: { halign: 'center' },
        },
        {
          content: evaluation.summaryPointUser || '',
          styles: { halign: 'center' },
        },
      ],
    ];

    return results;
  }

  public static getHeaderBasicTable() {
    const results: RowInput = [
      {
        content: '評価項目',
        styles: { halign: 'center' },
      },
      {
        content: '評価内容',
        styles: { halign: 'center' },
      },
      {
        content: '難易度',
        styles: { halign: 'center' },
      },
      {
        content: '本人',
        styles: { halign: 'center' },
      },
    ];

    return results;
  }

  public static getBasicTableData(evaluation: Evaluation, type: number) {
    const results: RowInput[] = evaluation.evaluationBasicBehavior
      .filter((el) => el.type === type)
      .map((el) => {
        const list: RowInput = [
          {
            content: el.itemTitle || '',
            styles: { halign: 'left' },
          },
          {
            content: el.content || '',
            styles: { halign: 'left' },
          },
          {
            content: el.difficulty || 0,
            styles: { halign: 'center' },
          },
          {
            content: el.pointUser * el.difficulty || '',
            styles: { halign: 'center' },
          },
        ];

        return list;
      });

    return results;
  }

  public static getProTableData(evaluation: Evaluation) {
    const results: RowInput[] = evaluation.evaluationPro.map((el) => {
      const list: RowInput = [
        {
          content: el.itemTitle || '',
          styles: { halign: 'left' },
        },
        {
          content: el.content || '',
          styles: { halign: 'left' },
        },
        {
          content: el.difficulty || 0,
          styles: { halign: 'center' },
        },
        {
          content: el.pointUser || 0,
          styles: { halign: 'center' },
        },
      ];

      return list;
    });

    return results;
  }

  public static getHeaderGoalTable() {
    const results: RowInput = [
      {
        content: '個人目標',
        styles: { halign: 'center' },
      },
      {
        content: '指標・水準\n（達成数値）',
        styles: { halign: 'center' },
      },
      {
        content: 'ウェイト',
        styles: { halign: 'center' },
      },
      {
        content: '本人',
        styles: { halign: 'center' },
      },
    ];

    return results;
  }

  public static getGoalTableData(evaluation: Evaluation) {
    const results: RowInput[] = evaluation.evaluationAchievementPersonals.map(
      (el) => {
        const list: RowInput = [
          {
            content: el.title || '',
            styles: { halign: 'left' },
          },
          {
            content: el.achievementValue || '',
            styles: { halign: 'left' },
          },
          {
            content: el.weight || 0,
            styles: { halign: 'center' },
          },
          {
            content: el.pointUser || 0,
            styles: { halign: 'center' },
          },
        ];

        return list;
      },
    );

    return results;
  }

  public static getHeaderAchievementTable() {
    const results: RowInput = [
      {
        content: '達成 / 未達成',
        styles: { halign: 'center' },
      },
      {
        content: '達成理由・未達成理由',
        styles: { halign: 'center' },
      },
      {
        content: '未達成の場合の達成するためのアク\nションプラン',
        styles: { halign: 'center' },
      },
      {
        content: 'ウェイト',
        styles: { halign: 'center' },
      },
      {
        content: '本人',
        styles: { halign: 'center' },
      },
    ];

    return results;
  }

  public static getAchievementTableData(evaluation: Evaluation) {
    const results: RowInput[] = evaluation.evaluationAchievementPersonals.map(
      (el) => {
        const list: RowInput = [
          {
            content: el.achievementStatus || '',
            styles: { halign: 'left' },
          },
          {
            content: el.reasonComment || '',
            styles: { halign: 'left' },
          },
          {
            content: el.actionPlan || '',
            styles: { halign: 'center' },
          },
          {
            content: el.weight || 0,
            styles: { halign: 'center' },
          },
          {
            content: el.pointUser || 0,
            styles: { halign: 'center' },
          },
        ];

        return list;
      },
    );

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
