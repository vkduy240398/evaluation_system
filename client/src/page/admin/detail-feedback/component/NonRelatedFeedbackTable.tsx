import { Table, TableColumnsType } from 'antd';
import { t } from 'i18next';
import PaginationCustom from '../../../../@core/components/pagination-custom';
import { MainButton } from '../../../../common/MainButton';
import React, { Key } from 'react';
import { Feedback, FeedbackImpactScope, FeedbackStatus, FeedbackType } from '../../../../model/Feedback';
import moment from 'moment';

interface Props {
  feedbacks: Feedback[];
  total: number;
  currentPage: number;
  setCurrentPage: (currentPage: number) => void;
  isLoading: boolean;
  onChangePage: (limit: number, offset: number) => void;
  onAdd: (addedFeedbackIds: number[]) => void;
  selectedRowKeys: Key[];
  setSelectedRowKeys: (selectedRowKeys: Key[]) => void;
}

export default function NonRelatedFeedbackTable(props: Props) {
  const columns: TableColumnsType<Feedback> = [
    {
      title: t('IDS_NO'),
      dataIndex: 'id',
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
    },
    {
      title: t('IDS_IMPACT_SCOPE'),
      dataIndex: 'impactScope',
      render: (value: FeedbackImpactScope) => (t('IDS_IMPACT_SCOPE_OPTIONS', { returnObjects: true }) as any)[value],
      width: '80px',
    },
    {
      title: t('IDS_STATUS'),
      dataIndex: 'status',
      render: (value: FeedbackStatus) => (t('IDS_STATUS_FEEDBACK_OPTIONS', { returnObjects: true }) as any)[value],
      width: '80px',
    },
    {
      title: t('IDS_TIME_CREATED'),
      dataIndex: 'createdTime',
      render: (time: Date) => moment(time).format('YYYY/M/D H:mm'),
      width: '80px',
      align: 'center',
    },
  ];

  return (
    <>
      <Table
        style={{ marginTop: 20 }}
        bordered
        rowKey={(row) => row.id}
        rowSelection={{
          selectedRowKeys: props.selectedRowKeys,
          onChange: (selectedRowKeys) => props.setSelectedRowKeys(selectedRowKeys),
        }}
        dataSource={props.feedbacks}
        columns={columns}
        loading={props.isLoading}
        pagination={false}
        size="small"
        locale={{
          emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
        }}
        scroll={{ x: 1097 }}
      />

      {props.feedbacks.length > 0 && (
        <PaginationCustom
          fnOnchange={({ limit, offset }) => props.onChangePage(limit ?? 20, offset ?? 0)}
          total={props.total}
          fnGetCurrentPage={props.setCurrentPage}
          currentPage={props.currentPage}
          isLoading={props.isLoading}
        />
      )}

      <MainButton
        type="primary"
        name="Search"
        value="txt_evaluation_search"
        style={{ marginTop: 15 }}
        loading={props.isLoading}
        onClick={() => props.onAdd(props.selectedRowKeys as number[])}
        disabled={props.feedbacks.length === 0 || props.selectedRowKeys.length === 0}
      >
        {t('IDS_BUTTON_ADD')}
      </MainButton>
    </>
  );
}
