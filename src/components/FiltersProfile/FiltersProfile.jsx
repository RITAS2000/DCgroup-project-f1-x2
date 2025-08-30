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

  // вкладка профиля: 'own' | 'favorites'
  const profileType = useSelector(selectUserProfileType);
  const fetcher = profileType === 'favorites' ? fetchSaved : fetchOwn;

  // локальный выбор
  const [selectedCategory, setSelectedCategory] = useState('');
  // ⚠️ храним _id ингредиента (бек ждёт id)
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // из стора берём title (если задан поиском на главной)
  const query = useSelector((s) => s.recipes.query);
  const titleFromQuery = (query?.title || '').trim();
  const panelRef = useRef(null);

  // справочник ингредиентов
  const ingredients = useSelector(selectIngredients);
  const ingredientsLoaded =
    Array.isArray(ingredients) && ingredients.length > 0;

  // индекс для быстрых сопоставлений id -> name (нужен клиентскому фильтру)
  const ingredientsIndex = useMemo(() => {
    const map = {};
    (ingredients || []).forEach((x) => {
      if (x?._id) map[String(x._id)] = String(x.name || x.title || x.ttl || '');
    });
    return map;
  }, [ingredients]);

  const getIngredientName = useCallback(
    (id) => {
      if (!id) return '';
      return ingredientsIndex[String(id)] || '';
    },
    [ingredientsIndex],
  );

  // анти-дубликатор, как в Filters.jsx
  const lastKeyRef = useRef('');

  useEffect(() => {
    // ждём загрузки справочника, если выбран ингредиент
    if (selectedIngredient && !ingredientsLoaded) return;

    // если ничего не выбрано и нет title — просто показываем текущую ленту
    if (!titleFromQuery && !selectedCategory && !selectedIngredient) return;

    const key = `${profileType}|${titleFromQuery}|${selectedCategory}|${selectedIngredient}|1`;
    if (key === lastKeyRef.current) return;

    // имя ингредиента для локальной фильтрации (бек принимает id)
    const ingredientName = getIngredientName(selectedIngredient);

    // запрос к профилю (own/saved) с фильтрами
    dispatch(
      fetcher({
        page: 1,
        limit: 12,
        replace: true,
        title: titleFromQuery,
        category: selectedCategory,
        ingredient: selectedIngredient, // id для бэка
        ingredientName, // name для локального фильтра (fallback)
        ingredientsIndex, // словарь id->name для разборов вложенных структур
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

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    <div className={css.relativeWrapper}>
      <button
        type="button"
        className={css.filtersBtn}
        onClick={() => setIsOpen((v) => !v)}
      >
        <span>Filters</span>
        <svg className={css.icon} aria-hidden="true" width="24" height="24">
          <use
            href={`${SPRITE}#${isOpen ? 'icon-close-circle' : 'icon-filter'}`}
          />
        </svg>
      </button>

      {isOpen && (
        <div className={css.panel} ref={panelRef}>
          <button className={css.resetButton} onClick={handleReset}>
            Reset filters
          </button>

          <CategorySelect
            selectedCategory={selectedCategory}
            onChange={setSelectedCategory}
          />

          <IngredientsSelect
            selectedIngredient={selectedIngredient}
            onChange={setSelectedIngredient}
          />
          {/* Кнопки Apply нет — авто-запрос по ТЗ */}
        </div>
      )}
    </div>
  );
};

export default FiltersProfile;

// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import CategorySelect from '../CategorySelect/CategorySelect.jsx';
// import IngredientsSelect from '../IngredientsSelect/IngredientsSelect.jsx';
// import { searchRecipes } from '../../redux/recipes/operations.js';
// import { selectIngredients } from '../../redux/ingredient/selectors.js';
// import css from './FiltersProfile.module.css';

// const SPRITE = '/sprite/symbol-defs.svg';

// const FiltersProfile = () => {
//   const dispatch = useDispatch();

//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [selectedIngredient, setSelectedIngredient] = useState('');
//   const [isOpen, setIsOpen] = useState(false);

//   const query = useSelector((s) => s.recipes.query);
//   const ingredients = useSelector(selectIngredients);
//   const ingredientsLoaded =
//     Array.isArray(ingredients) && ingredients.length > 0;

//   const handleApplyFilters = () => {
//     if (selectedIngredient && !ingredientsLoaded) return;

//     dispatch(
//       searchRecipes({
//         title: query?.title ?? '',
//         category: selectedCategory,
//         ingredient: selectedIngredient,
//         page: 1,
//       }),
//     );
//   };

//   const handleReset = () => {
//     setSelectedCategory('');
//     setSelectedIngredient('');
//   };

//   return (
//     <>
//       <button
//         type="button"
//         className={css.filtersBtn}
//         onClick={() => setIsOpen((v) => !v)}
//       >
//         <span>Filters</span>
//         <svg className={css.icon} aria-hidden="true" width="24" height="24">
//           <use href={`${SPRITE}#icon-filter`} />
//         </svg>
//       </button>

//       {isOpen && (
//         <div className={css.panel}>
//           <button className={css.resetButton} onClick={handleReset}>
//             Reset filters
//           </button>
//           <CategorySelect
//             selectedCategory={selectedCategory}
//             onChange={setSelectedCategory}
//           />
//           <IngredientsSelect
//             selectedIngredient={selectedIngredient}
//             onChange={setSelectedIngredient}
//           />
//           <button className={css.applyButton} onClick={handleApplyFilters}>
//             Apply filters
//           </button>
//         </div>
//       )}
//     </>
//   );
// };

// export default FiltersProfile;
