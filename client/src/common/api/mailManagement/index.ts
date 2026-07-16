import { message } from 'antd';
import { MailProperty, MailQuery, MailTemplateQuery, conditionsMailHistory, editMailTemplateObj, itemMailTemplate } from '../../../page/admin/mail-management/interfaces/interfacesProps';
import httpAxios from '../../http/';
import { t } from 'i18next';

const getMailTemplateList = async (
  callBack: (data: { results: itemMailTemplate[] }) => void,
  query: MailTemplateQuery,
  setLoading: (data: boolean) => void,
) => {
  setLoading(true);

  return await httpAxios
    .Get('/api/v1/f7/management-evaluation-setting/mail-template-list', { params: query })
    .then((res) => {
      if (res && res.data) {
        callBack(res.data);
        setLoading(false);
      }
    });
};

const getMailTemplateListById = async (
  callBack: (data: { results: itemMailTemplate }) => void,
  query: any,
  setLoading: (data: boolean) => void,
) => {
  setLoading(true);

  return await httpAxios
    .Get('/api/v1/f7/management-evaluation-setting/mail-template-list-by-id', { params: query })
    .then((res) => {
      if (res && res.status === 200) {
        if (res?.data) {
          callBack(res.data);
          setLoading(false);
        }
      }
    });
};

const editMailTemplate = async (
  callBack: (data: { results: itemMailTemplate }) => void,
  dataEdit: editMailTemplateObj,
  setLoading: (data: boolean) => void,
  setIsOpenPopUpConfirm: (data: boolean) => void,
) => {
  setLoading(true);
  await httpAxios.Put('/api/v1/f7/management-evaluation-setting/edit-mail-template', dataEdit)
  .then((res) => {
    if(res && res.status === 200) {
      setLoading(false);
      setIsOpenPopUpConfirm(false);
      message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));
    }
  });
};

const getMailHistoryList = async (
  callBack: (data: { results: MailProperty[]; counts: number }) => void,
  query: conditionsMailHistory,
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
  body: any,
  id: number,
  setLoading: (data: boolean) => void,
  conditions: any,
  handleSuccess: () => void,
  handleCancel: () => void
) => {
  setLoading(true);

  return await httpAxios.Put(`/api/v1/f7/management-evaluation-setting/update-mail-history/${id}`, body).then((res) => {
    if (res && res.data) {
      setLoading(false);
      handleSuccess();
      handleCancel();

      // handleSearch(conditions);
    }
  });
};

const deleteMail = async (callBack: () => void, id: number, setLoading: (data: boolean) => void) => {
  setLoading(true);

  return await httpAxios.Delete(`/api/v1/f7/management-evaluation-setting/delete-mail/${id}`).then((res) => {
    if (res && res.data) {
      callBack();
      setLoading(false);
    }
  });
};

const mailManagementServices = {
  getMailTemplateList,
  getMailTemplateListById,
  editMailTemplate,
  getMailHistoryList,
  updateMailHistory,
  deleteMail
};
export default mailManagementServices;
