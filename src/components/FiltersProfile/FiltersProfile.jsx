import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CategorySelect from '../CategorySelect/CategorySelect.jsx';
import IngredientsSelect from '../IngredientsSelect/IngredientsSelect.jsx';
import css from './FiltersProfile.module.css';

import {
  selectUserProfileTotalItems,
  selectUserProfileLoading,
} from '../../redux/userPro/slice';
import { fetchOwn, fetchSaved } from '../../redux/userPro/thunks';
import { selectHasSearch } from '../../redux/recipes/selectors';

import { selectIngredients } from '../../redux/ingredient/selectors';

const SPRITE = '/sprite/symbol-defs.svg';

const FiltersProfile = ({ title, resetKey }) => {
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const isLoading = useSelector(selectUserProfileLoading);
  const hasSearch = useSelector(selectHasSearch(title));
  const totalItems = useSelector(selectUserProfileTotalItems);

  const ingredients = useSelector(selectIngredients);

  const ingredientsIndex = useMemo(() => {
    const src = Array.isArray(ingredients) ? ingredients : [];
    const map = {};
    for (const it of src) {
      const id = String(it?._id ?? it?.id ?? '');
      const name = String(it?.name ?? it?.title ?? it?.ttl ?? '').trim();
      if (id) map[id] = name;
    }
    return map;
  }, [ingredients]);

  const ingredientName = useMemo(() => {
    if (!selectedIngredient) return '';
    return ingredientsIndex[String(selectedIngredient)] || '';
  }, [selectedIngredient, ingredientsIndex]);

  const getFetcher = useMemo(
    () => (title === 'favorites' ? fetchSaved : fetchOwn),
    [title],
  );

  const buildParams = useCallback(
    (extra = {}) => {
      const params = { page: 1, replace: true, ...extra };

      if (selectedCategory) params.category = selectedCategory;

      if (selectedIngredient) {
        params.ingredient = selectedIngredient;
        params.ingredientName = ingredientName;
        params.ingredientsIndex = ingredientsIndex;
      }

      return params;
    },
    [selectedCategory, selectedIngredient, ingredientName, ingredientsIndex],
  );

  useEffect(() => {
    dispatch(getFetcher(buildParams()));
  }, [buildParams, getFetcher, dispatch]);

  useEffect(() => {
    setSelectedCategory('');
    setSelectedIngredient('');
  }, [resetKey]);

  useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth >= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedIngredient('');
    dispatch(getFetcher({ page: 1, replace: true }));
    if (window.innerWidth < 768) setIsOpen(false);
  };

  return (
    <div className={css.filtersWrapper}>
      <div className={css.bottomRow}>
        <span className={css.count}>
          {isLoading
            ? '...'
            : `${totalItems} recipe${totalItems !== 1 ? 's' : ''}`}
        </span>

        <button
          type="button"
          className={css.filtersBtn}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="filters-panel"
        >
          <span>Filters</span>
          <svg
            className={`${css.icon} ${isOpen ? css.iconBlack : ''}`}
            aria-hidden="true"
            width="24"
            height="24"
          >
            <use
              href={`${SPRITE}#${isOpen ? 'icon-close-circle' : 'icon-filter'}`}
            />
          </svg>
        </button>
      </div>

      <div
        id="filters-panel"
        className={`${css.panel} ${!isOpen ? css.panelHidden : ''}`}
      >
        <div className={css.panelSelect}>
          <CategorySelect
            selectedCategory={selectedCategory}
            onChange={setSelectedCategory}
            isLoading={isLoading}
          />
        </div>

        <div className={css.panelSelect}>
          <IngredientsSelect
            selectedIngredient={selectedIngredient}
            onChange={setSelectedIngredient}
            isLoading={isLoading}
          />
        </div>

        <button
          type="button"
          className={`${css.resetButton} ${!hasSearch ? css.resetHidden : ''}`}
          onClick={handleReset}
        >
          Reset filters
        </button>
      </div>
    </div>
  );
};

export default FiltersProfile;
