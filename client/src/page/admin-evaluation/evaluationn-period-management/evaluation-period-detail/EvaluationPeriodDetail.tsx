import React, { useState } from 'react';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation, Navigate } from 'react-router-dom';
import SolutionSecond from './SolutionSecond';

const ITEM_SPACING = 10;

const EvaluationPeriodDetail: React.FC = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const [isFixed] = useState(false);
  const [isModalOpenMail, setIsModalOpenMail] = useState(false);

  if (!state || !state.title) {
    return <Navigate to={'/admin-evaluation/evaluation-period-list'} />;
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ paddingBottom: '15px' }}>
        <Typography.Title level={3} style={{ marginBottom: 0 }}>
          {t('IDS_IMPLEMENT_DETAIL')}
        </Typography.Title>
        <Typography.Text
          style={{ display: 'block', marginTop: 0, fontSize: 14, fontWeight: 500, color: 'rgba(0,0,0,0.88)' }}
        >
          {`${t('IDS_EVALUATION_PERIOD')} ${state.title}`}
        </Typography.Text>
      </div>

      <SolutionSecond
        isFixed={isFixed}
        t={t}
        isModalOpenMail={isModalOpenMail}
        setIsModalOpenMail={setIsModalOpenMail}
        ITEM_SPACING={ITEM_SPACING}
      />
    </div>
  );
};

export default EvaluationPeriodDetail;
