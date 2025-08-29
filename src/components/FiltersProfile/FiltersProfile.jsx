import { useEffect, useMemo, useRef, useState } from 'react';
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

  // какая вкладка профиля активна: 'own' | 'favorites'
  const profileType = useSelector(selectUserProfileType);
  const fetcher = profileType === 'favorites' ? fetchSaved : fetchOwn;

  // локальные значения селектов
  const [selectedCategory, setSelectedCategory] = useState('');
  // тут у нас _id ингредиента из селекта
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // заголовок из глобального поиска (если задан)
  const query = useSelector((s) => s.recipes.query);
  const titleFromQuery = (query?.title || '').trim();

  // справочник ингредиентов
  const ingredients = useSelector(selectIngredients);
  const ingredientsLoaded =
    Array.isArray(ingredients) && ingredients.length > 0;

  // 🔁 маппим _id -> name (для профиля бек ожидает ИМЯ ингредиента)
  const ingredientName = useMemo(() => {
    if (!selectedIngredient) return '';
    const found = (ingredients || []).find(
      (i) => String(i?._id) === String(selectedIngredient),
    );
    return found?.name || '';
  }, [selectedIngredient, ingredients]);

  // защита от повторных идентичных запросов
  const lastKeyRef = useRef('');

  useEffect(() => {
    // если выбран ингредиент, но справочник еще не подгрузился — ждем
    if (selectedIngredient && !ingredientsLoaded) return;

    // если нет вообще никаких критериев — ничего не делаем
    // (первичную ленту грузит useLoadProfileRecipes)
    if (!titleFromQuery && !selectedCategory && !ingredientName) return;

    const key = `${profileType}|${titleFromQuery}|${selectedCategory}|${ingredientName}|1`;
    if (key === lastKeyRef.current) return;

    // ⚠️ отправляем в бек ИМЯ ингредиента, а не _id
    dispatch(
      fetcher({
        page: 1,
        limit: 12,
        replace: true,
        title: titleFromQuery,
        category: selectedCategory,
        ingredient: ingredientName, // <-- имя
      }),
    );

    lastKeyRef.current = key;
  }, [
    dispatch,
    fetcher,
    profileType,
    titleFromQuery,
    selectedCategory,
    ingredientName,
    selectedIngredient,
    ingredientsLoaded,
  ]);

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedIngredient('');
    // перезагружаем ленту без фильтров (но с возможным title)
    dispatch(
      fetcher({
        page: 1,
        limit: 12,
        replace: true,
        title: titleFromQuery,
        category: '',
        ingredient: '',
      }),
    );
    lastKeyRef.current = ''; // сбрасываем ключ, чтобы следующий выбор отработал
  };

  return (
    <>
      <button
        type="button"
        className={css.filtersBtn}
        onClick={() => setIsOpen((v) => !v)}
      >
        <span>Filters</span>
        <svg className={css.icon} aria-hidden="true" width="24" height="24">
          <use href={`${SPRITE}#icon-filter`} />
        </svg>
      </button>

      {isOpen && (
        <div className={css.panel}>
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
          {/* По ТЗ — без кнопки Apply (авто-запрос в useEffect) */}
        </div>
      )}
    </>
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
