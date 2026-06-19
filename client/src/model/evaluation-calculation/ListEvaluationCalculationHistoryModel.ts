import { t } from 'i18next';

export interface ConditionListEvaluationCalculationHistory {
  offset: number;
  limit: number;
  sortBy: string;
  sortType: string;
  type: number;
  status: number;
  current: number;
  search?: boolean;
  [any: string]: any;
}

export interface ListEvaluationCalculationHistory {
  rows: any[] | undefined;
  total: number;
}

export const getOptionStatuses = () => {
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
      label: (t('IDL_LIST_STATUS_VERSION_SETTING', { returnObjects: true }) as any)[2]
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
