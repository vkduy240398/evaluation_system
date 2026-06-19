import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Form, message, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { t } from 'i18next';
import moment from 'moment';
import { Dispatch, memo, SetStateAction, useEffect, useState } from 'react';
import feedbackApiService from '../../../common/api/feedback';
import { CancelButton } from '../../../common/MainButton';
import { useAuth } from '../../../hooks/useAuth';
import { Comment } from '../types/typeAddComment';
import ModalCustomComponent from '../../../@core/components/modal-custom';

interface Props {
  el: Comment;
  role: string; // 'user' | 'admin' | 'systemAdmin'
  getFeedbackInfo: () => Promise<void>;
  commentEditing: number | null;
  setCommentEditing: Dispatch<SetStateAction<number | null>>;
  isDisplayEditAndDelete: boolean;
  isLoadingComment: boolean;
  setLoadingComment: Dispatch<SetStateAction<boolean>>;
}

const DisplayCommentContent = ({
  el,
  role,
  getFeedbackInfo,
  commentEditing,
  setCommentEditing,
  isDisplayEditAndDelete,
  isLoadingComment,
  setLoadingComment,
}: Props) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [isHover, setIsHover] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (commentEditing === null) {
      form.resetFields();
    } else {
      form.setFieldValue(`editComment${el.id}`, el.content);
    }
  }, [commentEditing]);

  const displayByRole = (role: string) => {
    return role === 'user' || role === 'systemAdmin';
  };

  const editCallBack = async (data: any) => {
    if (data.code === 200) {
      message.success(t('MESSAGE.SCREEN.DETAIL_FEEDBACK.IDM_EDIT_COMMENT_SUCCESSFULLY'));
    }
    getFeedbackInfo();
    setIsOpen(false);
    form.resetFields();
    setCommentEditing(null);
  };

  const setLoadingAll = (loading: boolean) => {
    setIsLoading(loading);
    setLoadingComment(loading);
  };

  const errorEditCallback = () => {
    setLoadingAll(false);
  };

  const deleteCallBack = async (data: any) => {
    if (data.code === 200) {
      message.success(t('MESSAGE.SCREEN.DETAIL_FEEDBACK.IDM_DELETE_COMMENT_SUCCESSFULLY'));
    }
    getFeedbackInfo();
    form.resetFields();
    setCommentEditing(null);
    setIsOpen(false);
  };

  const errorDeleteCallback = () => {
    setLoadingAll(false);
  };

  const handleConfirmed = async () => {
    const content = form.getFieldValue(`editComment${el.id}`);

    const data = {
      content: content,
      commentId: el.id,
      updatedTime: el.updatedTime,
    };

    setLoadingAll(true);
    if (role === 'user') {
      await feedbackApiService.userEditComment(data, editCallBack, errorEditCallback);
    } else if (role === 'systemAdmin') {
      await feedbackApiService.systemAdminEditComment(data, editCallBack, errorEditCallback);
    }
    setLoadingAll(false);
  };

  const handleDelete = async () => {
    const data = {
      commentId: el.id,
      updatedTime: el.updatedTime,
    };

    setLoadingAll(true);
    if (role === 'user') {
      await feedbackApiService.userDeleteComment(data, deleteCallBack, errorDeleteCallback);
    } else if (role === 'systemAdmin') {
      await feedbackApiService.systemAdminDeleteComment(data, deleteCallBack, errorDeleteCallback);
    }
    setLoadingAll(false);
  };

  const displayEditable = () => {
    if (commentEditing === null) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <EditOutlined
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setCommentEditing(el.id);
            }}
          />
          <DeleteOutlined
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setIsOpen(true);
            }}
          />
        </div>
      );
    } else {
      return <></>;
    }
  };

  const displayContent = (commentEditing: number | null) => {
    if (el?.active === 0) {
      return (
        <div>{<div style={{ whiteSpace: 'pre-wrap', opacity: '0.5' }}>{t('IDS_COMMENT_DELETE_CONTENT')}</div>}</div>
      );
    } else if (commentEditing !== el.id) {
      return <div>{el?.content ? <div style={{ whiteSpace: 'pre-wrap' }}>{el?.content}</div> : null}</div>;
    } else {
      return (
        <div>
          <Form
            name="edit_comment_form"
            initialValues={{ division: t('IDS_ALL'), department: t('IDS_ALL') }}
            colon={false}
            style={{ width: '100%', marginTop: 10 }}
            layout="horizontal"
            labelAlign="left"
            form={form}
            onFinish={handleConfirmed}
            requiredMark={false}
          >
            <Form.Item
              colon={false}
              name={`editComment${el.id}`}
              rules={[
                {
                  validator: async (_, value) => {
                    if (value === null || value === '')
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                    if (value.toString().length > 200)
                      return Promise.reject(
                        new Error(t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '200')),
                      );
                  },
                },
              ]}
            >
              <TextArea autoSize={{ minRows: 1, maxRows: 4 }} maxLength={201} style={{ width: '500px' }} />
            </Form.Item>
            <Space
              size={'middle'}
              style={{
                marginTop: 10,
              }}
            >
              <Button
                htmlType="submit"
                className="main_button"
                type="primary"
                name="edit_comment"
                value="txt_edit_comment"
                loading={isLoadingComment || isLoading}
              >
                {t('IDS_BUTTON_SAVE')}
              </Button>
              <CancelButton
                onClick={() => {
                  setCommentEditing(null);
                  setIsHover(false);
                }}
                loading={isLoadingComment || isLoading}
              >
                {t('IDS_BUTTON_CANCEL')}
              </CancelButton>
            </Space>
          </Form>
        </div>
      );
    }
  };

  const isDisplayComponentEditable =
    isDisplayEditAndDelete &&
    displayByRole(role) &&
    el.active === 1 &&
    el.userInfor.id === user?.id &&
    commentEditing === null;

  return (
    <div
      onMouseEnter={() => {
        isDisplayComponentEditable && setIsHover(true);
      }}
      onMouseLeave={() => {
        isDisplayComponentEditable && setIsHover(false);
      }}
    >
      <div style={{ fontSize: 10, display: 'flex', gap: 10 }}>
        {el.userInfor?.fullName}　{moment(el?.createTime).format('YYYY/M/D H:mm')}
        {isDisplayComponentEditable && isHover && displayEditable()}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{displayContent(commentEditing)}</div>
      <ModalCustomComponent
        isOpen={isOpen}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_DELETE_COMMENT')}
        fnHandleOk={handleDelete}
        fnHandleCancel={() => {
          setIsOpen(false);
          setIsHover(false);
        }}
        okText={t('IDS_DELETE') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
        loading={isLoading}
      />
    </div>
  );
};

export default memo(DisplayCommentContent);
