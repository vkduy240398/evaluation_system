import { Tooltip, Typography } from 'antd';
import { t } from 'i18next';
import TooltipNote from '../../../pro-skill-setting/edit/components/TooltipNote';
import Icon, { InfoCircleOutlined } from '@ant-design/icons';

const ColumnComponent = () => {
  const columns: any = [
    {
      title: t('IDS_JOB_TYPE'),
      dataIndex: 'jobType',
      key: 'jobType',
      width: '6rem',
      render: (text: string) => {
        return {
          props: {
            style: {
              wordBreak: 'break-word',
              verticalAlign: 'top',
              textAlign: 'left',
            },
          },
          children: <>{text}</>,
        };
      },
    },
    {
      title: t('IDS_LARGE_MEDIUM_CATEGORY'),
      dataIndex: 'mediumClass',
      key: 'mediumClass',
      width: '6rem',
      render: (text: string) => {
        return {
          props: {
            style: {
              wordBreak: 'break-word',
              verticalAlign: 'top',
              textAlign: 'left',
            },
          },
          children: <>{text}</>,
        };
      },
    },
    {
      title: t('IDS_SMALL_CATEGORY'),
      dataIndex: 'smallClass',
      key: 'smallClass',
      width: '6rem',
      render: (text: string) => {
        return {
          props: {
            style: {
              wordBreak: 'break-word',
              verticalAlign: 'top',
              textAlign: 'left',
            },
          },
          children: <>{text}</>,
        };
      },
    },
    {
      title: t('IDS_EVALUATION_CONTENT'),
      dataIndex: 'content',
      key: 'content',
      width: '25rem',
      render: (text: string) => {
        return {
          props: {
            style: {
              wordBreak: 'break-word',
              verticalAlign: 'top',
              textAlign: 'left',
            },
          },
          children: <>{text}</>,
        };
      },
    },
    {
      title: t('IDS_DIFFICULTY'),
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: '80px',
      align: 'center' as const,
      render: (text: string) => {
        return {
          props: {
            style: {
              wordBreak: 'break-word',
              verticalAlign: 'top',
            },
          },
          children: <>{text}</>,
        };
      },
    },
    {
      title: (
        <>
          <>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography.Title
                level={5}
                style={{
                  color: '#fff',
                  margin: 0,
                  fontSize: 14,
                }}
              >
                {t('IDS_EVALUATION_CRITERIA')}
              </Typography.Title>
              <Tooltip
                title={<TooltipNote />}
                color="#424242"
                overlayInnerStyle={{ fontSize: '11px', maxWidth: 'unset', width: 'unset' }}
              >
                <Icon
                  component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                  style={{ color: '#fff', fontSize: 18, marginLeft: '7px' }}
                />
              </Tooltip>
            </div>
          </>
        </>
      ),
      dataIndex: 'note',
      align: 'center' as const,
      key: 'note',
      width: '12rem',
      render: (text: string) => {
        return {
          props: {
            style: {
              wordBreak: 'break-word',
              verticalAlign: 'top',
              textAlign: 'left',
            },
          },
          children: <>{text}</>,
        };
      },
    },
  ];

  return columns;
};

export default ColumnComponent;
