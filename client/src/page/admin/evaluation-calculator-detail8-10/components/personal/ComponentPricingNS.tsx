/* eslint-disable @typescript-eslint/naming-convention */
import { Form, Grid, Table, Typography } from 'antd';
import { t } from 'i18next';
import { Dispatch, SetStateAction } from 'react';
import { dataSubSetting810NS, dataTab17Level } from '../../interfaces/dataSource8_10';
import ColumnPricingNs from './ColumnPricingNS';

interface formProps {
  form: any;
  dataSource: dataTab17Level;
  setDataSource: Dispatch<SetStateAction<dataTab17Level>>;
  isEdit: any;
  dataHandling: dataSubSetting810NS;
  setDataHandling: Dispatch<SetStateAction<dataSubSetting810NS>>;
}

const { useBreakpoint } = Grid;
const ComponentPricingNS = (props: formProps) => {
  const screens = useBreakpoint();

  const columnMergers = ColumnPricingNs({
    form: props.form,
    isEdit: props.isEdit,
    dataSource: props.dataSource,
    setDataSource: props.setDataSource,
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

export default ComponentPricingNS;
