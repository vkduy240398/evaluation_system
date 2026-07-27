/* eslint-disable lines-around-comment */
export interface conditionsEvaluation {
  offset: number;
  limit: number;
  sortBy: string;
  sortType: string;
  yearStart: string;
  yearEnd: string;
  current: number;
  search?: boolean;
}
export interface childrenEvaluation {
  id: string;
  periodStart: string;
  periodEnd: string;
  summaryPoint: string;
  totalPoint: number;
  status: string;
  evaluator05: string;
  evaluator1: string;
  evaluator2: string;
}

export interface itemEvaluationList {
  id: number;
  year: string;
  totalPoint: number;
  status?: string;
  evaluationId?: string;
  evaluator05?: string;
  evaluator1?: string;
  evaluator2?: string;
  level: number;
  children?: childrenEvaluation[];
  userInfo?: any;
}
export interface listEvaluation {
  data: itemEvaluationList[] | undefined;
  length: number;
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

export interface itemDepartmentList {
  id: any;
  department_code: any;
  department_name: any;
  category: any;
}
export interface listDepartments {
  data: itemDepartmentList[] | undefined;
  length: number;
}

export interface conditionsUser {
  offset: number;
  limit: number;
  sortBy: string;
  sortType: string;
  nameAndEmail: any;
  department: any;
  role: any;
  division: any;
  current: number;
  search?: boolean;
}

export interface itemUserList {
  id: any;
  name: any;
  companyName: any;
  departmentName: any;
  divisionName: any;
  level: any;
  email: any;
  role: any;
}
export interface listUsers {
  data: itemUserList[] | undefined;
  length: number;
}

export interface conditionsProskill {
  offset: number;
  limit: number;
  sortBy: string;
  sortType: string;
  status: any;
  department: any;
  publicStatus: any;
  current: number;
  search?: boolean;
}

export interface itemAppoveList {
  id: any;
  skill: any;
  version: any;
  status: any;
  publicStatus: any;
  submitter: any;
  submitDate: any;
  publicDate: any;
}
export interface listApproveProSkill {
  data: itemAppoveList[] | undefined;
  length: number;
}

export interface conditionsListCriteriaHistorty {
  offset: number;
  limit: number;
  sortBy: string;
  sortType: string;
  status: any;
  type: any;
  current: number;
  flagSkill: number;
  search?: boolean;
}

export interface itemCriteriaList {
  id: any;
  version: any;
  level: any;
  status: any;
  publicStatus: any;
  submitter: any;
  submitDate: any;
  publicDate: any;
}
export interface listCriteria {
  data: itemCriteriaList[] | undefined;
  counts: number;
}

export interface conditionsEvaluationItemHistory {
  offset: number;
  limit: number;
  sortBy: string;
  sortType: string;
  status: any;
  publicStatus: any;
  department: any;
  current: number;
  search?: boolean;
}

export interface itemEvaluationItem {
  id: any;
  department?: any;
  version: any;
  status: any;
  publicStatus: any;
  submitter: any;
  submitDate: any;
  publicDate: any;
}
export interface listEvaluationItemHistory {
  data: itemEvaluationItem[] | undefined;
  length: number;
}

export interface conditionsSearchSettingEvaluator {
  offset: number;
  limit: number;
  sortBy: string;
  sortType: string;
  department: any;
  userName: any;
  evaluatorName: any;
  level: any;
  flagSkill: any;
  skill: any;
  current: number;
  isSearch?: boolean;
  state: any;
  exception: number;
  divisionId?: number | null;
  departmentId?: number | null;
  tabMode?: 'company' | 'department' | 'personal' | 'all' | null;
}

export interface itemSettingEvaluator {
  id: any;
  fullName: any;
  statusActive: any;
  department: any;
  evaluatorHalf: any;
  evaluatorFirst: any;
  evaluatorSecond: any;
  evaluationPeriod: any;
}
export interface listSettingEvaluator {
  data: itemSettingEvaluator[] | undefined;
  length: number;
}
export interface DivisionType {
  code: string;
  name: string;
  id: number | null;
}

export interface conditionsUserViewEvaluation {
  offset: number;
  limit: number;
  sortBy: string;
  sortType: string;
  yearStart: string;
  yearEnd: string;
  current: number;
  fullName: string;
  search?: boolean;
}

export interface childrenViewEvaluation {
  id: string;
  periodStart: string;
  periodEnd: string;
}

export interface itemUserViewEvaluation {
  id: number;
  fullName: string;
  periodTime: string;
  department: string;
  level: number;
  subList?: childrenViewEvaluation[];
  userInfo?: any;
}
export interface listUsersViewEvaluation {
  data: itemUserViewEvaluation[] | undefined;
  length: number;
}

export interface conditionsUserSettingViewEvaluation {
  offset: number;
  limit: number;
  nameAndEmail: string;
  current: number;
  userId: number;
  depDivName: string;
  search?: boolean;
}

export interface itemUserListViewEvaluation {
  id: any;
  userIdSpecified: any;
  fullName: any;
  company: any;
  divDep: any;
  level: any;
  email: any;
}
export interface listUsersSettingViewEvaluation {
  data: itemUserListViewEvaluation[] | undefined;
  length: number;
}

export interface itemUserListExpertise {
  userId: number;
  name: any;
  employeeNumber: string;
  departmentName: string;
  divisionName: string;
  level: number;
  userName: string;
}
export interface listUsersExpertise {
  data: itemUserListExpertise[] | undefined;
  length: number;
}
