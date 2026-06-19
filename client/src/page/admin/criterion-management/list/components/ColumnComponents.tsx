import { t } from 'i18next';
interface Props {
  type: number;
  isLoading: boolean;
  flagSkill: number;
}
const ColumnComponents = (props: Props) => {
  const Columns = [
    {
      title: t('IDS_LEVEL'),
      dataIndex: 'level',
      width: '5rem',
      align: 'center' as const,
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
    {
      title: t('IDS_VERSION'),
      dataIndex: 'versionNo',
      width: '5rem',
      align: 'center' as const,
    },
    {
      title: t('IDS_STATUS'),
      dataIndex: 'state',
      width: '10rem',
      align: 'left' as const,
      render: (_text: any) => {
        return (
          <div
            style={{
              fontWeight:
                _text === (t('IDL_LIST_STATUS_VERSION_SETTING', { returnObjects: true }) as any)[4] ? 'bold' : '',
            }}
          >
            {_text}
          </div>
        );
      },
    },

    {
      title: t('IDS_LAST_UPDATE_USER'),
      dataIndex: 'updatedBy',
      width: '10rem',
      align: 'left' as const,
    },
    {
      title: t('IDS_LAST_UPDATE_DATE'),
      dataIndex: 'lastUpdatedTime',
      width: '10rem',
      align: 'center' as const,
    },
    {
      title: t('IDS_PUBLIC_DATE'),
      dataIndex: 'releasedDate',
      width: '10rem',
      align: 'center' as const,
    },
  ];

  return Columns.filter((v) => (props.type === 1 ? v.dataIndex !== 'flagSkill' : v));
};

export default ColumnComponents;
