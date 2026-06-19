import { Typography } from 'antd';
import ListEvaluationTable from './components/ListEvaluationTable';
import SearchComponent from '../../../views/user/list-evaluation/SearchComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { conditionsEvaluation, listEvaluation } from '../../../model/Conditions';
import PaginationV2 from '../../../common/PaginationV2';
import userEvaluationApiService from '../../../common/api/userEvaluation';
import { t } from 'i18next';
import { EvaluationPeriodHelper } from '../../../common/utils/datetime/EvaluationPeriodHelper';
import { useAuth } from '../../../hooks/useAuth';

const ListEvaluationScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();

  const [conditions, setConditions] = useState<conditionsEvaluation>(
    location.state || {
      offset: 0,
      limit: 20,
      sortBy: 'periodIndex',
      sortType: 'ASC',
      yearStart: EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo'),
      yearEnd: EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo'),
      current: 1,
    },
  );
  const [dataSources, setDataSources] = useState<listEvaluation>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const callBack = (dataSource: listEvaluation) => {
    setDataSources(dataSource);
  };
  const errorCallBack = (bool: boolean) => {
    setLoading(bool);
  };
  useEffect(() => {
    navigate(location.pathname, {
      replace: true,
      state: conditions,
    });
    userEvaluationApiService.getEvaluationList(conditions, callBack, setLoading);
  }, [conditions]);

  return (
    <div>
      <Typography.Title level={3}>{t('IDS_LIST_EVALUATION')}</Typography.Title>
      <SearchComponent
        conditions={conditions}
        setConditions={setConditions}
        setDataSources={setDataSources}
        isLoading={isLoading}
      />
      {<ListEvaluationTable dataState={dataSources?.data} isLoading={isLoading} />}
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
          url={'/api/v1/f1/user/evaluation'}
          loading={isLoading}
          setLoading={setLoading}
        />
      )}
    </div>
  );
};

export default ListEvaluationScreen;
