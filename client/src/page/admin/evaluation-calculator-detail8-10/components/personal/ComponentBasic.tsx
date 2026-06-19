/* eslint-disable @typescript-eslint/naming-convention */
import { Button, Form, Grid, Input, Table, Typography } from 'antd';
import { t } from 'i18next';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { RandomHelper } from '../../../../../common/utils/RandomHelper';
import ColumnBasic from './ColumnBasic';
import { dataSubSetting810, dataTab17BasicSkill } from '../../interfaces/dataSource8_10';
import { isInteger } from '../../../../../common/util';

interface formProps {
  form: any;
  dataSource: dataTab17BasicSkill;
  setDataSource: Dispatch<SetStateAction<dataTab17BasicSkill>>;
  isEdit: boolean;
  basicMaxDifficulty?: any;
  openNotification: any;
  isLoading: boolean;
  isSaveDraft: boolean;
  dataHandling: dataSubSetting810;
  setDataHandling: Dispatch<SetStateAction<dataSubSetting810>>;
}

const { useBreakpoint } = Grid;
const ComponentBasic = (props: formProps) => {
  const [keyMaxBasic, setKeyMaxBasic] = useState(Math.random());
  const screens = useBreakpoint();
  const save = async (record: any) => {
    const row = await props.form.validateFields();
    const newData = [...(props.dataHandling.settingPointBasic || [])];
    const index = newData.findIndex((item: any) => record === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    props.setDataHandling({ ...props.dataHandling, settingPointBasic: newData });
  };

  const columnMergers = ColumnBasic({
    isEdit: props.isEdit,
    dataSource: props.dataSource,
    setDataSource: props.setDataSource,
    isLoading: props.isLoading,
    form: props.form,
    dataHandling: props.dataHandling,
    setDataHandling: props.setDataHandling,
  });

  useEffect(() => {
    setKeyMaxBasic(Math.random());
  }, [props.isSaveDraft]);

  return (
    <div>
      <Form labelCol={{ xl: { span: 2 } }} labelAlign="left" onFinish={save} component={false} form={props.form}>
        <Form.Item
          key={keyMaxBasic}
          label={t('IDS_MAX_DIFFICULTY')}
          initialValue={props.dataHandling?.basicMaxDifficulty}
          name="max_diff_basic"
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
              defaultValue={props.dataHandling?.basicMaxDifficulty || ''}
              onChange={(event) => {
                const value = event.target.value;
                props.setDataHandling({
                  ...props.dataHandling,
                  basicMaxDifficulty: Math.floor(Number(value)),
                });
              }}
            />
          ) : (
            props.dataHandling.basicMaxDifficulty
          )}
        </Form.Item>
        <Typography.Title level={4}>{t('IDS_EVALUATION_CRITERIA')}</Typography.Title>
        <Table
          bordered
          scroll={{ x: screens.xs ? 1000 : undefined }}
          columns={columnMergers}
          dataSource={props.dataSource.settingPointBasic}
          pagination={false}
          size="small"
          locale={{
            emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
          }}
        />
        {props.isEdit && (
          <Button
            type="primary"
            className="button-normal"
            onClick={() => {
              const dataListTab = [...(props.dataHandling.settingPointBasic || [])];

              if (dataListTab.length < 11) {
                // range 0 - 10 -> 11 row
                dataListTab.push({
                  key: RandomHelper.randomString(32),
                  type: 1,
                });
                props.setDataSource({ ...props.dataSource, settingPointBasic: dataListTab });
                props.setDataHandling({ ...props.dataHandling, settingPointBasic: dataListTab });
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

export default ComponentBasic;
