import { Grid, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CustomPagination } from '../../../../common/Pagination';
import { DataStateProps } from '../../../../model/props/DataStateProps';
import { t } from 'i18next';
import { urlCompanyCode } from '../../../../common/util';
const { useBreakpoint } = Grid;

const ListProSkillPublicDepartmentTable: React.FC<DataStateProps> = (props: DataStateProps) => {
  const { dataState, setDataState, getData, isLoading, setIsLoading } = props;
  const screens = useBreakpoint();

  const columns = [
    {
      title: t('IDS_TEMPLATE'),
      dataIndex: 'skill',
      width: '15%',
      align: 'left' as const,
      render: (text: any) => {
        return <div style={{ maxWidth: 300 }}>{` ${text?.name}`}</div>;
      },
    },
    {
      title: t('IDS_VERSION'),
      dataIndex: 'version',
      width: '7%',
      align: 'center' as const,
    },
    {
      title: t('IDS_LAST_UPDATE_USER'),
      dataIndex: 'user',
      width: '10%',
      align: 'left' as const,
      render: (text: any) => text?.fullName,
    },
    {
      title: t('IDS_LAST_UPDATE_DATE'),
      dataIndex: 'lastUpdatedTime',
      width: '10%',
      align: 'center' as const,
    },
    {
      title: t('IDS_PUBLIC_DATE'),
      dataIndex: 'publicDate',
      width: '10%',
      align: 'center' as const,
    },
  ];
  const navigate = useNavigate();

  return (
    <div>
      <Table
        bordered
        rowKey={(row) => row.id}
        dataSource={dataState.dataSource}
        columns={columns}
        loading={isLoading}
        pagination={false}
        size="small"
        className={'ant-custom-table-title hover-table-currsor-pointerant-custom-table hover-table-currsor-pointer'}
        onRow={(_record) => {
          return {
            onClick: (_e) => {
              navigate(urlCompanyCode() + '/' + window.location.pathname.split('/')[3] + '/detail-pro-skill-public', {
                state: { id: _record.id },
              });
            }, // click row
          };
        }}
        locale={{
          emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
        }}
        scroll={{ x: screens.xs || screens.sm ? 768 : undefined }}
      />
      {dataState.total ? (
        <CustomPagination
          setIsLoading={setIsLoading}
          dataState={dataState}
          setDataState={setDataState}
          getData={getData}
          loading={isLoading}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ListProSkillPublicDepartmentTable;
