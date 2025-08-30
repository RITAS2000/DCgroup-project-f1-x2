import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CategorySelect from '../CategorySelect/CategorySelect.jsx';
import IngredientsSelect from '../IngredientsSelect/IngredientsSelect.jsx';
import { selectIngredients } from '../../redux/ingredient/selectors.js';
import { fetchOwn, fetchSaved } from '../../redux/userPro/thunks.js';
import { selectUserProfileType } from '../../redux/userPro/selectors.js';
import css from './FiltersProfile.module.css';

const SPRITE = '/sprite/symbol-defs.svg';

const FiltersProfile = () => {
  const dispatch = useDispatch();

  const wrapperRef = useRef(null);
  const btnRef = useRef(null);

  const profileType = useSelector(selectUserProfileType);
  const fetcher = profileType === 'favorites' ? fetchSaved : fetchOwn;

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const query = useSelector((s) => s.recipes.query);
  const titleFromQuery = (query?.title || '').trim();

  const ingredients = useSelector(selectIngredients);
  const ingredientsLoaded =
    Array.isArray(ingredients) && ingredients.length > 0;

  const ingredientsIndex = useMemo(() => {
    const map = {};
    (ingredients || []).forEach((x) => {
      if (x?._id) map[String(x._id)] = String(x.name || x.title || x.ttl || '');
    });
    return map;
  }, [ingredients]);

  const getIngredientName = useCallback(
    (id) => (id ? ingredientsIndex[String(id)] || '' : ''),
    [ingredientsIndex],
  );

  const lastKeyRef = useRef('');

  useEffect(() => {
    if (selectedIngredient && !ingredientsLoaded) return;
    if (!titleFromQuery && !selectedCategory && !selectedIngredient) return;

    const key = `${profileType}|${titleFromQuery}|${selectedCategory}|${selectedIngredient}|1`;
    if (key === lastKeyRef.current) return;

    const ingredientName = getIngredientName(selectedIngredient);

    dispatch(
      fetcher({
        page: 1,
        limit: 12,
        replace: true,
        title: titleFromQuery,
        category: selectedCategory,
        ingredient: selectedIngredient,
        ingredientName,
        ingredientsIndex,
      }),
    );

    lastKeyRef.current = key;
  }, [
    dispatch,
    fetcher,
    profileType,
    titleFromQuery,
    selectedCategory,
    selectedIngredient,
    ingredientsLoaded,
    ingredientsIndex,
    getIngredientName,
  ]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (!next) btnRef.current?.blur();
      return next;
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e) => {
      if (wrapperRef.current?.contains(e.target)) return;
      setIsOpen(false);
      btnRef.current?.blur();
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [isOpen]);

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedIngredient('');
    dispatch(
      fetcher({
        page: 1,
        limit: 12,
        replace: true,
        title: titleFromQuery,
        category: '',
        ingredient: '',
        ingredientName: '',
        ingredientsIndex,
      }),
    );
  };

  return (
    <div className={css.relativeWrapper} ref={wrapperRef}>
      <button
        ref={btnRef}
        type="button"
        className={`${css.filtersBtn} ${isOpen ? css.isOpen : ''}`}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={toggle}
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

      <div
        id="filters-panel"
        className={`${css.panel} ${!isOpen ? css.panelHidden : ''}`}
      >
        {/* Category */}
        <div
          className={`${css.selectWrap} ${css.rowCat}`}
          data-has-value={Boolean(selectedCategory)}
        >
          <CategorySelect
            selectedCategory={selectedCategory}
            onChange={setSelectedCategory}
          />
          <svg
            className={css.chevron}
            aria-hidden="true"
            width="20"
            height="20"
          >
            <use href={`${SPRITE}#icon-chevron-down`} />
          </svg>
        </div>

        {/* Ingredient */}
        <div
          className={`${css.selectWrap} ${css.rowIngr}`}
          data-has-value={Boolean(selectedIngredient)}
        >
          <IngredientsSelect
            selectedIngredient={selectedIngredient}
            onChange={setSelectedIngredient}
          />
          <svg
            className={css.chevron}
            aria-hidden="true"
            width="20"
            height="20"
          >
            <use href={`${SPRITE}#icon-chevron-down`} />
          </svg>
        </div>

        <button
          className={`${css.resetButton} ${css.rowReset}`}
          onClick={handleReset}
        >
          Reset filters
        </button>
      </div>
    </div>
  );
};

export default FiltersProfile;
