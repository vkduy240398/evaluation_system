/* eslint-disable @typescript-eslint/naming-convention */
import { Button, Col, Dropdown, MenuProps, Tooltip } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { setOpenPopUp } from '../../../../store/total';
import { t } from 'i18next';
import { useAuth } from '../../../../hooks/useAuth';
import { CaretUpOutlined } from '@ant-design/icons';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import { EvaluationPersonalAchievement, EvaluatorInfo, UserInfo } from '../interfaces/response.interface';

interface Props {
  handleApprove: () => boolean;
  dataSource: EvaluationPersonalAchievement[];
  status: number;
  role: string;
  handleReject: () => void;
  listEvalutor: EvaluatorInfo[];
  setSelectedOrder: (data: string) => string;
  isLoading: boolean;
  isEvaluationDate: boolean;
  isGoalDate: boolean;
  userInfo: UserInfo;
  scroll?: any;
  form: any;
  setReject: React.Dispatch<React.SetStateAction<boolean>>;
}
const ButtonApproveRejectType: React.FC<any> = (props: Props) => {
  const {
    role,
    status,
    handleReject,
    listEvalutor,
    setSelectedOrder,
    isLoading,
    isEvaluationDate,
    isGoalDate,
    userInfo,
    form,
    setReject,
    handleApprove,
  } = props;
  const { user } = useAuth();
  const store = useSelector((state: RootState) => state.calculateTotal);
  const dispatch = useDispatch<AppDispatch>();
  const rejectOptionList = listEvalutor.filter((el: EvaluatorInfo) => {
    return el.evaluationOrder < store.maxOrder && el.evaluatorId !== user?.id;
  });
  const orderListUser = rejectOptionList.map((item: EvaluatorInfo) => {
    return item.evaluationOrder;
  });
  const orderListAdmin = listEvalutor.map((item: EvaluatorInfo) => {
    return item.evaluationOrder;
  });
  const orderList = role === 'admin' ? orderListAdmin : orderListUser;
  const evaluatorOptionList = role === 'admin' ? listEvalutor : rejectOptionList;
  const findName = (order: string) => {
    let name = '';
    evaluatorOptionList.map((item: EvaluatorInfo) => {
      if (order === item.evaluationOrder && item.evaluationOrder === '0.5') {
        name = t('IDS_EVALUATION_0_5') + ': ' + item.user?.fullName;
      }
      if (order === item.evaluationOrder && item.evaluationOrder === '1.0') {
        name = t('IDS_EVALUATOR_1') + ': ' + item.user?.fullName;
      }
      if (order === item.evaluationOrder && item.evaluationOrder === '2.0') {
        name = t('IDS_EVALUATOR_2') + ': ' + item.user?.fullName;
      }
    });

    return name;
  };

  const openPopUpConfirm = async (order: string) => {
    setReject(true);
    await form
      .validateFields(['evaluator_option', 'reject'])
      .then(() => {
        dispatch(setOpenPopUp(true));
        setSelectedOrder(order);
      })
      .catch(() => {
        dispatch(setOpenPopUp(false));
      });
  };

  // const userName = role === 'admin' ? userInfo.fullName : userInfo.fullName.split(': ')[1];
  const items: MenuProps['items'] = [
    {
      key: 1,
      label: <>{`${t('IDS_EVALUATION_0')}: ` + userInfo.fullName}</>,
      onClick() {
        openPopUpConfirm('user');
      },
    },
  ];
  if (orderList.includes('0.5') && (status === 49 || [5, 6, 7, 8].includes(status) || status > 53))
    items.push({
      key: 2,
      label: <>{findName('0.5')}</>,
      onClick() {
        openPopUpConfirm('0.5');
      },
    });
  if (orderList.includes('1.0') && (status === 49 || [7, 8].includes(status) || status > 56))
    items.push({
      key: 3,
      label: <>{findName('1.0')}</>,
      onClick() {
        openPopUpConfirm('1.0');
      },
    });
  if (orderList.includes('2.0') && (status === 49 || status > 59))
    items.push({
      key: 4,
      label: <>{findName('2.0')}</>,
      onClick() {
        openPopUpConfirm('2.0');
      },
    });

  const itemsAdmin: MenuProps['items'] = [];
  if (status >= 3)
    itemsAdmin.push({
      key: 1,
      label: <>{`${t('IDS_EVALUATION_0')}: ` + userInfo.fullName}</>,
      onClick() {
        openPopUpConfirm('user');
      },
    });
  if (orderList.includes('0.5') && ((status >= 5 && status < 50) || status > 53))
    itemsAdmin.push({
      key: 2,
      label: <>{findName('0.5')}</>,
      onClick() {
        openPopUpConfirm('0.5');
      },
    });
  if (orderList.includes('1.0') && ((status >= 7 && status < 50) || status > 56))
    itemsAdmin.push({
      key: 3,
      label: <>{findName('1.0')}</>,
      onClick() {
        openPopUpConfirm('1.0');
      },
    });
  if (orderList.includes('2.0') && (status === 49 || status > 59))
    itemsAdmin.push({
      key: 4,
      label: <>{findName('2.0')}</>,
      onClick() {
        openPopUpConfirm('2.0');
      },
    });

  const handleCancel = () => {
    // form.setFieldsValue({
    //   evaluator_option: '',
    //   reject: '',
    // });
    dispatch(setOpenPopUp(false));
  };

  return (
    <>
      {props.role === 'evaluator' &&
        !store.isDisable &&
        (store.hasMode1 || store.hasMode2) &&
        (([3, 4, 5, 6, 7, 8].includes(status) && isGoalDate) ||
          ([53, 56, 59].includes(status) && isEvaluationDate)) && (
          <Col>
            <Tooltip title={store.hasMode2 ? t('IDS_TOOLTIP_APPROVE_BUTTON_EXPLAINATION') : null}>
              <Button
                className="button-normal"
                type="primary"
                size="middle"
                onClick={handleApprove}
                disabled={store.isDisable}
                loading={isLoading}
                style={{ marginRight: 8 }}
              >
                {store.hasMode2 ? t('IDS_APPROVER_AND_START') : t('IDS_BUTTON_APPROVE')}
              </Button>
            </Tooltip>
            <Dropdown trigger={['click']} menu={{ items: items }} disabled={store.isDisable} placement="topLeft">
              <Button
                className="button-normal"
                type="primary"
                size="middle"
                disabled={store.isDisable}
                loading={isLoading}
              >
                {t('IDS_BUTTON_REJECT')}
                <CaretUpOutlined style={{ fontSize: 18 }} />
              </Button>
            </Dropdown>
          </Col>
        )}

      {role === 'evaluator' &&
        store.hasMode3 &&
        !store.isDisable &&
        [54, 55, 57, 58, 60, 61].includes(status) &&
        isEvaluationDate && (
          <Col style={{ marginLeft: 10 }}>
            <Dropdown trigger={['click']} menu={{ items: items }} disabled={store.isDisable} placement="topLeft">
              <Button
                className="button-normal"
                type="primary"
                size="middle"
                loading={isLoading}
                disabled={store.isDisable || isLoading}
              >
                {t('IDS_BUTTON_REJECT')}
                <CaretUpOutlined style={{ fontSize: 18 }} />
              </Button>
            </Dropdown>
          </Col>
        )}

      {props.role === 'admin' &&
        !store.isDisable &&
        ((status > 2 && status < 50 && isGoalDate) || ([53, 56, 59, 98].includes(status) && isEvaluationDate)) && (
          <Col>
            <Dropdown trigger={['click']} menu={{ items: itemsAdmin }} disabled={store.isDisable}>
              <Button
                className="button-normal"
                type="primary"
                size="middle"
                disabled={store.isDisable}
                loading={isLoading}
              >
                {t('IDS_BUTTON_REJECT')}
                <CaretUpOutlined style={{ fontSize: 18 }} />
              </Button>
            </Dropdown>
          </Col>
        )}

      {/* Modal Reject */}
      <ModalCustomComponent
        isOpen={store.isOpenPopUp}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_REJECT')}
        fnHandleOk={handleReject}
        fnHandleCancel={handleCancel}
        okText={t('POPUP_DIALOG.BUTTON.REJECT') as string}
        cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
        loading={isLoading}
      />
    </>
  );
};
export default ButtonApproveRejectType;
