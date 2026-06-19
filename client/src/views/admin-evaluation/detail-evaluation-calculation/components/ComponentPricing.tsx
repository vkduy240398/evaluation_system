/* eslint-disable @typescript-eslint/naming-convention */
import { Table, Typography, Form, Grid } from 'antd';
import ComlumnPricing from '../column/ColumnPricing';
import { DetailEvaluationCalculationDto } from '../../../../model/evaluation-calculation/DetailEvaluationCalculationModel';
import { Dispatch, SetStateAction } from 'react';
import { t } from 'i18next';

interface formProps {
  form: any;
  dataSource: DetailEvaluationCalculationDto;
  setDataSource: Dispatch<SetStateAction<DetailEvaluationCalculationDto>>;
  isEdit: any;
  isLoading: boolean;
}

const { useBreakpoint } = Grid;
const ComponentPricing = (props: formProps) => {
  const save = () => {};
  const screens = useBreakpoint();

  const columnMergers = ComlumnPricing({
    form: props.form,
    isEdit: props.isEdit,
    dataSource: props.dataSource,
    setDataSource: props.setDataSource,
    isLoading: props.isLoading,
  });

  return (
    <div>
      <Form labelCol={{ xl: { span: 2 } }} labelAlign="left" onFinish={save} component={false} form={props.form}>
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
