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
import { ClockLoader } from 'react-spinners';

export default function SaveRecipeButton({ recipeId }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkIfRecipeIsSaved = async () => {
      try {
        if (isLoggedIn) {
          const result = await getSavedRecipes();
          const savedRecipes = result.data.data || [];

          const found = savedRecipes.find((recipe) => recipe._id === recipeId);
          setIsSaved(!!found);
        }
      } catch {
        toast.error('Error fetching saved recipes. Try to login.');
      }
    };

    checkIfRecipeIsSaved();
  }, [isLoggedIn, recipeId]);

  const handleUnsave = () => {
    const deleteSavedRecipe = async () => {
      try {
        if (isLoading) return;
        setIsLoading(true);

        if (isLoggedIn) {
          await delSavedRecipes(recipeId);
          setIsSaved(false);
          toast.success('Recipe removed from saved');
        } else {
          dispatch(openModal({ type: 'errorSaving' }));
        }
      } catch {
        toast.error(`Error deleting saved recipe. Try to login.`);
      } finally {
        setIsLoading(false);
      }
    };
    deleteSavedRecipe();
  };

  const handleSave = () => {
    const addSavedRecipe = async () => {
      try {
        if (isLoading) return;
        setIsLoading(true);
        if (isLoggedIn) {
          await postSavedRecipes(recipeId);

          setIsSaved(true);
          toast.success('Recipe saved');
        } else {
          dispatch(openModal({ type: 'errorSaving' }));
        }
      } catch {
        toast.error(`Error adding saved recipe. Try to login.`);
      } finally {
        setIsLoading(false);
      }
    };
    addSavedRecipe();
  };

  return (
    <>
      <button
        onClick={isSaved ? handleUnsave : handleSave}
        className={css.saveButton}
        disabled={isLoading}
      >
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ClockLoader color="#3d2218" size={24} />
          </div>
        ) : (
          <>
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
          </>
        )}
      </button>
    </>
  );
}
