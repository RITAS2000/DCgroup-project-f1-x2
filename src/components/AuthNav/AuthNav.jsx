import { NavLink } from 'react-router-dom';
import css from './AuthNav.module.css';

export default function AuthNav({ onClick }) {
  return (
    <div className={css.authNav}>
      <NavLink
        to="/auth/login"
        onClick={onClick}
        className={({ isActive }) =>
          isActive ? `${css.link} ${css.isActive}` : css.link
        }
      >
        Log in
      </NavLink>
      <NavLink className={css.asBTN} to="/auth/register" onClick={onClick}>
        Register
      </NavLink>
    </div>
  );
}
