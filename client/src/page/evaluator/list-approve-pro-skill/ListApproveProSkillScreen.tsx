/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Form, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import ListProSkillTable from './components/ListApproveProSkillTable';
import { t } from 'i18next';
import proSkillApiService from '../../../common/api/proSkill';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchFormApproveProSkill from './components/SearchFormApproveProSkill';
import { conditionsProskill, listApproveProSkill } from '../../../model/Conditions';
import PaginationV2 from '../../../common/PaginationV2';

const ListApproveProSkillScreen: React.FC = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const statusList = [
    { id: 3, name: (t('IDL_LIST_STATUS_PRO_SKILL', { returnObjects: true }) as any)[3] },
    { id: 4, name: (t('IDL_LIST_STATUS_PRO_SKILL', { returnObjects: true }) as any)[4] },
    { id: 5, name: (t('IDL_LIST_STATUS_PRO_SKILL', { returnObjects: true }) as any)[5] },
  ];

  const publicStatusList = [
    { id: 0, name: (t('IDL_LIST_PUBLIC_STATUS_PRO_SKILL', { returnObjects: true }) as any)[0] },
    { id: 1, name: (t('IDL_LIST_PUBLIC_STATUS_PRO_SKILL', { returnObjects: true }) as any)[1] },
    { id: 2, name: (t('IDL_LIST_PUBLIC_STATUS_PRO_SKILL', { returnObjects: true }) as any)[2] },
  ];

  const [listStatus, setListStatus] = useState([]) as any;
  const [listPublicStatus, setListPublicStatus] = useState([]) as any;
  const [form] = Form.useForm();
  const [listSkills, setListSkill] = useState([]) as any;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const temps = [{ id: t('IDS_ALL'), statusName: t('IDS_ALL') }];
    const tempsPublic = [{ id: t('IDS_ALL'), statusPublicName: t('IDS_ALL') }];
    statusList.forEach((item: any) => {
      temps.push({ id: item.id, statusName: item.name });
    });
    setListStatus(temps);

    publicStatusList.forEach((item: any) => {
      tempsPublic.push({ id: item.id, statusPublicName: item.name });
    });
    setListPublicStatus(tempsPublic);
    proSkillApiService.getSkill({ callBack, errorCallBack });
  }, []);

  const callBack = (data: any) => {
    setListSkill(data);
  };

  const [conditions, setConditions] = useState<conditionsProskill>(
    location.state || {
      offset: 0,
      limit: 20,
      sortBy: 'periodIndex',
      sortType: 'ASC',
      skill: t('IDS_ALL'),
      status: 3,
      publicStatus: t('IDS_ALL'),
      current: 1,
    },
  );
  const [dataSources, setDataSources] = useState<listApproveProSkill>();

  const callBackListProSkill = (dataSource: listApproveProSkill) => {
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
      proSkillApiService.listApproveProSkill(conditions, callBackListProSkill, setLoading);
    }
  }, [conditions]);

  return (
    <div>
      <Space align="baseline">
        <Typography.Title level={3}>{t('IDS_LIST_APPROVE_PRO_SKILL')}</Typography.Title>
      </Space>

      <SearchFormApproveProSkill
        form={form}
        conditions={conditions}
        setConditions={setConditions}
        setDataSources={setDataSources}
        isLoading={isLoading}
        skills={listSkills}
        listStatus={listStatus}
        listPublicStatus={listPublicStatus}
      />
      {conditions?.search && <ListProSkillTable dataState={dataSources?.data} isLoading={isLoading} />}
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
          url={'/api/v1/f4/pro-skill-approval/list-approve-pro-skill'}
          loading={isLoading}
          setLoading={setLoading}
        />
      )}
    </div>
  );
};

export default ListApproveProSkillScreen;
