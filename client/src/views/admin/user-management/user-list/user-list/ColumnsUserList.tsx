import { ClockCircleOutlined, EditTwoTone, EyeTwoTone } from '@ant-design/icons';
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

const CELL_STYLE: React.CSSProperties = { fontSize: 14, color: 'rgba(0,0,0,0.88)' };

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
        <Space key={record.id} size={10}>
          <Tooltip
            title={t('IDS_HISTORY_EDIT')}
            color="#424242"
            overlayInnerStyle={{ fontSize: 11 }}
          >
            <ClockCircleOutlined
              style={{ cursor: 'pointer', fontSize: 16, color: '#007240' }}
              onClick={() => props.setHistoryModalOpen({ userId: record.id, isOpen: true })}
            />
          </Tooltip>
          <Tooltip
            title="ユーザ詳細設定"
            color="#424242"
            overlayInnerStyle={{ fontSize: 11 }}
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
      title: <span style={{ fontSize: 14 }}>{t('IDS_FULLNAME')}</span>,
      dataIndex: 'name',
      width: '13%',
      align: 'center' as const,
      render: (_text: any, record: any) => (
        <div style={{ ...CELL_STYLE, textAlign: 'left' }}>
          {record.employeeNumber + ': ' + record.fullName}
        </div>
      ),
    },
    {
      title: <span style={{ fontSize: 14 }}>{t('IDS_DEPARTMENT')}</span>,
      dataIndex: 'companyName',
      width: '25%',
      align: 'left' as const,
      render: (_text: any, record: any) => (
        <Space direction="vertical" size={2}>
          <div style={CELL_STYLE}>
            {t('IDS_COMPANY')}: {record.company === null ? '' : record.company.name}
          </div>
          {record.division !== null && (
            <div style={CELL_STYLE}>
              {t('IDS_TYPE_DIVISION_NAME')}: {record.division === null ? '' : record.division.name}
            </div>
          )}
          {record.department !== null && (
            <div style={CELL_STYLE}>
              {t('IDS_DEPARTMENT')}: {record.department === null ? '' : record.department.name}
            </div>
          )}
        </Space>
      ),
    },
    {
      title: <span style={{ fontSize: 14 }}>{t('IDS_LEVEL')}</span>,
      dataIndex: 'level',
      width: '4%',
      align: 'center' as const,
      render: (_text: any, record: any) => (
        <div style={{ ...CELL_STYLE, textAlign: 'center' }}>
          {record.level === null ? '' : record.level}
        </div>
      ),
    },
    {
      title: <span style={{ fontSize: 14 }}>{t('IDS_EVALUATION_SKILL')}</span>,
      dataIndex: 'flagSkill',
      width: '8%',
      align: 'center' as const,
      render: (_text: any, record: any) => (
        <div style={{ ...CELL_STYLE, textAlign: 'center' }}>
          {handleDisplayFlagSkillByLevel(record)}
        </div>
      ),
    },
    {
      title: <span style={{ fontSize: 14 }}>{t('IDS_EMAIL')}</span>,
      dataIndex: 'email',
      width: '20%',
      align: 'center' as const,
      render: (_text: any, record: any) => (
        <div style={{ ...CELL_STYLE, textAlign: 'left' }}>
          {record.email ? record.email : ''}
        </div>
      ),
    },
    {
      title: <span style={{ fontSize: 14 }}>{t('IDS_ROLE')}</span>,
      dataIndex: 'role',
      width: '25%',
      align: 'center' as const,
      render: (_text: any, record: any) => (
        <div style={{ ...CELL_STYLE, textAlign: 'left', whiteSpace: 'pre-wrap' }}>
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
