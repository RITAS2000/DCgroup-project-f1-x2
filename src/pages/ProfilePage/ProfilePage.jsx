import { Navigate, useParams } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import s from './ProfilePage.module.css';

import ProfileNavigation from '../../components/ProfileNavigation/ProfileNavigation.jsx';
import UserRecipesList from '../../components/UserRecipeList/UserRecipesList.jsx';
import FiltersProfile from '../../components/FiltersProfile/FiltersProfile.jsx';
import { selectUserProfileLoading } from '../../redux/userPro/slice';

export default function ProfilePage() {
  const { recipeType } = useParams();
  const allowedTypes = ['own', 'favorites'];
  const isInvalidType = !allowedTypes.includes(recipeType);
  const activeType = isInvalidType ? 'own' : recipeType;

  const loading = useSelector(selectUserProfileLoading);

  const suppressLocalSpinnerRef = useRef(true);
  useEffect(() => {
    if (!loading) suppressLocalSpinnerRef.current = false;
  }, [loading]);

  return (
    <section className={s.wrap}>
      {isInvalidType && <Navigate to="/profile/own" replace />}

      <header className={s.header}>
        <h1 className={s.h1}>My profile</h1>
        <ProfileNavigation active={activeType} />
        <div className={s.filtersRow}>
          <FiltersProfile title={recipeType} resetKey={recipeType} />
        </div>
      </header>

      {activeType === 'own' && (
        <UserRecipesList
          type="own"
          allowInitialSpinner={!suppressLocalSpinnerRef.current}
        />
      )}
      {activeType === 'favorites' && (
        <UserRecipesList
          type="favorites"
          allowInitialSpinner={!suppressLocalSpinnerRef.current}
        />
      )}
    </section>
  );
}
