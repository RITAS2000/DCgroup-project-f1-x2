import { NavLink } from 'react-router-dom';
import css from './MyProfileLink.module.css';

export default function MyProfileLink({ onClick }) {
  const defaultType = 'all';

  return (
    <NavLink
      to={`/profile/${defaultType}`}
      onClick={onClick}
      className={({ isActive }) =>
        isActive ? `${css.link} ${css.isActive}` : css.link
      }
    >
      My Profile
    </NavLink>
  );
}
