/* eslint-disable @typescript-eslint/naming-convention */
import { Form, Grid, Table, Typography } from 'antd';
import { t } from 'i18next';
import { Dispatch, SetStateAction } from 'react';
import { dataSubSetting810, dataTab17Level } from '../../interfaces/dataSource8_10';
import ColumnPricing from './ColumnPricing';

interface formProps {
  form: any;
  dataSource: dataTab17Level;
  setDataSource: Dispatch<SetStateAction<dataTab17Level>>;
  isEdit: any;
  isLoading: boolean;
  dataHandling: dataSubSetting810;
  setDataHandling: Dispatch<SetStateAction<dataSubSetting810>>;
}

const { useBreakpoint } = Grid;
const ComponentPricing = (props: formProps) => {
  const screens = useBreakpoint();

  const columnMergers = ColumnPricing({
    form: props.form,
    isEdit: props.isEdit,
    dataSource: props.dataSource,
    setDataSource: props.setDataSource,
    isLoading: props.isLoading,
    dataHandling: props.dataHandling,
    setDataHandling: props.setDataHandling,
  });

  return (
    <div>
      <Form labelCol={{ xl: { span: 2 } }} labelAlign="left" component={false} form={props.form}>
        <Typography.Title level={4}>{t('IDS_EVALUATION_CRITERIA')}</Typography.Title>
        <Table
          size="small"
          scroll={{ x: screens.xs ? 1000 : undefined }}
          columns={columnMergers}
          dataSource={props.dataSource.settingLevel}
          pagination={false}
          bordered
          locale={{
            emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
          }}
        />
      </Form>
    </div>
  );
};

export default ComponentPricing;
