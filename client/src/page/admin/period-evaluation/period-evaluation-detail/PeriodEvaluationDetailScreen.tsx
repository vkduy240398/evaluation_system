import { Button, Card, Form, message, Typography } from 'antd';
import { t } from 'i18next';
import { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import SettingEvaluatorTab from '../../set-evaluation/SettingEvaluatorTab';
import ListCommonPeriod from './components/ListCommonPeriod';
import { AuthContext } from '../../../../contexts/AuthContext';
import { UserDataType } from '../../../../contexts/types';
import httpAxios from '../../../../common/http';
import { useTranslation } from 'react-i18next';

/**
 *
 * @author tran.le.ha.nam
 * @last_update tran.le.ha.nam
 */

const EMAIL_VN_SYSTEM = 'vietnam.system@geonet.co.jp';

const PeriodEvaluationDetailScreen: React.FC = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [isEvaluationTime, setEvaluationTime] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { i18n } = useTranslation();

  const state = location.state as {
    year: number;
    periodIndex: number;
    title: string;
    isOpenTabException?: boolean;
    goals810Time?: string;
    goals17Time?: string;
    type: number;
    checkFixed?: number;
    periodId: number;
  };
  if (!state || !state.title) {
    return <Navigate to={'/admin-evaluation/list-period-evaluation'} />;
  }

  const handleClickCreateEvaluationBtn = async () => {
    setIsLoading(true);

    return await httpAxios
      .Get('/api/v1/f5/management-evaluation-history/run-cron-job-create-evaluation')
      .then((res) => {
        if (res?.status === 200) {
          message.success('Run cronjob create evaluation success');
        }
        setIsLoading(false);
      });
  };

  const handleClickSendMailBtn = async () => {
    setIsLoading(true);

    return await httpAxios.Get('/api/v1/f5/management-evaluation-history/run-cron-job-send-mail').then((res) => {
      if (res?.status === 200) {
        message.success('Run cronjob send mail success');
      }
      setIsLoading(false);
    });
  };

  const getButtonCronjob = (user: UserDataType | null) => {
    if (user?.email === EMAIL_VN_SYSTEM) {
      return (
        <div style={{ marginBottom: 10, display: 'flex', gap: 10 }}>
          <Button loading={isLoading} type="primary" onClick={handleClickCreateEvaluationBtn}>
            Run cronjob create evaluation
          </Button>
          <Button loading={isLoading} type="primary" onClick={handleClickSendMailBtn}>
            Run cronjob send mail
          </Button>
        </div>
      );
    } else {
      return <></>;
    }
  };
 

  return (
    <div>
      {getButtonCronjob(user)}
      <Typography.Title level={3}>{t('IDS_IMPLEMENT_DETAIL')}</Typography.Title>
      <Form labelAlign="left" labelCol={{ span: 1 }} colon={false} requiredMark={false} style={{ marginBottom: 15 }}>
        <Form.Item label={t('IDS_EVALUATION_PERIOD')} className="ant-form-item-info">
          {state.title || ''}
        </Form.Item>
      </Form>
      <Card style={{ marginBottom: 15 }}>
        <ListCommonPeriod recordInfo={state} setEvaluationTime={setEvaluationTime} i18n={i18n} />
      </Card>

      <Card style={{ marginBottom: 15 }}>
        <SettingEvaluatorTab state={state} isEvaluationTime={isEvaluationTime} />
      </Card>
    </div>
  );
};

export default PeriodEvaluationDetailScreen;
