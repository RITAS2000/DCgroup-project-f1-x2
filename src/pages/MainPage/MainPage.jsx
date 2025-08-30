import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearResults } from '../../redux/recipes/slice';
import RecipesList from '../../components/RecipesList/RecipesList.jsx';
import Hero from '../../components/Hero/Hero.jsx';
import Filters from '../../components/Filters/Filters.jsx';
import css from './MainPage.module.css';

export default function MainPage() {
  const dispatch = useDispatch();
  const formikRef = useRef(null);
  const [resetKey, setResetKey] = useState(0); // 🔑 ключ для ресету Filters
  useEffect(() => {
    dispatch(clearResults());
  }, [dispatch]);

  const handleResetAll = () => {
    dispatch(clearResults()); // очистка Redux
    formikRef.current?.resetForm(); // очистка інпуту у SearchBox
    setResetKey((k) => k + 1); // ⚡️ скидаємо Filters
  };
  return (
    <div className={css.container}>
      <Hero resetRef={formikRef} />
      <Filters resetKey={resetKey} />
      <RecipesList onResetAll={handleResetAll} />
    </div>
  );
}
