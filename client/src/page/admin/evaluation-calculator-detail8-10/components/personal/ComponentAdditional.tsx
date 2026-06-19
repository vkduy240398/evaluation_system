import { Button, Form, Grid, Table, Typography } from 'antd';
import { t } from 'i18next';
import { Dispatch, SetStateAction, startTransition, useEffect, useRef } from 'react';
import { RandomHelper } from '../../../../../common/utils/RandomHelper';
import { TypeAchievement } from '../../../../../constant/VersionSettingType';
import { dataSubSetting810, dataTab17GoalPersonalAdditional } from '../../interfaces/dataSource8_10';
import ColumnAdditional from './ColumnAdditional';

interface formProps {
  form: any;
  dataSource: dataTab17GoalPersonalAdditional;
  setDataSource: Dispatch<SetStateAction<dataTab17GoalPersonalAdditional>>;
  isEdit: any;
  openNotification: any;
  isLoading: boolean;
  dataHandling: dataSubSetting810;
  setDataHandling: Dispatch<SetStateAction<dataSubSetting810>>;
}

const { useBreakpoint } = Grid;
const ComponentAdditional = (props: formProps) => {
  const screens = useBreakpoint();

  const isValueChange = useRef(false);
  useEffect(() => {
    const arr: any = [];
    props.dataHandling?.settingAchievementAdditional?.forEach((e: any, _index: any) => {
      const countDuplicateRating =
        props.dataHandling?.settingAchievementAdditional?.filter((num: any) => e.rating === num.rating).length || 0;
      if (countDuplicateRating > 1 || e.rating != '') {
        arr.push(`input_rating_${e.key}`);
      }

      const countDuplicatePoint =
        props.dataHandling?.settingAchievementAdditional?.filter((num: any) => e.point === num.point).length || 0;
      if (countDuplicatePoint > 1 || e.point != '') {
        arr.push(`input_point_additional_${e.key}`);
      }
    });
    if (isValueChange.current) {
      props.form.validateFields(arr);
      isValueChange.current = false;
    }
  }, [props.dataHandling]);

  const columnMergers = ColumnAdditional({
    form: props.form,
    isEdit: props.isEdit,
    dataSource: props.dataSource,
    setDataSource: props.setDataSource,
    isLoading: props.isLoading,
    isValueChange: isValueChange,
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
          dataSource={props.dataSource.settingAchievementAdditional}
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
              // const dataList = [...(props.dataSource.settingAchievementAdditional || [])];
              const dataListTabs = [...(props.dataHandling.settingAchievementAdditional || [])];

              if (dataListTabs.length < 10) {
                dataListTabs.push({
                  key: RandomHelper.randomString(32),
                  type: TypeAchievement.PERSONAL_810,
                });
                startTransition(() =>
                  props.setDataSource({
                    ...props.dataSource,
                    settingAchievementAdditional: dataListTabs,
                  }),
                );
                props.setDataHandling({
                  ...props.dataHandling,
                  settingAchievementAdditional: dataListTabs,
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

export default ComponentAdditional;
