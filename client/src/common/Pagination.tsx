import { Pagination } from 'antd';
import { DataState } from '../model/DataState';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

interface Props {
  dataState: DataState<any>;
  setDataState: any;
  // eslint-disable-next-line @typescript-eslint/ban-types
  getData?: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setIsLoading?: Function;
  loading?: boolean;
}

export const CustomPagination: React.FC<Props> = (props: Props) => {
  const navigates = useNavigate();
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { getData, dataState, setDataState, setIsLoading, loading } = props;
  const onChange = (current: number, pageSize: number) => {
    const offset = (current - 1) * pageSize;
    setDataState({ ...dataState, current: current });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { dataSource, ...dataA } = dataState;
    navigates(location.pathname, {
      replace: true,
      state: {
        ...dataA,
        offset: offset,
        limit: pageSize,
        current: current,
      },
    });
    setIsLoading && setIsLoading(true);
    getData && getData(offset, pageSize, current, dataState.searchOption);
  };

  return (
    <Pagination
      onChange={onChange}
      total={dataState.total}
      current={dataState.current || 1}
      pageSize={dataState.limit}
      showSizeChanger={false}
      // eslint-disable-next-line no-irregular-whitespace
      showTotal={(total, range) => `${total}${t('IDS_CASE_LABEL')}${range[0]}-${range[1]}${t('IDS_ITEM_LABEL')}`}
      style={{ marginTop: '10px' }}
      disabled={loading}
    />
  );
};
