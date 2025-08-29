import { useDispatch, useSelector } from 'react-redux';
import css from './SaveRecipeButton.module.css';
import { selectIsLoggedIn } from '../../redux/auth/selectors.js';
import {
  delSavedRecipes,
  getSavedRecipes,
  postSavedRecipes,
} from '../../services/viewRecipeService.js';
import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { openModal } from '../../redux/modal/slice.js';

export default function SaveRecipeButton({ recipeId }) {
  const [isSaved, setIsSaved] = useState(false);

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkIfRecipeIsSaved = async () => {
      try {
        if (isLoggedIn) {
          const result = await getSavedRecipes();
          const savedRecipes = result.data.data || [];

          const found = savedRecipes.find((recipe) => recipe._id === recipeId);
          setIsSaved(found);
        }
      } catch (error) {
        console.error('Error fetching saved recipes:', error);
      }
    };

    checkIfRecipeIsSaved();
  }, [isLoggedIn, recipeId]);

  const handleUnsave = () => {
    const deleteSavedRecipe = async () => {
      try {
        console.log('recipeId', recipeId);

        if (isLoggedIn) {
          await delSavedRecipes(recipeId);
          setIsSaved(false);
        } else {
          console.log('not logged in');
          dispatch(openModal({ type: 'errorSaving' }));
        }
      } catch (error) {
        toast.error(`Error deleting saved recipe: ${error}`);
      }
    };
    deleteSavedRecipe();
  };

  const handleSave = () => {
    const addSavedRecipe = async () => {
      try {
        if (isLoggedIn) {
          await postSavedRecipes(recipeId);

          setIsSaved(true);
        } else {
          console.log('not logged in');
          dispatch(openModal({ type: 'errorSaving' }));
        }
      } catch (error) {
        toast.error(`Error adding saved recipe: ${error}`);
      }
    };
    addSavedRecipe();
  };

  //     return (
  //         <>
  //           {isSaved ? (
  //             <button onClick={handleUnsave} className={css.saveButton}>
  //               Unsave
  //               <svg className={css.icon} width="24" height="24">
  //                 <use href="/sprite/symbol-defs.svg#icon-bookmark-outline"
  //                      style={{ fill: 'white', stroke: 'none' }}/>
  //               </svg>
  //             </button>
  //           ) : (
  //             <button onClick={handleSave} className={css.saveButton}>
  //               Save
  //               <svg className={css.icon} width="24" height="24">
  //                 <use href="/sprite/symbol-defs.svg#icon-bookmark-outline"
  //                      style={{ fill: 'transparent', stroke: 'white' }}/>
  //               </svg>
  //             </button>
  //           )}
  //         </>
  //     )
  // };

  return (
    <>
      <button
        onClick={isSaved ? handleUnsave : handleSave}
        className={css.saveButton}
      >
        {isSaved ? 'Unsave' : 'Save'}
        <svg
          className={css.icon}
          width="24"
          height="24"
          style={{ color: 'white' }}
        >
          <use
            href={`/sprite/symbol-defs.svg#${
              isSaved ? 'icon-bookmark-filled' : 'icon-bookmark-outline'
            }`}
          />
        </svg>
      </button>
    </>
  );
}
