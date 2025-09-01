import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOwn, fetchSaved } from '../../redux/userPro/thunks';
import {
  selectUserRecipes,
  selectUserProfileLoading,
  selectUserProfileError,
  selectUserProfilePage,
  selectUserProfileHasNext,
  setRecipeType,
} from '../../redux/userPro/slice';
import UserRecipeCard from '../UserRecipeCard/UserRecipeCard';
import { ClockLoader, BarLoader } from 'react-spinners';
import s from './UserRecipesList.module.css';

export default function UserRecipesList({ type, allowInitialSpinner = true }) {
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

  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  const listRef = useRef(null);
  const endRef = useRef(null);
  const prevLen = useRef(0);

  useEffect(() => {
    dispatch(setRecipeType(type));
    dispatch(fetcher({ page: 1, replace: true }));
  }, [type, dispatch, fetcher]);

  useEffect(() => {
    if (!loading) setLoadMoreLoading(false);
  }, [loading]);

  useEffect(() => {
    const grew = recipes.length > prevLen.current;
    prevLen.current = recipes.length;

    if (!loading && page > 1 && grew && endRef.current) {
      const prefersNoMotion = window.matchMedia?.(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      endRef.current.scrollIntoView({
        behavior: prefersNoMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  }, [recipes, loading, page]);

  const loadMore = () => {
    if (!loading && hasNext) {
      setLoadMoreLoading(true);
      dispatch(fetcher({ page: page + 1 }));
    }
  };

  const showTabSpinner = allowInitialSpinner && loading && page === 1;

  return (
    <div className={s.wrapper}>
      {showTabSpinner && (
        <div className={s.listSpinner}>
          <ClockLoader color="#3d2218" size={100} />
        </div>
      )}

      <div className={s.recipe_container} aria-busy={loading}>
        <ul className={s.recipe_list} ref={listRef}>
          {recipes.map((it) => (
            <li key={it.id ?? it._id} className={s.recipe_item}>
              <UserRecipeCard item={it} mode={type} />
            </li>
          ))}
          <li aria-hidden ref={endRef} />
        </ul>
      </div>

      {!loading && !error && recipes.length === 0 && (
        <div className={s.empty}>No recipes yet.</div>
      )}

      {hasNext && !error && (
        <div className={s.loadMoreWrap}>
          {loadMoreLoading ? (
            <div className={s.loadMoreShell} aria-label="Loading more">
              <BarLoader
                color="#9b6c43"
                height={6}
                cssOverride={{ width: '60%' }}
              />
            </div>
          ) : (
            <button className={s.loadMoreBtn} onClick={loadMore}>
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
}
