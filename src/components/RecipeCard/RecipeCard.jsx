import axios from 'axios';
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';
import css from './RecipeCard.module.css';
import { selectIsLoggedIn } from '../../redux/auth/selectors.js';

import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../../redux/modal/slice.js';
import { useState } from 'react';

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


  const [isSavedRecipe, setIsSavedRecipe] = useState(false); //стан для кнопки чи збережений рецепт


  const dispatch = useDispatch();

  //бажання зберегти рецепт
  const handleAddToSavedRecipes = async (e) => {
  e.preventDefault();
  if (!isLoggedIn) {
    dispatch(openModal({ type: 'errorSaving' }));
    return;
  }

  try {
    if (!isSavedRecipe) {
      const response = await axios.post(
        'https://dcgroup-react-node-b.onrender.com/api/recipes/saved',
        { recipeId: id },
      );
      toast.success('Recipe added to saved recipes!');
      console.log('Saved recipe response:', response.data);
      setIsSavedRecipe(true);
    } else {
      const deleteRecipe = await axios.delete(
        `https://dcgroup-react-node-b.onrender.com/api/recipes/saved/${id}`
       
      );
      toast.success('Recipe removed from saved recipes!');
      console.log('Deleted recipe response:', deleteRecipe.data);
      setIsSavedRecipe(false);
    }
  } catch {
    
    toast.error('Failed !');
  }
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
          <svg width="24" height="24">
            <use xlinkHref="/sprite/symbol-defs.svg#icon-bookmark-outline"></use>
          </svg>
        </button>
      </div>
    </div>
  );
}
