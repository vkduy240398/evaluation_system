/* eslint-disable @typescript-eslint/naming-convention */
import { Button, Col, FormInstance, Row, Tooltip } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { Dispatch, startTransition } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { t } from 'i18next';
import { EvaluationPersonalAchievement, EvaluatorInfo, UserInfo } from '../interfaces/response.interface';
import ButtonSaveType from './buttonSaveType';
import ButtonApproveRejectType from './buttonApproveRejectType';
import Typography from 'antd/lib/typography';
import Icon, { InfoCircleOutlined } from '@ant-design/icons';
import { encrypt, urlCompanyCode } from '../../../../common/util';

interface Props {
  handleSaveDraft: () => void;
  handleSubmit: () => void;
  handleApprove: () => void;
  dataSource: EvaluationPersonalAchievement[];
  status: number;
  role: string;
  evaluationId: number;
  handleReject: () => void;
  listEvalutor: EvaluatorInfo[];
  Form: any;
  form: FormInstance;
  setApproveRejectContent: (data: string) => string;
  setSelectedOrder: (data: string) => string;
  isLoading: boolean;
  isEvaluationDate: boolean;
  isGoalDate: boolean;
  userInfo: UserInfo;
  isAffixed: boolean;
  isReject: boolean;
  setReject: React.Dispatch<React.SetStateAction<boolean>>;
  isReview?: boolean;
  typeReview?: number;
  evaluatorOrderExcep?: number;
}
const ButtonComponent: React.FC<any> = (props: Props) => {
  const {
    role,
    status,
    handleSaveDraft,
    handleSubmit,
    handleApprove,
    evaluationId,
    handleReject,
    listEvalutor,
    Form,
    form,
    setApproveRejectContent,
    setSelectedOrder,
    isLoading,
    isEvaluationDate,
    isGoalDate,
    userInfo,
    isAffixed,
    isReject,
    setReject,
    isReview,
    typeReview = 0,
    evaluatorOrderExcep,
  } = props;
  const store = useSelector((state: RootState) => state.calculateTotal);

  return (
    <div className={isAffixed ? 'evaluation-sider-affixed' : 'evaluation-sider'}>
      <Form form={form}>
        {!store.isDisable && (
          <Col xs={24} md={24}>
            {props.role === 'evaluator' &&
              (store.hasMode1 || store.hasMode2 || store.hasMode3) &&
              (([3, 4, 5, 6, 7, 8].includes(status) && isGoalDate) ||
                ([53, 56, 59, 54, 55, 57, 58, 60, 61].includes(status) && isEvaluationDate)) && (
                <>
                  <Form.Item
                    name={'reject'}
                    style={{ marginBottom: '5px' }}
                    label={
                      <Row>
                        <Typography>{t('IDS_TITLE_REJECT')}</Typography>
                        <Tooltip title={t('IDS_TOOLTIP_REJECT')} overlayInnerStyle={{ fontSize: '12px' }}>
                          <Icon
                            component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                            style={{ cursor: 'default', paddingLeft: 4 }}
                          />
                        </Tooltip>
                      </Row>
                    }
                    labelCol={{
                      span: 24,
                      style: {
                        fontWeight: 500,
                      },
                    }}
                    rules={[
                      {
                        max: 500,
                        message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '500'),
                      },
                      isReject
                        ? {
                            required: true,
                            message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string,
                          }
                        : {},
                    ]}
                    required={false}
                    initialValue={''}
                  >
                    <TextArea
                      maxLength={501}
                      autoSize={{ maxRows: 2 }}
                      onChange={(e) =>
                        startTransition(() => {
                          setApproveRejectContent(e.target.value);
                        })
                      }
                    />
                  </Form.Item>
                </>
              )}
          </Col>
        )}

        <Row style={{ paddingBottom: 2 }}>
          {!isReview && (
            <>
              <ButtonSaveType
                role={role}
                status={status}
                handleSaveDraft={handleSaveDraft}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                isEvaluationDate={isEvaluationDate}
                isGoalDate={isGoalDate}
              />
              <ButtonApproveRejectType
                role={role}
                status={status}
                handleApprove={handleApprove}
                handleReject={handleReject}
                listEvalutor={listEvalutor}
                Form={Form}
                form={form}
                setApproveRejectContent={setApproveRejectContent}
                setSelectedOrder={setSelectedOrder}
                isLoading={isLoading}
                isEvaluationDate={isEvaluationDate}
                isGoalDate={isGoalDate}
                userInfo={userInfo}
                isAffixed={isAffixed}
                setReject={setReject}
              />
            </>
          )}

          <Col
            style={{
              marginLeft: 'auto',
            }}
          >
            {isReview ? (
              [2, 5, 6].includes(typeReview) ? (
                <Button
                  style={{ marginRight: 8 }}
                  className="button-normal"
                  type="primary"
                  size="middle"
                  onClick={() =>
                    window.open(
                      urlCompanyCode() +
                        '/' +
                        window.location.pathname.split('/')[3] +
                        `/evaluation/${evaluationId}/approval-history?isReview=${isReview}&typeReview=${encrypt(
                          typeReview.toString(),
                        )}`,
                      '_blank',
                    )
                  }
                >
                  {t('IDS_HISTORY_APPROVE')}
                </Button>
              ) : (
                <></>
              )
            ) : (
              <>
                <Button
                  style={{ marginRight: 8 }}
                  className="button-normal"
                  type="primary"
                  size="middle"
                  onClick={() =>
                    window.open(
                      urlCompanyCode() +
                        '/' +
                        window.location.pathname.split('/')[3] +
                        `/evaluation/${evaluationId}/approval-history${
                          evaluatorOrderExcep ? `?order=${encrypt(evaluatorOrderExcep.toString())}` : ''
                        }`,
                      '_blank',
                    )
                  }
                >
                  {t('IDS_HISTORY_APPROVE')}
                </Button>

                <Button
                  className="button-normal"
                  type="primary"
                  size="middle"
                  onClick={() =>
                    window.open(
                      urlCompanyCode() +
                        '/' +
                        window.location.pathname.split('/')[3] +
                        '/evaluation-description/' +
                        evaluationId,
                      '_blank',
                    )
                  }
                >
                  {t('IDS_EVALUATION_CRITERIA')}
                </Button>
              </>
            )}
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default ButtonComponent;
