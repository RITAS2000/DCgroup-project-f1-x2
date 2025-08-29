export const selectUserProfile = (state) => state.userProfile;

export const selectUserRecipes = (state) => state.userProfile.items;

export const selectUserProfileLoading = (state) => state.userProfile.loading;

export const selectUserProfileError = (state) => state.userProfile.error;

export const selectUserProfilePage = (state) => state.userProfile.page;

export const selectUserProfileTotalPages = (state) =>
  state.userProfile.totalPages;

export const selectUserProfileHasNext = (state) => state.userProfile.hasNext;

export const selectUserProfileType = (state) => state.userProfile.type;

export const selectUserProfileTotalItems = (state) =>
  state.userProfile.totalItems;

export const selectAuthToken = (state) => state.auth.token;
