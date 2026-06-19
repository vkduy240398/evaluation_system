import { Table } from 'antd';
import { t } from 'i18next';
interface Props {
  column: any;
  dataSources: any[] | undefined;
  isLoading: boolean;
}
const TableComponent = (props: Props) => {
  const { column, dataSources, isLoading } = props;

  return (
    <>
      {/* { !props.readOnly && <Typography.Title level={4}>基本スキル</Typography.Title> } */}
      <Table
        size="small"
        dataSource={dataSources}
        columns={column}
        style={{ wordBreak: 'break-all' }}
        pagination={false}
        bordered
        loading={isLoading}
        locale={{
          emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
        }}
        scroll={{ x: 1097 }}
      />
    </>
  );
};

export default TableComponent;
