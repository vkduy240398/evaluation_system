import { t } from 'i18next';

export class ColumnPDF810 {
  public static columnTotal() {
    const columns = [
      {
        title: ' ',
        dataIndex: 'title',
        key: 'title',
        width: '10rem',
        align: 'center' as const,
      },
      {
        title: t('IDS_DEPARTMENT_RESULTS'),
        dataIndex: 'achievementPersonalTotalPoint',
        key: 'achievementPersonalTotalPoint',
        width: '10rem',
        align: 'center' as const,
      },
      {
        title: t('IDS_ACHIEVEMENT_ADDITIONAL'),
        dataIndex: 'achievementAdditionalTotalPoint',
        key: 'achievementAdditionalTotalPoint',
        width: '10rem',
        align: 'center' as const,
      },
      {
        title: t('IDS_DEPARTMENT_EVALUATION_METER'),
        dataIndex: 'summaryPoint',
        key: 'summaryPoint',
        width: '10rem',
        align: 'center' as const,
      },
      {
        title: t('IDS_EVALUATION_PERSONAL'),
        dataIndex: 'summaryCharPoint',
        key: 'summaryCharPoint',
        width: '10rem',
        align: 'center' as const,
      },
    ];

    return columns;
  }

  public static columnDepartmentGoalTable(
    isDisplayEvaluator05: boolean,
    isDisplayEvaluator1: boolean,
    isDisplayEvaluator2: boolean,
    index: number,
  ) {
    const columns: any = [
      {
        title: (
          <div style={{ textAlign: 'center' }}>
            {t('IDS_GOAL_DEPARTMENT')}
            <div>({t('IDS_GOAL') + '-' + index})</div>
          </div>
        ),
        dataIndex: 'title',
        key: 'title',
        width: '15rem',
      },
      {
        title: t('IDS_ACHIEVEMENT_VALUE_BREAK_LINE'),
        dataIndex: 'achievementValue',
        key: 'achievementValue',
        width: '15rem',
      },
      {
        title: t('IDS_METHOD_BREAK_LINE'),
        dataIndex: 'method',
        key: 'method',
        width: '20rem',
      },
      {
        title: t('IDS_WEIGHT'),
        dataIndex: 'weight',
        key: 'weight',
        width: '5rem',
        align: 'center' as const,
      },
    ];

    const columnDifferent = {
      title: t('IDS_DIFFICULTY'),
      key: 'diff',
      children: [
        {
          title: t('IDS_POINT_USER'),
          dataIndex: 'difficultyUser',
          key: 'difficultyUser',
          width: '5rem',
          align: 'center' as const,
        },
      ],
    };

    if (isDisplayEvaluator05) {
      columnDifferent.children.push({
        title: t('IDS_EVALUATOR_0_5'),
        dataIndex: 'difficultyEvaluator05',
        key: 'difficultyEvaluator05',
        width: '4rem',
        align: 'center' as const,
      });
    }

    if (isDisplayEvaluator1) {
      columnDifferent.children.push({
        title: t('IDS_EVALUATOR_1'),
        dataIndex: 'difficultyEvaluator1',
        key: 'difficultyEvaluator1',
        width: '4rem',
        align: 'center' as const,
      });
    }

    if (isDisplayEvaluator2) {
      columnDifferent.children.push({
        title: t('IDS_EVALUATOR_2'),
        dataIndex: 'difficultyEvaluator2',
        key: 'difficultyEvaluator2',
        width: '4rem',
        align: 'center' as const,
      });
    }

    columns.push(columnDifferent);

    return columns;
  }

  public static achievementPersonalMainColumnSub() {
    //
    const columns = [
      {
        title: t('IDS_EVALUATION_JUDGMENT_INDEX'),
        dataIndex: 'evaluationDecision',
        key: 'evaluationDecision',
        width: '65rem',
      },
      {
        title: t('IDS_COEFFICIENT'),
        dataIndex: 'coefficient',
        key: 'coefficient',
        width: '4rem',
        align: 'center' as const,
      },
    ];

    return columns;
  }

