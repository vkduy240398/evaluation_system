import { FC, useState } from 'react';
import Form from 'antd/lib/form';
import { Select } from 'antd/lib';
import { Cascader, Col, Radio, Row, Space, Tooltip } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/es/upload';
import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import useForm from 'antd/es/form/hooks/useForm';
import TextArea from 'antd/es/input/TextArea';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
import Upload from 'antd/lib/upload/Upload';
import { t } from 'i18next';
import feedbackApiService from '../../../common/api/feedback';
import { FeedbackCreateForm } from '../../../model/Feedback';
import EmptyComponent from '../../../common/EmptyComponent';
import { getListExceptRoleByUser, getListKeyExceptRole, optionsTargetScreens } from '../../../common/targetScreen';
import { useAuth } from '../../../hooks/useAuth';

const SUBJECT_MAX_LENGTH = 1000;
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

const CreateFeedbackForm: FC = () => {
  const [form] = useForm<FeedbackCreateForm>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();

  const listRoles = getListExceptRoleByUser(user?.roles, 'user');

  const handleSubmit = async (newFeedback: FeedbackCreateForm) => {
    const formData = new FormData();
    formData.append('roles', JSON.stringify(newFeedback.roles));
    formData.append('type', newFeedback.type.toString());
    formData.append('phase', newFeedback.phase.toString());
    newFeedback.features && formData.append('features', JSON.stringify(newFeedback.features));
    formData.append('summary', newFeedback.summary);
    formData.append('detail', newFeedback.detail);
    newFeedback.files?.fileList.forEach((f) => formData.append('files', f.originFileObj as RcFile));

    setIsLoading(true);
    await feedbackApiService.createFeedback(
      formData,
      (_added) => {
        setIsLoading(false);
        form.resetFields();
        message.success(t('MESSAGE.COMMON.IDM_ADD_FEEDBACK_SUCCESS'));
      },
      () => setIsLoading(false),
    );
  };

  return (
    <Form
      labelCol={{ span: 1 }}
      labelAlign="left"
      requiredMark={false}
      colon={false}
      form={form}
      onFinish={handleSubmit}
    >
      <Form.Item
        label={t('IDS_ROLE')}
        name="roles"
        rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM').toString() }]}
      >
        <Select
          style={{ width: '250px' }}
          size="small"
          options={((): { value: number; label: string }[] => {
            const options = Object.entries(t('IDL_LIST_ROLE', { returnObjects: true })).map(([key, value]) => ({
              value: +key,
              label: value,
            }));
            const temp = options[5];
            options[5] = options[6];
            options[6] = temp;

            return options.filter((item) => !listRoles.includes(item.value));
          })()}
          mode="multiple"
          notFoundContent={<EmptyComponent />}
          disabled={isLoading}
        />
      </Form.Item>
      <Form.Item
        name="type"
        label={t('IDS_TYPE_FEEDBACK')}
        rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM').toString() }]}
      >
        <Radio.Group
          options={Object.entries(t('IDS_TYPE_FEEDBACK_OPTIONS', { returnObjects: true }))
            .map(([k, v]) => ({
              label: v,
              value: +k,
            }))
            .sort((o1, o2) => (o1.value === 0 ? 1 : o2.value === 0 ? -1 : o1.value - o2.value))}
          disabled={isLoading}
        />
      </Form.Item>
      <Form.Item
        name="phase"
        label={t('IDS_PHASE_FEEDBACK')}
        rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM').toString() }]}
      >
        <Radio.Group
          options={Object.entries(t('IDS_PHASE_FEEDBACK_OPTIONS', { returnObjects: true }))
            .map(([k, v]) => ({
              label: v,
              value: +k,
            }))
            .sort((o1, o2) => (o1.value === 0 ? 1 : o2.value === 0 ? -1 : o1.value - o2.value))}
          disabled={isLoading}
        />
      </Form.Item>
      <Form.Item
        name="features"
        label={t('IDS_TARGET_SCREEN')}
        rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM').toString() }]}
      >
        <Cascader
          style={{ width: '400px' }}
          size="small"
          options={optionsTargetScreens(getListKeyExceptRole(user?.roles, 'user'))}
          multiple={true}
          showSearch={true}
          displayRender={(labels) => {
            return `${labels[labels.length - 1]}${labels.length > 1 ? `（${t(labels[0])}）` : ''}`;
          }}
          disabled={isLoading}
        />
      </Form.Item>
      <Form.Item
        label={
          <Row>
            <Col>{t('IDS_ISSUE_OVERVIEW')}</Col>
            <Col>
              <Tooltip
                title={t('IDS_TOOLTIP_FEEDBACK_SUMMARY')}
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
          </Row>
        }
        name="summary"
        rules={[
          { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
          {
            max: SUBJECT_MAX_LENGTH,
            message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', SUBJECT_MAX_LENGTH.toString()),
          },
        ]}
      >
        <TextArea disabled={isLoading} autoSize={{ minRows: 2 }} maxLength={SUBJECT_MAX_LENGTH + 1} />
      </Form.Item>
      <Form.Item
        name="detail"
        label={t('IDS_FEEDBACK_DETAIL')}
        rules={[
          { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
          {
            max: DESCRIPTION_MAX_LENGTH,
            message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', DESCRIPTION_MAX_LENGTH.toString()),
          },
        ]}
      >
        <TextArea disabled={isLoading} autoSize={{ minRows: 4 }} maxLength={DESCRIPTION_MAX_LENGTH + 1} />
      </Form.Item>
      <Form.Item
        name="files"
        label={
          <Row>
            <Col>{t('IDS_FILE_ATTACHES')}</Col>
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
          </Row>
        }
        wrapperCol={{ span: 10 }}
        rules={[
          {
            validator: (_, value: UploadChangeParam) => {
              if (!value) return Promise.resolve();
              if (value.fileList.length > 10)
                return Promise.reject(
                  t('MESSAGE.COMMON.IDM_UPLOAD_MAX_QUANTITY').replace('{0}', UPLOAD_MAX_QUANTITY.toString()),
                );
              if (value.fileList.reduce((sum, file) => sum + (file.size ?? 0), 0) > UPLOAD_MAX_TOTAL_SIZE)
                return Promise.reject(t('MESSAGE.COMMON.IDM_UPLOAD_MAX_TOTAL_SIZE').replace('{0}', '30MB'));
              if (value.fileList.some((file) => !acceptedTypes.includes(file.type ?? ''))) {
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
        <Upload
          disabled={isLoading}
          accept={acceptedTypes.join()}
          multiple
          maxCount={UPLOAD_MAX_QUANTITY + 1}
          beforeUpload={() => false}
          style={{ width: 10 }}
        >
          <Button icon={<UploadOutlined />}>{t('IDS_UPLOAD')}</Button>
        </Upload>
      </Form.Item>
      <Space>
        <Button type="primary" htmlType="submit" loading={isLoading} style={{ marginTop: 10 }}>
          {t('IDS_BUTTON_SEND')}
        </Button>
      </Space>
    </Form>
  );
};

export default CreateFeedbackForm;
