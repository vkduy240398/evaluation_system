/* eslint-disable @typescript-eslint/naming-convention */
import { Form, Typography } from 'antd';
import { useEffect, useState } from 'react';
import ListCriteriaEvaluationTable from './components/ListCriteriaEvaluationTable';
import { t } from 'i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { conditionsListCriteriaHistorty, listCriteria } from '../../../model/Conditions';
import ListCriteriaSearchForm from './components/ListCriteriaSearchForm';
import PaginationV2 from '../../../common/PaginationV2';
import evaluationCriteriApiService from '../../../common/api/evaluationCritea';

const ListCriteriaEvaluationScreen: React.FC = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const statusList = [
    { id: 1, name: (t('IDL_LIST_STATUS_VERSION_SETTING', { returnObjects: true }) as any)[1] },
    { id: 2, name: (t('IDL_LIST_STATUS_VERSION_SETTING', { returnObjects: true }) as any)[2] },
    { id: 3, name: (t('IDL_LIST_STATUS_VERSION_SETTING', { returnObjects: true }) as any)[3] },
    { id: 4, name: (t('IDL_LIST_STATUS_VERSION_SETTING', { returnObjects: true }) as any)[4] },
  ];

  const [listStatus, setListStatus] = useState([]) as any;
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const temps = [{ id: t('IDS_ALL'), statusName: t('IDS_ALL') }];
    statusList.forEach((item: any) => {
      temps.push({ id: item.id, statusName: item.name });
    });
    setListStatus(temps);
  }, []);

  const [conditions, setConditions] = useState<conditionsListCriteriaHistorty>(
    location.state || {
      offset: 0,
      limit: 20,
      sortBy: 'periodIndex',
      sortType: 'ASC',
      type: 1,
      status: t('IDS_ALL'),
      current: 1,
      flagSkill: 1,
    },
  );
  const [dataSources, setDataSources] = useState<listCriteria>();

  const callBack = (dataSource: listCriteria) => {
    setDataSources(dataSource);
  };
  const errorCallBack = () => {
    setLoading(false);
  };
  useEffect(() => {
    navigate(location.pathname, {
      replace: true,
      state: conditions,
    });
    if (conditions?.search) {
      evaluationCriteriApiService.searchListEvaluationCriteriaHistory(conditions, callBack, setLoading);
    }
  }, [conditions]);

  return (
    <div>
      <Typography.Title level={3}>{t('IDS_TITLE_CRITERIA_SCREEN')}</Typography.Title>
      <ListCriteriaSearchForm
        form={form}
        conditions={conditions}
        setConditions={setConditions}
        setDataSources={setDataSources}
        isLoading={isLoading}
        listStatus={listStatus}
      />

      {conditions?.search && (
        <ListCriteriaEvaluationTable dataState={dataSources?.data} isLoading={isLoading} conditions={conditions} />
      )}
      {dataSources?.data && dataSources?.data.length > 0 && (
        <PaginationV2
          conditions={conditions}
          currents={conditions.current}
          dataSources={dataSources}
          errorCallBack={errorCallBack}
          limit={conditions.limit}
          location={location}
          navigates={navigate}
          setDataSources={setDataSources}
          url={'/api/v1/f6/management-evaluation/list-criteria-evaluation-history'}
          loading={isLoading}
          setLoading={setLoading}
        />
      )}
    </div>
  );
};

export default ListCriteriaEvaluationScreen;
