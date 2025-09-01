import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ClockLoader } from 'react-spinners';

import RecipeDetails from '../../components/RecipeDetails/RecipeDetails.jsx';
import Container from '../../components/Container/Container.jsx';
import NotFound from '../NotFound/NotFound.jsx';

import {
  getAllIngredients,
  getRecipeDetails,
} from '../../services/viewRecipeService.js';

export default function RecipeViewPage() {
  const { recipeId } = useParams();
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    Promise.all([getRecipeDetails(recipeId), getAllIngredients()])
      .then(([recipeData, ingredientsData]) => {
        setRecipeDetails(recipeData.data);
        setIngredients(ingredientsData.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [recipeId]);

  return (
    <>
      {isLoading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 300,
          }}
        >
          <ClockLoader color="#3d2218" size={100} />
        </div>
      ) : recipeDetails ? (
        <Container variant="light">
          <RecipeDetails details={recipeDetails} ingredients={ingredients} />
        </Container>
      ) : (
        <NotFound />
      )}
    </>
  );
}
