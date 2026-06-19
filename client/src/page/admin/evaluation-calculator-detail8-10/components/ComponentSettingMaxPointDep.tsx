import { Form, Input } from 'antd';
import { t } from 'i18next';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { dataSubSetting810 } from '../interfaces/dataSource8_10';
import { Dispatch, SetStateAction } from 'react';

interface formProps {
  form: any;
  isEdit: any;
  openNotification: (placement: NotificationPlacement, mesage: string) => void;
  dataHandling: dataSubSetting810;
  setDataHandling: Dispatch<SetStateAction<dataSubSetting810>>;
}

const ComponentSettingMaxPointDep = (props: formProps) => {
  const { form, isEdit, dataHandling, setDataHandling } = props;

  return (
    <div>
      <Form labelCol={{ span: 1 }} labelAlign="left" component={false} form={form}>
        {/* <Typography.Title level={4}>{t('IDS_MAX_POINT')}</Typography.Title> */}
        {isEdit ? (
          <>
            <Form.Item
              label={t('IDS_MAX_POINT')}
              colon={false}
              name={'maxPointDep'}
              className="ant-form-item-info"
              initialValue={
                dataHandling?.maxPointDep ? parseFloat(dataHandling.maxPointDep) : dataHandling?.maxPointDep
              }
              rules={[
                {
                  validator: async (_, value) => {
                    if (!value && value !== 0)
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                    else if (!Number(value) && value !== '0')
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_INVALID_NUMBER').toString()));
                    else if (Number(value) <= 0 || isNaN(value))
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE_DECIMAL').replace('{min value}', '0.0')),
                      );
                    else if (Number(dataHandling?.minPointDep) && Number(value) < Number(dataHandling?.minPointDep))
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MAX_BIGGER_THAN_MIN').toString()));
                  },
                },
              ]}
            >
              <Input
                style={{ width: '70px', textAlign: 'left' }}
                maxLength={6}
                onChange={(e) => {
                  setDataHandling({ ...dataHandling, maxPointDep: e.target.value });
                  form.validateFields(['minPointDep']);
                }}
              />
            </Form.Item>
            <Form.Item
              label={t('IDS_MIN_POINT')}
              colon={false}
              name={'minPointDep'}
              className="ant-form-item-info"
              initialValue={
                dataHandling?.minPointDep ? parseFloat(dataHandling.minPointDep) : dataHandling?.minPointDep
              }
              rules={[
                {
                  validator: async (_, value) => {
                    if (!value && value !== 0)
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                    else if (!Number(value) && value !== '0')
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_INVALID_NUMBER').toString()));
                    else if (Number(value) <= 0 || isNaN(value))
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE_DECIMAL').replace('{min value}', '0.0')),
                      );
                    else if (Number(dataHandling?.maxPointDep) && Number(value) > Number(dataHandling?.maxPointDep)) {
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MAX_BIGGER_THAN_MIN').toString()));
                    }
                  },
                },
              ]}
            >
              <Input
                style={{ width: '70px', textAlign: 'left' }}
                maxLength={6}
                onChange={(e) => {
                  setDataHandling({ ...dataHandling, minPointDep: e.target.value });
                  form.validateFields(['maxPointDep']);
                }}
              />
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item label={t('IDS_MAX_POINT')} colon={false} className="ant-form-item-info">
              {dataHandling?.maxPointDep ? parseFloat(dataHandling.maxPointDep) : 0}
            </Form.Item>
            <Form.Item label={t('IDS_MIN_POINT')} colon={false} className="ant-form-item-info">
              {dataHandling?.minPointDep ? parseFloat(dataHandling.minPointDep) : 0}
            </Form.Item>
          </>
        )}
      </Form>
    </div>
  );
};

export default ComponentSettingMaxPointDep;
