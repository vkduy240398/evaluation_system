import Table from 'antd/es/table';
import { CSSProperties, FC, ReactNode } from 'react';
import { Grid } from 'antd';
import { t } from 'i18next';

type size = 'small' | 'middle' | 'large' | undefined;
interface Props {
  dataSources: any[];
  columns: any[];
  isLoading?: boolean;
  size?: size;
  style?: CSSProperties;
  isScroll?: boolean;
  className?: string;
  isHiddenHeader?: boolean;
  onRow?: (record: any, index: number | undefined) => any;
  isSetScroll?: any;
  rowClassName?: (record: any, index: number, indent: number) => string | string;
  summary?: ((data: readonly any[]) => ReactNode) | undefined;
}

const { useBreakpoint } = Grid;

const TableCustomComponent: FC<Props> = ({
  columns,
  dataSources,
  size,
  style,
  isLoading,
  isScroll,
  className,
  isHiddenHeader,
  onRow,
  isSetScroll,
  rowClassName,
  summary,
}) => {
  // ** Hook
  const screens = useBreakpoint();

  return (
    <Table
      className={className}
      size={size}
      columns={columns}
      dataSource={dataSources}
      style={{ wordBreak: 'break-all', ...style }}
      pagination={false}
      loading={isLoading}
      bordered
      showHeader={!isHiddenHeader}
      scroll={isSetScroll ? isSetScroll : { x: isScroll || screens.xs ? 900 : undefined }}
      locale={{
        emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
      }}
      onRow={(record, index) => onRow && onRow(record, index)}
      rowClassName={rowClassName}
      summary={summary && summary}
    />
  );
};

export default TableCustomComponent;
