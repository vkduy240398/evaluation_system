import React, { Dispatch, FC, Key, SetStateAction, useState } from 'react';
import { Feedback, FeedbackCondition, FeedbackSearchForm, FeedbackStatus, FeedbackType } from '../../../model/Feedback';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import { useTranslation } from 'react-i18next';
import ModalPopup from '../../../common/ModalPopup';
import FeedbackDetail from './FeedbackDetail';
import { MetaModal } from '../../../model/MetalModel';
import PaginationV2 from '../../../common/PaginationV2';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Grid, message, Pagination, Space, Table, TableProps } from 'antd';
import dayjs from 'dayjs';
import feedbackApiService from '../../../common/api/feedback';
import TableCustomComponent from '../../../@core/components/table-custom/TableCustomComponent';
import { urlCompanyCode } from '../../../common/util';

interface Props {
  isFetching: boolean;
  setIsFetching: Dispatch<SetStateAction<boolean>>;
  feedbacks: Feedback[];
  setFeedbacks: Dispatch<SetStateAction<Feedback[]>>;
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
  condition: FeedbackCondition;
  handleSearch: (values: FeedbackSearchForm) => Promise<void>;
  setCondition: Dispatch<SetStateAction<FeedbackCondition>>;
  role: string;
}

const FeedbackHistoryTable: FC<Props> = (props) => {
  const { count, condition, handleSearch, role } = props;
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const columns: TableProps<Feedback>['columns'] = [
    {
      title: t('IDS_NO'),
      dataIndex: 'key',
      width: '120px',
    },
    {
      title: t('IDS_TYPE_FEEDBACK'),
      dataIndex: 'type',
      render: (value: FeedbackType) => Object.values(t('IDS_TYPE_FEEDBACK_OPTIONS', { returnObjects: true }))[value],
      width: '80px',
    },
    {
      title: t('IDS_PHASE_FEEDBACK'),
      dataIndex: 'phase',
      render: (value: any) => (t('IDS_PHASE_FEEDBACK_OPTIONS', { returnObjects: true }) as any)[value],
      width: '80px',
    },
    {
      title: t('IDS_TARGET_SCREEN'),
      dataIndex: 'feature',
      render: (value: any) => {
        const text =
          value &&
          value.map((v: string) => {
            return `${t(v.split('-')[v.split('-').length - 1])}${
              v.split('-').length > 1 ? `（${t(v.split('-')[0])}）` : ''
            }`;
          });

        return value ? text.join('、') : '';
      },
      width: '30%',
    },
    {
      title: t('IDS_ISSUE_OVERVIEW'),
      dataIndex: 'summary',
      // width: '40%',
    },
    {
      title: t('IDS_STATUS'),
      dataIndex: 'status',
      render: (value: FeedbackStatus) => (t('IDS_STATUS_FEEDBACK_OPTIONS', { returnObjects: true }) as any)[value],
      width: '80px',
    },
    {
      title: t('IDS_IMPACT_SCOPE'),
      dataIndex: 'impactScope',
      render: (value: FeedbackStatus) => (t('IDS_IMPACT_SCOPE_OPTIONS', { returnObjects: true }) as any)[value],
      width: '80px',
    },
    {
      title: t('IDS_TIME_CREATED'),
      dataIndex: 'createdTime',
      width: '80px',
      align: 'center',
    },
  ];

  const handleChangePage = (current: number) => {
    const limit = 20;
    const offset = (current - 1) * limit;
    handleSearch({
      ...condition,
      dates: condition.dates ? [dayjs(condition.dates[0]), dayjs(condition.dates[1])] : undefined,
      offset,
      limit,
      current,
    });
  };

  return (
    <div>
      <TableCustomComponent
        className="ant-custom-table-title hover-table-currsor-pointerant-custom-table hover-table-currsor-pointer"
        columns={props.role === 'user' ? columns.filter((column: any) => column.dataIndex !== 'impactScope') : columns}
        dataSources={props.feedbacks}
        isLoading={props.isFetching}
        isSetScroll={{ x: screens.sm || screens.xs ? 1100 : undefined }}
        size="small"
        onRow={(record) => {
          return {
            onClick: async () => {
              const id = record.key;
              if (role === 'user') {
                navigate(urlCompanyCode() + '/' + window.location.pathname.split('/')[3] + '/detail/' + id, {
                  state: id,
                });
              } else if (role === 'admin') {
                navigate(
                  urlCompanyCode() + '/' + window.location.pathname.split('/')[3] + '/list-feedback/detail/' + id,
                  {
                    state: id,
                  },
                );
              } else if (role === 'systemAdmin') {
                navigate(
                  urlCompanyCode() + '/' + window.location.pathname.split('/')[3] + '/list-feedback/detail/' + id,
                  {
                    state: id,
                  },
                );
              }
            }, // click row
          };
        }}
      />

      {props.count > 0 && (
        <Pagination
          style={{
            marginTop: 15,
          }}
          showTotal={(total, range) => `${total}${t('IDS_CASE_LABEL')} ${range[0]}-${range[1]}${t('IDS_ITEM_LABEL')}`}
          pageSize={20}
          total={count}
          current={condition?.current}
          showSizeChanger={false}
          onChange={handleChangePage}
          disabled={props.isFetching}
        />
      )}
    </div>
  );
};

export default FeedbackHistoryTable;
