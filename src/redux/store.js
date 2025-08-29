import { configureStore } from '@reduxjs/toolkit';
import userProfileReducer from './userPro/slice.js';
import authReducer from './auth/slice.js';
import modalReducer from './modal/slice.js';
import addRecipeReducer from './addRecipe/sliceAddRecipe.js';
import recipesReducer from './recipes/slice.js';
import ingredientsReducer from './ingredient/slice.js';
import categoriesReducer from './categorie/slice.js';
import burgerReducer from './modal/burgerSlice.js';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistedAuthReducer = persistReducer(
  {
    key: 'token',
    storage,
    whitelist: ['token', 'isLoggedIn'],
  },
  authReducer,
);
export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
    auth: persistedAuthReducer,
    modal: modalReducer,
    addRecipe: addRecipeReducer,
    recipes: recipesReducer,
    ingredients: ingredientsReducer,
    categories: categoriesReducer,
    burger: burgerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
