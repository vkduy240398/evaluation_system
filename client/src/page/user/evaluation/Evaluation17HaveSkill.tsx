// ** React Imports
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

// ** React router Inports
import { useLocation, useNavigate } from 'react-router-dom';

//  ** Antd Imports
import { Form, Typography, message, notification } from 'antd';
import useForm from 'antd/es/form/hooks/useForm';

// ** Type Imports
import { UserEvaluationType } from '../../../types/pages/user-evaluation/UserEvaluationType';
import { evaluationOrder, statusEvaluationType } from '../../../common/status';

import download from 'downloadjs';
import { Buffer } from 'buffer';

//  ** Component Imports
import UserEvaluationInfoComponent from '../../../views/user/evaluation/UserEvaluationInforComponent';
import SettingLevelComponent from '../../../views/user/evaluation/SettingLevelComponent';
import userEvaluationApiService from '../../../common/api/userEvaluation';
import TabEvaluationComponent from '../../../views/user/evaluation/TabEvaluationComponent';
import ButtonFooterComponent from '../../../views/user/evaluation/ButtonFooterComponent';
import { compareDatePeriod, encrypt, urlCompanyCode } from '../../../common/util';
import evaluatorApiService from '../../../common/api/evaluator';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import { NotificationPlacement } from 'antd/es/notification/interface';
import LoadingScreenComponent from '../../../views/loading/LoadingScreenComponent';

// ** I18 Imports
import { t } from 'i18next';

// ** Store & Actions Imports
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import {
  reset,
  setAdditionalOptions,
  setBasicSkillPointOptions,
  setBehaviorSkillPointOptions,
  setProSkillPointOptions,
  userEvaluationAchievement,
  userEvaluationAchievementAdditional,
  userEvaluationBasicSkill,
  userEvaluationBehaviorSkill,
  userEvaluationCalculatorProSkill,
  userEvaluationSetSettingProFormula,
} from '../../../store/userEvaluation';
import { reloadComponent, setDetailLoading, setLoadingRedux } from '../../../store/loading';
import { handleCheckDisplayUserOnScreen } from '../../../views/user/evaluation/process/handleCheckDisplay';
import { handleOpenSavePopup17 } from '../../../views/user/evaluation/process/evaluation17/handleSave17';

