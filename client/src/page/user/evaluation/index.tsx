// ** React Imports
import { useEffect, useState } from 'react';

// ** React router Inports
import { useLocation, useNavigate, useParams } from 'react-router-dom';

//  ** Antd Imports
// ** Type Imports
//  ** Component Imports
import userEvaluationApiService from '../../../common/api/userEvaluation';
import LoadingScreenComponent from '../../../views/loading/LoadingScreenComponent';
import Evaluation17HaveSkill from './Evaluation17HaveSkill';
import Evaluation17NoSkill from './Evaluation17NoSkill';
import { compareDatePeriod, decrypt, urlCompanyCode } from '../../../common/util';
import httpAxios from '../../../common/http';
import { useAuth } from '../../../hooks/useAuth';
import { UserEvaluationType } from '../../../types/pages/user-evaluation/UserEvaluationType';
import { AppDispatch, RootState } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
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
import { t } from 'i18next';
import { statusEvaluationType } from '../../../common/status';
import { setDetailLoading } from '../../../store/loading';

// ** I18 Imports
// ** Store & Actions Imports
type EvaluationRoleType = 'isEvaluationUser' | 'isEvaluationEvaluator';
interface Props {
  evalationType: EvaluationRoleType;
  isF5?: boolean;
}
type TabId = '1' | '2' | '3' | '4' | '5' | '6';
const UserEvaluationScreen = (props: Props) => {
  // ** Props
  const { evalationType, isF5 } = props;

  // ** State
  const [flagSkill, setFlahSkill] = useState<number | undefined>(undefined);
  const isEvaluatorUser = evalationType === 'isEvaluationUser';
  const [dataSources, setDataSource] = useState<UserEvaluationType>();
  const [isCreationGoalDate, setCreationGoalDate] = useState<boolean>(false);
  const [isEvaluationDate, setEvaluationDate] = useState<boolean>(false);
  const [tabId, setTabId] = useState<TabId>('1');
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [statusEvaluation, setStatusEvaluation] = useState<statusEvaluationType>(0);
  const [updateTime, setUpdateTime] = useState<any>();
  // ** Hook
  const { user } = useAuth();
  const location = useLocation();
  const state = location.state;
  const id = state?.id;
  const navigate = useNavigate();
  const params = useParams();
  // Reject comment
  const [rejectComment, setRejectComment] = useState({
    comment: '' as string,
    evaluationId: undefined as number | undefined,
    receiverOrder: '' as string,
    status: '' as string,
    type: undefined as number | undefined,
  });

  // ** Effect
  useEffect(() => {
    if (!state) {
      if (decrypt(params.id?.toString() || '') === undefined) {
        backToListScreen();
      } else {
        checkPermission().then(() => getEvaluationDetail());
      }
    } else {
      getEvaluationDetail();
    }
    dispatch(reset());
  }, [id, state]);
  const getEvaluationDetail = async (setDeplay?: boolean) => {
    const callback = (dataSource: UserEvaluationType) => {
      dispatch(setDetailLoading(false));
      if (dataSource.achievementAdditionalSetting && dataSource.achievementAdditionalSetting.length > 0) {
        const options = dataSource.achievementAdditionalSetting.map((v: any) => ({ value: v.point, label: v.rating }));
        dispatch(setAdditionalOptions(options));
      }
      setLoading(false);
      if (dataSource.evaluationLevel && Number(dataSource.evaluationLevel) > 7)
        return navigate(
          `${
            isF5
              ? `/admin-evaluation/evaluation-8-10/${!state ? decrypt(params.id?.toString() || '') : id}`
              : isEvaluatorUser
              ? `/user/evaluation-8-10/${!state ? decrypt(params.id?.toString() || '') : id}`
              : `/evaluator/evaluation-8-10/${!state ? decrypt(params.id?.toString() || '') : id}`
          }`,
          {
            replace: true,
            state: { ...state },
          },
        );

      setFlahSkill(dataSource.flagSkill);
      setDataSource(dataSource);
      if (dataSource.flagSkill === 1) {
        setCreationGoalDate(
          compareDatePeriod(
            dataSource.dateCreationGoalStart || dataSource.evaluationPeriod.dateCreationGoalStart,
            dataSource.dateCreationGoalEnd || dataSource.evaluationPeriod.dateCreationGoalEnd,
          ),
        );
        const isCompareDatePeriod = compareDatePeriod(
          dataSource.dateEvaluationStart || dataSource.evaluationPeriod.dateEvaluationStart,
          dataSource.dateEvaluationEnd || dataSource.evaluationPeriod.dateEvaluationEnd,
        );
        if (isCompareDatePeriod) {
          setEvaluationDate(isCompareDatePeriod);
        }

        // ** Display column user to self-evaluate
        if (
          [51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 98, 99, 100].includes(dataSource.status) ||
          (dataSource.status === 50 && isCompareDatePeriod)
        )
          setTabId('3');

        // ** Set state achievement/basic/pro skill redux
        dispatch(userEvaluationCalculatorProSkill(dataSource.proSkillList.filter((f) => f.itemId !== null)));
        dispatch(
          userEvaluationAchievement(
            dataSource.userEvaluationAchievements.filter((f) => f.achievementStatus !== t('IDS_SUB_TOTAL')),
          ),
        );
        dispatch(userEvaluationBasicSkill(dataSource.evaluationBasicSkills.filter((f) => f.content !== null)));
        dispatch(userEvaluationBehaviorSkill(dataSource.evaluationBehaviorSkills.filter((f) => f.content !== null)));
        dispatch(userEvaluationAchievementAdditional(dataSource.achievementAdditionals));

        // ** Set Pro formulas
        dispatch(userEvaluationSetSettingProFormula(dataSource.settingProFormulas));

        // ** Set basic/pro/behavior/achievement/achievement additional total score
        setUpdateTime(dataSource.updateTime);

        // ** Basic - Behavior - Pro Point Options
        dispatch(setBasicSkillPointOptions(dataSource.basicSkillPointOptions));
        dispatch(setBehaviorSkillPointOptions(dataSource.behaviorSkillPointOptions));
        dispatch(setProSkillPointOptions(dataSource.proSkillPointOptions));
      } else {
        setCreationGoalDate(
          compareDatePeriod(
            dataSource.dateCreationGoalStart || dataSource.evaluationPeriod.dateCreationGoalStart,
            dataSource.dateCreationGoalEnd || dataSource.evaluationPeriod.dateCreationGoalEnd,
          ),
        );
        const isCompareDatePeriod = compareDatePeriod(
          dataSource.dateEvaluationStart || dataSource.evaluationPeriod.dateEvaluationStart,
          dataSource.dateEvaluationEnd || dataSource.evaluationPeriod.dateEvaluationEnd,
        );
        if (isCompareDatePeriod) {
          setEvaluationDate(isCompareDatePeriod);
        }

        // ** Display column user to self-evaluate
        if (
          [51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 98, 99, 100].includes(dataSource.status) ||
          (dataSource.status === 50 && isCompareDatePeriod)
        )
          // ** Set state achievement/basic/pro skill redux
          //   dispatch(userEvaluationCalculatorProSkill(dataSource.proSkillList.filter((f) => f.itemId !== null)));
          dispatch(
            userEvaluationAchievement(
              dataSource.userEvaluationAchievements.filter((f) => f.achievementStatus !== t('IDS_SUB_TOTAL')),
            ),
          );

        //   dispatch(userEvaluationBasicSkill(dataSource.evaluationBasicSkills.filter((f) => f.content !== null)));
        dispatch(userEvaluationBehaviorSkill(dataSource.evaluationBehaviorSkills.filter((f) => f.content !== null)));
        dispatch(userEvaluationAchievementAdditional(dataSource.achievementAdditionals));

        // ** Set Pro formulas
        dispatch(userEvaluationSetSettingProFormula(dataSource.settingProFormulas));

        // ** Set basic/pro/behavior/achievement/achievement additional total score
        setUpdateTime(dataSource.updateTime);

        // ** Basic - Behavior - Pro Point Options
        //   dispatch(setBasicSkillPointOptions(dataSource.basicSkillPointOptions));
        dispatch(setBehaviorSkillPointOptions(dataSource.behaviorSkillPointOptions));

        //   dispatch(setProSkillPointOptions(dataSource.proSkillPointOptions));
        setDataSource((dataState: any) => ({
          ...dataState,
          historyApproveEvaluation: dataSource.rejectComment && dataSource.rejectComment.comment,
        }));
      }
      if (setDeplay) {
        setTimeout(() => {
          setStatusEvaluation(dataSource.status);
          setLoading(false);
        }, 300);
      } else {
        setStatusEvaluation(dataSource.status);
        setLoading(false);
      }
    };

    return await userEvaluationApiService.getUserEvaluationDetail({
      evaluationId: !state ? decrypt(params.id?.toString() || '') : id,
      isEvaluatorUser,
      isF5,
      callback,
      errorCallback: () => {
        setLoading(false);
        backToListScreen();
      },
    });
  };
  const checkPermission = async () => {
    const evaluationId = params.id;
    if (isEvaluatorUser) {
      await httpAxios
        .Get(`/api/v1/f1/user/check-permission/${Number(decrypt(evaluationId?.toString() || ''))}/${Number(user?.id)}`)
        .then((res) => {
          if (res && res.status === 200) {
            if (res.data) {
              navigate(`${window.location.pathname}`, {
                state: {
                  id: decrypt(evaluationId?.toString() || ''),
                },
              });
            } else backToListScreen();
          }
        });
    } else {
      await httpAxios
        .Get(
          `/api/v1/f2/evaluator/check-permission/${Number(decrypt(evaluationId?.toString() || ''))}/${Number(
            user?.id,
          )}`,
        )
        .then((res) => {
          if (res && res.status === 200) {
            if (res.data && res.data.length) {
              navigate(`${window.location.pathname}`, {
                state: {
                  id: decrypt(evaluationId?.toString() || ''),
                },
              });
            } else backToListScreen();
          }
        });
    }
  };
  const backToListScreen = () => {
    isEvaluatorUser
      ? navigate(urlCompanyCode() + '/user/list-evaluation')
      : !isF5
      ? navigate(urlCompanyCode() + '/evaluator/list-user-evaluation')
      : navigate(urlCompanyCode() + '/admin-evaluation/list-user-evaluation');
  };
  if (flagSkill === 1) {
    return (
      <Evaluation17HaveSkill
        {...{
          flagSkill,
          ...props,
          getEvaluationDetail,
          dataSources,
          setDataSource,
          isLoading,
          setLoading,
          isCreationGoalDate,
          setCreationGoalDate,
          isEvaluationDate,
          setEvaluationDate,
          setStatusEvaluation,
          statusEvaluation,
          updateTime,
          setUpdateTime,
          newestRecord: state.newestRecord,
        }}
      />
    );
  } else if (flagSkill === 0)
    return (
      <Evaluation17NoSkill
        {...{
          flagSkill,
          ...props,
          getEvaluationDetail,
          dataSources,
          setDataSource,
          isLoading,
          setLoading,
          isCreationGoalDate,
          setCreationGoalDate,
          isEvaluationDate,
          setEvaluationDate,
          setStatusEvaluation,
          statusEvaluation,
          updateTime,
          setUpdateTime,
          rejectComment,
          newestRecord: state.newestRecord,
          evaluationPeriod: dataSources?.evaluationPeriod,
        }}
      />
    );

  return (
    <div style={{ paddingBottom: 20, height: '100%' }}>
      <LoadingScreenComponent />
    </div>
  );
};
export default UserEvaluationScreen;
