import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CategorySelect from '../CategorySelect/CategorySelect.jsx';
import IngredientsSelect from '../IngredientsSelect/IngredientsSelect.jsx';
import { searchRecipes } from '../../redux/recipes/operations.js';
import { selectIngredients } from '../../redux/ingredient/selectors.js';
import css from './Filters.module.css';

const SPRITE = '/sprite/symbol-defs.svg';

const Filters = ({ title }) => {
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState('');
  // храним именно _id ингредиента
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const query = useSelector((s) => s.recipes.query);
  const totalItems = useSelector((s) => s.recipes.totalItems);
  const itemsLen = useSelector((s) => s.recipes.items?.length) || 0;
  const totalFromSearch = totalItems || itemsLen;

  // общее число рецептов ленты (показываем до начала поиска)
  const feedTotal = useSelector((s) => s.recipes.feedTotal) || 0;

  const ingredients = useSelector(selectIngredients);
  const ingredientsLoaded =
    Array.isArray(ingredients) && ingredients.length > 0;

  const queryTitle = (title ?? query?.title ?? '').trim();

  // НОВОЕ: bump из SearchBox — «штамп» клика по кнопке
  const bump = Number(query?.bump) || 0;

  // есть ли активный поиск
  const hasSearch =
    Boolean(queryTitle) ||
    Boolean(selectedCategory) ||
    Boolean(selectedIngredient);

  // число для отображения
  const displayTotal = hasSearch ? totalFromSearch : feedTotal;

  // не допускаем повторного одинакового запроса, но учитываем bump
  const lastKeyRef = useRef('');

  useEffect(() => {
    // ждём подгрузки справочника, если выбран ингредиент
    if (selectedIngredient && !ingredientsLoaded) return;

    // нет ни текста, ни фильтров — не ищем
    if (!queryTitle && !selectedCategory && !selectedIngredient) return;

    // включили bump в ключ: новый клик по Search даст новый запрос
    const key = `${queryTitle}|${selectedCategory}|${selectedIngredient}|1|${bump}`;
    if (key === lastKeyRef.current) return; // параметры не изменились

    dispatch(
      searchRecipes({
        title: queryTitle,
        category: selectedCategory,
        // бек принимает _id ингредиента
        ingredient: selectedIngredient,
        page: 1,
      }),
    );
    lastKeyRef.current = key;
  }, [
    dispatch,
    queryTitle,
    selectedCategory,
    selectedIngredient,
    ingredientsLoaded,
    bump, // важно!
  ]);

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedIngredient('');
  };

  const headingTitle = queryTitle;

  return (
    <div className={css.filtersWrapper}>
      <div className={css.topRow}>
        <h2>
          {headingTitle ? `Search recipes for "${headingTitle}"` : 'Recipes'}
        </h2>
      </div>

      <div className={css.bottomRow}>
        <span className={css.count}>
          {displayTotal} recipe{displayTotal !== 1 ? 's' : ''}
        </span>

        <button
          type="button"
          className={css.filtersBtn}
          onClick={() => setIsOpen((v) => !v)}
        >
          <span>Filters</span>
          <svg className={css.icon} aria-hidden="true">
            <use href={`${SPRITE}#icon-filter`} />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className={css.panel}>
          <button className={css.resetButton} onClick={handleReset}>
            Reset filters
          </button>

          <CategorySelect
            selectedCategory={selectedCategory}
            onChange={setSelectedCategory}
          />

          {/* сюда и уходит/хранится _id */}
          <IngredientsSelect
            selectedIngredient={selectedIngredient}
            onChange={setSelectedIngredient}
          />
        </div>
      )}
    </div>
  );
};

export default Filters;
