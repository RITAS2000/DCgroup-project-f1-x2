import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOwn, fetchSaved } from '../redux/userPro/thunks';
import { selectUserProfileLoading } from '../redux/userPro/selectors';

export const useLoadProfileRecipes = (recipeType) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectUserProfileLoading);

  useEffect(() => {
    if (recipeType === 'own') {
      dispatch(fetchOwn({ page: 1, limit: 12, replace: true }));
    }
    if (recipeType === 'favorites') {
      dispatch(fetchSaved({ page: 1, limit: 12, replace: true }));
    }
  }, [recipeType, dispatch]);
  return { isLoading: loading };
};
