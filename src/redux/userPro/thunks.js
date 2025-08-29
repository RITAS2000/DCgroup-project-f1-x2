import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getOwnRecipes,
  getSavedRecipes,
  deleteFavorite,
  deleteRecipe,
} from '../../api/recipes';
import { getErrorMessage } from '../../utils/errors';

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
    } = {},
    { rejectWithValue, signal },
  ) => {
    try {
      const { items, totalPages, totalItems } = await getOwnRecipes({
        page,
        limit,
        title,
        category,
        ingredient, // тут уже имя
        signal,
      });
      return { items, page, totalPages, totalItems, replace };
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
    } = {},
    { rejectWithValue, signal },
  ) => {
    try {
      const { items, totalPages, totalItems } = await getSavedRecipes({
        page,
        limit,
        title,
        category,
        ingredient, // тут уже имя
        signal,
      });
      return { items, page, totalPages, totalItems, replace };
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
