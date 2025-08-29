import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CategorySelect from '../CategorySelect/CategorySelect.jsx';
import IngredientsSelect from '../IngredientsSelect/IngredientsSelect.jsx';
import { searchRecipes } from '../../redux/recipes/operations.js';
import { selectIngredients } from '../../redux/ingredient/selectors.js';
import css from './FiltersProfile.module.css';

const SPRITE = '/sprite/symbol-defs.svg';

const FiltersProfile = () => {
  const dispatch = useDispatch();

  // локальные значения выбора
  const [selectedCategory, setSelectedCategory] = useState('');
  // здесь храним именно _id ингредиента (бек принимает id, как вы и делаете сейчас)
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // из стора берем текущий title (если где-то уже был поиск)
  const query = useSelector((s) => s.recipes.query);
  const titleFromQuery = (query?.title || '').trim();

  // справочник ингредиентов (чтобы дождаться загрузки перед запросом)
  const ingredients = useSelector(selectIngredients);
  const ingredientsLoaded =
    Array.isArray(ingredients) && ingredients.length > 0;

  // защита от лишних одинаковых запросов (как в Filters.jsx)
  const lastKeyRef = useRef('');

  useEffect(() => {
    // если выбран ингредиент, но справочник ещё не загрузился — ждём
    if (selectedIngredient && !ingredientsLoaded) return;

    // если вообще ничего не выбрано (и нет title) — не ходим на бек
    if (!titleFromQuery && !selectedCategory && !selectedIngredient) return;

    const key = `${titleFromQuery}|${selectedCategory}|${selectedIngredient}|1`;
    if (key === lastKeyRef.current) return; // параметры не менялись

    // сразу отправляем запрос «как на главной»
    dispatch(
      searchRecipes({
        title: titleFromQuery,
        category: selectedCategory,
        ingredient: selectedIngredient,
        page: 1,
      }),
    );

    lastKeyRef.current = key;
  }, [
    dispatch,
    titleFromQuery,
    selectedCategory,
    selectedIngredient,
    ingredientsLoaded,
  ]);

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedIngredient('');
    // без отдельного запроса — useEffect сам решит, что запрос сейчас не нужен
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
          {/* Кнопку "Apply filters" убрали по ТЗ — авто-запрос в useEffect */}
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
