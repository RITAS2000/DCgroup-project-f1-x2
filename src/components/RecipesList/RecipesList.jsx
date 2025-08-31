import { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn.jsx';
import RecipeCard from '../RecipeCard/RecipeCard.jsx';
import css from './RecipesList.module.css';
import NoResultSearch from '../NoResultSearch/NoResultSearch.jsx';

import { setFeedTotal } from '../../redux/recipes/slice.js';

import { setSavedRecipes } from '../../redux/recipes/slice.js';
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
import { BarLoader } from 'react-spinners';

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

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await getSavedRecipes();
        dispatch(setSavedRecipes(res.items));
      } catch (err) {
        console.error('Помилка при завантаженні збережених рецептів:', err);
      }
    };
    fetchSaved();
  }, [dispatch]);

  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const lastCardRef = useRef(null);
  const scrollAfterLoad = useRef(false);

  const endSearchRef = useRef(null);
  const pendingScroll = useRef(false);

  const fetchRecipes = useCallback(
    async (pageNum, isLoadMore = false) => {
      try {
        if (isLoadMore) setLoadingMore(true);
        setLoadingFeed(true);
        const response = await axios.get('/api/recipes', {
          params: { page: pageNum, perPage: 12 },
        });
        const data = response.data?.data || {};
        const recipesArray = data.data || [];

        if (typeof data.totalItems !== 'undefined') {
          dispatch(setFeedTotal(data.totalItems));
        } else {
          dispatch(
            setFeedTotal(Array.isArray(recipesArray) ? recipesArray.length : 0),
          );
        }

        setRecipes((prev) => {
          const add = recipesArray.filter(
            (r) => !prev.some((p) => p._id === r._id),
          );
          return [...prev, ...add];
        });

        setHasNextPage(Boolean(data.hasNextPage));
      } catch (error) {
        console.error('Помилка при завантаженні рецептів:', error);
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
    scrollAfterLoad.current = true;
    fetchRecipes(page + 1, true);
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (scrollAfterLoad.current && lastCardRef.current) {
      lastCardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      scrollAfterLoad.current = false;
    }
  }, [recipes]);

  useEffect(() => {
    if (searchMode && pendingScroll.current && endSearchRef.current) {
      endSearchRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      pendingScroll.current = false;
    }
  }, [searched.length, searchMode]);

  if (searchMode) {
    if (searching) return <div className={css.recipe_container}>Loading…</div>;
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
        <ul className={css.recipe_list}>
          {searched.map(({ _id, thumb, title, time, description, calory }) => (
            <li className={css.recipe_item} key={_id}>
              <RecipeCard
                id={_id}
                thumb={thumb}
                title={title}
                time={time}
                description={description}
                calories={calory}
              />
            </li>
          ))}
        </ul>

        {/* якорь для плавного скролла после догрузки */}
        <div ref={endSearchRef} />
        {loadingMore && (
          <div>
            <BarLoader color="#9b6c43" />
          </div>
        )}
        {canLoadMore && !searching && (
          <LoadMoreBtn
            onClick={() => {
              pendingScroll.current = true;
              dispatch(searchRecipes({ ...query, page: searchPage + 1 }));
            }}
          />
        )}
      </div>
    );
  }

  // ===== ОБЫЧНАЯ ЛЕНТА =====
  return (
    <div className={css.recipe_container}>
      <ul className={css.recipe_list}>
        {recipes.map(
          ({ _id, thumb, title, time, description, calory }, index) => {
            const isLastNew = index === recipes.length - 1;
            return (
              <li
                className={css.recipe_item}
                key={_id}
                ref={isLastNew ? lastCardRef : null}
              >
                <RecipeCard
                  id={_id}
                  thumb={thumb}
                  title={title}
                  time={time}
                  description={description}
                  calories={calory}
                />
              </li>
            );
          },
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
    </div>
  );
}