type TabId = '1' | '2' | '3' | '4' | '5' | '6';
type StatusRejectType = '2' | '4' | '6' | '8' | '52' | '55' | '58' | '61';
type EvaluationRoleType = 'isEvaluationUser' | 'isEvaluationEvaluator';
interface Props {
  evalationType?: EvaluationRoleType;
  isF5?: boolean;
  isReview?: boolean;
  flagSkill: number;
  getEvaluationDetail: (setDeplay?: boolean) => Promise<void>;
  dataSources: UserEvaluationType | undefined;
  setDataSource: Dispatch<SetStateAction<UserEvaluationType | undefined>>;
  isLoading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  isCreationGoalDate: boolean;
  isEvaluationDate: boolean;
  statusEvaluation: statusEvaluationType;
  setStatusEvaluation: Dispatch<SetStateAction<statusEvaluationType>>;
  updateTime: any;
  setUpdateTime: Dispatch<any>;
  typeReview?: number;
  newestRecord?: { evaluationOrder: number };
}
const Evaluation17HaveSkill = ({
  evalationType,
  isF5 = false,
  flagSkill,
  getEvaluationDetail,
  dataSources,
  setDataSource,
  isLoading,
  setLoading,
  isCreationGoalDate,
  isEvaluationDate,
  statusEvaluation,
  setStatusEvaluation,
  updateTime,
  setUpdateTime,
  isReview,
  typeReview = 0,
  newestRecord,
}: Props) => {
  // ** State
  // const [dataSources, setDataSource] = useState<UserEvaluationType>();
  const isEvaluatorUser = evalationType === 'isEvaluationUser';

  const [isOpen, setOpen] = useState<boolean>(false);

  const [api, contextHolder] = notification.useNotification();

  const [statusReject, setStatusReject] = useState<StatusRejectType>('2');

  const [tabId, setTabId] = useState<TabId>(
    (isEvaluationDate && statusEvaluation >= 50) || statusEvaluation > 50 ? '3' : '1',
  );

  // ** Ref

  //   ** Hook
  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate();
  const id = state?.id;

  const [form] = useForm();
  const store = useSelector((state: RootState) => state.userEvaluation);
  const storeLoading = useSelector((state: RootState) => state.loading);
  const [isReject, setReject] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const errorCallback = () => {
    setLoading(false);
    dispatch(setDetailLoading(false));
  };

  const handleSetActiveKey = (activeKey: TabId) => {
    setTabId(activeKey);
  };

  const handleOpenSavePopup = () => {
    setReject(false);
    form.validateFields(['commentRejectEvaluator', 'commentReject']);
    handleOpenSavePopup17({ store, statusEvaluation, handleMoveToTab, form, setOpen, isEvaluationDate, dispatch });
  };

  const handleSave = () => {
    handleCallApiUpdate(true);
    setOpen(false);
  };

  const handleSaveDraft = () => {
    handleCallApiUpdate(false);
  };
  const handleCallApiUpdate = (isSubmit: boolean) => {
    setLoading(true);
    dispatch(setDetailLoading(true));

    userEvaluationApiService.updateEvaluationById({
      evaluationId: id,
      isSubmit,
      listProSkillData: store.evaluationProSkills,
      achievementDatas: store.achievementDatas,
      evaluationBasicSkills: store.evaluationBasicSkills,
      evaluationBehaviorSkills: store.evaluationBehaviorSkills,
      achievementAdditionals: store.achievementAdditionals,

      // ** Point User
      proTotalPointUser: store.proTotalPointUser,
      basicTotalPointUser: store.basicTotalPointUser,
      behaviorTotalPointUser: store.behaviorTotalPointUser,
      achievementPersonalTotalPointUser: store.achievementPersonalTotalPointUser,
      achievementAdditionalTotalPointUser: store.achievementAdditionalTotalPointUser,

      // ** Point 0.5
      proTotalPointEvaluator05: store.proTotalPoint05,
      basicTotalPointEvaluator05: store.basicTotalPoint05,
      behaviorTotalPointEvaluator05: store.behaviorTotalPoint05,
      achievementPersonalTotalPointEvaluator05: store.achievementPersonalTotalPoint05,
      achievementAdditionalTotalPointEvaluator05: store.achievementAdditionalTotalPoint05,

      // ** Point 1.0
      proTotalPointEvaluator1: store.proTotalPoint1,
      basicTotalPointEvaluator1: store.basicTotalPoint1,
      behaviorTotalPointEvaluator1: store.behaviorTotalPoint1,
      achievementPersonalTotalPointEvaluator1: store.achievementPersonalTotalPoint1,
      achievementAdditionalTotalPointEvaluator1: store.achievementAdditionalTotalPoint1,

      // ** Point 2.0
      proTotalPointEvaluator2: store.proTotalPoint2,
      basicTotalPointEvaluator2: store.basicTotalPoint2,
      behaviorTotalPointEvaluator2: store.behaviorTotalPoint2,
      achievementPersonalTotalPointEvaluator2: store.achievementPersonalTotalPoint2,
      achievementAdditionalTotalPointEvaluator2: store.achievementAdditionalTotalPoint2,

      // ** Comment
      commentUser: form.getFieldValue('commentUser'),
      comment05Public: form.getFieldValue('comment05Public'),
      comment05Private: form.getFieldValue('comment05Private'),
      comment1Public: form.getFieldValue('comment1Public'),
      comment1Private: form.getFieldValue('comment1Private'),
      comment2Public: form.getFieldValue('comment2Public'),
      comment2Private: form.getFieldValue('comment2Private'),
      isEvaluatorUser,
      updateTime,

      totalData: store.totalData,
      achievementSubs: Object.values(store.achievementSubs),

      callback,
      errorCallback,
    });
  };

  const handleMoveToTab = (id: TabId, msg: string) => {
    setTabId(id);

    openNotification('bottomRight', msg);
    setTimeout(() => {
      const fieldsToValidates = Object.keys(form.getFieldsValue()).filter(
        (field) => !['commentRejectEvaluator', 'commentReject'].includes(field),
      );

      form.validateFields(fieldsToValidates);
    }, 500);
  };

  const callback = (dataRes: { statusNumber?: statusEvaluationType; updateTime: string }, isSubmit?: boolean) => {
    const { statusNumber, updateTime } = dataRes;
    isSubmit
      ? message.success(t('MESSAGE.COMMON.IDM_SUBMIT_SUCCESS'))
      : message.success(t('MESSAGE.COMMON.IDM_SAVE_DRAFT_SUCCESS'));
    setUpdateTime(updateTime);
    if (statusNumber)
      if ([3, 5, 7, 53, 56, 59, 98].includes(statusNumber) && isSubmit) {
        dispatch(setLoadingRedux(true));
        getEvaluationDetail(true).then(() => {
          setTimeout(() => {
            dispatch(reloadComponent(!storeLoading.isReloadComponent));
            dispatch(setLoadingRedux(false));
            dispatch(setDetailLoading(false));
          }, 300);
        });
      } else {
        setStatusEvaluation(statusNumber);
        setLoading(false);
        dispatch(setDetailLoading(false));
      }
    getEvaluationDetail();
  };

  const handleApproved = (isApproveEvaluator?: boolean) => {
    const comment = !isApproveEvaluator
      ? form.getFieldValue('commentReject')
      : form.getFieldValue('commentRejectEvaluator');

    // console.log('isApproveEvaluator', isApproveEvaluator);

    if ((comment && comment.length <= 500) || !comment) {
      setLoading(true);
      dispatch(setDetailLoading(true));
      evaluatorApiService.sendApprovedStatus({
        comment,
        evaluationId: id,
        type: !isApproveEvaluator ? 0 : 1,
        updateTime,
        isF5,

        callback: (dataRes: { statusNumber: statusEvaluationType; updateTime: string }) => {
          const { statusNumber, updateTime } = dataRes;
          setStatusEvaluation(statusNumber);
          setUpdateTime(updateTime);
          setLoading(false);
          dispatch(setDetailLoading(false));
          form.resetFields(['commentReject', 'commentRejectEvaluator']);
          message.success(t('MESSAGE.COMMON.IDM_APPROVE_SUCCESS'));
        },
        errorCallback,
      });
    }
  };

  const handleRejected = async (isRejectEvaluator?: boolean) => {
    const comment = !isRejectEvaluator
      ? form.getFieldValue('commentReject')
      : form.getFieldValue('commentRejectEvaluator');

    return await form
      .validateFields(['commentRejectEvaluator', 'commentReject'])
      .then(() => {
        dispatch(setDetailLoading(true));
        setLoading(true);
        evaluatorApiService.sendRejectStatus({
          evaluationId: id,
          comment,
          type: !isRejectEvaluator ? 0 : 1,
          statusReject,
          updateTime,
          isF5,
          callback: (dataRes: { statusNumber: statusEvaluationType; updateTime: string }) => {
            const { statusNumber, updateTime } = dataRes;
            setUpdateTime(updateTime);
            setStatusEvaluation(statusNumber);
            setLoading(false);
            dispatch(setDetailLoading(false));
            setDataSource((dataState: any) => ({ ...dataState, historyApproveEvaluation: comment }));
            message.success(t('MESSAGE.COMMON.IDM_REJECT_SUCCESS'));
          },
          errorCallback,
        });
      })
      .catch(() => {});
  };

  const handleApprovalHistory = () =>
    window.open(
      `${window.location.origin}${urlCompanyCode()}/${
        isF5 ? 'admin-evaluation' : isEvaluatorUser ? 'user' : isReview ? 'reference-review' : 'evaluator'
      }/evaluation/${id}/approval-history${
        isReview
          ? `?isReview=${isReview}&typeReview=${encrypt(typeReview.toString())}${
              newestRecord?.evaluationOrder ? `&order=${encrypt(newestRecord?.evaluationOrder?.toString())}` : ''
            }`
          : ''
      }${
        !isReview && newestRecord?.evaluationOrder ? `?order=${encrypt(newestRecord?.evaluationOrder?.toString())}` : ''
      }`,
      '_blank',
    );

  const handleEvaluationCriteria = () =>
    window.open(
      `${window.location.origin}${urlCompanyCode()}/${
        isF5 ? 'admin-evaluation' : isEvaluatorUser ? 'user' : 'evaluator'
      }/evaluation-description/${id}`,
      '_blank',
    );

  const handleDepartmentTarget = () =>
    window.open(
      `${window.location.origin}${urlCompanyCode()}/${
        isF5 ? 'admin-evaluation' : isEvaluatorUser ? 'user' : 'evaluator'
      }/department-goal?id=${id}&role=${isEvaluatorUser ? '1' : isF5 ? '5' : '2'}`,
      '_blank',
    );

  const openNotification = (placement: NotificationPlacement, msg: string) => {
    api.warning({
      message: <Typography.Title level={4}>{t('IDS_NOTIFY')}</Typography.Title>,
      description: msg,
      placement,
      duration: 3,
    });
  };

  const handleDownload = (arg: { orientation: 'l' | 'p'; format: 'a4' | 'a3' }) => {
    setLoading(true);
    dispatch(setDetailLoading(true));
    userEvaluationApiService.downloadEvaluationForPdf({
      id: id,
      isEvaluatorUser,
      ...arg,
      callback: (data) => {
        const buffer = Buffer.from(data.buffer);

        const blob = new Blob(['\uFEFF', buffer], {
          type: 'application/pdf',
        });
        download(blob, data.fileName, 'application/pdf');
        setTimeout(() => {
          setLoading(false);
          dispatch(setDetailLoading(false));
        }, 500);
      },
    });
  };

  const {
    isDisplayEvaluator05,
    isDisplayEvaluator1,
    isDisplayEvaluator2,
    isEditEvaluation05,
    isEditEvaluation1,
    isEditEvaluation2,
    isDisplayUserEvaluator, // time in evaluation time
    isEditUserEvaluation,
  } = useMemo(
    () =>
      handleCheckDisplayUserOnScreen({
        statusEvaluation,
        isEvaluationDate,
        evaluatorOrderList: dataSources?.evaluatorOrderList || [],
        isEvaluatorException: dataSources?.isEvaluatorException || false,
        evaluatorOrder: !isReview ? dataSources?.evaluatorOrder || 0 : 0,
        isEvaluatorUser,
        isNotEvaluator2: isF5 || dataSources?.isNotEvaluator2 || false,
        isF5: isF5 || false,
        isReview: isReview,
        typeReview: typeReview,
        newestOrder: newestRecord?.evaluationOrder || 0,
      }),
    [statusEvaluation],
  );
  const props = {
    statusEvaluation,
    isEvaluationDate,
    isCreationGoalDate,
    isEvaluatorUser,
    isNotEvaluator2: isF5 || dataSources?.isNotEvaluator2 || false,
    isF5,
    isReview,
    typeReview,
  };
  const checkedProps = {
    isDisplayEvaluator05,
    isDisplayEvaluator1,
    isDisplayEvaluator2,
    isEditEvaluation05,
    isEditEvaluation1,
    isEditEvaluation2,
    isDisplayUserEvaluator,
    isEditUserEvaluation,
  };
  const isDisplayButton = isEditUserEvaluation || isEditEvaluation05 || isEditEvaluation1 || isEditEvaluation2;

  return (
    <div style={{ position: 'relative', paddingBottom: 20, height: '100%' }}>
      {contextHolder}
      {!dataSources ? (
        <LoadingScreenComponent />
      ) : (
        <>
          <UserEvaluationInfoComponent
            {...{ ...dataSources }}
            status={statusEvaluation}
            isEvaluationDate={isEvaluationDate}
            header={t('IDS_DETAIL_EVALUATION')}
            isReview={isReview}
            isEvaluatorUser={isEvaluatorUser}
            isF5={isF5}
            evaluatorOrder={dataSources?.evaluatorOrder}
          />
          <SettingLevelComponent
            {...dataSources}
            {...checkedProps}
            header={isDisplayUserEvaluator ? t('IDS_EVALUATION_RESULT') : t('IDS_EVALUATION_DISTRIBUTION')}
            pointSettingLevel={dataSources.pointSettingLevel}
            handleDownload={handleDownload}
            isLoading={isLoading}
            statusEvaluation={statusEvaluation}
            isEvaluatorUser={isEvaluatorUser}
            isF5={isF5}
            pdfId={id}
            fullName={dataSources.fullName}
            financialYear={dataSources.fiscalYear}
            isReview={isReview}
            isEvaluationDate={isEvaluationDate}
          />
          <Form
            form={form}
            initialValues={{ commentUser: dataSources.commentUser, ...dataSources.comment }}
            preserve={false}
          >
            {isReview && typeReview === 3 ? (
              <></>
            ) : (
              <TabEvaluationComponent
                {...dataSources}
                {...props}
                {...checkedProps}
                achievementDatas={dataSources.userEvaluationAchievements}
                tabId={tabId}
                handleSetActiveKey={handleSetActiveKey}
                isF5={isF5}
                level={dataSources.evaluationLevel}
                isLoading={isLoading}
                openNotification={openNotification}
                evaluationId={id}
                status={statusEvaluation}
                evaluationPeriod={dataSources.evaluationPeriod}
              />
            )}

            <div style={{ height: 10 }}></div>

            <ButtonFooterComponent
              handleSaveDraft={handleSaveDraft}
              isLoading={isLoading}
              handleApprovalHistory={handleApprovalHistory}
              evaluatorOrder={dataSources.evaluatorOrder}
              handleRejected={handleRejected}
              handleApproved={handleApproved}
              handleEvaluationCriteria={handleEvaluationCriteria}
              evaluatorOrderList={dataSources.evaluatorOrderList}
              handleDepartmentTarget={handleDepartmentTarget}
              evaluators={dataSources.evaluators}
              fullName={dataSources.fullName}
              setStatusReject={setStatusReject}
              handleOpenSavePopup={handleOpenSavePopup}
              form={form}
              statusEvaluation={statusEvaluation}
              isEvaluationDate={isEvaluationDate}
              isCreationGoalDate={isCreationGoalDate}
              isEvaluatorUser={isEvaluatorUser}
              isNotEvaluator2={dataSources.isNotEvaluator2}
              isF5={isF5}
              isDisplayButton={isDisplayButton}
              isEvaluatorException={dataSources.isEvaluatorException}
              isReject={isReject}
              setReject={setReject}
              isReview={isReview}
              typeReview={typeReview}
            />
          </Form>

          {/* Modal Submit */}
          <ModalCustomComponent
            isOpen={isOpen}
            header={t('POPUP_DIALOG.TITLE.CONFIRM')}
            content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SUBMIT')}
            fnHandleOk={handleSave}
            okText={t('POPUP_DIALOG.BUTTON.OK') as string}
            cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
            fnHandleCancel={() => setOpen(false)}
            loading={isLoading}
          />
        </>
      )}
    </div>
  );
};

export default Evaluation17HaveSkill;
