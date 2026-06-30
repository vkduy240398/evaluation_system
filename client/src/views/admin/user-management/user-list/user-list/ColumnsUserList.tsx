import { ClockCircleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Space, Tooltip } from 'antd';
import { TFunction } from 'i18next';
import React from 'react';
import { NavigateFunction } from 'react-router-dom';
import { urlCompanyCode } from '../../../../../common/util';

interface Props {
  t: TFunction;
  setHistoryModalOpen: React.Dispatch<
    React.SetStateAction<{
      userId: string;
      isOpen: boolean;
    }>
  >;
  navigation: NavigateFunction;
}

const ColumnsUserList = (props: Props) => {
  const { t } = props;
  const roleName = {
    1: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[1],
    2: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[2],
    3: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[3],
    4: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[4],
    5: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[5],
    6: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[6],
    7: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[7],
    8: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[8],
    9: t('IDS_SYSTEM_ADMIN'),
  } as any;

  const handleDisplayFlagSkillByLevel = (record: { level: number; flagSkill: number }): string => {
    const { level, flagSkill } = record;
    if (flagSkill === 1) return t('IDS_HAVE');
    if (flagSkill === 0) return t('IDS_NOT_HAVE');
    return '';
  };

  return [
    {
      title: ' ',
      width: '3%',
      align: 'center' as const,
      render: (record: any) => (
        <Space key={record.id} size="small">
          <Tooltip
            title={t('IDS_HISTORY_EDIT')}
            color="#424242"
            overlayInnerStyle={{ fontSize: '11px' }}
          >
            <ClockCircleOutlined
              style={{ cursor: 'pointer', fontSize: 16 }}
              onClick={() => props.setHistoryModalOpen({ userId: record.id, isOpen: true })}
            />
          </Tooltip>
          <Tooltip
            title={t('IDS_MOVE_DETAIL_USER_MANAGEMENT')}
            color="#424242"
            overlayInnerStyle={{ fontSize: '11px' }}
          >
            <EyeTwoTone
              style={{ cursor: 'pointer', fontSize: 16 }}
              onClick={() =>
                props.navigation(
                  urlCompanyCode() +
                    '/' +
                    window.location.pathname.split('/')[3] +
                    '/user-list/detail/' +
                    record.id,
                  {},
                )
              }
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: t('IDS_FULLNAME'),
      dataIndex: 'name',
      width: '13%',
      align: 'center' as const,
      render: (_text: any, record: any) => (
        <div style={{ textAlign: 'left' }}>
          {record.employeeNumber + ': ' + record.fullName}
        </div>
      ),
    },
    {
      title: t('IDS_DEPARTMENT'),
      dataIndex: 'companyName',
      width: '25%',
      align: 'left' as const,
      render: (_text: any, record: any) => (
        <Space direction="vertical" size={4}>
          <div>
            {t('IDS_COMPANY')}: {record.company === null ? '' : record.company.name}
          </div>
          {record.division !== null && (
            <div>
              {t('IDS_TYPE_DIVISION_NAME')}: {record.division === null ? '' : record.division.name}
            </div>
          )}
          {record.department !== null && (
            <div>
              {t('IDS_DEPARTMENT')}: {record.department === null ? '' : record.department.name}
            </div>
          )}
        </Space>
      ),
    },
    {
      title: t('IDS_LEVEL'),
      dataIndex: 'level',
      width: '4%',
      align: 'center' as const,
      render: (_text: any, record: any) => (
        <div style={{ textAlign: 'center' }}>
          {record.level === null ? '' : record.level}
        </div>
      ),
    },
    {
      title: t('IDS_EVALUATION_SKILL'),
      dataIndex: 'flagSkill',
      width: '8%',
      align: 'center' as const,
      render: (_text: any, record: any) => (
        <div style={{ textAlign: 'center' }}>
          {handleDisplayFlagSkillByLevel(record)}
        </div>
      ),
    },
    {
      title: t('IDS_EMAIL'),
      dataIndex: 'email',
      width: '20%',
      align: 'center' as const,
      render: (_text: any, record: any) => (
        <div style={{ textAlign: 'left' }}>
          {record.email ? record.email : ''}
        </div>
      ),
    },
    {
      title: t('IDS_ROLE'),
      dataIndex: 'role',
      width: '25%',
      align: 'center' as const,
      render: (_text: any, record: any) => (
        <div style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>
          {record.roles.length === 0
            ? ''
            : record.roles
                .sort((a: any, b: any) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
                .map((i: any, index: any) =>
                  roleName[`${i.id}`] + (index !== record.roles.length - 1 ? t('IDS_COMMA') : ''),
                )}
        </div>
      ),
    },
  ];
};

export default ColumnsUserList;
