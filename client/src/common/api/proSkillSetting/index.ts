import { departmentCommon, skillCommon } from '../../../types/api/commonType';
import { main } from '../../../types/api/proSkillSetting';
import HttpAxios from '../../http';

const getDepartmentRole = async ({ callBack, errorCallBack }: main) => {
  errorCallBack(true);

  return await HttpAxios.Get('/api/v1/f3/pro-setting/get-department', {}).then((res) => {
    if (res && res?.status) {
      const arrays = res?.data.departments.map((v: any) => {
        v.label = `${v.code}: ${v.name}`;
        v.value = v.id;

        return v;
      });
      arrays.unshift({ label: 'すべて', code: '-1', type: 0, value: -1 });
      callBack({
        departments: arrays,
      });
      errorCallBack(false);
    } else {
      errorCallBack(false);
    }
  });
};
const getSkillRole = async ({ callBack, errorCallBack }: any) => {
  errorCallBack(true);

  return await HttpAxios.Get('/api/v1/f3/pro-setting/get-skill', {}).then((res) => {
    if (res && res?.status) {
      const arrays = res?.data.skill.map((v: any) => {
        v.label = v.skill.name;
        v.value = v.skill.id;

        return v;
      });
      arrays.unshift({ label: 'すべて', code: '-1', value: -1 });
      callBack({
        skill: arrays,
      });
      errorCallBack(false);
    } else {
      errorCallBack(false);
    }
  });
};
const getListVersion = async (params: any, { callBack, errorCallBack }: main) => {
  errorCallBack(true);

  return await HttpAxios.Get('/api/v1/f3/pro-setting/version-pro-skill', {
    params,
  }).then((res) => {
    if (res && res?.status) {
      callBack(res.data);
      errorCallBack(false);
    } else {
      errorCallBack(false);
    }
  });
};

const getAllDepartment = async ({ callBack, errorCallBack }: departmentCommon) => {
  errorCallBack(true);

  return await HttpAxios.Get('/api/v1/common/get-all-department').then((res) => {
    if (res && res?.status) {
      callBack(res?.data);
      errorCallBack(false);
    } else {
      errorCallBack(false);
    }
  });
};
const getListVersionDepartment = async (params: any, { callBack, errorCallBack }: main) => {
  errorCallBack(true);

  return await HttpAxios.Get(
    '/api/v1/' +
      (window.location.pathname.split('/')[3] === 'evaluator'
        ? 'f2'
        : window.location.pathname.split('/')[3] === 'pro-setting'
        ? 'f3'
        : 'f4') +
      '/' +
      window.location.pathname.split('/')[3] +
      '/version-pro-skill-department',
    { params },
  ).then((res) => {
    if (res && res?.status) {
      callBack(res.data);
      errorCallBack(false);
    } else {
      errorCallBack(false);
    }
  });
};

// const getRoleUser = async (params: any, { callBack, errorCallBack }: main) => {
//
//   errorCallBack(true);

//   return await HttpAxios.Get('/api/v1/f3/pro-setting/get-role-user', { params }).then((res) => {
//     if (res && res?.status) {
//       callBack(res.data);
//       errorCallBack(false);
//     } else {
//       errorCallBack(false);
//     }
//   });
// };

const getAllSkill = async ({ callBack, errorCallBack }: skillCommon) => {
  errorCallBack(true);

  return await HttpAxios.Get('/api/v1/common/get-all-skill').then((res) => {
    if (res && res?.status) {
      callBack(res?.data);
      errorCallBack(false);
    } else {
      errorCallBack(false);
    }
  });
};

const proSkillSettingService = {
  getAllDepartment,
  getListVersion,
  getDepartmentRole,
  getListVersionDepartment,
  getSkillRole,
  getAllSkill,
  // getRoleUser,
};
export default proSkillSettingService;
