import axios from 'axios';
import { store } from '../redux/store.js';

axios.defaults.baseURL = "https://dcgroup-react-node-b.onrender.com";

export const setAuthHeader = (token) => {
  if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};


export const getRecipeDetails = async (recipeId) => {
    const token = store.getState().auth?.token;
    setAuthHeader(token);
    const res = await axios.get(
        `/api/recipes/${recipeId}`,
    );
    return res.data;
};

export const getSavedRecipes = async () => {
    const token = store.getState().auth?.token;
    setAuthHeader(token);
    const res = await axios.get(
        `/api/recipes/saved`,
    );
    return res.data;
}


export const postSavedRecipes = async (recipeId) => {
    const token = store.getState().auth?.token;
    setAuthHeader(token);
    const res = await axios.post(
      '/api/recipes/saved',
      { recipeId }
    );
    return res.data;
};


export const delSavedRecipes = async (recipeId) => {
    const token = store.getState().auth?.token;
    setAuthHeader(token);
    const res = await axios.delete(
        `/api/recipes/saved/${recipeId}`,
    );
    return res.data;
}


export const getAllIngredients = async () => {
    const token = store.getState().auth?.token;
    setAuthHeader(token);
    const res = await axios.get(
        `/api/ingredients/`,
    );
    return res.data;
}
