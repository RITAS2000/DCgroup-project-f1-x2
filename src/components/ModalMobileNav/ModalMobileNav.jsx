import { useDispatch, useSelector } from 'react-redux';

import UserMenu from '../UserMenu/UserMenu.jsx';
import AuthNav from '../AuthNav/AuthNav.jsx';
import { selectIsLoggedIn } from '../../redux/auth/selectors.js';
import css from './ModalMobileNav.module.css';
import { closeBurger } from '../../redux/modal/burgerSlice.js';
import Logo from '../Logo/Logo.jsx';
import RecipesLink from '../RecipesLink/RecipesLink.jsx';
import MyProfileLink from '../MyProfileLink/MyProfileLink.jsx';
import AddRecipeLink from '../AddRecipeLink/AddRecipeLink.jsx';

export default function ModalMobileNav({ isOpen = false }) {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const handleClose = () => dispatch(closeBurger());

  return (
    <div
      className={`${css.overlay} ${isOpen ? css.open : ''}`}
      onClick={handleClose}
    >
      <div
        className={`${css.menu} ${isOpen ? css.open : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Logo />
        <button className={css.close} onClick={handleClose}>
          <svg width="32" height="32">
            <use href="/sprite/symbol-defs.svg#icon-close-circle" />
          </svg>
        </button>

        <div className={css.nav}>
          <RecipesLink onClick={handleClose} />
          {isLoggedIn ? (
            <>
              <MyProfileLink onClick={handleClose} />
              <UserMenu onClick={handleClose} />
              <AddRecipeLink onClick={handleClose} />
            </>
          ) : (
            <AuthNav onClick={handleClose} />
          )}
        </div>
      </div>
    </div>
  );
}
