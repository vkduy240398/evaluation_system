import { t } from 'i18next';
import { ConditionSearchPaging } from '../common/ConditionSearchPaging';

export interface ConditionListVersionNotification extends ConditionSearchPaging {
  status: number;
  [any: string]: any;
}

export interface ListVersionNotification {
  rows: any[] | undefined;
  total: number;
}

export const getOptionNotificationStatuses = () => {
  const optionStatuses = [
    {
      value: -1,
      label: t('IDS_ALL'),
    },
    {
      value: 1,
      label: (t('IDL_LIST_STATUS_VERSION_SETTING', { returnObjects: true }) as any)[1],
    },
    {
      value: 2,
      label: (t('IDL_LIST_STATUS_VERSION_SETTING', { returnObjects: true }) as any)[2],
    },
    {
      value: 3,
      label: (t('IDL_LIST_STATUS_VERSION_SETTING', { returnObjects: true }) as any)[3],
    },
    {
      value: 4,
      label: (t('IDL_LIST_STATUS_VERSION_SETTING', { returnObjects: true }) as any)[4],
    },
  ];

  return optionStatuses;
};
