import httpAxios from '../../http';

const donwloadPDF = async (
  url: string,
  callBack: (data: { buffer: string; fileName: string }) => void,
  errorCallBack: (data: any) => void,
  setLoading: (data: boolean) => void,
) => {
  setLoading(true);

  return await httpAxios.Get(url).then((res: any) => {
    if (res && res.status === 200) {
      const data = res.data as { buffer: string; fileName: string };
      callBack && callBack(data);
    } else errorCallBack;
  });
};
const donwloadPDFOnList = async (
  evaluationId: number,
  role: string,
  userId: number,
  level: number,
  orientation: string,
  size: string,
  callback: (data: { buffer: string; fileName: string }) => void,
) => {
  return await httpAxios
    .Post('/api/v1/common/report/list/pdf/evaluation', { evaluationId, role, userId, level, orientation, size })
    .then((res) => {
      if (res) {
        const data = res.data as { buffer: string; fileName: string };
        callback && callback(data);
      }
    });
};
const donwloadListPDF = async (
  childrenArr: any,
  role: string,
  orientation: string,
  size: string,
  callback: (data: { buffer: string; fileName: string }) => void,
) => {
  return await httpAxios
    .Post('/api/v1/common/report/pdf/list', { childrenArr, role, orientation, size })
    .then((res) => {
      if (res) {
        const data = res.data as { buffer: string; fileName: string };
        callback && callback(data);
      }
    });
};
const evaluationDetailApiService = {
  donwloadPDF,
  donwloadPDFOnList,
  donwloadListPDF,
};
export default evaluationDetailApiService;
