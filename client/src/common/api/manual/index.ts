import HttpAxios from '../../http';
import { HttpStatusCode } from 'axios';

const getManualFile = async (condition: any, callBack: (dataSource: any) => void) => {
  return await HttpAxios.Get(`/api/v1/manual`, {
    params: condition,
    responseType: 'blob',
  })
    .then((res) => {
      if (res && res.status === HttpStatusCode.Ok) {
        callBack && callBack(res?.data);
      }
    })
    .catch(() => {})
    .finally(() => {});
};

const manualApiService = {
  getManualFile,
};
export default manualApiService;
