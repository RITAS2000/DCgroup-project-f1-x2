import api from './axios';
export const PAGE_SIZE = 12;

function normalizePagedResponse(raw) {
  const items = raw?.data?.data ?? raw?.data ?? raw?.items ?? [];

  return {
    items: Array.isArray(items) ? items : [],
    page: Number(raw?.data?.page ?? 1),
    perPage: Number(raw?.data?.perPage ?? PAGE_SIZE),
    totalItems: Number(raw?.data?.totalItems ?? items.length ?? 0),
    totalPages: Number(raw?.data?.totalPages ?? 1),
  };
}

export async function getOwnRecipes({
  page = 1,
  limit = PAGE_SIZE,
  title = '',
  category = '',
  ingredient = '',
  signal,
} = {}) {
  const params = { page, perPage: limit };
  if (title) params.title = title;
  if (category) params.category = category;
  if (ingredient) params.ingredient = ingredient;

  if (title || category || ingredient) params._t = Date.now();

  const res = await api.get('/api/recipes/own', { params, signal });
  return normalizePagedResponse(res.data);
}

export async function getSavedRecipes({
  page = 1,
  limit = PAGE_SIZE,
  title = '',
  category = '',
  ingredient = '',
  signal,
} = {}) {
  const params = { page, perPage: limit };
  if (title) params.title = title;
  if (category) params.category = category;
  if (ingredient) params.ingredient = ingredient;

  if (title || category || ingredient) params._t = Date.now();

  const res = await api.get('/api/recipes/saved', { params, signal });
  return normalizePagedResponse(res.data);
}

export async function addFavorite(recipeId, signal) {
  const res = await api.post('/api/recipes/saved', { recipeId }, { signal });
  return res.data;
}

export async function deleteFavorite(recipeId, signal) {
  const token = localStorage.getItem('accessToken');

  const res = await api.delete(`/api/recipes/saved/${recipeId}`, {
    signal,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export async function deleteRecipe(recipeId, signal) {
  const token = localStorage.getItem('accessToken');

  const res = await api.delete(`/api/recipes/own/${recipeId}`, {
    signal,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export async function getRecipeById(id, { signal } = {}) {
  const res = await api.get(`/api/recipes/${id}`, { signal });
  return res.data;
}

export async function createRecipe({ body, formData, signal } = {}) {
  const config = { signal };

  if (formData instanceof FormData) {
    return api.post('/api/recipes', formData, config);
  }

  return api.post('/api/recipes', body, config);
}

export function getImageUrl(src) {
  const base = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  if (!src) return '';
  if (/^https?:\/\//i.test(src)) return src;
  return src.startsWith('/') ? `${base}${src}` : `${base}/${src}`;
}
