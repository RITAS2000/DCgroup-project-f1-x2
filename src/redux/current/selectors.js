export const selectCurrentUser = (state) => state.user.current;

export const selectUserName = (state) =>
  state.user.current ? state.user.current.name : '';

export const selectUserEmail = (state) =>
  state.user.current ? state.user.current.email : '';

export const selectUserSavedRecipes = (state) =>
  state.user.current ? state.user.current.savedRecipes : [];

export const selectUserNotifications = (state) =>
  state.user.current ? state.user.current.notifications : [];

export const selectUnreadNotifications = (state) =>
  state.user.current
    ? state.user.current.notifications.filter((n) => !n.read)
    : [];
export const selectCurrentUserLoading = (state) => state.user.isLoading;
export const selectCurrentUserError = (state) => state.user.error;
