import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchRecipes } from '../redux/recipes/operations.js';
import { selectSearchQuery } from '../redux/recipes/selectors.js';
import { selectIngredients } from '../redux/ingredient/selectors.js';


let inflightKey = null;
let inflightTimer = null; 

const clearInflight = (key) => {
  if (inflightTimer) {
    clearTimeout(inflightTimer);
    inflightTimer = null;
  }
  if (inflightKey === key) inflightKey = null;
};

export function useRecipeSearch({
  title,
  selectedCategory,
  selectedIngredient,
}) {
  const dispatch = useDispatch();

  const query = useSelector(selectSearchQuery);
  const ingredients = useSelector(selectIngredients);
  const ingredientsLoaded =
    Array.isArray(ingredients) && ingredients.length > 0;

  const queryTitle = (title ?? query?.title ?? '').trim();
  const bump = Number(query?.bump) || 0;

  useEffect(() => {
    if (selectedIngredient && !ingredientsLoaded) return;

    if (!queryTitle && !selectedCategory && !selectedIngredient) return;

    const stableKey = `${queryTitle}|${selectedCategory}|${selectedIngredient}|1`;

    if (inflightKey === stableKey) return;

    inflightKey = stableKey;

    const thunk = dispatch(
      searchRecipes({
        title: queryTitle,
        category: selectedCategory,
        ingredient: selectedIngredient,
        page: 1,
      }),
    );

    Promise.resolve(thunk)
      .catch(() => {})
      .finally(() => {
        inflightTimer = setTimeout(() => clearInflight(stableKey), 200);
      });

  }, [
    dispatch,
    queryTitle,
    selectedCategory,
    selectedIngredient,
    ingredientsLoaded,
    bump,
  ]);
}
