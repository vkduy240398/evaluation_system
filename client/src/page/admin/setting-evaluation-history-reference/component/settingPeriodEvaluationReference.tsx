import { Button, Form, Input, Row, Space, Typography } from 'antd';
import { t } from 'i18next';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import settingReview from '../../../../common/api/setting-evaluation-history-reference';
import { isInteger } from '../../../../common/util';

interface Props {
  setIsPeriodEvaluationLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}
const SettingPeriodEvaluationReference: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [number, setNumber] = useState<number | null>(null);
  const handleCancel = async () => {
    form.setFieldsValue({ defaultPeriod: number || null });
    setIsEdit(false);
  };
  useEffect(() => {
    const callBack = (data: any) => {
      form.setFieldsValue({ defaultPeriod: data ? data.number : null });
      setNumber(data ? data.number : null);
    };
    const errorCallBack = (isLoading: boolean) => {
      props.setIsLoading(isLoading);
      props.setIsPeriodEvaluationLoaded(!isLoading);
    };

    const timersPeriods = setTimeout(async () => {
      await settingReview.findSettingDefaultPeriod(callBack, errorCallBack);
    }, 300);

    return () => {
      clearTimeout(timersPeriods);
    };
  }, []);
  const handleSavePeriod = async () => {
    const errorCallBack = (isLoading: boolean) => {
      props.setIsLoading(isLoading);
    };

    form.validateFields().then(async () => {
      setNumber(form.getFieldValue('defaultPeriod') ? form.getFieldValue('defaultPeriod') : null);
      await settingReview.saveNumberPeriod(form.getFieldValue('defaultPeriod'), errorCallBack, setIsEdit);
    });
  };

  return (
    <div>
      <Typography.Title level={5}>{t('IDS_SETTING_PERIOD_EVALUATION')}</Typography.Title>
      <Form
        name="create_template_form"
        initialValues={{ remember: true }}
        colon={false}
        requiredMark={false}
        labelCol={{ span: 2.5 }}
        style={{ width: '100%' }}
        layout="horizontal"
        labelAlign="left"
        form={form}
        onFinish={handleSavePeriod}
      >
        {isEdit ? (
          <Form.Item
            className={isEdit ? '' : 'ant-form-item-info'}
            label={t('IDS_DEFAULT_PAST_PERIOD')}
            colon={false}
            name="defaultPeriod"
            rules={[
              {
                validator(rule, value, callback) {
                  if (String(value).length <= 0) {
                    callback(t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string);
                  }
                  if (typeof Number(value) !== 'number' || isNaN(Number(value)) || !isInteger(value)) {
                    callback(t('MESSAGE.COMMON.IDM_INVALID_NUMBER') as string);
                  }
                  if (Number(value) <= 0) {
                    callback(t('MESSAGE.COMMON.IDM_MIN_POINT').replace('{min value}', '0') as string);
                  }
                  if (Number(value) > 100) {
                    callback(t('MESSAGE.COMMON.IDM_MAX_VALUE').replace('{max value}', '100') as string);
                  }
                  callback();
                },
              },
            ]}
          >
            {isEdit ? (
              <Input
                suffix={t('IDS_PERIOD')}
                style={{ width: 80, textAlign: 'center' }}
                maxLength={3}
                disabled={props.isLoading}
              />
            ) : (
              <Row>
                <Typography>{number}</Typography>
                <div style={{ marginLeft: 5 }}>
                  <Typography>{t('IDS_PERIOD')}</Typography>
                </div>
              </Row>
            )}
          </Form.Item>
        ) : (
          <>
            <Space size={'middle'}>
              <Typography>{t('IDS_DEFAULT_PAST_PERIOD')}</Typography>
              <>
                <Typography>
                  {number}
                  {t('IDS_PERIOD')}
                </Typography>
              </>
            </Space>
          </>
        )}

        <div style={{ marginTop: 20 }}>
          {isEdit ? (
            <div>
              <Button
                className="button-normal"
                style={{ marginRight: 15 }}
                type="primary"
                size="middle"
                loading={props.isLoading}
                htmlType="submit"
              >
                {t('IDS_BUTTON_SAVE')}
              </Button>
              <Button className="cancel_button" size="middle" loading={props.isLoading} onClick={handleCancel}>
                {t('IDS_BUTTON_CANCEL')}
              </Button>
            </div>
          ) : (
            <Row>
              <Button
                className="button-normal"
                type="primary"
                size="middle"
                loading={props.isLoading}
                onClick={() => setIsEdit(true)}
              >
                {t('IDS_EDIT')}
              </Button>
            </Row>
          )}
        </div>
      </Form>
    </div>
  );
};
export default SettingPeriodEvaluationReference;
