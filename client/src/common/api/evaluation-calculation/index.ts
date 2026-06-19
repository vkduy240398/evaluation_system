import { ConditionListEvaluationCalculationHistory } from '../../../model/evaluation-calculation/ListEvaluationCalculationHistoryModel';
import { PublicEvaluationCalculationDto } from '../../../model/evaluation-calculation/PublicEvaluationCalculationModel';
import { UpdateEvaluationCalculationDto } from '../../../model/evaluation-calculation/UpdateEvaluationCalculationModel';
import HttpAxios from '../../http';
import { HttpStatusCode } from 'axios';
import { VersionSettingType } from '../../../constant/VersionSettingType';

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
    .catch(() => {});
};

const getDetailEvaluationCalculation = async (
  versionId: number,
  callBack: (dataSource: any) => void,
  callBackNotfound: () => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Get(`/api/v1/f6/management-evaluation/detail-evaluation-calculation/${versionId}`, {})
    .then((res) => {
      if (res && res.status === HttpStatusCode.Ok) {
        callBack && callBack(res?.data);
      } else {
        callBackNotfound && callBackNotfound();
      }
    })
    .catch(() => {})
    .finally(() => {
      setLoading(false);
    });
};

const getDetailEvaluationCalculationNs = async (
  versionId: number,
  callBack: (dataSource: any) => void,
  callBackNotfound: () => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Get(`/api/v1/f6/management-evaluation/detail-evaluation-calculation-ns/${versionId}`, {})
    .then((res) => {
      if (res && res.status === HttpStatusCode.Ok) {
        callBack && callBack(res?.data);
      } else {
        callBackNotfound && callBackNotfound();
      }
    })
    .catch(() => {})
    .finally(() => {
      setLoading(false);
    });
};

const getDetailEvaluationCalculationCommon = async (
  versionId: number,
  callBack: (dataSource: any) => void,
  callBackNotfound: () => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Get(`/api/v1/f6/management-evaluation/detail-evaluation-calculation-common/${versionId}`, {})
    .then((res) => {
      if (res && res.status === HttpStatusCode.Ok) {
        callBack && callBack(res?.data);
      } else {
        callBackNotfound && callBackNotfound();
      }
    })
    .catch(() => {})
    .finally(() => {
      setLoading(false);
    });
};

