/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import { Evaluation } from 'src/entity/Evaluation';

export class Pdf810Helper2 {
  public static getHeaderDepartmentGoalTable() {
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
      {
        header: '本人',
        dataKey: 'difficultyUser',
        styles: { valign: 'middle', halign: 'center' },
      },
    ];
    return columns;
  }

  public static getDepartmentGoalTableData(evaluation: Evaluation) {
    const results: any = [];
    evaluation.evaluationAchievementPersonals.map((el) => {
      const list = {
        title: el.title || '',
        achievementValue: el.achievementValue || '',
        method: el.method || '',
        weight: el.weight || 0,
        difficultyUser: el.difficultyUser ? el.difficultyUser.toFixed(1) : '',
      };
      results.push(list);
    });

    return results;
  }
}
