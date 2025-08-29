import { createSlice } from '@reduxjs/toolkit';

const initialState = { isOpen: false };

const burgerModalSlice = createSlice({
  name: 'burgerModal',
  initialState,
  reducers: {
    openBurger: (state) => {
      state.isOpen = true;
    },
    closeBurger: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openBurger, closeBurger } = burgerModalSlice.actions;
export default burgerModalSlice.reducer;
