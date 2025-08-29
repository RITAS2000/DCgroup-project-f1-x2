import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchOwn, fetchSaved } from '../redux/userPro/thunks';

export const useLoadProfileRecipes = (recipeType) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (recipeType === 'own') {
      dispatch(fetchOwn({ page: 1, limit: 12, replace: true }));
    }
    if (recipeType === 'favorites') {
      dispatch(fetchSaved({ page: 1, limit: 12, replace: true }));
    }
  }, [recipeType, dispatch]);
};
