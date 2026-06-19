import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { TableRow } from '../interfaces/listProSkillInterfaces';
import { TFunction } from 'i18next';

interface Props {
  columns: ColumnsType<TableRow>;
  dataSources: TableRow[];
  isLoading: boolean;
  t: TFunction;
}
const ProSkillList = (props: Props) => {
  const { columns, dataSources, isLoading, t } = props;

  return (
    <>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={dataSources}
        pagination={{
          pageSize: 20,
          position: ['bottomLeft'],
          style: { marginBottom: 0 },
          showTotal(total, range) {
            return t('IDS_PAGINATION_TOTAL_ITEMS')
              .replace('{total}', total.toString())
              .replace('{range[0]}', range[0].toString())
              .replace('{range[1]}', range[1].toString());
          },
          showSizeChanger: false,
        }}
        bordered
        expandable={{
          rowExpandable: (record) => !!record.children && record.children.length > 0,
        }}
        rowClassName={(record) => (record.children ? 'master-row' : 'history-row')}
      />
    </>
  );
};

export default ProSkillList;
