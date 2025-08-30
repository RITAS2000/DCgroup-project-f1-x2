import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CategorySelect from '../CategorySelect/CategorySelect.jsx';
import IngredientsSelect from '../IngredientsSelect/IngredientsSelect.jsx';
import css from './Filters.module.css';

import {
  selectDisplayTotal,
  selectHasSearch,
  selectSearchQuery,
} from '../../redux/recipes/selectors.js';
import { useRecipeSearch } from '../../hooks/useRecipeSearch.js';
import { clearResults } from '../../redux/recipes/slice.js';

const SPRITE = '/sprite/symbol-defs.svg';

const Filters = ({ title, resetKey }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const query = useSelector(selectSearchQuery);
  const displayTotal = useSelector(selectDisplayTotal(title));
  const hasSearch = useSelector(selectHasSearch(title));

  const queryTitle = (title ?? query?.title ?? '').trim();

  useRecipeSearch({ title, selectedCategory, selectedIngredient });

  useEffect(() => {
    setSelectedCategory('');
    setSelectedIngredient('');
  }, [resetKey]);

  const handleReset = () => {
    dispatch(clearResults());
    setSelectedCategory('');
    setSelectedIngredient('');
    setIsOpen(false);
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

      {isOpen && (
        <div className={css.panel}>
          <CategorySelect
            selectedCategory={selectedCategory}
            onChange={setSelectedCategory}
          />
          <IngredientsSelect
            selectedIngredient={selectedIngredient}
            onChange={setSelectedIngredient}
          />
          {hasSearch && (
            <button className={css.resetButton} onClick={handleReset}>
              Reset filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Filters;
