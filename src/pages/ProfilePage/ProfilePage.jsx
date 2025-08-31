import { Navigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import s from './ProfilePage.module.css';

import { selectUserProfileTotalItems } from '../../redux/userPro/selectors';
import { useLoadProfileRecipes } from '../../hooks/useLoadProfileRecipes';

import ProfileNavigation from '../../components/ProfileNavigation/ProfileNavigation.jsx';
import UserRecipesList from '../../components/UserRecipeList/UserRecipesList.jsx';
import FiltersProfile from '../../components/FiltersProfile/FiltersProfile.jsx';

export default function ProfilePage() {
  const { recipeType } = useParams();
  const totalItems = useSelector(selectUserProfileTotalItems);
  const allowedTypes = ['own', 'favorites'];

  const { isLoading } = useLoadProfileRecipes(recipeType);

  if (!allowedTypes.includes(recipeType)) {
    return <Navigate to="/profile/own" replace />;
  }

  return (
    <section className={s.wrap}>
      <header className={s.header}>
        <h1 className={s.h1}>My profile</h1>
        <ProfileNavigation active={recipeType} />
        <div className={s.filtersRow}>
          <p className={s.count}>
            {isLoading
              ? '...'
              : `${totalItems} recipe${totalItems !== 1 ? 's' : ''}`}
          </p>
          <div className={s.filtersColumn}>
            <FiltersProfile />
          </div>
        </div>
      </header>

      {recipeType === 'own' && <UserRecipesList type="own" />}
      {recipeType === 'favorites' && <UserRecipesList type="favorites" />}
    </section>
  );
}
