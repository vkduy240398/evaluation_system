import { Space } from 'antd';
import { t } from 'i18next';
import PrintParentEvaluation from '../../../evaluation-print-review/evaluation-list/printParentEvaluation';

const ColumnListEvaluations = (isLoading: any, setIsLoading: any, setOpenParentPDF: any, setRecord: any, role: any) => {
  return [
    {
      title: t('IDS_EVALUATION_PERIOD'),
      dataIndex: 'year',
      width: '15rem',
    },
    {
      title: t('IDS_STATUS'),
      dataIndex: 'status',
      align: 'left' as const,
      width: '15rem',
    },
    {
      title: t('IDS_EVALUATOR_1'),
      dataIndex: 'evaluator1',
      align: 'left' as const,
      width: '15rem',
    },
    {
      title: t('IDS_EVALUATOR_2'),
      dataIndex: 'evaluator2',
      align: 'left' as const,
      width: '15rem',
    },
    {
      title: t('IDS_EVALUATION_RESULT'),
      dataIndex: 'totalPoint',
      align: 'center' as const,
      width: '15rem',
      render: (text: number, _record: any) => {
        const results =
          _record.childrens &&
          _record.childrens.filter((v: any) => v.level >= 8 && v.statusNo === 100).length ===
            _record.childrens.length &&
          text
            ? Number(text).toFixed(1)
            : _record.summaryPointEvaluator2 || _record.totalPoint;

        return <> {_record.statusNo === 100 ? (_record.stringSummary == '-' ? _record.stringSummary : results) : ''}</>;
      },
    },
    {
      title: t('IDS_OUTPUT'),
      dataIndex: 'action',
      key: 'action',
      width: '5rem',
      align: 'center' as const,
      render: (_text: any, record: any) => {
        let isDisabled = true;
        if (record.childrens) {
          record.childrens.map((item: any) => {
            if (item.statusNo === 100) {
              isDisabled = false;
            }
          });
        } else {
          if (record.statusNo === 100) {
            isDisabled = false;
          }
        }

        return (
          <Space>
            <PrintParentEvaluation params={record} role={role} isDisabled={isDisabled} />
          </Space>
        );
      },
    },
  ];
};

export default ColumnListEvaluations;
