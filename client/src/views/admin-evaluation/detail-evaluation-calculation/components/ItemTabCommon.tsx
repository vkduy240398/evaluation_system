import { TabsProps } from 'antd';
import { t } from 'i18next';
import { VersionSettingStatus } from '../../../../constant/VersionSettingStatus';
import ComponentProSkill from './ComponentProSkill';
import ComponentProFormula from './ComponentProFormula';

interface Props {
  dataSource: any;
  setDataSource: any;
  form: any;
  isEdit: any;
  openNotification: any;
  isLoading: boolean;
  isSaveDraft: boolean;
}

export const PRO_KEY = 'proSkill';

export const getItemTagCommon = (props: Props) => {
  const items: TabsProps['items'] = [
    {
      key: PRO_KEY,
      label: t('IDS_PRO_SKILL'),
      children: (
        <ComponentProFormula
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
  ];

  return items;
};
