import { useEffect, useState } from 'react';
import userEvaluationApiService from '../../../../common/api/userEvaluation';
import { Form, Typography } from 'antd';
import { t } from 'i18next';
import TableDetailProSkillOfUser from './TableDetailProSkillOfUser';
const ProSkillComponent = () => {
  const [dataState, setDataState] = useState({
    dataSource: {},
    dataTable: [], // dùng cho search trên column header
    department: '',
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const callBack = (data: any) => {
    setDataState({
      ...dataState,
      dataSource: data,
      dataTable: data.results,
      department: data.department,
    });
  };
  useEffect(() => {
    userEvaluationApiService.getListProSkill(callBack, setLoading);
  }, []);

  return (
    <>
      {<Typography.Title level={3}>{t('IDS_REFERENCE_PRO')}</Typography.Title>}
      <Form style={{ marginBottom: 15 }} labelAlign="left" labelCol={{ span: 1 }} colon={false} requiredMark={false}>
        <Form.Item className="ant-form-item-info" label={t('IDS_DEPARTMENT')}>
          <Typography>{dataState?.department}</Typography>
        </Form.Item>
      </Form>
      <TableDetailProSkillOfUser dataState={dataState} isLoading={isLoading} />
    </>
  );
};

export default ProSkillComponent;
