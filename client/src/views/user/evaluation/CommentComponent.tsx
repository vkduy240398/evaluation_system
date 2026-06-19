import { Tooltip } from 'antd';
import Form from 'antd/es/form';
import TextArea from 'antd/es/input/TextArea';
import Typography from 'antd/es/typography';
import Icon, { InfoCircleOutlined } from '@ant-design/icons';

import { t } from 'i18next';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

interface Props {
  isEditUserEvaluation: boolean;

  // ** evaluator 0.5
  isDisplayEvaluator05: boolean;
  isEditEvaluation05: boolean;

  // ** evaluator 1.0
  isDisplayEvaluator1: boolean;
  isEditEvaluation1: boolean;

  // ** evaluator 2.0
  isDisplayEvaluator2: boolean;
  isEditEvaluation2: boolean;

  evaluatorOrder: number;
  evaluatorOrderList: number[];

  // ** Is f6
  isF5?: boolean;

  //Is F1
  isEvaluatorUser?: boolean;
  isReview?: boolean;
  typeReview?: number;
  isLoading: boolean | undefined;
}
const CommentComponent: FC<Props> = ({
  isEditUserEvaluation,
  isDisplayEvaluator05,
  isEditEvaluation05,
  isDisplayEvaluator1,
  isEditEvaluation1,

  // ** evaluator 2.0
  isDisplayEvaluator2,
  isEditEvaluation2,

  evaluatorOrder,
  evaluatorOrderList,

  isF5,

  isEvaluatorUser,
  isReview,
  typeReview,
}) => {
  const { Item } = Form;
  const storeLoading = useSelector((state: RootState) => state.loading);

  const handlePrivateDisplay = (orders: number[]) =>
    (orders.includes(Number(evaluatorOrder)) && !isReview) || isF5 || (isReview && typeReview === 6);

  return (
    <>
      <>
        {/* Header Tab */}
        {!isEvaluatorUser && (
          <Typography.Title level={4} style={{ paddingBottom: 5 }}>
            {t('IDS_COMMENT_PUBLIC')}
          </Typography.Title>
        )}
        {/* Comment form */}
        <Item labelCol={{ span: 24 }} dependencies={['commentUser']} style={{ marginBottom: 12 }}>
          {(f) => (
            <>
              <Typography>
                <b>{t('IDS_COMMENT_USER')}</b>
              </Typography>

              {isEditUserEvaluation ? (
                <Form.Item
                  name={'commentUser'}
                  rules={[
                    { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string },
                    {
                      max: 2000,
                      message: (t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER') as string).replace('{maxLength}', '2000'),
                    },
                  ]}
                  style={{ margin: 0 }}
                >
                  <TextArea
                    autoSize={{ minRows: 1, maxRows: 100 }}
                    maxLength={2001}
                    disabled={storeLoading.isDetailLoading}
                  />
                </Form.Item>
              ) : (
                <Typography style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                  {f.getFieldValue('commentUser')?.length > 0
                    ? f.getFieldValue('commentUser')
                    : t('MESSAGE.COMMON.IDM_EMPTY_DATA')}
                </Typography>
              )}
            </>
          )}
        </Item>
        {isDisplayEvaluator05 && evaluatorOrderList.includes(0.5) && (
          <Item labelCol={{ span: 24 }} dependencies={['comment05Public']} style={{ marginBottom: 12 }}>
            {(f) => (
              <>
                <Typography>
                  <b>{t('IDS_COMMENT_EVALUATOR_0_5')}</b>
                </Typography>
                {isEditEvaluation05 ? (
                  <Form.Item
                    name={'comment05Public'}
                    rules={[
                      { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string },
                      {
                        max: 2000,
                        message: (t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER') as string).replace('{maxLength}', '2000'),
                      },
                    ]}
                    style={{ margin: 0 }}
                  >
                    <TextArea
                      disabled={storeLoading.isDetailLoading}
                      autoSize={{ minRows: 1, maxRows: 100 }}
                      maxLength={2001}
                    />
                  </Form.Item>
                ) : (
                  <Typography style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                    {f.getFieldValue('comment05Public')?.length > 0
                      ? f.getFieldValue('comment05Public')
                      : t('MESSAGE.COMMON.IDM_EMPTY_DATA')}
                  </Typography>
                )}
              </>
            )}
          </Item>
        )}
        {isDisplayEvaluator1 && evaluatorOrderList.includes(1) && (
          <Item labelCol={{ span: 24 }} dependencies={['comment1Public']} style={{ marginBottom: 12 }}>
            {(f) => (
              <>
                <Typography>
                  <b>{t('IDS_COMMENT_EVALUATOR_1')}</b>
                </Typography>
                {isEditEvaluation1 ? (
                  <Form.Item
                    name={'comment1Public'}
                    rules={[
                      { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string },
                      {
                        max: 2000,
                        message: (t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER') as string).replace('{maxLength}', '2000'),
                      },
                    ]}
                    style={{ margin: 0 }}
                  >
                    <TextArea
                      disabled={storeLoading.isDetailLoading}
                      autoSize={{ minRows: 1, maxRows: 100 }}
                      maxLength={2001}
                    />
                  </Form.Item>
                ) : (
                  <Typography style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                    {f.getFieldValue('comment1Public')?.length > 0
                      ? f.getFieldValue('comment1Public')
                      : t('MESSAGE.COMMON.IDM_EMPTY_DATA')}
                  </Typography>
                )}
              </>
            )}
          </Item>
        )}
        {isDisplayEvaluator2 && evaluatorOrderList.includes(2) && (
          <Item labelCol={{ span: 24 }} dependencies={['comment2Public']} style={{ marginBottom: 12 }}>
            {(f) => (
              <>
                <Typography>
                  <b>{t('IDS_COMMENT_EVALUATOR_2')}</b>
                </Typography>
                {isEditEvaluation2 ? (
                  <Form.Item
                    name={'comment2Public'}
                    rules={[
                      { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string },
                      {
                        max: 2000,
                        message: (t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER') as string).replace('{maxLength}', '2000'),
                      },
                    ]}
                    style={{ margin: 0 }}
                  >
                    <TextArea
                      disabled={storeLoading.isDetailLoading}
                      autoSize={{ minRows: 1, maxRows: 100 }}
                      maxLength={2001}
                    />
                  </Form.Item>
                ) : (
                  <Typography style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                    {f.getFieldValue('comment2Public')?.length > 0
                      ? f.getFieldValue('comment2Public')
                      : t('MESSAGE.COMMON.IDM_EMPTY_DATA')}
                  </Typography>
                )}
              </>
            )}
          </Item>
        )}
        {/* Header Tab */}
        {(isDisplayEvaluator05 || isDisplayEvaluator1 || isDisplayEvaluator2) && handlePrivateDisplay([0.5, 1, 2]) && (
          <Typography.Title level={4} style={{ paddingBottom: 5, paddingTop: 7 }}>
            <span>{t('IDS_COMMENT_PRIVATE')}</span>
            <Tooltip
              title={t('IDS_TOOLTIP_PRIVATE_COMMENT_EXPLAINATION')}
              color="#424242"
              overlayInnerStyle={{ fontSize: '11px' }}
            >
              <Icon
                component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                style={{ color: '#6e5b14', fontSize: 18, marginLeft: '7px', marginTop: 7, cursor: 'default' }}
              />
            </Tooltip>
          </Typography.Title>
        )}
        {isDisplayEvaluator05 && handlePrivateDisplay([0.5, 1, 2]) && evaluatorOrderList.includes(0.5) && (
          <Item labelCol={{ span: 24 }} dependencies={['comment05Private']} style={{ marginBottom: 12 }}>
            {(f) => (
              <>
                <Typography>
                  <b>{t('IDS_COMMENT_EVALUATOR_0_5')}</b>
                </Typography>
                {isEditEvaluation05 ? (
                  <Form.Item
                    name={'comment05Private'}
                    rules={[
                      {
                        max: 2000,
                        message: (t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER') as string).replace('{maxLength}', '2000'),
                      },
                    ]}
                  >
                    <TextArea
                      disabled={storeLoading.isDetailLoading}
                      autoSize={{ minRows: 1, maxRows: 100 }}
                      maxLength={2001}
                    />
                  </Form.Item>
                ) : (
                  <Typography style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                    {f.getFieldValue('comment05Private')?.length > 0
                      ? f.getFieldValue('comment05Private')
                      : t('MESSAGE.COMMON.IDM_EMPTY_DATA')}
                  </Typography>
                )}
              </>
            )}
          </Item>
        )}
        {isDisplayEvaluator1 && handlePrivateDisplay([1, 2]) && evaluatorOrderList.includes(1) && (
          <Item labelCol={{ span: 24 }} dependencies={['comment1Private']} style={{ marginBottom: 12 }}>
            {(f) => (
              <>
                <Typography>
                  <b>{t('IDS_COMMENT_EVALUATOR_1')}</b>
                </Typography>
                {isEditEvaluation1 ? (
                  <Form.Item
                    name={'comment1Private'}
                    rules={[
                      {
                        max: 2000,
                        message: (t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER') as string).replace('{maxLength}', '2000'),
                      },
                    ]}
                  >
                    <TextArea
                      disabled={storeLoading.isDetailLoading}
                      autoSize={{ minRows: 1, maxRows: 100 }}
                      maxLength={2001}
                    />
                  </Form.Item>
                ) : (
                  <Typography style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                    {f.getFieldValue('comment1Private')?.length > 0
                      ? f.getFieldValue('comment1Private')
                      : t('MESSAGE.COMMON.IDM_EMPTY_DATA')}
                  </Typography>
                )}
              </>
            )}
          </Item>
        )}
        {isDisplayEvaluator2 && handlePrivateDisplay([2]) && evaluatorOrderList.includes(2) && (
          <Item labelCol={{ span: 24 }} dependencies={['comment2Private']} style={{ marginBottom: 12 }}>
            {(f) => (
              <>
                <Typography>
                  <b>{t('IDS_COMMENT_EVALUATOR_2')}</b>
                </Typography>
                {isEditEvaluation2 ? (
                  <Form.Item
                    name={'comment2Private'}
                    rules={[
                      {
                        max: 2000,
                        message: (t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER') as string).replace('{maxLength}', '2000'),
                      },
                    ]}
                  >
                    <TextArea
                      disabled={storeLoading.isDetailLoading}
                      autoSize={{ minRows: 1, maxRows: 100 }}
                      maxLength={2001}
                    />
                  </Form.Item>
                ) : (
                  <Typography style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                    {f.getFieldValue('comment2Private')?.length > 0
                      ? f.getFieldValue('comment2Private')
                      : t('MESSAGE.COMMON.IDM_EMPTY_DATA')}
                  </Typography>
                )}
              </>
            )}
          </Item>
        )}
      </>
    </>
  );
};

export default CommentComponent;
