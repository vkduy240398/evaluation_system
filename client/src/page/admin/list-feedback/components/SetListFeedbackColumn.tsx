import { Space } from 'antd';
import { t } from 'i18next';
import moment from 'moment';
import { FeedbackStatus, FeedbackType } from '../../../../model/Feedback';
import DownloadZipFeedback from './DownloadZipFeedback';

const SetListFeedbackColumn = () => {
  const displayTypeFeedback = (record: any) => {
    if (record.type === FeedbackType.BUG) {
      return t('IDS_TYPE_FEEDBACK_OPTIONS.IDS_BUG');
    } else if (record.type === FeedbackType.REQUEST) {
      return t('IDS_TYPE_FEEDBACK_OPTIONS.IDS_REQUIREMENT');
    } else {
      return '';
    }
  };

  const displayStatusFeedback = (record: any) => {
    if (record.status === FeedbackStatus.SAVE_DRAFT) {
      return t('IDS_STATUS_OPTIONS.IDS_SAVE_DRAFT');
    } else if (record.status === FeedbackStatus.SUBMIT) {
      return t('IDS_STATUS_OPTIONS.IDS_SUBMIT');
    } else if (record.status === FeedbackStatus.APPROVAL) {
      return t('IDS_STATUS_OPTIONS.IDS_APPROVE');
    } else if (record.status === FeedbackStatus.PENDING) {
      return t('IDS_STATUS_OPTIONS.IDS_PENDING');
    } else if (record.status === FeedbackStatus.CLOSE) {
      return t('IDS_STATUS_OPTIONS.IDS_CLOSE');
    } else if (record.status === FeedbackStatus.IN_PROGRESS) {
      return t('IDS_STATUS_OPTIONS.IDS_IN_PROGRESS');
    } else if (record.status === FeedbackStatus.DONE) {
      return t('IDS_STATUS_OPTIONS.IDS_DONE');
    } else {
      return '';
    }
  };

  const displayDepartment = (record: any) => {
    if (record.level < 8) {
      return record.department_name;
    } else if (record.level >= 8) {
      return record.division_name;
    } else {
      return '';
    }
  };

  return [
    {
      title: t('IDS_SUBJECT'),
      dataIndex: 'subject',
      width: '20%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'left' }}>{record?.subject}</div>;
      },
    },
    {
      title: t('IDS_TYPE_FEEDBACK'),
      dataIndex: 'typeFeedback',
      width: '10%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'left' }}>{displayTypeFeedback(record)}</div>;
      },
    },
    {
      title: t('IDS_STATUS'),
      dataIndex: 'status',
      width: '10%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'left' }}>{displayStatusFeedback(record)}</div>;
      },
    },
    {
      title: t('IDS_USER'),
      dataIndex: 'user',
      width: '15%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return (
          <div style={{ textAlign: 'left' }}>
            {record?.employee_number}: {record?.full_name}
          </div>
        );
      },
    },
    {
      title: t('IDS_DEPARTMENT'),
      dataIndex: 'department',
      width: '20%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'left' }}>{displayDepartment(record)}</div>;
      },
    },
    {
      title: t('IDS_TIME_CREATED'),
      dataIndex: 'timeCreated',
      width: '15%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return (
          <div style={{ textAlign: 'left' }}>
            {record.send_time ? moment(record.send_time).format('YYYY/M/D H:mm') : ''}
          </div>
        );
      },
    },
    {
      title: t('IDS_ACTION'),
      dataIndex: 'action',
      width: '10%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return (
          <Space size="middle">
            <DownloadZipFeedback params={record} />
          </Space>
        );
      },
    },
  ];
};

export default SetListFeedbackColumn;
