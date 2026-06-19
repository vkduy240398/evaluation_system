import { t } from 'i18next';
interface Props {
  type: number;
  flagSkill: number;
}
export const getListEvaluationCalculationHistoryColumn = (props: Props) => {
  const listStatus = [
    (t('IDL_LIST_STATUS_VERSION_SETTING', { returnObjects: true }) as any)[1],
    (t('IDL_LIST_STATUS_VERSION_SETTING', { returnObjects: true }) as any)[2],
    (t('IDL_LIST_STATUS_VERSION_SETTING', { returnObjects: true }) as any)[3],
    (t('IDL_LIST_STATUS_VERSION_SETTING', { returnObjects: true }) as any)[4],
  ];

  const displayLevelAndTypeSkill = () => {
    if (props.type !== 5) {
      return [
        {
          title: t('IDS_LEVEL'),
          dataIndex: 'type',
          width: '5rem',
          align: 'center' as const,
          render() {
            return (
              <div style={{ textAlign: 'left' }}>{props.type === 1 ? t('IDS_LEVEL_1_7') : t('IDS_LEVEL_8_10')}</div>
            );
          },
        },
        {
          title: t('IDS_EVALUATION_SKILL'),
          dataIndex: 'flagSkill',
          width: '5rem',
          align: 'left' as const,
          render: (_text: any) => {
            return <div>{props.flagSkill === 1 ? t('IDS_HAVE') : t('IDS_NOT_HAVE')}</div>;
          },
        },
      ];
    } else {
      return [];
    }
  };

  const listEvaluationCalculationHistoryColumns = [
    {
      title: t('IDS_VERSION'),
      dataIndex: 'versionDisplay',
      width: '5rem',
      align: 'center' as const,
    },
    ...displayLevelAndTypeSkill(),
    {
      title: t('IDS_STATUS'),
      dataIndex: 'status',
      width: '5rem',
      align: 'center' as const,
      render(status: number) {
        return (
          <div
            style={{
              textAlign: 'left',
              fontWeight: status === 4 ? 'bold' : '',
            }}
          >
            {listStatus[status - 1]}
          </div>
        );
      },
    },
    {
      title: t('IDS_LAST_UPDATE_USER'),
      dataIndex: 'creationUser',
      width: '5rem',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'left' }}>{record?.user === null ? '' : record.user?.fullName}</div>;
      },
    },
    {
      title: t('IDS_LAST_UPDATE_DATE'),
      dataIndex: 'lastUpdatedTime',
      width: '5rem',
      align: 'center' as const,
    },
    {
      title: t('IDS_PUBLIC_DATE'),
      dataIndex: 'publicDate',
      width: '5rem',
      align: 'center' as const,
    },
  ];

  return listEvaluationCalculationHistoryColumns;
};
