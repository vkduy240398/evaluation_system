import { Typography, Tabs, TabsProps } from 'antd';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import proSkillSettingService from '../../../common/api/proSkillSetting';
import { useLocation, useNavigate } from 'react-router-dom';
import EditedScreen from './components/EditedScreen';
import NewVersion from './components/NewVersion';

const ListProSkillPublicHistoryScreen: React.FC = () => {
  const [skills, setSkill] = useState<any[]>([{ label: t('IDS_ALL'), value: -1 }]);
  const [, setIsloading] = useState<boolean>(false);
  const location = useLocation();
  const navigates = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  useEffect(() => {
    const callBack = (res: any) => {
      setSkill(res.skill);
      setIsloading(false);
    };

    const errorCallBack = () => {
      setIsloading(false);
    };
    // proSkillSettingService.getDepartmentRole({ callBack, errorCallBack });
    proSkillSettingService.getSkillRole({ callBack, errorCallBack });
  }, []);
  const tabPanels: TabsProps['items'] = [
    {
      key: '2',
      label: t('IDS_TAB_NEW_VERSION'),
      children: <NewVersion skills={skills} />,
    },
    {
      key: '1',
      label: t('IDS_TAB_HISTORY'),
      children: <EditedScreen skills={skills} />,
    },
  ];

  return (
    <div>
      <Typography.Title level={3}>{t('IDS_MENU_HISTORY_PRO_SKILL')}</Typography.Title>
      <Tabs
        items={tabPanels}
        size="small"
        tabPosition="top"
        type="card"
        onChange={() => {
          navigates(location.pathname, {
            replace: true,
            state: {
              ...location.state,

              // currentTab: e,
              searchOption: {
                departmentId: location.state?.searchOption?.departmentId || -1,
                status: location.state?.searchOption?.status || -1,
              },
            },
          });
        }}
        defaultActiveKey={location.state?.type || '2'}
      />
    </div>
  );
};

export default ListProSkillPublicHistoryScreen;
