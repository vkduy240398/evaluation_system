import { CaretUpOutlined, FileOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, Input, MenuProps, message, Select, Skeleton, Tag, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { t } from 'i18next';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import feedbackApiService from '../../../common/api/feedback';
import { FeedbackDetail, FeedbackStatus, FeedbackType } from '../../../model/Feedback';
import { setStatusColorFeedback, urlCompanyCode } from '../../../common/util';

const DetailFeedback = () => {
  const location = useLocation();
  const [form] = useForm();
  const state = location.state;
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDownload, setIsLoadingDownload] = useState(false);
  const [record, setRecord] = useState<FeedbackDetail | undefined>();
  const [isOpenModalUpdateStatus, setIsOpenModalUpdateStatus] = useState<boolean>(false);
  const [isOpenModalSave, setIsOpenModalSave] = useState<boolean>(false);
  const [statusUpdate, setStatusUpdate] = useState<FeedbackStatus>();

  const handleClickStatusItem = async (status: FeedbackStatus) => {
    await form
      .validateFields()
      .then(() => {
        setStatusUpdate(status);
        setIsOpenModalUpdateStatus(true);
      })
      .catch(() => {});
  };

  const callbackUpdate = async () => {
    message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));
    feedbackApiService.detailFeedback(state?.id, callback, errorCallback);
  };

  const errorCallbackUpdate = () => {
    setIsLoading(false);
  };

  const handleUpdateStatus = () => {
    setIsLoading(true);
    const subject = form.getFieldValue('subject');
    const typeFeedback = form.getFieldValue('typeFeedback');
    const description = form.getFieldValue('description');

    const data = {
      subject: subject,
      type: typeFeedback,
      status: statusUpdate,
      description: description,
      id: state?.id,
      updatedTime: record?.updated_time,
    };

    feedbackApiService.updateFeedback(data, callbackUpdate, errorCallbackUpdate);
    setIsOpenModalUpdateStatus(false);
  };

  const handleSaveButtonClick = () => {
    form
      .validateFields()
      .then(() => {
        setIsOpenModalSave(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSave = () => {
    setIsLoading(true);
    const subject = form.getFieldValue('subject');
    const typeFeedback = form.getFieldValue('typeFeedback');
    const description = form.getFieldValue('description');

    const data = {
      subject: subject,
      type: typeFeedback,
      description: description,
      id: state?.id,
      updatedTime: record?.updated_time,
    };

    feedbackApiService.updateFeedback(data, callbackUpdate, errorCallbackUpdate);
    setIsOpenModalSave(false);
  };

  const displayStatus = (record: FeedbackDetail | undefined) => {
    let status = '';
    switch (record?.status) {
      case FeedbackStatus.SAVE_DRAFT:
        status = t('IDS_STATUS_OPTIONS.IDS_SAVE_DRAFT');
        break;
      case FeedbackStatus.SUBMIT:
        status = t('IDS_STATUS_OPTIONS.IDS_SUBMIT');
        break;
      case FeedbackStatus.APPROVAL:
        status = t('IDS_STATUS_OPTIONS.IDS_APPROVE');
        break;
      case FeedbackStatus.PENDING:
        status = t('IDS_STATUS_OPTIONS.IDS_PENDING');
        break;
      case FeedbackStatus.CLOSE:
        status = t('IDS_STATUS_OPTIONS.IDS_CLOSE');
        break;
      case FeedbackStatus.IN_PROGRESS:
        status = t('IDS_STATUS_OPTIONS.IDS_IN_PROGRESS');
        break;
      case FeedbackStatus.DONE:
        status = t('IDS_STATUS_OPTIONS.IDS_DONE');
        break;
    }

    return status;
  };

  const itemsStatus: MenuProps['items'] | any = [
    {
      key: `${t('IDS_STATUS_OPTIONS.IDS_SUBMIT')}`,
      label: `${t('IDS_STATUS_OPTIONS.IDS_SUBMIT')}`,
      onClick() {
        handleClickStatusItem(FeedbackStatus.SUBMIT);
      },
    },
    {
      key: `${t('IDS_STATUS_OPTIONS.IDS_APPROVE')}`,
      label: `${t('IDS_STATUS_OPTIONS.IDS_APPROVE')}`,
      onClick() {
        handleClickStatusItem(FeedbackStatus.APPROVAL);
      },
    },
    {
      key: `${t('IDS_STATUS_OPTIONS.IDS_PENDING')}`,
      label: `${t('IDS_STATUS_OPTIONS.IDS_PENDING')}`,
      onClick() {
        handleClickStatusItem(FeedbackStatus.PENDING);
      },
    },
    {
      key: `${t('IDS_STATUS_OPTIONS.IDS_CLOSE')}`,
      label: `${t('IDS_STATUS_OPTIONS.IDS_CLOSE')}`,
      onClick() {
        handleClickStatusItem(FeedbackStatus.CLOSE);
      },
    },
    {
      key: `${t('IDS_STATUS_OPTIONS.IDS_IN_PROGRESS')}`,
      label: `${t('IDS_STATUS_OPTIONS.IDS_IN_PROGRESS')}`,
      onClick() {
        handleClickStatusItem(FeedbackStatus.IN_PROGRESS);
      },
    },
    {
      key: `${t('IDS_STATUS_OPTIONS.IDS_DONE')}`,
      label: `${t('IDS_STATUS_OPTIONS.IDS_DONE')}`,
      onClick() {
        handleClickStatusItem(FeedbackStatus.DONE);
      },
    },
  ].filter((item) => {
    return item.label !== displayStatus(record);
  });

  const displayDepartment = (record: FeedbackDetail | undefined) => {
    if (record === undefined) {
      return '';
    } else if (record?.level < 8) {
      return record?.department_name;
    } else if (record?.level >= 8) {
      return record?.division_name;
    }
  };

  const displayTypeFeedback = (record: FeedbackDetail) => {
    if (record?.type === FeedbackType.BUG) {
      return t('IDS_TYPE_FEEDBACK_OPTIONS.IDS_BUG');
    } else if (record?.type === FeedbackType.REQUEST) {
      return t('IDS_TYPE_FEEDBACK_OPTIONS.IDS_REQUIREMENT');
    } else {
      return '';
    }
  };

  const callbackDownloadFile = (data: any) => {
    if (data.name != '') {
      const byteArray = new Uint8Array(data.data.data);
      const blob = new Blob([byteArray], { type: data.contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${data.name}`); // Specify the download filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  const displayAttachFiles = (record: FeedbackDetail | undefined) => {
    if (record?.attach_files === undefined || record?.attach_files === null || record?.attach_files === '') {
      return <>{t('MESSAGE.COMMON.IDM_EMPTY_DATA')}</>;
    } else {
      const listFileNames: string[] = record?.attach_files.split('|');

      const handleDownloadFile = async (id: number, fileName: string) => {
        const params = {
          id: id,
          fileName: fileName,
        };
        setIsLoadingDownload(true);
        feedbackApiService.downloadFileFeedback(params, callbackDownloadFile, setIsLoadingDownload);
      };

      return (
        <>
          {listFileNames.map((fileName) => {
            return (
              <Button
                loading={isLoadingDownload}
                key={fileName}
                style={{ marginRight: 5 }}
                onClick={() => handleDownloadFile(record?.id, fileName)}
              >
                <FileOutlined />
                {fileName}
              </Button>
            );
          })}
        </>
      );
    }
  };

  const callback = (data: any) => {
    setRecord(data);
    form.setFieldValue('subject', data?.subject);
    form.setFieldValue('typeFeedback', data?.type);
    form.setFieldValue('description', data?.description);
    setIsLoading(false);
  };

  const errorCallback = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    if (!state) {
      navigate(urlCompanyCode() + '/admin-evaluation/list-feedback');
    } else {
      setIsLoading(true);
      feedbackApiService.detailFeedback(state?.id, callback, errorCallback);
      navigate(location.pathname, {
        replace: true,
        state: {
          id: location.state?.id,
          currentTab: 'basic',
        },
      });
    }
  }, []);

  return (
    <>
      <Typography.Title level={3}>{t('IDS_DETAIL_FEEDBACK')}</Typography.Title>
      {isLoading ? (
        <Skeleton active />
      ) : (
        <Form
          form={form}
          labelAlign="left"
          labelCol={{ span: 1 }}
          colon={false}
          requiredMark={false}
          style={{ position: 'relative' }}
          onFinish={() => {}}
        >
          <Form.Item label={t('IDS_STATUS')} colon={false} name={'status'} style={{ marginTop: 5 }}>
            <Tag color={setStatusColorFeedback(record?.status)}>{displayStatus(record)}</Tag>
          </Form.Item>
          <Form.Item label={t('IDS_USER')} colon={false} name={'user'} style={{ marginTop: 5 }}>
            {`${record?.employee_number}: ${record?.full_name}`}
          </Form.Item>
          <Form.Item label={t('IDS_DEPARTMENT')} colon={false} name={'department'} style={{ marginTop: 5 }}>
            {displayDepartment(record)}
          </Form.Item>
          <Form.Item label={t('IDS_TIME_CREATED')} colon={false} name={'timeCreated'} style={{ marginTop: 5 }}>
            {moment(record?.send_time).format('YYYY/M/D H:mm')}
          </Form.Item>
          <Form.Item label={t('IDS_TYPE_FEEDBACK')} colon={false} name={'typeFeedback'} style={{ marginTop: 5 }}>
            {record?.status === FeedbackStatus.SUBMIT ? (
              <>{displayTypeFeedback(record)}</>
            ) : (
              <>
                <Select
                  allowClear={false}
                  style={{ width: '200px' }}
                  size="small"
                  loading={isLoading}
                  options={[
                    { label: t('IDS_TYPE_FEEDBACK_OPTIONS.IDS_BUG'), value: 1 },
                    { label: t('IDS_TYPE_FEEDBACK_OPTIONS.IDS_REQUIREMENT'), value: 0 },
                  ]}
                  clearIcon={false}
                />
              </>
            )}
          </Form.Item>
          <Form.Item
            label={t('IDS_SUBJECT')}
            colon={false}
            name={'subject'}
            style={{ marginTop: 5 }}
            rules={[
              { type: 'string' },
              { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string },
              { max: 200, message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '200') as string },
            ]}
          >
            {record?.status === FeedbackStatus.SUBMIT ? (
              <>
                <TextArea style={{ width: '90%' }} autoSize={{ minRows: 1 }} disabled>
                  {record?.subject}
                </TextArea>
              </>
            ) : (
              <>
                <Input style={{ width: '90%' }} maxLength={201} />
              </>
            )}
          </Form.Item>
          <Form.Item
            label={t('IDS_CONTENT')}
            colon={false}
            name={'description'}
            style={{ marginTop: 5 }}
            rules={[
              { type: 'string' },
              { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string },
              { max: 5000, message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '5000') as string },
            ]}
          >
            {record?.status === FeedbackStatus.SUBMIT ? (
              <TextArea style={{ width: '90%' }} autoSize={{ minRows: 4 }} disabled>
                {record?.description}
              </TextArea>
            ) : (
              <>
                <TextArea style={{ width: '90%' }} autoSize={{ minRows: 4 }} maxLength={5001} />
              </>
            )}
          </Form.Item>
          <Form.Item label={t('IDS_ATTACH')} colon={false} name={'attach_files'} style={{ marginTop: 5 }}>
            {displayAttachFiles(record)}
          </Form.Item>
          <Form.Item>
            <Dropdown trigger={['click']} menu={{ items: itemsStatus }} placement="topLeft">
              <Button
                loading={isLoading}
                className="button-normal"
                type="primary"
                size="middle"
                style={{ marginTop: 10 }}
              >
                {t('IDS_STATUS_UPDATE')}
                <CaretUpOutlined style={{ fontSize: 18 }} />
              </Button>
            </Dropdown>
            {record?.status !== FeedbackStatus.SUBMIT && (
              <>
                <Button
                  loading={isLoading}
                  className="button-normal"
                  type="primary"
                  size="middle"
                  style={{ marginTop: 10, marginLeft: 10 }}
                  onClick={handleSaveButtonClick}
                >
                  {t('IDS_BUTTON_SAVE')}
                </Button>
              </>
            )}
            <Button
              loading={isLoading}
              className="button-normal"
              size="middle"
              style={{ marginTop: 10, marginLeft: 10 }}
              onClick={() => {
                navigate(-1);
              }}
            >
              {t('IDS_BUTTON_CANCEL')}
            </Button>
          </Form.Item>
        </Form>
      )}

      {/* modal save */}
      <ModalCustomComponent
        isOpen={isOpenModalSave}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SAVE')}
        fnHandleOk={handleSave}
        fnHandleCancel={() => {
          setIsOpenModalSave(false);
        }}
        okText={t('IDS_BUTTON_SAVE') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
        loading={isLoading}
      />

      <ModalCustomComponent
        isOpen={isOpenModalUpdateStatus}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SAVE')}
        fnHandleOk={handleUpdateStatus}
        fnHandleCancel={() => {
          setIsOpenModalUpdateStatus(false);
        }}
        okText={t('IDS_BUTTON_SAVE') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
        loading={isLoading}
      />
    </>
  );
};

export default DetailFeedback;
