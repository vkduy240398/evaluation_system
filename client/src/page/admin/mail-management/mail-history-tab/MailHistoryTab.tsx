import { DeleteOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Grid, message, Space, Table } from 'antd';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import DetailMailHistory from './DetailMailHistory';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import { MailProperty, conditionsMailHistory } from '../interfaces/interfacesProps';
import SearchFormHistoryMail from './components/SearchFormHistoryMail';
import mailManagementServices from '../../../../common/api/mailManagement';
import { EvaluationPeriodHelper } from '../../../../common/utils/datetime/EvaluationPeriodHelper';
import PaginationHistoryMail from './components/PaginationHistoryMail';
import moment from 'moment';
import { useAuth } from '../../../../hooks/useAuth';

interface Props {
  state: any;
}

let temp = ``;
const MailHistoryTab: React.FC<Props> = (props: Props) => {
  const { state } = props;

  const navigate1 = useNavigate();

  const location1 = useLocation();

  const breaks = Grid.useBreakpoint();

  const [dataTables, setDataTable] = useState({
    results: [],
    counts: 0,
  } as { results: MailProperty[]; counts: number });

  const year = new Date();
  year.setFullYear(location1.state && location1.state.yearCalendar ? location1.state.yearCalendar : year.getFullYear());
  const auth = useAuth();
  const [conditions, setConditions] = useState(
    location1.state && location1.state.searchHistory
      ? location1.state
      : {
          ...location1.state,
          yearStart: EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo'),
          yearEnd: EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo'),
          periodIndex:
            EvaluationPeriodHelper.getCurrentPeriodIndex(auth.user?.timeZone || 'Asia/Tokyo') === '上期' ? 1 : 2,
          status: -1,
          offset: 0,
          limit: 20,
          current: 1,
          searchHistory: false,
        },
  );

  const [isOpen, setOpen] = useState(false);

  const [recordInfos, setRecordInfo] = useState({} as MailProperty);

  const [isLoading, setLoading] = useState(false);

  const [isOpenDelete, setOpenDelete] = useState(false);

  const [deleteRecords, setDeleteRecord] = useState({} as MailProperty);

  useEffect(() => {
    navigate1(location1.pathname, {
      replace: true,
      state: conditions,
    });
    if (conditions.searchHistory) {
      handleSearchHistoryMail({ ...conditions, year: dayjs(conditions.yearCalendar, 'YYYY').format('YYYY') });
    }
  }, []);

  // useEffect(() => {
  //   navigate1(location1.pathname, {
  //     replace: true,
  //     state: conditions,
  //   });
  //   if (conditions.searchHistory) {
  //     handleSearchHistoryMail({...conditions,
  //       year: dayjs(conditions.yearCalendar, 'YYYY').format('YYYY'),
  //     });
  //   }
  // }, [conditions]);

  const handleSearchHistoryMail = async (dataSearch: conditionsMailHistory) => {
    await mailManagementServices.getMailHistoryList(processingData, dataSearch, setLoading);
  };

  const processingData = async (resData: { results: MailProperty[]; counts: number }) => {
    resData.results.map((item: MailProperty) => {
      item.key = item.id;
    });
    setDataTable({ results: resData.results, counts: resData.counts });
    if (resData.results.length === 0 && location1.state.current > 1 && resData.counts > 0) {
      await navigate1(location1.pathname, {
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

  const callBack = () => {
    message.success(t('MESSAGE.COMMON.IDM_DELETE_MAIL_SUCCESS'));
    handleSearchHistoryMail(conditions);
  };

  const handleDelete = async () => {
    await mailManagementServices.deleteMail(callBack, deleteRecords.id, setLoading);
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
      render: (text: string) => {
        return <>{text ? moment(text).format('YYYY/M/D H:mm') : ''}</>;
      },
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
      <SearchFormHistoryMail
        handleSearchHistoryMail={handleSearchHistoryMail}
        setConditions={setConditions}
        conditions={conditions}
        state={state}
        isLoading={isLoading}
      />
      {location1.state && location1.state.searchHistory && (
        <Table
          size="small"
          style={{ wordBreak: 'break-all', marginTop: 20 }}
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
      )}
      {dataTables.counts && location1.state && location1.state.searchHistory ? (
        // <PaginationV2
        //   conditions={{...conditions,
        //     year: dayjs(conditions.yearCalendar, 'YYYY').format('YYYY')
        //   }}
        //   currents={conditions.current}
        //   dataSources={dataTables}
        //   errorCallBack={errorCallBack}
        //   limit={20}
        //   location={location1}
        //   navigates={navigate1}
        //   setDataSources={setDataTable}
        //   url={'/api/v1/f7/management-evaluation-setting/mail-history-list'}
        //   loading={isLoading}
        //   setLoading={setLoading}
        // />
        <PaginationHistoryMail
          conditions={{ ...conditions, year: dayjs(conditions.yearCalendar, 'YYYY').format('YYYY') }}
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
          setConditions={setConditions}
        />
      ) : (
        <></>
      )}
      {isOpen === true && (
        <DetailMailHistory
          key={recordInfos.id}
          recordInfo={recordInfos}
          state={location1.state ?? conditions}
          conditions={conditions}
          // setCondition={setConditions}
          handleSearchHistoryMail={handleSearchHistoryMail}
          isOpen={isOpen}
          setOpen={setOpen}
          handleClose={handleClose}
          isLoading={isLoading}
          setLoading={setLoading}
          location={location1}
          navigate={navigate1}
          mailContent={temp}
        />
      )}
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
export default MailHistoryTab;
