import { message } from 'antd';
import {
  EvaluationPeriod,
  MailProperty,
  MailQuery,
  MailTemplate,
  MailToSend,
  ToMailList,
} from '../../../page/admin/period-evaluation/period-evaluation-detail/interfaces/interfacesProps';
import httpAxios from '../../http/';

const getPeriodDetailByCondition = async (
  url: string,
  callBack: (data: EvaluationPeriod) => void,
  errorCallBack: (bool: boolean) => void,
) => {
  errorCallBack(true);

  return await httpAxios.Get(url).then((res) => {
    if (res && res.status === 200) {
      callBack && callBack(res.data);
      errorCallBack(false);
    } else errorCallBack(false);
  });
};
const savePeriodValues = async (
  url: string,
  body: { condition: { year: string; periodIndex: number }; body: EvaluationPeriod },
  callBack: () => void,
  errorCallBack: (bool: boolean) => void,
) => {
  errorCallBack(true);

  return await httpAxios.Post(url, body).then((res) => {
    if (res && res.status === 201) {
      callBack();
      errorCallBack(false);
    } else errorCallBack(false);
  });
};

const cronjobSendMail = async (
) => {
  return await httpAxios.Post(`/api/v1/f5/management-evaluation-history/cronjob-send-mail`).then((res) => {
    if (res) {
      message.success('RUN CRONJOB !!!');
    }
  });
};

const getToEmailList = async (
  callBack: (data: { toEmailList: ToMailList[]; content: string; title: string }) => void,
  type: number,
  year: string,
  periodIndex: number,
) => {
  return await httpAxios
    .Get(`/api/v1/f5/management-evaluation-history/get-to-email-list/${type}/${year}/${periodIndex}`)
    .then((res) => {
      if (res && res.status == 200) callBack(res.data);
    });
};
const saveMailTemplate = async (
  body: MailTemplate,
  callback: (response: any) => void,
  setLoading: (data: boolean) => void,
) => {
  setLoading(true);

  return await httpAxios.Post('/api/v1/f5/management-evaluation-history/save-mail-template', body).then((res) => {
    if (res && res.status == 201) {
      callback && callback(res);
      setLoading(false);
    }
  });
};
const sendMailNow = async (
  setLoading: (data: boolean) => void,
  content: MailToSend,
  inputedValues: MailTemplate,
  callback: (response: any) => void,
  onCancel: () => void,
) => {
  setLoading(true);

  return await httpAxios
    .Post('/api/v1/f5/management-evaluation-history/send-mail-now', { content, inputedValues })
    .then((res) => {
      if (res && res.status == 201) {
        callback && callback(res.data);
        setLoading(false);
        onCancel();
      }
    });
};
const getMailHistoryList = async (
  callBack: (data: { results: MailProperty[]; counts: number }) => void,
  query: MailQuery,
  setLoading: (data: boolean) => void,
) => {
  setLoading(true);

  return await httpAxios
    .Get('/api/v1/f7/management-evaluation-setting/mail-history-list', { params: query })
    .then((res) => {
      if (res && res.data) {
        callBack(res.data);
        setLoading(false);
      }
    });
};
const updateMailHistory = async (
  body: { contentMail: string; title: string; sendTimeSetting: string },
  id: number,
  setLoading: (data: boolean) => void,
) => {
  setLoading(true);

  return await httpAxios.Put(`/api/v1/f7/management-evaluation-setting/update-mail-history/${id}`, body).then((res) => {
    if (res && res.data) {
      setLoading(false);
    }
  });
};
const deleteMail = async (callback: () => void, id: number, setLoading: (data: boolean) => void) => {
  setLoading(true);

  return await httpAxios.Delete(`/api/v1/f7/management-evaluation-setting/delete-mail/${id}`).then((res) => {
    if (res && res.data) {
      callback();
      setLoading(false);
    }
  });
};
const getUsersMailList = async (callBack: (data: { id: number; email: string; employeeNumber: string }[]) => void, conditions: string) => {
  return await httpAxios
    .Post('/api/v1/f5/management-evaluation-history/users-email-list', { conditions })
    .then((res: any) => {
      if (res && res.data) {
        callBack(res.data);
      }
    });
};
const updateToMailList = async (values: string, mailId: number) => {
  return await httpAxios.Post('/api/v1/f7/management-evaluation-setting/update-to-email-list', { values, mailId });
};
const evaluationPeriodServices = {
  getPeriodDetailByCondition,
  savePeriodValues,
  getToEmailList,
  saveMailTemplate,
  sendMailNow,
  getMailHistoryList,
  updateMailHistory,
  deleteMail,
  getUsersMailList,
  updateToMailList,
  cronjobSendMail
};
export default evaluationPeriodServices;
