import HttpAxios from '../../http';

const getListApprovalHistoryF1 = async (
  url: string,
  callback: (dataSource: any) => void,
  callbackError: () => void,
) => {
  return await HttpAxios.Get(url).then((res) => {
    if (res && res.status === 200) {
      if (res.data.statusCode && res.data.statusCode === 1403) {
        callbackError();
      } else {
        callback(res.data);
      }
    }
  });
};

const getListApprovalHistoryF2 = async (
  url: string,
  params: any,
  callback: (dataSource: any) => void,
  callbackError?: () => void,
) => {
  return await HttpAxios.Get(url, { params: params }).then((res) => {
    if (res && res.status === 200) {
      callback(res.data);
    } else {
      callbackError && callbackError();
    }
  });
};

const getListApprovalHistoryF6 = async (
  url: string,
  params: any,
  callback: (dataSource: any) => void,
  callbackError?: () => void,
) => {
  return await HttpAxios.Get(url, { params: params }).then((res) => {
    if (res && res.status === 200) {
      callback(res.data);
    } else {
      callbackError && callbackError();
    }
  });
};

const getNotificationPeriod = async (callback: (dataSource: any) => void) => {
  return await HttpAxios.Get('/api/v1/common/get-notification-period').then((res) => {
    if (res && res.status === 200) {
      callback(res?.data);
    }
  });
};

const commonApiService = {
  getListApprovalHistoryF1,
  getListApprovalHistoryF2,
  getListApprovalHistoryF6,
  getNotificationPeriod,
};
export default commonApiService;
