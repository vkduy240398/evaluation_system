import React from 'react';
import { Pagination } from 'antd';
// import HttpAxios from '../common/http';
import HttpAxios from '../../../../../common/http';
import { t } from 'i18next';
interface Props {
  limit: number;
  conditions: any;
  currents: number;
  url: string;
  setDataSources: any;
  errorCallBack: (data: any) => void;
  navigates: any;
  location: any;
  dataSources: any;
  loading?: any;
  setLoading?: any;
  setSelectedRowKeys?: any;
  setConditions: any;
}
const PaginationHistoryMail = (props: Props) => {
  const {
    limit,
    conditions,
    url,
    currents,
    setDataSources,
    errorCallBack,
    navigates,
    location,
    loading,
    setLoading,
    setSelectedRowKeys,
    setConditions,
  } = props;
  const callBack = (data: any[]) => {
    setDataSources(data);
  };
  const onChange = async (current: number, pageSize: number) => {
    const offset = (current - 1) * pageSize;
    errorCallBack(true);
    setLoading(true);
    setSelectedRowKeys && setSelectedRowKeys([]);
    setConditions({...conditions, current: current, offset: offset});
    
    await navigates(location.pathname, {
      replace: true,
      state: {
        ...conditions,
        search: true,
        offset: offset,
        current: current,
      },
    });
    await HttpAxios.Get(url, {
        params: { ...conditions, offset: offset, limit: limit },
      })
        .then((res) => {
          if (res?.status === 200 || res?.status) {
            errorCallBack(false);
            callBack(res?.data);
          }
          errorCallBack(false);
        })
        .catch(() => {
          errorCallBack(false);
        });
  };
  const getCurrent = () => {
    return location.state?.current || currents;
  };

  return (
    <div
      style={{
        marginTop: 15,
      }}
    >
      <Pagination
        pageSize={conditions?.limit}
        showSizeChanger={false}
        total={props.dataSources.counts}
        showTotal={(total, range) => `${total}${t('IDS_CASE_LABEL')} ${range[0]}-${range[1]}${t('IDS_ITEM_LABEL')}`}
        onChange={onChange}
        defaultCurrent={conditions?.current}
        current={getCurrent()}
        disabled={loading}
      />
    </div>
  );
};

export default PaginationHistoryMail;
