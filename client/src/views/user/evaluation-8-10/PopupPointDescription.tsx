import { Table, Typography } from 'antd';
import { t } from 'i18next';
import { SubList } from './interfaces/response.interface';

interface Props {
  dataSubTemps: SubList[];
}
const PopupPointDescription: React.FC<any> = (props: Props) => {
  const { dataSubTemps } = props;

  const { Text } = Typography;

  const onCell = () => {
    return { style: { verticalAlign: 'top' } };
  };

  const columnsSubTemps = [
    {
      title: t('IDS_EVALUATION_JUDGMENT_INDEX'),
      dataIndex: 'evaluationDecision',
      key: 'evaluationDecision',
      align: 'left' as const,
      onCell,
      render: (text: string, _record: any, _index: any) => {
        return (
          <>
            <Text style={{ whiteSpace: 'pre-wrap' }}>{text}</Text>
          </>
        );
      },
    },
    {
      title: dataSubTemps.length && dataSubTemps[0].degree ? t('IDS_DEGREE') : t('IDS_COEFFICIENT'),
      dataIndex: 'coefficient',
      key: 'coefficient',
      width: '100px',
      render: (text: string, record: any) => {
        return (
          <>
            {record.degree ? (
              record.degree
            ) : (
              <div style={{ textAlign: 'center' }}>
                {text ? (Number.isInteger(Number(text)) ? Number(text).toFixed(1) : Number(text)) : ''}
              </div>
            )}
          </>
        );
      },
    },
  ];

  return (
    <Table
      size="small"
      style={{ wordBreak: 'break-all' }}
      dataSource={dataSubTemps}
      columns={columnsSubTemps}
      pagination={false}
      bordered
      locale={{
        emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
      }}
    />
  );
};

export default PopupPointDescription;
