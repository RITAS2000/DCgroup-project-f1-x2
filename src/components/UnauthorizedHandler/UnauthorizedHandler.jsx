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
// import toast from 'react-hot-toast';
import { setSavedRecipes } from '../../redux/recipes/slice.js'; // 🟢 додав

const UnauthorizedHandler = () => {
  const dispatch = useDispatch();
  const recipesError = useSelector(selectRecipesError);
  const usersError = useSelector(selectUserProfileError);
  const stateToken = useSelector(selectAuthToken);

  useEffect(() => {
    const persisted = localStorage.getItem('persist:token');
    let token = persisted
      ? JSON.parse(persisted).token?.replace(/"/g, '')
      : null;

    const tokenMissing = !(stateToken || token);

    if (
      tokenMissing ||
      recipesError?.status === 401 ||
      usersError?.status === 401 ||
      usersError?.status === 404
    ) {
      toast.error('Your session has expired. Please log in again.');
      if (!tokenMissing) dispatch(logout());
      dispatch(clearAuth());
      dispatch(setSavedRecipes([]));
      localStorage.removeItem('persist:token');
    }
  }, [recipesError, usersError, stateToken, dispatch]);
  return null;
};

export default UnauthorizedHandler;
