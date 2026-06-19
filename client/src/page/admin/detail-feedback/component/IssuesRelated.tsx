/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Card, message, Row, Space, Table, TableProps, Tooltip, Typography } from 'antd';
import { t } from 'i18next';
import { MainButton } from '../../../../common/MainButton';
import moment from 'moment';
import { useState } from 'react';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import httpAxios from '../../../../common/http';
import ViewIssueRelated from './ViewIssuedRelated';
import AddRelatedFeedbacksPopup from './AddRelatedFeedbacksPopup';

interface Props {
  role: string;
  feedbackInfo: any;
  isLoading: boolean;
  setLoading: any;
  loadData: any;
  onAddSuccess: () => void;
}

const IssuesRelated: React.FC<Props> = (props: Props) => {
  const { role, feedbackInfo, isLoading, setLoading, loadData } = props;
  const [isOpenAddRelatedPopup, setIsOpenAddRelatedPopup] = useState(false);

  const issuesRelated = feedbackInfo?.feedbackDetail?.issuesRelated;

  const [isOpenModal, setOpenModal] = useState<boolean>(false);

  const [deteleRecord, setDeteleRecord] = useState();

  const [isOpenViewIssueRelated, setOpenViewIssueRelated] = useState(false);

  const columns: TableProps<any>['columns'] = [
    {
      title: t('IDS_NO'),
      dataIndex: 'id',
      key: 'id',
      width: '5%',
      render: (text: any, _record: any, _index: any) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    },

    // {
    //   title: 'タイプ',
    //   dataIndex: 'type',
    //   key: 'type',
    //   width: '5%',
    //   render: (text: any, record: any, _index: any) => {
    //     return <div style={{ textAlign: 'left' }}>{text}</div>;
    //   },
    // },
    // {
    //   title: '分類',
    //   dataIndex: 'phase',
    //   key: 'phase',
    //   width: '5%',
    //   render: (text: any, record: any, _index: any) => {
    //     return <div style={{ textAlign: 'left' }}>{text}</div>;
    //   },
    // },
    // {
    //   title: '状態',
    //   dataIndex: 'status',
    //   key: 'status',
    //   width: '5%',
    //   render: (text: any, record: any, _index: any) => {
    //     return <div style={{ textAlign: 'left' }}>{text}</div>;
    //   },
    // },
    {
      title: t('IDS_ISSUE_OVERVIEW'),
      dataIndex: 'summary',
      key: 'summary',
      width: '35%',
      render: (text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    },
    {
      title: t('IDS_TIME_CREATED'),
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: '5%',
      render: (text: any, _record: any, _index: any) => {
        return <div style={{ textAlign: 'left' }}>{moment(text).format('YYYY/M/D H:mm')}</div>;
      },
    },
    {
      title: t('IDS_FEEDBACK_USER_NAME'),
      dataIndex: 'userInformation',
      key: 'userInformation',
      width: '10%',
      render: (text: any, record: any, _index: any) => {
        return (
          <>
            <div style={{ textAlign: 'left' }}>{record?.userInfor?.fullName}</div>
          </>
        );
      },
    },
    {
      title: ' ',
      dataIndex: 'action',
      key: 'action',
      width: '1%',
      align: 'center' as const,
      render: (text: any, record: any, _index: any) => {
        return (
          <Space>
            <Tooltip title={t('IDS_VIEW')} placement="top">
              <Button
                icon={<EyeOutlined />}
                style={{ color: '#007240' }}
                onClick={() => {
                  setOpenViewIssueRelated(true);
                  setDeteleRecord(record);
                }}
              />
            </Tooltip>
            {role === 'systemAdmin' && (
              <Tooltip title={t('IDS_DELETE')} placement="top">
                <Button
                  icon={<DeleteOutlined />}
                  style={{ color: '#007240' }}
                  onClick={() => {
                    setOpenModal(true);
                    setDeteleRecord(record);
                  }}
                />
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  const handleOKPopupConfirm = async () => {
    await httpAxios.Put(`/api/v1/f9/system-admin/delete-issue-related`, deteleRecord).then((res) => {
      if (res && res.status === 200) {
        message.success(t('IDS_DELETE_ISSUE_RELATED_SUCCESS'));
        setOpenModal(false);
        loadData();
      }
    });
  };

  return (
    <div>
      <Card>
        <Typography.Title level={5}>{t('IDS_RELATED_FEEDBACKS')}</Typography.Title>
        {role === 'systemAdmin' && (
          <Row>
            <Space size={'large'}>
              <MainButton
                type="primary"
                name="Search"
                value="txt_evaluation_search"
                style={{ marginBottom: '10px' }}
                onClick={() => setIsOpenAddRelatedPopup(true)}
              >
                {t('IDS_BUTTON_ADD')}
              </MainButton>
            </Space>
          </Row>
        )}

        <Table
          dataSource={issuesRelated}
          columns={columns}
          pagination={false}
          bordered
          locale={{
            emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
          }}
        />
      </Card>
      <ModalCustomComponent
        isOpen={isOpenModal}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('IDS_DELETE_ISSUE_RELATED')}
        fnHandleOk={handleOKPopupConfirm}
        fnHandleCancel={() => {
          setOpenModal(!isOpenModal);
        }}
        okText={t('IDS_DELETE') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
        loading={props.isLoading}
      />

      <ViewIssueRelated record={deteleRecord} isOpen={isOpenViewIssueRelated} setOpen={setOpenViewIssueRelated} />

      <AddRelatedFeedbacksPopup
        originalFeedbackId={feedbackInfo.feedbackDetail.id}
        isOpen={isOpenAddRelatedPopup}
        onCancel={() => setIsOpenAddRelatedPopup(false)}
        onAddSuccess={() => {
          setIsOpenAddRelatedPopup(false);
          props.onAddSuccess();
        }}
      />
    </div>
  );
};
export default IssuesRelated;
