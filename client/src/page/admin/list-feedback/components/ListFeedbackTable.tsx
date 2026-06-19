import { Col, Row, Table } from 'antd';
import SetListFeedbackColumn from './SetListFeedbackColumn';
import { MainButton } from '../../../../common/MainButton';
import { t } from 'i18next';
import { DownloadOutlined } from '@ant-design/icons';
import { FeedbackListData, FeedbackStatus } from '../../../../model/Feedback';
import { TableRowSelection } from 'antd/es/table/interface';
import { urlCompanyCode } from '../../../../common/util';

interface Props {
  dataSources: {
    counts: number;
    data: FeedbackListData[];
  };
  selectedRowKeys: any;
  setSelectedRows: any;
  setSelectedRowKeys: any;
  isLoading: boolean;
  navigate: any;
  setIsOpenModal: any;
  handleDownloadExcel: () => void;
}

const ListFeedbackTable = (props: Props) => {
  const {
    dataSources,
    setSelectedRowKeys,
    selectedRowKeys,
    isLoading,
    navigate,
    setSelectedRows,
    setIsOpenModal,
    handleDownloadExcel,
  } = props;

  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: any) => {
    // console.log(newSelectedRowKeys, ' *** ', selectedRows);
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const rowSelection: TableRowSelection<any> = {
    columnWidth: '1%',
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (_record: FeedbackListData) => {
      const canDelete =
        _record.status === FeedbackStatus.SUBMIT ||
        _record.status === FeedbackStatus.CLOSE ||
        _record.status === FeedbackStatus.DONE;

      return {
        disabled: !canDelete,
      };
    },
  };

  return (
    <div>
      <Row style={{ justifyContent: 'space-between', marginBottom: 20, marginTop: 20 }}>
        <Col>
          <MainButton
            type="primary"
            name="deleteSelected"
            value="txt_evaluation_search"
            onClick={() => {
              setIsOpenModal(true);
            }}
            disabled={selectedRowKeys.length === 0 ? true : false}
            loading={isLoading}
          >
            {t('IDS_BUTTON_DELETE_MULTIPLE')}
          </MainButton>
        </Col>
        <Col>
          <MainButton
            type="primary"
            name="Search"
            value="txt_evaluation_search"
            onClick={handleDownloadExcel}
            loading={isLoading}
          >
            {t('IDS_LABLE_OUTPUT_LIST_USER')}
            <DownloadOutlined style={{ fontSize: 18 }} />
          </MainButton>
        </Col>
      </Row>
      <Table
        pagination={false}
        bordered
        rowKey={(row) => row.id}
        rowSelection={rowSelection}
        className="ant-custom-table-title hover-table-currsor-pointerant-custom-table hover-table-currsor-pointer"
        columns={SetListFeedbackColumn()}
        dataSource={dataSources.data}
        loading={isLoading}
        locale={{
          emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
        }}
        onRow={(record) => {
          return {
            onClick: async (_e) => {
              const id = record.id;
              navigate(urlCompanyCode() + '/' + window.location.pathname.split('/')[3] + '/list-feedback/detail', {
                state: {
                  id: id,
                },
              });
            },
          };
        }}
      />
    </div>
  );
};

export default ListFeedbackTable;
