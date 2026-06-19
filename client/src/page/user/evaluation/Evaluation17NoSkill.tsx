// ** React Imports
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { statusEvaluationType } from '../../../common/status';
import { UserEvaluationPeriodType, UserEvaluationType } from '../../../types/pages/user-evaluation/UserEvaluationType';
import { compareDatePeriod, encrypt, urlCompanyCode } from '../../../common/util';

//  ** Antd Imports
import { Form, Typography, message, notification } from 'antd';
import { useForm } from 'antd/es/form/Form';

// ** I18 Imports
import { t } from 'i18next';

import download from 'downloadjs';
import { Buffer } from 'buffer';

// ** Store & Actions Imports
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import {
  reset,
  setAdditionalOptions,
  setBehaviorSkillPointOptions,
  userEvaluationAchievement,
  userEvaluationAchievementAdditional,
  userEvaluationBehaviorSkill,
  userEvaluationSetSettingProFormula,
} from '../../../store/userEvaluation';
import { reloadComponent, setDetailLoading, setLoadingRedux } from '../../../store/loading';
import { handleCheckDisplayUserOnScreen } from '../../../views/user/evaluation/process/handleCheckDisplay';
import userEvaluationApiService from '../../../common/api/userEvaluation';
import LoadingScreenComponent from '../../../views/loading/LoadingScreenComponent';
import UserEvaluationInforComponent from '../../../views/user/evaluation/UserEvaluationInforComponent';
import SettingLevelComponentNoSkill from '../../../views/user/evaluationNoSkill/SettingLevelComponent';
import TabEvaluationComponentNoSkill from '../../../views/user/evaluationNoSkill/TabEvaluationComponent';
import ButtonFooterComponent from '../../../views/user/evaluation/ButtonFooterComponent';
import evaluatorApiService from '../../../common/api/evaluator';
import { NotificationPlacement } from 'antd/es/notification/interface';

import ModalCustomComponent from '../../../@core/components/modal-custom';
import { handleOpenSavePopup17NoSkill } from '../../../views/user/evaluation/process/evaluation17NoSkill/handleSave17';

