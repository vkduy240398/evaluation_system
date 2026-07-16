import { Table } from 'antd';
import { conditionsListCriteriaHistorty, itemCriteriaList } from '../../../../model/Conditions';
import { criteriaEvaluationStatus } from '../../../../common/status';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import { VersionSettingType } from '../../../../constant/VersionSettingType';
import { urlCompanyCode } from '../../../../common/util';

interface Props {
  dataState: itemCriteriaList[] | undefined;
  isLoading: boolean;
  conditions: conditionsListCriteriaHistorty;
}

const ListCriteriaEvaluationTable: React.FC<Props> = (props: Props) => {
  const navigate = useNavigate();
  const columns = [
    {
      title: t('IDS_VERSION'),
      dataIndex: 'version',
      width: '5rem',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'center' }}>{record?.version + '.' + record?.subVersion}</div>;
      },
    },
    {
      title: t('IDS_LEVEL'),
      dataIndex: 'level',
      width: '5rem',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return (
          <div style={{ textAlign: 'left' }}>
            {record?.type === VersionSettingType.LEVEL_1_7 || record?.type === VersionSettingType.LEVEL_1_7_NO_SKILL
              ? t('IDS_LEVEL_1_7')
              : t('IDS_LEVEL_8_10')}
          </div>
        );
      },
    },
    {
      title: t('IDS_EVALUATION_SKILL'),
      dataIndex: 'flagSkill',
      width: '5rem',
      align: 'left' as const,
      render: (_: any, record: any) => {
        return (
          <div>
            {record?.type === VersionSettingType.LEVEL_1_7 || record?.type === VersionSettingType.LEVEL_8_10
              ? t('IDS_HAVE')
              : t('IDS_NOT_HAVE')}
          </div>
        );
      },
    },
    {
      title: t('IDS_STATUS'),
      dataIndex: 'status',
      width: '5rem',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return (
          <div style={{ textAlign: 'left', fontWeight: record?.status === 4 ? 'bold' : '' }}>
            {criteriaEvaluationStatus[record?.status]}
          </div>
        );
      },
    },
    {
      title: t('IDS_LAST_UPDATE_USER'),
      dataIndex: 'submitter',
      width: '5rem',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'left' }}>{record?.user?.fullName}</div>;
      },
    },
    {
      title: t('IDS_LAST_UPDATE_DATE'),
      dataIndex: 'submitDate',
      width: '5rem',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'center' }}>{record?.lastUpdatedTime}</div>;
      },
    },
    {
      title: t('IDS_PUBLIC_DATE'),
      dataIndex: 'publicDate',
      width: '5rem',
      align: 'center' as const,
    },
  ];

  return (
    <div>
      <Table
        bordered
        rowKey={(row) => row.id}
        dataSource={props.dataState}
        columns={columns}
        loading={props.isLoading}
        pagination={false}
        size="small"
        className={'ant-custom-table-title hover-table-currsor-pointerant-custom-table hover-table-currsor-pointer'}
        onRow={(record) => {
          return {
            onClick: (_e) => {
              navigate(urlCompanyCode() + `/${window.location.pathname.split('/')[3]}/criteria-evaluation/detail/${record.id}`, {
                replace: false,
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

export default ListCriteriaEvaluationTable;
