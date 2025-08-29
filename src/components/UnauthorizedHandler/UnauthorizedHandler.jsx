import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/auth/operations.js';
import { selectRecipesError } from '../../redux/recipes/selectors.js';
import {
  selectAuthToken,
  selectUserProfileError,
} from '../../redux/userPro/selectors.js';
import { toast } from 'react-toastify';
import { clearAuth } from '../../redux/auth/slice.js';
import { useLocation, useNavigate } from 'react-router-dom';

const UnauthorizedHandler = () => {
  const dispatch = useDispatch();
  const recipesError = useSelector(selectRecipesError);
  const usersError = useSelector(selectUserProfileError);
  const stateToken = useSelector(selectAuthToken);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const tokenMissing = !(stateToken || localStorage.getItem('token'));
    const allowedPaths = ['/auth/login', '/auth/register', '/auth/logout'];

    const isRecipePage =
      allowedPaths.includes(location.pathname) ||
      location.pathname.startsWith('/recipes/');

    const isAllowed = allowedPaths.includes(location.pathname) || isRecipePage;
    if (
      tokenMissing ||
      recipesError?.status === 401 ||
      usersError?.status === 401
    ) {
      if (!tokenMissing && !isAllowed) dispatch(logout());
      dispatch(clearAuth());
      localStorage.removeItem('token');
      toast.error('Session has expired. Please log in again.');
    }
    if (usersError?.status === 404) {
      dispatch(clearAuth());
      localStorage.removeItem('token');
      toast.error('Session has expired. Please log in again.');
    }
    if (!isAllowed) navigate('/');
  }, [
    recipesError,
    usersError,
    stateToken,
    navigate,
    location.pathname,
    dispatch,
  ]);

  return null;
};

export default UnauthorizedHandler;
