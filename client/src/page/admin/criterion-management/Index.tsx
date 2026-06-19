import { Form, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import basicBehaviorApiService from '../../../common/api/basicBehavior';
import SearchComponents from '../../../views/criteria-management/SearchComponents';
import TableComponents from './list/components/TableComponents';
import { t } from 'i18next';
interface souces {
  dataSources: any[];
  counts: number;
}
const ListEvaluationItem = () => {
  const statusList = [
    { id: t('IDS_ALL'), name: t('IDS_ALL') },
    { id: 1, name: (t('IDL_LIST_STATUS_VERSION_SETTING', { returnObjects: true }) as any)[1] },
    { id: 2, name: (t('IDL_LIST_STATUS_VERSION_SETTING', { returnObjects: true }) as any)[2] },
    { id: 3, name: (t('IDL_LIST_STATUS_VERSION_SETTING', { returnObjects: true }) as any)[3] },
    { id: 4, name: (t('IDL_LIST_STATUS_VERSION_SETTING', { returnObjects: true }) as any)[4] },
  ];

  const [dataStates, setDataState] = useState<souces>({
    dataSources: [],
    counts: 0,
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const url = `/api/v1/f6/management-evaluation/list-common-skill`;
  const [condition, setCondition] = useState(
    location.state || {
      basicBehavior: 1,
      status: t('IDS_ALL'),
      level: t('IDS_ALL'),
      flagSkill: 1,
      limit: 20,
      offset: 0,
      sortBy: 'version',
      sortType: 'DESC',
      current: 1,
      search: false,
      typeLevel: 1,
    },
  );

  const errorCallBack = (bool: boolean | undefined) => {
    setLoading(bool || false);
  };

  // get list user evaluation
  const callBackListUserEvaluation = (data: souces) => {
    setDataState(data);
  };
  useEffect(() => {
    if (condition?.search) {
      basicBehaviorApiService.listBasicBehavior(url, callBackListUserEvaluation, errorCallBack, {
        ...condition,
      });
    }
  }, []);

  return (
    <div>
      <Typography.Title level={3}>{(t('IDL_LIST_MENU_F6', { returnObjects: true }) as any)[1]}</Typography.Title>
      <SearchComponents
        errorCallBack={errorCallBack}
        callBackListUserEvaluation={callBackListUserEvaluation}
        Form={Form}
        setCondition={setCondition}
        conditions={condition}
        listStatus={statusList}
        isLoading={isLoading}
        setDataState={setDataState}
        url={url}
        navigates={navigate}
        location={location}
      />
      {location.state?.search && (
        <TableComponents
          current={condition.current}
          limit={condition.limit}
          url={url}
          conditions={condition}
          isLoading={isLoading}
          dataSources={dataStates}
          setCondition={setCondition}
          setDataState={setDataState}
          errorCallBack={errorCallBack}
          navigates={navigate}
          location={location}
        />
      )}
    </div>
  );
};

export default ListEvaluationItem;
