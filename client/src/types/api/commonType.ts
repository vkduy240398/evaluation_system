export interface departmentCommon {
  callBack: (data: any[]) => void;
  errorCallBack: (bool?: boolean) => void;
}

export interface departmentTypeDepartment {
  callBackTypeDepartment: (data: any[]) => void;
  errorCallBack: (bool?: boolean) => void;
}

export interface departmentTypeDivision {
  callBackTypeDivision: (data: any[]) => void;
  errorCallBack: (bool?: boolean) => void;
}

export interface companyCommon {
  callBackCompany: (data: any[]) => void;
  errorCallBack: (bool?: boolean) => void;
}

export interface divisionAndDepartment {
  callBackDivisionAndDepartment: (data: { division: {}, department: [] | {} }) => void;
  errorCallBack: (bool: boolean) => void;
}

export interface skillCommon {
  callBack: (data: any[]) => void;
  errorCallBack: (bool?: boolean) => void;
}

export interface skillLists {
  callBackListSkill: (data: any[]) => void;
  errorCallBack: (bool?: boolean) => void;
}