import { useEffect, useState } from 'react';
import RecipeDetails from '../../components/RecipeDetails/RecipeDetails.jsx';
import { useParams } from 'react-router-dom';
import {
  getAllIngredients,
  getRecipeDetails,
} from '../../services/viewRecipeService.js';
// import NotFoundPage from "../NotFoundPage/NotFoundPage.jsx";
import Container from '../../components/Container/Container.jsx';
export default function RecipeViewPage() {
  const { recipeId } = useParams();
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    getRecipeDetails(recipeId)
      .then((data) => setRecipeDetails(data.data))
      .catch((error) => console.error(error));

    getAllIngredients()
      .then((res) => setIngredients(res.data))
      .catch((error) => console.error(error));
  }, [recipeId]);

  return (
    // <>
    //   {recipeDetails && (
    //     <Container variant="light">
    //       <RecipeDetails details={recipeDetails} ingredients={ingredients} />
    //     </Container>
    //   )}
    // </>
    <>
      {recipeDetails ? (
        <Container variant="light">
          <RecipeDetails details={recipeDetails} ingredients={ingredients} />
        </Container>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}
