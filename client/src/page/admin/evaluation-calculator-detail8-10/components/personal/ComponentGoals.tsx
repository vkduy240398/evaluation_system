/* eslint-disable @typescript-eslint/naming-convention */
import { Button, Form, Grid, Table, Typography } from 'antd';
import { FormInstance } from 'antd/lib';
import { t } from 'i18next';
import { Dispatch, SetStateAction, startTransition } from 'react';
import { RandomHelper } from '../../../../../common/utils/RandomHelper';
import { SettingAchievementPersonalType } from '../../../../../constant/SettingAchievementPersonalType';
import { TypeAchievement } from '../../../../../constant/VersionSettingType';
import { dataSubSetting810, dataTab17GoalPersonal } from '../../interfaces/dataSource8_10';
import { ColumnGoalDiffs, ColumnGoalJudgeIndexes } from './ColumnGoals';

interface formProps {
  form: FormInstance;
  dataSource: dataTab17GoalPersonal;
  setDataSource: Dispatch<SetStateAction<dataTab17GoalPersonal>>;
  isEdit: boolean;
  openNotification: any;
  isLoading: boolean;
  dataHandling: dataSubSetting810;
  setDataHandling: Dispatch<SetStateAction<dataSubSetting810>>;
}

const { useBreakpoint } = Grid;
const ComponentGoals = (props: formProps) => {
  const screens = useBreakpoint();

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const columnMergerDiff = ColumnGoalDiffs({
    form: props.form,
    isEdit: props.isEdit,
    dataSource: props.dataSource,
    setDataSource: props.setDataSource,
    isLoading: props.isLoading,
    dataHandling: props.dataHandling,
    setDataHandling: props.setDataHandling,
  });
  const columnMergerJudgeIndex = ColumnGoalJudgeIndexes({
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
        <Typography.Title level={4}>{t('IDS_DIFFICULTY')}</Typography.Title>
        <Table
          size="small"
          scroll={{ x: screens.xs ? 1000 : undefined }}
          columns={columnMergerDiff}
          dataSource={props.dataSource.settingAchievementPersonalDiff}
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
              const dataListTab = [...(props.dataHandling.settingAchievementPersonalDiff || [])];

              if (dataListTab.length < 10) {
                dataListTab.push({
                  key: RandomHelper.randomString(32),
                  type: SettingAchievementPersonalType.DIFFICULTY,
                  typeEvaluation: TypeAchievement.PERSONAL_810,
                });
                startTransition(() =>
                  props.setDataSource({
                    ...props.dataSource,
                    settingAchievementPersonalDiff: dataListTab,
                  }),
                );
                props.setDataHandling({
                  ...props.dataHandling,
                  settingAchievementPersonalDiff: dataListTab,
                });
              } else {
                props.openNotification(
                  'bottomRight',
                  t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', '10'),
                );
              }
            }}
            style={{ marginTop: 10 }}
            loading={props.isLoading}
          >
            {t('IDS_BUTTON_ADD')}
          </Button>
        )}

        <Typography.Title level={4} style={{ paddingTop: 20 }}>
          {t('IDS_EVALUATION_JUDGMENT_INDEX')}
        </Typography.Title>
        <Table
          size="small"
          scroll={{ x: screens.xs ? 1000 : undefined }}
          columns={columnMergerJudgeIndex}
          dataSource={props.dataSource.settingAchievementPersonalJudgeIndex}
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
              // const dataList = [...(props.dataSource.settingAchievementPersonalJudgeIndex || [])];
              const dataListTab = [...(props.dataHandling.settingAchievementPersonalJudgeIndex || [])];

              if (dataListTab.length < 10) {
                dataListTab.push({
                  key: RandomHelper.randomString(32),
                  type: SettingAchievementPersonalType.EVALUATION_JUDGMENT_INDEX,
                  typeEvaluation: TypeAchievement.PERSONAL_810,
                });
                startTransition(() =>
                  props.setDataSource({
                    ...props.dataSource,
                    settingAchievementPersonalJudgeIndex: dataListTab,
                  }),
                );
                props.setDataHandling({
                  ...props.dataHandling,
                  settingAchievementPersonalJudgeIndex: dataListTab,
                });
              } else {
                props.openNotification(
                  'bottomRight',
                  t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', '10'),
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

export default ComponentGoals;
