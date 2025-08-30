import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getOwnRecipes,
  getSavedRecipes,
  deleteFavorite,
  deleteRecipe,
} from '../../api/recipes';
import { getErrorMessage } from '../../utils/errors';

// ===== helpers =====
const norm = (v) =>
  String(v ?? '')
    .trim()
    .toLowerCase();

const pickRecipe = (item) => item?.recipe ?? item ?? {};

// Собираем ВСЕ возможные имена ингредиентов из рецепта
function extractIngredientNames(recipeObj, ingredientsIndex) {
  const names = new Set();

  const push = (x) => {
    const s = norm(x);
    if (s) names.add(s);
  };

  const index = ingredientsIndex || {};

  const containers =
    recipeObj?.ingredients ||
    recipeObj?.ingredientsList ||
    recipeObj?.components ||
    [];

  (containers || []).forEach((it) => {
    if (typeof it === 'string') {
      push(it);
      return;
    }
    push(it?.name);
    push(it?.title);
    push(it?.ttl);

    push(it?.ingredient?.name);
    push(it?.ingredient?.title);
    push(it?.ingredient?.ttl);

    push(it?.product?.name);
    push(it?.product?.title);
    push(it?.product?.ttl);

    const possibleIds = [
      it?.id,
      it?._id,
      it?.ingredientId,
      it?.productId,
      it?.ingredient?._id,
      it?.product?._id,
    ].filter(Boolean);

    possibleIds.forEach((id) => {
      const byIdx = index[String(id)];
      if (byIdx) push(byIdx);
    });
  });

  return names;
}

function matchLocally(
  item,
  { title, category, ingredientName, ingredientsIndex },
) {
  const r = pickRecipe(item);

  const t = norm(title);
  const titleOk = !t ? true : norm(r.title || r.name).includes(t);

  const c = norm(category);
  const rc = norm(r.category || r.categoryName);
  const categoryOk = !c ? true : rc === c || rc.includes(c);

  const iName = norm(ingredientName);
  let ingredientOk = true;
  if (iName) {
    const found = extractIngredientNames(r, ingredientsIndex);
    ingredientOk = [...found].some(
      (n) => n.includes(iName) || iName.includes(n),
    );
  }

  return titleOk && categoryOk && ingredientOk;
}

// ===== thunks =====
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
      ingredientsIndex = {},
    } = {},
    { rejectWithValue, signal },
  ) => {
    try {
      // бек може повертати totalPages/totalItems, але ми все одно
      // перерахуємо їх після локальної фільтрації
      const { items } = await getOwnRecipes({
        page,
        limit,
        title,
        category,
        ingredient, // id
        signal,
      });

      const filtered = (items || []).filter((it) =>
        matchLocally(it, { title, category, ingredientName, ingredientsIndex }),
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
      ingredientsIndex = {},
    } = {},
    { rejectWithValue, signal },
  ) => {
    try {
      const { items } = await getSavedRecipes({
        page,
        limit,
        title,
        category,
        ingredient, // id
        signal,
      });

      const filtered = (items || []).filter((it) =>
        matchLocally(it, { title, category, ingredientName, ingredientsIndex }),
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
