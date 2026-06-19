import { ColumnsType } from 'antd/es/table';
import { PointAndSettingLevelType } from '../../../../types/pages/user-evaluation/UserEvaluationType';
import { t } from 'i18next';
import { Tooltip } from 'antd';
import Icon, { InfoCircleOutlined } from '@ant-design/icons';

export const userEvaluationColumn = ({
  maxPointProSkill,
  maxPointBasicSkill,
  versionSetting,
}: {
  maxPointProSkill: any;
  maxPointBasicSkill: any;
  versionSetting: any;
}) => {
  // ** Hook

  const columns: ColumnsType<PointAndSettingLevelType> = [
    {
      title: ' ',
      dataIndex: 'title',
      align: 'center' as const,
      width: 75,
    },
    {
      title: (
        <>
          {t('IDS_SKILL_EVALUATION_METER')}
          <Tooltip
            title={(t('IDS_TOOLTIP_BASIC_PRO_SKILL_COLUMN') as string)
              .replace('18', maxPointBasicSkill || '18')
              .replace('25', maxPointProSkill || '25')}
            color="#424242"
            overlayInnerStyle={{ fontSize: '11px' }}
          >
            <Icon
              component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
              style={{ cursor: 'default', paddingLeft: 2 }}
            />
          </Tooltip>
        </>
      ),
      width: 175,
      dataIndex: 'skillTotalPoint',
      align: 'center' as const,
    },
    {
      title: t('IDS_WEIGHT'),
      dataIndex: 'skillPercent',
      width: 80,
      render: (text: string) => (text ? `${text}%` : ''),
      onHeaderCell: () => ({
        style: { backgroundColor: '#ededed' },
      }),
      onCell: () => ({
        style: { backgroundColor: '#ededed' },
      }),
      align: 'center' as const,
    },
    {
      title: t('IDS_BEHAVIOR_EVALUATION_METER'),
      dataIndex: 'behaviorTotalPoint',
      width: 175,
      align: 'center' as const,
    },
    {
      title: t('IDS_WEIGHT'),
      dataIndex: 'behaviorPercent',
      width: 80,
      onHeaderCell: () => ({
        style: { backgroundColor: '#ededed' },
      }),
      onCell: () => ({
        style: { backgroundColor: '#ededed' },
      }),
      align: 'center' as const,
      render: (text: string) => (text ? `${text}%` : ''),
    },
    {
      title: t('IDS_ACHIEVEMENT_EVALUATION_METER'),
      dataIndex: 'achievementPersonalTotalPoint',
      width: 175,
      align: 'center' as const,
    },
    {
      title: t('IDS_WEIGHT'),
      dataIndex: 'achievementPercent',
      width: 80,
      onHeaderCell: () => ({
        style: { backgroundColor: '#ededed' },
      }),
      onCell: () => ({
        style: { backgroundColor: '#ededed' },
      }),
      align: 'center' as const,
      render: (text: string) => (text ? `${text}%` : ''),
    },
    {
      title: t('IDS_ACHIEVEMENT_ADDITIONAL'),
      dataIndex: 'achievementAdditional',
      width: 175,
      align: 'center' as const,
    },
    {
      title: (
        <>
          {t('IDS_TOTAL_POINTS')}
          <Tooltip
            title={
              (t('IDS_TOOLTIP_TOTAL_COLUMN') as string) +
              ` (${t('IDS_MIN_POINT')}：${Number(versionSetting?.minPoint) || 0}～${t('IDS_MAX_POINT')}：${
                Number(versionSetting?.maxPoint) || 100
              })`
            }
            color="#424242"
            overlayInnerStyle={{ fontSize: '11px' }}
          >
            <Icon
              component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
              style={{ cursor: 'default', paddingLeft: 2 }}
            />
          </Tooltip>
        </>
      ),
      dataIndex: 'percentPoint',
      align: 'center' as const,
      width: 110,

      // width: '20%',
    },
  ];

  return columns;
};
