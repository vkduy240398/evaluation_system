import { TabsProps } from 'antd';
import { t } from 'i18next';
import ComponentBehavior from './ComponentBehavior';
import ComponentGoals from './ComponentGoals';
import ComponentAdditional from './ComponentAdditional';
import { ADDITIONAL_KEY, BEHAVIOR_KEY, GOAL_KEY, PRICING_KEY, SETTING_MAX_POINT } from './ItemTab';
import ComponentPricingNs from './ComponentPricingNs';
import { VersionSettingStatus } from '../../../../constant/VersionSettingStatus';
import ComponentSettingMaxPoint from './ComponentSettingMaxPoint';

interface Props {
  dataSource: any;
  setDataSource: any;
  form: any;
  isEdit: any;
  openNotification: any;
  isLoading: boolean;
  isSaveDraft: boolean;
}

export const getItemTagNs = (props: Props) => {
  const items: TabsProps['items'] = [
    {
      key: BEHAVIOR_KEY,
      label: t('IDS_BEHAVIOR'),
      children: (
        <ComponentBehavior
          form={props.form}
          dataSource={props.dataSource}
          setDataSource={props.setDataSource}
          isEdit={props.isEdit || props.dataSource?.status === VersionSettingStatus.EDITING}
          behaviorMaxWeight={props.dataSource.behaviorMaxWeight}
          openNotification={props.openNotification}
          isLoading={props.isLoading}
          isSaveDraft={props.isSaveDraft}
        />
      ),
      forceRender: true,
    },
    {
      key: GOAL_KEY,
      label: t('IDS_ACHIEVEMENT_PERSONAL'),
      children: (
        <ComponentGoals
          dataSource={props.dataSource}
          setDataSource={props.setDataSource}
          form={props.form}
          isEdit={props.isEdit || props.dataSource?.status === VersionSettingStatus.EDITING}
          openNotification={props.openNotification}
          isLoading={props.isLoading}
        />
      ),
      forceRender: true,
    },
    {
      key: ADDITIONAL_KEY,
      label: t('IDS_ACHIEVEMENT_ADDITIONAL_RESULT'),
      children: (
        <ComponentAdditional
          dataSource={props.dataSource}
          setDataSource={props.setDataSource}
          form={props.form}
          isEdit={props.isEdit || props.dataSource?.status === VersionSettingStatus.EDITING}
          openNotification={props.openNotification}
          isLoading={props.isLoading}
        />
      ),
      forceRender: true,
    },
    {
      key: PRICING_KEY,
      label: t('IDS_EVALUATION_DISTRIBUTION'),
      children: (
        <ComponentPricingNs
          dataSource={props.dataSource}
          setDataSource={props.setDataSource}
          form={props.form}
          isEdit={props.isEdit || props.dataSource?.status === VersionSettingStatus.EDITING}
        />
      ),
      forceRender: true,
    },
    {
      key: SETTING_MAX_POINT,
      label: t('IDS_TOTAL_POINT_EVALUATION_1_7'),
      children: (
        <ComponentSettingMaxPoint
          dataSource={props.dataSource}
          setDataSource={props.setDataSource}
          form={props.form}
          isEdit={props.isEdit || props.dataSource?.status === VersionSettingStatus.EDITING}
          isLoading={props.isLoading}
          openNotification={props.openNotification}
        />
      ),
      forceRender: true,
    },
  ];

  return items;
};
