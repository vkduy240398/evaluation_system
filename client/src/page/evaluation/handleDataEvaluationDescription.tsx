/* eslint-disable prefer-const */
import httpAxios from '../../common/http';
import { EvaluationPeriodHelper } from '../../common/utils/datetime/EvaluationPeriodHelper';

export const loadDataEvaluationDescription = async (
  id: string | undefined,
  setFinancialYear: React.Dispatch<React.SetStateAction<string>>,
  setLevel: React.Dispatch<React.SetStateAction<string>>,
  setNotes: React.Dispatch<React.SetStateAction<string>>,
  setEvaluationCriterias: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  access: string,
  timeZone: string,
) => {
  if (access === 'menu') {
    /**Set financial year */
    setFinancialYear(
      `${EvaluationPeriodHelper.getCurrentPeriodYear(timeZone)}年${EvaluationPeriodHelper.getCurrentPeriodIndex(timeZone)}`,
    );

    /**Get and set data */
    await httpAxios.Get('/api/v1/common/get-evaluation-description', {}).then((res) => {
      if (res && res.status === 200) {
        if (res?.data) {
          /** Convert level */
          if (res?.data?.type === 1 || res?.data?.type === 3) {
            setLevel('1 ～ 7');
          } else if (res?.data?.type === 2 || res?.data?.type === 4) {
            setLevel('8 ～ 10');
          }
          setNotes(res?.data?.contentNotes);
          setEvaluationCriterias(res?.data?.contentEvaluationCriteria);
        }
      }
    });
    setLoading(false);
  } else if (access === 'button') {
    setLoading(false);
    await httpAxios
      .Get('/api/v1/common/get-evaluation-description-by-evaluation-id', {
        params: {
          id,
        },
      })
      .then((res) => {
        if (res && res.status === 200) {
          if (res?.data) {
            /**Set financial year */
            setFinancialYear(res?.data?.title);

            /** Convert level */
            if (res?.data?.level >= 1 && res?.data?.level <= 7) {
              setLevel('1 ～ 7');
            } else {
              setLevel('8 ～ 10');
            }

            /**Set data */
            setNotes(res?.data?.versionGuideEvaluation?.contentNotes);
            setEvaluationCriterias(res?.data?.versionGuideEvaluation?.contentEvaluationCriteria);
          }
        }
      });
    setLoading(false);
  }
};
