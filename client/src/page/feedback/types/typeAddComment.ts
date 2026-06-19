export enum TypeAddComment {
  TO_ONLY_ISSUE_USER = '1',
  TO_ONLY_ISSUE_SA = '2',
  TO_ALL_ISSUES_RELATED = '3',
}

export interface Comment {
  id: number;
  content: string;
  active: number;
  userInfor: {
    fullName: string;
    employeeNumber: string;
    isSystemAdmin: boolean;
    id: number;
  };
  createTime: string;
  updatedTime: string;
}
