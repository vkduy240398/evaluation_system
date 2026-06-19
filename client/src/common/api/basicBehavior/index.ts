import HttpAxios from '../../http/';
import { DetailBasicBehavior } from '../../../page/admin/criterion-management/interfaces/InterfacesProps';

const listBasicBehavior = async (
  url: string,
  callback: (data: any) => void,
  errorCallback: (bool: boolean) => void,
  params: any,
) => {
  errorCallback(true);

  return await HttpAxios.Get(url, {
    params: params,
  }).then((res) => {
    if (res && res.status === 200) {
      callback && callback(res?.data);
      errorCallback(false);

      return true;
    } else errorCallback && errorCallback(false);
  });
};

const detailCriteria = async (
  url: string,
  isEdit: { [x: string]: any },
  callback: (data: any) => void,
  errorCallback: (bool: boolean) => void,
) => {
  errorCallback(true);

  return await HttpAxios.Get(url, {
    params: isEdit,
  }).then((res) => {
    if (res && res.status === 200) {
      callback && callback(res?.data);
      errorCallback(false);
    } else errorCallback && errorCallback(false);
  });
};

const publicVersion = async (
  url: string,
  params: any,
  callBackPublic: (data: any) => void,
  errorCallback: (bool: boolean) => void,
) => {
  errorCallback(true);

  return await HttpAxios.Put(url, { ...params }).then((res) => {
    if (res && res.status === 200) {
      errorCallback(false);
      callBackPublic(res?.data);
    } else errorCallback && errorCallback(false);
  });
};

interface Periods {
  dateCreationGoalStart: Date;
  dateCreationGoalEnd: Date;
}
const listPeriods = async (
  url: string,
  callBackPeriods: (data: Periods[]) => void,
  errorCallback: (bool: boolean) => void,
) => {
  errorCallback(true);

  return await HttpAxios.Get(url).then((res) => {
    if (res && res.status === 200) {
      errorCallback(false);
      callBackPeriods(res?.data);
    } else errorCallback && errorCallback(false);
  });
};
const saveDraft = async (
  url: string,
  body: DetailBasicBehavior,
  callBack: (data: any) => void,
  errorCallback: (bool: boolean) => void,
) => {
  errorCallback(true);

  return await HttpAxios.Put(url, {
    version: body.version,
    subVersion: body.subVersion,
    id: body.versionId,
    creationUser: body.creationUser,
    updated: body.timer,
    status: body.status,
    reason: body.reason,
    childrens: body.children,
    type: body.type,
  })
    .then((res) => {
      if (res && res?.status === 200) {
        callBack(res?.data);
        errorCallback(false);
      }
      errorCallback(false);
    })
    .catch();
};

interface FieldVersion {
  version: number;
  subVersion: number;
}
const getVersion = async (
  url: string,
  callBack: (data: FieldVersion) => void,
  errorCallback: (bool: boolean) => void,
) => {
  errorCallback(true);

  return await HttpAxios.Get(url)
    .then((response) => {
      if (response && response.status === 200) {
        callBack(response?.data);
        errorCallback(false);
      }
      {
        errorCallback(false);
      }
    })
    .catch(() => {
      errorCallback(false);
    });
};

const cancelVersion = async (
  url: string,
  data: any,
  callBack: (bool: boolean) => void,
  callBackErrorCancel: (bool: boolean) => void,
) => {
  callBackErrorCancel(true);

  return await HttpAxios.Put(url, {
    ...data,
  })
    .then((response) => {
      if (response && response.status === 200) {
        callBack(true);
      } else {
        callBackErrorCancel(false);
      }
    })
    .catch(() => {});
};

const savePrivateVersion = async (
  url: string,
  data: DetailBasicBehavior,
  hostname: string,
  callBack: (data: any) => void,
  callBackErrorCancel: (bool: boolean) => void,
) => {
  callBackErrorCancel(true);

  return await HttpAxios.Put(url, { ...data, hostname })
    .then((response) => {
      if (response && response.status === 200) {
        callBack(response?.data);
      } else {
        callBackErrorCancel(false);
      }
    })
    .catch((errors) => {
      callBack(errors);
    });
};

const detailBasicBehavior = async (
  url: string,
  versionId: string | undefined,
  callBack: (data: any) => void,
  errorCallback: (bool: boolean) => void,
) => {
  errorCallback(true);

  return await HttpAxios.Get(`${url}/${versionId}`)
    .then((res: any) => {
      callBack(res?.data);
      errorCallback(false);
    })
    .catch(() => {});
};

const basicBehaviorApiService = {
  listBasicBehavior,
  detailCriteria,
  publicVersion,
  listPeriods,
  saveDraft,
  getVersion,
  cancelVersion,
  savePrivateVersion,
  detailBasicBehavior,
};
export default basicBehaviorApiService;
