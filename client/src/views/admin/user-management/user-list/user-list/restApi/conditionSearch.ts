import httpAxios from '../../../../../../common/http';

export async function getConditionSearch(callBack: (data: any) => void, errorCallBack: (bool: boolean) => void) {
  errorCallBack(true);

  return await httpAxios.Get('/api/v1/common/condition-user-list').then((res) => {
    if (res && res.status === 200) {
      callBack(res.data);
      errorCallBack(false);
    } else {
      errorCallBack(false);
    }
  });
}

export async function getHistoryUpdateUser(
  userId: string,
  callBack: (data: any) => void,
  errorCallBack: (bool: boolean) => void,
) {
  errorCallBack(true);

  return await httpAxios.Get(`/api/v1/f8/management-user/get-history-update-user/${userId}`).then((res) => {
    if (res && res.status === 200) {
      callBack(res.data);
      errorCallBack(false);
    } else {
      errorCallBack(false);
    }
  });
}
