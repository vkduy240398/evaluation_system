import { Button, Form, Select, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import PaginationV2 from '../../../common/PaginationV2';
import { SearchOutlined } from '@ant-design/icons';
import {
  ConditionListVersionNotification,
  ListVersionNotification,
  getOptionNotificationStatuses,
} from '../../../model/version-notification/ListVersionNotificationModel';
import ListVersionNotificationTable from '../../../views/admin-evaluation/list-version-notification/ListVersionNotificationTable';
import notificationApiService from '../../../common/api/version-notification';

const ListVersionNotificationScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [condition, setCondition] = useState<ConditionListVersionNotification>(
    location.state || {
      offset: 0,
      limit: 20,
      status: -1,
      current: 1,
    },
  );
  const [isLoading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ListVersionNotification>();
  const STATUS_SEARCH_ALL = -1;
  const [status, setStatus] = useState(location.state?.status || STATUS_SEARCH_ALL);
  const [form] = Form.useForm();
  const url = '/api/v1/f6/management-evaluation/list-version-notification';

  const handleSearch = () => {
    setCondition({
      ...condition,
      status: status,
      search: true,
      current: 1,
      offset: 0,
      limit: 20,
    });
  };

  const dataCallBack = (dataSource: ListVersionNotification) => {
    setDataSource(dataSource);
  };

  useEffect(() => {
    navigate(location.pathname, {
      replace: true,
      state: condition,
    });

    if (condition?.search) {
      getData();
    }
  }, [condition]);

  const getData = () => {
    const data = { ...condition };

    notificationApiService.getListVersionNotification(data, dataCallBack, setLoading);
  };

  const onChangeStatus = (value: any) => {
    setStatus(value);
  };

  return (
    <div>
      <Typography.Title level={3}>{(t('IDL_LIST_MENU_F6', { returnObjects: true }) as any)[6]}</Typography.Title>

      <Form
        form={form}
        initialValues={{ status: condition.status }}
        name="create_template_form"
        labelCol={{ span: 1 }}
        labelAlign="left"
        style={{ width: '100%' }}
        layout="horizontal"
        colon={false}
        onFinish={handleSearch}
      >
        <Form.Item label={t('IDS_STATUS')} colon={false} name="status">
          <Select
            style={{ width: '200px' }}
            options={getOptionNotificationStatuses()}
            defaultValue={status}
            onChange={onChangeStatus}
          />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            name="Search"
            value="Search"
            loading={isLoading}
            className="main_button"
            style={{ marginBottom: 15, marginTop: 10 }}
            icon={<SearchOutlined />}
          >
            {t('IDS_BUTTON_SEARCH')}
          </Button>
        </Form.Item>
      </Form>

      {condition?.search ? (
        <ListVersionNotificationTable
          dataSource={dataSource}
          setDataSource={setDataSource}
          setLoading={setLoading}
          condition={condition}
          setCondition={setCondition}
          isLoading={isLoading}
        />
      ) : (
        <></>
      )}

      {dataSource?.rows && dataSource?.rows.length > 0 && (
        <PaginationV2
          conditions={condition}
          currents={condition.current}
          dataSources={dataSource}
          errorCallBack={setLoading}
          limit={condition.limit}
          location={location}
          navigates={navigate}
          setDataSources={setDataSource}
          url={url}
          loading={isLoading}
          setLoading={setLoading}
        />
      )}
    </div>
  );
};

export default ListVersionNotificationScreen;
