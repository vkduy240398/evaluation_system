import { message } from 'antd';
import { DivisionType, conditionsDepartment } from '../../../model/Conditions';
import HttpAxios from '../../http/';
import { t } from 'i18next';

const getListDepartmentGNW = async (dataList: any, setDataSave: any, setLoading: (isLoading: boolean) => void) => {
  setLoading(true);

  return await HttpAxios.Get('/api/v1/f8/management-user/get-all-department-gnw').then((res: any) => {
    res?.data.forEach((item: any) => {
      dataList.push({
        code: item.code,
        name: item.name,
        type: item.type,
      });
    });
    setDataSave([...dataList]);
    setLoading(false);
  });
};
const listDepartment = async (
  conditions: conditionsDepartment,
  callBack: (dataSource: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Get(`/api/v1/f8/management-user/find-department`, {
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
const listSubDepartment = async (
  conditions: conditionsDepartment,
  callBack: (dataSource: any) => void,
  setLoading: (bool: boolean) => void,
  divisionId: number,
  setSelectedDivision: (data: DivisionType) => void,
) => {
  setLoading(true);
  conditions.divisionId = divisionId;

  return await HttpAxios.Get(`/api/v1/f8/management-user/find-sub-department`, {
    params: conditions,
  })
    .then((res) => {
      if (res && res.status === 200) {
        callBack && callBack(res?.data);
        setSelectedDivision(res.data.selectedDivision);
        setLoading(false);
      } else {
        setLoading(false);
      }
    })
    .catch(() => {
      setLoading(false);
    });
};
const getListDivisionOracle = async (
  setListDivision: (data: { id: string; code: string; name: string }[]) => void,
  setLoading: (isLoading: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Get('/api/v1/f8/management-user/get-department-oracledb').then((res) => {
    if (res && res.status === 200) {
      const temps: { id: string; code: string; name: string }[] = [];
      res?.data.forEach((item: any) => {
        temps.push({
          id: item.departmentId + ': ' + item.departmentName,
          code: item.departmentId,
          name: item.departmentName,
        });
      });
      setListDivision(temps);
      setLoading(false);
    }
    setLoading(false);
  });
};
const getListMergerOracle = async (setListMerge: (data: any) => void, setLoading: (isLoading: boolean) => void) => {
  setLoading(true);

  return await HttpAxios.Get('/api/v1/f8/management-user/get-division-department-oracledb-merge').then((res) => {
    if (res && res.status === 200 && res?.data) {
      const temps: { id: any; code: string; name: string }[] = [];
      res?.data.forEach((item: any) => {
        temps.push({
          id: item.id !== 'oracle' ? item.id : item.code + ': ' + item.name,
          code: item.code,
          name: item.name,
        });
      });
      setListMerge(temps);
      setLoading(false);
    }
    setLoading(false);
  });
};
const getListDivisionSystem = async (setDepartmentList: (data: any) => void) => {
  return await HttpAxios.Get('/api/v1/f8/management-user/list-division').then((res) => {
    if (res && res.status === 200 && res?.data) {
      const temps: { id: any; code: string; name: string }[] = [];
      res?.data.forEach((item: any) => {
        temps.push({
          id: item.id !== 'oracle' ? item.id : item.code + ': ' + item.name,
          code: item.code,
          name: item.name,
        });
      });
      setDepartmentList(temps);
    }
  });
};
const saveDivisionDepartment = async (
  data: any,
  setLoading: (isLoading: boolean) => void,
  form: any,
  loadData: any,
  setCheckOracle: any,
  setIsShowDivision: any,
) => {
  return await HttpAxios.Post('/api/v1/f8/management-user/add-division-deparment', { ...data }).then((res) => {
    if (res?.status === 201) {
      message.success(t('MESSAGE.SCREEN.DEPARTMENT_CONFIG.IDM_ADDED_NEW_DEPARTMENT_SUCCESSFULLY'));
      form.resetFields();
      form.setFieldsValue({ category: 1, class: 1 });
      setCheckOracle(1);
      setIsShowDivision(true);
      loadData();
    } else if (res?.status === 204) {
      message.error(t('MESSAGE.SCREEN.DEPARTMENT_CONFIG.IDM_DEPARTMENT_NAME_EXIST'));
    }
    setLoading(false);
  });
};
const getList = async (setLoading: (isLoading: boolean) => void, callBack: (data: any) => void) => {
  setLoading(true);

  return await HttpAxios.Get(`/api/v1/f8/management-user/get-list`).then((res: any) => {
    if (res && res.data) {
      callBack(res.data);
    }
    setLoading(false);
  });
};
const departmentApiService = {
  getListDepartmentGNW,
  listDepartment,
  listSubDepartment,
  getListDivisionOracle,
  saveDivisionDepartment,
  getListMergerOracle,
  getListDivisionSystem,
  getList,
};
export default departmentApiService;
