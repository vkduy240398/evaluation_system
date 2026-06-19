import { Table } from 'antd';
import { CustomPagination } from '../../../../common/Pagination';
import { DataStateProps } from '../../../../model/props/DataStateProps';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import { urlCompanyCode } from '../../../../common/util';

const ListProSkillTable: React.FC<DataStateProps> = (props: DataStateProps) => {
  const navigate = useNavigate();
  const optionPublicStatus = [
    {
      label: (t('IDL_LIST_PUBLIC_STATUS_PRO_SKILL', { returnObjects: true }) as any)[0],
      value: 0,
    },
    {
      label: (t('IDL_LIST_PUBLIC_STATUS_PRO_SKILL', { returnObjects: true }) as any)[1],
      value: 1,
    },
    {
      label: (t('IDL_LIST_PUBLIC_STATUS_PRO_SKILL', { returnObjects: true }) as any)[2],
      value: 2,
    },
  ];

  const { dataState, setDataState, getData, isLoading, setIsLoading } = props;
  const columns = [
    {
      title: t('IDS_TEMPLATE'),
      dataIndex: 'skill',
      width: '18%',
      align: 'left' as const,
      render: (text: any) => {
        return <div style={{ wordBreak: 'break-word' }}>{text.name}</div>;
      },
    },
    {
      title: t('IDS_VERSION'),
      dataIndex: 'version',
      width: '8%',
      align: 'center' as const,
    },
    {
      title: t('IDS_STATUS'),
      dataIndex: 'status',
      width: '7%',
      align: 'left' as const,
      render: (text: any) => {
        const status = props.optionStatus.find((e: any) => {
          return e.value === text;
        });

        return status?.label;
      },
    },
    {
      title: t('IDS_STATUS_PUBLIC'),
      dataIndex: 'publicStatus',
      width: '10%',
      align: 'left' as const,
      render: (text: any) => {
        const publicStatus = optionPublicStatus.find((e: any) => {
          return e.value === text;
        });

        return <div style={{ fontWeight: text === 1 ? 'bold' : '' }}>{publicStatus?.label}</div>;
      },
    },
    {
      title: t('IDS_LAST_UPDATE_USER'),
      dataIndex: 'user',
      width: '10%',
      align: 'left' as const,
      render: (text: any) => {
        return text?.fullName;
      },
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
      width: '8%',
      align: 'center' as const,
    },
  ];

  return (
    <div>
      <Table
        bordered
        style={{ marginTop: 20 }}
        rowKey={(row) => row.id}
        dataSource={dataState.dataSource}
        columns={columns}
        loading={isLoading}
        pagination={false}
        size="small"
        scroll={{ x: 900 }}
        className={'ant-custom-table-title hover-table-currsor-pointerant-custom-table hover-table-currsor-pointer'}
        onRow={(record, _rowIndex) => {
          return {
            onClick: (_e) => {
              navigate(urlCompanyCode() + `/pro-setting/detail-pro-skill/${record.id}`, {
                state: {
                  id: record.id,
                  edited: false,
                  readOnly: true,
                },
              });
            }, // click row
          };
        }}
        locale={{
          emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
        }}
      />
      {dataState.total ? (
        <CustomPagination
          setIsLoading={setIsLoading}
          dataState={dataState}
          setDataState={setDataState}
          getData={getData}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ListProSkillTable;
