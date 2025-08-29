import { useDispatch, useSelector } from 'react-redux';
import AuthNav from '../AuthNav/AuthNav.jsx';
import Logo from '../Logo/Logo.jsx';
import UserMenu from '../UserMenu/UserMenu.jsx';
import css from './Header.module.css';
import { selectIsLoggedIn } from '../../redux/auth/selectors.js';
import ModalMobileNav from '../ModalMobileNav/ModalMobileNav.jsx';
import { openBurger } from '../../redux/modal/burgerSlice.js';
import { selectBurgerOpen } from '../../redux/modal/selectors.js';
import RecipesLink from '../RecipesLink/RecipesLink.jsx';
import MyProfileLink from '../MyProfileLink/MyProfileLink.jsx';
import AddRecipeLink from '../AddRecipeLink/AddRecipeLink.jsx';

export default function Header() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();
  const isOpen = useSelector(selectBurgerOpen);

  return (
    <header className={css.container}>
      <Logo />
      <div className={css.nav}>
        <RecipesLink />
        {isLoggedIn ? (
          <>
            <MyProfileLink />
            <AddRecipeLink />
            <UserMenu />
          </>
        ) : (
          <AuthNav />
        )}
      </div>

      <div className={css.burger} onClick={() => dispatch(openBurger())}>
        <svg width="32" height="32" style={{ color: '#fff' }}>
          <use href="/sprite/symbol-defs.svg#icon-burger-menu" />
        </svg>
      </div>

      <ModalMobileNav isOpen={isOpen} />
    </header>
  );
}
