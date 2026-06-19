import { Button, Form, Grid, Table, Typography } from 'antd';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { t } from 'i18next';
import { Dispatch, SetStateAction, useState } from 'react';
import { TypeAchievement } from '../../../../constant/VersionSettingType';
import { dataTab810GoalDepartmentAdditional } from '../interfaces/dataSource8_10';
import ColumnAdditionalDep from './ColumnAdditionalDep';

interface items {
  key: any;
}

interface formProps {
  form: any;
  isEdit: any;

  setData: Dispatch<SetStateAction<dataTab810GoalDepartmentAdditional>>;
  data: dataTab810GoalDepartmentAdditional;
  isLoading: any;
  setIsLoading: any;
  openNotification: (placement: NotificationPlacement, mesage: string) => void;
  dataHandling: any;
  setDataHandling: any;
}

const ComponentAdditionalDep = (props: formProps) => {
  const { form, isEdit, openNotification, isLoading, setData, data, dataHandling, setDataHandling } = props;
  const [editingKey, setEditingKey] = useState<any>('');
  const breaks = Grid.useBreakpoint();

  const editing = (record: items) => {
    return record.key === editingKey.key;
  };

  const columnMergers = ColumnAdditionalDep({
    editing: editing,
    setEditingKey: setEditingKey,
    form: form,
    isEdit: isEdit,
    data: data,
    setData: setData,
    dataHandling: dataHandling,
    setDataHandling: setDataHandling,
  });

  return (
    <div>
      <Form labelAlign="left" component={false} form={form}>
        <Typography.Title level={4}>{t('IDS_EVALUATION_CRITERIA')}</Typography.Title>
        <Table
          scroll={{ x: breaks.xs ? 900 : undefined }}
          loading={isLoading}
          style={{ wordBreak: 'break-all' }}
          size="small"
          columns={columnMergers}
          dataSource={data.settingAchievementAdditionalDep}
          pagination={false}
          bordered
          locale={{
            emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
          }}
        />
        {isEdit && (
          <Button
            type="primary"
            className="button-normal"
            onClick={() => {
              // const dataList = [...data.settingAchievementAdditionalDep];
              const dataListTabs = [...dataHandling.settingAchievementAdditionalDep];

              if (dataListTabs.length < 10) {
                dataListTabs.push({
                  key: Math.random().toString(36).slice(2),
                  type: TypeAchievement.DEPARTMENT_810,
                });
                setData({ ...data, settingAchievementAdditionalDep: dataListTabs });
                setDataHandling({ ...dataHandling, settingAchievementAdditionalDep: dataListTabs });
              } else
                openNotification('bottomRight', t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', '10'));
            }}
            style={{ marginTop: 10 }}
            loading={isLoading}
          >
            {t('IDS_BUTTON_ADD')}
          </Button>
        )}
      </Form>
    </div>
  );
};

export default ComponentAdditionalDep;
