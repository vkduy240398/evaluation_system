import { FC } from 'react';
import CreateFeedbackForm from './components/CreateFeedbackForm';
import { Tabs, TabsProps, Typography } from 'antd';
import { t } from 'i18next';
import FeedbackHistory from './components/FeedbackHistory';
import { useLocation, useNavigate } from 'react-router-dom';
import { FeedbackCondition } from '../../model/Feedback';

const FeedbackScreen: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs: TabsProps['items'] = [
    {
      key: 'addFeedback',
      label: t('IDS_FEEDBACK'),
      children: <CreateFeedbackForm />,
    },
    {
      key: 'feedbackHistory',
      label: t('IDS_TAB_FEEDBACK_HISTORY'),
      children: <FeedbackHistory key={'user'} role="user" />,
    },
  ];

  const handleTabChange = (key: any) => {
    navigate(location.pathname, { state: { ...location.state, key: key } });
  };

  return (
    <>
      <Typography.Title level={3}>{t('IDS_REQUEST_REGARDING')}</Typography.Title>
      <Tabs
        type="card"
        items={tabs}
        defaultActiveKey={location.state?.key || 'addFeedback'}
        onChange={handleTabChange}
      />
    </>
  );
};

export default FeedbackScreen;
