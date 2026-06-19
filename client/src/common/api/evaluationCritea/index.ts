import { conditionsEvaluationItemHistory, conditionsListCriteriaHistorty } from '../../../model/Conditions';
import { DetailCriteriaEvaluation } from '../../../page/admin/evaluation-criteria-description/detail/InterfacesProps';
import { departmentCommon, skillCommon } from '../../../types/api/commonType';
import HttpAxios from '../../http';

const searchListEvaluationCriteriaHistory = async (
  conditions: conditionsListCriteriaHistorty,
  callBack: (dataSource: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Get(`/api/v1/f6/management-evaluation/list-criteria-evaluation-history`, {
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

const getDepartment = async ({ callBack, errorCallBack }: departmentCommon) => {
  errorCallBack(true);

  return await HttpAxios.Get('/api/v1/common/get-all-department').then((res) => {
    if (res && res?.status) {
      const arrays = res?.data.map((v: any) => {
        v.name = `${v.name}`;
        v.value = `${v.id}:${v.name}: ${v.type}`;

        return v;
      });
      arrays.unshift({
        // Add default value
        type: -1,
        code: '',
        name: 'すべて',
        value: 'すべて',
      });
      callBack(arrays);
      errorCallBack(false);
    } else {
      errorCallBack(false);
    }
  });
};

const searchListEvaluationItemHistory = async (
  conditions: conditionsEvaluationItemHistory,
  callBack: (dataSource: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Get(`/api/v1/f6/management-evaluation/list-evaluation-item-history`, {
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

const detailCriteriaEvaluation = async (
  url: string,
  callback: (data: any) => void,
  errorCallback: (bool: boolean) => void,
) => {
  errorCallback(true);

  return await HttpAxios.Get(url, {}).then((res) => {
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

const saveDraft = async (
  url: string,
  body: DetailCriteriaEvaluation,
  callBack: (data: Periods[]) => void,
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
    type: body.type,
    contentEvaluationCriteria: body.contentEvaluationCriteria,
    contentNotes: body.contentNotes,
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
  data: DetailCriteriaEvaluation,
  callBack: (data: any) => void,
  callBackErrorCancel: (bool: boolean) => void,
) => {
  callBackErrorCancel(true);

  return await HttpAxios.Put(url, { ...data })
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

const savePublicVersion = async (
  url: string,
  data: DetailCriteriaEvaluation,
  callBack: (data: any) => void,
  callBackErrorCancel: (bool: boolean) => void,
) => {
  callBackErrorCancel(true);

  return await HttpAxios.Put(url, { ...data })
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

const getSkill = async ({ callBack, errorCallBack }: skillCommon) => {
  errorCallBack(true);

  return await HttpAxios.Get('/api/v1/common/get-all-skill').then((res) => {
    if (res && res?.status) {
      const arrays = res?.data.map((v: any) => {
        v.name = `${v.name}`;
        v.value = `${v.id}:${v.name}`;

        return v;
      });
      arrays.unshift({
        // Add default value
        type: -1,
        code: '',
        name: 'すべて',
        value: 'すべて',
      });
      callBack(arrays);
      errorCallBack(false);
    } else {
      errorCallBack(false);
    }
  });
};

const evaluationCriteriApiService = {
  searchListEvaluationCriteriaHistory,
  getDepartment,
  searchListEvaluationItemHistory,
  detailCriteriaEvaluation,
  publicVersion,
  saveDraft,
  cancelVersion,
  savePrivateVersion,
  savePublicVersion,
  getSkill,
};
export default evaluationCriteriApiService;
