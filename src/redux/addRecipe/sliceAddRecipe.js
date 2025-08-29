import { createSlice } from '@reduxjs/toolkit';

import { addRecipe } from './operations.js';

const handlePending = (state) => {
  state.loading = true;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

const slice = createSlice({
  name: 'addRecipe',
  initialState: {
    recipe: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addRecipe.pending, handlePending)
      .addCase(addRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.recipe = action.payload;
      })
      .addCase(addRecipe.rejected, handleRejected);
  },
});

export default slice.reducer;
