import { Grid, Pagination, Table, message } from 'antd';
import { t } from 'i18next';
import { MainButton } from '../../../../common/MainButton';
import { TableRowSelection } from 'antd/lib/table/interface';
import { Button } from 'antd/lib';
import { FormOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import { useState } from 'react';
import settingReview from '../../../../common/api/setting-evaluation-history-reference';
import React, { useMemo } from 'react';
import { urlCompanyCode } from '../../../../common/util';
interface Props {
  selectedRowKeys: any;
  handleSearchForm: () => void;
  isLoading: boolean;
  dataSources: {
    data: any[];
    counts: number;
    pageSize: number;
  };
  condition: any;
  moveToPages: (page: number) => void;
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedRows: React.Dispatch<React.SetStateAction<any[]>>;
  selectedRows: any[];
  setIsLoadingTable: React.Dispatch<React.SetStateAction<boolean>>;
  setDataSource: React.Dispatch<React.SetStateAction<any>>;
  callBackFC: (data: any) => void;
}
type typeRole = {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
};
const EvaluationReferenceTable: React.FC<Props> = (props: Props) => {
  const {
    dataSources,
    condition,
    isLoading,
    moveToPages,
    setSelectedRowKeys,
    setSelectedRows,
    selectedRowKeys,
    handleSearchForm,
    setIsLoadingTable,
    callBackFC,
  } = props;
  const location = useLocation();
  const { useBreakpoint } = Grid;
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const typeRoles: typeRole = {
    1: '目標',
    2: '目標&目標承認履歴',
    3: '評価結果（点数のみ）',
    4: '評価結果（自己評価）',
    5: '評価結果&承認履歴（非公開コメント以外）',
    6: '評価結果詳細（非公開コメントを含めて）',
  };
  const evaluationReferenceColumn = () => {
    return [
      {
        title: t('IDS_TARGET_AUDIENCE'),
        dataIndex: 'user',
        width: '12%',
        align: 'center' as const,
        render: (_text: any, record: any, _index: any) => {
          return <div style={{ textAlign: 'left' }}>{_text}</div>;
        },
      },
      {
        title: t('IDS_CURRENT_DEP_DIV'),
        dataIndex: 'department',
        width: '18%',
        align: 'center' as const,
        render: (_text: any, record: any, _index: any) => {
          return (
            <>
              <div style={{ textAlign: 'left' }}>
                {record.division_user !== null ? `部署: ${record.division_user}` : ''}
              </div>
              <div style={{ textAlign: 'left' }}>
                {record.department_user !== null ? `課名: ${record.department_user}` : ''}
              </div>
            </>
          );
        },
      },
      {
        title: t('IDS_VIEWER'),
        dataIndex: 'viewer',
        width: '12%',
        align: 'center' as const,
        render: (_text: any, record: any, _index: any) => {
          return <div style={{ textAlign: 'left' }}>{_text}</div>;
        },
      },
      {
        title: t('IDS_CURRENT_DEP_DIV'),
        dataIndex: 'currentDepDiv2',
        width: '18%',
        align: 'center' as const,
        render: (_text: any, record: any, _index: any) => {
          return (
            <>
              <div style={{ textAlign: 'left' }}>
                {record.division_viewer !== null ? `部署: ${record.division_viewer}` : ''}
              </div>
              <div style={{ textAlign: 'left' }}>
                {record.department_viewer !== null ? `課名: ${record.department_viewer}` : ''}
              </div>
            </>
          );
        },
      },
      {
        title: t('IDS_EVALUATOR_DEFAULT'),
        dataIndex: 'isEvaluatorDefault',
        width: '3%',
        align: 'center' as const,
        render: (_text: any, record: any, _index: any) => {
          return <div style={{ textAlign: 'center' }}>{record.evaluation_evaluators ? t('IDS_O') : t('IDS_X')}</div>;
        },
      },
      {
        title: t('IDS_VIEW_PERIOD'),
        dataIndex: 'viewPeriod',
        width: '13%',
        align: 'center' as const,
        render: (_text: any, record: any, _index: any) => {
          return <div style={{ textAlign: 'left' }}>{record.rangePeriod}</div>;
        },
      },
      {
        title: t('IDS_VIEW_RANGE'),
        dataIndex: 'viewRange',
        width: '16%',
        align: 'center' as const,
        render: (_text: any, record: any, _index: any) => {
          return <div style={{ textAlign: 'left' }}>{typeRoles[record.type as 1 | 2 | 3 | 4 | 5 | 6]}</div>;
        },
      },
      {
        title: t('IDS_ACTION'),
        dataIndex: 'dataIndex',
        width: '3%',
        align: 'center' as const,
        render: (_text: any, _record: any, _index: any) => {
          return (
            <Button
              icon={<FormOutlined />}
              style={{ color: '#007240 ' }}
              onClick={() => {
                navigate(
                  urlCompanyCode() +
                    '/' +
                    window.location.pathname.split('/')[3] +
                    '/edit-user-evaluation-history-reference',
                  // { state: _record },
                  {
                    state: {
                      data: _record,
                      condition: condition,
                    },
                  },
                );
              }}
            />
          );
        },
      },
    ];
  };
  const onSelectChange = (record: any, i: any) => {
    setSelectedRowKeys(record);
    setSelectedRows(i);
  };
  const handleDeleteSelected = async () => {
    const errorCallBack = (isLoading: boolean) => {
      setIsLoadingTable(isLoading);
      setOpen(isLoading);
    };

    return settingReview
      .handleDeleteRecordSettingHistoryReference(location.state, selectedRowKeys, errorCallBack)
      .then((response) => {
        callBackFC(response?.data);
        setSelectedRowKeys([]);
        setSelectedRows([]);
        message.success(t('MESSAGE.COMMON.IDM_DELETE_SETTING_REFERENCE_REVIEW_SUCCESS'), 2, () => {});
      });
  };
  const rowSelection: TableRowSelection<any> = {
    columnWidth: '1%',
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (_record: any) => {
      return {
        disabled: false,
      };
    },
  };
  const TableComponents = useMemo(() => {
    return (
      <Table
        bordered
        rowKey={(row) => {
          return `${row.ListHistoryId.toString()}`;
        }}
        rowSelection={rowSelection}
        columns={evaluationReferenceColumn()}
        loading={isLoading}
        dataSource={dataSources.data}
        pagination={false}
        size="small"
        className={'ant-custom-table-title hover-table-currsor-pointerant-custom-table'}
        locale={{ emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA') }}
        scroll={{ x: screens.xs || screens.sm ? 1500 : undefined }}
      />
    );
  }, [dataSources, selectedRowKeys, isLoading]);

  return (
    <div>
      {(dataSources.data.length > 0 || location.state) && (
        <>
          <MainButton
            type="primary"
            name="Search"
            value="txt_evaluation_search"
            style={{ marginBottom: '20px', marginTop: 20 }}
            loading={props.isLoading}
            disabled={selectedRowKeys.length <= 0}
            onClick={() => setOpen(true)}
          >
            {t('IDS_BUTTON_DELETE_MULTIPLE')}
          </MainButton>
          {TableComponents}
        </>
      )}
      {dataSources.data.length > 0 && (
        <Pagination
          style={{ marginTop: 10 }}
          pageSize={dataSources.pageSize}
          showSizeChanger={false}
          total={dataSources.counts}
          showTotal={(total, range) => `${total}${t('IDS_CASE_LABEL')} ${range[0]}-${range[1]}${t('IDS_ITEM_LABEL')}`}
          defaultCurrent={condition?.page}
          current={condition?.page}
          disabled={isLoading}
          onChange={moveToPages}
        />
      )}
      <ModalCustomComponent
        isOpen={isOpen}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_DELETE_HISTORY_REFERENCE')}
        fnHandleOk={handleDeleteSelected}
        okText={t('IDS_DELETE') as string}
        cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
        fnHandleCancel={() => setOpen(false)}
        loading={isLoading}
      />
    </div>
  );
};
export default EvaluationReferenceTable;
