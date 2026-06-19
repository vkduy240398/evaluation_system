import { TabsProps } from 'antd';
import ComponentBasic from './ComponentBasic';
import { t } from 'i18next';
import ComponentProSkill from './ComponentProSkill';
import ComponentBehavior from './ComponentBehavior';
import ComponentGoals from './ComponentGoals';
import ComponentAdditional from './ComponentAdditional';
import ComponentPricing from './ComponentPricing';
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

export const BASIC_KEY = 'basic';
export const PRO_KEY = 'proSkill';
export const BEHAVIOR_KEY = 'behavior';
export const GOAL_KEY = 'goals';
export const ADDITIONAL_KEY = 'additional';
export const PRICING_KEY = 'pricing';
export const SETTING_MAX_POINT = 'settingMaxPoint';

export const getItemTag = (props: Props) => {
  const items: TabsProps['items'] = [
    {
      key: BASIC_KEY,
      label: t('IDS_BASIC_SKILL'),
      children: (
        <ComponentBasic
          isEdit={props.isEdit || props.dataSource?.status === VersionSettingStatus.EDITING}
          dataSource={props.dataSource}
          setDataSource={props.setDataSource}
          basicMaxDifficulty={props.dataSource.basicMaxDifficulty}
          openNotification={props.openNotification}
          form={props.form}
          isLoading={props.isLoading}
          isSaveDraft={props.isSaveDraft}
        />
      ),
      forceRender: true,
    },
    {
      key: PRO_KEY,
      label: t('IDS_PRO_SKILL'),
      children: (
        <ComponentProSkill
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
        <ComponentPricing
          dataSource={props.dataSource}
          setDataSource={props.setDataSource}
          form={props.form}
          isEdit={props.isEdit || props.dataSource?.status === VersionSettingStatus.EDITING}
          isLoading={props.isLoading}
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
