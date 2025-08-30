import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/auth/operations.js';
import { selectRecipesError } from '../../redux/recipes/selectors.js';
import {
  selectAuthToken,
  selectUserProfileError,
} from '../../redux/userPro/selectors.js';
// import { toast } from 'react-toastify';
import { clearAuth } from '../../redux/auth/slice.js';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { selectLogoutModalIsOpen } from '../../redux/modal/selectors.js';
import { openLogout } from '../../redux/modal/logoutSlice.js';

const UnauthorizedHandler = () => {
  const dispatch = useDispatch();
  const recipesError = useSelector(selectRecipesError);
  const usersError = useSelector(selectUserProfileError);
  const stateToken = useSelector(selectAuthToken);
  // const navigate = useNavigate();
  // const location = useLocation();

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
      if (!tokenMissing) dispatch(logout());
      dispatch(clearAuth());
      localStorage.removeItem('persist:token');
      dispatch(
        openLogout({
          type: 'sessionExpired',
          props: {
            message: 'Your session has expired. Please log in again.',
          },
        }),
      );
    }
  }, [recipesError, usersError, stateToken, dispatch]);

  return null;
};

export default UnauthorizedHandler;

// useEffect(() => {
//   const persisted = localStorage.getItem('persist:token');
//   let token = null;

//   if (persisted) {
//     const parsed = JSON.parse(persisted);
//     token = parsed.token?.replace(/"/g, '');
//   }

//   const tokenMissing = !(stateToken || token);
//   if (
//     tokenMissing ||
//     recipesError?.status === 401 ||
//     usersError?.status === 401
//   ) {
//     if (!tokenMissing) dispatch(logout());
//     dispatch(clearAuth());
//     localStorage.removeItem('persist:token');
//     dispatch(
//       openLogout({
//         type: 'sessionExpired',
//         props: {
//           message: 'Session has expired. Please log in again.',
//         },
//       }),
//     );
//   }
//   if (usersError?.status === 404) {
//     dispatch(clearAuth());
//     localStorage.removeItem('persist:token');
//     dispatch(
//       openLogout({
//         type: 'sessionExpired',
//         props: {
//           message: 'Session has expired. Please log in again.',
//         },
//       }),
//     );
//   }
// }, [
//   recipesError,
//   usersError,
//   stateToken,
//   navigate,
//   location.pathname,
//   dispatch,
// ]);
