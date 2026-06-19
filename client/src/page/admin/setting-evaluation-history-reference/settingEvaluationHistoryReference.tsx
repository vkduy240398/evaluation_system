import { Card, Typography } from 'antd';
import { t } from 'i18next';
import { useEffect, useState, Suspense } from 'react';

import SettingPeriodEvaluationComponent from './component/settingPeriodEvaluationReference';
import SettingPermissionEvaluationReference from './component/settingPermissionEvaluationReference';

const SettingEvaluationHistoryReference: React.FC = () => {
  const [isPeriodEvaluationLoaded, setIsPeriodEvaluationLoaded] = useState(false);
  const [isPermissionEvaluationLoaded, setIsPermissionEvaluationLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isPeriodEvaluationLoaded) {
      setIsPermissionEvaluationLoaded(true);
    }
  }, [isPeriodEvaluationLoaded]);

  return (
    <div>
      <Typography.Title level={3}>{(t('IDL_LIST_MENU_F6', { returnObjects: true }) as any)[7]}</Typography.Title>
      <Suspense fallback={<i>{t('MESSAGE.COMMON.IDM_MESSAGE_LOADING')}...!</i>}>
        <Card style={{ marginBottom: 15 }}>
          <SettingPeriodEvaluationComponent
            setIsPeriodEvaluationLoaded={setIsPeriodEvaluationLoaded}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </Card>
      </Suspense>
      <Suspense fallback={<i>{t('MESSAGE.COMMON.IDM_MESSAGE_LOADING')}...!</i>}>
        <Card style={{ marginBottom: 15 }}>
          {isPermissionEvaluationLoaded && (
            <SettingPermissionEvaluationReference isLoading={isLoading} setIsLoading={setIsLoading} />
          )}
        </Card>
      </Suspense>
    </div>
  );
};
export default SettingEvaluationHistoryReference;
