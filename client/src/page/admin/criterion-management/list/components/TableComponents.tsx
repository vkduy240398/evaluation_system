import React from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import { Table, Grid } from 'antd';
import ColumnComponents from './ColumnComponents';
import PaginationV2 from '../../../../../common/PaginationV2';
import { urlCompanyCode } from '../../../../../common/util';
interface souces {
  dataSources: any[];
  counts: number;
}
interface Props {
  dataSources: souces;
  isLoading: boolean;
  limit: number;
  conditions: any;
  current: number;
  url: string;
  setCondition: any;
  setDataState: any;
  errorCallBack: (bool: any) => void;
  navigates: any;
  location: any;
}
interface criteria {
  key: number;
  type: number;
  updatedBy: string;
  updatedAt: string;
  releasedDate: string;
  status: number;
}
const TableComponents = (props: Props) => {
  const navigate = useNavigate();
  const breaks = Grid.useBreakpoint();

  return (
    <div>
      <Table
        bordered
        rowKey={(row) => row.key}
        dataSource={props.dataSources.dataSources}
        columns={ColumnComponents({
          type: props.location.state.basicBehavior,
          isLoading: props.isLoading,
          flagSkill: props.location.state.flagSkill,
        })}
        loading={props.isLoading}
        pagination={false}
        size="small"
        className={'ant-custom-table-title hover-table-currsor-pointerant-custom-table hover-table-currsor-pointer'}
        onRow={(record: criteria) => {
          return {
            onClick: (_e) => {
              navigate(urlCompanyCode() + `/${window.location.pathname.split('/')[3]}/detail-evaluation-item/${record.key}`, {
                replace: false,
                state: {
                  id: record.key,
                  type: record.type,
                  status: record.status,
                  edited: record.status === 1 ? true : false,
                },
              });
            }, // click row
          };
        }}
        locale={{
          emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
        }}
        scroll={{ x: !breaks.lg ? 900 : undefined }}
      />

      {props.dataSources.dataSources.length > 0 && (
        <PaginationV2
          conditions={props.location.state}
          currents={props.conditions.current}
          limit={props.conditions.limit}
          url={props.url}
          setDataSources={props.setDataState}
          errorCallBack={props.errorCallBack}
          location={props.location}
          navigates={props.navigates}
          dataSources={props.dataSources}
          loading={props.isLoading}
          setLoading={props.errorCallBack}
        />
      )}
    </div>
  );
};

export default TableComponents;
