import { useNavigate } from 'react-router-dom';
import { Grid, Table } from 'antd';
import { t } from 'i18next';
import PaginationV2 from '../../../../common/PaginationV2';
import { urlCompanyCode } from '../../../../common/util';

interface Props {
  type: string;
  dataSouces: any;
  optionStatus: any;
  location: any;
  isLoading: boolean;
  setLoading: any;
  setDataSources: any;
  navigates: any;
  errorCallBack: (bool: any) => void;
  url: string;
  currents: number;
  conditions: any;
}
const TableNewsVersion = (props: Props) => {
  const { type, dataSouces, optionStatus, isLoading, conditions, setLoading, setDataSources, url } = props;

  const navigate = useNavigate();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const columns = [
    {
      title: t('IDS_TEMPLATE'),
      width: '18%',
      align: 'left' as const,
      render: (text: any) => {
        return <div style={{ wordBreak: 'break-word' }}>{text.skill_name}</div>;
      },
    },
    {
      title: t('IDS_VERSION'),
      width: '8%',
      align: 'center' as const,
      render: (_text: string, record: any) => {
        return (
          <>{record.version !== null && record.subVersion !== null ? `${record.version}.${record.sub_version}` : ''}</>
        );
      },
    },
    {
      title: t('IDS_STATUS'),
      width: '7%',
      align: 'left' as const,
      render: (text: any) => {
        const status = optionStatus.find((e: any) => {
          return e.value === text.status;
        });

        return status?.label;
      },
    },
    {
      title: t('IDS_LAST_UPDATE_USER'),
      width: '10%',
      align: 'left' as const,
      render: (text: any) => {
        return text?.full_name;
      },
    },
    {
      title: t('IDS_LAST_UPDATE_DATE'),
      dataIndex: 'last_updated_time',
      width: '10%',
      align: 'center' as const,
    },
  ];

  return (
    <>
      <Table
        style={{ marginTop: 20 }}
        columns={columns}
        size="small"
        dataSource={dataSouces.data}
        bordered
        loading={isLoading}
        locale={{
          emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
        }}
        onRow={(_record) => {
          return {
            onClick: () => {
              if (_record.id === null && type !== undefined && parseInt(type) === 2) {
                navigate(urlCompanyCode() + '/pro-setting/create', {
                  state: {
                    skillId: _record.skill_id,
                    name: _record.skill_name,
                    skillName: _record.skill_name,
                  },
                });
              } else if (type !== undefined && parseInt(type) === 2) {
                navigate(urlCompanyCode() + `/pro-setting/detail-pro-skill/${_record.id}`, {
                  state: {
                    edited: true,
                    id: _record.id,
                  },
                });
              }
            },
            style: {
              cursor: 'pointer',
            },
          };
        }}
        scroll={{ x: screens.xs ? 900 : undefined }}
        pagination={false}
      />
      {dataSouces.data && dataSouces.data.length > 0 && (
        <PaginationV2
          conditions={conditions}
          currents={conditions.current}
          dataSources={dataSouces}
          errorCallBack={setLoading}
          limit={conditions.limit}
          location={location}
          navigates={navigate}
          setDataSources={setDataSources}
          url={url}
          loading={isLoading}
          setLoading={setLoading}
        />
      )}
    </>
  );
};

export default TableNewsVersion;
