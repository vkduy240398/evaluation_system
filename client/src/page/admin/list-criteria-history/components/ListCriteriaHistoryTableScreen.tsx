import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import { itemEvaluationItem } from '../../../../model/Conditions';
import { proSkillPublicStatus, proSkillStatus } from '../../../../common/status';
import { urlCompanyCode } from '../../../../common/util';
interface Props {
  dataState: itemEvaluationItem[] | undefined;
  isLoading: boolean;
}
const ListCriteriaHistoryTableScreen: React.FC<Props> = (props: Props) => {
  const columns = [
    {
      title: t('IDS_TEMPLATE'),
      dataIndex: 'department',
      width: '15%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'left', maxWidth: 300, wordBreak: 'break-word' }}>{record?.skill?.name}</div>;
      },
    },

    {
      title: t('IDS_VERSION'),
      dataIndex: 'version',
      width: '5%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'center' }}>{record?.version + '.' + record?.subVersion}</div>;
      },
    },
    {
      title: t('IDS_STATUS'),
      dataIndex: 'status',
      width: '10%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'left' }}>{proSkillStatus[record?.status]}</div>;
      },
    },
    {
      title: t('IDS_STATUS_PUBLIC'),
      dataIndex: 'publicStatus',
      width: '10%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return (
          <div style={{ textAlign: 'left', fontWeight: record?.publicStatus === 1 ? 'bold' : '' }}>
            {proSkillPublicStatus[record?.publicStatus]}
          </div>
        );
      },
    },
    {
      title: t('IDS_LAST_UPDATE_USER'),
      dataIndex: 'submitter',
      width: '10%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'left' }}>{record?.user?.fullName}</div>;
      },
    },
    {
      title: t('IDS_LAST_UPDATE_DATE'),
      dataIndex: 'submitDate',
      width: '10%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'center' }}>{record?.lastUpdatedTime}</div>;
      },
    },
    {
      title: t('IDS_PUBLIC_DATE'),
      dataIndex: 'publicDate',
      width: '10%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'center' }}>{record?.publicDate}</div>;
      },
    },
  ];

  const navigate = useNavigate();

  return (
    <div>
      <Table
        bordered
        rowKey={(row) => row.id}
        dataSource={props.isLoading === false ? props.dataState : []}
        columns={columns}
        loading={props.isLoading}
        pagination={false}
        size="small"
        className={'ant-custom-table-title hover-table-currsor-pointerant-custom-table hover-table-currsor-pointer'}
        onRow={(record) => {
          return {
            onClick: (_e) => {
              navigate(urlCompanyCode() + `/${window.location.pathname.split('/')[3]}/detail-pro-skill/${record.id}`, {
                state: {
                  id: record.id,
                },
              });
            }, // click row
          };
        }}
        locale={{ emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA') }}
        scroll={{ x: 768 }}
      />
    </div>
  );
};

export default ListCriteriaHistoryTableScreen;
