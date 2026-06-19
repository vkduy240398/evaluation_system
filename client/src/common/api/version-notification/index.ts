import { HttpStatusCode } from 'axios';
import HttpAxios from '../../http';
import { ConditionListVersionNotification } from '../../../model/version-notification/ListVersionNotificationModel';
import { UpdateNotificationModel } from '../../../model/version-notification/UpdateNotificationModel';
import { PublicNotificationModel } from '../../../model/version-notification/PublicNotificationModel';

const getListVersionNotification = async (
  condition: ConditionListVersionNotification,
  callBack: (dataSource: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Get(`/api/v1/f6/management-evaluation/list-version-notification`, {
    params: condition,
  })
    .then((res) => {
      if (res && res.status === HttpStatusCode.Ok) {
        callBack && callBack(res?.data);
      }
    })
    .catch()
    .finally(() => {
      setLoading(false);
    });
};

const getDetailNotification = async (
  versionId: number,
  callBack: (dataSource: any) => void,
  callBackNotfound: () => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Get(`/api/v1/f6/management-evaluation/detail-notification/${versionId}`, {})
    .then((res) => {
      if (res && res.status === HttpStatusCode.Ok) {
        callBack && callBack(res?.data);
      } else {
        callBackNotfound && callBackNotfound();
      }
    })
    .catch()
    .finally(() => {
      setLoading(false);
    });
};

const saveDraftVersionNotification = async (
  payload: UpdateNotificationModel,
  type: string,
  callBack: (data: any) => void,
  callBackError: (data: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Put(`/api/v1/f6/management-evaluation/detail-notification/save-draft?type=${type}`, payload)
    .then((res) => {
      if (res && res?.status === 200) {
        if (res.data.statusCode === 1409) {
          callBackError(res.data);
        } else {
          callBack(res.data);
        }
      }
    })
    .catch()
    .finally(() => {
      setLoading(false);
    });
};

const savePublicVersionNotification = async (
  payload: UpdateNotificationModel,
  callBack: (data: any) => void,
  callBackError: (data: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Put(`/api/v1/f6/management-evaluation/detail-notification/save-public`, payload)
    .then((res) => {
      if (res!.status === HttpStatusCode.Ok) {
        const STATUS_CODE_CONFLICT = 1409;
        if (res!.data.statusCode === STATUS_CODE_CONFLICT) {
          callBackError(res!.data);
        } else {
          callBack(res!.data);
        }
      } else {
        callBackError(null);
      }
    })
    .catch(() => {})
    .finally(() => {
      setLoading(false);
    });
};

const cancelVersionNotification = async (
  version: number,
  payload: any,
  callBack: (data: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Patch(`/api/v1/f6/management-evaluation/detail-notification/${version}/cancel`, payload)
    .then((res) => {
      if (res && res?.status === HttpStatusCode.Ok) {
        if (res.data) {
          callBack(res);
        }
      }
    })
    .catch()
    .finally(() => {
      setLoading(false);
    });
};

const getMaxSubVerion = async (version: number, setLoading: (bool: boolean) => void) => {
  setLoading(true);

  return await HttpAxios.Get(`/api/v1/f6/management-evaluation/detail-notification/${version}/get-max-sub-version`)
    .then((res) => {
      if (res && res.status === HttpStatusCode.Ok) {
        return res?.data;
      }
    })
    .catch(() => {})
    .finally(() => {
      setLoading(false);
    });
};

const publicVersionNotification = async (
  payload: PublicNotificationModel,
  callBack: (data: any) => void,
  callBackConflict: () => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Patch(`/api/v1/f6/management-evaluation/detail-notification/public`, payload)
    .then((res) => {
      if (res && res.status === HttpStatusCode.Ok) {
        callBack(res?.data);
      } else if (res && res.status === HttpStatusCode.Conflict) {
        callBackConflict && callBackConflict();
      }
    })
    .catch()
    .finally(() => {
      setLoading(false);
    });
};

const getPublicNotification = async (
  callBack: (dataSource: any) => void,
  callBackNotfound: () => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Get(`/api/v1/common/get-public-notification`, {})
    .then((res) => {
      if (res && res.status === HttpStatusCode.Ok) {
        callBack && callBack(res?.data);
      } else if (res && res.status === HttpStatusCode.NotFound) {
        callBackNotfound && callBackNotfound();
      }
    })
    .catch()
    .finally(() => {
      setLoading(false);
    });
};

const notificationApiService = {
  getListVersionNotification,
  getDetailNotification,
  saveDraftVersionNotification,
  savePublicVersionNotification,
  cancelVersionNotification,
  publicVersionNotification,
  getMaxSubVerion,
  getPublicNotification,
};
export default notificationApiService;
