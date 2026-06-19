import React, { useEffect, useState } from 'react';
import { Card, Form, Grid, Table, Typography } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { t } from 'i18next';
import userEvaluationApiService from '../../../common/api/userEvaluation';

const DepartmentGoal: React.FC<any> = (_props: any) => {
  const { Text } = Typography;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<any>();
  const [division, setDivision] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [isHaveDivision, setIsHaveDivision] = useState<boolean>(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const role = searchParams.get('role');
  const breaks = Grid.useBreakpoint();
  useEffect(() => {
    // get data role tương ứng với F1, F2, F5

    if ((id && !Number.isInteger(Number(id))) || (role !== '1' && role !== '2' && role !== '5')) {
      navigate('/404page');
    } else {
      handleGetData(id, role);
    }
  }, [id]);
  const handleGetData = async (id: string | null, role: string | null) => {
    const callback = (res: any) => {
      setDataSource(res.evaluationAchievementPersonals);
      setDivision(res.divisionName ? res.divisionName : t('MESSAGE.COMMON.IDM_NOT_DIVISION'));
      setIsHaveDivision(res.divisionName ? true : false);
      setTitle(res.title);
    };
    await userEvaluationApiService.getDepartmentGoal(id, role, callback, setIsLoading);
  };
  const onCell = () => {
    return { style: { verticalAlign: 'top' } };
  };

  const columns = [
    {
      title: t('IDS_GOAL_DEPARTMENT'),
      dataIndex: 'title',
      key: 'title',
      align: 'left' as const,
      width: '20%',
      onCell,
      render: (text: any, _record: any, _index: any) => {
        return <Text style={{ whiteSpace: 'pre-wrap' }}>{text}</Text>;
      },
    },
    {
      title: t('IDS_ACHIEVEMENT_VALUE'),
      dataIndex: 'achievementValue',
      key: 'achievementValue',
      width: '17%',
      onCell,
      render: (text: any, _record: any, _index: any) => {
        return <Text style={{ whiteSpace: 'pre-wrap' }}>{text}</Text>;
      },
    },
    {
      title: t('IDS_METHOD'),
      dataIndex: 'method',
      key: 'method',
      onCell,
      render: (text: any, _record: any, _index: any) => {
        return <Text style={{ whiteSpace: 'pre-wrap' }}>{text}</Text>;
      },
    },
  ];
  const comlumnChildrens = [
    {
      title: t('IDS_EVALUATION_JUDGMENT_INDEX'),
      dataIndex: 'evaluationDecision',
      key: 'evaluationDecision',
      align: 'left' as const,
      onCell,
      render: (text: any, _record: any, _index: any) => {
        return <Text style={{ whiteSpace: 'pre-wrap' }}>{text}</Text>;
      },
    },
    {
      title: t('IDS_COEFFICIENT'),
      dataIndex: 'coefficient',
      key: 'coefficient',
      width: '10%',
      align: 'center' as const,
      onCell,
      render: (text: any, _record: any, _index: any) => {
        return <Text style={{ whiteSpace: 'pre-wrap' }}>{Number(text).toFixed(1)}</Text>;
      },
    },
  ];

  return (
    <>
      <Card>
        <Typography.Title level={3} style={{ paddingBottom: 10 }}>
          {t('IDS_GOAL_DEPARTMENT')}
        </Typography.Title>
        <Form labelAlign="left" labelCol={{ span: 1 }} colon={false} requiredMark={false} style={{ marginBottom: 0 }}>
          <Form.Item label={t('IDS_EVALUATION_PERIOD')} className="ant-form-item-info">
            {title && title}
          </Form.Item>
          {isHaveDivision ? (
            <Form.Item className="ant-form-item-info" label={t('IDS_DEPARTMENT')}>
              <Typography>{division}</Typography>
            </Form.Item>
          ) : (
            <Form.Item className="ant-form-item-info" label={t('IDS_DEPARTMENT')} style={{ color: 'red' }}>
              {division}
            </Form.Item>
          )}
        </Form>
      </Card>
      <Table
        loading={isLoading}
        size="small"
        style={{ wordBreak: 'break-all', marginTop: 15 }}
        scroll={{ x: !breaks.lg ? 900 : undefined }}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
        locale={{
          emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
        }}
        expandable={{
          defaultExpandAllRows: true,

          expandedRowRender: (record) => (
            <>
              <Table
                size="small"
                style={{ wordBreak: 'break-all' }}
                pagination={false}
                bordered
                columns={comlumnChildrens}
                dataSource={record.evaluationAchievementPersonalSubs}
                locale={{
                  emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
                }}
              />
            </>
          ),
        }}
      />
    </>
  );
};

export default DepartmentGoal;
