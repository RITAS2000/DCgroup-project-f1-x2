import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { clearResults } from '../../redux/recipes/slice';
import RecipesList from '../../components/RecipesList/RecipesList.jsx';
import Hero from '../../components/Hero/Hero.jsx';
import Filters from '../../components/Filters/Filters.jsx';

export default function MainPage() {
  const dispatch = useDispatch();
  const formikRef = useRef(null);
  useEffect(() => {
    dispatch(clearResults());
  }, [dispatch]);

  const handleResetAll = () => {
    dispatch(clearResults()); // очистка Redux
    formikRef.current?.resetForm(); // очистка інпуту у SearchBox
  };
  return (
    <>
      <Hero resetRef={formikRef} />
      <Filters />
      <RecipesList onResetAll={handleResetAll} />
    </>
  );
}
