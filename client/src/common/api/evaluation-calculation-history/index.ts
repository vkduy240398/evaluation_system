import { HttpStatusCode } from 'axios';
import { ConditionListEvaluationCalculationHistory } from '../../../model/evaluation-calculation/ListEvaluationCalculationHistoryModel';
import HttpAxios from '../../http';

const getListEvaluationCalculationHistory = async (
  condition: ConditionListEvaluationCalculationHistory,
  callBack: (dataSource: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Get(`/api/v1/f6/management-evaluation/list-evaluation-calculation-history`, {
    params: condition,
  })
    .then((res) => {
      if (res && res.status === HttpStatusCode.Ok) {
        callBack && callBack(res?.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    })
    .catch(() => {
      setLoading(false);
    });
};

const evaluationCalculationHistoryApiService = {
  getListEvaluationCalculationHistory,
};

export default evaluationCalculationHistoryApiService;
