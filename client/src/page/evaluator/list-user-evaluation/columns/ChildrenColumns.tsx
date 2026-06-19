import { FilePdfOutlined } from '@ant-design/icons';
import { Button, Space, Tooltip } from 'antd';
import {
  evaluationOrder,
  orderEvaluation,
  statusEvaluationObj,
  statusEvaluationObj1,
  statusEvaluationType,
} from '../../../../common/status';
import { t } from 'i18next';
import { PropsPdf } from '../interfaces/interfaces';
import PrintChildrenEvaluation from '../../../evaluation-print-review/evaluation-list/printChildrenEvaluation';
import { isFormatDate } from '../../../../common/util';

const ChildrenColumns = (
  isLoading: boolean,
  setIsLoading: (bool: boolean) => void,
  setOpenChildPDF: (value: boolean) => void,
  setRecord: (record: PropsPdf) => void,
  role: any,
) => {
  // const handleDownLoadPDF = async (record: PropsPdf) => {
  //   await evaluationDetailApiService.donwloadPDFOnList(
  //     record.evaluationId,
  //     'evaluator',
  //     record.evaluatorId,
  //     record.level,
  //     'p',
  //     'a4',
  //     callBack,
  //   );
  // };
  // const callBack = (response: { buffer: string; fileName: string }) => {
  //   const buffer = Buffer.from(response.buffer);
  //   const blob = new Blob(['\uFEFF', buffer], {
  //     type: 'application/pdf',
  //   });
  //   download(blob, response.fileName, 'application/pdf');
  //   setIsLoading(false);
  // };

  return [
    {
      dataIndex: 'title',
      width: '10%',
      align: 'left' as const,
    },
    {
      dataIndex: 'fullName',
      width: '20%',
      align: 'left' as const,
    },
    {
      dataIndex: 'level',
      width: '5%',
      align: 'center' as const,
    },
    {
      dataIndex: 'department',
      width: '15%',
      align: 'left' as const,
      render: (_text: string, record: any) => {
        return (
          <div style={{ maxWidth: '300px', wordBreak: 'break-word' }}>
            {record?.divisionName && `${t('IDS_TYPE_DIVISION')}: ${record?.divisionName}`}
            {record?.departmentName && `\n${t('IDS_TYPE_DEPARTMENT_NAME')}: ${record?.departmentName}`}
          </div>
        );
      },
    },
    {
      dataIndex: 'order_rating',
      width: '10%',
      align: 'left' as const,
      render: (_text: string, record: any) => {
        const order: orderEvaluation = record.evaluationOrder;

        return <>{order !== 0 && order !== undefined ? evaluationOrder[order?.toFixed(1)] : ''}</>;
      },
    },
    {
      dataIndex: 'status',
      width: '20%',
      align: 'left' as const,
      render: (text: statusEvaluationType, record: any) => {
        const currentDate = new Date();
        let stringStatus = '';
        if (
          text == 50 &&
          isFormatDate(currentDate, 'YYYY/MM/DD') >= isFormatDate(record.dateEvaluationStartEval, 'YYYY/MM/DD') &&
          isFormatDate(currentDate, 'YYYY/MM/DD') <= isFormatDate(record.dateEvaluationEndEval, 'YYYY/MM/DD')
        ) {
          stringStatus = statusEvaluationObj1[text].split('/')[1];
        } else {
          stringStatus = statusEvaluationObj[text];
        }

        return <>{stringStatus}</>;
      },
    },
    {
      dataIndex: 'summaryPointEvaluator2',
      width: '10%',
      align: 'center' as const,
      render: (_text: string, record: any) => {
        return (
          <>
            {record.status === 100 &&
            record.summaryPointEvaluator2 !== undefined &&
            record.summaryPointEvaluator2 !== null
              ? record.summaryPointEvaluator2
              : ''}
          </>
        );
      },
    },
    {
      dataIndex: 'action',
      width: '5%',
      align: 'center' as const,
      render: (_text: string, record: any) => {
        return (
          <Space size="middle">
            {/* <Tooltip placement="topRight" title={record.status < 100 ? '' : t('IDS_BUTTON_OUTPUT_PDF')} color="grey">
              <Button
                disabled={record.status < 100}
                loading={isLoading}
                icon={<FilePdfOutlined />}
                style={{ color: '#007240 ' }}
                onClick={async (e) => {
                  // setIsLoading(true);
                  e.stopPropagation();

                  // await handleDownLoadPDF(record);
                  // setIsLoading(false);
                  setOpenChildPDF(true);
                  setRecord(record);
                }}
              />
            </Tooltip> */}
            <PrintChildrenEvaluation params={record} role={role} isDisabled={record.status < 100} />
          </Space>
        );
      },
    },
  ];
};

export default ChildrenColumns;
