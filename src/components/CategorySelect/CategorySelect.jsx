import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../../redux/categorie/operation.js';
import {
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from '../../redux/categorie/selectors.js';
import css from './CategorySelect.module.css';

const CategorySelect = ({ selectedCategory, onChange }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoriesLoading);
  const error = useSelector(selectCategoriesError);

  // ❗️флажок, чтобы не дергать fetch дважды в StrictMode
  const requestedRef = useRef(false);

  useEffect(() => {
    // если уже есть данные — не запрашиваем
    if (categories?.length) return;

    // защита от двойного вызова эффекта в StrictMode
    if (requestedRef.current) return;

    requestedRef.current = true;
    dispatch(fetchCategories());
  }, [dispatch, categories?.length]);

  return (
    <div className={css.categorySelectWrapper}>
      {loading && <span className={css.hint}>Loading…</span>}
      {error && <span className={css.hint}>Error: {String(error)}</span>}
      {!error && (
        <select
          id="filter-category"
          aria-label="Category"
          value={selectedCategory || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
          className={css.select}
        >
          <option value="">Category</option>
          {(categories || []).map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default CategorySelect;

// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchCategories } from '../../redux/categorie/operation.js';
// import {
//   selectCategories,
//   selectCategoriesLoading,
//   selectCategoriesError,
// } from '../../redux/categorie/selectors.js';
// import css from './CategorySelect.module.css';

// const CategorySelect = ({ selectedCategory, onChange }) => {
//   const dispatch = useDispatch();
//   const categories = useSelector(selectCategories);
//   const loading = useSelector(selectCategoriesLoading);
//   const error = useSelector(selectCategoriesError);

//   useEffect(() => {
//     dispatch(fetchCategories());
//   }, [dispatch]);

//   return (
//     <div className={css.categorySelectWrapper}>
//       {loading && <span className={css.hint}>Loading…</span>}
//       {error && <span className={css.hint}>Error: {String(error)}</span>}
//       {!loading && !error && (
//         <select
//           id="filter-category"
//           aria-label="Category"
//           value={selectedCategory || ''}
//           onChange={(e) => onChange(e.target.value)}
//           className={css.select}
//         >
//           <option value="">Category</option>
//           {categories.map((cat) => (
//             <option key={cat._id} value={cat.name}>
//               {cat.name}
//             </option>
//           ))}
//         </select>
//       )}
//     </div>
//   );
// };

// export default CategorySelect;
