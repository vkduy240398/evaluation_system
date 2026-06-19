// ** React Imports
import { CSSProperties, FC, useEffect, useState } from 'react';

// ** I18 Imports
import { t } from 'i18next';

// ** Antd Imports
import Table from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import { Grid } from 'antd';

type size = 'small' | 'middle' | 'large' | undefined;
type SelectType = 'checkbox' | 'radio';
interface Props {
  dataSources: any[];
  columns: any[];
  isLoading?: boolean | undefined;
  setSelectedRow?: (data: any) => void;
  resetSelectRow?: any;
  disableKeys?: React.Key[];
  setDisableKey?: (str: React.Key[]) => void;
  size?: size;
  style?: CSSProperties;
  selectType?: SelectType;
  isScroll?: boolean;
  className?: string;
  pagination?: any;
  scrollY?: number;
}

const { useBreakpoint } = Grid;
const TableRowSelectedCustomComponent: FC<Props> = ({
  columns,
  dataSources,
  isLoading,
  size,
  style,
  disableKeys,
  setSelectedRow,
  setDisableKey,
  resetSelectRow,
  selectType,
  isScroll,
  className,
  pagination,
  scrollY
}) => {
  // ** State
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // ** Hook
  const screens = useBreakpoint();

  // ** Effect
  useEffect(() => {
    if (resetSelectRow && resetSelectRow.length === 0 && selectedRowKeys.length > 0) setSelectedRowKeys([]);
  }, [resetSelectRow]);
  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);

    // ** Callback fn
    setDisableKey && setDisableKey(newSelectedRowKeys);
    setSelectedRow && setSelectedRow(selectedRows);
  };

  const rowSelection: TableRowSelection<any> = {
    type: selectType || 'checkbox',
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: any) => ({
      disabled: disableKeys && disableKeys.includes(record.key),
      name: record.key,
    }),
  };

  return (
    <Table
      size={size}
      columns={columns}
      dataSource={dataSources}
      rowSelection={rowSelection}
      style={{ wordBreak: 'break-all', ...style }}
      pagination={pagination || false}
      bordered
      loading={isLoading}
      locale={{
        emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
      }}
      scroll={{ x: isScroll || screens.xs ? 900 : undefined, y: scrollY }}
      rowClassName={(rc) => (disableKeys?.includes(rc.key) ? 'table-row-selected-disable' : '')}
      className={className}
    />
  );
};

export default TableRowSelectedCustomComponent;
