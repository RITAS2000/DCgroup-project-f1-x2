import { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn.jsx';
import RecipeCard from '../RecipeCard/RecipeCard.jsx';
import css from './RecipesList.module.css';
import NoResultSearch from '../NoResultSearch/NoResultSearch.jsx';

import { setFeedTotal, setSavedRecipes } from '../../redux/recipes/slice.js';
import { getSavedRecipes } from '../../api/recipes.js';

import {
  selectRecipes,
  selectRecipesLoading,
  selectRecipesError,
  selectSearchMode,
  selectRecipesPage,
  selectRecipesTotalPages,
  selectSearchQuery,
} from '../../redux/recipes/selectors';
import { searchRecipes } from '../../redux/recipes/operations';
import { BarLoader, ClockLoader } from 'react-spinners';

axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || 'https://dcgroup-react-node-b.onrender.com/';

export default function RecipesList({ onResetAll }) {
  const dispatch = useDispatch();

  const searched = useSelector(selectRecipes);
  const searchMode = useSelector(selectSearchMode);
  const searching = useSelector(selectRecipesLoading);
  const searchError = useSelector(selectRecipesError);
  const searchPage = useSelector(selectRecipesPage);
  const totalPages = useSelector(selectRecipesTotalPages);
  const query = useSelector(selectSearchQuery);
  // const loading = useSelector(selectRecipesLoading);

  useEffect(() => {
    (async () => {
      try {
        const res = await getSavedRecipes();
        dispatch(setSavedRecipes(res.items));
      } catch {
        dispatch(setSavedRecipes([]));
      }
    })();
  }, [dispatch]);

  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const listRef = useRef(null);
  const firstNewIdxFeedRef = useRef(null);
  const firstNewIdxSearchRef = useRef(null);
  const shouldAdjustFeedRef = useRef(false);
  const shouldAdjustSearchRef = useRef(false);

  const prefersNoMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const scrollToFirstNew = useCallback(
    (idx) => {
      if (!listRef.current) return;
      const el = listRef.current.querySelector(`[data-idx="${idx}"]`);
      if (!el) return;
      const top =
        el.getBoundingClientRect().top +
        window.scrollY -
        window.innerHeight * 0.01;
      window.scrollTo({
        top: Math.max(0, Math.round(top)),
        behavior: prefersNoMotion ? 'auto' : 'smooth',
      });
    },
    [prefersNoMotion],
  );

  const fetchRecipes = useCallback(
    async (pageNum, isLoadMore = false) => {
      try {
        if (isLoadMore) setLoadingMore(true);
        setLoadingFeed(true);

        const { data: resp } = await axios.get('/api/recipes', {
          params: { page: pageNum, perPage: 12 },
        });

        const payload = resp?.data || {};
        const items = payload.data || [];

        if (typeof payload.totalItems !== 'undefined') {
          dispatch(setFeedTotal(payload.totalItems));
        } else {
          dispatch(setFeedTotal(Array.isArray(items) ? items.length : 0));
        }

        setRecipes((prev) => {
          const add = items.filter((r) => !prev.some((p) => p._id === r._id));
          return prev.concat(add);
        });
        setHasNextPage(Boolean(payload.hasNextPage));
      } finally {
        setLoadingFeed(false);
        setLoadingMore(false);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (!searchMode) fetchRecipes(page, false);
  }, [page, searchMode, fetchRecipes]);

  const handleLoadMoreFeed = () => {
    firstNewIdxFeedRef.current = recipes.length;
    shouldAdjustFeedRef.current = true;

    fetchRecipes(page + 1, true);
    setPage((p) => p + 1);
  };

  useEffect(() => {
    if (shouldAdjustFeedRef.current) {
      shouldAdjustFeedRef.current = false;
      scrollToFirstNew(firstNewIdxFeedRef.current ?? 0);
    }
  }, [recipes, scrollToFirstNew]);

  const handleLoadMoreSearch = () => {
    firstNewIdxSearchRef.current = searched.length;
    shouldAdjustSearchRef.current = true;
    dispatch(searchRecipes({ ...query, page: searchPage + 1 }));
  };

  useEffect(() => {
    if (searchMode && shouldAdjustSearchRef.current) {
      shouldAdjustSearchRef.current = false;
      scrollToFirstNew(firstNewIdxSearchRef.current ?? 0);
    }
  }, [searched, searchMode, scrollToFirstNew]);

  if (searchMode) {
    if (searching)
      return (
        <div className={css.recipe_container}>
          <div className={css.listSpinner}>
            <ClockLoader color="#3d2218" size={100} />
          </div>
        </div>
      );
    if (searchError) {
      return (
        <div className={css.recipe_container} style={{ color: 'crimson' }}>
          {String(searchError)}
        </div>
      );
    }
    if (!searched.length) {
      return (
        <NoResultSearch
          query={query.title || ''}
          totalResults={0}
          onReset={onResetAll}
        />
      );
    }

    const canLoadMore = searchPage < totalPages;

    return (
      <div className={css.recipe_container}>
        <ul className={css.recipe_list} ref={listRef}>
          {searched.map(
            ({ _id, thumb, title, time, description, calory }, i) => (
              <li className={css.recipe_item} key={_id} data-idx={i}>
                <RecipeCard
                  id={_id}
                  thumb={thumb}
                  title={title}
                  time={time}
                  description={description}
                  calories={calory}
                />
              </li>
            ),
          )}
        </ul>

        {loadingMore && (
          <div>
            <BarLoader color="#9b6c43" />
          </div>
        )}
        {canLoadMore && !searching && (
          <LoadMoreBtn onClick={handleLoadMoreSearch} />
        )}
      </div>
    );
  }

  return (
    <div className={css.recipe_container}>
      {loadingFeed && (
        <div className={css.listSpinner}>
          <ClockLoader color="#3d2218" size={100} />
        </div>
      )}
      <>
        <ul className={css.recipe_list} ref={listRef}>
          {recipes.map(
            ({ _id, thumb, title, time, description, calory }, i) => (
              <li className={css.recipe_item} key={_id} data-idx={i}>
                <RecipeCard
                  id={_id}
                  thumb={thumb}
                  title={title}
                  time={time}
                  description={description}
                  calories={calory}
                />
              </li>
            ),
          )}
        </ul>

        {loadingMore && (
          <div>
            <BarLoader color="#9b6c43" />
          </div>
        )}

        {recipes.length > 0 && !loadingFeed && hasNextPage && (
          <LoadMoreBtn onClick={handleLoadMoreFeed} />
        )}
      </>
    </div>
  );
}
