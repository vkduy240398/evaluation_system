import httpAxios from '../../http';

const getReferenceReview = async (
  conditions: any,
  callBack: (dataSource: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await httpAxios
    .Get(`/api/v1/common/list-reference-review`, {
      params: conditions,
    })
    .then((res) => {
      if (res && res.status === 200) {
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

const referenceReviewService = {
  getReferenceReview,
};

export default referenceReviewService;
