// import axios from 'axios';
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';
import css from './RecipeCard.module.css';
import { selectIsLoggedIn } from '../../redux/auth/selectors.js';

import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../../redux/modal/slice.js';
import { useState } from 'react';
import { ClockLoader } from 'react-spinners';

// ✅ імпортуємо Redux-екшени
import {
  addSavedRecipe,
  removeSavedRecipe,
} from '../../redux/recipes/slice.js';
import { addFavorite, deleteFavorite } from '../../api/recipes.js';

export default function RecipeCard({
  id,
  thumb,
  title,
  time,
  description,
  calories,
}) {
  const navigate = useNavigate();
  const handleLearnMore = () => {
    navigate(`/recipes/${id}`);
  };

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [isLoading, setIsLoading] = useState(false); //loader state
  // 🟢 додав 2 рядки
  const savedRecipes = useSelector((state) => state.recipes.savedRecipes);
  const isSavedRecipe = savedRecipes.some((r) => r._id === id);

  // const [isSavedRecipe, setIsSavedRecipe] = useState(false); //стан для кнопки чи збережений рецепт

  const dispatch = useDispatch();

  //бажання зберегти рецепт
  const handleAddToSavedRecipes = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      dispatch(openModal({ type: 'errorSaving' }));
      return;
    }
    try {
      setIsLoading(true);

      if (!isSavedRecipe) {
        // ✅ додаємо рецепт у збережені на бекенді
        await addFavorite(id);

        // ✅ оновлюємо Redux
        dispatch(
          addSavedRecipe({
            _id: id,
            thumb,
            title,
            time,
            description,
            calories,
          }),
        );

        toast.success('Recipe added to saved recipes!');
      } else {
        // ✅ видаляємо рецепт зі збережених на бекенді
        await deleteFavorite(id);

        // ✅ оновлюємо Redux
        dispatch(removeSavedRecipe(id));

        toast.success('Recipe removed from saved recipes!');
      }
    } catch {
      dispatch(openModal({ type: 'notAuthorized' }));
    } finally {
      setIsLoading(false);
    }
    // try {
    //   if (!isSavedRecipe) {
    //     setIsLoading(true);
    //     const response = await axios.post(
    //       'https://dcgroup-react-node-b.onrender.com/api/recipes/saved',
    //       { recipeId: id },
    //     );
    //     toast.success('Recipe added to saved recipes!');
    //     console.log('Saved recipe response:', response.data);
    //     setIsSavedRecipe(true);
    //   } else {
    //     setIsLoading(true);
    //     const deleteRecipe = await axios.delete(
    //       `https://dcgroup-react-node-b.onrender.com/api/recipes/saved/${id}`,
    //     );
    //     toast.success('Recipe removed from saved recipes!');
    //     console.log('Deleted recipe response:', deleteRecipe.data);
    //     setIsSavedRecipe(false);
    //   }
    // } catch {
    //   dispatch(openModal({ type: 'notAuthorized' }));
    //   // toast.error('Failed !');
    // } finally {
    //   setIsLoading(false);
    // }
  };
  return (
    <div className={css.card}>
      <img className={css.image} src={thumb} alt={title} />
      <div className={css.title_container}>
        <h3 className={css.title}>{title}</h3>
        <div className={css.time_container}>
          <svg width="24" height="24">
            <use xlinkHref="/sprite/symbol-defs.svg#icon-clock"></use>
          </svg>
          <p className={css.time}>{time}</p>
        </div>
      </div>
      <div className={css.descr_cont}>
        <p className={css.description1}>{description}</p>
        <p className={css.description2}>~{calories ?? 'N/A'} cals</p>
      </div>
      <div className={css.btn_cont}>
        <button className={css.btn_learn} onClick={handleLearnMore}>
          Learn more
        </button>
        <button
          className={`${css.btn_save} ${isSavedRecipe ? css.saved : ''}`}
          onClick={handleAddToSavedRecipes}
        >
          {isLoading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 300,
              }}
            >
              <ClockLoader color="#3d2218" size={24} />
            </div>
          ) : (
            <svg width="24" height="24">
              <use xlinkHref="/sprite/symbol-defs.svg#icon-bookmark-outline"></use>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
