import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../../redux/auth/selectors';

export default function PrivateRoute() {
  const isAuth = useSelector(selectIsLoggedIn);

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}
