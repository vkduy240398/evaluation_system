/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/naming-convention */
import { Space, Tabs, Form, message, notification, Typography, Affix, Radio, Card, Badge } from 'antd';
import React, { useEffect, useState } from 'react';
import download from 'downloadjs';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import EvaluationComment from '../../../views/user/evaluation-8-10/components/evaluationComment';
import TotalComp8 from '../../../views/user/evaluation-8-10/TotalComp8';
import EvaluationGoalDepartment from '../../../views/user/evaluation-8-10/components/evaluationGoalDepartment';
import EvaluationAdditionalDepartment from '../../../views/user/evaluation-8-10/components/evaluationAdditionalDepartment';
import httpAxios from '../../../common/http';
import UserEvaluationInfoComponent from '../../../views/user/evaluation/UserEvaluationInforComponent';
import ButtonComponent from '../../../views/user/evaluation-8-10/components/buttonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import {
  checkWeight,
  checkWeight2,
  display05Total,
  display1Total,
  display2Total,
  displayAdditionTotal,
  displayAdditionTotal05,
  displayAdditionTotal1,
  displayAdditionTotal2,
  displayUserTotal,
  setDefaultActiveKey,
  setDisabled,
  setHasEvaluator2,
  setMaxOrder,
  setMode1,
  setMode2,
  setMode3,
  setOpenPopUp,
  setUpdatedTime,
  userEvaluationPersonalGoalsList,
} from '../../../store/total';
import { useAuth } from '../../../hooks/useAuth';
import { t } from 'i18next';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import { compareDatePeriod, decrypt, urlCompanyCode } from '../../../common/util';
import { validateTableSubColumn } from '../../../views/user/evaluation-8-10/components/valildateInputField';
import LoadingScreenComponent from '../../../views/loading/LoadingScreenComponent';
import { roundNumber } from '../../../views/user/evaluation-8-10/checkDisplayCondition';
import evaluationDetailApiService from '../../../common/api/evaluation8-10';
import { Buffer } from 'buffer';
import { statusEvaluationType } from '../../../common/status';
import {
  CommentContent,
  EvaluationAdditionalAchievement,
  EvaluationInfo,
  EvaluationPersonalAchievement,
  EvaluationPersonalAchievementOfUser,
  EvaluationResponse,
  EvaluatorInfo,
  SettingAchievementAdditional,
  SettingAchievementPersonal,
  SettingFormula810,
  SubList,
  UserInfo,
} from '../../../views/user/evaluation-8-10/interfaces/response.interface';
import PrintDetailReview810 from '../../evaluation-print-review/evaluation-detail8-10/printDetailReview8-10';
import BasicSkillComponent810 from '../../../views/user/evaluation-8-10/BasicSkillComponent';
import {
  PointListBehaviors,
  UserEvaluationBasicBehaviorType,
  UserEvaluationToProSkillType,
} from '../../../types/pages/user-evaluation/UserEvaluationType';
import EvaluationPersonalGoals from '../../../views/user/evaluation-8-10/components/EvaluationPersonalGoals';
import ProSkillComponent810 from '../../../views/user/evaluation-8-10/components/ProSkillComponent810';
import AchievementAdditionalComponent810 from '../../../views/user/evaluation-8-10/components/AchievementAdditionalComponent810';
import { handleCheckDisplayUserOnScreen } from '../../../views/user/evaluation/process/handleCheckDisplay';
import {
  setAdditionalOptions,
  setBasicSkillPointOptions,
  setBehaviorSkillPointOptions,
  setProSkillPointOptions,
  userEvaluationAchievement,
  userEvaluationBasicSkill,
  userEvaluationBehaviorSkill,
  userEvaluationSetSettingProFormula,
} from '../../../store/userEvaluation';
import SettingLevelComponent810 from '../../../views/user/evaluation/process/SettingLevelComponent810';
import userEvaluationApiService from '../../../common/api/userEvaluation';
import { handleCheckValidatePersonal810 } from './handle-check-validate-pesonal-810/handleCheckValidatePersonal810';
import BehaviorTabComponent810 from '../../../views/user/evaluation-8-10/components/BehaviorTabComponent810';
import AchievementPersonalTab from '../../../views/user/evaluation-8-10/components/AchievementPersonalTab';
import { setDetailLoading } from '../../../store/loading';

