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
    loading: false,
    isLoggedIn: false,
    isRegistered: false,
  },
  reducers: {
    clearAuth: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      state.user = { name: null, email: null };
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
      state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.isLoggedIn = false;
        state.isRegistered = true;
      })
      .addCase(register.rejected, (state) => {
      state.loading = false;
      })
      .addCase(login.pending, (state) => {
      state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.accessToken;
        state.isLoggedIn = true;
        state.isRegistered = true;
      })
      .addCase(login.rejected, (state) => {
      state.loading = false;
      })
       .addCase(logout.pending, (state) => {
      state.loading = true;
      })

      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = { name: null, email: null };
        state.token = null;
        state.isLoggedIn = false;
      })
      .addCase(logout.rejected, (state) => {
      state.loading = false;
     });
  },
});
export default authSlice.reducer;
export const { clearAuth } = authSlice.actions;
