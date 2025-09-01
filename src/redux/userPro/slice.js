import { createSlice } from '@reduxjs/toolkit';
import { resolveTotalPages } from './utils';

const T = {
  fetchOwn: 'profile/fetchOwn',
  fetchSaved: 'profile/fetchSaved',
  removeSaved: 'profile/removeSaved',
  deleteOwn: 'profile/deleteOwn',
};

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

const getItemId = (it) =>
  String(
    it?.id ??
      it?._id ??
      it?.recipeId ??
      it?.recipe?.id ??
      it?.recipe?._id ??
      '',
  );

const dedupeById = (arr) => {
  const map = new Map();
  for (const x of arr) map.set(getItemId(x), x);
  return [...map.values()];
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

const applyFulfilled = (state, action) => {
  if (state.currentRequestId !== action.meta.requestId) return;
  state.loading = false;
  state.error = null;
  state.currentRequestId = null;

  const {
    items,
    page,
    limit,
    replace,
    hasNext,
    totalPages,
    totalItems: serverTotal,
    clientFiltered,
  } = action.payload ?? {};

  const newItems = items ?? [];
  state.items = replace ? newItems : dedupeById([...state.items, ...newItems]);

  state.page = page ?? state.page;
  state.perPage = limit ?? state.perPage;

  if (clientFiltered) {
    const effective = state.items.length;
    state.totalItems = effective;
    state.totalPages = resolveTotalPages(null, effective, state.perPage);
    state.hasNext =
      typeof hasNext === 'boolean'
        ? hasNext
        : newItems.length === state.perPage;
  } else {
    const effective = serverTotal ?? state.items.length;
    state.totalItems = effective;
    state.totalPages = resolveTotalPages(totalPages, effective, state.perPage);
    state.hasNext =
      typeof hasNext === 'boolean'
        ? hasNext
        : newItems.length === state.perPage;
  }
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
      state.items = state.items.filter((it) => getItemId(it) !== id);
      state.totalItems = Math.max(state.totalItems - 1, 0);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(`${T.fetchOwn}/pending`, handlePending);
    builder.addCase(`${T.fetchOwn}/fulfilled`, applyFulfilled);
    builder.addCase(`${T.fetchOwn}/rejected`, handleRejected);
    builder.addCase(`${T.fetchSaved}/pending`, handlePending);
    builder.addCase(`${T.fetchSaved}/fulfilled`, applyFulfilled);
    builder.addCase(`${T.fetchSaved}/rejected`, handleRejected);

    builder.addCase(`${T.removeSaved}/fulfilled`, (state, action) => {
      const id = String(
        action.payload?.id ??
          action.payload?._id ??
          action.payload ??
          action.meta?.arg?.id ??
          action.meta?.arg,
      );
      state.items = state.items.filter((it) => getItemId(it) !== id);
      state.totalItems = Math.max(state.totalItems - 1, 0);
    });

    builder.addCase(`${T.deleteOwn}/fulfilled`, (state, action) => {
      const id = String(
        action.payload?.id ??
          action.payload?._id ??
          action.payload ??
          action.meta?.arg?.id ??
          action.meta?.arg,
      );
      state.items = state.items.filter((it) => getItemId(it) !== id);
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
export const selectUserProfileTotalItems = (state) =>
  state.userProfile.totalItems;
export const selectUserProfileType = (state) => state.userProfile.type;

export default userProfileSlice.reducer;
