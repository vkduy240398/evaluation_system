import { TemplateMailId } from '../../../page/admin/send-email/TemplateMailId';
import { GoalConfirm } from '../../../types/api/adminEvaluation';
import httpAxios from '../../http';
import HttpAxios from '../../http';

const goalConfirm = async (params: any, { callback, errorCallback }: GoalConfirm) => {
  return await HttpAxios.Post('/api/v1/f5/management-evaluation-history/goal-confirm', params).then((res) => {
    if (res && res.status === 201) callback && callback(res.data);
    else errorCallback && errorCallback(res?.data);
  });
};
const evaluationConfirm = async (params: any, { callback, errorCallback }: GoalConfirm) => {
  return await HttpAxios.Post('/api/v1/f5/management-evaluation-history/evaluation-confirm', params).then((res) => {
    if (res && res.status === 201) callback && callback(res.data);
    else errorCallback && errorCallback(res?.data);
  });
};
const publicEvaluation = async (params: any, { callback, errorCallback }: GoalConfirm) => {
  return await HttpAxios.Post('/api/v1/f5/management-evaluation-history/public-evaluation', params).then((res) => {
    if (res && res.status === 201) callback && callback(res.data);
    else errorCallback && errorCallback(res?.data);
  });
};
const undoFixGoal = async (params: any, { callback, errorCallback }: GoalConfirm) => {
  return await HttpAxios.Post('/api/v1/f5/management-evaluation-history/undo-fix-evaluation', params).then((res) => {
    if (res && (res.status === 201 || res.status === 200)) callback && callback(res.data);
    else errorCallback && errorCallback(res?.data);
  });
};
const getAchievementPersonal = async (versionId: number, { callback, errorCallback }: GoalConfirm) => {
  return await HttpAxios.Get(`/api/v1/f6/management-evaluation/get-achieve-personal/${versionId}`).then((res) => {
    if (res && res.status === 200) {
      callback && callback(res.data);
    } else errorCallback && errorCallback(res?.data);
  });
};
const getAchievementAdditional = async (versionId: number, { callback, errorCallback }: GoalConfirm) => {
  return await HttpAxios.Get(`/api/v1/f6/management-evaluation/get-achieve-additional/${versionId}`).then((res) => {
    if (res && res.status === 200) {
      callback && callback(res.data);
    } else errorCallback && errorCallback(res?.data);
  });
};
const getFormula = async (versionId: number, { callback, errorCallback }: GoalConfirm) => {
  return await HttpAxios.Get(`/api/v1/f6/management-evaluation/get-formula/${versionId}`).then((res) => {
    if (res && res.status === 200) {
      callback && callback(res.data);
    } else errorCallback && errorCallback(res?.data);
  });
};
const getInforProSkillById = async (
  url: string,
  callBack: (data: any) => void,
  errorsCallback: (bool: boolean) => void,
) => {
  errorsCallback(true);

  return await HttpAxios.Get(url)
    .then((res) => {
      if (res && res?.status === 200) {
        callBack(res?.data);
        errorsCallback(false);
      } else {
        errorsCallback(false);
      }
    })
    .catch();
};
const publicVersionById = async (
  url: string,
  data: any,
  callBack: (data: any) => void,
  errorCallback: (bool: boolean) => void,
) => {
  errorCallback(true);

  return await HttpAxios.Put(url, {
    ...data,
  }).then((res) => {
    if (res && res?.status === 200) {
      callBack(res?.data);
      errorCallback(false);
    } else {
      errorCallback(false);
    }
  });
};
const getData810 = async (versionId: number, { callback, errorCallback }: GoalConfirm) => {
  return await HttpAxios.Get(`/api/v1/f6/management-evaluation/get-data-8-10/${versionId}`).then((res) => {
    if (res && res.status === 200) {
      callback && callback(res.data);
    } else errorCallback && errorCallback(res?.data);
  });
};
const getData810NS = async (versionId: number, { callback, errorCallback }: GoalConfirm) => {
  return await HttpAxios.Get(`/api/v1/f6/management-evaluation/get-data-8-10-ns/${versionId}`).then((res) => {
    if (res && res.status === 200) {
      callback && callback(res.data);
    } else errorCallback && errorCallback(res?.data);
  });
};
const getListUserEvaluationPeriod = async (params: any, callback: (response: any) => void) => {
  return await HttpAxios.Get(`/api/v1/f5/management-evaluation-history/list-user-evaluation-period`, {
    params,
  }).then((res) => {
    if (res && res.status === 200) {
      callback && callback(res.data);
    }
  });
};
const sendEmailFixedGoal = async (
  toEmails: string[],
  mailContent: any,
  emailType: number,
  status: number,
  evaluationPeriodId: number,
  goalEvaluation: string[],
  goaldepartmentEvaluation: string[],
  id: number[],
  type: string,
  dataMailCCs: any,
  callback: (response: any) => void,
  setLoading: (data: boolean) => void,
  handleClosePopUp: () => void,
  isFilterStatus: boolean,
) => {
  setLoading(true);

  return await HttpAxios.Post('/api/v1/f5/management-evaluation-history/send-email', {
    toEmails,
    mailContent,
    emailType,
    status,
    evaluationPeriodId,
    goalEvaluation,
    goaldepartmentEvaluation,
    id,
    type,
    dataMailCCs,
    isFilterStatus,
  }).then((res) => {
    if (res && res.status === 201) {
      callback && callback(res.data);
      setLoading(false);
      handleClosePopUp();
    }
  });
};

const getMailTemplateById = async (id: number, form: any, setMailContent: any) => {
  return await httpAxios.Get(`/api/v1/f5/management-evaluation-history/get-mail-template-by-id/${id}`).then((res) => {
    if (res && res.status == 200) {
      form.setFieldValue('subject', res.data?.subject);
      setMailContent(res.data?.content);
    }
  });
};

const getMailTemplateFixed = async (
  callBack: (data: { content: string; title: string }) => void,
  type: TemplateMailId,
  periodId: number,
  evaluationId?: number
) => {
  return await httpAxios
    .Get(`/api/v1/f5/management-evaluation-history/get-mail-template-fixed/${type}/${periodId}/${evaluationId || 0}`)
    .then((res: any) => {
      if (res && res.status == 200) {
        callBack(res.data);
      }
    });
};

//check status của record đã chọn, hiển thị message
const getExistIdsSend = async (params: any, type: TemplateMailId) => {
  return await httpAxios
    .Post(`/api/v1/f5/management-evaluation-history/check-status-selected/${type}`, {
      ...params,
    })
    .then((res: any) => {
      if (res) {
        return res.data.result;
      }
    });
};

const AdminEvaluationApiService = {
  goalConfirm,
  evaluationConfirm,
  publicEvaluation,
  getAchievementPersonal,
  getAchievementAdditional,
  getInforProSkillById,
  publicVersionById,
  getFormula,
  getData810,
  getData810NS,
  getListUserEvaluationPeriod,
  sendEmailFixedGoal,
  undoFixGoal,
  getMailTemplateById,
  getMailTemplateFixed,
  getExistIdsSend,
};
export default AdminEvaluationApiService;
