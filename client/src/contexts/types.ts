import { Roles } from '../constant/Roles';

export type UserDataType = {
  id: number;
  level: number;
  employeeNumber: string;
  fullName: string;
  email: string;
  roles: Roles[];
  companyId: number;
  companyName: string;
  departmentId: number;
  departmentCode: string;
  departmentName: string;
  flagSkill: number;
  companyGroupCode: string;
  companyGroupName: string;
  companyIcon: string;
  companyGroups: CompanyGroupType[];
  timeZone: string;
  emailHR: string | null;
};

export type CompanyGroupType = {
  code: string;
  name: string;
  roleCount: number;
};

export type ErrCallbackType = (err: { [key: string]: string }) => void;

export type LoginParams = {
  email: string;
  password: string;
  rememberMe?: boolean;
};
export type AuthValuesType = {
  isLoading: boolean;
  logout: () => void;
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void;
  user: UserDataType | null;
  setUser: (value: UserDataType | null) => void;
  setLoading: (isBool: boolean) => void;
  selectCompany: (companyGroupCode: string, errorCallback?: ErrCallbackType) => void;
};
