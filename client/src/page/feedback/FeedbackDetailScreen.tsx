import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import feedbackApiService from '../../common/api/feedback';
import { Feedback } from '../../model/Feedback';
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Skeleton,
  Space,
  Tag,
  Tooltip,
  Typography,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import { t } from 'i18next';
import { FileOutlined, InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { CancelButton } from '../../common/MainButton';
import TextArea from 'antd/es/input/TextArea';
import ModalCustomComponent from '../../@core/components/modal-custom';
import { setStatusColorFeedback, urlCompanyCode } from '../../common/util';

const SUBJECT_MAX_LENGTH = 200;
const DESCRIPTION_MAX_LENGTH = 5000;
const UPLOAD_MAX_QUANTITY = 10;
const UPLOAD_MAX_TOTAL_SIZE = 30 * 1024 * 1024; // 30 MB
const acceptedTypes = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
];

const FeedbackDetailScreen: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [feedback, setFeedback] = useState<Feedback | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const navigates = useNavigate();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [listFilesDeleted, setListFilesDeleted] = useState<any>([]);
  const [isLoadingDownload, setIsLoadingDownload] = useState(false);

  const callback = (data: any) => {
    setFeedback(data);
    form.setFieldValue('subject', data?.subject);
    form.setFieldValue('description', data?.description);

    if (!data?.attachFiles) {
      return <></>;
    }

    const listFileNames: string[] = data?.attachFiles.split('|');
    const listFiles: any = [];
    for (let i = 0; i < listFileNames.length; i++) {
      listFiles.push({
        uid: i.toString(),
        name: listFileNames[i],
        status: 'done',
      });
    }
    setListFilesDeleted([]);
    setFileList(listFiles);
  };

  const setInfoEdit = () => {
    setIsEdit(true);
    form.setFieldValue('type', feedback?.type);
    form.setFieldValue('subject', feedback?.subject);
    form.setFieldValue('description', feedback?.description);
    const listFileNames: any = feedback?.attachFiles?.split('|');
    const listFiles: any = [];

    for (let i = 0; i < listFileNames?.length; i++) {
      if (listFileNames[i]) {
        listFiles.push({
          uid: i.toString(),
          name: listFileNames[i],
          status: 'done',
        });
      }
    }

    setFileList(listFiles);
  };

  const AttachedButtons = () => {
    if (!feedback?.attachFiles) {
      return <></>;
    }

    const listFileNames: string[] = feedback?.attachFiles.split('|');

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

    const handleDownloadFile = async (fileName: string) => {
      const params = {
        id: location.state.id,
        fileName: fileName,
      };

      setIsLoadingDownload(true);
      await feedbackApiService.downloadFileFeedback(params, callbackDownloadFile, setIsLoadingDownload);
    };

    return (
      <>
        {listFileNames.map((fileName) => {
          return (
            <Button
              loading={isLoadingDownload}
              key={fileName}
              style={{ marginRight: 5 }}
              onClick={() => handleDownloadFile(fileName)}
            >
              <FileOutlined />
              {fileName}
            </Button>
          );
        })}
      </>
    );
  };

  let listFileTemps = [];
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // Filter out files with duplicate names
    const uniqueFileList = newFileList.filter(
      (file: any) => !fileList.some((existingFile) => existingFile.name === file.name),
    );

    const totalFiles = [...fileList, ...uniqueFileList];
    if (listFileTemps.length !== totalFiles.length) {
      listFileTemps = [...totalFiles];

      // Update the state with unique files
      setFileList((prevFileList) => [...prevFileList, ...uniqueFileList]);
    }
  };

  const handleRemove = (file: any) => {
    // Cập nhật lại fileList khi xóa
    setFileList((prevFileList) => prevFileList.filter((item) => item.uid !== file.uid));
    if (file.name) {
      setListFilesDeleted((prevList: any) => [...prevList, file.name]);
    }
  };

  useEffect(() => {
    if (!location.state?.id) {
      navigate(urlCompanyCode() + '/feedback');
    } else {
      feedbackApiService.getUserFeedback(location.state.id, callback, () => {});
    }
  }, []);

  const callbackUpdate = async () => {
    setIsLoading(true);
    message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));
    await feedbackApiService.getUserFeedback(location.state.id, callback, () => {});
  };

  const errorCallbackUpdate = () => {};

  const handleUpdateStatus = async () => {
    const valueFiles = form.getFieldValue('attach');
    const formData = new FormData();
    formData.append('id', location.state.id);
    formData.append('subject', form.getFieldValue('subject'));
    formData.append('type', form.getFieldValue('type'));
    formData.append('description', form.getFieldValue('description'));
    formData.append('attachFiles', fileList.map((item) => item.name).join('|'));
    formData.append('updatedTime', feedback?.updatedTime || '');
    valueFiles?.fileList.forEach((f: any) => {
      // Check if f.originFileObj is defined before appending
      if (f.originFileObj) {
        formData.append('files', f.originFileObj); // Append the file to FormData
      }
    });
    listFilesDeleted?.forEach((file: string) => {
      formData.append('listFilesDeleted[]', file);
    });

    await feedbackApiService.updateFeedback(formData, callbackUpdate, errorCallbackUpdate);
    setIsOpenModal(false);
    setIsLoading(false);
    setIsEdit(false);
  };

  return (
    <div>
      <Typography.Title level={3}>{t('IDS_DETAIL_FEEDBACK')}</Typography.Title>
      {!feedback || isLoading ? (
        <Skeleton active />
      ) : (
        <Form
          form={form}
          labelAlign="left"
          labelCol={{ span: 1 }}
          colon={false}
          requiredMark={false}

          // style={{ position: 'relative' }}
        >
          <Form.Item label={t('IDS_STATUS')} name={'status'}>
            <Tag color={setStatusColorFeedback(feedback.status)}>
              {Object.values(t('IDS_STATUS_OPTIONS', { returnObjects: true }))[feedback.status - 1]}
            </Tag>
          </Form.Item>
          <Form.Item label={t('IDS_TIME_CREATED')} name={'sendTime'}>
            {feedback.sendTime}
          </Form.Item>
          <Form.Item
            label={t('IDS_TYPE_FEEDBACK')}
            name={'type'}
            rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() }]}
          >
            {isEdit ? (
              <Select
                allowClear={false}
                style={{ width: '200px' }}
                size="small"
                options={[
                  { label: t('IDS_TYPE_FEEDBACK_OPTIONS.IDS_BUG'), value: 1 },
                  { label: t('IDS_TYPE_FEEDBACK_OPTIONS.IDS_REQUIREMENT'), value: 0 },
                ]}
                clearIcon={false}
              />
            ) : (
              Object.values(t('IDS_TYPE_FEEDBACK_OPTIONS', { returnObjects: true }))[feedback.type]
            )}
          </Form.Item>
          <Form.Item
            label={t('IDS_SUBJECT')}
            name={'subject'}
            rules={[
              { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
              {
                max: SUBJECT_MAX_LENGTH,
                message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', SUBJECT_MAX_LENGTH.toString()),
              },
            ]}
          >
            {isEdit ? (
              <Input style={{ width: '90%' }} maxLength={SUBJECT_MAX_LENGTH + 1} />
            ) : (
              <>
                <TextArea style={{ width: '90%' }} autoSize={{ minRows: 1 }} disabled>
                  {feedback?.subject}
                </TextArea>
              </>
            )}
          </Form.Item>
          <Form.Item
            label={t('IDS_CONTENT')}
            name={'description'}
            rules={[
              { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
              {
                max: DESCRIPTION_MAX_LENGTH,
                message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace(
                  '{maxLength}',
                  DESCRIPTION_MAX_LENGTH.toString(),
                ),
              },
            ]}
          >
            {isEdit ? (
              <TextArea style={{ width: '90%' }} autoSize={{ minRows: 4 }} maxLength={DESCRIPTION_MAX_LENGTH + 1} />
            ) : (
              <TextArea style={{ width: '90%' }} autoSize={{ minRows: 4 }} disabled>
                {feedback?.description}
              </TextArea>
            )}
          </Form.Item>
          <Form.Item
            label={
              <Row>
                <Col>{t('IDS_ATTACH')}</Col>
                {isEdit && (
                  <Col>
                    <Tooltip
                      title={t('IDS_TOOLTIP_FEEDBACK_UPLOAD')}
                      color="#424242"
                      overlayInnerStyle={{ fontSize: '11px' }}
                    >
                      <InfoCircleOutlined
                        style={{
                          color: '#6e5b14',
                          fontSize: 18,
                          marginLeft: '7px',
                          marginTop: 2,
                          cursor: 'default',
                        }}
                      />
                    </Tooltip>
                  </Col>
                )}
              </Row>
            }
            name={'attach'}
            wrapperCol={{ span: isEdit ? 9 : undefined }}
            rules={[
              {
                validator: () => {
                  if (fileList.length > 10)
                    return Promise.reject(
                      t('MESSAGE.COMMON.IDM_UPLOAD_MAX_QUANTITY').replace('{0}', UPLOAD_MAX_QUANTITY.toString()),
                    );
                  if (fileList.reduce((sum, file) => sum + (file.size ?? 0), 0) > UPLOAD_MAX_TOTAL_SIZE)
                    return Promise.reject(t('MESSAGE.COMMON.IDM_UPLOAD_MAX_TOTAL_SIZE').replace('{0}', '30MB'));
                  if (fileList.some((file) => file.status != 'done' && !acceptedTypes.includes(file.type ?? ''))) {
                    const errorMessage = (
                      <>
                        {t('MESSAGE.COMMON.IDM_NOT_ACCEPTED_FILE_TYPES')
                          .split('\n')
                          .map((line, index) => (
                            <span key={index}>
                              {line}
                              <br />
                            </span>
                          ))}
                      </>
                    );

                    return Promise.reject(errorMessage);
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            {isEdit ? (
              <Upload
                beforeUpload={() => {
                  return false;
                }}
                accept={acceptedTypes.join()}
                multiple
                // style={{ col: 10 }}
                fileList={fileList}
                onChange={handleChange}
                onRemove={handleRemove}
                maxCount={UPLOAD_MAX_QUANTITY + 1}
              >
                <Button icon={<UploadOutlined />}>{t('IDS_UPLOAD')}</Button>
              </Upload>
            ) : (
              AttachedButtons()
            )}
          </Form.Item>

          <Space
            size={'middle'}
            style={{
              marginTop: 10,
            }}
          >
            {feedback.status === 2 && (
              <Form.Item style={{ margin: 0 }}>
                <Button
                  type="primary"
                  name="Search"
                  value="txt_evaluation_search"
                  onClick={() =>
                    !isEdit
                      ? setInfoEdit()
                      : (async () => {
                          try {
                            await form.validateFields();
                            setIsOpenModal(true);
                          } catch (_) {
                            /* empty */
                          }
                        })()
                  }
                >
                  {isEdit ? t('IDS_BUTTON_SAVE') : t('IDS_EDIT')}
                </Button>
              </Form.Item>
            )}

            <CancelButton
              onClick={() => {
                if (isEdit) {
                  setIsEdit(false);
                  form.resetFields();
                } else {
                  navigates(-1);
                }
              }}
            >
              {t('IDS_BUTTON_CANCEL')}
            </CancelButton>
          </Space>
        </Form>
      )}
      <ModalCustomComponent
        isOpen={isOpenModal}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SAVE')}
        fnHandleOk={handleUpdateStatus}
        fnHandleCancel={() => {
          setIsOpenModal(false);
        }}
        okText={t('IDS_BUTTON_SAVE') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
        loading={isLoading}
      />
    </div>
  );
};

export default FeedbackDetailScreen;
