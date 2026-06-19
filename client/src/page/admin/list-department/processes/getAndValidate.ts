import { t } from 'i18next';
export const validateCode = (value: string, _form: any, type: string, dataSave: any) => {
  const checkValue = 'GNW-' + value;
  if (value) {
    const codeConflict = dataSave.filter(
      (item: any) => checkValue.trim().toLowerCase() === item.code.trim().toLowerCase() && type == item.type,
    );
    if (codeConflict.length > 0)
      return Promise.reject(new Error(t('MESSAGE.SCREEN.DEPARTMENT_CONFIG.IDM_DEPARTMENT_CODE_EXIST') as string));
    if (!/^[0-9]+$/.test(value)) {
      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_INVALID_NUMBER') as string));
    }
  }

  return Promise.resolve();
};

export const validateName = (value: string, _form: any, type: string, dataSave: any) => {
  if (value) {
    // const type = form.getFieldValue('department_category');
    const nameConflict = dataSave.filter(
      (item: any) => value.trim().toLowerCase() === item.name.trim().toLowerCase(), //  && Number(type) === item.type
    );
    if (nameConflict.length > 0) {
      if (type == '0') 
        return Promise.reject(new Error(t('MESSAGE.SCREEN.DEPARTMENT_CONFIG.IDM_DEPARTMENT_NAME_EXIST') as string));
      else
        return Promise.reject(new Error(t('MESSAGE.SCREEN.DEPARTMENT_CONFIG.IDM_DIVISION_NAME_EXIST') as string));
    }
  }

  return Promise.resolve();
};

// export const getListDepartmentGNW = (dataList: any, setDataSave: any) => {
//   httpAxios.Get('/api/v1/f8/management-user/get-all-department-gnw').then((res: any) => {
//     res?.data.forEach((item: any) => {
//       dataList.push({
//         code: item.code,
//         name: item.name,
//         type: item.type,
//       });
//     });
//     setDataSave([...dataList]);
//   });
// };
