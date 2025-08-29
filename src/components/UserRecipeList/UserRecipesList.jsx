import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOwn, fetchSaved } from '../../redux/userPro/thunks';
import { deleteOwn } from '../../redux/userPro/actions';
import {
  selectUserRecipes,
  selectUserProfileLoading,
  selectUserProfileError,
  selectUserProfilePage,
  selectUserProfileHasNext,
} from '../../redux/userPro/selectors';

import { setRecipeType } from '../../redux/userPro/slice';
import UserRecipeCard from '../UserRecipeCard/UserRecipeCard';
import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn';
import { ClockLoader } from 'react-spinners';
import s from './UserRecipesList.module.css';

export default function UserRecipesList({ type }) {
  const dispatch = useDispatch();

  const recipes = useSelector(selectUserRecipes);
  const loading = useSelector(selectUserProfileLoading);
  const error = useSelector(selectUserProfileError);
  const page = useSelector(selectUserProfilePage);
  const hasNext = useSelector(selectUserProfileHasNext);

  const fetcher = useMemo(
    () => (type === 'favorites' ? fetchSaved : fetchOwn),
    [type],
  );

  useEffect(() => {
    dispatch(setRecipeType(type));
    dispatch(fetcher({ page: 1, replace: true }));
  }, [dispatch, type, fetcher]);

  const loadMore = () => {
    dispatch(fetcher({ page: page + 1 }));
  };

  return (
    <div className={s.wrapper}>
      {loading ? (
        <div className={s.loaderWrap}>
          <ClockLoader color="#3d2218" size={100} />
        </div>
      ) : (
        <>
          {error && <div className={s.error}>⚠ {error}</div>}

          <div className={s.recipe_container}>
            <ul className={s.recipe_list}>
              {recipes.map((it) => (
                <li key={it.id ?? it._id}>
                  <UserRecipeCard
                    item={it}
                    mode={type}
                    onRemoved={(id) => dispatch(deleteOwn(id))}
                    recipeId={it.recipe?._id || it._id}
                  />
                </li>
              ))}
            </ul>
          </div>

          {!recipes.length && !error && (
            <div className={s.empty}>No recipes yet.</div>
          )}

          {hasNext && !error && (
            <LoadMoreBtn onClick={loadMore} loading={loading} />
          )}
        </>
      )}
    </div>
  );
}
