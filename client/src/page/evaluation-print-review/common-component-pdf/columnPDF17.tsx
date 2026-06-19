import { t } from 'i18next';

export class ColumnPDF17 {
  public static columnBasicBehavior(
    isDisplayUser: boolean,
    isDisplayEvaluator05: boolean,
    isDisplayEvaluator1: boolean,
    isDisplayEvaluator2: boolean,
  ) {
    const columns = [
      {
        title: t('IDS_EVALUATION_ITEM'),
        dataIndex: 'title',
        key: 'title',
        width: '14rem',
      },
      {
        title: t('IDS_EVALUATION_CONTENT'),
        dataIndex: 'content',
        key: 'content',
        width: '65rem',
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
        title: t('IDS_DIFFICULTY'),
        dataIndex: 'difficulty',
        key: 'difficulty',
        width: '6rem',
        align: 'center' as const,
      },
    ];

    if (isDisplayUser) {
      columns.push({
        title: t('IDS_POINT_USER'),
        dataIndex: 'pointUser',
        key: 'pointUser',
        width: '7rem',
        align: 'center' as const,
      });
    }
    if (isDisplayEvaluator05) {
      columns.push({
        title: t('IDS_EVALUATOR_0_5'),
        dataIndex: 'pointEvaluator05',
        key: 'pointEvaluator05',
        width: '7rem',
        align: 'center' as const,
      });
    }

    if (isDisplayEvaluator1) {
      columns.push({
        title: t('IDS_EVALUATOR_1'),
        dataIndex: 'pointEvaluator1',
        key: 'pointEvaluator1',
        width: '7rem',
        align: 'center' as const,
      });
    }

    if (isDisplayEvaluator2) {
      columns.push({
        title: t('IDS_EVALUATOR_2'),
        dataIndex: 'pointEvaluator2',
        key: 'pointEvaluator2',
        width: '7rem',
        align: 'center' as const,
      });
    }

    return columns;
  }

  public static columnProSkill(
    isDisplayUser: boolean,
    isDisplayEvaluator05: boolean,
    isDisplayEvaluator1: boolean,
    isDisplayEvaluator2: boolean,
  ) {
    const columns = [
      {
        title: t('IDS_EVALUATION_ITEM'),
        dataIndex: 'itemTitle',
        key: 'itemTitle',
        width: '14rem',
      },
      {
        title: t('IDS_EVALUATION_CONTENT'),
        dataIndex: 'content',
        key: 'content',
        width: '65rem',
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
        title: t('IDS_DIFFICULTY'),
        dataIndex: 'difficulty',
        key: 'difficulty',
        width: '6rem',
        align: 'center' as const,
      },
    ];

    if (isDisplayUser) {
      columns.push({
        title: t('IDS_POINT_USER'),
        dataIndex: 'totalPointUser',
        key: 'totalPointUser',
        width: '7rem',
        align: 'center' as const,
      });
    }
    if (isDisplayEvaluator05) {
      columns.push({
        title: t('IDS_EVALUATOR_0_5'),
        dataIndex: 'totalPointEvaluator05',
        key: 'totalPointEvaluator05',
        width: '7rem',
        align: 'center' as const,
      });
    }

    if (isDisplayEvaluator1) {
      columns.push({
        title: t('IDS_EVALUATOR_1'),
        dataIndex: 'totalPointEvaluator1',
        key: 'totalPointEvaluator1',
        width: '7rem',
        align: 'center' as const,
      });
    }

    if (isDisplayEvaluator2) {
      columns.push({
        title: t('IDS_EVALUATOR_2'),
        dataIndex: 'totalPointEvaluator2',
        key: 'totalPointEvaluator2',
        width: '7rem',
        align: 'center' as const,
      });
    }

    return columns;
  }

