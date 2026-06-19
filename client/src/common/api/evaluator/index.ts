import { DepartmentResType } from '../../../types/api/adminEvaluationPro';
import { SendApprovedStatusType, SendRejectStatusType } from '../../../types/api/evaluatorType';
import { professionalExpertise } from '../../../types/api/proSkillSetting';
import HttpAxios from '../../http/';

const listUserEvaluation = async (
  url: string,
  callback: (data: any) => void,
  errorCallback: (bool: boolean) => void,
  params: any,
) => {
  errorCallback(true);

  return await HttpAxios.Get(url, {
    params: params,
  })
    .then((res) => {
      if (res && res.status === 200) {
        callback && callback(res.data);
        errorCallback(false);
      } else errorCallback && errorCallback(false);
    })
    .catch(() => {
      errorCallback && errorCallback(false);
    });
};

const sendApprovedStatus = async ({
  evaluationId,
  comment,
  type,
  updateTime,
  isF5,
  callback,
  errorCallback,
}: SendApprovedStatusType) => {
  const url = isF5
    ? `/api/v1/f6/management-evaluation/approved/status/${evaluationId}`
    : `/api/v1/f2/evaluator/approved/status/${evaluationId}`;

  return await HttpAxios.Put(url, {
    comment,
    type,
    updateTime,
  }).then((res) => {
    if (res && res.status === 200) callback && callback(res.data);
    else errorCallback && errorCallback();
  });
};

const sendRejectStatus = async ({
  evaluationId,
  comment,
  type,
  statusReject,
  updateTime,
  isF5,
  callback,
  errorCallback,
}: SendRejectStatusType) => {
  const url = isF5
    ? `/api/v1/f5/management-evaluation-history/rejected/status/${evaluationId}`
    : `/api/v1/f2/evaluator/rejected/status/${evaluationId}`;

  return await HttpAxios.Put(url, {
    comment,
    type,
    statusReject,
    updateTime,
  }).then((res) => {
    if (res && res.status === 200) callback && callback(res.data);
    else errorCallback && errorCallback();
  });
};
const exportCSV = async (
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
      callback && callback(res);
      errorCallback(false);
    } else errorCallback && errorCallback(false);
  });
};
const evaluationFixed = async (url: string, query: any, callback: any, errorCallback: any) => {
  return await HttpAxios.Get(url, {
    params: query,
  }).then((res) => {
    if (res && res.status === 200) {
      callback && callback(res);
      errorCallback(false);
    } else errorCallback && errorCallback(false);
  });
};

const getDepartments = async (
  params: any,
  callback: (
    data: {
      name: string;
      id: number;
      type: number;
      value: string;
    }[],
  ) => void,
  errorCallback: (bool: boolean) => void,
) => {
  errorCallback(true);

  return await HttpAxios.Get('/api/v1/f2/evaluator/get-list-department-export-evaluation-history', {
    params: params,
  }).then((res) => {
    if (res && res.status === 200) {
      const arrays = res?.data.map((v: any) => {
        v.name = `${v.name}`;
        v.value = `${v.id}`;

        return v;
      });

      callback(arrays);
    }
    errorCallback && errorCallback(false);
  });
};

const getDepartmentsProSkillExpertise = async (
  param: any,
  callback: (
    data: {
      name: string;
      id: number;
    }[],
  ) => void,
  errorCallback: (bool: boolean) => void,
) => {
  return await HttpAxios.Get('/api/v1/f2/evaluator/get-list-department-pro-skill-expertise', {
    params: param,
  }).then((res) => {
    if (res && res.status === 200) {
      const arrays = res?.data.map((v: any) => {
        v.name = `${v.name}`;
        v.value = `${v.name}:${v.id}`;

        return v;
      });

      callback(arrays);
    }
    errorCallback && errorCallback(false);
  });
};

const searchListUserProSkillExpertise = async (
  conditions: any,
  callBack: (dataSource: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Get(`/api/v1/f2/evaluator/get-list-user-pro-skill-expertise`, {
    params: conditions,
  })
    .then((res) => {
      if (res && res.status === 200) {
        callBack && callBack(res?.data);
      } else {
        setLoading(false);
      }
    })
    .catch(() => {
      setLoading(false);
    });
};
const detailProfessionalExpertise = async (
  userId: number,
  yearStart: string,
  yearEnd: string,
  callBack: (data: professionalExpertise[]) => void,
  errorCallback: (isLoading: boolean) => void,
) => {
  errorCallback(true);

  return await HttpAxios.Get(
    `/api/v1/f2/evaluator/development-professional-expertise/detail/${userId}/${yearStart}/${yearEnd}`,
    {},
  ).then((res) => {
    callBack(res?.data.results);
    errorCallback(false);
  });
};
const evaluatorApiService = {
  listUserEvaluation,
  sendApprovedStatus,
  sendRejectStatus,
  exportCSV,
  evaluationFixed,
  getDepartments,
  getDepartmentsProSkillExpertise,
  searchListUserProSkillExpertise,
  detailProfessionalExpertise,
};
export default evaluatorApiService;
