import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/ingredients');
      return data; // очікую масив [{_id, name, ...}]
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);
