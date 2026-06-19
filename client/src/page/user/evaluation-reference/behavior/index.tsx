import { Typography } from 'antd';
import { useEffect, useState } from 'react';
import TableComponent from '../../../../views/user/evaluation-reference/TableComponent';
import userEvaluationApiService from '../../../../common/api/userEvaluation';
import { listBasicBehavior } from '../../../../model/BasicBehavior';
import { t } from 'i18next';

const BehaviorComponent = () => {
  const columns = [
    {
      title: t('IDS_EVALUATION_ITEM'),
      dataIndex: 'title',
      key: 'title',
      align: 'left' as const,
      width: '180px',
      render: (text: any, _record: any, _index: any) => {
        return <div style={{ verticalAlign: 'top' }}>{text}</div>;
      },
    },
    {
      title: t('IDS_EVALUATION_CONTENT'),
      dataIndex: 'content',
      key: 'content',
      render: (text: any, _record: any, _index: any) => {
        return <div style={{ verticalAlign: 'top' }}>{text}</div>;
      },
    },
    {
      title: t('IDS_DIFFICULTY'),
      dataIndex: 'difficulty',
      key: 'difficulty',
      align: 'center' as const,
      width: '60px',
    },
  ];
  const [dataSources, setDataSource] = useState<listBasicBehavior[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const callBack = (dataSources: listBasicBehavior[]) => {
    setDataSource(dataSources);
  };
  useEffect(() => {
    userEvaluationApiService.listBasicBehavior(callBack, setLoading, 2);
  }, []);

  return (
    <>
      {<Typography.Title level={3}>{t('IDS_REFERENCE_BEHAVIOR')}</Typography.Title>}
      <TableComponent dataSources={dataSources} column={columns} isLoading={isLoading} />
    </>
  );
};

export default BehaviorComponent;
