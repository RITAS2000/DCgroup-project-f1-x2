import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || 'https://dcgroup-react-node-b.onrender.com',
  withCredentials: false,
});

export const searchRecipes = createAsyncThunk(
  'recipes/search',
  async ({ title, category, ingredient, page = 1 }, { rejectWithValue }) => {
    try {
      const t =
        typeof title === 'string'
          ? title
          : title?.title
          ? String(title.title)
          : '';

      const params = {};
      if (t) params.title = t;
      if (category) params.category = category;
      if (ingredient) params.ingredient = ingredient;
      if (page) params.page = page;

      const { data } = await api.get('api/recipes', { params });

      const d = data?.data ?? {};
      return {
        recipes: d.data || [],
        page: d.page ?? 1,
        perPage: d.perPage ?? 12,
        totalItems: d.totalItems ?? d.total ?? 0,
        totalPages: d.totalPages ?? 0,
      };
    } catch (err) {
      if (err.response?.status === 404) {
        return {
          recipes: [],
          page: 1,
          perPage: 12,
          totalItems: 0,
          totalPages: 0,
        };
      }
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);
