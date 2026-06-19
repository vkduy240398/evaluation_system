import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Roles } from '../constant/Roles';

const RequireAuth = (props: { roleList?: Roles[]; isPublic?: boolean }) => {
  const { roleList, isPublic } = props;
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) return <Navigate to={'/login'} state={{ from: location }} replace />;

  const { roles } = auth.user;

  if (isPublic || isValidRoles(roles, roleList!)) {
    return <Outlet />;
  } else {
    return <Navigate to="/404page" replace />;
  }
};

const isValidRoles = (userRoles: Roles[] = [], routeRoles: Roles[] = []) => {
  return routeRoles.some((routeRole) => userRoles.includes(routeRole));
};

export default RequireAuth;
