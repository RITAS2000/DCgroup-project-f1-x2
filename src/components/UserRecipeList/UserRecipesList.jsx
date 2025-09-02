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
  const prevLen = useRef(0);

  const firstNewIndexRef = useRef(null);
  const shouldAdjustScrollRef = useRef(false);

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

    if (!loading && page > 1 && grew && shouldAdjustScrollRef.current) {
      shouldAdjustScrollRef.current = false;

      const idx = firstNewIndexRef.current ?? 0;
      const firstNewEl = listRef.current?.querySelector(`[data-idx="${idx}"]`);

      if (firstNewEl) {
        const prefersNoMotion = window.matchMedia?.(
          '(prefers-reduced-motion: reduce)',
        ).matches;

        const firstNewTop =
          firstNewEl.getBoundingClientRect().top + window.scrollY;
        const offset = Math.round(window.innerHeight * 0.5);
        const targetY = Math.max(0, firstNewTop - offset);

        window.scrollTo({
          top: targetY,
          behavior: prefersNoMotion ? 'auto' : 'smooth',
        });
      }
    }
  }, [recipes, loading, page]);

  const loadMore = () => {
    if (!loading && hasNext) {
      setLoadMoreLoading(true);
      firstNewIndexRef.current = recipes.length;
      shouldAdjustScrollRef.current = true;
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
          {recipes.map((it, i) => (
            <li key={it.id ?? it._id} className={s.recipe_item} data-idx={i}>
              <UserRecipeCard item={it} mode={type} />
            </li>
          ))}
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