  public static columnDepartmentAchievementTable(
    isDisplayEvaluator05: boolean,
    isDisplayEvaluator1: boolean,
    isDisplayEvaluator2: boolean,
    index: number,
  ) {
    const onHeaderCell = () => ({
      className: 'custom-header-pdf',
    });

    const results = [
      {
        title: (
          <div style={{ textAlign: 'center' }}>
            {t('IDS_STATUS_ACHIEVED')}
            <div>({t('IDS_GOAL') + '-' + index})</div>
          </div>
        ),
        dataIndex: 'achievementStatus',
        dataKey: 'achievementStatus',
        width: '7rem',
        align: 'center' as const,
        onHeaderCell: onHeaderCell,
      },
      {
        title: t('IDS_REASON_ACHIEVEMENT'),
        dataIndex: 'reasonComment',
        dataKey: 'reasonComment',
        width: '15rem',
        onHeaderCell: onHeaderCell,
      },
      {
        onHeaderCell: onHeaderCell,
        title: t('IDS_ACTION_PLAN_2'),
        dataIndex: 'actionPlan',
        dataKey: 'actionPlan',
        width: '20rem',
        render: (value: any, _row: any, _index: any) => {
          const obj = {
            children: value,
            props: {} as any,
          };

          if ('小計' === value) {
            obj.props.colSpan = 1;
            obj.props.align = 'right';
          }

          return obj;
        },
      },
      {
        title: `${t('IDS_POINT_USER')}(${t('IDS_POINT')})`,
        dataIndex: 'pointUser',
        dataKey: 'pointUser',
        width: '7rem',
        align: 'center' as const,
        onHeaderCell: onHeaderCell,
      },
      {
        title: `${t('IDS_POINT_USER')}(${t('IDS_COEFFICIENT')})`,
        dataIndex: 'coefficientUser',
        dataKey: 'coefficientUser',
        width: '7rem',
        align: 'center' as const,
        onHeaderCell: onHeaderCell,
      },
    ];

    if (isDisplayEvaluator05) {
      results.push(
        {
          title: `${t('IDS_EVALUATOR_0_5')}(${t('IDS_POINT')})`,
          dataIndex: 'pointEvaluator05',
          dataKey: 'pointEvaluator05',
          width: '7rem',
          align: 'center' as const,
          onHeaderCell: onHeaderCell,
        },
        {
          title: `${t('IDS_EVALUATOR_0_5')}(${t('IDS_COEFFICIENT')})`,
          dataIndex: 'coefficientEvaluator05',
          dataKey: 'coefficientEvaluator05',
          width: '7rem',
          align: 'center' as const,
          onHeaderCell: onHeaderCell,
        },
      );
    }
    if (isDisplayEvaluator1) {
      results.push(
        {
          title: `${t('IDS_EVALUATOR_1')}(${t('IDS_POINT')})`,
          dataIndex: 'pointEvaluator1',
          dataKey: 'pointEvaluator1',
          width: '7rem',
          align: 'center' as const,
          onHeaderCell: onHeaderCell,
        },
        {
          title: `${t('IDS_EVALUATOR_1')}(${t('IDS_COEFFICIENT')})`,
          dataIndex: 'coefficientEvaluator1',
          dataKey: 'coefficientEvaluator1',
          width: '7rem',
          align: 'center' as const,
          onHeaderCell: onHeaderCell,
        },
      );
    }
    if (isDisplayEvaluator2) {
      results.push(
        {
          title: `${t('IDS_EVALUATOR_2')}(${t('IDS_POINT')})`,
          dataIndex: 'pointEvaluator2',
          dataKey: 'pointEvaluator2',
          width: '7rem',
          align: 'center' as const,
          onHeaderCell: onHeaderCell,
        },
        {
          title: `${t('IDS_EVALUATOR_2')}(${t('IDS_COEFFICIENT')})`,
          dataIndex: 'coefficientEvaluator2',
          dataKey: 'coefficientEvaluator2',
          width: '7rem',
          align: 'center' as const,
          onHeaderCell: onHeaderCell,
        },
      );
    }

    return results;
  }

  public static columnSummary810() {
    const columns = [
      {
        title: ' ',
        dataIndex: 'periodTime',
        key: 'periodTime',
        width: '4rem',
        align: 'center' as const,
      },
      {
        title: t('IDS_DEPARTMENT_EVALUATION_METER'),
        dataIndex: 'summaryPointEvaluator2',
        key: 'summaryPointEvaluator2',
        width: '4rem',
        align: 'center' as const,
      },
      {
        title: t('IDS_EVALUATION_PERSONAL'),
        dataIndex: 'summaryCharPointEvaluator2',
        key: 'summaryCharPointEvaluator2',
        width: '4rem',
        align: 'center' as const,
      },
    ];

    return columns;
  }
}
