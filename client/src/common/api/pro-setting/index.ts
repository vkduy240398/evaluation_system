import HttpAxios from '../../http/';
const detailProSkill = async (
  url: string,
  versionId: string | undefined,
  isReadOnly: boolean | undefined,
  callBack: (data: any) => void,
  errorCallback: (bool: boolean) => void,
) => {
  errorCallback(true);

  return await HttpAxios.Get(`${url}/${versionId}`, {
    params: {
      isReadOnly: isReadOnly || 'false',
    },
  })
    .then((res) => {
      if (res && res?.status === 200) {
        callBack(res?.data);
        errorCallback(false);
      } else {
        errorCallback(false);
      }
    })
    .catch(() => {});
};

const checkPermission = async (
  url: string,
  versionId: string | undefined,
  callBack: (data: any) => void,
  errorCallback: () => void,
) => {
  return await HttpAxios.Get(`${url}/${versionId}`, {})
    .then(async (res) => {
      if (res && res?.status === 200) {
        await callBack(res?.data);
      } else {
        errorCallback();
      }
    })
    .catch(() => {});
};

const saveDraft = async (
  versionId: string | undefined,
  data: any,
  callBack: (versionId: any) => void,
  errorCallback: (bool: boolean) => void,
) => {
  errorCallback(true);

  return await HttpAxios.Put(`/api/v1/f3/pro-setting/save-draft/${versionId}`, {
    data: data,
  }).then((res) => {
    if (res && res?.data && res?.status === 200) {
      callBack(res?.data);
      errorCallback(false);
    } else {
      errorCallback(false);
    }
  });
};

const submitVersion = async (
  versionId: string | undefined,
  data: any,
  callBack: (versionId: any) => void,
  errorCallback: (bool: boolean) => void,
) => {
  errorCallback(true);

  return await HttpAxios.Put(`/api/v1/f3/pro-setting/submit-version/${versionId}`, {
    data: data,
  }).then((res) => {
    if (res && res?.data && res?.status === 200) {
      callBack(res?.data);
      errorCallback(false);
    } else {
      errorCallback(false);
    }
  });
};

const cancelVersionFunc = async (
  versionId: number,
  data: any,
  callBack: (data: any) => void,
  errorCallback: (bool: boolean) => void,
) => {
  errorCallback(true);

  return await HttpAxios.Put(`/api/v1/f3/pro-setting/cancel-version/${versionId}`, {
    ...data,
  })
    .then((res) => {
      if (res?.status) callBack(res?.data);
      errorCallback(false);
    })
    .catch(() => {
      errorCallback(false);
    });
};
const createVersionInit = async (
  url: string,
  data: any,
  isDraft: boolean,
  callBack: (data: any) => void,
  errorCallBack: (bool: boolean) => void,
) => {
  errorCallBack(true);

  return await HttpAxios.Post(url, { ...data, isDraft })
    .then((res) => {
      if (res && res?.data && res?.status) {
        callBack(res?.data);
        errorCallBack(false);
      } else {
        errorCallBack(false);
      }
    })
    .catch(() => {
      errorCallBack(false);
    });
};

const listPointByVersion = async (
  skillId: number | undefined,
  callBack: (data: any) => void,
  errorCallBack: (bool: boolean) => void,
) => {
  errorCallBack(true);

  return await HttpAxios.Get(`/api/v1/f3/pro-setting/list-point-of-version/${skillId}`)
    .then((res) => {
      if (res && res?.data && res?.status === 200) {
        callBack(res?.data);
        errorCallBack(false);
      } else {
        errorCallBack(false);
      }
    })
    .catch(() => {
      errorCallBack(false);
    });
};

const listVersionPublic = async (callBack: (data: any) => void, errorCallBack: (bool: boolean) => void) => {
  errorCallBack(true);

  return await HttpAxios.Get(`/api/v1/f3/pro-setting/get-version-public`)
    .then((res) => {
      if (res && res?.data && res?.status) {
        callBack(res?.data);
        errorCallBack(false);
      } else {
        errorCallBack(false);
      }
    })
    .catch(() => {
      errorCallBack(false);
    });
};
const listItemTemplateSkills = async (
  versionId: number,
  callBack: (data: any) => void,
  errorCallBack: (bool: boolean) => void,
) => {
  errorCallBack(true);

  return await HttpAxios.Get(`/api/v1/f3/pro-setting/get-item-template-skill/${versionId}`, {})
    .then((res) => {
      if (res && res.data && res.status) {
        callBack(res.data);
        errorCallBack(false);
      }
    })
    .catch(() => {
      errorCallBack(false);
    });
};
const proSetting = {
  detailProSkill,
  saveDraft,
  submitVersion,
  cancelVersionFunc,
  createVersionInit,
  listPointByVersion,
  listVersionPublic,
  checkPermission,
  listItemTemplateSkills,
};
export default proSetting;
