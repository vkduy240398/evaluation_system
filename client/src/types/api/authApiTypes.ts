import { UserDataType } from '../../contexts/types';

type ErrCallbackType = (err: { [key: string]: string }) => void;

export interface LoginApiProps {
  email: string;
  password: string;
  callback?: (response: { user: UserDataType; accessToken: string; refreshToken: string }) => void;
  errorCallback?: ErrCallbackType;
}

export interface VerifyTokenApiProps {
  callback?: (user: UserDataType) => void;
  errorCallback?: ErrCallbackType;
}

export interface LogoutApiProps {
  callback?: () => void;
  errorCallback?: ErrCallbackType;
}

export interface SelectCompanyApiProps {
  email: string;
  companyGroupCode: string;
  callback?: (response: { user: UserDataType; accessToken: string; refreshToken: string }) => void;
}
