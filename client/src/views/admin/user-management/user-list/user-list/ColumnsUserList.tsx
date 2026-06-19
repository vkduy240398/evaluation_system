import { ClockCircleOutlined, EditTwoTone, EyeTwoTone } from '@ant-design/icons';
import { Space, Tooltip } from 'antd';
import { TFunction } from 'i18next';
import React from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
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
    if (flagSkill === 1) {
      return t('IDS_HAVE');
    } else if (flagSkill === 0) {
      return t('IDS_NOT_HAVE');
    } else {
      return '';
    }
  };

  return [
    {
      title: ' ',
      width: '3%',
      align: 'center' as const,
      render: (record: any) => {
        return (
          <>
            <Space key={record.id}>
              <Tooltip title={t('IDS_HISTORY_EDIT')}>
                <ClockCircleOutlined
                  style={{ cursor: 'pointer', fontSize: 16, color: '#007240 ' }}
                  onClick={(e) => {
                    props.setHistoryModalOpen({ userId: record.id, isOpen: true });
                  }}
                />
              </Tooltip>
              <Tooltip title={'ユーザ詳細設定'}>
                <EyeTwoTone
                  style={{ cursor: 'pointer', fontSize: 16 }}
                  onClick={(e) => {
                    props.navigation(
                      urlCompanyCode() +
                        '/' +
                        window.location.pathname.split('/')[3] +
                        '/user-list/detail/' +
                        record.id,
                      {},
                    );
                  }}
                />
              </Tooltip>
            </Space>
          </>
        );
      },
    },
    {
      title: t('IDS_FULLNAME'),
      dataIndex: 'name',
      width: '13%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'left' }}>{record.employeeNumber + ': ' + record.fullName}</div>;
      },
    },
    {
      title: t('IDS_DEPARTMENT'),
      dataIndex: 'companyName',
      width: '25%',
      align: 'left' as const,
      render: (_text: any, record: any, _index: any) => {
        return (
          <Space direction="vertical">
            <div style={{ textAlign: 'left' }}>
              {t('IDS_COMPANY')}: {record.company === null ? '' : record.company.name}
            </div>
            {record.division !== null ? (
              <div style={{ textAlign: 'left' }}>
                {t('IDS_TYPE_DIVISION_NAME')}: {record.division === null ? '' : record.division.name}
              </div>
            ) : (
              ''
            )}
            {record.department !== null ? (
              <div style={{ textAlign: 'left' }}>
                {t('IDS_DEPARTMENT')}: {record.department === null ? '' : record.department.name}
              </div>
            ) : (
              ''
            )}
          </Space>
        );
      },
    },
    // {
    //   title: t('IDS_TYPE_DIVISION_NAME'),
    //   dataIndex: 'divisionName',
    //   width: '13%',
    //   align: 'center' as const,
    //   render: (_text: any, record: any, _index: any) => {
    //     return (
    //       <div style={{ textAlign: 'left', maxWidth: 200 }}>{record.division === null ? '' : record.division.name}</div>
    //     );
    //   },
    // },
    // {
    //   title: t('IDS_TYPE_DEPARTMENT_NAME'),
    //   dataIndex: 'departmentName',
    //   width: '16%',
    //   align: 'center' as const,
    //   render: (_text: any, record: any, _index: any) => {
    //     return (
    //       <div style={{ textAlign: 'left', maxWidth: 200 }}>
    //         {record.department === null ? '' : record.department.name}
    //       </div>
    //     );
    //   },
    // },
    {
      title: t('IDS_LEVEL'),
      dataIndex: 'level',
      width: '4%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'center' }}>{record.level === null ? '' : record.level}</div>;
      },
    },
    {
      title: t('IDS_EVALUATION_SKILL'),
      dataIndex: 'flagSkill',
      width: '8%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'center' }}>{handleDisplayFlagSkillByLevel(record)}</div>;
      },
    },
    {
      title: t('IDS_EMAIL'),
      dataIndex: 'email',
      width: '20%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'left' }}>{record.email ? record.email : ''}</div>;
      },
    },
    {
      title: t('IDS_ROLE'),
      dataIndex: 'role',
      width: '25%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return (
          <div style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>
            {record.roles.length === 0
              ? ''
              : record.roles
                  .sort((a: any, b: any) => {
                    if (a.id < b.id) {
                      return -1;
                    }
                    if (a.id > b.id) {
                      return 1;
                    }

                    return 0;
                  })
                  .map((i: any, index: any) => {
                    return roleName[`${i.id}`] + (index !== record.roles.length - 1 ? t('IDS_COMMA') : '');
                  })}
          </div>
        );
      },
    },
  ];
};

export default ColumnsUserList;
