export const selectRecipes = (state) => state.recipes.items;
export const selectRecipesLoading = (state) => state.recipes.loading;
export const selectRecipesError = (state) => state.recipes.error;
export const selectRecipesPage = (state) => state.recipes.page;
export const selectRecipesTotalPages = (state) => state.recipes.totalPages;
export const selectSearchMode = (state) => state.recipes.searchMode;
export const selectSearchQuery = (state) => state.recipes.query;
export const selectSavedRecipesIds = (state) =>
  state.savedRecipes.items.map((recipe) => recipe._id);

export const selectRecipesItemsLen = (state) => state.recipes.items?.length || 0;
export const selectRecipesTotalItems = (state) => state.recipes.totalItems || 0;
export const selectFeedTotal = (state) => state.recipes.feedTotal || 0;


export const selectHasSearch = (titleFromProps) => (state) => {
  const query = state.recipes.query || {};
  const queryTitle = (titleFromProps ?? query.title ?? '').trim();
  return Boolean(queryTitle || query.category || query.ingredient);
};


export const selectDisplayTotal = (titleFromProps) => (state) => {
  const hasSearch = selectHasSearch(titleFromProps)(state);
  if (hasSearch) {
    const totalItems = selectRecipesTotalItems(state);
    const itemsLen = selectRecipesItemsLen(state);
    return totalItems || itemsLen;
  }
  return selectFeedTotal(state);
};
