/* eslint-disable @typescript-eslint/naming-convention */
import { Dispatch, SetStateAction, startTransition, useEffect, useState } from 'react';
import { Button, Form, Grid, Input, Table, Typography } from 'antd';
import ColumnBasic from '../column/ColumnBasic';
import { t } from 'i18next';
import { DetailEvaluationCalculationDto } from '../../../../model/evaluation-calculation/DetailEvaluationCalculationModel';
import { RandomHelper } from '../../../../common/utils/RandomHelper';
import { isInteger } from '../../../../common/util';

interface formProps {
  form: any;
  dataSource: DetailEvaluationCalculationDto;
  setDataSource: Dispatch<SetStateAction<DetailEvaluationCalculationDto>>;
  isEdit: boolean;
  basicMaxDifficulty?: any;
  openNotification: any;
  isLoading: boolean;
  isSaveDraft: boolean;
}

const isNumber = /^\d+$/;
const { useBreakpoint } = Grid;
const ComponentBasic = (props: formProps) => {
  const [keyMaxBasic, setKeyMaxBasic] = useState(Math.random());
  const screens = useBreakpoint();
  const save = async (record: any) => {
    const row = await props.form.validateFields();
    const newData = [...(props.dataSource.settingPointBasic || [])];
    const index = newData.findIndex((item: any) => record === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    props.setDataSource({ ...props.dataSource, settingPointBasic: newData });
  };

  const columnMergers = ColumnBasic({
    isEdit: props.isEdit,
    dataSource: props.dataSource,
    setDataSource: props.setDataSource,
    isLoading: props.isLoading,
    form: props.form,
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
          initialValue={props.dataSource?.basicMaxDifficulty}
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
              defaultValue={props.dataSource?.basicMaxDifficulty || ''}
              onChange={(event) => {
                const value = event.target.value;

                startTransition(() => {
                  props.setDataSource({
                    ...props.dataSource,
                    basicMaxDifficulty: value ? Math.floor(Number(value)) : null,
                  });
                });
              }}
            />
          ) : (
            props.dataSource.basicMaxDifficulty
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
              const dataList = [...(props.dataSource.settingPointBasic || [])];
              if (dataList.length < 11) {
                // range 0 - 10 -> 11 row
                dataList.push({
                  key: RandomHelper.randomString(32),
                  type: 1,
                  versionId: props.dataSource.id,
                });
                props.setDataSource({ ...props.dataSource, settingPointBasic: dataList });
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
