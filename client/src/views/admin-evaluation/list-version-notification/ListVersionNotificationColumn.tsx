import { t } from 'i18next';

export const getListVersionNotificationColumn = () => {
  const listStatus = [
    (t('IDL_LIST_STATUS_VERSION_NOTIFICATION', { returnObjects: true }) as any)[1],
    (t('IDL_LIST_STATUS_VERSION_NOTIFICATION', { returnObjects: true }) as any)[2],
    (t('IDL_LIST_STATUS_VERSION_NOTIFICATION', { returnObjects: true }) as any)[3],
    (t('IDL_LIST_STATUS_VERSION_NOTIFICATION', { returnObjects: true }) as any)[4],
  ];

  const columns = [
    {
      title: t('IDS_VERSION'),
      dataIndex: 'versionDisplay',
      width: '5rem',
      align: 'center' as const,
    },
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

  return columns;
};
