import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  current: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.current = action.payload;
    },
    removeRecipeFromUser(state, action) {
      const recipeId = action.payload;
      if (state.current) {
        state.current.savedRecipes = state.current.savedRecipes.filter(
          (id) => id !== recipeId,
        );
      }
    },
    addNotification(state, action) {
      if (state.current) {
        state.current.notifications.push(action.payload);
      }
    },
    markNotificationRead(state, action) {
      const notifId = action.payload;
      if (state.current) {
        const notif = state.current.notifications.find(
          (n) => n._id === notifId,
        );
        if (notif) notif.read = true;
      }
    },
  },
});

export const {
  setCurrentUser,
  removeRecipeFromUser,
  addNotification,
  markNotificationRead,
} = userSlice.actions;
export default userSlice.reducer;
