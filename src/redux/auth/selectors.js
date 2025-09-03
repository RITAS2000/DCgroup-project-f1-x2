export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectAuthToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;
export const selectIsRegistered = (state) => state.auth.isRegistered;

export const selectloginError = (state) => state.auth.error;


export const selectToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
