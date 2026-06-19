import { DeleteOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Grid, Space, Table } from 'antd';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import evaluationPeriodServices from '../../../../../common/api/evaluationPeriod';
import DetailMailHistory from './DetailMailHistory';
import PaginationV2 from '../../../../../common/PaginationV2';
import ModalCustomComponent from '../../../../../@core/components/modal-custom';
import { MailProperty } from '../interfaces/interfacesProps';
import { useTranslation } from 'react-i18next';

let temp = ``;
const MailHistoryList: React.FC = () => {
  const navigate1 = useNavigate();

  const location1 = useLocation();

  const breaks = Grid.useBreakpoint();

  const [dataTables, setDataTable] = useState({
    results: [],
    counts: 0,
  } as { results: MailProperty[]; counts: number });

  const [conditions, _setCondition] = useState(location1.state);

  const [isOpen, setOpen] = useState(false);

  const [recordInfos, setRecordInfo] = useState({} as MailProperty);

  const [isLoading, setLoading] = useState(false);

  const [isOpenDelete, setOpenDelete] = useState(false);

  const [deleteRecords, setDeleteRecord] = useState({} as MailProperty);

  const { i18n } = useTranslation();
  useEffect(() => {
    if (location1.state.type === '4') {
      loadTable();
    }
  }, [location1.state]);

  const loadTable = async () => {
    await evaluationPeriodServices.getMailHistoryList(processingData, location1.state, setLoading);
  };

  const processingData = async (resData: { results: MailProperty[]; counts: number }) => {
    resData.results.map((item: MailProperty) => {
      item.key = item.id;
    });
    setDataTable({ results: resData.results, counts: resData.counts });
    if (resData.results.length === 0 && location1.state.current > 1 && resData.counts > 0) {
      await navigate1(location.pathname, {
        replace: true,
        state: {
          ...conditions,
          offset: location1.state.offset - location1.state.limit,
          current: location1.state.current - 1,
        },
      });
    }
    setLoading(false);
  };

  const onClickDelete = (record: MailProperty) => {
    setOpenDelete(true);
    setDeleteRecord(record);
  };

  const handleDelete = async () => {
    await evaluationPeriodServices.deleteMail(loadTable, deleteRecords.id, setLoading);
    setOpenDelete(false);
  };

  const columns = [
    {
      title: t('IDS_CLASSIFICATION'),
      dataIndex: 'type',
      key: 'type',
      align: 'left' as const,
      width: '20%',
    },
    {
      title: t('IDS_MAIL_SUBJECT'),
      dataIndex: 'title',
      key: 'title',
      align: 'left' as const,
      width: '42%',
    },
    {
      title: t('IDS_STATUS'),
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      width: '8%',
      render: (text: string) => {
        return <>{text == '0' ? t('IDS_NOT_SEND') : t('IDS_SEND')}</>;
      },
    },
    {
      title: t('IDS_MAIL_SETTING_TIME'),
      dataIndex: 'sendTimeSetting',
      key: 'sendTimeSetting',
      align: 'center' as const,
      width: '13%',
    },
    {
      title: t('IDS_ACTUAL_SEND_TIME'),
      dataIndex: 'sendTimeActual',
      key: 'sendTimeActual',
      align: 'center' as const,
      width: '13%',
    },

    {
      title: t('IDS_ACTION'),
      dataIndex: 'action',
      key: 'action',
      width: '10%',
      align: 'center' as const,
      render: (_text: string, record: MailProperty) => {
        return (
          <>
            <Space size="middle">
              <Button
                icon={<MailOutlined />}
                style={{ color: '#007240 ' }}
                onClick={async (event) => {
                  event.stopPropagation();
                  handleEdit(record);
                }}
              />

              <Button
                icon={<DeleteOutlined />}
                style={{ color: '#007240 ' }}
                onClick={async (event) => {
                  event.stopPropagation();
                  onClickDelete(record);
                }}
                disabled={record.status === 1}
              />
            </Space>
          </>
        );
      },
    },
  ];

  const handleEdit = (data: MailProperty) => {
    setOpen(true);
    setRecordInfo(data);
    temp = data.contentMail;

    // temp = temp.replaceAll('<div>', '');
    // temp = temp.replaceAll('</p><p><br></p><p>', '<br><br><br>');
    // temp = temp.replaceAll('</p><p>', '<br><br>');
  };

  const handleClose = () => {
    setOpen(false);
  };

  const errorCallBack = () => {
    setLoading(false);
  };

  return (
    <div>
      <Table
        size="small"
        style={{ wordBreak: 'break-all' }}
        columns={columns}
        dataSource={dataTables.results}
        bordered
        locale={{
          emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
        }}
        loading={isLoading}
        pagination={false}
        scroll={{ x: !breaks.lg ? 900 : undefined }}
      ></Table>
      {dataTables.counts ? (
        <PaginationV2
          conditions={conditions}
          currents={conditions.current}
          dataSources={dataTables}
          errorCallBack={errorCallBack}
          limit={20}
          location={location1}
          navigates={navigate1}
          setDataSources={setDataTable}
          url={'/api/v1/f7/management-evaluation-setting/mail-history-list'}
          loading={isLoading}
          setLoading={setLoading}
        />
      ) : (
        <></>
      )}
      <DetailMailHistory
        recordInfo={recordInfos}
        state={location1.state ?? conditions}
        isOpen={isOpen}
        setOpen={setOpen}
        handleClose={handleClose}
        isLoading={isLoading}
        setLoading={setLoading}
        location={location1}
        navigate={navigate1}
        mailContent={temp}
        i18n={i18n}
      />
      <ModalCustomComponent
        isOpen={isOpenDelete}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_DELETE_MAIL')}
        fnHandleOk={handleDelete}
        fnHandleCancel={() => setOpenDelete(false)}
        okText={t('IDS_DELETE') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
        loading={isLoading}
      />
    </div>
  );
};
export default MailHistoryList;
