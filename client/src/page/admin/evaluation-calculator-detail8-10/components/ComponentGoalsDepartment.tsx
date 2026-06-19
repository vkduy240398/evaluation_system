/* eslint-disable @typescript-eslint/naming-convention */
import { Button, Form, FormInstance, Grid, Table, Typography } from 'antd';
import { t } from 'i18next';
import { SettingAchievementPersonalType } from '../../../../constant/SettingAchievementPersonalType';
import { TypeAchievement } from '../../../../constant/VersionSettingType';
import { dataSubSetting810, dataTab810GoalDepartment } from '../interfaces/dataSource8_10';
import ColumnGoalsDepartmentDiff from './ColumnGoalsDepartmentDiff';
import ColumnGoalsDepartmentIndex from './ColumnGoalsDepartmentIndex';
import { Dispatch, SetStateAction } from 'react';

interface formProps {
  form: FormInstance;
  isEdit: any;
  data: dataTab810GoalDepartment;
  setData: Dispatch<SetStateAction<dataTab810GoalDepartment>>;
  isLoading: any;
  setIsLoading: any;
  openNotification: any;
  dataHandling: dataSubSetting810;
  setDataHandling: Dispatch<SetStateAction<dataSubSetting810>>;
}

const ComponentGoalsDepartment = (props: formProps) => {
  const { form, isEdit, data, openNotification, setData, isLoading, dataHandling, setDataHandling } = props;
  const breaks = Grid.useBreakpoint();

  const diffTableColumns = ColumnGoalsDepartmentDiff({
    isEdit: isEdit,
    data: data,
    setData: setData,
    form: form,
    dataHandling: dataHandling,
    setDataHandling: setDataHandling,
  });

  const indexTableColumns = ColumnGoalsDepartmentIndex({
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
        <Typography.Title level={4}>{t('IDS_DIFFICULTY')}</Typography.Title>
        <Table
          scroll={{ x: breaks.xs ? 900 : undefined }}
          style={{ wordBreak: 'break-all' }}
          loading={isLoading}
          size="small"
          columns={diffTableColumns}
          dataSource={data.settingAchievementDepDiff}
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
              // const dataList = [...data.settingAchievementDepDiff];
              const dataListTabs = [...dataHandling.settingAchievementDepDiff];

              if (dataListTabs.length < 10) {
                dataListTabs.push({
                  key: Math.random().toString(36).slice(2),
                  type: SettingAchievementPersonalType.DIFFICULTY,
                  typeEvaluation: TypeAchievement.DEPARTMENT_810,
                });
                setData({ ...data, settingAchievementDepDiff: dataListTabs });
                setDataHandling({ ...dataHandling, settingAchievementDepDiff: dataListTabs });
              } else {
                openNotification('bottomRight', t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', '10'));
              }
            }}
            style={{ marginTop: 10 }}
          >
            {t('IDS_BUTTON_ADD')}
          </Button>
        )}

        <div style={{ marginTop: 25 }}>
          <Typography.Title level={4}>{t('IDS_EVALUATION_JUDGMENT_INDEX')}</Typography.Title>
          <Table
            scroll={{ x: breaks.xs ? 900 : undefined }}
            style={{ wordBreak: 'break-all' }}
            size="small"
            columns={indexTableColumns}
            dataSource={data.settingAchievementDepJudgeIndex}
            pagination={false}
            loading={isLoading}
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
                // const dataList = [...data.settingAchievementDepJudgeIndex];
                const dataListTabs = [...dataHandling.settingAchievementDepJudgeIndex];

                if (dataListTabs.length < 10) {
                  dataListTabs.push({
                    key: Math.random().toString(36).slice(2),
                    type: SettingAchievementPersonalType.EVALUATION_JUDGMENT_INDEX,
                    typeEvaluation: TypeAchievement.DEPARTMENT_810,
                  });
                  setData({ ...data, settingAchievementDepJudgeIndex: dataListTabs });
                  setDataHandling({ ...dataHandling, settingAchievementDepJudgeIndex: dataListTabs });
                } else {
                  openNotification('bottomRight', t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', '10'));
                }
              }}
              style={{ marginTop: 10 }}
            >
              {t('IDS_BUTTON_ADD')}
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default ComponentGoalsDepartment;
