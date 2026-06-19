/* eslint-disable no-constant-condition */
import { Grid, Row, Space, Table } from 'antd';
import { t } from 'i18next';
import styles from '../../../../common/css/stylesTable.module.css';
import { MainButton } from '../../../../common/MainButton';
import exportProSkillApiService from '../../../../common/api/export-pro-skill';
import dayjs from 'dayjs';

interface Props {
  dataSources: any;
  isLoading: boolean;
  condition: any;
  isFirstLoad: boolean;
  role: any;
  setSelectedRowKeys: any;
  selectedRowKeys: any;
  setSelectedRows: any;
  selectedRows: any;
  state: any;
  errorCallBack: any;
}
const TableResult: React.FC<Props> = (props: Props) => {
  const breaks = Grid.useBreakpoint();
  const { selectedRowKeys, state, errorCallBack } = props;

  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: any) => {
    props.setSelectedRowKeys(newSelectedRowKeys);
    props.setSelectedRows(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: props.role == 'f3' || props.role == 'f4' ? t('IDS_DEPARTMENT') : t('IDS_TEMPLATE'),
      dataIndex: 'name',
      align: 'left' as const,
    },
  ];

  const handleExport = async () => {
    exportProSkillApiService.exportDep_Template(
      props.role,
      dayjs(state.year, 'YYYY').format('YYYY'),
      state.periodEvaluate,
      errorCallBack,
      props.setSelectedRowKeys,
      {
        year: dayjs(state.year, 'YYYY').format('YYYY'),
        role: props.role,
        periodIndex: state.periodEvaluate,
        listSelected: props.selectedRowKeys,
      },
    );
  };

  return (
    <div>
      {props.isFirstLoad && (
        <>
          <Row>
            <Space size={'large'}>
              <MainButton
                type="primary"
                name="Search"
                value="txt_evaluation_search"
                style={{ marginBottom: '20px' }}
                onClick={handleExport}
                disabled={props.selectedRowKeys.length === 0 || props.dataSources?.length === 0 ? true : false}
                loading={props.isLoading}
              >
                {t('IDS_LABLE_OUTPUT_LIST_USER')}
              </MainButton>
            </Space>
          </Row>

          <Table
            bordered
            size="small"
            rowKey={(row) => row.id}
            rowSelection={rowSelection}
            dataSource={props.dataSources || []}
            scroll={{ x: breaks.xs || breaks.sm ? 768 : undefined }}
            columns={columns}
            pagination={false}
            className={`ant-custom-table-title  ${styles.table}`}
            loading={props.isLoading}
            locale={{
              emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
            }}
          />
        </>
      )}
    </div>
  );
};

export default TableResult;
