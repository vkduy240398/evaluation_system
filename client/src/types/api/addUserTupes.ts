type ErrCallbackType = (err: { [key: string]: string }) => void;

export interface GetUser {
  params: UserParams;
  callback?: (response: User) => void;
  errorCallback?: ErrCallbackType;
}
export interface GetDepartment {
  callback?: (response: any) => void;
  errorCallback?: ErrCallbackType;
}
interface UserParams {
  offset: number;
  next: number;
  departmentId: string;
  email: string;
  company?: string;
}
interface User {
  username: string;
  fullName: string;
  department: string;
  departmentId: string;
  positionId: string;
  position: string;
  conpanyId: string;
  company: string;
  email: string;
  employeeNumber: string;
}
export interface AddUser {
  data: User[];
  callback?: (response: User) => void;
  errorCallback?: ErrCallbackType;
}
export interface VerifyTokenApiProps {
  callback?: (response: { userData: any; accessToken: string }) => void;
  errorCallback?: ErrCallbackType;
}
