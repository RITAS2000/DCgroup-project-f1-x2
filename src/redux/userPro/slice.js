import { createSlice } from '@reduxjs/toolkit';
import { fetchOwn, fetchSaved, removeSaved, deleteOwn } from './thunks';
import { normalizeListResponse, resolveTotalPages } from './utils';

const initialState = {
  items: [],
  page: 1,
  perPage: 12,
  totalItems: 0,
  totalPages: 0,
  loading: false,
  error: null,
  currentRequestId: null,
  hasNext: false,
  type: 'own',
  shouldReload: false,
};

const dedupeById = (arr) => {
  const map = new Map();
  for (const x of arr) map.set(x.id ?? x._id, x);
  return [...map.values()];
};

const applyFulfilled = (state, action) => {
  if (state.currentRequestId !== action.meta.requestId) return;
  state.loading = false;
  state.error = null;
  state.currentRequestId = null;

  const { list, totalPages, totalItems } = normalizeListResponse(
    action.payload,
  );
  const page = action.meta?.arg?.page ?? 1;
  const limit = action.meta?.arg?.limit ?? 12;
  const replace = action.meta?.arg?.replace ?? page <= 1;

  state.page = page;
  state.perPage = limit;
  state.totalItems = totalItems;
  state.totalPages = resolveTotalPages(totalPages, totalItems, limit);
  state.hasNext = page < state.totalPages;

  const newItems = list ?? [];
  state.items = replace ? newItems : dedupeById([...state.items, ...newItems]);
};

const handlePending = (state, action) => {
  state.loading = true;
  state.error = null;
  state.currentRequestId = action.meta.requestId;

  const page = action.meta?.arg?.page ?? 1;
  const replace = action.meta?.arg?.replace ?? page <= 1;
  if (replace) {
    state.items = [];
    state.page = 1;
    state.totalPages = 0;
    state.hasNext = false;
  }
};

const handleRejected = (state, action) => {
  if (state.currentRequestId !== action.meta.requestId) return;
  state.loading = false;
  state.currentRequestId = null;
  state.error = action.payload || action.error?.message || 'Error';
  state.hasNext = false;
};

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    resetProfile: () => ({ ...initialState }),
    setRecipeType: (state, action) => {
      const newType = action.payload;
      if (newType !== state.type) {
        state.type = newType;
        state.items = [];
        state.page = 1;
        state.totalPages = 0;
        state.hasNext = false;
        state.error = null;
      }
    },
    setShouldReload: (state, action) => {
      state.shouldReload = action.payload ?? true;
    },
    removeRecipeFromList: (state, action) => {
      const id = String(action.payload);
      state.items = state.items.filter((it) => String(it.id ?? it._id) !== id);
      state.totalItems = Math.max(state.totalItems - 1, 0);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwn.pending, handlePending)
      .addCase(fetchOwn.fulfilled, applyFulfilled)
      .addCase(fetchOwn.rejected, handleRejected)
      .addCase(fetchSaved.pending, handlePending)
      .addCase(fetchSaved.fulfilled, applyFulfilled)
      .addCase(fetchSaved.rejected, handleRejected)
      .addCase(removeSaved.fulfilled, (state, action) => {
        const id = String(action.payload);
        state.items = state.items.filter(
          (it) => String(it.id ?? it._id) !== id,
        );
        state.totalItems = Math.max(state.totalItems - 1, 0);
      })
      .addCase(deleteOwn.fulfilled, (state, action) => {
        const id = String(action.payload);
        state.items = state.items.filter(
          (it) => String(it.id ?? it._id) !== id,
        );
        state.totalItems = Math.max(state.totalItems - 1, 0);
      });
  },
});

export const {
  resetProfile,
  setRecipeType,
  setShouldReload,
  removeRecipeFromList,
} = userProfileSlice.actions;
export const selectUserProfile = (state) => state.userProfile;
export const selectUserRecipes = (state) => state.userProfile.items;
export const selectUserProfileLoading = (state) => state.userProfile.loading;
export const selectUserProfileError = (state) => state.userProfile.error;
export const selectUserProfilePage = (state) => state.userProfile.page;
export const selectUserProfileTotalPages = (state) =>
  state.userProfile.totalPages;
export const selectUserProfileHasNext = (state) => state.userProfile.hasNext;
export const selectUserProfileShouldReload = (state) =>
  state.userProfile.shouldReload;

export default userProfileSlice.reducer;
