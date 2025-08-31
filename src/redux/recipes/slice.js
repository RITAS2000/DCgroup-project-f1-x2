import { createSlice } from '@reduxjs/toolkit';
import { searchRecipes } from './operations';

const initialState = {
  items: [],
  page: 1,
  perPage: 12,
  totalItems: 0,
  totalPages: 0,
  loading: false,
  error: null,
  query: { title: '', category: '', ingredient: '' },
  searchMode: false,

  feedTotal: 0,
  savedRecipes: [],
};

const dedupeById = (arr) => {
  const m = new Map();
  for (const x of arr) m.set(x._id, x);
  return [...m.values()];
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    setQuery(state, { payload }) {
      state.query = { ...state.query, ...(payload || {}) };
    },
    addSavedRecipe(state, { payload }) {
      if (!state.savedRecipes.find((r) => r._id === payload._id)) {
        state.savedRecipes.push(payload);
      }
    },

    removeSavedRecipe(state, { payload: recipeId }) {
      state.savedRecipes = state.savedRecipes.filter((r) => r._id !== recipeId);
    },

    setSavedRecipes(state, { payload }) {
      state.savedRecipes = payload || [];
    },
    clearResults(state) {
      state.items = [];
      state.page = 1;
      state.totalItems = 0;
      state.totalPages = 0;
      state.loading = false;
      state.error = null;
      state.searchMode = false;
      state.query = { title: '', category: '', ingredient: '' };
    },

    setFeedTotal(state, { payload }) {
      state.feedTotal = Number(payload) || 0;
    },
  },
  extraReducers: (b) => {
    b.addCase(searchRecipes.pending, (s, a) => {
      s.loading = true;
      s.error = null;
      s.searchMode = true;

      const {
        title = '',
        category = '',
        ingredient = '',
        page = 1,
      } = a.meta.arg || {};

      s.query = { title, category, ingredient };

      if (page === 1) {
        s.items = [];
        s.page = 1;
      }
    })

      .addCase(searchRecipes.fulfilled, (s, { payload, meta }) => {
        s.loading = false;
        s.page = payload.page;
        s.perPage = payload.perPage ?? 12;
        s.totalItems = payload.totalItems ?? payload.total ?? 0;
        s.totalPages = payload.totalPages ?? 0;

        const isNextPage = (meta?.arg?.page ?? 1) > 1;

        if (isNextPage) {
          s.items = dedupeById([
            ...(s.items || []),
            ...(payload.recipes || []),
          ]);
        } else {
          s.items = payload.recipes || [];
        }
      })
      .addCase(searchRecipes.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
        s.items = [];
        s.searchMode = true;
      });
  },
});

export const {
  setQuery,
  clearResults,
  setFeedTotal,
  addSavedRecipe,
  removeSavedRecipe,
  setSavedRecipes,
} = recipesSlice.actions;
export default recipesSlice.reducer;
