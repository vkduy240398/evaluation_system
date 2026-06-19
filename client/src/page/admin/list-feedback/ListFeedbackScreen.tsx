import { Form, message, Typography } from 'antd';
import { t } from 'i18next';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import adminEvaluationApiService from '../../../common/api/adminEvaluationPro';
import feedbackApiService from '../../../common/api/feedback';
import PaginationV2 from '../../../common/PaginationV2';
import { listDepartment } from '../../../model/department';
import ListFeedbackTable from './components/ListFeedbackTable';
import SearchFeedback from './components/SearchFeedback';
import httpAxios from '../../../common/http';
import { FeedbackList, FeedbackListData, FeedbackListSearchConditions, FeedbackStatus } from '../../../model/Feedback';
import { urlCompanyCode } from '../../../common/util';

const ListFeedbackScreen = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const now = moment();
  const current = moment(now).format('YYYY/M/D');
  const [conditions, setConditions] = useState(
    location.state || {
      offset: 0,
      limit: 20,
      sortBy: 'timeCreated',
      sortType: 'ASC',
      user: '',
      dateStart: current,
      dateEnd: current,
      typeFeedback: '0,1',
      statusFeedback: '2,3,4,5,6,7',
      department: 'すべて',
      current: 1,
    },
  );
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [dataSources, setDataSources] = useState<FeedbackList>({
    counts: 0,
    data: [],
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [departments, setDepartments] = useState<listDepartment[]>([]);

  const typeFeedbacks = [
    { value: '0,1', label: t('IDS_ALL') },
    { value: '1', label: t('IDS_TYPE_FEEDBACK_OPTIONS.IDS_BUG') },
    { value: '0', label: t('IDS_TYPE_FEEDBACK_OPTIONS.IDS_REQUIREMENT') },
  ];

  const statusFeedbacks = [
    { value: '2,3,4,5,6,7', label: t('IDS_ALL') },

    // { value: '1', label: t('IDS_STATUS_OPTIONS.IDS_SAVE_DRAFT') },
    { value: '2', label: t('IDS_STATUS_OPTIONS.IDS_SUBMIT') },
    { value: '3', label: t('IDS_STATUS_OPTIONS.IDS_APPROVE') },
    { value: '4', label: t('IDS_STATUS_OPTIONS.IDS_PENDING') },
    { value: '5', label: t('IDS_STATUS_OPTIONS.IDS_CLOSE') },
    { value: '6', label: t('IDS_STATUS_OPTIONS.IDS_IN_PROGRESS') },
    { value: '7', label: t('IDS_STATUS_OPTIONS.IDS_DONE') },
  ];

  const handleSearch = (searchConditions: FeedbackListSearchConditions) => {
    // call API and set data
    feedbackApiService.listFeedback(searchConditions, callBackListFeedback, setIsLoading);

    setConditions({ ...searchConditions, search: true });
    navigate(urlCompanyCode() + '/admin-evaluation/list-feedback', {
      replace: true,
      state: {
        ...searchConditions,
        search: true,
      },
    });
  };

  const callBackListFeedback = (data: FeedbackList) => {
    setDataSources(data);
  };

  const handleFinish = () => {
    const typeFeedback = form.getFieldValue('typeFeedback');
    const department = form.getFieldValue('department');
    const user = form.getFieldValue('user');
    const rangeTime = form.getFieldValue('rangeTime');
    const dateStart = moment(rangeTime[0].$d).format('YYYY/M/D');
    const dateEnd = moment(rangeTime[1].$d).format('YYYY/M/D');
    const statusFeedback = form.getFieldValue('statusFeedback');

    const newConditions = {
      ...conditions,
      search: true,
      department,
      typeFeedback,
      user,
      dateStart,
      dateEnd,
      statusFeedback,
      current: 1,
      offset: 0,
      limit: 20,
    };

    handleSearch({ ...newConditions });
    setConditions({ ...newConditions });
    navigate(urlCompanyCode() + '/admin-evaluation/list-feedback', {
      replace: true,
      state: {
        ...newConditions,
      },
    });
  };
  const handleDownloadExcel = () => {
    const callbackExcel = (data: any) => {
      if (data) {
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', (t('IDL_LIST_MENU_F5', { returnObjects: true }) as any)[4]);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    feedbackApiService.downloadExcel(conditions, callbackExcel, setIsLoading);
  };

  const handleDelete = async () => {
    setIsLoading(true);

    const data = {
      selectedKeyDeleted: selectedRowKeys,
    };

    await httpAxios.Put(`/api/v1/f5/management-evaluation-history/delete-feedback`, { ...data }).then((res) => {
      if (res && res.status === 200) {
        message.success(t('MESSAGE.COMMON.IDM_DELETE_USER_SUCCESS'));
        handleSearch(location.state);
      }
    });

    setSelectedRows([]);
    setSelectedRowKeys([]);
    setIsOpenModal(false);
    setIsLoading(false);
  };

  const callback = (data: listDepartment[]) => {
    setDepartments(data);
  };

  const errorCallback = () => {
    console.log('err');
  };

  useEffect(() => {
    if (conditions?.search && location.state) {
      handleSearch(location.state);
    } else {
      setDataSources({
        counts: 0,
        data: [],
      });
      setConditions({ ...conditions, search: false });
      navigate(urlCompanyCode() + '/admin-evaluation/list-feedback', {
        replace: true,
        state: {
          ...conditions,
          search: false,
        },
      });
    }
  }, []);

  useEffect(() => {
    adminEvaluationApiService.getDepartments({ callback, errorCallback });
  }, []);

  return (
    <>
      <Typography.Title level={3}>{(t('IDL_LIST_MENU_F5', { returnObjects: true }) as any)[4]}</Typography.Title>
      <SearchFeedback
        form={form}
        conditions={conditions}
        onFinish={handleFinish}
        isLoading={isLoading}
        departments={departments}
        typeFeedback={typeFeedbacks}
        statusFeedback={statusFeedbacks}
      />
      {conditions?.search && (
        <ListFeedbackTable
          isLoading={isLoading}
          dataSources={dataSources}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          setSelectedRows={setSelectedRows}
          navigate={navigate}
          setIsOpenModal={setIsOpenModal}
          handleDownloadExcel={handleDownloadExcel}
        />
      )}
      {dataSources?.data && dataSources?.data.length > 0 && conditions?.search && (
        <PaginationV2
          conditions={conditions}
          currents={conditions.current}
          dataSources={dataSources}
          errorCallBack={setIsLoading}
          limit={conditions.limit}
          location={location}
          navigates={navigate}
          setDataSources={setDataSources}
          url={'/api/v1/f5/management-evaluation-history/list-feedback'}
          loading={isLoading}
          setLoading={setIsLoading}
          setSelectedRowKeys={setSelectedRowKeys}
          setSelectedRows={setSelectedRows}
        />
      )}
      <ModalCustomComponent
        isOpen={isOpenModal}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_DELETE_FEEDBACK')}
        fnHandleOk={handleDelete}
        fnHandleCancel={() => {
          setIsOpenModal(false);
        }}
        okText={t('IDS_DELETE') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
        loading={isLoading}
      />
    </>
  );
};

export default ListFeedbackScreen;
