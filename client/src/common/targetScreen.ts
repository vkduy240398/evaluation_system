import { t } from 'i18next';
import { Roles } from '../constant/Roles';

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
  disableCheckbox?: boolean;
  key?: string;
}

export const optionsTargetScreens = (arrKeyFilter?: string[]): Option[] => {
  return [
    {
      label: t('IDS_TITLE_NOTIFICATION'),
      value: 'IDS_TITLE_NOTIFICATION',
      key: 'common',
    },
    {
      label: t('IDL_LIST_ROLE.1'),
      value: 'IDL_LIST_ROLE.1',
      key: 'F1',
      children: [
        {
          label: t('IDS_LIST_EVALUATION'),
          value: 'IDS_LIST_EVALUATION',
          children: [
            {
              label: t('IDS_DETAIL_EVALUATION'),
              value: 'IDS_DETAIL_EVALUATION',
              children: [
                {
                  label: t('IDS_DIVISION_EVALUATION'),
                  value: 'IDS_DIVISION_EVALUATION',
                  children: [
                    {
                      label: t('IDS_ACHIEVEMENT_ADDITIONAL'),
                      value: 'IDS_ACHIEVEMENT_ADDITIONAL',
                    },
                    {
                      label: t('IDS_DEPARTMENT_RESULTS'),
                      value: 'IDS_DEPARTMENT_RESULTS',
                    },
                    {
                      label: t('IDS_COMMENT'),
                      value: 'IDS_COMMENT',
                    },
                  ],
                },
                {
                  label: t('IDS_EVALUATION_PERSONAL'),
                  value: 'IDS_EVALUATION_PERSONAL',
                  children: [
                    {
                      label: t('IDS_BASIC_SKILL'),
                      value: 'IDS_BASIC_SKILL',
                    },
                    {
                      label: t('IDS_PRO_SKILL'),
                      value: 'IDS_PRO_SKILL',
                    },
                    {
                      label: t('IDS_BEHAVIOR'),
                      value: 'IDS_BEHAVIOR',
                    },
                    {
                      label: t('IDS_PERSONAL_RESULT_CREATION'),
                      value: 'IDS_PERSONAL_RESULT_CREATION',
                    },
                    {
                      label: t('IDS_ACHIEVEMENT_ADDITIONAL'),
                      value: 'IDS_ACHIEVEMENT_ADDITIONAL',
                    },
                    {
                      label: t('IDS_COMMENT'),
                      value: 'IDS_COMMENT',
                    },
                  ],
                },
                {
                  label: t('IDS_GOAL_DEPARTMENT'),
                  value: 'IDS_GOAL_DEPARTMENT',
                },
                {
                  label: t('IDS_HISTORY_APPROVE'),
                  value: 'IDS_HISTORY_APPROVE',
                },
                {
                  label: t('IDS_EVALUATION_CRITERIA'),
                  value: 'IDS_EVALUATION_CRITERIA',
                },
              ],
            },
          ],
        },
        {
          label: t('IDS_REFERENCE_BEHAVIOR'),
          value: 'IDS_REFERENCE_BEHAVIOR',
        },
        {
          label: t('IDS_REFERENCE_BASIC'),
          value: 'IDS_REFERENCE_BASIC',
        },
        {
          label: t('IDS_REFERENCE_PRO'),
          value: 'IDS_REFERENCE_PRO',
        },
        {
          label: t('IDS_GOAL_DEPARTMENT'),
          value: 'IDS_GOAL_DEPARTMENT',
        },
        {
          label: t('IDS_EVALUATION_CRITERIA'),
          value: 'IDS_EVALUATION_CRITERIA',
        },
      ],
    },
    {
      label: t('IDL_LIST_ROLE.2'),
      value: 'IDL_LIST_ROLE.2',
      key: 'F2',
      children: [
        {
          label: t('IDS_LIST_EVALUATION'),
          value: 'IDS_LIST_EVALUATION',
          children: [
            {
              label: t('IDS_DETAIL_EVALUATION'),
              value: 'IDS_DETAIL_EVALUATION',
              children: [
                {
                  label: t('IDS_DIVISION_EVALUATION'),
                  value: 'IDS_DIVISION_EVALUATION',
                  children: [
                    {
                      label: t('IDS_ACHIEVEMENT_ADDITIONAL'),
                      value: 'IDS_ACHIEVEMENT_ADDITIONAL',
                    },
                    {
                      label: t('IDS_DEPARTMENT_RESULTS'),
                      value: 'IDS_DEPARTMENT_RESULTS',
                    },
                    {
                      label: t('IDS_COMMENT'),
                      value: 'IDS_COMMENT',
                    },
                  ],
                },
                {
                  label: t('IDS_EVALUATION_PERSONAL'),
                  value: 'IDS_EVALUATION_PERSONAL',
                  children: [
                    {
                      label: t('IDS_BASIC_SKILL'),
                      value: 'IDS_BASIC_SKILL',
                    },
                    {
                      label: t('IDS_PRO_SKILL'),
                      value: 'IDS_PRO_SKILL',
                    },
                    {
                      label: t('IDS_BEHAVIOR'),
                      value: 'IDS_BEHAVIOR',
                    },
                    {
                      label: t('IDS_PERSONAL_RESULT'),
                      value: 'IDS_PERSONAL_RESULT',
                    },
                    {
                      label: t('IDS_ACHIEVEMENT_ADDITIONAL'),
                      value: 'IDS_ACHIEVEMENT_ADDITIONAL',
                    },
                    {
                      label: t('IDS_COMMENT'),
                      value: 'IDS_COMMENT',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: t('IDS_LIST_PRO_SKILL_PUBLIC'),
          value: 'IDS_LIST_PRO_SKILL_PUBLIC',
          children: [
            {
              label: t('IDS_DETAIL_PRO_SKILL'),
              value: 'IDS_DETAIL_PRO_SKILL',
            },
          ],
        },
      ],
    },
    {
      label: t('IDL_LIST_ROLE.3'),
      value: 'IDL_LIST_ROLE.3',
      key: 'F3',
      children: [
        {
          label: t('IDS_MENU_HISTORY_PRO_SKILL'),
          value: 'IDS_MENU_HISTORY_PRO_SKILL',
          children: [
            {
              label: t('IDS_TAB_NEW_VERSION'),
              value: 'IDS_TAB_NEW_VERSION',
              children: [
                {
                  label: t('IDS_DETAIL_PRO_SKILL'),
                  value: 'IDS_DETAIL_PRO_SKILL',
                  children: [{ label: t('IDS_HISTORY_APPROVE'), value: 'IDS_HISTORY_APPROVE' }],
                },
              ],
            },
            {
              label: t('IDS_TAB_HISTORY'),
              value: 'IDS_TAB_HISTORY',
              children: [
                {
                  label: t('IDS_DETAIL_PRO_SKILL'),
                  value: 'IDS_DETAIL_PRO_SKILL',
                  children: [{ label: t('IDS_HISTORY_APPROVE'), value: 'IDS_HISTORY_APPROVE' }],
                },
              ],
            },
          ],
        },
        {
          label: t('IDS_LIST_PRO_SKILL_PUBLIC'),
          value: 'IDS_LIST_PRO_SKILL_PUBLIC',
          children: [
            {
              label: t('IDS_DETAIL_PRO_SKILL'),
              value: 'IDS_DETAIL_PRO_SKILL',
              children: [{ label: t('IDS_HISTORY_APPROVE'), value: 'IDS_HISTORY_APPROVE' }],
            },
          ],
        },
        {
          label: t('IDS_EXPORT_PRO_SKILL'),
          value: 'IDS_EXPORT_PRO_SKILL',
        },
      ],
    },
    {
      label: t('IDL_LIST_ROLE.4'),
      value: 'IDL_LIST_ROLE.4',
      key: 'F4',
      children: [
        {
          label: t('IDS_LIST_APPROVE_PRO_SKILL'),
          value: 'IDS_LIST_APPROVE_PRO_SKILL',
          children: [
            {
              label: t('IDS_DETAIL_PRO_SKILL'),
              value: 'IDS_DETAIL_PRO_SKILL',
              children: [{ label: t('IDS_HISTORY_APPROVE'), value: 'IDS_HISTORY_APPROVE' }],
            },
          ],
        },
        {
          label: t('IDS_LIST_PRO_SKILL_PUBLIC'),
          value: 'IDS_LIST_PRO_SKILL_PUBLIC',
          children: [
            {
              label: t('IDS_DETAIL_PRO_SKILL'),
              value: 'IDS_DETAIL_PRO_SKILL',
              children: [{ label: t('IDS_HISTORY_APPROVE'), value: 'IDS_HISTORY_APPROVE' }],
            },
          ],
        },
        {
          label: t('IDS_EXPORT_PRO_SKILL'),
          value: 'IDS_EXPORT_PRO_SKILL',
        },
      ],
    },
    {
      label: t('IDL_LIST_ROLE.5'),
      value: 'IDL_LIST_ROLE.5',
      key: 'F5',
      children: [
        {
          label: t('IDL_LIST_MENU_F5.1'),
          value: 'IDL_LIST_MENU_F5.1',
          children: [
            {
              label: t('IDS_DETAIL_EVALUATION'),
              value: 'IDS_DETAIL_EVALUATION',
              children: [
                {
                  label: t('IDS_DIVISION_EVALUATION'),
                  value: 'IDS_DIVISION_EVALUATION',
                  children: [
                    {
                      label: t('IDS_ACHIEVEMENT_ADDITIONAL'),
                      value: 'IDS_ACHIEVEMENT_ADDITIONAL',
                    },
                    {
                      label: t('IDS_DEPARTMENT_RESULTS'),
                      value: 'IDS_DEPARTMENT_RESULTS',
                    },
                    {
                      label: t('IDS_COMMENT'),
                      value: 'IDS_COMMENT',
                    },
                  ],
                },
                {
                  label: t('IDS_EVALUATION_PERSONAL'),
                  value: 'IDS_EVALUATION_PERSONAL',
                  children: [
                    {
                      label: t('IDS_BASIC_SKILL'),
                      value: 'IDS_BASIC_SKILL',
                    },
                    {
                      label: t('IDS_PRO_SKILL'),
                      value: 'IDS_PRO_SKILL',
                    },
                    {
                      label: t('IDS_BEHAVIOR'),
                      value: 'IDS_BEHAVIOR',
                    },
                    {
                      label: t('IDS_PERSONAL_RESULT'),
                      value: 'IDS_PERSONAL_RESULT',
                    },
                    {
                      label: t('IDS_ACHIEVEMENT_ADDITIONAL'),
                      value: 'IDS_ACHIEVEMENT_ADDITIONAL',
                    },
                    {
                      label: t('IDS_COMMENT'),
                      value: 'IDS_COMMENT',
                    },
                  ],
                },
                {
                  label: t('IDS_GOAL_DEPARTMENT'),
                  value: 'IDS_GOAL_DEPARTMENT',
                },
                {
                  label: t('IDS_HISTORY_APPROVE'),
                  value: 'IDS_HISTORY_APPROVE',
                },
                {
                  label: t('IDS_EVALUATION_CRITERIA'),
                  value: 'IDS_EVALUATION_CRITERIA',
                },
              ],
            },
          ],
        },
        {
          label: t('IDL_LIST_MENU_F5.2'),
          value: 'IDL_LIST_MENU_F5.2',
          children: [
            { label: t('IDS_LIST_FIX_GOAL'), value: 'IDS_LIST_FIX_GOAL' },
            { label: t('IDS_LIST_FIX_EVALUATION'), value: 'IDS_LIST_FIX_EVALUATION' },
            { label: t('IDS_IMPLEMENT_DETAIL'), value: 'IDS_IMPLEMENT_DETAIL' },
          ],
        },
        {
          label: t('IDL_LIST_MENU_F5.4'),
          value: 'IDL_LIST_MENU_F5.4',
          children: [{ label: t('IDS_DETAIL_FEEDBACK'), value: 'IDS_DETAIL_FEEDBACK' }],
        },
      ],
    },
    {
      label: t('IDL_LIST_ROLE.7'),
      value: 'IDL_LIST_ROLE.7',
      key: 'F7',
      children: [
        {
          label: t('IDL_LIST_MENU_F7.1'),
          value: 'IDL_LIST_MENU_F7.1',
        },
      ],
    },
    {
      label: t('IDL_LIST_ROLE.6'),
      value: 'IDL_LIST_ROLE.6',
      key: 'F6',
      children: [
        {
          label: t('IDL_LIST_MENU_F6.1'),
          value: 'IDL_LIST_MENU_F6.1',
          children: [
            { label: t('IDS_DETAIL_BASIC_SKILL'), value: 'IDS_DETAIL_BASIC_SKILL' },
            { label: t('IDS_DETAIL_BEHAVIOR'), value: 'IDS_DETAIL_BEHAVIOR' },
          ],
        },
        {
          label: t('IDL_LIST_MENU_F6.2'),
          value: 'IDL_LIST_MENU_F6.2',
          children: [{ label: t('IDS_DETAIL_PRO_SKILL'), value: 'IDS_DETAIL_PRO_SKILL' }],
        },
        {
          label: t('IDL_LIST_MENU_F6.3'),
          value: 'IDL_LIST_MENU_F6.3',
          children: [{ label: t('IDS_TITLE_CALCULATION'), value: 'IDS_TITLE_CALCULATION' }],
        },
        {
          label: t('IDS_TITLE_CRITERIA_SCREEN'),
          value: 'IDS_TITLE_CRITERIA_SCREEN',
          children: [{ label: t('IDS_EVALUATION_CRITERIA_DETAIL'), value: 'IDS_EVALUATION_CRITERIA_DETAIL' }],
        },
        {
          label: t('IDL_LIST_MENU_F6.5'),
          value: 'IDL_LIST_MENU_F6.5',
        },
        {
          label: t('IDL_LIST_MENU_F6.6'),
          value: 'IDL_LIST_MENU_F6.6',
          children: [{ label: t('IDS_DETAIL_NOTIFICATION'), value: 'IDS_DETAIL_NOTIFICATION' }],
        },
        {
          label: t('IDS_EXPORT_PRO_SKILL'),
          value: 'IDS_EXPORT_PRO_SKILL',
        },
        {
          label: t('IDL_LIST_MENU_F6.7'),
          value: 'IDL_LIST_MENU_F6.7',
          children: [
            {
              label: t('IDS_ADD_PERMISSION_EVALUATION'),
              value: 'IDS_ADD_PERMISSION_EVALUATION',
            },
          ],
        },
      ],
    },
    {
      label: t('IDL_LIST_ROLE.8'),
      value: 'IDL_LIST_ROLE.8',
      key: 'F8',
      children: [
        {
          label: t('IDS_LIST_DIVISION'),
          value: 'IDS_LIST_DIVISION',
          children: [
            {
              label: t('IDS_LIST_DEPARTMENT'),
              value: 'IDS_LIST_DEPARTMENT',
            },
          ],
        },
        {
          label: t('IDS_ADD_DEPARTMENT'),
          value: 'IDS_ADD_DEPARTMENT',
        },
        {
          label: t('IDS_LIST_USER'),
          value: 'IDS_LIST_USER',
          children: [
            {
              label: t('IDS_USER_DETAIL'),
              value: 'IDS_USER_DETAIL',
            },
          ],
        },
        {
          label: t('IDS_ADD_USER'),
          value: 'IDS_ADD_USER',
        },
      ],
    },
    {
      label: t('IDS_REQUEST_REGARDING'),
      value: 'IDS_REQUEST_REGARDING',
      key: 'feedback',
    },
    {
      label: t('IDS_LIST_REFERENCE_REVIEW'),
      value: 'IDS_LIST_REFERENCE_REVIEW',
      key: 'reference-review',
      children: [
        {
          label: t('IDS_DETAIL_EVALUATION'),
          value: 'IDS_DETAIL_EVALUATION',
          children: [
            {
              label: t('IDS_DIVISION_EVALUATION'),
              value: 'IDS_DIVISION_EVALUATION',
              children: [
                {
                  label: t('IDS_ACHIEVEMENT_ADDITIONAL'),
                  value: 'IDS_ACHIEVEMENT_ADDITIONAL',
                },
                {
                  label: t('IDS_DEPARTMENT_RESULTS'),
                  value: 'IDS_DEPARTMENT_RESULTS',
                },
                {
                  label: t('IDS_COMMENT'),
                  value: 'IDS_COMMENT',
                },
              ],
            },
            {
              label: t('IDS_EVALUATION_PERSONAL'),
              value: 'IDS_EVALUATION_PERSONAL',
              children: [
                {
                  label: t('IDS_BASIC_SKILL'),
                  value: 'IDS_BASIC_SKILL',
                },
                {
                  label: t('IDS_PRO_SKILL'),
                  value: 'IDS_PRO_SKILL',
                },
                {
                  label: t('IDS_BEHAVIOR'),
                  value: 'IDS_BEHAVIOR',
                },
                {
                  label: t('IDS_PERSONAL_RESULT'),
                  value: 'IDS_PERSONAL_RESULT',
                },
                {
                  label: t('IDS_ACHIEVEMENT_ADDITIONAL'),
                  value: 'IDS_ACHIEVEMENT_ADDITIONAL',
                },
                {
                  label: t('IDS_COMMENT'),
                  value: 'IDS_COMMENT',
                },
              ],
            },
            {
              label: t('IDS_HISTORY_APPROVE'),
              value: 'IDS_HISTORY_APPROVE',
            },
          ],
        },
      ],
    },
    {
      label: t('IDS_UNDETERMINED'),
      value: 'IDS_UNDETERMINED',
      key: 'undertermined',
    },
  ].filter((item) => !arrKeyFilter?.includes(item.key) || item.key === 'undertermined');
};

export const getListExceptRoleByUser = (roles: Roles[] | undefined, role: 'user' | 'admin' | 'systemAdmin') => {
  if (role === 'admin' || role === 'systemAdmin') return [];

  const listRoles: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const setRole = new Set(roles);

  return listRoles.filter((num: number) => !setRole.has(num));
};

export const getListKeyExceptRole = (roles: Roles[] | undefined, role: 'user' | 'admin' | 'systemAdmin') => {
  // voi role admin, system admin thi khong can filter
  if (role === 'admin' || role === 'systemAdmin') return [];

  const listRoles = getListExceptRoleByUser(roles, role);
  const array: string[] = [];

  listRoles.forEach((role) => {
    array.push(`F${role}`);
  });

  return array;
};
