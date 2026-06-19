export interface ResultsSaveDraft {
  code: number;
  id: number;
  updated: Date;
  version: number;
  reason: string | null;
  departmentActive: number;
  status: number;
  fullName: string;
  subVersion: number;
}
export interface childrens {
  versionId: number;
  smallClass: string;
  note: string;
  mediumClass: string;
  jobType: string;
  itemId: string;
  isAdd: boolean | undefined;
  difficulty: number;
  content: string;
}
export interface dataTypes {
  children: childrens[];
  department: string;
  publicDate: string | null;
  publicStatus: number;
  reason: string;
  status: number;
  updated: Date;
  userUpdated: string;
  version: string;
  versionId: number;
  versionMain: number;
  versionSub: number;
  departmentActive: number;
}

export interface ChildrenEditProSkill {
  content: string;
  difficulty: number | null;
  itemId: string;
  jobType: string;
  mediumClass: string;
  note: string;
  smallClass: string;
  versionId: number | undefined;
}
export interface TypeData {
  id: number;
  department: string;
  publicStatus: number;
  status: number;
  updated: string | null;
  version: string;
  versionId: number;
  children: ChildrenEditProSkill[];
  reason: string | null;
  versionMain: number;
  versionSub: number;
  departmentActive: number;
  departmentId?: number;
  createdUser?: {
    fullName: string;
    id: number;
  };
  userUpdated: string;
  lastUpdatedTime: string;
  listDepartment: string;
}
export interface DataSourceEditProSkill {
  data: TypeData;
  subVersion: number;
  listPoint: {
    settingProFormula:
      | {
          id: number;
          versionId: number;
          note: string;
          point: number;
        }[]
      | [];
  };
  settersAndApprovers: {
    setters: string[];
    approvers: string[];
  };
  departmentRoles: number;
  lengths?: number;
  type?: number;
  editAlready?: boolean;
  rejectComment?: any;
}

export interface saveDraftInterfaces {
  code: number;
  departmentActive: number;
  updatedTime: string;
  id: number;
  status: number;
  version: number;
  subVersion: number;
  departmentId: number;
  creationUser: {
    fullName: string;
    id: number;
  };
  department: string;
  lastUpdatedTime: string;
  listPoint: {
    settingProFormula:
      | {
          id: number;
          versionId: number;
          note: string;
          point: number;
        }[]
      | [];
  };
  settersAndApprovers: {
    setters: string[];
    approvers: string[];
  };
  departmentRoles: number;
  updated: string;
  fullName: string;
  reason: string;
  listDepartment: string;
}
