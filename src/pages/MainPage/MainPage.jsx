import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { clearResults } from '../../redux/recipes/slice';
import RecipesList from '../../components/RecipesList/RecipesList.jsx';
import Hero from '../../components/Hero/Hero.jsx';
import Filters from '../../components/Filters/Filters.jsx';
import css from './MainPage.module.css';

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
    <div className={css.container}>
      <Hero resetRef={formikRef} />
      <Filters />
      <RecipesList onResetAll={handleResetAll} />
    </div>
  );
}