const getNextVersion = async (
  version: any,
  callBack: (dataSource: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Get(
    `/api/v1/f6/management-evaluation/detail-evaluation-calculation-8-10/get-next-version/${version.split('.')[0]}`,
  )
    .then((res) => {
      if (res && res.status === 200) {
        callBack && callBack(res?.data);
        setLoading(false);
      }
    })
    .catch(() => {});
};

const getNextVersionNS = async (
  version: any,
  callBack: (dataSource: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Get(
    `/api/v1/f6/management-evaluation/detail-evaluation-calculation-8-10ns/get-next-version/${version.split('.')[0]}`,
  )
    .then((res) => {
      if (res && res.status === 200) {
        callBack && callBack(res?.data);
        setLoading(false);
      }
    })
    .catch(() => {});
};

const saveDraftSetting810 = async (params: any, callBack: (data: any) => void) => {
  return await HttpAxios.Post(`/api/v1/f6/management-evaluation/detail-evaluation-calculation-8-10/save-draft`, params)
    .then((res) => {
      if (res && res?.data && res?.status) {
        callBack(res?.data);
      }
    })
    .catch(() => {});
};

const saveDraftSetting810NS = async (params: any, callBack: (data: any) => void) => {
  return await HttpAxios.Post(
    `/api/v1/f6/management-evaluation/detail-evaluation-calculation-8-10ns/save-draft`,
    params,
  )
    .then((res) => {
      if (res && res?.data && res?.status) {
        callBack(res?.data);
      }
    })
    .catch(() => {});
};

const cancelSetting = async (
  versionId: number,
  params: any,
  callBack: (data: any) => void,
  errorCallBack: (bool: boolean) => void,
) => {
  errorCallBack(true);

  return await HttpAxios.Put(
    `/api/v1/f6/management-evaluation/detail-evaluation-calculation-8-10/cancel/${versionId}`,
    params,
  )
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
const savePublicOrPrivate = async (
  params: any,
  callBack: (data: any) => void,
  errorCallBack: (bool: boolean) => void,
) => {
  errorCallBack(true);
  const url =
    params.type === VersionSettingType.LEVEL_8_10
      ? '/api/v1/f6/management-evaluation/detail-evaluation-calculation-8-10/save-public-or-private'
      : '/api/v1/f6/management-evaluation/detail-evaluation-calculation-8-10ns/save-public-or-private';

  return await HttpAxios.Post(url, params)
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

const publicVersionSetting = async (
  payload: PublicEvaluationCalculationDto,
  callBack: (data: any) => void,
  callBackConflict: () => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Patch(`/api/v1/f6/management-evaluation/public-version-setting`, payload)
    .then((res) => {
      if (res && res.status === HttpStatusCode.Ok) {
        callBack(res?.data);
      } else if (res && res.status === HttpStatusCode.Conflict) {
        callBackConflict && callBackConflict();
      }
      setLoading(false);
    })
    .catch(() => {});
};

const publicVersionSettingCommon = async (
  payload: PublicEvaluationCalculationDto,
  callBack: (data: any) => void,
  callBackConflict: () => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Patch(`/api/v1/f6/management-evaluation/public-version-setting-common`, payload)
    .then((res) => {
      if (res && res.status === HttpStatusCode.Ok) {
        callBack(res?.data);
      } else if (res && res.status === HttpStatusCode.Conflict) {
        callBackConflict && callBackConflict();
      }
      setLoading(false);
    })
    .catch(() => {});
};

const saveDraftVersionSetting17 = async (
  payload: UpdateEvaluationCalculationDto,
  type: string,
  callBack: (data: any) => void,
  callBackError: (data: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Put(
    `/api/v1/f6/management-evaluation/detail-evaluation-calculation/save-draft17?type=${type}`,
    payload,
  )
    .then((res) => {
      if (res && res?.status === 200) {
        if (res.data.statusCode === 1409) {
          callBackError(res.data);
        } else {
          callBack(res.data);
        }
      }
      setLoading(false);
    })
    .catch(() => {});
};

const saveDraftVersionSetting17ns = async (
  payload: UpdateEvaluationCalculationDto,
  type: string,
  callBack: (data: any) => void,
  callBackError: (data: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Put(
    `/api/v1/f6/management-evaluation/detail-evaluation-calculation/save-draft17ns?type=${type}`,
    payload,
  )
    .then((res) => {
      if (res && res?.status === 200) {
        if (res.data.statusCode === 1409) {
          callBackError(res.data);
        } else {
          callBack(res.data);
        }
      }
      setLoading(false);
    })
    .catch(() => {});
};

const saveDraftVersionSettingCommon = async (
  payload: UpdateEvaluationCalculationDto,
  type: string,
  callBack: (data: any) => void,
  callBackError: (data: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Put(
    `/api/v1/f6/management-evaluation/detail-evaluation-calculation/save-draft-common?type=${type}`,
    payload,
  )
    .then((res) => {
      if (res && res?.status === 200) {
        if (res.data.statusCode === 1409) {
          callBackError(res.data);
        } else {
          callBack(res.data);
        }
      }
      setLoading(false);
    })
    .catch(() => {});
};

const savePublicVersionSetting17 = async (
  payload: UpdateEvaluationCalculationDto,
  callBack: (data: any) => void,
  callBackError: (data: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Put(`/api/v1/f6/management-evaluation/detail-evaluation-calculation/save-public17`, payload)
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

const savePublicVersionSetting17ns = async (
  payload: UpdateEvaluationCalculationDto,
  callBack: (data: any) => void,
  callBackError: (data: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Put(`/api/v1/f6/management-evaluation/detail-evaluation-calculation/save-public17ns`, payload)
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

const savePublicVersionSettingCommon = async (
  payload: UpdateEvaluationCalculationDto,
  callBack: (data: any) => void,
  callBackError: (data: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Put(
    `/api/v1/f6/management-evaluation/detail-evaluation-calculation/save-public-common`,
    payload,
  )
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

const getMaxSubVerion = async (version: number, type: number, setLoading: (bool: boolean) => void) => {
  setLoading(true);

  return await HttpAxios.Get(`/api/v1/f6/management-evaluation/get-max-sub-version/${version}?type=${type}`)
    .then((res) => {
      setLoading(false);
      if (res && res.status === HttpStatusCode.Ok) {
        return res?.data;
      }
    })
    .catch(() => {});
};

const cancelVersionSetting17 = async (
  version: number,
  payload: any,
  callBack: (data: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Patch(
    `/api/v1/f6/management-evaluation/detail-evaluation-calculation/${version}/cancel`,
    payload,
  )
    .then((res) => {
      if (res && res?.status === HttpStatusCode.Ok) {
        if (res.data) {
          callBack(res);
        }
      }
      setLoading(false);
    })
    .catch(() => {});
};

const cancelVersionSettingCommon = async (
  version: number,
  payload: any,
  callBack: (data: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Patch(
    `/api/v1/f6/management-evaluation/detail-evaluation-calculation/${version}/cancel`,
    payload,
  )
    .then((res) => {
      if (res && res?.status === HttpStatusCode.Ok) {
        if (res.data) {
          callBack(res);
        }
      }
      setLoading(false);
    })
    .catch(() => {});
};

const findDatePublic = async (callBack: (data: any) => void) => {
  return await HttpAxios.Get(`/api/v1/f6/management-evaluation/detail-evaluation-calculation-8-10/check-date-public`)
    .then((res) => {
      if (res && res?.status === 200) {
        if (res) {
          callBack(res);
        }
      }
    })
    .catch(() => {});
};

const evaluationCalculationApiService = {
  getListEvaluationCalculationHistory,
  getDetailEvaluationCalculation,
  getDetailEvaluationCalculationNs,
  getDetailEvaluationCalculationCommon,
  getNextVersion,
  getNextVersionNS,
  saveDraftSetting810,
  saveDraftSetting810NS,
  cancelSetting,
  savePublicOrPrivate,
  publicVersionSetting,
  publicVersionSettingCommon,
  saveDraftVersionSetting17,
  saveDraftVersionSetting17ns,
  saveDraftVersionSettingCommon,
  getMaxSubVerion,
  cancelVersionSetting17,
  cancelVersionSettingCommon,
  savePublicVersionSetting17,
  savePublicVersionSetting17ns,
  savePublicVersionSettingCommon,
  findDatePublic,
};

export default evaluationCalculationApiService;
