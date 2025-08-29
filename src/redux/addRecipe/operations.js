import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { useSelector } from 'react-redux';

import { selectToken } from '../auth/selectors.js';

export const addRecipe = createAsyncThunk(
  'recipes/addRecipe',
  async (recipe, thunkAPI) => {
    try {
      // const token = useSelector(selectToken);
      const state = thunkAPI.getState();
      const token = selectToken(state);
      const response = await axios.post('/api/recipes', recipe, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  },
);
