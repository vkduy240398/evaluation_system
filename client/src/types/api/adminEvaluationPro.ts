type ErrCallbackType = (err?: { [key: string]: string }) => void;

export interface DepartmentResType {
  callback: (data: DepartmentType[]) => void;
  errorCallback?: ErrCallbackType;
}

export type DepartmentType = {
  id: number;
  code: string;
  name: string;
  type: 0 | 1;
};

export type GetUserActiveType = {
  callback: (data: any) => void;
  errorCallback?: ErrCallbackType;
};

export type UserResType = {
  id: number;
  employeeNumber: number;
  fullName: string;
};

type UserInActivesSetterApproverType = {
  id: string;
  employeeNumber: string;
  fullName: string;
};
export interface UpdateDepartmentRole {
  divisionId: number | string;
  departmentId: number | undefined;
  skillSetters: number[];
  skillApprovers: number[];
  isCheckedDep: boolean | undefined;
  isCheckedDiv: boolean | undefined;
  isCheckedGroup: boolean | undefined;
  group?: number | undefined;
  groups: number[] | undefined;
  callback: (data: {
    userInActivesSetters: UserInActivesSetterApproverType[];
    userInActivesApprovers: UserInActivesSetterApproverType[];
  }) => void;
  errorCallback?: ErrCallbackType;
}

export interface UpdateDepartmentRoleMultiple {
  divisionId: number | string;
  departmentIds: number[] | undefined;
  skillSetters: number[];
  skillApprovers: number[];
  isCheckedDep: boolean | undefined;
  isCheckedDiv: boolean | undefined;
  isCheckedGroup: boolean | undefined;
  group?: number | undefined;
  groups: number[] | undefined;
  callback: (data: any) => void;
  errorCallback?: ErrCallbackType;
}
export interface GetAdminEvaluationProType {
  departmentId: number | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
  callback: (arg: { dataList: any[]; count: number }) => void;
  errorCallback?: ErrCallbackType;
}

export interface GetAdminEvaluationSkillType {
  skillId: number | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
  callback: (arg: { dataList: any[]; count: number }) => void;
  errorCallback?: ErrCallbackType;
  detailed: boolean; // True = get setters, approvers and departments | False = //
}

export interface DeleteAdminEvaluationSkillType {
  skillId: number | undefined;
  callback: ({ code, reason }: { code: number; reason: null | any }) => void;
  errorCallback?: ErrCallbackType;
}

export interface GetAdminEvaluationProByDivisionIdType {
  divisionId: number | string | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
  callback: (arg: { dataList: any[]; count: number }) => void;
  errorCallback?: ErrCallbackType;
}

export interface UpdateSubDivisionType {
  divisionId: number | string;
  setting: number | null;
  callback: (data: any) => void;
  errorCallback?: ErrCallbackType;
}

export interface GetGroupProps {
  divisionId: number | string;
  limit?: number;
  offset?: number;
  callback: (data: any) => void;
  errorCallback?: ErrCallbackType;
}

export interface CreateGroupProps {
  divisionId: number | string;
  groupName: string;
  departmentIds: number[];
  callback: () => void;
  errorCallback?: ErrCallbackType;
}

export interface DeleteGroupProps {
  groupId: number | string;
  callback: (status: boolean) => void;
  errorCallback?: ErrCallbackType;
}

export interface UpdateGroupProps {
  groupId: number | string;
  groupName: string;
  departmentIds: number[];
  callback: () => void;
  errorCallback?: ErrCallbackType;
}

export interface SettingSkillType {
  skillName: string;
  departments: number[];
  divisions: number[];
  skillApprovers: number[];
  skillSetters: number[];
}

export interface DepartmentWithSubClass extends DepartmentType {
  divisionSubclass: { departmentId: number; divisionId: number }[];
}

export interface getAllDepartmentsWithSubClassProps {
  callback: (data: DepartmentWithSubClass[]) => void;
  errorCallback?: ErrCallbackType;
}

export interface AddProSkillProps {
  payload: SettingSkillType;
  callback: (data: DepartmentType) => void;
  errorCallback?: ErrCallbackType;
}

export interface EditProSkillProps extends AddProSkillProps {
  id: number;
}
