import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
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
      if (e.response) {
        // Це обов'язково: записуємо статус у state
        return thunkAPI.rejectWithValue({
          status: e.response.status,
          message: e.response.data.message,
        });
      }
      return thunkAPI.rejectWithValue(e.message);
    }
  },
);
