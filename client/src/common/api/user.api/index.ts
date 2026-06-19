import HttpAxios from '../../http/';
import {
  companyCommon,
  departmentTypeDepartment,
  departmentTypeDivision,
  divisionAndDepartment,
} from '../../../types/api/commonType';
import { conditionsUser } from '../../../model/Conditions';

const listUser = async (
  conditions: conditionsUser,
  callBack: (dataSource: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Get(`/api/v1/f8/management-user/find-user`, {
    params: conditions,
  })
    .then((res) => {
      if (res && res.status === 200) {
        callBack && callBack(res?.data);
        // setLoading(false);
      } else {
        setLoading(false);
      }
    })
    .catch(() => {
      setLoading(false);
    });
};

const getAllDepartmentTypeDepartment = async ({ callBackTypeDepartment, errorCallBack }: departmentTypeDepartment) => {
  errorCallBack(true);

  return await HttpAxios.Get('/api/v1/common/get-all-department-type-department').then((res) => {
    if (res && res?.status) {
      const arrays = res?.data.map((v: any) => {
        v.name = `${v.name}`;
        v.value = `${v.id}:${v.name}: ${v.type}`;

        return v;
      });
      arrays.unshift(
        {
          // Add default value
          type: -1,
          code: '',
          name: 'すべて',
          value: 'すべて',
        },
        {
          // Add blank value
          type: -1,
          code: 'default',
          name: '未設定',
          value: '_blank',
        },
      );

      callBackTypeDepartment(arrays);
      errorCallBack(false);
    } else {
      errorCallBack(false);
    }
  });
};

const getAllDepartmentTypeDepartment2 = async ({ callBackTypeDepartment, errorCallBack }: departmentTypeDepartment) => {
  errorCallBack(true);

  return await HttpAxios.Get('/api/v1/common/get-all-department-type-department').then((res) => {
    if (res && res?.status) {
      const arrays = res?.data.map((v: any) => {
        v.name = `${v.name}`;
        v.value = v.id;

        return v;
      });
      arrays.unshift(
        {
          // Add default value
          type: -1,
          code: '',
          name: 'すべて',
          value: null,
        },
        {
          // Add blank value
          type: -1,
          code: 'default',
          name: '未設定',
          value: '_blank',
        },
      );

      callBackTypeDepartment(arrays);
      errorCallBack(false);
    } else {
      errorCallBack(false);
    }
  });
};

const getAllDepartmentTypeDivision = async ({ callBackTypeDivision, errorCallBack }: departmentTypeDivision) => {
  errorCallBack(true);

  return await HttpAxios.Get('/api/v1/common/get-all-department-type-division').then((res) => {
    if (res && res?.status) {
      const arrays = res?.data.map((v: any) => {
        v.name = `${v.name}`;
        v.value = `${v.id}:${v.name}: ${v.type}`;

        return v;
      });
      arrays.unshift(
        {
          // Add default value
          type: -1,
          code: '',
          name: 'すべて',
          value: 'すべて',
        },
        {
          // Add blank value
          type: -1,
          code: 'default',
          name: '未設定',
          value: '_blank',
        },
      );
      callBackTypeDivision(arrays);
      errorCallBack(false);
    } else {
      errorCallBack(false);
    }
  });
};

const getAllDepartmentTypeDivision2 = async ({ callBackTypeDivision, errorCallBack }: departmentTypeDivision) => {
  errorCallBack(true);

  return await HttpAxios.Get('/api/v1/common/get-all-department-type-division').then((res) => {
    if (res && res?.status) {
      const arrays = res?.data.map((v: any) => {
        v.name = `${v.name}`;
        v.value = v.id;

        return v;
      });
      arrays.unshift(
        {
          // Add default value
          type: -1,
          code: '',
          name: 'すべて',
          value: null,
        },
        {
          // Add blank value
          type: -1,
          code: 'default',
          name: '未設定',
          value: '_blank',
        },
      );
      callBackTypeDivision(arrays);
      errorCallBack(false);
    } else {
      errorCallBack(false);
    }
  });
};

const getAllCompany = async ({ callBackCompany, errorCallBack }: companyCommon) => {
  errorCallBack(true);

  return await HttpAxios.Get('/api/v1/common/get-all-company').then((res) => {
    if (res && res.status === 200) {
      const arrays = res?.data.map((v: any) => {
        v.name = `${v.name}`;
        v.value = `${v.id}`;

        return v;
      });
      arrays.unshift({
        // Add default value
        type: -1,
        code: '',
        name: 'すべて',
        value: 'すべて',
      });
      callBackCompany(arrays);
      errorCallBack(false);
    } else {
      errorCallBack(false);
    }
  });
};

const getUserDivisionAndDepartment = async ({
  callBackDivisionAndDepartment,
  errorCallBack,
}: divisionAndDepartment) => {
  errorCallBack(true);

  return await HttpAxios.Get('/api/v1/common/get-user-division-and-department').then((res) => {
    if (res && res.status === 200) {
      callBackDivisionAndDepartment(res.data);
      errorCallBack(false);
    } else {
      errorCallBack(false);
    }
  });
};
const userListData = async (
  conditions: any,
  callBack: (dataSource: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Get(`/api/v1/f8/management-user/user-list`, {
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
const userApiService = {
  listUser,
  getAllDepartmentTypeDepartment,
  getAllDepartmentTypeDepartment2,
  getAllDepartmentTypeDivision,
  getAllDepartmentTypeDivision2,
  getAllCompany,
  getUserDivisionAndDepartment,
  userListData,
};
export default userApiService;
