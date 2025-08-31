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

  const requestedRef = useRef(false);

  useEffect(() => {
    if (categories?.length) return;

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
