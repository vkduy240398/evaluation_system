import { ColumnInput } from 'jspdf-autotable';

export class AchievementPersonalSubTablePdfBusiness {
  public static column() {
    //
    const columns: ColumnInput[] = [
      {
        header: '水準（指標がどのような状態になっているか）',
        dataKey: 'evaluationDecision',
      },
      { header: '係数', dataKey: 'coefficient' },
    ];

    return columns;
  }
}
