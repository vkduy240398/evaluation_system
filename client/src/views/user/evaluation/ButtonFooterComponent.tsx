// ** React Imports
import { FC, useState } from 'react';

// ** Antd Imports
import Button, { ButtonProps } from 'antd/es/button';
import { Col } from 'antd/es/grid';
import Row from 'antd/es/row';
import Space from 'antd/es/space';
import Dropdown from 'antd/es/dropdown';
import Form from 'antd/es/form';
import { CaretUpOutlined, InfoCircleOutlined } from '@ant-design/icons/lib/icons';
import TextArea from 'antd/es/input/TextArea';
import { Affix, Grid, Tooltip, Typography } from 'antd';

// ** Type Imports
import type { FormInstance, MenuProps } from 'antd';
import { statusEvaluationType } from '../../../common/status';

//  ** Component Imports
import ModalCustomComponent from '../../../@core/components/modal-custom';

// ** I18 Imports
import { t } from 'i18next';

// ** Style Imports
import styled from '@emotion/styled';
import Icon from '@ant-design/icons';

type StatusRejectType = '2' | '4' | '6' | '8' | '52' | '55' | '58' | '61';

interface Props {
  handleSaveDraft: () => void;
  handleOpenSavePopup: () => void;
  isLoading: boolean | undefined;
  handleApprovalHistory: () => void;
  handleDepartmentTarget: () => void;
  handleEvaluationCriteria: () => void;
  handleRejected: (isBool: boolean) => Promise<void>;
  handleApproved: (isApproveEvaluator?: boolean) => void;
  setStatusReject: (str: StatusRejectType) => void;
  statusEvaluation: statusEvaluationType;
  isEvaluationDate: boolean;
  isCreationGoalDate: boolean;
  isEvaluatorUser: boolean;
  evaluatorOrder: number;
  evaluatorOrderList: number[];
  isNotEvaluator2: boolean;
  evaluators: string[];
  fullName: string;
  isF5?: boolean;
  form: FormInstance;
  isDisplayButton: boolean;
  isEvaluatorException: boolean;
  isReject: boolean;
  setReject: React.Dispatch<React.SetStateAction<boolean>>;
  isReview?: boolean;
  typeReview?: number;
}

