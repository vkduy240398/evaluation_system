import { Space } from 'antd';
import { t } from 'i18next';
import {
  evaluationOrder,
  orderEvaluation,
  statusEvaluationObj,
  statusEvaluationObj1,
  statusEvaluationType,
} from '../../../../common/status';
import { isFormatDate } from '../../../../common/util';
import PrintParentEvaluation from '../../../evaluation-print-review/evaluation-list/printParentEvaluation';
import { ParentProps } from '../interfaces/interfaces';
import SortColumnTitle from '../../../../common/SortColumnTitle';
import { ColumnType } from 'antd/es/table';

const ParentColumns = (
  isLoading: boolean,
  setIsLoading: (bool: boolean) => void,
  setOpenParentPDF: (value: boolean) => void,
  setRecord: (record: ParentProps) => void,
  role: any,
  setCondition: any,
  sortColumns: any,
  sortDirections: any,
): ColumnType<any>[] => {
  const getPreviousSortDirection = (row: string): 'ascend' | 'descend' | undefined => {
    const index = sortColumns?.indexOf(row);
    if (index === undefined || index < 0) {
      return undefined;
    } else {
      return sortDirections[index];
    }
  };

  return [
    {
      title: t('IDS_EVALUATION_PERIOD'),
      dataIndex: 'title',
      width: '10%',
      align: 'left' as const,
    },
    {
      title: t('IDS_FULLNAME'),
      dataIndex: 'fullName',
      width: '20%',
      align: 'left' as const,
    },
    {
      title: ({ sortColumns }) => (
        <SortColumnTitle
          title={t('IDS_LEVEL')}
          sortOrder={sortColumns?.find(({ column }) => column.dataIndex === 'level')?.order}
        />
      ),
      dataIndex: 'level',
      width: '5%',
      align: 'center' as const,
      render: (_text: string, record: any) => {
        return <>{record.childs?.length > 0 ? '' : _text}</>;
      },
      sorter: { multiple: 2 },
      defaultSortOrder: getPreviousSortDirection('level'),
    },
    {
      title: t('IDS_DEPARTMENT'),
      dataIndex: 'department',
      width: '15%',
      align: 'left' as const,
      render: (_text: string, record: any) => {
        return (
          <div style={{ maxWidth: '300px' }}>
            {record.childs?.length > 0 ? (
              ''
            ) : (
              <>
                {record?.divisionName && `${t('IDS_TYPE_DIVISION')}: ${record?.divisionName}`}
                {record?.departmentName && `\n${t('IDS_TYPE_DEPARTMENT_NAME')}: ${record?.departmentName}`}
              </>
            )}
          </div>
        );
      },
    },
    {
      title: t('IDS_DISPLAY_ORDER'),
      dataIndex: 'order_rating',
      width: '10%',
      align: 'left' as const,
      render: (_text: string, record: any) => {
        const order: orderEvaluation = record.evaluationOrder;

        return <>{record.childs?.length > 0 ? '' : order !== 0 ? evaluationOrder[order?.toFixed(1)] : ''}</>;
      },
    },
    {
      title: ({ sortColumns }) => (
        <SortColumnTitle
          title={t('IDS_STATUS')}
          sortOrder={sortColumns?.find(({ column }) => column.dataIndex === 'status')?.order}
        />
      ),
      dataIndex: 'status',
      width: '20%',
      align: 'left' as const,
      render: (text: statusEvaluationType, record: any) => {
        const currentDate = new Date();
        let stringStatus = '';
        if (record.childs) {
          // Tìm giá trị status nhỏ nhất
          const minStatus = Math.min(...record.childs.map((item: any) => item.status)) as statusEvaluationType;

          stringStatus = statusEvaluationObj[minStatus];
          if (minStatus == 50) {
            // Lọc các đối tượng có status bằng giá trị nhỏ nhất
            const candidates = record.childs.filter((item: any) => item.status === minStatus);
            if (candidates?.length == 1) {
              if (
                isFormatDate(currentDate, 'YYYY/MM/DD') >=
                  isFormatDate(candidates[0].dateEvaluationStartEval, 'YYYY/MM/DD') &&
                isFormatDate(currentDate, 'YYYY/MM/DD') <=
                  isFormatDate(candidates[0].dateEvaluationEndEval, 'YYYY/MM/DD')
              ) {
                stringStatus = statusEvaluationObj1[minStatus].split('/')[1];
              }
            } else {
              const filteredCandidates = candidates.filter(
                (item: any) =>
                  isFormatDate(currentDate, 'YYYY/MM/DD') >= isFormatDate(item.dateEvaluationStartEval, 'YYYY/MM/DD') &&
                  isFormatDate(currentDate, 'YYYY/MM/DD') <= isFormatDate(item.dateEvaluationEndEval, 'YYYY/MM/DD'),
              );
              if (filteredCandidates?.length == candidates?.length) {
                stringStatus = statusEvaluationObj1[minStatus].split('/')[1];
              }
            }
          }
        } else {
          if (
            text == 50 &&
            isFormatDate(currentDate, 'YYYY/MM/DD') >= isFormatDate(record.dateEvaluationStartEval, 'YYYY/MM/DD') &&
            isFormatDate(currentDate, 'YYYY/MM/DD') <= isFormatDate(record.dateEvaluationEndEval, 'YYYY/MM/DD')
          ) {
            stringStatus = statusEvaluationObj1[text].split('/')[1];
          } else {
            stringStatus = statusEvaluationObj[text];
          }
        }

        return <>{stringStatus}</>;
      },
      sorter: { multiple: 2 },
      defaultSortOrder: getPreviousSortDirection('status'),
    },
    {
      title: t('IDS_EVALUATION_RESULT'),
      dataIndex: 'summaryPointEvaluator2',
      width: '10%',
      align: 'center' as const,
      render: (text: number, _record: any) => {
        const results =
          _record.childs &&
          _record.childs.filter((v: any) => v.level >= 8 && v.status === 100).length === _record.childs.length &&
          text
            ? Number(text).toFixed(1)
            : text;

        return (
          <>
            {_record.status === 100
              ? _record.summaryPointEvaluator2 == '-'
                ? _record.summaryPointEvaluator2
                : results
              : ''}
          </>
        );
      },
    },
    {
      title: t('IDS_OUTPUT'),
      dataIndex: 'action',
      width: '5%',
      align: 'center' as const,
      render: (_text: string, record: any) => {
        let isDisabled = true;
        if (record.childs) {
          record.childs.some((item: any) => {
            if (item.status === 100) {
              isDisabled = false;
            }
          });
        } else {
          if (record.status === 100) {
            isDisabled = false;
          }
        }

        return (
          <Space size="middle">
            <PrintParentEvaluation params={record} role={role} isDisabled={isDisabled} />
          </Space>
        );
      },
    },
  ];
};

export default ParentColumns;
