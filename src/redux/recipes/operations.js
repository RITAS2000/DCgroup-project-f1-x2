import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || 'https://dcgroup-react-node-b.onrender.com',
  withCredentials: false,
});

// ── helpers ───────────────────────────────────────────────────────────────────
const norm = (v) =>
  String(v ?? '')
    .trim()
    .toLowerCase();
const pickRecipe = (item) => item?.recipe ?? item ?? {};

function extractIngredientNames(recipeObj) {
  const names = new Set();
  const push = (x) => {
    const s = norm(x);
    if (s) names.add(s);
  };

  const containers =
    recipeObj?.ingredients ||
    recipeObj?.ingredientsList ||
    recipeObj?.components ||
    [];

  (containers || []).forEach((it) => {
    if (typeof it === 'string') {
      push(it);
      return;
    }
    push(it?.name);
    push(it?.title);
    push(it?.ttl);

    push(it?.ingredient?.name);
    push(it?.ingredient?.title);
    push(it?.ingredient?.ttl);

    push(it?.product?.name);
    push(it?.product?.title);
    push(it?.product?.ttl);
  });

  return names;
}

function filterByIngredientName(items, ingredientName) {
  const iName = norm(ingredientName);
  if (!iName) return items;

  return (items || []).filter((it) => {
    const r = pickRecipe(it);
    const found = extractIngredientNames(r);
    return [...found].some((n) => n.includes(iName) || iName.includes(n));
  });
}

function dedupeById(list) {
  const map = new Map();
  for (const x of list || []) {
    const k = String(x?._id ?? x?.id ?? '');
    if (k) map.set(k, x);
  }
  return [...map.values()];
}

