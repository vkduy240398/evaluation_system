/* eslint-disable @typescript-eslint/no-unused-vars */
import { CaretUpOutlined, DeleteOutlined, EyeOutlined, FormOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  MenuProps,
  message,
  Row,
  Space,
  Timeline,
  TimelineItemProps,
  Tooltip,
  Typography,
} from 'antd';
import { Form } from 'antd/lib';
import { t } from 'i18next';
import moment from 'moment';
import { from, map } from 'rxjs';
import { MainButton } from '../../../../common/MainButton';
import { useState } from 'react';
import PopupAddComment from '../../../feedback/components/PopupAddComment';
import { TypeAddComment } from '../../../feedback/types/typeAddComment';
import { RiAdminLine } from 'react-icons/ri';
import { CiUser } from 'react-icons/ci';
import { useAuth } from '../../../../hooks/useAuth';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import httpAxios from '../../../../common/http';
import DisplayCommentContent from '../../../feedback/components/DisplayCommentContent';
import TextArea from 'antd/es/input/TextArea';
import feedbackApiService from '../../../../common/api/feedback';
interface Props {
  role: string;
  feedbackInfo: any;
  isLoading: boolean;
  setLoading: any;
  getFeedbackInfo: any;
  loadData: any;
}
const CommentFeedbackDetail: React.FC<Props> = (props: Props) => {
  const { role, feedbackInfo, isLoading, setLoading, loadData } = props;
  const listStatusComments = [1, 2, 4, 5];

  const [isOpenDropDown, setIsOpenDropDown] = useState<boolean>(false);

  const [isLoadingComment, setLoadingComment] = useState<boolean>(false);

  const [typeAddComment, setTypeAddComment] = useState<TypeAddComment | null>(null);

  const [form] = Form.useForm();

  const [commentEditing, setCommentEditing] = useState<number | null>(null);

  const commentFeeback = feedbackInfo?.feedbackDetail?.commentFeeback;

  const statusFeedback = feedbackInfo?.feedbackDetail?.status;

  const processingData = () => {
    const results: TimelineItemProps[] = [];
    from(commentFeeback || [])
      .pipe(
        map((el: any) => {
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
              <DisplayCommentContent
                key={el.id}
                el={el}
                role={role}
                getFeedbackInfo={props.getFeedbackInfo}
                commentEditing={commentEditing}
                setCommentEditing={setCommentEditing}
                isDisplayEditAndDelete={listStatusComments.includes(statusFeedback)}
                isLoadingComment={isLoadingComment}
                setLoadingComment={setLoadingComment}
              />
            ),
          };
        }),
      )
      .subscribe((el) => results.push(el));

    return results;
  };

  const itemsComment: MenuProps['items'] | any = [
    {
      key: `issue`,
      label: t('IDS_COMMENT_ISSUE'),
      async onClick() {
        setTypeAddComment(TypeAddComment.TO_ONLY_ISSUE_SA);
        setIsOpenDropDown(false);
        form.submit();
      },
    },
    {
      key: `issueReleted`,
      label: t('IDS_COMMENT_ISSUE_RELATED'),
      async onClick() {
        setTypeAddComment(TypeAddComment.TO_ALL_ISSUES_RELATED);
        setIsOpenDropDown(false);
        form.submit();
      },
    },
  ];

  const callBack = async (data: any) => {
    if (data.code === 200) {
      message.success(t('MESSAGE.SCREEN.DETAIL_FEEDBACK.IDM_ADD_COMMENT_SUCCESSFULLY'));
    }
    props.getFeedbackInfo();
    setCommentEditing(null);
    form.resetFields();
  };

  const errorCallback = () => {
    setLoadingComment(false);
  };

  const handleAddComment = async () => {
    const content = form.getFieldValue('comment');

    const data = {
      content,
      feedbackId: feedbackInfo?.feedbackDetail.id,
      updatedTime: feedbackInfo?.feedbackDetail.updatedTime,
    };

    setLoadingComment(true);
    if (role === 'user') {
      await feedbackApiService.userAddComment(data, callBack, errorCallback);
    } else if (role === 'systemAdmin' && typeAddComment === TypeAddComment.TO_ONLY_ISSUE_SA) {
      await feedbackApiService.systemAdminAddComment(data, callBack, errorCallback);
    } else if (role === 'systemAdmin' && typeAddComment === TypeAddComment.TO_ALL_ISSUES_RELATED) {
      await feedbackApiService.systemAdminAddCommentAllRelated(data, callBack, errorCallback);
    }
    setLoadingComment(false);
  };

  return (
    <div>
      <Card>
        <Typography.Title level={5}>{t('IDS_FEEDBACK_LIST_COMMENT')}</Typography.Title>
        <Form
          name="add_comment_form"
          initialValues={{ division: t('IDS_ALL'), department: t('IDS_ALL') }}
          colon={false}
          labelCol={{ span: 1 }}
          style={{ width: '100%', marginTop: 10, marginBottom: 15 }}
          layout="horizontal"
          labelAlign="left"
          form={form}
          onFinish={handleAddComment}
          requiredMark={false}
        >
          {(role === 'systemAdmin' || role === 'user') &&
            (role === 'user' ? (
              <>
                {listStatusComments.includes(
                  statusFeedback,
                ) /**user chỉ có thể comment khi detail feedback có status = 1, 2, 4, 5 */ && (
                  <>
                    <Form.Item
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
                      <TextArea autoSize={{ minRows: 1, maxRows: 4 }} maxLength={201} style={{ width: '500px' }} />
                    </Form.Item>

                    <Button
                      htmlType="submit"
                      className="main_button"
                      type="primary"
                      style={{ marginTop: 15 }}
                      name="add_comment"
                      value="txt_add_comment"
                      loading={isLoadingComment}
                    >
                      {t('IDS_BUTTON_ADD_COMMENT')}
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                {listStatusComments.includes(
                  statusFeedback,
                ) /**system adin chỉ có thể comment khi detail feedback có status = 1, 2, 4, 5 */ && (
                  <>
                    <Form.Item
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
                      <TextArea autoSize={{ minRows: 1, maxRows: 4 }} maxLength={201} style={{ width: '500px' }} />
                    </Form.Item>
                    <Dropdown
                      trigger={['click']}
                      menu={{ items: itemsComment }}
                      placement="topLeft"
                      open={isOpenDropDown}
                      onOpenChange={() => setIsOpenDropDown(!isOpenDropDown)}
                    >
                      <Button
                        style={{ marginTop: 10 }}
                        className="button-normal"
                        type="primary"
                        size="middle"
                        loading={isLoadingComment}
                      >
                        {t('IDS_BUTTON_ADD_COMMENT')}
                        <CaretUpOutlined />
                      </Button>
                    </Dropdown>
                  </>
                )}
              </>
            ))}
        </Form>
        {commentFeeback?.length > 0 ? (
          <Timeline style={{ paddingTop: 5 }} items={processingData()} />
        ) : (
          t('MESSAGE.COMMON.IDM_EMPTY_DATA')
        )}
      </Card>
    </div>
  );
};
export default CommentFeedbackDetail;
