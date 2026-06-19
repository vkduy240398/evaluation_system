import { ColumnsType } from 'antd/es/table';
import { ProSkillPublicType } from '../../../../types/pages/user-evaluation/UserEvaluationType';
import { t } from 'i18next';
import { Select } from 'antd/lib';
import { CSSProperties } from 'react';
import EmptyComponent from '../../../../common/EmptyComponent';

type Option = { value: string; label: string };
const proSkillColumnPublic = ({
  onHandleSearch,

  jobTypes,
  mediumClasses,
  smallClasses,
}: {
  onHandleSearch: (value: string, name: string) => void;
  jobTypes: Option[];
  mediumClasses: Option[];
  smallClasses: Option[];
}) => {
  const onCell = () => {
    return { style: { verticalAlign: 'top' } };
  };

  const styleTitle = {
    fontSize: 13,
    backgroundColor: '#007240',
    color: 'white',
    textAlign: 'center',
    margin: -4,
    marginBottom: 0,
    whiteSpace: 'nowrap',
    padding: '0 4px',
    fontWeight: 'bold',
  } as CSSProperties;

  const columns: ColumnsType<ProSkillPublicType> = [
    {
      title: (
        <>
          <div style={styleTitle}>{t('IDS_JOB_TYPE')}</div>

          <Select
            options={jobTypes}
            style={{ width: '100%', textAlign: 'left' }}
            showSearch
            filterOption={(input: any, option: any) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            onChange={(value) => onHandleSearch(value, 'jobType')}
            placeholder={t('IDS_JOB_TYPE') as string}
            allowClear
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          />
        </>
      ),
      dataIndex: 'jobType',
      width: '6rem',
      onCell,
      align: 'left' as const,
    },
    {
      title: (
        <>
          <div style={styleTitle}>{t('IDS_LARGE_MEDIUM_CATEGORY')}</div>

          <Select
            options={mediumClasses}
            style={{ width: '100%', textAlign: 'left' }}
            showSearch
            filterOption={(input: any, option: any) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            onChange={(value) => onHandleSearch(value, 'mediumClass')}
            allowClear
            placeholder={t('IDS_LARGE_MEDIUM_CATEGORY') as string}
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          />
        </>
      ),
      dataIndex: 'mediumClass',
      width: '6.5rem',
      onCell,
      align: 'left' as const,
    },
    {
      title: (
        <>
          <div style={styleTitle}>{t('IDS_SMALL_CATEGORY')}</div>

          <Select
            options={smallClasses}
            style={{ width: '100%', textAlign: 'left' }}
            showSearch
            filterOption={(input: any, option: any) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            onChange={(value) => onHandleSearch(value, 'smallClass')}
            placeholder={t('IDS_SMALL_CATEGORY') as string}
            allowClear
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          />
        </>
      ),
      dataIndex: 'smallClass',
      onCell,
      align: 'left' as const,
      width: '6rem',
    },
    {
      title: t('IDS_EVALUATION_CONTENT'),
      dataIndex: 'content',
      onCell,
      align: 'left' as const,
      width: '20rem',
    },
    {
      title: t('IDS_DIFFICULTY'),
      dataIndex: 'difficulty',
      onCell,
      align: 'center' as const,
      width: '3rem',
    },
    {
      title: t('IDS_EVALUATION_CRITERIA'),
      dataIndex: 'note',
      onCell,
      align: 'center' as const,
      key: 'note',
      width: '20rem',
      render: (text, _, _index) => (
        <div>
          <p style={{ textAlign: 'left', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{text}</p>
        </div>
      ),
    },
  ];

  return columns;
};

export default proSkillColumnPublic;
