import { Dispatch, SetStateAction, startTransition, useEffect, useRef } from 'react';
import { Button, Table, Typography, Form, Grid } from 'antd';
import ColumnAdditional from '../column/ColumnAdditional';
import {
  DetailEvaluationCalculationDto,
  TypeAchievement,
} from '../../../../model/evaluation-calculation/DetailEvaluationCalculationModel';
import { t } from 'i18next';
import { RandomHelper } from '../../../../common/utils/RandomHelper';

interface formProps {
  form: any;
  dataSource: DetailEvaluationCalculationDto;
  setDataSource: Dispatch<SetStateAction<DetailEvaluationCalculationDto>>;
  isEdit: any;
  openNotification: any;
  isLoading: boolean;
}

const { useBreakpoint } = Grid;
const ComponentAdditional = (props: formProps) => {
  const save = () => {};
  const screens = useBreakpoint();

  const isValueChange = useRef(false);
  useEffect(() => {
    const arr: any = [];
    props.dataSource?.settingAchievementAdditional?.forEach((e: any, _index: any) => {
      const countDuplicateRating =
        props.dataSource?.settingAchievementAdditional?.filter((num) => e.rating === num.rating).length || 0;
      if (countDuplicateRating > 1 || e.rating != '') {
        arr.push(`input_rating_${e.key}`);
      }

      const countDuplicatePoint =
        props.dataSource?.settingAchievementAdditional?.filter((num) => e.point === num.point).length || 0;
      if (countDuplicatePoint > 1 || e.point != '') {
        arr.push(`input_point_additional_${e.key}`);
      }
    });
    if (isValueChange.current) {
      props.form.validateFields(arr);
      isValueChange.current = false;
    }
  }, [props.dataSource]);

  const columnMergers = ColumnAdditional({
    form: props.form,
    isEdit: props.isEdit,
    dataSource: props.dataSource,
    setDataSource: props.setDataSource,
    isLoading: props.isLoading,
    isValueChange: isValueChange,
  });

  return (
    <div>
      <Form labelCol={{ xl: { span: 2 } }} labelAlign="left" onFinish={save} component={false} form={props.form}>
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
              const dataList = [...(props.dataSource.settingAchievementAdditional || [])];

              if (dataList.length < 10) {
                dataList.push({
                  key: RandomHelper.randomString(32),
                  versionId: props.dataSource.id,
                  type: TypeAchievement.PERSONAL_17,
                });
                startTransition(() =>
                  props.setDataSource({ ...props.dataSource, settingAchievementAdditional: dataList }),
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

export default ComponentAdditional;
