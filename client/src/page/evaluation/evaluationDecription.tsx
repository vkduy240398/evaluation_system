/* eslint-disable prefer-const */
import React, { useEffect, useState } from 'react';
import { Card, Form, Typography } from 'antd';
import { t } from 'i18next';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingScreenComponent from '../../views/loading/LoadingScreenComponent';
import { loadDataEvaluationDescription } from './handleDataEvaluationDescription';
import parse from 'html-react-parser';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  access: string;
}
const EvaluationDecription = (props: Props) => {
  const { access } = props;
  const [financialYear, setFinancialYear] = useState('');
  const [level, setLevel] = useState('');
  const [notes, setNotes] = useState('');
  const [evaluationCriterias, setEvaluationCriterias] = useState('');
  const [isLoading, setLoading] = useState<boolean>(true);
  const { id } = useParams();
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id && !Number.isInteger(Number(id))) {
      navigate('/404page');
    } else {
      handleGetData();
    }
  }, [access]);

  const handleGetData = async () => {
    setLoading(true);
    loadDataEvaluationDescription(
      id,
      setFinancialYear,
      setLevel,
      setNotes,
      setEvaluationCriterias,
      setLoading,
      access,
      auth.user?.timeZone || 'Asia/Tokyo',
    );
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreenComponent />
      ) : (
        <>
          <Card>
            <Typography.Title level={3} style={{ paddingBottom: 10 }}>
              {t('IDS_EVALUATION_CRITERIA')}
            </Typography.Title>
            <Form
              labelAlign="left"
              labelCol={{ span: 1 }}
              colon={false}
              requiredMark={false}
              style={{ marginBottom: 0 }}
            >
              <Form.Item label={t('IDS_EVALUATION_PERIOD')} className="ant-form-item-info">
                {financialYear}
              </Form.Item>
              <Form.Item className="ant-form-item-info" label={t('IDS_LEVEL')}>
                {level}
              </Form.Item>
            </Form>
          </Card>
          <Card
            style={{ overflowX: 'auto', marginTop: 15 }}
            className="editor-custom-css-boder-padding editor-custom-css-background-color-click"
          >
            <Typography.Title level={4}>{t('IDS_EVALUATION_CRITERIA')}</Typography.Title>
            <div className="parse-table-content">
              {parse(
                evaluationCriterias === null || !evaluationCriterias || evaluationCriterias === undefined
                  ? t('MESSAGE.COMMON.IDM_EMPTY_DATA').toString()
                  : evaluationCriterias,
                {},
              )}
            </div>
          </Card>
          <Card
            style={{ overflowX: 'auto', marginTop: 15 }}
            className="editor-custom-css-boder-padding editor-custom-css-background-color-click"
          >
            <Typography.Title level={4} style={{ marginBottom: 15 }}>
              {t('IDS_NOTES')}
            </Typography.Title>
            <div className="parse-table-content">
              {parse(
                notes === null || !notes || notes === undefined ? t('MESSAGE.COMMON.IDM_EMPTY_DATA').toString() : notes,
              )}
            </div>
          </Card>
        </>
      )}
    </>
  );
};

export default EvaluationDecription;
