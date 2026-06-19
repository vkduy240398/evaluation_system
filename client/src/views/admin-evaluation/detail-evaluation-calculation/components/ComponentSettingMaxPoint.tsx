import { Form, Input } from 'antd';
import { t } from 'i18next';
import { DetailEvaluationCalculationDto } from '../../../../model/evaluation-calculation/DetailEvaluationCalculationModel';
import { Dispatch, SetStateAction } from 'react';
import { isInteger } from '../../../../common/util';

interface formProps {
  form: any;
  dataSource: DetailEvaluationCalculationDto;
  setDataSource: Dispatch<SetStateAction<DetailEvaluationCalculationDto>>;
  isEdit: any;
  openNotification: any;
  isLoading: boolean;
}

const ComponentSettingMaxPoint = (props: formProps) => {
  const { form, isEdit, dataSource, setDataSource } = props;

  return (
    <div>
      <Form labelCol={{ span: 1 }} labelAlign="left" component={false} form={form}>
        {/* <Typography.Title level={4}>{t('IDS_MAX_POINT')}</Typography.Title> */}
        {isEdit ? (
          <>
            <Form.Item
              label={t('IDS_MAX_POINT')}
              colon={false}
              name={'maxPoint'}
              className="ant-form-item-info"
              initialValue={dataSource.maxPoint ? parseFloat(dataSource.maxPoint) : dataSource.maxPoint}
              rules={[
                {
                  validator: async (_, value) => {
                    if (!value && value !== 0)
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                    if (!isInteger(value) || value < 1)
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE').replace('{min value}', '1')));
                    if (Number(dataSource.minPoint) && Number(value) < Number(dataSource.minPoint))
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MAX_BIGGER_THAN_MIN').toString()));
                  },
                },
              ]}
            >
              <Input
                style={{ width: '70px', textAlign: 'left' }}
                maxLength={6}
                onChange={(e) => {
                  setDataSource({ ...dataSource, maxPoint: e.target.value });
                  form.validateFields(['minPoint']);
                }}
              />
            </Form.Item>
            <Form.Item
              label={t('IDS_MIN_POINT')}
              colon={false}
              name={'minPoint'}
              className="ant-form-item-info"
              initialValue={dataSource.minPoint ? parseFloat(dataSource.minPoint) : dataSource.minPoint}
              rules={[
                {
                  validator: async (_, value) => {
                    if (!value && value !== 0)
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                    if (!isInteger(value) || value < 0)
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE').replace('{min value}', '0')));
                    if (Number(dataSource.maxPoint) > 0 && Number(value) > Number(dataSource.maxPoint)) {
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
                  setDataSource({ ...dataSource, minPoint: e.target.value });
                  form.validateFields(['maxPoint']);
                }}
              />
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item label={t('IDS_MAX_POINT')} colon={false} className="ant-form-item-info">
              {dataSource.maxPoint ? parseFloat(dataSource.maxPoint) : 0}
            </Form.Item>
            <Form.Item label={t('IDS_MIN_POINT')} colon={false} className="ant-form-item-info">
              {dataSource.minPoint ? parseFloat(dataSource.minPoint) : 0}
            </Form.Item>
          </>
        )}
      </Form>
    </div>
  );
};

export default ComponentSettingMaxPoint;
