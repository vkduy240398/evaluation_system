import { Button, Form, Grid, Input, Table, Typography } from 'antd';
import { FormInstance } from 'antd/lib';
import { t } from 'i18next';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { RandomHelper } from '../../../../../common/utils/RandomHelper';
import { dataSubSetting810, dataTab17Behavior } from '../../interfaces/dataSource8_10';
import ColumnBehavior from './ColumnBehavior';
import { isInteger } from '../../../../../common/util';

interface formProps {
  form: FormInstance;
  dataSource: dataTab17Behavior;
  setDataSource: Dispatch<SetStateAction<dataTab17Behavior>>;
  isEdit: any;
  openNotification: any;
  isLoading: boolean;
  isSaveDraft: boolean;
  dataHandling: dataSubSetting810;
  setDataHandling: Dispatch<SetStateAction<dataSubSetting810>>;
}

const { useBreakpoint } = Grid;
const ComponentBehavior = (props: formProps) => {
  const [keyMaxBehavior, setKeyMaxBehavior] = useState(Math.random());
  const screens = useBreakpoint();
  const columnMergers = ColumnBehavior({
    form: props.form,
    isEdit: props.isEdit,
    dataSource: props.dataSource,
    setDataSource: props.setDataSource,
    isLoading: props.isLoading,
    dataHandling: props.dataHandling,
    setDataHandling: props.setDataHandling,
  });

  useEffect(() => {
    setKeyMaxBehavior(Math.random());
  }, [props.isSaveDraft]);

  return (
    <div>
      <Form labelCol={{ xl: { span: 2 } }} labelAlign="left" component={false} form={props.form}>
        <Form.Item
          key={keyMaxBehavior}
          label={t('IDS_MAX_WEIGHT')}
          initialValue={props.dataHandling!.behaviorMaxWeight}
          name="max_weight_behavior"
          colon={false}
          style={{ marginBottom: 15 }}
          rules={[
            {
              validator: async (_, value) => {
                if (value === null || value === '')
                  return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                else {
                  if (!isInteger(value) || value < 1)
                    return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE').replace('{min value}', '1')));
                  if (value > 10)
                    return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_MAX_VALUE').replace('{max value}', '10')));
                }
              },
            },
          ]}
        >
          {props.isEdit ? (
            <Input
              maxLength={3}
              style={{ width: '70px', textAlign: 'center' }}
              defaultValue={props.dataHandling?.behaviorMaxWeight || ''}
              onChange={(event) => {
                const value = event.target.value;

                // startTransition(() => {
                //   props.setDataSource({ ...props.dataSource, behaviorMaxWeight: Math.floor(Number(value)) });
                // });
                props.setDataHandling({
                  ...props.dataHandling,
                  behaviorMaxWeight: Math.floor(Number(value)),
                });
              }}
            />
          ) : (
            props.dataHandling.behaviorMaxWeight
          )}
        </Form.Item>
        <Typography.Title level={4}>{t('IDS_EVALUATION_CRITERIA')}</Typography.Title>
        <Table
          size="small"
          scroll={{ x: screens.xs ? 1000 : undefined }}
          columns={columnMergers}
          dataSource={props.dataSource.settingPointBehavior}
          pagination={false}
          bordered
          locale={{
            emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
          }}
        />
        {props.isEdit && (
          <Button
            type="primary"
            className="button-normal"
            onClick={() => {
              // const dataList = [...(props.dataSource.settingPointBehavior || [])];
              const dataListTabs = [...(props.dataHandling.settingPointBehavior || [])];

              if (dataListTabs.length < 11) {
                dataListTabs.push({
                  key: RandomHelper.randomString(32),
                  type: 2,
                  versionId: props.dataHandling.id,
                });
                props.setDataSource({ ...props.dataSource, settingPointBehavior: dataListTabs });
                props.setDataHandling({ ...props.dataHandling, settingPointBehavior: dataListTabs });
              } else {
                props.openNotification(
                  'bottomRight',
                  t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', '11'),
                );
              }
            }}
            style={{ marginTop: 10 }}
            loading={props.isLoading}
          >
            {t('IDS_BUTTON_ADD')}
          </Button>
        )}
      </Form>
    </div>
  );
};

export default ComponentBehavior;
