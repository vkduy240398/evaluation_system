import { t } from 'i18next';
import { MainButton } from '../../../../common/MainButton';
import { Tooltip, Typography, Space } from 'antd';
import { UndoOutlined } from '@ant-design/icons';
import moment from 'moment';
import { urlCompanyCode } from '../../../../common/util';
const { Text } = Typography;
interface Props {
  fixedGoal: (data: any) => void;
  undoFixGoal: (data: any) => void;
  fixedEvaluation: (data: any) => void;
  undoFixEvaluation: (data: any) => void;
  fixedEvaluationPublic: (data: any) => void;
}
const ColumnEvaluationPeriodList = (props: Props) => {
  const { fixedGoal, undoFixGoal, fixedEvaluation, undoFixEvaluation, fixedEvaluationPublic } = props;

  const isDisplayFixEvalation = (item: any) => {
    const endPersonalEvaluation = item.personalEvaluation?.split(' ～ ')[1];
    const endDepartmentEvaluation = item.divisionEvaluate?.split(' ～ ')[1];
    if (!endPersonalEvaluation && !endDepartmentEvaluation) {
      return false;
    }

    return (
      item.checkFixed === 0 &&
      item.totalRecord !== 0 &&
      ((endPersonalEvaluation &&
        moment(endPersonalEvaluation, 'YYYY/M/D').format('YYYY/MM/DD') < moment().format('YYYY/MM/DD')) ||
        (endDepartmentEvaluation &&
          moment(endDepartmentEvaluation, 'YYYY/M/D').format('YYYY/MM/DD') < moment().format('YYYY/MM/DD')))
    );
  };

  const isDisplayLinkFixEvalation = (item: any) => {
    const startPersonalEvaluation = item.personalEvaluation?.split(' ～ ')[0];
    const startDepartmentEvaluation = item.divisionEvaluate?.split(' ～ ')[0];
    if (!startPersonalEvaluation && !startDepartmentEvaluation) {
      return false;
    }

    return (
      item.checkFixed === 0 &&
      item.totalRecord !== 0 &&
      ((startPersonalEvaluation &&
        moment(startPersonalEvaluation, 'YYYY/M/D').format('YYYY/MM/DD') <= moment().format('YYYY/MM/DD')) ||
        (startDepartmentEvaluation &&
          moment(startDepartmentEvaluation, 'YYYY/M/D').format('YYYY/MM/DD') <= moment().format('YYYY/MM/DD')))
    );
  };

  const isDisplayPublicEvaluation = (item: any) => {
    return item.checkFixed <= 1 && item.evaluationConfirmRecord === 0 && item.totalRecord !== 0;
  };

  return [
    {
      title: t('IDS_EVALUATION_PERIOD'),
      dataIndex: 'evaluationPeriod',
      key: 'evaluationPeriod',
      align: 'center' as const,
      width: '12%',
    },
    {
      title: t('IDS_AIM_SETTING'),
      // children: [
      //   {
      //     title: t('IDS_DEPARTMENT_PERIOD'),
      //     dataIndex: 'departmentGoals',
      //     key: 'departmentGoals',
      //     align: 'center' as const,
      //     width: '13%',
      //   },
      //   {
      //     title: t('IDS_PERSONAL_PERIOD'),
      //     dataIndex: 'goals',
      //     key: 'goals',
      //     align: 'center' as const,
      //     width: '13%',
      //   },
      // ],
      width: '20%',
      render: (record: any) => {
        return (
          <>
            <Space direction="vertical" size={2} style={{ width: '100%' }}>
              {record.departmentGoals && (
                <Tooltip
                  title={
                    record.goalDeptRange?.start && record.goalDeptRange?.end
                      ? `${record.goalDeptRange.start} ～ ${record.goalDeptRange.end}`
                      : undefined
                  }
                  placement="top"
                >
                  <div style={{ cursor: record.goalDeptRange?.start ? 'help' : 'default' }}>
                    <Text strong style={{ color: '#1890ff', marginRight: 8 }}>
                      {t('IDS_DEPARTMENT_PERIOD')}:
                    </Text>
                    <Text>{record.departmentGoals}</Text>
                  </div>
                </Tooltip>
              )}

              {record.goals && (
                <div>
                  <Text strong style={{ color: '#007240', marginRight: 8 }}>
                    {t('IDS_PERSONAL_PERIOD')}:
                  </Text>
                  <Text>{record.goals}</Text>
                </div>
              )}
            </Space>
          </>
        );
      },
    },
    {
      title: t('IDS_FIX_GOAL'),
      children: [
        {
          title: t('IDS_ALERT'),
          align: 'center' as const,
          width: '10%',
          render: (text: any) => {
            return (
              <>
                {text.checkFixed !== undefined && (
                  <span
                    className="hover-btn-summary"
                    onClick={(e) => {
                      if (text.goalRecord > 0)
                        window.open(
                          `${urlCompanyCode()}/admin-evaluation/detail-evaluation-fixed?id=${
                            text.id
                          }&type=fixedGoal&year=${text.year}${
                            text.periodIndex === 1 ? t('IDS_FIRST_PERIOD_WITH_YEAR') : t('IDS_SECOND_PERIOD_WITH_YEAR')
                          }`,
                          '_blank',
                        );
                      e.stopPropagation();
                    }}
                    style={{
                      textDecoration: text.goalRecord !== 0 ? 'underline' : 'none',
                      color: text.goalRecord !== 0 ? 'blue' : 'black',
                      cursor: text.goalRecord === 0 ? 'not-allowed' : '',
                    }}
                  >
                    {text.goalRecord}
                  </span>
                )}
              </>
            );
          },
        },
        {
          title: t('IDS_ACTION'),
          align: 'center' as const,
          width: 50,
          render: (item: any) => (
            <>
              {item.checkFixed !== undefined && (
                <>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <MainButton
                      disabled={item.goalFixedRecord === item.totalRecord || item.totalRecord === 0 ? true : false}
                      type="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        fixedGoal(item);
                      }}
                    >
                      {t('POPUP_DIALOG.BUTTON.IDM_CONFIRM_FIXED_EVALUATION')}
                    </MainButton>
                  </div>
                  <div>
                    <Typography.Text style={{ fontSize: 10 }}>
                      {item.goalFixedRecord}
                      {t('IDS_RECORD')}/{item.totalRecord}
                      {t('IDS_RECORD')}
                      <Tooltip placement="top" title={t('IDS_UNDO')}>
                        <UndoOutlined
                          style={{
                            color:
                              item.checkFixed !== 2 &&
                              moment(item.personalEvaluation?.split(' ～ ')[0]).format('YYYY/MM/DD') >=
                                moment().format('YYYY/MM/DD') &&
                              moment(item.divisionEvaluate?.split(' ～ ')[0]).format('YYYY/MM/DD') >=
                                moment().format('YYYY/MM/DD')
                                ? // && (item.goals?.split(' ～ ')[1] >= moment().format('YYYY/M/D') ||
                                  //   item.departmentGoals?.split(' ～ ')[1] >= moment().format('YYYY/M/D'))
                                  'blue'
                                : 'gray',
                            cursor:
                              item.checkFixed !== 2 &&
                              moment(item.personalEvaluation?.split(' ～ ')[0]).format('YYYY/MM/DD') >=
                                moment().format('YYYY/MM/DD') &&
                              moment(item.divisionEvaluate?.split(' ～ ')[0]).format('YYYY/MM/DD') >=
                                moment().format('YYYY/MM/DD')
                                ? // && (item.goals?.split(' ～ ')[1] >= moment().format('YYYY/M/D') ||
                                  //   item.departmentGoals?.split(' ～ ')[1] >= moment().format('YYYY/M/D'))
                                  ''
                                : 'not-allowed',
                            fontSize: 15,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              item.checkFixed !== 2 &&
                              moment(item.personalEvaluation?.split(' ～ ')[0]).format('YYYY/MM/DD') >=
                                moment().format('YYYY/MM/DD') &&
                              moment(item.divisionEvaluate?.split(' ～ ')[0]).format('YYYY/MM/DD') >=
                                moment().format('YYYY/MM/DD')

                              // && (item.goals?.split(' ～ ')[1] >= moment().format('YYYY/M/D') ||
                              //   item.departmentGoals?.split(' ～ ')[1] >= moment().format('YYYY/M/D'))
                            )
                              undoFixGoal(item);
                          }}
                        />
                      </Tooltip>
                    </Typography.Text>
                  </div>
                </>
              )}
            </>
          ),
        },
      ],
    },

    {
      title: t('IDS_EVALUATION'),
      // children: [
      //   {
      //     title: t('IDS_DEPARTMENT_PERIOD'),
      //     dataIndex: 'divisionEvaluate',
      //     key: 'divisionEvaluate',
      //     align: 'center' as const,
      //     width: '13%',
      //   },
      //   {
      //     title: t('IDS_PERSONAL_PERIOD'),
      //     dataIndex: 'personalEvaluation',
      //     key: 'personalEvaluation',
      //     align: 'center' as const,
      //     width: '13%',
      //   },
      // ],
      width: '20%',
      render: (record: any) => {
        return (
          <>
            <Space direction="vertical" size={2} style={{ width: '100%' }}>
              {record.divisionEvaluate && (
                <Tooltip
                  title={
                    record.evalDeptRange?.start && record.evalDeptRange?.end
                      ? `${record.evalDeptRange.start} ～ ${record.evalDeptRange.end}`
                      : undefined
                  }
                  placement="top"
                >
                  <div style={{ cursor: record.evalDeptRange?.start ? 'help' : 'default' }}>
                    <Text strong style={{ color: '#1890ff', marginRight: 8 }}>
                      {t('IDS_DEPARTMENT_PERIOD')}:
                    </Text>
                    <Text>{record.divisionEvaluate}</Text>
                  </div>
                </Tooltip>
              )}

              {record.personalEvaluation && (
                <div>
                  <Text strong style={{ color: '#007240', marginRight: 8 }}>
                    {t('IDS_PERSONAL_PERIOD')}:
                  </Text>
                  <Text>{record.personalEvaluation}</Text>
                </div>
              )}
            </Space>
          </>
        );
      },
    },
    {
      title: t('IDS_FIX_EVALUATION'),
      children: [
        {
          title: t('IDS_ALERT'),
          align: 'center' as const,
          width: '10%',
          render: (text: any) => {
            return (
              <>
                {text.checkFixedNextPeriod !== null && (
                  <span
                    className="hover-btn-summary"
                    onClick={(e) => {
                      if (text.evaluationRecord > 0 && isDisplayLinkFixEvalation(text))
                        window.open(
                          `${urlCompanyCode()}/admin-evaluation/detail-evaluation-fixed?id=${
                            text.id
                          }&type=fixedEvaluation&year=${text.year}${
                            text.periodIndex === 1 ? t('IDS_FIRST_PERIOD_WITH_YEAR') : t('IDS_SECOND_PERIOD_WITH_YEAR')
                          }`,
                          '_blank',
                        );
                      e.stopPropagation();
                    }}
                    style={{
                      textDecoration:
                        text.evaluationRecord !== 0 && isDisplayLinkFixEvalation(text) ? 'underline' : 'none',
                      color: text.evaluationRecord !== 0 && isDisplayLinkFixEvalation(text) ? 'blue' : 'black',
                      cursor: text.evaluationRecord === 0 || !isDisplayLinkFixEvalation(text) ? 'not-allowed' : '',
                    }}
                  >
                    {text.evaluationRecord}
                  </span>
                )}
              </>
            );
          },
        },
        {
          title: t('IDS_ACTION'),
          align: 'center' as const,
          width: 50,
          render: (item: any) => {
            return (
              <>
                {item.checkFixedNextPeriod !== null && (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <MainButton
                        type="primary"
                        disabled={!isDisplayFixEvalation(item)}
                        onClick={(e) => {
                          e.stopPropagation();
                          fixedEvaluation(item);
                        }}
                      >
                        {t('POPUP_DIALOG.BUTTON.IDM_CONFIRM_FIXED_EVALUATION')}
                      </MainButton>
                    </div>
                    <div>
                      <Typography.Text style={{ fontSize: 10 }}>
                        {item.evaluationFixedRecord}
                        {t('IDS_RECORD')}/{item.totalRecord}
                        {t('IDS_RECORD')}
                        <Tooltip placement="top" title={t('IDS_UNDO')}>
                          <UndoOutlined
                            style={{
                              color: item.checkFixed !== 2 ? 'blue' : '',
                              cursor: item.checkFixed === 2 ? 'not-allowed' : '',
                              fontSize: 15,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (item.checkFixed !== 2) undoFixEvaluation(item);
                            }}
                          />
                        </Tooltip>
                      </Typography.Text>
                    </div>
                  </>
                )}
              </>
            );
          },
        },
      ],
    },
    {
      title: t('IDS_PUBLIC_EVALUATION'),
      children: [
        {
          title: t('IDS_ALERT'),
          align: 'center' as const,
          width: '10%',
          render: (text: any) => {
            return (
              <>
                {text.checkFixed !== undefined && (
                  <span
                    className="hover-btn-summary"
                    onClick={(e) => {
                      if (text.evaluationConfirmRecord > 0 && text.checkFixed === 1)
                        window.open(
                          `${urlCompanyCode()}/admin-evaluation/detail-evaluation-fixed?id=${
                            text.id
                          }&type=fixedEvaluationConfirm&year=${text.year}${
                            text.periodIndex === 1 ? t('IDS_FIRST_PERIOD_WITH_YEAR') : t('IDS_SECOND_PERIOD_WITH_YEAR')
                          }`,
                          '_blank',
                        );
                      e.stopPropagation();
                    }}
                    style={{
                      textDecoration:
                        text.evaluationConfirmRecord !== 0 && text.checkFixed === 1 ? 'underline' : 'none',
                      color: text.evaluationConfirmRecord !== 0 && text.checkFixed === 1 ? 'blue' : 'black',
                      cursor: text.evaluationConfirmRecord === 0 || text.checkFixed !== 1 ? 'not-allowed' : '',
                    }}
                  >
                    {text.evaluationConfirmRecord}
                  </span>
                )}
              </>
            );
          },
        },
        {
          title: t('IDS_ACTION'),
          align: 'center' as const,
          width: 10,
          render: (item: any) => (
            <>
              {item.checkFixed !== undefined && (
                <>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <MainButton
                      type="primary"
                      disabled={!isDisplayPublicEvaluation(item)}
                      onClick={(e) => {
                        e.stopPropagation();
                        fixedEvaluationPublic(item);
                      }}
                    >
                      {t('POPUP_DIALOG.BUTTON.IDM_CONFIRM_FIXED_EVALUATION_PUBLIC')}
                    </MainButton>
                  </div>
                  <div>
                    <Typography.Text style={{ fontSize: 10 }}>
                      {item.evaluationConfirmFixedRecord}
                      {t('IDS_RECORD')}/{item.totalRecord}
                      {t('IDS_RECORD')}
                    </Typography.Text>
                  </div>
                </>
              )}
            </>
          ),
        },
      ],
    },
  ];
};

export default ColumnEvaluationPeriodList;
