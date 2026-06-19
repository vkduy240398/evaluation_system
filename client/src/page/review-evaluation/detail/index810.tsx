import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import reviewEvaluationApi from '../../../common/api/reviewEvaluation';
import LoadingScreenComponent from '../../../views/loading/LoadingScreenComponent';
import Evaluation810HaveSkill from '../../user/evaluation-8-10/Evaluation810HaveSkill';
import Evaluation810NoSkill from '../../user/evaluation-8-10/Evaluation810NoSkill';
import { urlCompanyCode } from '../../../common/util';

const ReviewEvaluationDetail810: React.FC = () => {
  const Location = useLocation();
  const navigate = useNavigate();

  const state = Location.state;

  const [flagSkill, setFlagSkill] = useState<number | undefined>(undefined);
  // sử dụng param sau này đổi sang location

  const backToListScreen = () => {
    navigate(urlCompanyCode() + '/reference-review');
  };

  useEffect(() => {
    const fetchData = async () => {
      return await reviewEvaluationApi
        .evaluationHaveSkillCheck({
          evaluationId: state.id,
        })
        .then((res) => {
          setFlagSkill(res);
        });
    };
    if (!state) {
      backToListScreen();
    } else {
      fetchData();
    }
  }, [Location.state]);

  if (flagSkill === 1) {
    return (
      <Evaluation810HaveSkill
        {...{
          flagSkill: flagSkill,
          role: 'reviewer',
          evaluatorOrderExcep: state.evaluatorOrderExcep,
        }}
      />
    );
  } else if (flagSkill === 0) {
    return <Evaluation810NoSkill {...{ flagSkill: flagSkill, role: 'reviewer' }} />;
  }

  return (
    <div style={{ paddingBottom: 20, height: '100%' }}>
      <LoadingScreenComponent />
    </div>
  );
};

export default ReviewEvaluationDetail810;
