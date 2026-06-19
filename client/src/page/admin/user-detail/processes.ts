import httpAxios from '../../../common/http';

interface DepartmentProps {
  id: number;
  code?: string;
  name?: string;
  codeName: string;
}
interface DivisionProps {
  divisionId: number;
  code?: string;
  name?: string;
  codeName: string;
  childrens: DepartmentProps[];
}
interface CompanyProps {
  id: number;
  name: string;
}
export const getDataList = async (
  setListDepartmentTypeDepartment: (data: DepartmentProps[]) => void,
  setListDepartmentTypeDivision: (data: DivisionProps[]) => void,
  setListCompany: (data: CompanyProps[]) => void,
  divisionId?: number,
) => {
  /**Get all department type department */
  // httpAxios.Get('/api/v1/common/get-all-department-type-department').then((res) => {
  //   if (res && res.status === 200) {
  //     const temps: any[] = [];
  //     res?.data.forEach((item: any) => {
  //       temps.push({ id: item.id, departmentNameTypeDepartment: item.code + ': ' + item.name });
  //     });
  //     setListDepartmentTypeDepartment(temps);
  //   }
  // });

  /**Get all department type division */
  await httpAxios.Get('/api/v1/common/get-all-division-department-by-children').then((res) => {
    if (res && res.status === 200) {
      const dataList = res.data as DivisionProps[];
      setListDepartmentTypeDivision(dataList);

      const filters = dataList.find((f) => f.divisionId === divisionId);
      console.log(dataList, filters, 'filters', divisionId);

      if (filters) {
        setListDepartmentTypeDepartment(filters.childrens);
      }
    }
  });
  httpAxios.Get('/api/v1/common/get-all-company').then((res) => {
    if (res && res.status === 200) {
      setListCompany(res.data);
    }
  });
};
export const changeRole1 = (a: number[], b: number[]) => {
  if (!a.includes(1) && b.includes(1)) {
    return 1;
  } else if (a.includes(1) && !b.includes(1)) {
    return 2;
  } else {
    return 0;
  }
};
export const changeRole2 = (a: number[], b: number[]) => {
  return a.includes(2) && !b.includes(2);
};
export const changeRole3 = (a: number[], b: number[]) => {
  return a.includes(3) && !b.includes(3);
};
export const changeRole4 = (a: number[], b: number[]) => {
  return a.includes(4) && !b.includes(4);
};

// export const changeDepartment = (values: any, recordInfo: any, defaultOption: any) => {
//   return (
//     (values.department !== recordInfo.departmentName && values.department !== defaultOption.departmentId) ||
//     (values.division !== recordInfo.divisionName && values.division !== defaultOption.divisionId)
//   );
// };

export const compareArrayNumber = (arrOld: number[], arrNew: number[]) => {
  arrOld.sort();
  arrNew.sort();

  return arrOld + '' == arrNew + '';
};