interface RecordInfo {
  id: number;
  userInfo: any;
  statusNo: statusEvaluationType;
  status: statusEvaluationType;
  evaluationId: number;
  evaluatorOrderExcep?: number;
}
const Evaluation810HaveSkill: React.FC<any> = (props: { role: string }) => {
  const Location = useLocation();
  const navigate = useNavigate();
  const { role } = props;
  const { user } = useAuth();
  const { id } = useParams();
  const [form] = Form.useForm();
  const store = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();

  const isEvaluatorUser = role === 'user';

  const isF5 = role === 'admin';
  const isReview = role === 'reviewer';
  const state = Location.state;
  const typeReview = Location.state?.type;
  const recordInfo = Location.state as RecordInfo;

  const evaluationId = Number(state?.id);

  const [allowSeeList, setAllSeeList] = React.useState<EvaluatorInfo[]>([]);

  const [dataSub, setDataSub] = useState([] as SubList[]);

  const [dataSource, setDataSource] = React.useState<EvaluationPersonalAchievement[]>([]);

  const [additionData, setAdditionData] = React.useState<EvaluationAdditionalAchievement[]>([]);

  const [commentData, setCommentData] = React.useState({} as CommentContent);

  const [checkList, setCheckList] = React.useState<EvaluatorInfo[]>([]);

  const [status, setStatus] = React.useState(
    role === 'user' ? recordInfo?.statusNo : (recordInfo?.status as statusEvaluationType),
  );

  // const [status, setStatus] = React.useState<any>(100);

  const [commonInfo, setRecordInfo] = React.useState<UserInfo>(Location.state ?? []);

  const [listEvalutor, setListEvaluator] = React.useState<EvaluatorInfo[]>([]);

  const [approveRejectContent, setApproveRejectContent] = React.useState('');

  const [ownerId, setOwnerId] = React.useState<number>();

  const [isEvaluationDate, setEvaluationDate] = useState<boolean>(false);

  const [isGoalDate, setGoalDate] = useState<boolean>(false);

  const [isOpenSubmitPop, setOpenSubmitPop] = React.useState<boolean>(false);

  const [isOpenApprovePop, setOpenApprovePop] = React.useState<boolean>(false);

  const [open, setOpen] = useState(false);

  const [isLoading, setLoading] = React.useState<boolean>(false);

  const [isLoadingData, setLoadingData] = React.useState(true);

  const [api, contextHolder] = notification.useNotification();

  const [defaultExpandedRowKeys, setDefaultExpandedRowKeys] = React.useState<number[]>([0]);

  const [errorExpandedRowKeys, setErrorExpandedRowKeys] = React.useState<number[]>([]);

  const [selectedOrder, setSelectedOrder] = React.useState('');

  const [errorRowIndexList, setErrorRowIndex] = React.useState<number[]>([]);

  const [ExpandedRowKeys2, setExpandedRowKeys2] = React.useState<number[]>([]);

  const [evaluationData, setEvaluationData] = React.useState({} as EvaluationInfo);
  const [listSumaryPercent, setListSumaryPercent] = React.useState({} as any);

  const [settingAchievementAdditional, setSettingAchievementAdditional] = React.useState(
    {} as SettingAchievementAdditional[],
  );

  const [settingAchievementPersonalType1, setSettingAchievementPersonalType1] = React.useState(
    {} as SettingAchievementPersonal[],
  );

  const [settingAchievementPersonalType2, setSettingAchievementPersonalType2] = React.useState(
    {} as SettingAchievementPersonal[],
  );

  const [settingAchievementPersonalType3, setSettingAchievementPersonalType3] = React.useState(
    {} as SettingAchievementPersonal[],
  );

  const [settingAchievementPersonalType4, setSettingAchievementPersonalType4] = React.useState(
    {} as SettingAchievementPersonal[],
  );
  const storeSubmit = useSelector((state: RootState) => state.calculateTotal);

  const [settingFormula810, setSettingFormula810] = React.useState({} as SettingFormula810[]);
  const [childrenTabs, setChildrenTabs] = useState<string>('1');
  const [childrenTabs2, setChildrenTabs2] = useState<string>(
    status > 50 || (status >= 50 && isEvaluationDate) ? '3' : '1',
  );
  const [isAffixed, setIsAffixed] = useState<boolean>();
  const [achievementAdditionalNew, setAchievementAdditionalNew] = useState<any[]>([]);
  const [optionPdfList, setOptionPdfList] = useState({
    orientation: 'p',
    size: 'a4',
  });
  const [dataSources, setDataSources] = useState<EvaluationResponse>();
  const [maxPointSettingFormula810, setMaxPointSettingFormula810] = React.useState<number>();
  const [minPointSettingFormula810, setMinPointSettingFormula810] = React.useState<number>();
  const [basicSkill, setBasicSkill] = useState<UserEvaluationBasicBehaviorType[]>([]);
  const [behavior, setBehavior] = useState<UserEvaluationBasicBehaviorType[]>([]);
  const [isCreationGoalDate, setCreationGoalDate] = useState<boolean>(false);
  const [personalGoalsLists, setPersonalGoalsList] = useState<EvaluationPersonalAchievementOfUser[]>([]);

  const openNotification = (msg: string) => {
    api.warning({
      message: <Typography.Title level={4}>{t('IDS_NOTIFY')}</Typography.Title>,
      description: msg,
      placement: 'bottomRight',
      duration: 3,
    });
  };
  const [parentTabs, setParentTabs] = useState<string>('1');
  const [dataListProSkill, setDataListProSkill] = useState<UserEvaluationToProSkillType[]>([]);
  const [isReject, setReject] = useState(false);

  useEffect(() => {
    setChildrenTabs2((status >= 50 && isEvaluationDate) || status >= 51 || (isReview && typeReview > 3) ? '3' : '1');
  }, [isEvaluationDate]);

  useEffect(() => {
    const callback = (data: any[]) => {
      if (data && data.length > 0) {
        const options = data.map((v) => ({ value: v.point, label: v.rating }));
        dispatch(setAdditionalOptions(options));
      }

      setLoading(false);
    };
    userEvaluationApiService.getAchievementAddPublic({
      achievementType: 2,
      callback,
      isEvaluatorUser,
      isF5: isF5,
      type: 2,
    });
  }, [id, state]);

  // ** Hidden button 項目選択(Add pro skill modal) of 専門スキル && Hidden button 追加(Add new row) when this evaluation display for the user created
  const isHiddenButtonUserCreateContent: boolean =
    [3, 4, 5, 6, 7, 8, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 98, 99, 100, 101].includes(status) ||
    ([0, 1, 2].includes(status) && !isCreationGoalDate && isEvaluatorUser) ||
    !dataSources?.evaluatorOrderList.includes(2) ||
    dataSources?.isEvaluatorException; // && isEvaluatorUser;

  // ** Hidden button 項目選択(Add pro skill modal) of 専門スキル && Hidden button 追加(Add new row) when this evaluation display for the evaluator 0.5, 1, 2
  const isHiddenButtonEvaluator: boolean = [0, 1, 2].includes(status) && !isEvaluatorUser;

  // 項目選択(Add pro skill modal) -> Hiển thị khi role user log và trong thời gian đặt mục tiêu và đánh giá (status [0,1,2,50,51,52])
  const isButtonAddProSkillDisplayIsEvaluationGoals =
    [0, 1, 2].includes(status) && isEvaluatorUser && isCreationGoalDate;
  const isButtonAddProSkillDisplayIsEvalutenGoals =
    [50, 51, 52].includes(status) && isEvaluatorUser && isEvaluationDate;
  const isHiddenAddProSkillInCreateAndEvaluateGoal: boolean =
    isButtonAddProSkillDisplayIsEvaluationGoals || isButtonAddProSkillDisplayIsEvalutenGoals;

  useEffect(() => {
    if (!isReview) {
      if (!Location.state || Location.state === null) {
        if (decrypt(id?.toString() || '') === undefined) {
          backToListScreen();
        } else {
          checkPermission();
        }
      } else {
        processData(true);
      }
    } else {
      if (!Location.state || Location.state === null) backToListScreen();
      else processData(true);
    }
    dispatch(setDefaultActiveKey('1'));
    dispatch(checkWeight2(true));
  }, [Location.state, evaluationId]);
  const {
    isDisplayEvaluator05,
    isDisplayEvaluator1,
    isDisplayEvaluator2,
    isEditEvaluation05,
    isEditEvaluation1,
    isEditEvaluation2,
    isDisplayUserEvaluator, // time in evaluation time
    isEditUserEvaluation,
  } = handleCheckDisplayUserOnScreen({
    statusEvaluation: status,
    isEvaluationDate,
    evaluatorOrderList: dataSources?.evaluatorOrderList || [],
    isEvaluatorException: dataSources?.isEvaluatorException || false,
    evaluatorOrder: Number(dataSources?.maxOrder) || 0,
    isEvaluatorUser,
    isNotEvaluator2: isF5 || !dataSources?.evaluatorOrderList.includes(2) || false,
    isF5: isF5,
    isReview: isReview,
    typeReview: typeReview,
    newestOrder: recordInfo?.evaluatorOrderExcep || 0,
  });

  // ** Change text 入力 || 参照
  const isChangeTextInputEx =
    ([0, 1, 2].includes(status) && isEvaluatorUser && isGoalDate) ||
    isEditUserEvaluation ||
    isEditEvaluation05 ||
    isEditEvaluation1 ||
    isEditEvaluation2
      ? t('IDS_INPUT')
      : t('IDS_REFERENCE');

  // ** Change text 入力 || 参照
  const isChangeTextInput =
    isEditUserEvaluation || isEditEvaluation05 || isEditEvaluation1 || isEditEvaluation2
      ? t('IDS_INPUT')
      : t('IDS_REFERENCE');

  const listEvaluation8Tmp: {
    key: string;
    component: any;
    forceRender?: boolean;
    index: number;
    type: number;
    title: JSX.Element | any;
  }[] = [
    {
      key: '1',
      title: (
        <Badge count={isChangeTextInputEx} offset={[-50, -12]}>
          {isDisplayUserEvaluator ? t('IDS_DEPARTMENT_RESULTS') : t('IDS_GOAL_DEPARTMENT')}
        </Badge>
      ),
      component: (
        <EvaluationGoalDepartment
          setDataSource={setDataSource}
          dataSource={dataSource}
          status={status}
          role={role}
          level={'8-10'}
          dataSub={dataSub}
          setDataSub={setDataSub}
          allowSeeList={allowSeeList}
          Form={Form}
          form={form}
          defaultExpandedRowKeys={defaultExpandedRowKeys}
          setDefaultExpandedRowKeys={setDefaultExpandedRowKeys}
          isEvaluationDate={isEvaluationDate}
          isGoalDate={isGoalDate}
          errorExpandedRowKeys={errorExpandedRowKeys}
          listEvalutor={listEvalutor}
          errorRowIndexList={errorRowIndexList}
          setExpandedRowKeys2={setExpandedRowKeys2}
          ExpandedRowKeys2={ExpandedRowKeys2}
          settingAchievementPersonalType1={settingAchievementPersonalType1}
          settingAchievementPersonalType2={settingAchievementPersonalType2}
          isLoading={isLoading}
          location={recordInfo}
          isReview={isReview}
          setLoading={setLoading}
          evaluationData={evaluationData}
        />
      ),
      index: 1,
      type: 0,
    },

    {
      title: (
        <Badge count={isChangeTextInput} offset={[-85, -12]}>
          {t('IDS_ACHIEVEMENT_ADDITIONAL')}
        </Badge>
      ),
      key: '2',
      component: (
        <EvaluationAdditionalDepartment
          status={status}
          role={role}
          additionData={additionData}
          setAdditionData={setAdditionData}
          allowSeeList={allowSeeList}
          Form={Form}
          form={form}
          listEvalutor={listEvalutor}
          isEvaluationDate={isEvaluationDate}
          settingAchievementAdditional={settingAchievementAdditional}
          achievementData={dataSource}
          isLoading={isLoading}
          location={recordInfo}
        />
      ),
      index: 1,
      type: 1,
    },
    {
      title: (
        <Badge count={isChangeTextInput} offset={[-85, -12]}>
          {t('IDS_COMMENT')}
        </Badge>
      ),
      key: '3',
      component: (
        <EvaluationComment
          status={status}
          role={role}
          commentData={commentData}
          listEvalutor={listEvalutor}
          setCommentData={setCommentData}
          allowSeeList={allowSeeList}
          maxOrder={store.calculateTotal.maxOrder}
          Form={Form}
          form={form}
          isDisable={store.calculateTotal.isDisable}
          isEvaluationDate={isEvaluationDate}
          store={store.calculateTotal}
          isReview={isReview}
          typeReview={typeReview}
          isLoading={isLoading}
          location={recordInfo}
        />
      ),
      index: 1,
      type: 1,
    },
    {
      key: '3',
      title: (
        <Badge count={isChangeTextInput} offset={[-65, -12]}>
          {t('IDS_BASIC_SKILL')}
        </Badge>
      ),
      component: (
        <BasicSkillComponent810
          evaluationBasicSkills={basicSkill}
          isDisplayEvaluator05={isDisplayEvaluator05}
          isDisplayEvaluator1={isDisplayEvaluator1}
          isDisplayEvaluator2={isDisplayEvaluator2}
          isDisplayUserEvaluator={isDisplayUserEvaluator}
          isEditEvaluation05={isEditEvaluation05}
          isEditEvaluation1={isEditEvaluation1}
          isEditEvaluation2={isEditEvaluation2}
          isEditUserEvaluation={isEditUserEvaluation}
          isEvaluatorUser={isEvaluatorUser}
          statusEvaluation={status}
          isF5={isF5}
          isEvaluationDate={isEvaluationDate}
          openNotification={openNotification}
          pointUser={dataSources?.results.evaluationList.basicTotalPointUser}
          pointEvaluator05={dataSources?.results.evaluationList.basicTotalPointEvaluator05}
          pointEvaluator1={dataSources?.results.evaluationList.basicTotalPointEvaluator1}
          pointEvaluator2={dataSources?.results.evaluationList.basicTotalPointEvaluator2}
          isReview={isReview}
        />
      ),
      index: 2,
      type: 0,
    },

    {
      key: '1',
      title: (
        <Badge count={isChangeTextInputEx} offset={[-65, -12]}>
          {t('IDS_PRO_SKILL')}
        </Badge>
      ),

      component: (
        <ProSkillComponent810
          dataList={dataListProSkill}
          setDataSource={setDataListProSkill}
          keyPassProSkill={dataListProSkill.map((e) => e.key)}
          openNotification={openNotification}
          evaluationId={evaluationId}
          isDisplayEvaluator05={isDisplayEvaluator05}
          isDisplayEvaluator1={isDisplayEvaluator1}
          isDisplayEvaluator2={isDisplayEvaluator2}
          isDisplayUserEvaluator={isDisplayUserEvaluator}
          isEditEvaluation05={isEditEvaluation05}
          isEditEvaluation1={isEditEvaluation1}
          isEditEvaluation2={isEditEvaluation2}
          isEditUserEvaluation={isEditUserEvaluation}
          isEvaluatorUser={isEvaluatorUser}
          statusEvaluation={status}
          isF5={isF5}
          isHiddenButtonEvaluator={isHiddenButtonEvaluator}
          isHiddenButtonUserCreateContent={isHiddenButtonUserCreateContent}
          isEvaluationDate={isEvaluationDate}
          pointUser={dataSources?.results.evaluationList.proTotalPointUser}
          pointEvaluator05={dataSources?.results.evaluationList.proTotalPointEvaluator05}
          pointEvaluator1={dataSources?.results.evaluationList.proTotalPointEvaluator1}
          pointEvaluator2={dataSources?.results.evaluationList.proTotalPointEvaluator2}
          evaluatorOrder={dataSources?.maxOrder}
          isHiddenAddProSkillInCreateAndEvaluateGoal={isHiddenAddProSkillInCreateAndEvaluateGoal}
          form={form}
        />
      ),
      index: 2,
      type: 0,
    },

    {
      title: (
        <Badge count={isChangeTextInput} offset={[-65, -12]}>
          {t('IDS_BEHAVIOR')}
        </Badge>
      ),
      key: '4',
      component: (
        <BehaviorTabComponent810
          // evaluationBehaviorSkills={behavior}
          isDisplayEvaluator05={isDisplayEvaluator05}
          isDisplayEvaluator1={isDisplayEvaluator1}
          isDisplayEvaluator2={isDisplayEvaluator2}
          isDisplayUserEvaluator={isDisplayUserEvaluator}
          isEditEvaluation05={isEditEvaluation05}
          isEditEvaluation1={isEditEvaluation1}
          isEditEvaluation2={isEditEvaluation2}
          isEditUserEvaluation={isEditUserEvaluation}
          isEvaluatorUser={isEvaluatorUser}
          level={user?.level || 8}
          openNotification={openNotification}
          statusEvaluation={status}
          isF5={isF5}
          isNoSkill={false}
          pointUser={dataSources?.results.evaluationList.behaviorTotalPointUser}
          pointEvaluator05={dataSources?.results.evaluationList.behaviorTotalPointEvaluator05}
          pointEvaluator1={dataSources?.results.evaluationList.behaviorTotalPointEvaluator1}
          pointEvaluator2={dataSources?.results.evaluationList.behaviorTotalPointEvaluator2}
          isEvaluationDate={isEvaluationDate}
        />
      ),
      index: 2,
      type: 0,
    },

    {
      title: (
        <Badge count={isChangeTextInputEx} offset={[-50, -12]}>
          {isDisplayUserEvaluator ? t('IDS_PERSONAL_RESULT') : t('IDS_ACHIEVEMENT_PERSONAL')}
        </Badge>
      ),
      key: '2',
      component: (
        <AchievementPersonalTab
          achievementDatas={store.userEvaluation.achievementDatas || []}
          evaluatorOrder={Number(dataSources?.maxOrder) || 0}
          evaluatorOrderList={dataSources?.evaluatorOrderList || []}
          isDisplayEvaluator05={isDisplayEvaluator05}
          isDisplayEvaluator1={isDisplayEvaluator1}
          isDisplayEvaluator2={isDisplayEvaluator2}
          isDisplayUserEvaluator={isDisplayUserEvaluator}
          isEditEvaluation05={isEditEvaluation05}
          isEditEvaluation1={isEditEvaluation1}
          isEditEvaluation2={isEditEvaluation2}
          isEditUserEvaluation={isEditUserEvaluation}
          isEvaluatorUser={isEvaluatorUser}
          isHiddenButtonEvaluator={isHiddenButtonEvaluator}
          isHiddenButtonUserCreateContent={isHiddenButtonUserCreateContent}
          isNotEvaluator2={!dataSources?.evaluatorOrderList.includes(2)}
          openNotification={openNotification}
          statusEvaluation={status}
          pointUser={dataSources?.results.evaluationList.achievementPersonalTotalPointUser}
          pointEvaluator05={dataSources?.results.evaluationList.achievementPersonalTotalPointEvaluator05}
          pointEvaluator1={dataSources?.results.evaluationList.achievementPersonalTotalPointEvaluator1}
          pointEvaluator2={dataSources?.results.evaluationList.achievementPersonalTotalPointEvaluator2}
          isF5={isF5}
          evaluationData={evaluationData}
          setPersonalGoalsList={setPersonalGoalsList}
        />
      ),
      index: 2,
      type: 0,
    },

    {
      title: (
        <Badge count={isChangeTextInput} offset={[-85, -12]}>
          {t('IDS_ACHIEVEMENT_ADDITIONAL')}
        </Badge>
      ),
      key: '5',
      component: (
        <AchievementAdditionalComponent810
          achievementAdditionalTotalPointEvaluator05={
            dataSources?.results.evaluationList.achievementAdditionalTotalPointEvaluator05
          }
          achievementAdditionalTotalPointEvaluator1={
            dataSources?.results.evaluationList.achievementAdditionalTotalPointEvaluator1
          }
          achievementAdditionalTotalPointEvaluator2={
            dataSources?.results.evaluationList.achievementAdditionalTotalPointEvaluator2
          }
          achievementAdditionalTotalPointUser={dataSources?.results.evaluationList.achievementAdditionalTotalPointUser}
          achievementAdditionals={achievementAdditionalNew}
          isDisplayEvaluator05={isDisplayEvaluator05}
          isDisplayEvaluator1={isDisplayEvaluator1}
          isDisplayEvaluator2={isDisplayEvaluator2}
          isDisplayUserEvaluator={isDisplayUserEvaluator}
          isEditEvaluation05={isEditEvaluation05}
          isEditEvaluation1={isEditEvaluation1}
          isEditEvaluation2={isEditEvaluation2}
          isEditUserEvaluation={isEditUserEvaluation}
          isEvaluatorUser={isEvaluatorUser}
          isF5={isF5}
          form={form}
          status={status}
        />
      ),
      index: 2,
      type: 1,
    },
  ];
  let listEvaluation = listEvaluation8Tmp;
  let listBlock2 = listEvaluation8Tmp.filter((e: any) => e.index === 2);
  let listBlock1 = listEvaluation8Tmp.filter((e: any) => e.index === 1);
  if (
    // !(
    //   status >= 50 &&
    //   compareDatePeriod(
    //     evaluationData?.dateEvaluationStart || evaluationData?.evaluationPeriod?.dateEvaluationDepartmentStart,
    //     evaluationData?.dateEvaluationEnd || evaluationData?.evaluationPeriod?.dateEvaluationDepartmentEnd,
    //   )
    // )
    status < 50 ||
    (status === 50 &&
      !compareDatePeriod(
        evaluationData?.dateEvaluationStart || evaluationData?.evaluationPeriod?.dateEvaluationDepartmentStart,
        evaluationData?.dateEvaluationEnd || evaluationData?.evaluationPeriod?.dateEvaluationDepartmentEnd,
      ))
  ) {
    listBlock2 = listBlock2.filter((e: any) => e.type === 0).sort((a, b) => Number(a.key) - Number(b.key));
    listBlock1 = listBlock1.filter((e: any) => e.type === 0);
  }

  const isEvaluation =
    status > 50 ||
    (status >= 50 &&
      compareDatePeriod(
        evaluationData?.dateEvaluationStart || evaluationData?.evaluationPeriod?.dateEvaluationDepartmentStart,
        evaluationData?.dateEvaluationEnd || evaluationData?.evaluationPeriod?.dateEvaluationDepartmentEnd,
      ));

  const tabsParents = [
    {
      key: '1',
      title: (
        <Typography.Text>
          {isEvaluation ? t('IDS_DIVISION_EVALUATION') : t('IDS_GOAL_DEPARTMENT')}
          {/* <Tooltip overlayStyle={{ whiteSpace: 'pre-line' }} title="quan trọng">
            <InfoCircleOutlined style={{ paddingLeft: 2 }} />
          </Tooltip> */}
        </Typography.Text>
      ),
      forceRender: true,
      component: (
        <Tabs
          type="card"
          defaultActiveKey={childrenTabs}
          activeKey={childrenTabs}
          onChange={(e) => setChildrenTabs(e)}
          items={listBlock1.map((_: any, i: any) => {
            return {
              label: (
                <>
                  <span>{listBlock1[i].title}</span>
                </>
              ),
              key: listBlock1[i].key,
              children: listBlock1[i].component,
              forceRender: true,
            };
          })}
        />
      ),
    },
    {
      key: '2',

      title: (
        <Typography.Text>{isEvaluation ? t('IDS_EVALUATION_PERSONAL') : t('IDS_ACHIEVEMENT_PERSONAL')}</Typography.Text>
      ),
      component: (
        <Tabs
          type="card"
          defaultActiveKey={childrenTabs2}
          onChange={(e) => setChildrenTabs2(e)}
          activeKey={childrenTabs2}
          items={listBlock2.map((_: any, i: any) => {
            return {
              label: (
                <>
                  <span>{listBlock2[i].title}</span>
                </>
              ),
              key: listBlock2[i].key,
              children: listBlock2[i].component,
              forceRender: true,
            };
          })}
        />
      ),
    },
  ];
  if (status < 50 || (status === 50 && !isEvaluationDate)) {
    listEvaluation = listEvaluation8Tmp.filter((e: any) => e.type === 0);
  } else {
    listEvaluation = listEvaluation8Tmp;
  }

  const callbackError = () => {
    // role === 'user'
    //   ? navigate(`/user/evaluation/${evaluationId}`, {
    //       state: { ...recordInfo, id: evaluationId },
    //     })
    //   : role === 'evaluator'
    //   ? navigate(`/evaluator/evaluation/${evaluationId}`, {
    //       state: { ...recordInfo, id: evaluationId },
    //     })
    //   : navigate(`/admin-evaluation/evaluation/${evaluationId}`, {
    //       state: { ...recordInfo, id: evaluationId },
    //     });
  };
  const backTo17Screen = () => {
    role === 'user'
      ? navigate(urlCompanyCode() + `/user/evaluation/${evaluationId}`, {
          state: { ...recordInfo, id: evaluationId },
        })
      : role === 'evaluator'
      ? navigate(urlCompanyCode() + `/evaluator/evaluation/${evaluationId}`, {
          state: { ...recordInfo, id: evaluationId },
        })
      : navigate(urlCompanyCode() + `/admin-evaluation/evaluation/${evaluationId}`, {
          state: { ...recordInfo, id: evaluationId },
        });
  };

  const backToListScreen = () => {
    role === 'user'
      ? navigate(urlCompanyCode() + '/user/list-evaluation')
      : role === 'evaluator'
      ? navigate(urlCompanyCode() + '/evaluator/list-user-evaluation')
      : role === 'admin'
      ? navigate(urlCompanyCode() + '/admin-evaluation/list-user-evaluation')
      : navigate(urlCompanyCode() + '/reference-review');
  };

  const checkPermission = async () => {
    if (role === 'user') {
      await httpAxios
        .Get(`/api/v1/f1/user/check-permission/${Number(decrypt(id?.toString() || ''))}/${Number(user?.id)}`)
        .then((res) => {
          if (res && res.status === 200) {
            if (res.data) {
              navigate(`${window.location.pathname}`, {
                state: {
                  id: Number(decrypt(id?.toString() || '')),
                },
              });
            } else backToListScreen();
          }
        });
    }
    if (role === 'evaluator') {
      await httpAxios
        .Get(`/api/v1/f2/evaluator/check-permission/${Number(decrypt(id?.toString() || ''))}/${Number(user?.id)}`)
        .then((res) => {
          if (res && res.status === 200) {
            if (res.data && res.data.length) {
              navigate(`${window.location.pathname}`, {
                state: {
                  id: Number(decrypt(id?.toString() || '')),
                },
              });
            } else backToListScreen();
          }
        });
    }
  };

  const processData = async (isInitScreen = false) => {
    if (isInitScreen) {
      setLoadingData(true);
    }
    const url =
      role === 'user'
        ? `/api/v1/f1/user/evaluation8-10/${evaluationId}/${user?.id}`
        : role === 'evaluator'
        ? `/api/v1/f2/evaluator/evaluation8-10/${evaluationId}/${user?.id}`
        : role === 'admin'
        ? `/api/v1/f5/management-evaluation-history/evaluation8-10/${evaluationId}/${user?.id}`
        : `/api/v1/common/review-evaluation/detail810/${evaluationId}/${user?.id}`;
    await httpAxios.Get(url, { params: { role } }).then((res: any) => {
      if (res && res.status === 200) {
        const decode = decrypt(res.data);
        if (decode) {
          const data = JSON.parse(decode);
          if (!isReview) {
            const resData = data as EvaluationResponse;
            setBasicSkill(
              resData.evaluationBasicBehavior
                .filter((e: any) => e.versionBasicBehavior.type === 4)
                .sort((a, b) => a.itemNo - b.itemNo),
            );
            setBehavior(
              resData.evaluationBasicBehavior
                .filter((e: any) => e.versionBasicBehavior.type === 5)
                .sort((a, b) => a.itemNo - b.itemNo),
            );
            setRecordInfo(resData.userInfo);
            setDataSources(resData);
            setListSumaryPercent(resData.listSumaryPercent);

            dispatch(setDisabled(resData.isDisable));
            dispatch(setHasEvaluator2(resData.hasEvaluator2));
            dispatch(setMode1(resData.hasMode1));
            dispatch(setMode2(resData.hasMode2));
            dispatch(setMode3(resData.hasMode3));
            dispatch(setMaxOrder(resData.maxOrder));
            dispatch(
              userEvaluationBasicSkill(
                resData.evaluationBasicBehavior
                  .filter((f: any) => f.versionBasicBehavior.type === 4)
                  .sort((a, b) => a.itemNo - b.itemNo),
              ),
            );
            dispatch(
              userEvaluationBehaviorSkill(
                resData.evaluationBasicBehavior.filter((f: any) => f.versionBasicBehavior.type === 5),
              ),
            );
            setAllSeeList(
              recordInfo?.evaluatorOrderExcep
                ? resData.results.evaluationList.evaluator.filter(
                    (v) => Number(v.evaluationOrder) <= (recordInfo?.evaluatorOrderExcep || 0),
                  )
                : resData.allowSeeList,
            );
            const dataList = resData.results;

            setCreationGoalDate(
              compareDatePeriod(
                dataList?.evaluationList?.dateCreationGoalStart ||
                  dataList?.evaluationList?.evaluationPeriod?.dateCreationGoalDepartmentStart,
                dataList?.evaluationList?.dateCreationGoalEnd ||
                  dataList?.evaluationList?.evaluationPeriod?.dateCreationGoalDepartmentEnd,
              ),
            );
            setAchievementAdditionalNew(
              dataList.evaluationList.evaluationAchievementAdditionalOfUsers.map((v) => {
                return { ...v, key: `achivement-additional_${v.itemNo}` };
              }),
            );
            setDataListProSkill(dataList.evaluationList.evaluationPro);
            dispatch(
              setBasicSkillPointOptions(
                dataList.versionSetting7.settingPointBasic.map((e: any) => {
                  return { value: e.point, lable: e.point };
                }),
              ),
            );
            dispatch(
              setProSkillPointOptions(
                dataList.versionSetting7.settingPointPro.map((e: any) => {
                  return { value: e.point, lable: e.point };
                }),
              ),
            );
            dispatch(userEvaluationSetSettingProFormula(dataList.settingProFormulas));

            // Personal goals new

            const evaluationAchievementPersonalOfUsers = dataList.evaluationList
              .evaluationAchievementPersonalsOfUsers as EvaluationPersonalAchievementOfUser[];
            const subListNews = dataList.subListNews as SubList[][];
            for (let i = 0; i < evaluationAchievementPersonalOfUsers.length; i++) {
              for (let j = 0; j < subListNews?.length; j++) {
                if (subListNews[j][0]?.achievementPersonalId === evaluationAchievementPersonalOfUsers[i]?.id) {
                  evaluationAchievementPersonalOfUsers[i]['evaluationAchievementPersonalSub'] = subListNews[j];
                  evaluationAchievementPersonalOfUsers[i]['key'] = i;
                }
              }
            }
            evaluationAchievementPersonalOfUsers.sort((a, b) => {
              return a.itemNo - b.itemNo;
            });

            setPersonalGoalsList(evaluationAchievementPersonalOfUsers);
            dispatch(userEvaluationPersonalGoalsList(evaluationAchievementPersonalOfUsers));
            dispatch(userEvaluationAchievement(evaluationAchievementPersonalOfUsers));

            setEvaluationData(dataList.evaluationList);
            if (dataList.evaluationList.dateEvaluationStart && dataList.evaluationList.dateEvaluationEnd) {
              setEvaluationDate(
                compareDatePeriod(
                  dataList.evaluationList.dateEvaluationStart,
                  dataList.evaluationList.dateEvaluationEnd,
                ),
              );
            } else {
              setEvaluationDate(
                compareDatePeriod(
                  dataList.evaluationList.evaluationPeriod.dateEvaluationDepartmentStart,
                  dataList.evaluationList.evaluationPeriod.dateEvaluationDepartmentEnd,
                ),
              );
            }
            if (dataList.evaluationList.dateCreationGoalStart && dataList.evaluationList.dateCreationGoalEnd) {
              setGoalDate(
                compareDatePeriod(
                  dataList.evaluationList.dateCreationGoalStart,
                  dataList.evaluationList.dateCreationGoalEnd,
                ),
              );
            } else {
              setGoalDate(
                compareDatePeriod(
                  dataList.evaluationList.evaluationPeriod.dateCreationGoalDepartmentStart,
                  dataList.evaluationList.evaluationPeriod.dateCreationGoalDepartmentEnd,
                ),
              );
            }
            setStatus(dataList.evaluationList.status);
            dispatch(setUpdatedTime(dataList.evaluationList.updatedTime));
            setOwnerId(dataList.evaluationList.userId);
            const personalAchieLists = dataList.evaluationList
              .evaluationAchievementPersonals as EvaluationPersonalAchievement[];

            const subList = dataList.subList as SubList[][];
            for (let i = 0; i < personalAchieLists.length; i++) {
              for (let j = 0; j < subList.length; j++) {
                if (subList[j][0]?.achievementPersonalId === personalAchieLists[i]?.id) {
                  personalAchieLists[i]['evaluationAchievementPersonalSub'] = subList[j];
                  personalAchieLists[i]['key'] = i;
                }
              }

              //Open all row
              setDefaultExpandedRowKeys((preArray) => [...preArray, i]);
            }
            setListEvaluator(dataList.evaluationList.evaluator);
            dataList.evaluationList.status !== 100 && role != 'admin'
              ? setCheckList(
                  recordInfo?.evaluatorOrderExcep
                    ? dataList.evaluationList.evaluator.filter(
                        (v) => Number(v.evaluationOrder) <= (recordInfo?.evaluatorOrderExcep || 0),
                      )
                    : resData.allowSeeList,
                )
              : setCheckList(dataList.evaluationList.evaluator);

            // Set default expanded rows - all rows
            const tempRowKeyList = Array.from({ length: personalAchieLists.length }, (_value, index) => index);
            setExpandedRowKeys2(tempRowKeyList);

            dispatch(checkWeight(personalAchieLists));
            const additionDataList = dataList.evaluationList
              .evaluationAchievementAdditional as EvaluationAdditionalAchievement[];
            for (let i = 0; i < additionDataList.length; i++) {
              additionDataList[i]['key'] = i + 1;
            }
            setAdditionData(additionDataList);
            form.setFieldsValue({ commentUser: dataList.evaluationList.commentUser });
            setCommentData((state: CommentContent) => ({
              ...state,
              commentUser: dataList.evaluationList.commentUser,
            }));

            //
            setSettingAchievementAdditional(resData.results.versionSetting8?.settingAchievementAdditional);
            setSettingFormula810(resData.results.versionSetting8?.settingFormula810);
            setSettingAchievementPersonalType1(resData.results.versionSetting8?.settingAchievementPersonalType1);
            setSettingAchievementPersonalType2(resData.results.versionSetting8?.settingAchievementPersonalType2);

            setSettingAchievementPersonalType3(resData.results.settingAchievementPersonalType3);
            setSettingAchievementPersonalType4(resData.results.settingAchievementPersonalType4);

            const behaviorListOptions: PointListBehaviors[] = [];
            resData.results.settingPointBasicBehaviorPros
              .filter((v) => v.type === 2)
              .map((v) => {
                behaviorListOptions.push({
                  label: v.point.toString(),
                  value: v.point,
                });
              });
            dispatch(setBehaviorSkillPointOptions(behaviorListOptions));
            setMaxPointSettingFormula810(resData.results.versionSetting8?.maxPoint);
            setMinPointSettingFormula810(resData.results.versionSetting8?.minPoint);
            if (personalAchieLists.length) {
              setDataSource(personalAchieLists);
            } else if (role === 'user') {
              const dataSubTemp: {
                key: number;
                evaluationDecision: string;
                coefficient: number;
                parentKey: number;
              }[] = [];
              resData.results.versionSetting8?.settingAchievementPersonalType2.map(
                (item: SettingAchievementPersonal, index: number) => {
                  dataSubTemp.push({
                    key: index,
                    evaluationDecision: '',
                    coefficient: item.point,
                    parentKey: 0,
                  });
                },
              );

              setDataSource([{ itemNo: 0, evaluationAchievementPersonalSub: dataSubTemp, key: 0, type: 3 }]);
            }

            //hien thi total points cua 2 tab duoc lay tu DB
            dispatch(displayAdditionTotal(dataList.evaluationList));
            dispatch(displayAdditionTotal05(dataList.evaluationList));
            dispatch(displayAdditionTotal1(dataList.evaluationList));
            dispatch(displayAdditionTotal2(dataList.evaluationList));
            dispatch(displayUserTotal(dataList.evaluationList));
            dispatch(display05Total(dataList.evaluationList));
            dispatch(display1Total(dataList.evaluationList));
            dispatch(display2Total(dataList.evaluationList));
          } else {
            const resData = data as EvaluationResponse;
            setBasicSkill(
              resData.evaluationBasicBehavior
                .filter((e: any) => e.versionBasicBehavior.type === 4)
                .sort((a, b) => a.itemNo - b.itemNo),
            );
            setBehavior(
              resData.evaluationBasicBehavior
                .filter((e: any) => e.versionBasicBehavior.type === 5)
                .sort((a, b) => a.itemNo - b.itemNo),
            );
            setRecordInfo(resData.userInfo);
            setDataSources(resData);
            setListSumaryPercent(resData.listSumaryPercent);

            dispatch(setDisabled(true));
            dispatch(setHasEvaluator2(resData.hasEvaluator2));
            dispatch(setMode1(resData.hasMode1));
            dispatch(setMode2(resData.hasMode2));
            dispatch(setMode3(resData.hasMode3));
            dispatch(setMaxOrder(resData.maxOrder));
            dispatch(
              userEvaluationBasicSkill(
                resData.evaluationBasicBehavior
                  .filter((f: any) => f.versionBasicBehavior.type === 4)
                  .sort((a, b) => a.itemNo - b.itemNo),
              ),
            );
            dispatch(
              userEvaluationBehaviorSkill(
                resData.evaluationBasicBehavior.filter((f: any) => f.versionBasicBehavior.type === 5),
              ),
            );
            setAllSeeList(
              [3, 5, 6].includes(typeReview)
                ? resData.results.evaluationList.evaluator.filter(
                    (v) => Number(v.evaluationOrder) <= (recordInfo?.evaluatorOrderExcep || 0),
                  )
                : [],
            );
            const dataList = resData.results;

            setCreationGoalDate(false);
            setAchievementAdditionalNew(
              dataList.evaluationList.evaluationAchievementAdditionalOfUsers.map((v) => {
                return { ...v, key: `achivement-additional_${v.itemNo}` };
              }),
            );
            setDataListProSkill(dataList.evaluationList.evaluationPro);
            dispatch(
              setBasicSkillPointOptions(
                dataList.versionSetting7.settingPointBasic.map((e: any) => {
                  return { value: e.point, lable: e.point };
                }),
              ),
            );
            dispatch(
              setProSkillPointOptions(
                dataList.versionSetting7.settingPointPro.map((e: any) => {
                  return { value: e.point, lable: e.point };
                }),
              ),
            );
            dispatch(userEvaluationSetSettingProFormula(dataList.settingProFormulas));

            // Personal goals new

            const evaluationAchievementPersonalOfUsers = dataList.evaluationList
              .evaluationAchievementPersonalsOfUsers as EvaluationPersonalAchievementOfUser[];
            const subListNews = dataList.subListNews as SubList[][];

            for (let i = 0; i < evaluationAchievementPersonalOfUsers.length; i++) {
              for (let j = 0; j < subListNews?.length; j++) {
                if (subListNews[j][0]?.achievementPersonalId === evaluationAchievementPersonalOfUsers[i]?.id) {
                  evaluationAchievementPersonalOfUsers[i]['evaluationAchievementPersonalSub'] = subListNews[j];
                  evaluationAchievementPersonalOfUsers[i]['key'] = i;
                }
              }
            }
            evaluationAchievementPersonalOfUsers.sort((a, b) => {
              return a.itemNo - b.itemNo;
            });
            setPersonalGoalsList(evaluationAchievementPersonalOfUsers);
            dispatch(userEvaluationPersonalGoalsList(evaluationAchievementPersonalOfUsers));

            setEvaluationData(dataList.evaluationList);
            setEvaluationDate(false);

            setGoalDate(false);
            setStatus([1, 2].includes(Number(typeReview)) ? 49 : 98);
            dispatch(setUpdatedTime(dataList.evaluationList.updatedTime));
            setOwnerId(dataList.evaluationList.userId);
            const personalAchieLists = dataList.evaluationList
              .evaluationAchievementPersonals as EvaluationPersonalAchievement[];

            const subList = dataList.subList as SubList[][];
            for (let i = 0; i < personalAchieLists.length; i++) {
              for (let j = 0; j < subList.length; j++) {
                if (subList[j][0]?.achievementPersonalId === personalAchieLists[i]?.id) {
                  personalAchieLists[i]['evaluationAchievementPersonalSub'] = subList[j];
                  personalAchieLists[i]['key'] = i;
                }
              }

              //Open all row
              setDefaultExpandedRowKeys((preArray) => [...preArray, i]);
            }
            setListEvaluator(dataList.evaluationList.evaluator);

            setCheckList(
              [3, 5, 6].includes(typeReview)
                ? dataList.evaluationList.evaluator.filter(
                    (v) => Number(v.evaluationOrder) <= (recordInfo?.evaluatorOrderExcep || 0),
                  )
                : [],
            );

            // Set default expanded rows - all rows
            const tempRowKeyList = Array.from({ length: personalAchieLists.length }, (_value, index) => index);
            setExpandedRowKeys2(tempRowKeyList);

            dispatch(checkWeight(personalAchieLists));
            const additionDataList = dataList.evaluationList
              .evaluationAchievementAdditional as EvaluationAdditionalAchievement[];
            for (let i = 0; i < additionDataList.length; i++) {
              additionDataList[i]['key'] = i + 1;
            }
            setAdditionData(additionDataList);
            form.setFieldsValue({ commentUser: dataList.evaluationList.commentUser });
            setCommentData((state: CommentContent) => ({
              ...state,
              commentUser: dataList.evaluationList.commentUser,
            }));

            //
            setSettingAchievementAdditional(resData.results.versionSetting8?.settingAchievementAdditional);
            setSettingFormula810(resData.results.versionSetting8?.settingFormula810);
            setSettingAchievementPersonalType1(resData.results.versionSetting8?.settingAchievementPersonalType1);
            setSettingAchievementPersonalType2(resData.results.versionSetting8?.settingAchievementPersonalType2);

            setSettingAchievementPersonalType3(resData.results.settingAchievementPersonalType3);
            setSettingAchievementPersonalType4(resData.results.settingAchievementPersonalType4);

            const behaviorListOptions: PointListBehaviors[] = [];
            resData.results.settingPointBasicBehaviorPros
              .filter((v) => v.type === 2)
              .map((v) => {
                behaviorListOptions.push({
                  label: v.point.toString(),
                  value: v.point,
                });
              });
            dispatch(setBehaviorSkillPointOptions(behaviorListOptions));
            setMaxPointSettingFormula810(resData.results.versionSetting8?.maxPoint);
            setMinPointSettingFormula810(resData.results.versionSetting8?.minPoint);
            if (personalAchieLists.length) {
              setDataSource(personalAchieLists);
            }

            //hien thi total points cua 2 tab duoc lay tu DB
            dispatch(displayAdditionTotal(dataList.evaluationList));
            dispatch(displayAdditionTotal05(dataList.evaluationList));
            dispatch(displayAdditionTotal1(dataList.evaluationList));
            dispatch(displayAdditionTotal2(dataList.evaluationList));
            dispatch(displayUserTotal(dataList.evaluationList));
            dispatch(display05Total(dataList.evaluationList));
            dispatch(display1Total(dataList.evaluationList));
            dispatch(display2Total(dataList.evaluationList));
          }
        }
      } else {
        if (res && res.status === 204) backTo17Screen();
        dispatch(setDetailLoading(false));
        callbackError();
      }
    });
    if (isInitScreen) {
      setLoadingData(false);
      dispatch(setDetailLoading(false));
    }
  };

  const validateTableSub = () => {
    let isError = false;
    const tempList: number[] = [];
    dataSource.map((data: EvaluationPersonalAchievement) => {
      const subData = data.evaluationAchievementPersonalSub;
      if (subData.length || Object.keys(subData).length) {
        Object.keys(subData).forEach((key: any) => {
          const error = validateTableSubColumn(subData[key]?.evaluationDecision, 1000);

          if (!subData[key]?.evaluationDecision || error) {
            tempList.push(data.key);
            isError = true;
          }
        });
      } else {
        tempList.push(data.key);
        isError = true;
      }
    });
    const newArray = tempList.concat(defaultExpandedRowKeys);
    setDefaultExpandedRowKeys(newArray);
    setErrorExpandedRowKeys(tempList);

    return isError;
  };

  const validateTableChildren = () => {
    let isError = false;
    const tempList: number[] = [];
    dataSource.map((data: EvaluationPersonalAchievement) => {
      if (role === 'evaluator' && (status === 60 || status === 61)) {
        if (!data.difficultyEvaluator2) {
          isError = true;
          tempList.push(data.key);
        }
      }
      if (role === 'evaluator' && (status === 57 || status === 58)) {
        if (!data.difficultyEvaluator1) {
          isError = true;
          tempList.push(data.key);
        }
      }

      if (role === 'evaluator' && (status === 54 || status === 55)) {
        if (!data.difficultyEvaluator05) {
          isError = true;
          tempList.push(data.key);
        }
      }
    });
    setErrorRowIndex(tempList);

    // setExpandedRowKeys2(tempList);

    return isError;
  };

  const handleMoveToTab = (tabParents: string, tabChildrens: string, msg: string) => {
    setParentTabs(tabParents);
    if (tabParents === '1') setChildrenTabs(tabChildrens);
    else setChildrenTabs2(tabChildrens);
    openNotification(msg);
  };
  const handleSubmit = () => {
    dispatch(checkWeight(dataSource));

    // const isErrorSub = validateTableSub();
    // const isErrorChildrenTable = validateTableChildren();
    setReject(false);
    form
      .validateFields()
      .then(() => {
        const isErrorSub = validateTableSub();
        const isErrorChildrenTable = validateTableChildren();

        if (!store.calculateTotal.isEqual100) {
          dispatch(checkWeight2(false));
          handleMoveToTab('1', '1', t('MESSAGE.COMMON.IDS_EQUAL_100_PERCENT').replace('{value}', t('IDS_WEIGHT')));
        }

        // Submit can not save invalid values
        if (!isErrorSub && !isErrorChildrenTable && store.calculateTotal.isEqual100 && dataSource.length) {
          // processSaveFormData(false);
          if (Number(evaluationData.evaluationPeriod.year) > 2024)
            handleCheckValidatePersonal810({
              store: store.userEvaluation,
              statusEvaluation: status,
              handleMoveToTab,
              form,
              setOpen: setOpenSubmitPop,
              isEvaluationDate,
              dispatch,
              stores: store.calculateTotal,
            });
          else setOpenSubmitPop(true);
        } else setLoading(false);
      })
      .catch((error) => {
        const errorList = error.errorFields;

        const checkListName = errorList.map((e: any) => e.name[0]).toString();
        if (checkListName)
          if (isEvaluationDate && status >= 50) {
            if (!store.calculateTotal.isEqual100) {
              dispatch(checkWeight2(false));
              handleMoveToTab('1', '1', t('MESSAGE.COMMON.IDS_EQUAL_100_PERCENT').replace('{value}', t('IDS_WEIGHT')));
            } else if (
              checkListName.includes('title_') ||
              checkListName.includes('achievement_') ||
              checkListName.includes('achievementStatus_') ||
              checkListName.includes('reasonComment_') ||
              checkListName.includes('actionPlan_') ||
              checkListName.includes('pointUser_') ||
              checkListName.includes('coefficientUser_') ||
              checkListName.includes('pointEvaluator_') ||
              checkListName.includes('coefficientEvaluator_') ||
              checkListName.includes('_difficult_') ||
              checkListName.includes('index_') ||
              checkListName.includes('pointEvaluatorUser_') ||
              checkListName.includes('weight_')
            )
              handleMoveToTab('1', '1', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            else if (
              checkListName.includes('additionPoint') ||
              checkListName.includes('additionTitle') ||
              checkListName.includes('additionAchievementStatus') ||
              checkListName.includes('additionReasonComment') ||
              checkListName.includes('additionPointUser')
            )
              handleMoveToTab('1', '2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            else if (
              checkListName.includes('comment') ||
              checkListName.includes('publicCommentAdmin') ||
              checkListName.includes('privateComment')
            )
              handleMoveToTab('1', '3', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            else if (checkListName.includes('keybasic')) handleMoveToTab('2', '3', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            else if (checkListName.includes('keyBasic')) handleMoveToTab('2', '3', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            else if (checkListName.includes(`-pro-skill-`))
              handleMoveToTab('2', '1', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            else if (checkListName.includes('keybehavior')) {
              handleMoveToTab('2', '4', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            } else if (checkListName.includes('achievement-personal-'))
              handleMoveToTab('2', '2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            else if (
              checkListName.includes('pointUser-') ||
              checkListName.includes('reasonComment-') ||
              checkListName.includes('achievementStatus-') ||
              checkListName.includes('titleAdditional-') ||
              checkListName.includes('pointEvaluator05-') ||
              checkListName.includes('pointEvaluator1-') ||
              checkListName.includes('pointEvaluator2-')
            )
              handleMoveToTab('2', '5', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            else if (checkListName.includes('charPoint_')) window.scrollTo(0, 0);
          } else {
            if (!store.calculateTotal.isEqual100) {
              dispatch(checkWeight2(false));
              handleMoveToTab('1', '1', t('MESSAGE.COMMON.IDS_EQUAL_100_PERCENT').replace('{value}', t('IDS_WEIGHT')));
            } else if (
              checkListName.includes('title_') ||
              checkListName.includes('achievement_') ||
              checkListName.includes('achievementStatus_') ||
              checkListName.includes('reasonComment_') ||
              checkListName.includes('actionPlan_') ||
              checkListName.includes('pointUser_') ||
              checkListName.includes('coefficientUser_') ||
              checkListName.includes('pointEvaluator_') ||
              checkListName.includes('coefficientEvaluator_') ||
              checkListName.includes('_difficult_') ||
              checkListName.includes('index_') ||
              checkListName.includes('pointEvaluatorUser_') ||
              checkListName.includes('weight_')
            )
              handleMoveToTab('1', '1', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            else if (
              checkListName.includes('additionPoint') ||
              checkListName.includes('additionTitle') ||
              checkListName.includes('additionAchievementStatus') ||
              checkListName.includes('additionReasonComment') ||
              checkListName.includes('additionPointUser')
            )
              handleMoveToTab('1', '2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            else if (checkListName.includes('comment') || checkListName.includes('publicCommentAdmin'))
              handleMoveToTab('1', '3', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            else if (Number(evaluationData.evaluationPeriod.year) > 2024) {
              handleCheckValidatePersonal810({
                store: store.userEvaluation,
                statusEvaluation: status,
                handleMoveToTab,
                form,
                setOpen: setOpenSubmitPop,
                isEvaluationDate,
                dispatch,
                stores: store.calculateTotal,
              });
            } else if (checkListName.includes('keybasic')) handleMoveToTab('2', '3', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            else if (checkListName.includes('keyBasic')) handleMoveToTab('2', '3', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            else if (checkListName.includes(`-pro-skill-`))
              handleMoveToTab('2', '1', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            else if (checkListName.includes('keybehavior'))
              handleMoveToTab('2', '4', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            else if (checkListName.includes('achievement-personal-'))
              handleMoveToTab('2', '2', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            else if (
              checkListName.includes('pointUser-') ||
              checkListName.includes('reasonComment-') ||
              checkListName.includes('achievementStatus-') ||
              checkListName.includes('titleAdditional-') ||
              checkListName.includes('pointEvaluator05-') ||
              checkListName.includes('pointEvaluator1-') ||
              checkListName.includes('pointEvaluator2-')
            )
              handleMoveToTab('2', '5', t('MESSAGE.COMMON.IDM_TAB_ERROR'));
            else if (checkListName.includes('charPoint_')) window.scrollTo(0, 0);
          }
      });
  };

  const handleSaveDraft = () => {
    setLoading(true);
    dispatch(setDetailLoading(true));
    processSaveFormData(true);
  };

  // eslint-disable-next-line complexity
  const processSaveFormData = async (isDraft: boolean) => {
    let achievementPersonalData;
    if (store.userEvaluation.achievementDatas && store.userEvaluation.achievementDatas?.length > 0) {
      achievementPersonalData = store.userEvaluation.achievementDatas?.map((v, index) => {
        return {
          ...v,
          evaluationAchievementPersonalSub:
            store.userEvaluation.achievementSubs[index] !== undefined
              ? store.userEvaluation.achievementSubs[index]
              : settingAchievementPersonalType4.map((v) => ({ ...v, coefficient: v.point, degree: v.note })),
        };
      });
    }

    setLoading(true);

    const totalUser =
      store.calculateTotal.userSum == null
        ? null
        : Number(store.calculateTotal.userSum) + Number(store.calculateTotal.additionSum);
    const totalUser05 =
      store.calculateTotal.sumEvaluator05 == null
        ? null
        : Number(store.calculateTotal.sumEvaluator05) + Number(store.calculateTotal.additionSum05);
    const totalUser1 =
      store.calculateTotal.sumEvaluator1 == null
        ? null
        : Number(store.calculateTotal.sumEvaluator1) + Number(store.calculateTotal.additionSum1);
    const totalUser2 =
      store.calculateTotal.sumEvaluator2 == null
        ? null
        : Number(store.calculateTotal.sumEvaluator2) + Number(store.calculateTotal.additionSum2);

    const url =
      role === 'user'
        ? '/api/v1/f1/user/evaluation8-10/save'
        : role === 'evaluator'
        ? '/api/v1/f2/evaluator/evaluation8-10/save'
        : '/api/v1/f5/management-evaluation-history/evaluation8-10/save';
    const summaryPointUser = Math.round(
      (Number(
        store.userEvaluation.totalData.basicProTotalPointUser !== null &&
          store.userEvaluation.totalData.basicProTotalPointUser !== undefined
          ? store.userEvaluation.totalData.basicProTotalPointUser
          : 0,
      ) *
        (listSumaryPercent.skillPercent || 0) +
        Number(
          store.userEvaluation.behaviorTotalPointUser !== null &&
            store.userEvaluation.behaviorTotalPointUser !== undefined
            ? store.userEvaluation.behaviorTotalPointUser
            : 0,
        ) *
          (listSumaryPercent.behaviorPercent || 0) +
        Math.round(
          Number(
            store.userEvaluation.achievementPersonalTotalPointUser !== null &&
              store.userEvaluation.achievementPersonalTotalPointUser !== undefined
              ? store.userEvaluation.achievementPersonalTotalPointUser
              : 0,
          ),
        ) *
          (listSumaryPercent.achievementPercent || 0)) /
        100 +
        Number(
          store.userEvaluation.achievementAdditionalTotalPointUser !== null &&
            store.userEvaluation.achievementAdditionalTotalPointUser !== undefined
            ? store.userEvaluation.achievementAdditionalTotalPointUser
            : 0,
        ),
    );
    const summaryPointEvaluator05 = Math.round(
      (Number(
        store.userEvaluation.totalData.basicProTotalPointEvaluator05 !== null &&
          store.userEvaluation.totalData.basicProTotalPointEvaluator05 !== undefined
          ? store.userEvaluation.totalData.basicProTotalPointEvaluator05
          : 0,
      ) *
        (listSumaryPercent.skillPercent || 0) +
        Number(
          store.userEvaluation.behaviorTotalPoint05 !== null && store.userEvaluation.behaviorTotalPoint05 !== undefined
            ? store.userEvaluation.behaviorTotalPoint05
            : 0,
        ) *
          (listSumaryPercent.behaviorPercent || 0) +
        Math.round(
          Number(
            store.userEvaluation.achievementPersonalTotalPoint05 !== null &&
              store.userEvaluation.achievementPersonalTotalPoint05 !== undefined
              ? store.userEvaluation.achievementPersonalTotalPoint05
              : 0,
          ),
        ) *
          (listSumaryPercent.achievementPercent || 0)) /
        100 +
        Number(
          store.userEvaluation.achievementAdditionalTotalPoint05 !== null &&
            store.userEvaluation.achievementAdditionalTotalPoint05 !== undefined
            ? store.userEvaluation.achievementAdditionalTotalPoint05
            : 0,
        ),
    );
    const summaryPointEvaluator1 = Math.round(
      (Number(
        store.userEvaluation.totalData.basicProTotalPointEvaluator1 !== null &&
          store.userEvaluation.totalData.basicProTotalPointEvaluator1 !== undefined
          ? store.userEvaluation.totalData.basicProTotalPointEvaluator1
          : 0,
      ) *
        (listSumaryPercent.skillPercent || 0) +
        Number(
          store.userEvaluation.behaviorTotalPoint1 !== null && store.userEvaluation.behaviorTotalPoint1 !== undefined
            ? store.userEvaluation.behaviorTotalPoint1
            : 0,
        ) *
          (listSumaryPercent.behaviorPercent || 0) +
        Math.round(
          Number(
            store.userEvaluation.achievementPersonalTotalPoint1 !== null &&
              store.userEvaluation.achievementPersonalTotalPoint1 !== undefined
              ? store.userEvaluation.achievementPersonalTotalPoint1
              : 0,
          ),
        ) *
          (listSumaryPercent.achievementPercent || 0)) /
        100 +
        Number(
          store.userEvaluation.achievementAdditionalTotalPoint1 !== null &&
            store.userEvaluation.achievementAdditionalTotalPoint1 !== undefined
            ? store.userEvaluation.achievementAdditionalTotalPoint1
            : 0,
        ),
    );
    const summaryPointEvaluator2 = Math.round(
      (Number(
        store.userEvaluation.totalData.basicProTotalPointEvaluator2 !== null &&
          store.userEvaluation.totalData.basicProTotalPointEvaluator2 !== undefined
          ? store.userEvaluation.totalData.basicProTotalPointEvaluator2
          : 0,
      ) *
        (listSumaryPercent.skillPercent || 0) +
        Number(
          store.userEvaluation.behaviorTotalPoint2 !== null && store.userEvaluation.behaviorTotalPoint2 !== undefined
            ? store.userEvaluation.behaviorTotalPoint2
            : 0,
        ) *
          (listSumaryPercent.behaviorPercent || 0) +
        Math.round(
          Number(
            store.userEvaluation.achievementPersonalTotalPoint2 !== null &&
              store.userEvaluation.achievementPersonalTotalPoint2 !== undefined
              ? store.userEvaluation.achievementPersonalTotalPoint2
              : 0,
          ),
        ) *
          (listSumaryPercent.achievementPercent || 0)) /
        100 +
        Number(
          store.userEvaluation.achievementAdditionalTotalPoint2 !== null &&
            store.userEvaluation.achievementAdditionalTotalPoint2 !== undefined
            ? store.userEvaluation.achievementAdditionalTotalPoint2
            : 0,
        ),
    );

    await httpAxios
      .Post(url, {
        dataSource: dataSource,
        additionData: additionData,
        commentData: commentData,
        checkList: checkList,
        evaluationId: evaluationId,
        status: status,
        listEvalutor: listEvalutor,
        listPersonalGoals: achievementPersonalData || [],
        isDraft: isDraft,
        achievementAdditionalPersonals: store.userEvaluation.achievementAdditionals,
        listBehaviors: [
          ...store.userEvaluation.evaluationBasicSkills,
          ...store.userEvaluation.evaluationBehaviorSkills,
        ],
        total: {
          summaryPointUser:
            (store.calculateTotal.maxOrder === '' || totalUser) && status >= 50
              ? isDraft && !totalUser
                ? null
                : roundNumber(
                    Math.min(
                      Math.max(totalUser || 0, minPointSettingFormula810 || 0),
                      maxPointSettingFormula810 || 0,
                    ).toFixed(2),
                  )
              : null,
          summaryPointEvaluator05:
            (store.calculateTotal.maxOrder === '0.5' || totalUser05) && status >= 50
              ? isDraft && !totalUser05
                ? null
                : roundNumber(
                    Math.min(
                      Math.max(totalUser05 || 0, minPointSettingFormula810 || 0),
                      maxPointSettingFormula810 || 0,
                    ).toFixed(2),
                  )
              : null,
          summaryPointEvaluator1:
            (store.calculateTotal.maxOrder === '1.0' || totalUser1) && status >= 50
              ? isDraft && !totalUser1
                ? null
                : roundNumber(
                    Math.min(
                      Math.max(totalUser1 || 0, minPointSettingFormula810 || 0),
                      maxPointSettingFormula810 || 0,
                    ).toFixed(2),
                  )
              : null,
          summaryPointEvaluator2:
            (store.calculateTotal.maxOrder === '2.0' || totalUser2) && status >= 50
              ? isDraft && !totalUser2
                ? null
                : roundNumber(
                    Math.min(
                      Math.max(totalUser2 || 0, minPointSettingFormula810 || 0),
                      maxPointSettingFormula810 || 0,
                    ).toFixed(2),
                  )
              : null,
          achievementPersonalTotalPointUser: store.calculateTotal.userSum,
          achievementPersonalTotalPointEvaluator05: store.calculateTotal.sumEvaluator05,
          achievementPersonalTotalPointEvaluator1: store.calculateTotal.sumEvaluator1,
          achievementPersonalTotalPointEvaluator2: store.calculateTotal.sumEvaluator2,

          // Calculate achievement Additional Total Points
          achievementAdditionalTotalPointUser: store.calculateTotal.additionSum ?? null,
          achievementAdditionalTotalPointEvaluator05: store.calculateTotal.additionSum05 ?? null,
          achievementAdditionalTotalPointEvaluator1: store.calculateTotal.additionSum1 ?? null,
          achievementAdditionalTotalPointEvaluator2: store.calculateTotal.additionSum2 ?? null,
          summaryCharPointUser: totalUser !== null ? covertValueToChar(roundNumber(totalUser.toFixed(2))) : null,

          // tổng 1-7
          basicTotalPointUser: store.userEvaluation.basicTotalPointUser,
          basicTotalPointEvaluator05: store.userEvaluation.basicTotalPoint05,
          basicTotalPointEvaluator1: store.userEvaluation.basicTotalPoint1,

          basicTotalPointEvaluator2: store.userEvaluation.basicTotalPoint2,
          behaviorTotalPointUser: store.userEvaluation.behaviorTotalPointUser,
          behaviorTotalPointEvaluator05: store.userEvaluation.behaviorTotalPoint05,
          behaviorTotalPointEvaluator1: store.userEvaluation.behaviorTotalPoint1,

          behaviorTotalPointEvaluator2: store.userEvaluation.behaviorTotalPoint2,
          proTotalPointUser: store.userEvaluation.proTotalPointUser,
          proTotalPointEvaluator05: store.userEvaluation.proTotalPoint05,
          proTotalPointEvaluator1: store.userEvaluation.proTotalPoint1,
          proTotalPointEvaluator2: store.userEvaluation.proTotalPoint2,
          basicProTotalPointUser: store.userEvaluation.totalData.basicProTotalPointUser,
          basicProTotalPointEvaluator05: store.userEvaluation.totalData.basicProTotalPointEvaluator05,
          basicProTotalPointEvaluator1: store.userEvaluation.totalData.basicProTotalPointEvaluator1,
          basicProTotalPointEvaluator2: store.userEvaluation.totalData.basicProTotalPointEvaluator2,
          summaryAchievementAdditionalTotalPointUser: store.userEvaluation.achievementAdditionalTotalPointUser,
          summaryAchievementAdditionalTotalPointEvaluator05: store.userEvaluation.achievementAdditionalTotalPoint05,
          summaryAchievementAdditionalTotalPointEvaluator1: store.userEvaluation.achievementAdditionalTotalPoint1,
          summaryAchievementAdditionalTotalPointEvaluator2: store.userEvaluation.achievementAdditionalTotalPoint2,
          summaryAchievementPersonalTotalPointUser: store.userEvaluation.achievementPersonalTotalPointUser,
          summaryAchievementPersonalTotalPointEvaluator05: store.userEvaluation.achievementPersonalTotalPoint05,
          summaryAchievementPersonalTotalPointEvaluator1: store.userEvaluation.achievementPersonalTotalPoint1,
          summaryAchievementPersonalTotalPointEvaluator2: store.userEvaluation.achievementPersonalTotalPoint2,
          summaryPointUsers:
            (store.userEvaluation.totalData.basicProTotalPointUser !== null &&
              store.userEvaluation.totalData.basicProTotalPointUser !== undefined) ||
            (store.userEvaluation.behaviorTotalPointUser !== null &&
              store.userEvaluation.behaviorTotalPointUser !== undefined) ||
            (store.userEvaluation.achievementPersonalTotalPointUser !== null &&
              store.userEvaluation.achievementPersonalTotalPointUser !== undefined) ||
            (store.userEvaluation.achievementAdditionalTotalPointUser !== null &&
              store.userEvaluation.achievementAdditionalTotalPointUser !== undefined)
              ? Math.min(
                  Math.max(Math.floor(summaryPointUser), Number(dataSources?.results.versionSetting7.minPoint)),
                  Number(dataSources?.results.versionSetting7.maxPoint),
                )
              : null,
          summaryPointEvaluator05s:
            (store.userEvaluation.totalData.basicProTotalPointEvaluator05 !== null &&
              store.userEvaluation.totalData.basicProTotalPointEvaluator05 !== undefined) ||
            (store.userEvaluation.behaviorTotalPoint05 !== null &&
              store.userEvaluation.behaviorTotalPoint05 !== undefined) ||
            (store.userEvaluation.achievementPersonalTotalPoint05 !== null &&
              store.userEvaluation.achievementPersonalTotalPoint05 !== undefined) ||
            (store.userEvaluation.achievementAdditionalTotalPoint05 !== null &&
              store.userEvaluation.achievementAdditionalTotalPoint05 !== undefined)
              ? Math.min(
                  Math.max(Math.floor(summaryPointEvaluator05), Number(dataSources?.results.versionSetting7.minPoint)),
                  Number(dataSources?.results.versionSetting7.maxPoint),
                )
              : null,
          summaryPointEvaluator1s:
            (store.userEvaluation.totalData.basicProTotalPointEvaluator1 !== null &&
              store.userEvaluation.totalData.basicProTotalPointEvaluator1 !== undefined) ||
            (store.userEvaluation.behaviorTotalPoint1 !== null &&
              store.userEvaluation.behaviorTotalPoint1 !== undefined) ||
            (store.userEvaluation.achievementPersonalTotalPoint1 !== null &&
              store.userEvaluation.achievementPersonalTotalPoint1 !== undefined) ||
            (store.userEvaluation.achievementAdditionalTotalPoint1 !== null &&
              store.userEvaluation.achievementAdditionalTotalPoint1 !== undefined)
              ? Math.min(
                  Math.max(Math.floor(summaryPointEvaluator1), Number(dataSources?.results.versionSetting7.minPoint)),
                  Number(dataSources?.results.versionSetting7.maxPoint),
                )
              : null,
          summaryPointEvaluator2s:
            (store.userEvaluation.totalData.basicProTotalPointEvaluator2 !== null &&
              store.userEvaluation.totalData.basicProTotalPointEvaluator2 !== undefined) ||
            (store.userEvaluation.behaviorTotalPoint2 !== null &&
              store.userEvaluation.behaviorTotalPoint2 !== undefined) ||
            (store.userEvaluation.achievementPersonalTotalPoint2 !== null &&
              store.userEvaluation.achievementPersonalTotalPoint2 !== undefined) ||
            (store.userEvaluation.achievementAdditionalTotalPoint2 !== null &&
              store.userEvaluation.achievementAdditionalTotalPoint2 !== undefined)
              ? Math.min(
                  Math.max(Math.floor(summaryPointEvaluator2), Number(dataSources?.results.versionSetting7.minPoint)),
                  Number(dataSources?.results.versionSetting7.maxPoint),
                )
              : null,
        },

        updatedTime: store.calculateTotal.updatedTime,
        evaluationOrder: store.calculateTotal.maxOrder,
        listProSkills: store.userEvaluation.evaluationProSkills,
      })
      .then(async (res: any) => {
        if (res && res.status === 201) {
          dispatch(setUpdatedTime(res.data.updatedTime));
          await processData();
          !isDraft && message.success(t('MESSAGE.COMMON.IDM_SUBMIT_SUCCESS'));
          isDraft && message.success(t('MESSAGE.COMMON.IDM_SAVE_DRAFT_SUCCESS'));
          setOpenSubmitPop(false);
        } else if (res && res.status === 204) {
          message.error(t('MESSAGE.COMMON.IDM_UPDATE_DUPLICATE_ERROR'));

          callbackError();
        }
        setOpenSubmitPop(false);
        setLoading(false);
        dispatch(setDetailLoading(false));
      });
  };

  const covertValueToChar = (num: string) => {
    const value = Number(num);
    const smallerList: string[] = [];
    settingFormula810.map((item: SettingFormula810) => {
      if (item.point <= value) {
        smallerList.push(item.result);
      }
    });
    let result = '';
    if (smallerList) {
      result = smallerList[0];
    }

    return result;
  };

  const handleApprove = () => {
    if (!storeSubmit.hasMode2) return setOpenApprovePop(true);
    setLoading(true);
    const url =
      role === 'user'
        ? '/api/v1/f1/user/evaluation8-10/approve'
        : role === 'evaluator'
        ? '/api/v1/f2/evaluator/evaluation8-10/approve'
        : '/api/v1/f5/management-evaluation-history/evaluation8-10/approve';
    httpAxios
      .Post(url, {
        evaluationId: evaluationId,
        status: status,
        maxOrder: store.calculateTotal.maxOrder,
        listEvalutor: listEvalutor,
        content: approveRejectContent,
        approverId: user?.id,
        updatedTime: store.calculateTotal.updatedTime,
      })
      .then(async (res: any) => {
        if (res && res.status === 201) {
          await processData();
          message.success(t('MESSAGE.COMMON.IDM_APPROVE_SUCCESS'));
        } else if (res && res.status === 204) {
          message.error(t('MESSAGE.COMMON.IDM_UPDATE_DUPLICATE_ERROR'));
          callbackError();
        }
        setOpenApprovePop(false);
        setLoading(false);
        setReject(false);
        dispatch(setDetailLoading(false));
        form.resetFields(['reject']);
      });
  };
  const confirmApprove = () => {
    setLoading(true);
    const url =
      role === 'user'
        ? '/api/v1/f1/user/evaluation8-10/approve'
        : role === 'evaluator'
        ? '/api/v1/f2/evaluator/evaluation8-10/approve'
        : '/api/v1/f5/management-evaluation-history/evaluation8-10/approve';
    httpAxios
      .Post(url, {
        evaluationId: evaluationId,
        status: status,
        maxOrder: store.calculateTotal.maxOrder,
        listEvalutor: listEvalutor,
        content: approveRejectContent,
        approverId: user?.id,
        updatedTime: store.calculateTotal.updatedTime,
      })
      .then(async (res: any) => {
        if (res && res.status === 201) {
          await processData();
          message.success(t('MESSAGE.COMMON.IDM_APPROVE_SUCCESS'));
        } else if (res && res.status === 204) {
          message.error(t('MESSAGE.COMMON.IDM_UPDATE_DUPLICATE_ERROR'));
          callbackError();
        }
        setReject(false);
        form.resetFields(['reject']);
        setLoading(false);
        dispatch(setDetailLoading(false));
        setOpenApprovePop(false);
      })
      .catch(() => {
        setOpenApprovePop(false);
      });
  };

  const handleReject = () => {
    form
      .validateFields(['evaluator_option', 'reject'])
      .then(() => {
        setLoading(true);
        const url =
          role === 'user'
            ? '/api/v1/f1/user/evaluation8-10/reject'
            : role === 'evaluator'
            ? '/api/v1/f2/evaluator/evaluation8-10/reject'
            : '/api/v1/f5/management-evaluation-history/evaluation8-10/reject';
        httpAxios
          .Post(url, {
            evaluationId: evaluationId,
            status: status,
            selectedOrder: selectedOrder,
            content: approveRejectContent,
            approverId: user?.id,
            ownerId: ownerId,
            listEvalutor: listEvalutor,
            updatedTime: store.calculateTotal.updatedTime,
            maxOrder: store.calculateTotal.maxOrder,
          })
          .then(async (res: any) => {
            if (res && res.status === 201) {
              await processData();
              message.success(t('MESSAGE.COMMON.IDM_REJECT_SUCCESS'));
              dispatch(setOpenPopUp(false));
              dispatch(setDetailLoading(false));
            } else if (res && res.status === 204) {
              message.error(t('MESSAGE.COMMON.IDM_UPDATE_DUPLICATE_ERROR'));
              callbackError();
            }
            dispatch(setDetailLoading(false));
            setLoading(false);
          });
      })
      .catch(() => {
        dispatch(setOpenPopUp(false));
      });
  };

  const handleDownLoadPDF = () => {
    setLoading(true);

    // setLoadingData(true);
    const url = `/api/v1/common/evaluation-8-10/${role}/${evaluationId}/report-pdf/${user?.id}/${optionPdfList.orientation}/${optionPdfList.size}`;
    evaluationDetailApiService.donwloadPDF(url, callBack, callbackError, setLoading);
  };

  const callBack = (response: any) => {
    const buffer = Buffer.from(response.buffer);
    const blob = new Blob(['\uFEFF', buffer], {
      type: 'application/pdf',
    });
    download(blob, response.fileName, 'application/pdf');

    setTimeout(() => setLoading(false), 500);
  };

  const renderModal = () => {
    return (
      <Form labelAlign="left" labelCol={{ span: 1 }}>
        <Form.Item label={t('IDS_PAGE_ORIENTATION')} colon={false} style={{ padding: 5 }}>
          <Radio.Group
            name="orientation"
            onChange={(e) =>
              setOptionPdfList({
                ...optionPdfList,
                orientation: e.target.value,
              })
            }
            defaultValue="p"
            style={{ paddingLeft: 20 }}
          >
            <Radio value={'p'}>{t('IDS_PORTRAIT')}</Radio>
            <Radio value={'l'}>{t('IDS_LANDSCAPE')}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label={t('IDS_PAPER_SIZE')} colon={false} style={{ padding: 5 }}>
          <Radio.Group
            name="size"
            onChange={(e) =>
              setOptionPdfList({
                ...optionPdfList,
                size: e.target.value,
              })
            }
            defaultValue="a4"
            style={{ paddingLeft: 20 }}
          >
            <Radio value={'a4'}>{t('A4')}</Radio>
            <Radio value={'a3'}>{t('A3')}</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    );
  };

  return (
    <>
      <div>
        {contextHolder}
        {isLoadingData ? (
          <LoadingScreenComponent />
        ) : (
          <div className="evaluation-list">
            <UserEvaluationInfoComponent
              {...commonInfo}
              status={status}
              isEvaluationDate={isEvaluationDate}
              isNotEvaluator2={!store.calculateTotal.hasEvaluator2}
              header={t('IDS_DETAIL_EVALUATION')}
              historyApproveEvaluation={commonInfo.rejectComment}
              flagSkill={1}
              isReview={isReview}
              isEvaluatorUser={isEvaluatorUser}
              isF5={isF5}
              evaluatorOrder={Number(store.calculateTotal.maxOrder)}
            />

            {(isEvaluation || Number(evaluationData.evaluationPeriod.year) > 2024) && (
              <Card style={{ marginBottom: 10 }}>
                {isEvaluation ? (
                  <>
                    <Typography.Title level={3}>{t('IDS_EVALUATION_RESULT')}</Typography.Title>
                    <div style={{ marginBottom: 15 }}>
                      <TotalComp8
                        dataSource={dataSource}
                        additionData={additionData}
                        status={status}
                        role={role}
                        listEvalutor={listEvalutor}
                        allowSeeList={allowSeeList}
                        checkList={checkList}
                        setCheckList={setCheckList}
                        Form={Form}
                        form={form}
                        isEvaluationDate={isEvaluationDate}
                        evaluationData={evaluationData}
                        settingAchievementAdditional={settingAchievementAdditional}
                        settingFormula810={settingFormula810}
                        maxPointSettingFormula810={maxPointSettingFormula810}
                        minPointSettingFormula810={minPointSettingFormula810}
                        isReview={isReview}
                        typeReview={typeReview}
                        location={recordInfo}
                      />
                    </div>
                  </>
                ) : (
                  <></>
                )}
                {Number(evaluationData.evaluationPeriod.year) > 2024 && (
                  <>
                    {!isEvaluation && <Typography.Title level={3}>{t('IDS_EVALUATION_DISTRIBUTION')}</Typography.Title>}

                    <SettingLevelComponent810
                      pointSettingLevel={listSumaryPercent}
                      header={isEvaluation ? t('IDS_EVALUATION_PERSONAL') : t('IDS_ACHIEVEMENT_PERSONAL')}
                      proTotalPointUser={dataSources?.results.evaluationList.proTotalPointUser}
                      basicTotalPointUser={dataSources?.results.evaluationList.basicTotalPointUser}
                      behaviorTotalPointUser={dataSources?.results.evaluationList.behaviorTotalPointUser}
                      achievementPersonalTotalPointUser={
                        dataSources?.results.evaluationList.achievementPersonalTotalPointUser
                      }
                      achievementAdditionalTotalPointUser={
                        dataSources?.results.evaluationList.achievementAdditionalTotalPointUser
                      }
                      basicTotalPointEvaluator05={dataSources?.results.evaluationList.basicTotalPointEvaluator05}
                      proTotalPointEvaluator05={dataSources?.results.evaluationList.proTotalPointEvaluator05}
                      behaviorTotalPointEvaluator05={dataSources?.results.evaluationList.behaviorTotalPointEvaluator05}
                      achievementAdditionalTotalPointEvaluator05={
                        dataSources?.results.evaluationList.achievementAdditionalTotalPointEvaluator05
                      }
                      achievementPersonalTotalPointEvaluator05={
                        dataSources?.results.evaluationList.achievementPersonalTotalPointEvaluator05
                      }
                      basicTotalPointEvaluator1={dataSources?.results.evaluationList.basicTotalPointEvaluator1}
                      proTotalPointEvaluator1={dataSources?.results.evaluationList.proTotalPointEvaluator1}
                      behaviorTotalPointEvaluator1={dataSources?.results.evaluationList.behaviorTotalPointEvaluator1}
                      achievementAdditionalTotalPointEvaluator1={
                        dataSources?.results.evaluationList.achievementAdditionalTotalPointEvaluator1
                      }
                      achievementPersonalTotalPointEvaluator1={
                        dataSources?.results.evaluationList.achievementPersonalTotalPointEvaluator1
                      }
                      basicTotalPointEvaluator2={dataSources?.results.evaluationList.basicTotalPointEvaluator2}
                      proTotalPointEvaluator2={dataSources?.results.evaluationList.proTotalPointEvaluator2}
                      behaviorTotalPointEvaluator2={dataSources?.results.evaluationList.behaviorTotalPointEvaluator2}
                      achievementAdditionalTotalPointEvaluator2={
                        dataSources?.results.evaluationList.achievementAdditionalTotalPointEvaluator2
                      }
                      achievementPersonalTotalPointEvaluator2={
                        dataSources?.results.evaluationList.achievementPersonalTotalPointEvaluator2
                      }
                      isLoading={false}
                      proSkillList={dataListProSkill}
                      evaluationBasicSkills={basicSkill}
                      isEditUserEvaluation={isEditUserEvaluation}
                      isDisplayEvaluator05={isDisplayEvaluator05}
                      isEditEvaluation05={isEditEvaluation05}
                      isDisplayEvaluator1={isDisplayEvaluator1}
                      isEditEvaluation1={isEditEvaluation1}
                      isDisplayEvaluator2={isDisplayEvaluator2}
                      isEditEvaluation2={isEditEvaluation2}
                      basicProTotalPointUser={dataSources?.results.evaluationList.basicProTotalPointUser}
                      basicProTotalPointEvaluator05={dataSources?.results.evaluationList.basicProTotalPointEvaluator05}
                      basicProTotalPointEvaluator1={dataSources?.results.evaluationList.basicProTotalPointEvaluator1}
                      basicProTotalPointEvaluator2={dataSources?.results.evaluationList.basicProTotalPointEvaluator2}
                      maxPointBasicSkill={dataSources?.results.maxPointBasicSkill}
                      maxPointProSkill={dataSources?.results.maxPointProSkill}
                      statusEvaluation={status}
                      summaryPointUser={dataSources?.results.evaluationList.summaryPointUser}
                      summaryPointEvaluator05={dataSources?.results.evaluationList.summaryPointEvaluator05}
                      summaryPointEvaluator1={dataSources?.results.evaluationList.summaryPointEvaluator1}
                      summaryPointEvaluator2={dataSources?.results.evaluationList.summaryPointEvaluator2}
                      isEvaluatorUser={isEvaluatorUser}
                      fullName={dataSources?.userInfo.fullName}
                      financialYear={dataSources?.userInfo.fiscalYear}
                      versionSetting={{
                        maxPoint: dataSources?.results.versionSetting7.maxPoint,
                        minPoint: dataSources?.results.versionSetting7.minPoint,
                      }}
                      isF5={isF5}
                      isEvaluationDate={isEvaluationDate}
                    />
                  </>
                )}
              </Card>
            )}
            <Space size={3} style={{ flexDirection: 'column', width: '100%', alignItems: 'unset' }}>
              {!isReview && (
                <div style={{ textAlign: 'right' }}>
                  <PrintDetailReview810
                    store={store}
                    status={status}
                    role={role}
                    params={{
                      role: role,
                      evaluationId: [evaluationId],
                      userId: user?.id,
                      isEvaluatorUser: isEvaluatorUser,
                      isF5: role == 'admin' ? true : undefined,
                    }}
                    fullName={commonInfo.fullName}
                    financialYear={commonInfo.fiscalYear}
                  />
                </div>
              )}

              {listEvaluation.length > 0 && !(isReview && typeReview === 3) && (
                <div style={{ overflow: 'clip' }}>
                  <>
                    <Form form={form} colon={false}>
                      {Number(evaluationData.evaluationPeriod.year) > 2024 ? (
                        <Tabs
                          onChange={(e) => {
                            setParentTabs(e);
                            setChildrenTabs('1');
                          }}
                          type="line"
                          className="tab-test"
                          defaultActiveKey={parentTabs.toString()}
                          activeKey={parentTabs.toString()}
                          items={tabsParents.map((_: any, i: any) => {
                            return {
                              label: (
                                <div>
                                  <Radio.Group value={parentTabs}>
                                    {tabsParents[i].key == '1' && (
                                      <Radio value={'1'}>
                                        <span>{tabsParents[i].title}</span>
                                      </Radio>
                                    )}
                                    {tabsParents[i].key != '1' &&
                                      Number(evaluationData.evaluationPeriod.year) > 2024 && (
                                        <Radio value={'2'}>
                                          <span>{tabsParents[i].title}</span>
                                        </Radio>
                                      )}
                                  </Radio.Group>
                                </div>
                              ),
                              key: tabsParents[i].key,
                              children: tabsParents[i].component,
                              forceRender: true,
                            };
                          })}
                        />
                      ) : (
                        <Tabs
                          style={{ paddingTop: 10 }}
                          type="card"
                          defaultActiveKey={childrenTabs}
                          activeKey={childrenTabs}
                          onChange={(e) => setChildrenTabs(e)}
                          items={listBlock1.map((_: any, i: any) => {
                            return {
                              label: (
                                <>
                                  <span>{listBlock1[i].title}</span>
                                </>
                              ),
                              key: listBlock1[i].key,
                              children: listBlock1[i].component,
                              forceRender: true,
                            };
                          })}
                        />
                      )}
                    </Form>
                  </>
                </div>
              )}
            </Space>
            <Affix
              offsetBottom={0}
              onChange={(affixed) => {
                setIsAffixed(affixed);
              }}
            >
              <Form.Item>
                <ButtonComponent
                  handleSaveDraft={handleSaveDraft}
                  handleSubmit={handleSubmit}
                  handleApprove={handleApprove}
                  dataSource={dataSource}
                  status={status}
                  role={role}
                  evaluationId={evaluationId}
                  handleReject={handleReject}
                  listEvalutor={listEvalutor}
                  Form={Form}
                  form={form}
                  setApproveRejectContent={setApproveRejectContent}
                  setSelectedOrder={setSelectedOrder}
                  isLoading={isLoading}
                  isEvaluationDate={isEvaluationDate}
                  isGoalDate={isGoalDate}
                  userInfo={commonInfo}
                  isAffixed={isAffixed}
                  isReject={isReject}
                  setReject={setReject}
                  isReview={isReview}
                  typeReview={typeReview}
                />
              </Form.Item>
            </Affix>
          </div>
        )}
        <ModalCustomComponent
          isOpen={isOpenSubmitPop}
          header={t('POPUP_DIALOG.TITLE.CONFIRM')}
          content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SUBMIT')}
          fnHandleOk={() => processSaveFormData(false)}
          okText={t('POPUP_DIALOG.BUTTON.OK') as string}
          cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
          fnHandleCancel={() => setOpenSubmitPop(false)}
          loading={isLoading}
        />
        <ModalCustomComponent
          isOpen={isOpenApprovePop}
          header={t('POPUP_DIALOG.TITLE.CONFIRM')}
          content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_APPROVE')}
          fnHandleOk={confirmApprove}
          fnHandleCancel={() => setOpenApprovePop(false)}
          okText={t('POPUP_DIALOG.BUTTON.APPROVE') as string}
          cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
          loading={isLoading}
        />
        <ModalCustomComponent
          isOpen={open}
          okText={t('IDS_OUTPUT').toString()}
          header={t('IDS_BUTTON_OUTPUT_PDF')}
          content={renderModal()}
          fnHandleOk={() => {
            handleDownLoadPDF();
            setOptionPdfList({ ...optionPdfList, orientation: 'p', size: 'a4' });
            setOpen(!open);
          }}
          fnHandleCancel={() => {
            setOptionPdfList({ ...optionPdfList, orientation: 'p', size: 'a4' });
            setOpen(!open);
          }}
        />
      </div>
    </>
  );
};

export default Evaluation810HaveSkill;
