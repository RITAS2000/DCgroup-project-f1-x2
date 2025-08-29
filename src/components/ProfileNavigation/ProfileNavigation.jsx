import { NavLink } from 'react-router-dom';
import s from './ProfileNavigation.module.css';

export default function ProfileNavigation() {
  return (
    <nav className={s.nav}>
      <NavLink
        to="/profile/own"
        className={({ isActive }) => (isActive ? s.active : '')}
      >
        My Recipes
      </NavLink>
      <NavLink
        to="/profile/favorites"
        className={({ isActive }) => (isActive ? s.active : '')}
      >
        Saved Recipes
      </NavLink>
    </nav>
  );
}
