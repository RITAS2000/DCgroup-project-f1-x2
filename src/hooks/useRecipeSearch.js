import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchRecipes } from '../redux/recipes/operations.js';
import { selectSearchQuery } from '../redux/recipes/selectors.js';
import { selectIngredients } from '../redux/ingredient/selectors.js';

// --- Глобальная «заглушка» от дублей (переживает ремоунт StrictMode)
let inflightKey = null; // стабильный ключ текущего запроса
let inflightTimer = null; // таймер для авто-сброса ключа

const clearInflight = (key) => {
  // небольшая защита: сбрасываем ключ, только если он всё ещё тот же
  if (inflightTimer) {
    clearTimeout(inflightTimer);
    inflightTimer = null;
  }
  if (inflightKey === key) inflightKey = null;
};

export function useRecipeSearch({
  title,
  selectedCategory,
  selectedIngredient,
}) {
  const dispatch = useDispatch();

  const query = useSelector(selectSearchQuery);
  const ingredients = useSelector(selectIngredients);
  const ingredientsLoaded =
    Array.isArray(ingredients) && ingredients.length > 0;

  // заголовок берём из пропса (если пришёл), иначе — из redux.query
  const queryTitle = (title ?? query?.title ?? '').trim();
  // bump используется лишь как триггер «переиска» при клике на Search
  const bump = Number(query?.bump) || 0;

  useEffect(() => {
    // если выбрали ингредиент, но ещё не подтянули справочник — ждём
    if (selectedIngredient && !ingredientsLoaded) return;

    // ничего не выбрано — не ищем
    if (!queryTitle && !selectedCategory && !selectedIngredient) return;

    // «Стабильный» ключ — без bump (одинаков для идентичного запроса)
    const stableKey = `${queryTitle}|${selectedCategory}|${selectedIngredient}|1`;

    // Если такой же запрос уже в полёте — ничего не делаем (StrictMode/повторный submit)
    if (inflightKey === stableKey) return;

    // Бронируем ключ сразу — чтобы второй вызов эффекта не успел отправить дубль
    inflightKey = stableKey;

    // Отправляем запрос
    const thunk = dispatch(
      searchRecipes({
        title: queryTitle,
        category: selectedCategory,
        ingredient: selectedIngredient,
        page: 1,
      }),
    );

    // Когда промис завершается — аккуратно освобождаем ключ.
    // Даём небольшую «форточку» (150–300ms), чтобы сгладить резкие ремонты/клики.
    Promise.resolve(thunk)
      .catch(() => {}) // ошибки проглатываем здесь — их обрабатывает сам thunk
      .finally(() => {
        // небольшой TTL, чтобы игнорировать мгновенный второй запуск
        inflightTimer = setTimeout(() => clearInflight(stableKey), 200);
      });

    // bump участвует только как триггер эффекта, но не входит в stableKey,
    // поэтому повторный клик по Search с теми же параметрами не отправит дубль.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    queryTitle,
    selectedCategory,
    selectedIngredient,
    ingredientsLoaded,
    bump, // нужен, чтобы Search (bump) действительно триггерил поиск
  ]);
}
