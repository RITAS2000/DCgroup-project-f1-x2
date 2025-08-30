import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchRecipes } from '../redux/recipes/operations.js';
import { selectSearchQuery } from '../redux/recipes/selectors.js';
import { selectIngredients } from '../redux/ingredient/selectors.js';

export function useRecipeSearch({ title, selectedCategory, selectedIngredient }) {
  const dispatch = useDispatch();

  const query = useSelector(selectSearchQuery);
  const ingredients = useSelector(selectIngredients);
  const ingredientsLoaded = Array.isArray(ingredients) && ingredients.length > 0;

  const queryTitle = (title ?? query?.title ?? '').trim();
  const bump = Number(query?.bump) || 0;

  const lastKeyRef = useRef('');

  useEffect(() => {
    if (selectedIngredient && !ingredientsLoaded) return;

    if (!queryTitle && !selectedCategory && !selectedIngredient) return;

    const requestKey = `${queryTitle}|${selectedCategory}|${selectedIngredient}|1|${bump}`;
    if (requestKey === lastKeyRef.current) return;

    dispatch(
      searchRecipes({
        title: queryTitle,
        category: selectedCategory,
        ingredient: selectedIngredient,
        page: 1,
      }),
    );

    lastKeyRef.current = requestKey;
  }, [dispatch, queryTitle, selectedCategory, selectedIngredient, ingredientsLoaded, bump]);
}
