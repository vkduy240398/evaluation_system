/* eslint-disable @typescript-eslint/naming-convention */
import { Form, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ListCriteriaHistoryTableScreen from './components/ListCriteriaHistoryTableScreen';
import { t } from 'i18next';
import { conditionsEvaluationItemHistory, listEvaluationItemHistory } from '../../../model/Conditions';
import PaginationV2 from '../../../common/PaginationV2';
import CriteriaHistorySearchForm from './components/CriteriaHistorySearchForm';
import evaluationCriteriApiService from '../../../common/api/evaluationCritea';

const ListCriteriaHistoryScreen: React.FC = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const statusListProSkills = [
    {
      name: (t('IDL_LIST_STATUS_PRO_SKILL', { returnObjects: true }) as any)[1],
      id: 1,
    },
    {
      name: (t('IDL_LIST_STATUS_PRO_SKILL', { returnObjects: true }) as any)[2],
      id: 2,
    },
    {
      name: (t('IDL_LIST_STATUS_PRO_SKILL', { returnObjects: true }) as any)[3],
      id: 3,
    },
    { id: 4, name: (t('IDL_LIST_STATUS_PRO_SKILL', { returnObjects: true }) as any)[4] },
    { id: 5, name: (t('IDL_LIST_STATUS_PRO_SKILL', { returnObjects: true }) as any)[5] },
  ];

  const publicStatusListProSkill = [
    { id: 0, name: (t('IDL_LIST_PUBLIC_STATUS_PRO_SKILL', { returnObjects: true }) as any)[0] },
    { id: 1, name: (t('IDL_LIST_PUBLIC_STATUS_PRO_SKILL', { returnObjects: true }) as any)[1] },
    { id: 2, name: (t('IDL_LIST_PUBLIC_STATUS_PRO_SKILL', { returnObjects: true }) as any)[2] },
  ];

  const [listPublicStatusProSkill, setListPublicStatusProSkill] = useState([]) as any;
  const [listStatusProSkill, setListStatusProSkill] = useState([]) as any;
  const [form] = Form.useForm();
  const [listSkill, setListSkill] = useState([]) as any;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    /**Set list status pro skill */
    const tempsProSkills = [{ id: t('IDS_ALL'), statusName: t('IDS_ALL') }];
    statusListProSkills.forEach((item: any) => {
      tempsProSkills.push({ id: item.id, statusName: item.name });
    });
    setListStatusProSkill(tempsProSkills);

    /**Set list public status proskill */
    const tempsPublicProSkill = [{ id: t('IDS_ALL'), statusPublicName: t('IDS_ALL') }];
    publicStatusListProSkill.forEach((item: any) => {
      tempsPublicProSkill.push({ id: item.id, statusPublicName: item.name });
    });
    setListPublicStatusProSkill(tempsPublicProSkill);

    /**Get skill */
    evaluationCriteriApiService.getSkill({ callBack, errorCallBack });
  }, []);

  const callBack = (data: any) => {
    setListSkill(data);
  };

  const [conditions, setConditions] = useState<conditionsEvaluationItemHistory>(
    location.state || {
      offset: 0,
      limit: 20,
      sortBy: 'periodIndex',
      sortType: 'ASC',
      skill: t('IDS_ALL'),
      status: t('IDS_ALL'),
      typeDepartment: t('IDS_ALL'),
      publicStatus: 2,
      current: 1,
    },
  );
  const [dataSources, setDataSources] = useState<listEvaluationItemHistory>();

  const callBackListEvaluationItem = (dataSource: listEvaluationItemHistory) => {
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
      evaluationCriteriApiService.searchListEvaluationItemHistory(conditions, callBackListEvaluationItem, setLoading);
    }
  }, [conditions]);

  return (
    <div>
      <Space>
        <Typography.Title level={3}>{(t('IDL_LIST_MENU_F6', { returnObjects: true }) as any)[2]}</Typography.Title>
      </Space>

      <CriteriaHistorySearchForm
        form={form}
        conditions={conditions}
        setConditions={setConditions}
        setDataSources={setDataSources}
        isLoading={isLoading}
        skills={listSkill}
        listStatusProSkill={listStatusProSkill}
        listPublicStatusProSkill={listPublicStatusProSkill}
      />
      {conditions?.search && <ListCriteriaHistoryTableScreen dataState={dataSources?.data} isLoading={isLoading} />}
      {dataSources?.data && dataSources?.data.length > 0 && isLoading === false && (
        <PaginationV2
          conditions={conditions}
          currents={conditions.current}
          dataSources={dataSources}
          errorCallBack={errorCallBack}
          limit={conditions.limit}
          location={location}
          navigates={navigate}
          setDataSources={setDataSources}
          url={'/api/v1/f6/management-evaluation/list-evaluation-item-history'}
          loading={isLoading}
          setLoading={setLoading}
        />
      )}
    </div>
  );
};

export default ListCriteriaHistoryScreen;
