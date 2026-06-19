import { Table, Grid } from 'antd';
import React from 'react';
import { ChildrenBasicBehavior } from '../../interfaces/InterfacesProps';
interface Props {
  columns: any;
  dataSources: ChildrenBasicBehavior[];
}
const TableComponent = (props: Props) => {
  const { columns, dataSources } = props;
  const breaks = Grid.useBreakpoint();

  return (
    <Table
      bordered
      size="small"
      columns={columns}
      dataSource={dataSources}
      pagination={false}
      rowKey={(record) => record.id}
      scroll={{ x: breaks.xs ? 1024 : undefined }}
      onRow={(_record, _rowIndex) => {
        return {
          onClick: (event) => {
            console.log(event);
          },
        };
      }}
    />
  );
};

export default TableComponent;
