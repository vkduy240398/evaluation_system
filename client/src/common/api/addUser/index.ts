import { t } from 'i18next';
import { AddUser, GetDepartment, GetUser } from '../../../types/api/addUserTupes';
import HttpAxios from '../../http';

const getUserOracle = async ({ params: { offset, next, departmentId, email, company } }: GetUser) => {
  return await HttpAxios.Get('/api/v1/f8/management-user/get-user-data-oracleDb', {
    params: { offset, next, departmentId, email, company },
  }).then((res) => {
    return res;
  });
};
const getDepartmentOracle = async () => {
  return await HttpAxios.Get('/api/v1/f8/management-user/get-department-oracledb', {}).then((res: any) => {
    let deparments: any = [];
    if (res?.data) {
      deparments = [{ value: null, label: t('IDS_ALL') }];
      const lists = res.data;
      Object.keys(lists).forEach((key: any) => {
        deparments.push({
          value: lists[key].departmentId + ':' + lists[key].departmentName,
          label: lists[key].departmentId + ': ' + lists[key].departmentName,
        });
      });
    }

    return deparments;
  });
};
const addUser = async (data: AddUser[], { callback, errorCallback }: GetDepartment) => {
  return await HttpAxios.Post('/api/v1/f8/management-user/add-user', {
    data,
  }).then((res) => {
    if (res && res.status === 201) callback && callback(res.data);
    else errorCallback && errorCallback(res?.data);
  });
};
const getCompanyOracle = async () => {
  return await HttpAxios.Get('/api/v1/f8/management-user/get-company-oracledb', {}).then((res: any) => {
    let companys: any = [];
    if (res?.data) {
      companys = [{ value: null, label: t('IDS_ALL') }];
      const lists = res.data;
      Object.keys(lists).forEach((key: any) => {
        companys.push({
          value: lists[key].conpanyId + ':' + lists[key].companyName,
          label: lists[key].conpanyId + ': ' + lists[key].companyName,
        });
      });
    }

    return companys;
  });
};

const AddUserApiService = { getUserOracle, getDepartmentOracle, addUser, getCompanyOracle };
export default AddUserApiService;
