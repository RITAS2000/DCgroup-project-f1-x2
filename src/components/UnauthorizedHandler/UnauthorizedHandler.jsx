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

  // useEffect(() => {
  //   const persisted = localStorage.getItem('persist:token');
  //   let token = persisted
  //     ? JSON.parse(persisted).token?.replace(/"/g, '')
  //     : null;

  //   const tokenMissing = !(stateToken || token);
  //   let isSessionToastShown = false;
  //   if (
  //     tokenMissing ||
  //     recipesError?.status === 401 ||
  //     usersError?.status === 401 ||
  //     usersError?.status === 404
  //   ) {
  //     if (!isSessionToastShown) {
  //       toast.error('Your session has expired. Please log in again.');
  //       isSessionToastShown = true;
  //     }

  //     if (!tokenMissing) dispatch(logout());
  //     dispatch(clearAuth());
  //     dispatch(setSavedRecipes([]));
  //     localStorage.removeItem('persist:token');
  //   }
  // }, [recipesError, usersError, stateToken, dispatch]);
  useEffect(() => {
    const persisted = localStorage.getItem('persist:token');
    let token = persisted
      ? JSON.parse(persisted).token?.replace(/"/g, '')
      : null;

    const hasToken = Boolean(stateToken || token);

    // 🟥 якщо є токен і сервер каже 401 → сесія прострочена
    if (
      hasToken &&
      (recipesError?.status === 401 || usersError?.status === 401)
    ) {
      toast.error('Your session has expired. Please log in again.');
      dispatch(logout());
      dispatch(clearAuth());
      dispatch(setSavedRecipes([]));
      localStorage.removeItem('persist:token');
      return;
    }

    // 🟨 якщо сервер каже 404 (наприклад, юзер видалений)
    if (hasToken && usersError?.status === 404) {
      toast.error('User not found. Please log in again.');
      dispatch(logout());
      dispatch(clearAuth());
      dispatch(setSavedRecipes([]));
      localStorage.removeItem('persist:token');
      return;
    }

    // 🟢 якщо токена нема (звичайний logout) → просто чистимо, без тоста
    if (!hasToken) {
      dispatch(clearAuth());
      dispatch(setSavedRecipes([]));
      localStorage.removeItem('persist:token');
    }
  }, [recipesError, usersError, stateToken, dispatch]);
  return null;
};

export default UnauthorizedHandler;
