import { NavLink } from 'react-router-dom';
import css from './AddRecipeLink.module.css';

export default function AddRecipeLink({ onClick }) {
  return (
    <NavLink className={css.asBTN} to="/add-recipe" onClick={onClick}>
      Add Recipe
    </NavLink>
  );
}
