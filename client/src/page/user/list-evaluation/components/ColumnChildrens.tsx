import { FilePdfOutlined } from '@ant-design/icons';
import { Button, Space, Tooltip } from 'antd';
import { t } from 'i18next';
import PrintChildrenEvaluation from '../../../evaluation-print-review/evaluation-list/printChildrenEvaluation';

const ColumnChildrens = (isLoading: any, setIsLoading: any, setOpenChildPDF: any, setRecord: any, role: any) => {
  // const handleDownLoadPDF = async (record: any) => {
  //   await evaluationDetailApiService.donwloadPDFOnList(
  //     record.evaluationId,
  //     'user',
  //     record.userInfo.id,
  //     record.level,
  //     'p',
  //     'a4',
  //     callBack,
  //   );
  // };
  // const callBack = (response: any) => {
  //   const buffer = Buffer.from(response.buffer);
  //   const blob = new Blob(['\uFEFF', buffer], {
  //     type: 'application/pdf',
  //   });
  //   download(blob, response.fileName, 'application/pdf');
  //   setIsLoading(false);
  // };

  return [
    {
      dataIndex: 'year',
      width: '15rem',
    },
    {
      dataIndex: 'status',
      align: 'left' as const,
      width: '15rem',
    },
    {
      dataIndex: 'evaluator1',
      align: 'left' as const,
      width: '15rem',
    },
    {
      dataIndex: 'evaluator2',
      align: 'left' as const,
      width: '15rem',
    },
    {
      dataIndex: 'totalPoint',
      align: 'center' as const,
      width: '15rem',
      render: (text: number, _record: any) => {
        return <> {_record.statusNo === 100 ? (_record.level >= 8 && text ? Number(text).toFixed(1) : text) : ''}</>;
      },
    },
    {
      dataIndex: 'action',
      key: 'action',
      width: '5rem',
      align: 'center' as const,
      render: (_text: any, record: any) => {
        return (
          <Space>
            {/* <Tooltip placement="topRight" title={record.statusNo < 100 ? '' : t('IDS_BUTTON_OUTPUT_PDF')} color="grey"> */}
            {/* <Icon
                component={FilePdfOutlined as React.ForwardRefExoticComponent<any>}
                style={{ color: 'red' }}
                onClick={() => handleDownLoadPDF(record)}
              /> */}
            {/* <Button
                disabled={record.statusNo < 100}
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
              /> */}
            {/* </Tooltip> */}
            <PrintChildrenEvaluation params={record} role={role} isDisabled={record.statusNo < 100} />
          </Space>
        );
      },
    },
  ];
};

export default ColumnChildrens;
