/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { Col, Input, Row, Tooltip, Typography } from 'antd';
import { validatePrivateComment, validateTarget } from './valildateInputField';
import { t } from 'i18next';
import { CommentContent, EvaluatorInfo } from '../interfaces/response.interface';
import Icon, { InfoCircleOutlined } from '@ant-design/icons';
interface Props {
  status: number;
  role: string;
  commentData: CommentContent;
  listEvalutor: EvaluatorInfo[];
  setCommentData: (data: CommentContent) => void;
  allowSeeList: EvaluatorInfo[];
  maxOrder: string;
  Form: any;
  form: any;
  isDisable: boolean;
  isEvaluationDate: boolean;
  store: any;
  isReview?: boolean;
  typeReview?: number;
  isLoading?: boolean;
  location: any;
}

// eslint-disable-next-line complexity
const EvaluationComment: React.FC<Props> = (props: Props) => {
  const { TextArea } = Input;
  const {
    isLoading,
    commentData,
    allowSeeList,
    maxOrder,
    listEvalutor,
    form,
    Form,
    isDisable,
    isEvaluationDate,
    role,
    store,
    isReview = false,
    typeReview = 0,
    location,
  } = props;
  const { Item } = Form;
  const comment05Info = listEvalutor.filter((item: any) => {
    return item.evaluationOrder === '0.5';
  });
  const comment1Info = listEvalutor.filter((item: any) => {
    return item.evaluationOrder === '1.0';
  });
  const comment2Info = listEvalutor.filter((item: any) => {
    return item.evaluationOrder === '2.0';
  });
  let isDisplay05: boolean = role === 'admin' && comment05Info?.length > 0;
  let isDisplay1: boolean = role === 'admin' && comment1Info?.length > 0;
  let isDisplay2: boolean = role === 'admin' && comment2Info?.length > 0;
  allowSeeList.forEach((item: any) => {
    if (item.evaluationOrder === '0.5') isDisplay05 = true;
    if (item.evaluationOrder === '1.0') isDisplay1 = true;
    if (item.evaluationOrder === '2.0') isDisplay2 = true;
  });

  // if (location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 0.5 && comment05Info.length > 0) {
  //   isDisplay05 = true;
  // }
  // if (location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 1 && comment1Info.length > 0) {
  //   isDisplay1 = true;
  // }
  // if (location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 2 && comment2Info.length > 0) {
  //   isDisplay2 = true;
  // }

  return (
    <>
      <>
        {' '}
        {props.role !== 'user' && (
          <Typography.Title level={4} style={{ paddingBottom: 5 }}>
            {t('IDS_COMMENT_PUBLIC')}
          </Typography.Title>
        )}
        <Form
          form={form}
          colon={false}
          labelAlign="left"
          initialValues={{
            commentUser: commentData?.commentUser,
            publicCommentAdmin05: comment05Info[0]?.commentPublic,
            publicCommentAdmin1: comment1Info[0]?.commentPublic,
            publicCommentAdmin2: comment2Info[0]?.commentPublic,
            privateCommentAdmin05: comment05Info[0]?.commentPrivate,
            privateCommentAdmin1: comment1Info[0]?.commentPrivate,
            privateCommentAdmin2: comment2Info[0]?.commentPrivate,
          }}
        >
          <Item labelCol={{ span: 24 }} style={{ paddingBottom: 6 }}>
            <Typography>
              <b>{t('IDS_COMMENT_USER')}</b>
            </Typography>
            {![50, 51, 52].includes(props.status) ||
            props.role === 'admin' ||
            props.role === 'evaluator' ||
            !isEvaluationDate ||
            store.isDisable ? (
              <Typography>{commentData.commentUser || t('MESSAGE.COMMON.IDM_EMPTY_DATA')}</Typography>
            ) : (
              <Form.Item
                name="commentUser"
                rules={[
                  {
                    validator(_rule: any, value: string) {
                      return validateTarget(value, 2000);
                    },
                  },
                ]}
                initialValue={commentData.commentUser}
              >
                <TextArea
                  maxLength={2001}
                  autoSize={{ minRows: 1, maxRows: 100 }}
                  disabled={
                    ![50, 51, 52].includes(props.status) ||
                    props.role === 'admin' ||
                    props.role === 'evaluator' ||
                    isDisable ||
                    isLoading
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    commentData['commentUser'] = value;
                  }}
                />
              </Form.Item>
            )}
          </Item>
          {((props.role !== 'user' && isDisplay05 && props.status > 53) ||
            (props.status === 100 && comment05Info[0])) && (
            <Item labelCol={{ span: 24 }} style={{ paddingBottom: 6 }}>
              <Typography>
                <b>{t('IDS_COMMENT_EVALUATOR_0_5')}</b>
              </Typography>
              {!(maxOrder === '0.5' && [54, 55].includes(props.status)) ||
              !isEvaluationDate ||
              props.role === 'admin' ||
              store.isDisable ? (
                <Typography>{comment05Info[0]?.commentPublic || t('MESSAGE.COMMON.IDM_EMPTY_DATA')}</Typography>
              ) : (
                <Form.Item
                  name="publicCommentAdmin05"
                  rules={[
                    {
                      validator(_rule: any, value: string) {
                        return validateTarget(value, 2000);
                      },
                    },
                  ]}
                  initialValue={comment05Info[0]?.commentPublic}
                >
                  <TextArea
                    maxLength={2001}
                    autoSize={{ minRows: 1, maxRows: 100 }}
                    disabled={!(maxOrder === '0.5' && [54, 55].includes(props.status)) || isDisable || isLoading}
                    onChange={(e) => {
                      const value = e.target.value;
                      commentData['publicCommentAdmin05'] = value;
                    }}
                  />
                </Form.Item>
              )}
            </Item>
          )}
          {((props.role !== 'user' && isDisplay1 && props.status > 56) ||
            (props.status === 100 && comment1Info[0])) && (
            <Item labelCol={{ span: 24 }} style={{ paddingBottom: 6 }}>
              <Typography>
                <b>{t('IDS_COMMENT_EVALUATOR_1')}</b>
              </Typography>
              {!(maxOrder === '1.0' && [57, 58].includes(props.status)) ||
              !isEvaluationDate ||
              props.role === 'admin' ||
              store.isDisable ? (
                <Typography>{comment1Info[0]?.commentPublic || t('MESSAGE.COMMON.IDM_EMPTY_DATA')}</Typography>
              ) : (
                <Form.Item
                  name="publicCommentAdmin1"
                  rules={[
                    {
                      validator(_rule: any, value: string) {
                        return validateTarget(value, 2000);
                      },
                    },
                  ]}
                  initialValue={comment1Info[0]?.commentPublic}
                >
                  <TextArea
                    maxLength={2001}
                    autoSize={{ minRows: 1, maxRows: 100 }}
                    disabled={!(maxOrder === '1.0' && [57, 58].includes(props.status)) || isDisable || isLoading}
                    onChange={(e) => {
                      const value = e.target.value;
                      commentData['publicCommentAdmin1'] = value;
                    }}
                  />
                </Form.Item>
              )}
            </Item>
          )}
          {((props.role !== 'user' && isDisplay2 && props.status > 59) ||
            (props.status === 100 && comment2Info[0])) && (
            <Item labelCol={{ span: 24 }} style={{ paddingBottom: 6 }}>
              <Typography>
                <b>{t('IDS_COMMENT_EVALUATOR_2')}</b>
              </Typography>
              {!(maxOrder === '2.0' && [60, 61].includes(props.status)) ||
              !isEvaluationDate ||
              props.role === 'admin' ||
              store.isDisable ? (
                <Typography>{comment2Info[0]?.commentPublic || t('MESSAGE.COMMON.IDM_EMPTY_DATA')}</Typography>
              ) : (
                <Form.Item
                  name="publicCommentAdmin2"
                  rules={[
                    {
                      validator(_rule: any, value: string) {
                        return validateTarget(value, 2000);
                      },
                    },
                  ]}
                  initialValue={comment2Info[0]?.commentPublic}
                >
                  <TextArea
                    maxLength={2001}
                    autoSize={{ minRows: 1, maxRows: 100 }}
                    disabled={!(maxOrder === '2.0' && [60, 61].includes(props.status)) || isDisable || isLoading}
                    onChange={(e) => {
                      const value = e.target.value;
                      commentData['publicCommentAdmin2'] = value;
                    }}
                  />
                </Form.Item>
              )}
            </Item>
          )}

          {((props.role === 'evaluator' && !location.evaluatorOrderExcep) ||
            props.role === 'admin' ||
            (isReview && typeReview === 6)) &&
            props.status > 53 && (
              <div>
                <Row>
                  <Col>
                    <Typography.Title level={4} style={{ paddingBottom: 5, paddingTop: 10 }}>
                      {t('IDS_COMMENT_PRIVATE')}
                    </Typography.Title>
                  </Col>
                  <Col>
                    <Tooltip
                      title={t('IDS_TOOLTIP_PRIVATE_COMMENT_EXPLAINATION')}
                      color="#424242"
                      overlayInnerStyle={{ fontSize: '11px' }}
                    >
                      <Icon
                        component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                        style={{
                          color: '#6e5b14',
                          fontSize: 18,
                          marginLeft: '7px',
                          marginTop: 16,
                          cursor: 'default',
                        }}
                      />
                    </Tooltip>
                  </Col>
                </Row>
                {isDisplay05 && props.status > 53 && (
                  <Item labelCol={{ span: 24 }} style={{ paddingBottom: 6 }}>
                    <Typography>
                      <b>{t('IDS_COMMENT_EVALUATOR_0_5')}</b>
                    </Typography>
                    {!(maxOrder === '0.5' && [54, 55].includes(props.status)) ||
                    !isEvaluationDate ||
                    props.role === 'admin' ||
                    store.isDisable ? (
                      <Typography>{comment05Info[0]?.commentPrivate || t('MESSAGE.COMMON.IDM_EMPTY_DATA')}</Typography>
                    ) : (
                      <Form.Item
                        name="privateCommentAdmin05"
                        rules={[
                          {
                            validator(_rule: any, value: string) {
                              return validatePrivateComment(value, 2000);
                            },
                            require: false,
                          },
                        ]}
                        initialValue={comment05Info[0]?.commentPrivate}
                      >
                        <TextArea
                          maxLength={2001}
                          autoSize={{ minRows: 1, maxRows: 100 }}
                          disabled={!(maxOrder === '0.5' && [54, 55].includes(props.status)) || isDisable || isLoading}
                          onChange={(e) => {
                            const value = e.target.value;
                            commentData['privateCommentAdmin05'] = value;
                          }}
                        />
                      </Form.Item>
                    )}
                  </Item>
                )}
                {isDisplay1 && props.status > 56 && (
                  <Item labelCol={{ span: 24 }} style={{ paddingBottom: 6 }}>
                    <Typography>
                      <b>{t('IDS_COMMENT_EVALUATOR_1')}</b>
                    </Typography>
                    {!(maxOrder === '1.0' && [57, 58].includes(props.status)) ||
                    !isEvaluationDate ||
                    props.role === 'admin' ||
                    store.isDisable ? (
                      <Typography>{comment1Info[0]?.commentPrivate || t('MESSAGE.COMMON.IDM_EMPTY_DATA')}</Typography>
                    ) : (
                      <Form.Item
                        name="privateCommentAdmin1"
                        rules={[
                          {
                            validator(_rule: any, value: string) {
                              return validatePrivateComment(value, 2000);
                            },
                            require: false,
                          },
                        ]}
                        initialValue={comment1Info[0]?.commentPrivate}
                      >
                        <TextArea
                          maxLength={2001}
                          autoSize={{ minRows: 1, maxRows: 100 }}
                          disabled={!(maxOrder === '1.0' && [57, 58].includes(props.status)) || isDisable || isLoading}
                          onChange={(e) => {
                            const value = e.target.value;
                            commentData['privateCommentAdmin1'] = value;
                          }}
                        />
                      </Form.Item>
                    )}
                  </Item>
                )}
                {isDisplay2 && props.status > 59 && (
                  <Item labelCol={{ span: 24 }} style={{ paddingBottom: 6 }}>
                    <Typography>
                      <b>{t('IDS_COMMENT_EVALUATOR_2')}</b>
                    </Typography>
                    {!(maxOrder === '2.0' && [60, 61].includes(props.status)) ||
                    !isEvaluationDate ||
                    props.role === 'admin' ||
                    store.isDisable ? (
                      <Typography>{comment2Info[0]?.commentPrivate || t('MESSAGE.COMMON.IDM_EMPTY_DATA')}</Typography>
                    ) : (
                      <Form.Item
                        name="privateCommentAdmin2"
                        rules={[
                          {
                            validator(_rule: any, value: string) {
                              return validatePrivateComment(value, 2000);
                            },
                            require: false,
                          },
                        ]}
                        initialValue={comment2Info[0]?.commentPrivate}
                      >
                        <TextArea
                          maxLength={2001}
                          autoSize={{ minRows: 1, maxRows: 100 }}
                          disabled={!(maxOrder === '2.0' && [60, 61].includes(props.status)) || isDisable || isLoading}
                          onChange={(e) => {
                            const value = e.target.value;
                            commentData['privateCommentAdmin2'] = value;
                          }}
                        />
                      </Form.Item>
                    )}
                  </Item>
                )}
              </div>
            )}
        </Form>
      </>
    </>
  );
};

export default EvaluationComment;
