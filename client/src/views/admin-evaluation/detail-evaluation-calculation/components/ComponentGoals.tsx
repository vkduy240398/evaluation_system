/* eslint-disable @typescript-eslint/naming-convention */
import { Dispatch, SetStateAction, startTransition } from 'react';
import { Button, Table, Typography, Form, Grid } from 'antd';
import {
  DetailEvaluationCalculationDto,
  TypeAchievement,
} from '../../../../model/evaluation-calculation/DetailEvaluationCalculationModel';
import { t } from 'i18next';
import { RandomHelper } from '../../../../common/utils/RandomHelper';
import { SettingAchievementPersonalType } from '../../../../constant/SettingAchievementPersonalType';
import { ColumnGoalDiffs, ColumnGoalJudgeIndexes } from '../column/ColumnGoals';
interface formProps {
  form: any;
  dataSource: DetailEvaluationCalculationDto;
  setDataSource: Dispatch<SetStateAction<DetailEvaluationCalculationDto>>;
  isEdit: any;
  openNotification: any;
  isLoading: boolean;
}

const { useBreakpoint } = Grid;
const ComponentGoals = (props: formProps) => {
  const save = () => {};
  const screens = useBreakpoint();

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const columnMergerDiff = ColumnGoalDiffs({
    form: props.form,
    isEdit: props.isEdit,
    dataSource: props.dataSource,
    setDataSource: props.setDataSource,
    isLoading: props.isLoading,
  });
  const columnMergerJudgeIndex = ColumnGoalJudgeIndexes({
    form: props.form,
    isEdit: props.isEdit,
    dataSource: props.dataSource,
    setDataSource: props.setDataSource,
    isLoading: props.isLoading,
  });

  return (
    <div>
      <Form labelCol={{ xl: { span: 2 } }} labelAlign="left" onFinish={save} component={false} form={props.form}>
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
              const dataList = [...(props.dataSource.settingAchievementPersonalDiff || [])];

              if (dataList.length < 10) {
                dataList.push({
                  key: RandomHelper.randomString(32),
                  type: SettingAchievementPersonalType.DIFFICULTY,
                  versionId: props.dataSource.id,
                  typeEvaluation: TypeAchievement.PERSONAL_17,
                });
                startTransition(() =>
                  props.setDataSource({ ...props.dataSource, settingAchievementPersonalDiff: dataList }),
                );
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
              const dataList = [...(props.dataSource.settingAchievementPersonalJudgeIndex || [])];

              if (dataList.length < 10) {
                dataList.push({
                  key: RandomHelper.randomString(32),
                  type: SettingAchievementPersonalType.EVALUATION_JUDGMENT_INDEX,
                  versionId: props.dataSource.id,
                  typeEvaluation: TypeAchievement.PERSONAL_17,
                });
                startTransition(() =>
                  props.setDataSource({ ...props.dataSource, settingAchievementPersonalJudgeIndex: dataList }),
                );
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
