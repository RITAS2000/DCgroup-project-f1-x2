import { createSlice } from '@reduxjs/toolkit';
import { fetchIngredients } from './operations.js';

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: {
    items: [], //
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ingredientsSlice.reducer;
