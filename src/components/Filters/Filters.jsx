import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CategorySelect from '../CategorySelect/CategorySelect.jsx';
import IngredientsSelect from '../IngredientsSelect/IngredientsSelect.jsx';
import css from './Filters.module.css';

import {
  selectDisplayTotal,
  selectHasSearch,
  selectSearchQuery,
} from '../../redux/recipes/selectors.js';
import { useRecipeSearch } from '../../hooks/useRecipeSearch.js';
// ❌ было: import { clearResults } from '../../redux/recipes/slice.js';

const SPRITE = '/sprite/symbol-defs.svg';

const Filters = ({ title, resetKey }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const query = useSelector(selectSearchQuery);
  const displayTotal = useSelector(selectDisplayTotal(title));
  const hasSearch = useSelector(selectHasSearch(title));

  const queryTitle = (title ?? query?.title ?? '').trim();

  // авто-поиск при изменении title/фильтров
  useRecipeSearch({ title, selectedCategory, selectedIngredient });

  // внешний «общий сброс» (с главной) — чистим только локальные селекты
  useEffect(() => {
    setSelectedCategory('');
    setSelectedIngredient('');
  }, [resetKey]);

  // ✅ reset сбрасывает только фильтры, а не строку поиска
  const handleReset = () => {
    setSelectedCategory('');
    setSelectedIngredient('');
    setIsOpen(false);
    // не трогаем Redux query.title и не вызываем clearResults()
    // useRecipeSearch поймёт, что фильтры стали пустыми, и отправит запрос только с title
  };

  return (
    <div className={css.filtersWrapper}>
      <div className={css.topRow}>
        <h2>{queryTitle ? `Search recipes for "${queryTitle}"` : 'Recipes'}</h2>
      </div>

      <div className={css.bottomRow}>
        <span className={css.count}>
          {displayTotal} recipe{displayTotal !== 1 ? 's' : ''}
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
          />
        </div>

        <div className={css.panelSelect}>
          <IngredientsSelect
            selectedIngredient={selectedIngredient}
            onChange={setSelectedIngredient}
          />
        </div>

        <button
          className={`${css.resetButton} ${!hasSearch ? css.resetHidden : ''}`}
          onClick={handleReset}
        >
          Reset filters
        </button>
      </div>
    </div>
  );
};

export default Filters;

// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import CategorySelect from '../CategorySelect/CategorySelect.jsx';
// import IngredientsSelect from '../IngredientsSelect/IngredientsSelect.jsx';
// import css from './Filters.module.css';

// import {
//   selectDisplayTotal,
//   selectHasSearch,
//   selectSearchQuery,
// } from '../../redux/recipes/selectors.js';
// import { useRecipeSearch } from '../../hooks/useRecipeSearch.js';
// import { clearResults } from '../../redux/recipes/slice.js';

// const SPRITE = '/sprite/symbol-defs.svg';

// const Filters = ({ title, resetKey }) => {
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [selectedIngredient, setSelectedIngredient] = useState('');
//   const [isOpen, setIsOpen] = useState(false);
//   const dispatch = useDispatch();

//   const query = useSelector(selectSearchQuery);
//   const displayTotal = useSelector(selectDisplayTotal(title));
//   const hasSearch = useSelector(selectHasSearch(title));

//   const queryTitle = (title ?? query?.title ?? '').trim();

//   useRecipeSearch({ title, selectedCategory, selectedIngredient });

//   useEffect(() => {
//     setSelectedCategory('');
//     setSelectedIngredient('');
//   }, [resetKey]);

//   const handleReset = () => {
//     dispatch(clearResults());
//     setSelectedCategory('');
//     setSelectedIngredient('');
//     setIsOpen(false);
//   };

//   return (
//     <div className={css.filtersWrapper}>
//       <div className={css.topRow}>
//         <h2>{queryTitle ? `Search recipes for "${queryTitle}"` : 'Recipes'}</h2>
//       </div>

//       <div className={css.bottomRow}>
//         <span className={css.count}>
//           {displayTotal} recipe{displayTotal !== 1 ? 's' : ''}
//         </span>

//         <button
//           type="button"
//           className={css.filtersBtn}
//           onClick={() => setIsOpen((prev) => !prev)}
//         >
//           <span>Filters</span>
//                   <svg
//                     className={`${css.icon} ${isOpen ? css.iconBlack : ''}`}
//                     aria-hidden="true"
//                     width="24"
//                     height="24"
//                   >
//                     <use
//                       href={`${SPRITE}#${isOpen ? 'icon-close-circle' : 'icon-filter'}`}
//                     />
//                   </svg>
//         </button>
//       </div>

//       {isOpen && (
//         <div className={css.panel}>
//           <CategorySelect
//             selectedCategory={selectedCategory}
//             onChange={setSelectedCategory}
//           />
//           <IngredientsSelect
//             selectedIngredient={selectedIngredient}
//             onChange={setSelectedIngredient}
//           />
//           {hasSearch && (
//             <button className={css.resetButton} onClick={handleReset}>
//               Reset filters
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Filters;
