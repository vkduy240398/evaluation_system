import { EvaluationSkillCheckProps } from '../../../types/api/userEvaluationType';
import { UserEvaluationType } from '../../../types/pages/user-evaluation/UserEvaluationType';
import httpAxios from '../../http';
import { decrypt } from '../../util';
const getDetailEvaluation = async (
  params: { idEvaluation: number; type: number },
  callBack: (dataSource: UserEvaluationType) => void,
) => {
  await httpAxios
    .Get(`/api/v1/common/review-evaluation/detail/${params.idEvaluation}`, { params: params })
    .then((res) => {
      if (res && res.status === 200)
        if (res.data) {
          const decode = decrypt(res.data);

          if (decode) {
            const data = JSON.parse(decode);
            callBack(data);
          }
        }
    })
    .then((error) => {});
};
const evaluationHaveSkillCheck = (props: { evaluationId: number }) => {
  const { evaluationId } = props;
  const url = `/api/v1/common/evaluation-skill/${evaluationId}`;

  return httpAxios.Get(url).then((res) => {
    if (res && res.status) return res.data.flagSkill;

    return null;
  });
};

const reviewEvaluationApi = {
  getDetailEvaluation,
  evaluationHaveSkillCheck,
};
export default reviewEvaluationApi;
