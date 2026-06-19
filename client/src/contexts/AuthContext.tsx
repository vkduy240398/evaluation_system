import { ReactNode, createContext, useEffect, useState } from 'react';
import { AuthValuesType, LoginParams, UserDataType } from './types';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthApiService from '../common/api/auth';
import LoadingScreenComponent from '../views/loading/LoadingScreenComponent';

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  isLoading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  selectCompany: () => Promise.resolve(),
};
type Props = {
  children: ReactNode;
};

const AuthContext = createContext(defaultProvider);
const AuthProvider = ({ children }: Props) => {
  // ** State
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user);
  const [isLoading, setLoading] = useState<boolean>(defaultProvider.isLoading);

  // ** Hook
  const navigate = useNavigate();
  const location = useLocation();
  const url = location.state?.from?.pathname + location.state?.from?.search;
  const from = url || '/home';

  // ** Effect
  useEffect(() => {
    const initAuth = async () => {
      const callback = (userResponse: any) => {
        const userData = userResponse.userData ? { ...userResponse.userData } : null;
        setUser(userData);
        setLoading(false);

        if (userData) {
          const pathname = location.pathname;
          (pathname.includes('/login') || !userData.roles?.length) && navigate('/home');
        }
      };
      const errorCallback = () => {
        setUser(null);
        setLoading(false);

        return <Navigate to={'/login'} state={{ from: location }} replace />;
      };
      setLoading(true);
      await AuthApiService.verifyTokenApi({ callback, errorCallback });
    };
    initAuth();
  }, []);

  const handleLogin = async (params: LoginParams) => {
    const callback = (response: { user: UserDataType; accessToken: string; refreshToken: string }) => {
      setUser({ ...response.user });
      navigate(from);
      setLoading(false);
    };

    await AuthApiService.loginApi({ ...params, callback });
  };

  const handleSelectCompany = async (companyGroupCode: string) => {
    const callback = (response: { user: UserDataType; accessToken: string; refreshToken: string }) => {
      setUser({ ...response.user });
      navigate(`/company/${companyGroupCode}/notification`);
      setLoading(false);
    };
    setLoading(true);
    await AuthApiService.selectCompanyApi({ email: user?.email || '', companyGroupCode: companyGroupCode, callback });
  };

  const handleLogout = async () => {
    const callback = () => {
      setUser(null);
      navigate('/login');
      setLoading(false);
    };
    setLoading(true);
    await AuthApiService.logoutApi({ callback });
  };

  const values = {
    user,
    isLoading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    selectCompany: handleSelectCompany,
  };
  if (isLoading) return <LoadingScreenComponent />;

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
export const AuthConsumer = AuthContext.Consumer;
