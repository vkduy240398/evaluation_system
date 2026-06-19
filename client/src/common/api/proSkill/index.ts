import HttpAxios from '../../http/';
import { departmentCommon } from '../../../types/api/commonType';
import { urlCompanyCode } from '../../util';

const listApproveProSkill = async (
  conditions: any,
  callBackListProSkill: (dataSource: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Get(`/api/v1/f4/pro-skill-approval/list-approve-pro-skill`, {
    params: conditions,
  })
    .then((res) => {
      if (res && res.status === 200) {
        callBackListProSkill && callBackListProSkill(res?.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    })
    .catch(() => {
      setLoading(false);
    });
};

const getSkill = async ({ callBack, errorCallBack }: departmentCommon) => {
  errorCallBack(true);

  return await HttpAxios.Get('/api/v1/f4/pro-skill-approval/get-skill-approval').then((res) => {
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
const detailProSkill = async (
  url: string,
  versionId: string | undefined,
  callBack: (data: any) => void,
  errorCallback: (bool: boolean) => void,
  departmentId: string | undefined,
  navigate: any,
) => {
  errorCallback(true);

  return await HttpAxios.Get(`${url}/${versionId}/${departmentId}`)
    .then((res) => {
      if (res && res.status === 200) {
        callBack && callBack(res.data);
      } else {
        navigate(urlCompanyCode() + '/' + window.location.pathname.split('/')[1] + '/list-approve-pro-skill');
      }

      errorCallback(false);
    })
    .catch(() => {});
};

const detailProSkillPublicOfDepartment = async (
  url: string,
  departmentId: string | undefined,
  callBack: (data: any) => void,
  errorCallback: (bool: boolean) => void,
) => {
  errorCallback(true);

  return await HttpAxios.Get(`${url}/${departmentId}`)
    .then((res: any) => {
      callBack(res?.data);
      errorCallback(false);
    })
    .catch(() => {});
};
const getApprovalHistory = async (
  url: string,
  userId: number,
  callBack: (data: any) => void,
  errorCallBack: () => void,
  setLoading: (data: boolean) => void,
) => {
  return await HttpAxios.Get(url, { params: { userId: userId } }).then((res) => {
    setLoading(true);
    if (res && res.status === 200) {
      callBack && callBack(res.data);
    } else errorCallBack();
  });
};

const proSkillApiService = {
  listApproveProSkill,
  detailProSkill,
  getSkill,
  detailProSkillPublicOfDepartment,
  getApprovalHistory,
};
export default proSkillApiService;
