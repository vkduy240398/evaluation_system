import { useEffect, useState } from 'react';
import { Typography } from 'antd';
import TableComponent from '../../../../views/user/evaluation-reference/TableComponent';
import { listBasicBehavior } from '../../../../model/BasicBehavior';
import userEvaluationApiService from '../../../../common/api/userEvaluation';
import { t } from 'i18next';

const BasicComponent = () => {
  const columns = [
    {
      title: t('IDS_EVALUATION_ITEM'),
      dataIndex: 'title',
      key: 'title',
      align: 'left' as const,
      width: '180px',
      render: (text: any, _record: any, _index: any) => {
        return {
          props: {
            style: {
              wordBreak: 'break-word',
              verticalAlign: 'top',
            },
          },
          children: <>{text}</>,
        };
      },
    },
    {
      title: t('IDS_EVALUATION_CONTENT'),
      dataIndex: 'content',
      key: 'content',
      render: (text: any, _record: any, _index: any) => {
        return {
          props: {
            style: {
              wordBreak: 'break-word',
              verticalAlign: 'top',
            },
          },
          children: <>{text}</>,
        };
      },
    },
    {
      title: t('IDS_DIFFICULTY'),
      dataIndex: 'difficulty',
      key: 'difficulty',
      align: 'center' as const,
      width: '60px',
      render: (text: any, _record: any, _index: any) => {
        return {
          props: {
            style: {
              wordBreak: 'break-word',
              verticalAlign: 'top',
            },
          },
          children: <>{text}</>,
        };
      },
    },
  ];
  const [dataSources, setDataSource] = useState<listBasicBehavior[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const callBack = (dataSources: listBasicBehavior[]) => {
    setDataSource(dataSources);
  };
  useEffect(() => {
    userEvaluationApiService.listBasicBehavior(callBack, setLoading, 1);
  }, []);

  return (
    <>
      {<Typography.Title level={3}>{t('IDS_REFERENCE_BASIC')}</Typography.Title>}
      <TableComponent dataSources={dataSources} column={columns} isLoading={isLoading} />
    </>
  );
};

export default BasicComponent;
