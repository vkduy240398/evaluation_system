/* eslint-disable @typescript-eslint/naming-convention */
import { Button, Form, Grid, Table, Typography } from 'antd';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { t } from 'i18next';
import { dataSubSetting810, dataTab810Formula } from '../interfaces/dataSource8_10';
import ColumnTotalPoint from './ColumnTotalPoint';
import { Dispatch, SetStateAction } from 'react';

interface formProps {
  form: any;
  isEdit: any;
  isLoading: any;
  setIsLoading: any;
  data: dataTab810Formula;
  setData: any;
  openNotification: (placement: NotificationPlacement, mesage: string) => void;
  dataHandling: dataSubSetting810;
  setDataHandling: Dispatch<SetStateAction<dataSubSetting810>>;
}

const ComponentTotalPoint = (props: formProps) => {
  const { form, isEdit, isLoading, openNotification, data, setData, dataHandling, setDataHandling } = props;
  const breaks = Grid.useBreakpoint();

  const totalPointColumns = ColumnTotalPoint({
    isEdit: isEdit,
    data: data,
    setData: setData,
    form: form,
    dataHandling: dataHandling,
    setDataHandling: setDataHandling,
  });

  return (
    <div>
      <Form labelAlign="left" component={false} form={form}>
        <Typography.Title level={4}>{t('IDS_DIVISION_EVALUATION')}</Typography.Title>
        <Table
          scroll={{ x: breaks.xs ? 900 : undefined }}
          loading={isLoading}
          style={{ wordBreak: 'break-all' }}
          size="small"
          columns={totalPointColumns}
          dataSource={data.settingFormula810}
          pagination={false}
          bordered
          locale={{
            emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
          }}
        />
        {isEdit && (
          <Button
            loading={isLoading}
            type="primary"
            className="button-normal"
            onClick={() => {
              // const dataList = [...data.settingFormula810];
              const dataListTabs = [...dataHandling.settingFormula810];

              if (dataListTabs.length < 10) {
                dataListTabs.push({
                  key: Math.random().toString(36).slice(2),
                });
                setData({ ...data, settingFormula810: dataListTabs });
                setDataHandling({ ...dataHandling, settingFormula810: dataListTabs });
              } else
                openNotification('bottomRight', t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', '10'));
            }}
            style={{ marginTop: 10 }}
          >
            {t('IDS_BUTTON_ADD')}
          </Button>
        )}
      </Form>
    </div>
  );
};

export default ComponentTotalPoint;
