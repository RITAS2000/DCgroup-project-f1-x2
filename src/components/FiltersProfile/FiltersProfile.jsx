import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CategorySelect from '../CategorySelect/CategorySelect.jsx';
import IngredientsSelect from '../IngredientsSelect/IngredientsSelect.jsx';
import { searchRecipes } from '../../redux/recipes/operations.js';
import { selectIngredients } from '../../redux/ingredient/selectors.js';
import css from './FiltersProfile.module.css';

const SPRITE = '/sprite/symbol-defs.svg';

const FiltersProfile = () => {
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const query = useSelector((s) => s.recipes.query);
  const ingredients = useSelector(selectIngredients);
  const ingredientsLoaded =
    Array.isArray(ingredients) && ingredients.length > 0;

  const handleApplyFilters = () => {
    if (selectedIngredient && !ingredientsLoaded) return;

    dispatch(
      searchRecipes({
        title: query?.title ?? '',
        category: selectedCategory,
        ingredient: selectedIngredient,
        page: 1,
      }),
    );
  };

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedIngredient('');
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
          <button className={css.applyButton} onClick={handleApplyFilters}>
            Apply filters
          </button>
        </div>
      )}
    </>
  );
};

export default FiltersProfile;
