export interface DivisionSubclass {
  department: DivisionInfo;
  departmentId: number;
  department_id: number;
  division: DivisionInfo;
  divisionId: number;
  division_id: number;
  id: number;
}
export interface DivisionInfo {
  active: number;
  class: number;
  code: string;
  createdTime: string;
  divisionId: number;
  divisionSubclass?: DivisionSubclass[];
  groupId: number;
  id: number;
  name: string;
  setting: number;
  type: number;
  updatedTime: string;
}
export interface DivisionListResponse {
  counts: number;
  data: DivisionInfo[];
  fullData: DivisionInfo[];
}
export interface DivisionType {
  code: string;
  name: string;
  id: number | null;
}
export interface conditionsDepartment {
  offset: number;
  limit: number;
  sortBy: string;
  sortType: string;
  catergory: any;
  departmentCodeAndName: any;
  classification: any;
  current: number;
  search?: boolean;
  divisionId: number;
}
