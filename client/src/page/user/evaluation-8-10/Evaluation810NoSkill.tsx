import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import EvaluationComment from '../../../views/user/evaluation-8-10/components/evaluationComment';
import EvaluationAdditionalDepartment from '../../../views/user/evaluation-8-10/components/evaluationAdditionalDepartment';
import EvaluationGoalDepartment from '../../../views/user/evaluation-8-10/components/evaluationGoalDepartment';
import { t } from 'i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import {
  CommentContent,
  EvaluationAdditionalAchievement,
  EvaluationInfo,
  EvaluationPersonalAchievement,
  EvaluationResponse,
  EvaluatorInfo,
  SettingAchievementAdditional,
  SettingAchievementPersonal,
  SettingFormula810,
  SubList,
  UserInfo,
} from '../../../views/user/evaluation-8-10/interfaces/response.interface';
import { statusEvaluationType } from '../../../common/status';
import { Affix, Badge, Card, Col, Form, message, notification, Radio, Row, Space, Tabs, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import httpAxios from '../../../common/http';
import { compareDatePeriod, decrypt, urlCompanyCode } from '../../../common/util';
import {
  checkWeight,
  checkWeight2,
  checkWeightNew,
  checkWeightNew2,
  display05Total,
  display1Total,
  display2Total,
  displayAdditionTotal,
  displayAdditionTotal05,
  displayAdditionTotal1,
  displayAdditionTotal2,
  displayUserTotal,
  evaluationListAchievementAdditionals,
  evaluationTotalPointAchievementEvaluator05,
  evaluationTotalPointAchievementEvaluator1,
  evaluationTotalPointAchievementEvaluator2,
  evaluationTotalPointAchievementUser,
  evaluatorTotalPointPersonalGoals05,
  evaluatorTotalPointPersonalGoals1,
  evaluatorTotalPointPersonalGoals2,
  setDefaultActiveKey,
  setDisabled,
  setHasEvaluator2,
  setKeyNewTabs,
  setListPointBehavior,
  setMaxOrder,
  setMode1,
  setMode2,
  setMode3,
  setOpenPopUp,
  setPointAchievementAdditional,
  setUpdatedTime,
  userEvaluationBehaviorSkill,
  userEvaluationPersonalGoalsList,
  userEvaluationSetBehaviorSkillScoreEvaluator05,
  userEvaluationSetBehaviorSkillScoreEvaluator1,
  userEvaluationSetBehaviorSkillScoreEvaluator2,
  userEvaluationSetBehaviorSkillScoreUser,
  userTotalPointPersonalGoals,
} from '../../../store/total';
import {
  get2WithoutRound,
  validateTableSubColumn,
} from '../../../views/user/evaluation-8-10/components/valildateInputField';
import { roundNumber } from '../../../views/user/evaluation-8-10/checkDisplayCondition';
import evaluationDetailApiService from '../../../common/api/evaluation8-10';
import download from 'downloadjs';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import LoadingScreenComponent from '../../../views/loading/LoadingScreenComponent';
import UserEvaluationInforComponent from '../../../views/user/evaluation/UserEvaluationInforComponent';
import TotalComp8 from '../../../views/user/evaluation-8-10/TotalComp8';
import PrintDetailReview810 from '../../evaluation-print-review/evaluation-detail8-10/printDetailReview8-10';
import ButtonComponent from '../../../views/user/evaluation-8-10/components/buttonComponent';
import EvaluationBehavior from '../../../views/user/evaluation-8-10/components/EvaluationBehavior';
import {
  PointListBehaviors,
  UserEvaluationBasicBehaviorType,
} from '../../../types/pages/user-evaluation/UserEvaluationType';
import EvaluationPersonalGoals from '../../../views/user/evaluation-8-10/components/EvaluationPersonalGoals';
import TotalPoint8NoSkill from '../../../views/user/evaluation-8-10/TotalPoint8NoSkill';
import EvaluationAchievementPersonal from '../../../views/user/evaluation-8-10/components/EvaluationAchievementPersonal';
import { setDetailLoading } from '../../../store/loading';

interface RecordInfo {
  id: number;
  userInfo: any;
  statusNo: statusEvaluationType;
  status: statusEvaluationType;
  evaluationId: number;
}

interface Props {
  flagSkill: number | undefined;
  role: string;
}

const Evaluation810NoSkill = (props: Props) => {
  const { role } = props;
  const Location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form] = Form.useForm();

  const store = useSelector((state: RootState) => state);
  const storeSubmit = useSelector((state: RootState) => state.calculateTotal);
  const dispatch = useDispatch<AppDispatch>();

  const isEvaluatorUser = role === 'user';

  const state = Location.state;
  const typeReview = Location.state?.type;
  const isReview = role === 'reviewer';
  const recordInfo = Location.state as RecordInfo;

  const evaluationId = Number(state?.id);

  const [allowSeeList, setAllSeeList] = React.useState<EvaluatorInfo[]>([]);

  const [dataSubs, setDataSub] = useState([] as SubList[]);

  const [dataSources, setDataSource] = React.useState<EvaluationPersonalAchievement[]>([]);

  const [additionDatas, setAdditionData] = React.useState<EvaluationAdditionalAchievement[]>([]);

  const [commentData, setCommentData] = React.useState({} as CommentContent);

  const [checkList, setCheckList] = React.useState<EvaluatorInfo[]>([]);

  const [status, setStatus] = React.useState(role === 'user' ? recordInfo?.statusNo : recordInfo?.status);

  const [commonInfo, setRecordInfo] = React.useState<UserInfo>(Location.state ?? []);

  const [listEvalutors, setListEvaluator] = React.useState<EvaluatorInfo[]>([]);

  const [approveRejectContent, setApproveRejectContent] = React.useState('');

  const [ownerId, setOwnerId] = React.useState<number>();

  const [isEvaluationDate, setEvaluationDate] = useState<boolean>(false);

  const [isGoalDate, setGoalDate] = useState<boolean>(false);

  const [isOpenSubmitPop, setOpenSubmitPop] = React.useState<boolean>(false);

  const [isOpenApprovePop, setOpenApprovePop] = React.useState<boolean>(false);

  const [isOpen, setOpen] = useState(false);

  const [isLoading, setLoading] = React.useState<boolean>(false);

  const [isLoadingData, setLoadingData] = React.useState(true);

  const [api, contextHolder] = notification.useNotification();

  const [defaultExpandedRowKeys, setDefaultExpandedRowKeys] = React.useState<number[]>([0]);

  const [errorExpandedRowKeys, setErrorExpandedRowKeys] = React.useState<number[]>([]);

  const [selectedOrder, setSelectedOrder] = React.useState('');

  const [errorRowIndexList, setErrorRowIndex] = React.useState<number[]>([]);

  const [ExpandedRowKeys2s, setExpandedRowKeys2] = React.useState<number[]>([]);

  const [evaluationData, setEvaluationData] = React.useState({} as EvaluationInfo);

  const [settingAchievementAdditionals, setSettingAchievementAdditional] = React.useState(
    {} as SettingAchievementAdditional[],
  );

  const [settingAchievementPersonalType1s, setSettingAchievementPersonalType1] = React.useState(
    {} as SettingAchievementPersonal[],
  );

  const [settingAchievementPersonalType2s, setSettingAchievementPersonalType2] = React.useState(
    {} as SettingAchievementPersonal[],
  );

  const [settingAchievementPersonalType3s, setSettingAchievementPersonalType3] = React.useState(
    {} as SettingAchievementPersonal[],
  );

  const [settingAchievementPersonalType4s, setSettingAchievementPersonalType4] = React.useState(
    {} as SettingAchievementPersonal[],
  );
  const [settingFormula810s, setSettingFormula810] = React.useState({} as SettingFormula810[]);

  const [isAffixed, setIsAffixed] = useState<boolean>();

  const [optionPdfList, setOptionPdfList] = useState({
    orientation: 'p',
    size: 'a4',
  });

  const [maxPointSettingFormula810, setMaxPointSettingFormula810] = React.useState<number>();
  const [minPointSettingFormula810, setMinPointSettingFormula810] = React.useState<number>();

  const [maxPointSettingFormula17, setMaxPointSettingFormula17] = React.useState<number>();
  const [minPointSettingFormula17, setMinPointSettingFormula17] = React.useState<number>();

  // const openNotification =  (msg: string) => {
  //   api.warning({
  //     message: <Typography.Title level={4}>{t('IDS_NOTIFY')}</Typography.Title>,
  //     description: msg,
  //     placement: 'bottomRight',
  //     duration: 3,
  //   });
  // };
  const openNotification = useCallback(
    (msg: string) => {
      api.warning({
        message: <Typography.Title level={4}>{t('IDS_NOTIFY')}</Typography.Title>,
        description: msg,
        placement: 'bottomRight',
        duration: 3,
      });
    },
    [t],
  );
  const [personalGoalsLists, setPersonalGoalsList] = useState<EvaluationPersonalAchievement[]>([]);
  const [flagSkill, setFlagSkill] = useState<number | undefined>(undefined);
  const [isReject, setReject] = useState(false);
  const [evaluationPeriod, setEvaluationPeriod] = useState<{
    dateCreationGoalDepartmentEnd: string;
    dateCreationGoalDepartmentStart: string;
    dateCreationGoalEnd: string;
    dateCreationGoalStart: string;
    dateEvaluationDepartmentEnd: string;
    dateEvaluationDepartmentStart: string;
    dateEvaluationEnd: string;
    dateEvaluationStart: string;
    id: number;
    periodEnd: string;
    periodIndex: number;
    periodStart: string;
    year: string;
  } | null>(null);
  useEffect(() => {
    processData(true);
    dispatch(setDefaultActiveKey('1'));
    dispatch(checkWeight2(true));
    dispatch(checkWeightNew2(true));
    dispatch(setKeyNewTabs('1'));
  }, [Location.state]);
  const comment05InfoList = listEvalutors.filter((item: EvaluatorInfo) => {
    return item.evaluationOrder === '0.5';
  });

  const comment1InfoList = listEvalutors.filter((item: EvaluatorInfo) => {
    return item.evaluationOrder === '1.0';
  });

  const comment2InfoList = listEvalutors.filter((item: EvaluatorInfo) => {
    return item.evaluationOrder === '2.0';
  });

  let isDisplay05: number | boolean = role === 'admin' && comment05InfoList.length;

  let isDisplay1: number | boolean = role === 'admin' && comment1InfoList.length;

  let isDisplay2: number | boolean = role === 'admin' && comment2InfoList.length;

  allowSeeList.forEach((item: EvaluatorInfo) => {
    if (item.evaluationOrder === '0.5') isDisplay05 = true;
    if (item.evaluationOrder === '1.0') isDisplay1 = true;
    if (item.evaluationOrder === '2.0') isDisplay2 = true;
  });

  const isChangeTextInputEx =
    ([0, 1, 2].includes(status) && isEvaluatorUser && isGoalDate) ||
    (role === 'user' && [50, 51, 52].includes(status) && isEvaluationDate) ||
    (isDisplay05 && [54, 55].includes(status) && isEvaluationDate && role !== 'admin') ||
    (isDisplay1 && [57, 58].includes(status) && isEvaluationDate && role !== 'admin') ||
    (isDisplay2 && [60, 61].includes(status) && isEvaluationDate && role !== 'admin')
      ? t('IDS_INPUT')
      : t('IDS_REFERENCE');
  const isChangeTextInput =
    (role === 'user' && [50, 51, 52].includes(status) && isEvaluationDate) ||
    (isDisplay05 && [54, 55].includes(status) && isEvaluationDate && role !== 'admin') ||
    (isDisplay1 && [57, 58].includes(status) && isEvaluationDate && role !== 'admin') ||
    (isDisplay2 && [60, 61].includes(status) && isEvaluationDate && role !== 'admin')
      ? t('IDS_INPUT')
      : t('IDS_REFERENCE');
  const listEvaluation8Tmps: { key: string; title: ReactNode; component: any }[] = [
    {
      key: '1',
      title: (
        <>
          <Badge count={isChangeTextInputEx} offset={[-45, -12]}>
            {status < 50 ? t('IDS_GOAL_DEPARTMENT') : t('IDS_DEPARTMENT_RESULTS')}
          </Badge>
        </>
      ),
      component: (
        <EvaluationGoalDepartment
          setDataSource={setDataSource}
          dataSource={dataSources}
          status={status}
          role={role}
          level={'8-10'}
          dataSub={dataSubs}
          setDataSub={setDataSub}
          allowSeeList={allowSeeList}
          Form={Form}
          form={form}
          defaultExpandedRowKeys={defaultExpandedRowKeys}
          setDefaultExpandedRowKeys={setDefaultExpandedRowKeys}
          isEvaluationDate={isEvaluationDate}
          isGoalDate={isGoalDate}
          errorExpandedRowKeys={errorExpandedRowKeys}
          listEvalutor={listEvalutors}
          errorRowIndexList={errorRowIndexList}
          setExpandedRowKeys2={setExpandedRowKeys2}
          ExpandedRowKeys2={ExpandedRowKeys2s}
          settingAchievementPersonalType1={settingAchievementPersonalType1s}
          settingAchievementPersonalType2={settingAchievementPersonalType2s}
          location={recordInfo}
          isLoading={isLoading}
          setLoading={setLoading}
          evaluationData={evaluationData}
        />
      ),
    },

    {
      title: (
        <>
          <Badge count={isChangeTextInputEx} offset={[-85, -12]}>
            {t('IDS_ACHIEVEMENT_ADDITIONAL')}
          </Badge>
        </>
      ),
      key: '2',
      component: (
        <EvaluationAdditionalDepartment
          status={status}
          role={role}
          additionData={additionDatas}
          setAdditionData={setAdditionData}
          allowSeeList={allowSeeList}
          Form={Form}
          form={form}
          listEvalutor={listEvalutors}
          isEvaluationDate={isEvaluationDate}
          settingAchievementAdditional={settingAchievementAdditionals}
          achievementData={dataSources}
          isLoading={isLoading}
          location={recordInfo}
        />
      ),
    },
    {
      title: (
        <>
          <Badge count={isChangeTextInput} offset={[-85, -12]}>
            {t('IDS_COMMENT')}
          </Badge>
        </>
      ),
      key: '3',
      component: (
        <EvaluationComment
          status={status}
          role={role}
          commentData={commentData}
          listEvalutor={listEvalutors}
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
    },
  ];
  const listItemsPersonals: { key: string; title: ReactNode; component: any }[] = [
    {
      title: (
        <>
          <Badge count={isChangeTextInput} offset={[-65, -12]}>
            {t('IDS_BEHAVIOR')}
          </Badge>
        </>
      ),
      key: '1',
      component: (
        <EvaluationBehavior
          form={form}
          level={user?.level || 7}
          openNotification={openNotification}
          statusEvaluation={status}
          role={role}
          isEvaluationDate={isEvaluationDate}
          isGoalDate={isGoalDate}
          isDisable={store.calculateTotal.isDisable}
          listEvalutors={listEvalutors}
          allowSeeList={allowSeeList}
          maxOrder={store.calculateTotal.maxOrder}
          pointListBehaviors={store.calculateTotal.pointListBehaviors}
          listBehaviors={store.calculateTotal.evaluationBehaviorSkills}
          isLoading={isLoading}
          evaluationData={evaluationData}
          isReview={isReview}
          typeReview={typeReview}
          location={recordInfo}
        />
      ),
    },
    {
      title: (
        <>
          <Badge count={isChangeTextInputEx} offset={[-45, -12]}>
            {status < 50 || (status === 50 && !isEvaluationDate)
              ? t('IDS_ACHIEVEMENT_PERSONAL')
              : t('IDS_PERSONAL_RESULT')}
          </Badge>
        </>
      ),
      key: '2',
      component: (
        <EvaluationPersonalGoals
          settingAchievementPersonalType3s={settingAchievementPersonalType3s}
          settingAchievementPersonalType4s={settingAchievementPersonalType4s}
          form={form}
          level={user?.level || 7}
          openNotification={openNotification}
          statusEvaluation={status}
          listPersonalGoals={personalGoalsLists}
          role={role}
          isEvaluationDate={isEvaluationDate}
          isGoalDate={isGoalDate}
          isDisable={store.calculateTotal.isDisable}
          listEvalutors={listEvalutors}
          allowSeeList={allowSeeList}
          maxOrder={store.calculateTotal.maxOrder}
          setPersonalGoalsList={setPersonalGoalsList}
          location={recordInfo}
          setLoading={setLoading}
          isLoading={isLoading}
          evaluationData={evaluationData}
        />
      ),
    },
    {
      title: (
        <>
          <Badge count={isChangeTextInputEx} offset={[-85, -12]}>
            {t('IDS_ACHIEVEMENT_ADDITIONAL')}
          </Badge>
        </>
      ),
      key: '3',
      component: (
        <EvaluationAchievementPersonal
          form={form}
          level={user?.level || 7}
          openNotification={openNotification}
          statusEvaluation={status}
          role={role}
          isEvaluationDate={isEvaluationDate}
          isGoalDate={isGoalDate}
          isDisable={store.calculateTotal.isDisable}
          listEvalutors={listEvalutors}
          allowSeeList={allowSeeList}
          maxOrder={store.calculateTotal.maxOrder}
          pointAchievementAdditionals={store.calculateTotal.pointAchievementAdditionals}
          isLoading={isLoading}
          location={recordInfo}
        />
      ),
    },
  ];

  let listEvaluations: { key: string; title: ReactNode; component: any }[] = listEvaluation8Tmps;
  let personals: { key: string; title: ReactNode; component: any }[] = [];
  if (status < 50 || (status === 50 && !isEvaluationDate)) {
    listEvaluations = [...listEvaluation8Tmps.slice(0, 1)];
    personals = [
      ...listItemsPersonals.slice(1, 2).map((v) => {
        v.key = '1';

        return v;
      }),
      ...listItemsPersonals.slice(0, 1).map((v) => {
        v.key = '2';

        return v;
      }),
    ];
  } else {
    listEvaluations = [...listEvaluation8Tmps.slice(0, 3)];
    personals = [...listItemsPersonals.slice(0, 3)];
  }

  //
  const onChange = (key: string) => {
    dispatch(setDefaultActiveKey(key));
  };

  //
  const handleParentKey = (key: string) => {
    dispatch(setDefaultActiveKey('1'));
    dispatch(setKeyNewTabs(key));
  };

  //
  const tabParents: { key: string; title: ReactNode; component: any }[] = [
    {
      key: '1',
      title: (
        <Typography.Text className="title">
          {status > 50 || (status === 50 && isEvaluationDate) ? t('IDS_DIVISION_EVALUATION') : t('IDS_GOAL_DEPARTMENT')}
        </Typography.Text>
      ),
      component: (
        <Tabs
          type="card"
          onChange={onChange}
          defaultActiveKey={store.calculateTotal.defaultActiveKey}
          activeKey={store.calculateTotal.defaultActiveKey}
          items={listEvaluations.map((v) => {
            return {
              label: (
                <>
                  <span>{v.title}</span>
                </>
              ),
              key: v.key,
              children: v.component,
              forceRender: true,
            };
          })}
        />
      ),
    },
    {
      key: '2',
      title:
        status > 50 || (status === 50 && isEvaluationDate)
          ? t('IDS_EVALUATION_PERSONAL')
          : t('IDS_ACHIEVEMENT_PERSONAL'),
      component: (
        <Tabs
          type="card"
          onChange={onChange}
          defaultActiveKey={store.calculateTotal.defaultActiveKey}
          activeKey={store.calculateTotal.defaultActiveKey}
          items={personals.map((v) => {
            return {
              label: (
                <>
                  <span>{v.title}</span>
                </>
              ),
              key: v.key,
              children: v.component,
              forceRender: true,
            };
          })}
        />
      ),
    },
  ];

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

  // ==========================
  const processData = async (isInitScreen = false) => {
    dispatch(setDetailLoading(true));

    if (isInitScreen) {
      setLoadingData(true);
    }

    const url =
      role === 'user'
        ? `/api/v1/f1/user/evaluation8-10/${evaluationId}/${user?.id}`
        : role === 'evaluator'
        ? `/api/v1/f2/evaluator/evaluation8-10/${evaluationId}/${user?.id}`
        : `/api/v1/common/review-evaluation/detail810/${evaluationId}/${user?.id}`;
    await httpAxios.Get(url, { params: { role } }).then((res: any) => {
      if (res && res.status === 200) {
        const decode = decrypt(res.data);
        if (decode) {
          const data = JSON.parse(decode);

          if (!isReview) {
            const resData = data as EvaluationResponse;

            setFlagSkill(resData.flagSkill ? resData.flagSkill : undefined);
            setRecordInfo(resData.userInfo);
            dispatch(setDisabled(resData.isDisable));
            dispatch(setHasEvaluator2(resData.hasEvaluator2));
            dispatch(setMode1(resData.hasMode1));
            dispatch(setMode2(resData.hasMode2));
            dispatch(setMode3(resData.hasMode3));
            dispatch(setMaxOrder(resData.maxOrder));
            if (resData.results.evaluationList.status >= 50) {
              const sortBehaviors = resData.results.evaluationList.evaluationBasicBehavior.sort((a, b) => {
                return a.itemNo - b.itemNo;
              });
              dispatch(userEvaluationBehaviorSkill(sortBehaviors));
            } else {
              const sortBehaviors = resData.results.evaluationList.listBehaviorNoSkill.sort((a, b) => {
                return a.itemNo - b.itemNo;
              });

              dispatch(userEvaluationBehaviorSkill(sortBehaviors));
            }

            setAllSeeList(
              state?.evaluatorOrderExcep
                ? resData.results.evaluationList.evaluator.filter(
                    (v) => Number(v.evaluationOrder) <= (state?.evaluatorOrderExcep || 0),
                  )
                : resData.allowSeeList,
            );
            const dataList = resData.results;
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
                  state?.evaluatorOrderExcep
                    ? dataList.evaluationList.evaluator.filter(
                        (v) => Number(v.evaluationOrder) <= (state?.evaluatorOrderExcep || 0),
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

            //
            setSettingAchievementPersonalType1(resData.results.versionSetting8?.settingAchievementPersonalType1);
            setSettingAchievementPersonalType2(resData.results.versionSetting8?.settingAchievementPersonalType2);

            setSettingAchievementPersonalType3(resData.results.settingAchievementPersonalType3);
            setSettingAchievementPersonalType4(resData.results.settingAchievementPersonalType4);

            // setPointAchievementAdditional(resData.results.settingAchievementAdditional2);
            dispatch(setPointAchievementAdditional(resData.results.settingAchievementAdditional2));

            //
            const behaviorListOptions: PointListBehaviors[] = [];
            resData.results.settingPointBasicBehaviorPros
              .filter((v) => v.type === 2)
              .map((v) => {
                behaviorListOptions.push({
                  label: v.point.toString(),
                  value: v.point,
                });
              });
            dispatch(setListPointBehavior(behaviorListOptions));
            dispatch(userEvaluationSetBehaviorSkillScoreUser(resData.results.evaluationList.behaviorTotalPointUser));
            dispatch(
              userEvaluationSetBehaviorSkillScoreEvaluator05(
                resData.results.evaluationList.behaviorTotalPointEvaluator05,
              ),
            );
            dispatch(
              userEvaluationSetBehaviorSkillScoreEvaluator1(
                resData.results.evaluationList.behaviorTotalPointEvaluator1,
              ),
            );
            dispatch(
              userEvaluationSetBehaviorSkillScoreEvaluator2(
                resData.results.evaluationList.behaviorTotalPointEvaluator2,
              ),
            );
            setMaxPointSettingFormula810(resData.results.versionSetting8?.maxPoint);
            setMinPointSettingFormula810(resData.results.versionSetting8?.minPoint);

            setMaxPointSettingFormula17(resData.results.versionSetting7?.maxPoint);
            setMinPointSettingFormula17(resData.results.versionSetting7?.minPoint);
            if (personalAchieLists.length) {
              setDataSource(personalAchieLists);
            } else if (role === 'user') {
              const dataSubTemps: {
                key: number;
                evaluationDecision: string;
                coefficient: number;
                parentKey: number;
              }[] = [];
              resData.results.versionSetting8?.settingAchievementPersonalType2.map(
                (item: SettingAchievementPersonal, index: number) => {
                  dataSubTemps.push({
                    key: index,
                    evaluationDecision: '',
                    coefficient: item.point,
                    parentKey: 0,
                  });
                },
              );
              setDataSource([{ itemNo: 0, evaluationAchievementPersonalSub: dataSubTemps, key: 0, type: 3 }]);
            }

            // Personal goals new

            const evaluationAchievementPersonalOfUsers = dataList.evaluationList
              .evaluationAchievementPersonalsOfUsers as EvaluationPersonalAchievement[];
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
            if (evaluationAchievementPersonalOfUsers.length) {
              setPersonalGoalsList(evaluationAchievementPersonalOfUsers);
              dispatch(userEvaluationPersonalGoalsList(evaluationAchievementPersonalOfUsers));
              dispatch(checkWeightNew(evaluationAchievementPersonalOfUsers));
            } else {
              const dataSubTemps: {
                key: number;
                evaluationDecision: string;
                coefficient: number;
                parentKey: number;
                degree: string;
              }[] = [];

              resData.results.settingAchievementPersonalType4.map((v, index) => {
                dataSubTemps.push({
                  key: index,
                  evaluationDecision: '',
                  coefficient: v.point,
                  parentKey: 0,
                  degree: v.note,
                });
              });
              setPersonalGoalsList([
                {
                  weight: undefined,
                  evaluationAchievementPersonalSub: dataSubTemps,
                  achievementValue: undefined,
                  difficultyUser: undefined,
                  method: undefined,
                  title: undefined,
                  itemNo: 0,
                  key: 0,
                  type: 2,
                  evaluationId: evaluationId,
                },
              ]);
              dispatch(
                userEvaluationPersonalGoalsList([
                  {
                    weight: null,
                    evaluationAchievementPersonalSub: dataSubTemps,
                    achievementValue: null,
                    difficultyUser: null,
                    method: null,
                    title: null,
                    itemNo: 0,
                    key: 0,
                    type: 2,
                    evaluationId: evaluationId,
                  },
                ]),
              );
            }
            dispatch(
              userTotalPointPersonalGoals(
                resData.results.evaluationList.achievementPersonalTotalPointUser !== null
                  ? Math.round(resData.results.evaluationList.achievementPersonalTotalPointUser)
                  : null,
              ),
            );
            dispatch(
              evaluatorTotalPointPersonalGoals05(
                resData.results.evaluationList.achievementPersonalTotalPointEvaluator05 !== null
                  ? Math.round(resData.results.evaluationList.achievementPersonalTotalPointEvaluator05)
                  : null,
              ),
            );
            dispatch(
              evaluatorTotalPointPersonalGoals1(
                resData.results.evaluationList.achievementPersonalTotalPointEvaluator1 !== null
                  ? Math.round(resData.results.evaluationList.achievementPersonalTotalPointEvaluator1)
                  : null,
              ),
            );
            dispatch(
              evaluatorTotalPointPersonalGoals2(
                resData.results.evaluationList.achievementPersonalTotalPointEvaluator2 !== null
                  ? Math.round(resData.results.evaluationList.achievementPersonalTotalPointEvaluator2)
                  : null,
              ),
            );

            //  Mục tiêu cá nhân thêm
            const achievemenAdditionalSortList = dataList.evaluationList.evaluationAchievementAdditionalOfUsers
              .sort((v, i) => {
                return v.itemNo - i.itemNo;
              })
              .map((v, i) => {
                return {
                  ...v,
                  itemNo: i,
                };
              });

            // setAchievementAdditionalGoals(achievemenAdditionalSortList);
            // dispatchAddPersonal({type: 'INITIAL_VALUE', payload: achievemenAdditionalSortList});
            dispatch(evaluationListAchievementAdditionals(achievemenAdditionalSortList));
            dispatch(
              evaluationTotalPointAchievementUser(
                resData.results.evaluationList.achievementAdditionalTotalPointUser !== null
                  ? get2WithoutRound(resData.results.evaluationList.achievementAdditionalTotalPointUser)
                  : null,
              ),
            );
            dispatch(
              evaluationTotalPointAchievementEvaluator05(
                resData.results.evaluationList.achievementAdditionalTotalPointEvaluator05 !== null
                  ? get2WithoutRound(resData.results.evaluationList.achievementAdditionalTotalPointEvaluator05)
                  : null,
              ),
            );
            dispatch(
              evaluationTotalPointAchievementEvaluator1(
                resData.results.evaluationList.achievementAdditionalTotalPointEvaluator1 !== null
                  ? get2WithoutRound(resData.results.evaluationList.achievementAdditionalTotalPointEvaluator1)
                  : null,
              ),
            );
            dispatch(
              evaluationTotalPointAchievementEvaluator2(
                resData.results.evaluationList.achievementAdditionalTotalPointEvaluator2 !== null
                  ? get2WithoutRound(resData.results.evaluationList.achievementAdditionalTotalPointEvaluator2)
                  : null,
              ),
            );

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

            setFlagSkill(resData.flagSkill ? resData.flagSkill : undefined);
            setRecordInfo(resData.userInfo);
            dispatch(setDisabled(true));
            dispatch(setHasEvaluator2(resData.hasEvaluator2));
            dispatch(setMode1(resData.hasMode1));
            dispatch(setMode2(resData.hasMode2));
            dispatch(setMode3(resData.hasMode3));
            dispatch(setMaxOrder(resData.maxOrder));
            if (resData.results.evaluationList.status >= 50) {
              const sortBehaviors = resData.results.evaluationList.evaluationBasicBehavior.sort((a, b) => {
                return a.itemNo - b.itemNo;
              });
              dispatch(userEvaluationBehaviorSkill(sortBehaviors));
            } else {
              const sortBehaviors = resData.results.evaluationList.listBehaviorNoSkill.sort((a, b) => {
                return a.itemNo - b.itemNo;
              });

              dispatch(userEvaluationBehaviorSkill(sortBehaviors));
            }
            setAllSeeList(
              [3, 5, 6].includes(typeReview)
                ? resData.results.evaluationList.evaluator.filter(
                    (v) => Number(v.evaluationOrder) <= (state?.evaluatorOrderExcep || 0),
                  )
                : [],
            );
            const dataList = resData.results;
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
                    (v) => Number(v.evaluationOrder) <= (state?.evaluatorOrderExcep || 0),
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

            //
            setSettingAchievementPersonalType1(resData.results.versionSetting8?.settingAchievementPersonalType1);
            setSettingAchievementPersonalType2(resData.results.versionSetting8?.settingAchievementPersonalType2);

            setSettingAchievementPersonalType3(resData.results.settingAchievementPersonalType3);
            setSettingAchievementPersonalType4(resData.results.settingAchievementPersonalType4);

            // setPointAchievementAdditional(resData.results.settingAchievementAdditional2);
            dispatch(setPointAchievementAdditional(resData.results.settingAchievementAdditional2));

            //
            const behaviorListOptions: PointListBehaviors[] = [];
            resData.results.settingPointBasicBehaviorPros
              .filter((v) => v.type === 2)
              .map((v) => {
                behaviorListOptions.push({
                  label: v.point.toString(),
                  value: v.point,
                });
              });
            dispatch(setListPointBehavior(behaviorListOptions));
            dispatch(userEvaluationSetBehaviorSkillScoreUser(resData.results.evaluationList.behaviorTotalPointUser));
            dispatch(
              userEvaluationSetBehaviorSkillScoreEvaluator05(
                resData.results.evaluationList.behaviorTotalPointEvaluator05,
              ),
            );
            dispatch(
              userEvaluationSetBehaviorSkillScoreEvaluator1(
                resData.results.evaluationList.behaviorTotalPointEvaluator1,
              ),
            );
            dispatch(
              userEvaluationSetBehaviorSkillScoreEvaluator2(
                resData.results.evaluationList.behaviorTotalPointEvaluator2,
              ),
            );
            setMaxPointSettingFormula810(resData.results.versionSetting8?.maxPoint);
            setMinPointSettingFormula810(resData.results.versionSetting8?.minPoint);

            setMaxPointSettingFormula17(resData.results.versionSetting7?.maxPoint);
            setMinPointSettingFormula17(resData.results.versionSetting7?.minPoint);
            if (personalAchieLists.length) {
              setDataSource(personalAchieLists);
            }

            // Personal goals new
            const evaluationAchievementPersonalOfUsers = dataList.evaluationList
              .evaluationAchievementPersonalsOfUsers as EvaluationPersonalAchievement[];
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
            if (evaluationAchievementPersonalOfUsers.length) {
              setPersonalGoalsList(evaluationAchievementPersonalOfUsers);
              dispatch(userEvaluationPersonalGoalsList(evaluationAchievementPersonalOfUsers));
            } else {
              const dataSubTemps: {
                key: number;
                evaluationDecision: string;
                coefficient: number;
                parentKey: number;
                degree: string;
              }[] = [];

              resData.results.settingAchievementPersonalType4.map((v, index) => {
                dataSubTemps.push({
                  key: index,
                  evaluationDecision: '',
                  coefficient: v.point,
                  parentKey: 0,
                  degree: v.note,
                });
              });
              setPersonalGoalsList([
                {
                  weight: undefined,
                  evaluationAchievementPersonalSub: dataSubTemps,
                  achievementValue: undefined,
                  difficultyUser: undefined,
                  method: undefined,
                  title: undefined,
                  itemNo: 0,
                  key: 0,
                  type: 2,
                  evaluationId: evaluationId,
                },
              ]);
              dispatch(
                userEvaluationPersonalGoalsList([
                  {
                    weight: null,
                    evaluationAchievementPersonalSub: dataSubTemps,
                    achievementValue: null,
                    difficultyUser: null,
                    method: null,
                    title: null,
                    itemNo: 0,
                    key: 0,
                    type: 2,
                    evaluationId: evaluationId,
                  },
                ]),
              );
            }
            dispatch(
              userTotalPointPersonalGoals(
                resData.results.evaluationList.achievementPersonalTotalPointUser !== null
                  ? Math.round(resData.results.evaluationList.achievementPersonalTotalPointUser)
                  : null,
              ),
            );
            dispatch(
              evaluatorTotalPointPersonalGoals05(
                resData.results.evaluationList.achievementPersonalTotalPointEvaluator05 !== null
                  ? Math.round(resData.results.evaluationList.achievementPersonalTotalPointEvaluator05)
                  : null,
              ),
            );
            dispatch(
              evaluatorTotalPointPersonalGoals1(
                resData.results.evaluationList.achievementPersonalTotalPointEvaluator1 !== null
                  ? Math.round(resData.results.evaluationList.achievementPersonalTotalPointEvaluator1)
                  : null,
              ),
            );
            dispatch(
              evaluatorTotalPointPersonalGoals2(
                resData.results.evaluationList.achievementPersonalTotalPointEvaluator2 !== null
                  ? Math.round(resData.results.evaluationList.achievementPersonalTotalPointEvaluator2)
                  : null,
              ),
            );

            //  Mục tiêu cá nhân thêm
            const achievemenAdditionalSortList = dataList.evaluationList.evaluationAchievementAdditionalOfUsers
              .sort((v, i) => {
                return v.itemNo - i.itemNo;
              })
              .map((v, i) => {
                return {
                  ...v,
                  itemNo: i,
                };
              });

            // setAchievementAdditionalGoals(achievemenAdditionalSortList);
            // dispatchAddPersonal({type: 'INITIAL_VALUE', payload: achievemenAdditionalSortList});
            dispatch(evaluationListAchievementAdditionals(achievemenAdditionalSortList));
            dispatch(
              evaluationTotalPointAchievementUser(
                resData.results.evaluationList.achievementAdditionalTotalPointUser &&
                  get2WithoutRound(resData.results.evaluationList.achievementAdditionalTotalPointUser),
              ),
            );
            dispatch(
              evaluationTotalPointAchievementEvaluator05(
                resData.results.evaluationList.achievementAdditionalTotalPointEvaluator05 &&
                  get2WithoutRound(resData.results.evaluationList.achievementAdditionalTotalPointEvaluator05),
              ),
            );
            dispatch(
              evaluationTotalPointAchievementEvaluator1(
                resData.results.evaluationList.achievementAdditionalTotalPointEvaluator1 &&
                  get2WithoutRound(resData.results.evaluationList.achievementAdditionalTotalPointEvaluator1),
              ),
            );
            dispatch(
              evaluationTotalPointAchievementEvaluator2(
                resData.results.evaluationList.achievementAdditionalTotalPointEvaluator2 &&
                  get2WithoutRound(resData.results.evaluationList.achievementAdditionalTotalPointEvaluator2),
              ),
            );

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
      } else callbackError();
    });

    if (isInitScreen) {
      setLoadingData(false);
      dispatch(setDetailLoading(false));
    }
  };

  const backTo17Screen = () => {
    role === 'user'
      ? navigate(`/user/evaluation/${evaluationId}`, {
          state: { ...recordInfo, id: evaluationId },
        })
      : role === 'evaluator'
      ? navigate(`/evaluator/evaluation/${evaluationId}`, {
          state: { ...recordInfo, id: evaluationId },
        })
      : navigate(`/admin-evaluation/evaluation/${evaluationId}`, {
          state: { ...recordInfo, id: evaluationId },
        });
  };

  const validateTableSub = () => {
    let isError = false;
    const tempList: number[] = [];
    dataSources.map((data: EvaluationPersonalAchievement) => {
      const subDatas = data.evaluationAchievementPersonalSub;
      if (subDatas.length || Object.keys(subDatas).length) {
        Object.keys(subDatas).forEach((key: any) => {
          const canError = validateTableSubColumn(subDatas[key]?.evaluationDecision, 1000);
          if (!subDatas[key]?.evaluationDecision || canError) {
            tempList.push(data.key);
            isError = true;
          }
        });
      } else {
        tempList.push(data.key);
        isError = true;
      }
    });
    const newArrays = tempList.concat(defaultExpandedRowKeys);
    setDefaultExpandedRowKeys(newArrays);
    setErrorExpandedRowKeys(tempList);

    return isError;
  };

  const validateTableChildren = () => {
    let isError = false;
    const tempList: number[] = [];
    dataSources.map((data: EvaluationPersonalAchievement) => {
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
    setExpandedRowKeys2(tempList);

    return isError;
  };

  const handleMoveToTab = (tab: string, msg: string, parent: string) => {
    dispatch(setDefaultActiveKey(tab));
    dispatch(setKeyNewTabs(parent));

    openNotification(msg);
    setTimeout(() => {
      form.validateFields();
    }, 500);
  };
  const handleSubmit = async () => {
    const personalGoals =
      form.getFieldsValue(['personalGoals']) && form.getFieldsValue(['personalGoals']).personalGoals !== undefined
        ? form.getFieldsValue(['personalGoals']).personalGoals.filter((v: any) => v !== undefined)
        : [];

    dispatch(checkWeight(dataSources));
    dispatch(checkWeightNew(personalGoals));
    if (!store.calculateTotal.isEqual100New) {
      dispatch(checkWeightNew2(false));
    }
    if (!store.calculateTotal.isEqual100) {
      dispatch(checkWeight2(false));
    }
    const isErrorSub = validateTableSub();
    const isErrorChildrenTable = validateTableChildren();
    setReject(false);
    if (isErrorSub || isErrorChildrenTable || !dataSources.length) {
      handleMoveToTab('1', t('MESSAGE.COMMON.IDM_TAB_ERROR'), '1');
      setOpenSubmitPop(false);

      return;
    } else
      form
        .validateFields()
        .then(() => {
          // form.setFields([{ name: 'reject', errors: [] }]); // Clear validation errors for 'username'
          if (!store.calculateTotal.isEqual100) {
            return handleMoveToTab(
              '1',
              t('MESSAGE.COMMON.IDS_EQUAL_100_PERCENT').replace('{value}', t('IDS_WEIGHT')),
              '1',
            );
          }
          if (!store.calculateTotal.isEqual100New) {
            return handleMoveToTab(
              status < 50 || (status === 50 && !isEvaluationDate) ? '1' : '2',
              t('MESSAGE.COMMON.IDS_EQUAL_100_PERCENT').replace('{value}', t('IDS_WEIGHT')),
              '2',
            );
          }

          // Submit can not save invalid values
          if (!isErrorSub && !isErrorChildrenTable && store.calculateTotal.isEqual100 && dataSources.length) {
            setOpenSubmitPop(true);
          } else setLoading(false);
        })
        .catch((error) => {
          const errorList = error.errorFields;
          const checkName = errorList[0]?.name[0] as string;
          const arrayErrors = [];
          for (let index = 0; index < errorList.length; index++) {
            arrayErrors.push(errorList[index].name[0].split('_')[0]);
          }
          if (checkName) {
            if (
              arrayErrors.some((element) =>
                [
                  'title',
                  'achievement',
                  'method',
                  'achievementStatus',
                  'reasonComment',
                  'actionPlan',
                  'pointUser',
                  'coefficientUser',
                  'pointEvaluator05',
                  'coefficientEvaluator05',
                  'pointEvaluator1',
                  'coefficientEvaluator1',
                  'pointEvaluator2',
                  'coefficientEvaluator2',
                  '2_difficult',
                  '1_difficult',
                  '05_difficult',
                  'weight',
                  'user',
                ].includes(element),
              )
            ) {
              handleMoveToTab('1', t('MESSAGE.COMMON.IDM_TAB_ERROR'), '1');
            } else if (
              arrayErrors.some((element) =>
                [
                  'titleAdditional',
                  'additionAchievementStatus',
                  'additionReasonComment',
                  'additionPointUser',
                  'additionPointEvaluator05',
                  'additionPointEvaluator1',
                  'additionPointEvaluator2',
                  'additionTitle',
                ].includes(element),
              )
            ) {
              handleMoveToTab('2', t('MESSAGE.COMMON.IDM_TAB_ERROR'), '1');
            } else if (
              arrayErrors.some((element) =>
                [
                  'commentUser',
                  'publicCommentAdmin05',
                  'publicCommentAdmin1',
                  'publicCommentAdmin2',
                  'privateCommentAdmin05',
                  'privateCommentAdmin1',
                  'privateCommentAdmin2',
                ].includes(element),
              )
            ) {
              handleMoveToTab('3', t('MESSAGE.COMMON.IDM_TAB_ERROR'), '1');
            } else if (arrayErrors.some((element) => ['behavior'].includes(element))) {
              handleMoveToTab(
                status < 50 || (status === 50 && !isEvaluationDate) ? '2' : '1',
                t('MESSAGE.COMMON.IDM_TAB_ERROR'),
                '2',
              );
            } else if (arrayErrors.some((element) => ['personalGoals'].includes(element))) {
              handleMoveToTab(
                status < 50 || (status === 50 && !isEvaluationDate) ? '1' : '2',
                t('MESSAGE.COMMON.IDM_TAB_ERROR'),
                '2',
              );
            } else if (arrayErrors.some((element) => ['achivement'].includes(element))) {
              handleMoveToTab('3', t('MESSAGE.COMMON.IDM_TAB_ERROR'), '2');
            }
          }

          if (
            !checkName &&
            !errorList?.length &&
            !isErrorSub &&
            !isErrorChildrenTable &&
            store.calculateTotal.isEqual100
          ) {
            setOpenSubmitPop(true);
          }
        });
    setOpenSubmitPop(false);
  };

  const handleSaveDraft = () => {
    setLoading(true);

    processSaveFormData(true);
  };

  const processSaveFormData = async (isDraft: boolean) => {
    setLoading(true);
    dispatch(setDetailLoading(true));
    const filterPersonalForms =
      form.getFieldsValue(['personalGoals']) && form.getFieldsValue(['personalGoals']).personalGoals !== undefined
        ? form.getFieldsValue(['personalGoals']).personalGoals.filter((v: any) => v !== undefined)
        : [];

    //
    const additionalsPersonalForms =
      form.getFieldsValue(['achivement_personal']).achivement_personal !== undefined
        ? form.getFieldsValue(['achivement_personal']).achivement_personal.filter((v: any) => v !== undefined)
        : [];

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
    const evaluationBehaviorSkills =
      form.getFieldsValue(['behavior']) && form.getFieldsValue(['behavior']).behavior !== undefined
        ? form.getFieldsValue(['behavior']).behavior
        : [];
    const maps = evaluationBehaviorSkills.map((v: any, index: number) => {
      return {
        ...v,
        itemNo: index,
        versionBasicBehavior: {
          type: 6,
        },
        evaluationId: evaluationId,
      };
    });

    await httpAxios
      .Post(url, {
        dataSource: dataSources,
        additionData: additionDatas,
        commentData: commentData,
        checkList: checkList,
        evaluationId: evaluationId,
        status: status,
        listEvalutor: listEvalutors,
        listBehaviors: maps,
        listPersonalGoals: filterPersonalForms,
        achievementAdditionalPersonals: additionalsPersonalForms,
        isDraft: isDraft,
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

          // behavior
          behaviorTotalPointUser: store.calculateTotal.behaviorTotalPointUser ?? null,
          behaviorTotalPointEvaluator05: store.calculateTotal.behaviorTotalPointEvaluator05 ?? null,
          behaviorTotalPointEvaluator1: store.calculateTotal.behaviorTotalPointEvaluator1 ?? null,
          behaviorTotalPointEvaluator2: store.calculateTotal.behaviorTotalPointEvaluator2 ?? null,

          // Personal goals
          summaryAchievementPersonalTotalPointUser: store.calculateTotal.personalGoals ?? null,
          summaryAchievementPersonalTotalPointEvaluator05: store.calculateTotal.personalGoals05 ?? null,
          summaryAchievementPersonalTotalPointEvaluator1: store.calculateTotal.personalGoal1 ?? null,
          summaryAchievementPersonalTotalPointEvaluator2: store.calculateTotal.personalGoal2 ?? null,

          //
          summaryAchievementAdditionalTotalPointUser: store.calculateTotal.achievementUser ?? null,
          summaryAchievementAdditionalTotalPointEvaluator05: store.calculateTotal.achievementEvaluator05 ?? null,
          summaryAchievementAdditionalTotalPointEvaluator1: store.calculateTotal.achievementEvaluator1 ?? null,
          summaryAchievementAdditionalTotalPointEvaluator2: store.calculateTotal.achievementEvaluator2 ?? null,

          summaryPointUsers: store.calculateTotal.summaryPointUser ?? null,
          summaryPointEvaluator05s: store.calculateTotal.summaryPointEvaluator05 ?? null,
          summaryPointEvaluator1s: store.calculateTotal.summaryPointEvaluator1 ?? null,
          summaryPointEvaluator2s: store.calculateTotal.summaryPointEvaluator2 ?? null,
        },
        updatedTime: store.calculateTotal.updatedTime,
        evaluationOrder: store.calculateTotal.maxOrder,
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
    settingFormula810s.map((item: SettingFormula810) => {
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
        listEvalutor: listEvalutors,
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
        setOpenApprovePop(false);
        dispatch(setDetailLoading(false));
      })
      .catch(() => {
        setOpenApprovePop(false);
        dispatch(setDetailLoading(false));
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
        listEvalutor: listEvalutors,
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
            listEvalutor: listEvalutors,
            updatedTime: store.calculateTotal.updatedTime,
            maxOrder: store.calculateTotal.maxOrder,
          })
          .then(async (res: any) => {
            if (res && res.status === 201) {
              await processData();
              message.success(t('MESSAGE.COMMON.IDM_REJECT_SUCCESS'));
              dispatch(setOpenPopUp(false));
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
            <UserEvaluationInforComponent
              {...commonInfo}
              status={status}
              isEvaluationDate={isEvaluationDate}
              isNotEvaluator2={!store.calculateTotal.hasEvaluator2}
              header={t('IDS_DETAIL_EVALUATION')}
              historyApproveEvaluation={commonInfo.rejectComment}
              flagSkill={flagSkill}
              isEvaluatorUser={isEvaluatorUser}
              evaluatorOrder={Number(store.calculateTotal.maxOrder)}
              isReview={isReview}
              isF5={role == 'admin' ? true : false}
            />
            <>
              <Card style={{ marginBottom: 10 }}>
                {(status > 50 || (status === 50 && isEvaluationDate)) && (
                  <div style={{ marginBottom: 15 }}>
                    <Typography.Title level={3}>{t('IDS_EVALUATION_RESULT')}</Typography.Title>
                    <TotalComp8
                      dataSource={dataSources}
                      additionData={additionDatas}
                      status={status}
                      role={role}
                      listEvalutor={listEvalutors}
                      allowSeeList={allowSeeList}
                      checkList={checkList}
                      setCheckList={setCheckList}
                      Form={Form}
                      form={form}
                      isEvaluationDate={isEvaluationDate}
                      evaluationData={evaluationData}
                      settingAchievementAdditional={settingAchievementAdditionals}
                      settingFormula810={settingFormula810s}
                      maxPointSettingFormula810={maxPointSettingFormula810}
                      minPointSettingFormula810={minPointSettingFormula810}
                      isReview={isReview}
                      typeReview={typeReview}
                      location={recordInfo}
                      isLoading={isLoading}
                    />
                  </div>
                )}
                <div>
                  {(status < 50 || (status === 50 && !isEvaluationDate)) && (
                    <Typography.Title level={3}>{t('IDS_EVALUATION_DISTRIBUTION')}</Typography.Title>
                  )}
                  <TotalPoint8NoSkill
                    status={status}
                    role={role}
                    listEvalutors={listEvalutors}
                    allowSeeList={allowSeeList}
                    checkList={checkList}
                    setCheckList={setCheckList}
                    isEvaluationDate={isEvaluationDate}
                    evaluationData={evaluationData}
                    maxPoint={maxPointSettingFormula17}
                    minPoint={minPointSettingFormula17}
                    location={recordInfo}
                  />
                </div>
              </Card>
            </>

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

              {listEvaluations.length > 0 && !(isReview && typeReview === 3) && (
                <div style={{ overflow: 'clip' }}>
                  <Row gutter={[24, 24]}>
                    <Col span={24}>
                      <Tabs
                        type="line"
                        className="tab-test"
                        defaultActiveKey={store.calculateTotal.defaultNewActiveKey}
                        activeKey={store.calculateTotal.defaultNewActiveKey}
                        onChange={handleParentKey}
                        items={tabParents.map((v: any, i: any) => {
                          return {
                            label: (
                              <div>
                                <Radio.Group value={parseInt(store.calculateTotal.defaultNewActiveKey)}>
                                  {tabParents[i].key == '1' && (
                                    <Radio value={1}>
                                      <span>{tabParents[i].title}</span>
                                    </Radio>
                                  )}
                                  {tabParents[i].key != '1' && (
                                    <Radio value={2}>
                                      <span>{tabParents[i].title}</span>
                                    </Radio>
                                  )}
                                </Radio.Group>
                              </div>
                            ),
                            key: tabParents[i].key,
                            children: tabParents[i].component,
                            forceRender: true,
                            animated: true,
                          };
                        })}
                      />
                    </Col>
                  </Row>
                </div>
              )}
            </Space>
            {/* <div style={{ height: 10 }}></div> */}

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
                  dataSource={dataSources}
                  status={status}
                  role={role}
                  evaluationId={evaluationId}
                  handleReject={handleReject}
                  listEvalutor={listEvalutors}
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
                  setOpenApprovePop={setOpenApprovePop}
                  evaluatorOrderExcep={state?.evaluatorOrderExcep}
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
        {/* <ModalCustomComponent
          isOpen={isOpenApprovePop}
          header={t('POPUP_DIALOG.TITLE.CONFIRM')}
          content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_APPROVE')}
          fnHandleOk={handleApprove}
          fnHandleCancel={() => setOpenApprovePop(false)}
          okText={t('POPUP_DIALOG.BUTTON.APPROVE') as string}
          cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
          loading={isLoading}
        /> */}
        <ModalCustomComponent
          isOpen={isOpen}
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

        <ModalCustomComponent
          isOpen={isOpenApprovePop}
          header={t('POPUP_DIALOG.TITLE.CONFIRM')}
          content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_APPROVE')}
          fnHandleOk={confirmApprove}
          okText={t('POPUP_DIALOG.BUTTON.APPROVE') as string}
          cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
          fnHandleCancel={() => setOpenApprovePop(false)}
          loading={isLoading}
        />
      </div>
    </>
  );
};

export default Evaluation810NoSkill;
