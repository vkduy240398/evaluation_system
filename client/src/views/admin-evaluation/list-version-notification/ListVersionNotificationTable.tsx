import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import { getListVersionNotificationColumn } from './ListVersionNotificationColumn';
import {
  ConditionListVersionNotification,
  ListVersionNotification,
} from '../../../model/version-notification/ListVersionNotificationModel';
import { urlCompanyCode } from '../../../common/util';

interface Props {
  dataSource: ListVersionNotification | undefined;
  setDataSource: (data: any) => void;
  condition: ConditionListVersionNotification;
  setCondition: (data: any) => void;
  setLoading: (data: any) => void;
  isLoading: boolean;
}

const ListVersionNotificationTable = (props: Props) => {
  const navigate = useNavigate();

  return (
    <div>
      <Table
        bordered
        rowKey={(row) => row.id}
        scroll={{ x: 768 }}
        dataSource={props.dataSource?.rows}
        columns={getListVersionNotificationColumn()}
        loading={props.isLoading}
        pagination={false}
        size="small"
        className={'ant-custom-table-title hover-table-currsor-pointerant-custom-table hover-table-currsor-pointer'}
        locale={{
          emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
        }}
        onRow={(record) => {
          return {
            onClick: (_e) => {
              navigate(urlCompanyCode() + '/' + window.location.pathname.split('/')[3] + '/notification-detail', {
                state: { record: record },
              });
            },
          };
        }}
      />
    </div>
  );
};

export default ListVersionNotificationTable;
