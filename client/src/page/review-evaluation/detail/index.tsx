import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import reviewEvaluationApi from '../../../common/api/reviewEvaluation';
import Evaluation17HaveSkill from '../../user/evaluation/Evaluation17HaveSkill';
import Evaluation17NoSkill from '../../user/evaluation/Evaluation17NoSkill';
import LoadingScreenComponent from '../../../views/loading/LoadingScreenComponent';
import { UserEvaluationType } from '../../../types/pages/user-evaluation/UserEvaluationType';
import { statusEvaluationType } from '../../../common/status';
import {
  setAdditionalOptions,
  userEvaluationAchievement,
  userEvaluationAchievementAdditional,
  userEvaluationBasicSkill,
  userEvaluationBehaviorSkill,
  userEvaluationCalculatorProSkill,
  userEvaluationSetSettingProFormula,
} from '../../../store/userEvaluation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { t } from 'i18next';
import { urlCompanyCode } from '../../../common/util';

const ReviewEvaluationDetail: React.FC = () => {
  const [isFlagSkill, setIsFlagSKill] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusEvaluation, setStatusEvaluation] = useState<statusEvaluationType>(0);
  const [updateTime, setUpdateTime] = useState<Date>();
  const [dataSource, setDataSource] = useState<UserEvaluationType | undefined>();

  // sử dụng param sau này đổi sang location
  const location = useLocation();
  // const { id, type } = location.state;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const backToListScreen = () => {
    return navigate(urlCompanyCode() + '/reference-review');
  };

  useEffect(() => {
    if (!location.state) backToListScreen();
    else {
      getEvaluationDetail();
      setStatusEvaluation([1, 2].includes(Number(location.state.type)) ? 49 : 98);
    }
  }, []);

  const getEvaluationDetail = async (setDeplay?: boolean) => {
    const callback = (dataSource: UserEvaluationType) => {
      setIsLoading(false);

      setIsFlagSKill(dataSource.flagSkill);
      setDataSource(dataSource);

      if (dataSource.flagSkill === 1) {
        dispatch(userEvaluationCalculatorProSkill(dataSource.proSkillList.filter((f) => f.itemId !== null)));
        dispatch(
          userEvaluationAchievement(
            dataSource.userEvaluationAchievements.filter((f) => f.achievementStatus !== t('IDS_SUB_TOTAL')),
          ),
        );
        dispatch(userEvaluationBasicSkill(dataSource.evaluationBasicSkills.filter((f) => f.content !== null)));
        dispatch(userEvaluationBehaviorSkill(dataSource.evaluationBehaviorSkills.filter((f) => f.content !== null)));
        dispatch(userEvaluationAchievementAdditional(dataSource.achievementAdditionals));

        // dispatch(userEvaluationSetSettingProFormula(dataSource.settingProFormulas));
      } else {
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
        setDataSource((dataState: any) => ({
          ...dataState,
          historyApproveEvaluation: dataSource.rejectComment && dataSource.rejectComment.comment,
        }));
      }
    };

    return await reviewEvaluationApi.getDetailEvaluation(
      { idEvaluation: location.state.id, type: Number(location.state.type) },
      callback,
    );
  };

  if (isFlagSkill === 1) {
    return (
      <Evaluation17HaveSkill
        dataSources={dataSource}
        isLoading={isLoading}
        setLoading={setIsLoading}
        isCreationGoalDate={location.state.type === '1' || location.state.type === '2' ? true : false}
        isEvaluationDate={location.state.type !== '1' && location.state.type !== '2' ? true : false}
        isReview={true}
        flagSkill={1}
        setStatusEvaluation={setStatusEvaluation}
        statusEvaluation={statusEvaluation}
        setUpdateTime={setUpdateTime}
        updateTime={updateTime}
        getEvaluationDetail={getEvaluationDetail}
        setDataSource={setDataSource}
        typeReview={Number(location.state.type)}
        newestRecord={{ evaluationOrder: location.state.evaluatorOrderExcep }}
      />
    );
  } else if (isFlagSkill === 0)
    return (
      <Evaluation17NoSkill
        dataSources={dataSource}
        isLoading={isLoading}
        setLoading={setIsLoading}
        isCreationGoalDate={location.state.type === '1' || location.state.type === '2' ? true : false}
        isEvaluationDate={location.state.type !== '1' && location.state.type !== '2' ? true : false}
        isReview={true}
        flagSkill={1}
        setStatusEvaluation={setStatusEvaluation}
        statusEvaluation={statusEvaluation}
        setUpdateTime={setUpdateTime}
        updateTime={updateTime}
        getEvaluationDetail={getEvaluationDetail}
        setDataSource={setDataSource}
        typeReview={Number(location.state.type)}
        newestRecord={{ evaluationOrder: location.state.evaluatorOrderExcep }}
      />
    );

  return (
    <div style={{ paddingBottom: 20, height: '100%' }}>
      <LoadingScreenComponent />
    </div>
  );
};

export default ReviewEvaluationDetail;
