import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getOwnRecipes,
  getSavedRecipes,
  deleteFavorite,
  deleteRecipe,
} from '../../api/recipes';
import { getErrorMessage } from '../../utils/errors';

// универсальная локальная проверка
function normalizeString(v) {
  return String(v || '')
    .trim()
    .toLowerCase();
}

function pickRecipeObject(item) {
  // в избранном рецепт может лежать в item.recipe
  return item?.recipe ?? item ?? {};
}

function matchLocally(item, { title, category, ingredientName }) {
  const r = pickRecipeObject(item);

  const titleOk = !title
    ? true
    : normalizeString(r.title || r.name).includes(normalizeString(title));

  const categoryOk = !category
    ? true
    : normalizeString(r.category || r.categoryName) ===
      normalizeString(category);

  let ingredientOk = true;
  if (ingredientName) {
    const ings = r.ingredients || r.ingredientsList || r.components || [];
    // элементы могут быть строками или объектами с полем name
    ingredientOk = ings.some((it) => {
      const name = typeof it === 'string' ? it : it?.name;
      return normalizeString(name) === normalizeString(ingredientName);
    });
  }

  return titleOk && categoryOk && ingredientOk;
}

export const fetchOwn = createAsyncThunk(
  'profile/fetchOwn',
  async (
    {
      page = 1,
      limit = 12,
      replace = false,
      title = '',
      category = '',
      ingredient = '',
      ingredientName = '',
    } = {},
    { rejectWithValue, signal },
  ) => {
    try {
      // запрос на бэк со всеми переданными фильтрами (как требует ТЗ)
      const { items, totalPages, totalItems } = await getOwnRecipes({
        page,
        limit,
        title,
        category,
        ingredient, // id
        signal,
      });

      // Fallback: если бэк не отфильтровал, делаем локально
      const filtered = (items || []).filter((it) =>
        matchLocally(it, { title, category, ingredientName }),
      );

      return {
        items: filtered,
        page,
        totalPages: Math.max(1, Math.ceil(filtered.length / (limit || 12))),
        totalItems: filtered.length,
        replace,
      };
    } catch (e) {
      return rejectWithValue(getErrorMessage(e));
    }
  },
);

export const fetchSaved = createAsyncThunk(
  'profile/fetchSaved',
  async (
    {
      page = 1,
      limit = 12,
      replace = false,
      title = '',
      category = '',
      ingredient = '',
      ingredientName = '',
    } = {},
    { rejectWithValue, signal },
  ) => {
    try {
      // запрос на бэк со всеми переданными фильтрами (как требует ТЗ)
      const { items, totalPages, totalItems } = await getSavedRecipes({
        page,
        limit,
        title,
        category,
        ingredient, // id
        signal,
      });

      // Fallback: локальная фильтрация
      const filtered = (items || []).filter((it) =>
        matchLocally(it, { title, category, ingredientName }),
      );

      return {
        items: filtered,
        page,
        totalPages: Math.max(1, Math.ceil(filtered.length / (limit || 12))),
        totalItems: filtered.length,
        replace,
      };
    } catch (e) {
      return rejectWithValue(getErrorMessage(e));
    }
  },
);

export const removeSaved = createAsyncThunk(
  'profile/removeSaved',
  async (recipeId, { rejectWithValue, signal }) => {
    try {
      await deleteFavorite(recipeId, signal);
      return recipeId;
    } catch (e) {
      return rejectWithValue(getErrorMessage(e));
    }
  },
);

export const deleteOwn = createAsyncThunk(
  'profile/deleteOwn',
  async (recipeId, { rejectWithValue, signal }) => {
    try {
      await deleteRecipe(recipeId, signal);
      return recipeId;
    } catch (e) {
      return rejectWithValue(getErrorMessage(e));
    }
  },
);
