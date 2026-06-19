/* eslint-disable @typescript-eslint/no-unused-vars */
import { t } from 'i18next';
import HttpAxios from '../../http/';
import httpAxios from '../../http/';
import DownloadProSkill from './downloadProSkill';
const listDep_Template = async (
  role: string,
  callback: (data: any) => void,
  errorCallback: (bool: boolean) => void,
  params: any,
) => {
  errorCallback(true);
  let url = '';
  if (role == 'f3') url = '/api/v1/f3/pro-setting/list-dep-temp-export';
  if (role == 'f4') url = '/api/v1/f4/pro-skill-approval/list-dep-temp-export';
  if (role == 'f6') url = '/api/v1/f6/management-evaluation/list-dep-temp-export';

  return await HttpAxios.Get(url, {
    params: params,
  }).then((res) => {
    if (res && res.status === 200) {
      callback && callback(res.data);
      errorCallback(false);
    } else errorCallback && errorCallback(false);
  });
};

const exportDep_Template = async (
  role: string,
  year: any,
  periodIndex: any,
  errorCallback: (bool: boolean) => void,
  setSelectedRowKeys: any,
  params: any,
) => {
  errorCallback(true);
  const periodName = periodIndex === 1 ? '上期' : '下期';
  let url = '';
  if (role == 'f3') url = '/api/v1/f3/pro-setting/dep-temp-export';
  if (role == 'f4') url = '/api/v1/f4/pro-skill-approval/dep-temp-export';
  if (role == 'f6') url = '/api/v1/f6/management-evaluation/dep-temp-export';

  return await httpAxios
    .Get(url, {
      params: params,
    })
    .then(async (res: any) => {
      if (res && res.status == 200) {
        await DownloadProSkill.handleDownLoad(year, periodName, role, res.data, errorCallback);
      } else errorCallback && errorCallback(false);
    });
};

const exportProSkillApiService = {
  listDep_Template,
  exportDep_Template,
};
export default exportProSkillApiService;
