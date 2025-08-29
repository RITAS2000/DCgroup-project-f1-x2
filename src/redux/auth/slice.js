import { createSlice } from '@reduxjs/toolkit';
import { register, login, logout } from './operations';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      name: null,
      email: null,
    },
    token: null,
    isLoggedIn: false,
    isRegistered: false,
  },
  reducers: {
    clearAuth: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      state.user = { name: null, email: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.isLoggedIn = false;
        state.isRegistered = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.data.user;
        state.token = action.payload.data.accessToken;
        state.isLoggedIn = true;
        state.isRegistered = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = { name: null, email: null };
        state.token = null;
        state.isLoggedIn = false;
      });
  },
});
export default authSlice.reducer;
export const { clearAuth } = authSlice.actions;