// ── thunk ─────────────────────────────────────────────────────────────────────
export const searchRecipes = createAsyncThunk(
  'recipes/search',
  async (
    { title, category, ingredient, page = 1 },
    { rejectWithValue, getState },
  ) => {
    try {
      // title может прийти строкой или { title: '...' }
      const t =
        typeof title === 'string'
          ? title
          : title?.title
          ? String(title.title)
          : '';

      // имя ингредиента по id из словаря ингредиентов
      const state = getState();
      const ingredients = state?.ingredients?.items || [];
      const ingredientName = ingredient
        ? String(
            (
              ingredients.find((x) => String(x?._id) === String(ingredient)) ||
              {}
            )?.name || '',
          )
        : '';

      // Базовый серверный запрос (как было)
      const params = {};
      if (t) params.title = t;
      if (category) params.category = category;
      if (ingredient) params.ingredient = ingredient; // id
      if (page) params.page = page;

      const { data } = await api.get('api/recipes', { params });
      const d = data?.data ?? {};
      const serverItems = d.data || [];

      // Доп. фолбэк для ингредиента на 1-й странице:
      //  - расширенный общий список (perPage=200) без ingredient
      //  - свои own-рецепты (perPage=200) с авторизацией
      if (ingredient && page === 1 && ingredientName) {
        try {
          const fbParams = {};
          if (t) fbParams.title = t;
          if (category) fbParams.category = category;
          if (ingredient) fbParams.ingredient = ingredient;
          fbParams.page = 1;
          fbParams.perPage = 200;

          const [fbPublicResp, fbOwnResp] = await Promise.all([
            api.get('api/recipes', { params: fbParams }),
            // own требует токен:
            (async () => {
              const token = state?.auth?.token;
              if (!token) return;
              const cfg = {
                params: fbParams,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
              };
              return api.get('api/recipes/own', cfg);
            })(),
          ]);

          const fbPublic = fbPublicResp?.data?.data?.data || [];
          const fbOwn = fbOwnResp?.data?.data?.data || [];

          const matchedPublic = filterByIngredientName(
            fbPublic,
            ingredientName,
          );
          const matchedOwn = filterByIngredientName(fbOwn, ingredientName);

          const union = dedupeById([
            ...(serverItems || []),
            ...matchedPublic,
            ...matchedOwn,
          ]);

          return {
            recipes: union,
            page: d.page ?? 1,
            perPage: d.perPage ?? 12,
            totalItems: union.length,
            totalPages: d.totalPages ?? 0,
          };
        } catch {
          // если фолбэк упал — тихо возвращаем серверный результат
        }
      }

      // Обычный путь без доп. фолбэка
      return {
        recipes: serverItems,
        page: d.page ?? 1,
        perPage: d.perPage ?? 12,
        totalItems:
          typeof d.totalItems === 'number' ? d.totalItems : serverItems.length,
        totalPages: d.totalPages ?? 0,
      };
    } catch (err) {
      if (err.response?.status === 404) {
        return {
          recipes: [],
          page: 1,
          perPage: 12,
          totalItems: 0,
          totalPages: 0,
        };
      }
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);
// import { createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// const api = axios.create({
//   baseURL:
//     import.meta.env.VITE_API_URL || 'https://dcgroup-react-node-b.onrender.com',
//   withCredentials: false,
// });

// const norm = (v) =>
//   String(v ?? '')
//     .trim()
//     .toLowerCase();
// const pickRecipe = (item) => item?.recipe ?? item ?? {};

// function extractIngredientNames(recipeObj, ingredientsIndex) {
//   const names = new Set();
//   const push = (x) => {
//     const s = norm(x);
//     if (s) names.add(s);
//   };

//   const index = ingredientsIndex || {};
//   const containers =
//     recipeObj?.ingredients ||
//     recipeObj?.ingredientsList ||
//     recipeObj?.components ||
//     [];

//   (containers || []).forEach((it) => {
//     if (typeof it === 'string') {
//       push(it);
//       return;
//     }

//     push(it?.name);
//     push(it?.title);
//     push(it?.ttl);

//     push(it?.ingredient?.name);
//     push(it?.ingredient?.title);
//     push(it?.ingredient?.ttl);

//     push(it?.product?.name);
//     push(it?.product?.title);
//     push(it?.product?.ttl);

//     const possibleIds = [
//       it?.id,
//       it?._id,
//       it?.ingredientId,
//       it?.productId,
//       it?.ingredient?._id,
//       it?.product?._id,
//     ].filter(Boolean);

//     possibleIds.forEach((id) => {
//       const byIdx = index[String(id)];
//       if (byIdx) push(byIdx);
//     });
//   });

//   return names;
// }

// function matchLocally(item, { title, category, ingredient, ingredientsIndex }) {
//   const r = pickRecipe(item);

//   const t = norm(title);
//   const titleOk = !t ? true : norm(r.title || r.name).includes(t);

//   const c = norm(category);
//   const rc = norm(r.category || r.categoryName);
//   const categoryOk = !c ? true : rc === c || rc.includes(c);

//   let ingredientOk = true;
//   if (ingredient) {
//     const ingredientName = norm(ingredientsIndex?.[String(ingredient)] || '');
//     if (ingredientName) {
//       const found = extractIngredientNames(r, ingredientsIndex);
//       ingredientOk = [...found].some(
//         (n) => n.includes(ingredientName) || ingredientName.includes(n),
//       );
//     }
//   }

//   return titleOk && categoryOk && ingredientOk;
// }

// export const searchRecipes = createAsyncThunk(
//   'recipes/search',

//   async (
//     { title, category, ingredient, page = 1 },
//     { rejectWithValue, getState },
//   ) => {
//     try {
//       const t =
//         typeof title === 'string'
//           ? title
//           : title?.title
//           ? String(title.title)
//           : '';

//       const params = {};
//       if (t) params.title = t;
//       if (category) params.category = category;
//       if (page) params.page = page;

//       const { data } = await api.get('api/recipes', { params });

//       const d = data?.data ?? {};
//       const items = d.data || [];

//       const state = getState();
//       const ingredientsIndex = {};
//       (state?.ingredients?.items || []).forEach((x) => {
//         if (x?._id) {
//           ingredientsIndex[String(x._id)] = String(
//             x.name || x.title || x.ttl || '',
//           );
//         }
//       });

//       const filtered = items.filter((it) =>
//         matchLocally(it, { title: t, category, ingredient, ingredientsIndex }),
//       );

//       return {
//         recipes: filtered,
//         page: d.page ?? 1,
//         perPage: d.perPage ?? 12,

//         totalItems: filtered.length,
//         totalPages: d.totalPages ?? 0,
//       };
//     } catch (err) {
//       if (err.response?.status === 404) {
//         return {
//           recipes: [],
//           page: 1,
//           perPage: 12,
//           totalItems: 0,
//           totalPages: 0,
//         };
//       }
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   },
// );
// import { createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// const api = axios.create({
//   baseURL:
//     import.meta.env.VITE_API_URL || 'https://dcgroup-react-node-b.onrender.com',
//   withCredentials: false,
// });

// export const searchRecipes = createAsyncThunk(
//   'recipes/search',
//   async ({ title, category, ingredient, page = 1 }, { rejectWithValue }) => {
//     try {
//       const t =
//         typeof title === 'string'
//           ? title
//           : title?.title
//           ? String(title.title)
//           : '';

//       const params = {};
//       if (t) params.title = t;
//       if (category) params.category = category;
//       if (ingredient) params.ingredient = ingredient;
//       if (page) params.page = page;

//       const { data } = await api.get('api/recipes', { params });

//       const d = data?.data ?? {};
//       return {
//         recipes: d.data || [],
//         page: d.page ?? 1,
//         perPage: d.perPage ?? 12,
//         totalItems: d.totalItems ?? d.total ?? 0,
//         totalPages: d.totalPages ?? 0,
//       };
//     } catch (err) {
//       if (err.response?.status === 404) {
//         return {
//           recipes: [],
//           page: 1,
//           perPage: 12,
//           totalItems: 0,
//           totalPages: 0,
//         };
//       }
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   },
// );
