import { ColumnType } from 'antd/es/table';
import { t } from 'i18next';
import SortColumnTitle from '../../../common/SortColumnTitle';

const columnUserProSkillExpertise = (setCondition: any, sortColumns: any, sortDirections: any): ColumnType<any>[] => {
  const getPreviousSortDirection = (row: string): 'ascend' | 'descend' | undefined => {
    const index = sortColumns?.indexOf(row);
    if (index === undefined || index < 0) {
      return undefined;
    } else {
      return sortDirections[index];
    }
  };

  return [
    {
      title: t('IDS_FULLNAME'),
      width: '7%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'left' }}>{record?.employeeNumber + ': ' + record?.userName}</div>;
      },
    },

    {
      title: t('IDS_DEPARTMENT'),
      width: '20%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        const lines = record?.divisionName
          ?.split('\n')
          .map((line: string, idx: number) => `${t('IDS_DEPARTMENT')}${idx + 1}: ${line.replaceAll('IDS_COMMA', t('IDS_COMMA'))}`);

        return (
          <div style={{ textAlign: 'left' }}>
            {lines?.map((line: string, idx: number) => (
              <div key={idx}>{line}</div>
            ))}
          </div>
        );
      },
    },
    {
      title: ({ sortColumns }) => (
        <SortColumnTitle
          title={t('IDS_LEVEL')}
          sortOrder={sortColumns?.find(({ column }) => column.dataIndex === 'level')?.order}
        />
      ),
      sorter: { multiple: 2 },
      defaultSortOrder: getPreviousSortDirection('level'),
      dataIndex: 'level',
      width: '3%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'center' }}>{record.level === null ? '' : record.level}</div>;
      },
    },
  ];
};

export default columnUserProSkillExpertise;
