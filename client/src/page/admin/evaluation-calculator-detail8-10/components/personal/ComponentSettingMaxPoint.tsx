import { Form, Input } from 'antd';
import { t } from 'i18next';
import { Dispatch, SetStateAction } from 'react';
import { dataSubSetting810 } from '../../interfaces/dataSource8_10';
import { isInteger } from '../../../../../common/util';

interface formProps {
  form: any;
  isEdit: any;
  openNotification: any;
  isLoading: boolean;
  dataHandling: dataSubSetting810;
  setDataHandling: Dispatch<SetStateAction<dataSubSetting810>>;
}

const ComponentSettingMaxPoint = (props: formProps) => {
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
              name={'maxPointPersonal'}
              className="ant-form-item-info"
              initialValue={dataHandling.maxPoint ? parseFloat(dataHandling.maxPoint) : dataHandling.maxPoint}
              rules={[
                {
                  validator: async (_, value) => {
                    if (!value && value !== 0)
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                    if (!isInteger(value) || value <= 0)
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE').replace('{min value}', '1')));
                    if (Number(dataHandling.minPoint) && Number(value) < Number(dataHandling.minPoint))
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MAX_BIGGER_THAN_MIN').toString()));
                  },
                },
              ]}
            >
              <Input
                style={{ width: '70px', textAlign: 'left' }}
                maxLength={6}
                onChange={(e) => {
                  // setDataSource({ ...dataSource, maxPoint: e.target.value });
                  setDataHandling({ ...dataHandling, maxPoint: e.target.value });
                  form.validateFields(['minPointPersonal']);
                }}
              />
            </Form.Item>
            <Form.Item
              label={t('IDS_MIN_POINT')}
              colon={false}
              name={'minPointPersonal'}
              className="ant-form-item-info"
              initialValue={dataHandling.minPoint ? parseFloat(dataHandling.minPoint) : dataHandling.minPoint}
              rules={[
                {
                  validator: async (_, value) => {
                    if (!value && value !== 0)
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                    if (!isInteger(value) || value < 0)
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE').replace('{min value}', '0')));
                    if (Number(dataHandling.maxPoint) > 0 && Number(value) > Number(dataHandling.maxPoint)) {
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
                  // setDataSource({ ...dataSource, minPoint: e.target.value });
                  setDataHandling({ ...dataHandling, minPoint: e.target.value });
                  form.validateFields(['maxPointPersonal']);
                }}
              />
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item label={t('IDS_MAX_POINT')} colon={false} className="ant-form-item-info">
              {dataHandling.maxPoint ? parseFloat(dataHandling.maxPoint) : 0}
            </Form.Item>
            <Form.Item label={t('IDS_MIN_POINT')} colon={false} className="ant-form-item-info">
              {dataHandling.minPoint ? parseFloat(dataHandling.minPoint) : 0}
            </Form.Item>
          </>
        )}
      </Form>
    </div>
  );
};

export default ComponentSettingMaxPoint;
