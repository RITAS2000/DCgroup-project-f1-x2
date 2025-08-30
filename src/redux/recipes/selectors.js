export const selectRecipes = (s) => s.recipes.items;
export const selectRecipesLoading = (s) => s.recipes.loading;
export const selectRecipesError = (s) => s.recipes.error;
export const selectRecipesPage = (s) => s.recipes.page;
export const selectRecipesTotalPages = (s) => s.recipes.totalPages;
export const selectSearchMode = (s) => s.recipes.searchMode;
export const selectSearchQuery = (s) => s.recipes.query;
export const selectSavedRecipesIds = (state) =>
  state.savedRecipes.items.map((recipe) => recipe._id);
