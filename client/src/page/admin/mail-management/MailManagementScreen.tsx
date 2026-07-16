import { Form, Tabs, Typography } from 'antd';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import SearchFormTemplateMail from './mail-manage-tab/components/SearchFormTemplateMail';
import { useLocation, useNavigate } from 'react-router-dom';
import MailTemplateManageTab from './mail-manage-tab/MailTemplateManageTab';
import MailHistoryTab from './mail-history-tab/MailHistoryTab';

const MailManagementScreen = () => {
  const [formTemplate] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();

  //** State */
  const [defaultActiveKey, setDefaultActiveKey] = useState<'1' | '2'>('1');
    const [conditions, setConditions] = useState(
      location.state || {
        tabKey: defaultActiveKey,
      },
    );
  // const state = location.state as {
  //   tabKey: number;
  // };
  const state = location.state;

  const listTabs = [
    {
      key: '1',
      label: t('IDS_MAIL_MANAGE'),
      children: <MailTemplateManageTab state={state}/>,
    },
    {
      key: '2',
      label: t('IDS_MAIL_HISTORY'),
      children: <MailHistoryTab state={state}/>,
    },
  ];

  /** Handler func */
  const handleSetActiveKey = (activeKey: any) => {
    // navigate(location.pathname, {
    //   replace: true,
    //   state: {
    //     ...state,
    //     tabKey:  activeKey,
    //   },
    // });
    setDefaultActiveKey(activeKey);
  };

  useEffect(() => {
    navigate(location.pathname, {
        replace: true,
        state: conditions
    });
  }, [conditions]);

  return (
    <>
      <Typography.Title level={3}>{(t('IDL_LIST_MENU_F7', { returnObjects: true }) as any)[1]}</Typography.Title>
      <Tabs
        type="card"
        defaultActiveKey={state?.tabKey ? state.tabKey.toString() : defaultActiveKey}
        items={listTabs}
        // activeKey={state?.tabKey ? state.tabKey.toString() : defaultActiveKey}
        onChange={handleSetActiveKey}
      />
    </>
  );
};

export default MailManagementScreen;