type TabId = '1' | '2' | '3' | '4' | '5' | '6';
type StatusRejectType = '2' | '4' | '6' | '8' | '52' | '55' | '58' | '61';
type EvaluationRoleType = 'isEvaluationUser' | 'isEvaluationEvaluator';
interface Props {
  evalationType?: EvaluationRoleType;
  isF5?: boolean;
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
  isReview?: boolean;
  typeReview?: number;
  newestRecord?: { evaluationOrder: number };
  evaluationPeriod?: UserEvaluationPeriodType;
}
const Evaluation17NoSkill = ({
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
  evaluationPeriod,
}: Props) => {
  // ** State

  const isEvaluatorUser = evalationType === 'isEvaluationUser';

  const [isOpen, setOpen] = useState<boolean>(false);

  const [api, contextHolder] = notification.useNotification();

  const [statusReject, setStatusReject] = useState<StatusRejectType>('2');

  const [tabId, setTabId] = useState<TabId>('4');
  const [isReject, setReject] = useState(false);

  //   ** Hook
  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate();
  const id = state?.id;

  const [form] = useForm();
  const store = useSelector((state: RootState) => state.userEvaluation);
  const storeLoading = useSelector((state: RootState) => state.loading);
  const dispatch = useDispatch<AppDispatch>();

  // ** Effect
  // useEffect(() => {
  //   // const callback = (data: any[]) => {
  //   //   if (data && data.length > 0) {
  //   //     const options = data.map((v) => ({ value: v.point, label: v.rating }));
  //   //     dispatch(setAdditionalOptions(options));
  //   //   }

  //   //   setLoading(false);
  //   // };
  //   // userEvaluationApiService.getAchievementAddPublic({
  //   //   achievementType: 3,
  //   //   callback,
  //   //   isEvaluatorUser,
  //   //   isF5: isF5,
  //   //   type: 1,
  //   // });
  //   // getEvaluationDetail();

  //   return () => {
  //     dispatch(reset());
  //   };
  // }, [id, state]);

  // ** Functional
  const backToListScreen = () => {
    isEvaluatorUser
      ? navigate(urlCompanyCode() + '/user/list-evaluation')
      : !isF5
      ? navigate(urlCompanyCode() + '/evaluator/list-user-evaluation')
      : navigate(urlCompanyCode() + '/admin-evaluation/list-user-evaluation');
  };

  const handleSetActiveKey = (activeKey: TabId) => {
    setTabId(activeKey);
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
    isDisplayUserEvaluator,
    isEditUserEvaluation,
  } = useMemo(
    () =>
      handleCheckDisplayUserOnScreen({
        statusEvaluation,
        isEvaluationDate,
        evaluatorOrderList: dataSources?.evaluatorOrderList || [],
        isEvaluatorException: dataSources?.isEvaluatorException || false,
        evaluatorOrder: dataSources?.evaluatorOrder || 0,
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
    isNoSkill: true,
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
      }
    getEvaluationDetail();
  };

  const errorCallback = () => {
    setLoading(false);
    dispatch(setDetailLoading(false));
  };

  // ** Notification
  const openNotification = (placement: NotificationPlacement, msg: string) => {
    api.warning({
      message: <Typography.Title level={4}>{t('IDS_NOTIFY')}</Typography.Title>,
      description: msg,
      placement,
      duration: 3,
    });
  };

  // ** Handle Reject
  const handleRejected = async (isRejectEvaluator?: boolean) => {
    const comment = !isRejectEvaluator
      ? form.getFieldValue('commentReject')
      : form.getFieldValue('commentRejectEvaluator');

    return await form
      .validateFields(['commentRejectEvaluator', 'commentReject'])
      .then(() => {
        setLoading(true);
        dispatch(setDetailLoading(true));
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

  // ** Handle Approver
  const handleApproved = (isApproveEvaluator?: boolean) => {
    const comment = !isApproveEvaluator
      ? form.getFieldValue('commentReject')
      : form.getFieldValue('commentRejectEvaluator');

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

  // // ** Handle Process Error Tab
  // const hasOwnPropertyArray = (
  //   objectList: any[] | undefined,
  //   keyNeedChecks: string[],
  //   isHasMaxLength = false,
  //   keyCheckMaxLength?: KeyCheckMaxLengths[],
  // ): boolean => {
  //   let hasError = false;
  //   if (!objectList) return hasError;
  //   if (
  //     (statusEvaluation === 0 ||
  //       statusEvaluation === 1 ||
  //       statusEvaluation === 2 ||
  //       statusEvaluation === 50 ||
  //       statusEvaluation === 51 ||
  //       statusEvaluation === 52) &&
  //     objectList.length === 0
  //   )
  //     return (hasError = true);
  //   for (const item of objectList) {
  //     const isHasError = hasOwnPropertyObject(keyNeedChecks, item);
  //     if (!isHasError) {
  //       hasError = true;
  //       break;
  //     }
  //     if (isHasMaxLength && keyCheckMaxLength) {
  //       const isHasError = hasMaxLengthArray(keyCheckMaxLength, item);
  //       if (!isHasError) {
  //         hasError = true;
  //         break;
  //       }
  //     }
  //   }

  //   return hasError;
  // };

  // // ** Handle Process Error Tab
  // const hasOwnPropertyArrayAchievement = (
  //   objectList: any[] | undefined,
  //   keyNeedChecks: string[],
  //   isHasMaxLength = false,
  //   keyCheckMaxLength?: KeyCheckMaxLengths[],
  // ): boolean => {
  //   let hasError = false;
  //   if (!objectList) return hasError;
  //   if (
  //     (statusEvaluation === 0 ||
  //       statusEvaluation === 1 ||
  //       statusEvaluation === 2 ||
  //       statusEvaluation === 50 ||
  //       statusEvaluation === 51 ||
  //       statusEvaluation === 52) &&
  //     objectList.length === 0
  //   )
  //     return (hasError = true);
  //   for (const item of objectList) {
  //     const isHasError = hasOwnPropertyObject(
  //       keyNeedChecks,
  //       item,
  //       item.achievementStatus === '未達成' ? undefined : 'reasonComment',
  //     );
  //     if (!isHasError) {
  //       hasError = true;
  //       break;
  //     }

  //     if (isHasMaxLength && keyCheckMaxLength) {
  //       const isHasError = hasMaxLengthArray(keyCheckMaxLength, item);
  //       if (!isHasError) {
  //         hasError = true;
  //         break;
  //       }
  //     }
  //   }

  //   return hasError;
  // };

  // const calculatorAchievement = (achievementDatas: UserEvaluationAchievementType[] | undefined) => {
  //   return achievementDatas && achievementDatas.reduce((pre, cur) => pre + (Number(cur.weight) || 0), 0);
  // };

  const handleOpenSavePopup = () => {
    setReject(false);
    form.validateFields(['commentRejectEvaluator', 'commentReject']);
    handleOpenSavePopup17NoSkill({
      store,
      statusEvaluation,
      handleMoveToTab,
      form,
      setOpen,
      isEvaluationDate,
      dispatch,
    });

    // // ** Apply for status 0, 1
    // if ([0, 1, 2].some((v) => v === statusEvaluation)) {
    //   // ** Check achievement skill
    //   const isErrorAchievementData = hasOwnPropertyArray(
    //     store.achievementDatas,
    //     ['title', 'achievementValue', 'method', 'weight', 'difficultyUser'],
    //     true,
    //     [
    //       { key: 'title', maxLength: 200 },
    //       { key: 'achievementValue', maxLength: 200 },
    //       { key: 'method', maxLength: 500 },
    //     ],
    //   );
    //   const isErrorPercentAchievement = calculatorAchievement(store.achievementDatas) !== 100;
    //   if (isErrorAchievementData) handleMoveToTab('2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    //   else if (isErrorPercentAchievement) {
    //     dispatch(setFocusAchievementPersonalError(true));
    //     handleMoveToTab('2', t('MESSAGE.COMMON.IDS_EQUAL_100_POINT') as string);
    //   }
    //   if (!isErrorAchievementData && !isErrorPercentAchievement)
    //     form
    //       .validateFields()
    //       .then(() => setOpen(true))
    //       .catch(() => handleMoveToTab('2', t('MESSAGE.COMMON.IDM_TAB_ERROR')));
    // }
    // // ** Apply for status 50, 51, 52
    // if ([50, 51, 52].some((v) => v === statusEvaluation) && isEvaluationDate) {
    //   const hasOwnPropertyBehavior = hasOwnPropertyArray(store.evaluationBehaviorSkills, [
    //     'title',
    //     'content',
    //     'difficulty',
    //     'pointUser',
    //   ]);
    //   const hasOwnPropertyAchievement = hasOwnPropertyArrayAchievement(
    //     store.achievementDatas?.filter((f) => f.achievementStatus !== '小計'),
    //     ['achievementStatus', 'reasonComment', 'actionPlan', 'pointUser'],
    //     true,
    //     [
    //       { key: 'reasonComment', maxLength: 500 },
    //       { key: 'actionPlan', maxLength: 500 },
    //     ],
    //   );
    //   const hasOwnPropertyAchievementAdd =
    //     store.achievementAdditionals.length > 0 &&
    //     hasOwnPropertyArray(
    //       store.achievementAdditionals,
    //       ['titleAdditional', 'achievementStatus', 'reasonComment', 'pointUser'],
    //       true,
    //       [
    //         { key: 'titleAdditional', maxLength: 500 },
    //         { key: 'reasonComment', maxLength: 500 },
    //       ],
    //     );
    //   const hasMaxLengthCommentUserError = form.getFieldValue('commentUser')?.length > 500;
    //   const hasMinLengthCommentUserError =
    //     !form.getFieldValue('commentUser') || form.getFieldValue('commentUser').length === 0;
    //   if (hasOwnPropertyBehavior) handleMoveToTab('4', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    //   else if (hasOwnPropertyAchievement) handleMoveToTab('2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    //   else if (hasOwnPropertyAchievementAdd) handleMoveToTab('5', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    //   else if (hasMaxLengthCommentUserError || hasMinLengthCommentUserError)
    //     handleMoveToTab('6', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    //   if (
    //     !hasOwnPropertyBehavior &&
    //     !hasOwnPropertyAchievement &&
    //     !hasOwnPropertyAchievementAdd &&
    //     !hasMaxLengthCommentUserError &&
    //     !hasMinLengthCommentUserError
    //   ) {
    //     form
    //       .validateFields()
    //       .then(() => setOpen(true))
    //       .catch(() => {
    //         const hasOwnPropertyAchievementAdd = hasOwnPropertyArray(
    //           store.achievementAdditionals,
    //           ['titleAdditional', 'achievementStatus', 'reasonComment', 'pointUser'],
    //           true,
    //           [
    //             { key: 'titleAdditional', maxLength: 500 },
    //             { key: 'reasonComment', maxLength: 500 },
    //           ],
    //         );
    //         hasOwnPropertyAchievementAdd && handleMoveToTab('5', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    //       });
    //   }
    // }
    // // ** Apply for status 53, 54, 55
    // if ([54, 55].some((v) => v === statusEvaluation) && isEvaluationDate) {
    //   const hasOwnPropertyAchievement = hasOwnPropertyArray(
    //     store.achievementDatas?.filter((f) => f.achievementStatus !== '小計'),
    //     ['pointEvaluator05'],
    //   );
    //   const hasOwnPropertyBehavior = hasOwnPropertyArray(store.evaluationBehaviorSkills, ['pointEvaluator05']);
    //   const hasOwnPropertyAchievementAdd =
    //     store.achievementAdditionals.length > 0 &&
    //     hasOwnPropertyArray(store.achievementAdditionals, ['pointEvaluator05']);
    //   const hasMaxLengthCommentPublicError = form.getFieldValue('comment05Public')?.length > 500;
    //   const hasMaxLengthCommentPrivateError = form.getFieldValue('comment05Private')?.length > 500;
    //   const hasMinLengthCommentPublicError =
    //     !form.getFieldValue('comment05Public') || form.getFieldValue('comment05Public').length === 0;
    //   if (hasOwnPropertyBehavior) handleMoveToTab('4', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    //   else if (hasOwnPropertyAchievement) handleMoveToTab('2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    //   else if (hasOwnPropertyAchievementAdd) handleMoveToTab('5', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    //   else if (hasMaxLengthCommentPublicError || hasMaxLengthCommentPrivateError || hasMinLengthCommentPublicError)
    //     handleMoveToTab('6', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    //   if (
    //     !hasOwnPropertyBehavior &&
    //     !hasOwnPropertyAchievement &&
    //     !hasOwnPropertyAchievementAdd &&
    //     !hasMaxLengthCommentPublicError &&
    //     !hasMaxLengthCommentPrivateError &&
    //     !hasMinLengthCommentPublicError
    //   ) {
    //     form
    //       .validateFields()
    //       .then(() => setOpen(true))
    //       .catch(() => handleMoveToTab('2', t('MESSAGE.COMMON.IDM_TAB_ERROR')));
    //   }
    // }
    // // ** Apply for status 56, 57, 58
    // if ([57, 58].some((v) => v === statusEvaluation) && isEvaluationDate) {
    //   const hasOwnPropertyAchievement = hasOwnPropertyArray(
    //     store.achievementDatas?.filter((f) => f.achievementStatus !== '小計'),
    //     ['pointEvaluator1'],
    //   );
    //   const hasOwnPropertyBehavior = hasOwnPropertyArray(store.evaluationBehaviorSkills, ['pointEvaluator1']);
    //   const hasOwnPropertyAchievementAdd =
    //     store.achievementAdditionals.length > 0 &&
    //     hasOwnPropertyArray(store.achievementAdditionals, ['pointEvaluator1']);
    //   const hasMaxLengthCommentPublicError = form.getFieldValue('comment1Public')?.length > 500;
    //   const hasMaxLengthCommentPrivateError = form.getFieldValue('comment1Private')?.length > 500;
    //   const hasMinLengthCommentPublicError =
    //     !form.getFieldValue('comment1Public') || form.getFieldValue('comment1Public').length === 0;
    //   if (hasOwnPropertyBehavior) handleMoveToTab('4', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    //   else if (hasOwnPropertyAchievement) handleMoveToTab('2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    //   else if (hasOwnPropertyAchievementAdd) handleMoveToTab('5', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    //   else if (hasMaxLengthCommentPublicError || hasMaxLengthCommentPrivateError || hasMinLengthCommentPublicError)
    //     handleMoveToTab('6', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    //   if (
    //     !hasOwnPropertyBehavior &&
    //     !hasOwnPropertyAchievement &&
    //     !hasOwnPropertyAchievementAdd &&
    //     !hasMaxLengthCommentPublicError &&
    //     !hasMaxLengthCommentPrivateError &&
    //     !hasMinLengthCommentPublicError
    //   ) {
    //     form
    //       .validateFields()
    //       .then(() => setOpen(true))
    //       .catch(() => handleMoveToTab('2', t('MESSAGE.COMMON.IDM_TAB_ERROR')));
    //   }
    // }
    // // ** Apply for status 59, 60, 61
    // if ([60, 61].some((v) => v === statusEvaluation) && isEvaluationDate) {
    //   const hasOwnPropertyAchievement = hasOwnPropertyArray(
    //     store.achievementDatas?.filter((f) => f.achievementStatus !== '小計'),
    //     ['pointEvaluator2'],
    //   );
    //   const hasOwnPropertyBehavior = hasOwnPropertyArray(store.evaluationBehaviorSkills, ['pointEvaluator2']);
    //   const hasOwnPropertyAchievementAdd =
    //     store.achievementAdditionals.length > 0 &&
    //     hasOwnPropertyArray(store.achievementAdditionals, ['pointEvaluator2']);
    //   const hasMaxLengthCommentPublicError = form.getFieldValue('comment2Public')?.length > 500;
    //   const hasMaxLengthCommentPrivateError = form.getFieldValue('comment2Private')?.length > 500;
    //   const hasMinLengthCommentPublicError =
    //     !form.getFieldValue('comment2Public') || form.getFieldValue('comment2Public').length === 0;
    //   if (hasOwnPropertyBehavior) handleMoveToTab('4', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    //   else if (hasOwnPropertyAchievement) handleMoveToTab('2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    //   else if (hasOwnPropertyAchievementAdd) handleMoveToTab('5', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    //   else if (hasMaxLengthCommentPublicError || hasMaxLengthCommentPrivateError || hasMinLengthCommentPublicError)
    //     handleMoveToTab('6', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
    //   if (
    //     !hasOwnPropertyBehavior &&
    //     !hasOwnPropertyAchievement &&
    //     !hasOwnPropertyAchievementAdd &&
    //     !hasMaxLengthCommentPublicError &&
    //     !hasMaxLengthCommentPrivateError &&
    //     !hasMinLengthCommentPublicError
    //   ) {
    //     form
    //       .validateFields()
    //       .then(() => setOpen(true))
    //       .catch(() => handleMoveToTab('2', t('MESSAGE.COMMON.IDM_TAB_ERROR')));
    //   }
    // }
  };

  // ** Handle Submit/Save Dratf
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

  // ** 3 Bottom Button
  const handleApprovalHistory = () =>
    window.open(
      `${window.location.origin}${urlCompanyCode()}/${
        isF5 ? 'admin-evaluation' : isEvaluatorUser ? 'user' : isReview ? 'reference-review' : 'evaluator'
      }/evaluation/${id}/approval-history${
        isReview
          ? `?isReview=${isReview}&typeReview=${encrypt(typeReview.toString())}}${
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
  const isDisplayButton = isEditUserEvaluation || isEditEvaluation05 || isEditEvaluation1 || isEditEvaluation2;

  // **

  return (
    <div style={{ position: 'relative', paddingBottom: 20, height: '100%' }}>
      {contextHolder}
      {!dataSources ? (
        <LoadingScreenComponent />
      ) : (
        <>
          <UserEvaluationInforComponent
            {...{ ...dataSources }}
            status={statusEvaluation}
            isEvaluationDate={isEvaluationDate}
            header={t('IDS_DETAIL_EVALUATION')}
            isEvaluatorUser={isEvaluatorUser}
            evaluatorOrder={dataSources?.evaluatorOrder}
            isF5={isF5}
            isReview={isReview}
          />
          <SettingLevelComponentNoSkill
            {...dataSources}
            {...checkedProps}
            pointSettingLevel={dataSources.pointSettingLevel}
            handleDownload={handleDownload}
            isLoading={isLoading}
            statusEvaluation={statusEvaluation}
            isEvaluatorUser={isEvaluatorUser}
            isDisplayUserEvaluator={isDisplayUserEvaluator}
            isF5={isF5}
            pdfId={id}
            fullName={dataSources.fullName}
            financialYear={dataSources.fiscalYear}
            isReview={isReview}
          />
          <Form
            form={form}
            initialValues={{ commentUser: dataSources.commentUser, ...dataSources.comment }}
            preserve={false}
          >
            {' '}
            {isReview && typeReview === 3 ? (
              <></>
            ) : (
              <TabEvaluationComponentNoSkill
                {...dataSources}
                {...props}
                {...checkedProps}
                achievementDatas={dataSources.userEvaluationAchievements}
                tabId={tabId}
                handleSetActiveKey={handleSetActiveKey}
                isF5={isF5}
                level={dataSources.evaluationLevel}
                openNotification={openNotification}
                isLoading={isLoading}
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

export default Evaluation17NoSkill;
