import { message } from 'antd';
import {
  LoginApiProps,
  LogoutApiProps,
  SelectCompanyApiProps,
  VerifyTokenApiProps,
} from '../../../types/api/authApiTypes';
import HttpAxios from '../../http';
import { t } from 'i18next';
import { HttpStatusCode } from 'axios';
import { cancelExportPolling } from '../../util';

const loginApi = async ({ email, password, callback }: LoginApiProps) => {
  await HttpAxios.Post('/api/v1/auth/login', { email, password }).then((res) => {
    if (res && res.status === HttpStatusCode.Ok) {
      callback && callback(res.data);
    } else if (res && res.status === HttpStatusCode.Unauthorized) {
      message.error(t('MESSAGE.COMMON.IDM_AUTHENTICATED_ERROR'));
    }
  });
};

const selectCompanyApi = async ({ email, companyGroupCode, callback }: SelectCompanyApiProps) => {
  await HttpAxios.Post('/api/v1/auth/select-company', { email, companyGroupCode }).then((res) => {
    if (res && res.status === HttpStatusCode.Ok) {
      callback && callback(res.data);
    }
  });
};

const verifyTokenApi = async ({ callback, errorCallback }: VerifyTokenApiProps) => {
  return await HttpAxios.Post('/api/v1/auth/verify-token', {}).then(async (res) => {
    if (res && res.status === 200) {
      callback && callback(res.data);
    } else errorCallback && errorCallback(res?.data);
  });
};

const logoutApi = async ({ callback }: LogoutApiProps) => {
  cancelExportPolling();

  return await HttpAxios.Post('/api/v1/auth/logout', {}).then(() => {
    if (callback) callback();
  });
};

const AuthApiService = {
  loginApi,
  verifyTokenApi,
  logoutApi,
  selectCompanyApi,
};
export default AuthApiService;
