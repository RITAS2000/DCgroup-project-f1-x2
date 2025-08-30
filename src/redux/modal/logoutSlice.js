import { createSlice } from '@reduxjs/toolkit';

const initialState = { isOpen: false };

const logoutModalSlice = createSlice({
  name: 'logoutModal',
  initialState,
  reducers: {
    openLogout: (state, action) => {
      state.isOpen = true;
      state.message = action.payload?.message || null;
    },
    closeLogout: (state) => {
      state.isOpen = false;
      state.message = null;
    },
  },
});

export const { openLogout, closeLogout } = logoutModalSlice.actions;
export default logoutModalSlice.reducer;
