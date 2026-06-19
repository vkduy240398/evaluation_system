import React from 'react';
import Pagination from 'antd/lib/pagination';
import { useTranslation } from 'react-i18next';

const PaginationUserList = (props: {
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
  current: number;
  isLoading: boolean;
  style?: React.CSSProperties;
}) => {
  const { t } = useTranslation();

  return (
    <Pagination
      style={props.style}
      total={props.total}
      pageSize={props.pageSize}
      current={props.current}
      onChange={props.onChange}
      disabled={props.isLoading}
      showTotal={(total, range) =>
        t('IDS_PAGINATION_TOTAL_ITEMS')
          .replace('{total}', total.toString())
          .replace('{range[0]}', range[0].toString())
          .replace('{range[1]}', range[1].toString())
      }
      hideOnSinglePage
      showSizeChanger={false}
    />
  );
};

export default PaginationUserList;