const { useBreakpoint } = Grid;
const ButtonFooterComponent: FC<Props> = ({
  handleSaveDraft,
  isLoading,
  statusEvaluation,
  handleApprovalHistory,
  isEvaluationDate,
  isEvaluatorUser,
  evaluatorOrder,
  handleRejected,
  handleApproved,
  handleEvaluationCriteria,
  handleDepartmentTarget,
  evaluatorOrderList,
  isCreationGoalDate,
  isNotEvaluator2,
  evaluators,
  fullName,
  setStatusReject,
  isF5,
  handleOpenSavePopup,
  form,
  isDisplayButton,
  isEvaluatorException,
  isReject,
  setReject,
  isReview,
  typeReview = 0,
}) => {
  // ** State
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isOpenEvaluator, setOpenEvaluator] = useState<boolean>(false);
  const [isOpenApprovateGoal, setOpenApprovateGoal] = useState<boolean>(false);
  const [isOpenApprovateEvaluation, setOpenApprovateEvaluation] = useState<boolean>(false);
  const [isAffixed, setIsAffixed] = useState<boolean>();

  // ** Hook
  const { Item } = Form;
  const screens = useBreakpoint();

  // ** Functional
  const handleOpen = () => setOpen(!isOpen);
  const handleOk = async () => {
    await handleRejected(false).then(() => setOpen(false));
  };

  const handleOkEvaluator = async () => {
    await handleRejected(true).then(() => setOpenEvaluator(false));
  };

  const handleOpenRejectedGoalPopup = async () => {
    return await form
      .validateFields(['commentRejectEvaluator', 'commentReject'])
      .then(() => setOpen(true))
      .catch(() => {});
  };

  const handleOpenRejectedEvaluationPopup = async () => {
    return await form
      .validateFields(['commentRejectEvaluator', 'commentReject'])
      .then(() => setOpenEvaluator(true))
      .catch(() => {});
  };

  const findPersion = (key: string) => evaluators.find((f) => f.includes(key)) || key;

  // // ** 3, 4, 5, 7, 8, 49 must be hiden button action
  // const isHiddenButtonUser: boolean =
  //   ([3, 4, 5, 6, 7, 8, 49, 53, 54, 55, 56, 57, 58, 59, 60, 61, 98, 99, 100, 101].includes(statusEvaluation) &&
  //     isEvaluatorUser) ||
  //   isNotEvaluator2;

  // const isHiddenButtonEvaluation =
  //   [0, 1, 2, 3, 4, 5, 6, 7, 49, 50, 51, 52, 101, 53, 56, 59, 98, 99].includes(statusEvaluation) && !isEvaluatorUser;

  // const isHiddenButtonEvaluator05 =
  //   ![54, 55].includes(statusEvaluation) && Number(evaluatorOrder) === 0.5 && !isEvaluatorUser;

  // const isHiddenButtonEvaluator10 =
  //   ![57, 58].includes(statusEvaluation) && Number(evaluatorOrder) === 1 && !isEvaluatorUser;

  // const isHiddenButtonEvaluator20 =
  //   ![60, 61].includes(statusEvaluation) && Number(evaluatorOrder) === 2 && !isEvaluatorUser && isEvaluationDate;

  // // ** status 50 display 2 case : 1 is time to evaluation -- isEvaluationStart || 2 is not time to evaluation
  // const isEvaluationFinish: boolean = [50, 51, 52].includes(statusEvaluation) && !isEvaluationDate;

  const isCreationGoalFinish: boolean =
    [0, 1, 2].includes(statusEvaluation) &&
    isCreationGoalDate &&
    isEvaluatorUser &&
    !isNotEvaluator2 &&
    !isEvaluatorException;

  // ** 53, 56, 59 must be hiden button action
  // const isDisplayButton =
  //   isCreationGoalFinish ||
  //   isHiddenButtonEvaluator20 ||
  //   isHiddenButtonEvaluator10 ||
  //   isHiddenButtonEvaluator05 ||
  //   isHiddenButtonEvaluation ||
  //   isEvaluationFinish ||
  //   isHiddenButtonUser ||
  //   isF5;

  // && Confirm
  const isEvaluator05 = [3, 4].includes(statusEvaluation) && Number(evaluatorOrder) === 0.5 && isCreationGoalDate;
  const isEvaluator10 = [5, 6].includes(statusEvaluation) && Number(evaluatorOrder) === 1.0 && isCreationGoalDate;
  const isEvaluator20 = [7, 8].includes(statusEvaluation) && Number(evaluatorOrder) === 2.0 && isCreationGoalDate;

  // && Confirm Evaluator
  const isEvaluator05Evaluation = [53].includes(statusEvaluation) && Number(evaluatorOrder) === 0.5 && isEvaluationDate;
  const isEvaluator10Evaluation = [56].includes(statusEvaluation) && Number(evaluatorOrder) === 1.0 && isEvaluationDate;
  const isEvaluator20Evaluation = [59].includes(statusEvaluation) && Number(evaluatorOrder) === 2.0 && isEvaluationDate;

  // && Confirm evaluation Evaluator
  const isEvaluator05Evaluating =
    [54, 55].includes(statusEvaluation) && Number(evaluatorOrder) === 0.5 && isEvaluationDate;
  const isEvaluator10Evaluating =
    [57, 58].includes(statusEvaluation) && Number(evaluatorOrder) === 1.0 && isEvaluationDate;
  const isEvaluator20Evaluating =
    [60, 61].includes(statusEvaluation) && Number(evaluatorOrder) === 2.0 && isEvaluationDate;

  // ** Approvate && Reject for 53 56 59
  const isApprovateRejectEvaluation =
    (isEvaluator05Evaluation || isEvaluator10Evaluation || isEvaluator20Evaluation) &&
    !isNotEvaluator2 &&
    !isF5 &&
    !isEvaluatorException &&
    !isReview;

  // ** Approvate && Reject for 54 57 60
  const isApprovateRejectEvaluating =
    (isEvaluator05Evaluating || isEvaluator10Evaluating || isEvaluator20Evaluating) &&
    !isNotEvaluator2 &&
    !isF5 &&
    !isEvaluatorException &&
    !isReview;

  // ** Approvate && Reject for 2 4 8
  const isApprovateRejectGoal =
    (isEvaluator05 || isEvaluator10 || isEvaluator20) &&
    !isNotEvaluator2 &&
    !isF5 &&
    !isEvaluatorException &&
    !isReview;

  // ** Approvate && Reject for goal 49
  // ** Approvate && Reject for goal 53, 56, 59, 98
  const isApproveRejectAdmin =
    isF5 &&
    ((isCreationGoalDate && [3, 4, 5, 6, 7, 8, 49].includes(statusEvaluation) && !isReview) ||
      (isEvaluationDate && [53, 56, 59, 98].includes(statusEvaluation)));

  //  && !isEvaluatorException;

  const ButtonCustom = styled(Button)<ButtonProps>((theme) => ({
    '&.ant-btn-primary': {
      paddingLeft: screens.xs ? 15 : theme.style?.paddingLeft, // '1.5rem'
      paddingRight: screens.xs ? 15 : theme.style?.paddingRight, // '1.5rem'
    },
  }));

  const handleSetStatusReject = (statusReject: StatusRejectType, isCreationGoal?: boolean) => {
    setReject(true);
    isCreationGoal ? handleOpenRejectedGoalPopup() : handleOpenRejectedEvaluationPopup();
    setStatusReject(statusReject);
  };

  const handleProcessApproved = (isEvaluation?: boolean) => {
    if (isOpenApprovateGoal) {
      handleApproved(false);
      setOpenApprovateGoal(false);
    }
    if (isOpenApprovateEvaluation || isEvaluation) {
      handleApproved(true);
      setOpenApprovateEvaluation(false);
    }
  };

  const handleProcessApprovedClose = () => {
    setOpenApprovateGoal(false);
    setOpenApprovateEvaluation(false);
  };

  const itemsEvaluation: MenuProps['items'] | any = [
    {
      key: `${t('IDS_EVALUATION_0')}: ${fullName}`,
      label: `${t('IDS_EVALUATION_0')}: ${fullName}`,
      onClick() {
        handleSetStatusReject('52');
      },
    },
    evaluatorOrderList.includes(0.5) &&
      Number(evaluatorOrder) !== 0.5 && {
        key: findPersion(t('IDS_EVALUATION_0_5')),
        label: findPersion(t('IDS_EVALUATION_0_5')),
        onClick() {
          handleSetStatusReject('55');
        },
      },
    Number(evaluatorOrder) === 2 &&
      evaluatorOrderList.includes(1) && {
        key: findPersion(t('IDS_POINT_EVALUATOR_1')),
        label: findPersion(t('IDS_POINT_EVALUATOR_1')),
        onClick() {
          handleSetStatusReject('58');
        },
      },
  ];

  const itemsGoalCreated: MenuProps['items'] | any = [
    {
      key: `${t('IDS_EVALUATION_0')}: ${fullName}`,
      label: `${t('IDS_EVALUATION_0')}: ${fullName}`,
      onClick() {
        handleSetStatusReject('2', true);
      },
    },
    evaluatorOrderList.includes(0.5) &&
      Number(evaluatorOrder) !== 0.5 && {
        key: findPersion(t('IDS_EVALUATION_0_5')),
        label: findPersion(t('IDS_EVALUATION_0_5')),
        onClick() {
          handleSetStatusReject('4', true);
        },
      },
    Number(evaluatorOrder) === 2 &&
      evaluatorOrderList.includes(1) && {
        key: findPersion(t('IDS_POINT_EVALUATOR_1')),
        label: findPersion(t('IDS_POINT_EVALUATOR_1')),
        onClick() {
          handleSetStatusReject('6', true);
        },
      },
  ];

  const isStatusLower50 = statusEvaluation < 50;

  const itemsGoalCreatedAdmin: MenuProps['items'] | any = [
    statusEvaluation >= 3 && {
      key: `${t('IDS_EVALUATION_0')}: ${fullName}`,
      label: `${t('IDS_EVALUATION_0')}: ${fullName}`,
      onClick() {
        handleSetStatusReject(isStatusLower50 ? '2' : '52', true);
      },
    },
    evaluatorOrderList.includes(0.5) &&
      statusEvaluation >= 5 && {
        key: findPersion(t('IDS_EVALUATION_0_5')),
        label: findPersion(t('IDS_EVALUATION_0_5')),
        onClick() {
          handleSetStatusReject(isStatusLower50 ? '4' : '55', true);
        },
      },
    evaluatorOrderList.includes(1) &&
      statusEvaluation >= 7 && {
        key: findPersion(t('IDS_EVALUATOR_1')),
        label: findPersion(t('IDS_EVALUATOR_1')),
        onClick() {
          handleSetStatusReject(isStatusLower50 ? '6' : '58', true);
        },
      },
    evaluatorOrderList.includes(2) &&
      statusEvaluation >= 49 && {
        key: findPersion(t('IDS_POINT_EVALUATOR_2')),
        label: findPersion(t('IDS_POINT_EVALUATOR_2')),
        onClick() {
          handleSetStatusReject(isStatusLower50 ? '8' : '61', true);
        },
      },
  ];

  const itemsEvaluationAdmin: MenuProps['items'] | any = [
    {
      key: `${t('IDS_EVALUATION_0')}: ${fullName}`,
      label: `${t('IDS_EVALUATION_0')}: ${fullName}`,
      onClick() {
        handleSetStatusReject('52', true);
      },
    },
    evaluatorOrderList.includes(0.5) &&
      statusEvaluation > 53 && {
        key: findPersion(t('IDS_EVALUATION_0_5')),
        label: findPersion(t('IDS_EVALUATION_0_5')),
        onClick() {
          handleSetStatusReject('55', true);
        },
      },
    evaluatorOrderList.includes(1) &&
      statusEvaluation > 56 && {
        key: findPersion(t('IDS_EVALUATOR_1')),
        label: findPersion(t('IDS_EVALUATOR_1')),
        onClick() {
          handleSetStatusReject('58', true);
        },
      },
    evaluatorOrderList.includes(2) &&
      statusEvaluation > 59 && {
        key: findPersion(t('IDS_POINT_EVALUATOR_2')),
        label: findPersion(t('IDS_POINT_EVALUATOR_2')),
        onClick() {
          handleSetStatusReject('61', true);
        },
      },
  ];

  return (
    <Affix
      offsetBottom={0}
      style={{ paddingBottom: 10 }}
      onChange={(affixed) => {
        setIsAffixed(affixed);
      }}
    >
      <div className={isAffixed ? 'evaluation-sider-affixed' : 'evaluation-sider'}>
        {/* Approvate && Reject for 52 54 58 */}
        {(isApprovateRejectEvaluation || isApprovateRejectEvaluating) && (
          <Row>
            <Col xs={24} md={24} style={{ paddingBottom: 5 }}>
              <Item
                name={'commentRejectEvaluator'}
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
                required={false}
                style={{ margin: 0 }}
                rules={[
                  isReject ? { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string } : {},
                  {
                    max: 500,
                    message: (t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER') as string).replace('{maxLength}', '500'),
                  },
                ]}
              >
                <TextArea autoSize={{ maxRows: 2 }} style={{ width: '100%' }} maxLength={501} />
              </Item>
            </Col>
          </Row>
        )}
        {/* Approvate && Reject for 2 4 8 */}
        {isApprovateRejectGoal && (
          <Row>
            <Col xs={24} md={24} style={{ paddingBottom: 5 }}>
              <Item
                name={'commentReject'}
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
                required={false}
                labelCol={{
                  span: 24,
                  style: {
                    fontWeight: 500,
                  },
                }}
                style={{ margin: 0 }}
                rules={[
                  isReject ? { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string } : {},
                  {
                    max: 500,
                    message: (t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER') as string).replace('{maxLength}', '500'),
                  },
                ]}
              >
                <TextArea autoSize={{ maxRows: 2 }} style={{ width: '100%' }} maxLength={501} />
              </Item>
            </Col>
          </Row>
        )}

        <Row>
          <Col xs={24} md={12} style={{ display: 'flex', justifyContent: 'start', paddingBottom: 2 }}>
            {/* Approvate && Reject for 2 4 8 */}
            {isApprovateRejectGoal && (
              <Space direction="horizontal">
                <Button
                  loading={isLoading}
                  className="button-normal"
                  type="primary"
                  size="middle"
                  onClick={() => setOpenApprovateGoal(true)}
                >
                  {/* Approved button */}
                  {t('IDS_BUTTON_APPROVE')}
                </Button>
                <Dropdown trigger={['click']} menu={{ items: itemsGoalCreated }} placement="topLeft">
                  <Button loading={isLoading} className="button-normal" type="primary" size="middle">
                    {/* Reject button */}
                    {t('IDS_BUTTON_REJECT')}
                    <CaretUpOutlined style={{ fontSize: 18 }} />
                  </Button>
                </Dropdown>
              </Space>
            )}

            {/* Approvate && Reject for 52 54 58 */}
            {isApprovateRejectEvaluation && (
              <Space direction="horizontal">
                {/* Approved button */}

                <Tooltip
                  title={t('IDS_TOOLTIP_APPROVE_BUTTON_EXPLAINATION')}
                  color="#424242"
                  overlayInnerStyle={{ fontSize: '11px' }}
                >
                  <ButtonCustom
                    loading={isLoading}
                    className="button-normal"
                    type="primary"
                    size="middle"
                    onClick={() => handleApproved(true)}
                  >
                    {t('IDS_APPROVER_AND_START')}
                  </ButtonCustom>
                </Tooltip>

                <Dropdown trigger={['click']} menu={{ items: itemsEvaluation }} placement="topLeft">
                  <ButtonCustom
                    loading={isLoading}
                    className="button-normal"
                    type="primary"
                    size="middle"
                    style={{ width: 100 }}
                  >
                    {/* Reject button */}
                    {t('IDS_BUTTON_REJECT')}
                    <CaretUpOutlined style={{ fontSize: 18 }} />
                  </ButtonCustom>
                </Dropdown>
              </Space>
            )}

            {/* Approvate && Reject for 49 */}
            {isApproveRejectAdmin && (
              <Space direction="horizontal">
                {/* Approved button */}

                {/* {statusEvaluation === 98 && (
                  <ButtonCustom
                    loading={isLoading}
                    className="button-normal"
                    type="primary"
                    size="middle"
                    onClick={() => setOpenApprovateEvaluation(true)}
                  >
                    {t('IDS_BUTTON_APPROVE')}
                  </ButtonCustom>
                )} */}

                <Dropdown
                  trigger={['click']}
                  menu={{ items: statusEvaluation < 50 ? itemsGoalCreatedAdmin : itemsEvaluationAdmin }}
                  placement="topLeft"
                >
                  <ButtonCustom
                    loading={isLoading}
                    className="button-normal"
                    type="primary"
                    size="middle"
                    style={{ width: 100 }}
                  >
                    {/* Reject button */}
                    {t('IDS_BUTTON_REJECT')}
                    <CaretUpOutlined style={{ fontSize: 18 }} />
                  </ButtonCustom>
                </Dropdown>
              </Space>
            )}
            {((isDisplayButton && !isReview) || (isCreationGoalFinish && !isReview)) && (
              <Space direction="horizontal">
                <Button
                  loading={isLoading}
                  className="button-normal"
                  type="primary"
                  size="middle"
                  onClick={handleSaveDraft}

                  // hidden={!isDisplayButton}
                >
                  {t('IDS_BUTTON_SAVE_DRAFT')}
                </Button>
                <Button
                  loading={isLoading}
                  className="button-normal"
                  type="primary"
                  size="middle"
                  onClick={handleOpenSavePopup}

                  // hidden={!isDisplayButton}
                >
                  {t('IDS_BUTTON_SUBMIT')}
                </Button>

                {isApprovateRejectEvaluating && (
                  <Dropdown trigger={['click']} menu={{ items: itemsEvaluation }} placement="topLeft">
                    <ButtonCustom
                      loading={isLoading}
                      className="button-normal"
                      type="primary"
                      size="middle"
                      style={{ width: 100 }}
                    >
                      {/* Reject button */}
                      {t('IDS_BUTTON_REJECT')}
                      <CaretUpOutlined style={{ fontSize: 18 }} />
                    </ButtonCustom>
                  </Dropdown>
                )}
              </Space>
            )}
          </Col>
          {isReview ? (
            [2, 5, 6].includes(typeReview) && (
              <Col xs={24} md={12} style={{ display: 'flex', justifyContent: screens.xs ? 'start' : 'end' }}>
                <Space direction="horizontal" wrap>
                  <ButtonCustom
                    loading={isLoading}
                    className="button-normal"
                    type="primary"
                    size="middle"
                    onClick={() => handleApprovalHistory()}
                  >
                    {t('IDS_HISTORY_APPROVE')}
                  </ButtonCustom>
                </Space>
              </Col>
            )
          ) : (
            <Col xs={24} md={12} style={{ display: 'flex', justifyContent: screens.xs ? 'start' : 'end' }}>
              <Space direction="horizontal" wrap>
                <ButtonCustom
                  loading={isLoading}
                  className="button-normal"
                  type="primary"
                  size="middle"
                  onClick={() => handleApprovalHistory()}
                >
                  {t('IDS_HISTORY_APPROVE')}
                </ButtonCustom>
                <ButtonCustom
                  loading={isLoading}
                  className="button-normal"
                  type="primary"
                  size="middle"
                  onClick={() => handleDepartmentTarget()}
                >
                  {t('IDS_GOAL_DEPARTMENT')}
                </ButtonCustom>
                <ButtonCustom
                  loading={isLoading}
                  className="button-normal"
                  type="primary"
                  size="middle"
                  onClick={() => handleEvaluationCriteria()}
                >
                  {t('IDS_EVALUATION_CRITERIA')}
                </ButtonCustom>
              </Space>
            </Col>
          )}
        </Row>

        {/* Modal Reject Goal*/}
        <ModalCustomComponent
          isOpen={isOpen}
          header={t('POPUP_DIALOG.TITLE.CONFIRM')}
          content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_REJECT')}
          fnHandleOk={handleOk}
          fnHandleCancel={handleOpen}
          okText={t('POPUP_DIALOG.BUTTON.REJECT') as string}
          cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
          loading={isLoading}
        />

        {/* Modal Reject Evaluation*/}
        <ModalCustomComponent
          isOpen={isOpenEvaluator}
          header={t('POPUP_DIALOG.TITLE.CONFIRM')}
          content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_REJECT')}
          fnHandleOk={handleOkEvaluator}
          fnHandleCancel={() => setOpenEvaluator(false)}
          okText={t('POPUP_DIALOG.BUTTON.REJECT') as string}
          cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
          loading={isLoading}
        />

        {/* Modal Approvate Goal*/}
        <ModalCustomComponent
          isOpen={isOpenApprovateGoal}
          header={t('POPUP_DIALOG.TITLE.CONFIRM')}
          content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_APPROVE')}
          fnHandleOk={handleProcessApproved}
          fnHandleCancel={handleProcessApprovedClose}
          okText={t('POPUP_DIALOG.BUTTON.APPROVE') as string}
          cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
          loading={isLoading}
        />
      </div>
    </Affix>
  );
};

export default ButtonFooterComponent;
