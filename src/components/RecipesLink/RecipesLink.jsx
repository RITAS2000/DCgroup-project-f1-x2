import { NavLink } from 'react-router-dom';
import css from './RecipesLink.module.css';

export default function RecipesLink({ onClick }) {
  return (
    <NavLink
      to="/"
      onClick={onClick}
      className={({ isActive }) =>
        isActive ? `${css.link} ${css.isActive}` : css.link
      }
    >
      Recipes
    </NavLink>
  );
}
