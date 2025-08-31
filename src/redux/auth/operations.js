import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.baseURL = 'https://dcgroup-react-node-b.onrender.com/';

const setAuthHeader = (token) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
  delete axios.defaults.headers.common.Authorization;
  localStorage.removeItem('persist:token');
};

export const register = createAsyncThunk(
  'auth/register',
  async (values, thunkAPI) => {
    try {
      const res = await axios.post('/api/auth/register', values);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async (values, thunkAPI) => {
    try {
      const res = await axios.post('/api/auth/login', values);
      const token = res.data.data.accessToken;
      setAuthHeader(token);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    await axios.post(
      '/api/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    clearAuthHeader();
    return;
  } catch (error) {
    if (error.response?.status === 404) {
      clearAuthHeader();
      return;
    }
    return thunkAPI.rejectWithValue(error.message);
  }
});
