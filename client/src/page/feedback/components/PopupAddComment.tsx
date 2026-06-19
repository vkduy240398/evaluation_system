import { Avatar, Button, Card, Form, message, Modal, Timeline, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { TimelineItemProps } from 'antd/lib';
import { t } from 'i18next';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { CiUser } from 'react-icons/ci';
import { RiAdminLine } from 'react-icons/ri';
import { from, map } from 'rxjs';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import feedbackApiService from '../../../common/api/feedback';
import { Comment, TypeAddComment } from '../types/typeAddComment';
import DisplayCommentContent from './DisplayCommentContent';

interface Props {
  typeAddComment: TypeAddComment | null;
  setTypeAddComment: Dispatch<SetStateAction<TypeAddComment | null>>;
  listComments: Comment[] | undefined; // MH System Admin - Add comment to all related issues không có data
  feedbackId: number;
  getFeedbackInfo: () => Promise<void>;
  setLoadingComment: Dispatch<SetStateAction<boolean>>;
  updatedTime: string;
}

const PopupAddComment = ({
  typeAddComment,
  setTypeAddComment,
  listComments,
  feedbackId,
  getFeedbackInfo,
  setLoadingComment,
  updatedTime,
}: Props) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [types, setType] = useState({
    type: '',
    content: <></>,
    textButton: '',
    open: false,
  });

  useEffect(() => {
    if (typeAddComment === null) {
      form.resetFields();
    }
  }, [typeAddComment]);

  const handleFormSubmit = () => {
    switch (typeAddComment) {
      case TypeAddComment.TO_ONLY_ISSUE_USER:
        setType({
          open: true,
          content: <>{t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_ADD_COMMENT')}</>,
          textButton: t('IDS_BUTTON_ADD_COMMENT'),
          type: TypeAddComment.TO_ONLY_ISSUE_USER,
        });
        break;
      case TypeAddComment.TO_ONLY_ISSUE_SA:
        setType({
          open: true,
          content: <>{t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_ADD_COMMENT')}</>,
          textButton: t('IDS_BUTTON_ADD_COMMENT'),
          type: TypeAddComment.TO_ONLY_ISSUE_SA,
        });
        break;
      case TypeAddComment.TO_ALL_ISSUES_RELATED:
        setType({
          open: true,
          content: <>{t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_ADD_COMMENT_ALL_RELATED')}</>,
          textButton: t('IDS_BUTTON_ADD_COMMENT'),
          type: TypeAddComment.TO_ALL_ISSUES_RELATED,
        });
        break;
    }
  };

  const callBack = async (data: any) => {
    if (data.code === 200) {
      message.success(t('MESSAGE.SCREEN.DETAIL_FEEDBACK.IDM_ADD_COMMENT_SUCCESSFULLY'));
    }
    getFeedbackInfo();
    setType({
      ...types,
      open: false,
    });
    form.resetFields();
  };

  const errorCallback = () => {
    setIsLoading(false);
  };

  const handleAddComment = async () => {
    const content = form.getFieldValue('comment');

    const data = {
      content,
      feedbackId: feedbackId,
      updatedTime,
    };

    setIsLoading(true);
    setLoadingComment(true);
    switch (typeAddComment) {
      case TypeAddComment.TO_ONLY_ISSUE_USER:
        await feedbackApiService.userAddComment(data, callBack, errorCallback);
        break;
      case TypeAddComment.TO_ONLY_ISSUE_SA:
        await feedbackApiService.systemAdminAddComment(data, callBack, errorCallback);
        break;
      case TypeAddComment.TO_ALL_ISSUES_RELATED:
        await feedbackApiService.systemAdminAddCommentAllRelated(data, callBack, errorCallback);
        break;
    }
    setIsLoading(false);
    setLoadingComment(false);
  };

  const processingData = () => {
    const results: TimelineItemProps[] = [];
    from(listComments || [])
      .pipe(
        map((el: Comment) => {
          return {
            dot: el.userInfor.isSystemAdmin ? (
              <Avatar
                size="small"
                icon={<RiAdminLine style={{ color: '#D32F2F', marginTop: 4 }} />}
                style={{ backgroundColor: '#FFD5D0' }}
              />
            ) : (
              <Avatar
                size="small"
                icon={<CiUser style={{ color: '#388E3C', fontSize: 15, marginTop: 3 }} />}
                style={{ backgroundColor: '#C8E6C9' }}
              />
            ),
            children: (
              <>{/* <DisplayCommentContent key={el.id} el={el} role="user" getFeedbackInfo={getFeedbackInfo} />, */}</>
            ),
          };
        }),
      )
      .subscribe((el) => results.push(el));

    return results;
  };

  return (
    <div>
      <Modal
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', maxWidth: 'calc(100vw - 50px)' }}
        title={<Typography.Title level={4}>{t('POPUP_DIALOG.TITLE.ADD_COMMENT')}</Typography.Title>}
        open={typeAddComment !== null}
        footer={null}
        style={{ top: 20 }}
        width="90%"
        maskClosable={false}
        onCancel={() => setTypeAddComment(null)}
      >
        {typeAddComment === TypeAddComment.TO_ALL_ISSUES_RELATED ? (
          <></>
        ) : (
          <Card style={{ marginBottom: 20 }}>
            <div style={{ minHeight: '200px', maxHeight: '500px', overflow: 'auto' }}>
              {listComments && listComments.length > 0 ? (
                <Timeline style={{ marginTop: 10, marginLeft: 7 }} items={processingData()} />
              ) : (
                <span style={{ opacity: '25%' }}>{t('MESSAGE.COMMON.IDM_EMPTY_DATA')}</span>
              )}
            </div>
          </Card>
        )}

        <Form
          name="add_comment_form"
          initialValues={{ division: t('IDS_ALL'), department: t('IDS_ALL') }}
          colon={false}
          labelCol={{ span: 1 }}
          style={{ width: '100%', marginTop: 10 }}
          layout="horizontal"
          labelAlign="left"
          form={form}
          onFinish={handleFormSubmit}
          requiredMark={false}
        >
          <Form.Item
            label={<span>{t('IDS_COMMENT_CONTENT')}</span>}
            colon={false}
            name="comment"
            initialValue={''}
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
            <TextArea rows={4} autoSize={{ minRows: 4, maxRows: 4 }} maxLength={201} style={{ width: '500px' }} />
          </Form.Item>
          <Button
            htmlType="submit"
            className="main_button"
            type="primary"
            name="add_comment"
            value="txt_add_comment"
            style={{ marginTop: 15 }}
            loading={isLoading}
          >
            {t('IDS_BUTTON_ADD_COMMENT')}
          </Button>
        </Form>
      </Modal>
      <ModalCustomComponent
        isOpen={types.open}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={types.content}
        fnHandleOk={handleAddComment}
        fnHandleCancel={() => {
          setType({
            ...types,
            open: false,
          });
        }}
        okText={types.textButton}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
        loading={isLoading}
      />
    </div>
  );
};

export default PopupAddComment;