  public static columnAchievementPersonalSub(
    isDisplayUser: boolean,
    isDisplayEvaluator05: boolean,
    isDisplayEvaluator1: boolean,
    isDisplayEvaluator2: boolean,
    index: number,
  ) {
    const onHeaderCell = () => ({
      className: 'custom-header-pdf',
    });

    const columns = [
      {
        title: (
          <div style={{ textAlign: 'center' }}>
            {t('IDS_STATUS_ACHIEVED')}
            <div>({t('IDS_GOAL') + '-' + index})</div>
          </div>
        ),
        dataIndex: 'achievementStatus',
        key: 'achievementStatus',
        width: '10rem',
        align: 'center' as any,
        onHeaderCell: onHeaderCell,
      },
      {
        title: '達成理由・未達成理由',
        dataIndex: 'reasonComment',
        key: 'reasonComment',
        width: '14rem',
        onHeaderCell: onHeaderCell,
      },
      {
        onHeaderCell: onHeaderCell,
        title: '未達成の場合の達成するためのアクションプラン	',
        dataIndex: 'actionPlan',
        key: 'actionPlan',
        width: '65rem',
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
    ];

    if (isDisplayUser) {
      columns.push({
        title: t('IDS_POINT_USER') as any,
        dataIndex: 'pointUser',
        key: 'pointUser',
        width: '7rem',
        align: 'center' as const,
        onHeaderCell: onHeaderCell,
      });
    }

    if (isDisplayEvaluator05) {
      columns.push({
        title: t('IDS_EVALUATOR_0_5') as any,
        dataIndex: 'pointEvaluator05',
        key: 'pointEvaluator05',
        width: '7rem',
        align: 'center' as const,
        onHeaderCell: onHeaderCell,
      });
    }

    if (isDisplayEvaluator1) {
      columns.push({
        title: t('IDS_EVALUATOR_1') as any,
        dataIndex: 'pointEvaluator1',
        key: 'pointEvaluator1',
        width: '7rem',
        align: 'center' as const,
        onHeaderCell: onHeaderCell,
      });
    }

    if (isDisplayEvaluator2) {
      columns.push({
        title: t('IDS_EVALUATOR_2') as any,
        dataIndex: 'pointEvaluator2',
        key: 'pointEvaluator2',
        width: '7rem',
        align: 'center' as const,
        onHeaderCell: onHeaderCell,
      });
    }

    return columns;
  }

  public static columnAchievementAdditional(
    isDisplayUser: boolean,
    isDisplayEvaluator05: boolean,
    isDisplayEvaluator1: boolean,
    isDisplayEvaluator2: boolean,
  ) {
    //
    const columns = [
      {
        title: t('IDS_OTHER_ITEM'),
        dataIndex: 'titleAdditional',
        key: 'titleAdditional',
        width: '20rem',
      },
      {
        title: t('IDS_STATUS_ACHIEVED'),
        dataIndex: 'achievementStatus',
        key: 'achievementStatus',
        width: '10rem',
        align: 'center' as const,
      },
      {
        title: t('IDS_ACHIEVEMENT_ADDITIONAL_REASON'),
        dataIndex: 'reasonComment',
        key: 'reasonComment',
        width: '60rem',
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
    ];

    if (isDisplayUser) {
      columns.push({
        title: t('IDS_POINT_USER'),
        dataIndex: 'pointUser',
        key: 'pointUser',
        width: '7rem',
        align: 'center' as const,
      });
    }

    if (isDisplayEvaluator05) {
      columns.push({
        title: t('IDS_EVALUATOR_0_5'),
        dataIndex: 'pointEvaluator05',
        key: 'pointEvaluator05',
        width: '7rem',
        align: 'center' as const,
      });
    }

    if (isDisplayEvaluator1) {
      columns.push({
        title: t('IDS_EVALUATOR_1'),
        dataIndex: 'pointEvaluator1',
        key: 'pointEvaluator1',
        width: '7rem',
        align: 'center' as const,
      });
    }

    if (isDisplayEvaluator2) {
      columns.push({
        title: t('IDS_EVALUATOR_2'),
        dataIndex: 'pointEvaluator2',
        key: 'pointEvaluator2',
        width: '7rem',
        align: 'center' as const,
      });
    }

    return columns;
  }

  public static columnTotalTableReview(haveSkill: boolean) {
    const columns = [
      {
        title: '  ',
        dataIndex: 'title',
        key: 'title',
        align: 'center' as const,
        width: 75,
      },
      {
        title: t('IDS_SKILL_EVALUATION_METER'),
        dataIndex: 'skillTotalPoint',
        key: 'skillTotalPoint',
        width: 175,
        align: 'center' as const,
      },
      {
        title: t('IDS_WEIGHT'),
        dataIndex: 'skillPercent',
        key: 'skillPercent',
        width: 80,
        align: 'center' as const,
      },
      {
        title: t('IDS_BEHAVIOR_EVALUATION_METER'),
        dataIndex: 'behaviorTotalPoint',
        key: 'behaviorTotalPoint',
        width: 175,
        align: 'center' as const,
      },
      {
        title: t('IDS_WEIGHT'),
        dataIndex: 'behaviorPercent',
        key: 'behaviorPercent',
        width: 80,
        align: 'center' as const,
      },
      {
        title: t('IDS_ACHIEVEMENT_EVALUATION_METER'),
        dataIndex: 'achievementPersonalTotalPoint',
        key: 'achievementPersonalTotalPoint',
        width: 175,
        align: 'center' as const,
      },
      {
        title: t('IDS_WEIGHT'),
        dataIndex: 'achievementPercent',
        key: 'achievementPercent',
        width: 80,
        align: 'center' as const,
      },
      {
        title: t('IDS_ACHIEVEMENT_ADDITIONAL'),
        dataIndex: 'achievementAddition',
        key: 'achievementAddition',
        width: 175,
        align: 'center' as const,
      },
      {
        title: t('IDS_TOTAL_POINTS'),
        dataIndex: 'percentPoint',
        key: 'percentPoint',
        align: 'center' as const,
        width: 110,
      },
    ];
    if (!haveSkill) {
      const columns = [
        {
          title: '  ',
          dataIndex: 'title',
          key: 'title',
          width: 75,
          align: 'center' as const,
        },
        {
          title: t('IDS_BEHAVIOR_EVALUATION_METER'),
          dataIndex: 'behaviorTotalPoint',
          key: 'behaviorTotalPoint',
          width: 270,
          align: 'center' as const,
        },
        {
          title: t('IDS_WEIGHT'),
          dataIndex: 'behaviorPercent',
          key: 'behaviorPercent',
          width: 80,
          align: 'center' as const,
        },
        {
          title: t('IDS_ACHIEVEMENT_EVALUATION_METER'),
          dataIndex: 'achievementPersonalTotalPoint',
          key: 'achievementPersonalTotalPoint',
          width: 270,
          align: 'center' as const,
        },
        {
          title: t('IDS_WEIGHT'),
          dataIndex: 'achievementPercent',
          key: 'achievementPercent',
          width: 80,
          align: 'center' as const,
        },

        {
          title: t('IDS_ACHIEVEMENT_ADDITIONAL'),
          dataIndex: 'achievementAddition',
          key: 'achievementAddition',
          align: 'center' as const,
          width: 270,
        },

        {
          title: t('IDS_TOTAL_POINTS'),
          dataIndex: 'percentPoint',
          key: 'percentPoint',
          align: 'center' as const,
          width: 110,
        },
      ];

      return columns;
    }

    return columns;
  }

  public static achievementPersonalMainColumnParent(
    isDisplayUser: boolean,
    isDisplayEvaluator05: boolean,
    isDisplayEvaluator1: boolean,
    isDisplayEvaluator2: boolean,
    index: number,
  ) {
    //
    const columns: any = [
      {
        title: (
          <div style={{ textAlign: 'center' }}>
            {t('IDS_ACHIEVEMENT_PERSONAL')}
            <div>({t('IDS_GOAL') + '-' + index})</div>
          </div>
        ),
        dataIndex: 'title',
        key: 'title',
        width: '8rem',
      },
      { title: t('IDS_ACHIEVEMENT_VALUE_2'), dataIndex: 'achievementValue', key: 'achievementValue', width: '8rem' },
      {
        title: t('IDS_METHOD'),
        dataIndex: 'method',
        key: 'method',
        width: '14rem',
      },
      { title: t('IDS_WEIGHT'), dataIndex: 'weight', key: 'weight', width: '5rem', align: 'center' as const },
    ];

    const columnDifferent = {
      title: t('IDS_DIFFICULTY'),
      key: 'diff',
      children: [
        {
          title: t('IDS_POINT_USER'),
          dataIndex: 'difficultyUser',
          key: 'difficultyUser',
          width: '4rem',
          align: 'center' as const,
        },
      ],
    };

    // if (isDisplayUser) {
    //   columnDifferent.children.push({
    //     title: '本人',
    //     dataIndex: 'difficultyUser',
    //     key: 'difficultyUser',
    //     width: '4rem',
    //     align: 'center' as const,
    //   });
    // }

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

      { title: t('IDS_DEGREE'), dataIndex: 'degree', key: 'degree', width: '10rem', align: 'left' as const },
    ];

    return columns;
  }

  public static columnSummary17() {
    const columns = [
      {
        title: ' ',
        dataIndex: 'periodTime',
        key: 'periodTime',
        width: '10rem',
        align: 'center' as const,
      },
      {
        title: t('IDS_SKILL_EVALUATION_METER'),
        dataIndex: 'basicProTotalPointEvaluator2',
        key: 'basicProTotalPointEvaluator2',
        width: '10rem',
        align: 'center' as const,
      },
      {
        title: t('IDS_BEHAVIOR_EVALUATION_METER'),
        dataIndex: 'behaviorTotalPointEvaluator2',
        key: 'behaviorTotalPointEvaluator2',
        width: '10rem',
        align: 'center' as const,
      },
      {
        title: t('IDS_ACHIEVEMENT_EVALUATION_METER'),
        dataIndex: 'achievementPersonalTotalPointEvaluator2',
        key: 'achievementPersonalTotalPointEvaluator2',
        width: '10rem',
        align: 'center' as const,
      },
      {
        title: t('IDS_ACHIEVEMENT_ADDITIONAL'),
        dataIndex: 'achievementAdditionalTotalPointEvaluator2',
        key: 'achievementAdditionalTotalPointEvaluator2',
        width: '10rem',
        align: 'center' as const,
      },
      {
        title: t('IDS_TOTAL_POINT_100'),
        dataIndex: 'summaryPointEvaluator2',
        key: 'summaryPointEvaluator2',
        width: '10rem',
        align: 'center' as const,
      },
    ];

    return columns;
  }
}
