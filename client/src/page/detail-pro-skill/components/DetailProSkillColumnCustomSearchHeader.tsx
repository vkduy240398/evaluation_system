import { t } from 'i18next';
import { Tooltip, Typography } from 'antd';
import { CSSProperties, ReactNode } from 'react';
import Icon, { InfoCircleOutlined } from '@ant-design/icons';
import TooltipNote from '../../../views/pro-skill-setting/edit/components/TooltipNote';

interface Props {
  searchFieldHeader: (name: string, title: string) => ReactNode;
}
const DetailProSkillColumnCustomSearchHeader: any = (props: Props) => {
  const { searchFieldHeader } = props;

  const styled: CSSProperties = {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  };
  const columns = [
    {
      title: searchFieldHeader('jobType', t('IDS_JOB_TYPE')),
      dataIndex: 'jobType',
      key: 'jobType',
      width: '6rem',
      onCell: (record: any, _rowIndex: any) => {
        return {
          style: {
            background:
              location.pathname.includes('/pro-skill-approval/detail-pro-skill-approve/') &&
              record.typeJob === 'change' &&
              '#66CDAA',
            verticalAlign: 'top',
            wordBreak: 'break-word',
          },
        };
      },
      render: (text: any, record: any) => {
        return (
          <>
            {location.pathname.includes('/pro-skill-approval/detail-pro-skill-approve/') &&
            record.typeJob === 'change' ? (
              <Tooltip
                title={
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    <p>
                      <span>{`---${t('IDS_PUBLIC_VERSION')}---
${record.jobOld}`}</span>
                    </p>
                  </div>
                }
                color="#424242"
                overlayInnerStyle={{ fontSize: '11px' }}
              >
                <div className="full-content-column" style={{ ...styled }}>
                  {text}
                </div>
              </Tooltip>
            ) : (
              <div style={{ ...styled }}>{text}</div>
            )}
          </>
        );
      },
    },
    {
      title: searchFieldHeader('mediumClass', t('IDS_LARGE_MEDIUM_CATEGORY')),
      dataIndex: 'mediumClass',
      key: 'mediumClass',
      width: '6rem',
      onCell: (record: any, _rowIndex: any) => {
        return {
          style: {
            background:
              location.pathname.includes('/pro-skill-approval/detail-pro-skill-approve/') &&
              record.typeMediumClass === 'change' &&
              '#66CDAA',
            verticalAlign: 'top',
            wordBreak: 'break-word',
          },
        };
      },
      render: (text: any, record: any) => {
        return (
          <>
            {location.pathname.includes('/pro-skill-approval/detail-pro-skill-approve/') &&
            record.typeMediumClass === 'change' ? (
              <Tooltip
                title={
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    <p>
                      <span>{`---${t('IDS_PUBLIC_VERSION')}---
${record.mediumClassOld}`}</span>
                    </p>
                  </div>
                }
                color="#424242"
                overlayInnerStyle={{ fontSize: '11px' }}
              >
                <div className="full-content-column" style={{ ...styled }}>
                  {text}
                </div>
              </Tooltip>
            ) : (
              <div style={{ ...styled }}>{text}</div>
            )}
          </>
        );
      },
    },
    {
      title: searchFieldHeader('smallClass', t('IDS_SMALL_CATEGORY')),
      dataIndex: 'smallClass',
      key: 'smallClass',
      width: '6rem',
      onCell: (record: any, _rowIndex: any) => {
        return {
          style: {
            background:
              location.pathname.includes('/pro-skill-approval/detail-pro-skill-approve/') &&
              record.typeSmallClass === 'change' &&
              '#66CDAA',
            verticalAlign: 'top',
            wordBreak: 'break-word',
          },
        };
      },
      render: (text: any, record: any) => {
        return (
          <>
            {location.pathname.includes('/pro-skill-approval/detail-pro-skill-approve/') &&
            record.typeSmallClass === 'change' ? (
              <Tooltip
                title={
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    <p>
                      <span>{`---${t('IDS_PUBLIC_VERSION')}---
${record.smallClassOld}`}</span>
                    </p>
                  </div>
                }
                color="#424242"
                overlayInnerStyle={{ fontSize: '11px' }}
              >
                <div className="full-content-column" style={{ ...styled }}>
                  {text}
                </div>
              </Tooltip>
            ) : (
              <div style={{ ...styled }}>{text}</div>
            )}
          </>
        );
      },
    },
    {
      title: t('IDS_EVALUATION_CONTENT'),
      dataIndex: 'content',
      key: 'content',
      width: '12rem',
      onCell: (record: any, _rowIndex: any) => {
        return {
          style: {
            background:
              location.pathname.includes('/pro-skill-approval/detail-pro-skill-approve/') &&
              record.typeContent === 'change' &&
              '#66CDAA',
            verticalAlign: 'top',
            wordBreak: 'break-word',
          },
        };
      },
      render: (text: any, record: any) => {
        return (
          <>
            {location.pathname.includes('/pro-skill-approval/detail-pro-skill-approve/') &&
            record.typeContent === 'change' ? (
              <Tooltip
                title={
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    <p>
                      <span>{`---${t('IDS_PUBLIC_VERSION')}---
${record.contentOld}`}</span>
                    </p>
                  </div>
                }
                color="#424242"
                overlayInnerStyle={{ fontSize: '11px' }}
              >
                <div className="full-content-column" style={{ ...styled }}>
                  {text}
                </div>
              </Tooltip>
            ) : (
              <div style={{ ...styled }}>{text}</div>
            )}
          </>
        );
      },
    },
    {
      title: t('IDS_DIFFICULTY'),
      dataIndex: 'difficulty',
      key: 'difficulty',
      align: 'center' as const,
      width: '44px',
      onCell: (record: any, _rowIndex: any) => {
        return {
          style: {
            background:
              location.pathname.includes('/pro-skill-approval/detail-pro-skill-approve/') &&
              record.typedifficulty === 'change' &&
              '#66CDAA',
            verticalAlign: 'top',
            wordBreak: 'break-word',
          },
        };
      },
      render: (text: any, record: any) => {
        return (
          <>
            {location.pathname.includes('/pro-skill-approval/detail-pro-skill-approve/') &&
            record.typedifficulty === 'change' ? (
              <Tooltip
                title={
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    <p>
                      <span>{`---${t('IDS_PUBLIC_VERSION')}---
${record.difficultyOld}`}</span>
                    </p>
                  </div>
                }
                color="#424242"
                overlayInnerStyle={{ fontSize: '11px' }}
              >
                <div className="full-content-column" style={{ ...styled }}>
                  {text}
                </div>
              </Tooltip>
            ) : (
              <div style={{ ...styled }}>{text}</div>
            )}
          </>
        );
      },
    },
    {
      title: (
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
            <Tooltip title={<TooltipNote />} color="#424242" overlayInnerStyle={{ fontSize: '11px' }}>
              <Icon
                component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                style={{ color: '#fff', fontSize: 18, marginLeft: '7px' }}
              />
            </Tooltip>
          </div>
        </>
      ),
      dataIndex: 'note',
      key: 'note',
      width: '12rem',
      onCell: (record: any, _rowIndex: any) => {
        return {
          style: {
            background:
              location.pathname.includes('/pro-skill-approval/detail-pro-skill-approve/') &&
              record.typeNote === 'change' &&
              '#66CDAA',
            verticalAlign: 'top',
            wordBreak: 'break-word',
          },
        };
      },
      render: (text: any, record: any, _index: any) => {
        return (
          <>
            {location.pathname.includes('/pro-skill-approval/detail-pro-skill-approve/') &&
            record.typeNote === 'change' ? (
              <Tooltip
                title={
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    <p>
                      <span>{`---${t('IDS_PUBLIC_VERSION')}---
${record.noteOld}`}</span>
                    </p>
                  </div>
                }
                color="#424242"
                overlayInnerStyle={{ fontSize: '11px' }}
              >
                {
                  <div className="full-content-column" style={{ ...styled }}>
                    {text}
                  </div>
                }
              </Tooltip>
            ) : (
              <div style={{ ...styled }}>{text}</div>
            )}
          </>
        );
      },
    },
  ];

  return columns;
};

export default DetailProSkillColumnCustomSearchHeader;
